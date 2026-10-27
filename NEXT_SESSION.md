# NEXT_SESSION

## Aktuelle Phase
**Neuausrichtung (27.10.):** Echo-Archiv vom Co-CEO **verworfen** („nicht ansprechend"). Tiefenrecherche fertig:
`docs/RESEARCH_TIKTOK_AI_SERIES_2026-10.md` (Notizen `research_notes/KI Serien auf TikTok 2026/`). Kern: Mechanik schlägt Motiv —
sichtbarer Status + Status-Umkehr + benannte Figuren + Loop; Früchte-Motiv in DACH verbrannt; Engpass = Flow-Credits.
Empfehlung: 3 Piloten à 45 s gegeneinander testen — Rang 1 **„Kontostand"**, Rang 2 **„Probezeit"**, Rang 3 **„Straßenküche"**.
**27.10. Co-CEO verwirft auch „Kontostand"** (Konsens-Idee: jede KI landet nach derselben Analyse dort; Markt voll). Gefordert: Idee mit Sinn,
die mitnimmt/verändert, außerhalb des KI-Mainstreams (Anime erwünscht). Neue Kandidaten (Neuheit nur per Stichprobe geprüft):
A **„Eine Minute"** (jeder hat 60 s Sprechzeit/Tag; Folge = Minute einer Person in Echtzeit, Zähler) · B **„Ein Satz"** (ein Satz zu einem Kind,
Zeitraffer 25 Jahre, Ende: anderer Satz → anderes Leben) · C **„Der Koffer"** (Gastarbeiter-Generationensaga 1964→2026) ·
D **„Ehrenmann-Arc"** (kleine gute Taten als epischer Kampf-Anime; Co-CEO: auch Ehrenfrauen → „Ehren-Arc", Aylin/Jonas/Oma Hilde,
Leitsatz „Ehre zählt nur ohne Kamera"). Co-CEO unsicher, will Forecast + evtl. Früchte/Gemüse → neu E **„Mindestens haltbar"**
(WG-Kühlschrank, MHD-Anzeige über jedem Lebensmittel; Twist: sie WOLLEN gegessen werden, Angst = Biotonne; Ende jeder Folge = Verwandlung
z. B. Bananenbrot; Bogen: WG fährt in 10 Tagen weg → Finale Fairteiler). Forecast (Schätzung, 8 Wochen, neues Konto):
Hit-Chance E 5 % / D 3 % / A 3 %; Flop E 35 % / D 40 % / A 45 %. Danach „Brainrot-Liga" (Figurenrender vom Co-CEO gestoppt).
**27.10. Co-CEO: „Du driftest zu weit raus"** + Screenshots: Ai Kino Lab (DE, Früchte-Kopf-Menschen, Status-Spott am Schuhstand, „Teil 3",
4.302 Likes / 755 Saves / 65 Komm. / 60 Shares) + Kurs-Werbekarussell ⚠ (Pets Dancing 285 Tsd. Follower/21 Mio. Peak, Brainrot-Mukbang, PS1-Streets,
POV Cartoon Worlds, Rainy Cartoon Nights — 2/5 mit fremder IP). Lehre: im bewährten Genre besser sein statt neues Genre erfinden.
Vorschlag „Die Marktstraße" (Früchte-Köpfe, Menschenkörper, dt. Straße; Opa Dattel/Bäckerei, Lilli Limette, Konrad Kokosnuss, Frau Paprika)
mit 2 Spuren: Story-Teile 61–75 s + Daily-Clips 8–15 s mit derselben Besetzung. Wartet auf Go.
**Wartet auf Co-CEO:** Wahl + Freigaben (Konto, Cross-Post, Halal-Ergänzung Glücksspiel/Schwein).

## Abgeschlossen (2026-10-25)
- Discovery: Umgebung (4 vCPU, 15 GiB, keine GPU), GitHub (nur `23mta23-cpu/brainstorming`), Google Drive (Lesen/Schreiben ok; Ordner „MiracTT" existiert), Deep-Research-PDF vollständig ausgewertet (`docs/RESEARCH_FINDINGS.md`).
- 17 Repos inventarisiert + SkillSpector-gescannt + Status (`docs/REPOSITORY_MATRIX.md`, `docs/SECURITY_AUDIT.md`).
- Capability-Matrix + Entscheidungen (`docs/TECHNOLOGY_DECISIONS.md`).
- Market Intelligence Erstanalyse + Tracker (`docs/MARKET_INTELLIGENCE.md`, `docs/COMPETITOR_TRACKER.md`).
- Strategie, TikTok-Strategie, Policy, Agentenorganisation, Qualitätsschleusen, Kosten.
- Story: 3 Konzepte bewertet, Echo-Archiv gewählt, Staffel 1 + Serienende geplant (`docs/SERIEN_HANDBUCH.md`, `docs/STORY_TRACKER.md`).
- Pipeline TESTED; Pilot E001 **v2** gerendert (nach Agent-Review: 3 Blocker behoben), QC 14/14 PASS, Launch-Entwurf (`series/echo-archiv/episodes/E001/LAUNCH.md`).
- Agenten TESTED: `story-reviewer` (v1 REVISE → v2 PASS), `trend-scout` (Daily Screen im Log). Bordmittel `/code-review` TESTED: 4 Pipeline-Bugs gefunden und behoben (fehlendes Pflichtfeld `series`, Absturz bei dialogfreien Folgen, `tts.py probe` ohne MLS-Modell, Validierungsabsturz bei Zeile ohne `who`). Kaltstart-Test `scripts/setup_tools.sh`: 41 s, 17/17 Repos am auditierten Commit.
- Drive: Ordner „AI-Studio – Freigaben (Kopien aus GitHub)" (https://drive.google.com/drive/folders/1sV7w5ucmWRobBkaE2c2tCfabOwOZzahP) mit Freigabepaket E001 (https://docs.google.com/document/d/1zbGT4I41Fq4oboMMVPD6keyVMbaXpU2DzfktFuDvKQw). Kopie; Quelle bleibt GitHub.

## Installiert & getestet (flüchtig! nach Neustart: `scripts/setup_tools.sh`)
gen-venv (FLUX.2-klein) · qwen-venv (Qwen3-TTS + faster-whisper) · Modelle flux2-klein-4b, qwen3-tts-base, whisper-small · SkillSpector 2.12.0 · Piper 1.8.0 + 3 CC0-Stimmen · RTK (Binary, nicht gehookt, `--rtk`) · OpenMontage-Deps (Tests 1328 grün; nicht im Setup-Skript, da nicht Teil der Pipeline).

## Offene Tests
- Kopf-an-Kopf-Vergleich Engineering-Methodik (Bordmittel+Ponytail vs. Superpowers) an einer echten Aufgabe — nur falls Engineering wächst.
- Vollscan ECC/OpenMontage (nur falls Nutzung geplant).

## Blocker
- Keine Hörprüfung durch mich möglich → Stimmen-Freigabe durch Menschen.
- Budget 0 € → kein generatives Video (CPU zu langsam), Stimmen nur Open Source (jetzt Qwen3-TTS, entworfene Stimmen).
- Platte: ~2,5 GB frei (Kontingent). Nur Neu-Ladbares löschen.

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
**Ab 27.10. gilt:** Nach Konzeptwahl → Pilot(e) + vollständiger Bogen bis zum Ende (Regel 4) → story-reviewer → 3-Sekunden-Verständnistest (≥7/10)
→ Tech-Spike (3 Clips, ~75–100 Credits: deutscher Dialog, Lippen, Anzeige auf Handy lesbar) → Prompt-Paket (9:16, mit Dialog + Geräuschen)
→ Auto-Schnitt-Skript. Validierungsplan + Go/Stopp-Schwellen: Report Abschnitt „Validierung". Vor Posting: Flow/Hailuo-Bedingungen + Creator-Rewards-Regeln prüfen.
Hailuo-Testergebnis des Co-CEO steht noch aus. Alles darunter = Historie Echo-Archiv.

**KURSWECHSEL 25.10. ~16:30 UTC (Co-CEO):** Standbilder + Stimmen („Animated Illustration") erfüllen die Erwartung **nicht** — gefordert sind echte
Animationen mit Handlung (Referenz: TikTok „AI Fruit Drama": Bild-KI → Bild-zu-Video, z. B. Veo 3.1). Co-CEO hat **Google AI Pro** → Veo 3.1 in **Google Flow**
ohne Zusatzkosten (laut Übersichten 1.000 Credits/Monat + 50/Tag; Veo 3.1 Lite 10, Fast 20 Credits/Clip). Flow ist nicht fernsteuerbar → Handoff:
ich liefere Startbild (unser Keyframe) + Prompt je Shot, Team generiert in Flow, lädt Clips per GitHub-Web-Upload hoch, ich baue (Stimmen, Untertitel, Overlays, QC).
1. **Wartet auf Co-CEO:** Flow-Pilot `series/echo-archiv/flow_pilot/README.md` (P1 Handlung, P2 Sprechgesicht, P3 Pip) → Clips in `flow_pilot/clips/`.
   Stand 25.10. ~18:00: Gemini-App lehnte P1 v1 ab (Filter) → P1 entschärft. Co-CEO fragte „warum 3D statt Anime?" → **Anime-Stiltest** gebaut
   (`look/anime/`: eigener Stil-Text ohne Studionamen, Nox/Mira/Pip + Pilotbilder `flow_pilot/P*_start_anime.jpg`, Vergleich `flow_pilot/Vergleich_3D_vs_Anime.jpg`).
   Alle 3 Pilot-Prompts jetzt mit Dialog (P3 „Hat sie mir je geschrieben?", P2 „Enn Feyr … das bin ich.", P1 Mira off „Nicht! Sonst vergisst du sie wieder.").
   Befund Anime: Mira-Hautton zu hell (Lock: warm-braun) → bei Anime-Entscheidung korrigieren; Figuren etwas schlicht. Clips kommen per Chat-Upload.
2. Danach: Clips prüfen (Figurentreue, Lippen, Wasserzeichen, Artefakte), Testschnitt mit unseren Stimmen, Vergleich zur jetzigen Fassung; Nutzungsbedingungen Flow (kommerziell, Wasserzeichen) prüfen.
2b. **27.10.:** Pilot-Runde 1 ausgewertet (echte Bewegung ✓, Veo spricht Deutsch ✓; Drift, 16:9, Kanon-Berührung ✗) + Testschnitt mit Cast-Stimmen. Referenzvideo des Co-CEO
   („KI Früchte Milliardär Teil 6", 73 s) analysiert: 27 Sätze/73 s, ~15 Einstellungen, Statuswechsel alle ~10 s, Vermögens-Leuchtanzeige als sichtbarer Einsatz,
   Loop zum ersten Satz → **Format-Lehre:** Figuren spielen selbst (Dialog-dicht), 9 Clips × 8 s pro Teil, sichtbarer „Erinnerungen"-Zähler für Nox.
   Vorschlag an Co-CEO: Teil 1 „Regel Acht" in diesem Format neu (3D), Prompt-Paket-Generator + Auto-Schnitt-Skript. Co-CEO testet zusätzlich **Hailuo AI** (Omni Reference) — Ergebnis abwarten.
3. Dann Produktionsweise festlegen: Shot-Liste „bewegungsorientiert" (jede Einstellung = Handlung), Flow-Prompts pro Shot generieren (Skript), E01/E02 neu animieren, E03 v1.1 schreiben (Review-Befunde E03-R1 im Tracker).
Alternativen, falls Flow nicht reicht: Kaggle-Gratis-GPU + Wan 2.2 (Apache-2.0; OpenMontage hat `_wan_engine.py`), oder Veo-API mit Budget (Lite 0,05 $/s, Fast 0,10 $/s; Freigabe nötig).
OpenMontage (AGPL, nur als separates Werkzeug) enthält Veo/Kling/Wan/LTX-Tools + Veo-Prompt-Skill (`skills/creative/prompting/veo-prompting.md`).

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
- venvs nur mit System-Python anlegen: ein per uv in der Sandbox geladenes Python liegt im temporären Sandbox-HOME und verschwindet (tts2-venv kaputt, 25.10.).
- Abgelehnte Keyframes erst verschieben, wenn kein laufender Edit-Job (`*_m`, `edit_of`) mehr darauf aufbaut — sonst bricht der Batch.
- Bildmodell malt bei „Glyphen/Siegelzeichen/Hintergrund-Briefe" Pseudo-Schrift (S11c, S15) → im Prompt „no letters, no characters, no writing" und Text nur als Overlay.
- Repos sind Werkzeuge, nicht nur Risiken (Co-CEO 25.10.): Einsatzplan in `docs/REPOSITORY_MATRIX.md` fortschreiben; neue Folge = Hook-Rubrik (youtube-agent-skill) im story-reviewer.
