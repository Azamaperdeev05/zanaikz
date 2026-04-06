import { AlertTriangle, Phone, ShieldAlert, ChevronRight } from 'lucide-react';
import { useLangStore } from '../store/langStore';
import { t } from '../utils/i18n';

export default function SOS() {
  const { lang } = useLangStore();

  const emergencyNumbers = [
    { name: t(lang, 'sos', 'police'), number: '102' },
    { name: t(lang, 'sos', 'ambulance'), number: '103' },
    { name: t(lang, 'sos', 'emergency'), number: '112' }
  ];

  const guideTexts = [
    lang === 'kk' ? 'Сізді ұстаған кезде не істеу керек?' : 'Что делать при задержании?',
    lang === 'kk' ? 'Тінту кезіндегі сіздің құқықтарыңыз' : 'Ваши права при обыске',
    lang === 'kk' ? 'Адвокат талап ету құқығы' : 'Право на требование адвоката'
  ];

  return (
    <div className="p-5 lg:p-8 max-w-4xl mx-auto h-full overflow-y-auto pb-32">
      {/* Alert Banner */}
      <div className="bg-[#ff3b30]/[0.06] border border-[#ff3b30]/10 rounded-2xl p-5 mb-8 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-[#ff3b30]/10 flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-5 h-5 text-[#ff3b30]" />
        </div>
        <div>
          <h1 className="text-[22px] md:text-[24px] font-bold text-[#1d1d1f] tracking-tight mb-1">{t(lang, 'sos', 'title')}</h1>
          <p className="text-[14px] md:text-[15px] text-[#86868b] leading-relaxed max-w-2xl">
            {t(lang, 'sos', 'desc')}
          </p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Emergency Numbers */}
        <div className="bg-white p-6 rounded-[28px] border border-black/[0.04] shadow-sm">
          <h2 className="text-[17px] font-bold text-[#1d1d1f] mb-5 flex items-center gap-2">
            <Phone className="w-4.5 h-4.5 text-[#0071e3]" />
            {t(lang, 'sos', 'emergencyLinks')}
          </h2>
          <div className="space-y-3">
            {emergencyNumbers.map((item, i) => (
              <a key={i} href={`tel:${item.number}`} className="flex justify-between items-center p-4 bg-[#f5f5f7] hover:bg-black hover:text-white rounded-2xl transition-all group active:scale-[0.98]">
                <span className="text-[15px] font-semibold">{item.name}</span>
                <span className="text-[22px] font-black tabular-nums">{item.number}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Quick Guides */}
        <div className="bg-white p-6 rounded-[28px] border border-black/[0.04] shadow-sm">
          <h2 className="text-[17px] font-bold text-[#1d1d1f] mb-5 flex items-center gap-2">
            <ShieldAlert className="w-4.5 h-4.5 text-[#ff9500]" />
            {t(lang, 'sos', 'guides')}
          </h2>
          <div className="space-y-3">
            {guideTexts.map((text, i) => (
              <button 
                key={i}
                className="w-full flex items-center justify-between p-4 bg-[#f5f5f7] hover:bg-black hover:text-white rounded-2xl transition-all text-left group active:scale-[0.98]"
              >
                <span className="text-[14px] font-semibold flex-1 pr-4">{text}</span>
                <ChevronRight className="w-5 h-5 text-[#86868b] group-hover:text-white transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
