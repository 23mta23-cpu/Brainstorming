"""episode.json (v3) -> keyframe jobs for gen.py, then runs gen.py in the image venv.
Each shot lists kf entries; "refs" name locked character references (look.refs), "edit_of" chains an edit on an earlier keyframe.
Usage: python3 pipeline/keyframes.py series/echo-archiv/episodes/E001 [kf_id ...]  (resumable; existing images are skipped)"""
import json, subprocess, sys
from pathlib import Path

HERE = Path(__file__).parent
GEN_PY = "/home/user/tools/gen-venv/bin/python"
STYLE = Path(HERE.parent / "series/echo-archiv/look/STYLE.txt")


def jobs_for(epdir):
    ep = json.loads((epdir / "episode.json").read_text())
    look, jobs, seen = ep["look"], [], set()
    for s in ep["shots"]:
        for k in s.get("kf", []):
            refs = [look["refs"][r] for r in k.get("refs", [])]
            if "edit_of" in k:
                assert k["edit_of"] in seen, f"{k['id']}: edit_of {k['edit_of']} must come earlier"
                refs = [f"kf/{k['edit_of']}.png"]
            seen.add(k["id"])
            jobs.append({"id": k["id"], "prompt": k["prompt"], "out": f"kf/{k['id']}.png", "w": look["w"], "h": look["h"],
                         "seed": k.get("seed", 0), "refs": refs})
    return jobs


def main(epdir, only):
    epdir = Path(epdir)
    spec = {"style": STYLE.read_text().strip(), "jobs": jobs_for(epdir)}
    (epdir / "keyframes.json").write_text(json.dumps(spec, ensure_ascii=False, indent=1))
    subprocess.run([GEN_PY, str(HERE / "gen.py"), str(epdir / "keyframes.json"), *only], check=True)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2:])
