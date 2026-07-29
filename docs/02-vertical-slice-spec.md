# Phase 2: Spezifikation einer vollständigen Demolektion (Vertical Slice)

> **Status:** Entwurf zur Gründerprüfung. Noch nicht freigegeben, noch nicht umgesetzt.
> **Grundlage:** eigener Durchlauf des Prototyps auf `claude/mobile-prototype-v1-drdk35` bei 390 × 844 px, plus drei getrennte Agentenaufträge (CPO, Learning Science, UX/UI), im Hauptkontext zu diesem Dokument zusammengeführt.
> **Kennzeichnung:** **[F]** aus Code/Dokumentation belegbar oder reine Arithmetik · **[S]** begründete Setzung, keine bewiesene Norm · **[E]** Empfehlung · **[O]** offen, Entscheidung nötig
> Dieses Dokument beschreibt **eine** Lektion. Es beschreibt nicht die fertige App und behauptet keinen fertigen MVP.

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
10. **[E]** Als Beweis, dass die Produktidee mehr wert ist als Karteikarten, ein YouTube-Video oder eine einfache Elifba-App, trägt der Prototyp heute nicht. Als Navigations- und Tonalitätsmuster ist er brauchbar. Er darf in diesem Zustand **nicht** in Nutzerinterviews — er würde Reaktionen auf Optik messen und als Lernbestätigung protokolliert werden.

### Gemeinsames Kurzurteil der drei Agenten

Alle drei kommen unabhängig zum selben Kern: Der Prototyp löst ein internes Problem (ein Konzept zeigbar machen), kein Nutzerproblem. Es besteht **kein Konflikt** zwischen den drei Bewertungen. Sie unterscheiden sich nur darin, welchen Defekt sie als blockierend benennen — CPO: unehrlicher Fortschritt; Learning Science: fehlende Antwortdaten; UX/UI: unkontrollierte Buchstabenform. Alle drei müssen vor dem ersten Nutzertest behoben sein.

---

## 2. Ziel der Demolektion

| Feld | Festlegung |
|---|---|
| **Primäre Zielgruppe** | **[E]** Deutschsprachige Erwachsene ab 18, die beim Screening **weniger als 2 von 5** vorgelegten arabischen Buchstaben (ا ب ت ن ي) korrekt benennen, und die in den letzten 12 Monaten mindestens einen Lernversuch begonnen und abgebrochen haben. |
| **Warum diese Verschärfung** | `docs/01` §6 empfiehlt „erwachsene Elifba-Anfänger:innen **und** Wiedereinsteiger:innen". Für **eine** Lektion über ا ب ت ist das nicht haltbar: Für Wiedereinsteiger ist dieser Inhalt per Definition bekannt, sie lernen nichts, und die implizite Botschaft „du fängst bei null an" ist genau die Kränkung, die `docs/01` §9 vermeiden will. Anfänger brauchen **Instruktion**, Wiedereinsteiger brauchen **Diagnose**. Eine Lektion kann nicht beides beweisen. |
| **Vorteil des Kriteriums** | In unter 60 Sekunden objektiv prüfbar (nicht Selbstauskunft), und es macht den Lernnachweis am selben Instrument vorher/nachher messbar. |
| **Testsprache** | **[E]** Nur Deutsch. Zwei Sprachen verdoppeln Inhalts- und Prüfaufwand und halbieren die Signaldichte pro Interview. Die TR-Lokalisierung bleibt im Code erhalten, wird aber nicht getestet. |
| **Konkretes Problem** | Die Person kann arabische Schriftzeichen nicht auseinanderhalten. Insbesondere teilen ب und ت **dieselbe Grundform (Rasm)** und unterscheiden sich nur durch Punktzahl und Punktposition. Ohne diese Unterscheidung ist kein Lesen möglich. |
| **Beobachtbares Lernziel** | Nach der Lektion kann die Person: (1) in einem Raster aus 9 Zeichen alle ب und alle ت markieren, ohne Vorlage, mit höchstens 1 Fehler; (2) ein kurz gezeigtes und wieder verdecktes ا, ب oder ت aus 4 Optionen antippen, wenn mindestens zwei Ablenker dieselbe Grundform tragen; (3) zu einem gezeigten Zeichen angeben, ob es keine Punkte, Punkte oben oder Punkte unten hat und wie viele; (4) an einer leeren Grundform die Punkte für ب bzw. ت an der richtigen Stelle setzen. |
| **Ausdrücklich NICHT Lernziel** | **[S]** Die Namen „Alif/Bā/Tā" sicher zu beherrschen — ohne Aussprache-Audio nicht ehrlich prüfbar (siehe §5, Freigabepunkt A-1). Ebenso nicht: Verbindungsformen, weitere Buchstaben, Qur'anlesen. |
| **Ergebnis nach einer Sitzung** | Die Person hat einen **ehrlichen, pro Zeichen geführten Stand**: welches Zeichen heute sitzt, welches wackelt, welches nicht. Nicht: eine Prozentzahl, nicht „3 von 28". |
| **Grund für Rückkehr am nächsten Tag** | Am Folgetag startet ohne jedes Zutun ein 2–3-minütiger Block, der mit den **schwächsten** Zeichen beginnt. Der Nutzen ist die Terminierung selbst: Der Lernende muss nichts sortieren, nichts einschätzen, nichts planen. |

### Das eine Versprechen, das diese Lektion einlösen muss

> **„Du siehst genau, welche Buchstaben du wirklich kannst und welche nicht — und morgen bekommst du ohne eigenes Zutun exakt die zurück, die du nicht konntest."**

Das ist der einzige Punkt, an dem ein Produkt einen Kartenstapel strukturell schlägt: ehrliche Beherrschungsmessung pro Zeichen plus automatische Terminierung der Wiederholung. **[E]** Bewusst **nicht** das Versprechen: „schön", „erwachsenengerecht", „strukturiert", „28 Buchstaben".

---

## 3. Keep / Remove / Rebuild

| Element | Entscheidung | Begründung |
|---|---|---|
| DE/TR-i18n-System (`I18N`) | **Behalten** | **[F]** Vollständig, deckt zwei dokumentierte Segmente. Keine Kosten, kein Risiko. |
| Question-Bank als Datenmodell | **Behalten** | **[F]** Saubere, erweiterbare Struktur. Nur die Inhalte sind schwach, nicht das Modell. |
| `state.qb.wrongIds`-Persistenz | **Behalten + erweitern** | **[F]** Größtes ungenutztes Potenzial. Überlebt Runden und Reloads, wird aber nur als Button auf einem Screen sichtbar. |
| `round.results` correct/retry | **Behalten + erweitern** | **[F]** Bereits ehrlich, wird nachträglich zerstört. Dritter Zustand „nicht beantwortet" fehlt. |
| Fragetyp `flash` + reduced-motion-Fallback | **Behalten** | **[F]** Der einzige Typ, der echten Abruf statt Wiedererkennen verlangt. Barrierefreiheit sauber gelöst. |
| Runden-Auswertung pro Buchstabe | **Behalten** | Richtige Granularität, wird nur überschrieben. |
| Isolierte Arabisch-Darstellung (`setArabicText`, `dir`/`lang`/`translate="no"`) | **Behalten** | **[F]** Bidi-Isolation ist korrekt gelöst. |
| Lokale Datenhaltung + Löschfunktion + Datenschutzhinweis | **Behalten** | Richtige Haltung, DSGVO-konform, keine Änderung nötig. |
| Demo-/Prüfhinweise („fachliche Prüfung ausstehend") | **Behalten** | Konsistent und ehrlich. Bleiben, bis die Fachprüfung erfolgt ist. |
| Lektion-2-Zuordnungsmuster (Chip wählen → Ziel wählen) | **Behalten als Interaktionsmuster** | **[E]** Wird zur Basis der neuen Punktplatzierung wiederverwendet (Ponytail: vorhandene Struktur reicht). |
| `markLessonComplete()` | **Entfernen** | **[F]** Erzeugt die unehrliche Fortschrittsaussage. Ersatzlos streichen, nicht reparieren. |
| `getDailyRecommendationKey()` + Hero-Tagesempfehlung | **Entfernen** | **[F]** Zufall statt Lernlogik, widerspricht dem Lernwegstatus. |
| Entdecken-Tab vollständig (6 Posts, Speichern, Feed) | **Entfernen** | Widerspricht der eigenen Positionierung, lehrt in Post 2 Falsches, und Ein-Frage-Runden zählen ohnehin nicht auf den Fortschritt. |
| Dauer-Badges „20 Sek."/„30 Sek." | **Entfernen** | **[F]** Belegbar falsch (3-Sekunden-Loops). |
| Medien-Kacheln auf Home | **Entfernen** | Dublette des Entdecken-Tabs. |
| „Für dich ausgewählt"-Karte | **Entfernen** | **[F]** Dublette von Lektion 2 aus der Liste unmittelbar darüber. |
| Produktvorschau-Kachelwand (Post 5) | **Entfernen** | Reine Vitrine. Enthält zudem die Kachel „Prophetengeschichten“ — vor jeder Illustrationsidee zwingend `islamic-content-governance`. |
| Lektion 3 „Buchstaben verbinden (Vorschau)" | **Entfernen** | Zeigt gesperrten Inhalt ohne Nutzen. |
| `connectMorph`-Animation | **Entfernen** | **[F]** Animiert `letter-spacing: -6px` auf drei isolierten Glyphen (`styles.css:1137–1141`). Das ist kein Verbinden, sondern Zusammenschieben — es lehrt ein **falsches Formmodell**. |
| Statistik-Pill „Minuten" | **Entfernen** | **[F]** Es wird keine Zeit gemessen. |
| Fortschritt-Tab in heutiger Form | **Entfernen** | Zeigt ausschließlich die drei erfundenen Werte. |
| Lernziel-Screen (5 Optionen) | **Entfernen** | **[F]** Verzweigt nichts. Wenn er nicht verzweigt, gehört er nicht in den Test. |
| Ausgangssituation (4 Optionen) | **Entfernen für diese Demolektion** | Verzweigt nichts. Die Zielgruppe ist durch das Screening bereits definiert. |
| Option „Ich bin konvertiert" + Hinweis „wird aktuell separat validiert" | **Entfernen** | **[F]** Interne Forschungssprache im Nutzer-UI, und sie widerspricht `docs/decision-log.md` Z. 16, wo Konvertiten ausdrücklich **keine** Untergruppe von Segment 4 sind. Der Prototyp beantwortet still eine offene Frage. |
| Dekorative `.post-dot`-Elemente | **Entfernen** | **[F]** Erzeugen falsche Punktzahlen. Fällt mit dem Entdecken-Tab weg, darf aber nirgends wiederkehren. |
| **Fortschrittslogik** | **Neu denken** | Pro Zeichen, aus tatsächlichen Antworten abgeleitet, drei Zustände. Keine Minuten ohne Messung. Kein „x von 28", solange drei Buchstaben existieren. |
| **Antwortdatenmodell** | **Neu denken** | **[F] Blockierend.** Ohne gewählte Antwort und Zeitmessung ist keine Fehlerdiagnose möglich. |
| **Lektion 1 (drei Ansehen-Screens)** | **Neu denken** | Von „ansehen und Weiter tippen" zu „sehen → sofort ohne Vorlage abrufen → Fehler mit Merkmalsbegründung korrigieren". Keine Erklärung endet mit „Weiter". |
| **Aufgabentypen** | **Neu denken** | Nach kognitivem Anspruch ordnen, nicht nach Formulierung. Zwei echte neue Interaktionsarten nötig (Rasterfund, Punktplatzierung). |
| **Distraktoren** | **Neu denken** | 4 Optionen, pro Item neu berechnet, nie konstant. |
| **Home-Screen** | **Neu denken** | Eine Sektion, ein Call-to-Action. Heute fünf konkurrierende Einstiege, von denen drei auf denselben Stoff führen. |
| **Rückmeldungstexte** | **Neu denken** | „Noch nicht. Schau dir die Form noch einmal an." ist für jeden Fehlertyp identisch und bei ب/ت sachlich irreführend — die Form ist gleich, die Punkte unterscheiden sich. |
| **Arabische Schrift** | **Neu denken** | Selbst gehostete, lizenzgeklärte Naskh-Schrift. Blocker B-1. |

---

## 4. Vollständiger Lernfluss

**Zuschnitt-Entscheidung [E]:** ا als **Kontrastanker**, ب/ت als eigentliches **Diskriminationspaar**. Übungsbudget ca. 20 % / 80 %.

Begründung gegen die engere Alternative „nur ب/ت": Ohne ein punktloses Zeichen existiert die Merkmalsdimension „Punkte ja/nein" nicht. Lernende können ب und ت dann trennen, ohne zu wissen, **woran**. Begründung gegen die heutige Gleichgewichtung: Sie behandelt einen trivialen und einen schweren Fall gleich und schickt ein Drittel der Übungszeit in den Fall, den niemand falsch macht. Kontrastlernen als Prinzip: Diskrimination entsteht am Vergleich, nicht am Einzelreiz.

**[F] Didaktisch entscheidend:** ب und ت unterscheiden sich in **zwei** Dimensionen gleichzeitig — Anzahl (1 vs. 2) **und** Position (unten vs. oben). Wer nur eine Dimension nutzt, antwortet richtig und wirkt kompetent. Beide Dimensionen müssen **getrennt** geprüft werden.

**Zieldauer [S]:** 7–9 Minuten aktiv. **[O] Konflikt:** Die Startseite wirbt heute mit „5 Minuten". Entweder der Claim fällt oder die reale Zeit wird ausgewiesen — beides zugleich geht nicht.

| # | Screen | Nutzeraktion | Lernziel | Dauer [S] | Mögliche Fehler | Reaktion der App |
|---|---|---|---|---|---|---|
| 1 | **Vorcheck** – 3 Items, gezeigtes Zeichen → 4 Namensoptionen, plus Button „kenne ich nicht" | Antippen | Ausgangsstand pro Zeichen festhalten | 45 s | Raten statt „kenne ich nicht" zu tippen | **Keine** Richtig/Falsch-Rückmeldung. Nur: „Danke – jetzt weiß die App, wo du startest." Ergebnis wird als Baseline gespeichert und in Schritt 10 wörtlich zitiert |
| 2 | **Aktivierung** – ا neben ب, Aufforderung „Tippe das an, das anders aussieht" | Antippen | Merkmalsachse eröffnen | 20 s | Tippt ب oder ت | Keine Wertung. Direkte Auflösung mit Hervorhebung der gemeinsamen Grundform. Zählt nie ins Ergebnis |
| 3 | **Erklärung 1 – Grundform** (Animation, s. §5 Szene 1–2) + Tap „Tippe die Grundform an, die ب und ت teilen" | Ansehen, dann tippen | Rasm als gemeinsames Element identifizieren | 40 s | Tippt die Punkte statt der Schale | Zeigt die Schale isoliert, dann mit Punkten. **Kein „Weiter" ohne den Tap** |
| 4 | **Abruf 1 (verdeckt)** – 2 Flash-Items, Zeichen 1100 ms, dann verdeckt, 4 Optionen | Antippen | Zeichen ohne Vorlage aus dem Gedächtnis wählen | 30 s | Wahl aus derselben Formfamilie | Sofortige Auflösung **mit Merkmalsbegründung**: „ت hat zwei Punkte oben – das hier hatte einen Punkt unten." Nie nur „Leider falsch" |
| 5 | **Erklärung 2 – Punktmerkmal** (Szene 3–4) + 2 Taps: Punkte an die leere Schale setzen | Ansehen, dann setzen | Punktposition aktiv erzeugen statt wiedererkennen | 45 s | Position vertauscht | Zeigt beide nebeneinander, benennt die Achsen „oben/unten" und „eins/zwei" **getrennt** |
| 6 | **Abruf 2, Stufe 1** – 4 Items, Distraktoren Stufe 1 | Antippen | Erste sichere Treffer aufbauen | 45 s | – | Ersttreffer und Nachtreffer werden getrennt gezählt |
| 7 | **Stufe 2 – gemischte Formen** – 5 Items in 3 Interaktionen: Rasterfund (9 Zeichen, alle ت markieren), Punktfrage als Text, Punktplatzierung | Markieren / antippen / setzen | Merkmal in wechselnder Aufgabenform anwenden | 90 s | Rasterfund deckt auf, wer die Position ignoriert | Bei Rasterfund: **jede** Fehlmarkierung einzeln zeigen, nicht nur die Gesamtzahl |
| 8 | **Diagnose + Nachübung** – nur wenn Fehler vorliegen, 2–4 Items je Fehlerklasse | Klassenspezifisch | Konkrete Fehlerart auflösen | 60–120 s | – | Nachübung ist **immer eine andere Aufgabenform** als die, in der der Fehler auftrat — nie dieselbe Frage erneut |
| 9 | **Abschlussprüfung** – 6 Items, Distraktoren Stufe 3, keine Hilfen, **kein Retry**, nur Ersttreffer zählt | Antippen / markieren / setzen | Können unter erschwerten Bedingungen nachweisen | 90 s | Tempofehler | Auflösung erst am Ende, Ergebnis **pro Zeichen**, nicht als Gesamtprozent |
| 10 | **Ehrliches Ergebnis** | Lesen | Vorher/Nachher pro Zeichen sehen | 30 s | – | Drei Zustände pro Zeichen, real gemessene Zeit, Ansage der morgigen Wiederholung |
| 11 | **Folgetag** – Kurzblock, startet ohne Zutun mit den schwächsten Zeichen | Antippen / markieren | Halten über eine Nacht nachweisen | 2–3 min | Gerätewechsel → Daten weg (localStorage) | Siehe §7 |

**[E] Transferregel — damit kein Medium allein als Lernen zählt:** Jede Erklärung endet in einer Handlung, und jede Handlung hat einen Transferschritt auf Material, das in der Erklärung nicht vorkam. Beispiel: Nach der Punkt-Erklärung wird die **Regel** auf nicht gelehrte Zeichen angewandt („Welche dieser Zeichen haben Punkte unten?") — geprüft wird das Merkmal, nicht die Buchstabenidentität. Das erweitert den Stoff nicht.

---

## 5. Medienkonzept

### Entscheidung: interaktive Animation. Kein Video, keine Kombination — für diese Demolektion.

| Kriterium | Echtes Kurzvideo | Interaktive Animation |
|---|---|---|
| In dieser Umgebung herstellbar | **Nein** — kein H.264/MP4-Encoder verfügbar (`README.md`) | Ja |
| Korrektur nach Fachprüfung | Neu-Encoding, externer Schritt | Codeänderung, sofort wirksam |
| **Buchstabenform** | **wird binär eingebrannt, bevor die Schrift geprüft ist** | bleibt austauschbar |
| Audio heute | stumm (kein geprüfter Qari, keine geklärten Rechte) | stumm by design, Text auf der Bühne |
| Barrierefreiheitsaufwand | Untertitel + Transkript + Audiodeskription + Player | `prefers-reduced-motion` + Standbild + Text |
| Übergang zum Handeln | harter Schnitt Zuschauen → Tun | Medium **endet in** der Handlung |

**Ausschlaggebend ist Zeile 3.** Ein Videoartefakt würde eine ungeprüfte Buchstabenform festschreiben, bevor Schrift- und Fachprüfung abgeschlossen sind. Das ist kein Notbehelf wegen des fehlenden Encoders, sondern der inhaltliche Grund. Eine **Kombination** wird abgelehnt, weil sie Prüf- und Wartungsfläche verdoppelt, ohne heute Lernnutzen zu belegen — erneut zu bewerten, wenn Schrift, Audio und Qari geklärt sind.

**Technische Form [E]:** handgeführte SVG-Pfad-Animation mit **eigens gezeichneten Outlines für genau drei Glyphen**, nicht mit Textglyphen aus der Systemschrift. Damit ist das Medium unabhängig vom Font-Fallback. Die **Übungen** brauchen weiterhin eine echte Schrift (Blocker B-1). Die Outlines sind selbst prüfpflichtig (Blocker B-3).

### Storyboard

**Format:** ein einzelner Lektionsbildschirm. Oben eine 9:16-Bühne (getönt, randlos, keine Bedienelemente), unten eine Aktionskarte (weiß, gerahmt). **Dieser Flächenwechsel ist das textfreie Signal „zuschauen vs. selbst handeln".** Passivzeit gesamt 36 s, nie länger als 14 s am Stück. Stumm, kein Sprecher, kein Qur'antext.

| Nr | Dauer | Sichtbar | Buchstabe | Bildschirmtext (DE) | Nutzeraktion danach | Übergang |
|---|---|---|---|---|---|---|
| 1 | 0:00–0:05 | Senkrechter Strich zeichnet sich oben → unten | ا | „Alif. Ein senkrechter Strich. Kein Punkt." | – | Strich rückt nach links |
| 2 | 0:05–0:12 | Links ا, rechts erscheint die leere Schale (ب **ohne** Punkt) | ا + Grundform | „Dieser hier liegt. Noch ohne Punkt." | – | Bühne schrumpft, Aktionskarte fährt ein |
| **A1** | – | Aktionskarte, 2 Optionen | ا / Schale | „Tippe den senkrechten Strich an." | **Tippen** | Rückmeldung, Karte fährt ab |
| 3 | 0:12–0:19 | Leere Schale groß; ein Punkt fährt ein und setzt sich **unter** die Schale, bleibt markiert | ب | „Ein Punkt unten → Bā." | – | Punkt fährt zurück |
| 4 | 0:19–0:26 | Dieselbe Schale; zwei Punkte fahren ein und setzen sich **über** die Schale | ت | „Zwei Punkte oben → Tā." | – | Aktionskarte fährt ein |
| **A2** | – | **Punktplatzierung**: leere Schale, ein Punkt-Token, Ablagefelder oben/unten | ب | „Setze den Punkt für Bā." | **Token antippen, dann Feld antippen** | Bei Fehler: Token springt zurück, Rückmeldung benennt die Position |
| 5 | 0:26–0:32 | ب und ت nebeneinander, Punktgruppen leuchten **einmal** nacheinander auf, Linie zu „unten"/„oben" | ب + ت | „Gleiche Form. Der Unterschied sind die Punkte." | – | Bühne friert ein |
| 6 | 0:32–0:36 | Statische Hinweistafel, keine Bewegung | ب isoliert | „So sieht der Buchstabe **allein stehend** aus. Im Wort verändert er seine Form. Das lernst du später." | – | Aktionskarte fährt ein |
| **A3** | – | **Rasterfund**: 9 Zeichen, alle ت markieren | ا/ب/ت + Distraktoren | „Markiere alle Tā." | **Mehrfachauswahl, dann bestätigen** | → Flash-Abruf mit 4 Optionen (Schritt 4 des Lernflusses) |

**Regeln [E]:** Unter `prefers-reduced-motion` wird jeder Übergang zum sofortigen Wechsel ohne Bewegung. Jede Szene hat ein Standbild als Fallback. Ein Transkript aller Bildschirmtexte ist abrufbar. **Kein dekorativer Zusatzpunkt** — jeder sichtbare Punkt gehört zum Buchstaben.

**Szene 6 ist nicht optional.** Sie ist die ehrliche Kennzeichnung, dass Isolationsformen nur ein Teil des Systems sind. Ohne sie erzeugt die Lektion ein falsches Vollständigkeitsgefühl.

### Freigabepunkte Audio (ausdrücklich später)

| ID | Punkt | Bedingung |
|---|---|---|
| **A-1** | Aussprache-Audio für Buchstabennamen | Erst nach geprüfter Aussprache **und** geklärten Nutzungsrechten. Bis dahin sind Namensfragen **kein** Masterynachweis. |
| **A-2** | Jegliche Qur'anrezitation | **Nicht Teil dieser Demolektion.** Erst nach geprüftem Qari, geprüfter Aussprache und geklärten Audiorechten. Keine Musik darunter. Keine TTS-Ersatzlösung. |

---

## 6. Übungskonzept

**Grundregeln für alle Übungen [E]:** 4 Optionen statt 3 · Distraktorset **pro Item neu berechnet**, nie konstant · innerhalb einer Runde kein identisches Optionsset zweimal · **keine erfundenen Glyphen, keine gespiegelten oder verdrehten Fantasiezeichen** — falsche Formen prägen sich beim visuellen Diskriminationslernen mit ein.

### Distraktorstufen

| Ziel | Stufe 1 | Stufe 2 | Stufe 3 (Prüfung) | Was die Stufe prüft |
|---|---|---|---|---|
| ا | ب, ت, ن | ب, ت, ي | ل + 2 bepunktete | Stufe 3 prüft die Unterscheidung ا/ل statt nur „hat keine Punkte" |
| ب | ا, ت, ن | ت, ث, ن | ت, ث, ي | ث = Anzahl bei gleicher Seite · ن = Position bei gleicher Anzahl · ي = Anzahl unten |
| ت | ا, ب, ي | ب, ث, ن | ب, ث, ن | ث = 3 statt 2 oben · ن = 1 statt 2 oben · ب = Gegenprobe |

**[E] Umgang mit nicht gelehrten Zeichen als Distraktoren** — hier entsteht das eigentliche Risiko falscher Lerninhalte:
- Distraktoren werden **nie benannt** und nie als „falsches Zeichen" bezeichnet.
- Rückmeldung bei Wahl eines untrainierten Zeichens sinngemäß: „Das ist ein anderer Buchstabe, den du später lernst. Tā hat zwei Punkte **oben**." — Aussage über das Ziel, nicht über den Distraktor.
- Keine Aufgabe vom Typ „Welches ist kein Buchstabe?".
- **[O] Freigabepunkt:** Die Auswahl der Distraktorzeichen ist auch eine Schriftfrage. Prüfung durch `islamic-content-governance` vor Einsatz.

### Die vier Übungsarten

| # | Übung | Aufgabe | Richtige Lösung | Typische Fehler | Unmittelbares Feedback | Spätere Wiederholung |
|---|---|---|---|---|---|---|
| **Ü1** | **Verdeckter Abruf (Flash)** *(existiert)* | Zeichen erscheint 1100 ms, wird verdeckt, dann 4 Optionen | Das gezeigte Zeichen | Wahl aus derselben Formfamilie; bei `prefers-reduced-motion` selbstgesteuertes Weiterschalten | Nennt das Zielmerkmal, nicht nur „richtig": „Richtig. ب – ein Punkt **unten**." Bei Fehler: „Das war ت – zwei Punkte oben. Bā hat einen Punkt unten." | Zählt auf Mastery. Bei Fehler → Ü3 oder Ü4 je nach Fehlerklasse, **nie dieselbe Frage sofort erneut** |
| **Ü2** | **Rasterfund** *(neu)* | Raster aus 9 Zeichen, „Markiere alle Tā", Mehrfachauswahl + Bestätigen | Genau die ت-Zeichen | Positions-Ignorierer markieren auch ن; Anzahl-Ignorierer markieren auch ث | **Jede** Fehlmarkierung einzeln zeigen und benennen, nicht nur „3 von 4 richtig" | Zählt auf Mastery (produktive Form). Deckt F3 zuverlässiger auf als jede Auswahlfrage |
| **Ü3** | **Punktplatzierung** *(neu)* | Leere Grundform (Schale) + Punkt-Token; Punkte oben oder unten setzen | ب: 1 Punkt unten · ت: 2 Punkte oben | Position vertauscht; Anzahl falsch | Token springt zurück, Rückmeldung benennt die **Position** getrennt von der **Anzahl** | Zählt auf Mastery. **Nicht ratbar** — deshalb die Standard-Nachübung bei erkanntem Rateverhalten |
| **Ü4** | **Merkmalsfrage (Text)** | „Wie viele Punkte hat dieses Zeichen und wo?" mit 4 Textoptionen | z. B. „ein Punkt unten" | Zählt richtig, verortet falsch (oder umgekehrt) | Trennt die beiden Achsen ausdrücklich: „Anzahl stimmt. Die Position nicht." | Diagnostisch: trennt F2 von F3. Zählt auf Mastery nur als **eine** der drei Formen |

**[E] Optionsset für Ü4 muss Anzahl und Position kreuzen**, sonst ist die Frage durch bloßes Zählen lösbar: „keine Punkte" / „ein Punkt unten" / „ein Punkt oben" / „zwei Punkte unten" / „zwei Punkte oben" / „drei Punkte oben" — davon 4 pro Item, immer mit mindestens einem Positions- und einem Anzahl-Ablenker.

**[E] Ausdrücklich gestrichen:** Die heutigen Typen `oddOneOut` und `trait` sind bei drei Optionen inhaltliche Dubletten von `nameToChar`. `nameToChar` und `charToName` bleiben als **Lehr**-Items erhalten, zählen aber bis zur Audio-Freigabe (A-1) **nicht** auf Mastery.

### Fehlertaxonomie

**[F] Voraussetzung:** Ohne Speicherung der **gewählten Option** und der **Antwortzeit** ist keine dieser Klassen erkennbar. Heute wird nur die Frage-ID gespeichert.

| Klasse | Beschreibung | Signal in den Antwortdaten | Nachübung |
|---|---|---|---|
| **F1** Grundform nicht erkannt | Formgrenze überschritten | `picked` = ا obwohl ب/ت gefragt, oder umgekehrt | Zurück zu Ü2 ohne Punktbezug: „Alle Zeichen mit dieser Schale markieren". Punktfragen aussetzen, bis F1 gelöst ist |
| **F2** Punktanzahl verwechselt (Position stimmt) | 1 vs. 2 vs. 3 auf derselben Seite | Ziel ت → `picked` ث · Ziel ب → `picked` ي | 3× Ü4 mit gleichbleibender Position, dann 2× Rückführung auf Ü1 |
| **F3** Punktposition verwechselt (Anzahl stimmt) | oben vs. unten | Ziel ب → `picked` ن · Fehlplatzierung in Ü3 | 3× Ü3 (produktiv), dann 2× Ü1 mit ausschließlich Positionsdistraktoren |
| **F4** ب/ت direkt vertauscht | Beide Dimensionen verschieden → Ursache unbestimmt | Ziel ب → `picked` ت oder umgekehrt | **Nicht sofort nachüben, sondern zerlegen:** 1 Anzahl-Item + 1 Positions-Item. Das Ergebnis entscheidet, ob F2 oder F3 folgt. Wichtigste Regel der Taxonomie |
| **F5** Name-zu-Form fehlt | Formdiskrimination vorhanden, Name nicht | Fehler konzentriert auf Namensitems, während Ü2/Ü3/Ü4 korrekt | Namensitems für diese Sitzung **stilllegen**, Ergebnis ohne Namensanteil ausweisen. Kein Nachdrillen ohne Audio |
| **F6** Rateverhalten | Antwort ohne Abrufversuch | `ms` < 800 ms **[S]** und falsch, **oder** wechselnde Distraktorwahlen ohne Muster bei hoher Retry-Quote | Keine weitere Auswahlfrage. Wechsel auf Ü3 (nicht ratbar) + vorwurfsfreier Hinweis: „Nimm dir Zeit, hier zählt nur Genauigkeit" |
| **F7** Flüchtigkeit | Einzelner Ausrutscher | Isolierter Fehler bei sonst korrekten Items desselben Zeichens und Typs, sehr kurze `ms`, benachbarte Kachel | **Keine** Nachübung, **keine** Mastery-Rücksetzung. Item einmal später erneut stellen. Sonst entstehen falsche Fehlerkarrieren |

---

## 7. Fortschritt und Wiederholung

### Wann gilt ein Buchstabe als „erkannt"

Ein Zeichen gilt als **„heute sicher"**, wenn **alle vier** Bedingungen erfüllt sind:

| Bedingung | Wert | Begründung |
|---|---|---|
| Ersttreffer (kein vorheriger Fehler am selben Item) | **4** | **[F]** Arithmetik bei 4 Optionen: 0,25⁴ ≈ 0,4 % durch reines Raten. Bei 3 Ersttreffern wären es ≈ 1,6 %. 4 ist die kleinste Zahl, bei der Raten unter 1 % fällt |
| Verschiedene Aufgabenformen | **≥ 3**, darunter zwingend 1× verdeckter Abruf (Ü1) und 1× produktive Aufgabe (Ü2 oder Ü3) | Verhindert, dass Mastery an einer einzigen Geste hängt. Auswahlfragen allein sind ratbar, produktive nicht |
| Höchste Distraktorstufe | **≥ 1 Ersttreffer auf Stufe 3** | Sonst misst man Ausschlussstrategie statt Können |
| Zeitlicher Abstand | mindestens 2 der 4 Treffer **≥ 2 Minuten** auseinander | Verteiltes Üben als Prinzip: unmittelbar aufeinanderfolgende Treffer belegen Kurzzeitbehalten, nicht Können |

**[S] Offen benannt:** Die Zahlen 4 / 3 / 2 Minuten sind eine begründete Festlegung für eine Demolektion, **keine bewiesene Norm und kein wissenschaftlicher Standard**. Belegbar ist ausschließlich die Ratewahrscheinlichkeit. Wenn im Test ≥ 4 von 5 Personen die Kriterien mühelos oder gar nicht erreichen, sind die Zahlen falsch gewählt und werden angepasst — nicht die Testpersonen.

### Drei Zustände statt zwei

| Zustand | Bedingung |
|---|---|
| **sicher** | alle vier Bedingungen erfüllt |
| **wackelig** | mindestens 1 Ersttreffer, Kriterium nicht erfüllt, oder überwiegend Nachtreffer |
| **noch nicht** | kein Ersttreffer oder Mehrheit falsch |

**[E] Entscheidende Trennung:** Sitzungsinterne Mastery heißt **„heute sicher"**, nie „beherrscht". Erst nach bestandener Folgetagsprüfung: **„auch nach einer Nacht sicher"**. **Nur dieser zweite Zustand** darf jemals in eine Zahl wie „x von 28" einfließen.

### Bestehenskriterium der Lektion

**[S]** Bestanden, wenn ب **und** ت den Status „heute sicher" erreichen. ا ist Kontrastanker, nicht Bestehensbedingung. **Nicht bestanden ist ein regulärer, nicht beschämender Ausgang.**

### Was bei Fehlern geschieht

| Wann | Was |
|---|---|
| Sofort nach dem Fehler | Auflösung **mit Merkmalsbegründung**, nie nur „falsch" |
| Nach 2 dazwischenliegenden Items | Dasselbe Zeichen, **andere** Aufgabenform. Sofortwiederholung ist verboten — sie prüft nur das Echo im Arbeitsgedächtnis |
| Schritt 8 | Gezielte Nachübung je Fehlerklasse (§6) |
| Schritt 9 | Jedes zuvor falsche Zeichen kommt in der Abschlussprüfung nochmals vor, in einer bis dahin **nicht verwendeten** Form |

### Wiederholung am selben Tag vs. am nächsten Tag

Pro Zeichen wird gespeichert: `{status, dueDate, stufe}`. `dueDate` als **lokales Datum**, nicht als Zeitstempel-Differenz.

| Status am Sitzungsende | Fällig in | Bei Erfolg danach | Bei Fehler |
|---|---|---|---|
| noch nicht | 1 Tag, als **erstes** Item | 1 Tag | bleibt 1 Tag |
| wackelig | 1 Tag | 2 Tage | zurück auf 1 Tag |
| heute sicher | 1 Tag | 2 Tage → 4 Tage | **eine** Stufe zurück, nie auf null |

**[S]** Die Intervalle 1 / 2 / 4 sind gesetzt, nicht bewiesen. Ausschlaggebend ist, dass **jedes** Zeichen nach Tag 1 wiederkommt — nur dann ist das Versprechen aus §2 wörtlich wahr und nicht nur für Fehler wahr.

**Schutzregeln [E]:** max. 1 Wiederholungsblock pro Tag · max. 8 Items · ein verpasster Tag erzeugt **keine** Strafe und keinen Reset auf null · kein Streak, keine Punkte, keine Abzeichen · Hinweistext neutral: „3 Buchstaben warten auf eine kurze Prüfung" — **nicht** „Deine Serie endet".

### Ehrliche Fortschrittssprache

| Situation | Formulierung | Verboten |
|---|---|---|
| Zeichen sicher | „**ت – heute sicher.** Du hast es 4-mal im ersten Versuch richtig erkannt, auch mit ähnlichen Zeichen daneben. Morgen prüfen wir kurz, ob es geblieben ist." | „Du beherrschst ت" |
| Sicher, Folgetag offen | „**ب – heute sicher, noch nicht über Nacht geprüft.**" | „Gemeistert", Häkchen ohne Text |
| Zeichen wackelig | „**ب – noch wackelig.** 2 von 5 hattest du sofort richtig, 2 nach einem zweiten Versuch. Das ist ein normaler Zwischenstand. Morgen kommt ب zuerst." | „Fast geschafft!", „Gut gemacht!" |
| Nicht erkannt | „**ت – noch nicht erkannt.** Du hast ت 3-mal mit ب verwechselt. Der Unterschied liegt bei den Punkten: ب einer unten, ت zwei oben. Morgen fangen wir damit an." | „Leider falsch", „Nicht dein Tag" |
| Rateverhalten (F6) | „Einige Antworten kamen sehr schnell. Hier zählt Genauigkeit, nicht Tempo – nimm dir ruhig Zeit." | jede Belohnung für Schnelligkeit |
| Lektion bestanden | „**Lektion bestanden.** ب und ت erkennst du heute sicher, ا war dein Vergleichspunkt. Vorher konntest du 0 von 3 zuordnen, jetzt 2 sicher und 1 wacklig. Aktive Übungszeit: 7 Minuten. Morgen bekommst du ت und ب noch einmal – ohne dass du etwas einstellen musst." | „3 von 28 Buchstaben erkannt" ohne Beleg; feste Minutenangabe |
| Nicht bestanden | „**Noch nicht bestanden – und das ist in Ordnung.** ب sitzt bereits, ت verwechselst du noch mit ب. Genau daran arbeiten wir morgen weiter, mit einer anderen Übungsform. Du fängst nicht von vorn an." | „Fehlgeschlagen", Prozentnote, Vergleich mit anderen |

**[E] Konsequenz für die Startansicht:** `letters` = Anzahl Zeichen mit Status „über Nacht sicher". Am Ende der Demolektion ist die ehrliche Zahl regulär **0**. Solange das so ist, darf „x von 28" **nicht** als Hauptmetrik erscheinen — stattdessen „ب sicher · ت wacklig · ا sicher". `minutes` = real gemessene aktive Zeit oder gar nichts.

---

## 8. UX- und Designrichtung

> Noch **keine** vollständige `DESIGN.md`. Das ist bewusst: Das Schriftsystem (Blocker B-1) bestimmt Größen, Zeilenhöhen und Badge-Maße. Ein Flächen-Redesign vor dieser Entscheidung wäre Ausschuss.

| Bereich | Vorgabe |
|---|---|
| **Visuelle Hierarchie** | Genau **ein** primärer Call-to-Action pro Screen. Home heute: fünf konkurrierende Einstiege, drei davon auf denselben Stoff. Alle `.section-title` sind identisch formatiert (14 px, uppercase, muted) → es gibt keine Rangordnung. Zwei Ebenen einführen: Primärsektion (groß, farbig) und Sekundärsektion (klein, ruhig). |
| **Bühne vs. Aktionskarte** | Der Flächenwechsel ist das **textfreie** Signal „zuschauen vs. handeln". Heute sind Lektions- und Übungs-Screen strukturell identisch (Medaillon, grün, zentriert); einziger Unterschied ist die 13-px-Eyebrow „Übung". Das ist zu wenig. |
| **Abstände** | Spacing-Skala als Token einführen (4 / 8 / 12 / 16 / 24 / 32). Heute: 2/4/6/8/10/12/14/16/18/20/22 px ad hoc, obwohl Radius und Shadow bereits tokenisiert sind. |
| **Leerraum** | `justify-content: safe center` auf `.screen-center` erzeugt 244 px (29 %) Leerraum über dem Übungsinhalt, während Frage und Antwortkacheln darunter zusammengedrängt stehen. Übungs-Screens auf `flex-start` mit definiertem Kopfbereich umstellen. Lektion 2: ca. 60 % Leerraum **unten**, also in der Daumenzone — die Aktionsfläche gehört dorthin. |
| **Farbeinsatz** | Grün bleibt Akzent- und Erfolgsfarbe. **Grün darf nicht gleichzeitig „richtig" und „primäre Aktion" bedeuten** — heute ist der Weiter-Button und die Richtig-Markierung dieselbe Farbe. Fehler nie allein über Farbe kodieren (Text + Position + Form). |
| **Typografie** | Skala mit maximal 6 Stufen. Heute 19 Ad-hoc-Größen von 11 bis 118 px. Mindestgröße für Fließtext 15 px; `.lesson-item-status` mit 11 px und `.stat-label` mit 11 px sind zu klein. `rem` statt `px`, damit Systemschriftgrößen greifen. |
| **Arabische Schrift** | Selbst gehostete, lizenzgeklärte Naskh-Schrift als WOFF2 (**Blocker B-1**). Bis dahin gilt jede Buchstabendarstellung als **ungeprüft**. Zusätzlich: Punktabstand muss bei 100 px **und** bei 15 px eindeutig bleiben. `line-height` ≥ 1.2 beibehalten (Raum für Punkte ober- und unterhalb der Grundlinie). |
| **Light / Dark Mode** | **[F] Sofort zu beheben:** Hero-Button im Dark Mode `--accent-strong` #74e0b4 auf #ffffff = **1,61 : 1**. WCAG AA verlangt 4,5 : 1 (3,0 : 1 für großen Text). Das ist der prominenteste Button der App. Light Mode ist mit 7,77 : 1 in Ordnung. Alle Paare neu messen, nicht nur dieses. |
| **Animationen** | Nur zweckgebunden: Aufmerksamkeit auf das Merkmal lenken (Punkt fährt ein und bleibt markiert). Keine Dauerschleifen. **`prefers-reduced-motion` muss `softShake` einschließen** — heute deckt der Block (`styles.css:1143–1149`) nur `.post-alif-path`, `.post-dot` und `.connect-glyph` ab, der Fehler-Shake läuft trotz Systemeinstellung. |
| **Feedback** | Muss das **Merkmal** nennen, nicht die Auswahl bestätigen. Heute: „Richtig: ب." und für **jeden** Fehlertyp identisch „Noch nicht. Schau dir die Form noch einmal an." — bei ب/ت ist dieser Satz sachlich irreführend, denn die Form ist gleich. `.feedback` hat `min-height: 20px` → Layoutsprung bei zweizeiliger Rückmeldung; auf eine feste Mindesthöhe für zwei Zeilen setzen. |
| **Barrierefreiheit** | Fokus nach Screenwechsel gezielt setzen (heute nirgends). `aria-current` in der Navigation. Touch-Ziele ≥ 44 pt: `.link-btn` ist 163 × 22 px. Rasterfund braucht `aria-pressed` je Zelle. Die vorhandene `aria-live`-Region für Feedback beibehalten. Kein `100vh`-Fallback vor `100dvh` → auf älteren WebViews bricht die Zentrierung. |
| **iOS / Android** | `-webkit-text-size-adjust: 100%` plus reine px-Größen bedeutet: iOS Dynamic Type wird gar nicht bedient, Android-Textskalierung dagegen schon → `.letter-badge` (fix 200 × 200) und `.segmented` brechen bei 200 %. Safe Areas sind sauber eingebunden, aber `.save-btn` und `.post-badges` liegen in der Dynamic-Island-Zone (entfallen mit dem Feed). `.bottom-nav` ist `position: fixed`, löst sich ab 460 px vom gerahmten `.app-shell` — genau in der Ansicht, in der demonstriert wird. |
| **Deutsch / Türkisch / Arabisch** | Bidi-Isolation ist korrekt gelöst und bleibt. **Transkription vereinheitlichen:** heute mischt der TR-Titel „Elif, Bā ve Tā" (`app.js:267`) türkische Eindeutschung mit wissenschaftlichem Makron in einer Zeile. `white-space: nowrap` auf `.lesson-item-status` und `.link-btn` bricht bei TR-Textexpansion. Alle Richtungsangaben sind physisch (`left`, `right`, `border-left`) — für eine spätere arabische UI-Sprache auf logische Eigenschaften (`inline-start`) umstellen. |
| **Open Design** (`nexu-io/open-design`) | Als **Kritik- und Strukturreferenz** für eine spätere eigene `DESIGN.md` gedanklich zulässig. **Nicht installieren, nicht klonen, keine Templates, Assets oder Schriften übernehmen, keine kostenpflichtige Cloud.** Status bleibt wie in `docs/decision-log.md` Z. 17: offen, Prüfung erst in der Designphase. |

### Offene Qualitätsblocker

| ID | Blocker | Konkret zu prüfen | Wer |
|---|---|---|---|
| **B-1** | Keine lizenzgeklärte, selbst gehostete Naskh-Schrift | Lizenztext im Original lesen (kommerzielle Nutzung, Einbettung, Weitergabe, Attributionspflicht); Abdeckung aller 28 Buchstaben in isolierter **und** verbundener Form; Harakat-Positionierung; Punkttrennung bei 100 px **und** 15 px; WOFF2-Subsetting und Dateigröße | Gründer (Lizenz/Kommerz), Frontend (Einbindung), arabische Fachperson (Formqualität) |
| **B-2** | Buchstabenformen nie auf echtem Gerät geprüft | Echtes iPhone **und** echtes Android — ein Simulator genügt für den Font-Fallback **nicht**: Punkt rund statt quadratisch; kein Beschnitt bei 118 px; Android-Textskalierung 200 %; Dark-Mode-Kontrast; `dvh`-Sprünge beim Scrollen; Dynamic Island; Android-Gestenleiste unter der Navigation | Gründer oder benannte Tester mit realen Geräten |
| **B-3** | Keine menschliche Prüfung der arabischen Darstellung | Kalligrafische Korrektheit der Formen und SVG-Outlines; Punktzahl und -position; Freiheit von dekorativen Zusatzpunkten; Transkriptionssystem DE/TR; Formulierung des Positionsform-Hinweises (Szene 6) | Arabischsprachige, qualifizierte hanafitische Fachperson. **Freigabepunkt: `islamic-content-governance`** |

**[E]** B-1 bis B-3 sind **nicht** durch Produkt-, Zeit- oder Kostenargumente überstimmbar. Solange sie offen sind, gilt jede Buchstabendarstellung im Prototyp als ungeprüft und darf nicht als didaktisch geeignet dargestellt werden.

---

## 9. Erfolgskriterien

Test mit **5 bis 10 Personen** der in §2 definierten Zielgruppe. Ablauf: Tag 0 Screening (5 Buchstaben auf Papier benennen) → Demolektion → **Tag 1, ca. 24 h später, ohne Vorwarnung** dieselben Buchstaben auf Papier ohne App.

> **[S] Ausdrücklicher Hinweis:** Alle Zahlen unten sind **vorab festgelegte Setzungen zur Falsifizierbarkeit**, keine wissenschaftlich bewiesenen Standards und keine Branchennormen. Ihr Zweck ist, dass das Ergebnis vorher als Erfolg oder Misserfolg definierbar ist.

| # | Frage | Kriterium | Erhebung |
|---|---|---|---|
| K1 | Verstehen Nutzer ohne Erklärung, was sie tun sollen? | ≥ 8 von 10 starten jede neue Übungsart **ohne Rückfrage** und ohne sichtbares Zögern > 5 s | Beobachtung, keine Selbstauskunft |
| K2 | Erkennen sie ا, ب und ت **nach** der Lektion? | ≥ 3 von 5 erreichen „heute sicher" für ب **und** ت in der Abschlussprüfung | App-Daten |
| K3 | Können sie ب und ت **später** noch unterscheiden? | ≥ 3 von 5 markieren am **Folgetag** ب und ت im 9er-Raster mit ≤ 1 Fehler, ohne erneute Erklärung | Papiertest, ohne App |
| K4 | Verstehen sie ihre Fehler? | ≥ 3 von 5 geben auf die offene Frage „Was hat dir die App über deinen Stand gesagt?" ihre **tatsächliche** Fehlerzahl bzw. Verwechslung korrekt wieder | Nachgespräch, offene Frage |
| K5 | Klassifiziert die App Fehler statt nur „falsch"? | 100 % der Fehler erhalten eine Klasse F1–F7 | Log-Auswertung |
| K6 | Wirkt die App vertrauenswürdig und erwachsen? | Niemand beschreibt sie unaufgefordert als „kindlich", „billig" oder „unfertig". Niemand entdeckt eine falsche Angabe | Nachgespräch |
| K7 | Würden sie die nächste Lektion öffnen? | ≥ 3 von 5 **öffnen die Folgetags-Wiederholung tatsächlich**, ohne dass wir sie darum bitten | Verhalten, **nicht** Absichtserklärung |
| K8 | Raten sie sich durch? | Anteil Antworten unter 800 ms in der Abschlussprüfung < 20 %; **niemand** sagt sinngemäß „ich habe geraten und trotzdem bestanden" | Log + Nachgespräch |

### Klare Abbruchsignale

Die Demolektion gilt als **widerlegt**, wenn eines davon eintritt:

1. **K3 wird deutlich verfehlt** (≤ 1 von 5 am Folgetag) — dann trägt der Ansatz die Kernbehauptung nicht, und mehr Buchstaben oder schöneres Design ändern daran nichts.
2. **K4 wird verfehlt, während K2 erfüllt ist** — die Leute lernen, verstehen aber ihren Stand nicht. Dann ist genau das Versprechen aus §2 nicht angekommen, und der behauptete Vorteil gegenüber Karteikarten existiert nicht.
3. **K7 wird verfehlt** — kein Rückkehrverhalten trotz funktionierender Terminierung.
4. **Mehrere Befragte nennen unabhängig voneinander Präsenzunterricht als klar ausreichenden Weg** (entspricht dem Widerlegungskriterium in `docs/01` §13).
5. **K2 wird von allen mühelos erreicht** — dann ist der Zuschnitt zu leicht und der Test misst nichts. Kein Erfolg, sondern ein ungültiger Test.

**[E]** Wird eine Schwelle deutlich verfehlt **oder** mühelos übertroffen, werden Zuschnitt und Mastery-Zahlen angepasst — nicht die Testpersonen und nicht die Kriterien nachträglich.

---

## 10. Umsetzungsauftrag für Sonnet

> **Noch nicht ausführen.** Erst nach Freigabe durch den Gründer.

### Ponytail-Prüfung der geplanten Funktionen

| Funktion | 1. Muss sie existieren? | 2. Vorhandene Lösung? | 3. Native Browserfunktion? | 4. Vorhandene Struktur? | 5. Kleinste sichere Lösung |
|---|---|---|---|---|---|
| Antwortprotokoll | **Ja** — ohne sie ist Fehlerdiagnose unmöglich | Nein | `Date.now()`, `localStorage` | `persistState()` erweitern | Ein Array von Objekten in bestehendem State, keine neue Datei |
| Rasterfund (Ü2) | **Ja** — deckt F3 zuverlässiger auf als jede Auswahlfrage | Nein | `<button aria-pressed>` | CSS-Grid wie `.letter-choice-row` | 9 Buttons, `aria-pressed` umschalten, ein Bestätigen-Button |
| Punktplatzierung (Ü3) | **Ja** — einzige nicht ratbare Aufgabe | Nein | Kein HTML5-Drag-and-Drop (auf Mobil unzuverlässig) | **Lektion-2-Muster: Chip wählen → Ziel wählen** | Token antippen, dann Feld antippen. Kein Drag, keine Bibliothek |
| Mastery-Berechnung | **Ja** | Nein | – | – | Reine Funktion über das Antwortprotokoll |
| Fälligkeitslogik | **Ja** | Nein | lokales Datum als `YYYY-MM-DD` | – | Datumsvergleich, kein Timer, kein Scheduler |
| Animation | Ja | Ja — CSS + Inline-SVG vorhanden | CSS-Keyframes, SVG | `.post-alif-svg`-Muster | Kein Video, keine Animationsbibliothek |
| 4-Optionen-Layout | **Ja** | Nein | CSS Grid | `.letter-choice-row` | Eine `.choices-4`-Regel ergänzen |
| Zeitmessung | **Ja** | Nein | `Date.now()` | – | Zwei Zeitstempel pro Item |
| Neues Framework / Build / Abhängigkeit | **Nein** | – | – | – | **Bleibt bei Vanilla HTML/CSS/JS ohne Build-Schritt** |

### Weiterverwenden

`I18N`-System · `setArabicText()` · `showView()`-Routing · `shuffle()` · Question-Bank-Struktur · `state.qb.wrongIds` · `round.results` correct/retry · Flash-Mechanik inkl. reduced-motion-Fallback · Lektion-2-Auswahlmuster als Basis für Ü3 · localStorage-Persistenz und Löschfunktion · Demo-/Prüfhinweise · `.letter-choice-row`-Grid · `aria-live`-Feedbackregion

### Neue Screens

| Screen | Zweck |
|---|---|
| `view-precheck` | Baseline, 3 Items, ohne Richtig/Falsch-Rückmeldung |
| `view-stage` | Bühne + Aktionskarte, trägt Szenen 1–6 und A1–A3 |
| `view-grid` | Rasterfund (Ü2) |
| `view-dots` | Punktplatzierung (Ü3) |
| `view-diagnosis` | Nachübung je Fehlerklasse |
| `view-final` | Abschlussprüfung, kein Retry, Auflösung erst am Ende |
| `view-result` | Ehrliches Ergebnis, drei Zustände pro Zeichen, Vorher/Nachher |
| `view-nextday` | Folgetags-Kurzblock |

### Betroffene Dateien

Ausschließlich `index.html`, `styles.css`, `app.js`. **Keine neuen Abhängigkeiten, kein Build-Schritt, kein Paketmanager, kein Backend, keine externen Assets.** Eine zusätzliche `tests.html` (siehe unten). Später: eine WOFF2-Schriftdatei — erst nach Blocker B-1.

### Benötigte Datenstrukturen

```
LETTER = { id, char, nameKey, hintKey, distractors: { 1:[], 2:[], 3:[] } }

ANSWER  = { qid, letterId, type, level, picked, correct, ms, ts, attemptNo }
          -> state.answers: ANSWER[]   (ersetzt das reine wrongIds-Array)

LETTER_STATE = { status: 'none'|'wobbly'|'today_secure'|'overnight_secure',
                 firstTryHits, formsUsed: [], level3Hit: bool,
                 hitTimestamps: [], dueDate: 'YYYY-MM-DD', stufe }
          -> state.letters: { alif: LETTER_STATE, ba: …, ta: … }

BASELINE = { letterId, knownBefore: bool }   -> state.baseline: BASELINE[]

SESSION  = { startedAt, activeMs }           -> für die reale Zeitangabe
```

### Zu entfernende Funktionen

`markLessonComplete()` · `getDailyRecommendationKey()` · `toggleSaveMedia()` · `renderDiscoverDynamic()` · `setupDiscoverObserver()` · `restartSequence()` / `advanceSequence()` / `renderSequenceStep()` / `stopSequence()` · Entdecken-Views und -Handler · Lektion-3-View · Lernziel- und Ausgangssituations-Views samt Handlern · `connectMorph`-Keyframes und `.connect-glyph` · `.post-dot`-Regeln · Dauer-Badges · Statistik-Pill „Minuten"

### Erforderliche Tests

Kein Testframework, kein npm — eine `tests.html`, die im Browser läuft und Ergebnisse ausgibt. Voraussetzung: die folgenden Funktionen werden als **reine Funktionen** geschrieben (Eingabe → Ausgabe, kein DOM-Zugriff):

| Funktion | Testfälle |
|---|---|
| `classifyError(answer, letterState)` | Je ein Fall pro Klasse F1–F7, inkl. der F4-Zerlegung und der F7-Abgrenzung (Flüchtigkeit darf **keine** Mastery-Rücksetzung auslösen) |
| `isMastered(letterState)` | 4 Ersttreffer aber nur 2 Formen → **nicht** sicher · 4 Ersttreffer, 3 Formen, kein Stufe-3-Treffer → **nicht** sicher · alle vier Bedingungen → sicher · 4 Treffer innerhalb 30 s → **nicht** sicher (Abstandsbedingung) |
| `nextDueDate(status, stufe, today)` | Jede Zeile der Tabelle in §7 · Fehler senkt genau **eine** Stufe, nie auf null · Monats- und Jahreswechsel |
| `buildDistractors(letterId, level, excludeSet)` | Nie das Zielzeichen als Distraktor · immer genau 4 Optionen · zwei aufeinanderfolgende Items ergeben nicht dasselbe Set |
| `progressSentence(letterState, lang)` | Nach genau 1 richtiger Antwort enthält der Satz **nicht** „beherrschst" · „über Nacht sicher" erscheint nie vor der Folgetagsprüfung |

Zusätzlich **manuell** zu prüfen: Durchlauf bei 390 px in Light und Dark · `prefers-reduced-motion` aktiv (inkl. Fehler-Shake) · Reload mitten in der Runde · localStorage geleert · Systemschriftgröße 200 % · Screenshot desselben Screens von **echtem iPhone und echtem Android** (Nachweis für B-2, Vorlage für B-3).

### Abnahmekriterien

1. Kein Fortschrittswert ist fest verdrahtet. Bei 0 richtigen Antworten zeigt die App **0 sichere Zeichen** und keine Minutenzahl.
2. Jeder Fehler erzeugt einen Protokolleintrag mit **gewählter Antwort** und Antwortzeit und wird einer Klasse F1–F7 zugeordnet.
3. Jede Zeichenfrage hat 4 Optionen, das Set wird pro Item neu berechnet, zwei aufeinanderfolgende Items haben nie dasselbe Set.
4. Rasterfund und Punktplatzierung sind vollständig bedienbar, ohne Drag-and-Drop, mit sichtbarem Zustand und `aria-pressed`.
5. Keine Rückmeldung besteht nur aus „richtig"/„falsch" — jede nennt das Merkmal (Anzahl und/oder Position).
6. Kein Screen zeigt einen dekorativen Punkt an einem Buchstaben.
7. Kein Screen behauptet eine Dauer, die nicht gemessen wurde.
8. Kontrast aller Text-/Hintergrundpaare ≥ 4,5 : 1 in Light **und** Dark. Der Dark-Mode-Hero-CTA ist behoben.
9. Alle Touch-Ziele ≥ 44 × 44 px.
10. `prefers-reduced-motion` schaltet **alle** Bewegung ab, einschließlich `softShake`.
11. Der Übungs-Screen hat keinen ungenutzten Leerraum > 15 % über dem ersten Inhalt.
12. Nach jedem Screenwechsel liegt der Fokus auf einem sinnvollen Element.
13. Die Lektion ist bei 390 px vollständig ohne horizontales Scrollen bedienbar.
14. Ein Reload mitten in der Lektion verliert keinen Fortschritt und blockiert keine Runde.
15. `tests.html` läuft ohne Fehler durch und meldet alle Fälle als bestanden.
16. Alle Demo-/Prüfhinweise sind erhalten, solange B-1 bis B-3 offen sind.

---

## 11. Bewusst nicht im nächsten Build

| Nicht enthalten | Grund |
|---|---|
| Vollständiges Alphabet (28 Buchstaben) | **[E]** Mehr Inhalt auf einer unbewiesenen Messung vergrößert nur den Schaden. Erst wenn drei Zeichen nachweislich sitzen |
| Verbindungsformen (Anfangs-, Mittel-, Endform) | Braucht die Schrift aus B-1. Wird in Szene 6 ehrlich als „später" gekennzeichnet |
| Aussprache-Audio | Freigabepunkt A-1: erst nach geprüfter Aussprache und geklärten Rechten |
| Qur'an-Inhalte, Qur'anrezitation, Tajwid | Freigabepunkt A-2. Nicht Teil dieser Lektion |
| Nutzerkonten, Login, Cloud-Sync | Nicht nötig für die Lektion. localStorage genügt |
| Backend, Datenbank, API | Kein Bedarf, keine Kosten, kein Datenschutzrisiko erzeugen |
| Community, Kommentare, Direktnachrichten, Creator-Uploads | `CLAUDE.md` und `docs/decision-log.md` Z. 12: nicht im MVP |
| Bezahlfunktion, Abo, Preisdarstellung | Kein validiertes Produkt, das man verkaufen könnte |
| Kinderbereich, Elternkonten, Altersabfragen | Zielgruppe ist ausdrücklich ab 18. Kinderschutzkomplexität bewusst vermieden |
| Umfangreiche Gamification: Streaks, Punkte, Abzeichen, Bestenlisten, Tempoboni | `CLAUDE.md`: keine Optimierung auf Suchtmechanik. Verfälscht zudem das Testergebnis |
| Türkische Testrunde | Erst nach validiertem Kern auf Deutsch. TR-Strings bleiben im Code |
| Konvertiten-Journey | `docs/decision-log.md` Z. 16: eigenständige Gruppe, offene Frage. Wird nicht still mitbeantwortet |
| Entdecken-/Feed-Format in jeder Form | Widerspricht der eigenen Positionierung |
| Push-Benachrichtigungen, E-Mail-Erinnerungen | Erfordert personenbezogene Daten. Die Folgetags-Fälligkeit funktioniert lokal |
| Analytics, Tracking, Crash-Reporting | Nicht ohne Datenschutzprüfung und Einwilligungskonzept |
| Vollständige `DESIGN.md` | Erst nach B-1 — die Schrift bestimmt die Skalen |

---

## 12. Offene Punkte und benötigte Gründerentscheidungen

### Was wir nicht wissen

- Ob erwachsene Nullanfänger drei Zeichen in einer Sitzung auf Mastery-Niveau bringen. **Das ist Gegenstand des Tests, keine Planungsgrundlage.**
- Ob localStorage auf den Testgeräten bis zum Folgetag überlebt. Safari/iOS löscht Website-Daten unter bestimmten Bedingungen. **Das gesamte Tagesversprechen hängt daran** — technisch prüfbar, bisher ungeprüft.
- Ob Buchstabennamen ohne Audio überhaupt ehrlich lernbar sind. Wird hier verneint und deshalb aus dem Masterykriterium herausgenommen — selbst eine Setzung, keine belegte Tatsache.
- Wie gut bestehende digitale Elifba-Angebote diesen Bedarf bereits decken. **Es gibt weiterhin keine Wettbewerbsanalyse** (`docs/01` §10). Keine Aussage in diesem Dokument behauptet eine Marktlücke.
- Ob die Mastery-Zahlen (4 / 3 / 2 min) und die Intervalle (1 / 2 / 4 Tage) sinnvoll gewählt sind.

### Konflikt zwischen den Agentenpositionen

| Konflikt | Positionen | Auflösung in diesem Dokument |
|---|---|---|
| Screening-Set vs. Distraktoren | CPO schlägt als Screening ا ب ت ن ي vor. Learning Science braucht ن und ي als Distraktoren | **[O] Ungelöst.** Wenn Screening und Distraktoren dieselben Zeichen nutzen, entsteht ein Übungseffekt, der die Vorher/Nachher-Aussage entwertet. Entscheidung E4 unten |
| Dauer | Startseite wirbt mit „5 Minuten", Learning Science veranschlagt 7–9 Minuten aktiv | **[O]** Entweder Claim streichen oder reale Zeit ausweisen. Entscheidung E5 |
| Audio | CPO: Aussprache ist Lerngegenstand, jetzt entscheiden. UX/Governance: kein geprüfter Qari, keine Rechte | Aufgelöst: Namen werden **gelehrt**, zählen aber **nicht** auf Mastery. Audio als markierter Freigabepunkt A-1. Der Vergleich gegen ein YouTube-Video ist damit für diese Testrunde bewusst verloren — das muss gewusst sein |

### Benötigte Entscheidungen

| # | Entscheidung | Konsequenz |
|---|---|---|
| **E1** | Wird das Antwortdatenmodell (`picked`, `ms`, `ts`, `level`) eingeführt? | **Blockierend.** Ohne es sind Fehlerdiagnose, Masterykriterium und das Kernversprechen nicht baubar |
| **E2** | Zuschnitt „ا als Anker + ب/ت als Paar" mit 20/80-Budget bestätigt? | Bestimmt Item-Anzahl und Aufbau der Erklärungen |
| **E3** | Dürfen nicht gelehrte Zeichen (ث ن ي ل) als Distraktoren erscheinen — und geht das vor Einsatz durch `islamic-content-governance`? | Ohne sie bleibt die 33-%-Ratelücke bestehen |
| **E4** | Wird das Screening-Set als Baseline wiederverwendet oder ist der Vorcheck eigenständig? | Sonst Übungseffekt, der die Vorher/Nachher-Aussage entwertet |
| **E5** | Gilt „5 Minuten" als Claim weiter, oder wird die reale Zeit ausgewiesen? | Konflikt mit ehrlicher Fortschrittssprache |
| **E6** | Wird „x von 28" ausgeblendet, bis die erste Folgetagsprüfung bestanden ist? | Die ehrliche Zahl wäre an Tag 1 „0 von 28" |
| **E7** | Medium: interaktive Animation statt Video bestätigt? | Bestimmt den gesamten Produktionsweg |
| **E8** | Schrift (B-1): frei lizenziert oder kommerziell? Budget? | Blockiert Designskalen und Geräteprüfung |
| **E9** | Wer testet auf welchen realen Geräten, bis wann? (B-2) | Ohne echte Geräte bleibt die Buchstabenform ungeprüft |
| **E10** | Wer ist die benannte arabische/hanafitische Prüfperson? (B-3) | Kein Release religiöser oder schriftbezogener Inhalte ohne sie |
| **E11** | Wird der Prototyp auf **eine** Lektion reduziert, oder bleibt die breite Vitrine? | Bestimmt den Umfang des nächsten Builds |
| **E12** | Konvertiten-Option im Onboarding: raus (konsistent mit `decision-log`) oder drin (dann `decision-log` anpassen)? | Aktuell beantwortet der Prototyp still eine offene Frage |

---

**Nächster überprüfbarer Schritt:** ein einzelner, isoliert lauffähiger Lektionsbildschirm nach dem Storyboard in §5, mit funktionsfähigem Rasterfund und funktionsfähiger Punktplatzierung, ehrlicher Fortschrittsanzeige und überarbeiteten Rückmeldungssätzen. **Abnahmenachweis:** ein Screenshot desselben Screens von einem echten iPhone **und** einem echten Android, auf dem die Punkte von ب und ت als Punkte erkennbar sind. Dieser Screenshot ist zugleich der Prüfnachweis für B-2 und die Vorlage für B-3.

> `docs/decision-log.md` wurde bewusst **nicht** verändert. Die Entscheidungen E1–E12 gehören dort erst hinein, nachdem der Gründer diese Spezifikation geprüft und entschieden hat.
