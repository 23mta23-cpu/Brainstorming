/* =========================================================================
   Iqra – Vertical Slice: eine vollstaendige Demolektion zu Alif, Ba und Ta.

   Aufbau der Datei:
     1. Daten (Glyphen, Distraktoren, Aufgabenplaene)
     2. Reine Funktionen  -> exportiert als window.IqraPure, von tests.html geprueft
     3. Zustand und Persistenz
     4. i18n
     5. Rendering der fuenf Hauptviews
     6. Verdrahtung

   Vanilla JS, kein Build, kein Paketmanager, keine externe Abhaengigkeit.
   Antwortzeit wird bewusst NICHT erfasst und nicht ausgewertet.
   ========================================================================= */
(function () {
  "use strict";

  /* ======================================================================
     1. DATEN
     ====================================================================== */

  /* rasm = Grundformklasse fuer die Fehlerlogik.
     [S] Produktsetzung fuer diesen Prototyp: ن und ي werden der Schalenklasse
     zugeordnet, damit "gleiche Seite, andere Anzahl" bzw. "gleiche Anzahl,
     andere Position" ueberhaupt unterscheidbar sind. Diese Zuordnung ist
     didaktisch gesetzt und fachlich NICHT geprueft -> Blocker B-3.
     ل und د haben eigene Klassen, damit ا -> ل korrekt als Formfehler faellt. */
  var GLYPHS = {
    alif: { char: "ا", dots: 0, pos: "none", rasm: "stroke", taught: true },
    ba: { char: "ب", dots: 1, pos: "below", rasm: "bowl", taught: true },
    ta: { char: "ت", dots: 2, pos: "above", rasm: "bowl", taught: true },
    tha: { char: "ث", dots: 3, pos: "above", rasm: "bowl", taught: false },
    nun: { char: "ن", dots: 1, pos: "above", rasm: "bowl", taught: false },
    ya: { char: "ي", dots: 2, pos: "below", rasm: "bowl", taught: false },
    lam: { char: "ل", dots: 0, pos: "none", rasm: "lam", taught: false },
    dal: { char: "د", dots: 0, pos: "none", rasm: "dal", taught: false }
  };

  /* U+066E ARABIC LETTER DOTLESS BEH: echtes Unicode-Zeichen fuer die
     gemeinsame, punktlose Grundform. Bewusst keine selbst gezeichnete
     SVG-Glyphe – Glyphengeometrie wird nicht erfunden. */
  var BOWL_BASE = "ٮ";

  var TARGETS = ["alif", "ba", "ta"];

  /* Distraktorstufen nach docs/02-vertical-slice-spec.md §6. Je Stufe genau
     drei Ablenker; zusammen mit dem Zielzeichen ergeben sich vier Optionen. */
  var DISTRACTORS = {
    alif: { 1: ["ba", "ta", "nun"], 2: ["ba", "ta", "ya"], 3: ["lam", "ba", "ta"] },
    ba: { 1: ["alif", "ta", "nun"], 2: ["ta", "tha", "nun"], 3: ["ta", "tha", "ya"] },
    ta: { 1: ["alif", "ba", "ya"], 2: ["ba", "tha", "nun"], 3: ["ba", "tha", "nun"] }
  };

  var TRAIT_CODES = ["0-none", "1-below", "1-above", "2-below", "2-above", "3-above"];

  /* Uebungsplan. Die Reihenfolge stellt sicher, dass zwischen dem ersten und
     dem letzten wertenden Item eines Zeichens mindestens zwei andere Items
     liegen, und dass kein Zeichen zweimal hintereinander drankommt.
     Anteil ا: 3 von 16 wertenden Items (~19 %), ب/ت zusammen ~81 %. */
  var PRACTICE_PLAN = [
    { letterId: "ba", taskType: "flash", level: 1 },
    { letterId: "ta", taskType: "trait", level: 1 },
    { letterId: "alif", taskType: "flash", level: 1 },
    { letterId: "ta", taskType: "flash", level: 1 },
    { letterId: "ba", taskType: "dots", level: 1 },
    { letterId: "ta", taskType: "grid", level: 2 },
    { letterId: "ba", taskType: "trait", level: 2 },
    { letterId: "alif", taskType: "grid", level: 2 },
    { letterId: "ta", taskType: "dots", level: 2 },
    { letterId: "ba", taskType: "grid", level: 2 }
  ];

  /* Abschlussdurchgang: hoechste Distraktorstufe, kein Retry. */
  var FINAL_PLAN = [
    { letterId: "ba", taskType: "flash", level: 3 },
    { letterId: "alif", taskType: "trait", level: 3 },
    { letterId: "ta", taskType: "flash", level: 3 },
    { letterId: "ba", taskType: "grid", level: 3 },
    { letterId: "ta", taskType: "dots", level: 3 },
    { letterId: "ba", taskType: "trait", level: 3 }
  ];

  /* Lernbuehne. Passivzeit gesamt 20 s, laengste Einzelstrecke 5 s,
     erste Nutzerhandlung nach 4 s. Bei prefers-reduced-motion entfaellt
     jeder Timer und der Weiter-Button ist sofort bedienbar. */
  var STAGE_STEPS = [
    { kind: "passive", chars: ["ا"], caption: "stage.s1", ms: 4000 },
    { kind: "action", action: "observe", chars: ["ا"], caption: "stage.s1" },
    { kind: "passive", chars: [BOWL_BASE], caption: "stage.s2", ms: 5000 },
    { kind: "passive", chars: ["ب"], caption: "stage.s3", ms: 4000 },
    { kind: "action", action: "dots", letterId: "ba", caption: "stage.s3" },
    { kind: "passive", chars: ["ت"], caption: "stage.s4", ms: 4000 },
    { kind: "action", action: "dots", letterId: "ta", caption: "stage.s4" },
    { kind: "passive", chars: ["ب", "ت"], caption: "stage.s5", ms: 3000 },
    { kind: "static", chars: ["ب"], caption: "stage.s6" }
  ];

  var SETTINGS_KEY = "iqraProtoSettings";
  var STATE_KEY = "iqraProtoState";
  var SCHEMA_VERSION = 2;

  /* ======================================================================
     2. REINE FUNKTIONEN
        Keine DOM-Zugriffe, kein Zustand. Direkt aus tests.html testbar.
     ====================================================================== */

  function glyphOf(idOrChar) {
    if (GLYPHS[idOrChar]) return GLYPHS[idOrChar];
    for (var k in GLYPHS) {
      if (Object.prototype.hasOwnProperty.call(GLYPHS, k) && GLYPHS[k].char === idOrChar) return GLYPHS[k];
    }
    return null;
  }

  function glyphIdOf(idOrChar) {
    if (GLYPHS[idOrChar]) return idOrChar;
    for (var k in GLYPHS) {
      if (Object.prototype.hasOwnProperty.call(GLYPHS, k) && GLYPHS[k].char === idOrChar) return k;
    }
    return null;
  }

  function traitCodeOf(letterId) {
    var g = GLYPHS[letterId];
    return g.dots + "-" + g.pos;
  }

  function parseTraitCode(code) {
    var m = /^(\d+)-(above|below|none)$/.exec(String(code));
    if (!m) return null;
    return { dots: parseInt(m[1], 10), pos: m[2] };
  }

  /* Vergleicht Anzahl und Position gegen das Ziel.
     Weichen BEIDE Dimensionen ab (z. B. Ziel ب, gewaehlt ت oder ث), ist die
     Ursache unbestimmt -> keine Kategorie, sondern eine kurze Diagnose.
     Es entsteht dadurch ausdruecklich keine vierte Fehlerkategorie. */
  function compareTraits(target, picked) {
    var countDiff = picked.dots !== target.dots;
    var posDiff = picked.pos !== target.pos;
    if (countDiff && posDiff) return { category: null, needsDiagnosis: true };
    if (countDiff) return { category: "dot_count_confusion", needsDiagnosis: false };
    if (posDiff) return { category: "dot_position_confusion", needsDiagnosis: false };
    return { category: null, needsDiagnosis: false };
  }

  function classifySinglePick(letterId, pickKind, picked) {
    var target = GLYPHS[letterId];
    if (pickKind === "trait") {
      var pt = parseTraitCode(picked);
      if (!pt) return { category: null, needsDiagnosis: true };
      /* Merkmalscode ohne Punkte behauptet keine Position -> reiner Anzahlfehler.
         Bei einer GLYPHENwahl ohne Punkte gilt dagegen weiter der Formfehler. */
      if (pt.dots === 0 && target.dots !== 0) {
        return { category: "dot_count_confusion", needsDiagnosis: false };
      }
      return compareTraits(target, pt);
    }
    var g = glyphOf(picked);
    if (!g) return { category: null, needsDiagnosis: true };
    if (g.rasm !== target.rasm) return { category: "shape_confusion", needsDiagnosis: false };
    return compareTraits(target, g);
  }

  /* classifyError(answer) -> { category, needsDiagnosis, nameMiss }
     answer: { letterId, taskType, pickKind, picked, correct }
     picked ist bei 'grid' ein Array markierter Zeichen/IDs. */
  function classifyError(answer) {
    var none = { category: null, needsDiagnosis: false, nameMiss: false };
    if (!answer) return none;
    if (answer.taskType === "name") {
      /* Namensfehler: separat notiert, ohne Kategorie und ohne Statuseinfluss,
         solange kein freigegebenes Aussprache-Audio existiert (A-1). */
      return { category: null, needsDiagnosis: false, nameMiss: !answer.correct };
    }
    if (answer.correct) return none;

    if (Array.isArray(answer.picked)) {
      var tally = {};
      var wrongMarks = 0;
      var ambiguous = 0;
      for (var i = 0; i < answer.picked.length; i++) {
        var gid = glyphIdOf(answer.picked[i]);
        if (gid === answer.letterId) continue;
        wrongMarks++;
        var r = classifySinglePick(answer.letterId, "glyph", answer.picked[i]);
        if (r.category) tally[r.category] = (tally[r.category] || 0) + 1;
        else ambiguous++;
      }
      /* Nur Auslassungen, keine Fehlmarkierung: es gibt keine gewaehlte
         Falschantwort, aus der eine Kategorie ableitbar waere -> Diagnose. */
      if (wrongMarks === 0) return { category: null, needsDiagnosis: true, nameMiss: false };
      var best = null;
      var bestN = 0;
      var tie = false;
      for (var c in tally) {
        if (!Object.prototype.hasOwnProperty.call(tally, c)) continue;
        if (tally[c] > bestN) { best = c; bestN = tally[c]; tie = false; }
        else if (tally[c] === bestN) tie = true;
      }
      if (!best || tie || ambiguous > bestN) {
        return { category: null, needsDiagnosis: true, nameMiss: false };
      }
      return { category: best, needsDiagnosis: false, nameMiss: false };
    }

    var res = classifySinglePick(answer.letterId, answer.pickKind, answer.picked);
    return { category: res.category, needsDiagnosis: res.needsDiagnosis, nameMiss: false };
  }

  /* Loest eine offene Diagnose auf. Ist die Anzahlfrage falsch, war die
     Anzahl das Problem; sonst die Position. */
  function resolveDiagnosis(countAnswerCorrect) {
    return countAnswerCorrect ? "dot_position_confusion" : "dot_count_confusion";
  }

  /* Reihenfolge kommt aus der Einfuegereihenfolge des Arrays, niemals aus ts. */
  function computeLetterState(answers, letterId, scope, dueDate) {
    var scoped = [];
    var i;
    for (i = 0; i < answers.length; i++) {
      if (answers[i].scope === scope && answers[i].taskType !== "name") scoped.push(answers[i]);
    }
    var order = [];
    for (i = 0; i < scoped.length; i++) {
      if (order.indexOf(scoped[i].qid) === -1) order.push(scoped[i].qid);
    }

    var mine = [];
    for (i = 0; i < scoped.length; i++) if (scoped[i].letterId === letterId) mine.push(scoped[i]);

    var forms = [];
    var firstPos = -1;
    var lastPos = -1;
    var correctCount = 0;
    for (i = 0; i < mine.length; i++) {
      if (mine[i].correct) correctCount++;
      if (mine[i].firstTry && mine[i].correct) {
        if (forms.indexOf(mine[i].taskType) === -1) forms.push(mine[i].taskType);
        var pos = order.indexOf(mine[i].qid);
        if (firstPos === -1 || pos < firstPos) firstPos = pos;
        if (pos > lastPos) lastPos = pos;
      }
    }

    var itemsBetween = (firstPos === -1 || lastPos === firstPos) ? 0 : (lastPos - firstPos - 1);

    var ls = {
      letterId: letterId,
      scope: scope,
      firstTryForms: forms,
      itemsBetween: itemsBetween,
      answerCount: mine.length,
      correctCount: correctCount,
      dueDate: dueDate || null,
      status: "not_yet"
    };

    if (scope === "nextday") {
      ls.status = isOvernightSecure(ls) ? "overnight_secure"
        : (forms.length ? "wobbly" : "not_yet");
      return ls;
    }

    if (isTodaySecure(ls)) ls.status = "today_secure";
    else if (forms.length === 0) ls.status = "not_yet";
    else if (mine.length && correctCount * 2 < mine.length) ls.status = "not_yet";
    else ls.status = "wobbly";
    return ls;
  }

  /* [S] Produktsetzung fuer diesen Test, keine wissenschaftliche Norm. */
  function isTodaySecure(ls) {
    if (!ls || !ls.firstTryForms) return false;
    if (ls.scope && ls.scope !== "today") return false;
    var f = ls.firstTryForms;
    if (f.length < 3) return false;
    if (f.indexOf("flash") === -1) return false;
    if (f.indexOf("grid") === -1 && f.indexOf("dots") === -1) return false;
    return ls.itemsBetween >= 2;
  }

  /* Wird ausschliesslich in der Folgetagspruefung vergeben. */
  function isOvernightSecure(ls) {
    if (!ls || !ls.firstTryForms) return false;
    if (ls.scope !== "nextday") return false;
    return ls.firstTryForms.length >= 2;
  }

  /* Lokaler Kalendertag. Bewusst NICHT ueber toISOString – das liefert UTC und
     damit abends in Mitteleuropa den Vortag. */
  function todayLocal(d) {
    var x = d ? new Date(d.getTime()) : new Date();
    return fmtLocal(x);
  }

  function fmtLocal(x) {
    var m = x.getMonth() + 1;
    var day = x.getDate();
    return x.getFullYear() + "-" + (m < 10 ? "0" + m : m) + "-" + (day < 10 ? "0" + day : day);
  }

  function parseLocalDate(value) {
    if (value instanceof Date) return new Date(value.getTime());
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value));
    if (!m) return null;
    return new Date(parseInt(m[1], 10), parseInt(m[2], 10) - 1, parseInt(m[3], 10));
  }

  /* Immer genau der naechste lokale Kalendertag. Keine 1-/2-/4-Tage-Logik. */
  function nextDueDate(today) {
    var d = parseLocalDate(today);
    if (!d) return null;
    d.setDate(d.getDate() + 1);
    return fmtLocal(d);
  }

  function isDue(dueDate, today) {
    if (!dueDate || !today) return false;
    return String(today) >= String(dueDate);
  }

  function daysBetween(fromDate, toDate) {
    var a = parseLocalDate(fromDate);
    var b = parseLocalDate(toDate);
    if (!a || !b) return null;
    return Math.round((b.getTime() - a.getTime()) / 86400000);
  }

  function shuffle(arr, rnd) {
    var r = rnd || Math.random;
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(r() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  /* Genau vier Optionen, Zielzeichen genau einmal, pro Item neu gemischt.
     prevKey verhindert, dass zwei aufeinanderfolgende Items dasselbe Set in
     derselben Reihenfolge zeigen. */
  function buildDistractors(letterId, level, prevKey, rnd) {
    var lvl = DISTRACTORS[letterId] ? (DISTRACTORS[letterId][level] ? level : 1) : 1;
    var pool = DISTRACTORS[letterId] ? DISTRACTORS[letterId][lvl].slice() : [];
    var ids = [];
    for (var i = 0; i < pool.length; i++) {
      if (pool[i] !== letterId && ids.indexOf(pool[i]) === -1) ids.push(pool[i]);
    }
    ids = ids.slice(0, 3);
    ids.push(letterId);
    var out = shuffle(ids, rnd);
    for (var guard = 0; guard < 12 && prevKey && out.join(",") === prevKey; guard++) {
      out = shuffle(ids, rnd);
    }
    if (prevKey && out.join(",") === prevKey) {
      out = out.slice(1).concat(out.slice(0, 1));
    }
    return out;
  }

  function buildTraitOptions(letterId, rnd) {
    var correct = traitCodeOf(letterId);
    var t = parseTraitCode(correct);
    var sameCountOtherPos = [];
    var samePosOtherCount = [];
    var rest = [];
    for (var i = 0; i < TRAIT_CODES.length; i++) {
      var c = TRAIT_CODES[i];
      if (c === correct) continue;
      var p = parseTraitCode(c);
      if (p.dots === t.dots) sameCountOtherPos.push(c);
      else if (p.pos === t.pos) samePosOtherCount.push(c);
      else rest.push(c);
    }
    var picked = [correct];
    if (samePosOtherCount.length) picked.push(shuffle(samePosOtherCount, rnd)[0]);
    if (sameCountOtherPos.length) picked.push(shuffle(sameCountOtherPos, rnd)[0]);
    var pool = shuffle(rest.concat(samePosOtherCount).concat(sameCountOtherPos), rnd);
    for (var j = 0; j < pool.length && picked.length < 4; j++) {
      if (picked.indexOf(pool[j]) === -1) picked.push(pool[j]);
    }
    return shuffle(picked, rnd);
  }

  function buildGrid(letterId, level, rnd) {
    var pool = DISTRACTORS[letterId][DISTRACTORS[letterId][level] ? level : 1];
    var cells = [letterId, letterId, letterId];
    var k = 0;
    while (cells.length < 9) {
      cells.push(pool[k % pool.length]);
      k++;
    }
    return shuffle(cells, rnd);
  }

  /* Ehrliche Fortschrittssprache. Enthaelt nie "beherrschst", nie "von 28",
     nie eine Dauer und vergibt overnight_secure nie vor der Folgepruefung. */
  function progressSentence(ls, lang, dict) {
    var d = dict || I18N[lang] || I18N.de;
    var key = "progress." + (ls && ls.status ? ls.status : "not_yet");
    var s = d[key] || key;
    return s;
  }

  /* Verwirft alte Prototypfelder ersatzlos (progress, savedMedia, qb, round). */
  function migrateState(raw) {
    var fresh = emptyState();
    if (!raw || typeof raw !== "object") return fresh;
    if (raw.schemaVersion !== SCHEMA_VERSION) return fresh;
    if (Array.isArray(raw.precheck)) fresh.precheck = raw.precheck;
    if (Array.isArray(raw.answers)) fresh.answers = raw.answers;
    if (Array.isArray(raw.errors)) fresh.errors = raw.errors;
    if (typeof raw.dueDate === "string") fresh.dueDate = raw.dueDate;
    if (typeof raw.nextdayDoneDate === "string") fresh.nextdayDoneDate = raw.nextdayDoneDate;
    if (typeof raw.nextdayGapDays === "number") fresh.nextdayGapDays = raw.nextdayGapDays;
    if (raw.session && typeof raw.session === "object") {
      fresh.session = normalizeSession(raw.session);
    }
    return fresh;
  }

  /* Waechter: eine kaputte oder abgelaufene Session darf nie einen leeren
     Screen erzeugen oder eine Runde blockieren. */
  function normalizeSession(s) {
    var out = {
      stage: typeof s.stage === "string" ? s.stage : "intro",
      index: typeof s.index === "number" && s.index >= 0 ? s.index : 0,
      queue: Array.isArray(s.queue) ? s.queue : [],
      stageStep: typeof s.stageStep === "number" && s.stageStep >= 0 ? s.stageStep : 0,
      pending: s.pending && typeof s.pending === "object" ? s.pending : null,
      diagnosisDone: Array.isArray(s.diagnosisDone) ? s.diagnosisDone : []
    };
    var itemStages = ["precheck", "practice", "diagnosis", "final", "nextday"];
    if (itemStages.indexOf(out.stage) !== -1) {
      if (!out.queue.length) { out.stage = "intro"; out.index = 0; out.pending = null; }
      else if (out.index >= out.queue.length) { out.index = out.queue.length - 1; }
    }
    if (out.stage === "stage" && out.stageStep >= STAGE_STEPS.length) out.stageStep = STAGE_STEPS.length - 1;
    return out;
  }

  function emptyState() {
    return {
      schemaVersion: SCHEMA_VERSION,
      precheck: [],
      answers: [],
      errors: [],
      dueDate: null,
      nextdayDoneDate: null,
      nextdayGapDays: null,
      session: { stage: "intro", index: 0, queue: [], stageStep: 0, pending: null, diagnosisDone: [] }
    };
  }

  /* ======================================================================
     3. ZUSTAND
     ====================================================================== */

  var state = emptyState();
  var settings = { lang: "de", theme: "system" };
  var letters = { alif: null, ba: null, ta: null };  /* abgeleitet, nie persistiert */
  var storageOk = true;
  var reducedMotion = false;
  var flashTimer = null;

  function probeStorage() {
    try {
      localStorage.setItem("__iqraProbe", "1");
      localStorage.removeItem("__iqraProbe");
      return true;
    } catch (e) {
      return false;
    }
  }

  function loadPersisted() {
    try {
      var rawSettings = localStorage.getItem(SETTINGS_KEY);
      if (rawSettings) {
        var s = JSON.parse(rawSettings);
        if (s.lang === "de" || s.lang === "tr") settings.lang = s.lang;
        if (s.theme === "light" || s.theme === "dark" || s.theme === "system") settings.theme = s.theme;
      }
      var rawState = localStorage.getItem(STATE_KEY);
      if (rawState) state = migrateState(JSON.parse(rawState));
    } catch (e) {
      state = emptyState();
    }
  }

  function persistSettings() {
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch (e) { storageOk = false; }
  }

  function persistState() {
    try {
      localStorage.setItem(STATE_KEY, JSON.stringify({
        schemaVersion: SCHEMA_VERSION,
        precheck: state.precheck,
        answers: state.answers,
        errors: state.errors,
        dueDate: state.dueDate,
        nextdayDoneDate: state.nextdayDoneDate,
        nextdayGapDays: state.nextdayGapDays,
        session: state.session
      }));
    } catch (e) {
      storageOk = false;
      renderStorageWarning();
    }
  }

  function refreshLetterStates(scope) {
    for (var i = 0; i < TARGETS.length; i++) {
      letters[TARGETS[i]] = computeLetterState(state.answers, TARGETS[i], scope || "today", state.dueDate);
    }
    return letters;
  }

  /* ======================================================================
     4. i18n
     ====================================================================== */

  var I18N = {
    de: {
      "common.next": "Weiter",
      "theme.light": "Helles Erscheinungsbild",
      "theme.dark": "Dunkles Erscheinungsbild",
      "theme.system": "Systemeinstellung",
      "meter.of": "{n} von {total}",

      "precheck.eyebrow": "Demolektion",
      "precheck.title": "Alif, Bā und Tā",
      "precheck.introText": "Zuerst ein kurzer Vorcheck. Du bekommst dabei keine Rückmeldung, ob eine Antwort richtig war – er hält nur fest, wo du startest.",
      "precheck.introHint": "Wenn du ein Zeichen nicht kennst, wähle „Kenne ich nicht“. Das ist keine falsche Antwort.",
      "precheck.cta": "Vorcheck starten",
      "precheck.restart": "Lektion neu beginnen",
      "precheck.actLabel": "Deine Einschätzung",
      "precheck.question": "Wie heißt dieses Zeichen?",
      "precheck.unknown": "Kenne ich nicht",
      "precheck.other": "Ein anderer Buchstabe",
      "precheck.compare": "Im Vorcheck hast du {n} von {total} Zeichen benannt. Das ist ein Anhaltspunkt für das Gespräch, keine geprüfte Vorher-/Nachher-Messung.",
      "precheck.doneText": "Die Lektion ist abgeschlossen. Du kannst sie jederzeit neu beginnen – dabei wird der bisherige Stand ersetzt.",

      "name.alif": "Alif",
      "name.ba": "Bā",
      "name.ta": "Tā",

      "stage.actLabel": "Jetzt du",
      "stage.s1": "Alif. Ein senkrechter Strich. Kein Punkt.",
      "stage.s2": "Bā und Tā teilen diese Form. Noch ohne Punkt.",
      "stage.s3": "Ein Punkt unten → Bā.",
      "stage.s4": "Zwei Punkte oben → Tā.",
      "stage.s5": "Gleiche Form. Der Unterschied sind die Punkte.",
      "stage.s6": "So sieht der Buchstabe allein stehend aus. Im Wort verändert er seine Form. Das lernst du später.",
      "stage.a1prompt": "Was stimmt für dieses Zeichen?",
      "stage.a1none": "Kein Punkt",
      "stage.a1one": "Ein Punkt unten",
      "stage.a1two": "Zwei Punkte oben",
      "stage.a2prompt": "Setze den Punkt für Bā.",
      "stage.a3prompt": "Setze die Punkte für Tā.",
      "stage.observeOk": "Genau. Alif hat keinen Punkt. Das ist der Unterschied zu den nächsten beiden Zeichen.",
      "stage.observeWrong": "Noch nicht. Alif hat gar keinen Punkt – weder oben noch unten.",

      "practice.mode.practice": "Übung",
      "practice.mode.diagnosis": "Kurze Nachfrage",
      "practice.mode.final": "Abschlussdurchgang – nur der erste Versuch zählt",
      "practice.prompt.flash": "Welches Zeichen war das?",
      "practice.prompt.flashWatch": "Schau genau hin.",
      "practice.prompt.grid": "Markiere alle {char}.",
      "practice.prompt.dots": "Setze die Punkte für {name}.",
      "practice.prompt.trait": "Wie viele Punkte hat {char} und wo?",
      "practice.gridConfirm": "Auswahl bestätigen",
      "practice.dotsOne": "1 Punkt",
      "practice.dotsTwo": "2 Punkte",
      "practice.slotAbove": "oben setzen",
      "practice.slotBelow": "unten setzen",
      "practice.pickCountFirst": "Wähle zuerst die Anzahl der Punkte.",
      "practice.markNone": "Du hast noch nichts markiert.",

      "trait.0-none": "keine Punkte",
      "trait.1-below": "ein Punkt unten",
      "trait.1-above": "ein Punkt oben",
      "trait.2-below": "zwei Punkte unten",
      "trait.2-above": "zwei Punkte oben",
      "trait.3-above": "drei Punkte oben",

      "desc.alif": "hat keinen Punkt",
      "desc.ba": "hat einen Punkt unten",
      "desc.ta": "hat zwei Punkte oben",

      "mark.correct": "richtig",
      "mark.wrong": "deine Wahl – falsch",
      "mark.missed": "fehlte",

      "fb.correct": "Richtig. {char} {desc}.",
      "fb.shape": "Die Grundform stimmt nicht. {char} {desc}.",
      "fb.count": "Die Position stimmt. Die Anzahl nicht: {char} {desc}.",
      "fb.position": "Die Anzahl stimmt. Die Punkte gehören an die andere Stelle: {char} {desc}.",
      "fb.mixed": "Hier stimmen Anzahl und Position nicht. {char} {desc}.",
      "fb.untrained": "Das ist ein anderer Buchstabe, den du später lernst. {char} {desc}.",
      "fb.gridOk": "Richtig. Alle {char} markiert – {desc}.",
      "fb.gridWrong": "Markiert, gehört aber nicht dazu: {list}. {char} {desc}.",
      "fb.gridMissed": "Nicht markiert, gehört aber dazu: {n}×. {char} {desc}.",
      "fb.dotsOk": "Richtig. {char} {desc}.",
      "fb.diagnosisIntro": "Kurze Nachfrage, um Anzahl und Position auseinanderzuhalten.",

      "result.eyebrow": "Ergebnis",
      "result.passed": "Lektion bestanden.",
      "result.notPassed": "Noch nicht bestanden – und das ist in Ordnung.",
      "result.leadPassed": "ب und ت erkennst du heute sicher, ا war dein Vergleichspunkt. Morgen bekommst du sie noch einmal – ohne dass du etwas einstellen musst.",
      "result.leadNotPassed": "Du fängst nicht von vorn an. Morgen wird genau daran weitergearbeitet, mit anderen Aufgabenformen.",
      "result.cta": "Zur Übersicht",
      "result.errorsTitle": "Deine Fehler lagen hier:",
      "result.errNone": "Heute ist dir kein Fehler unterlaufen, den wir dir erklären müssten.",
      "result.err.shape_confusion": "Grundform ({n}×)",
      "result.err.dot_count_confusion": "Punktanzahl ({n}×)",
      "result.err.dot_position_confusion": "Punktposition ({n}×)",
      "result.err.unresolved": "noch nicht eindeutig zuzuordnen ({n}×)",
      "result.nextday": "Am {date} steht ein kurzer Block bereit – er beginnt mit dem Zeichen, das heute am wenigsten saß.",
      "result.nextdayNoStorage": "Auf diesem Gerät kann gerade nichts gespeichert werden. Ein Block für morgen kann deshalb nicht zugesagt werden.",
      "result.nextdayDone": "Die Folgeprüfung ist abgeschlossen.",

      "progress.today_secure": "Du hast es in drei verschiedenen Aufgabenformen im ersten Versuch richtig erkannt. Morgen wird kurz geprüft, ob es geblieben ist.",
      "progress.wobbly": "Einiges saß sofort, anderes erst nach einem Fehler. Das ist ein normaler Zwischenstand.",
      "progress.not_yet": "Daran wird morgen zuerst weitergearbeitet.",
      "progress.overnight_secure": "Auch nach einer Nacht noch richtig erkannt.",
      "progress.overnight_secure_later": "Auch nach einer Pause noch richtig erkannt.",
      "status.today_secure": "heute sicher",
      "status.wobbly": "noch wackelig",
      "status.not_yet": "noch nicht sicher",
      "status.overnight_secure": "über Nacht sicher",

      "nextday.eyebrow": "Folgeprüfung",
      "nextday.offerTitle": "Deine Folgeprüfung ist bereit.",
      "nextday.offerText": "Kurzer Block mit den Zeichen, die zuletzt am wenigsten saßen. Kein Streak, keine Strafe.",
      "nextday.offerCta": "Folgeprüfung starten",
      "nextday.resultTitle": "Stand nach der Folgeprüfung",

      "notice.review": "Interner Prototyp. Die arabischen Buchstabenformen, die Punkte und die Ablenkzeichen sind noch nicht durch eine qualifizierte Arabisch-/Elifba- bzw. Schriftprüfung freigegeben. Es ist keine geprüfte Schriftdatei eingebunden.",
      "notice.noStorage": "Dieses Gerät speichert gerade nichts lokal. Ein Ergebnis für morgen kann deshalb nicht zugesagt werden.",
      "notice.privacy": "Dieser Prototyp speichert ausschließlich lokal auf diesem Gerät. Keine Konten, kein Server, kein Tracking.",
      "notice.clear": "Alle lokalen Daten löschen",
      "notice.clearConfirm": "Alle lokal gespeicherten Daten dieses Prototyps löschen?"
    },

    tr: {
      "common.next": "Devam",
      "theme.light": "Açık görünüm",
      "theme.dark": "Koyu görünüm",
      "theme.system": "Sistem ayarı",
      "meter.of": "{total} içinden {n}",

      "precheck.eyebrow": "Demo dersi",
      "precheck.title": "Elif, Bā ve Tā",
      "precheck.introText": "Önce kısa bir ön kontrol. Bu sırada doğru mu yanlış mı yaptığın söylenmez – yalnızca nereden başladığın kaydedilir.",
      "precheck.introHint": "Bir işareti tanımıyorsan „Bilmiyorum“ seçeneğini kullan. Bu yanlış bir cevap değildir.",
      "precheck.cta": "Ön kontrolü başlat",
      "precheck.restart": "Dersi yeniden başlat",
      "precheck.actLabel": "Senin değerlendirmen",
      "precheck.question": "Bu işaretin adı nedir?",
      "precheck.unknown": "Bilmiyorum",
      "precheck.other": "Başka bir harf",
      "precheck.compare": "Ön kontrolde {total} işaretten {n} tanesini adlandırdın. Bu, görüşme için bir ipucudur; doğrulanmış bir önce/sonra ölçümü değildir.",
      "precheck.doneText": "Ders tamamlandı. İstediğin zaman yeniden başlayabilirsin – bu durumda mevcut durum değiştirilir.",

      "name.alif": "Elif",
      "name.ba": "Bā",
      "name.ta": "Tā",

      "stage.actLabel": "Şimdi sen",
      "stage.s1": "Elif. Dik bir çizgi. Nokta yok.",
      "stage.s2": "Bā ve Tā bu formu paylaşır. Henüz noktasız.",
      "stage.s3": "Altta bir nokta → Bā.",
      "stage.s4": "Üstte iki nokta → Tā.",
      "stage.s5": "Aynı form. Fark noktalarda.",
      "stage.s6": "Harf tek başınayken böyle görünür. Kelime içinde biçimi değişir. Bunu daha sonra öğreneceksin.",
      "stage.a1prompt": "Bu işaret için hangisi doğru?",
      "stage.a1none": "Nokta yok",
      "stage.a1one": "Altta bir nokta",
      "stage.a1two": "Üstte iki nokta",
      "stage.a2prompt": "Bā için noktayı yerleştir.",
      "stage.a3prompt": "Tā için noktaları yerleştir.",
      "stage.observeOk": "Aynen. Elif’in noktası yoktur. Sonraki iki işaretten farkı budur.",
      "stage.observeWrong": "Henüz değil. Elif’in hiç noktası yoktur – ne üstte ne altta.",

      "practice.mode.practice": "Alıştırma",
      "practice.mode.diagnosis": "Kısa ara soru",
      "practice.mode.final": "Kapanış turu – yalnızca ilk deneme sayılır",
      "practice.prompt.flash": "Bu hangi işaretti?",
      "practice.prompt.flashWatch": "Dikkatle bak.",
      "practice.prompt.grid": "Bütün {char} işaretlerini işaretle.",
      "practice.prompt.dots": "{name} için noktaları yerleştir.",
      "practice.prompt.trait": "{char} kaç noktalıdır ve noktalar nerede?",
      "practice.gridConfirm": "Seçimi onayla",
      "practice.dotsOne": "1 nokta",
      "practice.dotsTwo": "2 nokta",
      "practice.slotAbove": "üste koy",
      "practice.slotBelow": "alta koy",
      "practice.pickCountFirst": "Önce nokta sayısını seç.",
      "practice.markNone": "Henüz hiçbir şey işaretlemedin.",

      "trait.0-none": "nokta yok",
      "trait.1-below": "altta bir nokta",
      "trait.1-above": "üstte bir nokta",
      "trait.2-below": "altta iki nokta",
      "trait.2-above": "üstte iki nokta",
      "trait.3-above": "üstte üç nokta",

      "desc.alif": "noktasızdır",
      "desc.ba": "altta bir noktalıdır",
      "desc.ta": "üstte iki noktalıdır",

      "mark.correct": "doğru",
      "mark.wrong": "senin seçimin – yanlış",
      "mark.missed": "eksikti",

      "fb.correct": "Doğru. {char} {desc}.",
      "fb.shape": "Temel form uymuyor. {char} {desc}.",
      "fb.count": "Konum doğru. Sayı değil: {char} {desc}.",
      "fb.position": "Sayı doğru. Noktaların yeri farklı: {char} {desc}.",
      "fb.mixed": "Burada hem sayı hem konum uymuyor. {char} {desc}.",
      "fb.untrained": "Bu, daha sonra öğreneceğin başka bir harf. {char} {desc}.",
      "fb.gridOk": "Doğru. Bütün {char} işaretlendi – {desc}.",
      "fb.gridWrong": "İşaretlendi ama buraya ait değil: {list}. {char} {desc}.",
      "fb.gridMissed": "İşaretlenmedi ama buraya ait: {n}×. {char} {desc}.",
      "fb.dotsOk": "Doğru. {char} {desc}.",
      "fb.diagnosisIntro": "Sayı ile konumu ayırmak için kısa bir ara soru.",

      "result.eyebrow": "Sonuç",
      "result.passed": "Ders tamamlandı.",
      "result.notPassed": "Henüz tamamlanmadı – bu da sorun değil.",
      "result.leadPassed": "ب ve ت bugün güvenle tanıyorsun, ا karşılaştırma noktandı. Yarın hiçbir ayar yapmadan tekrar karşına gelecekler.",
      "result.leadNotPassed": "Baştan başlamıyorsun. Yarın tam bu noktadan, başka alıştırma biçimleriyle devam edilecek.",
      "result.cta": "Genel görünüme",
      "result.errorsTitle": "Hataların şuralardaydı:",
      "result.errNone": "Bugün sana açıklamamız gereken bir hata yapmadın.",
      "result.err.shape_confusion": "Temel form ({n}×)",
      "result.err.dot_count_confusion": "Nokta sayısı ({n}×)",
      "result.err.dot_position_confusion": "Nokta konumu ({n}×)",
      "result.err.unresolved": "henüz kesin olarak sınıflandırılamadı ({n}×)",
      "result.nextday": "{date} tarihinde kısa bir blok hazır olacak – bugün en az oturan işaretle başlayacak.",
      "result.nextdayNoStorage": "Bu cihazda şu anda hiçbir şey kaydedilemiyor. Bu yüzden yarın için bir blok söz verilemez.",
      "result.nextdayDone": "Takip kontrolü tamamlandı.",

      "progress.today_secure": "Üç farklı alıştırma biçiminde ilk denemede doğru tanıdın. Yarın kısaca kalıcı olup olmadığına bakılacak.",
      "progress.wobbly": "Bazıları hemen doğruydu, bazıları ancak bir hatadan sonra. Bu normal bir ara durum.",
      "progress.not_yet": "Yarın önce buradan devam edilecek.",
      "progress.overnight_secure": "Bir geceden sonra da doğru tanındı.",
      "progress.overnight_secure_later": "Bir aradan sonra da doğru tanındı.",
      "status.today_secure": "bugün güvenli",
      "status.wobbly": "henüz oturmadı",
      "status.not_yet": "henüz güvenli değil",
      "status.overnight_secure": "gece sonrası güvenli",

      "nextday.eyebrow": "Takip kontrolü",
      "nextday.offerTitle": "Takip kontrolün hazır.",
      "nextday.offerText": "Son turda en az oturan işaretlerle kısa bir blok. Seri yok, ceza yok.",
      "nextday.offerCta": "Takip kontrolünü başlat",
      "nextday.resultTitle": "Takip kontrolünden sonraki durum",

      "notice.review": "Dahili prototip. Arapça harf formları, noktalar ve çeldirici işaretler henüz nitelikli bir Arapça/Elifba veya yazı incelemesinden geçmedi. Denetlenmiş bir yazı tipi dosyası eklenmemiştir.",
      "notice.noStorage": "Bu cihaz şu anda yerel olarak hiçbir şey kaydetmiyor. Bu yüzden yarın için bir sonuç söz verilemez.",
      "notice.privacy": "Bu prototip verileri yalnızca bu cihazda yerel olarak saklar. Hesap yok, sunucu yok, takip yok.",
      "notice.clear": "Tüm yerel verileri sil",
      "notice.clearConfirm": "Bu prototipin yerel olarak kaydedilmiş tüm verileri silinsin mi?"
    }
  };

  function t(key) {
    var d = I18N[settings.lang] || I18N.de;
    return Object.prototype.hasOwnProperty.call(d, key) ? d[key] : (I18N.de[key] || key);
  }

  function fill(str, params) {
    var out = str;
    for (var k in params) {
      if (Object.prototype.hasOwnProperty.call(params, k)) {
        out = out.split("{" + k + "}").join(params[k]);
      }
    }
    return out;
  }

  /* ======================================================================
     5. DOM-HELFER
     ====================================================================== */

  function $(id) { return document.getElementById(id); }

  function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); }

  /* Arabisches Zeichen immer in eigenem Element mit dir/lang/translate,
     damit es nie in den Bidi-Kontext des deutschen bzw. tuerkischen Satzes
     gerissen wird. */
  function arabicSpan(char, extraClass) {
    var span = document.createElement("span");
    span.className = "arabic " + (extraClass || "glyph-inline");
    span.textContent = char;
    span.setAttribute("dir", "rtl");
    span.setAttribute("lang", "ar");
    span.setAttribute("translate", "no");
    return span;
  }

  function setArabicText(el, char) {
    el.textContent = char;
    el.setAttribute("dir", "rtl");
    el.setAttribute("lang", "ar");
    el.setAttribute("translate", "no");
  }

  /* Setzt einen Satz aus Text und isolierten arabischen Zeichen zusammen.
     {char} im Template wird durch ein eigenes Element ersetzt. */
  function renderSentence(el, template, params) {
    clear(el);
    var parts = template.split(/(\{char\})/);
    for (var i = 0; i < parts.length; i++) {
      if (parts[i] === "{char}") {
        /* Glyphe und Folgewort bleiben zusammen, damit das Zeichen nicht
           allein am Zeilenende steht und vom Satz getrennt wirkt. */
        var group = document.createElement("span");
        group.className = "nowrap-group";
        group.appendChild(arabicSpan(params.char));
        var rest = parts[i + 1] ? fill(parts[i + 1], params) : "";
        var m = /^(\s*\S+)([\s\S]*)$/.exec(rest);
        if (m) {
          group.appendChild(document.createTextNode(m[1]));
          parts[i + 1] = m[2];
        }
        el.appendChild(group);
      } else if (parts[i]) {
        el.appendChild(document.createTextNode(fill(parts[i], params)));
      }
    }
  }

  function setFeedback(el, tone, template, params) {
    el.hidden = false;
    el.className = "feedback " + (tone === "ok" ? "feedback-ok" : tone === "attn" ? "feedback-attn" : "");
    renderSentence(el, template, params || {});
  }

  function hideFeedback(el) { el.hidden = true; clear(el); }

  /* DE und TR schreiben beide Tag.Monat.Jahr – bewusst kein toLocaleDateString,
     das je nach Geraetegebietsschema von der App-Sprache abweichen wuerde. */
  function formatDate(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ""));
    return m ? m[3] + "." + m[2] + "." + m[1] : String(iso || "");
  }

  function setMeter(fillEl, labelEl, n, total) {
    fillEl.style.width = total ? Math.round((n / total) * 100) + "%" : "0%";
    labelEl.textContent = fill(t("meter.of"), { n: n, total: total });
  }

  /* Fokus nach jedem View- und Zustandswechsel auf die neue Aufgabenstellung,
     damit Screenreader- und Tastaturnutzung dem Ablauf folgen kann. */
  function focusEl(el) {
    if (!el || el.hidden || el.offsetParent === null) return false;
    el.setAttribute("tabindex", "-1");
    try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); }
    return true;
  }

  function focusFirst(view) {
    var candidates = view.querySelectorAll("h1, h2");
    for (var i = 0; i < candidates.length; i++) {
      if (focusEl(candidates[i])) return;
    }
  }

  var VIEWS = ["precheck", "stage", "practice", "result", "nextday"];

  function showView(name) {
    for (var i = 0; i < VIEWS.length; i++) {
      $("view-" + VIEWS[i]).classList.toggle("active", VIEWS[i] === name);
    }
    window.scrollTo(0, 0);
    focusFirst($("view-" + name));
  }

  /* ======================================================================
     6. ITEMS
     ====================================================================== */

  var lastOptionKey = null;

  function makeItem(spec, scope, seq) {
    var item = {
      qid: scope + "-" + spec.taskType + "-" + spec.letterId + "-" + seq,
      letterId: spec.letterId,
      taskType: spec.taskType,
      level: spec.level,
      scope: scope
    };
    if (spec.taskType === "flash") {
      item.options = buildDistractors(spec.letterId, spec.level, lastOptionKey);
      lastOptionKey = item.options.join(",");
      item.pickKind = "glyph";
    } else if (spec.taskType === "grid") {
      item.cells = buildGrid(spec.letterId, spec.level);
      item.pickKind = "glyph";
    } else if (spec.taskType === "dots") {
      item.pickKind = "trait";
    } else if (spec.taskType === "trait") {
      item.options = buildTraitOptions(spec.letterId);
      item.pickKind = "trait";
    }
    return item;
  }

  function buildQueue(plan, scope) {
    lastOptionKey = null;
    var out = [];
    for (var i = 0; i < plan.length; i++) out.push(makeItem(plan[i], scope, i + 1));
    return out;
  }

  /* Diagnose: 2–4 Items, hoechstens eine Diagnose pro Zeichen und Sitzung,
     und immer eine ANDERE Aufgabenform als die, in der der Fehler auftrat. */
  function buildDiagnosisQueue() {
    var done = state.session.diagnosisDone || [];
    var open = {};
    var i;
    for (i = 0; i < state.answers.length; i++) {
      var a = state.answers[i];
      if (a.scope !== "today" || a.correct) continue;
      /* Namensitems loesen ohne freigegebenes Audio keine Nachuebung aus. */
      if (a.taskType === "name") continue;
      if (done.indexOf(a.letterId) !== -1) continue;
      if (!open[a.letterId]) open[a.letterId] = { needsDiagnosis: false, category: null, forms: [] };
      if (a.needsDiagnosis) open[a.letterId].needsDiagnosis = true;
      if (a.category) open[a.letterId].category = a.category;
      if (open[a.letterId].forms.indexOf(a.taskType) === -1) open[a.letterId].forms.push(a.taskType);
    }

    var order = ["ba", "ta", "alif"];
    var plan = [];
    for (i = 0; i < order.length && plan.length < 4; i++) {
      var lid = order[i];
      if (!open[lid]) continue;
      if (open[lid].needsDiagnosis) {
        /* Anzahlfrage zuerst, danach die Positionsfrage. */
        plan.push({ letterId: lid, taskType: "trait", level: 1, diagnose: "count" });
        if (lid !== "alif" && plan.length < 4) {
          plan.push({ letterId: lid, taskType: "dots", level: 1, diagnose: "position" });
        }
      } else if (open[lid].category === "shape_confusion") {
        plan.push({ letterId: lid, taskType: "grid", level: 1 });
      } else if (open[lid].category === "dot_count_confusion") {
        plan.push({ letterId: lid, taskType: "trait", level: 1 });
      } else if (open[lid].category === "dot_position_confusion") {
        plan.push({ letterId: lid, taskType: lid === "alif" ? "grid" : "dots", level: 1 });
      }
    }
    plan = plan.slice(0, 4);
    var q = buildQueue(plan, "today");
    for (i = 0; i < q.length; i++) q[i].diagnose = plan[i].diagnose || null;
    return q;
  }

  function buildNextdayQueue() {
    var rank = { not_yet: 0, wobbly: 1, today_secure: 2, overnight_secure: 3 };
    refreshLetterStates("today");
    var order = TARGETS.slice().sort(function (a, b) {
      return (rank[letters[a].status] || 0) - (rank[letters[b].status] || 0);
    });
    /* Zwei unterschiedliche Aufgabenformen pro Zeichen, verschraenkt, damit
       kein Zeichen zweimal hintereinander drankommt. Maximal 8 Items. */
    var flashes = [];
    var productive = [];
    for (var i = 0; i < order.length; i++) {
      var lid = order[i];
      flashes.push({ letterId: lid, taskType: "flash", level: 2 });
      productive.push({ letterId: lid, taskType: lid === "alif" ? "grid" : "dots", level: 2 });
    }
    var plan = [];
    for (var j = 0; j < order.length; j++) {
      plan.push(flashes[j]);
      if (j > 0) plan.push(productive[j - 1]);
    }
    plan.push(productive[order.length - 1]);
    return buildQueue(plan.slice(0, 8), "nextday");
  }

  /* ======================================================================
     7. ANTWORTEN
     ====================================================================== */

  function attemptNoFor(item) {
    var n = 0;
    for (var i = 0; i < state.answers.length; i++) {
      var a = state.answers[i];
      if (a.scope === item.scope && a.letterId === item.letterId && a.taskType === item.taskType) n++;
    }
    return n + 1;
  }

  function recordAnswer(item, picked, correct) {
    var attemptNo = attemptNoFor(item);
    var answer = {
      qid: item.qid,
      letterId: item.letterId,
      taskType: item.taskType,
      level: item.level,
      picked: picked,
      correct: !!correct,
      firstTry: attemptNo === 1,
      attemptNo: attemptNo,
      ts: Date.now(),
      scope: item.scope,
      pickKind: item.pickKind
    };
    var cls = classifyError({
      letterId: item.letterId,
      taskType: item.taskType,
      pickKind: item.pickKind,
      picked: picked,
      correct: !!correct
    });
    answer.category = cls.category;
    answer.needsDiagnosis = cls.needsDiagnosis;
    if (cls.nameMiss) answer.nameMiss = true;
    state.answers.push(answer);
    if (cls.category) state.errors.push({ qid: item.qid, letterId: item.letterId, category: cls.category });

    /* Diagnose aufloesen: die Positionsfrage schliesst das Anzahl-/Positions-
       Paar ab und ordnet den urspruenglich unbestimmten Fehler zu. */
    if (item.diagnose === "position") {
      var countOk = true;
      for (var i = state.answers.length - 1; i >= 0; i--) {
        if (state.answers[i].letterId === item.letterId && state.answers[i].diagnoseRole === "count") {
          countOk = state.answers[i].correct;
          break;
        }
      }
      var resolved = resolveDiagnosis(countOk);
      assignDiagnosis(item.letterId, resolved);
    }
    if (item.diagnose === "count") answer.diagnoseRole = "count";
    return answer;
  }

  function assignDiagnosis(letterId, category) {
    for (var i = 0; i < state.answers.length; i++) {
      var a = state.answers[i];
      if (a.letterId === letterId && a.needsDiagnosis && !a.category) {
        a.category = category;
        a.needsDiagnosis = false;
        state.errors.push({ qid: a.qid, letterId: letterId, category: category });
      }
    }
    if (state.session.diagnosisDone.indexOf(letterId) === -1) state.session.diagnosisDone.push(letterId);
  }

  /* ======================================================================
     8. VIEW: VORCHECK
     ====================================================================== */

  var PRECHECK_PLAN = ["ba", "alif", "ta"];

  function renderPrecheck() {
    var s = state.session;
    var running = s.stage === "precheck";
    $("precheck-intro").hidden = running;
    $("precheck-task").hidden = !running;
    $("btn-precheck-start").hidden = running || s.stage !== "intro";
    $("btn-restart-lesson").hidden = s.stage === "intro" || running;

    var offerVisible = renderNextdayOffer();
    renderStorageWarning();
    /* Genau ein primaerer CTA pro Zustand: liegt ein Folgetagsblock an, ist er
       die Hauptaktion und der Lektionsstart tritt zurueck. */
    var startBtn = $("btn-precheck-start");
    startBtn.className = "btn " + (offerVisible ? "btn-secondary" : "btn-primary");

    /* Nach abgeschlossener Lektion beschreibt der Einstiegstext nicht mehr
       einen Vorcheck, der bereits stattgefunden hat. */
    var lessonDone = s.stage !== "intro" && s.stage !== "precheck";
    $("precheck-introtext").textContent = t(lessonDone ? "precheck.doneText" : "precheck.introText");
    $("precheck-introhint").hidden = lessonDone;

    if (!running) return;

    var item = s.queue[s.index];
    if (!item) { finishPrecheck(); return; }
    setMeter($("precheck-fill"), $("precheck-count"), s.index + 1, s.queue.length);
    setArabicText($("precheck-char"), GLYPHS[item.letterId].char);

    var row = $("precheck-choices");
    clear(row);
    var opts = item.options;
    for (var i = 0; i < opts.length; i++) {
      row.appendChild(precheckButton(item, opts[i]));
    }
    focusEl($("precheck-task").querySelector("h2"));
  }

  function precheckButton(item, value) {
    var btn = document.createElement("button");
    btn.className = "choice choice-text";
    btn.type = "button";
    btn.textContent = value === "other" ? t("precheck.other") : t("name." + value);
    btn.addEventListener("click", function () { answerPrecheck(item, value); });
    return btn;
  }

  function startPrecheck() {
    var plan = [];
    for (var i = 0; i < PRECHECK_PLAN.length; i++) {
      plan.push({ letterId: PRECHECK_PLAN[i], taskType: "name", level: 1 });
    }
    var q = buildQueue(plan, "today");
    for (var j = 0; j < q.length; j++) {
      q[j].options = shuffle(["alif", "ba", "ta", "other"]);
      q[j].pickKind = "name";
    }
    state.session = { stage: "precheck", index: 0, queue: q, stageStep: 0, pending: null, diagnosisDone: [] };
    state.precheck = [];
    state.answers = [];
    state.errors = [];
    persistState();
    renderPrecheck();
  }

  /* Kein Richtig-/Falsch-Feedback im Vorcheck. Die Antwort wird gespeichert. */
  function answerPrecheck(item, value) {
    state.precheck.push({ letterId: item.letterId, answered: value !== "unknown", picked: value });
    state.answers.push({
      qid: item.qid, letterId: item.letterId, taskType: "name", level: item.level,
      picked: value, correct: value === item.letterId, firstTry: true, attemptNo: 1,
      ts: Date.now(), scope: "today", pickKind: "name",
      category: null, needsDiagnosis: false, nameMiss: value !== item.letterId
    });
    state.session.index++;
    persistState();
    if (state.session.index >= state.session.queue.length) finishPrecheck();
    else renderPrecheck();
  }

  function finishPrecheck() {
    state.session = { stage: "stage", index: 0, queue: [], stageStep: 0, pending: null, diagnosisDone: [] };
    persistState();
    showView("stage");
    renderStage();
  }

  /* ======================================================================
     9. VIEW: LERNBUEHNE
     ====================================================================== */

  function renderStage() {
    var step = STAGE_STEPS[state.session.stageStep];
    if (!step) { startPractice(); return; }

    setMeter($("stage-fill"), $("stage-count"), state.session.stageStep + 1, STAGE_STEPS.length);

    var charEl = $("stage-char");
    clear(charEl);
    charEl.removeAttribute("dir");
    /* Punktplatzierung zeigt das Zielzeichen bewusst NICHT – sonst waere die
       Aufgabe Abschreiben statt Erzeugen. Die Buehne schrumpft dann auf den
       Regeltext. */
    charEl.hidden = !step.chars;
    $("stage-area").classList.toggle("stage-compact", !step.chars);
    if (step.chars && step.chars.length === 1) {
      setArabicText(charEl, step.chars[0]);
    } else if (step.chars) {
      for (var i = 0; i < step.chars.length; i++) {
        charEl.appendChild(arabicSpan(step.chars[i], "glyph-pair"));
        if (i < step.chars.length - 1) charEl.appendChild(document.createTextNode(" "));
      }
    }
    $("stage-caption").textContent = t(step.caption);

    var act = $("view-stage").querySelector(".act");
    var next = $("btn-stage-next");
    hideFeedback($("stage-feedback"));
    clear($("stage-action"));

    if (step.kind === "action") {
      act.hidden = false;
      $("stage-act-label").textContent = t("stage.actLabel");
      next.hidden = true;
      if (step.action === "observe") renderStageObserve();
      else renderStageDots(step);
      focusEl($("stage-prompt"));
      return;
    }

    act.hidden = true;
    next.hidden = false;
    next.textContent = t("common.next");
    next.disabled = false;
    focusEl($("stage-caption"));
    /* Die ms-Werte der Passivszenen sind eine OBERGRENZE fuer die
       Betrachtungszeit, kein erzwungenes Warten: der Weiter-Button bleibt
       jederzeit bedienbar. Ein fuer Sekunden deaktivierter primaerer CTA
       waere eine Sackgasse, und ein Zwang zum Zuschauen widerspraeche der
       Vorgabe frueher Interaktion. Damit gilt derselbe Ablauf mit und ohne
       prefers-reduced-motion. */
  }

  function renderStageObserve() {
    $("stage-prompt").textContent = t("stage.a1prompt");
    var wrap = $("stage-action");
    var row = document.createElement("div");
    row.className = "choices choices-text";
    var opts = shuffle(["none", "one", "two"]);
    opts.forEach(function (key) {
      var b = document.createElement("button");
      b.className = "choice choice-text";
      b.type = "button";
      b.textContent = t("stage.a1" + key);
      b.addEventListener("click", function () {
        var ok = key === "none";
        b.classList.add(ok ? "is-correct" : "is-wrong");
        setFeedback($("stage-feedback"), ok ? "ok" : "attn",
          t(ok ? "stage.observeOk" : "stage.observeWrong"), {});
        var next = $("btn-stage-next");
        next.hidden = false;
        next.disabled = false;
        next.textContent = t("common.next");
      });
      row.appendChild(b);
    });
    wrap.appendChild(row);
  }

  function renderStageDots(step) {
    $("stage-prompt").textContent = t(step.letterId === "ba" ? "stage.a2prompt" : "stage.a3prompt");
    var item = { letterId: step.letterId, taskType: "dots", pickKind: "trait", scope: "stage", level: 1 };
    /* Buehnenhandlungen zaehlen ausdruecklich nicht ins Ergebnis. */
    var cb = function (code, ok) {
      var g = GLYPHS[step.letterId];
      if (ok) {
        setFeedback($("stage-feedback"), "ok", t("fb.dotsOk"), { char: g.char, desc: t("desc." + step.letterId) });
      } else {
        var cls = classifySinglePick(step.letterId, "trait", code);
        setFeedback($("stage-feedback"), "attn", feedbackTemplate(cls), {
          char: g.char, desc: t("desc." + step.letterId)
        });
      }
      var next = $("btn-stage-next");
      next.hidden = false;
      next.disabled = false;
      next.textContent = t("common.next");
    };
    cb.hint = function () {
      setFeedback($("stage-feedback"), "", t("practice.pickCountFirst"), {});
    };
    $("stage-action").appendChild(buildDotsBoard(item, cb));
  }

  function advanceStage() {
    state.session.stageStep++;
    persistState();
    if (state.session.stageStep >= STAGE_STEPS.length) startPractice();
    else renderStage();
  }

  /* ======================================================================
     10. AUFGABENFORMEN (gemeinsame Komponenten)
     ====================================================================== */

  function feedbackTemplate(cls) {
    if (cls.category === "shape_confusion") return t("fb.shape");
    if (cls.category === "dot_count_confusion") return t("fb.count");
    if (cls.category === "dot_position_confusion") return t("fb.position");
    return t("fb.mixed");
  }

  /* A. Verdeckter Abruf */
  function renderFlash(item, ui, onAnswer, revealNow) {
    clearTimeout(flashTimer);

    function reveal() {
      ui.prompt.textContent = t("practice.prompt.flash");
      clear(ui.task);
      ui.task.appendChild(buildChoiceRow(item, onAnswer));
      ui.action.hidden = true;
    }

    /* Nach einem Reload direkt nach der Antwort darf das Zeichen nicht erneut
       gezeigt werden – der Abruf hat bereits stattgefunden. */
    if (revealNow) { reveal(); return; }

    ui.prompt.textContent = t("practice.prompt.flashWatch");
    clear(ui.task);
    var stage = document.createElement("div");
    stage.className = "stage";
    var glyph = document.createElement("div");
    glyph.className = "glyph-xl arabic";
    setArabicText(glyph, GLYPHS[item.letterId].char);
    stage.appendChild(glyph);
    ui.task.appendChild(stage);

    if (reducedMotion) {
      /* Kein Timerzwang: das Zeichen darf nicht ungesehen verschwinden. */
      ui.action.hidden = false;
      ui.action.disabled = false;
      ui.action.textContent = t("common.next");
      ui.action.onclick = reveal;
    } else {
      ui.action.hidden = true;
      flashTimer = setTimeout(reveal, 1100);
    }
  }

  function buildChoiceRow(item, onAnswer) {
    var row = document.createElement("div");
    row.className = "choices";
    item.options.forEach(function (gid) {
      var b = document.createElement("button");
      b.className = "choice";
      b.type = "button";
      b.setAttribute("data-glyph", gid);
      var span = arabicSpan(GLYPHS[gid].char, "choice-char");
      b.appendChild(span);
      b.addEventListener("click", function () {
        onAnswer(gid, gid === item.letterId, row);
      });
      row.appendChild(b);
    });
    return row;
  }

  /* B. Rasterfund */
  function renderGrid(item, ui, onAnswer) {
    ui.prompt.textContent = "";
    renderSentence(ui.prompt, t("practice.prompt.grid"), { char: GLYPHS[item.letterId].char });
    clear(ui.task);
    var grid = document.createElement("div");
    grid.className = "grid9";
    var marked = [];
    item.cells.forEach(function (gid, idx) {
      var b = document.createElement("button");
      b.className = "grid-cell arabic";
      b.type = "button";
      b.setAttribute("aria-pressed", "false");
      b.setAttribute("data-idx", String(idx));
      setArabicText(b, GLYPHS[gid].char);
      b.addEventListener("click", function () {
        var on = b.getAttribute("aria-pressed") === "true";
        b.setAttribute("aria-pressed", on ? "false" : "true");
        var p = marked.indexOf(idx);
        if (on && p !== -1) marked.splice(p, 1);
        if (!on && p === -1) marked.push(idx);
      });
      grid.appendChild(b);
    });
    ui.task.appendChild(grid);

    ui.action.hidden = false;
    ui.action.disabled = false;
    ui.action.textContent = t("practice.gridConfirm");
    ui.action.onclick = function () {
      if (!marked.length) {
        setFeedback(ui.feedback, "", t("practice.markNone"), {});
        return;
      }
      var pickedChars = marked.slice().sort(function (a, b) { return a - b; })
        .map(function (i) { return item.cells[i]; });
      var targetIdx = [];
      item.cells.forEach(function (gid, i) { if (gid === item.letterId) targetIdx.push(i); });
      var ok = marked.length === targetIdx.length &&
        targetIdx.every(function (i) { return marked.indexOf(i) !== -1; });
      onAnswer(pickedChars, ok, grid, { marked: marked, targetIdx: targetIdx });
    };
  }

  /* C. Punktplatzierung – ohne Drag-and-Drop, feste Positionen. */
  function buildDotsBoard(item, onAnswer) {
    var wrap = document.createElement("div");
    var count = null;

    var tokenRow = document.createElement("div");
    tokenRow.className = "token-row";
    [1, 2].forEach(function (n) {
      var b = document.createElement("button");
      b.className = "token";
      b.type = "button";
      b.setAttribute("aria-pressed", "false");
      b.appendChild(document.createTextNode(t(n === 1 ? "practice.dotsOne" : "practice.dotsTwo")));
      b.appendChild(dotMark(n));
      b.addEventListener("click", function () {
        count = n;
        var all = tokenRow.querySelectorAll(".token");
        for (var i = 0; i < all.length; i++) all[i].setAttribute("aria-pressed", "false");
        b.setAttribute("aria-pressed", "true");
      });
      tokenRow.appendChild(b);
    });
    wrap.appendChild(tokenRow);

    var board = document.createElement("div");
    board.className = "dots-board";
    /* Die gesetzten Punkte erscheinen unmittelbar an der Grundform, nicht nur
       im Slot-Button: die Lernende soll das Zeichen sehen, das sie erzeugt
       hat, nicht nur ihre Regelauswahl bestaetigt bekommen. */
    var markAbove = document.createElement("div");
    markAbove.className = "dots-applied";
    var markBelow = document.createElement("div");
    markBelow.className = "dots-applied";
    var above = slotButton("above");
    var base = document.createElement("div");
    base.className = "dots-base arabic";
    setArabicText(base, BOWL_BASE);
    var below = slotButton("below");
    board.appendChild(above);
    board.appendChild(markAbove);
    board.appendChild(base);
    board.appendChild(markBelow);
    board.appendChild(below);
    wrap.appendChild(board);

    function slotButton(pos) {
      var b = document.createElement("button");
      b.className = "dot-slot";
      b.type = "button";
      b.setAttribute("aria-pressed", "false");
      b.setAttribute("data-pos", pos);
      b.textContent = t(pos === "above" ? "practice.slotAbove" : "practice.slotBelow");
      b.addEventListener("click", function () {
        if (!count) {
          b.setAttribute("aria-pressed", "false");
          if (typeof onAnswer.hint === "function") onAnswer.hint();
          else wrap.dispatchEvent(new CustomEvent("needcount", { bubbles: true }));
          return;
        }
        var code = count + "-" + pos;
        b.setAttribute("aria-pressed", "true");
        clear(b);
        b.appendChild(document.createTextNode(t(pos === "above" ? "practice.slotAbove" : "practice.slotBelow") + " "));
        b.appendChild(dotMark(count));
        (pos === "above" ? markAbove : markBelow).appendChild(dotMark(count));
        var ok = code === traitCodeOf(item.letterId);
        b.classList.add(ok ? "is-correct" : "is-wrong");
        var slots = board.querySelectorAll(".dot-slot");
        for (var i = 0; i < slots.length; i++) slots[i].disabled = true;
        var tokens = tokenRow.querySelectorAll(".token");
        for (var j = 0; j < tokens.length; j++) tokens[j].disabled = true;
        onAnswer(code, ok, board);
      });
      return b;
    }

    return wrap;
  }

  function dotMark(n) {
    var m = document.createElement("span");
    m.className = "dot-mark";
    for (var i = 0; i < n; i++) m.appendChild(document.createElement("span"));
    return m;
  }

  function renderDots(item, ui, onAnswer) {
    /* Bewusst der Name statt der Glyphe: das Zielzeichen zeigt seine Punkte,
       waere in der Frage also die Antwort. Die Punktplatzierung soll erzeugen,
       nicht abschreiben lassen. */
    ui.prompt.textContent = fill(t("practice.prompt.dots"), { name: t("name." + item.letterId) });
    clear(ui.task);
    var cb = function (code, ok, board) { onAnswer(code, ok, board); };
    cb.hint = function () { setFeedback(ui.feedback, "", t("practice.pickCountFirst"), {}); };
    ui.task.appendChild(buildDotsBoard(item, cb));
    ui.action.hidden = true;
  }

  /* D. Merkmalsfrage */
  function renderTrait(item, ui, onAnswer) {
    ui.prompt.textContent = "";
    renderSentence(ui.prompt, t("practice.prompt.trait"), { char: GLYPHS[item.letterId].char });
    clear(ui.task);
    var stage = document.createElement("div");
    stage.className = "stage";
    var glyph = document.createElement("div");
    glyph.className = "glyph-xl arabic";
    setArabicText(glyph, GLYPHS[item.letterId].char);
    stage.appendChild(glyph);
    ui.task.appendChild(stage);

    var row = document.createElement("div");
    row.className = "choices choices-text";
    var correct = traitCodeOf(item.letterId);
    item.options.forEach(function (code) {
      var b = document.createElement("button");
      b.className = "choice choice-text";
      b.type = "button";
      b.setAttribute("data-code", code);
      b.textContent = t("trait." + code);
      b.addEventListener("click", function () { onAnswer(code, code === correct, row); });
      row.appendChild(b);
    });
    ui.task.appendChild(row);
    ui.action.hidden = true;
  }

  /* ======================================================================
     11. VIEW: UEBUNG (Modi practice / diagnosis / final) und FOLGETAG
     ====================================================================== */

  function practiceUi() {
    return {
      prompt: $("practice-prompt"), task: $("practice-task"),
      feedback: $("practice-feedback"), action: $("btn-practice-action"),
      fill: $("practice-fill"), count: $("practice-count")
    };
  }

  function nextdayUi() {
    return {
      prompt: $("nextday-prompt"), task: $("nextday-task"),
      feedback: $("nextday-feedback"), action: $("btn-nextday-action"),
      fill: $("nextday-fill"), count: $("nextday-count")
    };
  }

  function startPractice() {
    state.session = {
      stage: "practice", index: 0, queue: buildQueue(PRACTICE_PLAN, "today"),
      stageStep: STAGE_STEPS.length, pending: null,
      diagnosisDone: state.session.diagnosisDone || []
    };
    persistState();
    showView("practice");
    renderItemView();
  }

  function renderItemView() {
    var s = state.session;
    var isNextday = s.stage === "nextday";
    var ui = isNextday ? nextdayUi() : practiceUi();
    if (!isNextday) $("practice-mode-label").textContent = t("practice.mode." + (s.stage === "final" ? "final" : s.stage === "diagnosis" ? "diagnosis" : "practice"));

    var item = s.queue[s.index];
    if (!item) { advanceStageFlow(); return; }
    setMeter(ui.fill, ui.count, s.index + 1, s.queue.length);
    hideFeedback(ui.feedback);
    ui.action.onclick = null;

    if (s.stage === "diagnosis" && s.index === 0) {
      setFeedback(ui.feedback, "", t("fb.diagnosisIntro"), {});
    }

    var handler = function (picked, ok, container, extra) {
      onItemAnswer(item, picked, ok, container, ui, extra);
    };
    var answered = !!(s.pending && s.pending.qid === item.qid);

    if (item.taskType === "flash") renderFlash(item, ui, handler, answered);
    else if (item.taskType === "grid") renderGrid(item, ui, handler);
    else if (item.taskType === "dots") renderDots(item, ui, handler);
    else renderTrait(item, ui, handler);

    /* Nach einem Reload direkt nach dem Antworten: beantworteten Zustand
       wiederherstellen, damit die Runde nicht blockiert. */
    if (answered) restorePending(item, ui);
    else focusEl(ui.prompt);
  }

  function restorePending(item, ui) {
    var p = state.session.pending;
    disableTask(ui.task);
    setFeedback(ui.feedback, p.correct ? "ok" : "attn", p.template, p.params || {});
    ui.action.hidden = false;
    ui.action.disabled = false;
    ui.action.textContent = t("common.next");
    ui.action.onclick = nextItem;
  }

  function disableTask(taskEl) {
    var btns = taskEl.querySelectorAll("button");
    for (var i = 0; i < btns.length; i++) btns[i].disabled = true;
  }

  function onItemAnswer(item, picked, ok, container, ui, extra) {
    if (state.session.pending && state.session.pending.qid === item.qid) return;
    recordAnswer(item, picked, ok);

    var g = GLYPHS[item.letterId];
    var desc = t("desc." + item.letterId);
    var template;
    var params = { char: g.char, desc: desc };

    if (item.taskType === "grid") {
      markGridResult(container, item, extra);
      if (ok) {
        template = t("fb.gridOk");
      } else {
        var wrongMarks = extra.marked.filter(function (i) { return item.cells[i] !== item.letterId; });
        if (wrongMarks.length) {
          template = t("fb.gridWrong");
          params.list = wrongMarks.map(function (i) { return t("trait." + traitCodeOf(item.cells[i])); }).join(", ");
        } else {
          template = t("fb.gridMissed");
          params.n = extra.targetIdx.length - extra.marked.length;
        }
      }
    } else if (ok) {
      template = item.taskType === "dots" ? t("fb.dotsOk") : t("fb.correct");
      markChoice(container, item, picked, true);
    } else {
      var cls = classifySinglePick(item.letterId, item.pickKind, picked);
      var pickedGlyph = item.pickKind === "glyph" ? glyphOf(picked) : null;
      if (pickedGlyph && !pickedGlyph.taught) template = t("fb.untrained");
      else template = feedbackTemplate(cls);
      markChoice(container, item, picked, false);
    }

    setFeedback(ui.feedback, ok ? "ok" : "attn", template, params);
    disableTask(ui.task);
    if (!ok && !reducedMotion && container) container.classList.add("shake");

    state.session.pending = { qid: item.qid, correct: ok, template: template, params: params };
    persistState();

    ui.action.hidden = false;
    ui.action.disabled = false;
    ui.action.textContent = t("common.next");
    ui.action.onclick = nextItem;
  }

  function markChoice(container, item, picked, ok) {
    if (!container) return;
    var btns = container.querySelectorAll("button");
    for (var i = 0; i < btns.length; i++) {
      var b = btns[i];
      var val = b.getAttribute("data-glyph") || b.getAttribute("data-code");
      if (!val) continue;
      var isCorrectOption = item.pickKind === "glyph" ? val === item.letterId : val === traitCodeOf(item.letterId);
      if (isCorrectOption) { b.classList.add("is-correct"); appendMark(b, t("mark.correct")); }
      else if (val === picked && !ok) { b.classList.add("is-wrong"); appendMark(b, t("mark.wrong")); }
    }
  }

  function appendMark(btn, text) {
    var s = document.createElement("span");
    s.className = "choice-mark";
    s.textContent = text;
    btn.appendChild(s);
  }

  /* Jede Fehlmarkierung wird einzeln gezeigt, nicht nur eine Gesamtzahl.
     Der Zustand steht zusaetzlich als Text im Element – CSS-content ist fuer
     Screenreader nicht verlaesslich, und Farbe allein reicht ohnehin nicht. */
  function markGridResult(grid, item, extra) {
    var cells = grid.querySelectorAll(".grid-cell");
    for (var i = 0; i < cells.length; i++) {
      var isTarget = item.cells[i] === item.letterId;
      var isMarked = extra.marked.indexOf(i) !== -1;
      var label = null;
      if (isMarked && isTarget) { cells[i].classList.add("is-correct"); label = "mark.correct"; }
      else if (isMarked && !isTarget) { cells[i].classList.add("is-wrong"); label = "mark.wrong"; }
      else if (!isMarked && isTarget) { cells[i].classList.add("is-missed"); label = "mark.missed"; }
      if (label) {
        var sr = document.createElement("span");
        sr.className = "sr-only";
        sr.textContent = " " + t(label);
        cells[i].appendChild(sr);
      }
    }
  }

  function nextItem() {
    state.session.pending = null;
    state.session.index++;
    persistState();
    if (state.session.index >= state.session.queue.length) advanceStageFlow();
    else renderItemView();
  }

  function advanceStageFlow() {
    var s = state.session;
    if (s.stage === "practice") {
      var dq = buildDiagnosisQueue();
      if (dq.length) {
        state.session = { stage: "diagnosis", index: 0, queue: dq, stageStep: s.stageStep, pending: null, diagnosisDone: s.diagnosisDone };
      } else {
        state.session = { stage: "final", index: 0, queue: buildQueue(FINAL_PLAN, "today"), stageStep: s.stageStep, pending: null, diagnosisDone: s.diagnosisDone };
      }
      persistState();
      renderItemView();
      return;
    }
    if (s.stage === "diagnosis") {
      state.session = { stage: "final", index: 0, queue: buildQueue(FINAL_PLAN, "today"), stageStep: s.stageStep, pending: null, diagnosisDone: s.diagnosisDone };
      persistState();
      renderItemView();
      return;
    }
    if (s.stage === "final") {
      finishLesson();
      return;
    }
    if (s.stage === "nextday") {
      finishNextday();
      return;
    }
    /* Waechter: kein gueltiger Aufgabenzustand -> zurueck auf die Einstiegsview
       statt eines leeren Screens. */
    showView("precheck");
    renderPrecheck();
  }

  function finishLesson() {
    state.dueDate = nextDueDate(todayLocal());
    state.session.stage = "result";
    state.session.queue = [];
    state.session.index = 0;
    state.session.pending = null;
    persistState();
    showView("result");
    renderResult("today");
  }

  function startNextday() {
    state.session = {
      stage: "nextday", index: 0, queue: buildNextdayQueue(),
      stageStep: STAGE_STEPS.length, pending: null, diagnosisDone: []
    };
    /* Antworten der Folgepruefung werden im scope 'nextday' gefuehrt und
       vermischen sich nie mit dem Tagesergebnis. */
    persistState();
    showView("nextday");
    renderItemView();
  }

  function finishNextday() {
    state.nextdayDoneDate = todayLocal();
    /* Abstand festhalten, bevor dueDate entfaellt: nur bei genau einem Tag
       Abstand ist die Formulierung "nach einer Nacht" ehrlich. */
    state.nextdayGapDays = state.dueDate ? daysBetween(state.dueDate, state.nextdayDoneDate) : null;
    state.dueDate = null;               /* genau ein Wiederholungsblock */
    state.session.stage = "resultNextday";
    state.session.queue = [];
    state.session.index = 0;
    state.session.pending = null;
    persistState();
    showView("result");
    renderResult("nextday");
  }

  /* ======================================================================
     12. VIEW: ERGEBNIS
     ====================================================================== */

  function renderResult(scope) {
    refreshLetterStates(scope);
    var isNextday = scope === "nextday";
    var passed = !isNextday && letters.ba.status === "today_secure" && letters.ta.status === "today_secure";

    $("result-title").textContent = isNextday ? t("nextday.resultTitle") : (passed ? t("result.passed") : t("result.notPassed"));
    $("result-lead").textContent = isNextday ? "" : (passed ? t("result.leadPassed") : t("result.leadNotPassed"));
    $("result-lead").hidden = isNextday;

    var list = $("result-list");
    clear(list);
    /* Der Erklaersatz steht nur einmal je Zustand. Dreimal wortgleich
       untereinander liest sich wie eine unbefuellte Vorlage. */
    var explained = [];
    for (var i = 0; i < TARGETS.length; i++) {
      var ls = letters[TARGETS[i]];
      var withText = explained.indexOf(ls.status) === -1;
      if (withText) explained.push(ls.status);
      list.appendChild(resultCard(ls, scope, withText));
    }

    renderErrorSummary(scope);

    /* Ausgangsstand aus dem Vorcheck als Anhaltspunkt – ausdruecklich nicht
       als validierte Vorher-/Nachher-Messung dargestellt. */
    var pc = $("result-precheck");
    if (isNextday || !state.precheck.length) {
      pc.hidden = true;
    } else {
      var named = 0;
      for (var p = 0; p < state.precheck.length; p++) {
        if (state.precheck[p].picked === state.precheck[p].letterId) named++;
      }
      pc.hidden = false;
      pc.textContent = fill(t("precheck.compare"), { n: named, total: state.precheck.length });
    }

    var nd = $("result-nextday");
    if (isNextday) {
      nd.textContent = t("result.nextdayDone");
    } else if (!storageOk) {
      nd.textContent = t("result.nextdayNoStorage");
    } else {
      nd.textContent = fill(t("result.nextday"), { date: formatDate(state.dueDate) });
    }
  }

  function resultCard(ls, scope, withText) {
    var card = document.createElement("div");
    card.className = "result-item";
    card.setAttribute("data-status", ls.status);

    var head = document.createElement("div");
    head.className = "result-head";
    head.appendChild(arabicSpan(GLYPHS[ls.letterId].char, "result-char"));
    var st = document.createElement("span");
    st.className = "result-status";
    /* Zeichen und Zustand in einer Zeile, ohne dass der Erklaersatz den
       Zustand ein zweites Mal wiederholt. */
    st.textContent = t("status." + ls.status);
    head.appendChild(st);
    card.appendChild(head);

    if (!withText) return card;

    var p = document.createElement("p");
    p.className = "muted-text";
    var sentence = progressSentence(ls, settings.lang);
    if (ls.status === "overnight_secure" && scope === "nextday" && state.nextdayGapDays > 0) {
      sentence = t("progress.overnight_secure_later");
    }
    p.textContent = sentence;
    card.appendChild(p);
    return card;
  }

  function renderErrorSummary(scope) {
    var counts = { shape_confusion: 0, dot_count_confusion: 0, dot_position_confusion: 0, unresolved: 0 };
    var any = false;
    for (var i = 0; i < state.answers.length; i++) {
      var a = state.answers[i];
      if (a.scope !== scope || a.correct || a.taskType === "name") continue;
      /* Die Diagnose ist auf wenige Items begrenzt. Was danach mehrdeutig
         bleibt, wird ausgewiesen statt in eine Kategorie geraten. */
      if (a.category) counts[a.category]++;
      else counts.unresolved++;
      any = true;
    }
    var el = $("result-errors");
    if (!any) { el.textContent = t("result.errNone"); return; }
    var parts = [];
    for (var k in counts) {
      if (Object.prototype.hasOwnProperty.call(counts, k) && counts[k] > 0) {
        parts.push(fill(t("result.err." + k), { n: counts[k] }));
      }
    }
    el.textContent = t("result.errorsTitle") + " " + parts.join(" · ");
  }

  /* ======================================================================
     13. FOLGETAGS-ANGEBOT UND HINWEISE
     ====================================================================== */

  function renderNextdayOffer() {
    var today = todayLocal();
    var due = !!state.dueDate && isDue(state.dueDate, today) && state.nextdayDoneDate !== today;
    $("nextday-offer").hidden = !due;
    return due;
  }

  function renderStorageWarning() {
    $("storage-warning").hidden = storageOk;
  }

  /* ======================================================================
     14. EINSTELLUNGEN
     ====================================================================== */

  function applyI18n() {
    document.documentElement.lang = settings.lang;
    var nodes = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < nodes.length; i++) {
      var key = nodes[i].getAttribute("data-i18n");
      var attr = nodes[i].getAttribute("data-i18n-attr");
      if (attr) nodes[i].setAttribute(attr, t(key));
      else nodes[i].textContent = t(key);
    }
    rerenderActive();
  }

  function rerenderActive() {
    var s = state.session;
    if ($("view-precheck").classList.contains("active")) renderPrecheck();
    else if ($("view-stage").classList.contains("active")) renderStage();
    else if ($("view-result").classList.contains("active")) renderResult(s.stage === "resultNextday" ? "nextday" : "today");
    else if ($("view-practice").classList.contains("active") || $("view-nextday").classList.contains("active")) renderItemView();
  }

  function applyTheme() {
    if (settings.theme === "system") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", settings.theme);
    var btns = document.querySelectorAll("#seg-theme [data-theme-choice]");
    for (var i = 0; i < btns.length; i++) {
      btns[i].setAttribute("aria-pressed", btns[i].getAttribute("data-theme-choice") === settings.theme ? "true" : "false");
    }
  }

  function applyLangSelector() {
    var btns = document.querySelectorAll("#seg-lang [data-lang]");
    for (var i = 0; i < btns.length; i++) {
      btns[i].setAttribute("aria-pressed", btns[i].getAttribute("data-lang") === settings.lang ? "true" : "false");
    }
  }

  function clearAllLocalData() {
    if (!window.confirm(t("notice.clearConfirm"))) return;
    try {
      localStorage.removeItem(STATE_KEY);
      localStorage.removeItem(SETTINGS_KEY);
    } catch (e) {}
    state = emptyState();
    showView("precheck");
    renderPrecheck();
  }

  /* ======================================================================
     15. START
     ====================================================================== */

  function restoreView() {
    var s = state.session;
    if (s.stage === "stage") { showView("stage"); renderStage(); return; }
    if (s.stage === "practice" || s.stage === "diagnosis" || s.stage === "final") {
      showView("practice"); renderItemView(); return;
    }
    if (s.stage === "nextday") { showView("nextday"); renderItemView(); return; }
    if (s.stage === "result") { showView("result"); renderResult("today"); return; }
    if (s.stage === "resultNextday") { showView("result"); renderResult("nextday"); return; }
    showView("precheck");
    renderPrecheck();
  }

  function wire() {
    $("btn-precheck-start").addEventListener("click", startPrecheck);
    $("btn-restart-lesson").addEventListener("click", startPrecheck);
    $("btn-precheck-unknown").addEventListener("click", function () {
      var item = state.session.queue[state.session.index];
      if (item) answerPrecheck(item, "unknown");
    });
    $("btn-stage-next").addEventListener("click", advanceStage);
    $("btn-open-nextday").addEventListener("click", startNextday);
    $("btn-result-home").addEventListener("click", function () {
      state.session.stage = "done";
      persistState();
      showView("precheck");
      renderPrecheck();
    });
    $("btn-clear-data").addEventListener("click", clearAllLocalData);

    var langBtns = document.querySelectorAll("#seg-lang [data-lang]");
    for (var i = 0; i < langBtns.length; i++) {
      langBtns[i].addEventListener("click", function (e) {
        settings.lang = e.currentTarget.getAttribute("data-lang");
        persistSettings();
        applyLangSelector();
        applyI18n();
      });
    }
    var themeBtns = document.querySelectorAll("#seg-theme [data-theme-choice]");
    for (var j = 0; j < themeBtns.length; j++) {
      themeBtns[j].addEventListener("click", function (e) {
        settings.theme = e.currentTarget.getAttribute("data-theme-choice");
        persistSettings();
        applyTheme();
      });
    }
  }

  function init() {
    if (!document.getElementById("view-precheck")) return;   /* tests.html: nur reine Funktionen */
    storageOk = probeStorage();
    loadPersisted();
    try {
      var mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      reducedMotion = mq.matches;
      if (mq.addEventListener) mq.addEventListener("change", function (e) { reducedMotion = e.matches; });
    } catch (e) { reducedMotion = false; }
    applyTheme();
    applyLangSelector();
    applyI18n();
    wire();
    restoreView();
  }

  /* Reine Funktionen fuer tests.html. Kein Zustand, kein DOM. */
  window.IqraPure = {
    GLYPHS: GLYPHS,
    TRAIT_CODES: TRAIT_CODES,
    DISTRACTORS: DISTRACTORS,
    STAGE_STEPS: STAGE_STEPS,
    PRACTICE_PLAN: PRACTICE_PLAN,
    FINAL_PLAN: FINAL_PLAN,
    I18N: I18N,
    classifyError: classifyError,
    resolveDiagnosis: resolveDiagnosis,
    computeLetterState: computeLetterState,
    isTodaySecure: isTodaySecure,
    isOvernightSecure: isOvernightSecure,
    todayLocal: todayLocal,
    nextDueDate: nextDueDate,
    isDue: isDue,
    buildDistractors: buildDistractors,
    buildTraitOptions: buildTraitOptions,
    buildGrid: buildGrid,
    traitCodeOf: traitCodeOf,
    progressSentence: progressSentence,
    migrateState: migrateState,
    emptyState: emptyState,
    normalizeSession: normalizeSession,
    SCHEMA_VERSION: SCHEMA_VERSION
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
