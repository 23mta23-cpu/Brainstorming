# Flow-Pilot: echte Animation mit eurem Google AI Pro (0 € Zusatzkosten)

Ziel: 3 Testclips, die zeigen, ob Veo 3.1 unsere gesperrten Figuren (Nox, Mira, Pip) **in Bewegung** bringt und dabei wiedererkennbar hält.
Kosten: etwa 60 Flow-Credits (3 × Veo 3.1 Fast à 20), im AI-Pro-Abo enthalten (laut Übersichten 1.000 Credits/Monat + 50/Tag).
Danach entscheiden wir gemeinsam anhand der Clips, wie Folge 3 und die Neufassung von Folge 1–2 gebaut werden.

## Schritte (ca. 10 Minuten; Bezeichnungen in Flow können leicht abweichen)
Alternative ohne Flow: Gemini-App → Chip **„Videos"** wählen (nicht der normale Chat) → Bild-Button → Startbild → Format 9:16 → Prompt → senden. Reihenfolge: **P3 zuerst** (unverfänglich), dann P2, dann P1.

1. Die drei Startbilder aus diesem Ordner herunterladen: `P1_start.jpg`, `P2_start.jpg`, `P3_start.jpg`
   (auf GitHub: Datei anklicken → Download-Symbol).
2. **labs.google/flow** öffnen, mit dem Google-Konto anmelden, das Google AI Pro hat → neues Projekt.
3. Modus **„Frames to Video"** (Video aus Startbild) wählen · Modell **Veo 3.1 – Fast** · Format **9:16 (Hochformat)** ·
   Anzahl Ausgaben **1** (spart Credits).
4. Startbild hochladen, den passenden Prompt unten **komplett** in das Textfeld kopieren, generieren.
5. Gefällt der Clip nicht, einmal neu generieren; sonst herunterladen (höchste Qualität) und umbenennen in `P1.mp4`, `P2.mp4`, `P3.mp4`.
6. Hochladen: auf GitHub in diesen Ordner `series/echo-archiv/flow_pilot/clips/` (Branch `claude/ai-studio-foundation`)
   → „Add file" → „Upload files" → „Commit changes". Dann mir kurz schreiben: „Clips sind da."

Ich baue danach: unsere gewählten Stimmen, Untertitel, Sounddesign und Story-Overlays auf die Clips, prüfe Figurentreue und Lippen,
und zeige euch das Ergebnis im Vergleich zur jetzigen Fassung.

Hinweis: Eure Startbilder und Prompts gehen dabei an Google (Flow). Es sind nur unsere eigenen Serienbilder, keine Personendaten.
Vor einer Veröffentlichung prüfe ich die Nutzungsbedingungen für Flow-Clips (kommerzielle Nutzung, Wasserzeichen).

---

## P1 — Handlung: Nox greift nach dem Brief, Mira hält ihn zurück (Startbild `P1_start.jpg`)
Fassung 1 wurde von Gemini abgelehnt (25.10., „I can't generate that video") — vermutlich Filter auf „bare hand / grabs the wrist firmly / young".
Fassung 2 (ohne Griff, ohne „bare", ohne Altersangabe):
```
Stylized 3D animated film, close-up. Two cartoon hands above a glowing old envelope with a red wax seal on a wooden desk: one hand without a glove coming out of a navy sleeve, one hand in a dark grey glove. The ungloved hand slowly moves toward the glowing seal; the gloved hand gently stops it by resting on the wrist and guiding it back. Golden dust swirls up from the seal and settles. Slow dolly in, warm golden glow, deep teal background. Keep everything exactly as in the image. Sound: soft magical hum, a quiet breath, fabric rustle. No music, no subtitles, no text.
```

## P2 — Sprechendes Gesicht: Nox begreift, wer den Brief abgelehnt hat (Startbild `P2_start.jpg`)
```
Extreme close-up of the young man in the image, black hair with asymmetric bangs, coat split navy blue and ochre. His wide eyes tremble, a tear runs down his cheek, he swallows hard, then whispers slowly in German, broken, with a pause after the name: "Enn Feyr ... das bin ich." His head shakes slightly in disbelief. Camera: very slow dolly in. Lighting: trembling warm lamp light from below, dark background, floating golden dust. Style: stylized 3D animated feature film, hand-painted textures; keep his face, hair and coat exactly as in the image. Audio: his quiet whisper only, soft room tone. No music. Negative: no subtitles, no captions, no text, no watermarks.
```

## P3 — Figurenanimation: Pip zeigt den Weg (Startbild `P3_start.jpg`)
```
Close-up: a small brass compass creature with two round eyes sits on the shoulder of a young man in a coat split navy blue and ochre, in a dark archive with walls of drawers. The creature blinks, shuffles its tiny feet, and its red needle swings back and forth, then snaps to point straight up toward a high drawer. The young man turns his head and looks up, following the needle, curious, a faint smile. Camera: slow tilt up following his gaze. Lighting: warm lamp light, deep teal shadows, floating golden dust. Style: stylized 3D animated feature film, hand-painted textures; keep the creature and the young man exactly as in the image. Audio: a soft mechanical ticking, a tiny chirp, quiet room tone. No music, no speech. Negative: no subtitles, no captions, no text, no watermarks.
```

## Ergebnis Runde 1 (25.10., Gemini-App, Clips in `clips/`)
| Clip | Inhalt | Befund |
|---|---|---|
| `gemini_A_9x16_20s.mp4` | P3 Pip (3D, 0–10 s) + Nox weint (3D, 10–20 s) | **echte Bewegung** (Nadel, Blinzeln, Kopfdrehung); Veo spricht Deutsch verständlich („Entfeyer, das bin ich."); Gesichts-Clip **driftet** (anderes Gesicht, Mantel mit Knöpfen statt geteilter Hälften) |
| `gemini_B_16x9_10s.mp4` | P1 Hände (Anime) | starke Bewegung + Magie-Effekt; **Querformat** (falsch); **bloße Hand berührt das Siegel** (Kanon 1); Komposition weicht vom Startbild ab |
Kein sichtbares Wasserzeichen in den Ecken gefunden. Testschnitt mit Cast-Stimmen: `Testschnitt_A_eure_Stimmen.mp4` (Veo-Stimme entfernt, Cast-Take an der Pause geteilt und auf Veos Mundbewegung gelegt).
Runde 2: Format 9:16 prüfen; Startbild wirklich anhängen (bzw. Flow „Frames to Video" = Startbild als exaktes erstes Bild); P1-Prompt: Hand stoppt sichtbar in der Luft; Dialog-Prompts verwenden.

## Vergleichstest Hailuo AI (MiniMax H3, „Omni Reference", 27.10., vom Co-CEO ins Spiel gebracht)
Neuer Dienst (MiniMax, CN): nur Test mit eigenen Serienbildern; vor Veröffentlichung Nutzungsbedingungen (kommerziell, Wasserzeichen, Gratis-Credits) prüfen.
Omni Reference: bis 12 Referenzen (Bild/Video/Audio), im Prompt per @Image1… → Image1 = `P3_start.jpg`, Image2 = `look/refs/nox.png`, Image3 = `look/refs/pip.png`.
Prompt = P3 mit Dialog „Hat sie mir je geschrieben?" (siehe Chat 27.10.). Ziel: Figurentreue/Bewegung/Lippen vs. Gemini-Clip A.
Idee falls gut: Audio-Referenz mit unserer Cast-Stimme (`voices/casting/nox_b.wav`) testen → konsistente Stimme ohne Nachvertonung.

