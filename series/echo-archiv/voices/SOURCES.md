# Herkunft der Stimm-Referenzen (Chatterbox-Klon-Vorlagen)

Alle Referenzen sind synthetisch mit Piper TTS aus Stimmmodellen mit **CC0-Datensätzen** erzeugt (Model Cards unter
`/home/user/tools/piper-voices/*.card.md`, Kopien der Lizenzangaben in `docs/SECURITY_AUDIT.md`):

| Datei | Piper-Modell | Datensatz-Lizenz | Bearbeitung |
|---|---|---|---|
| erzaehler_ref.wav | de_DE-thorsten_emotional-medium (Stil „neutral", Sprecher 4) | CC0 (Thorsten-Voice) | Tonhöhe × 0,92, Tempo kompensiert |
| nox_ref.wav | de_DE-thorsten-high | CC0 (Thorsten-Voice) | keine |
| mira_ref.wav | de_DE-kerstin-low | CC0 (dataset-voice-kerstin) | Tempo 1,15 (ruhiger) |
| lina_ref.wav | de_DE-kerstin-low | CC0 (dataset-voice-kerstin) | Tempo 1,3 (langsamer), Tonhöhe × 1,26 (Kinderstimme), Tempo kompensiert |

Erzeugung: `pipeline/voice_refs.py <name>` (Chatterbox übernimmt das Sprechtempo der Referenz). Text: „Im Archiv bewahren wir jede Entscheidung auf, die ein Leben verändert hat. Manche Echos sind harmlos. Andere können eine
Entscheidung noch einmal geschehen lassen." Keine echten Personen geklont. Bessere Option ohne Kosten: eigene Aufnahmen des Teams
(Einwilligung schriftlich festhalten) — ersetzen diese Dateien 1:1.
