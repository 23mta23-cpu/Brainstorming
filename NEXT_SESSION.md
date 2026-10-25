# NEXT_SESSION

## Aktuelle Phase
Phase 8/9 abgeschlossen bis zur menschlichen Freigabe: Fundament, Security, Pipeline und Pilot E001 stehen. Nächstes Ziel: **E02 + E03 produzieren**, dann Launch.

## Abgeschlossen (2026-10-25)
- Discovery: Umgebung (4 vCPU, 15 GiB, keine GPU), GitHub (nur `23mta23-cpu/brainstorming`), Google Drive (Lesen/Schreiben ok; Ordner „MiracTT" existiert), Deep-Research-PDF vollständig ausgewertet (`docs/RESEARCH_FINDINGS.md`).
- 17 Repos inventarisiert + SkillSpector-gescannt + Status (`docs/REPOSITORY_MATRIX.md`, `docs/SECURITY_AUDIT.md`).
- Capability-Matrix + Entscheidungen (`docs/TECHNOLOGY_DECISIONS.md`).
- Market Intelligence Erstanalyse + Tracker (`docs/MARKET_INTELLIGENCE.md`, `docs/COMPETITOR_TRACKER.md`).
- Strategie, TikTok-Strategie, Policy, Agentenorganisation, Qualitätsschleusen, Kosten.
- Story: 3 Konzepte bewertet, Echo-Archiv gewählt, Staffel 1 + Serienende geplant (`docs/STORY_BIBLE.md`, `docs/STORY_TRACKER.md`).
- Pipeline TESTED; Pilot E001 gerendert, QC 14/14 PASS, Launch-Entwurf (`series/echo-archiv/episodes/E001/LAUNCH.md`).

## Installiert & getestet (flüchtig! nach Neustart: `scripts/setup_tools.sh`)
SkillSpector 2.12.0 · Piper 1.8.0 + 3 CC0-Stimmen · RTK (Binary, nicht gehookt, `--rtk`) · OpenMontage-Deps (Tests 1328 grün; nicht im Setup-Skript, da nicht Teil der Pipeline).

## Offene Tests
- Kopf-an-Kopf-Vergleich Engineering-Methodik (Bordmittel+Ponytail vs. Superpowers) an einer echten Aufgabe — nur falls Engineering wächst.
- `trend-scout` erster Lauf (täglicher Screen).
- Vollscan ECC/OpenMontage (nur falls Nutzung geplant).

## Blocker
- Keine Hörprüfung durch mich möglich → Stimmen-Freigabe durch Menschen.
- Kein generatives Video/keine Profi-Stimmen ohne Budgetfreigabe.

## Erforderliche Freigaben / Rückfragen an den Co-CEO
1. **E001 ansehen/anhören** und freigeben oder Korrekturen nennen.
2. **Musik-Policy**: nur Sounddesign / Vokal-Percussion / lizenzierte Instrumentalmusik? (`docs/CONTENT_POLICY.md`)
3. Hausregel Körperkontakt/Romantik bestätigen.
4. TikTok-Account: neuer Serien-Account oder bestehender (MiracTT?).
5. Budget für Stimmen (Priorität 1) — ja/nein, Obergrenze.
6. Rollen der vier Teammitglieder (`docs/COMPANY_STRATEGY.md`).
7. Optional: nicht benötigte account-synchronisierte Plugins deaktivieren (Token-/Hook-Overhead).

## Genaue nächste Aktion
1. `scripts/setup_tools.sh` ausführen (falls Container neu).
2. Feedback zu E001 einarbeiten (falls vorhanden).
3. Skill `produce-episode` für **E02 „Der Brief"** (Lost Letter; Micro: fremder Brief wird zugestellt; Macro: Linas Brief an Nox erwähnt den Bahnhof; löst Q3 „Veyr").
4. Danach E03 „Miras Lüge"; Launch, wenn E01–E03 freigegeben.

## Relevante Pfade & Befehle
```bash
PY=/home/user/tools/piper-venv/bin/python
$PY pipeline/build.py series/echo-archiv/episodes/E001            # komplett
$PY pipeline/build.py series/echo-archiv/episodes/E001 --reuse-video  # nur Ton neu
python3 pipeline/qc.py <final.mp4> <build/timeline.json>
python3 pipeline/shotlist.py series/echo-archiv/episodes/E001
scripts/sandbox-run.sh [--net] <cmd>                              # Fremdcode ohne Tokens
/home/user/tools/skillspector-venv/bin/skillspector scan <dir> --no-llm --recursive --format json --output x.json
```
Branch: `claude/ai-studio-foundation` (kein PR erstellt).

## Learnings (statt task-observer)
- MLS-Mehrsprecher-Piper-Modell ist für kurze Sätze unzuverlässig (Pausen/Artefakte) → nur Einzelsprecher-Modelle.
- AAC erzeugt ~0,6 dB True-Peak-Overshoot → Master auf −2 dBTP.
- Vorschau-Kontaktbogen vor dem Vollrender spart Iterationen (fand Tür-Rotationsbug, Blitzposition, Haar-Clipping, Untertitel über Mund).
- Fremdcode nie mit voller Umgebung starten (Tokens!) → `sandbox-run.sh`; `env -i` entfernt auch `VIRTUAL_ENV` → `uv pip --python` nutzen.
