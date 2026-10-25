"""Expressive German TTS with Chatterbox Multilingual (MIT, local CPU). Run with /home/user/tools/tts2-venv/bin/python.
A voice = a short reference clip. References come from CC0 Piper voices (pipeline/tts.py) or, later, consented own recordings.
Usage (test): tts2.py say REF.wav "Text" OUT.wav [exaggeration] [cfg_weight]"""
import os, sys, time
from pathlib import Path

import torch
import torchaudio

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
    torchaudio.save(str(out), wav, m.sr)
    return out


if __name__ == "__main__" and sys.argv[1] == "say":
    t = time.time()
    ex = float(sys.argv[5]) if len(sys.argv) > 5 else 0.5
    cfg = float(sys.argv[6]) if len(sys.argv) > 6 else 0.5
    say(sys.argv[3], sys.argv[2], sys.argv[4], ex, cfg)
    info = torchaudio.info(sys.argv[4])
    print(f"{sys.argv[4]}: {info.num_frames / info.sample_rate:.2f}s audio in {time.time() - t:.0f}s")
