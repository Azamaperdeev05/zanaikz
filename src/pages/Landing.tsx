import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useLangStore } from '../store/langStore';
import { t } from '../utils/i18n';
import { 
  Scale, MessageSquare, BookOpen, Calculator, FileText, 
  Users, Bot, ArrowRight, Menu, X, ShieldCheck, Zap, 
  BrainCircuit, ChevronRight, GraduationCap, Globe
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Landing() {
  const { user } = useAuthStore();
  const { lang, setLang } = useLangStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const features = [
    { icon: MessageSquare, title: t(lang, 'nav', 'chat'), desc: lang === 'kk' ? 'Жасанды интеллектпен құқықтық сұрақтарға жауап алыңыз.' : 'Получайте ответы на правовые вопросы с помощью ИИ.', color: '#0071e3' },
    { icon: BookOpen, title: t(lang, 'nav', 'laws'), desc: lang === 'kk' ? 'ҚР заңнамаларын іздеңіз. Adilet.zan.kz деректері.' : 'Ищите законодательство РК. Данные с Adilet.zan.kz.', color: '#34c759' },
    { icon: FileText, title: t(lang, 'nav', 'templates'), desc: lang === 'kk' ? 'Арыздар, шарттар, сенімхаттар — Word/PDF.' : 'Заявления, договоры, доверенности — Word/PDF.', color: '#af52de' },
    { icon: Calculator, title: t(lang, 'nav', 'calculators'), desc: lang === 'kk' ? 'Алимент, салық, декрет, штраф есептеу.' : 'Расчет алиментов, налогов, декретных и штрафов.', color: '#ff9500' },
    { icon: Users, title: t(lang, 'nav', 'lawyers'), desc: lang === 'kk' ? 'Тексерілген заңгерлер мен адвокаттар тізімі.' : 'Список проверенных юристов и адвокатов.', color: '#ff3b30' },
    { icon: ShieldCheck, title: t(lang, 'nav', 'sos'), desc: lang === 'kk' ? 'Құқықтық қысым кезінде жедел нұсқаулық.' : 'Оперативные инструкции при правовом давлении.', color: '#ff2d55' }
  ];

  return (
    <div className="min-h-screen bg-white antialiased" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', 'Segoe UI', system-ui, sans-serif" }}>

      {/* ─── NAVBAR ─── */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-xl backdrop-saturate-150 border-b border-black/5' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-center justify-between h-14">
            <Link to="/" className="flex items-center gap-2">
              <Scale className="w-6 h-6 text-[#1d1d1f]" />
              <span className="text-[17px] font-bold text-[#1d1d1f] tracking-tight">ЗаңКеңес AI</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-[13px] font-medium text-[#1d1d1f]/60 hover:text-[#1d1d1f] transition-colors">{t(lang, 'nav', 'features')}</a>
              <a href="#how" className="text-[13px] font-medium text-[#1d1d1f]/60 hover:text-[#1d1d1f] transition-colors">{t(lang, 'nav', 'howItWorks')}</a>
              <a href="#about" className="text-[13px] font-medium text-[#1d1d1f]/60 hover:text-[#1d1d1f] transition-colors">{t(lang, 'nav', 'about')}</a>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <button 
                onClick={() => setLang(lang === 'kk' ? 'ru' : 'kk')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-bold text-[#1d1d1f]/60 bg-black/[0.04] rounded-full hover:bg-black/[0.08]"
              >
                <Globe className="w-3.5 h-3.5" />
                {lang === 'kk' ? 'ҚАЗ' : 'РУС'}
              </button>
              {user ? (
                <Link to="/chat" className="text-[13px] font-bold text-white bg-[#0071e3] hover:bg-[#0077ED] px-5 py-2 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#0071e3]/20">
                  {t(lang, 'nav', 'goToChat')}
                </Link>
              ) : (
                <Link to="/login" className="text-[13px] font-bold text-white bg-[#1d1d1f] hover:bg-black px-6 py-2 rounded-full transition-all hover:scale-105 active:scale-95">
                  {t(lang, 'nav', 'startFree')}
                </Link>
              )}
            </div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 bg-black/5 rounded-full">
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#1d1d1f]" /> : <Menu className="w-5 h-5 text-[#1d1d1f]" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-2xl border-t border-black/5 h-screen">
            <div className="px-8 py-10 space-y-6">
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-2xl font-bold text-[#1d1d1f]">{t(lang, 'nav', 'features')}</a>
              <a href="#how" onClick={() => setMobileMenuOpen(false)} className="block text-2xl font-bold text-[#1d1d1f]">{t(lang, 'nav', 'howItWorks')}</a>
              <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block text-2xl font-bold text-[#1d1d1f]">{t(lang, 'nav', 'about')}</a>
              <div className="pt-10 flex flex-col gap-4">
                <button 
                  onClick={() => { setLang(lang === 'kk' ? 'ru' : 'kk'); setMobileMenuOpen(false); }}
                  className="flex items-center justify-center gap-2 py-4 text-lg font-bold bg-black/5 rounded-2xl"
                >
                  <Globe className="w-5 h-5" />
                  {lang === 'kk' ? 'Русский язык' : 'Қазақ тілі'}
                </button>
                <Link to={user ? "/chat" : "/login"} onClick={() => setMobileMenuOpen(false)} className="block text-center py-4 text-lg font-bold text-white bg-[#0071e3] rounded-2xl shadow-xl shadow-[#0071e3]/20">
                  {user ? t(lang, 'nav', 'goToChat') : t(lang, 'nav', 'startFree')}
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ─── HERO ─── */}
      <section className="pt-32 pb-8 sm:pt-52 sm:pb-16 bg-gradient-to-b from-[#f5f5f7] to-white">
        <div className="max-w-[1000px] mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0071e3]/10 text-[#0071e3] text-[13px] font-bold mb-6 animate-fade-in">
            <Bot className="w-4 h-4" />
            <span>ЗаңКеңес AI — Next Gen Legal Platform</span>
          </div>
          <h1 className="text-[44px] sm:text-[68px] lg:text-[84px] font-black text-[#1d1d1f] leading-[1.02] tracking-tight mb-8">
            {t(lang, 'landing', 'heroTitle')}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0071e3] to-[#5e5ce6]">{t(lang, 'landing', 'heroSubtitle')}</span>
          </h1>
          <p className="text-[#6e6e73] text-lg sm:text-2xl max-w-[700px] mx-auto leading-relaxed mb-12 font-medium">
            {t(lang, 'landing', 'heroDesc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to={user ? "/chat" : "/login"} className="group inline-flex items-center gap-2 text-white bg-[#1d1d1f] hover:bg-black text-[17px] font-bold px-10 py-4 rounded-full transition-all hover:scale-105 active:scale-95 shadow-2xl">
              {user ? t(lang, 'nav', 'goToChat') : t(lang, 'nav', 'startFree')}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#features" className="inline-flex items-center gap-1 text-[#0071e3] text-[17px] font-bold hover:underline px-6 py-4">
              {t(lang, 'common', 'more')}
              <ChevronRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" className="py-24 sm:py-32 bg-white">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-[36px] sm:text-[52px] font-black text-[#1d1d1f] tracking-tight leading-tight mb-4">{t(lang, 'landing', 'allInOne')}</h2>
            <p className="text-[#6e6e73] text-xl max-w-[600px] mx-auto font-medium">{t(lang, 'landing', 'allInOneDesc')}</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="group p-8 rounded-[32px] bg-[#f5f5f7] hover:bg-white hover:shadow-2xl hover:shadow-black/[0.06] border border-transparent hover:border-black/[0.04] transition-all duration-500 cursor-default">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3" style={{ backgroundColor: `${f.color}15` }}>
                  <f.icon className="w-7 h-7" style={{ color: f.color }} />
                </div>
                <h3 className="text-[20px] font-bold text-[#1d1d1f] mb-2">{f.title}</h3>
                <p className="text-[15px] text-[#6e6e73] leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ADVANTAGES ─── */}
      <section className="py-24 sm:py-32 bg-[#1d1d1f] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0071e3] opacity-20 blur-[120px] -mr-64 -mt-64"></div>
        <div className="max-w-[1100px] mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-[36px] sm:text-[52px] font-black tracking-tight leading-tight mb-4">{t(lang, 'landing', 'whyUs')}</h2>
            <p className="text-white/60 text-xl max-w-[600px] mx-auto font-medium">{t(lang, 'landing', 'whyUsDesc')}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 font-medium">
            {[
              { icon: Zap, title: lang === 'kk' ? 'Streaming жауап' : 'Streaming ответы', desc: lang === 'kk' ? 'AI жауабы тірідей жазылады — бірден көресіз, күтпейсіз.' : 'Ответы ИИ пишутся в реальном времени — видите результат сразу.', metric: '< 2 сек' },
              { icon: BrainCircuit, title: lang === 'kk' ? '11+ AI модельдері' : '11+ AI Моделей', desc: lang === 'kk' ? 'Qwen, DeepSeek, Nemotron, MiniMax — автоматты ауысу.' : 'Qwen, DeepSeek, Nemotron, MiniMax — автоматическое переключение.', metric: 'Reliable' },
              { icon: ShieldCheck, title: lang === 'kk' ? 'Қауіпсіздік' : 'Безопасность', desc: lang === 'kk' ? 'Firebase шифрлау. Деректеріңіз тек сізге тиесілі.' : 'Шифрование Firebase. Ваши данные принадлежат только вам.', metric: 'E2E' },
              { icon: Scale, title: lang === 'kk' ? 'Нақты жауаптар' : 'Точные ответы', desc: lang === 'kk' ? 'Бап нөмірлері, заң атаулары және ресми дереккөздерге сілтемелер.' : 'Номера статей, названия законов и ссылки на официальные источники.', metric: 'Laws' }
            ].map((a, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-md rounded-[32px] p-8 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                    <a.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-[12px] font-black text-[#0071e3] bg-white px-4 py-1.5 rounded-full uppercase tracking-widest">{a.metric}</span>
                </div>
                <h3 className="text-[22px] font-bold mb-2">{a.title}</h3>
                <p className="text-white/50 leading-relaxed text-[16px]">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ABOUT / DIPLOMA ─── */}
      <section id="about" className="py-24 sm:py-32 bg-[#f5f5f7]">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-black text-white text-[12px] font-black mb-8 tracking-[0.2em] uppercase">
            <GraduationCap className="w-4 h-4" />
            {t(lang, 'landing', 'diploma')} · 2026
          </div>
          <h2 className="text-[36px] sm:text-[52px] font-black text-[#1d1d1f] tracking-tight leading-tight mb-8">{lang === 'kk' ? 'Жоба туралы' : 'О проекте'}</h2>
          <p className="text-[#6e6e73] text-xl sm:text-2xl leading-relaxed mb-12 font-medium">
            {lang === 'kk' 
              ? '«ЗаңКеңес AI» — дипломдық жоба. Мақсаты — Қазақстан азаматтарының құқықтық сауаттылығын арттыру. Заманауи жасанды интеллект арқылы қол жетімді кеңес беру.'
              : '«ЗаңКеңес AI» — дипломный проект. Цель — повышение правовой грамотности граждан Казахстана через доступные консультации с использованием современного ИИ.'}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {['React 19', 'TypeScript', 'Firebase', 'OpenRouter', 'Tailwind 4'].map((t, i) => (
              <span key={i} className="px-6 py-2.5 bg-white rounded-2xl text-[14px] font-bold text-[#1d1d1f]/60 shadow-sm border border-black/[0.03]">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-[580px] mx-auto px-6 text-center">
          <h2 className="text-[32px] sm:text-[40px] font-bold text-[#1d1d1f] tracking-tight leading-tight mb-4">
            {user ? (lang === 'kk' ? 'Чат сізді күтуде.' : 'Чат ждет вас.') : (lang === 'kk' ? 'Бастауға дайынсыз ба?' : 'Готовы начать?')}
          </h2>
          <p className="text-[#6e6e73] text-[17px] mb-8 font-medium">
            {user 
              ? (lang === 'kk' ? 'Кез-келген уақытта құқықтық сұрақтарыңызға жауап алыңыз.' : 'Получайте ответы на правовые вопросы в любое время.') 
              : (lang === 'kk' ? 'Тіркелу — тегін. Қосымша міндеттеме жоқ.' : 'Регистрация бесплатна. Никаких обязательств.')}
          </p>
          <Link to={user ? "/chat" : "/login"} className="inline-flex items-center gap-2 text-white bg-[#0071e3] hover:bg-[#0077ED] text-[17px] font-bold px-10 py-4 rounded-full transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#0071e3]/20">
            {user ? t(lang, 'nav', 'goToChat') : t(lang, 'nav', 'startFree')}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-white border-t border-black/5 py-20 pb-32">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-6">
                <Scale className="w-6 h-6 text-black" />
                <span className="text-[18px] font-black tracking-tighter">ЗаңКеңес AI</span>
              </Link>
              <p className="text-[14px] text-[#6e6e73] leading-relaxed font-medium">
                {lang === 'kk' ? 'Қазақстанның заманауи құқықтық платформасы.' : 'Современная правовая платформа Казахстана.'}
              </p>
            </div>
            <div>
              <h4 className="text-[13px] font-black text-black uppercase tracking-widest mb-6">{t(lang, 'landing', 'allInOne')}</h4>
              <ul className="space-y-4 text-[14px] font-medium text-[#6e6e73]">
                <li><Link to="/chat" className="hover:text-black transition-colors">{t(lang, 'nav', 'chat')}</Link></li>
                <li><Link to="/laws" className="hover:text-black transition-colors">{t(lang, 'nav', 'laws')}</Link></li>
                <li><Link to="/templates" className="hover:text-black transition-colors">{t(lang, 'nav', 'templates')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[13px] font-black text-black uppercase tracking-widest mb-6">{lang === 'kk' ? 'Пайдалы' : 'Полезно'}</h4>
              <ul className="space-y-4 text-[14px] font-medium text-[#6e6e73]">
                <li><Link to="/calculators" className="hover:text-black transition-colors">{t(lang, 'nav', 'calculators')}</Link></li>
                <li><Link to="/lawyers" className="hover:text-black transition-colors">{t(lang, 'nav', 'lawyers')}</Link></li>
                <li><Link to="/sos" className="hover:text-black transition-colors">{t(lang, 'nav', 'sos')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[13px] font-black text-black uppercase tracking-widest mb-6">{t(lang, 'nav', 'about')}</h4>
              <ul className="space-y-4 text-[14px] font-medium text-[#6e6e73]">
                <li><Link to="/login" className="hover:text-black transition-colors">{t(lang, 'nav', 'login')}</Link></li>
                <li><Link to="/profile" className="hover:text-black transition-colors">{t(lang, 'profile', 'title')}</Link></li>
                <li>support@zankenes.kz</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[12px] font-bold text-[#86868b]">
            <p>© 2026 ЗаңКеңес AI. {t(lang, 'common', 'allRightsReserved')}</p>
            <div className="flex gap-8">
              <span>Privacy</span>
              <span>Terms</span>
              <span>Kazakhstan</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
