# KI-Unternehmensorganisation

Prinzip: Rollen sind zunächst **Funktionen**, keine Agenten. Ein Subagent lohnt nur, wenn ein frischer Kontext, ein günstigeres Modell
oder Parallelität echten Nutzen bringt. Die Hauptsitzung (AI Co-CEO) bleibt für Ergebnisqualität verantwortlich.

| Funktion (Auftrag) | Umsetzung | Warum so |
|---|---|---|
| Executive (Strategie, Finanzen, Ops) | Hauptsitzung + `COMPANY_STRATEGY.md`, `COSTS.md` | braucht Gesamtkontext |
| Market Intelligence | **Agent `trend-scout`** (Sonnet, Web-Tools) | günstigeres Modell, isolierter Recherche-Kontext, klarer Output |
| Marketing & Growth | Hauptsitzung + `TIKTOK_STRATEGY.md`; Community = Mensch | Posting/Kommentare sind menschliche Aufgaben (keine Auto-Veröffentlichung) |
| Creative Studio (Showrunner, Writer, Character Design) | Hauptsitzung + `STORY_BIBLE.md` + Character Lock (`characters.js`) | Schreiben und Inszenieren hängen eng zusammen |
| Continuity Editor / Lore Keeper | `STORY_TRACKER.md` + Kanonregeln, geprüft durch `story-reviewer` | Register statt Agent: billig und dauerhaft |
| Story-Review, Content Policy, IP | **Agent `story-reviewer`** (read-only) | adversarialer Blick in frischem Kontext; kann nichts verändern |
| Video Production (Regie, Animation, Voice, Schnitt) | Skill `produce-episode` + `pipeline/` | deterministische Skripte statt Agentenketten |
| Quality (technisch) | `pipeline/qc.py` | objektiv, reproduzierbar, kostet keine Tokens |
| Quality (kreativ) | Kontaktbogen via Claude Vision + menschliche Freigabe | subjektiv → Mensch entscheidet |
| Technology (CTO, Security) | Hauptsitzung + SkillSpector + `sandbox-run.sh` | |
| Performance Analyst | PLANNED — erst wenn ≥ 20 Videos Daten liefern | YAGNI |

Bewusst **nicht** gebaut: die sieben Agenten aus dem Research (Visual Director, Dialogue Director, Lore Keeper … als eigene Agenten) —
sie würden denselben Kontext mehrfach laden und Übergaben erzeugen, ohne bessere Ergebnisse zu liefern.

## Funktionsnachweise
- `story-reviewer`: auf E001 ausgeführt (Ergebnis in `STORY_TRACKER.md` → „Review-Lauf 1"). Hinweis: Agenten-Dateien werden beim Sitzungsstart geladen;
  der erste Lauf erfolgte deshalb als General-Purpose-Agent mit exakt dieser Rollendatei.
- `trend-scout`: definiert, noch nicht ausgeführt (nächste Sitzung: täglicher Screen).
- SkillSpector-Scan des eigenen Skills `produce-episode`: Score 0, keine Funde.

## Modellnutzung
Hauptsitzung: konfiguriertes Modell. `trend-scout`: Sonnet (Recherche-Routine). `story-reviewer`: erbt Hauptmodell (Qualität vor Kosten).
