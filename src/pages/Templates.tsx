import { useState } from 'react';
import { FileText, Download, ExternalLink } from 'lucide-react';
import { documentTemplates } from '../data/templates';

export default function Templates() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Барлығы");
  
  const categories = ["Барлығы", ...Array.from(new Set(documentTemplates.map(t => t.category)))];
  
  const filteredTemplates = selectedCategory === "Барлығы" 
    ? documentTemplates 
    : documentTemplates.filter(t => t.category === selectedCategory);

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto h-full flex flex-col overflow-hidden">
      <div className="mb-5 shrink-0">
        <h1 className="text-[28px] font-bold text-[#1d1d1f] tracking-tight mb-1">Құжат үлгілері</h1>
        <p className="text-[14px] text-[#86868b]">ҚР заңнамасына сәйкес дайын құжаттар</p>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide shrink-0">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-[6px] rounded-full whitespace-nowrap text-[13px] font-medium transition-colors border ${
              selectedCategory === cat
                ? 'bg-[#1d1d1f] text-white border-[#1d1d1f]'
                : 'bg-white text-[#1d1d1f]/70 border-black/[0.06] hover:bg-[#f5f5f7]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      
      {/* Grid */}
      <div className="flex-1 overflow-y-auto pr-1 pb-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTemplates.map((tpl) => (
            <div key={tpl.id} className="bg-white p-5 rounded-2xl border border-black/[0.04] hover:border-black/[0.08] transition-colors flex flex-col h-full group">
              <div className="w-9 h-9 bg-[#af52de]/[0.08] rounded-xl flex items-center justify-center mb-3">
                <FileText className="w-4 h-4 text-[#af52de]" />
              </div>
              <h3 className="text-[14px] font-semibold text-[#1d1d1f] mb-1 leading-tight">{tpl.title}</h3>
              <span className="text-[11px] text-[#0071e3] font-medium bg-[#0071e3]/[0.06] px-2 py-0.5 rounded-full inline-block w-fit mb-3">{tpl.category}</span>
              <p className="text-[12px] text-[#86868b] mb-5 flex-1 line-clamp-3 leading-relaxed" title={tpl.description}>
                {tpl.description}
              </p>
              
              <a 
                href={tpl.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 bg-[#f5f5f7] hover:bg-[#e8e8ed] rounded-lg text-[12px] font-medium flex items-center justify-center gap-1.5 text-[#1d1d1f]/70 transition-colors border border-black/[0.04]"
              >
                {tpl.link?.includes('.doc') || tpl.link?.includes('.pdf') ? <Download className="w-3.5 h-3.5" /> : <ExternalLink className="w-3.5 h-3.5" />}
                {tpl.link?.includes('.doc') ? "DOCX" : tpl.link?.includes('.pdf') ? "PDF" : "Ашу"}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
