# E001 „Regel Acht" — Freigabepaket v3.1 (Entwurf, NICHT veröffentlicht)

Datei: `final/E001_Regel_Acht.mp4` (**v3.1**, 25.10.) · 61,7 s (> 1 min) · 1080×1920 · 30 fps · H.264/AAC · 27,1 MB · technische QC **15/15** (`final/E001_Regel_Acht.qc.json`) · Verständlichkeit (Whisper) **15/15**
v3.1 = eure neue Stimmbesetzung (Qwen3-TTS: Erzähler C, Nox B, Mira C, Lina A), Hook-Bildtext „7 REGELN. 8 KERBEN.", Hook-Satz endet bei 1,72 s, Ticken am Ende = nahtloser Loop zum Anfang. Bild unverändert.
Vergleich: `final/E001_v2_vs_v3.jpg` · v2 bleibt reproduzierbar über Commit `006911a`.

## Was sich gegenüber v2 geändert hat
| | v2 | v3 |
|---|---|---|
| Bild | 2D-Vektor-Puppets aus Code | lokal generierte KI-Keyframes im 3D-Animationsfilm-Look (FLUX.2-klein, Figuren über Referenzbilder gesperrt) |
| Bewegung | Puppet-Animation | Kamerafahrten, In-Shot-Verwandlungen, Mundbewegung, Licht-/Partikel-Effekte |
| Story-Requisiten | gezeichnet | präzise Overlays auf dem Bild: 8 Siegelkerben, Ringnadel, Gravur, Foto, Handschrift (Bildmodelle zählen/zeichnen das unzuverlässig) |
| Stimmen | Piper (CC0), flach | v3.1: Qwen3-TTS (Apache-2.0), vom Co-CEO gewählte, per Beschreibung entworfene Stimmen; je Zeile 4 Takes, Auswahl per Spracherkennung |
| Länge | 31,9 s | 61,7 s (Cold Open + Rückblende, Miras Versiegelung, Nox' Schlussfrage) |
| Kosten | 0 € | 0 € (alles lokal, keine Lizenzkosten) |

## TikTok-Entwurf
- **Cover-Text:** DAS ECHO-ARCHIV · Folge 1 · Regel Acht (Cover-Frame-Vorschlag: S16, Mira mit dem Foto, ca. 0:48)
- **Caption:** Nox brach Regel acht. Offiziell gibt es nur sieben. Wer ist Lina? 🕰️
- **Hashtags:** #DasEchoArchiv #Mystery #Animation #Kurzserie #KIgeneriert — **keine** Kinder-/Cartoon-Tags (Slop-Cluster, Kinderpublikum)
- **Angepinnter Kommentar:** Folge 2 „Der Brief" kommt am [Datum]. Wer hat „Lina lebt." geschrieben? Eure Theorien 👇
- **Einstellungen:** Schalter „KI-generierte Inhalte" **aktivieren** · Playlist „Staffel 1" · kein Trend-Sound (eigener Ton)
- **Credits (Beschreibung oder Profil-Link):** Bild: FLUX.2 [klein] (Black Forest Labs, Apache-2.0) · Stimmen: Qwen3-TTS (Qwen, Apache-2.0), per Beschreibung entworfen, keine echte Person · Schriften: Cinzel, Caveat (OFL)

## Ehrliche Selbst-QC (ich kann nicht hören — bitte zuerst anhören)
Stark: moderner, konsistenter Look; Figuren wiedererkennbar (Nox, Mira, Lina, Pip); Hook mit visuellem Rätsel ab Frame 0 (7 goldene + dunkle 8. Kerbe + Bildtext), erster Satz endet bei 1,72 s; Twist eindeutig (Foto: Nox als Kind + Lina); Rewatch-Details (Ringnadel = Signatur unter „Lina lebt.").
Schwach / bitte prüfen:
1. **Neue Stimmen** — als Erstes anhören (Klang, Alter, Gefühl). ~~„Rieding"~~ erledigt: der Hook-Satz wird roh zu 1,00, mit Straffung 1,1× zu 0,91 erkannt. Linas Erinnerungsstimme: Hall auf ein Echo (240 ms) reduziert, weil der alte Hall „versprochen" verwischte (0,65 → 1,00).
2. ~~Miras Twist-Satz~~ — nachgemessen: korrekt erkannt (1,00); der frühere Befund war ein Messfehler (Whisper verschluckt Anfänge ohne Stille, behoben).
3. **Animation** = „Animated Illustration": Kamera, Mundbewegung, Effekte — keine durchgehende Figurenanimation (Gehen, Gestik). Generatives Video ist auf dieser CPU ohne Budget nicht machbar.
4. S14b: Nox' Augen werden kurz leer-weiß (Erinnerungsverlust) — wirkt evtl. zu gruselig? · S07: Tränen als stilisierte Linien · S12: engerer Ausschnitt, etwas weicher.
5. Plant P7 (Fotoecke in Miras Tasche, S06) fehlt — Bildmodell setzte das Foto zweimal an Nox; wegretuschiert. Story funktioniert (Foto erscheint in S16), Nachholen in E02/E03 möglich.
6. Keine Musik (Musik-Policy offen) — Atmosphäre trägt Sounddesign.

## Episoden-Roadmap
E01 Regel Acht → E02 Der Brief → E03 Miras Lüge … E10 Lina. Empfehlung unverändert: **E01 erst posten, wenn E02 + E03 fertig sind.**

## Freigabe
- [ ] Story ok · [ ] Stimmen ok (Hook-Satz!) · [ ] Bild ok · [ ] Policy ok (S14b) · [ ] Caption/Hashtags ok → Upload manuell durch Co-CEO
