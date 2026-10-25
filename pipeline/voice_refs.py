"""Builds the Chatterbox voice references from CC0 Piper voices (provenance: series/echo-archiv/voices/SOURCES.md).
Piper samples noise, so every run is a new take (and invalidates that voice's TTS cache): rebuild only the voices you name.
Usage: /home/user/tools/piper-venv/bin/python pipeline/voice_refs.py lina [mira ...]"""
import subprocess, sys
from pathlib import Path

import tts

TEXT = ("Im Archiv bewahren wir jede Entscheidung auf, die ein Leben verändert hat. Manche Echos sind harmlos. "
        "Andere können eine Entscheidung noch einmal geschehen lassen.")
OUT = Path(__file__).parent.parent / "series" / "echo-archiv" / "voices"
VOICES = {  # name: (Piper model, speaker, length_scale, pitch factor; tempo is compensated)
    "erzaehler": ("de_DE-thorsten_emotional-medium", 4, 1.0, 0.92),
    "nox": ("de_DE-thorsten-high", None, 1.0, 1.0),
    "mira": ("de_DE-kerstin-low", None, 1.0, 1.0),
    "lina": ("de_DE-kerstin-low", None, 1.3, 1.26),  # slow child voice: Chatterbox copies the reference's pace
}

for name in sys.argv[1:]:
    model, speaker, length_scale, pitch = VOICES[name]
    raw = OUT / f"{name}_ref.piper.wav"
    tts.synth(TEXT, raw, model, speaker, length_scale)
    sr = tts.read_wav(raw)[1]
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(raw), "-af",
                    f"asetrate={sr}*{pitch},aresample={sr},atempo={1 / pitch:.4f},aresample=24000", "-ac", "1",
                    str(OUT / f"{name}_ref.wav")], check=True)
    raw.unlink()
    print(name, "->", OUT / f"{name}_ref.wav")
