import { useState, useEffect, useMemo } from 'react';
import { Book, Search, ChevronLeft, ChevronRight, ExternalLink, Filter, Scale } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useLangStore } from '../store/langStore';
import { t } from '../utils/i18n';
import { lawsData } from '../data/lawsData';

export default function Laws() {
  const { user } = useAuthStore();
  const { lang } = useLangStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Flatten all acts with their branch info for global searching
  const allActs = useMemo(() => {
    const list: any[] = [];
    lawsData.branches.forEach(branch => {
      branch.acts.forEach(act => {
        list.push({
          ...act,
          branch_kk: branch.branch_kk,
          branch_ru: branch.branch_ru
        });
      });
    });
    return list;
  }, []);

  const filteredActs = useMemo(() => {
    let result = allActs;

    if (selectedBranch) {
      result = result.filter(act => act.branch_kk === selectedBranch || act.branch_ru === selectedBranch);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(act => 
        (act.title_kk && act.title_kk.toLowerCase().includes(q)) || 
        (act.title_ru && act.title_ru.toLowerCase().includes(q))
      );
    }

    return result;
  }, [allActs, selectedBranch, searchQuery]);

  const totalPages = Math.ceil(filteredActs.length / itemsPerPage);
  const paginatedActs = filteredActs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleBranchClick = (branchName: string) => {
    setSelectedBranch(selectedBranch === branchName ? null : branchName);
    setCurrentPage(1);
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center px-4">
        <div className="w-16 h-16 bg-[#0071e3]/10 rounded-2xl flex items-center justify-center mb-4">
          <Book className="w-8 h-8 text-[#0071e3]" />
        </div>
        <h2 className="text-[20px] font-bold text-[#1d1d1f] mb-2">{t(lang, 'laws', 'title') || 'Заңнамалар базасы'}</h2>
        <p className="text-[14px] text-[#86868b] mb-6 max-w-xs">{t(lang, 'profile', 'authRequired')}</p>
        <a href="/login" className="px-6 py-2.5 bg-[#0071e3] text-white rounded-full text-[14px] font-medium hover:bg-[#0077ED] transition-all">
          {t(lang, 'nav', 'login')}
        </a>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto h-full overflow-y-auto pb-32">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-[#0071e3] rounded-lg">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-[24px] md:text-[32px] font-extrabold text-[#1d1d1f] tracking-tight whitespace-nowrap">
            {lang === 'kk' ? 'Заңнамалар базасы' : 'База законодательства'}
          </h1>
        </div>
        <p className="text-[14px] md:text-[16px] text-[#86868b]">
          {lang === 'kk' ? 'Қазақстан Республикасының қолданыстағы кодекстері мен заңдары' : 'Действующие кодексы и законы Республики Казахстан'}
        </p>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#86868b] w-4.5 h-4.5 group-focus-within:text-[#0071e3] transition-colors" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'kk' ? 'Заңның атауы немесе түйінді сөз бойынша іздеу…' : 'Поиск по названию или ключевому слову…'} 
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-black/[0.05] rounded-2xl text-[15px] shadow-sm focus:outline-none focus:ring-4 focus:ring-[#0071e3]/10 focus:border-[#0071e3] transition-all"
          />
        </div>
        
        {/* Mobile Filters Trigger (Optional UI enhancement) */}
        <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar lg:hidden">
          {lawsData.branches.map((b) => (
            <button
              key={b.order}
              onClick={() => handleBranchClick(lang === 'kk' ? b.branch_kk : b.branch_ru)}
              className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-all ${
                (selectedBranch === b.branch_kk || selectedBranch === b.branch_ru)
                  ? 'bg-black text-white'
                  : 'bg-white text-[#1d1d1f]/70 border border-black/[0.05]'
              }`}
            >
              {lang === 'kk' ? b.branch_kk : b.branch_ru}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Desktop Categories Sidebar */}
        <aside className="hidden lg:block lg:col-span-3 space-y-2">
          <div className="flex items-center gap-2 mb-4 px-3">
            <Filter className="w-4 h-4 text-[#86868b]" />
            <span className="text-[12px] font-bold text-[#86868b] uppercase tracking-widest">{lang === 'kk' ? 'Құқық салалары' : 'Отрасли права'}</span>
          </div>
          <button 
            onClick={() => setSelectedBranch(null)}
            className={`w-full text-left px-4 py-3 rounded-xl text-[14px] font-medium transition-all ${
              selectedBranch === null ? 'bg-[#0071e3] text-white shadow-lg shadow-[#0071e3]/20' : 'text-[#1d1d1f]/70 hover:bg-black/[0.04]'
            }`}
          >
            {lang === 'kk' ? 'Барлық заңдар' : 'Все законы'}
          </button>
          {lawsData.branches.map((b) => (
            <button 
              key={b.order} 
              onClick={() => handleBranchClick(lang === 'kk' ? b.branch_kk : b.branch_ru)}
              className={`w-full text-left px-4 py-3 rounded-xl text-[14px] font-medium transition-all ${
                (selectedBranch === b.branch_kk || selectedBranch === b.branch_ru)
                  ? 'bg-[#0071e3] text-white shadow-lg shadow-[#0071e3]/20'
                  : 'text-[#1d1d1f]/70 hover:bg-black/[0.04]'
              }`}
            >
              {lang === 'kk' ? b.branch_kk : b.branch_ru}
            </button>
          ))}
        </aside>
        
        {/* Acts Grid */}
        <div className="lg:col-span-9 space-y-4">
          {paginatedActs.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {paginatedActs.map((act, idx) => (
                <div 
                  key={idx} 
                  className="bg-white/70 backdrop-blur-sm p-6 rounded-[24px] border border-black/[0.03] hover:border-[#0071e3]/30 hover:shadow-xl hover:shadow-black/[0.02] transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-2.5 rounded-xl ${
                        act.type === 'Kodeks' ? 'bg-[#0071e3]/10 text-[#0071e3]' : 'bg-black/5 text-[#1d1d1f]'
                      }`}>
                        <Book className="w-5 h-5" />
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
                         act.type === 'Kodeks' ? 'bg-[#0071e3] text-white' : 'bg-black text-white'
                      }`}>
                        {act.type}
                      </span>
                    </div>
                    <h3 className="text-[16px] font-bold text-[#1d1d1f] leading-tight mb-2 group-hover:text-[#0071e3] transition-colors line-clamp-2">
                      {lang === 'kk' ? act.title_kk : act.title_ru}
                    </h3>
                    <p className="text-[12px] text-[#86868b] mb-4">
                      {lang === 'kk' ? act.branch_kk : act.branch_ru}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-black/[0.03]">
                    <span className="text-[12px] font-medium text-[#86868b]">ID: {act.doc_id}</span>
                    <a 
                      href={act.url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="flex items-center gap-1.5 text-[13px] font-bold text-[#0071e3] hover:translate-x-1 transition-transform"
                    >
                      {lang === 'kk' ? 'Оқу' : 'Читать'}
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[32px] p-16 text-center border border-black/[0.04]">
              <div className="w-16 h-16 bg-[#f5f5f7] rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-[#86868b]" />
              </div>
              <h3 className="text-[18px] font-bold text-[#1d1d1f] mb-2">
                {lang === 'kk' ? 'Ештеңе табылмады' : 'Ничего не найдено'}
              </h3>
              <p className="text-[14px] text-[#86868b]">
                {lang === 'kk' ? 'Басқа сөздермен іздеп көріңіз немесе сүзгіні өзгертіңіз' : 'Попробуйте изменить поисковый запрос или фильтры'}
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8 bg-white/50 backdrop-blur-md p-3 rounded-2xl w-fit mx-auto border border-black/[0.03]">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                disabled={currentPage === 1} 
                className="p-2.5 bg-white border border-black/[0.05] rounded-xl disabled:opacity-30 hover:bg-[#f5f5f7] hover:scale-105 transition-all shadow-sm"
              >
                <ChevronLeft className="w-4.5 h-4.5 text-[#1d1d1f]" />
              </button>
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-bold text-[#1d1d1f]">{currentPage}</span>
                <span className="text-[14px] text-[#86868b]">/</span>
                <span className="text-[14px] font-medium text-[#86868b]">{totalPages}</span>
              </div>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                disabled={currentPage === totalPages} 
                className="p-2.5 bg-white border border-black/[0.05] rounded-xl disabled:opacity-30 hover:bg-[#f5f5f7] hover:scale-105 transition-all shadow-sm"
              >
                <ChevronRight className="w-4.5 h-4.5 text-[#1d1d1f]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
