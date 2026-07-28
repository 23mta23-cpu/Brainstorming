(function () {
  "use strict";

  var I18N = {
    de: {
      "welcome.badge": "Interaktiver Prototyp",
      "welcome.headline": "Lerne Qur'an lesen – Schritt für Schritt und in deinem Tempo.",
      "welcome.subtext": "Ein strukturierter Lernweg für Erwachsene – ohne Druck, ohne kindliche Gestaltung und ohne endloses Scrollen.",
      "welcome.cta": "Lernweg starten",

      "language.title": "Sprache auswählen",

      "situation.title": "Wie ist deine Ausgangssituation?",
      "situation.new": "Ich beginne ganz neu",
      "situation.some": "Ich kenne einige Buchstaben",
      "situation.refresh": "Ich habe früher gelernt und möchte wiederholen",
      "situation.convert": "Ich bin konvertiert und suche Orientierung",
      "situation.convertHint": "Dieser Lernweg wird aktuell separat validiert.",

      "goal.title": "Was möchtest du erreichen?",
      "goal.letters": "Arabische Buchstaben sicher erkennen",
      "goal.connect": "Buchstaben miteinander verbinden",
      "goal.words": "Erste Wörter lesen",
      "goal.refresh": "Meine Kenntnisse auffrischen",
      "goal.quran": "Später Qur'anpassagen lesen",
      "goal.cta": "Meinen Lernweg erstellen",

      "dashboard.greeting": "Willkommen zurück",
      "dashboard.today": "Heute: 5 Minuten · 3 Buchstaben",
      "dashboard.stageLabel": "Aktuelle Lernstufe",
      "dashboard.stageValue": "Elifba-Einstieg",
      "dashboard.cta": "Heute weiterlernen",
      "dashboard.pathTitle": "Dein Lernweg",
      "dashboard.repeatTitle": "Wiederholen",

      "path.title": "Dein Lernweg",
      "path.more": "Weitere Module folgen.",
      "path.goalPrefix": "Aktuelles Lernziel: ",

      "module.letters": "Arabische Buchstaben",
      "module.connect": "Buchstaben verbinden",
      "module.words": "Erste Wörter lesen",
      "module.statusActive": "Aktiv",
      "module.statusLocked": "Bald verfügbar",

      "lesson.title": "Alif, Bā und Tā",
      "lesson.audioNote": "Geprüfte Audio-Aussprache folgt in einer späteren Phase.",
      "lesson.alif.name": "Alif",
      "lesson.alif.hint": "Ein senkrechter Strich ohne Verbindung zum nächsten Buchstaben.",
      "lesson.ba.name": "Bā",
      "lesson.ba.hint": "Ein liegender Bogen mit einem Punkt darunter.",
      "lesson.ta.name": "Tā",
      "lesson.ta.hint": "Ähnliche Form wie Bā, aber mit zwei Punkten darüber.",

      "exercise.question": "Welcher Buchstabe ist Bā?",
      "exercise.correct": "Richtig – das ist Bā.",
      "exercise.incorrect": "Noch nicht. Schau dir die Form noch einmal an.",

      "complete.title": "Lektion abgeschlossen",
      "complete.text": "Du hast heute drei Buchstaben kennengelernt.",
      "complete.demoLabel": "Demo-Fortschritt",
      "complete.repeat": "Kurz wiederholen",
      "complete.home": "Zur Startseite",

      "progress.title": "Fortschritt",
      "progress.demoTag": "Demo-Daten",
      "progress.lettersLabel": "Erkannte Buchstaben",
      "progress.lessonsLabel": "Absolvierte Lektionen",
      "progress.timeLabel": "Lernzeit",
      "progress.nextLabel": "Nächstes Ziel",
      "progress.nextValue": "Buchstabenformen unterscheiden",
      "progress.minutesUnit": "Minuten",
      "progress.of28": " von 28",

      "settings.title": "Einstellungen",
      "settings.language": "Sprache ändern",
      "settings.appearance": "Erscheinungsbild",
      "settings.light": "Hell",
      "settings.dark": "Dunkel",
      "settings.system": "System",
      "settings.goalTitle": "Lernziel",
      "settings.changeGoal": "Lernziel ändern",
      "settings.progressTitle": "Demo-Fortschritt",
      "settings.resetProgress": "Demo-Fortschritt zurücksetzen",
      "settings.privacyNote": "Dieser Prototyp speichert Einstellungen ausschließlich lokal auf diesem Gerät.",

      "footer.note": "Prototyp – Lerninhalte und religiöse Einordnungen sind noch nicht fachlich freigegeben.",

      "nav.learn": "Lernen",
      "nav.path": "Lernweg",
      "nav.progress": "Fortschritt",
      "nav.settings": "Einstellungen",

      "common.next": "Weiter"
    },
    tr: {
      "welcome.badge": "Etkileşimli prototip",
      "welcome.headline": "Kur'an okumayı adım adım, kendi hızında öğren.",
      "welcome.subtext": "Yetişkinler için yapılandırılmış bir öğrenme yolu – baskı olmadan, çocuksu bir tasarım olmadan ve sonsuz kaydırma olmadan.",
      "welcome.cta": "Öğrenme yolunu başlat",

      "language.title": "Dil seçin",

      "situation.title": "Başlangıç durumun nedir?",
      "situation.new": "Tamamen yeni başlıyorum",
      "situation.some": "Bazı harfleri biliyorum",
      "situation.refresh": "Daha önce öğrendim ve tekrar etmek istiyorum",
      "situation.convert": "İhtida ettim ve yönelim arıyorum",
      "situation.convertHint": "Bu öğrenme yolu şu anda ayrı olarak değerlendiriliyor.",

      "goal.title": "Neyi başarmak istiyorsun?",
      "goal.letters": "Arap harflerini güvenle tanımak",
      "goal.connect": "Harfleri birbirine bağlamak",
      "goal.words": "İlk kelimeleri okumak",
      "goal.refresh": "Bilgilerimi tazelemek",
      "goal.quran": "İleride Kur'an bölümleri okumak",
      "goal.cta": "Öğrenme yolumu oluştur",

      "dashboard.greeting": "Tekrar hoş geldin",
      "dashboard.today": "Bugün: 5 dakika · 3 harf",
      "dashboard.stageLabel": "Mevcut seviye",
      "dashboard.stageValue": "Elifba başlangıcı",
      "dashboard.cta": "Bugün öğrenmeye devam et",
      "dashboard.pathTitle": "Öğrenme yolun",
      "dashboard.repeatTitle": "Tekrar et",

      "path.title": "Öğrenme yolun",
      "path.more": "Diğer modüller yakında eklenecek.",
      "path.goalPrefix": "Mevcut öğrenme hedefi: ",

      "module.letters": "Arap harfleri",
      "module.connect": "Harfleri birleştirme",
      "module.words": "İlk kelimeleri okuma",
      "module.statusActive": "Aktif",
      "module.statusLocked": "Yakında",

      "lesson.title": "Elif, Bā ve Tā",
      "lesson.audioNote": "Onaylanmış sesli telaffuz daha sonraki bir aşamada eklenecektir.",
      "lesson.alif.name": "Elif",
      "lesson.alif.hint": "Sonraki harfe bağlanmayan dikey bir çizgi.",
      "lesson.ba.name": "Bā",
      "lesson.ba.hint": "Altında bir nokta olan yatay bir kavis.",
      "lesson.ta.name": "Tā",
      "lesson.ta.hint": "Bā ile benzer şekil, ancak üzerinde iki nokta.",

      "exercise.question": "Bā harfi hangisidir?",
      "exercise.correct": "Doğru – bu Bā.",
      "exercise.incorrect": "Henüz değil. Şekle tekrar bak.",

      "complete.title": "Ders tamamlandı",
      "complete.text": "Bugün üç harf öğrendin.",
      "complete.demoLabel": "Demo ilerleme",
      "complete.repeat": "Kısaca tekrar et",
      "complete.home": "Ana sayfaya dön",

      "progress.title": "İlerleme",
      "progress.demoTag": "Demo veriler",
      "progress.lettersLabel": "Tanınan harfler",
      "progress.lessonsLabel": "Tamamlanan dersler",
      "progress.timeLabel": "Öğrenme süresi",
      "progress.nextLabel": "Sıradaki hedef",
      "progress.nextValue": "Harf şekillerini ayırt etmek",
      "progress.minutesUnit": "dakika",
      "progress.of28": " / 28",

      "settings.title": "Ayarlar",
      "settings.language": "Dili değiştir",
      "settings.appearance": "Görünüm",
      "settings.light": "Açık",
      "settings.dark": "Koyu",
      "settings.system": "Sistem",
      "settings.goalTitle": "Öğrenme hedefi",
      "settings.changeGoal": "Öğrenme hedefini değiştir",
      "settings.progressTitle": "Demo ilerleme",
      "settings.resetProgress": "Demo ilerlemeyi sıfırla",
      "settings.privacyNote": "Bu prototip, ayarları yalnızca bu cihazda yerel olarak saklar.",

      "footer.note": "Prototip – Öğrenme içerikleri ve dini değerlendirmeler henüz uzman onayından geçmemiştir.",

      "nav.learn": "Öğren",
      "nav.path": "Yol",
      "nav.progress": "İlerleme",
      "nav.settings": "Ayarlar",

      "common.next": "İleri"
    }
  };

  var LETTERS = [
    { char: "ا", nameKey: "lesson.alif.name", hintKey: "lesson.alif.hint" },
    { char: "ب", nameKey: "lesson.ba.name", hintKey: "lesson.ba.hint" },
    { char: "ت", nameKey: "lesson.ta.name", hintKey: "lesson.ta.hint" }
  ];
  var CORRECT_LETTER = "ب";
  var NAV_VIEWS = ["dashboard", "path", "progress", "settings"];

  var state = {
    lang: "de",
    theme: "system",
    situation: null,
    goal: null,
    lessonStep: 0,
    exerciseSolved: false,
    progress: { letters: 0, lessons: 0, minutes: 0 }
  };

  function loadPersisted() {
    try {
      var raw = localStorage.getItem("iqraProtoSettings");
      if (raw) {
        var saved = JSON.parse(raw);
        if (saved.lang === "de" || saved.lang === "tr") state.lang = saved.lang;
        if (saved.theme === "light" || saved.theme === "dark" || saved.theme === "system") state.theme = saved.theme;
      }
    } catch (e) {
      /* localStorage unavailable — fall back to defaults */
    }
  }

  function persistSettings() {
    try {
      localStorage.setItem("iqraProtoSettings", JSON.stringify({ lang: state.lang, theme: state.theme }));
    } catch (e) {
      /* ignore */
    }
  }

  function t(key) {
    return I18N[state.lang][key] || key;
  }

  function applyI18n() {
    document.documentElement.lang = state.lang;
    var nodes = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < nodes.length; i++) {
      var key = nodes[i].getAttribute("data-i18n");
      nodes[i].textContent = t(key);
    }
    updateGoalSituationSelectionText();
  }

  function applyTheme() {
    if (state.theme === "system") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", state.theme);
    }
    var buttons = document.querySelectorAll("#settings-theme [data-theme-choice]");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].classList.toggle("active", buttons[i].getAttribute("data-theme-choice") === state.theme);
    }
  }

  function updateLangSelectors() {
    var groups = document.querySelectorAll("#settings-lang [data-lang]");
    for (var i = 0; i < groups.length; i++) {
      groups[i].classList.toggle("active", groups[i].getAttribute("data-lang") === state.lang);
    }
  }

  function showView(name) {
    var views = document.querySelectorAll(".view");
    for (var i = 0; i < views.length; i++) {
      views[i].classList.remove("active");
    }
    document.getElementById("view-" + name).classList.add("active");

    var isNavView = NAV_VIEWS.indexOf(name) !== -1;
    var nav = document.getElementById("bottom-nav");
    nav.classList.toggle("visible", isNavView);
    var navBtns = document.querySelectorAll(".nav-btn");
    for (var j = 0; j < navBtns.length; j++) {
      navBtns[j].classList.toggle("active", navBtns[j].getAttribute("data-nav") === name);
    }

    if (name === "dashboard") renderDashboard();
    if (name === "path") renderPath();
    if (name === "lesson") renderLesson();
    if (name === "progress") renderProgress();
    window.scrollTo(0, 0);
  }

  function updateGoalSituationSelectionText() {
    var situationCards = document.querySelectorAll("#situation-list [data-situation]");
    for (var i = 0; i < situationCards.length; i++) {
      situationCards[i].classList.toggle("selected", situationCards[i].getAttribute("data-situation") === state.situation);
    }
    var goalCards = document.querySelectorAll("#goal-list [data-goal]");
    for (var j = 0; j < goalCards.length; j++) {
      goalCards[j].classList.toggle("selected", goalCards[j].getAttribute("data-goal") === state.goal);
    }
    document.getElementById("btn-situation-next").disabled = !state.situation;
    document.getElementById("btn-goal-next").disabled = !state.goal;
    document.getElementById("situation-hint").hidden = state.situation !== "convert";
  }

  function renderDashboard() {
    var fraction = state.progress.letters / 28;
    document.getElementById("repeat-progress-fill").style.width = Math.round(fraction * 100) + "%";
    document.getElementById("repeat-progress-text").textContent =
      state.progress.letters + t("progress.of28") + " · " + t("progress.demoTag");
  }

  function renderPath() {
    var goalText = state.goal ? t("goal." + state.goal) : "–";
    document.getElementById("path-goal-text").textContent = t("path.goalPrefix") + goalText;
  }

  function renderLesson() {
    var letter = LETTERS[state.lessonStep];
    document.getElementById("lesson-letter").textContent = letter.char;
    document.getElementById("lesson-letter-name").textContent = t(letter.nameKey);
    document.getElementById("lesson-letter-hint").textContent = t(letter.hintKey);
    document.getElementById("btn-lesson-next").textContent = t("common.next");
  }

  function renderProgress() {
    document.getElementById("progress-letters").textContent = state.progress.letters + t("progress.of28");
    document.getElementById("progress-lessons").textContent = String(state.progress.lessons);
    document.getElementById("progress-time").textContent = state.progress.minutes + " " + t("progress.minutesUnit");
  }

  function resetExerciseView() {
    state.exerciseSolved = false;
    var choices = document.querySelectorAll(".letter-choice");
    for (var i = 0; i < choices.length; i++) {
      choices[i].classList.remove("correct", "incorrect");
    }
    var feedback = document.getElementById("exercise-feedback");
    feedback.hidden = true;
    feedback.textContent = "";
    document.getElementById("btn-exercise-next").hidden = true;
  }

  function markLessonComplete() {
    state.progress = { letters: 3, lessons: 1, minutes: 5 };
  }

  function resetDemoProgress() {
    state.progress = { letters: 0, lessons: 0, minutes: 0 };
  }

  function setLanguage(lang) {
    state.lang = lang;
    persistSettings();
    applyI18n();
    updateLangSelectors();
  }

  function setTheme(theme) {
    state.theme = theme;
    persistSettings();
    applyTheme();
  }

  function wireEvents() {
    document.getElementById("btn-start").addEventListener("click", function () {
      showView("language");
    });

    var langCards = document.querySelectorAll("#view-language [data-lang]");
    for (var i = 0; i < langCards.length; i++) {
      langCards[i].addEventListener("click", function (e) {
        setLanguage(e.currentTarget.getAttribute("data-lang"));
        showView("situation");
      });
    }

    var situationCards = document.querySelectorAll("#situation-list [data-situation]");
    for (var s = 0; s < situationCards.length; s++) {
      situationCards[s].addEventListener("click", function (e) {
        state.situation = e.currentTarget.getAttribute("data-situation");
        updateGoalSituationSelectionText();
      });
    }
    document.getElementById("btn-situation-next").addEventListener("click", function () {
      showView("goal");
    });

    var goalCards = document.querySelectorAll("#goal-list [data-goal]");
    for (var g = 0; g < goalCards.length; g++) {
      goalCards[g].addEventListener("click", function (e) {
        state.goal = e.currentTarget.getAttribute("data-goal");
        updateGoalSituationSelectionText();
      });
    }
    document.getElementById("btn-goal-next").addEventListener("click", function () {
      showView("dashboard");
    });

    document.getElementById("btn-continue-learning").addEventListener("click", function () {
      state.lessonStep = 0;
      resetExerciseView();
      showView("lesson");
    });
    document.getElementById("module-1").addEventListener("click", function () {
      state.lessonStep = 0;
      resetExerciseView();
      showView("lesson");
    });

    document.getElementById("btn-lesson-next").addEventListener("click", function () {
      if (state.lessonStep < LETTERS.length - 1) {
        state.lessonStep++;
        renderLesson();
      } else {
        resetExerciseView();
        showView("exercise");
      }
    });

    var choiceButtons = document.querySelectorAll(".letter-choice");
    for (var c = 0; c < choiceButtons.length; c++) {
      choiceButtons[c].addEventListener("click", function (e) {
        if (state.exerciseSolved) return;
        var picked = e.currentTarget.getAttribute("data-letter");
        var feedback = document.getElementById("exercise-feedback");
        feedback.hidden = false;
        if (picked === CORRECT_LETTER) {
          state.exerciseSolved = true;
          e.currentTarget.classList.add("correct");
          feedback.textContent = t("exercise.correct");
          document.getElementById("btn-exercise-next").hidden = false;
        } else {
          e.currentTarget.classList.add("incorrect");
          feedback.textContent = t("exercise.incorrect");
        }
      });
    }
    document.getElementById("btn-exercise-next").addEventListener("click", function () {
      markLessonComplete();
      showView("complete");
    });

    document.getElementById("btn-complete-repeat").addEventListener("click", function () {
      state.lessonStep = 0;
      resetExerciseView();
      showView("lesson");
    });
    document.getElementById("btn-complete-home").addEventListener("click", function () {
      showView("dashboard");
    });

    var navButtons = document.querySelectorAll(".nav-btn");
    for (var n = 0; n < navButtons.length; n++) {
      navButtons[n].addEventListener("click", function (e) {
        showView(e.currentTarget.getAttribute("data-nav"));
      });
    }

    var settingsLangButtons = document.querySelectorAll("#settings-lang [data-lang]");
    for (var sl = 0; sl < settingsLangButtons.length; sl++) {
      settingsLangButtons[sl].addEventListener("click", function (e) {
        setLanguage(e.currentTarget.getAttribute("data-lang"));
      });
    }

    var themeButtons = document.querySelectorAll("#settings-theme [data-theme-choice]");
    for (var th = 0; th < themeButtons.length; th++) {
      themeButtons[th].addEventListener("click", function (e) {
        setTheme(e.currentTarget.getAttribute("data-theme-choice"));
      });
    }

    document.getElementById("btn-change-goal").addEventListener("click", function () {
      updateGoalSituationSelectionText();
      showView("goal");
    });

    document.getElementById("btn-reset-progress").addEventListener("click", function () {
      resetDemoProgress();
      renderDashboard();
      renderProgress();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    loadPersisted();
    applyI18n();
    applyTheme();
    updateLangSelectors();
    wireEvents();
    showView("welcome");
  });
})();
