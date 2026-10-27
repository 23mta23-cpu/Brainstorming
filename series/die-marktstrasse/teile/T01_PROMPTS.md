# Teil 1 — Prompt-Paket für Gemini „Videos" / Google Flow

Status: ENTWURF — erst generieren, wenn Story-Review v2 PASS ist und der Co-CEO die Figuren freigegeben hat.
Kosten: 9 Clips mit Veo 3.1 Fast ≈ 180 Credits (Annahme: 20 pro Clip) — im AI-Pro-Abo enthalten. Startbilder: `T01_keyframes/K1–K9.png` (lokal, 0 €).

## So geht's (pro Clip, ca. 2 Minuten)
1. **Gemini-App** → Chip **„Videos"** (nicht normaler Chat) → Bild-Symbol → Startbild `K1.png` … `K9.png` hochladen.
   (Alternative **Flow**: Projekt → „Frames to Video" → Veo 3.1 Fast → Format **9:16** → Anzahl 1.)
2. Format **Hochformat 9:16** prüfen.
3. Den passenden Prompt unten **komplett** kopieren und einfügen → senden.
4. Clip ansehen: Gesichter gleich? Fruchtköpfe bleiben Fruchtköpfe? Mund passt? Wenn nein: **einmal** neu generieren.
5. Herunterladen, umbenennen in `T01_C1.mp4` … `T01_C9.mp4`, hier im Chat hochladen.
6. Ich schneide: Bildtexte, Visitenkarte, Foto (Inserts), Ton-Mischung, Endkarte, Länge 72 s.

**Stimmen:** Veo spricht den Dialog (für die Mundbewegung). Weil Veo in jedem Clip eine andere Stimme erfinden kann, teste ich im Schnitt
zwei Wege: (a) Veo-Stimme behalten, (b) unsere festen Cast-Stimmen darüberlegen. Entscheidung nach dem ersten Testschnitt.
**Bildtexte nie in den Prompt** — Video-KI schreibt Buchstaben falsch. Alle Texte kommen im Schnitt dazu.

## Look A (Co-CEO-Entscheidung 27.10.): stilisierter 3D-Animationsfilm, Frucht-Menschen, keine menschliche Haut

## Figuren-Kurzbeschreibungen (in jedem Prompt identisch)
- OPA = an old baker whose whole head is a big wrinkled glossy dark-brown date fruit with big gentle cartoon eyes, bushy white eyebrows and a short white beard, date-skin hands, white baker's cap, flour-dusted cream apron over a brown knitted cardigan
- KONRAD = a rich businessman whose whole head is a round hairy brown coconut with narrow smug cartoon eyes, coconut-shell hands, charcoal three-piece suit, white shirt, no tie
- KAI = a nervous young assistant whose head is a fuzzy brown kiwi fruit with worried cartoon eyes and round glasses, kiwi-skin hands, light grey suit, holding a tablet
- LILLI = a 17-year-old girl whose head is an oval glossy green lime with lively cartoon eyes, lime-peel hands, dark green hoodie and dark apron

---

### C1 (Startbild K1)
```
Vertical 9:16, stylized 3D animated feature film look, glossy saturated colors, warm cinematic lighting. All characters are fruit-people: human bodies in clothes, entire heads are fruits with big expressive cartoon eyes and mouths, hands with the same fruit skin, no human skin. Inside a small cosy old German bakery with wooden shelves of bread and an old stone oven. A rich businessman whose whole head is a round hairy brown coconut with a cold proud face, charcoal three-piece suit, white shirt, no tie, stands at the wooden counter, laughs and slaps a thick bundle of banknotes onto a lump of dough. Behind the counter an old baker whose whole head is a large wrinkled dark-brown date fruit with a kind face, bushy white eyebrows and a short white beard, white baker's cap, flour-dusted cream apron, keeps kneading calmly around the money without looking up. A nervous assistant with a fuzzy brown kiwi head and round glasses stands behind with a tablet. The businessman says in German with a mocking laugh: "Fünfzigtausend. Bar. Für diese Bruchbude." The baker answers calmly in German: "Nicht verkäuflich." Camera: slow push-in at eye level. Audio: the dull slap of the money on dough, short laugh, dough on wood, quiet street ambience. No music. Keep all fruit heads and faces exactly as in the image. No subtitles, no captions, no text, no watermark.
```

### C2 (Startbild K2)
```
Vertical 9:16, stylized 3D animated feature film look, glossy saturated colors, warm cinematic lighting. All characters are fruit-people: human bodies in clothes, entire heads are fruits with big expressive cartoon eyes and mouths, hands with the same fruit skin, no human skin. Inside the small old bakery. The coconut-headed businessman in the charcoal suit half turns to the kiwi-headed assistant with round glasses and gestures mockingly around the shop, then rests his left hand on the wooden counter close to the camera; a small pale old burn scar on the back of his left hand is in sharp focus in the foreground for a moment, while behind the counter the date-headed old baker in the white baker's cap looks at the hand. The businessman says in German: "Das ist kein Laden, Kai. Das ist ein Museum." The assistant says nervously in German: "Chef … das Frühstück um acht." The businessman, dismissive: "Erst das hier." Audio: ticking clock, tapping on a tablet, quiet room tone. No music. Keep all fruit heads and faces exactly as in the image. No subtitles, no text, no watermark.
```

### C3 (Startbild K3)
```
Vertical 9:16, stylized 3D animated feature film look, glossy saturated colors, warm cinematic lighting. All characters are fruit-people: human bodies in clothes, entire heads are fruits with big expressive cartoon eyes and mouths, hands with the same fruit skin, no human skin. Close medium shot across a flour-dusted wooden bakery counter. The coconut-headed businessman in the charcoal suit takes the money back and slides a plain black business card across the counter with one finger. The date-headed old baker looks up at him for the first time, calm, with a faint warm smile. The businessman says coldly in German: "Alles hat einen Preis. Und Sie sind der Letzte in der Straße." The baker replies dryly in German: "Dann bin ich ja was Besonderes." The businessman turns and leaves; a small door bell rings. Audio: card tapping on wood, door bell. No music. Keep all faces exactly as in the image. No subtitles, no text, no watermark.
```

### C4 (Startbild K4)
```
Vertical 9:16, stylized 3D animated feature film look, glossy saturated colors, warm cinematic lighting. All characters are fruit-people: human bodies in clothes, entire heads are fruits with big expressive cartoon eyes and mouths, hands with the same fruit skin, no human skin. Early morning on a cobblestone old-town street with old German facades, right in front of the open door of a small bakery. The kiwi-headed assistant with round glasses stares at his tablet and goes pale. The coconut-headed businessman stops abruptly. Through the open door, the date-headed old baker behind the counter quietly listens. The assistant says in German, panicking: "Chef … das Catering hat abgesagt. Keiner hat bestätigt." The businessman snaps in German: "Die kommen in fünfzehn Minuten!" Camera: handheld, slight push-in on the businessman. Audio: footsteps stopping, wind, a distant tram bell. No music. Keep faces exactly as in the image. No subtitles, no text, no watermark.
```

### C5 (Startbild K5)
```
Vertical 9:16, stylized 3D animated feature film look, glossy saturated colors, warm cinematic lighting. All characters are fruit-people: human bodies in clothes, entire heads are fruits with big expressive cartoon eyes and mouths, hands with the same fruit skin, no human skin. Wide shot of an empty cobblestone old-town street at dawn: every shop has its metal roller shutter down, dark empty windows. Only one small window glows warm and golden: the bakery. The coconut-headed businessman in the charcoal suit slowly turns around on the spot, realising. The kiwi-headed assistant says quietly in German: "Chef … hier hat nur noch einer offen." The businessman closes his eyes. Camera: slowly rises and pulls back. Audio: silence, wind, a pigeon flutters up. No music. Keep faces exactly as in the image. No subtitles, no text, no watermark.
```

### C6 (Startbild K6)
```
Vertical 9:16, stylized 3D animated feature film look, glossy saturated colors, warm cinematic lighting. All characters are fruit-people: human bodies in clothes, entire heads are fruits with big expressive cartoon eyes and mouths, hands with the same fruit skin, no human skin. Inside the small old bakery. The coconut-headed businessman stands at the counter again, quieter, avoiding eye contact. The date-headed old baker in the white baker's cap already holds out two full paper bags of warm bread. The businessman asks reluctantly in German: "Was kostet … alles?" The baker: "Für Sie? Nichts." The businessman, proud: "Ich nehme nichts geschenkt." The baker, gently, handing him the bags: "Dann nehmen Sie's mit Respekt. Respekt reicht." Audio: crackling paper bags, the oven crackles. No music. Keep faces exactly as in the image. No subtitles, no text, no watermark.
```

### C7 (Startbild K7)
```
Vertical 9:16, stylized 3D animated feature film look, glossy saturated colors, warm cinematic lighting. All characters are fruit-people: human bodies in clothes, entire heads are fruits with big expressive cartoon eyes and mouths, hands with the same fruit skin, no human skin. A modern glass office overlooking an old-town street. On the glass table only a bread basket, a teapot and coffee cups. Three modestly and elegantly dressed investors with exotic fruit heads; an elegant woman whose head is a pink dragon fruit, in a high-necked dark dress, bites into a crusty roll and her eyes go wide. She says delighted in German: "Herr Kokosnuss! Wo haben Sie das her?" The coconut-headed businessman smiles forcedly: "… Aus der Gegend." Behind him the kiwi-headed assistant whispers in German: "Aus der Bruchbude." Audio: crust crackling, cups clinking, the whisper. No music. No wine, no champagne, no alcohol, no meat or sausage on the table. Keep faces exactly as in the image. No subtitles, no text, no watermark.
```

### C8 (Startbild K8)
```
Vertical 9:16, stylized 3D animated feature film look, glossy saturated colors, warm cinematic lighting. All characters are fruit-people: human bodies in clothes, entire heads are fruits with big expressive cartoon eyes and mouths, hands with the same fruit skin, no human skin. The small old bakery in the evening, dim warm light, chairs on the tables. A 17-year-old girl whose head is an oval green lime with a lively face, in a dark green hoodie and dark apron, sweeps the floor in the foreground. Behind the counter the date-headed old baker stands at the open cash drawer looking at an old small photograph; when he notices her, he lays it face down next to a black business card on the counter and walks to the oven. She picks it up and turns it over, puzzled, and murmurs in German: "Konni … neunzehnhundertsechsundneunzig?" Audio: broom on tiles, a ticking clock, paper. No music. Keep her face exactly as in the image. No subtitles, no text, no writing visible, no watermark.
```

### C9 (Startbild K9)
```
Vertical 9:16, stylized 3D animated feature film look, glossy saturated colors, warm cinematic lighting. All characters are fruit-people: human bodies in clothes, entire heads are fruits with big expressive cartoon eyes and mouths, hands with the same fruit skin, no human skin. The small old bakery in the evening, dim warm light. In the foreground the lime-headed teenage girl holds the old photograph next to the black card and looks worried toward the old date-headed baker, who stands with his back to her closing the iron door of the stone oven. He pauses and briefly presses one hand to his chest; she does not notice. She asks softly in German: "Opa … woher kennst du ihn?" Without turning around, after a pause, he says quietly in German: "Mach das Licht aus, Lilli." Audio: the oven door creaks, then silence. No music. Keep faces exactly as in the image. No subtitles, no text, no watermark.
```

---
Prüfliste nach dem Generieren: Fruchtköpfe stabil · keine Schrift/Logos im Bild · kein Alkohol/Fleisch (C7) · Mund passt grob zum Text ·
9:16 · Narbe in C2 sichtbar (sonst Insert-Standbild im Schnitt).

---
## Vergleichstest Hailuo (MiniMax H3, „Omni Reference") — Clip 1
Refs in dieser Reihenfolge hochladen: @Image1 = `T01_keyframes/K1.png` · @Image2 = `look/refs/konrad_kokosnuss.png` ·
@Image3 = `look/refs/opa_dattel.png` · @Image4 = `look/refs/kai_kiwi.png` · Einstellungen: 9:16 · 768p · 8 s.
Nur Gratis-Credits, nichts kaufen. Vor Veröffentlichung: Nutzungsbedingungen (kommerziell) und Wasserzeichen prüfen.
```
@Image1 is the first frame and the scene: a small cosy old German bakery. The coconut-headed businessman from @Image2 stands at the wooden counter, laughs and slaps a thick bundle of banknotes onto a lump of dough. Behind the counter the old date-headed baker from @Image3 keeps kneading calmly around the money without looking up. The kiwi-headed assistant with glasses from @Image4 stands behind the businessman holding a tablet. The businessman says in German with a mocking laugh: "Fünfzigtausend. Bar. Für diese Bruchbude." The baker answers calmly in German: "Nicht verkäuflich." Stylized 3D animated feature film look, glossy saturated colors, warm cinematic light, fruit heads and fruit-skin hands exactly as in the references. Camera: slow push-in at eye level. Sound: money slapping on dough, a short laugh, quiet street ambience. No music, no subtitles, no text, no watermark.
```
