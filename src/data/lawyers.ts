export interface Lawyer {
  id: number;
  name: string;
  phone: string;
  email: string;
  specialization: string;
  city: string;
  address: string;
  website: string;
}

export const lawyersData: Lawyer[] = [
  {
    "id": 1,
    "name": "Шаиков Толеген Сатканович",
    "phone": "+7 701 555-96-48; +7 777 222-26-52",
    "email": "",
    "specialization": "Уголовное, гражданское право (жилищные, земельные, налоговые споры)",
    "city": "Астана",
    "address": "ул. Балкантау, 82",
    "website": "https://advokat.kz/"
  },
  {
    "id": 2,
    "name": "Жумажанов Абылай Арманулы",
    "phone": "+7 776 144-19-94",
    "email": "info@zhumazhanov.kz",
    "specialization": "Уголовное право (экономические, коррупционные), гражданское право",
    "city": "Астана",
    "address": "г. Астана",
    "website": "https://zhumazhanov.kz/"
  },
  {
    "id": 3,
    "name": "Алина Айжан (ЮК «Alina & Partners»)",
    "phone": "+7 778 670-77-34",
    "email": "",
    "specialization": "Семейное, налоговое, корпоративное право, лицензирование",
    "city": "Астана",
    "address": "г. Астана",
    "website": "https://alina-partners.kz/ru/"
  },
  {
    "id": 4,
    "name": "Мельдебеков Е.Р.",
    "phone": "+7 775 380-96-52",
    "email": "",
    "specialization": "Гражданское право (консультации)",
    "city": "Астана",
    "address": "г. Астана",
    "website": "https://www.advokatt.kz/"
  },
  {
    "id": 5,
    "name": "ЮрЦентр (команда адвокатов)",
    "phone": "+7 701 978-28-22",
    "email": "info@yurcenter.kz",
    "specialization": "Семейное, жилищное, земельное, банковские споры, налоговое право",
    "city": "Астана",
    "address": "ул. Бухар жырау, 42, НП 5",
    "website": "https://yurcenter.kz/"
  },
  {
    "id": 6,
    "name": "ЮК «Гарант Плюс»",
    "phone": "+7 702 847-80-20; +7 747 392-19-58",
    "email": "garantplus.kz@mail.ru",
    "specialization": "Семейные, трудовые, наследственные, корпоративные споры, уголовное право",
    "city": "Астана",
    "address": "г. Астана",
    "website": "https://garantplus.kz/"
  },
  {
    "id": 7,
    "name": "ЮК «Astana Jurist»",
    "phone": "Н/Д (через сайт)",
    "email": "",
    "specialization": "Корпоративные споры, банкротство, семейное, земельное, трудовое право",
    "city": "Астана",
    "address": "пр. Момышулы, 2/5, блок 3, этаж 3",
    "website": "https://astanaurist.kz/"
  },
  {
    "id": 8,
    "name": "Узканов Руслан Ерланович",
    "phone": "+7 701 280-46-38",
    "email": "prezidiumastana@gmail.com",
    "specialization": "Общая практика (Председатель Коллегии адвокатов Астаны)",
    "city": "Астана",
    "address": "пр. Улы Дала, 5/3, офис 14",
    "website": "https://advocaturaastana.kz/ru"
  },
  {
    "id": 9,
    "name": "Абаев Бакыт Абаевич",
    "phone": "+7 701 456-47-45",
    "email": "",
    "specialization": "Общая адвокатская практика",
    "city": "Астана",
    "address": "ул. Мустафина, 15/2, кв. 30",
    "website": ""
  },
  {
    "id": 10,
    "name": "Абдигалиева Диана Маратовна",
    "phone": "+7 707 111-60-33",
    "email": "",
    "specialization": "Общая адвокатская практика",
    "city": "Астана",
    "address": "ул. Орлыколь, 2/1",
    "website": ""
  },
  {
    "id": 11,
    "name": "White & Case Kazakhstan LLP",
    "phone": "+7 7172 55-28-68",
    "email": "mtelemtayev@whitecase.com",
    "specialization": "Энергетика, корпоративное право, финансы, рынки капитала",
    "city": "Астана",
    "address": "BC Talan Towers, ул. Достык 16, 11 этаж",
    "website": "https://www.whitecase.com"
  },
  {
    "id": 12,
    "name": "Dentons Kazakhstan (Астана)",
    "phone": "+7 7172 55-21-51",
    "email": "almaty@dentons.com",
    "specialization": "Корпоративное право, финансы, разрешение споров",
    "city": "Астана",
    "address": "BC Talan Towers, ул. Достык 16, 16 этаж",
    "website": "https://www.dentons.com"
  },
  {
    "id": 13,
    "name": "Адвокатская контора NS",
    "phone": "+7 700 152-05-05",
    "email": "info@advocate-ns.kz",
    "specialization": "Уголовное, семейное, налоговое право, земельные споры, банкротство",
    "city": "Алматы",
    "address": "пр. Абая, 151, БЦ «Алатау», оф. 207",
    "website": "https://advocate-ns.kz/"
  },
  {
    "id": 14,
    "name": "Яшенкова Ксения Дмитриевна (ЮК «Коваль и Партнёры»)",
    "phone": "+7 747 944-08-48; +7 702 057-48-30",
    "email": "kovalipartnery@mail.ru",
    "specialization": "Гражданское, семейное, налоговое, корпоративное, трудовое право",
    "city": "Алматы",
    "address": "ул. Жандосова, 98, БЦ «Навои», оф. 312",
    "website": "https://advokat-yurist.kz/"
  },
  {
    "id": 15,
    "name": "ЮК «Sergeyev V» (Advokat02)",
    "phone": "+7 700 090-09-92",
    "email": "info@advokat02.kz",
    "specialization": "Гражданские, уголовные дела, семейные споры, налоговое право",
    "city": "Алматы",
    "address": "ул. Бектурова, 77а",
    "website": "https://advokat02.kz/"
  },
  {
    "id": 16,
    "name": "Адвокатская контора «АСАТ» (ACAT)",
    "phone": "+7 727 228-22-23; +7 777 838-22-22",
    "email": "",
    "specialization": "Уголовное право (основное), гражданские, административные дела",
    "city": "Алматы",
    "address": "г. Алматы",
    "website": "https://www.acat.kz/"
  },
  {
    "id": 17,
    "name": "Байтенов Толеген (White Group)",
    "phone": "Н/Д (через сайт)",
    "email": "",
    "specialization": "Уголовное право (тяжкие статьи), 5 оправдательных приговоров",
    "city": "Алматы",
    "address": "ул. Толе Би, 101, БЦ «Толе Би», 6 этаж",
    "website": "https://www.whitegroup.kz/"
  },
  {
    "id": 18,
    "name": "Кручев Станислав Игоревич",
    "phone": "Н/Д (через сайт)",
    "email": "",
    "specialization": "Семейное право (развод, раздел имущества, алименты, опека)",
    "city": "Алматы",
    "address": "г. Алматы",
    "website": "https://advokat-kruchev.kz/"
  },
  {
    "id": 19,
    "name": "Абдиев Сакен Утегенович",
    "phone": "+7 777 279-87-53",
    "email": "",
    "specialization": "Общая адвокатская практика",
    "city": "Алматы",
    "address": "ул. Байтурсынова, 147, кв. 8",
    "website": ""
  },
  {
    "id": 20,
    "name": "Абенова Гульмира Канатовна",
    "phone": "+7 701 111-03-03",
    "email": "",
    "specialization": "Общая адвокатская практика",
    "city": "Алматы",
    "address": "ул. Манаса, 24 «В», оф. 4",
    "website": ""
  },
  {
    "id": 21,
    "name": "Baker McKenzie (Алматы)",
    "phone": "+7 727 330-05-00",
    "email": "almaty@bakermckenzie.com",
    "specialization": "M&A, банковское право, разрешение споров, энергетика",
    "city": "Алматы",
    "address": "ул. Жолдасбекова, 97, Samal Towers, 8 этаж",
    "website": "https://www.bakermckenzie.com"
  },
  {
    "id": 22,
    "name": "Kinstellar (Алматы)",
    "phone": "+7 727 355-05-30",
    "email": "almaty.office@kinstellar.com",
    "specialization": "Корпоративное право, финансы, энергетика, разрешение споров",
    "city": "Алматы",
    "address": "ул. С. Сейфуллина, 502, Turar BC, оф. 501",
    "website": "https://www.kinstellar.com"
  },
  {
    "id": 23,
    "name": "SALUS Legal",
    "phone": "+7 727 352-80-83",
    "email": "info@salus.law",
    "specialization": "Корпоративное, M&A, трудовое, налоговое право, недропользование",
    "city": "Алматы",
    "address": "ул. Жарокова, 276В",
    "website": "https://salus.law/"
  },
  {
    "id": 24,
    "name": "Bolotov & Partners LLP",
    "phone": "+7 727 357-23-80; +7 701 216-20-81",
    "email": "info@BolotovIP.com",
    "specialization": "Интеллектуальная собственность",
    "city": "Алматы",
    "address": "ул. Ауэзова, 60, Almaty Residence BC, 4 этаж",
    "website": "https://bolotovip.com/"
  },
  {
    "id": 25,
    "name": "GRATA International (Алматы)",
    "phone": "+7 727 244-57-77",
    "email": "almaty@gratanet.com",
    "specialization": "Корпоративное, налоговое право, M&A, недропользование, ГЧП",
    "city": "Алматы",
    "address": "пр. Аль-Фараби, 77/7, Esentai Tower, 10 этаж",
    "website": "https://gratanet.com"
  },
  {
    "id": 26,
    "name": "Zanger Law Firm",
    "phone": "+7 727 250-47-04; +7 777 552-28-56",
    "email": "info@zangerlf.com",
    "specialization": "Юридические услуги (общая практика)",
    "city": "Алматы",
    "address": "ул. Шевченко, 165Б, оф. 802",
    "website": "https://www.zangerlf.com"
  },
  {
    "id": 27,
    "name": "Неясова Набира Мурзахметовна",
    "phone": "+7 7252 39-07-70",
    "email": "shymkent_gka@mail.ru",
    "specialization": "Общее руководство; гражданское, уголовное, административное право",
    "city": "Шымкент",
    "address": "ул. Байтурсынова, 86/10",
    "website": "egov.kz"
  },
  {
    "id": 28,
    "name": "Абдикулов Ермек Еркимбекович",
    "phone": "+7 701 727-17-28",
    "email": "",
    "specialization": "Уголовное и гражданское право",
    "city": "Шымкент",
    "address": "ул. Ж. Сулейменова, 22",
    "website": "advokat.kz"
  },
  {
    "id": 29,
    "name": "Абдранбаева Динара Ержановна",
    "phone": "+7 777 363-63-56",
    "email": "",
    "specialization": "Гражданское право, семейные споры",
    "city": "Шымкент",
    "address": "пр. Тауке хана, 93/2, оф. 9",
    "website": "findh.org"
  },
  {
    "id": 30,
    "name": "Абдукадиров Абдимурат Абдраманович",
    "phone": "+7 701 333-79-73",
    "email": "",
    "specialization": "Гражданское и уголовное право",
    "city": "Шымкент",
    "address": "ул. Г. Иляева, 22, оф. 44",
    "website": "findh.org"
  },
  {
    "id": 31,
    "name": "Жумаев Берик Дуйсенбекович",
    "phone": "Н/Д (через yur.kz)",
    "email": "",
    "specialization": "Семейное право (разводы, наследство, алименты), трудовые споры",
    "city": "Шымкент",
    "address": "г. Шымкент",
    "website": "https://yur.kz/"
  },
  {
    "id": 32,
    "name": "Агадилов Ерболат Мухамедканапияевич",
    "phone": "+7 707 310-12-12",
    "email": "",
    "specialization": "Имущественное, земельное, административное право",
    "city": "Шымкент",
    "address": "ул. Желтоксан, 19/4",
    "website": "findh.org"
  },
  {
    "id": 33,
    "name": "Коваленко Александр Владимирович",
    "phone": "+7 701 365-27-43",
    "email": "",
    "specialization": "Гражданское (договорные, ДТП), семейное, уголовное, трудовое право",
    "city": "Қарағанды",
    "address": "ул. Саттара Ерубаева, 21",
    "website": "https://advokat-kr.kz/"
  },
  {
    "id": 34,
    "name": "Дюсембин Данияр (ЮК «De Facto»)",
    "phone": "+7 776 447-27-64",
    "email": "info@defacto.kz",
    "specialization": "Корпоративное право, сопровождение бизнеса",
    "city": "Қарағанды",
    "address": "ул. Ерубаева, 48, ТЦ «Азат», оф. 301",
    "website": "https://defacto.kz/"
  },
  {
    "id": 35,
    "name": "Мархиев Магомед Абоевич",
    "phone": "+7 778 596-66-66",
    "email": "",
    "specialization": "Уголовное право (защита по уголовным делам)",
    "city": "Қарағанды",
    "address": "пр. Н. Назарбаева, 53",
    "website": ""
  },
  {
    "id": 36,
    "name": "Рожков Артем Сергеевич",
    "phone": "+7 777 889-73-75",
    "email": "",
    "specialization": "Гражданское право (имущественные, жилищные споры)",
    "city": "Қарағанды",
    "address": "ул. Ержанова, 34/1",
    "website": ""
  },
  {
    "id": 37,
    "name": "Гусаков Юрий Анатольевич",
    "phone": "+7 7212 42-40-86",
    "email": "ygussakov@gmail.com",
    "specialization": "Международное право, права человека, гражданское право",
    "city": "Қарағанды",
    "address": "ул. Костенко, 6, оф. 93",
    "website": ""
  },
  {
    "id": 38,
    "name": "Абдурахимова Юлия Раиймбергеновна",
    "phone": "+7 701 918-61-93",
    "email": "",
    "specialization": "Семейное, гражданское право",
    "city": "Қарағанды",
    "address": "ул. Ерубаева, 32",
    "website": ""
  },
  {
    "id": 39,
    "name": "Уразов Н.С.",
    "phone": "+7 702 496-04-40",
    "email": "",
    "specialization": "Уголовное право, адвокатская защита",
    "city": "Ақтөбе",
    "address": "пр. Абилкайыр хана, 1",
    "website": "2gis.kz"
  },
  {
    "id": 40,
    "name": "Иманов Болатхан Тлеуғалиұлы",
    "phone": "+7 747 550-69-50",
    "email": "",
    "specialization": "Уголовные дела, гражданские дела, алименты",
    "city": "Ақтөбе",
    "address": "пр. 312-й Стрелковой Дивизии, 7В",
    "website": "spravker.ru"
  },
  {
    "id": 41,
    "name": "Адвокатская контора Сундетбаевых",
    "phone": "+7 771 185-55-56; +7 701 616-88-82",
    "email": "",
    "specialization": "Уголовные дела, гражданские дела, семейное право",
    "city": "Ақтөбе",
    "address": "пр. Абилкайыр хана, 12",
    "website": "2gis.kz"
  },
  {
    "id": 42,
    "name": "Абдулина Эльвира Махсатовна",
    "phone": "+7 701 570-87-18",
    "email": "",
    "specialization": "Гражданские, уголовные, административные дела",
    "city": "Ақтөбе",
    "address": "ул. Алии Молдагуловой, 57-16",
    "website": "advokat.kz"
  },
  {
    "id": 43,
    "name": "GRATA International (Ақтөбе)",
    "phone": "+7 7132 741-141",
    "email": "aktobe@gratanet.com",
    "specialization": "Корпоративное, налоговое, трудовое право, недропользование",
    "city": "Ақтөбе",
    "address": "пр. А. Молдагуловой, 46, Capital Plaza BC, оф. 106",
    "website": "https://gratanet.com"
  },
  {
    "id": 44,
    "name": "Балтабаева Актолкын Мурадынкызы",
    "phone": "+7 778 788-83-82",
    "email": "info@advocate-atyrau.kz",
    "specialization": "Уголовное, гражданское, семейное право, сопровождение бизнеса",
    "city": "Атырау",
    "address": "ул. Абая, 16а, оф. 4",
    "website": "https://advocate-atyrau.kz/"
  },
  {
    "id": 45,
    "name": "Аввакумов Александр Юрьевич",
    "phone": "+7 701 647-99-90",
    "email": "",
    "specialization": "Гражданские, уголовные дела",
    "city": "Атырау",
    "address": "пр. Азаттык, 138А",
    "website": "advokat.kz"
  },
  {
    "id": 46,
    "name": "Абдешева Жазира Айтжановна",
    "phone": "+7 701 425-80-58",
    "email": "",
    "specialization": "Гражданские дела, представительство в суде",
    "city": "Атырау",
    "address": "ул. Абая, Атырау",
    "website": "advokat.kz"
  },
  {
    "id": 47,
    "name": "GRATA International (Атырау)",
    "phone": "+7 7122 50-17-12",
    "email": "atyrau@gratanet.com",
    "specialization": "Корпоративное право, нефтегазовый сектор, налоговое право",
    "city": "Атырау",
    "address": "ул. Айтеке Би, 55, River Palace Hotel, 2 этаж, оф. B1",
    "website": "https://gratanet.com"
  },
  {
    "id": 48,
    "name": "Махышев Сакен Турганулы (Председатель коллегии)",
    "phone": "+7 7272 71-36-77",
    "email": "advokatura_atyrau777@mail.ru",
    "specialization": "Общая практика (Председатель коллегии адвокатов Атырауской обл.)",
    "city": "Атырау",
    "address": "ул. Атамбаева, 20б",
    "website": "egov.kz"
  },
  {
    "id": 49,
    "name": "Тукибаева Гульнура Дуйсенбаевна",
    "phone": "Н/Д (через 2ГИС)",
    "email": "",
    "specialization": "Медиация, адвокатура, юридические консультации",
    "city": "Ақтау",
    "address": "БЦ Ажар, 17 мкр, 48",
    "website": "2gis.kz"
  },
  {
    "id": 50,
    "name": "Чунетов Е.Е.",
    "phone": "Н/Д (через 2ГИС)",
    "email": "",
    "specialization": "Уголовные, гражданские дела",
    "city": "Ақтау",
    "address": "ЖК Green Park, 17 мкр, 7",
    "website": "2gis.kz"
  },
  {
    "id": 51,
    "name": "Давлетбаев Сергей Гиреевич",
    "phone": "+7 701 224-47-47",
    "email": "",
    "specialization": "Гражданское, уголовное право",
    "city": "Ақтау",
    "address": "29 мкр, Алтын Орда, каб. 105",
    "website": "findh.org"
  },
  {
    "id": 52,
    "name": "GRATA International (Ақтау)",
    "phone": "+7 7292 433-505",
    "email": "aktau@gratanet.com",
    "specialization": "Корпоративное право, недропользование, нефтегаз",
    "city": "Ақтау",
    "address": "11 мкр, зд. 7, оф. 13",
    "website": "https://gratanet.com"
  },
  {
    "id": 53,
    "name": "Боднарчук Н.Е.",
    "phone": "+7 701 340-88-00; +7 700 951-39-07",
    "email": "",
    "specialization": "Гражданское право, представительство в суде",
    "city": "Павлодар",
    "address": "БЦ «Бизнес холл», ул. Ген. Дюсенова, 106",
    "website": "2gis.kz"
  },
  {
    "id": 54,
    "name": "Михайлова Татьяна Владимировна",
    "phone": "+7 705 659-77-52",
    "email": "",
    "specialization": "Гражданское право",
    "city": "Павлодар",
    "address": "ул. Ак. Сатпаева, 65, оф. 305",
    "website": "kdmid.ru"
  },
  {
    "id": 55,
    "name": "Батырбаев М.Б.",
    "phone": "+7 7182 32-13-51",
    "email": "",
    "specialization": "Юридическая помощь, представительство в суде",
    "city": "Павлодар",
    "address": "пр. Н. Назарбаева, 32",
    "website": "spravker.ru"
  },
  {
    "id": 56,
    "name": "Яскевич С.Б.",
    "phone": "Н/Д (через каталог)",
    "email": "",
    "specialization": "Гражданское право (взыскание долгов, снятие арестов, банковские споры)",
    "city": "Павлодар",
    "address": "ул. Кривенко, 23, каб. 1",
    "website": "ivest.kz"
  },
  {
    "id": 57,
    "name": "Белоножко Матвей",
    "phone": "+7 701 477-77-47; +7 7142 56-77-02",
    "email": "info@advokatqostanay.kz",
    "specialization": "Гражданские, уголовные, семейные, трудовые дела, банкротство",
    "city": "Қостанай",
    "address": "ул. Чехова, 125",
    "website": "https://advokatqostanay.kz/"
  },
  {
    "id": 58,
    "name": "Моисеева Валентина Викторовна",
    "phone": "+7 777 636-41-29; +7 705 449-90-77",
    "email": "",
    "specialization": "Гражданские дела, защита авторских прав",
    "city": "Қостанай",
    "address": "ул. Амангельды, 93Б",
    "website": "spravker.ru"
  },
  {
    "id": 59,
    "name": "Абишев Булат Саматович",
    "phone": "+7 701 700-13-84",
    "email": "",
    "specialization": "Общая адвокатская практика",
    "city": "Қостанай",
    "address": "ул. Аль-Фараби, 65, БЦ «CityKostanai», оф. 411",
    "website": "findh.org"
  },
  {
    "id": 60,
    "name": "Хисматуллин Рамиль Гайфитдинович",
    "phone": "+7 7142 56-78-65",
    "email": "kost-obl-kollegia@mail.ru",
    "specialization": "Общая практика (Председатель областной коллегии адвокатов)",
    "city": "Қостанай",
    "address": "ул. Тәуелсіздік, 111",
    "website": "advokatura.kz"
  },
  {
    "id": 61,
    "name": "Шигрин Сергей Викторович",
    "phone": "+7 705 75-25-000",
    "email": "pravkz@bk.ru",
    "specialization": "Уголовное, гражданское, экономическое, корпоративное право",
    "city": "Өскемен",
    "address": "ул. Бурова, 19",
    "website": "https://prav.kz/"
  },
  {
    "id": 62,
    "name": "Лукьяненко Галина Викторовна",
    "phone": "Н/Д (через yk.kz)",
    "email": "",
    "specialization": "Корпоративные, семейные, наследственные, трудовые споры",
    "city": "Өскемен",
    "address": "ул. Казахстан, 64",
    "website": "yk.kz"
  },
  {
    "id": 63,
    "name": "Сердюкова Любовь Павловна",
    "phone": "+7 705 186-12-33",
    "email": "info@advokaty-vko.kz",
    "specialization": "Общая юридическая практика (зав. ЮК №1)",
    "city": "Өскемен",
    "address": "ул. Красина, 3-101",
    "website": "https://advokaty-vko.kz/"
  },
  {
    "id": 64,
    "name": "Зайнишев Е.К.",
    "phone": "Н/Д (общий: +7 7232 60-11-80)",
    "email": "",
    "specialization": "Уголовные, гражданские, семейные, автотранспортные споры",
    "city": "Өскемен",
    "address": "ул. А. Чехова, 71",
    "website": "2gis.kz"
  },
  {
    "id": 65,
    "name": "Коллегия адвокатов ВКО (общий контакт)",
    "phone": "+7 7232 60-11-80",
    "email": "vkoadvokatk@mail.ru",
    "specialization": "Все виды правовой помощи",
    "city": "Өскемен",
    "address": "ул. Красина, 3",
    "website": "https://advokaty-vko.kz/"
  },
  {
    "id": 66,
    "name": "Поляков Михаил Андреевич",
    "phone": "+7 701 503-07-19",
    "email": "",
    "specialization": "Гражданские, уголовные, семейные, налоговые, корпоративные дела",
    "city": "Петропавл",
    "address": "ул. Конституции Казахстана, 4, оф. «Адвокат»",
    "website": "https://polyakov.kz/"
  },
  {
    "id": 67,
    "name": "«Ваш Адвокат» (команда адвокатов)",
    "phone": "+7 771 833-33-33; +7 777 553-73-39",
    "email": "",
    "specialization": "Уголовные дела (защита), ДТП, гражданские споры",
    "city": "Петропавл",
    "address": "ул. Ауэзова, 160, оф. «Ваш Адвокат»",
    "website": "https://vash-advokat.kz/"
  },
  {
    "id": 68,
    "name": "Шипп Алексей Иванович",
    "phone": "+7 7152 33-16-49",
    "email": "skookapetr@mail.ru",
    "specialization": "Общая практика (Председатель СКО коллегии адвокатов)",
    "city": "Петропавл",
    "address": "ул. Астана, 22",
    "website": ""
  },
  {
    "id": 69,
    "name": "Арапов Сергей Николаевич",
    "phone": "+7 777 325-57-58",
    "email": "",
    "specialization": "Гражданское, уголовное право",
    "city": "Петропавл",
    "address": "ул. Астана, 22",
    "website": "findh.org"
  },
  {
    "id": 70,
    "name": "Раисова Анжелика Абдибековна",
    "phone": "+7 7262 45-04-34",
    "email": "advo-taraza@mail.ru",
    "specialization": "Гражданское, уголовное, корпоративное право (Председатель коллегии)",
    "city": "Тараз",
    "address": "ул. Толе-Би, 51",
    "website": "egov.kz"
  },
  {
    "id": 71,
    "name": "Патейев Бибарыс Қуанышұлы",
    "phone": "Н/Д (через Instagram)",
    "email": "",
    "specialization": "Уголовное, гражданское, семейное право, ДТП",
    "city": "Тараз",
    "address": "мкр Акбулак / ул. Ниеткалиева, 12",
    "website": "instagram.com/advokat_pateiev"
  },
  {
    "id": 72,
    "name": "Абдрахманова К.Б.",
    "phone": "+7 701 689-02-93; +7 777 481-73-73",
    "email": "",
    "specialization": "Гражданское, семейное, наследственное право",
    "city": "Тараз",
    "address": "ул. Рысбек батыра, 4",
    "website": "spravker.ru"
  },
  {
    "id": 73,
    "name": "ЮК «Братья Баймагамбетовы» / YurTar.kz",
    "phone": "+7 707 214-66-26; +7 7262 500-997",
    "email": "",
    "specialization": "Налоговое, земельное, трудовое право, банкротство, госзакупки",
    "city": "Тараз",
    "address": "мкр Каратау, 41Б",
    "website": "http://www.yurtar.kz"
  },
  {
    "id": 74,
    "name": "Даубалаев Мейрбек Тилләбекұлы",
    "phone": "+7 701 900-52-43; +7 7242 27-75-19",
    "email": "k_advokatura@mail.ru",
    "specialization": "Гражданские, уголовные, административные дела (Председатель коллегии)",
    "city": "Қызылорда",
    "address": "ул. Кунаева, 10",
    "website": "egov.kz"
  },
  {
    "id": 75,
    "name": "Миманова Гульнар Койшыбаевна",
    "phone": "+7 701 521-96-20",
    "email": "",
    "specialization": "Гражданские, административные, уголовные дела",
    "city": "Қызылорда",
    "address": "ул. Кунаева, 10",
    "website": "adilsoz.kz"
  },
  {
    "id": 76,
    "name": "Канатбаев Темирхан Каржаубаевич",
    "phone": "+7 775 000-51-62",
    "email": "",
    "specialization": "Административное и уголовное право",
    "city": "Қызылорда",
    "address": "ул. Кунаева, 10",
    "website": "adilsoz.kz"
  },
  {
    "id": 77,
    "name": "Айдаров Рашид Маликович",
    "phone": "+7 701 269-25-19; +7 777 561-17-96",
    "email": "",
    "specialization": "Гражданские, административные, уголовные дела",
    "city": "Қызылорда",
    "address": "ул. Кунаева, 10",
    "website": "findh.org"
  },
  {
    "id": 78,
    "name": "Ахметжанова Ботагоз Акрамовна",
    "phone": "+7 7252 53-02-01",
    "email": "turkestan.advokat@gmail.com",
    "specialization": "Уголовное, гражданское, корпоративное право (Председатель коллегии)",
    "city": "Түркістан",
    "address": "мкр Жаңа қала, 160 квартал, 561 участок",
    "website": "egov.kz"
  },
  {
    "id": 79,
    "name": "Абдразаков Букарбай Аширханович",
    "phone": "+7 701 326-24-25",
    "email": "",
    "specialization": "Гражданское и уголовное право",
    "city": "Түркістан облысы",
    "address": "с. Мырзакент, ул. Қожанов б/н",
    "website": "advokat.kz"
  },
  {
    "id": 80,
    "name": "Кунходжаев Мурат Бегалиевич",
    "phone": "+7 701 831-39-99; +7 705 355-66-22",
    "email": "",
    "specialization": "Гражданское, семейное, административное право",
    "city": "Түркістан облысы (Арыс)",
    "address": "г. Арыс, ул. Толеби, 2-б",
    "website": "advokat.kz"
  },
  {
    "id": 81,
    "name": "ЮЦ «Равдель» (адвокат Равдель В.В.)",
    "phone": "+7 706 636-82-77; +7 7112 24-08-30",
    "email": "mail@rav.kz",
    "specialization": "Уголовные, семейные, земельные, трудовые дела, сопровождение бизнеса",
    "city": "Орал",
    "address": "ул. Жукова, 4",
    "website": "https://rav.kz"
  },
  {
    "id": 82,
    "name": "Мирзоева Лейла Ниязовна",
    "phone": "+7 776 913-88-00; +7 707 113-50-45",
    "email": "",
    "specialization": "Гражданские дела, оспаривание недвижимости",
    "city": "Орал",
    "address": "ул. К. Аманжолова, 106, 3 этаж, каб. 1",
    "website": "https://yur.kz/"
  },
  {
    "id": 83,
    "name": "Mirmanov & Partners",
    "phone": "Н/Д (через сайт)",
    "email": "",
    "specialization": "Корпоративное, интеллектуальная собственность, трудовое, семейное, уголовное право",
    "city": "Орал (+ Астана)",
    "address": "пр. Абулхайрхана, 167",
    "website": "https://mirmanov.kz/"
  },
  {
    "id": 84,
    "name": "АК «БЕМиК»",
    "phone": "+7 777 574-62-25",
    "email": "",
    "specialization": "Досудебное и внесудебное урегулирование, адвокатская защита",
    "city": "Орал",
    "address": "ул. М. Жунисова, 108",
    "website": "spravker.ru"
  },
  {
    "id": 85,
    "name": "Демесинов Кайрат Аманкосович (Председатель коллегии ЗКО)",
    "phone": "+7 7122 50-31-23",
    "email": "west_advokatura@mail.ru",
    "specialization": "Общая практика (Председатель коллегии адвокатов ЗКО)",
    "city": "Орал",
    "address": "ул. Ихсанова, 457",
    "website": "egov.kz"
  },
  {
    "id": 86,
    "name": "Голиков Иван Николаевич",
    "phone": "+7 707 900-44-47",
    "email": "",
    "specialization": "Уголовное и гражданское право",
    "city": "Жезқазған",
    "address": "ул. Анаркулова, 12",
    "website": "findh.org"
  },
  {
    "id": 87,
    "name": "Атажанов Сайлау Сагадуллинович",
    "phone": "+7 777 294-32-13",
    "email": "",
    "specialization": "Адвокатская практика (индивидуально)",
    "city": "Жезқазған",
    "address": "г. Жезказган",
    "website": "findh.org"
  },
  {
    "id": 88,
    "name": "Балагазин Жаксылык Ермекович",
    "phone": "+7 777 573-99-59",
    "email": "",
    "specialization": "Адвокатская практика",
    "city": "Жезқазған",
    "address": "г. Жезказган",
    "website": "findh.org"
  },
  {
    "id": 89,
    "name": "Голоколосов Алексей Сергеевич",
    "phone": "+7 777 763-96-99",
    "email": "",
    "specialization": "Адвокатская практика (индивидуально)",
    "city": "Жезқазған",
    "address": "г. Жезказган",
    "website": "findh.org"
  },
  {
    "id": 90,
    "name": "Прасолова Юлия Станиславовна",
    "phone": "+7 777 254-07-17",
    "email": "julia_prasolova@mail.ru",
    "specialization": "Гражданское право",
    "city": "Семей",
    "address": "ул. Уранхаева, 61",
    "website": "kdmid.ru"
  },
  {
    "id": 91,
    "name": "Азимбаев Ескельды Аманжолович",
    "phone": "+7 7222 52-33-77",
    "email": "",
    "specialization": "Уголовное, гражданское право",
    "city": "Семей",
    "address": "ул. К. Мухамедханова, 28",
    "website": "advokaty-vko.kz"
  },
  {
    "id": 92,
    "name": "Бекбулатова Кенже Сейтжагпаровна",
    "phone": "+7 7222 52-57-72",
    "email": "",
    "specialization": "Семейное, гражданское право",
    "city": "Семей",
    "address": "ул. К. Мухамедханова, 28",
    "website": "advokaty-vko.kz"
  },
  {
    "id": 93,
    "name": "Мусин Б.Т.",
    "phone": "Н/Д (через 2ГИС)",
    "email": "",
    "specialization": "Уголовное, гражданское право",
    "city": "Семей",
    "address": "ул. К. Мухамедханова, 23",
    "website": "2gis.kz"
  },
  {
    "id": 94,
    "name": "Сагиндыкова Гульнар Избасаровна",
    "phone": "+7 728 224-55-99; +7 701 377-96-25",
    "email": "",
    "specialization": "Гражданские, уголовные дела",
    "city": "Талдықорған",
    "address": "ул. Каблиса Жырау, 64",
    "website": "spravker.ru"
  },
  {
    "id": 95,
    "name": "Адильбекова Данипа Медетовна (Председатель коллегии Жетісу)",
    "phone": "",
    "email": "",
    "specialization": "Общая практика (Председатель коллегии адвокатов обл. Жетісу)",
    "city": "Талдықорған",
    "address": "ул. К. Майстрюка, стр. 2А",
    "website": "egov.kz"
  },
  {
    "id": 96,
    "name": "Мун Д.В.",
    "phone": "Н/Д (через 2ГИС)",
    "email": "",
    "specialization": "Общая адвокатская практика",
    "city": "Талдықорған",
    "address": "мкр. Жастар, 33",
    "website": "2gis.kz"
  },
  {
    "id": 97,
    "name": "Толганай Нурланбековна",
    "phone": "",
    "email": "",
    "specialization": "Общая адвокатская практика",
    "city": "Талдықорған",
    "address": "ул. Шевченко, 119",
    "website": "2gis.kz"
  },
  {
    "id": 98,
    "name": "Morgan Lewis (Алматы)",
    "phone": "+7 727 250-75-75",
    "email": "info@morganlewis.com",
    "specialization": "Корпоративное право, финансы, энергетика",
    "city": "Алматы",
    "address": "ул. Достык, 38, Ken Dala BC, 5 этаж",
    "website": "https://www.morganlewis.com"
  },
  {
    "id": 99,
    "name": "GRATA International (Кызылорда)",
    "phone": "+7 701 768-07-85",
    "email": "",
    "specialization": "Корпоративное, налоговое право, недропользование",
    "city": "Қызылорда",
    "address": "г. Кызылорда",
    "website": "https://gratanet.com"
  },
  {
    "id": 100,
    "name": "OilTech Consulting Group (Атырау)",
    "phone": "+7 7122 76-12-41",
    "email": "office@otcgroup.kz",
    "specialization": "Юридические услуги, консалтинг, нефтегазовый сектор",
    "city": "Атырау",
    "address": "ул. Хакимова, 4",
    "website": "www.otcgroup.kz"
  }
];
