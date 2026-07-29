# Phase 2: Spezifikation einer vollständigen Demolektion (Vertical Slice)

> **Status: zur Umsetzung freigegeben** (Gründerentscheidung vom 29.07.2026, siehe `docs/decision-log.md`).
> Freigegeben ist **genau eine Demolektion** in vereinfachter Form — nicht die Gesamt-App und kein Release.
> **Grundlage:** eigener Durchlauf des Prototyps auf `claude/mobile-prototype-v1-drdk35` bei 390 × 844 px, drei getrennte Agentenaufträge (CPO, Learning Science, UX/UI), zusammengeführt und anschließend durch den Gründer geprüft und vereinfacht.
> **Kennzeichnung:** **[F]** aus Code/Dokumentation belegbar oder reine Arithmetik · **[S]** Produktsetzung für diesen Test, **keine wissenschaftliche Norm** · **[E]** Empfehlung · **[G]** verbindliche Gründerentscheidung vom 29.07.2026 · **[O]** offen
> **Noch nicht umgesetzt.** Dieses Dokument ist die Bauanweisung, nicht der Bau.

---

## 1. Ungefiltertes Urteil zum aktuellen Prototyp

1. **[F]** Der Prototyp meldet Lernerfolg, den es nicht gibt. `markLessonComplete()` (`app.js:1047`) setzt `{letters:3, lessons:1, minutes:5}` unabhängig vom Ergebnis. Im Test mit 1 von 3 richtigen Antworten meldete die App „Erkannte Buchstaben: 3 von 28", „1 Lektion", „5 Minuten". Die Minutenzahl ist frei erfunden — es wird keine Zeit gemessen.
2. **[F]** Die App weiß es besser und wirft es weg. `round.score` zählt nur Ersttreffer, `round.results` trennt `correct` von `retry`, `state.qb.wrongIds` überlebt Reloads. Diese ehrlichen Daten existieren und werden von einer einzigen Zeile überschrieben.
3. **[F]** Kein Ergebnis kann Können von Raten trennen. Die Distraktoren sind in **jeder** Zeichenfrage die Konstante `CHARS = ["ا","ب","ت"]` (`app.js:414`). Bei drei Buchstaben und drei festen Optionen: 33 % Ratequote, Ausschlussstrategie möglich.
4. **[F]** Fehlerdiagnose ist heute technisch unmöglich. `state.qb.wrongIds.push(q.id)` (`app.js:911`) speichert die Frage-ID, **nicht die gewählte Antwort**. Die App kann nicht wissen, ob ب mit ت verwechselt wurde oder mit ا. „Fehler wiederholen" kann deshalb nur dieselbe Frage mit denselben Optionen erneut stellen — das trainiert Antwortpositionen, nicht Buchstaben.
5. **[F]** Sieben Aufgabentypen sind eine Etikettierung, keine Übungsvielfalt. Alle sieben sind dieselbe Geste: drei Kacheln antippen. `oddOneOut-alif` und `nameToChar-alif` sind bei drei Optionen inhaltlich dieselbe Frage.
6. **[F]** Ein Screen lehrt aktiv Falsches. Entdecken-Post 2 (`index.html:201–224`) zeigt ب mit seinem echten Punkt **plus** einem dekorativen `.post-dot` und ت mit zwei echten **plus** zwei dekorativen — der Lernende sieht ب mit zwei und ت mit vier Punkten, in genau der Lektion, in der Punkte gezählt werden.
7. **[F]** Die Buchstabenform ist unkontrolliert. Der `.arabic`-Stack nennt neun Schriften, von denen keine mitgeliefert wird. Auf einem System ohne diese Schriften fällt alles auf DejaVu Sans zurück; die Punkte rendern dann als **Quadrate**. Bei einer Lektion, deren gesamter Inhalt „zähle und verorte die Punkte" ist, ist das ein möglicher Totalausfall des Lernziels.
8. **[F]** Der Prototyp widerspricht seinem eigenen Versprechen. Screen 1 wirbt mit „ohne endloses Scrollen", Tab 2 ist ein `scroll-snap-type: y mandatory`-Feed. Die Badges „20 Sek."/„30 Sek." beschreiben 3-Sekunden-CSS-Loops. Das sind nachweisbar falsche Angaben, keine Geschmacksfragen.
9. **[F]** Das Onboarding ist Dekoration. Vier Ausgangssituationen × fünf Lernziele = 20 Kombinationen führen alle in dieselbe Lektion. Die Hero-Empfehlung wird per Kalendertag-Modulo gewürfelt (`getDailyRecommendationKey`) und widerspricht der als „Aktiv" markierten Lektion. „Jetzt wiederholen" ruft `startLesson1()` (`app.js:1222`) und wiederholt nichts.
10. **[E]** Als Beweis, dass die Produktidee mehr wert ist als Karteikarten, ein YouTube-Video oder eine einfache Elifba-App, trägt der Prototyp heute nicht. Als Navigations- und Tonalitätsmuster ist er brauchbar. Er darf in diesem Zustand **nicht** in Nutzerinterviews — er würde Reaktionen auf Optik messen und als Lernbestätigung protokolliert.

### Gemeinsames Kurzurteil der drei Agenten

Alle drei kommen unabhängig zum selben Kern: Der Prototyp löst ein internes Problem (ein Konzept zeigbar machen), kein Nutzerproblem. Es besteht **kein Konflikt** zwischen den Bewertungen. Sie unterscheiden sich nur darin, welchen Defekt sie als blockierend benennen — CPO: unehrlicher Fortschritt; Learning Science: fehlende Antwortdaten; UX/UI: unkontrollierte Buchstabenform. Alle drei müssen vor dem ersten Lerntest behoben sein.

---

## 2. Ziel der Demolektion

| Feld | Festlegung |
|---|---|
| **Primäre Zielgruppe** | Deutschsprachige Erwachsene ab 18, die weniger als 2 von 5 vorgelegten arabischen Buchstaben (ا ب ت ن ي) korrekt benennen, und die in den letzten 12 Monaten mindestens einen Lernversuch begonnen und abgebrochen haben. |
| **[G] Wo das Screening stattfindet** | **Außerhalb der App**, im Rahmen der Rekrutierung. Das Fünf-Buchstaben-Screening ist **kein Bestandteil der Demolektion** und wird nicht in der App abgebildet. |
| **Warum ohne Wiedereinsteiger** | `docs/01` §6 empfiehlt „Anfänger:innen **und** Wiedereinsteiger:innen". Für **eine** Lektion über ا ب ت ist das nicht haltbar: Für Wiedereinsteiger ist der Inhalt per Definition bekannt, sie lernen nichts, und die implizite Botschaft „du fängst bei null an" ist genau die Kränkung, die `docs/01` §9 vermeiden will. Anfänger brauchen **Instruktion**, Wiedereinsteiger brauchen **Diagnose**. |
| **Testsprache** | **[E]** Nur Deutsch. Die TR-Lokalisierung bleibt im Code erhalten, wird aber nicht getestet. |
| **Konkretes Problem** | ب und ت teilen **dieselbe Grundform (Rasm)** und unterscheiden sich nur durch Punktzahl und Punktposition. Ohne diese Unterscheidung ist kein Lesen möglich. |
| **[G] Beobachtbares Kernziel** | **Bā und Tā anhand von Anzahl und Position ihrer Punkte sicher unterscheiden.** Konkret prüfbar: (1) in einem Raster aus 9 Zeichen alle ت markieren, ohne Vorlage, mit höchstens 1 Fehler; (2) ein kurz gezeigtes und wieder verdecktes ب oder ت aus 4 Optionen antippen, wenn mindestens zwei Ablenker dieselbe Grundform tragen; (3) an einer leeren Grundform die Punkte für ب bzw. ت an der richtigen Stelle setzen. |
| **Rolle von Alif** | Kontrastanker. ا eröffnet die Merkmalsachse „Punkte ja/nein" und ist **keine** Bestehensbedingung. |
| **Ausdrücklich NICHT Lernziel** | **[G]** Die Namen „Alif/Bā/Tā" sicher zu beherrschen — ohne Aussprache-Audio nicht ehrlich prüfbar. Namensfehler werden separat notiert, zählen aber **nicht** auf den Lernstatus. Ebenso nicht: Verbindungsformen, weitere Buchstaben, Qur'anlesen. |
| **Ergebnis nach einer Sitzung** | Ein ehrlicher Stand **pro Zeichen**: `today_secure`, `wobbly` oder `not_yet`. Keine Prozentzahl, keine Gesamtnote. |
| **[G] Grund für Rückkehr am nächsten Tag** | Am nächsten lokalen Kalendertag steht ein Kurzblock bereit, der mit den schwächsten Zeichen beginnt. Der Nutzen ist die Terminierung selbst: nichts sortieren, nichts einschätzen, nichts planen. |

### Das eine Versprechen, das diese Lektion einlösen muss

> **„Du siehst genau, welche Buchstaben du wirklich kannst und welche nicht — und morgen bekommst du ohne eigenes Zutun exakt die zurück, die du nicht konntest."**

**[E]** Bewusst **nicht** das Versprechen: „schön", „erwachsenengerecht", „strukturiert", „28 Buchstaben".

---

## 3. Keep / Remove / Rebuild

| Element | Entscheidung | Begründung |
|---|---|---|
| DE/TR-i18n-System (`I18N`) | **Behalten** | **[F]** Vollständig, keine Kosten, kein Risiko. |
| Question-Bank als Datenmodell | **Behalten** | **[F]** Saubere, erweiterbare Struktur. Nur die Inhalte sind schwach, nicht das Modell. |
| `state.qb.wrongIds`-Persistenz | **Behalten + ersetzen durch Antwortprotokoll** | **[F]** Richtige Idee, zu grobe Daten. |
| `round.results` correct/retry | **Behalten + erweitern** | **[F]** Bereits ehrlich, wird nachträglich zerstört. |
| Fragetyp `flash` + reduced-motion-Fallback | **Behalten** | **[F]** Der einzige Typ, der echten Abruf statt Wiedererkennen verlangt. Barrierefreiheit sauber gelöst. |
| Isolierte Arabisch-Darstellung (`setArabicText`, `dir`/`lang`/`translate="no"`) | **Behalten** | **[F]** Bidi-Isolation ist korrekt gelöst. |
| Lokale Datenhaltung + Löschfunktion + Datenschutzhinweis | **Behalten** | Richtige Haltung, DSGVO-konform. |
| Demo-/Prüfhinweise („fachliche Prüfung ausstehend") | **[G] Behalten** | Bleiben, solange die Blocker in §8 offen sind. |
| Lektion-2-Zuordnungsmuster (Chip wählen → Ziel wählen) | **Behalten als Interaktionsmuster** | Wird Basis der Punktplatzierung (Ponytail: vorhandene Struktur reicht). |
| `markLessonComplete()` | **Entfernen** | **[F]** Erzeugt die unehrliche Fortschrittsaussage. Ersatzlos streichen. |
| `getDailyRecommendationKey()` + Hero-Tagesempfehlung | **Entfernen** | **[F]** Zufall statt Lernlogik. |
| **[G] Entdecken-Feed vollständig** | **Entfernen** | Widerspricht der eigenen Positionierung, lehrt in Post 2 Falsches. |
| **[G] Medien-Kacheln auf Home** | **Entfernen** | Dublette des Entdecken-Tabs. |
| **[G] „x von 28"** | **Vollständig entfernen** | Nicht verstecken, nicht als „0 von 28" zeigen. Ersetzt durch Zustände pro Zeichen. |
| **[G] Statistik-Pill „Minuten" / „5 Minuten"-Claim** | **Entfernen** | **[F]** Es wird keine Zeit gemessen. |
| **[G] Nicht verzweigendes Onboarding** (Ausgangssituation, Lernziel) | **Entfernen** | **[F]** 20 Kombinationen, 1 Ergebnis. |
| **[G] Konvertiten-Option** | **Entfernen** | **[F]** Widerspricht `docs/decision-log.md` Z. 16 und beantwortet still eine offene Frage. Bleibt langfristige Zielgruppenfrage, siehe §12. |
| **[G] Lektion-3-Vorschau** | **Entfernen** | Zeigt gesperrten Inhalt ohne Nutzen. |
| **[G] Breite Produktvitrine** (Vorschau-Kacheln, „Für dich ausgewählt", Fortschritt-Tab) | **Entfernen** | Reine Schauflächen. |
| Dauer-Badges „20 Sek."/„30 Sek." | **Entfernen** | **[F]** Belegbar falsch (3-Sekunden-Loops). |
| `connectMorph`-Animation | **Entfernen** | **[F]** Animiert `letter-spacing: -6px` auf drei isolierten Glyphen (`styles.css:1137–1141`). Das ist kein Verbinden, sondern Zusammenschieben — es lehrt ein **falsches Formmodell**. |
| Dekorative `.post-dot`-Elemente | **Entfernen** | **[F]** Erzeugen falsche Punktzahlen. Dürfen nirgends wiederkehren. |
| **Fortschrittslogik** | **Neu denken** | Pro Zeichen, aus tatsächlichen Antworten, drei Zustände. |
| **Antwortdatenmodell** | **Neu denken** | **[F] Blockierend** — ohne gewählte Antwort keine Diagnose. Umfang siehe §10 (E1). |
| **Lektion 1 (drei Ansehen-Screens)** | **Neu denken** | Von „ansehen und Weiter tippen" zu „sehen → sofort abrufen → Fehler mit Merkmalsbegründung korrigieren". |
| **Aufgabentypen** | **Neu denken** | Vier Formen mit echten Interaktionsunterschieden statt sieben Etiketten. |
| **Distraktoren** | **Neu denken** | 4 Optionen, pro Item neu berechnet, nie konstant. |
| **Rückmeldungstexte** | **Neu denken** | „Noch nicht. Schau dir die Form noch einmal an." ist für jeden Fehlertyp identisch und bei ب/ت sachlich irreführend — die Form ist gleich, die Punkte unterscheiden sich. |
| **Arabische Schrift** | **Neu denken** | Frei lizenzierte, selbst gehostete Naskh-Schrift. Blocker B-1. |

---

## 4. Vollständiger Lernfluss

**[G] Zuschnitt:** ا als Kontrastanker, ب/ت als Diskriminationspaar. Übungsbudget ca. **20 % ا / 80 % ب ت**.

Begründung gegen die engere Alternative „nur ب/ت": Ohne ein punktloses Zeichen existiert die Merkmalsachse „Punkte ja/nein" nicht. Lernende können ب und ت dann trennen, ohne zu wissen, **woran**. Begründung gegen Gleichgewichtung: Sie schickt ein Drittel der Übungszeit in den Fall, den niemand falsch macht.

**[F] Didaktisch entscheidend:** ب und ت unterscheiden sich in **zwei** Dimensionen gleichzeitig — Anzahl (1 vs. 2) **und** Position (unten vs. oben). Wer nur eine Dimension nutzt, antwortet richtig und wirkt kompetent. Beide Dimensionen müssen **getrennt** geprüft werden.

**[G] Dauer:** Vor der Lektion wird **keine** Dauer versprochen. Nach Abschluss wird ausschließlich real gemessene aktive Zeit angezeigt — und wenn diese nicht zuverlässig gemessen werden kann, **gar keine Zeit**.

### Die fünf Hauptviews

**[G]** Höchstens fünf. Diagnose und Abschlussprüfung sind **Modi** der Übungsansicht, keine eigenen Views.

| View | Enthält |
|---|---|
| 1 `view-precheck` | Kurzer Vorcheck zu ا ب ت |
| 2 `view-stage` | Interaktive Lernbühne: Szenen + eingebettete Handlungen |
| 3 `view-practice` | Gemeinsame Übungsansicht. Aufgabenformen als Zustände: `flash` · `grid` · `dots` · `trait`. Modi: `practice` · `diagnosis` · `final` |
| 4 `view-result` | Ehrliches Ergebnis pro Zeichen |
| 5 `view-nextday` | Folgetags-Kurzprüfung |

### Ablauf

| # | View / Modus | Nutzeraktion | Lernziel | Dauer **[S]** | Mögliche Fehler | Reaktion der App |
|---|---|---|---|---|---|---|
| 1 | `precheck` — 3 Items zu ا ب ت, je 4 Namensoptionen, plus Button „kenne ich nicht" | Antippen | Ausgangsstand pro Zeichen festhalten | 40 s | Raten statt „kenne ich nicht" | **[G] Kein Richtig-/Falsch-Feedback.** Nur: „Danke – jetzt weiß die App, wo du startest." Wird als Ausgangsstand gespeichert |
| 2 | `stage` Szene 1 + Handlung A1 | Ansehen (4 s), dann tippen | Merkmalsachse eröffnen: ا hat keinen Punkt | 25 s | Tippt die Schale statt ا | Direkte Auflösung, keine Wertung, zählt nicht ins Ergebnis |
| 3 | `stage` Szenen 2–3 + Handlung A2 | Ansehen, dann Punkt setzen | ب = ein Punkt **unten**, produktiv erzeugt statt wiedererkannt | 45 s | Position vertauscht | Token springt zurück, Rückmeldung benennt die **Position** |
| 4 | `stage` Szene 4 + Handlung A3 | Ansehen, dann Punkte setzen | ت = zwei Punkte **oben** | 40 s | Anzahl oder Position falsch | Rückmeldung trennt Anzahl und Position ausdrücklich |
| 5 | `stage` Szene 5 + Handlung A4 (Rasterfund) | Ansehen, dann markieren | Merkmal auf mehrere Zeichen anwenden | 50 s | Positions-Ignorierer markieren auch ن | **Jede** Fehlmarkierung einzeln zeigen, nicht nur die Gesamtzahl |
| 6 | `stage` Szene 6 (statische Hinweistafel) | Lesen, weiter | Ehrliche Kennzeichnung: Isolationsform ist nur ein Teil | 10 s | – | Kein Test, kein Ergebnis |
| 7 | `practice` Modus `practice` — 8–10 Items, Aufgabenformen wechseln, Distraktorstufe steigt | Antippen / markieren / setzen | Sichere Ersttreffer über verschiedene Formen aufbauen | 2–3 min | Siehe §6 | Ersttreffer und Nachtreffer getrennt gezählt; Rückmeldung nennt immer das Merkmal |
| 8 | `practice` Modus `diagnosis` — nur bei Fehlern, 2–4 Items | Klassenspezifisch | Fehlerkategorie auflösen | 60–90 s | – | Nachübung ist **immer eine andere Aufgabenform** als die, in der der Fehler auftrat |
| 9 | `practice` Modus `final` — 6 Items, höchste Distraktorstufe, **kein Retry**, nur Ersttreffer zählt | Antippen / markieren / setzen | Können unter erschwerten Bedingungen zeigen | 90 s | – | **[G]** Andere Aufgabenformen bzw. Anordnung als im Vorcheck. Auflösung erst am Ende, Ergebnis **pro Zeichen** |
| 10 | `result` | Lesen | Ehrlichen Stand pro Zeichen sehen | 30 s | – | Drei Zustände, Ausgangsstand aus Schritt 1 als Vergleich, Ansage der morgigen Prüfung |
| 11 | `nextday` — max. 8 Items, beginnt mit dem schwächsten Zeichen | Antippen / markieren | Halten über eine Nacht zeigen | 2–3 min | localStorage weg (siehe §12) | Kann `overnight_secure` vergeben, siehe §7 |

**[G] Zum Vorcheck:** Vorcheck und Abschlussprüfung nutzen **unterschiedliche Aufgabenformen bzw. Anordnungen**. Der Vergleich zwischen beiden ist ein **Anhaltspunkt für das Gespräch**, keine wissenschaftlich validierte Vorher-/Nachher-Messung — und wird im Produkt und in Berichten auch nicht als solche dargestellt.

**[E] Transferregel:** Jede Erklärung endet in einer Handlung, und jede Handlung hat einen Transferschritt auf Material, das in der Erklärung nicht vorkam — z. B. die **Regel** „Punkte unten" auf ein nicht gelehrtes Zeichen anwenden. Geprüft wird das Merkmal, nicht die Buchstabenidentität. Das erweitert den Stoff nicht.

---

## 5. Medienkonzept

### **[G] Entscheidung: interaktive Animation. Kein Video in diesem Build.**

| Kriterium | Echtes Kurzvideo | Interaktive Animation |
|---|---|---|
| In dieser Umgebung herstellbar | **Nein** — kein H.264/MP4-Encoder (`README.md`) | Ja |
| Korrektur nach Fachprüfung | Neu-Encoding, externer Schritt | Codeänderung, sofort wirksam |
| **Buchstabenform** | **wird binär eingebrannt, bevor die Schrift geprüft ist** | bleibt austauschbar |
| Audio heute | stumm (kein geprüfter Sprecher, keine geklärten Rechte) | stumm by design, Text auf der Bühne |
| Barrierefreiheitsaufwand | Untertitel + Transkript + Audiodeskription + Player | `prefers-reduced-motion` + Standbild + Text |
| Übergang zum Handeln | harter Schnitt Zuschauen → Tun | Medium **endet in** der Handlung |

**Ausschlaggebend ist Zeile 3.** Ein Videoartefakt würde eine ungeprüfte Buchstabenform festschreiben, bevor Schrift- und Fachprüfung abgeschlossen sind. Das ist der inhaltliche Grund, nicht der fehlende Encoder. **Keine MP4-Abhängigkeit wird erzeugt.**

**Technische Form [E]:** handgeführte SVG-Pfad-Animation mit **eigens gezeichneten Outlines für genau drei Glyphen**, nicht mit Textglyphen aus der Systemschrift. Damit ist das Medium unabhängig vom Font-Fallback. Die **Übungen** brauchen weiterhin eine echte Schrift (Blocker B-1). Die Outlines sind selbst prüfpflichtig (Blocker B-3).

### Storyboard

**Format:** ein Lektionsbildschirm. Oben eine 9:16-Bühne (getönt, randlos, keine Bedienelemente), unten eine Aktionskarte (weiß, gerahmt). **Der Flächenwechsel ist das textfreie Signal „zuschauen vs. selbst handeln".** Stumm, kein Sprecher, kein Qur'antext.

**[G] Passivzeit gesamt: 20 s.** Längste ununterbrochene Passivstrecke: **5 s**. Die erste Nutzerhandlung erfolgt nach **4 Sekunden**.

| Nr | Art | Dauer | Sichtbar | Buchstabe | Bildschirmtext (DE) | Nutzeraktion |
|---|---|---|---|---|---|---|
| 1 | passiv | 4 s | Senkrechter Strich zeichnet sich oben → unten | ا | „Alif. Ein senkrechter Strich. Kein Punkt." | – |
| **A1** | **aktiv** | – | Aktionskarte, 2 Optionen | ا / leere Schale | „Tippe den senkrechten Strich an." | **Tippen** |
| 2 | passiv | 5 s | Links ا, rechts erscheint die leere Schale (ohne Punkt) | Grundform | „Dieser hier liegt. Noch ohne Punkt." | – |
| 3 | passiv | 4 s | Ein Punkt fährt ein, setzt sich **unter** die Schale, bleibt markiert | ب | „Ein Punkt unten → Bā." | – |
| **A2** | **aktiv** | – | Punktplatzierung: leere Schale, ein Punkt-Token, Felder oben/unten | ب | „Setze den Punkt für Bā." | **Token antippen, dann Feld antippen** |
| 4 | passiv | 4 s | Dieselbe Schale; zwei Punkte fahren ein, setzen sich **über** die Schale | ت | „Zwei Punkte oben → Tā." | – |
| **A3** | **aktiv** | – | Punktplatzierung mit zwei Token | ت | „Setze die Punkte für Tā." | **Antippen, dann Feld antippen** |
| 5 | passiv | 3 s | ب und ت nebeneinander, Punktgruppen leuchten **einmal** nacheinander auf | ب + ت | „Gleiche Form. Der Unterschied sind die Punkte." | – |
| **A4** | **aktiv** | – | Rasterfund: 9 Zeichen | ا/ب/ت + Distraktoren | „Markiere alle Tā." | **Mehrfachauswahl, dann bestätigen** |
| 6 | statisch | – | Hinweistafel, keine Animation, vom Nutzer weitergeschaltet | ب isoliert | „So sieht der Buchstabe **allein stehend** aus. Im Wort verändert er seine Form. Das lernst du später." | **Weiter** |

**Regeln [E]:** Unter `prefers-reduced-motion` wird jeder Übergang zum sofortigen Wechsel ohne Bewegung. Jede Szene hat ein Standbild als Fallback. Ein Transkript aller Bildschirmtexte ist abrufbar. **Kein dekorativer Zusatzpunkt** — jeder sichtbare Punkt gehört zum Buchstaben.

**Szene 6 ist nicht optional.** Sie ist die ehrliche Kennzeichnung, dass Isolationsformen nur ein Teil des Systems sind. Ohne sie erzeugt die Lektion ein falsches Vollständigkeitsgefühl.

### Freigabepunkte Audio (ausdrücklich später)

| ID | Punkt | Bedingung |
|---|---|---|
| **A-1** | Aussprache-Audio für Buchstabennamen | Erst nach geprüfter Aussprache **und** geklärten Nutzungsrechten. Bis dahin zählen Namensitems **nicht** auf den Lernstatus. |
| **A-2** | Jegliche Qur'anrezitation | **Nicht Teil dieser Demolektion.** Erst nach geprüftem Qari, geprüfter Aussprache und geklärten Audiorechten. Keine Musik darunter. Keine TTS-Ersatzlösung. Hier ist der Islamic-Governance-Prozess zwingend. |

---

## 6. Übungskonzept

**Grundregeln [E]:** 4 Optionen · Distraktorset **pro Item neu berechnet**, nie konstant · innerhalb einer Runde kein identisches Optionsset zweimal · **keine erfundenen Glyphen, keine gespiegelten oder verdrehten Fantasiezeichen**.

### **[G] Bedingungen für Distraktoren**

Visuell ähnliche, noch nicht gelehrte Zeichen dürfen als Distraktoren erscheinen, wenn **alle** Bedingungen erfüllt sind:

1. Ihre Form wurde fachlich geprüft (Blocker B-3).
2. Ihre Namen werden **nicht** zusätzlich gelehrt.
3. Sie dienen ausschließlich als visuelle Ablenkung.
4. Das Zielzeichen kommt nicht versehentlich doppelt vor.
5. Es werden **keine** falschen oder dekorativ veränderten Punktzahlen gezeigt.

**[G] Zuständigkeit:** Die Prüfung ist zunächst eine **Arabisch-/Elifba- und Schriftprüfung**. Der Islamic-Governance-Prozess wird zusätzlich benötigt, sobald religiöse Inhalte oder religiöse Einordnungen betroffen sind — bei einer reinen Buchstabenform- und Punktprüfung ist er nicht der zuständige Weg.

### Distraktorstufen

| Ziel | Stufe 1 | Stufe 2 | Stufe 3 (Abschluss) | Was die Stufe prüft |
|---|---|---|---|---|
| ا | ب, ت, ن | ب, ت, ي | ل + 2 bepunktete | Unterscheidung ا/ل statt nur „hat keine Punkte" |
| ب | ا, ت, ن | ت, ث, ن | ت, ث, ي | ث = Anzahl bei gleicher Seite · ن = Position bei gleicher Anzahl · ي = Anzahl unten |
| ت | ا, ب, ي | ب, ث, ن | ب, ث, ن | ث = 3 statt 2 oben · ن = 1 statt 2 oben · ب = Gegenprobe |

**[E] Umgang mit nicht gelehrten Zeichen:** Distraktoren werden **nie benannt** und nie als „falsches Zeichen" bezeichnet. Rückmeldung bei Wahl eines untrainierten Zeichens sinngemäß: „Das ist ein anderer Buchstabe, den du später lernst. Tā hat zwei Punkte **oben**." — Aussage über das Ziel, nicht über den Distraktor. Keine Aufgabe vom Typ „Welches ist kein Buchstabe?".

### Die vier Übungsarten

Alle vier sind Zustände **derselben** View `view-practice`, keine eigenen Hauptviews.

| # | Übung (`taskType`) | Aufgabe | Richtige Lösung | Typische Fehler | Unmittelbares Feedback | Spätere Wiederholung |
|---|---|---|---|---|---|---|
| **Ü1** | `flash` — verdeckter Abruf *(existiert)* | Zeichen erscheint 1100 ms, wird verdeckt, dann 4 Optionen | Das gezeigte Zeichen | Wahl aus derselben Formfamilie; bei `prefers-reduced-motion` selbstgesteuertes Weiterschalten | Nennt das Merkmal: „Richtig. ب – ein Punkt **unten**." Bei Fehler: „Das war ت – zwei Punkte oben. Bā hat einen Punkt unten." | Zählt auf `today_secure`. Bei Fehler → Ü3 oder Ü4 je nach Kategorie, **nie dieselbe Frage sofort erneut** |
| **Ü2** | `grid` — Rasterfund *(neu)* | Raster aus 9 Zeichen, „Markiere alle Tā", Mehrfachauswahl + Bestätigen | Genau die ت-Zeichen | Positions-Ignorierer markieren auch ن; Anzahl-Ignorierer auch ث | **Jede** Fehlmarkierung einzeln zeigen und benennen, nicht nur „3 von 4 richtig" | Zählt als **produktive** Aufgabe. Deckt Positionsfehler zuverlässiger auf als jede Auswahlfrage |
| **Ü3** | `dots` — Punktplatzierung *(neu)* | Leere Grundform + Punkt-Token; Punkte oben oder unten setzen | ب: 1 Punkt unten · ت: 2 Punkte oben | Position vertauscht; Anzahl falsch | Token springt zurück, Rückmeldung benennt **Position** getrennt von **Anzahl** | Zählt als **produktive** Aufgabe. Nicht ratbar |
| **Ü4** | `trait` — Merkmalsfrage (Text) | „Wie viele Punkte hat dieses Zeichen und wo?", 4 Textoptionen | z. B. „ein Punkt unten" | Zählt richtig, verortet falsch (oder umgekehrt) | Trennt die Achsen ausdrücklich: „Anzahl stimmt. Die Position nicht." | Diagnostisch: trennt Anzahl- von Positionsfehler |

**[E] Optionsset für Ü4 muss Anzahl und Position kreuzen**, sonst ist die Frage durch bloßes Zählen lösbar: „keine Punkte" / „ein Punkt unten" / „ein Punkt oben" / „zwei Punkte unten" / „zwei Punkte oben" / „drei Punkte oben" — davon 4 pro Item, immer mit mindestens einem Positions- und einem Anzahl-Ablenker.

**[E] Ausdrücklich gestrichen:** Die heutigen Typen `oddOneOut` und `trait` (alt) sind bei drei Optionen inhaltliche Dubletten von `nameToChar`. Namensitems bleiben als **Lehrelement** erhalten, zählen aber bis zur Audio-Freigabe (A-1) **nicht** auf den Lernstatus.

### **[G] Fehlerkategorien — genau drei**

**[F] Voraussetzung:** Ohne Speicherung der **gewählten Option** ist keine Kategorie erkennbar. Heute wird nur die Frage-ID gespeichert.

| Kategorie (gespeichert) | Beschreibung | Signal | Nachübung |
|---|---|---|---|
| `shape_confusion` | Grundform bzw. Formfamilie nicht erkannt | `picked` = ا obwohl ب/ت gefragt, oder umgekehrt ein bepunktetes Zeichen bei Ziel ا | Ü2 ohne Punktbezug: „Alle Zeichen mit dieser Schale markieren". Punktfragen aussetzen, bis gelöst |
| `dot_count_confusion` | Punktanzahl verwechselt, Position stimmt | Ziel ت → `picked` ث · Ziel ب → `picked` ي | 3× Ü4 mit gleichbleibender Position, dann 2× Rückführung auf Ü1 |
| `dot_position_confusion` | Position oben/unten verwechselt, Anzahl stimmt | Ziel ب → `picked` ن · Fehlplatzierung in Ü3 | 3× Ü3 (produktiv), dann 2× Ü1 mit ausschließlich Positionsdistraktoren |

**[G] Direkte ب/ت-Verwechslung:** Ziel ب → `picked` ت (oder umgekehrt) unterscheidet sich in **beiden** Dimensionen, die Ursache ist also zunächst unbestimmt. Sie löst eine **kurze Diagnose** aus: ein Anzahl-Item (Ü4) und ein Positions-Item (Ü3). Das Ergebnis wird als `dot_count_confusion` **oder** `dot_position_confusion` gespeichert. **Es entsteht keine eigene vierte Fehlerkarriere.**

**[G] Namensfehler** werden separat notiert (`nameMiss`), zählen aber ohne freigegebenes Audio **nicht** auf den Lernstatus und lösen keine Nachübung aus.

**[G] Ausdrücklich entfernt für den ersten Build:**
- automatische Kategorie „Rateverhalten",
- automatische Kategorie „Flüchtigkeit",
- jede psychologische Interpretation der Antwortzeit.

**Begründung:** Antwortgeschwindigkeit ist kein verlässlicher Indikator für Lernverhalten. Unterschiedliche Bediengeschwindigkeiten, Motorik, Hilfsmittelnutzung und Aufmerksamkeit dürfen **nicht** als Lernschwäche oder als Raten ausgelegt werden. Ein langsamer oder schneller Nutzer ist kein schlechterer Nutzer.

---

## 7. Fortschritt und Wiederholung

### **[G] Wann ein Zeichen am selben Tag als sicher gilt**

`today_secure`, wenn **alle vier** Bedingungen erfüllt sind:

| Bedingung | Wert |
|---|---|
| Verschiedene Aufgabenformen im **ersten Versuch** richtig | **≥ 3** |
| darunter verdeckter Abruf (`flash`) | **≥ 1** |
| darunter produktive Aufgabe (`grid` oder `dots`) | **≥ 1** |
| Zwischen dem ersten und dem letzten dieser Treffer lagen andere Items | **≥ 2** |

**[G] Kein künstliches Warten** von zwei Minuten innerhalb der Lektion. Der Abstand wird über dazwischenliegende Items hergestellt, nicht über die Uhr.

### Zustände

| Zustand | Bedingung |
|---|---|
| `today_secure` | alle vier Bedingungen erfüllt |
| `wobbly` | mindestens 1 Ersttreffer, Kriterium nicht erfüllt, oder überwiegend Nachtreffer |
| `not_yet` | kein Ersttreffer oder Mehrheit falsch |
| `overnight_secure` | **[G]** Wird **ausschließlich** in der Folgetagsprüfung vergeben, wenn das Zeichen dort in **≥ 2 verschiedenen Aufgabenformen im ersten Versuch** richtig beantwortet wurde |

**[S] Ausdrücklich:** Die Werte 3 / 1 / 1 / 2 und die 2 Formen am Folgetag sind **Produktsetzungen für diesen Test**, keine wissenschaftliche Norm und kein belegter Standard. Wenn im Test fast alle oder fast niemand das Kriterium erreicht, sind die Werte falsch gewählt und werden angepasst — nicht die Testpersonen.

### **[G] Kein „x von 28"**

Die Zahl wird **vollständig entfernt** — nicht versteckt und nicht als „0 von 28" angezeigt. Die Ergebnisansicht zeigt ausschließlich pro Zeichen: **heute sicher · noch wackelig · noch nicht sicher**.

### Bestehenskriterium der Lektion

**[S]** Bestanden, wenn ب **und** ت den Status `today_secure` erreichen. ا ist Kontrastanker, keine Bestehensbedingung. **Nicht bestanden ist ein regulärer, nicht beschämender Ausgang.**

### Was bei Fehlern geschieht

| Wann | Was |
|---|---|
| Sofort nach dem Fehler | Auflösung **mit Merkmalsbegründung**, nie nur „falsch" |
| Nach 2 dazwischenliegenden Items | Dasselbe Zeichen, **andere** Aufgabenform. Sofortwiederholung ist verboten — sie prüft nur das Echo im Arbeitsgedächtnis |
| Modus `diagnosis` | Gezielte Nachübung je Kategorie (§6) |
| Modus `final` | Jedes zuvor falsche Zeichen kommt nochmals vor, in einer bis dahin **nicht verwendeten** Form |

### **[G] Terminierung — bewusst minimal**

| Regel | Wert |
|---|---|
| `dueDate` | **nächster lokaler Kalendertag** (`YYYY-MM-DD`) |
| Wiederholungsblöcke | genau **einer** |
| Items pro Block | maximal **8**, beginnend mit dem schwächsten Zeichen |
| Streak | **keiner** |
| Strafe bei verpasstem Tag | **keine**, kein Reset, kein Zähler |

**[G] Eine vollständige 1-/2-/4-Tage-Spaced-Repetition-Engine wird im nächsten Build weder implementiert noch spezifiziert.** Sie ist bewusst zurückgestellt, bis der einfache Folgetagsblock nachweislich funktioniert.

### Ehrliche Fortschrittssprache

| Situation | Formulierung | Verboten |
|---|---|---|
| `today_secure` | „**ت – heute sicher.** Du hast es in drei verschiedenen Aufgabenformen im ersten Versuch richtig erkannt. Morgen prüfen wir kurz, ob es geblieben ist." | „Du beherrschst ت" |
| `today_secure`, Folgetag offen | „**ب – heute sicher, noch nicht über Nacht geprüft.**" | „Gemeistert", Häkchen ohne Text |
| `wobbly` | „**ب – noch wackelig.** Zwei Aufgaben hattest du sofort richtig, zwei erst im zweiten Versuch. Das ist ein normaler Zwischenstand. Morgen kommt ب zuerst." | „Fast geschafft!", „Gut gemacht!" |
| `not_yet` | „**ت – noch nicht sicher.** Du hast ت dreimal mit ب verwechselt. Der Unterschied liegt bei den Punkten: ب einer unten, ت zwei oben. Morgen fangen wir damit an." | „Leider falsch", „Nicht dein Tag" |
| `overnight_secure` | „**ت – auch nach einer Nacht sicher.**" | Verwendung vor der Folgetagsprüfung |
| Lektion bestanden | „**Lektion bestanden.** ب und ت erkennst du heute sicher, ا war dein Vergleichspunkt. Morgen bekommst du beide noch einmal – ohne dass du etwas einstellen musst." | „x von 28"; jede Dauer, die nicht gemessen wurde |
| Nicht bestanden | „**Noch nicht bestanden – und das ist in Ordnung.** ب sitzt bereits, ت verwechselst du noch mit ب. Genau daran arbeiten wir morgen weiter, mit einer anderen Übungsform. Du fängst nicht von vorn an." | „Fehlgeschlagen", Prozentnote, Vergleich mit anderen |

**[G] Zur Zeitangabe:** Wenn aktive Zeit zuverlässig gemessen wird, darf sie nach Abschluss genannt werden. Wenn nicht, wird **keine** Zeit angezeigt. Vor der Lektion wird nie eine Dauer versprochen.

---

## 8. UX- und Designrichtung

> Noch **keine** vollständige `DESIGN.md`. Das ist bewusst: Das Schriftsystem (Blocker B-1) bestimmt Größen, Zeilenhöhen und Badge-Maße.

| Bereich | Vorgabe |
|---|---|
| **Visuelle Hierarchie** | Genau **ein** primärer Call-to-Action pro Screen. Alle `.section-title` sind heute identisch formatiert (14 px, uppercase, muted) → es gibt keine Rangordnung. Zwei Ebenen einführen. |
| **Bühne vs. Aktionskarte** | Der Flächenwechsel ist das **textfreie** Signal „zuschauen vs. handeln". Heute sind Lektions- und Übungs-Screen strukturell identisch; einziger Unterschied ist die 13-px-Eyebrow „Übung". Zu wenig. |
| **Abstände** | Spacing-Skala als Token (4 / 8 / 12 / 16 / 24 / 32). Heute 2–22 px ad hoc, obwohl Radius und Shadow bereits tokenisiert sind. |
| **Leerraum** | `justify-content: safe center` erzeugt **244 px (29 %)** Leerraum über dem Übungsinhalt, während Frage und Antwortkacheln darunter gedrängt stehen. Übungsansicht auf `flex-start` mit definiertem Kopfbereich. Aktionsflächen gehören in die Daumenzone. |
| **Farbeinsatz** | **Grün darf nicht gleichzeitig „richtig" und „primäre Aktion" bedeuten** — heute sind Weiter-Button und Richtig-Markierung dieselbe Farbe. Fehler nie allein über Farbe kodieren (Text + Position + Form). |
| **Typografie** | Maximal 6 Stufen. Heute 19 Ad-hoc-Größen von 11 bis 118 px. Mindestgröße Fließtext 15 px. `rem` statt `px`, damit Systemschriftgrößen greifen. |
| **Arabische Schrift** | Frei lizenzierte, selbst gehostete Naskh-Schrift als WOFF2 (**Blocker B-1**). Bis dahin gilt jede Buchstabendarstellung als **ungeprüft**. Punktabstand muss bei 100 px **und** 15 px eindeutig bleiben. `line-height` ≥ 1.2 beibehalten. |
| **Light / Dark Mode** | **[F] Sofort zu beheben:** Hero-Button im Dark Mode `--accent-strong` #74e0b4 auf #ffffff = **1,61 : 1**. WCAG AA verlangt 4,5 : 1 (3,0 : 1 für großen Text). Light Mode ist mit 7,77 : 1 in Ordnung. Alle Paare neu messen. |
| **Animationen** | Nur zweckgebunden: Aufmerksamkeit auf das Merkmal lenken. Keine Dauerschleifen. **`prefers-reduced-motion` muss `softShake` einschließen** — heute deckt der Block (`styles.css:1143–1149`) nur `.post-alif-path`, `.post-dot` und `.connect-glyph` ab. |
| **Feedback** | Muss das **Merkmal** nennen. Heute für **jeden** Fehlertyp identisch „Noch nicht. Schau dir die Form noch einmal an." — bei ب/ت sachlich irreführend, denn die Form ist gleich. `.feedback` hat `min-height: 20px` → Layoutsprung bei zweizeiliger Rückmeldung. |
| **Barrierefreiheit** | Fokus nach Screenwechsel gezielt setzen (heute nirgends). `aria-current` in der Navigation. Touch-Ziele ≥ 44 pt (`.link-btn` ist 163 × 22 px). Rasterfund braucht `aria-pressed` je Zelle. Punktplatzierung ohne Drag-and-Drop, damit sie mit Schaltersteuerung und Screenreader bedienbar bleibt. Vorhandene `aria-live`-Region beibehalten. `100vh`-Fallback vor `100dvh` ergänzen. **Keine Bewertung nach Bediengeschwindigkeit.** |
| **iOS / Android** | `-webkit-text-size-adjust: 100%` plus reine px-Größen: iOS Dynamic Type wird gar nicht bedient, Android-Textskalierung dagegen schon → `.letter-badge` (fix 200 × 200) und `.segmented` brechen bei 200 %. Safe Areas sind sauber eingebunden. `.bottom-nav` ist `position: fixed` und löst sich ab 460 px vom gerahmten `.app-shell`. |
| **Deutsch / Türkisch / Arabisch** | Bidi-Isolation ist korrekt gelöst und bleibt. **Transkription vereinheitlichen:** heute mischt der TR-Titel „Elif, Bā ve Tā" (`app.js:267`) türkische Eindeutschung mit wissenschaftlichem Makron in einer Zeile. `white-space: nowrap` auf `.lesson-item-status` und `.link-btn` bricht bei TR-Textexpansion. Richtungsangaben sind physisch (`left`, `right`) — für eine spätere arabische UI-Sprache auf logische Eigenschaften umstellen. |
| **Open Design** (`nexu-io/open-design`) | Als **Kritik- und Strukturreferenz** für eine spätere eigene `DESIGN.md` gedanklich zulässig. **Nicht installieren, nicht klonen, keine Templates, Assets oder Schriften übernehmen, keine kostenpflichtige Cloud.** Status bleibt wie in `docs/decision-log.md` Z. 17. |

### Offene Qualitätsblocker

| ID | Blocker | Konkret zu prüfen | Zuständigkeit |
|---|---|---|---|
| **B-1** | **[G] Keine frei lizenzierte, selbst gehostete Naskh-Schrift** | Budget **0 €**, ausschließlich **frei lizenzierte** Schrift, **keine kommerzielle Schrift**. Lizenz **aus offizieller Quelle** belegen. Benötigte Lizenz- bzw. Attribution-Datei dokumentieren und mitliefern. **Keine Schrift ungeprüft aus einem Drittanbieter-Template übernehmen.** Fachlich zu prüfen: Abdeckung der benötigten Zeichen in isolierter Form, Punkttrennung bei 100 px **und** 15 px, WOFF2-Subsetting und Dateigröße. | Gründer (Lizenzentscheidung), Umsetzung (Einbindung), Schriftprüfung (Formqualität) |
| **B-2** | **[G] Buchstabenformen nie auf realen Geräten geprüft** | Vor einem externen Lerntest: Sichtprüfung auf dem **echten iPhone des Gründers** und auf **mindestens einem echten Android-Gerät**. Ein Simulator genügt für den Font-Fallback **nicht**. Zu prüfen: ا, ب und ت, Punkte (rund statt quadratisch, kein Beschnitt), Dark und Light Mode, Touch-Bedienung. | Gründer (iPhone). Android-Gerät und Zeitpunkt **noch offen** — hier wird bewusst keine Person und keine Frist erfunden. |
| **B-3** | **[G] Keine menschliche Fachprüfung der arabischen Darstellung** | Vor einem externen Lerntest: **qualifizierte Arabisch-/Elifba- bzw. Schriftprüfung** der Formen, Punkte und Erklärungen — einschließlich der SVG-Outlines, der Distraktorzeichen und der Formulierung des Positionsform-Hinweises (Szene 6). | Qualifizierte Arabisch-/Elifba-/Schriftfachperson. **Noch nicht benannt — es wird kein Name erfunden.** |

**[G] Rollenabgrenzung:** Für eine reine Buchstabenform- und Punktprüfung werden **eine hanafitische Fachperson und ein Qari nicht künstlich gleichgesetzt**. Sie werden **zwingend** relevant bei religiösen Inhalten, Fiqh, Qur'antext, Tajwid, Rezitation und religiösen Einordnungen. Solange keine Fachperson bestätigt ist: **keine Namen erfinden, Hinweise auf ausstehende Fachprüfung beibehalten, keine fachliche Endfreigabe behaupten.**

**[E]** B-1 bis B-3 sind **nicht** durch Produkt-, Zeit- oder Kostenargumente überstimmbar. Solange sie offen sind, gilt jede Buchstabendarstellung im Prototyp als ungeprüft.

---

## 9. Erfolgskriterien

Test mit **5 bis 10 Personen** der in §2 definierten Zielgruppe. Rekrutierung und Screening finden **außerhalb der App** statt. Ablauf: Demolektion (Tag 0) → **Folgetagsprüfung ca. 24 h später, ohne Vorwarnung**.

> **[S] Ausdrücklicher Hinweis:** Alle Zahlen unten sind **vorab festgelegte Produktsetzungen zur Falsifizierbarkeit**, keine wissenschaftlich bewiesenen Standards und keine Branchennormen. Der Vergleich zwischen Vorcheck und Abschlussprüfung ist ein **Anhaltspunkt**, keine validierte Vorher-/Nachher-Messung.

| # | Frage | Kriterium | Erhebung |
|---|---|---|---|
| K1 | Verstehen Nutzer ohne Erklärung, was sie tun sollen? | ≥ 8 von 10 starten jede neue Aufgabenform **ohne Rückfrage** | Beobachtung, keine Selbstauskunft |
| K2 | Erkennen sie ب und ت **nach** der Lektion? | ≥ 3 von 5 erreichen `today_secure` für ب **und** ت in der Abschlussprüfung | App-Daten |
| K3 | Können sie ب und ت **am Folgetag** noch unterscheiden? | ≥ 3 von 5 erreichen `overnight_secure` für ب und ت, ohne erneute Erklärung | Folgetagsprüfung |
| K4 | Verstehen sie ihre Fehler? | ≥ 3 von 5 geben auf die offene Frage „Was hat dir die App über deinen Stand gesagt?" ihre **tatsächliche** Verwechslung korrekt wieder | Nachgespräch, offene Frage |
| K5 | Klassifiziert die App Fehler statt nur „falsch"? | 100 % der Fehler erhalten eine der **drei** Kategorien; ب/ت-Verwechslungen werden per Diagnose in Anzahl oder Position zerlegt | Log-Auswertung |
| K6 | Wirkt die App vertrauenswürdig und erwachsen? | Niemand beschreibt sie unaufgefordert als „kindlich", „billig" oder „unfertig". Niemand entdeckt eine falsche Angabe | Nachgespräch |
| K7 | Würden sie die nächste Lektion öffnen? | ≥ 3 von 5 **öffnen die Folgetagsprüfung tatsächlich**, ohne dass wir sie darum bitten | Verhalten, **nicht** Absichtserklärung |

**[G] Ausdrücklich kein Erfolgskriterium:** Antwortgeschwindigkeit, Anteil schneller Antworten oder daraus abgeleitetes „Rateverhalten". Unterschiedliche Bediengeschwindigkeiten werden nicht bewertet.

### Klare Abbruchsignale

Die Demolektion gilt als **widerlegt**, wenn eines davon eintritt:

1. **K3 wird deutlich verfehlt** (≤ 1 von 5) — dann trägt der Ansatz die Kernbehauptung nicht, und mehr Buchstaben oder schöneres Design ändern daran nichts.
2. **K4 wird verfehlt, während K2 erfüllt ist** — die Leute lernen, verstehen aber ihren Stand nicht. Dann ist genau das Versprechen aus §2 nicht angekommen.
3. **K7 wird verfehlt** — kein Rückkehrverhalten trotz funktionierender Terminierung.
4. **Mehrere Befragte nennen unabhängig voneinander Präsenzunterricht als klar ausreichenden Weg** (entspricht `docs/01` §13).
5. **K2 wird von allen mühelos erreicht** — dann ist der Zuschnitt zu leicht und der Test misst nichts. Kein Erfolg, sondern ein ungültiger Test.

**[E]** Wird eine Schwelle deutlich verfehlt **oder** mühelos übertroffen, werden Zuschnitt und Kriterienwerte angepasst — nicht die Testpersonen und nicht die Kriterien nachträglich.

---

## 10. Umsetzungsauftrag für Sonnet

> **Noch nicht ausführen.** Umsetzung erst auf ausdrücklichen Auftrag.

### Ponytail-Prüfung

| Funktion | 1. Muss sie existieren? | 2. Vorhandene Lösung? | 3. Native Browserfunktion? | 4. Vorhandene Struktur? | 5. Kleinste sichere Lösung |
|---|---|---|---|---|---|
| Antwortprotokoll | **Ja** — ohne es keine Fehlerdiagnose | Nein | `localStorage` | `persistState()` erweitern | Array von Objekten im bestehenden State |
| Rasterfund (Ü2) | **Ja** — deckt Positionsfehler zuverlässiger auf | Nein | `<button aria-pressed>` | CSS-Grid wie `.letter-choice-row` | 9 Buttons, `aria-pressed`, ein Bestätigen-Button |
| Punktplatzierung (Ü3) | **Ja** — einzige nicht ratbare Aufgabe | Nein | **Kein** HTML5-Drag-and-Drop (mobil unzuverlässig, mit Screenreader kaum bedienbar) | **Lektion-2-Muster: Chip wählen → Ziel wählen** | Token antippen, dann Feld antippen. Kein Drag, keine Bibliothek |
| Statusberechnung | **Ja** | Nein | – | – | Reine Funktion über das Antwortprotokoll |
| Fälligkeit | **Ja** | Nein | lokales Datum als `YYYY-MM-DD` | – | **Ein** Datumsfeld. Kein Timer, kein Scheduler, keine SRS-Engine |
| Animation | Ja | Ja — CSS + Inline-SVG vorhanden | CSS-Keyframes, SVG | `.post-alif-svg`-Muster | Kein Video, keine Animationsbibliothek |
| 4-Optionen-Layout | **Ja** | Nein | CSS Grid | `.letter-choice-row` | Eine `.choices-4`-Regel ergänzen |
| Zeitmessung | **Optional** | Nein | `Date.now()` | – | Darf erfasst werden, wird aber **nicht ausgewertet** (siehe E1) |
| Neues Framework / Build / Abhängigkeit / API | **Nein** | – | – | – | **Vanilla HTML/CSS/JS ohne Build-Schritt, ohne Paketmanager, ohne Backend, ohne externe API, ohne zusätzliche Kosten** |

### Weiterverwenden

`I18N`-System · `setArabicText()` · `showView()`-Routing · `shuffle()` · Question-Bank-Struktur · `round.results` correct/retry · Flash-Mechanik inkl. reduced-motion-Fallback · Lektion-2-Auswahlmuster als Basis für Ü3 · localStorage-Persistenz und Löschfunktion · Demo-/Prüfhinweise · `.letter-choice-row`-Grid · `aria-live`-Feedbackregion

### **[G] Die fünf Views**

| View | Zustände / Modi |
|---|---|
| `view-precheck` | 3 Items zu ا ب ت, kein Richtig-/Falsch-Feedback |
| `view-stage` | Szenen 1–6 und Handlungen A1–A4 |
| `view-practice` | Aufgabenformen `flash` · `grid` · `dots` · `trait` — Modi `practice` · `diagnosis` · `final` |
| `view-result` | Zustände pro Zeichen, Vergleich mit dem Vorcheck |
| `view-nextday` | max. 8 Items, kann `overnight_secure` vergeben |

**Rasterfund, Punktplatzierung, Flash und Merkmalsfrage sind Komponenten innerhalb von `view-practice`, keine eigenen Hauptviews.** Diagnose und Abschlussprüfung sind Modi derselben View.

### Betroffene Dateien

Ausschließlich `index.html`, `styles.css`, `app.js` — plus **eine** `tests.html` (siehe unten) und später **eine** frei lizenzierte WOFF2-Schriftdatei samt zugehöriger Lizenz-/Attribution-Datei, erst nach Blocker B-1. **Keine neuen Abhängigkeiten, kein Build-Schritt, kein Paketmanager, kein Backend, keine externen Assets, keine zusätzlichen Kosten.**

### **[G] Benötigte Datenstrukturen**

```
ANSWER = {
  qid,        // Item-Kennung
  letterId,   // 'alif' | 'ba' | 'ta'
  taskType,   // 'flash' | 'grid' | 'dots' | 'trait' | 'name'
  level,      // Distraktorstufe 1 | 2 | 3
  picked,     // GEWÄHLTE Antwort - verpflichtend
  correct,    // bool
  firstTry,   // bool - eindeutig gespeichert, nicht nur ableitbar
  attemptNo,  // 1, 2, ...
  ts          // Zeitstempel: Reihenfolge und Wiederherstellung
}
// ms darf optional technisch erfasst werden.
// ms wird NICHT für Status, Bestehen oder Rateverhalten ausgewertet.

-> state.answers: ANSWER[]     (ersetzt state.qb.wrongIds)

ERROR = {
  qid,
  category    // 'shape_confusion' | 'dot_count_confusion' | 'dot_position_confusion'
}
// Namensfehler: nameMiss: true am ANSWER, KEINE Kategorie, kein Statuseinfluss.
// Direkte ba/ta-Verwechslung: loest Diagnose aus, wird danach als
// dot_count_confusion ODER dot_position_confusion gespeichert.

LETTER_STATE = {
  status,        // 'not_yet' | 'wobbly' | 'today_secure' | 'overnight_secure'
  firstTryForms: [],   // taskTypes mit firstTry === true
  itemsBetween,        // Items zwischen erstem und letztem Ersttreffer
  dueDate              // 'YYYY-MM-DD', naechster lokaler Kalendertag
}
-> state.letters: { alif: LETTER_STATE, ba: ..., ta: ... }

PRECHECK = { letterId, answered, picked }   -> state.precheck: PRECHECK[]
```

### Zu entfernende Funktionen

`markLessonComplete()` · `getDailyRecommendationKey()` · `toggleSaveMedia()` · `renderDiscoverDynamic()` · `setupDiscoverObserver()` · `restartSequence()` / `advanceSequence()` / `renderSequenceStep()` / `stopSequence()` · Entdecken-Views und -Handler · Lektion-3-View · Lernziel- und Ausgangssituations-Views samt Handlern · Konvertiten-Option · Fortschritt-Tab · `connectMorph`-Keyframes und `.connect-glyph` · `.post-dot`-Regeln · Dauer-Badges · Statistik-Pills inkl. „Minuten" · jede Verwendung von „x von 28"

### Erforderliche Tests

Kein Testframework, kein npm — **eine** `tests.html`, die im Browser läuft und Ergebnisse ausgibt. Voraussetzung: die folgenden Funktionen werden als **reine Funktionen** geschrieben (Eingabe → Ausgabe, kein DOM-Zugriff):

| Funktion | Testfälle |
|---|---|
| `classifyError(answer)` | Je ein Fall pro Kategorie · direkte ب/ت-Verwechslung erzeugt **keine** vierte Kategorie, sondern löst Diagnose aus · Namensfehler erzeugt **keine** Kategorie und ändert den Status nicht |
| `isTodaySecure(letterState)` | 3 Formen aber ohne `flash` → **nicht** sicher · 3 Formen ohne produktive Aufgabe → **nicht** sicher · 3 Formen mit < 2 Items dazwischen → **nicht** sicher · alle vier Bedingungen → sicher |
| `isOvernightSecure(letterState)` | 2 verschiedene Formen im ersten Versuch → sicher · 2 Treffer derselben Form → **nicht** sicher · Vergabe **nur** in der Folgetagsprüfung |
| `nextDueDate(today)` | Immer genau der nächste lokale Kalendertag · Monats- und Jahreswechsel · **kein** 2- oder 4-Tage-Ergebnis |
| `buildDistractors(letterId, level)` | Nie das Zielzeichen als Distraktor · **Zielzeichen nie doppelt** · immer genau 4 Optionen · zwei aufeinanderfolgende Items ergeben nicht dasselbe Set |
| `progressSentence(letterState)` | Nach einer richtigen Antwort enthält der Satz **nicht** „beherrschst" · `overnight_secure` erscheint nie vor der Folgetagsprüfung · kein Satz enthält „von 28" · keine Dauer ohne Messung |

**Zusätzlich manuell:** Durchlauf bei 390 px in Light und Dark · `prefers-reduced-motion` aktiv (inkl. Fehler-Shake) · Reload mitten in der Lektion · localStorage geleert · Systemschriftgröße 200 % · Bedienung ohne Drag-and-Drop · Sichtprüfung auf realem iPhone und realem Android (B-2).

### Abnahmekriterien

1. Kein Fortschrittswert ist fest verdrahtet. Bei 0 richtigen Antworten zeigt die App **kein** sicheres Zeichen.
2. Jeder Fehler erzeugt einen Protokolleintrag mit **gewählter Antwort** und `firstTry` und wird genau **einer der drei** Kategorien zugeordnet.
3. **Nirgends** erscheint „x von 28" — weder sichtbar noch als „0 von 28".
4. **Nirgends** wird eine Dauer versprochen. Nach Abschluss erscheint entweder real gemessene aktive Zeit oder **keine** Zeitangabe.
5. Antwortgeschwindigkeit beeinflusst **weder** Status **noch** Bestehen **noch** eine Rückmeldung.
6. Es existieren **höchstens fünf** Hauptviews.
7. Jede Zeichenfrage hat 4 Optionen, pro Item neu berechnet, Zielzeichen nie doppelt, zwei aufeinanderfolgende Items nie dasselbe Set.
8. Rasterfund und Punktplatzierung sind **ohne Drag-and-Drop** vollständig bedienbar, mit sichtbarem Zustand und `aria-pressed`.
9. Keine Rückmeldung besteht nur aus „richtig"/„falsch" — jede nennt Anzahl und/oder Position.
10. Kein Screen zeigt einen dekorativen Punkt an einem Buchstaben.
11. Kontrast aller Text-/Hintergrundpaare ≥ 4,5 : 1 in Light **und** Dark. Der Dark-Mode-Hero-CTA ist behoben.
12. Alle Touch-Ziele ≥ 44 × 44 px.
13. `prefers-reduced-motion` schaltet **alle** Bewegung ab, einschließlich `softShake`.
14. Passive Betrachtungszeit der Lernbühne ≤ 20 s gesamt, längste Einzelstrecke ≤ 5 s, erste Nutzerhandlung nach ≤ 5 s.
15. Der Übungs-Screen hat keinen ungenutzten Leerraum > 15 % über dem ersten Inhalt.
16. Nach jedem Screenwechsel liegt der Fokus auf einem sinnvollen Element.
17. Die Lektion ist bei 390 px vollständig ohne horizontales Scrollen bedienbar.
18. Ein Reload mitten in der Lektion verliert keinen Fortschritt und blockiert keine Runde.
19. Die Fälligkeit ist **ausschließlich** der nächste lokale Kalendertag. Es existiert **keine** 1-/2-/4-Tage-Logik im Code.
20. `tests.html` läuft ohne Fehler durch und meldet alle Fälle als bestanden.
21. Alle Demo-/Prüfhinweise sind erhalten, solange B-1 bis B-3 offen sind.

---

## 11. Bewusst nicht im nächsten Build

| Nicht enthalten | Grund |
|---|---|
| Vollständiges Alphabet (28 Buchstaben) | Mehr Inhalt auf einer unbewiesenen Messung vergrößert nur den Schaden |
| **[G] „x von 28" in jeder Form** | Wäre am Tag 1 ehrlich „0" und ist als Metrik irreführend |
| Verbindungsformen (Anfangs-, Mittel-, Endform) | Braucht die Schrift aus B-1. Wird in Szene 6 ehrlich als „später" gekennzeichnet |
| Aussprache-Audio | Freigabepunkt A-1 |
| Qur'an-Inhalte, Qur'anrezitation, Tajwid | Freigabepunkt A-2. Hier ist Islamic Governance zwingend |
| **[G] Vollständige 1-/2-/4-Tage-Spaced-Repetition-Engine** | Bewusst zurückgestellt. Nur ein Folgetagsblock, bis dieser nachweislich funktioniert |
| **[G] Automatische Erkennung von „Rateverhalten" und „Flüchtigkeit"** | Nicht verlässlich aus Antwortdaten ableitbar; würde Bediengeschwindigkeit als Lernschwäche auslegen |
| **[G] Auswertung der Antwortzeit für Status oder Bestehen** | `ms` darf erfasst, aber nicht interpretiert werden |
| Nutzerkonten, Login, Cloud-Sync | localStorage genügt |
| Backend, Datenbank, externe API | Kein Bedarf, keine Kosten, kein zusätzliches Datenschutzrisiko |
| Community, Kommentare, Direktnachrichten, Creator-Uploads | `CLAUDE.md`, `docs/decision-log.md` Z. 12 |
| Bezahlfunktion, Abo, Preisdarstellung | Kein validiertes Produkt |
| Kinderbereich, Elternkonten, Altersabfragen | Zielgruppe ausdrücklich ab 18 |
| Umfangreiche Gamification: Streaks, Punkte, Abzeichen, Bestenlisten, Tempoboni | `CLAUDE.md`: keine Suchtmechanik. Verfälscht zudem das Testergebnis |
| **[G] Zielgruppen-Screening in der App** | Findet außerhalb statt, bei der Rekrutierung |
| Türkische Testrunde | Erst nach validiertem Kern auf Deutsch. TR-Strings bleiben im Code |
| **[G] Konvertiten-Journey** | Aus diesem Slice entfernt. Bleibt offene Zielgruppen- und Journey-Frage, **nicht** aus der Produktvision gelöscht |
| **[G] Entdecken-/Feed-Format, Medien-Kacheln, Produktvitrine** | Widerspricht der eigenen Positionierung |
| Push-Benachrichtigungen, E-Mail-Erinnerungen | Erfordert personenbezogene Daten. Die Folgetagsfälligkeit funktioniert lokal |
| Analytics, Tracking, Crash-Reporting | Nicht ohne Datenschutzprüfung und Einwilligungskonzept |
| Vollständige `DESIGN.md` | Erst nach B-1 — die Schrift bestimmt die Skalen |
| **Release der Gesamt-App** | Freigegeben ist **eine Demolektion**, kein Produktrelease |

---

## 12. Entschieden, offen und unbekannt

### **[G] Am 29.07.2026 entschieden**

| # | Entscheidung |
|---|---|
| E1 | Schlankes Antwortdatenmodell mit verpflichtender gewählter Antwort und `firstTry`. `ms` optional erfassbar, **nicht** für Status oder Rateverhalten auswertbar |
| E2 | ا als Kontrastanker, ب/ت als Diskriminationspaar, ca. 20 / 80 |
| E3 | Visuell ähnliche, nicht gelehrte Distraktoren erlaubt unter fünf Bedingungen; Prüfung zunächst Arabisch-/Elifba-/Schriftprüfung |
| E4 | Zielgruppen-Screening außerhalb der App; kurzer Vorcheck ohne Richtig-/Falsch-Feedback; andere Aufgabenformen als in der Abschlussprüfung; keine Behauptung einer validierten Vorher-/Nachher-Messung |
| E5 | „5 Minuten"-Claim entfernt. Nur real gemessene Zeit, sonst gar keine |
| E6 | „x von 28" vollständig entfernt. Nur Zustände pro Zeichen |
| E7 | Interaktive Animation bestätigt, stumm, ≤ 20 s Passivzeit, frühe Handlungen, keine MP4-Abhängigkeit |
| E8 | Schrift: 0 € Budget, ausschließlich frei lizenziert, Lizenz aus offizieller Quelle belegen, Lizenz-/Attribution-Datei dokumentieren |
| E9 | Vor externem Lerntest Sichtprüfung auf echtem iPhone des Gründers und mindestens einem echten Android-Gerät |
| E10 | Arabisch-/Elifba-/Schriftprüfung für diese Lektion; hanafitische Fachperson und Qari nicht künstlich gleichgesetzt, aber zwingend bei religiösen Inhalten |
| E11 | Nächster Build auf genau eine vollständige Demolektion reduziert |
| E12 | Konvertiten-Option aus dem Slice entfernt, bleibt offene Zielgruppenfrage |
| — | Zusätzlich: höchstens fünf Views · genau drei Fehlerkategorien · vereinfachtes Lernkriterium · Terminierung nur auf den nächsten Kalendertag |

### Weiterhin offen

| # | Offener Punkt | Konsequenz |
|---|---|---|
| **B-1** | Frei lizenzierte Naskh-Schrift mit belegter Lizenz | Bis dahin ist jede Buchstabendarstellung ungeprüft. **Nicht stillschweigend einbinden, nicht erfinden.** |
| **B-2** | Reales Android-Gerät (Person und Zeitpunkt) | Ohne echtes Gerät bleibt der Font-Fallback ungeprüft |
| **B-3** | Qualifizierte Arabisch-/Elifba-/Schriftfachperson | Noch nicht benannt. **Kein Name wird erfunden, keine Endfreigabe behauptet** |
| O-1 | Ob localStorage auf den Testgeräten bis zum Folgetag überlebt | Safari/iOS löscht Website-Daten unter Bedingungen. **Das gesamte Tagesversprechen hängt daran** — technisch prüfbar, bisher ungeprüft |
| O-2 | Ob die Statuswerte (3 Formen / ≥ 2 Items dazwischen / 2 Formen am Folgetag) sinnvoll gewählt sind | **[S]** Produktsetzung. Wird am Testergebnis korrigiert |

### Was wir weiterhin nicht wissen

- Ob erwachsene Nullanfänger drei Zeichen in einer Sitzung auf `today_secure` bringen. **Gegenstand des Tests, keine Planungsgrundlage.**
- Ob Buchstabennamen ohne Audio überhaupt ehrlich lernbar sind. Wird hier verneint und deshalb aus dem Statuskriterium herausgenommen — selbst eine Setzung, keine belegte Tatsache.
- Wie gut bestehende digitale Elifba-Angebote diesen Bedarf bereits decken. **Es gibt weiterhin keine Wettbewerbsanalyse** (`docs/01` §10). Keine Aussage in diesem Dokument behauptet eine Marktlücke.

---

**Nächster überprüfbarer Schritt:** die Demolektion in fünf Views nach diesem Dokument, mit funktionsfähigem Rasterfund und funktionsfähiger Punktplatzierung, ehrlichem Status pro Zeichen und überarbeiteten Rückmeldungssätzen. **Abnahmenachweis:** die 21 Kriterien aus §10 plus ein Screenshot desselben Screens von einem echten iPhone **und** einem echten Android, auf dem die Punkte von ب und ت als Punkte erkennbar sind — zugleich Prüfnachweis für B-2 und Vorlage für B-3.
