"""episode.json (v3) -> keyframe jobs for gen.py, then runs gen.py in the image venv.
Each shot lists kf entries; "refs" name locked character references (look.refs), "edit_of" chains an edit on an earlier keyframe.
Usage: python3 pipeline/keyframes.py series/echo-archiv/episodes/E001 [kf_id ...]  (resumable; existing images are skipped)"""
import json, subprocess, sys
from pathlib import Path

HERE = Path(__file__).parent
GEN_PY = "/home/user/tools/gen-venv/bin/python"
STYLE = Path(HERE.parent / "series/echo-archiv/look/STYLE.txt")
LOCKED = {"nox", "mira", "lina", "pip"}  # reference ids that make up the character lock


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
            jobs.append({"id": k["id"], "prompt": k["prompt"], "out": f"kf/{k['id']}.png", "w": k.get("w", look["w"]), "h": k.get("h", look["h"]),
                         "seed": k.get("seed", 0), "refs": refs})
    return jobs


def pending_refs(epdir):
    """Locked reference images that are missing (e.g. after a redesign) are generated first, in the same model load."""
    look = epdir / "../../look"
    spec = json.loads((look / "jobs_refs.json").read_text())
    return [{**j, "out": f"../../look/{j['out']}", "refs": [f"../../look/{r}" for r in j.get("refs", [])]}
            for j in spec["jobs"] if j["out"].startswith("refs/") and not (look / j["out"]).exists() and j["id"] in LOCKED]


def main(epdir, only):
    epdir = Path(epdir)
    spec = {"style": STYLE.read_text().strip(), "jobs": pending_refs(epdir) + jobs_for(epdir)}
    (epdir / "keyframes.json").write_text(json.dumps(spec, ensure_ascii=False, indent=1))
    subprocess.run([GEN_PY, str(HERE / "gen.py"), str(epdir / "keyframes.json"), *only], check=True)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2:])
