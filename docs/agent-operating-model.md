# Agent Operating Model

Dieses Dokument beschreibt, wie die acht Beratungsagenten in `.claude/agents/` eingesetzt werden.

## Zweck

Die Agenten unterstützen die strategische, fachliche und operative Entwicklung der islamischen Lern-App. Sie analysieren, beraten, benennen Risiken, hinterfragen Annahmen und liefern konkrete Empfehlungen.

**Der Gründer ist CEO und endgültiger Entscheider.** Agenten ersetzen keine Gründerentscheidung, keine qualifizierte hanafitische Fachperson, keinen Qari, keinen Pädagogen, keinen Fachanwalt und keinen Datenschutzexperten.

## Die acht Agenten

| Agent | Datei | Zuständigkeit |
|---|---|---|
| CPO – Product Strategy | `.claude/agents/cpo-product-strategy.md` | Nutzerproblem, Zielgruppe, JTBD, Positionierung, MVP-Scope, Priorisierung, Interviews, Produktmetriken |
| CTO – Technology & Security | `.claude/agents/cto.md` | Architektur, Prototyp/MVP/Produktion, Web/iOS/Android, Git-Strategie, Codequalität, Tests, Sicherheit, Skalierung, technische Schulden und Kosten, Build-vs-Buy |
| COO – Operations | `.claude/agents/coo.md` | Roadmap, Phasen, Abhängigkeiten, Verantwortlichkeiten, Freigaben, Content-Produktion, Qualitätsprozesse, Blocker, Ressourcen |
| CFO – Finance & Business Model | `.claude/agents/cfo.md` | Geschäftsmodell, Preise, Kosten, Budget, Unit Economics, Zahlungsbereitschaft, Szenarien, Monetarisierungsrisiken |
| Islamic Content Governance | `.claude/agents/islamic-content-governance.md` | Hanafitische Ausrichtung, Quellenmethodik, religiöse Prüf- und Freigabeprozesse, Qur'an-Audio, Prophetengeschichten, DE/TR-Lokalisierung |
| Learning Science & Curriculum | `.claude/agents/learning-science-curriculum.md` | Lernpfad, Elifba-Reihenfolge, Lernziele, Diagnose, Wiederholung, Übungstypen, Lernfortschritt, Gamification-Qualität |
| UX/UI & Accessibility | `.claude/agents/ux-ui-accessibility.md` | Visuelles Design, mobile Führung, RTL/LTR, arabische Schrift, Barrierefreiheit, Dark Mode, Navigation, visuelle Qualitätsprüfung |
| Legal, Privacy & Child Safety | `.claude/agents/legal-privacy-child-safety.md` | DSGVO, Datensparsamkeit, Einwilligungen, Minderjährigenschutz, Elternfunktionen, Analytics, Moderation, Löschkonzept, Store- und Medienrechte |

## Wann welcher Agent

| Situation | Agent(en) |
|---|---|
| Scope wächst, Feature-Zweifel, Zielgruppenfrage | CPO |
| Technologiewahl, Repo-Sicherheit, Aufwandsklärung | CTO |
| Nächster Schritt unklar, Freigaben, Abhängigkeiten | COO |
| Preis, Kosten, Tragfähigkeit | CFO |
| Jeder religiöse Inhalt vor Veröffentlichung | Islamic Content Governance |
| Lernpfad, Übungen, Wiederholung, Gamification | Learning Science |
| Screen, Flow, Schrift, Barrierefreiheit | UX/UI |
| Datenerhebung, Kinderfunktionen, Release | Legal/Child Safety |

## Aufruf

In einer Claude-Code-Session:

- explizit: „Nutze den Agenten `cpo-product-strategy`, um … zu prüfen."
- oder über die Agentenauswahl der Umgebung mit dem Namen aus dem Frontmatter.

Alle acht Dateien setzen `model: opus` im Frontmatter (offiziell unterstütztes Feld des Claude-Code-Subagent-Formats). Werkzeuge sind auf `Read, Glob, Grep` begrenzt: lesen, suchen, analysieren. Kein Schreiben, kein Bash, keine Netzwerkzugriffe. Änderungen an Dateien oder Code erfolgen nur, wenn der Gründer das ausdrücklich beauftragt – dann im Hauptkontext, nicht durch den Agenten selbst.

## Entscheidungen, die beim Gründer bleiben

- Startzielgruppe und MVP-Scope
- Technologie-Stack und Phasenfreigabe für Implementierung
- Geschäftsmodell, Preise, Finanzierungsform
- Veröffentlichung religiöser Inhalte (nach menschlicher Fachprüfung)
- Umgang mit Kinder- und Jugendbereichen
- Alle Zusagen nach außen (Termine, Partner, Kooperationen)

Agenten dürfen diese Entscheidungen vorbereiten, nicht treffen.

## Konflikte zwischen Agenten

1. Konflikt benennen, nicht glätten. Beide Positionen mit ihrer Begründung festhalten.
2. Prüfen, ob der Konflikt sachlich ist (unterschiedliche Fakten) oder eine Zielabwägung (unterschiedliche Prioritäten).
3. Bei sachlichem Konflikt: klären, welche Information fehlt, und diesen Prüfschritt als nächstes Ergebnis definieren.
4. Bei Zielabwägung: dem Gründer als Entscheidungsfrage mit Optionen und Konsequenzen vorlegen.

Vorrangregeln:

- Religiöse Grenzen (`islamic-content-governance`) und Minderjährigen-/Datenschutz (`legal-privacy-child-safety`) sind Ausschlusskriterien. Was dort als unzulässig markiert ist, wird nicht durch Produkt-, Wachstums- oder Kostenargumente überstimmt.
- In allen übrigen Fällen entscheidet der Gründer.

## Gemeinsames Decision Memo

Wenn mehrere Agenten zu einem Thema beitragen, werden ihre Ergebnisse zu **einem** Memo zusammengeführt – nicht als aneinandergereihte Einzelberichte:

1. Frage und Anlass (ein Satz)
2. Beteiligte Agenten
3. Gemeinsames Kurzurteil
4. Übereinstimmungen
5. Konflikte und offene Punkte
6. Risiken, priorisiert
7. Empfehlung mit Alternativen
8. Was bewusst nicht getan wird
9. Benötigte Gründerentscheidung
10. Nächstes überprüfbares Ergebnis mit Abnahmekriterium

Getroffene Entscheidungen gehören anschließend in `docs/decision-log.md` (Datum, Entscheidung, Status, Begründung, offene Punkte, benötigte Freigabe).

## Nutzungskombinationen

| Thema | Agenten |
|---|---|
| Produktproblem und MVP | CPO + Learning Science |
| UX und Lernfluss | UX/UI + Learning Science |
| Technische Architektur | CTO + CPO |
| Content-Freigabe | Islamic Governance + COO |
| Videos | Learning Science + Islamic Governance + UX/UI |
| Monetarisierung | CFO + CPO |
| Kinderbereich | Legal/Child Safety + Learning Science + Islamic Governance |
| Releaseprüfung | CTO + COO + Legal/Child Safety |

### Einsatzregeln

- Normal maximal zwei Agenten gleichzeitig.
- Drei nur bei fachübergreifenden Entscheidungen (Videos, Kinderbereich, Releaseprüfung).
- Niemals automatisch alle acht starten.
- Keine Agentenkaskaden: kein Agent startet einen weiteren Agenten.
- Keine mehrfachen Vollanalysen des Repositories – Kontext gezielt übergeben.
- Ergebnisse kompakt zusammenführen, nicht verketten.

## Modell- und Verbrauchsdisziplin

- **Opus** für die Agenten selbst: mehrdeutige Abwägungen, Risikoanalysen, religiöse und rechtliche Grenzfälle, Architektur- und Scope-Entscheidungen.
- **Sonnet** für Vorarbeit im Hauptkontext: Dateien lesen und zusammenfassen, Formatierung, Tabellen, Wiederholungsarbeit, Redaktion. Ein Agent wird erst gestartet, wenn die Frage steht.

Verbrauch vermeiden:

- Frage vorher präzisieren: ein konkreter Prüfauftrag statt „schau dir mal alles an".
- Nur die relevanten Dateien nennen statt Repository-Rundgang.
- Kein Agentenlauf für Fragen, die aus `docs/decision-log.md` bereits beantwortet sind.
- Keine Wiederholungsläufe ohne neue Information.
- Kein zweiter Agent, wenn der erste die Frage bereits beantwortet.
- Ergebnisse in `docs/` festhalten, damit sie nicht erneut erarbeitet werden müssen.

## Öffentliches Repository

Dieses Repository ist öffentlich. In Agentendateien, Memos und Dokumentation gehören keine personenbezogenen Daten, privaten Finanzinformationen, Zugangsdaten, Secrets, API-Schlüssel, vertraulichen Geschäftsunterlagen und keine Namen noch nicht bestätigter Fachprüfer.
