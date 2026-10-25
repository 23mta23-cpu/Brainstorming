# Video-Pipeline

Befehle: siehe Skill `.claude/skills/produce-episode/SKILL.md`. Hier: Stufen, Status, Grenzen.

## 20 Stufen des Auftrags → Umsetzung
| # | Stufe | Umsetzung | Status |
|---|---|---|---|
| 1–2 | Marktanalyse, Chancen | `trend-scout`, `MARKET_INTELLIGENCE.md` | IMPLEMENTED |
| 3–5 | Ideen, Bewertung, Auswahl | `STORY_BIBLE.md` §1 | IMPLEMENTED |
| 6 | Handlung + Serienende | `STORY_BIBLE.md` §6–7, `STORY_TRACKER.md` | IMPLEMENTED |
| 7 | Drehbuch | `episode.json` (maschinenlesbar) | TESTED |
| 8 | Story-Logik | `story-reviewer` | TESTED |
| 9 | Storyboard | Kontaktbogen-Stills (`render.mjs --times`) | TESTED |
| 10 | Character Sheets / Style Guide | `characters.js`, `world.js` (Code = Referenz) | TESTED |
| 11–12 | Assets, Animation | SVG-Shots in `scene.html` | TESTED |
| 13 | Stimmen, Audio | `tts.py` (Piper), `sfx.py`, Ducking | TESTED |
| 14 | Schnitt, Timing | `build.py` (Timeline aus realen Sprechdauern) | TESTED |
| 15 | Untertitel | im Frame gerendert (Safe Area) | TESTED |
| 16 | Kreative QC | Kontaktbogen + Wellenform + Mensch | TESTED (teilweise; Hören = Mensch) |
| 17 | Technische QC | `qc.py` | TESTED |
| 18 | Überarbeitung | 2 Iterationen am Pilot (Bild + Ton) | TESTED |
| 19 | Finales Rendern | `final/*.mp4`, H.264 CRF 21, AAC 192k | TESTED |
| 20 | Menschliche Freigabe | `LAUNCH.md` | ausstehend |

## Was das Verfahren ist — und was nicht
Ist: deterministische **2D-Vektor-/Puppet-Animation mit Motion-Graphics**, Kamera-Moves, Partikeln, Lip-Sync aus Audiohüllkurve, synthetischen Stimmen.
Ist nicht: generatives Video, 3D-Animation, Motion-Capture, professionelle Sprecher. Ein Vergleich mit Top-KI-Microdramen wäre unfair zu unseren Gunsten formuliert, wenn wir das verschweigen.

## Leistung (gemessen, 4 vCPU, keine GPU)
TTS 9 Zeilen ≈ 7 s · SFX < 0,5 s · Render 950 Frames ≈ 95 s · Mux + QC ≈ 15 s · gesamt ≈ 2 min je 32-s-Folge.

## Bekannte Grenzen / Backlog
1. Stimmen: synthetisch, Erzähler und Nox vom selben Sprecher → Casting/bezahlte TTS (Freigabe).
2. Schauspiel: wenige Ausdrücke, keine Körperanimation → Ausdrucks-Bibliothek, Kopfdrehungen, Hände erweitern.
3. Musik: Policy-Entscheidung offen.
4. Render sequenziell → parallele Seiten, falls Volumen steigt.
5. EN-Version: `episode.json` braucht `lang`-Feld + EN-Stimmen (Piper en_US/en_GB) — vorbereitet, nicht umgesetzt.
