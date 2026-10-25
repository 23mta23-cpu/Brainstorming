# AI-First TikTok Studio

KI-gestütztes Entertainment-Studio (DACH zuerst, TikTok-only in Phase 1). Erste Serie: **Das Echo-Archiv** —
ein Mystery-Microdrama über einen jungen Archivar, der sehen kann, was bei einer anderen Entscheidung passiert wäre,
und dafür jedes Mal eine Erinnerung verliert.

## Stand
| Bereich | Status |
|---|---|
| 17 Repositories inventarisiert, statisch + SkillSpector geprüft | TESTED |
| Produktionspipeline (TTS → Timeline → Render → Mix → QC) | TESTED |
| Pilot E001 „Regel Acht" (31,7 s, 1080×1920) | TESTED — wartet auf menschliche Freigabe |
| Veröffentlichung | nicht autorisiert (manuell durch Co-CEO) |

## Schnellstart (frischer Container)
```bash
scripts/setup_tools.sh                                   # Tools + gepinnte Repos (~5 min)
/home/user/tools/piper-venv/bin/python pipeline/build.py series/echo-archiv/episodes/E001
python3 pipeline/shotlist.py series/echo-archiv/episodes/E001
```
Ergebnis: `series/echo-archiv/episodes/E001/final/E001_Regel_Acht.mp4` + `.qc.json`.

## Struktur
```
CLAUDE.md, NEXT_SESSION.md      Verfassung, Übergabe
docs/                           Strategie, Markt, Technik, Policy, Story-Register
pipeline/                       tts.py · sfx.py · render.mjs · build.py · qc.py · shotlist.py
series/echo-archiv/             characters/, world.js, episodes/E001/{episode.json, scene.html, SHOTLIST.md, LAUNCH.md, final/}
scripts/                        sandbox-run.sh · fetch_repos.sh · setup_tools.sh · inventory.py · scan_summary.py
security/                       SkillSpector-Rohberichte (gz), Testlogs
.claude/                        agents/ (story-reviewer, trend-scout) · skills/produce-episode
```

## Lizenzen der eigenen Assets
Alle Figuren, Hintergründe und Sounds sind in diesem Repo per Code erzeugt. Schriften: Caveat, Cinzel (SIL OFL, Lizenz in
`pipeline/assets/fonts/`), Inter (OFL, systemseitig). Stimmen: Piper-Modelle thorsten / thorsten_emotional / kerstin (Datensätze CC0);
die Piper-Software (piper1-gpl, GPL-3.0) wird nur als separates Werkzeug ausgeführt.
