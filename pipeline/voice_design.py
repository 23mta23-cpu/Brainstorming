"""Design character voices from text descriptions with Qwen3-TTS VoiceDesign (Apache-2.0, local CPU) — no real person is cloned.
Run inside the sandbox (no credentials, offline):
  scripts/sandbox-run.sh /home/user/tools/qwen-venv/bin/python pipeline/voice_design.py series/echo-archiv/voices/casting.json
casting.json: {"candidates": [{"id": "nox_a", "role": "nox", "instruct": "...", "text": "..."}]} -> voices/casting/<id>.wav (skips existing)."""
import json, os, sys, time
from pathlib import Path

os.environ["HF_HUB_OFFLINE"] = "1"
import soundfile as sf
import torch
from qwen_tts import Qwen3TTSModel

MODEL = Path(os.environ.get("TOOLS_DIR", "/home/user/tools")) / "models" / "qwen3-tts-voicedesign"
torch.set_num_threads(os.cpu_count() or 4)

spec = Path(sys.argv[1])
out = spec.parent / "casting"
out.mkdir(exist_ok=True)
todo = [c for c in json.loads(spec.read_text())["candidates"] if not (out / f"{c['id']}.wav").exists()]
if todo:
    t = time.time()
    model = Qwen3TTSModel.from_pretrained(str(MODEL), device_map="cpu", dtype=torch.bfloat16, attn_implementation="sdpa")
    print(f"loaded in {time.time() - t:.0f}s", flush=True)
for c in todo:
    t = time.time()
    torch.manual_seed(c.get("seed", 0))
    with torch.no_grad():
        wavs, sr = model.generate_voice_design(text=c["text"], language="German", instruct=c["instruct"])
    sf.write(out / f"{c['id']}.wav", wavs[0], sr, subtype="PCM_16")
    print(f"{c['id']}: {len(wavs[0]) / sr:.1f}s audio in {time.time() - t:.0f}s", flush=True)
