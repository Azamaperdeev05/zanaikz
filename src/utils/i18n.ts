export const translations = {
  kk: {
    nav: {
      chat: 'Чат',
      laws: 'Заңнамалар',
      lawyers: 'Заңгерлер',
      templates: 'Құжат үлгілері',
      calculators: 'Калькуляторлар',
      sos: 'SOS (Жедел көмек)',
      settings: 'Баптаулар & Профиль',
      login: 'Кіру',
      logout: 'Шығу',
      loading: 'Жүктелуде...',
      startFree: 'Тегін бастау',
      goToChat: 'Чатқа өту',
      features: 'Мүмкіндіктер',
      howItWorks: 'Қалай жұмыс істейді',
      about: 'Жоба туралы',
    },
    common: {
      user: 'Пайдаланушы',
      close: 'Жабу',
      open: 'Ашу',
      search: 'Іздеу...',
      more: 'Толығырақ',
      allRightsReserved: 'Барлық құқықтар қорғалған.',
    },
    landing: {
      heroTitle: 'Құқықтық кеңесшіңіз.',
      heroSubtitle: 'Әрқашан қасыңызда.',
      heroDesc: 'Жасанды интеллект негізіндегі тегін құқықтық платформа. Қазақстан заңнамасы бойынша сұрақ қойыңыз — нақты жауап алыңыз.',
      allInOne: 'Бәрі бір жерде.',
      allInOneDesc: 'Құқықтық мәселелерді шешуге қажетті барлық құралдар.',
      whyUs: 'Неліктен ЗаңКеңес AI?',
      whyUsDesc: 'Заманауи технологиялар. Қарапайым интерфейс.',
      diploma: 'ДИПЛОМДЫҚ ЖҰМЫС',
    },
    sos: {
      title: 'Шұғыл көмек',
      desc: 'Егер сіздің өміріңізге, денсаулығыңызға немесе бостандығыңызға қауіп төніп тұрса, дереу хабарласыңыз.',
      emergencyLinks: 'Шұғыл нөмірлер',
      guides: 'Нұсқаулықтар',
      police: 'Полиция',
      ambulance: 'Жедел жәрдем',
      emergency: 'Төтенше жағдайлар',
    },
    profile: {
      title: 'Профиль және Баптаулар',
      fullName: 'Аты-жөні',
      save: 'Сақтау',
      historyTitle: 'Сұрақтар тарихы (Аналитика)',
      historyDesc: 'Сіздің көбіне қандай тақырыптарда сұрақ қоятыныңызды көрсетеді',
      noHistory: 'Әзірге тарих бос',
      authRequired: 'Бұл бетті көру үшін жүйеге кіріңіз',
    },
    laws: {
      title: 'Заңнамалар базасы',
      subtitle: 'ҚР заңнамалық актілерін іздеу және қарау',
      searchPlaceholder: 'Атауы немесе кілт сөз бойынша іздеу...',
      branches: 'Құқық салалары',
      allLaws: 'Барлық заңдар',
      read: 'Оқу',
      notFound: 'Ештеңе табылмады',
    }
  },
  ru: {
    nav: {
      chat: 'Чат',
      laws: 'База законов',
      lawyers: 'Юристы',
      templates: 'Шаблоны',
      calculators: 'Калькуляторы',
      sos: 'SOS (Скорая помощь)',
      settings: 'Настройки',
      login: 'Войти',
      logout: 'Выйти',
      loading: 'Загрузка...',
      startFree: 'Начать бесплатно',
      goToChat: 'Перейти в чат',
      features: 'Возможности',
      howItWorks: 'Как это работает',
      about: 'О проекте',
    },
    common: {
      user: 'Пользователь',
      close: 'Закрыть',
      open: 'Открыть',
      search: 'Поиск...',
      more: 'Подробнее',
      allRightsReserved: 'Все права защищены.',
    },
    landing: {
      heroTitle: 'Ваш юридический советник.',
      heroSubtitle: 'Всегда рядом.',
      heroDesc: 'Бесплатная правовая платформа на базе ИИ. Задайте вопрос по законодательству Казахстана — получите точный ответ.',
      allInOne: 'Все в одном месте.',
      allInOneDesc: 'Все инструменты, необходимые для решения правовых вопросов.',
      whyUs: 'Почему ЗаңКеңес AI?',
      whyUsDesc: 'Современные технологии. Простой интерфейс.',
      diploma: 'ДИПЛОМНАЯ РАБОТА',
    },
    sos: {
      title: 'Срочная помощь',
      desc: 'Если вашей жизни, здоровью или свободе угрожает опасность, немедленно свяжитесь.',
      emergencyLinks: 'Экстренные номера',
      guides: 'Инструкции',
      police: 'Полиция',
      ambulance: 'Скорая помощь',
      emergency: 'Чрезвычайные ситуации',
    },
    profile: {
      title: 'Профиль и Настройки',
      fullName: 'Имя и Фамилия',
      save: 'Сохранить',
      historyTitle: 'История запросов (Аналитика)',
      historyDesc: 'Здесь показано, какими темами вы чаще всего интересуетесь',
      noHistory: 'История пока пуста',
      authRequired: 'Пожалуйста, войдите, чтобы просмотреть эту страницу',
    },
    laws: {
      title: 'База законодательства',
      subtitle: 'Поиск и просмотр законодательных актов РК',
      searchPlaceholder: 'Поиск по названию или ключевому слову...',
      branches: 'Отрасли права',
      allLaws: 'Все законы',
      read: 'Читать',
      notFound: 'Ничего не найдено',
    }
  }
};

export type LangType = 'kk' | 'ru';

export const t = (lang: LangType, section: keyof typeof translations['kk'], key: string): string => {
  try {
    return (translations[lang] as any)[section][key] || key;
  } catch (e) {
    return key;
  }
};
