# Architektur

```
Markt (WebSearch, manuell Creative Center) ──► trend-scout ──► MARKET_INTELLIGENCE.md
                                                                      │
STORY_BIBLE.md / STORY_TRACKER.md ──► episode.json ──► story-reviewer ──► (PASS)
                                            │
                     ┌──────────────────────┴───────────────────────┐
                     ▼                                              ▼
        pipeline/tts.py (Piper, lokal)                   scene.html  (SVG-Shots)
        pipeline/sfx.py (numpy-Synthese)                 characters.js / world.js (Locks)
                     │                                              │
                     ▼                                              │
        build.py: Timeline aus realen Sprechdauern ─── timeline.json ┤
                  Lip-Sync-Hüllkurven, Audiomix + Ducking           ▼
                     │                                 render.mjs (Playwright/Chromium → JPEG → FFmpeg)
                     ▼                                              │
        mix.wav ──────────────► FFmpeg-Mux (Kompressor → Limiter → Loudnorm −14 LUFS, KI-Metadaten) ◄─ video.mp4
                                            │
                                     final/*.mp4 ──► qc.py (14 Checks) ──► Kontaktbogen (Claude Vision)
                                            │
                                     LAUNCH.md ──► menschliche Freigabe ──► manueller Upload (TikTok, AIGC-Label)
                                                                                  │
                                                           analytics/posts.csv ◄──┘ (manuell aus TikTok Analytics)
```

## Wissensorte (kein doppelter Bestand)
| Ort | Inhalt | Begründung |
|---|---|---|
| **GitHub** (`23mta23-cpu/brainstorming`, Branch `claude/ai-studio-foundation`) | Single Source of Truth: Code, Docs, Story-Register, Episoden-JSON, finale MP4 (≤ 25 MB) | versioniert, überlebt flüchtige Container |
| **Google Drive** ([Ordner](https://drive.google.com/drive/folders/1sV7w5ucmWRobBkaE2c2tCfabOwOZzahP)) | nur menschenorientierte Freigabepakete (Einweg-Kopie GitHub → Drive, mit Datum) + große Medien | Team ohne Git-Zugang; Dateien > 25 MB; MCP kann keine Videos dieser Größe hochladen |
| `/home/user/vendor`, `/home/user/tools` | Fremd-Repos, venvs, Stimmen | flüchtig, per `scripts/setup_tools.sh` reproduzierbar |

Drive-Befund: Es existiert bereits ein Ordner „MiracTT" (u. a. `OpenMontage_MiracTT_Backup.zip.part001–005`, `TimGioh_MiracTT_TikTok_Edit.mp4`). Nicht geöffnet/verändert.

## Sicherheitsschicht
SkillSpector (statisch) vor jeder Skill-Übernahme · `scripts/sandbox-run.sh` für jede Fremdcode-Ausführung · keine Secrets im Repo ·
keine Hooks/MCP-Server ohne Prüfung · Veröffentlichung nur manuell.

## Austauschbarkeit (Phase 2)
Shots sind Funktionen `SHOTS[id](u, d, t)` → ein Shot kann später durch einen generativen Clip ersetzt werden (gleiche Timeline, gleiche Audio-Spur).
Provider-Schicht dafür: OpenMontage als separates Werkzeug (AGPL, unverändert) oder direkter API-Adapter — Entscheidung nach Budgetfreigabe.
