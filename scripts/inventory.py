"""Static inventory of vendored repos. Read-only; never executes repo code.
Usage: python3 -I scripts/inventory.py /home/user/vendor > docs/inventory.json"""
import json, os, re, subprocess, sys
from pathlib import Path

LIC_HINTS = [("AGPL", r"GNU AFFERO"), ("GPL-3.0", r"GNU GENERAL PUBLIC LICENSE\s+Version 3"),
             ("Apache-2.0", r"Apache License"), ("MIT", r"\bMIT License|Permission is hereby granted, free of charge"),
             ("BSD", r"Redistribution and use in source and binary forms"), ("PolyForm", r"PolyForm"),
             ("Elastic", r"Elastic License"), ("BUSL", r"Business Source License"), ("CC", r"Creative Commons")]
RISKY = {"curl|sh": r"curl[^\n|]*\|\s*(ba)?sh", "wget|sh": r"wget[^\n|]*\|\s*(ba)?sh",
         "npx -y": r"npx\s+-y", "postinstall": r'"postinstall"\s*:', "eval(": r"\beval\(",
         "sudo": r"\bsudo\b", "rm -rf ~|/": r"rm\s+-rf\s+(~|/[a-z]*\s|\$HOME)"}

def sh(*a, cwd):
    return subprocess.run(a, cwd=cwd, capture_output=True, text=True).stdout.strip()

def license_of(d):
    for f in sorted(d.glob("LICEN[CS]E*")) + sorted(d.glob("COPYING*")):
        t = f.read_text(errors="ignore")[:4000]
        for name, pat in LIC_HINTS:
            if re.search(pat, t, re.I): return f"{name} ({f.name})"
        return f"unknown ({f.name})"
    return "NONE"

def scan(d):
    files = sh("git", "ls-files", cwd=d).splitlines()
    hits = {k: [] for k in RISKY}
    for f in files:
        p = d / f
        if p.suffix.lower() in {".png",".jpg",".gif",".mp4",".webp",".woff",".woff2",".ico",".mp3",".wav",".lock",".svg",".pdf"} or not p.is_file() or p.stat().st_size > 400_000:
            continue
        try: t = p.read_text(errors="ignore")
        except Exception: continue
        for k, pat in RISKY.items():
            if len(hits[k]) < 3 and re.search(pat, t): hits[k].append(f)
    manif = [f for f in files if Path(f).name in {"package.json","pyproject.toml","Cargo.toml","requirements.txt","go.mod","setup.py","Dockerfile","docker-compose.yml"} and f.count("/") <= 1]
    return {
        "commit": sh("git", "rev-parse", "HEAD", cwd=d)[:12],
        "date": sh("git", "log", "-1", "--format=%cs", cwd=d),
        "files": len(files),
        "license": license_of(d),
        "manifests": manif[:8],
        "claude_plugin": [f for f in files if ".claude-plugin/" in f][:4],
        "skills": sum(1 for f in files if f.endswith("SKILL.md")),
        "agents_md": sum(1 for f in files if re.search(r"(^|/)agents/[^/]+\.md$", f)),
        "hooks": [f for f in files if re.search(r"hooks?(/|\.json$)", f)][:5],
        "mcp": [f for f in files if re.search(r"\.mcp\.json$|mcp[-_]?server", f, re.I)][:4],
        "install_scripts": [f for f in files if re.search(r"(^|/)(install|setup|bootstrap)[^/]*\.(sh|ps1|py|js)$", f, re.I)][:5],
        "risky_patterns": {k: v for k, v in hits.items() if v},
    }

root = Path(sys.argv[1])
print(json.dumps({d.name: scan(d) for d in sorted(root.iterdir()) if (d / ".git").exists()}, indent=1))
