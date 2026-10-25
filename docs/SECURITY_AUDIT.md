# Security Audit (2026-10-25)

## Verfahren
1. **Statisches Inventar** aller 17 Repos ohne Codeausführung: `scripts/inventory.py` (Lizenz, Manifeste, Hooks, MCP, Installskripte,
   Risikomuster `curl|sh`, `wget|sh`, `npx -y`, `postinstall`, `eval(`, `sudo`, `rm -rf ~|/`) → `docs/inventory.json`.
2. **SkillSpector selbst geprüft, bevor installiert** (Quellcode: 113 Py-Dateien, 82 k LOC): `subprocess` nur in LLM-CLI-Providern;
   Netz im `--no-llm`-Modus nur OSV.dev + Paketregistries (Paketnamen, keine Inhalte); LangSmith-Tracing nur bei gesetzten Keys.
   → isoliert installiert (`/home/user/tools/skillspector-venv`, vom auditierten Commit d7338f5).
3. **SkillSpector-Scans** (`--no-llm --recursive`) aller Skill-Sammlungen → `security/skillspector/*.json.gz`,
   Zusammenfassung: `python3 -I scripts/scan_summary.py security/skillspector/*.json.gz`.
4. **Manuelle Triage aller CRITICAL-Funde** (unten).
5. **Ausführung von Fremdcode nur in Credential-freier Umgebung**: `scripts/sandbox-run.sh` (`env -i`, nur PATH/LANG/temp-HOME;
   mit `--net` zusätzlich Proxy + CA-Bundle, nie Tokens).

## Wichtigster Befund: Credentials in der Umgebung
FAKT: Die Cloud-Umgebung enthält u. a. `GH_TOKEN`, `GITHUB_TOKEN`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `CLOUDSDK_AUTH_ACCESS_TOKEN`.
Jedes Fremdskript könnte sie lesen. Gegenmaßnahme: Regel 2 in `CLAUDE.md` + `sandbox-run.sh`. Restrisiko: SkillSpector-Scans und
Piper liefen in dieser Sitzung mit voller Umgebung (beide vorab geprüft bzw. PyPI-Standardpaket); künftig ebenfalls über Sandbox.
Grenze: `sandbox-run.sh` filtert nur Umgebungsvariablen — kein Dateisystem-/Netz-Sandboxing. Für unbekannte Repos Docker verwenden.

## Scan-Ergebnisse (statisch)

| Sammlung | gescannt | max. Risiko | Empfehlung Scanner | Top-Regeln | Triage |
|---|---|---|---|---|---|
| ponytail/skills | 6/6 | 0 LOW | CAUTION | – | sauber |
| youtube-agent-skill/skills | 11/11 | 0 LOW | CAUTION | – | sauber |
| one-skill-to-rule-them-all | 1/1 | – | – | – | sauber (Abdeckung 86,7 %) |
| VoiceStudio/skills | 2/2 | 6 LOW | CAUTION | E1 | unkritisch |
| superpowers/skills | 15/15 | 100 CRITICAL | DO_NOT_INSTALL | RA1, RA2, EA2, AS1, TM1 | Aggregat aus HIGH-Mustern (z. B. `rm -f` im eigenen State-Dir); kein CRITICAL-Einzelfund, keine Exfiltration |
| rtk/.claude/skills | 12/12 | 81 CRITICAL | DO_NOT_INSTALL | TM1, PE2, PE3 | Werkzeug-Parameter-Muster; Skills werden nicht genutzt |
| ECC/skills | 32/311 | 62 HIGH | DO_NOT_INSTALL | EA5, EA2, RA2 | unvollständig gescannt → vor Nutzung Vollscan |
| claude-mem/plugin/skills | 29/29 | 100 CRITICAL | DO_NOT_INSTALL | AST4, RP1, TM1 | 2 CRITICAL: Telegram-Bot liest Env → api.telegram.org; `save_goals.py` urlopen mit Env-Key. Feature, aber Exfiltrationspfad |
| deer-flow/skills/public | 23/23 | 100 CRITICAL | DO_NOT_INSTALL | E1, TT3, LP3 | 14 CRITICAL = Env-Key → Vendor-API (MiniMax/Gemini/Veo); erwartet für API-Wrapper |
| OpenMontage/.agents/skills | 32/91 | 100 CRITICAL | DO_NOT_INSTALL | E1 (235), AE1 | CRITICAL = YARA auf Webhook-Doku (`references/webhooks.md`, ngrok-Beispiel), kein Code |
| OpenMontage/.claude/skills | 32/49 | 100 CRITICAL | DO_NOT_INSTALL | E1 (389), AE1 | dito (heygen, create-video, avatar-video) |

SCHLUSSFOLGERUNG: Kein Hinweis auf bösartigen Code. Die Scanner-Empfehlung „DO_NOT_INSTALL" entsteht überwiegend durch
legitime, aber riskante Muster (Env-Zugriff + Netz). Konsequenz: API-Wrapper-Skills nie mit unseren echten Keys ausführen,
solange nicht einzeln reviewt. Ein grüner Scan ist keine Sicherheitsgarantie; Abdeckung war teils < 35 %.

## Installskripte / Supply Chain
- Nicht ausgeführt: `voicestudio.sh/install | sh`, `rtk/install.sh`, `claude-mem/install/public/install.sh`, `npx ecc-universal`.
- RTK aus Quelle gebaut (Cargo-Lock, Sandbox). OpenMontage-Requirements in eigenes venv (Sandbox). Piper von PyPI (`piper-tts==1.8.0`).
- Stimmen von `huggingface.co/rhasspy/piper-voices` (Model Cards geprüft: thorsten/kerstin CC0, mls CC-BY-4.0, pavoque **CC-BY-NC-SA → ausgeschlossen**, M-AILABS-Stimmen (eva_k, karlsson, ramona) Lizenz unklar → ausgeschlossen).

## Hooks / MCP / Berechtigungen
- Keine neuen Hooks, MCP-Server oder Berechtigungen in `.claude/` angelegt. Aktiv (vorbestehend, account-synchronisiert): Ponytail-SessionStart-Hook, diverse Plugins.
- Keine Secrets in Repo, Logs oder Berichten. `.gitignore` schließt Build-Caches aus.

## Befund: account-synchronisierte Plugins
In dieser Umgebung sind sehr viele Plugins aktiv (u. a. ~40 `ruflo-*`, bio-research, finance, legal …). Die ruflo-Hooks schreiben
Zustandsdateien in den Projektordner (`.claude-flow/`, `.swarm/agentdb-memory.db`, `ruvector.db`) — per `.gitignore` ausgeschlossen, nicht geöffnet.
Konsequenz: unnötiger Kontext-/Tool-Overhead pro Sitzung und Hintergrundaktivität außerhalb unserer Kontrolle.
Empfehlung (Co-CEO, Account-Einstellungen): für dieses Projekt nicht benötigte Plugins deaktivieren; nur Ponytail behalten.

## Eigene Skills
`produce-episode`: SkillSpector Score 0 (LOW), 0 Funde, Abdeckung 100 %.

## Offene Sicherheitsaufgaben
1. ECC und OpenMontage vollständig scannen (Budget-Option von SkillSpector prüfen) — nur falls Nutzung geplant.
2. Optionaler LLM-Modus von SkillSpector: erst nach Freigabe (Datenübertragung an Provider, Kosten).
3. Docker-basierte Sandbox für künftige unbekannte Repos.
