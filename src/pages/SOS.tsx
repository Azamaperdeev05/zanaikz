import { useState } from 'react';
import { AlertTriangle, Phone, ShieldAlert, ChevronRight, BookOpen, Scale, Users, FileText } from 'lucide-react';
import { useLangStore } from '../store/langStore';
import { t } from '../utils/i18n';

export default function SOS() {
  const { lang } = useLangStore();
  const [selectedGuide, setSelectedGuide] = useState<number | null>(null);

  const emergencyNumbers = [
    { name: t(lang, 'sos', 'police'), number: '102' },
    { name: t(lang, 'sos', 'ambulance'), number: '103' },
    { name: t(lang, 'sos', 'emergency'), number: '112' }
  ];

  const guides = [
    {
      title: lang === 'kk' ? 'Сізді ұстаған кезде не істеу керек?' : 'Что делать при задержании?',
      icon: ShieldAlert,
      color: '#ff3b30',
      content: lang === 'kk' 
        ? `1. Полиция қызметкерінен өзін таныстыруды және қызметтік куәлігін көрсетуді талап етіңіз.\n2. Ұстау себебін біліңіз — ол сізге ұстау хаттамасын жасауға міндетті.\n3. Сөйлесуден бас тартуға және адвокатты күтуге құқығыңыз бар (ҚР Конституциясы, 16-бап).\n4. Туыстарыңызға хабарлауды талап етіңіз — ұстаудан кейін 3 сағат ішінде.\n5. Ешқандай құжатқа адвокатсыз қол қоймаңыз.\n6. Дененізге зақым келтірілсе, дереу медициналық тексерістен өтуді талап етіңіз.`
        : `1. Потребуйте от сотрудника полиции представиться и предъявить служебное удостоверение.\n2. Узнайте причину задержания — он обязан составить протокол задержания.\n3. Вы имеете право хранить молчание до приезда адвоката (Конституция РК, ст. 16).\n4. Потребуйте уведомить родственников — в течение 3 часов с момента задержания.\n5. Не подписывайте никакие документы без адвоката.\n6. Если вам причинён телесный вред, немедленно потребуйте медицинское освидетельствование.`
    },
    {
      title: lang === 'kk' ? 'Тінту кезіндегі сіздің құқықтарыңыз' : 'Ваши права при обыске',
      icon: BookOpen,
      color: '#ff9500',
      content: lang === 'kk'
        ? `1. Тінтуге негіз болатын сот қаулысын немесе прокурор санкциясын талап етіңіз.\n2. Тінту кезінде кем дегенде екі куәгер (понятой) болуы тиіс.\n3. Тінту хаттамасына барлық ескертулеріңізді жазыңыз.\n4. Хаттаманың көшірмесін міндетті түрде алыңыз.\n5. Алынған заттар тізімін мұқият оқып, қол қоймас бұрын тексеріңіз.\n6. Бейне немесе аудио жазуға құқығыңыз бар — бұларға тыйым салу заңсыз.`
        : `1. Потребуйте постановление суда или санкцию прокурора на проведение обыска.\n2. При обыске должны присутствовать как минимум двое понятых.\n3. Записывайте все замечания в протокол обыска.\n4. Обязательно получите копию протокола.\n5. Внимательно проверьте список изъятых вещей перед подписанием.\n6. Вы имеете право на видео- или аудиозапись — запрещать это незаконно.`
    },
    {
      title: lang === 'kk' ? 'Адвокат талап ету құқығы' : 'Право требовать адвоката',
      icon: Scale,
      color: '#5856d6',
      content: lang === 'kk'
        ? `1. ҚР Конституциясының 13-бабы бойынша ұсталған сәттен бастап білікті заң көмегіне құқығыңыз бар.\n2. Адвокатсыз ешқандай жауап бермеңіз — бұл заңды құқығыңыз.\n3. Егер жеке адвокатыңыз болмаса, мемлекет тегін адвокат ұсынуға міндетті.\n4. Адвокатты шақыру құқығынан бас тартуға мәжбүрлеу — қылмыстық құқық бұзушылық.\n5. Адвокат келгенге дейін сізге «сөйлеспеңіз, тек аты-жөніңізді айтыңыз» деп кеңес беріледі.\n6. Тегін адвокатты шақыру үшін 1414 (заң көмегі) нөміріне хабарласыңыз.`
        : `1. Согласно статье 13 Конституции РК, вы имеете право на квалифицированную юридическую помощь с момента задержания.\n2. Не давайте никаких показаний без адвоката — это ваше законное право.\n3. Если у вас нет личного адвоката, государство обязано предоставить бесплатного.\n4. Принуждение к отказу от адвоката — уголовное правонарушение.\n5. До прибытия адвоката рекомендуется: «Не разговаривайте, называйте только своё имя».\n6. Для вызова бесплатного адвоката звоните: 1414 (юридическая помощь).`
    },
    {
      title: lang === 'kk' ? 'Тұрмыстық зорлық-зомбылық кезінде' : 'При домашнем насилии',
      icon: Users,
      color: '#ff2d55',
      content: lang === 'kk'
        ? `1. Дереу 102 (полиция) немесе 112 (төтенше жағдайлар) нөміріне хабарласыңыз.\n2. Қауіпсіз жерге барыңыз — көршілерге, туыстарға немесе кризис орталықтарына.\n3. Қорғаныш ордерін (қорғау қағазы) талап ету құқығыңыз бар.\n4. Ішкі істер органдары зорлық фактісін тіркеуге міндетті.\n5. Медициналық тексерістен өтіп, дәлел ретінде актіні сақтаңыз.\n6. Кризис орталықтар желісі: 150 (тегін, жасырын).\n7. «Бала мен әйелдер құқығын қорғау» жөніндегі заң сізге нақты қорғау кепілдік береді.`
        : `1. Немедленно позвоните: 102 (полиция) или 112 (экстренные ситуации).\n2. Перейдите в безопасное место — к соседям, родственникам или в кризисный центр.\n3. Вы имеете право требовать защитный ордер (охранный документ).\n4. Органы внутренних дел обязаны зарегистрировать факт насилия.\n5. Пройдите медицинское освидетельствование и сохраните акт как доказательство.\n6. Линия кризисных центров: 150 (бесплатно, конфиденциально).\n7. Закон «О защите прав ребёнка и женщин» гарантирует вам конкретную защиту.`
    },
    {
      title: lang === 'kk' ? 'ЖКО (ДТП) кезінде не істеу керек?' : 'Что делать при ДТП?',
      icon: FileText,
      color: '#0071e3',
      content: lang === 'kk'
        ? `1. Тоқтаңыз, қозғалтқышты сөндіріңіз, аварилық белгіні қойыңыз.\n2. Жәбірленушілер болса — дереу 103 шақырыңыз.\n3. Полицияны шақырыңыз — 102. Оқиға орнын қозғамаңыз.\n4. Фото және бейне түсіріңіз: көлік нөмірлері, зақымдар, жол белгілері.\n5. Куәгерлердің байланыс деректерін алыңыз.\n6. Хаттаманы мұқият оқып, сәйкессіздік болса жазбаша ескерту қалдырыңыз.\n7. Сақтандыру компаниясына 24 сағат ішінде хабарлаңыз.`
        : `1. Остановитесь, заглушите двигатель, выставите аварийный знак.\n2. Если есть пострадавшие — немедленно вызовите 103.\n3. Вызовите полицию — 102. Не перемещайте ТС с места ДТП.\n4. Сделайте фото и видео: номера машин, повреждения, дорожные знаки.\n5. Запишите контакты свидетелей.\n6. Внимательно прочитайте протокол, при несоответствии оставьте письменное замечание.\n7. Сообщите в страховую компанию в течение 24 часов.`
    }
  ];

  return (
    <div className="p-5 lg:p-8 max-w-4xl mx-auto h-full overflow-y-auto pb-32">
      {/* Alert Banner */}
      <div className="bg-[#ff3b30]/[0.06] border border-[#ff3b30]/10 rounded-[32px] p-6 mb-8 flex items-start gap-5 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-[#ff3b30]/10 flex items-center justify-center flex-shrink-0 animate-pulse">
          <AlertTriangle className="w-7 h-7 text-[#ff3b30]" />
        </div>
        <div>
          <h1 className="text-[24px] md:text-[28px] font-bold text-[#1d1d1f] tracking-tight mb-1">{t(lang, 'sos', 'title')}</h1>
          <p className="text-[15px] md:text-[16px] text-[#86868b] leading-relaxed max-w-2xl font-medium">
            {t(lang, 'sos', 'desc')}
          </p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Emergency Numbers */}
        <div className="bg-white p-7 rounded-[32px] border border-black/[0.04] shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-[18px] font-bold text-[#1d1d1f] mb-6 flex items-center gap-2.5">
            <Phone className="w-5 h-5 text-[#34c759]" />
            {t(lang, 'sos', 'emergencyLinks')}
          </h2>
          <div className="space-y-4">
            {emergencyNumbers.map((item, i) => (
              <a key={i} href={`tel:${item.number}`} className="flex justify-between items-center p-5 bg-[#f5f5f7] hover:bg-[#1d1d1f] hover:text-white rounded-[24px] transition-all group active:scale-[0.97] border border-transparent hover:border-white/10">
                <span className="text-[16px] font-bold">{item.name}</span>
                <span className="text-[26px] font-black tabular-nums text-[#0071e3] group-hover:text-white transition-colors">{item.number}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Quick Guides */}
        <div className="bg-white p-7 rounded-[32px] border border-black/[0.04] shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-[18px] font-bold text-[#1d1d1f] mb-6 flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-[#ff9500]" />
            {t(lang, 'sos', 'guides')}
          </h2>
          <div className="space-y-4">
            {guides.map((guide, i) => (
              <div key={i} className="space-y-3">
                <button 
                  onClick={() => setSelectedGuide(selectedGuide === i ? null : i)}
                  className={`w-full flex items-center justify-between p-5 rounded-[24px] transition-all text-left active:scale-[0.97] border ${
                    selectedGuide === i 
                      ? 'bg-[#1d1d1f] text-white border-transparent' 
                      : 'bg-[#f5f5f7] text-[#1d1d1f] border-transparent hover:bg-black/[0.03]'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 pr-4">
                    <guide.icon className={`w-5 h-5 flex-shrink-0 ${selectedGuide === i ? 'text-white' : ''}`} style={selectedGuide !== i ? { color: guide.color } : {}} />
                    <span className="text-[15px] font-bold leading-tight">{guide.title}</span>
                  </div>
                  <ChevronRight className={`w-5 h-5 transition-transform duration-300 flex-shrink-0 ${selectedGuide === i ? 'rotate-90 text-white' : 'text-[#86868b]'}`} />
                </button>
                {selectedGuide === i && (
                  <div className="p-5 bg-[#f5f5f7] rounded-[24px] border border-black/[0.04] animate-in fade-in zoom-in-95 duration-200">
                    <p className="text-[14px] text-[#1d1d1f] leading-relaxed whitespace-pre-line font-medium opacity-80">
                      {guide.content}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Important note */}
      <div className="bg-[#ff9500]/[0.04] border border-[#ff9500]/10 rounded-[24px] p-6 mt-4">
        <p className="text-[13px] text-[#86868b] leading-relaxed font-medium">
          <span className="font-bold text-[#ff9500]">{lang === 'kk' ? '⚠️ Маңызды:' : '⚠️ Важно:'}</span>{' '}
          {lang === 'kk' 
            ? 'Бұл ақпарат тек ақпараттық сипатта. Нақты жағдайда кәсіби заңгерге хабарласыңыз. Тегін заң көмегі: 1414.'
            : 'Данная информация носит исключительно информационный характер. В конкретной ситуации обратитесь к профессиональному юристу. Бесплатная юридическая помощь: 1414.'}
        </p>
      </div>
    </div>
  );
}
