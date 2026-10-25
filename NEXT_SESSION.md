# NEXT_SESSION

## Aktuelle Phase
**E001 v3 fertig** (59,3 s, QC 15/15, Whisper 15/15, 3D-Animationsfilm-Look, 0 €) — wartet auf Anhören/Freigabe durch den Co-CEO (`series/echo-archiv/episodes/E001/LAUNCH.md`). Nächstes Ziel: **E02 „Der Brief" + E03** mit der v3-Pipeline, dann Launch.

## Abgeschlossen (2026-10-25)
- Discovery: Umgebung (4 vCPU, 15 GiB, keine GPU), GitHub (nur `23mta23-cpu/brainstorming`), Google Drive (Lesen/Schreiben ok; Ordner „MiracTT" existiert), Deep-Research-PDF vollständig ausgewertet (`docs/RESEARCH_FINDINGS.md`).
- 17 Repos inventarisiert + SkillSpector-gescannt + Status (`docs/REPOSITORY_MATRIX.md`, `docs/SECURITY_AUDIT.md`).
- Capability-Matrix + Entscheidungen (`docs/TECHNOLOGY_DECISIONS.md`).
- Market Intelligence Erstanalyse + Tracker (`docs/MARKET_INTELLIGENCE.md`, `docs/COMPETITOR_TRACKER.md`).
- Strategie, TikTok-Strategie, Policy, Agentenorganisation, Qualitätsschleusen, Kosten.
- Story: 3 Konzepte bewertet, Echo-Archiv gewählt, Staffel 1 + Serienende geplant (`docs/STORY_BIBLE.md`, `docs/STORY_TRACKER.md`).
- Pipeline TESTED; Pilot E001 **v2** gerendert (nach Agent-Review: 3 Blocker behoben), QC 14/14 PASS, Launch-Entwurf (`series/echo-archiv/episodes/E001/LAUNCH.md`).
- Agenten TESTED: `story-reviewer` (v1 REVISE → v2 PASS), `trend-scout` (Daily Screen im Log). Bordmittel `/code-review` TESTED: 4 Pipeline-Bugs gefunden und behoben (fehlendes Pflichtfeld `series`, Absturz bei dialogfreien Folgen, `tts.py probe` ohne MLS-Modell, Validierungsabsturz bei Zeile ohne `who`). Kaltstart-Test `scripts/setup_tools.sh`: 41 s, 17/17 Repos am auditierten Commit.
- Drive: Ordner „AI-Studio – Freigaben (Kopien aus GitHub)" (https://drive.google.com/drive/folders/1sV7w5ucmWRobBkaE2c2tCfabOwOZzahP) mit Freigabepaket E001 (https://docs.google.com/document/d/1zbGT4I41Fq4oboMMVPD6keyVMbaXpU2DzfktFuDvKQw). Kopie; Quelle bleibt GitHub.

## Installiert & getestet (flüchtig! nach Neustart: `scripts/setup_tools.sh`)
SkillSpector 2.12.0 · Piper 1.8.0 + 3 CC0-Stimmen · RTK (Binary, nicht gehookt, `--rtk`) · OpenMontage-Deps (Tests 1328 grün; nicht im Setup-Skript, da nicht Teil der Pipeline).

## Offene Tests
- Kopf-an-Kopf-Vergleich Engineering-Methodik (Bordmittel+Ponytail vs. Superpowers) an einer echten Aufgabe — nur falls Engineering wächst.
- Vollscan ECC/OpenMontage (nur falls Nutzung geplant).

## Blocker
- Keine Hörprüfung durch mich möglich → Stimmen-Freigabe durch Menschen.
- Budget 0 € → kein generatives Video (CPU zu langsam), Stimmen nur Open Source (Chatterbox).

## Erforderliche Freigaben / Rückfragen an den Co-CEO
1. **E001 v3 ansehen/anhören** (`final/E001_Regel_Acht.mp4`, Vergleich `final/E001_v2_vs_v3.jpg`) — v. a. Hook-Satz und Miras Twist-Satz; freigeben oder Korrekturen nennen.
1b. **Halloween-Fenster (Sa 31.10.)**: Empfehlung: *nicht* E01 allein posten. Launch mit E01–E03 Anfang November. Ausnahme: E01-Freigabe bis 27.10. + E02/E03 bis 30.10. → dann E01 am 30.10.
2. **Musik-Policy**: nur Sounddesign / Vokal-Percussion / lizenzierte Instrumentalmusik? (`docs/CONTENT_POLICY.md`)
3. Hausregel Körperkontakt/Romantik bestätigen.
4. TikTok-Account: neuer Serien-Account oder bestehender (MiracTT?).
5. ~~Budget~~ entschieden: **0 €**, auch keine Lizenzkosten (25.10.).
6. Rollen der vier Teammitglieder (`docs/COMPANY_STRATEGY.md`).
7. Optional: nicht benötigte account-synchronisierte Plugins deaktivieren (Token-/Hook-Overhead).

## QUALITÄTSOFFENSIVE (Auftrag Co-CEO, 25.10.2026) — hat Vorrang vor allem anderen
Feedback: Pilot v2 wirkt „wie vom Werkstudenten", Figuren/Animation ungenügend; Ziel: moderner 2026-Look; Länge zu kurz?
Rahmen: **0 € Budget, auch keine Lizenzkosten** → nur kostenlose, kommerziell nutzbare Open-Source-Modelle/Tools (Apache-2.0/MIT/CC0/OFL).
Automatische Fortsetzung: geplante Aufgabe „Echo-Archiv: automatische Fortsetzung" (alle 2 h) — vom Co-CEO freigegeben.
Arbeitsplan (Status hier fortschreiben):
1. [x] Recherche: FLUX.2-klein-4B (Apache-2.0, Multi-Referenz-Editing), Chatterbox Multilingual (MIT, Deutsch); Video auf CPU nicht machbar
2. [x] Machbarkeit: CPU hat AMX → bf16 ~860 GFLOPS; **65 s/Bild** (576×1024), 127 s mit Referenz, Peak-RAM 9,9 GB (`pipeline/gen.py`)
3. [x] Character Lock v3: `series/echo-archiv/look/refs/` — nox.png, mira.png, lina.png (v2, ohne Ohren) OK, pip.png (Augen über Rand, kein Ring) OK
4. [x] Pipeline v3: `pipeline/keyframes.py` (Skript → Jobs), `gen.py`, `plates.py` (Upscale + Mund-Patches), Szene v3 (`series/echo-archiv/scene.html`), build.py-Integration geschrieben. **Stimmen TESTED**: `tts2.py` nimmt bis zu 4 Takes (Hook 8), `asr_check.py` (Whisper) wählt Verständlichkeit vor Tempo und schneidet nach dem letzten Skriptwort; Referenzen reproduzierbar mit `pipeline/voice_refs.py`. Ergebnis E001: 15/15 Zeilen ASR-ok, Dauer 59,3 s (vorher 82,5 s durch Kauderwelsch/Stille). Bilder, Overlays (notches, pin, photo, engraving, handwriting …), Retusche (fix/clone), Render: TESTED
5. [x] E01 Skript **v3.2** (21 Shots, 24 Keyframes, Summe Mindestdauern 58,4 s) — Story-Review: v3 REVISE (5 Blocker) → v3.1 **PASS**; Asset-Gates G1 Lina/Pip, G2 Stimmen (erledigt: `series/echo-archiv/voices/` + SOURCES.md), G3 Ring in S05/S07 bei Keyframe-Prüfung. v2 bleibt über Commit `006911a` reproduzierbar (Tag-Push vom Git-Proxy verweigert)
6. [x] Vergleich v2/v3 + Freigabepaket v3 (LAUNCH.md); E001 v3 fertig bis auf menschliches Anhören/Freigabe

## Genaue nächste Aktion
**E02 „Der Brief" in Produktion** (Skript v1.2, Story-Review: REVISE → REVISE(2) → behoben; Stimmen fertig 14/14 ASR, 60,8 s):
1. [~] Keyframes laufen/liefen: `python3 pipeline/keyframes.py series/echo-archiv/episodes/E002` (27 Jobs, `kf/S04p.png` = Kopie E001 S16p, nicht generieren).
   Jedes Bild prüfen (Identität, Ort, Requisiten, Policy); Overlays kalibrieren (Keyframe-Pixel):
   `texts` (fx_txt): S01 + S11 Adresse „Für Nox" (Kinderschrift), S04 „Lina lebt." auf der Fotorückseite? (S04 zeigt die Vorderseite → `photo`),
   S07 Schild „ZUSTELLUNG", S14 Brieftext „Nox, ich warte am Bahnhof. / Jeden Tag um sieben. / Deine Lina" (write), S16 Stempel „ANNAHME VERWEIGERT" (stamp, rot) + „N. Veyr" (write);
   `pin` S02/S06/S15 (+S11b über plate_of S02); `photo` S04; Mund-`at` S04m S05m S06m S07m S15m S17m.
2. `plates.py` → Vorschau-Kontaktbogen → `build.py` → QC + `asr_check.py` → LAUNCH.md (E02) → Tracker/NEXT_SESSION.
3. Danach E03 „Miras Lüge" (Bible §6; N4: Woher weiß Mira von Lina, warum bricht sie das Siegel; P7 Notizen in ihrer Tasche).

## Relevante Pfade & Befehle
```bash
PY=/home/user/tools/piper-venv/bin/python
$PY pipeline/build.py series/echo-archiv/episodes/E001            # komplett
$PY pipeline/build.py series/echo-archiv/episodes/E001 --reuse-video  # nur Ton neu
python3 pipeline/qc.py <final.mp4> <build/timeline.json>
python3 pipeline/shotlist.py series/echo-archiv/episodes/E001
scripts/sandbox-run.sh [--net] <cmd>                              # Fremdcode ohne Tokens
/home/user/tools/skillspector-venv/bin/skillspector scan <dir> --no-llm --recursive --format json --output x.json
```
Branch: `claude/ai-studio-foundation` (kein PR erstellt).

## Learnings (statt task-observer)
- MLS-Mehrsprecher-Piper-Modell ist für kurze Sätze unzuverlässig (Pausen/Artefakte) → nur Einzelsprecher-Modelle.
- AAC erzeugt ~0,6 dB True-Peak-Overshoot → Master auf −2 dBTP.
- Vorschau-Kontaktbogen vor dem Vollrender spart Iterationen (fand Tür-Rotationsbug, Blitzposition, Haar-Clipping, Untertitel über Mund).
- Story-Review **vor** dem Render ist Pflicht, nicht Kür: der Agent fand 3 echte Blocker, die ich im Selbstreview übersehen hatte. Kosten ~160 k Tokens/Lauf.
- Jede Einstellung, in der Hand/Gesicht einer Figur ins Bild kommen kann, braucht die Figurenreferenz (S01/S12: sonst bärtiger Fremder).
- Kleine Story-Requisiten (Kerben, Ringnadel, Gravur, Handschrift) als Overlay statt generiert: Bildmodelle zählen/zeichnen sie unzuverlässig.
- Sprechtempo in Silben/s messen, nicht Wörter/s (einsilbige Wörter verfälschen).
- Chatterbox hängt bei kurzen Sätzen oft Kauderwelsch oder Sekunden Stille an → nie ungeprüft übernehmen: ASR-Takeauswahl + Schnitt am letzten Skriptwort. Tempo kommt aus der Referenz (Piper `length_scale`), `exaggeration`↑ beschleunigt, `cfg_weight` 0.3 bremst nur wenig.
- faster-whisper: Audio als Array übergeben (Datei-Decoder bricht mit installiertem PyAV).
- Subagent-Behauptungen mit strategischer Wirkung an der Primärquelle verifizieren (Anti-Spam-Meldung: bestätigt, aber anders als zuvor angenommen).
- Drive-Markdown-Import zerstört 4-Byte-Emojis → in Drive-Kopien Emojis ausschreiben.
- Fremdcode nie mit voller Umgebung starten (Tokens!) → `sandbox-run.sh`; `env -i` entfernt auch `VIRTUAL_ENV` → `uv pip --python` nutzen.
