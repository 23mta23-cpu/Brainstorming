"""Piper TTS wrapper (local, offline). Run with tools/piper-venv python.
Voices are CC0 (thorsten, kerstin) or CC-BY-4.0 (mls -> credit required)."""
import json, os, sys, wave
from pathlib import Path
import numpy as np
from piper import PiperVoice, SynthesisConfig

VOICE_DIR = Path(os.environ.get("TOOLS_DIR", "/home/user/tools")) / "piper-voices"  # same override as setup_tools.sh
_cache = {}

def voice(model):
    if model not in _cache:
        _cache[model] = PiperVoice.load(str(VOICE_DIR / f"{model}.onnx"))
    return _cache[model]

def synth(text, out, model, speaker=None, length_scale=1.0):
    v = voice(model)
    with wave.open(str(out), "wb") as w:
        v.synthesize_wav(text, w, syn_config=SynthesisConfig(speaker_id=speaker, length_scale=length_scale,
                                                             noise_scale=0.6, noise_w_scale=0.7))
    return out

def read_wav(path):
    with wave.open(str(path)) as w:
        a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
        return a, w.getframerate()

def median_f0(a, sr):
    # ponytail: autocorrelation pitch per 40ms frame; good enough to sort voices, not for prosody work
    f, hop = int(sr * 0.04), int(sr * 0.02)
    f0s = []
    for i in range(0, len(a) - f, hop):
        x = a[i:i + f] - a[i:i + f].mean()
        if np.sqrt((x ** 2).mean()) < 0.02: continue
        ac = np.correlate(x, x, "full")[f - 1:]
        lo, hi = int(sr / 400), int(sr / 70)
        lag = lo + int(np.argmax(ac[lo:hi]))
        if ac[lag] > 0.3 * ac[0]: f0s.append(sr / lag)
    return float(np.median(f0s)) if f0s else 0.0

if __name__ == "__main__":
    # probe: python tts.py probe OUTDIR  -> F0 table of every installed voice (multi-speaker models: every 6th speaker)
    out = Path(sys.argv[2]); out.mkdir(parents=True, exist_ok=True)
    text = "Im Archiv gibt es sieben Regeln. Warum weinst du?"
    rows = []
    for cfg_path in sorted(VOICE_DIR.glob("*.onnx.json")):
        m = cfg_path.name[: -len(".onnx.json")]
        speakers = list(json.load(open(cfg_path)).get("speaker_id_map", {}).items())[::6] or [(None, None)]
        for name, sid in speakers:
            p = synth(text, out / f"{m}_{name}.wav", m, sid)
            a, sr = read_wav(p); rows.append((median_f0(a, sr), f"{m}" + (f":{name}:{sid}" if name else "")))
    for f0, n in sorted(rows): print(f"{f0:6.1f} Hz  {n}")
