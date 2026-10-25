# Repository-Matrix (Stand 2026-10-25)

Quelle: Shallow-Clones unter `/home/user/vendor` (reproduzierbar: `scripts/fetch_repos.sh`, exakte Commits).
Rohdaten: `docs/inventory.json` (Skript `scripts/inventory.py`), Scans: `security/skillspector/*.json.gz`.
Statuswerte: INVENTORIED / SECURITY_CHECKED / INSTALLED / INTEGRATED / TESTED / REFERENCE_ONLY / ISOLATED / BLOCKED / REJECTED.
„Wartung" = Datum des letzten Commits. Lizenz = erkannte LICENSE-Datei (keine Rechtsberatung).

## Übersicht

| # | Repo | Commit / Datum | Typ | Lizenz | Status | Entscheidung in einem Satz |
|---|---|---|---|---|---|---|
| 1 | yihui-dev/awesome-opus5-5-videos | 92aee2f · 2026-10-13 | Referenzsammlung (703 Prompts für Code-Animationen) | MIT (Repo); Prompts/Videos gehören den Creators | REFERENCE_ONLY | Technik-Bibliothek für genau unseren Render-Ansatz (Animation als Code); nichts kopieren. |
| 2 | wilwaldon/Claude-Code-Video-Toolkit | a6e9e52 · 2026-02-25 | Linkliste (1 Datei) | **keine Lizenz** | REFERENCE_ONLY | Nur lesen; ohne Lizenz keine Übernahme. |
| 3 | debpalash/VoiceStudio | 3e49030 · 2026-10-25 | Electron-Desktop-App + Python-TTS-Engines | AGPL-3.0 | ISOLATED (nicht installiert) | GUI-first, `curl \| sh`-Installer, Multi-GB-Modelle; Piper deckt MVP. Neu bewerten auf lokaler GPU-Maschine. |
| 4 | storytold/artcraft | 1f969a9 · 2026-10-23 | Rust/Tauri-Desktop-IDE für KI-Bild/Video | Apache-2.0 | REFERENCE_ONLY | Desktop + Provider-Konten nötig; Kandidat für menschliches Shot-Staging später. |
| 5 | Jakeschincariol/youtube-agent-skill | a2feb21 · 2026-09-16 | 11 Claude-Skills (YouTube) | MIT | SECURITY_CHECKED · REFERENCE_ONLY | Sauberster Scan (0 Funde); YouTube-spezifisch → Hook-/Retention-Methoden später in TikTok-Workflow übertragen. |
| 6 | DietrichGebert/ponytail | 09c434a · 2026-10-18 | Claude-Code-Plugin (Skills + SessionStart-Hook) | MIT | INTEGRATED (vorab per Account-Sync aktiv) · TESTED | Engineering-Disziplin „minimaler Code"; in dieser Sitzung im Einsatz. |
| 7 | rtk-ai/rtk | 32b2ec4 · 2026-10-23 | Rust-CLI, komprimiert Shell-Output | Apache-2.0 | TESTED (Binary), nicht INTEGRATED | −48 % (`git log`) / −56 % (`ls -la`) Output gemessen; Hook-Integration erst auf persistenter Maschine. |
| 8 | Graphify-Labs/graphify | 92741d1 · 2026-10-23 | Python-CLI, Wissensgraph über Code/Docs | Apache-2.0 | REFERENCE_ONLY (zurückgestellt) | Unser Code hat ~15 Dateien; Nutzen erst bei großer Codebasis. Docs/PDF-Analyse bräuchte LLM-Key. |
| 9 | ChrisCompton/omniroute | 515674b · **2026-04-10** | TS-AI-Gateway zu 60+ „free/low-cost"-Providern | MIT | REJECTED | 6 Monate ohne Commit (Fork); leitet Inhalte an Drittanbieter (Datenabfluss, ToS); keine weiteren Provider autorisiert. |
| 10 | affaan-m/ECC | 90606c8 · 2026-10-20 | Großes Plugin: 311 Skills (1062 inkl. Übersetzungen), 310 Agenten, Hooks, MCP | MIT | SECURITY_CHECKED (teilweise: 32/311 gescannt) · ISOLATED | Kontext-/Hook-Fußabdruck weit über Bedarf; überlappt mit Bordmitteln + Superpowers + Ponytail. Höchstens selektiv (`--profile minimal`) nach Vollscan. |
| 11 | obra/superpowers | 2ce8aa1 · 2026-10-21 | 15 Methodik-Skills + SessionStart-Hook | MIT | SECURITY_CHECKED · nicht installiert | Schlankster Methodik-Kandidat; Hook injiziert jede Sitzung Instruktionen (Token) und konkurriert mit Ponytail. Nr. 1, falls Engineering-Umfang wächst. |
| 12 | bytedance/deer-flow | 2b6716c · 2026-10-25 | Eigenständiger Super-Agent-Harness (LangGraph, Frontend, Sandbox) | MIT | REJECTED (als Orchestrator) · REFERENCE_ONLY | Würde Claude Code als Orchestrator duplizieren und eigene LLM-Keys/Infra brauchen. |
| 13 | thedotmack/claude-mem | a4469fd · 2026-10-24 | Memory-Plugin: Hooks + Bun-Worker + SQLite/Chroma, Kompression via Agent SDK | Apache-2.0 | REJECTED (jetzt) | Verbraucht zusätzliche Tokens für Zusammenfassungen; Hintergrunddienst; Cloud-Container flüchtig. Gedächtnis = versionierte Docs. |
| 14 | headroomlabs-ai/headroom | 3fef15d · 2026-10-24 | Kontext-Kompression (Lib/Proxy/MCP, `wrap claude`) | Apache-2.0 | ISOLATED (nicht installiert) | API-Traffic der verwalteten Cloud-Sitzung durch lokalen Proxy zu leiten ist riskant; Auto-Compaction + knappe Tool-Nutzung reichen derzeit. |
| 15 | rebelytics/one-skill-to-rule-them-all | ac00bed · 2026-10-23 | Meta-Skill „task-observer" | CC BY 4.0 (Namensnennung) | SECURITY_CHECKED (0 Funde) · nicht installiert | 678 Zeilen, triggert bei jeder mehrstufigen Aufgabe → hohe Kontextkosten. Prinzip übernommen: Learnings-Abschnitt in `NEXT_SESSION.md`. |
| 16 | NVIDIA/SkillSpector | d7338f5 · 2026-10-22 | Security-Scanner für Agent-Skills | Apache-2.0 | INSTALLED · INTEGRATED · TESTED | Sicherheitskern; statischer Modus (`--no-llm`), 11 Scans durchgeführt. |
| 17 | calesthio/OpenMontage | e01dbf4 · 2026-10-23 | Agentisches Videoproduktions-Framework (Python-Tools für ~50 Provider, Remotion/HyperFrames, 140 Skills) | **AGPL-3.0** | TESTED (1328 Tests grün) · ISOLATED | Nicht Phase-1-Kern: Wert liegt in nicht autorisierten Bezahl-Providern; freier Pfad = Stock-Footage (passt nicht zu eigener animierter IP); AGPL-Kopierverbot ins eigene Repo. Kandidat Phase 2. |

## Details je Repo

**Abhängigkeiten / Ressourcen / Risiken / Tests** (nur Abweichungen von „keine"):

- **OpenMontage** — Deps: pyyaml, pydantic, google-genai, openai, fastapi … (`requirements.txt`), Node für Remotion-Composer. Ressourcen: CPU reicht für Framework; generatives Video nur über Cloud-APIs oder GPU (`requirements-gpu.txt`). Risiken: SkillSpector CRITICAL = YARA-Treffer in `references/webhooks.md` (HeyGen-Webhook-Doku, kein Schadcode); E1-Funde = viele `process.env`-Zugriffe auf Provider-Keys (erwartet). Test: `pytest tests/contracts tests/qa tests/lib` in Sandbox ohne Credentials → **1328 passed, 9 skipped, 102 s**. Konkurrenz: unsere eigene Pipeline (Render), Remotion (Lizenz!), HyperFrames.
- **SkillSpector** — Deps: langchain/langgraph, boto3, yara-python, openai (für optionalen LLM-Modus). Netz im `--no-llm`-Modus: OSV.dev + Paketregistries (nur Paketnamen). Test: 11 Scans erfolgreich; Grenzen: Aggregatbudget scannt große Sammlungen nur teilweise (ECC 32/311, OpenMontage 32/91 bzw. 32/49), Abdeckung 5–90 %.
- **RTK** — Build: `cargo build --release` in Sandbox, Binary 15,6 MB. Telemetrie: nur nach Opt-in. SkillSpector-Funde betreffen seine Claude-Skills (`rm`-Muster), nicht das Binary.
- **VoiceStudio** — Installer `curl -fsSL https://voicestudio.sh/install | sh` (verboten ohne Prüfung), Electron, Docker-Deploy; Engines laden Modelle per `bootstrap.py`. Nicht ausgeführt.
- **ECC** — Installation über `npx ecc-universal` (Remote-Paketausführung) → nur nach Review des konkreten Pakets.
- **claude-mem** — CRITICAL: `scripts/configure-telegram.mjs` liest Env und ruft `api.telegram.org` (Feature, aber Exfiltrationspfad bei Fehlkonfiguration).
- **deer-flow** — 14 CRITICAL: Taint-Flows Env-Key → Vendor-API (MiniMax/Gemini) in Generierungs-Skills; erwartetes Verhalten von API-Wrappern.

## Capability-Matrix → siehe `docs/TECHNOLOGY_DECISIONS.md`
