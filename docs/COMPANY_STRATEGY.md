# Unternehmensstrategie (Phase 1, Stand 2026-10-25)

## Mission
Eine eigenständige Entertainment-Marke für originelle, KI-produzierte Serien — DACH zuerst, dann international. Phase 1: nur TikTok.
Grundsatz: *Andere produzieren KI-Clips, die Geschichten enthalten. Wir bauen Geschichten, deren Produktionssystem KI nutzt.*

## Ausgangslage — die ungemütliche Wahrheit
1. **KI ist kein Differenzierer mehr** (~⅔ der Microdrama-Releases außerhalb Chinas sind KI-generiert, Q3 2026). Unser Burggraben kann nur IP, Story-Qualität und Konsistenz sein.
2. **Unsere Produktionsqualität ist heute nicht wettbewerbsfähig mit generativem Video.** Code-Animation + lokale TTS = sauberer, konsistenter Produktionsnachweis, aber hölzernes Schauspiel und synthetische Stimmen. Die Stimme ist der größte einzelne Qualitätshebel.
3. **DACH ist klein, deutsche Microdramen kämpfen um organische Reichweite** (OMR). Wer nur Deutsch denkt, deckelt das Potenzial.
4. **TikTok-Monetarisierung allein trägt kein Unternehmen**: Creator Rewards erst ab 10 k Followern, 100 k Views/30 Tage und Videos > 1 min; Auszahlungen gering und schwankend.
5. **Plattformrisiko** (verifiziert, TikTok Newsroom 10.07.2026): Der verschärfte Anti-Spam-Test zielt auf KI-Spam-Accounts zu Politik/Aktuellem, Finanzen und Medizin; KI-Storytelling wird ausdrücklich begrüßt. Restrisiken: fehlende Kennzeichnung, Massenposting, Nähe zu fremder IP (Fruit Love Island) und die Nutzer-Option „Manage Topics", mit der Zuschauer weniger KI-Inhalte sehen (Reichweiteneffekt unbekannt).

## Strategie in drei Phasen
| Phase | Zeitraum (Plan) | Ziel | Kriterium für Übergang |
|---|---|---|---|
| 1 Validierung | 0–8 Wochen | Beweisen, dass Zuschauer Folge N+1 sehen wollen | ≥ 10 Folgen live; Serienkonversion (Views E(n+1) / Views E(n)) und Follows/1.000 Views über eigenem Median steigend |
| 2 Qualität & Format | 2–4 Monate | Premium-Folgen 60–90 s, bessere Stimmen, ggf. generative Shots | Budgetfreigabe; Creator-Rewards-Kriterien erreichbar |
| 3 Skalierung & Erlöse | ab Monat 4 | EN-Version, Markendeals, IP-Lizenz, Plattform-Serien (z. B. PineDrama-ähnliche Deals) | stabile Fanbasis |

## Erlösoptionen (bewertet)
| Option | Potenzial | Aufwand | Zeitpunkt | Kommentar |
|---|---|---|---|---|
| TikTok Creator Rewards | niedrig | niedrig | ab ~10 k Follower | erfordert > 1-min-Folgen |
| Branded Entertainment (Marken-Microdramen) | mittel–hoch | mittel | ab nachweisbarer Reichweite | OMR sieht hier den DACH-Hebel; Halal-Policy schließt Alkohol-/Glücksspielmarken aus |
| IP-Lizenz / Plattform-Deals | hoch, unsicher | hoch | Phase 3 | setzt eigene, saubere IP voraus — darum keine fremde IP |
| B2B-Produktion für Marken mit unserer Pipeline | mittel | mittel | jederzeit | **Opportunitätskosten**: lenkt vom Aufbau der eigenen Marke ab; nur gezielt |
| Merchandise | niedrig–mittel | mittel | spät | erst bei Fan-Basis |

## Wirtschaftlichkeit heute (FAKT, gemessen)
- Cash-Kosten Pilot: **0 €** (alle Tools lokal/Open Source, eigene Assets).
- Maschinenzeit je 32-s-Folge: ~2 min Build (TTS 7 s, Render ~95 s auf 4 vCPU).
- Engpass: kreative Entwicklungszeit + Claude-Nutzungskontingent + menschliche Freigabe. Details: `docs/COSTS.md`.

## Top-Risiken & Gegenmaßnahmen
| Risiko | Wahrscheinlichkeit | Wirkung | Gegenmaßnahme |
|---|---|---|---|
| Qualität (Stimme/Animation) zu schwach → schlechte Retention | hoch | hoch | Hook/Story maximieren; Stimmen-Budget nach erstem Datentest |
| Keine Nachfrage für animiertes deutsches Mystery | mittel | hoch | Schnell testen (E01–E03), EN-Variante parallel prüfen |
| Plattform-Sanktionen (AI-Spam, fehlendes Label) | niedrig (bei unserer Policy) | hoch | AIGC-Label, geringe Kadenz, Originalität |
| Abhängigkeit von TikTok | hoch | mittel | IP und Assets gehören uns; später Multi-Plattform |
| Serie bleibt unvollendet | mittel | mittel (Vertrauen) | Ende geplant; Puffer von 3 Folgen vor Launch |

## Organisation (4 Menschen + AI)
Vorschlag zur Klärung: 1 Co-CEO (Freigaben, Strategie), 1 Creative Lead (Story-Abnahme, Stimmen-Casting), 1 Growth/Community (Posting, Kommentare, In-App-Analytics), 1 Produktion/Technik (Pipeline lokal betreiben). AI: Entwicklung, Produktion, Analyse. → **Rückfrage: Wer übernimmt welche Rolle?**
