# Technologieentscheidungen & Capability-Matrix

Prinzip: **eine Kernfähigkeit → ein führendes System → Ergänzungen → isolierte Alternativen.**
Bordmittel von Claude Code wurden jeweils mitverglichen. Kein Vergleich nach Stars/Anzahl Agenten.

## Capability-Matrix

| Fähigkeit | Führend (Status) | Ergänzung | Isolierte Alternative / verworfen | Begründung |
|---|---|---|---|---|
| Engineering & Planung | Claude Code Bordmittel (Plan-Modus, Subagenten) + **Ponytail** (INTEGRATED) | – | Superpowers (Kandidat), ECC (isoliert) | Engineering ist Mittel zum Zweck; jede weitere Methodik kostet Kontext pro Sitzung. Kein Kopf-an-Kopf-Benchmark durchgeführt (PLANNED). |
| Codequalität & Reviews | Bordmittel `/code-review`, `/security-review` | Ponytail-Audit | ECC-Reviewer-Agenten | Bereits verfügbar, kein Install nötig. |
| Sicherheit | **SkillSpector** (TESTED) + `scripts/sandbox-run.sh` | `scripts/inventory.py` (Risikomuster) | SkillSpector-LLM-Modus (Freigabe nötig) | Einziges dediziertes Skill-Scanning; statisch, ohne Datenabfluss. |
| Skills & Agenten | Projekt-Skill `produce-episode`, Agenten `story-reviewer`, `trend-scout` | – | ECC-Agenten, deer-flow-Harness | Nur Rollen mit echtem Kontextvorteil (frischer, kritischer Blick; günstige Recherche). |
| Gedächtnis & Kontext | Versionierte Docs + `NEXT_SESSION.md` + Auto-Compaction | RTK (TESTED, optional) | claude-mem (rejected), Headroom (isoliert) | Container ist flüchtig; Git überlebt. Zusätzliche KI-Zusammenfassung kostet Tokens. |
| Modell-Routing | Claude Code (Subagent-`model`-Feld: Sonnet für Recherche) | – | OmniRoute (rejected) | Keine weiteren Provider autorisiert; Datenabfluss vermeiden. |
| Recherche / Marktanalyse | WebSearch/WebFetch + `trend-scout`-Agent | TikTok Creative Center (manuell, rechtmäßig) | deer-flow Deep-Research | Kein Scraping, keine API-Annahmen. |
| Storytelling / Story-Review | Claude (Hauptsitzung) + `story-reviewer` | youtube-agent-skill-Hookformeln (Referenz) | – | Story vor Bild; adversariales Review in frischem Kontext. |
| Storyboard / Shotlist | `episode.json` + `pipeline/shotlist.py` (TESTED) | Kontaktbogen-Stills (`render.mjs --times`) | ArtCraft (Referenz) | Maschinenlesbar, Zeiten aus echter Sprechdauer. |
| Figuren-/Weltkonsistenz | **Character Lock in Code** (`characters.js`, `world.js`) | Kontinuitätsregeln in `STORY_BIBLE.md` | Referenzbild-Pipelines (Phase 2) | Code-Figuren driften nicht — größter Vorteil gegenüber Text-to-Video. |
| Bildgenerierung | Vektor-Zeichnung per Code (SVG) | – | OpenMontage-Bildprovider (bezahlt), lokale Diffusion (keine GPU) | Ohne GPU/APIs einzige Option mit konsistenter Qualität. |
| Videogenerierung | **nicht vorhanden** (BLOCKED: Freigabe/Budget) | – | OpenMontage + Kling/Veo/Runway (Phase 2) | Ehrlich: Wir erzeugen Motion-Graphics/2D-Puppet-Animation, kein generatives Video. |
| Animation | Deterministische SVG-Animation, Playwright-Frame-Capture (TESTED) | awesome-opus5-5-videos (Technikreferenz) | Remotion (Lizenz!), HyperFrames (Apache-2.0, Alternative) | Keine neue Abhängigkeit; Chromium + Playwright vorinstalliert. |
| Audio & Stimmen | **Piper TTS** lokal, CC0-Stimmen (TESTED) | `pipeline/sfx.py` (eigene Synthese) | VoiceStudio (isoliert), ElevenLabs (Freigabe nötig) | Kostenlos, offline, rechtlich sauber; Qualität ist die größte Lücke. |
| Schnitt & Rendering | `build.py` + FFmpeg (TESTED) | Master-Kette Kompressor→Limiter→Loudnorm | Remotion (Company License bei 4 Personen), OpenMontage-Composer | Volle Kontrolle, lizenzfrei. |
| Qualitätskontrolle | `pipeline/qc.py` (14 objektive Checks, TESTED) + Claude-Vision-Kontaktbogen | menschliche Freigabe | OpenMontage `composition_validator` (Referenz) | Objektives automatisiert, Subjektives beim Menschen. |
| Analytics & Automatisierung | PLANNED: `analytics/posts.csv` + Performance-Auswertung nach ≥ 20 Videos | – | – | Erst echte Daten, dann Tooling (YAGNI). |

## Wichtige Einzelentscheidungen

### D1 — Eigener Renderer statt Remotion (2026-10-25)
FAKT: Remotion-Lizenz (npm `remotion@4.0.538`, LICENSE.md): kostenlos für Einzelpersonen, gemeinnützige Organisationen,
gewinnorientierte Organisationen **bis 3 Mitarbeiter** und zur Evaluierung. Wir sind 4 Personen.
SCHLUSSFOLGERUNG: Produktivnutzung erfordert wahrscheinlich eine Company License (ob Gründer als „employees" zählen: FAQ remotion.pro, nicht abschließend geklärt).
ENTSCHEIDUNG: `pipeline/render.mjs` (Playwright + FFmpeg, ~60 Zeilen). Alternative ohne Lizenzkosten: HyperFrames (npm `hyperframes` 0.8.193, Apache-2.0).

### D2 — OpenMontage nicht als Phase-1-Kern
Tests grün, Architektur stark. Aber: (1) Mehrwert liegt in Bezahl-Providern, (2) freier Pfad = Stock-Footage statt eigener IP,
(3) 140 Skills + eigene CLAUDE.md würden Agentenverhalten und Kontext übernehmen, (4) AGPL-3.0 → kein Code in unser Repo.
Phase 2 (nach Budgetfreigabe für ein Videomodell): OpenMontage unverändert als separates Werkzeug für generative Shots evaluieren.

### D3 — Stimmen: CC0-Piper statt MLS-Mehrsprechermodell
Gemessen: `de_DE-mls-medium` erzeugte bei kurzen Sätzen bis zu 9,2 s Ausgabe mit langen Pausen/Artefakten (Satz: „Es gibt keine Regel acht.").
CC0-Stimmen (thorsten-high, thorsten_emotional, kerstin-low): 0,5–1,9 s, sauber. Differenzierung über Pitch/Hall-Effekte.
Lücke: Erzähler und Nox basieren auf demselben Sprecher (Thorsten). Echte Stimmbesetzung = höchster Qualitätshebel (Freigabe nötig).

### D4 — Untertitel im Bild statt ASS-Burn-in
Untertitel werden im HTML-Frame gerendert (Safe Area x 110–930, y 1250–1400) → identische Typografie, kein zweiter Encode.
