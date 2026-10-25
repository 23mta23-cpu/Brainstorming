"""episode.json -> final.mp4 (+ timeline.json, mix.wav, qc.json).
Usage: /home/user/tools/piper-venv/bin/python pipeline/build.py series/echo-archiv/episodes/E001 [--skip-render] [--reuse-video]
v3 episodes (shots with "kf"/"plate_of") need plates first: pipeline/keyframes.py + pipeline/plates.py."""
import hashlib, json, re, subprocess, sys, wave
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
    "echo": TRIM + "aresample=48000,atempo=0.88,aecho=0.8:0.6:70|160:0.3|0.15",  # memory voice: slowed (pitch kept) + echo
}
TTS2_PY = "/home/user/tools/tts2-venv/bin/python"  # Chatterbox lives in its own venv (pinned deps)
SCENE_FX = {"motes", "alarm", "notches", "notches_red", "pin", "photo", "texts", "rays", "echo_pulse", "engraving", "glint", "flash", "snow", "dream", "memory_flow", "handwriting", "endcard"}


# master bus: glue compression, brickwall limiter so transients don't block loudnorm, then TikTok-ish -14 LUFS
MASTER = "acompressor=threshold=-24dB:ratio=4:attack=3:release=120:makeup=3,alimiter=limit=0.4:attack=2:release=50,loudnorm=I=-14:TP=-2.0:LRA=8"  # TP margin for AAC overshoot


SFX = {  # name -> maker(shot_duration); "drone" (bed) and "silence" (hard cut) are handled in mix()
    "alarm": lambda d: sfx.alarm(d), "whoosh_short": lambda d: sfx.whoosh(0.5),
    "whoosh_down": lambda d: sfx.whoosh(0.9, up=False), "metal": lambda d: sfx.metal_echo(),
    "tick": lambda d: sfx.tick(int(d / 0.5) + 1), "heart": lambda d: sfx.heartbeat(3),
    "shimmer": lambda d: sfx.shimmer(d), "logo": lambda d: sfx.echo_logo(),
}


def validate(ep):
    """Fail fast before TTS/render: required fields, cast, sfx names, AI disclosure."""
    errs = [f"missing field: {k}" for k in ("episode_id", "series", "title", "format", "cast", "shots", "hook", "micro_loop",
                                             "macro_loop", "cliffhanger") if k not in ep]
    for s in ep.get("shots", []):
        errs += [f"{s.get('id', '?')}: missing {k}" for k in ("id", "min", "fn", "emotion", "visual", "camera", "cut") if k not in s]
        errs += [f"{s['id']}: unknown sfx '{n}'" for n, _ in s.get("sfx", []) if n not in SFX and n not in ("drone", "silence")]
        errs += [f"{s['id']}: unknown scene fx '{n}'" for n in s.get("fx", []) if n not in SCENE_FX]
        ln = s.get("line")
        if ln and not {"who", "text"} <= ln.keys():
            errs.append(f"{s['id']}: line needs 'who' and 'text'")
        elif ln and ln.get("voice", ln["who"]) not in ep.get("cast", {}):
            errs.append(f"{s['id']}: no cast entry for '{ln.get('voice', ln['who'])}'")
    if ep.get("ai_disclosure") is not True:
        errs.append("ai_disclosure must be true (CONTENT_POLICY)")
    if errs:
        sys.exit("episode.json invalid:\n  " + "\n  ".join(errs))


def run(*cmd):
    subprocess.run(cmd, check=True, capture_output=True)


def load48(path):
    a, sr = tts.read_wav(path)
    assert sr == SR, (path, sr)
    return a


def voice_spec(line, ep, epdir, cache):
    """Voice config + cache paths for one line. The raw take is keyed by text, settings and reference audio bytes;
    the processed file also by the FX chain, so FX tweaks never re-run the TTS."""
    c = dict(ep["cast"][line.get("voice", line["who"])])  # per-line voice (e.g. whisper) and tempo overrides
    for k in ("length_scale", "takes", "pace"):
        if k in line:
            c[k] = line[k]
    if "ref" in c:
        c["ref"] = str((epdir / c["ref"]).resolve())
        c["ref_sha"] = hashlib.sha1(Path(c["ref"]).read_bytes()).hexdigest()
    raw = hashlib.sha1(json.dumps([line["text"], {k: v for k, v in c.items() if k != "fx"}], sort_keys=True).encode()).hexdigest()[:12]
    out = hashlib.sha1(json.dumps([raw, FX[c.get("fx")]]).encode()).hexdigest()[:12]
    return c, cache / f"{raw}.raw.wav", cache / f"{out}.wav"


def prerender_chatterbox(ep, epdir, cache):
    """All missing Chatterbox lines in one subprocess (the model loads once)."""
    jobs = []
    for s in ep["shots"]:
        if "line" in s:
            c, raw, out = voice_spec(s["line"], ep, epdir, cache)
            if c.get("engine") == "chatterbox" and not out.exists() and not raw.exists():
                jobs.append({"text": s["line"]["text"], "ref": c["ref"], "out": str(raw), "exaggeration": c.get("exaggeration", 0.5),
                             "cfg_weight": c.get("cfg_weight", 0.5), "seed": c.get("seed", 0), "takes": c.get("takes", 4),
                         "pace": c.get("pace", 3.8)})  # a hook line may ask for a brisker pace
    if jobs:
        (cache / "chatterbox_jobs.json").write_text(json.dumps(jobs, ensure_ascii=False))
        subprocess.run([TTS2_PY, str(HERE / "tts2.py"), "batch", str(cache / "chatterbox_jobs.json")], check=True)


def voice_line(line, ep, epdir, cache):
    c, raw, out = voice_spec(line, ep, epdir, cache)
    if not out.exists():
        if c.get("engine") != "chatterbox" and not raw.exists():  # Piper samples noise: keep the take once made
            tts.synth(line["text"], raw, c["model"], c.get("speaker"), c.get("length_scale", 1.0))
        run("ffmpeg", "-y", "-loglevel", "error", "-i", str(raw), "-af", FX[c.get("fx")].format(sr=tts.read_wav(raw)[1]), "-ac", "1", str(out))
    return load48(out)


def envelope(a, fps):
    hop = SR // fps
    rms = np.array([np.sqrt((a[i:i + hop] ** 2).mean()) for i in range(0, len(a), hop)])
    rms = np.convolve(rms, [0.25, 0.5, 0.25], "same")
    return np.round(np.clip(rms / (np.percentile(rms, 95) + 1e-6), 0, 1), 2).tolist()


def visuals(s, epdir, strict=True):
    """v3 shot -> plate URIs for the generic scene (plates/<kf>.jpg, mouth patches plates/<kf>.png)."""
    if "kf" not in s and "plate_of" not in s:
        return {}
    pl = lambda k, ext="jpg": (epdir / "plates" / f"{k}.{ext}").resolve()
    base = s.get("plate_of") or s["kf"][0]["id"]
    m = dict(s.get("motion", {}))
    for k in ("from", "to"):
        if k in m:
            m[k] = pl(m[k]).as_uri()
    missing = [p for p in [pl(base)] + [pl(v) for k, v in s.get("motion", {}).items() if k in ("from", "to")]
               + [pl(v) for v in s.get("fx_img", {}).values()] if not p.exists()]
    if missing and strict:
        sys.exit(f"{s['id']}: missing plates {[p.name for p in missing]} - run pipeline/keyframes.py and pipeline/plates.py first")
    talk = {who: pl(k, "png").as_uri() for who, k in s.get("talk", {}).items() if pl(k, "png").exists()}
    imgs = {n: pl(k).as_uri() for n, k in s.get("fx_img", {}).items()}  # e.g. the picture on a held photograph
    return {"plate": pl(base).as_uri(), "motion": m, "fx": s.get("fx", []), "fx_at": s.get("fx_at", {}), "fx_img": imgs,
            "fx_txt": s.get("fx_txt", []), "talk": talk}


def build_timeline(ep, epdir, cache, strict=True):
    fps, t, shots, lines, audio = ep["format"]["fps"], 0.0, [], [], {}
    for s in ep["shots"]:
        dur = s["min"]
        if "line" in s:
            ln = s["line"]
            a = voice_line(ln, ep, epdir, cache)
            ld = len(a) / SR
            sps = len(re.findall(r"[aeiouäöüy]+", ln["text"].lower())) / ld  # vowel groups ~ German syllables
            if sps > 5.5:  # calm dramatic delivery; conversational German is ~5-6
                print(f"  warn {s['id']}: {sps:.1f} syllables/s ('{ln['text']}') - raise length_scale")
            dur = max(dur, ln.get("pre", 0.2) + ld + ln.get("post", 0.25))
            start = t + ln.get("pre", 0.2)
            lines.append({"shot": s["id"], "who": ln["who"], "text": ln["text"], "start": round(start, 3),
                          "end": round(start + ld, 3), "env": envelope(a, fps), "wav": str(voice_spec(ln, ep, epdir, cache)[2])})
            audio[len(lines) - 1] = a
        shots.append({"id": s["id"], "start": round(t, 3), "end": round(t + dur, 3), "sfx": s.get("sfx", []),
                      "text": s.get("onscreen_text"), "cap_y": s.get("cap_y"), **visuals(s, epdir, strict)})  # cap_y: caption top, px
        t += dur
    return {"fps": fps, "duration": round(t, 3), "ep": {"num": int(ep["episode_id"][1:]), "title": ep["title"]},
            "shots": shots, "lines": lines}, audio


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
                place(fx, SFX[name](d), at, 0.7)
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
    voiced = ve[ve > 1e-4]  # dialogue-free episodes (e.g. silent shorts) skip ducking
    duck = 1 - 0.68 * np.clip(ve / (np.percentile(voiced, 50) + 1e-9), 0, 1) if voiced.size else np.ones(n)
    duck = np.convolve(duck, np.ones(SR // 10) / (SR // 10), "same")
    amb = (bed * 0.45 + fx) * g * duck
    va = vo[np.abs(vo) > 0.01]
    if va.size:
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
    validate(ep)
    work = epdir / "build"; cache = work / "tts"; cache.mkdir(parents=True, exist_ok=True)
    prerender_chatterbox(ep, epdir, cache)
    tl, voices = build_timeline(ep, epdir, cache, strict=not skip_render)  # audio-only runs may precede the plates
    lo, hi = ep["format"]["target_seconds"]
    print(f"duration {tl['duration']:.2f}s (target {lo}-{hi}), {len(tl['shots'])} shots, {len(tl['lines'])} lines")
    json.dump(tl, open(work / "timeline.json", "w"))
    write_wav(work / "mix.wav", mix(tl, voices))
    if skip_render: return
    f = ep["format"]
    if not (reuse_video and (work / "video.mp4").exists()):
        scene = epdir / "scene.html" if (epdir / "scene.html").exists() else epdir.parent.parent / "scene.html"  # v3: series-wide scene
        run("node", str(HERE / "render.mjs"), str(scene), str(work / "timeline.json"),
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
