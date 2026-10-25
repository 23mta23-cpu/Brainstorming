# Kosten

## Ist (2026-10-25)
| Posten | Kosten | Kommentar |
|---|---|---|
| Externe Dienste / APIs | **0 €** | keine bezahlten Provider genutzt |
| Software | 0 € | Open Source; Remotion bewusst vermieden (Company License) |
| Assets (Bild, Ton, Fonts, Stimmen) | 0 € | v3: lokal generiert (FLUX.2-klein Apache-2.0, Stimmen Qwen3-TTS Apache-2.0 — entworfen, keine echte Person), Fonts OFL |
| Rechenzeit E01 v3 (lokal, CPU) | 0 € | ~3 h Bildgenerierung (inkl. Neuversuche), ~30 min Stimmen, 3 min Render |
| Rechenzeit je 32-s-Folge | ~2 min auf 4 vCPU | in der Claude-Code-Cloud-Umgebung enthalten |
| Fehlgeschlagene Generierungen | 2 | MLS-Stimmen verworfen (Artefakte), 1 Lautheits-Iteration |
| Claude-Nutzungskontingent | nicht exakt messbar | größter realer Kostenfaktor; Folgefolgen deutlich günstiger als dieser Aufbau |
| Speicher | ~25 MB je finaler Folge in Git | bei > 30 Folgen Git LFS oder Drive erwägen |

Kosten je weiterer Folge (Schätzung, ANNAHME): 0 € Cash; Hauptaufwand = Story + Szenen-Code (1 Sitzung) + 15 min menschliche Prüfung.

## Optionen mit Kosten — jeweils Freigabe nötig (Preise vor Entscheidung aktuell prüfen; hier bewusst keine Zahlen erfunden)
| Option | Nutzen | Kostenart | Priorität |
|---|---|---|---|
| Professionelle TTS (z. B. ElevenLabs) oder menschliche Sprecher | größter Qualitätshebel | Abo / pro Zeichen bzw. Honorar | **1** |
| Remotion Company License | nur falls wir Remotion statt eigenem Renderer wollen | Abo | niedrig |
| Generatives Video (Kling, Veo, Runway …) über OpenMontage | echte Animation einzelner Shots | pro Sekunde Video | 2 (nach Datentest) |
| GPU-Maschine (lokale Modelle, VoiceStudio) | Unabhängigkeit von APIs | Hardware/Cloud-GPU | 3 |
| SkillSpector-LLM-Modus | tiefere Skill-Analyse | pro Token beim Provider | niedrig |

Lizenzhinweise: OpenMontage/VoiceStudio AGPL-3.0 (nur unverändert als separates Werkzeug), Piper GPL-3.0 (Werkzeug), Ausgaben (Videos/Audio)
sind nach unserem Verständnis nicht lizenzgebunden — keine abschließende Rechtsauskunft.
