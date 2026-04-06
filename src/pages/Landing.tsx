import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { 
  Scale, MessageSquare, BookOpen, Calculator, FileText, 
  Users, Bot, ArrowRight, Menu, X, ShieldCheck, Zap, 
  BrainCircuit, ChevronRight, GraduationCap
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export default function Landing() {
  const { user } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white antialiased" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', 'Segoe UI', system-ui, sans-serif" }}>

      {/* ─── NAVBAR ─── */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-xl backdrop-saturate-150 border-b border-black/5' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-[980px] mx-auto px-6">
          <div className="flex items-center justify-between h-12">
            <Link to="/" className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#1d1d1f]" />
              <span className="text-[15px] font-semibold text-[#1d1d1f] tracking-tight">ЗаңКеңес AI</span>
            </Link>

            <div className="hidden md:flex items-center gap-7">
              <a href="#features" className="text-xs text-[#1d1d1f]/60 hover:text-[#1d1d1f] transition-colors">Мүмкіндіктер</a>
              <a href="#how" className="text-xs text-[#1d1d1f]/60 hover:text-[#1d1d1f] transition-colors">Қалай жұмыс істейді</a>
              <a href="#about" className="text-xs text-[#1d1d1f]/60 hover:text-[#1d1d1f] transition-colors">Жоба туралы</a>
            </div>

            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <Link to="/chat" className="text-xs font-medium text-white bg-[#0071e3] hover:bg-[#0077ED] px-4 py-1.5 rounded-full transition-colors">
                  Чатқа өту
                </Link>
              ) : (
                <>
                  <Link to="/login" className="text-xs text-[#0071e3] hover:underline">Кіру</Link>
                  <Link to="/login" className="text-xs font-medium text-white bg-[#0071e3] hover:bg-[#0077ED] px-4 py-1.5 rounded-full transition-colors">
                    Тегін бастау
                  </Link>
                </>
              )}
            </div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-1">
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#1d1d1f]" /> : <Menu className="w-5 h-5 text-[#1d1d1f]" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-black/5">
            <div className="max-w-[980px] mx-auto px-6 py-3 space-y-1">
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm text-[#1d1d1f]/70">Мүмкіндіктер</a>
              <a href="#how" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm text-[#1d1d1f]/70">Қалай жұмыс істейді</a>
              <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm text-[#1d1d1f]/70">Жоба туралы</a>
              <div className="pt-2">
                <Link to={user ? "/chat" : "/login"} onClick={() => setMobileMenuOpen(false)} className="block text-center text-sm font-medium text-white bg-[#0071e3] rounded-xl py-2.5">
                  {user ? 'Чатқа өту' : 'Тегін бастау'}
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ─── HERO ─── */}
      <section className="pt-32 pb-8 sm:pt-44 sm:pb-12">
        <div className="max-w-[980px] mx-auto px-6 text-center">
          <p className="text-[#0071e3] text-sm font-semibold mb-4 tracking-wide">ЗаңКеңес AI</p>
          <h1 className="text-[40px] sm:text-[56px] lg:text-[64px] font-bold text-[#1d1d1f] leading-[1.05] tracking-tight mb-5">
            Құқықтық кеңесшіңіз.
            <br />
            <span className="text-[#6e6e73]">Әрқашан қасыңызда.</span>
          </h1>
          <p className="text-[#6e6e73] text-lg sm:text-xl max-w-[600px] mx-auto leading-relaxed mb-8">
            Жасанды интеллект негізіндегі тегін құқықтық платформа. Қазақстан заңнамасы бойынша сұрақ қойыңыз — нақты жауап алыңыз.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link to={user ? "/chat" : "/login"} className="inline-flex items-center gap-2 text-white bg-[#0071e3] hover:bg-[#0077ED] text-[15px] font-medium px-7 py-3 rounded-full transition-colors">
              {user ? 'Чатты бастау' : 'Тегін бастау'}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#features" className="inline-flex items-center gap-1 text-[#0071e3] text-[15px] font-medium hover:underline">
              Толығырақ
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ─── HERO VISUAL ─── */}
      <section className="pb-20 sm:pb-28">
        <div className="max-w-[780px] mx-auto px-6">
          <div className="bg-[#f5f5f7] rounded-[20px] p-5 sm:p-8 border border-black/[0.04]">
            {/* Mini chat window */}
            <div className="bg-white rounded-2xl shadow-sm border border-black/[0.06] overflow-hidden">
              {/* Title bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-black/[0.04] bg-[#fafafa]">
                <div className="flex gap-1.5">
                  <div className="w-[10px] h-[10px] rounded-full bg-[#ff5f57]"></div>
                  <div className="w-[10px] h-[10px] rounded-full bg-[#febc2e]"></div>
                  <div className="w-[10px] h-[10px] rounded-full bg-[#28c840]"></div>
                </div>
                <div className="flex-1 text-center">
                  <span className="text-[11px] text-[#1d1d1f]/40 font-medium">ЗаңКеңес AI — Құқықтық чат</span>
                </div>
                <div className="w-12"></div>
              </div>
              {/* Chat body */}
              <div className="p-5 space-y-4">
                <div className="flex justify-end">
                  <div className="bg-[#0071e3] text-white px-4 py-2 rounded-[18px] rounded-br-[4px] text-[14px] max-w-[75%]">
                    Алимент қалай есептеледі?
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#1d1d1f] flex items-center justify-center mt-0.5">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="bg-[#f5f5f7] px-4 py-3 rounded-[18px] rounded-bl-[4px] text-[14px] text-[#1d1d1f] leading-relaxed max-w-[85%]">
                    ҚР Неке және отбасы кодексінің <span className="font-semibold">139-бабы</span> бойынша: бір балаға — табыстың <span className="font-semibold">¼</span>, екі балаға — <span className="font-semibold">⅓</span>, үш және одан көп балаға — <span className="font-semibold">½</span> бөлігі ұсталады.
                  </div>
                </div>
              </div>
              {/* Input */}
              <div className="px-5 pb-4">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-[#f5f5f7] rounded-full border border-black/[0.04]">
                  <span className="flex-1 text-[13px] text-[#1d1d1f]/30">Сұрағыңызды жазыңыз…</span>
                  <div className="w-7 h-7 rounded-full bg-[#0071e3] flex items-center justify-center">
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" className="py-20 sm:py-28 bg-white">
        <div className="max-w-[980px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-[32px] sm:text-[40px] font-bold text-[#1d1d1f] tracking-tight leading-tight mb-3">Бәрі бір жерде.</h2>
            <p className="text-[#6e6e73] text-lg max-w-[500px] mx-auto">Құқықтық мәселелерді шешуге қажетті барлық құралдар.</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: MessageSquare, title: 'AI Чат', desc: 'Жасанды интеллектпен құқықтық сұрақтарға жауап алыңыз.', color: '#0071e3' },
              { icon: BookOpen, title: 'Заңнамалар', desc: 'ҚР заңнамаларын іздеңіз. Adilet.zan.kz деректері.', color: '#34c759' },
              { icon: FileText, title: 'Құжат үлгілері', desc: 'Арыздар, шарттар, сенімхаттар — Word/PDF.', color: '#af52de' },
              { icon: Calculator, title: 'Калькуляторлар', desc: 'Алимент, салық, декрет, штраф есептеу.', color: '#ff9500' },
              { icon: Users, title: 'Заңгерлер', desc: 'Тексерілген заңгерлер мен адвокаттар тізімі.', color: '#ff3b30' },
              { icon: ShieldCheck, title: 'SOS Көмек', desc: 'Құқықтық қысым кезінде жедел нұсқаулық.', color: '#ff2d55' }
            ].map((f, i) => (
              <div key={i} className="group p-6 rounded-2xl bg-[#f5f5f7] hover:bg-white hover:shadow-lg hover:shadow-black/[0.04] border border-transparent hover:border-black/[0.04] transition-all duration-300 cursor-default">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${f.color}15` }}>
                  <f.icon className="w-5 h-5" style={{ color: f.color }} />
                </div>
                <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-1.5">{f.title}</h3>
                <p className="text-[14px] text-[#6e6e73] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ADVANTAGES ─── */}
      <section className="py-20 sm:py-28 bg-[#f5f5f7]">
        <div className="max-w-[980px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-[32px] sm:text-[40px] font-bold text-[#1d1d1f] tracking-tight leading-tight mb-3">Неліктен ЗаңКеңес AI?</h2>
            <p className="text-[#6e6e73] text-lg max-w-[500px] mx-auto">Заманауи технологиялар. Қарапайым интерфейс.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { icon: Zap, title: 'Streaming жауап', desc: 'AI жауабы тірідей жазылады — бірден көресіз, күтпейсіз.', metric: '< 2 сек' },
              { icon: BrainCircuit, title: '11+ AI модельдері', desc: 'Qwen, Nemotron, MiniMax, GLM — бір модель жауап бермесе, автоматты ауысу.', metric: 'Fallback' },
              { icon: ShieldCheck, title: 'Қауіпсіздік', desc: 'Firebase шифрлау. Деректеріңіз тек сізге тиесілі.', metric: 'E2E' },
              { icon: Scale, title: 'Нақты жауаптар', desc: 'Бап нөмірлері, заң атаулары және ресми дереккөздерге сілтемелер.', metric: '500+ бап' }
            ].map((a, i) => (
              <div key={i} className="bg-white rounded-2xl p-7 border border-black/[0.04]">
                <div className="flex items-start justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[#f5f5f7] flex items-center justify-center">
                    <a.icon className="w-5 h-5 text-[#1d1d1f]" />
                  </div>
                  <span className="text-[12px] font-semibold text-[#0071e3] bg-[#0071e3]/[0.08] px-3 py-1 rounded-full">{a.metric}</span>
                </div>
                <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-1.5">{a.title}</h3>
                <p className="text-[14px] text-[#6e6e73] leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how" className="py-20 sm:py-28 bg-white">
        <div className="max-w-[980px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-[32px] sm:text-[40px] font-bold text-[#1d1d1f] tracking-tight leading-tight mb-3">Қалай жұмыс істейді?</h2>
            <p className="text-[#6e6e73] text-lg">Үш қадам. Бір минут.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {[
              { step: '1', title: 'Кіріңіз', desc: 'Google аккаунт арқылы бір батырмамен тіркелу.' },
              { step: '2', title: 'Сұрақ қойыңыз', desc: 'Кез-келген құқықтық сұрақты қазақша немесе орысша жазыңыз.' },
              { step: '3', title: 'Жауап алыңыз', desc: 'AI бірнеше секунд ішінде нақты баптарға сілтемемен жауап береді.' }
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 rounded-full bg-[#1d1d1f] text-white flex items-center justify-center text-[17px] font-bold mx-auto mb-5">
                  {s.step}
                </div>
                <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-2">{s.title}</h3>
                <p className="text-[14px] text-[#6e6e73] leading-relaxed max-w-[260px] mx-auto">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ABOUT / DIPLOMA ─── */}
      <section id="about" className="py-20 sm:py-28 bg-[#f5f5f7]">
        <div className="max-w-[680px] mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1d1d1f]/[0.06] text-[12px] font-semibold text-[#1d1d1f]/60 mb-6 tracking-wide">
            <GraduationCap className="w-3.5 h-3.5" />
            ДИПЛОМДЫҚ ЖҰМЫС · 2026
          </div>
          <h2 className="text-[32px] sm:text-[40px] font-bold text-[#1d1d1f] tracking-tight leading-tight mb-5">Жоба туралы</h2>
          <p className="text-[#6e6e73] text-[17px] leading-relaxed mb-4">
            «ЗаңКеңес AI» — дипломдық жоба. Мақсаты — Қазақстан азаматтарының құқықтық сауаттылығын арттыру. Заманауи жасанды интеллект арқылы, қол жетімді және тегін кеңес беру.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {['React', 'TypeScript', 'Firebase', 'OpenRouter', 'Tailwind CSS'].map((t, i) => (
              <span key={i} className="px-3.5 py-1.5 bg-white rounded-full text-[12px] font-medium text-[#1d1d1f]/60 border border-black/[0.04]">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-[580px] mx-auto px-6 text-center">
          <h2 className="text-[32px] sm:text-[40px] font-bold text-[#1d1d1f] tracking-tight leading-tight mb-4">
            {user ? 'Чат сізді күтуде.' : 'Бастауға дайынсыз ба?'}
          </h2>
          <p className="text-[#6e6e73] text-[17px] mb-8">
            {user ? 'Кез-келген уақытта құқықтық сұрақтарыңызға жауап алыңыз.' : 'Тіркелу — тегін. Қосымша міндеттеме жоқ.'}
          </p>
          <Link to={user ? "/chat" : "/login"} className="inline-flex items-center gap-2 text-white bg-[#0071e3] hover:bg-[#0077ED] text-[17px] font-medium px-8 py-3.5 rounded-full transition-colors">
            {user ? 'Чатқа өту' : 'Тегін бастау'}
            <ArrowRight className="w-4.5 h-4.5" />
          </Link>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-[#d2d2d7]/50">
        <div className="max-w-[980px] mx-auto px-6">
          {/* Links */}
          <div className="py-5 grid grid-cols-2 sm:grid-cols-4 gap-6 text-[12px] border-b border-[#d2d2d7]/50">
            <div>
              <h4 className="font-semibold text-[#1d1d1f]/80 mb-2.5">Платформа</h4>
              <div className="space-y-1.5">
                <Link to="/chat" className="block text-[#424245] hover:text-[#0071e3] transition-colors">AI Чат</Link>
                <Link to="/laws" className="block text-[#424245] hover:text-[#0071e3] transition-colors">Заңнамалар</Link>
                <Link to="/templates" className="block text-[#424245] hover:text-[#0071e3] transition-colors">Құжаттар</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-[#1d1d1f]/80 mb-2.5">Құралдар</h4>
              <div className="space-y-1.5">
                <Link to="/calculators" className="block text-[#424245] hover:text-[#0071e3] transition-colors">Калькуляторлар</Link>
                <Link to="/lawyers" className="block text-[#424245] hover:text-[#0071e3] transition-colors">Заңгерлер</Link>
                <Link to="/sos" className="block text-[#424245] hover:text-[#0071e3] transition-colors">SOS Көмек</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-[#1d1d1f]/80 mb-2.5">Аккаунт</h4>
              <div className="space-y-1.5">
                <Link to="/login" className="block text-[#424245] hover:text-[#0071e3] transition-colors">Кіру</Link>
                <Link to="/profile" className="block text-[#424245] hover:text-[#0071e3] transition-colors">Баптаулар</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-[#1d1d1f]/80 mb-2.5">Байланыс</h4>
              <div className="space-y-1.5 text-[#424245]">
                <p>support@zankenes.kz</p>
                <p>Қазақстан</p>
              </div>
            </div>
          </div>
          {/* Copyright */}
          <div className="py-4 text-[11px] text-[#6e6e73]">
            © 2026 ЗаңКеңес AI. Дипломдық жоба. Барлық құқықтар қорғалған.
          </div>
        </div>
      </footer>
    </div>
  );
}
