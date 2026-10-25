# Qualitätsschleusen

Objektive Merkmale werden automatisiert geprüft (`pipeline/qc.py`). Subjektive Qualität bekommt **keine erfundene Punktzahl** —
dort steht ein menschliches Urteil oder „offen".

| # | Schleuse | Prüfart | Kriterium | E001 v2 (2026-10-25) |
|---|---|---|---|---|
| 1 | Story Logic | `story-reviewer` + Hauptsitzung | Ursache-Wirkung lückenlos, Twist vorbereitet | Agent-Review v1: REVISE (3 Blocker) → in v2 behoben; Nachprüfung s. `STORY_TRACKER.md` |
| 2 | Narrative Closure | Register | Micro-Loop gelöst, Macro geplant aufgelöst, Serienende dokumentiert | bestanden |
| 3 | Hook | automatisch + Urteil | erstes Wort ≤ 0,5 s; offene Frage ≤ ~1,5 s | Wort 0,12 s ✔; „acht" bei ~1,2 s ✔; visuelle Frage (bloße Hand, 7 leuchtende Kerben + dunkler 8. Slot) ab Frame 0 ✔ |
| 4 | Dramaturgy | Urteil | Entscheidung, Twist, Cliffhanger vorhanden | vorhanden |
| 5 | Scene Quality | Shotlist | jede Einstellung mit Funktion | ✔ (Spalte „Funktion" in `SHOTLIST.md`) |
| 6 | Editing | gemessen + Urteil | Ø Shotlänge ~2,3 s, Variation, motivierte Schnitte | Ø 2,28 s, Spanne 1,3–3,2 s ✔ |
| 7 | Visuals | Code-Lock + Kontaktbogen | Figuren/Welt konsistent | ✔ (Figuren nur über `characters.js`) |
| 8 | Animation | Mensch | glaubwürdige Bewegung | **schwach**: Puppet-Animation, wenig Mimik/Körper — bekannt |
| 9 | Audio | automatisch + Mensch | −14 LUFS ±1,5, TP ≤ −1 dBTP, kein Dead Air; Verständlichkeit | −14,5 LUFS, −1,8 dBTP ✔; Sprache/Ambience ≈ 9,7 dB (v1: 8,0); Sprechtempo-Check ✔; **Hören ausstehend (Mensch)** |
| 10 | Values | `story-reviewer` + Mensch | `CONTENT_POLICY.md` | ✔ keine Verstöße gefunden |
| 11 | Copyright | Asset-Herkunft | nur eigene/lizenzierte Assets | ✔ alles Code-generiert; Fonts OFL; Stimmen CC0 |
| 12 | Technical | `qc.py` | 1080×1920, 30 fps, H.264/yuv420p, AAC 48 kHz, Dauer, Größe, KI-Metadaten | **14/14 PASS** |
| 13 | Audience Experience | Mensch, dann Daten | überzeugt das Video insgesamt? | **offen** — Freigabe + erste Daten |

Freigaberegel: Veröffentlichung nur, wenn 1–7 und 9–12 bestanden und der Co-CEO 8, 9 (Hören) und 13 freigibt.
