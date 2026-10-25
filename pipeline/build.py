"""episode.json -> final.mp4 (+ timeline.json, mix.wav, qc.json).
Usage: /home/user/tools/piper-venv/bin/python pipeline/build.py series/echo-archiv/episodes/E001 [--skip-render]"""
import hashlib, json, subprocess, sys, wave
from pathlib import Path
import numpy as np
import sfx, tts

HERE = Path(__file__).parent
SR = sfx.SR
TRIM = "silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse,"
FX = {  # ffmpeg filters per voice effect; every voice ends trimmed, 48 kHz mono. {sr} = model sample rate
    None: TRIM + "aresample=48000",
    "narrator": TRIM + "asetrate={sr}*0.92,aresample=48000,atempo=1.087,aecho=0.8:0.5:45|90:0.18|0.1",
    "child_echo": TRIM + "asetrate={sr}*1.26,aresample=48000,atempo=0.794,aecho=0.8:0.6:70|160:0.3|0.15",
}


# master bus: glue compression, brickwall limiter so transients don't block loudnorm, then TikTok-ish -14 LUFS
MASTER = "acompressor=threshold=-24dB:ratio=4:attack=3:release=120:makeup=3,alimiter=limit=0.4:attack=2:release=50,loudnorm=I=-14:TP=-2.0:LRA=8"  # TP margin for AAC overshoot


def run(*cmd):
    subprocess.run(cmd, check=True, capture_output=True)


def load48(path):
    a, sr = tts.read_wav(path)
    assert sr == SR, (path, sr)
    return a


def voice_line(line, cast, cache):
    c = cast[line["who"]]
    key = hashlib.sha1(json.dumps([line["text"], c], sort_keys=True).encode()).hexdigest()[:12]
    raw, out = cache / f"{key}.raw.wav", cache / f"{key}.wav"
    if not out.exists():
        tts.synth(line["text"], raw, c["model"], c.get("speaker"), c.get("length_scale", 1.0))
        run("ffmpeg", "-y", "-loglevel", "error", "-i", str(raw), "-af", FX[c.get("fx")].format(sr=tts.read_wav(raw)[1]), "-ac", "1", str(out))
    return load48(out)


def envelope(a, fps):
    hop = SR // fps
    rms = np.array([np.sqrt((a[i:i + hop] ** 2).mean()) for i in range(0, len(a), hop)])
    rms = np.convolve(rms, [0.25, 0.5, 0.25], "same")
    return np.round(np.clip(rms / (np.percentile(rms, 95) + 1e-6), 0, 1), 2).tolist()


def build_timeline(ep, cache):
    fps, t, shots, lines, audio = ep["format"]["fps"], 0.0, [], [], {}
    for s in ep["shots"]:
        dur = s["min"]
        if "line" in s:
            ln = s["line"]
            a = voice_line(ln, ep["cast"], cache)
            ld = len(a) / SR
            dur = max(dur, ln.get("pre", 0.2) + ld + ln.get("post", 0.25))
            start = t + ln.get("pre", 0.2)
            lines.append({"shot": s["id"], "who": ln["who"], "text": ln["text"], "start": round(start, 3),
                          "end": round(start + ld, 3), "env": envelope(a, fps)})
            audio[len(lines) - 1] = a
        shots.append({"id": s["id"], "start": round(t, 3), "end": round(t + dur, 3), "sfx": s.get("sfx", []),
                      "text": s.get("onscreen_text")})
        t += dur
    return {"fps": fps, "duration": round(t, 3), "shots": shots, "lines": lines}, audio


def place(buf, x, at, gain=1.0):
    i = int(at * SR)
    if i >= len(buf): return
    x = x[: len(buf) - i]
    buf[i:i + len(x)] += x * gain


def mix(tl, voices):
    n = int((tl["duration"] + 0.5) * SR)
    bed, fx, vo = np.zeros(n), np.zeros(n), np.zeros(n)
    mute = []
    for s in tl["shots"]:
        d = s["end"] - s["start"]
        for name, off in s["sfx"]:
            at = s["start"] + off
            if name == "drone":
                place(bed, sfx.drone(tl["duration"] - at), at)
            elif name == "silence":
                mute.append((s["start"], s["end"] + off))
            else:
                x = {"alarm": lambda: sfx.alarm(d), "whoosh_short": lambda: sfx.whoosh(0.5),
                     "whoosh_down": lambda: sfx.whoosh(0.9, up=False), "metal": sfx.metal_echo,
                     "tick": lambda: sfx.tick(int(d / 0.5) + 1), "heart": lambda: sfx.heartbeat(3),
                     "shimmer": lambda: sfx.shimmer(d), "logo": sfx.echo_logo}[name]()
                place(fx, x, at, 0.7)
    for i, a in voices.items():
        place(vo, a, tl["lines"][i]["start"])
    g = np.ones(n)  # "Ton bricht ab": hard gate on bed + fx, short release back in
    for a, b in mute:
        ia, ib = int(a * SR), int(b * SR)
        g[ia:ib] = 0.0
        r = min(int(0.4 * SR), n - ib)
        g[ib:ib + r] = np.linspace(0, 1, r)
    # duck bed + fx ~10 dB under dialogue so speech stays intelligible on phone speakers
    ve = np.convolve(np.abs(vo), np.ones(SR // 20) / (SR // 20), "same")
    duck = 1 - 0.68 * np.clip(ve / (np.percentile(ve[ve > 1e-4], 50) + 1e-9), 0, 1)
    duck = np.convolve(duck, np.ones(SR // 10) / (SR // 10), "same")
    amb = (bed * 0.45 + fx) * g * duck
    va = vo[np.abs(vo) > 0.01]
    print(f"speech/ambience RMS ratio: {20 * np.log10(np.sqrt((va ** 2).mean()) / (np.sqrt((amb ** 2).mean()) + 1e-9)):.1f} dB")
    out = amb + vo
    return out / max(1.0, np.abs(out).max() / 0.95)


def write_wav(path, a):
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(a, -1, 1) * 32767).astype(np.int16).tobytes())


def main(epdir, skip_render=False, reuse_video=False):
    epdir = Path(epdir)
    ep = json.load(open(epdir / "episode.json"))
    work = epdir / "build"; cache = work / "tts"; cache.mkdir(parents=True, exist_ok=True)
    tl, voices = build_timeline(ep, cache)
    lo, hi = ep["format"]["target_seconds"]
    print(f"duration {tl['duration']:.2f}s (target {lo}-{hi}), {len(tl['shots'])} shots, {len(tl['lines'])} lines")
    json.dump(tl, open(work / "timeline.json", "w"))
    write_wav(work / "mix.wav", mix(tl, voices))
    if skip_render: return
    f = ep["format"]
    if not (reuse_video and (work / "video.mp4").exists()):
        run("node", str(HERE / "render.mjs"), str(epdir / "scene.html"), str(work / "timeline.json"),
            str(work / "video.mp4"), str(f["fps"]), str(f["width"]), str(f["height"]))
    final = epdir / "final" / f"{ep['episode_id']}_{ep['title'].replace(' ', '_')}.mp4"
    final.parent.mkdir(exist_ok=True)
    run("ffmpeg", "-y", "-loglevel", "error", "-i", str(work / "video.mp4"), "-i", str(work / "mix.wav"),
        "-af", MASTER, "-ar", "48000", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
        "-movflags", "+faststart", "-metadata", f"title={ep['series']} – {ep['title']}",
        "-metadata", "comment=AI-generated fictional series (KI-generierte fiktionale Serie)", "-shortest", str(final))
    print("final:", final)
    subprocess.run([sys.executable, str(HERE / "qc.py"), str(final), str(work / "timeline.json")], check=False)


if __name__ == "__main__":
    main(sys.argv[1], "--skip-render" in sys.argv, "--reuse-video" in sys.argv)
