import { useState, useEffect } from 'react';
import { Book, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, getDocs } from 'firebase/firestore';
import { useAuthStore } from '../store/authStore';

interface LegalDocument {
  id: string;
  title_kk: string;
  title_ru: string;
  doc_type: string;
  category: string;
  adilet_url: string;
}

export default function Laws() {
  const { user } = useAuthStore();
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [filteredDocs, setFilteredDocs] = useState<LegalDocument[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDocType, setSelectedDocType] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const categories = [
    "Конституциялық құқық", "Азаматтық құқық", "Еңбек құқығы", 
    "Отбасы құқығы", "Қылмыстық құқық", "Әкімшілік құқық", 
    "Салық құқығы", "Жер құқығы"
  ];

  const docTypes = [
    { value: 'kodeks', label: 'Кодекс' },
    { value: 'zakon', label: 'Заң' },
    { value: 'ukaz', label: 'Жарлық' },
    { value: 'postanovlenie', label: 'Қаулы' }
  ];

  useEffect(() => {
    if (!user) return;
    const fetchDocuments = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'legal_documents'));
        const querySnapshot = await getDocs(q);
        const docs: LegalDocument[] = [];
        querySnapshot.forEach((doc) => {
          docs.push({ id: doc.id, ...doc.data() } as LegalDocument);
        });
        setDocuments(docs);
        setFilteredDocs(docs);
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, [user]);

  useEffect(() => {
    let result = documents;
    if (selectedCategory) result = result.filter(doc => doc.category === selectedCategory);
    if (selectedDocType) result = result.filter(doc => doc.doc_type === selectedDocType);
    if (searchQuery.trim()) {
      const queryStr = searchQuery.toLowerCase();
      result = result.filter(doc => 
        (doc.title_kk && doc.title_kk.toLowerCase().includes(queryStr)) || 
        (doc.title_ru && doc.title_ru.toLowerCase().includes(queryStr))
      );
    }
    setFilteredDocs(result);
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedDocType, documents]);

  const totalPages = Math.ceil(filteredDocs.length / itemsPerPage);
  const paginatedDocs = filteredDocs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full bg-[#f5f5f7]">
        <div className="text-center">
          <h2 className="text-[20px] font-bold text-[#1d1d1f] mb-3">Заңнамаларды көру үшін кіріңіз</h2>
          <a href="/login" className="text-[14px] font-medium text-white bg-[#0071e3] px-5 py-2 rounded-full hover:bg-[#0077ED] transition-colors">Кіру</a>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 lg:p-8 max-w-6xl mx-auto h-full overflow-y-auto">
      <h1 className="text-[28px] font-bold text-[#1d1d1f] tracking-tight mb-1">Заңнамалар базасы</h1>
      <p className="text-[14px] text-[#86868b] mb-8">ҚР заңнамалық актілерін іздеу және қарау</p>

      {/* Search */}
      <div className="flex flex-col md:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#86868b] w-4 h-4" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Іздеу…" 
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-black/[0.06] rounded-xl text-[14px] text-[#1d1d1f] placeholder:text-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 focus:border-[#0071e3]/40 transition-all"
          />
        </div>
        <select 
          value={selectedDocType || ''} 
          onChange={(e) => setSelectedDocType(e.target.value || null)}
          className="px-4 py-2.5 bg-white border border-black/[0.06] rounded-xl text-[14px] text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30"
        >
          <option value="">Барлық түрлері</option>
          {docTypes.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {/* Categories */}
        <div className="md:col-span-1 space-y-0.5">
          <h3 className="text-[12px] font-semibold text-[#86868b] uppercase tracking-wider mb-3 px-3">Санаттар</h3>
          <button 
            onClick={() => setSelectedCategory(null)}
            className={`block w-full text-left px-3 py-[7px] rounded-lg text-[13px] transition-colors ${
              selectedCategory === null ? 'bg-[#0071e3]/10 text-[#0071e3] font-semibold' : 'text-[#1d1d1f]/70 hover:bg-black/[0.03]'
            }`}
          >
            Барлығы
          </button>
          {categories.map((cat, idx) => (
            <button 
              key={idx} 
              onClick={() => setSelectedCategory(cat)}
              className={`block w-full text-left px-3 py-[7px] rounded-lg text-[13px] transition-colors ${
                selectedCategory === cat ? 'bg-[#0071e3]/10 text-[#0071e3] font-semibold' : 'text-[#1d1d1f]/70 hover:bg-black/[0.03]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        {/* Documents */}
        <div className="md:col-span-3 space-y-3">
          {loading ? (
            <div className="text-center py-16 text-[#86868b] text-[14px]">Жүктелуде…</div>
          ) : paginatedDocs.length > 0 ? (
            <>
              {paginatedDocs.map((doc) => (
                <div key={doc.id} className="bg-white p-5 rounded-2xl border border-black/[0.04] hover:border-black/[0.08] transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-[#0071e3]/[0.08] rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Book className="w-4 h-4 text-[#0071e3]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[15px] font-semibold text-[#1d1d1f] leading-snug">{doc.title_kk || doc.title_ru}</h3>
                      {doc.title_kk && doc.title_ru && (
                        <p className="text-[13px] text-[#86868b] mt-1">{doc.title_ru}</p>
                      )}
                      <div className="flex gap-2 mt-2.5">
                        {doc.category && (
                          <span className="px-2.5 py-0.5 bg-[#f5f5f7] text-[#86868b] text-[11px] font-medium rounded-full">{doc.category}</span>
                        )}
                        {doc.doc_type && (
                          <span className="px-2.5 py-0.5 bg-[#0071e3]/[0.06] text-[#0071e3] text-[11px] font-medium rounded-full">
                            {docTypes.find(t => t.value === doc.doc_type)?.label || doc.doc_type}
                          </span>
                        )}
                      </div>
                      {doc.adilet_url && (
                        <a href={doc.adilet_url} target="_blank" rel="noreferrer" className="inline-block mt-3 text-[13px] text-[#0071e3] hover:underline">
                          Толық мәтін →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-6">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 bg-white border border-black/[0.06] rounded-lg disabled:opacity-30 hover:bg-[#f5f5f7] transition-colors">
                    <ChevronLeft className="w-4 h-4 text-[#1d1d1f]" />
                  </button>
                  <span className="text-[13px] text-[#86868b] font-medium">{currentPage} / {totalPages}</span>
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 bg-white border border-black/[0.06] rounded-lg disabled:opacity-30 hover:bg-[#f5f5f7] transition-colors">
                    <ChevronRight className="w-4 h-4 text-[#1d1d1f]" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 text-[#86868b] text-[14px] bg-white rounded-2xl border border-black/[0.04]">
              Құжаттар табылмады.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
