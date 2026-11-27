# G – Gegenprüfung (Red Team), 27.11.2026

Abruf: 27.11.2026, 03:08–03:35 UTC (04:08–04:35 MEZ), sofern nicht anders angegeben. Werkzeuge: Playwright (`/tmp/claude-0/pw/fetch.js` + eigene Skripte im Scratchpad), WebSearch, WebFetch, CPSC-REST-API, EU-Safety-Gate-Suchmaske (öffentlich).
Gesperrt bzw. nicht nutzbar: otto.de (HTTP 400, auch Playwright), smythstoys (Bot-Seite), mueller.de (403), Amazon, idealo, geizhals. Bot-Schutz wurde nicht umgangen. Preise aus Suchsnippets sind als SNIPPET markiert.
Status-Legende: **BESTÄTIGT** / **KORRIGIERT** / **OFFEN**.

---

## D – Babyphone

| Prüfpunkt | Status | Beleg |
|---|---|---|
| test.de-Artikel vom 26.07.2026 "Die Einfachen sind die Besten" existiert. Basis: Consumentenbond, 25 Geräte (10 Audio, 15 Video), Fließtext ohne Paywall | **BESTÄTIGT** | https://www.test.de/Babyphones-im-Test-Die-Einfachen-sind-die-Besten-6322300-0/ (03:08 UTC) |
| Bestes Audio: Philips Avent SCD713/26 ("ab knapp 90 €", 113 h, Abbruch bei 130 m, Störungen ab 60 m). P/L-Tipp: Alecto DBX-125 (ca. 50 €, 42 h). Bestes Video: Alecto DVM2043 (ca. 150 €, 21 h, Ø 49 m). Durchschnitt: Audio 40 h und 70 m, Video 14 h und oft unter 40 m | **BESTÄTIGT** (wörtlich im Artikel) | dto. |
| Ist der Testsieger noch aktuell? | **OFFEN** | Consumentenbond zeigt am 27.11. "57 babyfoons getest" und "Laatste update van de test: 24 augustus 2026". Das ist **nach** dem test.de-Artikel. Neu gelistet sind u. a. Alecto DBX-85 ECO, DBX140, DBX150, DBX-80 und Luvion Essential 2. Ob SCD713 und DVM2043 nach dem Update noch vorn liegen, ist hinter der Paywall nicht prüfbar. https://www.consumentenbond.nl/babyfoon/beste (03:12 UTC) |
| Übersehene Geräte | **OFFEN** | test.de schreibt selbst: In der eigenen Datenbank gibt es "vier Geräte mit gutem Qualitätsurteil", die aktuell im Handel sind. D nennt nur drei Noten aus Sekundärquellen. Die Modellnamen stehen hinter der Paywall. |
| Live-Preis SCD713 | **BESTÄTIGT/ERGÄNZT** | Coolblue.de **107,00 €** (UVP 129,99), Versand frei, "morgen geliefert", **30 Tage kostenloser Umtausch**, 9,2/10 aus 81 Bewertungen, https://www.coolblue.de/produkt/895337/philips-avent-dect-babyphon-scd713-26.html (03:09 UTC). MediaMarkt.de: 112,66 € **zzgl. Versand**, Marktplatz "Electronic Shops DEU", Lieferung 08.–14.12., https://www.mediamarkt.de/de/search.html?query=SCD713 (03:15 UTC). Otto: gesperrt. Philips.de 139,99 € (SNIPPET). Ein Preis ≤ 90 € ist heute bei keinem prüfbaren Händler belegt. |
| Live-Preis DVM2043 | **KORRIGIERT** (günstigere Quelle) | MediaMarkt.de **144,29 €**, versandkostenfrei, Verkauf und Versand durch **Commaxx Group DE**, Lieferung 02.–03.12. Laut Suchtreffer ist Commaxx der Alecto-Anbieter, die Verkäuferidentität ist also plausibel. https://www.mediamarkt.de/de/search.html?query=alecto%20dvm2043 (03:16 UTC). Coolblue.de 159,00 € (03:10 UTC). babymondino: Die Suche lieferte "Keine Ergebnisse für ''" (Suchparameter griff nicht), ein DVM2043-Treffer über die Websuche fehlt ebenfalls. Der Preis 134,99 € bleibt **UNVERIFIZIERT**. In NL kostet das Gerät laut Consumentenbond 99 €, für DE ohne Belang. |
| Akku SCD713, Ersatz | **KORRIGIERT/ERGÄNZT** | Die Elterneinheit nutzt 2× AA NiMH 1,2 V (Philips 130AAHC, 1300 mAh, laut Philips-Handbuch-Snippet). Der Akku ist **wechselbar**. Ersatz gibt es z. B. als Cellonic 2× 2600 mAh für 9,95 € + 2,95 € Versand, SCD713 dort ausdrücklich gelistet: https://www.subtel.nl/en/Battery-for-Philips-Avent-SCD560-SCD501-SCD580-SCD585-SCD503-SCD525-SCD502-SCD713-SCD735-SC-936920.html. Philips-FAQ: Akkus haben eine begrenzte Lebensdauer. Systematische Akkudefekte beim SCD713: kein Fund. Langzeitrisiko = gering und billig behebbar (SCHLUSSFOLGERUNG). Akkuangaben 18 h (Philips/Coolblue-Text) vs. 113 h (Consumentenbond) widersprechen sich weiter, vermutlich unterschiedlicher Modus (ANNAHME). |
| Rückrufe | **BESTÄTIGT (keine)** | Safety Gate: 0 Treffer "Philips Avent", 0 Treffer "Alecto" (03:31 UTC). CPSC: Rückruf "Philips Avent Digital **Video** Baby Monitors" (03.08.2023, Verbrennungsgefahr, US-Modelle). Betrifft nicht das SCD713. https://www.cpsc.gov/Recalls/2023/Philips-Avent-Digital-Video-Baby-Monitors-Recalled-by-Philips-Personal-Health-Due-to-Burn-Hazard |
| DVM2043: Verschlüsselung/FHSS | **OFFEN** | Kein Beleg gefunden. Coolblue führt in den Specs "Digital, Internetverbindung", obwohl das Gerät kein WLAN und keine App hat. Die Händlerdaten sind also fehlerhaft und keine Quelle. |

**Ist "Audio statt Video" sinnvoll begründet? Gegenposition (SCHLUSSFOLGERUNG):**
Die Messdaten tragen die Empfehlung. Sie ist aber eine Durchschnittsaussage und wurde zu pauschal übernommen. Der test.de-Artikel nennt selbst zwei Fälle, in denen Video hilft: Das Baby macht im Schlaf Geräusche, oder es ist wach und meldet sich nicht. Die Schwächen von Video wiegen je nach Wohnung sehr unterschiedlich:
- Reichweite Ø 49 m und Abbrüche unter 40 m sind in einer Wohnung oder einem Reihenhaus meist irrelevant. Kritisch werden sie bei mehreren Geschossen mit Stahlbetondecken oder bei Garten/Keller.
- 21 h Akku heißt: tägliches Laden. Das ist lästig, aber kein Sicherheitsproblem, solange der Abbruch-Alarm funktioniert.
- Beide Kandidaten arbeiten lokal ohne Cloud. Beim Datenschutz gibt es also keinen Unterschied.
- Die stärkeren Argumente gegen Video sind andere: Video sendet dauerhaft statt nur bei Geräusch (VOX). Es lädt zum Dauerbeobachten ein. Und bei Video gibt es kein klares Testergebnis zur Übertragungssicherheit.

Empfehlung: Die Typfrage nach Grundriss entscheiden, nicht nach Testrang. SCD713 bleibt der robuste Standard. DVM2043 ist für eine einstöckige Wohnung eine gleichwertige Wahl, kein Fehlkauf. In beiden Fällen ist ein Reichweitentest im eigenen Haus Pflicht. Coolblue bietet dafür 30 Tage Umtausch statt der gesetzlichen 14 Tage.
Kaufzeitpunkt: 107 € ist **kein** BF-Preis. test.de nannte im Juli "ab knapp 90 €", Consumentenbond NL 90 €. Das Gerät wird erst ab März gebraucht. → warten, Zielpreis ≤ 90–95 € (D bestätigt).

---

## B – Hochstuhl Hauck Alpha+

| Prüfpunkt | Status | Beleg |
|---|---|---|
| 5-tlg. Set (Alpha+ + Bouncer 2in1 + Baby Seat + Tray) irgendwo lieferbar? | **BESTÄTIGT: nein** (bei babyartikel alle Varianten geprüft) | Ausverkauft sind alle 5-tlg.-URLs: Stretch Beige/Walnut (…-2), Sand/Walnut (…-3), Stretch Grey/Black, Dark Grey Melange/Black (…-1), Deluxe Melange Grey/Black (189,90 €), Premium Dark Grey/Mint, Premium Dark Grey/Walnut (199,90 €), Eco Light Grey/White, Eco Deep Grey/Natur, Eco Deep Grey/Grey (269,90 €). Muster: https://www.babyartikel.de/prod/hauck-alpha-plus-5-tlg-newborn-set-hochstuhl-2in1-neugeborenenaufsatz-wippe-baby-seat-essbrett-2 (03:18–03:22 UTC). Nicht gleichwertig, aber lieferbar: "5-tlg. Alpha **Move** Newborn Set" (Natur, 219,90 €, mit Holztisch, ohne Baby Seat) und "Alpha Plus White **XXL** Newborn Set" (249,90 €). |
| Smyths 149,99 € – Inhalt | **OFFEN** (Tendenz: kein 5-tlg.) | Smyths ist bot-geblockt. Der Snippet zur AT-Seite (p/248324, "Hauck Hochstuhl Alpha+ Newborn Set") beschreibt nur Hochstuhl + Neugeborenenaufsatz. SCHLUSSFOLGERUNG: 2-teilig, ohne Tray und Baby Seat, eventuell ohne Wippengestell. |
| **Wichtiger Befund:** Ist der Baby Seat nötig? | **KORRIGIERT** | Laut babyartikel-Seite umfasst der Alpha+ selbst: **"Alpha Plus Hochstuhl, Schutzbügel aus Buchenholz, Schrittgurt, 5-Punkt-Gurtsystem"**, nutzbar "ab ca. 6 Monaten", EN 14988:2017+A2:2024 (Warnhinweis bis 3 J./15 kg). https://www.babyartikel.de/prod/hauck-hochstuhl-alpha-plus-walnut (03:27 UTC). Baby Seat und Click Tray sind also **Komfort-Zubehör, keine Sicherheitsvoraussetzung**. Beide werden erst ab ca. Sept. 2027 gebraucht und lassen sich später kaufen. |
| Einzelkauf-Optimierung | **KORRIGIERT** (B: "225–250 €", "babyone 89,99") | babyartikel.de, alles **lieferbar (Lieferung Sa 28.11.)**, Versand frei ab 50 € (03:23 UTC): Alpha+ Walnut **85,00 €** (UVP 109,90), Bouncer 2in1 Stretch Beige **64,90 €** ("Preis bisher 69,90"), Highchair Baby Seat White **24,90 €**, Click Tray Speckle Beige/Grey/Black **34,90 €**. **Summe 209,70 € inkl. Versand.** Zum Vergleich hauck.de mit HAPPY10: 224,64 €. |
| Günstigste gleichwertige Route heute | **NEU** | babyartikel **"Black Deal"**: "15 % Rabatt mit Code **blackdeal15** auf alle Produkte mit „Black Deal“-Label", gültig bis Mo 30.11. (https://www.babyartikel.de/de/black-exclusive-deals, 03:25 UTC). Gelabelt und lieferbar ist "Alpha Plus 4-tlg. Newborn Set – Hochstuhl + 2in1 Neugeborenenaufsatz & Wippe + Sitzkissen Deluxe – Stretch Beige – Walnut" für **159,90 €** (UVP 209,70), https://www.babyartikel.de/prod/hauck-alpha-plus-4-tlg-newborn-set-hochstuhl-2in1-neugeborenenaufsatz-wippe-sitzkissen-deluxe-3. Mit Code ≈ **135,91 €**. Inhalt: Stuhl + Bouncer 2in1 + Wippengestell + Sitzkissen, damit von Geburt an voll nutzbar. Plus Baby Seat + Tray (ohne Label) = **≈ 195,72 €**. Das ist das gleichwertige 5-tlg. Set inkl. Sitzkissen, 12 % billiger als der Einzelkauf. Einschränkung: Code im Warenkorb nicht getestet (keine Bestellung), deshalb **UNVERIFIZIERT bis Warenkorb**. Der Code "friday15" verlinkt auf die Kategorie /cat/unterwegs (Kinderwagen etc.) und gilt vermutlich nicht für Hochstühle. |
| Rückrufe Hauck | **KORRIGIERT** (B: "kein Treffer, Lücke") | Direkte Safety-Gate-Abfrage "Hauck" ergab 4 Treffer (03:29 UTC): Treppengitter A12/01740/20 (09.12.2020, laut Which? später als Fehler zurückgezogen), **Kinderhochstuhl A12/00945/20 (16.10.2020, Verletzung/Strangulation)**, Laufgitter A12/0117/19, Kinderwagen A12/1321/18. Das Modell des Hochstuhl-Alerts war im Detail nicht abrufbar. Wahrscheinlich ist es der **Hauck Mac Baby Deluxe** (CCPC Irland, 11.08.2020: "injury, strangulation and/or suffocation", https://ccpc.ie/consumers/?p=11895). Das ist ein anderes Modell, kein Alpha+. Diese Zuordnung = SCHLUSSFOLGERUNG, nicht bestätigt. CPSC: nur Go-Karts (2018). |
| EAN 4251209175914 = babyartikel-Bundle | **BESTÄTIGT** (über B, nicht erneut geprüft) | – |

**Preisgrenzen-Korrektur:** Die Grenzen von B ("sehr gut 150–165 €" für 5-tlg.) bleiben formal bestehen. Die sinnvolle Entscheidung ist aber, jetzt den Black-Deal-4-tlg. für ≈ 136 € zu kaufen. Das liegt unter B's "außergewöhnlich ≤ 149 €" für alles, was ab Geburt gebraucht wird. Baby Seat und Tray (≈ 60 €) später oder gar nicht kaufen.

---

## E – Badewanne

| Prüfpunkt | Status | Beleg |
|---|---|---|
| Preis Stokke Flexi Bath + Stand + Newborn Support | **BESTÄTIGT, Quelle korrigiert** | E hat den **Luxemburg-Shop** (EUR/de-lu) zitiert. Der DE-Shop zeigt denselben Preis: **109,00 €** (Originalpreis 142,00), "Kostenloser Versand ab €39" → **Versand 0 €**, Lieferung ab Mi 02.12.2026. https://www.stokke.com/DEU/de-de/bad/stokke-flexibath/flexibath-newborn-stand-bundle.html (03:20 UTC). Stand einzeln 55,00 €, Wanne 39,00 € (DE, lieferbar). F nannte früher 119 €, heute 109 €. |
| Rückrufhistorie Flexi Bath | **BESTÄTIGT: kein Wannen-/Stöpsel-Rückruf; ERGÄNZT** | CPSC-API: kein Flexi-Bath-Rückruf. Stokke-Rückrufe dort: YOYO³ 2024, Clikk 2022, Steps Bouncer 2019, Trailz 2015, Xplory 2007, Sleepi-Matratze 2007. Health Canada "stokke": YOYO³, Clikk, Steps Bouncer, Tripp Trapp Newborn Set (2019), kein Flexi Bath (https://recalls-rappels.canada.ca/en/search/site?search_api_fulltext=stokke). Safety Gate "Stokke": Kinderwagen 2024, Wippe/Liege 2019, kein Flexi Bath. **Australien (ACCC):** Rückruf "Flexi Bath **Newborn Support**", weil das Warnetikett nicht dauerhaft befestigt war (Mandatory Bath Aid Standard). Abhilfe war ein neues Etikett, Datum nicht ermittelt (https://www.productsafety.gov.au/recall/stokke-as-flexi-bath-newborn-support, nur Snippet, Seite blockiert). Die Vermutung "Abflussstopfen-Rückruf 2017" ist **nicht belegt**. Der hitzeempfindliche Stöpsel war eine Produktänderung, kein Rückruf. Für heutige EU-Ware ist kein offener Rückruf bekannt. |
| Newborn Support + Stand kompatibel? | **KORRIGIERT** (E: "nicht kombinierbar??") | Stokke verkauft beides als Bundle. Stokke-Support: Der Newborn Support "latches on to the edge of the bathtub", der Stand trägt die Wanne über 4 Clips. Handbuch-Snippet (manualslib): Stand nur mit Flexi Bath und dessen Newborn Support verwenden. → **kompatibel**. https://support.stokke.com/hc/en-us/articles/44500250322833-General-info-Stokke-Flexi-Bath (03:22 UTC) |
| Nutzungsgrenzen | **ERGÄNZT** | Stand: **max. 10 kg** und nur, solange das Kind nicht allein stehen kann. Newborn Support: bis 8 Monate / 8 kg. Wasserstandsmarke für Babys bis 10 Monate. Hose & Plug gehören zum Stand. **Schimmel durch Zusammenfalten im feuchten Zustand ist von der Garantie ausgeschlossen** (Stokke-Support, s. o.). Gestell-Nutzung realistisch bis ca. 8–11 Monate (ANNAHME, je nach Gewichtskurve), danach Wanne in der Familienwanne bis 4 J. |
| Arbeitshöhe | **OFFEN** | Stand 57 × 95 × 87 cm, 3,7 kg (Stokke-UK-Vergleichsseite, Snippet). Ein Händler gibt H 96 cm und "erfüllt DIN EN 17072:2018" an (Händlerangabe). Die Höhe des Wannenrands ist nirgends belegt, vor Ort messen. |
| moovkee-Ausschluss fair? | **BESTÄTIGT, mit Ergänzung** | E schließt moovkee nicht aus, sondern macht es von Unterlagen abhängig. Das ist fair. Zusätzliches objektives Kriterium: Nach **EU-Produktsicherheitsverordnung (GPSR, VO 2023/988, anwendbar seit 13.12.2024)** müssen Online-Angebote Hersteller (Name, Post- und E-Mail-Adresse), ggf. eine EU-verantwortliche Person, Produktkennung und Warnhinweise nennen. Fehlen diese im Kaufland-Listing, ist das ein Ausschlussgrund und keine Geschmacksfrage. Die Angabe "bis 30 kg" ohne Norm- oder Prüfbeleg ist bei einem 10-kg-Referenzgestell (Stokke) unplausibel (SCHLUSSFOLGERUNG). Safety Gate "moovkee": 0 Treffer (bei No-Name-Ware wenig aussagekräftig). |
| Bessere Komplettstation übersehen? | **OFFEN** (keine belastbare bessere gefunden) | Shnuggle (in DE kein Händler) und Rotho (ohne Neugeborenen-Einlage) sind nicht gleichwertig. Nicht geprüft: Badewannen-Aufsätze für Wickelkommoden. Die gibt es nur, wenn eine Kommode vorhanden ist, das ist laut Auftrag unklar. |

---

## C – Windeleimer

| Prüfpunkt | Status | Beleg |
|---|---|---|
| TCO-Skript (`python3 -I C-tco.py`) | **BESTÄTIGT** (läuft, Asserts OK, Ausgabe = Tabelle in C) | Windeln 2.600 / 4.425 / 5.885. Chicco Markt 53,2 / 59,3 / 65,4 €. TT 224,7 / 361,4 / 470,8 €. 367 Leerungen in 3 J. = 18,4 € Beutel. Rechenweg nachvollzogen: 91×9 + 274×6,5 = 2.600. Schwächen: (1) Die "spätestens alle 3 Tage"-Regel gilt nur für Beutelsysteme, nicht für Kassetten. Das bevorzugt Kassetten und ist damit konservativ. (2) Der Kassettenpreis 7,49 € stammt aus dem dm-6er-Pack, größere Packs sind evtl. billiger. (3) Die Kassettenkapazität 100/120 ist geschätzt. Die Reihenfolge (Beutel ≪ Kassette, +350–400 € über 3 J.) bleibt bei jeder plausiblen Variation stabil. Kein Rechenfehler. |
| Identität Smyths Art. 254840 | **BESTÄTIGT** (Snippets CH/AT/NL) | "Chicco Windeleimer weiß", Standardmodell ohne Teleskop, normale Müllbeutel, bis 25 Windeln, ca. 48 cm, ohne Kassetten. Die NL-Seite nutzt dieselbe Ref. (https://www.smythstoys.com/ch/de-ch/baby/wickeln-und-windeln/windeleimer-und-nachfuellkassetten/chicco-windeleimer-weiss/p/254840). Die Gleichsetzung mit dem Odour-Off-Standardmodell ist plausibel, der EAN-Abgleich steht aus. |
| Smyths-Preis 10 € / 13,95 € | **OFFEN** (UNVERIFIZIERT) | DE-Seite blockiert, Websuche ohne Beleg für 10 €. |
| Live-Preis Chicco Odour Off | **KORRIGIERT** (Verfügbarkeit) | babyartikel.de: Odour Off weiß 42,99 € **ausverkauft**, Teleskop 44,99 € **ausverkauft** (03:24 UTC, beide Seiten gelesen). C führte den Teleskop-Preis nur als Snippet. Ubbi Mint 59,96 € **ausverkauft**. MediaMarkt und windeln.de führen das Modell nicht, Coolblue hat kein Sortiment. Otto: **38,08 €** (UVP 59,90, 106 Bewertungen) nur als SNIPPET, live nicht prüfbar (HTTP 400). Kaufland 47,61 € (SNIPPET). **Es gibt heute keinen live verifizierten Neupreis für Chicco bei einem erreichbaren Händler.** |
| Übersehene Alternativen | **ERGÄNZT** | babyartikel führt u. a. Magic Majestic (normale Müllbeutel), Diaper Champ One/Medium/Large und Nattou Dropy. Preise nicht erhoben. Kein unabhängiger Labortest zu Windeleimern gefunden (wie C). |
| Rückrufe | **BESTÄTIGT (keine Windeleimer)** | Safety Gate "Chicco": nur Autositz/Basis (2021/2022). CPSC "Chicco": Polly-Hochstuhl 2012 u. a., kein Windeleimer. |

---

## F – Amazon Baby-Wunschliste / Prime

| Prüfpunkt | Status | Beleg |
|---|---|---|
| Prime-Preis | **BESTÄTIGT** | Neukunden **8,99 €/Monat bzw. 89,90 €/Jahr**. Nach dem BGH-Urteil zahlen Altkunden mit Start vor dem 15.09.2022 wieder 69 €/Jahr (Finanztip/Verbraucherzentrale, Okt. 2026). https://www.verbraucherzentrale.de/wissen/vertraege-reklamation/kundenrechte/primepreiserhoehung-unzulaessig-amazon-scheitert-vor-dem-bgh-126181 |
| Probemonat | **BESTÄTIGT (sekundär)** | 30 Tage gratis für berechtigte Neukunden, einmal pro Konto, verlängert sich automatisch (monsterdealz/homeandsmart, 2026). Amazon-Primärseite gesperrt. |
| Prime-Pflicht für 15 % | **OFFEN (widersprüchlich)** | GIGA 23.08.2026: "für die Wunschliste und den Rabatt ist **kein** Prime-Abo notwendig". dealdoktor (Update 17.09.2026): Für das **Willkommensgeschenk** muss man Prime-Mitglied sein und 5 Tage warten, MBW 10 €, ein Listenartikel ≥ 25 €. Ein Snippet nennt Codes BWL15 (Prime, 15 %) und BWL10 (ohne Prime, 10 %), unbestätigt. https://www.giga.de/tech/15-prozent-rabatt-bei-amazon-diesen-spar-trick-sollten-alle-werdenden-eltern-kennen--01K04HD21PR9N808CGSG092GWY ; https://www.dealdoktor.de/magazin/amazon-baby-wunschliste/ |
| **Übersehene Bedingung** | **KORRIGIERT** (fehlt in F) | Laut GIGA gilt der Rabatt erst **ab 14 Tagen nach Erstellung der Liste** und im Fenster 180 Tage vor bis 90 Tage nach dem Termin. Die Fristen beginnen also am ca. 22.09.2026 und laufen bis ca. 20.06.2027. Ausgenommen sind Formula, Bücher und Windeln ab Gr. 3. Nur der Listeninhaber erhält den Rabatt. Max. 300 € Ersparnis auf 2.000 € Warenwert, nur ausgewählte Artikel (laut F zusätzlich nur "Verkauf und Versand durch Amazon"). → **Eine heute angelegte Liste bringt am BF/Cyber Monday nichts.** Frühestens ab ca. 11.12.2026 nutzbar. |
| Lohnt es sich für den Warenkorb? | **SCHLUSSFOLGERUNG** | Die Liste anzulegen kostet 0 €, also heute anlegen. Ob es sich lohnt, hängt am Amazon-Grundpreis, und der ist nicht prüfbar. Faustregel: Amazon-Preis × 0,85 muss unter dem besten Fremdpreis liegen. Beispiel Hauck: Ein Walnut-5-tlg. bei Amazon für 189,90 € (B-SNIPPET, Verkäufer ungeprüft) ergäbe 161,42 € und läge damit **unter** der babyartikel-Route (195,72 €). Das wäre die eventuell beste Option für das Set, aber unverifiziert. Prime nur über den Gratismonat nutzen, kein bezahltes Abo für diesen Zweck (Geschenkwert ≤ ~30 €). |

---

## A – Matratze (Emma Kindermatratze 60×120)

| Prüfpunkt | Status | Beleg |
|---|---|---|
| (a) Höhe 11 vs. 15 cm, IKEA-Grenze 12 cm | **BESTÄTIGT 11 cm (hohe Wahrscheinlichkeit); 15 cm = Template-Fehler** | Sichtbare Emma-Seite: "Höhe: 11 cm – für Babys und Kinder im Alter von 0 bis 5 Jahren". Schichten laut derselben Seite: 1,5 cm AeroFoam + 5,5 cm SupportBase + 1,5 cm AeroFoam = **8,5 cm Schaum**. "15 cm" steht nur in der Meta-/Schema-Beschreibung. Dort steht im selben Text "geeignet für Kinder- und **Jugendbetten**" und "50 Nächte", also offensichtlich ein generischer Textbaustein. https://www.emma-matratze.de/emma-kindermatratze/ (03:26 UTC). IKEA-Anleitung AA-2598773: "Empfohlene Mindestmatratzengröße … 120 cm x 60 cm bei einer maximalen Stärke von 12 cm". Abstand Matratzenoberkante bis Rahmenoberkante ≥ 500 mm (unten) bzw. ≥ 200 mm (oben). https://www.ikea.com/de/de/manuals/gulliver-babybett-weiss__AA-2598773-1-2.pdf (PDF gelesen). Nach Lieferung nachmessen bleibt richtig. |
| (b) Probezeit | **BESTÄTIGT 100 Nächte (sichtbar); 50 = Meta-Text** | wie oben. Gilt die Rückgabe auch für Kindermatratzen? Laut sichtbarer Seite ja ("100 Nächte Probeschlafen – Volle Rückerstattung garantiert"). |
| (c) Preis/Code | **BESTÄTIGT Dauerpreis; Code OFFEN** | Schema-Offer SKU EMABM060120AAD (GTIN 4255762734823): **149,25 €, InStock**, kostenlose Lieferung. Der "25 % Rabatt" auf 199 € ist ein **Dauer-Streichpreis** (149,25 € schon am 01.10.2024, A/t-online) und damit künstlich. Live anwendbarer Code: keiner gefunden. "5 % Newsletter" ist widersprüchlich: sparwelt (Aug. 2026) ja, erfahrungen.com (Juli 2026) "kein Newsletter-Gutschein", Discoup-5 %-Code lief am 23.11.2026 ab. Die 141,79 € sind daher **UNVERIFIZIERT**. |
| (d) Günstigere gleichwertige 60×120 | **ERGÄNZT** | Kein zweites "sehr gut" im test.de-Test. Der Test umfasst nur **70×140** (test.de-Freitext: "Die Modelle … haben die Größe 70 mal 140 Zentimeter", 37 Modelle, 12 "gut" oder besser). Nächstbeste P/L-Option: **Beco Kaja**, "gut" (2,2) als 70×140 bei test.de. Die 60×120-Variante kostet laut testbericht.de "ab 89,00 €" (SNIPPET, Höhe ≤ 12 cm nicht geprüft). Das sind ~60 € weniger, bei schwächerer Note. IKEA KRUMMELUR 49,99 € (A), Note hinter Paywall. bett1 Bodyguard 2,6, kein Vorteil. Aldi/Lidl/Alvi/Julius Zöllner: kein Test-Beleg für 60×120 gefunden (Alvi Malte bei ÖKO-TEST 2022 "ungenügend", laut A). |
| Übertragbarkeit 70×140 → 60×120 | **BESTÄTIGT als ANNAHME** | Emma schreibt selbst "Die Emma Kindermatratze (Größe 70×140cm) wurde … ausgezeichnet". Gleicher Schichtaufbau, daher plausibel, aber nicht geprüft. A kennzeichnet das korrekt. |
| Spaltmaß | **OFFEN** | IKEA nennt kein Innenmaß und keinen Maximalspalt. Die Faustregeln widersprechen sich: ca. 2 cm "zwei Finger", 20 mm (Raising Children AU), 3 cm (Silentnight), 4 cm (UK-Händler); Lullaby Trust (via Which?): "fit snugly, no gaps". Die "max. 3 cm" von A sind eine Annahme, wie gekennzeichnet. Vorschlag: Beim Hineindrücken zur Seite darf kein Spalt > 2 Finger entstehen. |
| Laken/Schoner-Sicherheit | **BESTÄTIGT, mit Präzisierung** | IKEA-Anleitung: "Wegen Erstickungsgefahr NIEMALS Kunststofftüten oder andere Überzüge aus Kunststoff als Matratzenschutz benutzen." Das stützt A ("kein wasserdichter Schoner"). test.de-Freitext bestätigt nur, **dass** wasserdichte Betteinlagen auf Luftdurchlässigkeit geprüft wurden und es "eine klare Empfehlung" gibt. Die konkrete Aussage "weitgehend luftundurchlässig, rät ab" steht hinter der Paywall. A nennt dafür keine einsehbare Quelle → als SEKUNDÄR/UNVERIFIZIERT markieren. |
| Rückrufe | **BESTÄTIGT (keine)** | Safety Gate "Emma": 6 Treffer, keiner zu Matratzen ("Emma"-Babyschaukel 2023 ist eine andere Marke). |

---

## Querschnitt

**Fehler/Korrekturen (Zusammenfassung):**
1. B: Der Einzelkauf wurde mit 225–250 € um 15–40 € zu hoch angesetzt. Real sind es **209,70 €**, über Black Deal **≈ 195,72 €**. Übersehen wurde außerdem, dass der Alpha+ Bügel und 5-Punkt-Gurt schon enthält. Damit sind Baby Seat und Tray optional.
2. E: Zitiert wurde der LU-Shop. Der DE-Preis ist identisch, und die Versandkosten (0 €) sind jetzt belegt. Die Kompatibilität Newborn Support + Stand ist geklärt (ja).
3. F: Die **14-Tage-Wartefrist** der Amazon-Wunschliste fehlt, ebenso Prime-Kosten und Probemonat.
4. D: Den DVM2043 gibt es günstiger bei MediaMarkt (Commaxx, 144,29 €). Der Consumentenbond-Stand ist inzwischen neuer als der test.de-Artikel.
5. C: Der Teleskop-Preis 44,99 € bei babyartikel war als lieferbar geführt, das Modell ist aber ausverkauft. Ein Chicco-Neupreis ist heute nirgends live belegt.
6. A: Nichts Falsches gefunden. Die 15-cm/50-Nächte-Unsicherheit ist weitgehend aufgelöst.

**Künstliche Rabatte:** Emma "−25 %" auf 199 € ist ein Dauerpreis. Coolblue SCD713 "UVP 129,99" ist vs. Marktpreis 90–107 € irrelevant. babyartikel-UVP 249,60 € ist nur die Summe der Einzel-UVPs. Hilfreich: Ein "Preis bisher" muss nach **§ 11 PAngV** der niedrigste Preis der letzten 30 Tage sein, eine UVP nicht. Beispiel Bouncer: "Preis bisher 69,90" → 64,90 € ist eine echte Senkung um 7 %.

**Versand und Bündelung:** Alle Hauptartikel liegen einzeln über der jeweiligen Versandfreigrenze: Emma frei, Coolblue frei, Stokke ≥ 39 €, babyartikel ≥ 50 €. Bündeln lohnt nur bei Kleinteilen: Baby Seat, Tray und Spannbettlaken in die babyartikel-Hauck-Bestellung legen. Chicco ist dort aktuell nicht lieferbar. Keinen Kleinkram einzeln bestellen (3,95–5,79 € Versand).

**Gesamtstrategie (SCHLUSSFOLGERUNG):**
- **Jetzt (bis 30.11.):** Hauck Black-Deal 4-tlg. ≈ 136 € (Code im Warenkorb prüfen). Stokke-Bundle 109 € (Versand frei). Beides ist echt unter dem Vergleichsniveau und lieferbar.
- **Warten:** SCD713 (107 € ist kein Deal, Ziel ≤ 95 €). Emma (Dauerpreis, 100 Nächte, kein BF-Vorteil). Chicco (kein live verifizierter Preis; im März kaufen, Otto-Snippet 38 € als Referenz).
- **Amazon-Wunschliste heute anlegen.** Ab ca. 11.12. Hauck-Set, SCD713 und Chicco mit −15 % gegen die obigen Preise prüfen. Prime nur per Gratismonat.
- Verifizierte Kernkosten: Emma 149,25 + Hauck 135,91 + SCD713 107,00 + Stokke 109,00 = **501,16 €**. Mit Baby Seat + Tray 560,96 €, mit Chicco (~38–47 €) ca. 600–610 €.

**Verbleibende Risiken / OFFEN:**
- Code blackdeal15 nicht im Warenkorb getestet.
- Safety-Gate-Alert Hauck-Hochstuhl 2020: Modell nicht bestätigt.
- Consumentenbond-Update vom August 2026: Ranking unbekannt.
- Smyths 10 € weiterhin unverifiziert.
- Amazon-Preise und Wunschlisten-Bedingungen nicht aus Primärquelle.
- Höhe des Stokke-Wannenrands.
- DVM2043: Verschlüsselung.
- Emma-Newsletter-Code.
- Spaltmaß GULLIVER erst nach Lieferung messbar.
