"""Expressive German TTS with Chatterbox Multilingual (MIT, local CPU). Run with /home/user/tools/tts2-venv/bin/python.
A voice = a short reference clip. References come from CC0 Piper voices (pipeline/tts.py) or, later, consented own recordings.
Batch mode records up to TAKES takes per line and keeps the one Whisper hears best (asr_check.match), trimmed to the spoken words:
Chatterbox sometimes appends invented words or seconds of noise after the line.
Usage: tts2.py say REF.wav "Text" OUT.wav [exaggeration] [cfg_weight]   |   tts2.py batch jobs.json (used by build.py)"""
import json, os, re, sys, time
from pathlib import Path

os.environ.setdefault("TQDM_DISABLE", "1")  # no per-token progress bars in the logs
import soundfile as sf
import torch

import asr_check

CKPT = Path(os.environ.get("TOOLS_DIR", "/home/user/tools")) / "models" / "chatterbox"
torch.set_num_threads(os.cpu_count() or 4)
_model = None


def model():
    global _model
    if _model is None:
        from chatterbox.mtl_tts import ChatterboxMultilingualTTS
        _model = ChatterboxMultilingualTTS.from_local(CKPT, device="cpu")
    return _model


def say(text, ref, out, exaggeration=0.5, cfg_weight=0.5, seed=0):
    torch.manual_seed(seed)  # sampling is stochastic; a fixed seed keeps re-renders identical
    m = model()
    with torch.no_grad():
        wav = m.generate(text, language_id="de", audio_prompt_path=str(ref), exaggeration=exaggeration, cfg_weight=cfg_weight)
    sf.write(str(out), wav.squeeze(0).numpy(), m.sr, subtype="PCM_16")  # 16-bit PCM: readable by the stdlib wave module
    return out


if __name__ == "__main__" and sys.argv[1] == "say":
    t = time.time()
    ex = float(sys.argv[5]) if len(sys.argv) > 5 else 0.5
    cfg = float(sys.argv[6]) if len(sys.argv) > 6 else 0.5
    say(sys.argv[3], sys.argv[2], sys.argv[4], ex, cfg)
    print(f"{sys.argv[4]}: {sf.info(sys.argv[4]).duration:.2f}s audio in {time.time() - t:.0f}s")


TAKES = 4   # takes per line at most (a line may ask for more: "takes")
PACE = 3.8  # target syllables/s (calm, dramatic German); a take within +-1 of it that Whisper hears clearly ends the search


def best_take(j):
    takes, syl = [], len(re.findall(r"[aeiouäöüy]+", j["text"].lower()))  # vowel groups ~ German syllables
    for k in range(j.get("takes", TAKES)):
        path = f"{j['out']}.take{k}.wav"
        say(j["text"], j["ref"], path, j["exaggeration"], j["cfg_weight"], j["seed"] + k)
        sim, start, end = asr_check.match(j["text"], asr_check.hear(path))
        takes.append({"k": k, "sim": sim, "start": start, "end": end, "rate": syl / max(end - start, 0.1), "path": path})
        print(f"  take {k}: similarity {sim:.2f}, {takes[-1]['rate']:.1f} syl/s, speech {start:.2f}-{end:.2f}s", flush=True)
        if sim >= 0.95 and abs(takes[-1]["rate"] - PACE) <= 1.0:
            break
    best = max(takes, key=lambda t: (round(t["sim"], 1), -abs(t["rate"] - PACE)))  # clarity first (0.1 steps = ASR noise), then pace
    a, sr = sf.read(best["path"], dtype="float32")
    a = a[: int((best["end"] + 0.25) * sr)]  # leading silence is trimmed later by build.py's FX chain
    fade = min(len(a), int(0.08 * sr))
    a[len(a) - fade:] *= torch.linspace(1, 0, fade).numpy()  # no click where babble was cut
    sf.write(j["out"], a, sr, subtype="PCM_16")
    for t in takes:
        os.remove(t["path"])
    return best


if __name__ == "__main__" and sys.argv[1] == "batch":
    for j in json.loads(Path(sys.argv[2]).read_text()):
        if Path(j["out"]).exists():
            continue
        t = time.time()
        b = best_take(j)
        print(f"chatterbox {time.time() - t:4.0f}s  take {b['k']} (similarity {b['sim']:.2f}, {b['rate']:.1f} syl/s)  {j['text']}", flush=True)
