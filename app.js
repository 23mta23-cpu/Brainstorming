/* =========================================================================
   Iqra – Adaptiver Mikrokurs: Grundform, Punktanzahl und Punktposition
   an sechs Zeichen (ا ب ت ث ن ي) unterscheiden.

   Aufbau:
     1. Daten (Glyphen, Minimalpaare, Distraktoren, Plaene)
     2. Reine Funktionen -> window.IqraPure, von tests.html geprueft
     3. Zustand und Persistenz
     4. i18n (DE/TR)
     5. DOM-Helfer
     6. Items, Antworten, adaptive Nachuebung
     7. Rendering der sechs Hauptviews
     8. Verdrahtung

   Vanilla JS, kein Build, kein Paketmanager, keine externe Abhaengigkeit.
   Antwortzeit wird bewusst NICHT erfasst und NICHT ausgewertet.
   ========================================================================= */
(function () {
  "use strict";

  /* ======================================================================
     1. DATEN
     ====================================================================== */

  /* Merkmalsmatrix der sechs Arbeitszeichen plus zwei ungelehrter Ablenker.
     rasm = Grundformklasse fuer die Fehlerlogik.

     [S] ARBEITSHYPOTHESE, FACHLICH UNGEPRUEFT (Blocker B-3):
     ن und ي werden hier derselben Schalenklasse zugeordnet wie ب, ت und ث.
     Trifft das in der Zielschrift nicht zu, unterscheiden sich die Paare
     ب/ن und ت/ي in der isolierten Form nicht nur durch die Punktposition,
     sondern zusaetzlich durch die Kontur. Deshalb traegt jedes Minimalpaar
     unten ein Feld `soleDiff`, und die Rueckmeldung behauptet bei
     ungepruesften Paaren NICHT, die genannte Dimension sei der einzige
     Unterschied. ل und د haben eigene Klassen, damit ا -> ل als Formfehler
     faellt. */
  var GLYPHS = {
    alif: { char: "ا", dots: 0, pos: "none", rasm: "stroke", taught: true },
    ba: { char: "ب", dots: 1, pos: "below", rasm: "bowl", taught: true },
    ta: { char: "ت", dots: 2, pos: "above", rasm: "bowl", taught: true },
    tha: { char: "ث", dots: 3, pos: "above", rasm: "bowl", taught: true },
    nun: { char: "ن", dots: 1, pos: "above", rasm: "bowl", taught: true },
    ya: { char: "ي", dots: 2, pos: "below", rasm: "bowl", taught: true },
    lam: { char: "ل", dots: 0, pos: "none", rasm: "lam", taught: false },
    dal: { char: "د", dots: 0, pos: "none", rasm: "dal", taught: false }
  };

  var TARGETS = ["alif", "ba", "ta", "tha", "nun", "ya"];

  /* Minimalpaare. `dim` ist die Dimension, die die Aufgabe prueft.
     `soleDiff` sagt, ob diese Dimension nach heutigem Stand der EINZIGE
     Unterschied ist. Bei false formuliert die Rueckmeldung nur die
     Punktaussage und behauptet keine Alleinstellung. */
  var MINIMAL_PAIRS = [
    { a: "alif", b: "ba", dim: "shape", soleDiff: true },
    { a: "ba", b: "ta", dim: "both", soleDiff: true },
    { a: "ta", b: "tha", dim: "count", soleDiff: true },
    { a: "ba", b: "nun", dim: "position", soleDiff: false },
    { a: "ta", b: "ya", dim: "position", soleDiff: false },
    { a: "nun", b: "ya", dim: "both", soleDiff: false }
  ];

  /* Distraktorstufen. Laenge steuert zugleich die Optionszahl:
     Stufe 1 -> 4 Optionen, Stufe 2 -> 5, Stufe 3 -> 6.
     Stufe 1 deutliche Unterschiede, Stufe 2 gleiche Anzahl/andere Position,
     Stufe 3 gleiche Grundform mit sehr aehnlichen Punktmustern. */
  var DISTRACTORS = {
    alif: { 1: ["ba", "ta", "tha"], 2: ["ba", "nun", "ya", "ta"], 3: ["lam", "ba", "ta", "nun", "ya"] },
    ba: { 1: ["alif", "tha", "ta"], 2: ["nun", "ta", "alif", "tha"], 3: ["nun", "ta", "tha", "ya", "alif"] },
    ta: { 1: ["alif", "ba", "nun"], 2: ["ya", "ba", "alif", "tha"], 3: ["tha", "ya", "nun", "ba", "alif"] },
    tha: { 1: ["alif", "ba", "ya"], 2: ["ta", "nun", "ba", "alif"], 3: ["ta", "nun", "ya", "ba", "alif"] },
    nun: { 1: ["alif", "ta", "tha"], 2: ["ba", "ya", "alif", "ta"], 3: ["ba", "ta", "ya", "tha", "alif"] },
    ya: { 1: ["alif", "nun", "tha"], 2: ["ta", "ba", "alif", "nun"], 3: ["ta", "tha", "nun", "ba", "alif"] }
  };

  var COUNT_BUCKETS = [0, 1, 2, 3];
  var POS_BUCKETS = ["above", "below", "none"];

  /* Die sechs Aufgabenformen. Sortieren nach Anzahl und nach Position ist
     dieselbe Geste mit anderem Schluessel – fuer die Statusberechnung zaehlen
     beide zusammen als HOECHSTENS eine Form (siehe formGroup). */
  var TASK_TYPES = ["flash", "grid", "sortCount", "sortPos", "construct", "pair"];
  var PRODUCTIVE_GROUPS = ["grid", "sort", "construct"];

  /* Uebungsplan, 19 Items in drei sichtbaren Bloecken.
     Die Zeichen werden gestaffelt eingefuehrt (Block 1: ا ب ت, Block 2: + ن ي,
     Block 3: + ث und gemischt), damit nicht fuenf neue Zeichen in fuenf
     Aufgabenformen unmittelbar aufeinanderfolgen. ث erscheint erst NACH dem
     ت/ث-Minimalpaar, nie als isoliertes Erstkontakt-Item. */
  var PRACTICE_PLAN = [
    { block: 1, letterId: "ba", taskType: "flash" },
    { block: 1, letterId: "ta", taskType: "sortCount" },
    { block: 1, letterId: "alif", taskType: "grid" },
    { block: 1, letterId: "ta", taskType: "flash" },
    { block: 1, letterId: "ba", taskType: "construct" },
    { block: 1, letterId: "alif", taskType: "pair", pair: "alif-ba" },

    { block: 2, letterId: "nun", taskType: "flash" },
    { block: 2, letterId: "ta", taskType: "pair", pair: "ta-ya" },
    { block: 2, letterId: "ya", taskType: "flash" },
    { block: 2, letterId: "nun", taskType: "pair", pair: "ba-nun" },
    { block: 2, letterId: "ya", taskType: "construct" },
    { block: 2, letterId: "ba", taskType: "grid" },
    { block: 2, letterId: "nun", taskType: "sortPos" },

    { block: 3, letterId: "ta", taskType: "pair", pair: "ta-tha" },
    { block: 3, letterId: "tha", taskType: "sortCount" },
    { block: 3, letterId: "ya", taskType: "sortPos" },
    { block: 3, letterId: "tha", taskType: "flash" },
    { block: 3, letterId: "ba", taskType: "flash" },
    { block: 3, letterId: "ta", taskType: "grid" }
  ];

  /* Abschluss-Challenge: 14 Items, alle sechs Zeichen, alle drei Stufen,
     fuenf Aufgabenformen, kein Zeichen oefter als dreimal (Frequenzdeckel),
     keine unmittelbare Wiederholung, kein Feedback pro Item. */
  var CHALLENGE_PLAN = [
    { letterId: "ba", taskType: "flash", level: 1 },
    { letterId: "tha", taskType: "grid", level: 2 },
    { letterId: "ta", taskType: "construct", level: 2 },
    { letterId: "alif", taskType: "sortPos", level: 1 },
    { letterId: "ba", taskType: "pair", pair: "ba-ta", level: 3 },
    { letterId: "nun", taskType: "construct", level: 2 },
    { letterId: "ta", taskType: "flash", level: 2 },
    { letterId: "ya", taskType: "grid", level: 3 },
    { letterId: "tha", taskType: "construct", level: 3 },
    { letterId: "ba", taskType: "grid", level: 3 },
    { letterId: "alif", taskType: "flash", level: 2 },
    { letterId: "ya", taskType: "pair", pair: "nun-ya", level: 3 },
    { letterId: "nun", taskType: "flash", level: 3 },
    { letterId: "ta", taskType: "grid", level: 3 }
  ];

  /* Vorcheck: sechs Aufgaben – eine zur Grundform, zwei zur Anzahl, zwei zur
     Position, eine verdeckte Erinnerung. Reihenfolge wird gemischt. */
  var PRECHECK_PLAN = [
    { letterId: "alif", kind: "shape" },
    { letterId: "ta", kind: "count" },
    { letterId: "tha", kind: "count" },
    { letterId: "ba", kind: "position" },
    { letterId: "nun", kind: "position" },
    { letterId: "ta", kind: "recall" }
  ];

  /* Lernbuehne: drei Abschnitte, jede Erklaerung endet sofort in einer
     Handlung. Passivinhalt ist selbstgesteuert und nie laenger als eine
     kurze Szene; es gibt keinen Timerzwang. */
  var STAGE_STEPS = [
    { section: "A", kind: "explain", chars: ["ا", "ب", "ت"], caption: "stage.a.explain" },
    { section: "A", kind: "pickSet", caption: "stage.a.explain", prompt: "stage.a.prompt",
      options: ["alif", "ba", "ta", "nun"], correct: ["ba", "ta", "nun"] },

    { section: "B", kind: "explain", chars: ["ب", "ت", "ث"], caption: "stage.b.explain" },
    { section: "B", kind: "sortCount", caption: "stage.b.explain", prompt: "stage.b.prompt",
      pool: ["alif", "ba", "ta", "tha"] },
    /* Bewusst kein bestaetigender Abschluss: ب und ن landen in derselben
       Anzahlschale. Die Frage "dieselben Zeichen?" erzeugt den Bedarf fuer
       die Positionsachse, statt sie als weitere Regel nachzureichen. */
    { section: "B", kind: "confront", chars: ["ب", "ن"], caption: "stage.b.confront",
      prompt: "stage.b.confrontPrompt" },

    { section: "C", kind: "explain", chars: ["ب", "ن"], caption: "stage.c.explain" },
    { section: "C", kind: "sortPos", caption: "stage.c.explain", prompt: "stage.c.prompt",
      pool: ["alif", "ba", "ta", "nun", "ya"] },
    { section: "C", kind: "note", chars: ["ب"], caption: "stage.c.note" }
  ];

  var SETTINGS_KEY = "iqraProtoSettings";
  var STATE_KEY = "iqraProtoState";
  var SCHEMA_VERSION = 3;

  /* ======================================================================
     2. REINE FUNKTIONEN
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

  function letterByTrait(dots, pos) {
    for (var i = 0; i < TARGETS.length; i++) {
      var g = GLYPHS[TARGETS[i]];
      if (g.dots === dots && g.pos === pos) return TARGETS[i];
    }
    return null;
  }

  function parseTraitCode(code) {
    var m = /^(\d+)-(above|below|none|mixed)$/.exec(String(code));
    if (!m) return null;
    return { dots: parseInt(m[1], 10), pos: m[2] };
  }

  function pairKey(a, b) { return a < b ? a + "-" + b : b + "-" + a; }

  function findPair(a, b) {
    var key = pairKey(a, b);
    for (var i = 0; i < MINIMAL_PAIRS.length; i++) {
      if (pairKey(MINIMAL_PAIRS[i].a, MINIMAL_PAIRS[i].b) === key) return MINIMAL_PAIRS[i];
    }
    return null;
  }

  /* Sortieren nach Anzahl und nach Position ist dieselbe Geste – fuer die
     Statusberechnung zaehlen beide zusammen als hoechstens eine Form. */
  function formGroup(taskType) {
    return (taskType === "sortCount" || taskType === "sortPos") ? "sort" : taskType;
  }

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
      /* Punkte auf beiden Seiten konstruiert: die Anzahl mag stimmen, die
         Verortung nicht -> Positionsfehler. */
      if (pt.pos === "mixed") return { category: "dot_position_confusion", needsDiagnosis: false };
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

  /* classifyError(answer) -> { category, needsDiagnosis, nameMiss, confusedWith }
     confusedWith haelt das konkret verwechselte Zeichen fest, damit die
     Rueckmeldung das Paar benennen kann. */
  function classifyError(answer) {
    var none = { category: null, needsDiagnosis: false, nameMiss: false, confusedWith: null };
    if (!answer) return none;
    if (answer.taskType === "name") {
      return { category: null, needsDiagnosis: false, nameMiss: !answer.correct, confusedWith: null };
    }
    if (answer.correct) return none;

    if (Array.isArray(answer.picked)) {
      var tally = {};
      var wrongMarks = 0;
      var ambiguous = 0;
      var firstWrong = null;
      for (var i = 0; i < answer.picked.length; i++) {
        var gid = glyphIdOf(answer.picked[i]);
        if (answer.targetSet && answer.targetSet.indexOf(gid) !== -1) continue;
        if (!answer.targetSet && gid === answer.letterId) continue;
        wrongMarks++;
        if (!firstWrong) firstWrong = gid;
        var r = classifySinglePick(answer.letterId, "glyph", answer.picked[i]);
        if (r.category) tally[r.category] = (tally[r.category] || 0) + 1;
        else ambiguous++;
      }
      if (wrongMarks === 0) return { category: null, needsDiagnosis: true, nameMiss: false, confusedWith: null };
      var best = null, bestN = 0, tie = false;
      for (var c in tally) {
        if (!Object.prototype.hasOwnProperty.call(tally, c)) continue;
        if (tally[c] > bestN) { best = c; bestN = tally[c]; tie = false; }
        else if (tally[c] === bestN) tie = true;
      }
      if (!best || tie || ambiguous > bestN) {
        return { category: null, needsDiagnosis: true, nameMiss: false, confusedWith: firstWrong };
      }
      return { category: best, needsDiagnosis: false, nameMiss: false, confusedWith: firstWrong };
    }

    var res = classifySinglePick(answer.letterId, answer.pickKind, answer.picked);
    var confused = null;
    if (answer.pickKind === "glyph") confused = glyphIdOf(answer.picked);
    else {
      var p = parseTraitCode(answer.picked);
      if (p) confused = letterByTrait(p.dots, p.pos);
    }
    return {
      category: res.category, needsDiagnosis: res.needsDiagnosis,
      nameMiss: false, confusedWith: confused
    };
  }

  function resolveDiagnosis(countAnswerCorrect) {
    return countAnswerCorrect ? "dot_position_confusion" : "dot_count_confusion";
  }

  /* Welche Merkmalsachse eine Aufgabenform prueft – Grundlage fuer
     "staerkstes Merkmal" in der Ergebnisansicht. */
  function dimensionOf(item) {
    if (item.taskType === "sortCount") return "count";
    if (item.taskType === "sortPos") return "position";
    if (item.taskType === "construct") return "both";
    if (item.taskType === "grid") return item.rule ? item.rule.dim : "both";
    if (item.taskType === "pair") {
      var p = item.pairRef || (item.pair ? findPairByKey(item.pair) : null);
      return p ? p.dim : "both";
    }
    return "shape";
  }

  function findPairByKey(key) {
    var parts = String(key).split("-");
    return parts.length === 2 ? findPair(parts[0], parts[1]) : null;
  }

  function computeLetterState(answers, letterId, scope, dueDate) {
    var scoped = [], i;
    for (i = 0; i < answers.length; i++) {
      if (answers[i].scope === scope && answers[i].taskType !== "name") scoped.push(answers[i]);
    }
    var order = [];
    for (i = 0; i < scoped.length; i++) {
      if (order.indexOf(scoped[i].qid) === -1) order.push(scoped[i].qid);
    }

    var mine = [];
    for (i = 0; i < scoped.length; i++) if (scoped[i].letterId === letterId) mine.push(scoped[i]);

    var groups = [], firstPos = -1, lastPos = -1, correctCount = 0;
    var dimHits = { shape: 0, count: 0, position: 0, both: 0 };
    var confusions = {};

    for (i = 0; i < mine.length; i++) {
      var a = mine[i];
      if (a.correct) correctCount++;
      if (!a.correct && a.confusedWith) {
        confusions[a.confusedWith] = (confusions[a.confusedWith] || 0) + 1;
      }
      if (a.firstTry && a.correct) {
        var g = formGroup(a.taskType);
        if (groups.indexOf(g) === -1) groups.push(g);
        if (a.dimension) dimHits[a.dimension] = (dimHits[a.dimension] || 0) + 1;
        var pos = order.indexOf(a.qid);
        if (firstPos === -1 || pos < firstPos) firstPos = pos;
        if (pos > lastPos) lastPos = pos;
      }
    }

    var topConfusion = null, topN = 0;
    for (var c in confusions) {
      if (Object.prototype.hasOwnProperty.call(confusions, c) && confusions[c] > topN) {
        topConfusion = c; topN = confusions[c];
      }
    }
    var bestDim = null, bestDimN = 0;
    for (var d in dimHits) {
      if (Object.prototype.hasOwnProperty.call(dimHits, d) && dimHits[d] > bestDimN) {
        bestDim = d; bestDimN = dimHits[d];
      }
    }

    var ls = {
      letterId: letterId,
      scope: scope,
      firstTryForms: groups,
      itemsBetween: (firstPos === -1 || lastPos === firstPos) ? 0 : (lastPos - firstPos - 1),
      answerCount: mine.length,
      correctCount: correctCount,
      topConfusion: topConfusion,
      topConfusionCount: topN,
      strongestDimension: bestDim,
      dueDate: dueDate || null,
      status: "not_yet"
    };

    if (scope === "nextday") {
      ls.status = isOvernightSecure(ls) ? "overnight_secure" : (groups.length ? "wobbly" : "not_yet");
      return ls;
    }
    if (isTodaySecure(ls)) ls.status = "today_secure";
    else if (groups.length === 0) ls.status = "not_yet";
    else if (mine.length && correctCount * 2 < mine.length) ls.status = "not_yet";
    else ls.status = "wobbly";
    return ls;
  }

  /* [S] Produktsetzung fuer diesen Test, keine wissenschaftliche Norm.
     Sortieren zaehlt nur als EINE Form (formGroup), damit das Kriterium
     nicht rein rezeptiv erreichbar ist. */
  function isTodaySecure(ls) {
    if (!ls || !ls.firstTryForms) return false;
    if (ls.scope && ls.scope !== "today") return false;
    var f = ls.firstTryForms;
    if (f.length < 3) return false;
    if (f.indexOf("flash") === -1) return false;
    var productive = false;
    for (var i = 0; i < PRODUCTIVE_GROUPS.length; i++) {
      if (f.indexOf(PRODUCTIVE_GROUPS[i]) !== -1) productive = true;
    }
    if (!productive) return false;
    return ls.itemsBetween >= 2;
  }

  function isOvernightSecure(ls) {
    if (!ls || !ls.firstTryForms) return false;
    if (ls.scope !== "nextday") return false;
    return ls.firstTryForms.length >= 2;
  }

  function fmtLocal(x) {
    var m = x.getMonth() + 1, day = x.getDate();
    return x.getFullYear() + "-" + (m < 10 ? "0" + m : m) + "-" + (day < 10 ? "0" + day : day);
  }

  /* Lokaler Kalendertag, bewusst nicht ueber toISOString (das liefert UTC
     und abends in Mitteleuropa den Vortag). */
  function todayLocal(d) { return fmtLocal(d ? new Date(d.getTime()) : new Date()); }

  function parseLocalDate(value) {
    if (value instanceof Date) return new Date(value.getTime());
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value));
    if (!m) return null;
    return new Date(parseInt(m[1], 10), parseInt(m[2], 10) - 1, parseInt(m[3], 10));
  }

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
    var a = parseLocalDate(fromDate), b = parseLocalDate(toDate);
    if (!a || !b) return null;
    return Math.round((b.getTime() - a.getTime()) / 86400000);
  }

  function shuffle(arr, rnd) {
    var r = rnd || Math.random, a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(r() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  /* Optionszahl folgt der Stufe: 4 / 5 / 6. Zielzeichen genau einmal,
     pro Item neu gemischt, nie dasselbe Set zweimal hintereinander. */
  function buildDistractors(letterId, level, prevKey, rnd) {
    var table = DISTRACTORS[letterId] || DISTRACTORS.ba;
    var lvl = table[level] ? level : 1;
    var pool = table[lvl];
    var ids = [];
    for (var i = 0; i < pool.length; i++) {
      if (pool[i] !== letterId && ids.indexOf(pool[i]) === -1) ids.push(pool[i]);
    }
    ids.push(letterId);
    var out = shuffle(ids, rnd);
    for (var guard = 0; guard < 12 && prevKey && out.join(",") === prevKey; guard++) {
      out = shuffle(ids, rnd);
    }
    if (prevKey && out.join(",") === prevKey) out = out.slice(1).concat(out.slice(0, 1));
    return out;
  }

  /* Rasterfund arbeitet mit einer MERKMALSREGEL, nicht mit einem Einzelzeichen:
     "alle mit zwei Punkten oben" trifft mehrere Zielzeichen. */
  function gridRuleFor(letterId) {
    var g = GLYPHS[letterId];
    if (g.dots === 0) return { dim: "count", dots: 0, pos: null, key: "rule.none" };
    return { dim: "both", dots: g.dots, pos: g.pos, key: "rule." + g.dots + "-" + g.pos };
  }

  function matchesRule(letterId, rule) {
    var g = GLYPHS[letterId];
    if (rule.dots === 0) return g.dots === 0;
    if (rule.pos === null) return g.dots === rule.dots;
    return g.dots === rule.dots && g.pos === rule.pos;
  }

  /* Mindestens zwoelf Zellen, mehrere Zielzeichen, echte Unicode-Zeichen. */
  function buildGrid(letterId, level, rnd) {
    var rule = gridRuleFor(letterId);
    var hits = [], misses = [], i;
    for (i = 0; i < TARGETS.length; i++) {
      (matchesRule(TARGETS[i], rule) ? hits : misses).push(TARGETS[i]);
    }
    if (!hits.length) hits = [letterId];
    var cells = [];
    var targetCount = level >= 3 ? 4 : 3;
    for (i = 0; i < targetCount; i++) cells.push(hits[i % hits.length]);
    var k = 0;
    while (cells.length < 12) { cells.push(misses[k % misses.length]); k++; }
    return { cells: shuffle(cells, rnd), rule: rule };
  }

  function buildSortItem(taskType, level, rnd) {
    var pool = level === 1 ? ["alif", "ba", "ta"] :
      level === 2 ? ["alif", "ba", "ta", "nun", "ya"] : TARGETS.slice();
    var n = level === 1 ? 3 : level === 2 ? 4 : 5;
    return shuffle(pool, rnd).slice(0, n);
  }

  /* Adaptive Nachuebung: keine sofortige identische Wiederholung.
     (1) eine leichtere Kontrastaufgabe in ANDERER Form, mindestens zwei
     Items spaeter; (2) eine erneute Pruefung in einer DRITTEN Form, noch
     spaeter. Hoechstens zwei Einschuebe je Zeichen und Sitzung. */
  function planRemediation(queue, index, item, usedCounts) {
    var counts = usedCounts || {};
    if ((counts[item.letterId] || 0) >= 2) return { queue: queue, added: [] };

    var failedGroup = formGroup(item.taskType);
    var easier = Math.max(1, (item.level || 1) - 1);

    /* Mehrdeutiger Fehler (Anzahl UND Position weichen ab): erst eine
       Anzahlfrage, dann eine Positionsfrage. Das Ergebnis ordnet den
       urspruenglichen Fehler genau einer der drei Kategorien zu – es
       entsteht keine vierte Kategorie. */
    if (item.needsDiagnosis) {
      return {
        queue: queue,
        added: [
          { at: Math.min(queue.length, index + 3),
            spec: { letterId: item.letterId, taskType: "sortCount", level: easier, remedial: true, diagnose: "count" } },
          { at: Math.min(queue.length + 1, index + 6),
            spec: { letterId: item.letterId, taskType: "sortPos", level: easier, remedial: true, diagnose: "position" } }
        ]
      };
    }

    var order = ["pair", "sortPos", "sortCount", "construct", "grid", "flash"];
    if (item.letterId === "alif") order = ["pair", "sortPos", "sortCount", "grid", "flash"];

    var firstForm = null, secondForm = null, i;
    for (i = 0; i < order.length; i++) {
      var g = formGroup(order[i]);
      if (g === failedGroup) continue;
      if (!firstForm) { firstForm = order[i]; continue; }
      if (formGroup(order[i]) === formGroup(firstForm)) continue;
      secondForm = order[i];
      break;
    }
    if (!firstForm) return { queue: queue, added: [] };

    var added = [];
    var contrast = { letterId: item.letterId, taskType: firstForm, level: easier, remedial: true };
    if (firstForm === "pair") contrast.pair = pickPairFor(item.letterId, item.confusedWith);
    added.push({ at: Math.min(queue.length, index + 3), spec: contrast });

    if (secondForm) {
      var recheck = { letterId: item.letterId, taskType: secondForm, level: item.level || 1, remedial: true };
      if (secondForm === "pair") recheck.pair = pickPairFor(item.letterId, item.confusedWith);
      added.push({ at: Math.min(queue.length + 1, index + 6), spec: recheck });
    }
    return { queue: queue, added: added };
  }

  function pickPairFor(letterId, confusedWith) {
    var p = confusedWith ? findPair(letterId, confusedWith) : null;
    if (p) return pairKey(p.a, p.b);
    for (var i = 0; i < MINIMAL_PAIRS.length; i++) {
      if (MINIMAL_PAIRS[i].a === letterId || MINIMAL_PAIRS[i].b === letterId) {
        return pairKey(MINIMAL_PAIRS[i].a, MINIMAL_PAIRS[i].b);
      }
    }
    return "ba-ta";
  }

  /* Einstiegsstufe aus dem Vorcheck. Nie Stufe 3 – die ist dem letzten
     Block und der Challenge vorbehalten. */
  function startLevelFrom(precheck) {
    var correct = 0;
    for (var i = 0; i < precheck.length; i++) if (precheck[i].correct) correct++;
    return correct >= 4 ? 2 : 1;
  }

  function levelForBlock(block, startLevel) {
    if (block === 1) return startLevel;
    if (block === 2) return Math.min(3, startLevel + 1);
    return 3;
  }

  function progressSentence(ls, lang, dict) {
    var d = dict || I18N[lang] || I18N.de;
    return d["progress." + (ls && ls.status ? ls.status : "not_yet")] || "progress.not_yet";
  }

  /* Empfohlene naechste Uebungsform aus der dominanten Fehlerachse. */
  function recommendedForm(ls, errorsByLetter) {
    var e = (errorsByLetter && errorsByLetter[ls.letterId]) || {};
    var top = null, n = 0;
    for (var k in e) {
      if (Object.prototype.hasOwnProperty.call(e, k) && e[k] > n) { top = k; n = e[k]; }
    }
    if (top === "dot_count_confusion") return "sortCount";
    if (top === "dot_position_confusion") return "sortPos";
    if (top === "shape_confusion") return "grid";
    return ls.status === "today_secure" ? "flash" : "construct";
  }

  function migrateState(raw) {
    var fresh = emptyState();
    if (!raw || typeof raw !== "object") return fresh;
    /* Aeltere Prototypstaende (Schema 1 und 2) werden ersatzlos verworfen:
       ihr Antwortprotokoll bezieht sich auf drei Zeichen und andere
       Aufgabenformen und waere im Sechs-Zeichen-Kurs nicht auswertbar. */
    if (raw.schemaVersion !== SCHEMA_VERSION) return fresh;
    if (Array.isArray(raw.precheck)) fresh.precheck = raw.precheck;
    if (Array.isArray(raw.answers)) fresh.answers = raw.answers;
    if (Array.isArray(raw.errors)) fresh.errors = raw.errors;
    if (typeof raw.dueDate === "string") fresh.dueDate = raw.dueDate;
    if (typeof raw.nextdayDoneDate === "string") fresh.nextdayDoneDate = raw.nextdayDoneDate;
    if (typeof raw.nextdayGapDays === "number") fresh.nextdayGapDays = raw.nextdayGapDays;
    if (typeof raw.startLevel === "number") fresh.startLevel = raw.startLevel;
    if (raw.session && typeof raw.session === "object") fresh.session = normalizeSession(raw.session);
    return fresh;
  }

  function normalizeSession(s) {
    var out = {
      stage: typeof s.stage === "string" ? s.stage : "intro",
      index: typeof s.index === "number" && s.index >= 0 ? s.index : 0,
      queue: Array.isArray(s.queue) ? s.queue : [],
      stageStep: typeof s.stageStep === "number" && s.stageStep >= 0 ? s.stageStep : 0,
      pending: s.pending && typeof s.pending === "object" ? s.pending : null,
      remediated: s.remediated && typeof s.remediated === "object" ? s.remediated : {}
    };
    var itemStages = ["precheck", "practice", "challenge", "review", "nextday"];
    if (itemStages.indexOf(out.stage) !== -1) {
      if (!out.queue.length) { out.stage = "intro"; out.index = 0; out.pending = null; }
      else if (out.index >= out.queue.length) out.index = out.queue.length - 1;
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
      startLevel: 1,
      session: { stage: "intro", index: 0, queue: [], stageStep: 0, pending: null, remediated: {} }
    };
  }

  /* ======================================================================
     3. ZUSTAND
     ====================================================================== */

  var state = emptyState();
  /* Der Buehnen-Knopf ist je nach Schritt "Fertig" (bestaetigen) oder
     "Weiter" (naechster Schritt). Ein einziger Listener, ein Zustand. */
  var stageConfirm = null;
  var settings = { lang: "de", theme: "system" };
  var letters = {};
  var storageOk = true;
  var reducedMotion = false;
  var flashTimer = null;

  function probeStorage() {
    try {
      localStorage.setItem("__iqraProbe", "1");
      localStorage.removeItem("__iqraProbe");
      return true;
    } catch (e) { return false; }
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
    } catch (e) { state = emptyState(); }
  }

  function persistSettings() {
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch (e) { storageOk = false; }
  }

  function persistState() {
    try {
      localStorage.setItem(STATE_KEY, JSON.stringify({
        schemaVersion: SCHEMA_VERSION,
        precheck: state.precheck, answers: state.answers, errors: state.errors,
        dueDate: state.dueDate, nextdayDoneDate: state.nextdayDoneDate,
        nextdayGapDays: state.nextdayGapDays, startLevel: state.startLevel,
        session: state.session
      }));
    } catch (e) { storageOk = false; renderStorageWarning(); }
  }

  function refreshLetterStates(scope) {
    for (var i = 0; i < TARGETS.length; i++) {
      letters[TARGETS[i]] = computeLetterState(state.answers, TARGETS[i], scope || "today", state.dueDate);
    }
    return letters;
  }

  function errorsByLetter(scope) {
    var out = {};
    for (var i = 0; i < state.answers.length; i++) {
      var a = state.answers[i];
      if (a.scope !== scope || !a.category) continue;
      if (!out[a.letterId]) out[a.letterId] = {};
      out[a.letterId][a.category] = (out[a.letterId][a.category] || 0) + 1;
    }
    return out;
  }

  /* ======================================================================
     4. i18n
     ====================================================================== */

  var I18N = {
    de: {
      "common.next": "Weiter",
      "common.done": "Fertig",
      "common.overview": "Übersicht",
      "common.reset": "Zurücksetzen",
      "theme.light": "Helles Erscheinungsbild",
      "theme.dark": "Dunkles Erscheinungsbild",
      "theme.system": "Systemeinstellung",
      "meter.of": "{n} von {total}",
      "level.short": "Stufe {n}",
      "level.aria": "Stufe {n} von 3",

      "start.eyebrow": "Mikrokurs · Lektion 1",
      "start.title": "Punkte lesen",
      "start.goal": "Ziel: sechs ähnliche Buchstaben anhand ihrer Grundform sowie Anzahl und Position der Punkte unterscheiden.",
      "start.method": "Du lernst nicht durch bloßes Anschauen. Nach jeder Erklärung folgt eine Aufgabe.",
      "start.setTitle": "Die sechs Zeichen",
      "start.cta": "Lektion beginnen",
      "start.restart": "Lektion neu beginnen",
      "start.cardNeutral": "noch offen",

      "precheck.eyebrow": "Vorcheck",
      "precheck.note": "Ohne Rückmeldung – der Vorcheck passt nur den Einstieg an.",
      "precheck.unknown": "Weiß ich nicht",
      "precheck.shape": "Welches Zeichen hat keine Schalenform?",
      "precheck.count": "Wie viele Punkte hat dieses Zeichen?",
      "precheck.position": "Wo stehen die Punkte dieses Zeichens?",
      "precheck.recall": "Welches Zeichen war das?",
      "precheck.compare": "Im Vorcheck hattest du {n} von {total} Aufgaben richtig. Das ist ein Anhaltspunkt für das Gespräch, keine geprüfte Vorher-/Nachher-Messung.",
      "precheck.doneText": "Die Lektion ist abgeschlossen. Du kannst sie jederzeit neu beginnen – dabei wird der bisherige Stand ersetzt.",

      "count.0": "keine Punkte",
      "count.1": "ein Punkt",
      "count.2": "zwei Punkte",
      "count.3": "drei Punkte",
      "pos.above": "oben",
      "pos.below": "unten",
      "pos.none": "keine Punkte",

      "stage.actLabel": "Jetzt du",
      "stage.section.A": "Abschnitt A · Grundform",
      "stage.section.B": "Abschnitt B · Punktanzahl",
      "stage.section.C": "Abschnitt C · Punktposition",
      "stage.a.explain": "Alif ist ein gerader Strich ohne Punkt. Die anderen Zeichen dieser Lektion liegen auf einer Schalenform.",
      "stage.a.prompt": "Markiere alle Zeichen mit der Schalenform.",
      "stage.a.ok": "Richtig. Alif steht allein – ein gerader Strich, keine Schale, keine Punkte.",
      "stage.a.wrong": "Noch nicht. Alif ist der gerade Strich ohne Punkt, die übrigen liegen auf der Schalenform.",
      "stage.b.explain": "Die Zeichen unterscheiden sich zuerst in der Anzahl der Punkte: keine, ein, zwei oder drei.",
      "stage.b.prompt": "Ordne jedes Zeichen seiner Punktanzahl zu.",
      "stage.b.confront": "Beide haben genau einen Punkt – und sind trotzdem nicht dasselbe Zeichen.",
      "stage.b.confrontPrompt": "Sind das dieselben Zeichen?",
      "stage.b.confrontYes": "Ja, dasselbe Zeichen",
      "stage.b.confrontNo": "Nein, verschiedene Zeichen",
      "stage.b.confrontOk": "Genau. Die Anzahl allein reicht nicht. Es kommt auch darauf an, wo der Punkt steht.",
      "stage.b.confrontWrong": "Sieh genauer hin: die Anzahl ist gleich, die Punkte stehen aber an verschiedenen Stellen.",
      "stage.c.explain": "Punkte stehen entweder über oder unter der Form. Dieselbe Anzahl an verschiedenen Stellen ergibt verschiedene Zeichen.",
      "stage.c.prompt": "Sortiere die Zeichen nach der Lage ihrer Punkte.",
      "stage.c.note": "So sehen die Zeichen allein stehend aus. Im Wort verändern sie ihre Form. Das lernst du später.",

      "practice.mode.practice": "Übung",
      "practice.mode.challenge": "Abschluss-Challenge",
      "practice.mode.review": "Auflösung",
      "practice.mode.nextday": "Folgeprüfung",
      "practice.remedialTag": "Nachübung",

      "task.flash.watch": "Schau genau hin.",
      "task.flash.ask": "Welches Zeichen war das?",
      "task.grid": "Markiere alle Zeichen {rule}.",
      "task.grid.confirm": "Auswahl bestätigen",
      "task.grid.none": "Du hast noch nichts markiert.",
      "task.sortCount": "Ordne jedes Zeichen seiner Punktanzahl zu.",
      "task.sortPos": "Sortiere die Zeichen nach der Lage ihrer Punkte.",
      "task.sort.pick": "Wähle zuerst ein Zeichen, dann die passende Ablage.",
      "task.sort.mayStayEmpty": "Nicht jede Ablage wird gebraucht – manche bleiben leer.",
      "task.construct.byName": "Baue {name}.",
      "task.construct.byRule": "Baue ein Zeichen mit {rule}.",
      "task.construct.hint": "Tippe die Ablage an – jeder Tipp setzt einen weiteren Punkt.",
      "task.construct.above": "Punkte oben",
      "task.construct.below": "Punkte unten",
      "task.construct.formLabel": "Übungsform – Platzhalter für die Grundform",
      "task.construct.empty": "Setze zuerst mindestens einen Punkt.",
      "task.pair": "Welches der beiden Zeichen ist {name}?",

      "rule.none": "ohne Punkte",
      "rule.1-below": "mit einem Punkt unten",
      "rule.1-above": "mit einem Punkt oben",
      "rule.2-below": "mit zwei Punkten unten",
      "rule.2-above": "mit zwei Punkten oben",
      "rule.3-above": "mit drei Punkten oben",

      "name.alif": "Alif",
      "name.ba": "Bā",
      "name.ta": "Tā",
      "name.tha": "Thā",
      "name.nun": "Nūn",
      "name.ya": "Yā",

      "desc.alif": "hat keine Schalenform und keine Punkte",
      "desc.ba": "hat einen Punkt unten",
      "desc.ta": "hat zwei Punkte oben",
      "desc.tha": "hat drei Punkte oben",
      "desc.nun": "hat einen Punkt oben",
      "desc.ya": "hat zwei Punkte unten",

      "mark.correct": "richtig",
      "mark.wrong": "deine Wahl – falsch",
      "mark.missed": "fehlte",

      "fb.correct": "Richtig. {char} {desc}.",
      "fb.shape": "Die Grundform stimmt nicht. {char} {desc}.",
      "fb.count": "Die Position stimmt. Die Anzahl nicht: {char} {desc}.",
      "fb.position": "Die Anzahl stimmt. Die Punkte gehören an die andere Stelle: {char} {desc}.",
      "fb.mixed": "Hier stimmen Anzahl und Position nicht. {char} {desc}.",
      "fb.untrained": "Das ist ein anderer Buchstabe, den du später lernst. {char} {desc}.",
      "fb.pair.position": "Beide haben {count}. Bei {charA} steht {posA}, bei {charB} {posB}.",
      "fb.pair.count": "{charA} {descA}, {charB} {descB}. Die Position ist gleich, die Anzahl nicht.",
      "fb.pair.both": "{charA} {descA}, {charB} {descB}. Hier unterscheiden sich Anzahl und Position.",
      "fb.pair.shape": "{charA} {descA}. {charB} {descB}.",
      "fb.gridOk": "Richtig. Alle Zeichen {rule} markiert.",
      "fb.gridWrong": "Markiert, gehört aber nicht dazu: {list}. Gesucht waren Zeichen {rule}.",
      "fb.gridMissed": "Nicht markiert, gehört aber dazu: {n}×. Gesucht waren Zeichen {rule}.",
      "fb.sortOk": "Richtig sortiert.",
      "fb.sortWrong": "Falsch abgelegt: {list}.",
      "fb.constructOk": "Richtig. So entsteht {char} – {desc}.",
      "fb.constructWrong": "Damit entsteht nicht {name}. {char} {desc}.",

      "result.eyebrow": "Ergebnis",
      "result.passed": "Lektion bestanden.",
      "result.notPassed": "Noch nicht bestanden – und das ist in Ordnung.",
      "result.leadPassed": "Du unterscheidest die Zeichen dieser Lektion an Anzahl und Position der Punkte. Morgen wird kurz geprüft, ob es geblieben ist.",
      "result.leadNotPassed": "Du fängst nicht von vorn an. Morgen wird genau an den schwächsten Zeichen weitergearbeitet, mit anderen Aufgabenformen.",
      "result.cta": "Zur Übersicht",
      "result.errorsTitle": "Deine Fehler lagen hier:",
      "result.errNone": "Heute ist dir kein Fehler unterlaufen, den wir dir erklären müssten.",
      "result.err.shape_confusion": "Grundform ({n}×)",
      "result.err.dot_count_confusion": "Punktanzahl ({n}×)",
      "result.err.dot_position_confusion": "Punktposition ({n}×)",
      "result.err.unresolved": "noch nicht eindeutig zuzuordnen ({n}×)",
      "result.strong": "Stärkstes Merkmal: {dim}.",
      "result.confusion": "Häufigste Verwechslung: {char} ({n}×).",
      "result.recommend": "Als Nächstes: {form}.",
      "result.nextday": "Am {date} steht ein kurzer Block bereit – er beginnt mit den Zeichen, die heute am wenigsten saßen.",
      "result.nextdayNoStorage": "Auf diesem Gerät kann gerade nichts gespeichert werden. Ein Block für morgen kann deshalb nicht zugesagt werden.",
      "result.nextdayDone": "Die Folgeprüfung ist abgeschlossen.",

      "dim.shape": "Grundform",
      "dim.count": "Punktanzahl",
      "dim.position": "Punktposition",
      "dim.both": "Anzahl und Position zusammen",
      "form.flash": "verdeckter Abruf",
      "form.grid": "Rasterfund",
      "form.sortCount": "Sortieren nach Punktanzahl",
      "form.sortPos": "Sortieren nach Punktposition",
      "form.construct": "Punktkonstruktion",
      "form.pair": "Minimalpaar-Vergleich",

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

      "review.intro": "Jetzt die Auflösung. Zu jedem Fehlermuster kommt eine kurze Korrekturaufgabe.",
      "review.none": "In der Challenge ist dir kein Fehler unterlaufen.",

      "notice.review": "Interner Prototyp. Die arabischen Buchstabenformen, die Punkte, die Ablenkzeichen und die Zuordnung der sechs Zeichen zu einer gemeinsamen Formfamilie sind noch nicht durch eine qualifizierte Arabisch-/Elifba- bzw. Schriftprüfung freigegeben. Ob sich ن und ي in der isolierten Form wirklich nur durch die Punkte von ب, ت und ث unterscheiden, ist Teil dieser offenen Prüfung. Es ist keine geprüfte Schriftdatei eingebunden.",
      "notice.noStorage": "Dieses Gerät speichert gerade nichts lokal. Ein Ergebnis für morgen kann deshalb nicht zugesagt werden.",
      "notice.privacy": "Dieser Prototyp speichert ausschließlich lokal auf diesem Gerät. Keine Konten, kein Server, kein Tracking.",
      "notice.clear": "Alle lokalen Daten löschen",
      "notice.clearConfirm": "Alle lokal gespeicherten Daten dieses Prototyps löschen?"
    },

    tr: {
      "common.next": "Devam",
      "common.done": "Bitti",
      "common.overview": "Genel görünüm",
      "common.reset": "Sıfırla",
      "theme.light": "Açık görünüm",
      "theme.dark": "Koyu görünüm",
      "theme.system": "Sistem ayarı",
      "meter.of": "{total} içinden {n}",
      "level.short": "Aşama {n}",
      "level.aria": "3 aşamadan {n}",

      "start.eyebrow": "Mikro kurs · Ders 1",
      "start.title": "Noktaları okumak",
      "start.goal": "Hedef: birbirine benzeyen altı harfi temel formlarına ve noktalarının sayısı ile konumuna göre ayırt etmek.",
      "start.method": "Yalnızca bakarak öğrenmezsin. Her açıklamadan sonra bir alıştırma gelir.",
      "start.setTitle": "Altı işaret",
      "start.cta": "Derse başla",
      "start.restart": "Dersi yeniden başlat",
      "start.cardNeutral": "henüz açık",

      "precheck.eyebrow": "Ön kontrol",
      "precheck.note": "Geri bildirim yok – ön kontrol yalnızca başlangıcı ayarlar.",
      "precheck.unknown": "Bilmiyorum",
      "precheck.shape": "Hangi işaretin çanak formu yok?",
      "precheck.count": "Bu işaretin kaç noktası var?",
      "precheck.position": "Bu işaretin noktaları nerede?",
      "precheck.recall": "Bu hangi işaretti?",
      "precheck.compare": "Ön kontrolde {total} sorudan {n} tanesi doğruydu. Bu, görüşme için bir ipucudur; doğrulanmış bir önce/sonra ölçümü değildir.",
      "precheck.doneText": "Ders tamamlandı. İstediğin zaman yeniden başlayabilirsin – bu durumda mevcut durum değiştirilir.",

      "count.0": "nokta yok",
      "count.1": "bir nokta",
      "count.2": "iki nokta",
      "count.3": "üç nokta",
      "pos.above": "üstte",
      "pos.below": "altta",
      "pos.none": "nokta yok",

      "stage.actLabel": "Şimdi sen",
      "stage.section.A": "Bölüm A · Temel form",
      "stage.section.B": "Bölüm B · Nokta sayısı",
      "stage.section.C": "Bölüm C · Nokta konumu",
      "stage.a.explain": "Elif noktasız, düz bir çizgidir. Bu dersteki diğer işaretler bir çanak formu üzerinde durur.",
      "stage.a.prompt": "Çanak formu olan bütün işaretleri işaretle.",
      "stage.a.ok": "Doğru. Elif tek başınadır – düz bir çizgi, çanak yok, nokta yok.",
      "stage.a.wrong": "Henüz değil. Elif noktasız düz çizgidir, diğerleri çanak formu üzerinde durur.",
      "stage.b.explain": "İşaretler önce nokta sayısıyla ayrılır: sıfır, bir, iki veya üç.",
      "stage.b.prompt": "Her işareti nokta sayısına göre yerleştir.",
      "stage.b.confront": "İkisinin de tam bir noktası var – yine de aynı işaret değiller.",
      "stage.b.confrontPrompt": "Bunlar aynı işaretler mi?",
      "stage.b.confrontYes": "Evet, aynı işaret",
      "stage.b.confrontNo": "Hayır, farklı işaretler",
      "stage.b.confrontOk": "Aynen. Yalnızca sayı yetmez. Noktanın nerede durduğu da önemlidir.",
      "stage.b.confrontWrong": "Daha dikkatli bak: sayı aynı, ama noktalar farklı yerlerde duruyor.",
      "stage.c.explain": "Noktalar ya formun üstünde ya da altında durur. Aynı sayı farklı yerlerde farklı işaretler verir.",
      "stage.c.prompt": "İşaretleri noktalarının konumuna göre ayır.",
      "stage.c.note": "İşaretler tek başlarınayken böyle görünür. Kelime içinde biçimleri değişir. Bunu daha sonra öğreneceksin.",

      "practice.mode.practice": "Alıştırma",
      "practice.mode.challenge": "Kapanış turu",
      "practice.mode.review": "Çözüm",
      "practice.mode.nextday": "Takip kontrolü",
      "practice.remedialTag": "Ek alıştırma",

      "task.flash.watch": "Dikkatle bak.",
      "task.flash.ask": "Bu hangi işaretti?",
      "task.grid": "{rule} bütün işaretleri işaretle.",
      "task.grid.confirm": "Seçimi onayla",
      "task.grid.none": "Henüz hiçbir şey işaretlemedin.",
      "task.sortCount": "Her işareti nokta sayısına göre yerleştir.",
      "task.sortPos": "İşaretleri noktalarının konumuna göre ayır.",
      "task.sort.pick": "Önce bir işaret, sonra uygun bölmeyi seç.",
      "task.sort.mayStayEmpty": "Her bölme gerekli değildir – bazıları boş kalır.",
      "task.construct.byName": "{name} oluştur.",
      "task.construct.byRule": "{rule} olan bir işaret oluştur.",
      "task.construct.hint": "Bölmeye dokun – her dokunuş bir nokta daha ekler.",
      "task.construct.above": "Üstteki noktalar",
      "task.construct.below": "Alttaki noktalar",
      "task.construct.formLabel": "Alıştırma formu – temel form için yer tutucu",
      "task.construct.empty": "Önce en az bir nokta koy.",
      "task.pair": "İki işaretten hangisi {name}?",

      "rule.none": "noktasız",
      "rule.1-below": "altta bir nokta olan",
      "rule.1-above": "üstte bir nokta olan",
      "rule.2-below": "altta iki nokta olan",
      "rule.2-above": "üstte iki nokta olan",
      "rule.3-above": "üstte üç nokta olan",

      "name.alif": "Elif",
      "name.ba": "Bā",
      "name.ta": "Tā",
      "name.tha": "Thā",
      "name.nun": "Nūn",
      "name.ya": "Yā",

      "desc.alif": "çanak formu ve noktası yoktur",
      "desc.ba": "altta bir noktalıdır",
      "desc.ta": "üstte iki noktalıdır",
      "desc.tha": "üstte üç noktalıdır",
      "desc.nun": "üstte bir noktalıdır",
      "desc.ya": "altta iki noktalıdır",

      "mark.correct": "doğru",
      "mark.wrong": "senin seçimin – yanlış",
      "mark.missed": "eksikti",

      "fb.correct": "Doğru. {char} {desc}.",
      "fb.shape": "Temel form uymuyor. {char} {desc}.",
      "fb.count": "Konum doğru. Sayı değil: {char} {desc}.",
      "fb.position": "Sayı doğru. Noktaların yeri farklı: {char} {desc}.",
      "fb.mixed": "Burada hem sayı hem konum uymuyor. {char} {desc}.",
      "fb.untrained": "Bu, daha sonra öğreneceğin başka bir harf. {char} {desc}.",
      "fb.pair.position": "İkisinde de {count} var. {charA} işaretinde {posA}, {charB} işaretinde {posB}.",
      "fb.pair.count": "{charA} {descA}, {charB} {descB}. Konum aynı, sayı değil.",
      "fb.pair.both": "{charA} {descA}, {charB} {descB}. Burada hem sayı hem konum farklı.",
      "fb.pair.shape": "{charA} {descA}. {charB} {descB}.",
      "fb.gridOk": "Doğru. {rule} bütün işaretler seçildi.",
      "fb.gridWrong": "İşaretlendi ama buraya ait değil: {list}. Aranan: {rule} işaretler.",
      "fb.gridMissed": "İşaretlenmedi ama buraya ait: {n}×. Aranan: {rule} işaretler.",
      "fb.sortOk": "Doğru yerleştirdin.",
      "fb.sortWrong": "Yanlış yerleştirilen: {list}.",
      "fb.constructOk": "Doğru. Böylece {char} oluşur – {desc}.",
      "fb.constructWrong": "Bu şekilde {name} oluşmaz. {char} {desc}.",

      "result.eyebrow": "Sonuç",
      "result.passed": "Ders tamamlandı.",
      "result.notPassed": "Henüz tamamlanmadı – bu da sorun değil.",
      "result.leadPassed": "Bu dersteki işaretleri noktaların sayısına ve konumuna göre ayırt ediyorsun. Yarın kısaca kalıcı olup olmadığına bakılacak.",
      "result.leadNotPassed": "Baştan başlamıyorsun. Yarın en zayıf işaretlerden, başka alıştırma biçimleriyle devam edilecek.",
      "result.cta": "Genel görünüme",
      "result.errorsTitle": "Hataların şuralardaydı:",
      "result.errNone": "Bugün sana açıklamamız gereken bir hata yapmadın.",
      "result.err.shape_confusion": "Temel form ({n}×)",
      "result.err.dot_count_confusion": "Nokta sayısı ({n}×)",
      "result.err.dot_position_confusion": "Nokta konumu ({n}×)",
      "result.err.unresolved": "henüz kesin olarak sınıflandırılamadı ({n}×)",
      "result.strong": "En güçlü özellik: {dim}.",
      "result.confusion": "En sık karıştırma: {char} ({n}×).",
      "result.recommend": "Sırada: {form}.",
      "result.nextday": "{date} tarihinde kısa bir blok hazır olacak – bugün en az oturan işaretlerle başlayacak.",
      "result.nextdayNoStorage": "Bu cihazda şu anda hiçbir şey kaydedilemiyor. Bu yüzden yarın için bir blok söz verilemez.",
      "result.nextdayDone": "Takip kontrolü tamamlandı.",

      "dim.shape": "Temel form",
      "dim.count": "Nokta sayısı",
      "dim.position": "Nokta konumu",
      "dim.both": "Sayı ve konum birlikte",
      "form.flash": "kapalı hatırlama",
      "form.grid": "ızgarada bulma",
      "form.sortCount": "Nokta sayısına göre ayırma",
      "form.sortPos": "Nokta konumuna göre ayırma",
      "form.construct": "Nokta oluşturma",
      "form.pair": "En küçük fark karşılaştırması",

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

      "review.intro": "Şimdi çözüm. Her hata örüntüsü için kısa bir düzeltme alıştırması geliyor.",
      "review.none": "Kapanış turunda hata yapmadın.",

      "notice.review": "Dahili prototip. Arapça harf formları, noktalar, çeldirici işaretler ve altı işaretin ortak bir form ailesine atanması henüz nitelikli bir Arapça/Elifba veya yazı incelemesinden geçmedi. ن ve ي işaretlerinin izole biçimde ب, ت ve ث işaretlerinden gerçekten yalnızca noktalarla ayrılıp ayrılmadığı bu açık incelemenin parçasıdır. Denetlenmiş bir yazı tipi dosyası eklenmemiştir.",
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
      if (Object.prototype.hasOwnProperty.call(params, k)) out = out.split("{" + k + "}").join(params[k]);
    }
    return out;
  }

  /* ======================================================================
     5. DOM-HELFER
     ====================================================================== */

  function $(id) { return document.getElementById(id); }
  function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); }

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

  /* Neutrale Uebungsform fuer die Punktkonstruktion. Bewusst KEINE arabische
     Glyphe und kein Unicode-Buchstabe: U+066E waere ein eigenstaendiges
     Zeichen und damit die Behauptung, die Uebungsform sei ein Buchstabe;
     zudem ist seine Verfuegbarkeit auf Endgeraeten ungeprueft. Diese Flaeche
     ist eine abstrakte Struktur und wird sichtbar so benannt. */
  function practiceForm() {
    var wrap = document.createElement("div");
    wrap.className = "practice-form";
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 120 44");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("class", "practice-form-svg");
    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M14 6 C14 30, 34 38, 60 38 C86 38, 106 30, 106 6");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "currentColor");
    path.setAttribute("stroke-width", "7");
    path.setAttribute("stroke-linecap", "round");
    svg.appendChild(path);
    wrap.appendChild(svg);
    var label = document.createElement("span");
    label.className = "practice-form-label";
    label.textContent = t("task.construct.formLabel");
    wrap.appendChild(label);
    return wrap;
  }

  function renderSentence(el, template, params) {
    clear(el);
    var parts = template.split(/(\{char[AB]?\})/);
    for (var i = 0; i < parts.length; i++) {
      var m = /^\{(char[AB]?)\}$/.exec(parts[i]);
      if (m) {
        var group = document.createElement("span");
        group.className = "nowrap-group";
        group.appendChild(arabicSpan(params[m[1]]));
        var rest = parts[i + 1] ? fill(parts[i + 1], params) : "";
        var w = /^(\s*\S+)([\s\S]*)$/.exec(rest);
        if (w) { group.appendChild(document.createTextNode(w[1])); parts[i + 1] = w[2]; }
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

  function setMeter(fillEl, labelEl, n, total) {
    fillEl.style.width = total ? Math.round((n / total) * 100) + "%" : "0%";
    labelEl.textContent = fill(t("meter.of"), { n: n, total: total });
  }

  function formatDate(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ""));
    return m ? m[3] + "." + m[2] + "." + m[1] : String(iso || "");
  }

  function focusEl(el) {
    if (!el || el.hidden || el.offsetParent === null) return false;
    el.setAttribute("tabindex", "-1");
    try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); }
    return true;
  }

  var VIEWS = ["start", "precheck", "stage", "practice", "result", "nextday"];

  function showView(name) {
    for (var i = 0; i < VIEWS.length; i++) {
      $("view-" + VIEWS[i]).classList.toggle("active", VIEWS[i] === name);
    }
    $("btn-to-overview").hidden = name === "start";
    window.scrollTo(0, 0);
    var view = $("view-" + name);
    var heads = view.querySelectorAll("h1, h2");
    for (var j = 0; j < heads.length; j++) if (focusEl(heads[j])) return;
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
      level: spec.level || 1,
      block: spec.block || null,
      remedial: !!spec.remedial,
      diagnose: spec.diagnose || null,
      scope: scope
    };
    if (spec.taskType === "flash") {
      item.options = buildDistractors(spec.letterId, item.level, lastOptionKey);
      lastOptionKey = item.options.join(",");
      item.pickKind = "glyph";
    } else if (spec.taskType === "grid") {
      var g = buildGrid(spec.letterId, item.level);
      item.cells = g.cells;
      item.rule = g.rule;
      item.targetSet = [];
      for (var i = 0; i < TARGETS.length; i++) {
        if (matchesRule(TARGETS[i], g.rule)) item.targetSet.push(TARGETS[i]);
      }
      item.pickKind = "glyph";
    } else if (spec.taskType === "sortCount" || spec.taskType === "sortPos") {
      item.chars = buildSortItem(spec.taskType, item.level);
      item.pickKind = "sort";
    } else if (spec.taskType === "construct") {
      /* Ab Stufe 3 merkmalsbasiert formuliert: geprueft wird die Regel,
         nicht die Zeichenidentitaet. */
      item.byRule = item.level >= 3;
      item.pickKind = "trait";
    } else if (spec.taskType === "pair") {
      var key = spec.pair || pickPairFor(spec.letterId, null);
      item.pair = key;
      item.pairRef = findPairByKey(key);
      item.pickKind = "glyph";
      var parts = key.split("-");
      item.options = shuffle([parts[0], parts[1]]);
      if (item.options.indexOf(spec.letterId) === -1) item.letterId = parts[0];
    }
    item.dimension = dimensionOf(item);
    return item;
  }

  function buildQueue(plan, scope, startLevel) {
    lastOptionKey = null;
    var out = [];
    for (var i = 0; i < plan.length; i++) {
      var spec = plan[i];
      var lvl = spec.level || (spec.block ? levelForBlock(spec.block, startLevel || 1) : 1);
      var merged = {
        letterId: spec.letterId, taskType: spec.taskType, pair: spec.pair,
        level: lvl, block: spec.block, remedial: spec.remedial
      };
      out.push(makeItem(merged, scope, i + 1));
    }
    return out;
  }

  /* ======================================================================
     7. ANTWORTEN
     ====================================================================== */

  function attemptNoFor(item) {
    var n = 0;
    for (var i = 0; i < state.answers.length; i++) {
      var a = state.answers[i];
      if (a.scope === item.scope && a.letterId === item.letterId &&
          formGroup(a.taskType) === formGroup(item.taskType)) n++;
    }
    return n + 1;
  }

  function recordAnswer(item, picked, correct) {
    var attemptNo = attemptNoFor(item);
    var answer = {
      qid: item.qid, letterId: item.letterId, taskType: item.taskType, level: item.level,
      picked: picked, correct: !!correct, firstTry: attemptNo === 1, attemptNo: attemptNo,
      ts: Date.now(), scope: item.scope, pickKind: item.pickKind, dimension: item.dimension
    };
    var cls = classifyError({
      letterId: item.letterId, taskType: item.taskType, pickKind: item.pickKind,
      picked: picked, correct: !!correct, targetSet: item.targetSet
    });
    answer.category = cls.category;
    answer.needsDiagnosis = cls.needsDiagnosis;
    answer.confusedWith = cls.confusedWith;
    if (cls.nameMiss) answer.nameMiss = true;
    if (item.diagnose === "count") answer.diagnoseRole = "count";
    state.answers.push(answer);
    if (cls.category) {
      state.errors.push({
        qid: item.qid, letterId: item.letterId,
        category: cls.category, confusedWith: cls.confusedWith
      });
    }
    /* Die Positionsfrage schliesst das Diagnosepaar ab und ordnet die zuvor
       unbestimmten Fehler dieses Zeichens zu. */
    if (item.diagnose === "position") {
      var countOk = true;
      for (var j = state.answers.length - 1; j >= 0; j--) {
        if (state.answers[j].letterId === item.letterId && state.answers[j].diagnoseRole === "count") {
          countOk = state.answers[j].correct;
          break;
        }
      }
      assignDiagnosis(item.letterId, resolveDiagnosis(countOk));
    }
    return answer;
  }

  function assignDiagnosis(letterId, category) {
    for (var i = 0; i < state.answers.length; i++) {
      var a = state.answers[i];
      if (a.letterId === letterId && a.needsDiagnosis && !a.category) {
        a.category = category;
        a.needsDiagnosis = false;
        state.errors.push({ qid: a.qid, letterId: letterId, category: category, confusedWith: a.confusedWith });
      }
    }
  }

  /* ======================================================================
     8. AUFGABENFORMEN
     ====================================================================== */

  function feedbackTemplate(cls) {
    if (cls.category === "shape_confusion") return t("fb.shape");
    if (cls.category === "dot_count_confusion") return t("fb.count");
    if (cls.category === "dot_position_confusion") return t("fb.position");
    return t("fb.mixed");
  }

  /* Rueckmeldung, die das konkret verwechselte Paar benennt. Bei Paaren, deren
     Alleinstellung fachlich ungeprueft ist (soleDiff false), wird nur die
     Punktaussage getroffen, nie "der einzige Unterschied". */
  function pairFeedback(el, targetId, pickedId) {
    var pair = findPair(targetId, pickedId);
    var A = GLYPHS[targetId], B = GLYPHS[pickedId];
    var params = {
      charA: A.char, charB: B.char,
      descA: t("desc." + targetId), descB: t("desc." + pickedId),
      count: t("count." + A.dots),
      posA: t("pos." + A.pos), posB: t("pos." + B.pos)
    };
    var tpl;
    if (!pair) tpl = t("fb.pair.both");
    else if (pair.dim === "position") tpl = t("fb.pair.position");
    else if (pair.dim === "count") tpl = t("fb.pair.count");
    else if (pair.dim === "shape") tpl = t("fb.pair.shape");
    else tpl = t("fb.pair.both");
    setFeedback(el, "attn", tpl, params);
  }

  /* A. Verdeckter Abruf */
  function renderFlash(item, ui, onAnswer, revealNow) {
    clearTimeout(flashTimer);
    function reveal() {
      ui.prompt.textContent = t("task.flash.ask");
      clear(ui.task);
      ui.task.appendChild(buildGlyphChoices(item, onAnswer));
      ui.action.hidden = true;
    }
    if (revealNow) { reveal(); return; }
    ui.prompt.textContent = t("task.flash.watch");
    clear(ui.task);
    var stage = document.createElement("div");
    stage.className = "stage stage-inline";
    var glyph = document.createElement("div");
    glyph.className = "glyph-xl arabic";
    setArabicText(glyph, GLYPHS[item.letterId].char);
    stage.appendChild(glyph);
    ui.task.appendChild(stage);
    if (reducedMotion) {
      ui.action.hidden = false;
      ui.action.disabled = false;
      ui.action.textContent = t("common.next");
      ui.action.onclick = reveal;
    } else {
      ui.action.hidden = true;
      flashTimer = setTimeout(reveal, 1100);
    }
  }

  function buildGlyphChoices(item, onAnswer) {
    var row = document.createElement("div");
    row.className = "choices choices-" + item.options.length;
    item.options.forEach(function (gid) {
      var b = document.createElement("button");
      b.className = "choice";
      b.type = "button";
      b.setAttribute("data-glyph", gid);
      b.appendChild(arabicSpan(GLYPHS[gid].char, "choice-char"));
      b.addEventListener("click", function () { onAnswer(gid, gid === item.letterId, row); });
      row.appendChild(b);
    });
    return row;
  }

  /* B. Rasterfund mit Merkmalsregel */
  function renderGrid(item, ui, onAnswer) {
    renderSentence(ui.prompt, t("task.grid"), { rule: t(item.rule.key) });
    clear(ui.task);
    var grid = document.createElement("div");
    grid.className = "grid-find";
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
    ui.action.textContent = t("task.grid.confirm");
    ui.action.onclick = function () {
      if (!marked.length) { setFeedback(ui.feedback, "", t("task.grid.none"), {}); return; }
      var targetIdx = [];
      item.cells.forEach(function (gid, i) { if (matchesRule(gid, item.rule)) targetIdx.push(i); });
      var ok = marked.length === targetIdx.length &&
        targetIdx.every(function (i) { return marked.indexOf(i) !== -1; });
      var pickedChars = marked.slice().sort(function (a, b) { return a - b; })
        .map(function (i) { return item.cells[i]; });
      onAnswer(pickedChars, ok, grid, { marked: marked, targetIdx: targetIdx });
    };
  }

  /* C/D. Sortieren – erst Zeichen waehlen, dann Ablage antippen. Kein Drag. */
  function renderSort(item, ui, onAnswer) {
    var byCount = item.taskType === "sortCount";
    ui.prompt.textContent = t(byCount ? "task.sortCount" : "task.sortPos");
    clear(ui.task);

    var placed = {};
    var selected = null;

    var pool = document.createElement("div");
    pool.className = "sort-pool";
    item.chars.forEach(function (gid) {
      var b = document.createElement("button");
      b.className = "sort-chip arabic";
      b.type = "button";
      b.setAttribute("data-glyph", gid);
      b.setAttribute("aria-pressed", "false");
      setArabicText(b, GLYPHS[gid].char);
      b.addEventListener("click", function () {
        if (placed[gid]) return;
        selected = selected === gid ? null : gid;
        var chips = pool.querySelectorAll(".sort-chip");
        for (var i = 0; i < chips.length; i++) {
          chips[i].setAttribute("aria-pressed",
            chips[i].getAttribute("data-glyph") === selected ? "true" : "false");
        }
      });
      pool.appendChild(b);
    });
    ui.task.appendChild(pool);

    var binsWrap = document.createElement("div");
    /* Positionsfaecher untereinander: "oben" und "unten" bilden damit raeumlich
       ab, was sie meinen, und die Form ist von der Anzahl-Sortierung
       unterscheidbar. */
    binsWrap.className = "sort-bins" + (byCount ? "" : " sort-bins-pos");
    var buckets = byCount ? COUNT_BUCKETS : POS_BUCKETS;
    buckets.forEach(function (key) {
      var bin = document.createElement("button");
      bin.className = "sort-bin";
      bin.type = "button";
      bin.setAttribute("data-bin", String(key));
      var label = document.createElement("span");
      label.className = "sort-bin-label";
      label.textContent = byCount ? t("count." + key) : t("pos." + key);
      bin.appendChild(label);
      var slot = document.createElement("span");
      slot.className = "sort-bin-slot";
      bin.appendChild(slot);
      bin.addEventListener("click", function () {
        if (!selected) { setFeedback(ui.feedback, "", t("task.sort.pick"), {}); return; }
        placed[selected] = String(key);
        var chip = pool.querySelector('.sort-chip[data-glyph="' + selected + '"]');
        if (chip) { chip.disabled = true; chip.setAttribute("aria-pressed", "false"); chip.classList.add("is-placed"); }
        slot.appendChild(arabicSpan(GLYPHS[selected].char, "sort-placed"));
        selected = null;
        hideFeedback(ui.feedback);
      });
      binsWrap.appendChild(bin);
    });
    ui.task.appendChild(binsWrap);
    var emptyNote = document.createElement("p");
    emptyNote.className = "fine-print";
    emptyNote.textContent = t("task.sort.mayStayEmpty");
    ui.task.appendChild(emptyNote);

    /* Der Knopf bleibt bedienbar: ein grauer, nicht antippbarer Primaerknopf
       erklaert seine eigene Bedingung nicht. */
    ui.action.hidden = false;
    ui.action.disabled = false;
    ui.action.textContent = t("common.done");
    ui.action.onclick = function () {
      if (Object.keys(placed).length !== item.chars.length) {
        setFeedback(ui.feedback, "", t("task.sort.pick"), {});
        return;
      }
      var wrong = [];
      item.chars.forEach(function (gid) {
        var want = byCount ? String(GLYPHS[gid].dots) : GLYPHS[gid].pos;
        if (placed[gid] !== want) wrong.push(gid);
      });
      onAnswer(item.chars.map(function (g) { return g + ":" + placed[g]; }), wrong.length === 0,
        binsWrap, { wrong: wrong, placed: placed, byCount: byCount });
    };
  }

  /* E. Punktkonstruktion – die Anzahl entsteht aus wiederholtem Antippen,
     nicht aus einer Liste. Auswertung erst nach "Fertig". */
  function renderConstruct(item, ui, onAnswer) {
    var target = GLYPHS[item.letterId];
    if (item.byRule) {
      renderSentence(ui.prompt, t("task.construct.byRule"),
        { rule: t("rule." + target.dots + "-" + target.pos) });
    } else {
      ui.prompt.textContent = fill(t("task.construct.byName"), { name: t("name." + item.letterId) });
    }
    clear(ui.task);

    var counts = { above: 0, below: 0 };
    var board = document.createElement("div");
    board.className = "construct-board";

    var hint = document.createElement("p");
    hint.className = "fine-print";
    hint.textContent = t("task.construct.hint");

    function zone(pos) {
      var b = document.createElement("button");
      b.className = "construct-zone";
      b.type = "button";
      b.setAttribute("data-pos", pos);
      var lab = document.createElement("span");
      lab.className = "construct-zone-label";
      lab.textContent = t(pos === "above" ? "task.construct.above" : "task.construct.below");
      var dots = document.createElement("span");
      dots.className = "dot-mark";
      b.appendChild(lab);
      b.appendChild(dots);
      function sync() {
        clear(dots);
        for (var i = 0; i < counts[pos]; i++) dots.appendChild(document.createElement("span"));
        b.setAttribute("aria-label", lab.textContent + ": " + t("count." + Math.min(3, counts[pos])));
      }
      b.addEventListener("click", function () {
        counts[pos] = counts[pos] >= 3 ? 0 : counts[pos] + 1;
        sync();
        hideFeedback(ui.feedback);
      });
      sync();
      return b;
    }

    board.appendChild(zone("above"));
    board.appendChild(practiceForm());
    board.appendChild(zone("below"));
    ui.task.appendChild(board);
    ui.task.appendChild(hint);

    var reset = document.createElement("button");
    reset.className = "btn btn-secondary";
    reset.type = "button";
    reset.textContent = t("common.reset");
    reset.addEventListener("click", function () {
      counts.above = 0; counts.below = 0;
      renderConstruct(item, ui, onAnswer);
    });
    ui.task.appendChild(reset);

    ui.action.hidden = false;
    ui.action.disabled = false;
    ui.action.textContent = t("common.done");
    ui.action.onclick = function () {
      var total = counts.above + counts.below;
      if (!total) { setFeedback(ui.feedback, "", t("task.construct.empty"), {}); return; }
      var pos = counts.above && counts.below ? "mixed" : (counts.above ? "above" : "below");
      var code = total + "-" + pos;
      onAnswer(code, code === traitCodeOf(item.letterId), board);
    };
  }

  /* F. Minimalpaar */
  function renderPair(item, ui, onAnswer) {
    ui.prompt.textContent = fill(t("task.pair"), { name: t("name." + item.letterId) });
    clear(ui.task);
    var row = document.createElement("div");
    row.className = "choices choices-2";
    item.options.forEach(function (gid) {
      var b = document.createElement("button");
      b.className = "choice";
      b.type = "button";
      b.setAttribute("data-glyph", gid);
      b.appendChild(arabicSpan(GLYPHS[gid].char, "choice-char"));
      b.addEventListener("click", function () { onAnswer(gid, gid === item.letterId, row); });
      row.appendChild(b);
    });
    ui.task.appendChild(row);
    ui.action.hidden = true;
  }

  /* ======================================================================
     9. VIEW: START
     ====================================================================== */

  function renderStart() {
    var s = state.session;
    var offerVisible = renderNextdayOffer();
    renderStorageWarning();
    var lessonDone = s.stage !== "intro";
    $("btn-start-lesson").hidden = lessonDone;
    $("btn-restart-lesson").hidden = !lessonDone;
    $("btn-start-lesson").className = "btn " + (offerVisible ? "btn-secondary" : "btn-primary");
    $("btn-restart-lesson").className = "btn " + (offerVisible ? "btn-secondary" : "btn-primary");

    var scope = s.stage === "resultNextday" ? "nextday" : "today";
    var haveResult = s.stage === "result" || s.stage === "resultNextday" || s.stage === "done";
    if (haveResult) refreshLetterStates(scope);

    var wrap = $("start-cards");
    clear(wrap);
    TARGETS.forEach(function (id) {
      var card = document.createElement("div");
      card.className = "letter-card";
      var ls = haveResult ? letters[id] : null;
      card.setAttribute("data-status", ls ? ls.status : "neutral");
      card.appendChild(arabicSpan(GLYPHS[id].char, "letter-card-char"));
      /* Vor dem ersten Durchlauf gibt es keinen Status – dann steht dort auch
         nichts, statt sechsmal derselben Platzhalterzeile. */
      if (ls) {
        var st = document.createElement("span");
        st.className = "letter-card-status";
        st.textContent = t("status." + ls.status);
        card.appendChild(st);
      }
      wrap.appendChild(card);
    });
  }

  /* ======================================================================
     10. VIEW: VORCHECK
     ====================================================================== */

  function startPrecheck() {
    var plan = shuffle(PRECHECK_PLAN);
    var q = [];
    for (var i = 0; i < plan.length; i++) {
      q.push(buildPrecheckItem(plan[i], i + 1));
    }
    state.precheck = [];
    state.answers = [];
    state.errors = [];
    state.startLevel = 1;
    state.session = { stage: "precheck", index: 0, queue: q, stageStep: 0, pending: null, remediated: {} };
    persistState();
    showView("precheck");
    renderPrecheck();
  }

  function buildPrecheckItem(spec, seq) {
    var g = GLYPHS[spec.letterId];
    var item = { qid: "pre-" + seq, letterId: spec.letterId, kind: spec.kind, taskType: "name" };
    if (spec.kind === "shape") {
      item.options = shuffle(["alif", "ba", "ta", "nun"]);
      item.correct = "alif";
      item.optionKind = "glyph";
      item.promptKey = "precheck.shape";
    } else if (spec.kind === "count") {
      item.options = shuffle(["0", "1", "2", "3"]);
      item.correct = String(g.dots);
      item.optionKind = "count";
      item.promptKey = "precheck.count";
      item.showChar = true;
    } else if (spec.kind === "position") {
      item.options = shuffle(["above", "below", "none"]);
      item.correct = g.pos;
      item.optionKind = "pos";
      item.promptKey = "precheck.position";
      item.showChar = true;
    } else {
      item.options = buildDistractors(spec.letterId, 2, null);
      item.correct = spec.letterId;
      item.optionKind = "glyph";
      item.promptKey = "precheck.recall";
      item.flash = true;
    }
    return item;
  }

  function renderPrecheck() {
    var s = state.session;
    var item = s.queue[s.index];
    if (!item) { finishPrecheck(); return; }
    setMeter($("precheck-fill"), $("precheck-count"), s.index + 1, s.queue.length);
    var promptEl = $("precheck-prompt");
    var taskEl = $("precheck-task");
    clear(taskEl);

    function showOptions() {
      promptEl.textContent = t(item.promptKey);
      clear(taskEl);
      if (item.showChar) {
        var st = document.createElement("div");
        st.className = "stage stage-inline";
        var gl = document.createElement("div");
        gl.className = "glyph-xl arabic";
        setArabicText(gl, GLYPHS[item.letterId].char);
        st.appendChild(gl);
        taskEl.appendChild(st);
      }
      var row = document.createElement("div");
      row.className = item.optionKind === "glyph"
        ? "choices choices-" + item.options.length : "choices choices-text";
      item.options.forEach(function (opt) {
        var b = document.createElement("button");
        b.type = "button";
        if (item.optionKind === "glyph") {
          b.className = "choice";
          b.appendChild(arabicSpan(GLYPHS[opt].char, "choice-char"));
        } else {
          b.className = "choice choice-text";
          b.textContent = item.optionKind === "count" ? t("count." + opt) : t("pos." + opt);
        }
        b.addEventListener("click", function () { answerPrecheck(item, opt); });
        row.appendChild(b);
      });
      taskEl.appendChild(row);
      focusEl(promptEl);
    }

    if (item.flash) {
      promptEl.textContent = t("task.flash.watch");
      var stage = document.createElement("div");
      stage.className = "stage stage-inline";
      var glyph = document.createElement("div");
      glyph.className = "glyph-xl arabic";
      setArabicText(glyph, GLYPHS[item.letterId].char);
      stage.appendChild(glyph);
      taskEl.appendChild(stage);
      if (reducedMotion) {
        var next = document.createElement("button");
        next.className = "btn btn-primary";
        next.type = "button";
        next.textContent = t("common.next");
        next.addEventListener("click", showOptions);
        taskEl.appendChild(next);
      } else {
        clearTimeout(flashTimer);
        flashTimer = setTimeout(showOptions, 1100);
      }
      return;
    }
    showOptions();
  }

  /* Kein Richtig-/Falsch-Feedback. Die Antwort wird gespeichert und steuert
     nur die Einstiegsstufe. */
  function answerPrecheck(item, value) {
    state.precheck.push({
      letterId: item.letterId, kind: item.kind, answered: value !== "unknown",
      picked: value, correct: value === item.correct
    });
    state.session.index++;
    persistState();
    if (state.session.index >= state.session.queue.length) finishPrecheck();
    else renderPrecheck();
  }

  function finishPrecheck() {
    state.startLevel = startLevelFrom(state.precheck);
    state.session = { stage: "stage", index: 0, queue: [], stageStep: 0, pending: null, remediated: {} };
    persistState();
    showView("stage");
    renderStage();
  }

  /* ======================================================================
     11. VIEW: LERNBUEHNE
     ====================================================================== */

  function renderStage() {
    var step = STAGE_STEPS[state.session.stageStep];
    if (!step) { startPractice(); return; }

    $("stage-section-label").textContent = t("stage.section." + step.section);
    setMeter($("stage-fill"), $("stage-count"), state.session.stageStep + 1, STAGE_STEPS.length);

    var charEl = $("stage-char");
    clear(charEl);
    charEl.hidden = !step.chars;
    $("stage-area").classList.toggle("stage-compact", !step.chars);
    if (step.chars) {
      step.chars.forEach(function (c) { charEl.appendChild(arabicSpan(c, "glyph-lg")); });
    }
    $("stage-caption").textContent = t(step.caption);

    var act = $("stage-act");
    var next = $("btn-stage-next");
    hideFeedback($("stage-feedback"));
    clear($("stage-action"));
    next.textContent = t("common.next");
    next.disabled = false;
    next.onclick = null;
    stageConfirm = null;

    if (step.kind === "explain" || step.kind === "note") {
      act.hidden = true;
      next.hidden = false;
      focusEl($("stage-caption"));
      return;
    }

    act.hidden = false;
    next.hidden = true;
    $("stage-prompt").textContent = t(step.prompt);

    if (step.kind === "pickSet") renderStagePickSet(step);
    else if (step.kind === "sortCount") renderStageSort(step, true);
    else if (step.kind === "sortPos") renderStageSort(step, false);
    else if (step.kind === "confront") renderStageConfront(step);
    focusEl($("stage-prompt"));
  }

  function stageDone(tone, key) {
    setFeedback($("stage-feedback"), tone, t(key), {});
    var next = $("btn-stage-next");
    next.hidden = false;
    next.disabled = false;
    next.textContent = t("common.next");
    next.onclick = null;
    stageConfirm = null;
  }

  function renderStagePickSet(step) {
    var wrap = $("stage-action");
    var grid = document.createElement("div");
    grid.className = "grid-find grid-find-small";
    var marked = [];
    step.options.forEach(function (gid) {
      var b = document.createElement("button");
      b.className = "grid-cell arabic";
      b.type = "button";
      b.setAttribute("aria-pressed", "false");
      setArabicText(b, GLYPHS[gid].char);
      b.addEventListener("click", function () {
        var on = b.getAttribute("aria-pressed") === "true";
        b.setAttribute("aria-pressed", on ? "false" : "true");
        var p = marked.indexOf(gid);
        if (on && p !== -1) marked.splice(p, 1);
        if (!on && p === -1) marked.push(gid);
      });
      grid.appendChild(b);
    });
    wrap.appendChild(grid);
    /* Die Hauptaktion sitzt in allen Views auf derselben Ebene unter der Karte,
       nie einmal innerhalb und einmal ausserhalb. */
    var done = $("btn-stage-next");
    done.hidden = false;
    done.disabled = false;
    done.textContent = t("common.done");
    stageConfirm = (function () {
      var ok = marked.length === step.correct.length &&
        step.correct.every(function (g) { return marked.indexOf(g) !== -1; });
      var cells = grid.querySelectorAll(".grid-cell");
      for (var i = 0; i < cells.length; i++) {
        cells[i].disabled = true;
        var gid = step.options[i];
        var isT = step.correct.indexOf(gid) !== -1;
        var isM = marked.indexOf(gid) !== -1;
        if (isM && isT) cells[i].classList.add("is-correct");
        else if (isM && !isT) cells[i].classList.add("is-wrong");
        else if (!isM && isT) cells[i].classList.add("is-missed");
      }
      stageDone(ok ? "ok" : "attn", ok ? "stage.a.ok" : "stage.a.wrong");
    });
  }

  function renderStageSort(step, byCount) {
    var wrap = $("stage-action");
    var item = { taskType: byCount ? "sortCount" : "sortPos", chars: step.pool };
    var ui = {
      prompt: $("stage-prompt"), task: wrap, feedback: $("stage-feedback"),
      action: $("btn-stage-next")
    };
    ui.action.hidden = false;
    /* renderSort setzt ui.action.onclick; auf der Buehne wird daraus der
       Bestaetigungsschritt des geteilten Knopfes. */
    renderSort(item, ui, function (picked, ok, container, extra) {
      markSortResult(container, item, extra);
      disableTask(wrap);
      stageDone(ok ? "ok" : "attn", ok ? "fb.sortOk" : (byCount ? "stage.b.explain" : "stage.c.explain"));
    });
    /* renderSort haengt seine Auswertung an onclick; auf der Buehne laeuft der
       Knopf ueber stageConfirm, damit er nicht zusaetzlich weiterschaltet. */
    stageConfirm = ui.action.onclick;
    ui.action.onclick = null;
  }

  function renderStageConfront(step) {
    var wrap = $("stage-action");
    var row = document.createElement("div");
    row.className = "choices choices-text";
    [["stage.b.confrontNo", true], ["stage.b.confrontYes", false]].forEach(function (o) {
      var b = document.createElement("button");
      b.className = "choice choice-text";
      b.type = "button";
      b.textContent = t(o[0]);
      b.addEventListener("click", function () {
        var btns = row.querySelectorAll("button");
        for (var i = 0; i < btns.length; i++) btns[i].disabled = true;
        b.classList.add(o[1] ? "is-correct" : "is-wrong");
        stageDone(o[1] ? "ok" : "attn", o[1] ? "stage.b.confrontOk" : "stage.b.confrontWrong");
      });
      row.appendChild(b);
    });
    wrap.appendChild(row);
  }

  function advanceStage() {
    state.session.stageStep++;
    persistState();
    if (state.session.stageStep >= STAGE_STEPS.length) startPractice();
    else renderStage();
  }

  /* ======================================================================
     12. VIEW: UEBUNG / CHALLENGE / AUFLOESUNG / FOLGETAG
     ====================================================================== */

  function uiFor(stage) {
    var p = stage === "nextday" ? "nextday" : "practice";
    return {
      prompt: $(p + "-prompt"), task: $(p + "-task"), feedback: $(p + "-feedback"),
      action: $("btn-" + p + "-action"), fill: $(p + "-fill"), count: $(p + "-count")
    };
  }

  function startPractice() {
    state.session = {
      stage: "practice", index: 0,
      queue: buildQueue(PRACTICE_PLAN, "today", state.startLevel),
      stageStep: STAGE_STEPS.length, pending: null, remediated: {}
    };
    persistState();
    showView("practice");
    renderItemView();
  }

  /* Reine Anzeige, bewusst ohne Pillenform: die Segmentknoepfe der Kopfzeile
     sehen tippbar aus, die Stufenanzeige darf das nicht. */
  function renderLevelBar(level, mode) {
    var bar = $("practice-levels");
    clear(bar);
    if (mode === "review") { bar.hidden = true; return; }
    bar.hidden = false;
    for (var i = 1; i <= 3; i++) {
      var seg = document.createElement("span");
      seg.className = "level-seg" + (i === level ? " is-active" : (i < level ? " is-done" : ""));
      seg.setAttribute("aria-hidden", "true");
      bar.appendChild(seg);
    }
    var label = document.createElement("span");
    label.className = "level-text";
    label.textContent = fill(t("level.aria"), { n: level });
    bar.appendChild(label);
  }

  function renderItemView() {
    var s = state.session;
    var isNextday = s.stage === "nextday";
    var ui = uiFor(s.stage);
    var item = s.queue[s.index];
    if (!item) { advanceStageFlow(); return; }

    if (!isNextday) {
      var label = t("practice.mode." + (s.stage === "challenge" ? "challenge" : s.stage === "review" ? "review" : "practice"));
      if (item.remedial) label += " · " + t("practice.remedialTag");
      $("practice-mode-label").textContent = label;
      renderLevelBar(item.level, s.stage);
    }

    setMeter(ui.fill, ui.count, s.index + 1, s.queue.length);
    hideFeedback(ui.feedback);
    ui.action.onclick = null;
    ui.action.disabled = false;

    if (s.stage === "review" && s.index === 0) setFeedback(ui.feedback, "", t("review.intro"), {});

    var answered = !!(s.pending && s.pending.qid === item.qid);
    var handler = function (picked, ok, container, extra) {
      onItemAnswer(item, picked, ok, container, ui, extra);
    };

    if (item.taskType === "flash") renderFlash(item, ui, handler, answered);
    else if (item.taskType === "grid") renderGrid(item, ui, handler);
    else if (item.taskType === "sortCount" || item.taskType === "sortPos") renderSort(item, ui, handler);
    else if (item.taskType === "construct") renderConstruct(item, ui, handler);
    else renderPair(item, ui, handler);

    if (answered) restorePending(item, ui);
    else focusEl(ui.prompt);
  }

  function restorePending(item, ui) {
    var p = state.session.pending;
    disableTask(ui.task);
    if (p.template) setFeedback(ui.feedback, p.correct ? "ok" : "attn", p.template, p.params || {});
    else hideFeedback(ui.feedback);
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
    var answer = recordAnswer(item, picked, ok);
    disableTask(ui.task);

    var silent = state.session.stage === "challenge";
    var template = null, params = null;

    if (!silent) {
      var g = GLYPHS[item.letterId];
      params = { char: g.char, desc: t("desc." + item.letterId) };

      if (item.taskType === "grid") {
        markGridResult(container, item, extra);
        params.rule = t(item.rule.key);
        if (ok) template = t("fb.gridOk");
        else {
          var wrongMarks = extra.marked.filter(function (i) { return !matchesRule(item.cells[i], item.rule); });
          if (wrongMarks.length) {
            template = t("fb.gridWrong");
            params.list = wrongMarks.map(function (i) { return t("name." + item.cells[i]); }).join(", ");
          } else {
            template = t("fb.gridMissed");
            params.n = extra.targetIdx.length - extra.marked.length;
          }
        }
      } else if (item.taskType === "sortCount" || item.taskType === "sortPos") {
        markSortResult(container, item, extra);
        if (ok) template = t("fb.sortOk");
        else {
          template = t("fb.sortWrong");
          params.list = extra.wrong.map(function (gid) { return t("name." + gid); }).join(", ");
        }
      } else if (item.taskType === "construct") {
        if (ok) template = t("fb.constructOk");
        else {
          template = t("fb.constructWrong");
          params.name = t("name." + item.letterId);
        }
      } else if (ok) {
        template = t("fb.correct");
        markChoice(container, item, picked, true);
      } else {
        markChoice(container, item, picked, false);
        var pickedId = answer.confusedWith;
        if (pickedId && findPair(item.letterId, pickedId)) {
          pairFeedback(ui.feedback, item.letterId, pickedId);
          template = null;
        } else {
          var pg = item.pickKind === "glyph" ? glyphOf(picked) : null;
          if (pg && !pg.taught) template = t("fb.untrained");
          else template = feedbackTemplate(classifySinglePick(item.letterId, item.pickKind, picked));
        }
      }
      if (template) setFeedback(ui.feedback, ok ? "ok" : "attn", template, params);
      if (!ok && !reducedMotion && container) container.classList.add("shake");
    } else {
      hideFeedback(ui.feedback);
      if (item.taskType === "grid") markGridResultNeutral(container, extra);
    }

    /* Adaptive Nachuebung nur im Uebungsmodus: keine sofortige identische
       Wiederholung, sondern eine leichtere Aufgabe in anderer Form spaeter. */
    if (!ok && state.session.stage === "practice") {
      applyRemediation(item, answer);
    }

    state.session.pending = { qid: item.qid, correct: ok, template: template, params: params };
    persistState();

    ui.action.hidden = false;
    ui.action.disabled = false;
    ui.action.textContent = t("common.next");
    ui.action.onclick = nextItem;
  }

  function applyRemediation(item, answer) {
    var s = state.session;
    var plan = planRemediation(s.queue, s.index, {
      letterId: item.letterId, taskType: item.taskType, level: item.level,
      confusedWith: answer.confusedWith, needsDiagnosis: answer.needsDiagnosis
    }, s.remediated);
    if (!plan.added.length) return;
    s.remediated[item.letterId] = (s.remediated[item.letterId] || 0) + 1;
    /* Von hinten einfuegen, damit die frueheren Indizes gueltig bleiben. */
    plan.added.sort(function (a, b) { return b.at - a.at; });
    plan.added.forEach(function (ins) {
      var seq = s.queue.length + 1;
      var newItem = makeItem({
        letterId: ins.spec.letterId, taskType: ins.spec.taskType, pair: ins.spec.pair,
        level: ins.spec.level, remedial: true, diagnose: ins.spec.diagnose
      }, "today", "r" + seq);
      var at = Math.min(ins.at, s.queue.length);
      /* Nie unmittelbar nach demselben Zeichen einsortieren. */
      while (at < s.queue.length && s.queue[at - 1] && s.queue[at - 1].letterId === newItem.letterId) at++;
      s.queue.splice(at, 0, newItem);
    });
  }

  function markChoice(container, item, picked, ok) {
    if (!container) return;
    var btns = container.querySelectorAll("button");
    for (var i = 0; i < btns.length; i++) {
      var b = btns[i];
      var val = b.getAttribute("data-glyph");
      if (!val) continue;
      if (val === item.letterId) { b.classList.add("is-correct"); appendMark(b, t("mark.correct")); }
      else if (val === picked && !ok) { b.classList.add("is-wrong"); appendMark(b, t("mark.wrong")); }
    }
  }

  function appendMark(btn, text) {
    var s = document.createElement("span");
    s.className = "choice-mark";
    s.textContent = text;
    btn.appendChild(s);
  }

  function markGridResult(grid, item, extra) {
    var cells = grid.querySelectorAll(".grid-cell");
    for (var i = 0; i < cells.length; i++) {
      var isTarget = matchesRule(item.cells[i], item.rule);
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

  /* In der Challenge wird nichts aufgeloest – nur die eigene Auswahl bleibt
     sichtbar, ohne Bewertung. */
  function markGridResultNeutral(grid, extra) {
    var cells = grid.querySelectorAll(".grid-cell");
    for (var i = 0; i < cells.length; i++) {
      if (extra && extra.marked.indexOf(i) !== -1) cells[i].setAttribute("aria-pressed", "true");
    }
  }

  function markSortResult(binsWrap, item, extra) {
    var byCount = extra.byCount;
    var bins = binsWrap.querySelectorAll(".sort-bin");
    for (var i = 0; i < bins.length; i++) {
      var key = bins[i].getAttribute("data-bin");
      var slot = bins[i].querySelector(".sort-bin-slot");
      var wrongHere = item.chars.filter(function (gid) {
        var want = byCount ? String(GLYPHS[gid].dots) : GLYPHS[gid].pos;
        return extra.placed[gid] === key && want !== key;
      });
      var rightHere = item.chars.filter(function (gid) {
        var want = byCount ? String(GLYPHS[gid].dots) : GLYPHS[gid].pos;
        return extra.placed[gid] === key && want === key;
      });
      if (wrongHere.length) bins[i].classList.add("is-wrong");
      else if (rightHere.length) bins[i].classList.add("is-correct");
      if (slot && (wrongHere.length || rightHere.length)) {
        var sr = document.createElement("span");
        sr.className = "sr-only";
        sr.textContent = " " + t(wrongHere.length ? "mark.wrong" : "mark.correct");
        slot.appendChild(sr);
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
      state.session = {
        stage: "challenge", index: 0,
        queue: buildQueue(CHALLENGE_PLAN, "today", state.startLevel),
        stageStep: s.stageStep, pending: null, remediated: s.remediated
      };
      persistState();
      renderItemView();
      return;
    }
    if (s.stage === "challenge") {
      var rq = buildReviewQueue();
      if (rq.length) {
        state.session = { stage: "review", index: 0, queue: rq, stageStep: s.stageStep, pending: null, remediated: s.remediated };
        persistState();
        renderItemView();
      } else {
        finishLesson();
      }
      return;
    }
    if (s.stage === "review") { finishLesson(); return; }
    if (s.stage === "nextday") { finishNextday(); return; }
    showView("start");
    renderStart();
  }

  /* Auflösung der Challenge: je Fehlermuster hoechstens eine kurze
     Korrekturaufgabe – eine Liste allein korrigiert nichts. */
  function buildReviewQueue() {
    var i, a;
    /* Zuerst das Zeichen mit den meisten noch unbestimmten Fehlern: es bekommt
       das Diagnosepaar (Anzahl, dann Position) und wird dadurch einer der drei
       Kategorien zugeordnet, statt als "nicht zuzuordnen" stehen zu bleiben. */
    var openCounts = {}, worst = null, worstN = 0;
    for (i = 0; i < state.answers.length; i++) {
      a = state.answers[i];
      if (a.scope !== "today" || a.correct || a.taskType === "name" || a.category) continue;
      openCounts[a.letterId] = (openCounts[a.letterId] || 0) + 1;
      if (openCounts[a.letterId] > worstN) { worst = a.letterId; worstN = openCounts[a.letterId]; }
    }

    var plan = [];
    if (worst) {
      plan.push({ letterId: worst, taskType: "sortCount", level: 1, remedial: true, diagnose: "count" });
      plan.push({ letterId: worst, taskType: "sortPos", level: 1, remedial: true, diagnose: "position" });
    }

    var seen = {};
    for (i = 0; i < state.answers.length && plan.length < 4; i++) {
      a = state.answers[i];
      if (a.scope !== "today" || a.correct || a.taskType === "name" || !a.category) continue;
      var key = a.letterId + "|" + a.category;
      if (seen[key]) continue;
      seen[key] = true;
      var form = a.category === "dot_count_confusion" ? "sortCount"
        : a.category === "dot_position_confusion" ? "sortPos" : "grid";
      plan.push({ letterId: a.letterId, taskType: form, level: 1, remedial: true });
    }
    return buildQueue(plan.slice(0, 4), "today", 1);
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
    refreshLetterStates("today");
    var rank = { not_yet: 0, wobbly: 1, today_secure: 2, overnight_secure: 3 };
    var order = TARGETS.slice().sort(function (a, b) {
      return (rank[letters[a].status] || 0) - (rank[letters[b].status] || 0);
    });
    /* Die schwaechsten zwei bis drei Zeichen zuerst, je zwei verschiedene
       Aufgabenformen, hoechstens acht Items – keine vollstaendige Lektion. */
    var focus = order.slice(0, 3);
    var plan = [];
    focus.forEach(function (lid) { plan.push({ letterId: lid, taskType: "flash", level: 2 }); });
    focus.forEach(function (lid) {
      plan.push({
        letterId: lid,
        taskType: lid === "alif" ? "sortPos" : "construct",
        level: 2
      });
    });
    plan.push({ letterId: order[3], taskType: "flash", level: 2 });
    plan.push({ letterId: order[4], taskType: "grid", level: 2 });

    /* Verschraenken, damit kein Zeichen zweimal hintereinander drankommt. */
    var woven = [];
    for (var i = 0; i < plan.length; i++) {
      if (woven.length && woven[woven.length - 1].letterId === plan[i].letterId) {
        var moved = plan.splice(i, 1)[0];
        plan.push(moved);
        i--;
        if (plan.length > 20) break;
        continue;
      }
      woven.push(plan[i]);
    }
    state.session = {
      stage: "nextday", index: 0, queue: buildQueue(woven.slice(0, 8), "nextday", 2),
      stageStep: STAGE_STEPS.length, pending: null, remediated: {}
    };
    persistState();
    showView("nextday");
    renderItemView();
  }

  function finishNextday() {
    state.nextdayDoneDate = todayLocal();
    state.nextdayGapDays = state.dueDate ? daysBetween(state.dueDate, state.nextdayDoneDate) : null;
    state.dueDate = null;
    state.session.stage = "resultNextday";
    state.session.queue = [];
    state.session.index = 0;
    state.session.pending = null;
    persistState();
    showView("result");
    renderResult("nextday");
  }

  /* ======================================================================
     13. VIEW: ERGEBNIS
     ====================================================================== */

  function renderResult(scope) {
    refreshLetterStates(scope);
    var isNextday = scope === "nextday";
    var secure = 0;
    TARGETS.forEach(function (id) { if (letters[id].status === "today_secure") secure++; });
    var passed = !isNextday && letters.ba.status === "today_secure" && letters.ta.status === "today_secure";

    $("result-title").textContent = isNextday ? t("nextday.resultTitle")
      : (passed ? t("result.passed") : t("result.notPassed"));
    $("result-lead").hidden = isNextday;
    $("result-lead").textContent = isNextday ? "" : (passed ? t("result.leadPassed") : t("result.leadNotPassed"));

    var errs = errorsByLetter(scope);
    var list = $("result-list");
    clear(list);
    /* Der ausfuehrliche Erklaersatz steht nur einmal je Zustand. Sechsmal
       wortgleich untereinander liest sich wie eine unbefuellte Vorlage. */
    var dimCount = {};
    TARGETS.forEach(function (id) {
      var d = letters[id].strongestDimension;
      if (d) dimCount[d] = (dimCount[d] || 0) + 1;
    });
    commonDimension = false;
    for (var dk in dimCount) {
      if (Object.prototype.hasOwnProperty.call(dimCount, dk) && dimCount[dk] > 2) commonDimension = true;
    }

    var explained = [];
    TARGETS.forEach(function (id) {
      var ls = letters[id];
      var withText = explained.indexOf(ls.status) === -1;
      if (withText) explained.push(ls.status);
      list.appendChild(resultCard(ls, scope, errs, withText));
    });

    renderErrorSummary(scope);

    var pc = $("result-precheck");
    if (isNextday || !state.precheck.length) pc.hidden = true;
    else {
      var n = 0;
      state.precheck.forEach(function (p) { if (p.correct) n++; });
      pc.hidden = false;
      pc.textContent = fill(t("precheck.compare"), { n: n, total: state.precheck.length });
    }

    var nd = $("result-nextday");
    if (isNextday) nd.textContent = t("result.nextdayDone");
    else if (!storageOk) nd.textContent = t("result.nextdayNoStorage");
    else nd.textContent = fill(t("result.nextday"), { date: formatDate(state.dueDate) });
  }

  var commonDimension = false;

  function resultCard(ls, scope, errs, withText) {
    var card = document.createElement("div");
    card.className = "result-item";
    card.setAttribute("data-status", ls.status);

    var head = document.createElement("div");
    head.className = "result-head";
    head.appendChild(arabicSpan(GLYPHS[ls.letterId].char, "result-char"));
    var st = document.createElement("span");
    st.className = "result-status";
    st.textContent = t("status." + ls.status);
    head.appendChild(st);
    card.appendChild(head);

    if (withText) {
      var p = document.createElement("p");
      p.className = "muted-text";
      var sentence = progressSentence(ls, settings.lang);
      if (ls.status === "overnight_secure" && scope === "nextday" && state.nextdayGapDays > 0) {
        sentence = t("progress.overnight_secure_later");
      }
      p.textContent = sentence;
      card.appendChild(p);
    }

    var facts = document.createElement("ul");
    facts.className = "result-facts";
    /* Eine Merkmalszeile, die auf fast allen Karten gleich lautet, ist keine
       Diagnose. Sie erscheint nur, wenn sie dieses Zeichen unterscheidet. */
    if (ls.strongestDimension && !commonDimension) {
      facts.appendChild(fact(fill(t("result.strong"), { dim: t("dim." + ls.strongestDimension) })));
    }
    if (ls.topConfusion) {
      var li = document.createElement("li");
      renderSentence(li, t("result.confusion"),
        { char: GLYPHS[ls.topConfusion].char, n: ls.topConfusionCount });
      facts.appendChild(li);
    }
    /* Die Empfehlung steht dort, wo sie etwas beitraegt. Bei einem sicheren
       Zeichen ohne Fehler waere sie sechsmal derselbe Satz ohne Aussage. */
    var hasErrors = errs && errs[ls.letterId];
    var secure = ls.status === "today_secure" || ls.status === "overnight_secure";
    if (hasErrors || !secure) {
      facts.appendChild(fact(fill(t("result.recommend"), { form: t("form." + recommendedForm(ls, errs)) })));
    }
    card.appendChild(facts);
    return card;
  }

  function fact(text) {
    var li = document.createElement("li");
    li.textContent = text;
    return li;
  }

  function renderErrorSummary(scope) {
    var counts = { shape_confusion: 0, dot_count_confusion: 0, dot_position_confusion: 0, unresolved: 0 };
    var any = false;
    for (var i = 0; i < state.answers.length; i++) {
      var a = state.answers[i];
      if (a.scope !== scope || a.correct || a.taskType === "name") continue;
      if (a.category) counts[a.category]++; else counts.unresolved++;
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
     14. HINWEISE UND EINSTELLUNGEN
     ====================================================================== */

  function renderNextdayOffer() {
    var today = todayLocal();
    var due = !!state.dueDate && isDue(state.dueDate, today) && state.nextdayDoneDate !== today;
    $("nextday-offer").hidden = !due;
    return due;
  }

  function renderStorageWarning() { $("storage-warning").hidden = storageOk; }

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
    if ($("view-start").classList.contains("active")) renderStart();
    else if ($("view-precheck").classList.contains("active")) renderPrecheck();
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
    showView("start");
    renderStart();
  }

  /* ======================================================================
     15. START
     ====================================================================== */

  function restoreView() {
    var s = state.session;
    if (s.stage === "precheck") { showView("precheck"); renderPrecheck(); return; }
    if (s.stage === "stage") { showView("stage"); renderStage(); return; }
    if (s.stage === "practice" || s.stage === "challenge" || s.stage === "review") {
      showView("practice"); renderItemView(); return;
    }
    if (s.stage === "nextday") { showView("nextday"); renderItemView(); return; }
    if (s.stage === "result") { showView("result"); renderResult("today"); return; }
    if (s.stage === "resultNextday") { showView("result"); renderResult("nextday"); return; }
    showView("start");
    renderStart();
  }

  function wire() {
    $("btn-start-lesson").addEventListener("click", startPrecheck);
    $("btn-restart-lesson").addEventListener("click", startPrecheck);
    $("btn-precheck-unknown").addEventListener("click", function () {
      var item = state.session.queue[state.session.index];
      if (item) answerPrecheck(item, "unknown");
    });
    $("btn-stage-next").addEventListener("click", function () {
      if (stageConfirm) { var fn = stageConfirm; stageConfirm = null; fn(); return; }
      advanceStage();
    });
    $("btn-open-nextday").addEventListener("click", startNextday);
    $("btn-result-home").addEventListener("click", function () {
      if (state.session.stage === "result") state.session.stage = "done";
      persistState();
      showView("start");
      renderStart();
    });
    $("btn-clear-data").addEventListener("click", clearAllLocalData);
    $("btn-to-overview").addEventListener("click", function () {
      /* Ausstieg ohne Fortschrittsverlust: der Zustand ist bereits persistiert,
         restoreView bringt die Lektion an derselben Stelle zurueck. */
      showView("start");
      renderStart();
    });

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
    if (!document.getElementById("view-start")) return;   /* tests.html: nur reine Funktionen */
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

  window.IqraPure = {
    GLYPHS: GLYPHS, TARGETS: TARGETS, MINIMAL_PAIRS: MINIMAL_PAIRS,
    DISTRACTORS: DISTRACTORS, TASK_TYPES: TASK_TYPES, STAGE_STEPS: STAGE_STEPS,
    PRACTICE_PLAN: PRACTICE_PLAN, CHALLENGE_PLAN: CHALLENGE_PLAN, PRECHECK_PLAN: PRECHECK_PLAN,
    I18N: I18N, SCHEMA_VERSION: SCHEMA_VERSION,
    classifyError: classifyError, resolveDiagnosis: resolveDiagnosis,
    computeLetterState: computeLetterState, isTodaySecure: isTodaySecure,
    isOvernightSecure: isOvernightSecure, formGroup: formGroup,
    todayLocal: todayLocal, nextDueDate: nextDueDate, isDue: isDue,
    buildDistractors: buildDistractors, buildGrid: buildGrid, gridRuleFor: gridRuleFor,
    matchesRule: matchesRule, buildSortItem: buildSortItem,
    traitCodeOf: traitCodeOf, letterByTrait: letterByTrait, findPair: findPair, pairKey: pairKey,
    planRemediation: planRemediation, pickPairFor: pickPairFor,
    startLevelFrom: startLevelFrom, levelForBlock: levelForBlock,
    dimensionOf: dimensionOf, recommendedForm: recommendedForm,
    progressSentence: progressSentence, migrateState: migrateState,
    emptyState: emptyState, normalizeSession: normalizeSession
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
