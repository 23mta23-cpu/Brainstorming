"""Intelligibility QC without ears: transcribe every voiced line (faster-whisper small, MIT, CPU int8) and compare with the script.
Usage: /home/user/tools/tts2-venv/bin/python pipeline/asr_check.py series/echo-archiv/episodes/E001  -> build/asr.json, exit 1 if a line fails"""
import difflib, json, os, re, sys
from pathlib import Path

from faster_whisper import WhisperModel

MODEL = Path(os.environ.get("TOOLS_DIR", "/home/user/tools")) / "models" / "whisper-small"
MIN_SIMILARITY = 0.8  # word-level; below this a human must listen before release


def norm(t):
    return re.sub(r"[^a-zäöüß ]", "", t.lower().replace("-", " ")).split()


def main(epdir):
    tl = json.loads((Path(epdir) / "build" / "timeline.json").read_text())
    asr = WhisperModel(str(MODEL), device="cpu", compute_type="int8")
    rows, bad = [], 0
    for l in tl["lines"]:
        segs, _ = asr.transcribe(l["wav"], language="de", beam_size=5, vad_filter=False)
        heard = " ".join(s.text.strip() for s in segs)
        sim = difflib.SequenceMatcher(None, norm(l["text"]), norm(heard)).ratio()
        bad += sim < MIN_SIMILARITY
        rows.append({"shot": l["shot"], "who": l["who"], "expected": l["text"], "heard": heard, "similarity": round(sim, 2)})
        print(f"{'OK  ' if sim >= MIN_SIMILARITY else 'FAIL'} {sim:.2f} {l['shot']:4} {l['who']:9} „{l['text']}“ → „{heard}“", flush=True)
    (Path(epdir) / "build" / "asr.json").write_text(json.dumps(rows, ensure_ascii=False, indent=1))
    print(f"{len(rows) - bad}/{len(rows)} lines intelligible (word similarity >= {MIN_SIMILARITY})")
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1]))
