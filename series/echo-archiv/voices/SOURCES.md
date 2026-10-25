# Herkunft der Stimmen (Stand 2026-10-25, Besetzung v3)

**Aktiv:** Qwen3-TTS (Alibaba Qwen, **Apache-2.0**, lokal, 0 €). Alle vier Stimmen sind per Textbeschreibung **entworfen**
(`pipeline/voice_design.py`, Modell Qwen3-TTS-12Hz-1.7B-VoiceDesign) — keine echte Person, keine fremde Aufnahme geklont.
Gesprochen wird jede Zeile vom Klonmodell Qwen3-TTS-12Hz-1.7B-Base mit dem gewählten Casting-Clip als Vorlage
(`pipeline/tts_qwen.py`, je Zeile 4 Takes, Whisper wählt den verständlichsten: `pipeline/tts2.py pick`).

Besetzung (Entscheidung Co-CEO 2026-10-25, aus `Casting_Stimmen.mp4`; Beschreibungen + Seeds in `casting.json`):

| Figur | Clip | Beschreibung (Kurz) | Grundton |
|---|---|---|---|
| Nox (17) | `casting/nox_b.wav` | heller junger Tenor, ernst, leicht atemlos, verletzlich aber mutig | ~188 Hz |
| Mira (18) | `casting/mira_c.wav` | warm, tief, leicht rauchig, gefasst und still traurig | ~231 Hz |
| Lina (Kind, ~10–11, in Visionen) | `casting/lina_a.wav` | klare, sanfte Kinderstimme, hoffnungsvoll, nicht cartoonhaft | ~358 Hz |
| Erzähler | `casting/erz_c.wav` | älterer Mann ~65, leicht heiser, leise, weise („alter Archivar“) | ~97 Hz |

Hinweise: Lina ist heute ~16 — tritt sie später in der Gegenwart auf, braucht sie eine neu entworfene Stimme
(VoiceDesign-Modell neu laden, ~4,3 GB). Nox' Flüsterzeile (E01 S14) nutzt dieselbe Nox-Stimme (das Klonmodell kennt keinen Flüsterstil).
KI-Kennzeichnung bleibt Pflicht (TikTok-Schalter „KI-generiert“).

**Archiviert (v1/v2, nicht mehr genutzt):** `erzaehler_ref.wav`, `nox_ref.wav`, `mira_ref.wav`, `lina_ref.wav` — Piper-TTS-Vorlagen
aus CC0-Datensätzen (Thorsten-Voice, Kerstin) für Chatterbox, erzeugt mit `pipeline/voice_refs.py`.
