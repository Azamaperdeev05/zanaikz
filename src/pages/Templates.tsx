import { useState, useMemo } from 'react';
import { FileText, Download, ExternalLink } from 'lucide-react';
import { documentTemplates } from '../data/templates';
import { useLangStore } from '../store/langStore';
import { t } from '../utils/i18n';

export default function Templates() {
  const { lang } = useLangStore();
  const allLabel = t(lang, 'templates', 'all');

  // Build localized categories
  const categories = useMemo(() => {
    const cats = new Set(documentTemplates.map(tpl => lang === 'ru' ? tpl.category_ru : tpl.category));
    return [allLabel, ...Array.from(cats)];
  }, [lang, allLabel]);

  const [selectedCategory, setSelectedCategory] = useState<string>(allLabel);

  // Reset category when language changes
  const filteredTemplates = useMemo(() => {
    if (selectedCategory === allLabel) return documentTemplates;
    return documentTemplates.filter(tpl => {
      const cat = lang === 'ru' ? tpl.category_ru : tpl.category;
      return cat === selectedCategory;
    });
  }, [selectedCategory, lang, allLabel]);

  // Get localized text for a template
  const getTitle = (tpl: typeof documentTemplates[0]) => lang === 'ru' ? tpl.title_ru : tpl.title;
  const getDesc = (tpl: typeof documentTemplates[0]) => lang === 'ru' ? (tpl.description_ru || tpl.description) : tpl.description;
  const getCat = (tpl: typeof documentTemplates[0]) => lang === 'ru' ? tpl.category_ru : tpl.category;

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto h-full flex flex-col overflow-hidden">
      <div className="mb-5 shrink-0">
        <h1 className="text-[28px] font-bold text-[#1d1d1f] tracking-tight mb-1">{t(lang, 'templates', 'title')}</h1>
        <p className="text-[14px] text-[#86868b]">{t(lang, 'templates', 'subtitle')}</p>
      </div>
      
      {/* Categories */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar shrink-0">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-[13px] font-bold whitespace-nowrap transition-all active:scale-[0.97] ${
              selectedCategory === cat
                ? 'bg-[#1d1d1f] text-white shadow-md'
                : 'bg-white text-[#86868b] border border-black/[0.04] hover:bg-black/[0.03]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((tpl) => (
            <div 
              key={tpl.id} 
              className="bg-white p-5 rounded-[28px] border border-black/[0.04] hover:border-black/[0.1] hover:shadow-xl transition-all group relative flex flex-col"
            >
              <div className="w-12 h-12 bg-[#0071e3]/[0.08] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-[#0071e3]" />
              </div>
              <h3 className="text-[16px] font-bold text-[#1d1d1f] leading-tight mb-2 group-hover:text-[#0071e3] transition-colors">{getTitle(tpl)}</h3>
              <p className="text-[13px] text-[#86868b] line-clamp-2 mb-5 font-medium leading-relaxed flex-1">{getDesc(tpl)}</p>
              
              <a
                href={tpl.link}
                target="_blank"
                rel="noreferrer"
                className="mt-auto flex items-center justify-center gap-2 w-full py-3 bg-[#f5f5f7] hover:bg-[#1d1d1f] hover:text-white text-[#1d1d1f] text-[13px] font-bold rounded-2xl transition-all active:scale-[0.98]"
              >
                {tpl.link?.includes('.doc') || tpl.link?.includes('.pdf') ? <Download className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
                {tpl.link?.includes('.doc') ? "DOCX" : tpl.link?.includes('.pdf') ? "PDF" : tpl.link?.includes('egov') ? "EGOV" : t(lang, 'templates', 'open')}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
