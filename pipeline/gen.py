"""Local image generation with FLUX.2 [klein] 4B (Apache-2.0) on CPU — bf16 runs on the Xeon's AMX units.
Two phases so it fits in 15 GB RAM: (1) text encoder -> cached prompt embeddings, (2) transformer + VAE -> images.
Resumable: jobs whose output exists are skipped (safe to re-run after a container restart or usage-limit pause).
Usage: /home/user/tools/gen-venv/bin/python pipeline/gen.py path/to/jobs.json [job_id ...]

jobs.json: {"style": "...appended to every prompt...",
            "jobs": [{"id": "nox_sheet", "prompt": "...", "out": "refs/nox.png", "w": 576, "h": 1024, "seed": 1,
                      "refs": ["refs/other.png"], "steps": 4}]}   # paths relative to jobs.json"""
import gc, hashlib, json, os, resource, sys, time
from pathlib import Path

import torch
from PIL import Image
from diffusers import Flux2KleinPipeline

MODEL = os.environ.get("KLEIN_DIR", "/home/user/tools/models/flux2-klein-4b")
torch.set_num_threads(os.cpu_count() or 4)


def prompt_of(job, style):
    return f"{job['prompt'].strip()} {style}".strip()


def key(text):
    return hashlib.sha1(text.encode()).hexdigest()[:16]


def main(jobfile, only):
    spec = json.loads(Path(jobfile).read_text())
    base, style = Path(jobfile).parent, spec.get("style", "")
    jobs = [j for j in spec["jobs"] if (not only or j["id"] in only) and not (base / j["out"]).exists()]
    if not jobs:
        print("nothing to do")
        return
    cache = base / ".emb"
    cache.mkdir(exist_ok=True)
    todo = sorted({prompt_of(j, style) for j in jobs if not (cache / f"{key(prompt_of(j, style))}.pt").exists()})
    if todo:  # phase 1: text encoder only (~8 GB)
        t = time.time()
        pipe = Flux2KleinPipeline.from_pretrained(MODEL, transformer=None, vae=None, torch_dtype=torch.bfloat16)
        with torch.no_grad():
            for p in todo:
                emb, _ = pipe.encode_prompt(p, device="cpu")
                torch.save(emb, cache / f"{key(p)}.pt")
        del pipe
        gc.collect()
        print(f"encoded {len(todo)} prompts in {time.time() - t:.0f}s", flush=True)
    # phase 2: transformer + VAE only (~8 GB)
    pipe = Flux2KleinPipeline.from_pretrained(MODEL, text_encoder=None, tokenizer=None, torch_dtype=torch.bfloat16)
    for j in jobs:
        emb = torch.load(cache / f"{key(prompt_of(j, style))}.pt")
        refs = [Image.open(base / r).convert("RGB") for r in j.get("refs", [])] or None
        t = time.time()
        with torch.no_grad():
            img = pipe(image=refs, prompt_embeds=emb, height=j.get("h", 1024), width=j.get("w", 576),
                       num_inference_steps=j.get("steps", 4), guidance_scale=1.0,
                       generator=torch.Generator().manual_seed(j.get("seed", 0))).images[0]
        out = base / j["out"]
        out.parent.mkdir(parents=True, exist_ok=True)
        img.save(out)
        print(f"{j['id']}: {time.time() - t:.0f}s -> {out}", flush=True)
    print(f"peak RSS {resource.getrusage(resource.RUSAGE_SELF).ru_maxrss / 1e6:.1f} GB", flush=True)


if __name__ == "__main__":
    main(sys.argv[1], set(sys.argv[2:]))
