# Deep-Research-Auswertung

Dokument: „Virale KI-Microdramen auf TikTok: Tiefenanalyse, Serienkonzept und Produktionssystem mit Claude Code"
(ChatGPT-Ausarbeitung, Stand Oktober 2026, 31 Seiten). Pfad (Session-Upload, nicht im Repo):
`/root/.claude/uploads/614f2d06-118f-5df9-91f3-81969c62c899/b2ab00f1-Virale_KI-Microdramen_auf_TikTok__…_Claude_Code.pdf`
→ Vollständig gelesen. Empfehlung: PDF im Drive-Ordner ablegen, da Uploads nicht sitzungsübergreifend verfügbar sind.

## Kernaussagen (kompakt)
1. Fruit-Erfolg = visueller Widerspruch + bekanntes Sozialschema + wiederkehrende Figuren + Serienform, nicht „Früchte".
2. „Der Account ist nicht das Produkt. Die Welt und ihre Figuren sind das Produkt."
3. Jede Folge: Micro-Story (wird gelöst) + Macro-Story (bleibt offen); drei Loops: visuell, emotional, Lore.
4. Shot-Längen: Studie zu ReelShort-Microdramen Ø 2,31 s; Zielwerte je Shot-Typ (Hook 0,7–1,5 s … emotional 2,5–4 s), Variation wichtig.
5. Audio-Identität: akustisches Logo, Echo-Sound, Figurenmotive, Reveal-Sound, Erzählerstimme.
6. Konflikte ohne Misogynie/Gewalt-Humor: Loyalität vs. Ehrgeiz, Regel vs. Gewissen, Erinnerung vs. Wahrheit …
7. Anime: Story-Engines abstrahieren (Underdog, Macht mit Preis, verborgene Welt), keine Figuren/Designs kopieren.
8. Historie: menschliches Dilemma → fiktionalisierte Figur → realer Kontext; erfundene Zitate nie als echt ausgeben.
9. Franchise-Vorschlag „Das Echo-Archiv" (Nox, Mira, Pip, Kurator; Lanes Echo Cases / Archiv Trials / Memory Stories).
10. 34-s-Dramaturgie (Cold Open → Situation → Problem → Entscheidung → Konsequenz → Twist → Cliffhanger), drei Hook-Typen.
11. Style Lock + Character Reference → freigeben → sperren → daraus Shots; nie 15 unabhängige Text-to-Video-Prompts.
12. Austauschbare Video-Provider; Claude Code als Orchestrator; 7 Agenten; Remotion + FFmpeg; Quality Gate + menschliche Freigabe.
13. Lernmotor: 30-Tage-Plan, eigene Baseline nach ~20 Videos, Winner-Score (Completion 0,30, Shares 0,25, Follows 0,20, Watchtime 0,15, Kommentare 0,10).
14. KI-Transparenz (EU AI Act ab 02.08.2026, TikTok-AIGC-Label).

## Prüfung: Quellen & Aktualität
| Aussage | Status | Kommentar |
|---|---|---|
| Fruit Love Island > 3 Mio. Follower, Entfernungen | teilweise bestätigt | Entfernungen + Ende 28.03.2026 bestätigt; Followerzahl nicht unabhängig geprüft |
| Microdrama-Markt USA 2026 ~1,5 Mrd. USD (Reuters) | nicht geprüft | Reuters-Link im PDF; Zahl ohne Primärquelle übernommen → nur als Größenordnung |
| Shot-Länge Ø 2,31 s (Aktaş 2026, SAGE) | nicht geprüft | Stichprobe 10 ReelShort-Titel (klein). Unser E001: Ø 2,26 s |
| Veo-3.1-Preview am 22.10.2026 eingestellt | nicht geprüft | Für uns irrelevant, solange kein Videomodell freigegeben |
| EU AI Act Art. 50 ab 02.08.2026 | bestätigt | mehrere Kanzlei-/Fachquellen |
| Creator Rewards: > 1 min, 100 k Views/30 Tage | bestätigt (Sekundär) | Follower-Schwelle 10.000 ergänzt; In-App verifizieren |
| Sieben Agenten nötig | widersprochen | Siehe AGENT_ORGANIZATION: 2 Agenten + Skill reichen jetzt |
| Remotion als Schnitt-Engine | widersprochen | Lizenz: kostenpflichtig ab 4 Mitarbeitern (FAKT aus LICENSE.md) — im PDF nicht erwähnt |
| Winner-Score-Gewichte | ANNAHME | Plausibel, aber unbelegt; erst nach Baseline kalibrieren |

## Widersprüche / Lücken im PDF (und unsere Korrektur)
1. **Kein Serienende:** E10 endet mit „Lina arbeitet für die Gegenseite" → verletzt unsere Abschlussregel. Korrigiert: S1 löst den Lina-Konflikt auf, S2-Haken erst danach (`STORY_BIBLE.md`).
2. **Regel acht ohne Auflösung:** Neu definiert (Payoff E07/E09): „Ein Archivar darf sich nicht erinnern." Nox bricht sie, indem er sich erinnert.
3. **Wer schrieb „Lina lebt"?** Neu: Nox selbst (Signatur gebrochener Kreis) → Rewatch-Hebel, Payoff E09.
4. **Vision vs. Erinnerung unklar** (Kraft zeigt laut Pitch den *anderen* Ausgang): Vision zeigt den Weg, in dem Nox zurückkam → „Du hast es versprochen" bekommt in E10 doppelte Bedeutung.
5. **Mira packt sein Handgelenk** → geändert in Ärmel (gleiche Funktion, vermeidet Diskussion über Körperkontakt; siehe Policy-Frage).
6. **„Gegenseite" undefiniert** → „Die Ungezählten" (ehemalige Archivare, die Echos freigeben wollen), Staffel 2.
7. **Stack setzt bezahlte Dienste voraus** (ElevenLabs, Runway, Gemini) → Phase 1 läuft komplett lokal/kostenlos; Bezahldienste = Freigabepunkte.

## Abgleich mit den 17 Repositories
- PDF-Empfehlung „Remotion" ↔ Claude-Code-Video-Toolkit, OpenMontage (nutzen Remotion) → ersetzt durch eigenen Renderer (Lizenz).
- „Austauschbare Video-Provider" ↔ OpenMontage `provider_routing.py`/`video_selector.py` → genau dieses Muster, Phase 2.
- „Claude Vision + programmatische QC" ↔ OpenMontage `visual_qa.py`, `composition_validator.py` → unsere `qc.py` + Kontaktbogen.
- „Hook-Formeln / Retention-Analyse" ↔ youtube-agent-skill (`yt-script`, `yt-retention`) → Methodenreferenz für Analytics-Phase.
- „Code-animierte virale Videos" ↔ awesome-opus5-5-videos → bestätigt unseren Render-Ansatz.

## Übernommen in
Strategie (`COMPANY_STRATEGY.md`), Story (`STORY_BIBLE.md`), Pipeline (`episode.json`-Schema folgt PDF S. 19), QC (`QUALITY_STANDARDS.md`),
TikTok-Plan (`TIKTOK_STRATEGY.md`).
