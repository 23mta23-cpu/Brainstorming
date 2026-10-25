"""Intelligibility QC without ears: transcribe every voiced line (faster-whisper small, MIT, CPU int8) and compare with the script.
tts2.py uses hear()/match() to pick the best of several takes and trim it to the spoken words.
Usage: /home/user/tools/tts2-venv/bin/python pipeline/asr_check.py series/echo-archiv/episodes/E001  -> build/asr.json, exit 1 if a line fails"""
import difflib, json, os, re, sys
from pathlib import Path

import soundfile as sf
import torch
import torchaudio
from faster_whisper import WhisperModel

MODEL = Path(os.environ.get("TOOLS_DIR", "/home/user/tools")) / "models" / "whisper-small"
MIN_SIMILARITY = 0.8  # letter-level; below this a human must listen before release
MAX_TAIL = 0.6        # seconds of audio after the last recognised word; more = babble or dead air
_asr = None


NUM = dict(zip("0123456789", "null eins zwei drei vier fünf sechs sieben acht neun".split()))


def key(t):
    """Letters only, no spaces: Whisper often merges German words ("Noxprachregel") or writes numbers as digits."""
    return re.sub(r"[^a-zäöüß]", "", re.sub(r"\d", lambda m: NUM[m[0]], t.lower()))


def match(expected, words):
    """Best prefix of the recognised words for the script line -> (similarity, start, end). Babble after the line is cut off."""
    best = (0.0, 0.0, 0.0)
    for k in range(1, len(words) + 1):
        sim = difflib.SequenceMatcher(None, key(expected), key("".join(w.word for w in words[:k]))).ratio()
        best = max(best, (sim, words[0].start, words[k - 1].end))
    return best


def hear(path):
    """-> recognised words with start/end seconds. Audio goes in as an array: faster-whisper's file decoder breaks on the installed PyAV."""
    global _asr
    if _asr is None:
        _asr = WhisperModel(str(MODEL), device="cpu", compute_type="int8")
    a, sr = sf.read(str(path), dtype="float32", always_2d=True)
    x = torchaudio.functional.resample(torch.from_numpy(a.mean(axis=1)), sr, 16000).numpy()
    segs, _ = _asr.transcribe(x, language="de", beam_size=5, word_timestamps=True)
    return [w for s in segs for w in s.words]


def main(epdir):
    tl = json.loads((Path(epdir) / "build" / "timeline.json").read_text())
    rows, bad = [], 0
    for l in tl["lines"]:
        words = hear(l["wav"])
        heard = "".join(w.word for w in words).strip()
        sim, start, end = match(l.get("say", l["text"]), words)
        tail = sf.info(l["wav"]).duration - end
        fail = sim < MIN_SIMILARITY or tail > MAX_TAIL
        bad += fail
        rows.append({"shot": l["shot"], "who": l["who"], "expected": l.get("say", l["text"]), "heard": heard, "similarity": round(sim, 2),
                     "speech": [round(start, 2), round(end, 2)], "tail": round(tail, 2)})
        print(f"{'FAIL' if fail else 'OK  '} {sim:.2f} tail {tail:4.2f}s {l['shot']:4} {l['who']:9} „{l.get('say', l['text'])}“ → „{heard}“", flush=True)
    (Path(epdir) / "build" / "asr.json").write_text(json.dumps(rows, ensure_ascii=False, indent=1))
    print(f"{len(rows) - bad}/{len(rows)} lines ok (similarity >= {MIN_SIMILARITY}, tail <= {MAX_TAIL}s)")
    return 1 if bad else 0


def selftest():
    from types import SimpleNamespace as W
    words = [W(word=" Noxprachregel", start=0.0, end=0.9), W(word=" 8.", start=1.0, end=1.3), W(word=" Gochdok", start=1.6, end=2.2)]
    sim, _, end = match("Nox brach Regel acht.", words)
    assert sim > 0.9 and end == 1.3, (sim, end)  # merged words + digit accepted, babble cut
    assert match("Wer bist du?", []) == (0.0, 0.0, 0.0)
    print("selftest ok")


if __name__ == "__main__":
    sys.exit(selftest() if sys.argv[1] == "--selftest" else main(sys.argv[1]))
