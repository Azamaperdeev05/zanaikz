import { AlertTriangle, Phone, ShieldAlert, ChevronRight } from 'lucide-react';

export default function SOS() {
  return (
    <div className="p-5 lg:p-8 max-w-4xl mx-auto h-full overflow-y-auto">
      {/* Alert Banner */}
      <div className="bg-[#ff3b30]/[0.06] border border-[#ff3b30]/10 rounded-2xl p-5 mb-8 flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#ff3b30]/10 flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-4 h-4 text-[#ff3b30]" />
        </div>
        <div>
          <h1 className="text-[20px] font-bold text-[#1d1d1f] tracking-tight mb-1">Шұғыл көмек</h1>
          <p className="text-[14px] text-[#86868b] leading-relaxed">
            Егер сіздің өміріңізге, денсаулығыңызға немесе бостандығыңызға қауіп төніп тұрса, дереу хабарласыңыз.
          </p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-5 mb-8">
        {/* Emergency Numbers */}
        <div className="bg-white p-5 rounded-2xl border border-black/[0.04]">
          <h2 className="text-[15px] font-semibold text-[#1d1d1f] mb-4 flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#0071e3]" />
            Шұғыл нөмірлер
          </h2>
          <div className="space-y-2">
            {[
              { name: 'Полиция', number: '102' },
              { name: 'Жедел жәрдем', number: '103' },
              { name: 'Төтенше жағдайлар', number: '112' }
            ].map((item, i) => (
              <a key={i} href={`tel:${item.number}`} className="flex justify-between items-center p-3.5 bg-[#f5f5f7] hover:bg-[#e8e8ed] rounded-xl transition-colors group">
                <span className="text-[14px] font-medium text-[#1d1d1f]">{item.name}</span>
                <span className="text-[20px] font-bold text-[#0071e3] tabular-nums">{item.number}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Quick Guides */}
        <div className="bg-white p-5 rounded-2xl border border-black/[0.04]">
          <h2 className="text-[15px] font-semibold text-[#1d1d1f] mb-4 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#ff9500]" />
            Нұсқаулықтар
          </h2>
          <div className="space-y-2">
            {[
              'Сізді ұстаған кезде не істеу керек?',
              'Тінту кезіндегі сіздің құқықтарыңыз',
              'Адвокат талап ету құқығы'
            ].map((text, i) => (
              <button 
                key={i}
                className="w-full flex items-center justify-between p-3.5 bg-[#f5f5f7] hover:bg-[#e8e8ed] rounded-xl transition-colors text-left group"
              >
                <span className="text-[14px] font-medium text-[#1d1d1f]">{text}</span>
                <ChevronRight className="w-4 h-4 text-[#86868b] group-hover:text-[#1d1d1f] transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
