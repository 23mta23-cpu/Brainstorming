"""German TTS with Qwen3-TTS Base voice cloning (Apache-2.0, local CPU). Third-party model code: run inside the sandbox (offline):
  scripts/sandbox-run.sh /home/user/tools/qwen-venv/bin/python pipeline/tts_qwen.py jobs.json   (build.py does this)
A voice = a designed reference clip (voices/casting/*.wav from pipeline/voice_design.py, no real person) + its transcript.
Per job, all takes are sampled in one batch and written as <out>.take<k>.wav; `tts2.py pick` keeps the one Whisper hears best."""
import json, os, sys, time
from pathlib import Path

os.environ["HF_HUB_OFFLINE"] = "1"
import soundfile as sf
import torch
from qwen_tts import Qwen3TTSModel

MODEL = Path(os.environ.get("TOOLS_DIR", "/home/user/tools")) / "models" / "qwen3-tts-base"
torch.set_num_threads(os.cpu_count() or 4)

jobs = [j for j in json.loads(Path(sys.argv[1]).read_text()) if not Path(j["out"]).exists() and not Path(j["out"] + ".take0.wav").exists()]
if jobs:
    t = time.time()
    model = Qwen3TTSModel.from_pretrained(str(MODEL), device_map="cpu", dtype=torch.bfloat16, attn_implementation="sdpa")
    print(f"qwen loaded in {time.time() - t:.0f}s", flush=True)
prompts = {}
for j in jobs:
    if j["ref"] not in prompts:  # ICL prompt: reference speech codes + transcript + speaker embedding, built once per voice
        prompts[j["ref"]] = model.create_voice_clone_prompt(ref_audio=j["ref"], ref_text=j["ref_text"])
    t, n = time.time(), j["takes"]
    torch.manual_seed(j["seed"])  # fixed seed: re-renders identical
    with torch.no_grad():
        wavs, sr = model.generate_voice_clone(text=[j["text"]] * n, language=["German"] * n, voice_clone_prompt=prompts[j["ref"]] * n)
    for k, w in enumerate(wavs):
        sf.write(f"{j['out']}.take{k}.wav", w, sr, subtype="PCM_16")
    print(f"qwen {time.time() - t:4.0f}s  {n} takes  {j['text']}", flush=True)
