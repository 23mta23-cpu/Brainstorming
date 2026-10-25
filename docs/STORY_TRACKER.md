# Story- & Continuity-Register

Regel: Keine neue große Serie, solange begonnene Kernhandlungen offen sind. Jede Folge braucht Teilabschluss + Fortschritt.

## Serien
| Serie | Status | Staffel | Ende geplant | Produziert | Veröffentlicht |
|---|---|---|---|---|---|
| Das Echo-Archiv | aktiv | S1 (10 Folgen) | ja — S1-Auflösung E10, Serienende S3 (`STORY_BIBLE.md` §6–7) | E01 (Pilot v2) | – |

## Episoden
| Folge | Skript | Story-Review | Render | QC tech | Freigabe | Veröffentlicht |
|---|---|---|---|---|---|---|
| E01 Regel Acht | IMPLEMENTED (`episode.json`, v2) | Agent: REVISE → 3 Blocker behoben (v2), Nachprüfung s. u. | TESTED (v2) | 14/14 PASS | ausstehend | – |
| E02–E10 | PLANNED (Outline) | – | – | – | – | – |

## Offene Handlungsstränge
| ID | Frage / Plant | Eingeführt | Geplante Auflösung | Status |
|---|---|---|---|---|
| M1 | Wer ist Lina, warum vergisst Nox sie? | E01 | E10 | offen |
| P1 | Siegel: sieben Kerben + glimmende achte | E01 | E07 (Inschrift Regel acht) / E09 | offen |
| P2 | „Lina lebt." mit Nox' gebrochenem Kreis signiert | E01 | E09 (Nox' frühere Notizen) | offen |
| P3 | Pips Nadel zeigt zur Tür | E01 | E08 (zeigt auf das Echo des früher nicht gewählten Weges — hier Nox' eigenes) | offen |
| P4 | „Du hast es versprochen" (Vision = Weg, in dem Nox zurückkam) | E01 | E10 (Wiedersehen) | offen |
| Q1 | Woher hat Mira das Foto, warum weint sie „schon wieder"? | E01 | E03 (sie beobachtet die Schleife) | offen |
| Q2 | Warum öffnet die Tür sich von selbst? | E01 | E09 (Nox' eigenes Echo ruft ihn) | offen |
| Q3 | Nachname „Veyr" auf der Uhr | E01 | E02 (Linas Brief) | offen |
| Q4 | „Lina lebt." — wer hielt sie für tot? | E01 | E06 (Archiv führt Angehörige als „verstorben", um Bindungen zu kappen), bestätigt E09 | offen |
| Q5 | Wen alarmiert das Warnlicht? | E01 | E03 (Kurator weiß Bescheid; Mira muss berichten) | offen |
| P5 | Lina hält in Vision und auf dem Foto denselben Brief | E01 | E02 „Der Brief" | offen |
| P6 | Innere versiegelte Tür hinter der Uhr | E01 | E07 (Stille Kammer, Regel acht) | offen |
| P7 | Fotoecke in Miras Mantel | E01 | E03 (Mira trägt Nox' versteckte Spuren) | offen |
| P8 | Mira: „Nicht schon wieder." | E01 | S12 derselben Folge + E09 (Schleife) | offen |
| L1 | Erinnerungen fließen in die Uhr | E01 | S3 (gelöschte Erinnerungen werden zu Echos) | offen |

## Story-Review E01 — Agentenlauf 1 (`story-reviewer`): VERDICT REVISE
Blocker und Umsetzung (v2):
1. Hook verfehlt ≤ 1,5 s („acht" bei ~3,3 s) → VO neu: „Nox brach Regel acht." (acht bei ~1,2 s) / „Offiziell gibt es nur sieben."; achter Slot ab Frame 0 sichtbar; leises Ticken hinter der Tür (Echo ruft).
2. Tür/Uhr reagieren vor Hautkontakt (Widerspruch Kanon 1) → Kanon präzisiert: Visionen/Preis nur bei Hautkontakt, das eigene Echo kann rufen.
3. Vision las sich als echte Vergangenheit → Zug fährt ein, POV aus der Zugtür, Lina hoffnungsvoll (nicht gewählter Weg, fair für E10).
Übernommene Verbesserungen: Nox flüstert „Lina." beim Verlust (S10); Mira mit Handschuhen und eigenem Siegel-Können (S04), Hand im Bild bei Off-Stimme (S07);
langsameres Sprechtempo (S06, S11, S12); Vorraum + innere Tür (S05, Kanon-Widerspruch zu E07 behoben); Fotoecke als Vorbereitung (S03); Handschuh hält Foto (S13).
Eigener Kontinuitätsfix: Kinderfoto zeigte Nox im Archivmantel → Navy-Pullover + ocker Schal (Kanon 8).
Pip-Definition geschärft (Kanon 4 / §3), damit P3 keine Lüge ist.

## Story-Review E01 — Selbstreview (v1, historisch)
- Ursache-Wirkung: Echo ruft → Tür öffnet → Warnung → Entscheidung (Berührung) → Vision → Preis → Twist (schon wieder) → Cliffhanger. ✔
- Figurenkonsistenz: Mira handelt aus Regeltreue *und* Sorge (Konflikt Regel/Gewissen). ✔
- Logik-Korrekturen ggü. PDF: Regel acht definiert, Notiz-Autor definiert, Vision-Logik definiert, Körperkontakt angepasst. ✔
- Risiko: „Regel acht" wird im Pilot nicht erklärt — beabsichtigte Lücke, Auflösung E07/E09 eingeplant.
- Halal/Policy: keine Verstöße gefunden. ✔
