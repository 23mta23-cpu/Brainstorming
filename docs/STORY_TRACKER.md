# Story- & Continuity-Register

Regel: Keine neue große Serie, solange begonnene Kernhandlungen offen sind. Jede Folge braucht Teilabschluss + Fortschritt.

## Serien
| Serie | Status | Staffel | Ende geplant | Produziert | Veröffentlicht |
|---|---|---|---|---|---|
| Das Echo-Archiv | aktiv | S1 (10 Folgen) | ja — S1-Auflösung E10, Serienende S3 (`SERIEN_HANDBUCH.md` §6–7) | E01 (Pilot v2) | – |

## Episoden
| Folge | Skript | Story-Review | Render | QC tech | Freigabe | Veröffentlicht |
|---|---|---|---|---|---|---|
| E01 Regel Acht | v2 PASS (Commit `006911a`); **v3.2** (59,3 s, Bildstil v3) | v3 REVISE → v3.1 **PASS** | **v3 gerendert** (25.10.) | 15/15 PASS, Whisper 15/15 | ausstehend (Anhören!) | – |
| E02 Der Brief | v1.2 (Mindestdauern 60,5 s) | v1.0 REVISE (7) → v1.1 REVISE (2, ohne neues Bild) → v1.2 behoben | in Produktion | – | – | – |
| E02–E10 | PLANNED (Outline) | – | – | – | – | – |

## Offene Handlungsstränge
| ID | Frage / Plant | Eingeführt | Geplante Auflösung | Status |
|---|---|---|---|---|
| M1 | Wer ist Lina, warum vergisst Nox sie? | E01 | E10 | offen |
| P1 | Siegel: sieben leuchtende Kerben + dunkle achte | E01 | E07 (Inschrift Regel acht) / E09 | offen |
| P2 | „Lina lebt." mit Nox' gebrochenem Kreis signiert | E01 | E09 (Nox' frühere Notizen) | offen |
| P3 | Pips Nadel zeigt zur Tür (S05) | E01 | E08 (zeigt auf das Echo des früher nicht gewählten Weges — hier Nox' eigenes) | offen |
| P4 | „Du hast es versprochen" (Vision = nicht gewählter Weg des Rückkehrtages) | E01 | E10 (Wiedersehen in der Gegenwart) | offen |
| Q1 | Woher hat Mira das Foto, warum weint sie „schon wieder"? | E01 | E03 (sie beobachtet die Schleife) | offen |
| Q2 | Warum öffnet die Tür sich von selbst? | E01 | E09 (Nox' eigenes Echo ruft ihn) | offen |
| Q3 | Nachname „Veyr" auf der Uhr | E01 | E02 (Unterschrift „N. Veyr … das bin ich.") | in E02 eingelöst (nach Freigabe) |
| Q4 | „Lina lebt." — wer hielt sie für tot? | E01 | E06 (Archiv führt Angehörige als „verstorben", um Bindungen zu kappen), bestätigt E09 | offen |
| Q5 | Wen alarmiert das Warnlicht? | E01 | E03 (Kurator weiß Bescheid; Mira muss berichten) | offen |
| P5 | Lina hält in Vision und auf dem Foto denselben Brief | E01 | E02 „Der Brief" | in E02 eingelöst (nach Freigabe) |
| P6 | Innere versiegelte Tür hinter der Uhr | E01 | E07 (Stille Kammer, Regel acht) | offen |
| P7 | Fotoecke in Miras Mantel | E01 | E03 (Mira trägt Nox' versteckte Spuren) | offen — **v3: in S06 nicht sichtbar** (Bildmodell setzte das Foto zweimal an Nox; Edit-Korrektur versagte, Fremdfoto wegretuschiert). Mira zeigt das Foto erst in S16; Payoff E03 bleibt gedeckt. Nachholen in E02/E03 möglich |
| P8 | Mira: „Nicht schon wieder." | E01 | S16 derselben Folge + E09 (Schleife) | offen |
| L1 | Erinnerungen fließen in die Uhr | E01 | S3 (gelöschte Erinnerungen werden zu Echos) | offen |
| P9 | „ANNAHME VERWEIGERT — N. Veyr": Nox lehnte Linas Brief ungeöffnet ab (wenige Tage vor dem Rückkehrtag, Prüfung) | E02 | E10 | offen |
| P10 | „Jeden Tag um sieben" am Bahnhof | E02 | E10 (Abend, Regen) | offen |
| N3 | Wie kam Linas Brief ins Archiv? | E02 | Handbuch §6: zur Abreise geschrieben → kurz vor dem Rückkehrtag geschickt → von Nox verweigert → zurück zu Lina → am Bahnsteig liegen gelassen → Nachhall/Poststelle; gezeigt E10 | geplant |
| N4 | Woher weiß Mira, dass der Brief von „ihr" ist, warum bricht sie das Siegel? | E02 | E03 (sie kennt die Schleife, versteckt seine Notizen) | offen |
| L2 | Poststelle/Zustellung (nicht leuchtende Post darf zugestellt werden) | E02 | Kanon, Handbuch §2 | Lore |
| N1 | Woran erinnert sich Nox, damit sein Echo ruft? | E01 v3 | geklärt in Handbuch §6: an das Versprechen (eigene Notiz vor E01); gezeigt E09 | geplant |
| N2 | Wer ist der Erzähler? | E01 v3 | geklärt: neutrale Chronik-Stimme (Handbuch §2) | geklärt |

## Story-Review E01 — Agentenlauf 1 (`story-reviewer`): VERDICT REVISE
Blocker und Umsetzung (v2):
1. Hook verfehlt ≤ 1,5 s („acht" bei ~3,3 s) → VO neu: „Nox brach Regel acht." (acht bei ~1,2 s) / „Offiziell gibt es nur sieben."; achter Slot ab Frame 0 sichtbar; leises Ticken hinter der Tür (Echo ruft).
2. Tür/Uhr reagieren vor Hautkontakt (Widerspruch Kanon 1) → Kanon präzisiert: Visionen/Preis nur bei Hautkontakt, das eigene Echo kann rufen.
3. Vision las sich als echte Vergangenheit → Zug fährt ein, POV aus der Zugtür, Lina hoffnungsvoll (nicht gewählter Weg, fair für E10).
Übernommene Verbesserungen: Nox flüstert „Lina." beim Verlust (S10); Mira mit Handschuhen und eigenem Siegel-Können (S04), Hand im Bild bei Off-Stimme (S07);
langsameres Sprechtempo (S06, S11, S12); Vorraum + innere Tür (S05, Kanon-Widerspruch zu E07 behoben); Fotoecke als Vorbereitung (S03); Handschuh hält Foto (S13).
Eigener Kontinuitätsfix: Kinderfoto zeigte Nox im Archivmantel → Navy-Pullover + ocker Schal (Kanon 8).
Pip-Definition geschärft (Kanon 4 / §3), damit P3 keine Lüge ist.

## Story-Review E01 — Nachprüfung (Lauf 2): VERDICT PASS
Alle 3 Blocker behoben, keine neuen. Hinweise umgesetzt: Uhr-Echo = Entscheidung am Tag der versprochenen Rückkehr (Handbuch §6);
Kanon 1 präzisiert (alle Wirkungen nur bei Hautkontakt; Rufen nur, solange der Besitzer sich erinnert → nur Nox' Echo ruft);
E10 visuell von S09 abgegrenzt (Gegenwart, Lina ~16, Regen); E08 begründet (Kurator trägt Nox' Abschieds-Echo); P1-Text aktualisiert.

## Story-Review E01 — Selbstreview (v1, historisch)
- Ursache-Wirkung: Echo ruft → Tür öffnet → Warnung → Entscheidung (Berührung) → Vision → Preis → Twist (schon wieder) → Cliffhanger. ✔
- Figurenkonsistenz: Mira handelt aus Regeltreue *und* Sorge (Konflikt Regel/Gewissen). ✔
- Logik-Korrekturen ggü. PDF: Regel acht definiert, Notiz-Autor definiert, Vision-Logik definiert, Körperkontakt angepasst. ✔
- Risiko: „Regel acht" wird im Pilot nicht erklärt — beabsichtigte Lücke, Auflösung E07/E09 eingeplant.
- Halal/Policy: keine Verstöße gefunden. ✔
