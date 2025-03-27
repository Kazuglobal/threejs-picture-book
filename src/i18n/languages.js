// 多言語対応のための翻訳データ

export const languages = {
  ja: {
    code: 'ja',
    name: '日本語',
    flag: '🇯🇵',
    ui: {
      prevButton: '前のページ',
      nextButton: '次のページ',
      soundOn: '🔊',
      soundOff: '🔇',
      language: '言語'
    },
    pages: {
      cover: '', // 表紙テキストなし
      page1: '友達と笑って過ごした楽しい一日。',
      page2: '海で泳いで楽しかった夏の思い出。',
      page3: '公園で遊んだ最高の日。',
      page4: 'お化けになった先生が怖かったけど、いい思い出になったおばけやしき。',
      page5: 'たくさん練習してパパとママに見てもらったにじいろステージ。思い出がたくさん。',
      backCover: '' // 裏表紙テキストなし
    },
    // 漢字とルビのマッピング
    ruby: {
      '友': 'とも',
      '達': 'だち',
      '笑': 'わら',
      '海': 'うみ',
      '泳': 'およ',
      '楽': 'たの',
      '思': 'おも',
      '出': 'で',
      '公': 'こう',
      '園': 'えん',
      '遊': 'あそ',
      '最': 'さい',
      '高': 'こう',
      '日': 'ひ',
      '化': 'ば',
      '先': 'せん',
      '生': 'せい',
      '怖': 'こわ',
      '館': 'かん',
      '練': 'れん',
      '習': 'しゅう',
      '見': 'み',
      '虹': 'にじ',
      '色': 'いろ',
      '舞': 'ぶ',
      '台': 'たい'
    }
  },
  en: {
    code: 'en',
    name: 'English',
    flag: '🇺🇸',
    ui: {
      prevButton: 'Previous',
      nextButton: 'Next',
      soundOn: '🔊',
      soundOff: '🔇',
      language: 'Language'
    },
    pages: {
      cover: '',
      page1: 'A fun day spent laughing with friends.',
      page2: 'Summer memories of swimming in the sea.',
      page3: 'The best day playing in the park.',
      page4: 'The ghost teacher was scary, but the haunted house became a good memory.',
      page5: 'The rainbow stage where I practiced a lot and showed it to mom and dad. So many memories.',
      backCover: ''
    },
    ruby: {} // No ruby for English
  },
  es: {
    code: 'es',
    name: 'Español',
    flag: '🇪🇸',
    ui: {
      prevButton: 'Anterior',
      nextButton: 'Siguiente',
      soundOn: '🔊',
      soundOff: '🔇',
      language: 'Idioma'
    },
    pages: {
      cover: '',
      page1: 'Un día divertido riendo con amigos.',
      page2: 'Recuerdos de verano nadando en el mar.',
      page3: 'El mejor día jugando en el parque.',
      page4: 'El profesor fantasma daba miedo, pero la casa embrujada se convirtió en un buen recuerdo.',
      page5: 'El escenario arcoíris donde practiqué mucho y se lo mostré a mamá y papá. Tantos recuerdos.',
      backCover: ''
    },
    ruby: {} // No ruby for Spanish
  },
  fr: {
    code: 'fr',
    name: 'Français',
    flag: '🇫🇷',
    ui: {
      prevButton: 'Précédent',
      nextButton: 'Suivant',
      soundOn: '🔊',
      soundOff: '🔇',
      language: 'Langue'
    },
    pages: {
      cover: '',
      page1: 'Une journée amusante passée à rire avec des amis.',
      page2: 'Souvenirs d\'été de baignade dans la mer.',
      page3: 'Le meilleur jour à jouer dans le parc.',
      page4: 'Le professeur fantôme était effrayant, mais la maison hantée est devenue un bon souvenir.',
      page5: 'La scène arc-en-ciel où j\'ai beaucoup pratiqué et l\'ai montré à maman et papa. Tant de souvenirs.',
      backCover: ''
    },
    ruby: {} // No ruby for French
  },
  zh: {
    code: 'zh',
    name: '中文',
    flag: '🇨🇳',
    ui: {
      prevButton: '上一页',
      nextButton: '下一页',
      soundOn: '🔊',
      soundOff: '🔇',
      language: '语言'
    },
    pages: {
      cover: '',
      page1: '和朋友们欢笑的美好一天。',
      page2: '在海里游泳的夏日回忆。',
      page3: '在公园玩耍的最美好的一天。',
      page4: '变成幽灵的老师很可怕，但是鬼屋成了美好的回忆。',
      page5: '努力练习后在爸爸妈妈面前表演的彩虹舞台。好多回忆。',
      backCover: ''
    },
    ruby: {} // No ruby for Chinese
  },
  ko: {
    code: 'ko',
    name: '한국어',
    flag: '🇰🇷',
    ui: {
      prevButton: '이전',
      nextButton: '다음',
      soundOn: '🔊',
      soundOff: '🔇',
      language: '언어'
    },
    pages: {
      cover: '',
      page1: '친구들과 웃으며 보낸 즐거운 하루.',
      page2: '바다에서 수영한 여름 추억.',
      page3: '공원에서 놀았던 최고의 날.',
      page4: '유령이 된 선생님이 무서웠지만, 좋은 추억이 된 귀신의 집.',
      page5: '열심히 연습해서 엄마와 아빠에게 보여준 무지개 무대. 많은 추억들.',
      backCover: ''
    },
    ruby: {} // No ruby for Korean
  }
};

// デフォルト言語の設定
export const defaultLanguage = 'ja';

// 現在の言語を取得
export function getCurrentLanguage() {
  const savedLang = localStorage.getItem('bookLanguage');
  return savedLang && languages[savedLang] ? savedLang : defaultLanguage;
}

// 言語を設定
export function setLanguage(langCode) {
  if (languages[langCode]) {
    localStorage.setItem('bookLanguage', langCode);
    return true;
  }
  return false;
}

// 言語データを取得
export function getLanguageData(langCode = null) {
  const code = langCode || getCurrentLanguage();
  return languages[code] || languages[defaultLanguage];
}