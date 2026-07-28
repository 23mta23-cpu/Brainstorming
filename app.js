(function () {
  "use strict";

  /* ---------- i18n ---------- */

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

      "common.next": "Weiter",
      "common.back": "Zurück",
      "common.demoTag": "Demo",

      "dashboard.greeting": "Willkommen zurück",
      "dashboard.demoNoteShort": "Demo-Inhalte – fachliche Prüfung ausstehend.",
      "dashboard.today0": "Heute: Alif sicher erkennen",
      "dashboard.today1": "Heute: Bā und Tā unterscheiden",
      "dashboard.today2": "Heute: drei Buchstaben wiederholen",
      "dashboard.today3": "Heute: Formen den Namen zuordnen",
      "dashboard.heroLabel": "Heute lernen",
      "dashboard.cta": "Heute weiterlernen",
      "dashboard.pathTitle": "Dein Lernweg",
      "dashboard.pathSubtitle": "Modul 1 · Arabische Buchstaben",
      "dashboard.pathLinkAll": "Gesamten Lernweg ansehen",
      "dashboard.forYouTitle": "Für dich ausgewählt",
      "dashboard.forYouText": "Weiter mit „Formen unterscheiden“",
      "dashboard.forYouCta": "Ansehen",
      "dashboard.mediaPreviewTitle": "Kurze Lernmedien entdecken",
      "dashboard.repeatTitle": "Wiederholen",
      "dashboard.repeatCta": "Jetzt wiederholen",
      "dashboard.statLetters": "Buchstaben",
      "dashboard.statLessons": "Lektionen",
      "dashboard.statMinutes": "Minuten",

      "path.title": "Dein Lernweg",
      "path.more": "Weitere Module folgen.",
      "path.goalPrefix": "Aktuelles Lernziel: ",

      "module.letters": "Arabische Buchstaben",
      "module.connect": "Buchstaben verbinden",
      "module.words": "Erste Wörter lesen",
      "module.statusActive": "Aktiv",
      "module.statusLocked": "Bald verfügbar",

      "lesson.formatLesson": "Lernlektion",
      "lesson.formatMatching": "Visuelle Zuordnung",
      "lesson.formatPreview": "Vorschau",
      "lesson.statusPartial": "Teilweise verfügbar",
      "lesson.statusLocked": "Noch nicht freigeschaltet",

      "lesson.title": "Alif, Bā und Tā",
      "lesson.audioNote": "Geprüfte Audio-Aussprache folgt in einer späteren Phase.",
      "lesson.demoHint": "Demo-Inhalt – fachliche Prüfung ausstehend.",
      "lesson.progress": "{n} von 3",
      "lesson.alif.name": "Alif",
      "lesson.alif.hint": "Ein senkrechter Strich ohne Verbindung zum nächsten Buchstaben.",
      "lesson.ba.name": "Bā",
      "lesson.ba.hint": "Ein liegender Bogen mit einem Punkt darunter.",
      "lesson.ta.name": "Tā",
      "lesson.ta.hint": "Ähnliche Form wie Bā, aber mit zwei Punkten darüber.",

      "exercise.eyebrow": "Übung",
      "exercise.correctPrefix": "Richtig – das ist ",
      "exercise.incorrect": "Noch nicht. Schau dir die Form noch einmal an.",

      "qb.p.nameToChar.alif": "Welcher Buchstabe ist Alif?",
      "qb.p.nameToChar.ba": "Welcher Buchstabe ist Bā?",
      "qb.p.nameToChar.ta": "Welcher Buchstabe ist Tā?",
      "qb.p.charToName": "Wie heißt dieser Buchstabe?",
      "qb.p.trait.alif": "Welcher Buchstabe hat keinen Punkt?",
      "qb.p.trait.ba": "Welcher Buchstabe hat einen Punkt darunter?",
      "qb.p.trait.ta": "Welcher Buchstabe hat zwei Punkte darüber?",
      "qb.p.dotCount.alif": "Wie viele Punkte hat Alif?",
      "qb.p.dotCount.ba": "Wie viele Punkte hat Bā?",
      "qb.p.dotCount.ta": "Wie viele Punkte hat Tā?",
      "qb.dotCount.none": "Kein Punkt",
      "qb.dotCount.one": "Ein Punkt",
      "qb.dotCount.two": "Zwei Punkte",
      "qb.p.oddOneOut.alif": "Welches Zeichen hat als einziges keine Punkte?",
      "qb.p.oddOneOut.ba": "Welches Zeichen hat einen Punkt unten statt oben?",
      "qb.p.oddOneOut.ta": "Welches Zeichen hat zwei Punkte statt einem oder keinem?",
      "qb.p.matchTrait.alif": "Welches Merkmal passt zu ا؟",
      "qb.p.matchTrait.ba": "Welches Merkmal passt zu ب؟",
      "qb.p.matchTrait.ta": "Welches Merkmal passt zu ت؟",
      "qb.p.flash": "Welcher Buchstabe wurde gerade gezeigt?",
      "qb.flash.watch": "Schau genau hin …",

      "round.questionOf": "Frage {n} von {total}",
      "round.score": "Punkte: {n}",
      "round.resultCorrect": "richtig",
      "round.resultRetry": "noch einmal wiederholen",
      "round.summaryTitle": "Auswertung",
      "round.summaryScore": "{score} von {total} richtig",
      "round.newRound": "Neue Übungsrunde",
      "round.retryWrong": "Fehler wiederholen",

      "media.videoLabel": "Video",
      "media.animatedLabel": "Animiertes Lernmedium",

      "complete.demoLabel": "Demo-Fortschritt",
      "complete.home": "Zur Startseite",

      "lesson2.title": "Formen unterscheiden",
      "lesson2.instructions": "Ordne jeden Buchstaben seinem Merkmal zu.",
      "lesson2.demoNote": "Demo – teilweise verfügbar, fachliche Prüfung ausstehend.",
      "lesson2.retry": "Nicht ganz. Versuch es noch einmal.",
      "lesson2.complete": "Alle Paare gefunden.",
      "lesson2.trait.alif": "Kein Punkt",
      "lesson2.trait.ba": "Ein Punkt unten",
      "lesson2.trait.ta": "Zwei Punkte oben",

      "lesson3.title": "Buchstaben verbinden",
      "lesson3.text": "Vorschau: So werden Buchstaben später miteinander verbunden. Diese Lektion ist noch nicht vollständig freigeschaltet.",
      "lesson3.locked": "Noch nicht freigeschaltet",

      "progress.title": "Fortschritt",
      "progress.demoTag": "Demo-Daten",
      "progress.lettersLabel": "Erkannte Buchstaben",
      "progress.lessonsLabel": "Absolvierte Lektionen",
      "progress.timeLabel": "Lernzeit",
      "progress.nextLabel": "Nächstes Ziel",
      "progress.nextValue": "Buchstabenformen unterscheiden",
      "progress.minutesUnit": "Minuten",
      "progress.of28": " von 28",

      "discover.endTitle": "Für heute bist du am Ende der Auswahl.",
      "discover.endCta": "Zurück zum Lernweg",

      "post1.title": "Alif erkennen",
      "post1.desc": "Ein senkrechter Strich – der einfachste Buchstabe.",
      "post1.duration": "20 Sek.",
      "post1.goal": "Lernziel: Alif sicher erkennen",
      "post1.cta": "Jetzt üben",

      "post2.title": "Bā und Tā unterscheiden",
      "post2.desc": "Gleiche Grundform, unterschiedliche Punkte.",
      "post2.duration": "30 Sek.",
      "post2.goal": "Lernziel: Punkte sicher unterscheiden",
      "post2.cta": "Mini-Quiz starten",

      "post3.title": "Buchstaben verbinden",
      "post3.desc": "Vorschau, wie einzelne Buchstaben später zu einer verbundenen Form werden.",
      "post3.demo": "Demo – fachlich noch nicht freigegeben",
      "post3.cta": "Lernweg ansehen",

      "post4.title": "Schnelle Wiederholung",
      "post4.desc": "Alif, Bā und Tā im schnellen Wechsel.",
      "post4.cta": "Wiederholen",

      "post5.title": "Weitere Lernbereiche",
      "post5.desc": "Ein Ausblick auf kommende Themen – nur eine Produktvorschau.",
      "post5.quran": "Qur'anlesen & Tajwid",
      "post5.knowledge": "Islamisches Wissen",
      "post5.prophets": "Prophetengeschichten",
      "post5.discoverIslam": "Islam kennenlernen",
      "post5.comingSoon": "Folgt später",

      "action.save": "Speichern",
      "action.saved": "Gespeichert",

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
      "settings.onboardingTitle": "Onboarding",
      "settings.replayOnboarding": "Onboarding erneut anzeigen",
      "settings.dataTitle": "Lokale Daten",
      "settings.clearAll": "Alle lokalen Demo-Daten löschen",
      "settings.clearAllConfirm": "Wirklich alle lokalen Demo-Daten löschen?",
      "settings.privacyNote": "Dieser Prototyp speichert Einstellungen ausschließlich lokal auf diesem Gerät.",

      "footer.note": "Prototyp – Lerninhalte und religiöse Einordnungen sind noch nicht fachlich freigegeben.",

      "nav.learn": "Lernen",
      "nav.discover": "Entdecken",
      "nav.progress": "Fortschritt",
      "nav.settings": "Einstellungen"
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
      "situation.convert": "İslam'ı yeni kabul ettim ve nasıl ilerleyeceğimi öğrenmek istiyorum.",
      "situation.convertHint": "Bu öğrenme yolu şu anda ayrı olarak değerlendiriliyor.",

      "goal.title": "Neyi başarmak istiyorsun?",
      "goal.letters": "Arap harflerini güvenle tanımak",
      "goal.connect": "Harfleri birbirine bağlamak",
      "goal.words": "İlk kelimeleri okumak",
      "goal.refresh": "Bilgilerimi tazelemek",
      "goal.quran": "İleride Kur'an bölümleri okumak",
      "goal.cta": "Öğrenme yolumu oluştur",

      "common.next": "İleri",
      "common.back": "Geri",
      "common.demoTag": "Demo",

      "dashboard.greeting": "Tekrar hoş geldin",
      "dashboard.demoNoteShort": "Demo içerikler – uzman incelemesi bekleniyor.",
      "dashboard.today0": "Bugün: Elif'i güvenle tanı",
      "dashboard.today1": "Bugün: Bā ve Tā'yı ayırt et",
      "dashboard.today2": "Bugün: üç harfi tekrar et",
      "dashboard.today3": "Bugün: şekilleri isimleriyle eşleştir",
      "dashboard.heroLabel": "Bugün öğren",
      "dashboard.cta": "Bugün öğrenmeye devam et",
      "dashboard.pathTitle": "Öğrenme yolun",
      "dashboard.pathSubtitle": "Modül 1 · Arap harfleri",
      "dashboard.pathLinkAll": "Tüm öğrenme yolunu gör",
      "dashboard.forYouTitle": "Senin için seçildi",
      "dashboard.forYouText": "„Şekilleri ayırt etme“ ile devam et",
      "dashboard.forYouCta": "Görüntüle",
      "dashboard.mediaPreviewTitle": "Kısa öğrenme içeriklerini keşfet",
      "dashboard.repeatTitle": "Tekrar et",
      "dashboard.repeatCta": "Şimdi tekrar et",
      "dashboard.statLetters": "Harfler",
      "dashboard.statLessons": "Dersler",
      "dashboard.statMinutes": "Dakika",

      "path.title": "Öğrenme yolun",
      "path.more": "Diğer modüller yakında eklenecek.",
      "path.goalPrefix": "Mevcut öğrenme hedefi: ",

      "module.letters": "Arap harfleri",
      "module.connect": "Harfleri birleştirme",
      "module.words": "İlk kelimeleri okuma",
      "module.statusActive": "Aktif",
      "module.statusLocked": "Yakında",

      "lesson.formatLesson": "Ders",
      "lesson.formatMatching": "Görsel eşleştirme",
      "lesson.formatPreview": "Önizleme",
      "lesson.statusPartial": "Kısmen kullanılabilir",
      "lesson.statusLocked": "Henüz açılmadı",

      "lesson.title": "Elif, Bā ve Tā",
      "lesson.audioNote": "Onaylanmış sesli telaffuz daha sonraki bir aşamada eklenecektir.",
      "lesson.demoHint": "Demo içerik – uzman incelemesi bekleniyor.",
      "lesson.progress": "3'te {n}",
      "lesson.alif.name": "Elif",
      "lesson.alif.hint": "Sonraki harfe bağlanmayan dikey bir çizgi.",
      "lesson.ba.name": "Bā",
      "lesson.ba.hint": "Altında bir nokta olan yatay bir kavis.",
      "lesson.ta.name": "Tā",
      "lesson.ta.hint": "Bā ile benzer şekil, ancak üzerinde iki nokta.",

      "exercise.eyebrow": "Alıştırma",
      "exercise.correctPrefix": "Doğru – bu ",
      "exercise.incorrect": "Henüz değil. Şekle tekrar bak.",

      "qb.p.nameToChar.alif": "Hangi harf Elif'tir?",
      "qb.p.nameToChar.ba": "Hangi harf Bā'dır?",
      "qb.p.nameToChar.ta": "Hangi harf Tā'dır?",
      "qb.p.charToName": "Bu harfin adı nedir?",
      "qb.p.trait.alif": "Hangi harfin noktası yoktur?",
      "qb.p.trait.ba": "Hangi harfin altında bir nokta vardır?",
      "qb.p.trait.ta": "Hangi harfin üzerinde iki nokta vardır?",
      "qb.p.dotCount.alif": "Elif'in kaç noktası vardır?",
      "qb.p.dotCount.ba": "Bā'nın kaç noktası vardır?",
      "qb.p.dotCount.ta": "Tā'nın kaç noktası vardır?",
      "qb.dotCount.none": "Nokta yok",
      "qb.dotCount.one": "Bir nokta",
      "qb.dotCount.two": "İki nokta",
      "qb.p.oddOneOut.alif": "Noktası olmayan tek işaret hangisidir?",
      "qb.p.oddOneOut.ba": "Üstte değil altta noktası olan işaret hangisidir?",
      "qb.p.oddOneOut.ta": "Bir ya da hiç değil, iki noktası olan işaret hangisidir?",
      "qb.p.matchTrait.alif": "ا işaretine hangi özellik uyuyor?",
      "qb.p.matchTrait.ba": "ب işaretine hangi özellik uyuyor?",
      "qb.p.matchTrait.ta": "ت işaretine hangi özellik uyuyor?",
      "qb.p.flash": "Az önce hangi harf gösterildi?",
      "qb.flash.watch": "Dikkatlice bak …",

      "round.questionOf": "Soru {n} / {total}",
      "round.score": "Puan: {n}",
      "round.resultCorrect": "doğru",
      "round.resultRetry": "tekrar dene",
      "round.summaryTitle": "Değerlendirme",
      "round.summaryScore": "{total} sorudan {score} doğru",
      "round.newRound": "Yeni alıştırma turu",
      "round.retryWrong": "Hataları tekrar et",

      "media.videoLabel": "Video",
      "media.animatedLabel": "Canlandırılmış öğrenme medyası",

      "complete.demoLabel": "Demo ilerleme",
      "complete.home": "Ana sayfaya dön",

      "lesson2.title": "Şekilleri ayırt etme",
      "lesson2.instructions": "Her harfi özelliğine eşleştir.",
      "lesson2.demoNote": "Demo – kısmen kullanılabilir, uzman incelemesi bekleniyor.",
      "lesson2.retry": "Tam değil. Tekrar dene.",
      "lesson2.complete": "Tüm eşleşmeler bulundu.",
      "lesson2.trait.alif": "Noktasız",
      "lesson2.trait.ba": "Altında bir nokta",
      "lesson2.trait.ta": "Üzerinde iki nokta",

      "lesson3.title": "Harfleri birleştirme",
      "lesson3.text": "Önizleme: Harfler ileride böyle birleştirilecek. Bu ders henüz tamamen açılmadı.",
      "lesson3.locked": "Henüz açılmadı",

      "progress.title": "İlerleme",
      "progress.demoTag": "Demo veriler",
      "progress.lettersLabel": "Tanınan harfler",
      "progress.lessonsLabel": "Tamamlanan dersler",
      "progress.timeLabel": "Öğrenme süresi",
      "progress.nextLabel": "Sıradaki hedef",
      "progress.nextValue": "Harf şekillerini ayırt etmek",
      "progress.minutesUnit": "dakika",
      "progress.of28": " / 28",

      "discover.endTitle": "Bugünlük seçimin sonuna geldin.",
      "discover.endCta": "Öğrenme yoluna dön",

      "post1.title": "Elif'i tanı",
      "post1.desc": "Dikey bir çizgi – en basit harf.",
      "post1.duration": "20 sn.",
      "post1.goal": "Hedef: Elif'i güvenle tanımak",
      "post1.cta": "Şimdi alıştır",

      "post2.title": "Bā ve Tā'yı ayırt et",
      "post2.desc": "Aynı temel şekil, farklı noktalar.",
      "post2.duration": "30 sn.",
      "post2.goal": "Hedef: Noktaları güvenle ayırt etmek",
      "post2.cta": "Mini quiz başlat",

      "post3.title": "Harfleri birleştirme",
      "post3.desc": "Tekil harflerin ileride bağlı bir forma nasıl dönüşeceğinin önizlemesi.",
      "post3.demo": "Demo – henüz uzman onayı yok",
      "post3.cta": "Öğrenme yoluna git",

      "post4.title": "Hızlı tekrar",
      "post4.desc": "Elif, Bā ve Tā hızlıca sırayla.",
      "post4.cta": "Tekrarla",

      "post5.title": "Diğer öğrenme alanları",
      "post5.desc": "Gelecek konulara bir bakış – sadece ürün önizlemesi.",
      "post5.quran": "Kur'an okuma ve Tecvit",
      "post5.knowledge": "İslami bilgi",
      "post5.prophets": "Peygamber kıssaları",
      "post5.discoverIslam": "İslam'ı tanımak",
      "post5.comingSoon": "Yakında",

      "action.save": "Kaydet",
      "action.saved": "Kaydedildi",

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
      "settings.onboardingTitle": "Onboarding",
      "settings.replayOnboarding": "Onboarding'i tekrar göster",
      "settings.dataTitle": "Yerel veriler",
      "settings.clearAll": "Tüm yerel demo verilerini sil",
      "settings.clearAllConfirm": "Tüm yerel demo veriler silinsin mi?",
      "settings.privacyNote": "Bu prototip, ayarları yalnızca bu cihazda yerel olarak saklar.",

      "footer.note": "Prototip – Öğrenme içerikleri ve dini değerlendirmeler henüz uzman onayından geçmemiştir.",

      "nav.learn": "Öğren",
      "nav.discover": "Keşfet",
      "nav.progress": "İlerleme",
      "nav.settings": "Ayarlar"
    }
  };

  var LETTERS = [
    { id: "alif", char: "ا", nameKey: "lesson.alif.name", hintKey: "lesson.alif.hint", traitKey: "lesson2.trait.alif" },
    { id: "ba", char: "ب", nameKey: "lesson.ba.name", hintKey: "lesson.ba.hint", traitKey: "lesson2.trait.ba" },
    { id: "ta", char: "ت", nameKey: "lesson.ta.name", hintKey: "lesson.ta.hint", traitKey: "lesson2.trait.ta" }
  ];

  function letterById(id) {
    for (var i = 0; i < LETTERS.length; i++) if (LETTERS[i].id === id) return LETTERS[i];
    return null;
  }

  var NAME_KEYS = ["lesson.alif.name", "lesson.ba.name", "lesson.ta.name"];
  var TRAIT_KEYS = ["lesson2.trait.alif", "lesson2.trait.ba", "lesson2.trait.ta"];
  var CHARS = ["ا", "ب", "ت"];
  var DOT_KEYS = ["qb.dotCount.none", "qb.dotCount.one", "qb.dotCount.two"];

  /* Question Bank: 21 questions, 7 per letter, 7 distinct task types.
     choiceKind 'char' renders large Arabic letter buttons; 'text' renders i18n-key text buttons. */
  var QUESTION_BANK = [
    { id: "nameToChar-alif", letterId: "alif", promptKey: "qb.p.nameToChar.alif", choiceKind: "char", choices: CHARS, correct: "ا" },
    { id: "nameToChar-ba", letterId: "ba", promptKey: "qb.p.nameToChar.ba", choiceKind: "char", choices: CHARS, correct: "ب" },
    { id: "nameToChar-ta", letterId: "ta", promptKey: "qb.p.nameToChar.ta", choiceKind: "char", choices: CHARS, correct: "ت" },

    { id: "charToName-alif", letterId: "alif", promptKey: "qb.p.charToName", displayChar: "ا", choiceKind: "text", choices: NAME_KEYS, correct: "lesson.alif.name" },
    { id: "charToName-ba", letterId: "ba", promptKey: "qb.p.charToName", displayChar: "ب", choiceKind: "text", choices: NAME_KEYS, correct: "lesson.ba.name" },
    { id: "charToName-ta", letterId: "ta", promptKey: "qb.p.charToName", displayChar: "ت", choiceKind: "text", choices: NAME_KEYS, correct: "lesson.ta.name" },

    { id: "trait-alif", letterId: "alif", promptKey: "qb.p.trait.alif", choiceKind: "char", choices: CHARS, correct: "ا" },
    { id: "trait-ba", letterId: "ba", promptKey: "qb.p.trait.ba", choiceKind: "char", choices: CHARS, correct: "ب" },
    { id: "trait-ta", letterId: "ta", promptKey: "qb.p.trait.ta", choiceKind: "char", choices: CHARS, correct: "ت" },

    { id: "dotCount-alif", letterId: "alif", promptKey: "qb.p.dotCount.alif", choiceKind: "text", choices: DOT_KEYS, correct: "qb.dotCount.none" },
    { id: "dotCount-ba", letterId: "ba", promptKey: "qb.p.dotCount.ba", choiceKind: "text", choices: DOT_KEYS, correct: "qb.dotCount.one" },
    { id: "dotCount-ta", letterId: "ta", promptKey: "qb.p.dotCount.ta", choiceKind: "text", choices: DOT_KEYS, correct: "qb.dotCount.two" },

    { id: "oddOneOut-alif", letterId: "alif", promptKey: "qb.p.oddOneOut.alif", choiceKind: "char", choices: CHARS, correct: "ا" },
    { id: "oddOneOut-ba", letterId: "ba", promptKey: "qb.p.oddOneOut.ba", choiceKind: "char", choices: CHARS, correct: "ب" },
    { id: "oddOneOut-ta", letterId: "ta", promptKey: "qb.p.oddOneOut.ta", choiceKind: "char", choices: CHARS, correct: "ت" },

    { id: "matchTrait-alif", letterId: "alif", promptKey: "qb.p.matchTrait.alif", choiceKind: "text", choices: TRAIT_KEYS, correct: "lesson2.trait.alif" },
    { id: "matchTrait-ba", letterId: "ba", promptKey: "qb.p.matchTrait.ba", choiceKind: "text", choices: TRAIT_KEYS, correct: "lesson2.trait.ba" },
    { id: "matchTrait-ta", letterId: "ta", promptKey: "qb.p.matchTrait.ta", choiceKind: "text", choices: TRAIT_KEYS, correct: "lesson2.trait.ta" },

    { id: "flash-alif", letterId: "alif", flash: true, flashChar: "ا", promptKey: "qb.p.flash", choiceKind: "char", choices: CHARS, correct: "ا" },
    { id: "flash-ba", letterId: "ba", flash: true, flashChar: "ب", promptKey: "qb.p.flash", choiceKind: "char", choices: CHARS, correct: "ب" },
    { id: "flash-ta", letterId: "ta", flash: true, flashChar: "ت", promptKey: "qb.p.flash", choiceKind: "char", choices: CHARS, correct: "ت" }
  ];

  function questionById(id) {
    for (var i = 0; i < QUESTION_BANK.length; i++) if (QUESTION_BANK[i].id === id) return QUESTION_BANK[i];
    return null;
  }

  var NAV_VIEWS = ["home", "discover", "progress", "settings"];
  var SETTINGS_KEY = "iqraProtoSettings";
  var STATE_KEY = "iqraProtoState";

  var state = {
    lang: "de",
    theme: "system",
    onboardingDone: false,
    situation: null,
    goal: null,
    lessonStep: 0,
    matching: { matched: {}, selectedLetter: null },
    progress: { letters: 0, lessons: 0, minutes: 0 },
    savedMedia: [],
    backTarget: "home",
    qb: { askedIds: [], wrongIds: [], lastLetterId: null },
    round: null
  };

  var flashTimer = null;
  var resumingRound = false;
  var sequenceTimer = null;
  var sequenceIndex = 0;
  var discoverObserver = null;
  var reducedMotion = false;

  /* ---------- persistence ---------- */

  function loadPersisted() {
    try {
      var rawSettings = localStorage.getItem(SETTINGS_KEY);
      if (rawSettings) {
        var s = JSON.parse(rawSettings);
        if (s.lang === "de" || s.lang === "tr") state.lang = s.lang;
        if (s.theme === "light" || s.theme === "dark" || s.theme === "system") state.theme = s.theme;
      }
      var rawState = localStorage.getItem(STATE_KEY);
      if (rawState) {
        var d = JSON.parse(rawState);
        if (typeof d.onboardingDone === "boolean") state.onboardingDone = d.onboardingDone;
        if (typeof d.situation === "string") state.situation = d.situation;
        if (typeof d.goal === "string") state.goal = d.goal;
        if (d.progress) state.progress = d.progress;
        if (Array.isArray(d.savedMedia)) state.savedMedia = d.savedMedia;
        if (d.qb) state.qb = d.qb;
        if (d.round) state.round = d.round;
      }
    } catch (e) {
      /* localStorage unavailable — fall back to defaults */
    }
  }

  function persistSettings() {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({ lang: state.lang, theme: state.theme }));
    } catch (e) {}
  }

  function persistState() {
    try {
      localStorage.setItem(STATE_KEY, JSON.stringify({
        onboardingDone: state.onboardingDone,
        situation: state.situation,
        goal: state.goal,
        progress: state.progress,
        savedMedia: state.savedMedia,
        qb: state.qb,
        round: state.round
      }));
    } catch (e) {}
  }

  /* ---------- i18n helpers ---------- */

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
    if (document.getElementById("view-home").classList.contains("active")) renderHome();
    if (document.getElementById("view-path").classList.contains("active")) renderPath();
    if (document.getElementById("view-lesson1").classList.contains("active")) renderLesson1();
    if (document.getElementById("view-exercise").classList.contains("active")) showQuestion(false);
    if (document.getElementById("view-complete").classList.contains("active")) renderRoundSummary();
    if (document.getElementById("view-lesson2").classList.contains("active")) renderLesson2();
    if (document.getElementById("view-progress").classList.contains("active")) renderProgress();
    if (document.getElementById("view-discover").classList.contains("active")) renderDiscoverDynamic();
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

  /* ---------- navigation ---------- */

  function showView(name) {
    var views = document.querySelectorAll(".view");
    for (var i = 0; i < views.length; i++) views[i].classList.remove("active");
    document.getElementById("view-" + name).classList.add("active");

    var isNavView = NAV_VIEWS.indexOf(name) !== -1;
    var nav = document.getElementById("bottom-nav");
    nav.classList.toggle("visible", isNavView);
    var navBtns = document.querySelectorAll(".nav-btn");
    for (var j = 0; j < navBtns.length; j++) {
      navBtns[j].classList.toggle("active", navBtns[j].getAttribute("data-nav") === name);
    }

    if (name === "home") renderHome();
    if (name === "path") renderPath();
    if (name === "discover") renderDiscoverDynamic();
    if (name === "lesson1") renderLesson1();
    if (name === "exercise") renderExercise();
    if (name === "lesson2") renderLesson2();
    if (name === "progress") renderProgress();
    if (name === "complete") renderRoundSummary();

    document.getElementById("app-shell").scrollTop = 0;
  }

  function goBack() {
    showView(state.backTarget || "home");
  }

  /* ---------- onboarding selection state ---------- */

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

  /* ---------- home ---------- */

  /* Demo-Logik: stabile Tagesempfehlung, wechselt an anderen Kalendertagen. */
  function getDailyRecommendationKey() {
    var now = new Date();
    var dayNumber = now.getFullYear() * 372 + now.getMonth() * 31 + now.getDate();
    var idx = ((dayNumber % 4) + 4) % 4;
    return "dashboard.today" + idx;
  }

  function renderHome() {
    var fraction = state.progress.letters / 28;
    document.getElementById("home-repeat-fill").style.width = Math.round(fraction * 100) + "%";
    document.getElementById("home-stat-letters").textContent = state.progress.letters + "/28";
    document.getElementById("home-stat-lessons").textContent = String(state.progress.lessons);
    document.getElementById("home-stat-minutes").textContent = String(state.progress.minutes);
    document.getElementById("hero-suggestion").textContent = t(getDailyRecommendationKey());

    document.getElementById("lesson-card-1").classList.toggle("format-active", true);
  }

  function renderPath() {
    var goalText = state.goal ? t("goal." + state.goal) : "–";
    document.getElementById("path-goal-text").textContent = t("path.goalPrefix") + goalText;
  }

  /* ---------- lesson 1 ---------- */

  function renderLesson1() {
    var letter = LETTERS[state.lessonStep];
    document.getElementById("lesson1-letter").textContent = letter.char;
    document.getElementById("lesson1-letter-name").textContent = t(letter.nameKey);
    document.getElementById("lesson1-letter-hint").textContent = t(letter.hintKey);
    document.getElementById("btn-lesson1-next").textContent = t("common.next");
    document.getElementById("lesson1-progress").textContent = t("lesson.progress").replace("{n}", state.lessonStep + 1);
    var dots = document.querySelectorAll("#lesson1-dots .step-dot");
    for (var i = 0; i < dots.length; i++) {
      dots[i].classList.toggle("active", i === state.lessonStep);
      dots[i].classList.toggle("done", i < state.lessonStep);
    }
  }

  function startLesson1(backTarget) {
    state.lessonStep = 0;
    state.backTarget = backTarget || "home";
    showView("lesson1");
  }

  /* ---------- quiz engine (data-driven, question bank) ---------- */

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  /* Picks one question from candidates, preferring ones not yet asked in the
     current pool cycle, never repeating the exact last question, and — unless
     impossible — avoiding the same target letter as the previous pick. */
  function pickOne(candidates, opts) {
    opts = opts || {};
    var pool = candidates.filter(function (q) { return q.id !== opts.avoidId; });
    if (!pool.length) pool = candidates.slice();
    var unused = pool.filter(function (q) { return state.qb.askedIds.indexOf(q.id) === -1; });
    var preferred = unused.length ? unused : pool;
    if (opts.avoidLetterId) {
      var noSameLetter = preferred.filter(function (q) { return q.letterId !== opts.avoidLetterId; });
      if (noSameLetter.length) preferred = noSameLetter;
    }
    return preferred[Math.floor(Math.random() * preferred.length)];
  }

  function markAsked(question) {
    state.qb.askedIds.push(question.id);
    if (state.qb.askedIds.length >= QUESTION_BANK.length) {
      state.qb.askedIds = [question.id];
    }
    state.qb.lastLetterId = question.letterId;
  }

  function lastAskedId() {
    return state.qb.askedIds.length ? state.qb.askedIds[state.qb.askedIds.length - 1] : null;
  }

  function buildBalancedRound() {
    var letterOrder = shuffle(["alif", "ba", "ta"]);
    var questions = [];
    letterOrder.forEach(function (letterId, idx) {
      var candidates = QUESTION_BANK.filter(function (q) { return q.letterId === letterId; });
      var avoidId = idx === 0 ? lastAskedId() : questions[idx - 1].id;
      var picked = pickOne(candidates, { avoidId: avoidId });
      markAsked(picked);
      questions.push(picked);
    });
    return questions;
  }

  function buildFocusRound(letterFilter) {
    var candidates = QUESTION_BANK.filter(function (q) { return letterFilter.indexOf(q.letterId) !== -1; });
    var picked = pickOne(candidates, { avoidId: lastAskedId(), avoidLetterId: state.qb.lastLetterId });
    markAsked(picked);
    return [picked];
  }

  function buildMixedRound(letterFilter, count) {
    var basePool = QUESTION_BANK.filter(function (q) { return letterFilter.indexOf(q.letterId) !== -1; });
    var questions = [];
    for (var i = 0; i < count; i++) {
      var remaining = basePool.filter(function (q) { return questions.indexOf(q) === -1; });
      if (!remaining.length) remaining = basePool.slice();
      var avoidId = i === 0 ? lastAskedId() : questions[i - 1].id;
      var avoidLetterId = i === 0 ? state.qb.lastLetterId : questions[i - 1].letterId;
      var picked = pickOne(remaining, { avoidId: avoidId, avoidLetterId: avoidLetterId });
      markAsked(picked);
      questions.push(picked);
    }
    return questions;
  }

  function buildWrongRound() {
    var candidates = QUESTION_BANK.filter(function (q) { return state.qb.wrongIds.indexOf(q.id) !== -1; });
    return shuffle(candidates);
  }

  function startRound(questions, mode, backTarget) {
    if (!questions.length) return;
    state.round = {
      active: true,
      mode: mode,
      questionIds: questions.map(function (q) { return q.id; }),
      currentIndex: 0,
      score: 0,
      attemptedWrong: {},
      results: {},
      backTarget: backTarget || "home"
    };
    state.backTarget = backTarget || "home";
    persistState();
    showView("exercise");
  }

  function currentQuestion() {
    if (!state.round) return null;
    return questionById(state.round.questionIds[state.round.currentIndex]);
  }

  function renderExercise() {
    if (!state.round) {
      startRound(buildBalancedRound(), "balanced3", "home");
      return;
    }
    showQuestion(resumingRound);
    resumingRound = false;
  }

  function showQuestion(isResume) {
    var round = state.round;
    var q = currentQuestion();
    if (!q) return;
    clearTimeout(flashTimer);

    var isMultiQuestion = round.questionIds.length > 1;
    var metaEl = document.getElementById("exercise-round-meta");
    metaEl.hidden = !isMultiQuestion;
    if (isMultiQuestion) {
      document.getElementById("exercise-round-progress").textContent =
        t("round.questionOf").replace("{n}", round.currentIndex + 1).replace("{total}", round.questionIds.length);
      document.getElementById("exercise-score").textContent = t("round.score").replace("{n}", round.score);
    }

    var displayWrap = document.getElementById("exercise-display-char-wrap");
    if (q.displayChar && !q.flash) {
      displayWrap.hidden = false;
      document.getElementById("exercise-display-char").textContent = q.displayChar;
    } else {
      displayWrap.hidden = true;
    }

    var flashOverlay = document.getElementById("exercise-flash-overlay");
    var questionBody = document.getElementById("exercise-question-body");

    function revealQuestion() {
      flashOverlay.hidden = true;
      questionBody.hidden = false;
      renderQuestionBody(q);
    }

    if (q.flash && !isResume) {
      questionBody.hidden = true;
      flashOverlay.hidden = false;
      document.getElementById("exercise-flash-char").textContent = q.flashChar;
      if (reducedMotion) {
        revealQuestion();
      } else {
        flashTimer = setTimeout(revealQuestion, 1100);
      }
    } else {
      flashOverlay.hidden = true;
      questionBody.hidden = false;
      renderQuestionBody(q);
    }
  }

  function renderQuestionBody(q) {
    document.getElementById("exercise-question").textContent = t(q.promptKey);
    var shuffledChoices = shuffle(q.choices);
    var row = document.getElementById("exercise-choices");
    row.innerHTML = "";
    row.className = "letter-choice-row choices-" + shuffledChoices.length;
    shuffledChoices.forEach(function (choiceValue) {
      var btn = document.createElement("button");
      if (q.choiceKind === "char") {
        btn.className = "letter-choice arabic";
        btn.textContent = choiceValue;
      } else {
        btn.className = "text-choice";
        btn.textContent = t(choiceValue);
      }
      btn.setAttribute("data-value", choiceValue);
      btn.addEventListener("click", onChoiceClick);
      row.appendChild(btn);
    });
    var feedback = document.getElementById("exercise-feedback");
    feedback.hidden = true;
    feedback.textContent = "";
    feedback.className = "feedback";
    document.getElementById("btn-exercise-next").hidden = true;
  }

  function onChoiceClick(e) {
    var round = state.round;
    var q = currentQuestion();
    if (!round || !q || round.results[q.id]) return;
    var picked = e.currentTarget.getAttribute("data-value");
    var feedback = document.getElementById("exercise-feedback");
    feedback.hidden = false;
    if (picked === q.correct) {
      var hadMistake = !!round.attemptedWrong[q.id];
      round.results[q.id] = hadMistake ? "retry" : "correct";
      if (!hadMistake) round.score += 1;
      var wrongIdx = state.qb.wrongIds.indexOf(q.id);
      if (!hadMistake && wrongIdx !== -1) state.qb.wrongIds.splice(wrongIdx, 1);
      e.currentTarget.classList.add("correct");
      var label = q.choiceKind === "char" ? q.correct : t(q.correct);
      feedback.textContent = t("exercise.correctPrefix") + label + ".";
      feedback.className = "feedback feedback-correct";
      document.getElementById("btn-exercise-next").hidden = false;
      persistState();
    } else {
      round.attemptedWrong[q.id] = true;
      if (state.qb.wrongIds.indexOf(q.id) === -1) state.qb.wrongIds.push(q.id);
      var wrongBtn = e.currentTarget;
      wrongBtn.classList.add("incorrect");
      feedback.textContent = t("exercise.incorrect");
      feedback.className = "feedback feedback-incorrect";
      persistState();
      setTimeout(function () {
        wrongBtn.classList.remove("incorrect");
      }, 700);
    }
  }

  function onExerciseNext() {
    var round = state.round;
    if (!round) return;
    if (round.currentIndex + 1 < round.questionIds.length) {
      round.currentIndex += 1;
      persistState();
      showQuestion(false);
      return;
    }
    round.active = false;
    if (round.questionIds.length === 1) {
      persistState();
      showView(round.backTarget || "home");
    } else {
      markLessonComplete();
      persistState();
      showView("complete");
    }
  }

  function renderRoundSummary() {
    var round = state.round;
    if (!round) return;
    document.getElementById("round-summary-score").textContent =
      t("round.summaryScore").replace("{score}", round.score).replace("{total}", round.questionIds.length);
    var list = document.getElementById("round-summary-list");
    list.innerHTML = "";
    round.questionIds.forEach(function (qid) {
      var q = questionById(qid);
      var letter = letterById(q.letterId);
      var result = round.results[qid] === "correct" ? t("round.resultCorrect") : t("round.resultRetry");
      var row = document.createElement("div");
      row.className = "round-summary-row" + (round.results[qid] === "correct" ? " result-correct" : " result-retry");
      row.innerHTML = "<span class=\"round-summary-letter\"></span><span class=\"round-summary-result\"></span>";
      row.querySelector(".round-summary-letter").textContent = t(letter.nameKey);
      row.querySelector(".round-summary-result").textContent = result;
      list.appendChild(row);
    });
    document.getElementById("btn-round-retry-wrong").hidden = state.qb.wrongIds.length === 0;
  }

  /* ---------- lesson 2: matching ---------- */

  function renderLesson2() {
    state.matching = { matched: {}, selectedLetter: null };
    var letterCol = document.getElementById("lesson2-letters");
    var traitCol = document.getElementById("lesson2-traits");
    letterCol.innerHTML = "";
    traitCol.innerHTML = "";
    var shuffledTraits = LETTERS.slice().sort(function () { return Math.random() - 0.5; });

    LETTERS.forEach(function (letter) {
      var chip = document.createElement("button");
      chip.className = "match-chip arabic";
      chip.setAttribute("data-letter-id", letter.id);
      chip.textContent = letter.char;
      chip.addEventListener("click", function (e) {
        onLetterChipClick(e.currentTarget.getAttribute("data-letter-id"));
      });
      letterCol.appendChild(chip);
    });

    shuffledTraits.forEach(function (letter) {
      var chip = document.createElement("button");
      chip.className = "match-chip match-chip-trait";
      chip.setAttribute("data-trait-id", letter.id);
      chip.textContent = t(letter.traitKey);
      chip.addEventListener("click", function (e) {
        onTraitChipClick(e.currentTarget.getAttribute("data-trait-id"));
      });
      traitCol.appendChild(chip);
    });

    document.getElementById("lesson2-feedback").hidden = true;
    document.getElementById("lesson2-complete-note").hidden = true;
  }

  function onLetterChipClick(id) {
    if (state.matching.matched[id]) return;
    state.matching.selectedLetter = id;
    var chips = document.querySelectorAll("#lesson2-letters .match-chip");
    for (var i = 0; i < chips.length; i++) {
      chips[i].classList.toggle("selected", chips[i].getAttribute("data-letter-id") === id);
    }
  }

  function onTraitChipClick(id) {
    if (!state.matching.selectedLetter) return;
    var traitChip = document.querySelector('#lesson2-traits [data-trait-id="' + id + '"]');
    var letterChip = document.querySelector('#lesson2-letters [data-letter-id="' + state.matching.selectedLetter + '"]');
    var feedback = document.getElementById("lesson2-feedback");
    feedback.hidden = false;
    if (id === state.matching.selectedLetter) {
      state.matching.matched[id] = true;
      traitChip.classList.add("matched");
      traitChip.classList.remove("selected");
      letterChip.classList.add("matched");
      letterChip.classList.remove("selected");
      feedback.hidden = true;
      state.matching.selectedLetter = null;
      if (Object.keys(state.matching.matched).length === LETTERS.length) {
        document.getElementById("lesson2-complete-note").hidden = false;
      }
    } else {
      feedback.textContent = t("lesson2.retry");
      feedback.className = "feedback feedback-incorrect";
      traitChip.classList.add("incorrect");
      setTimeout(function () {
        traitChip.classList.remove("incorrect");
      }, 700);
      state.matching.selectedLetter = null;
      var chips = document.querySelectorAll("#lesson2-letters .match-chip");
      for (var i = 0; i < chips.length; i++) chips[i].classList.remove("selected");
    }
  }

  /* ---------- progress ---------- */

  function renderProgress() {
    document.getElementById("progress-letters").textContent = state.progress.letters + t("progress.of28");
    document.getElementById("progress-lessons").textContent = String(state.progress.lessons);
    document.getElementById("progress-time").textContent = state.progress.minutes + " " + t("progress.minutesUnit");
  }

  function markLessonComplete() {
    state.progress = { letters: 3, lessons: 1, minutes: 5 };
    persistState();
  }

  function resetDemoProgress() {
    state.progress = { letters: 0, lessons: 0, minutes: 0 };
    persistState();
  }

  /* ---------- discover feed ---------- */

  function toggleSaveMedia(postId) {
    var idx = state.savedMedia.indexOf(postId);
    if (idx === -1) state.savedMedia.push(postId);
    else state.savedMedia.splice(idx, 1);
    persistState();
    renderDiscoverDynamic();
  }

  function renderDiscoverDynamic() {
    var saveButtons = document.querySelectorAll(".save-btn");
    for (var i = 0; i < saveButtons.length; i++) {
      var postId = saveButtons[i].getAttribute("data-save");
      var saved = state.savedMedia.indexOf(postId) !== -1;
      saveButtons[i].textContent = saved ? t("action.saved") : t("action.save");
      saveButtons[i].classList.toggle("saved", saved);
    }
  }

  function restartSequence() {
    sequenceIndex = 0;
    renderSequenceStep();
    if (sequenceTimer) clearInterval(sequenceTimer);
    if (reducedMotion) return;
    sequenceTimer = setInterval(advanceSequence, 1400);
  }

  function advanceSequence() {
    sequenceIndex = (sequenceIndex + 1) % LETTERS.length;
    renderSequenceStep();
  }

  function renderSequenceStep() {
    var el = document.getElementById("sequence-letter");
    if (!el) return;
    el.textContent = LETTERS[sequenceIndex].char;
    var dots = document.querySelectorAll("#sequence-dots .step-dot");
    for (var i = 0; i < dots.length; i++) {
      dots[i].classList.toggle("active", i === sequenceIndex);
    }
  }

  function stopSequence() {
    if (sequenceTimer) {
      clearInterval(sequenceTimer);
      sequenceTimer = null;
    }
  }

  function setupDiscoverObserver() {
    var posts = document.querySelectorAll(".discover-post");
    discoverObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var post = entry.target;
        if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
          post.classList.add("in-view");
          if (post.getAttribute("data-post") === "4") restartSequence();
        } else {
          post.classList.remove("in-view");
          if (post.getAttribute("data-post") === "4") stopSequence();
        }
      });
    }, { threshold: [0, 0.6, 1] });
    posts.forEach(function (post) { discoverObserver.observe(post); });
  }

  /* ---------- settings ---------- */

  function replayOnboarding() {
    state.onboardingDone = false;
    persistState();
    showView("welcome");
  }

  function clearAllLocalData() {
    if (!window.confirm(t("settings.clearAllConfirm"))) return;
    try {
      localStorage.removeItem(SETTINGS_KEY);
      localStorage.removeItem(STATE_KEY);
    } catch (e) {}
    state.situation = null;
    state.goal = null;
    state.onboardingDone = false;
    state.progress = { letters: 0, lessons: 0, minutes: 0 };
    state.savedMedia = [];
    state.qb = { askedIds: [], wrongIds: [], lastLetterId: null };
    state.round = null;
    showView("welcome");
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

  /* ---------- wiring ---------- */

  function wireEvents() {
    document.addEventListener("click", function (e) {
      if (e.target.closest("[data-back]")) goBack();
    });

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
        persistState();
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
        persistState();
        updateGoalSituationSelectionText();
      });
    }
    document.getElementById("btn-hero-cta").addEventListener("click", function () {
      startLesson1("home");
    });
    document.getElementById("lesson-card-1").addEventListener("click", function () {
      startLesson1("home");
    });
    document.getElementById("lesson-card-2").addEventListener("click", function () {
      state.backTarget = "home";
      showView("lesson2");
    });
    document.getElementById("lesson-card-3").addEventListener("click", function () {
      state.backTarget = "home";
      showView("lesson3");
    });
    document.getElementById("btn-path-link").addEventListener("click", function () {
      state.backTarget = "home";
      showView("path");
    });
    document.getElementById("btn-for-you").addEventListener("click", function () {
      state.backTarget = "home";
      showView("lesson2");
    });
    document.getElementById("btn-repeat-home").addEventListener("click", function () {
      startLesson1("home");
    });
    document.getElementById("media-tile-1").addEventListener("click", function () {
      showView("discover");
      setTimeout(function () {
        var el = document.querySelector('.discover-post[data-post="1"]');
        if (el) el.scrollIntoView({ block: "start" });
      }, 30);
    });
    document.getElementById("media-tile-2").addEventListener("click", function () {
      showView("discover");
      setTimeout(function () {
        var el = document.querySelector('.discover-post[data-post="2"]');
        if (el) el.scrollIntoView({ block: "start" });
      }, 30);
    });

    document.getElementById("btn-lesson1-next").addEventListener("click", function () {
      if (state.lessonStep < LETTERS.length - 1) {
        state.lessonStep++;
        renderLesson1();
      } else {
        startRound(buildBalancedRound(), "balanced3", "home");
      }
    });

    document.getElementById("btn-exercise-next").addEventListener("click", onExerciseNext);

    document.getElementById("btn-round-new").addEventListener("click", function () {
      startRound(buildBalancedRound(), "balanced3", "home");
    });
    document.getElementById("btn-round-retry-wrong").addEventListener("click", function () {
      var backTarget = state.round ? state.round.backTarget : "home";
      var qs = buildWrongRound();
      if (qs.length) startRound(qs, "wrongOnly", backTarget);
    });
    document.getElementById("btn-complete-home").addEventListener("click", function () {
      showView("home");
    });

    document.getElementById("lesson3-back-home").addEventListener("click", function () {
      showView("home");
    });

    var navButtons = document.querySelectorAll(".nav-btn");
    for (var n = 0; n < navButtons.length; n++) {
      navButtons[n].addEventListener("click", function (e) {
        showView(e.currentTarget.getAttribute("data-nav"));
      });
    }

    /* discover post CTAs */
    document.getElementById("post1-cta").addEventListener("click", function () {
      startRound(buildFocusRound(["alif"]), "letterFocus", "discover");
    });
    document.getElementById("post2-cta").addEventListener("click", function () {
      startRound(buildFocusRound(["ba", "ta"]), "compareFocus", "discover");
    });
    document.getElementById("post3-cta").addEventListener("click", function () {
      state.backTarget = "discover";
      showView("path");
    });
    document.getElementById("post4-cta").addEventListener("click", function () {
      startRound(buildMixedRound(["alif", "ba", "ta"], 3), "mixedKnown", "discover");
    });
    document.getElementById("discover-end-cta").addEventListener("click", function () {
      showView("home");
    });

    var saveButtons = document.querySelectorAll(".save-btn");
    for (var sb = 0; sb < saveButtons.length; sb++) {
      saveButtons[sb].addEventListener("click", function (e) {
        toggleSaveMedia(e.currentTarget.getAttribute("data-save"));
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
      state.backTarget = "settings";
      updateGoalSituationSelectionText();
      showView("goal");
    });

    document.getElementById("btn-reset-progress").addEventListener("click", function () {
      resetDemoProgress();
      renderHome();
      renderProgress();
    });

    document.getElementById("btn-replay-onboarding").addEventListener("click", replayOnboarding);
    document.getElementById("btn-clear-all").addEventListener("click", clearAllLocalData);
  }

  /* goal confirmation should return to settings if entered from there */
  function wireGoalConfirmTarget() {
    document.getElementById("btn-goal-next").addEventListener("click", function () {
      state.onboardingDone = true;
      persistState();
      showView(state.backTarget === "settings" ? "settings" : "home");
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    loadPersisted();
    applyI18n();
    applyTheme();
    updateLangSelectors();
    wireEvents();
    wireGoalConfirmTarget();
    setupDiscoverObserver();
    if (state.round && state.round.active) {
      resumingRound = true;
      showView("exercise");
    } else {
      showView(state.onboardingDone ? "home" : "welcome");
    }
  });
})();
