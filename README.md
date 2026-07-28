# Islamic Learning App (Arbeitstitel)

## Produktvision

Eine alters- und lernstandsadaptive islamische Lernplattform, die Elifba, Qur'anlesen (inkl. Aussprache und Tajwid) und altersgerechtes islamisches Wissen vermittelt – mit Fokus auf echten Lernfortschritt statt Bildschirmzeit.

## Zielgruppen

- Kinder
- Jugendliche
- Erwachsene
- Konvertiten
- Menschen, die den Islam seriös kennenlernen möchten
- Eltern und Familien

## Hauptbereiche

1. Elifba und arabische Buchstaben
2. Qur'anlesen, Aussprache, Tajwid und Verständnis
3. Altersgerechtes islamisches Wissen
4. (später) „Islam kennenlernen"

Startsprachen: Deutsch, Türkisch, arabische Originaltexte und Aussprache.

## Projektstatus

**Discovery.** Es wurde noch keine Technologieentscheidung getroffen.

**Status: interaktiver Prototyp (v2).** Zusätzlich zur Discovery existiert ein klickbarer mobiler Web-Prototyp (HTML/CSS/Vanilla JS, kein Backend, keine Nutzerkonten, keine Datenbank). Startdatei: [`index.html`](./index.html). Der Prototyp ist über GitHub Pages aufrufbar, sobald Pages für dieses Repository aktiviert ist. Er ist noch **kein produktiver MVP**, sondern dient ausschließlich der visuellen und interaktiven Veranschaulichung von Navigation und Lernablauf.

Version 2 ergänzt eine „Entdecken“-Ansicht mit kurzen, unterschiedlichen Lernmedien (vertikales Scroll-Snap-Feed) sowie zwei weitere simulierte Lektionsformate. Da in der Entwicklungsumgebung kein `ffmpeg` verfügbar war, wurden die medienartigen Momente bewusst **nicht** als MP4-Videos, sondern als selbst erstellte, lautlose CSS-/SVG-Animationen umgesetzt (kein Video-Element, keine externen Medien).

## Weiterführende Dokumente

- [CLAUDE.md](./CLAUDE.md) – dauerhafte Arbeitsregeln
- [docs/product-foundation.md](./docs/product-foundation.md) – Produktfundament
- [docs/decision-log.md](./docs/decision-log.md) – Entscheidungsprotokoll
- [docs/01-audience-and-problem-discovery.md](./docs/01-audience-and-problem-discovery.md) – Zielgruppen-, Problem- und Interview-Discovery
