# Story Bible

## 1. Konzeptauswahl (2026-10-25)

Drei originelle Konzepte, bewertet gegen Marktanalyse, Policy und **heutige** Produktionsmittel (Code-Animation, lokale TTS, kein Budget).
Bewertung ist qualitative Einschätzung (1–5), keine objektive Messung.

| Kriterium | A: Das Echo-Archiv | B: Amt für verlorene Dinge | C: Ein Atemzug Geschichte |
|---|---|---|---|
| Pitch | Junger Archivar sieht den nicht gewählten Weg jeder Entscheidung — und verliert dafür jedes Mal eine Erinnerung. | Verlorene Gegenstände (Socke, Schlüssel, Regenschirm) stellen in einer deutschen Behörde Anträge, wiedergefunden zu werden. | Echte historische Momente als 30-s-Dilemma einer fiktionalisierten Figur („Der Pilot hatte Treibstoff für genau eine Entscheidung.") |
| Genre | Mystery-Fantasy-Drama | Humor / absurd mit Herz | Historisches Drama |
| Hook-Stärke | 5 — Regel-/Objekt-Paradoxa | 4 — visueller Widerspruch (Fruit-Mechanik) | 4 — Dilemma |
| Serien-Engine | 5 — Fall der Woche + Macro-Mystery + Preis der Kraft | 4 — Anthologie + Rahmenbogen | 3 — Anthologie, keine wiederkehrende Hauptfigur |
| Originalität / Sättigung | 4 | 3 — Nähe zur übersättigten Anthropomorph-Welle | 3 |
| DACH-Fit | 4 | 5 — Behördenhumor sehr deutsch | 4 |
| Internationalisierbar | 5 | 2 — Humor sprachgebunden | 4 |
| Machbar mit heutigen Mitteln | 3 — menschliche Mimik ist in Vektor begrenzt | 5 — Objekte = einfache Formen | 2 — Epochen, Menschen, Recherche |
| Policy-/Rechtsrisiko | niedrig | niedrig | mittel (Faktentreue, reale Personen) |
| IP-/Franchise-Wert | 5 | 4 | 2 |

**Entscheidung: A — Das Echo-Archiv**, als mehrteilige Serie (Staffel 1 = 10 Folgen, Gesamtbogen 3 Staffeln, Ende geplant).
Begründung: stärkste Serien-Engine und IP, international skalierbar, alle drei Lanes (Mystery, Prüfungen, Emotion/Historie) in einer Welt.
Risiko: Figurenschauspiel ist mit unseren Mitteln das schwächste Glied → Inszenierung über Objekte, Licht, Close-ups und Stimme.
B bleibt Backup-Format für einen späteren günstigen Humor-Test; C wird als Lane „Memory Stories" in A integriert (historisch inspirierte Echos).

## 2. Welt

- **Nachhall**: eine verborgene Stadt hinter der gewöhnlichen. Aus jeder Entscheidung, die ein Leben verändert hat, entsteht ein **Echo** — ein Gegenstand, der den nicht gewählten Weg enthält.
- Manche Echos sind harmlos, manche verändern Erinnerungen, manche können eine Entscheidung erneut geschehen lassen (lokales Umschreiben der Wirklichkeit).
- Das **Archiv** sammelt und versiegelt Echos, bevor sie die Wirklichkeit verändern. Archivare tragen Handschuhe: Berührung mit bloßer Haut aktiviert Echos.
- **Die sieben Regeln** (in jedem Archivsaal eingraviert):
  1. Kein Echo verlässt das Archiv. 2. Berühre kein Echo mit bloßer Hand. 3. Verändere keine Entscheidung. 4. Sprich nicht mit Echos.
  5. Kein Archivar sucht sein eigenes Echo. 6. Was versiegelt ist, bleibt versiegelt. 7. Vertraue dem Kurator.
- Die versiegelte Tür aus E01 führt in den **Vorraum der Stillen Kammer**, wo die eigenen Echos der Archivare verwahrt werden. Die **innere Tür** öffnet sich erst in E07.
- **Regel acht** (geheim, nur hinter der inneren Tür der *Stillen Kammer* eingraviert): **„Ein Archivar darf sich nicht erinnern."**
  Das Archiv löscht die persönlichen Bindungen seiner Archivare, damit niemand je versucht, die eigene Entscheidung umzuschreiben.
  Nox „bricht" Regel acht, indem er sich an Lina erinnert.
- **Nox' Kraft**: Berührt er ein Echo, sieht er den nicht gewählten Weg. **Preis**: Er verliert jedes Mal eine eigene Erinnerung — meist die, die am stärksten mit dem Echo verbunden ist.
- Herkunft der Kraft (Auflösung S3): Nox' gelöschte Erinnerungen wurden selbst zu Echos; er ist „durchlässig".

## 3. Figuren (Character Lock: `series/echo-archiv/characters/characters.js`)

| Figur | Funktion | Ziel | Innerer Konflikt | Silhouette / Merkmal | Farbe | Stimme (Pilot) |
|---|---|---|---|---|---|---|
| **Nox Veyr** (~17) | Protagonist | herausfinden, wer er war | Wahrheit finden vs. Erinnerungen verlieren | geteilter Mantel (sein rechter Ärmel navy, linker ocker), asymmetrischer Pony, gebrochener Kreis am linken Kragen | navy/ocker | thorsten-high |
| **Mira** (~18) | Rivalin/Partnerin, Kurator-Schülerin | Rang „Siegelmeisterin" | Regeln vs. Gewissen | scharfer Bob, silberne Haarspange, hoher Kragen, geometrische Schulterplatte (ihre linke Schulter) | petrol/silber | kerstin-low |
| **Lina Veyr** (~12 in Visionen, ~16 heute) | Nox' Schwester, Macro-Mystery | dass Nox sein Versprechen hält | Treue vs. Groll | roter Schal | rot | kerstin, hochgepitcht + Echo |
| **Pip** | lebende Kompasskreatur | zeigt auf das Echo des Weges, den sein Gegenüber früher *nicht* gewählt hat (nie auf die Zukunft) | Comic Relief + überraschendes Wissen | runder Messingkörper, Nadel, Augen über dem Glasrand | messing | (stumm) |
| **Der Kurator** | Mentor / Antagonist | Archiv stabil halten | schützt Nox oder manipuliert ihn? | Gesicht nie ganz sichtbar, geometrische Silhouette | grau/gold | offen |

Mira ist **keine Love Interest**: eigene Ziele, Fähigkeiten, Entscheidungen. Echo-Partikel (gold) sind Markenelement.

## 4. Visuelle Sprache (Phase 1, ehrlich benannt)
2D-Vektor-Cel-Look (SVG), starke Silhouetten, 2–3 Hauptfarben pro Figur, große lesbare Augen, Licht als Story-Mittel, Filmkorn.
Das ist **Motion-Graphics/Puppet-Animation**, nicht die im Research skizzierte „3D-Cel-Animation". Ziel Phase 2: referenzbasierte generative Shots auf Basis derselben Designs.

## 5. Audio-Identität
Echo-Logo (Swell + Ping, viermal abklingend) · metallisches Echo bei Siegeln · Herzschlag beim Preis der Kraft · Stille als Schnittmittel („Ton bricht ab").
Keine melodische Musik bis zur Policy-Entscheidung (siehe `CONTENT_POLICY.md`).

## 6. Staffel 1 „Regel Acht" — Zentralkonflikt, Bogen, Ende

**Zentralfrage:** Wer ist Lina, und warum vergisst Nox sie immer wieder?
**Wahrheit (geplante Auflösung):** Lina ist Nox' jüngere Schwester. Als Kinder am Bahnhof versprach Nox, zurückzukommen, und stieg in den Zug ins Archiv. Der Kurator löschte seine Erinnerung an sie (Regel acht). Nox hat seither mehrfach Spuren gefunden, sich erinnert, sein Echo berührt — und Lina wieder vergessen. Er hinterlässt sich selbst Notizen. Mira hat das beobachtet und gemeldet, aber seine Notizen versteckt.

| Folge | Titel | Engine | Micro-Story (gelöst) | Macro (Fortschritt) |
|---|---|---|---|---|
| E01 | Regel Acht | Forbidden Object | Was ist hinter der Tür? → Nox' eigenes Echo (Uhr) | Lina existiert; „Lina lebt." in Nox' Handschrift |
| E02 | Der Brief | Lost Letter | Ein fremder, nie zugestellter Brief wird zugestellt | Unter den Briefen: einer von Lina an Nox, Bahnhof erwähnt |
| E03 | Miras Lüge | Rival Secret | Gemeinsame Mission gelingt | Mira berichtet dem Kurator über Nox — und versteckt seine Notizen |
| E04 | Das erste Echo | Historical/Memory Case | Fall eines historisch inspirierten Echos (gekennzeichnet) | Wie Echos und das Archiv entstanden |
| E05 | Nur eine Erinnerung | Impossible Choice | Nox rettet ein fremdes Kind-Echo | Preis: er vergisst Miras Namen; sie stellt sich neu vor |
| E06 | Der falsche Feind | False Enemy | Ein Echo-Dieb wird gestellt | Er ist ein ehemaliger Archivar mit zurückgewonnenen Erinnerungen |
| E07 | Prüfung Null | Rival Trial | Rangprüfung; Mira lässt Nox gewinnen | Zugang Stille Kammer; Regel acht ist eingraviert (Payoff P1) |
| E08 | Pips Richtung | Mascot Reveal | Pip führt aus einem Labyrinth | Pip zeigt auf den Kurator |
| E09 | Der Kurator | Mentor Twist | Nox findet seine früheren Notizen (dreimalige Schleife, Payoff P2) | Kurator holte Nox vom Bahnhof und löscht Bindungen aller Archivare |
| E10 | Lina | Season Finale | Nox berührt das Uhr-Echo **nicht** (kein Umschreiben der Vergangenheit), gibt es Mira zum Versiegeln, verlässt nachts das Archiv | **Auflösung:** Er findet Lina am echten Bahnhof. Sie: „Du hast es versprochen." Er: „Ich bin gekommen." (Payoff P4) |

**Staffelende ist ein echter Abschluss** (Wer ist Lina, warum vergaß er sie, Wiedersehen). Der S2-Haken öffnet einen *neuen* Konflikt:
In Linas Rucksack liegen versiegelte Echos — sie sammelt draußen mit den „Ungezählten".

## 7. Serienbogen bis zum Ende (geplant)
- **S2 „Die Ungezählten"** — Lina und ehemalige Archivare wollen alle Echos freigeben (Freiheit vs. Ordnung). Nox zwischen Schwester und Mira.
  Ende S2: Eine Freigabe löscht beinahe ein Stadtviertel; Lina stoppt sie unter persönlichem Preis. Neues Gleichgewicht: Echos nur freiwillig an ihre Besitzer.
- **S3 „Der erste Kurator"** — Der Kurator ist selbst das Echo der Entscheidung des Archivgründers. Finale: Regel acht fällt.
  **Serienende:** Nox wird Kurator und schreibt eine neue achte Regel: **„Jeder darf sich erinnern."** Das Archiv wird eine Bibliothek, die man freiwillig besucht; Mira führt die Archivare; Lina hält den Bahnhof als Tor zwischen beiden Welten.
- Eine neue große Serie beginnt erst, wenn S1 abgeschlossen produziert ist (Regel aus dem Auftrag).

## 8. Kanon-Regeln (dürfen nicht widersprochen werden)
1. Visionen und der Preis entstehen nur bei Hautkontakt. Ein Echo kann seinen eigenen Besitzer rufen (Ton, Licht, Bewegung, Stimme) — fremde Echos tun das nie.
2. Nox' Preis ist immer eine eigene Erinnerung, nie die eines anderen.
3. Visionen zeigen den nicht gewählten Weg, nie die Zukunft. 4. Pip lügt nie, spricht nie (Definition §3). 5. Der Kurator zeigt sein Gesicht erst in S3.
6. Historische Echos tragen die Endkarte „Inspiriert von realen Ereignissen. Figuren und Dialoge fiktionalisiert."
7. Archivare tragen im Dienst Handschuhe; eine bloße Hand an einem Echo ist immer eine bewusste Entscheidung.
8. Rückblenden vor dem Archiv zeigen Nox ohne Archivmantel (Navy-Pullover + ockerfarbener Schal).
