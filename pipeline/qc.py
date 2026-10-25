"""Objective QC for a rendered episode. Subjective quality (acting, voice, humour) stays a human gate.
Usage: python3 pipeline/qc.py final.mp4 timeline.json   -> prints table, writes qc.json next to the video, exit 1 on FAIL"""
import json, re, subprocess, sys
from fractions import Fraction
from pathlib import Path


def sh(*a):
    return subprocess.run(a, capture_output=True, text=True)


def probe(path):
    j = json.loads(sh("ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", path).stdout)
    v = next(s for s in j["streams"] if s["codec_type"] == "video")
    a = next((s for s in j["streams"] if s["codec_type"] == "audio"), None)
    return j["format"], v, a


def loudness(path):
    err = sh("ffmpeg", "-nostats", "-i", path, "-af", "ebur128=peak=true", "-f", "null", "-").stderr
    tail = err[err.rfind("Summary:"):]
    i = float(re.search(r"I:\s+(-?[\d.]+) LUFS", tail).group(1))
    tp = float(re.search(r"Peak:\s+(-?[\d.]+) dBFS", tail).group(1))
    return i, tp


def black_segments(path):
    err = sh("ffmpeg", "-i", path, "-vf", "blackdetect=d=0.4:pix_th=0.06", "-an", "-f", "null", "-").stderr
    return [(float(a), float(b)) for a, b in re.findall(r"black_start:([\d.]+) black_end:([\d.]+)", err)]


def silences(path):
    err = sh("ffmpeg", "-i", path, "-af", "silencedetect=n=-45dB:d=0.6", "-vn", "-f", "null", "-").stderr
    starts = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", err)]
    ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", err)]
    return list(zip(starts, ends))


def main(video, tlpath):
    tl = json.load(open(tlpath))
    fmt, v, a = probe(video)
    dur = float(fmt["duration"])
    fps = float(Fraction(v["r_frame_rate"]))
    checks = []
    ok = lambda name, cond, detail: checks.append({"check": name, "pass": bool(cond), "detail": detail})
    ok("resolution 1080x1920", (v["width"], v["height"]) == (1080, 1920), f"{v['width']}x{v['height']}")
    ok("fps 30", abs(fps - 30) < 0.01, f"{fps:.2f}")
    ok("codec h264/yuv420p", v["codec_name"] == "h264" and v["pix_fmt"] == "yuv420p", f"{v['codec_name']}/{v['pix_fmt']}")
    ok("audio aac 48k", a and a["codec_name"] == "aac" and a["sample_rate"] == "48000", a and f"{a['codec_name']}/{a['sample_rate']}")
    ok("duration matches timeline", abs(dur - tl["duration"]) < 0.25, f"{dur:.2f}s vs {tl['duration']:.2f}s")
    ok("duration 25-60s (discovery)", 25 <= dur <= 60, f"{dur:.2f}s")
    i, tp = loudness(video)
    ok("loudness -14 LUFS ±1.5", abs(i + 14) <= 1.5, f"{i} LUFS")
    ok("true peak <= -1 dBTP", tp <= -1.0, f"{tp} dBFS")
    last = tl["shots"][-1]
    planned_black = [(s["start"], s["end"]) for s in tl["shots"] if s is last or s["id"] == "S13"]  # fade-out + end card
    blacks = [b for b in black_segments(video) if not any(b[0] >= p[0] - 0.5 and b[1] <= p[1] + 0.5 for p in planned_black)]
    ok("no unplanned black >0.4s", not blacks, str(blacks))
    first_line = tl["lines"][0]["start"] if tl["lines"] else 99
    ok("hook: first spoken word <= 0.5s", first_line <= 0.5, f"{first_line:.2f}s")
    hook_end = tl["lines"][0]["end"] if tl["lines"] else 99
    ok("hook: first line complete <= 1.8s", hook_end <= 1.8, f"{hook_end:.2f}s")
    cuts = [(s["start"], s["end"] + 1.5) for s in tl["shots"] if any(n == "silence" for n, _ in s["sfx"])]
    gaps = [g for g in silences(video) if g[0] > 0.3 and g[1] < dur - 0.3
            and not any(g[0] >= c[0] - 0.1 and g[1] <= c[1] for c in cuts)]
    ok("no dead air >0.6s (outside planned cut)", not gaps, str(gaps))
    sizes = Path(video).stat().st_size / 1e6
    ok("file size < 287MB (TikTok upload)", sizes < 287, f"{sizes:.1f} MB")
    meta = fmt.get("tags", {}).get("comment", "")
    ok("AI disclosure metadata", "AI-generated" in meta, meta)
    ok("captions present for every line", all(l["text"] for l in tl["lines"]), f"{len(tl['lines'])} lines")
    res = {"video": str(video), "pass": all(c["pass"] for c in checks), "checks": checks}
    Path(video).with_suffix(".qc.json").write_text(json.dumps(res, indent=1, ensure_ascii=False))
    for c in checks: print(("PASS " if c["pass"] else "FAIL ") + f"{c['check']:42} {c['detail']}")
    print("OVERALL:", "PASS" if res["pass"] else "FAIL")
    return 0 if res["pass"] else 1


if __name__ == "__main__":
    sys.exit(main(sys.argv[1], sys.argv[2]))
