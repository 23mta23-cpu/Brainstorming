"""Summarize SkillSpector JSON reports (.json or .json.gz). Usage: python3 -I scripts/scan_summary.py security/skillspector/*.json.gz"""
import gzip, json, sys, collections

for f in sys.argv[1:]:
    d = json.load(gzip.open(f) if f.endswith(".gz") else open(f))
    rules, sev = collections.Counter(), collections.Counter()
    worst = []
    for s in d.get("skills", []):
        for i in s.get("issues", []):
            rules[i.get("rule_id") or i.get("id") or i.get("type", "?")] += 1
            sev[i.get("severity", "?")] += 1
        worst.append((s.get("risk_score", 0), s.get("name") or s.get("path"), s.get("risk_severity")))
    worst.sort(key=lambda w: w[0] or 0, reverse=True)
    cov = d.get("analysis_completeness", {}).get("coverage_percent")
    print(f"{f.split('/')[-1]}: scanned={d.get('skills_scanned')}/{d.get('skill_count')} omitted={d.get('skills_omitted')} "
          f"max={d.get('max_risk_score')} {d.get('risk_severity')} rec={d.get('risk_recommendation')} cov={cov}%")
    print(f"   sev={dict(sev)} rules={rules.most_common(6)}")
    print(f"   worst={worst[:3]}")
