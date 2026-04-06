import { useState, useEffect } from 'react';
import { Book, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
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

    if (selectedCategory) {
      result = result.filter(doc => doc.category === selectedCategory);
    }

    if (selectedDocType) {
      result = result.filter(doc => doc.doc_type === selectedDocType);
    }

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

  // Pagination
  const totalPages = Math.ceil(filteredDocs.length / itemsPerPage);
  const paginatedDocs = filteredDocs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Заңнамаларды көру үшін жүйеге кіріңіз</h2>
          <a href="/login" className="px-6 py-2 bg-[#1A5276] text-white rounded-md hover:bg-[#154360]">Кіру</a>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Заңнамалар базасы</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Заңдарды, кодекстерді немесе баптарды іздеу..." 
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86C1] focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={selectedDocType || ''} 
            onChange={(e) => setSelectedDocType(e.target.value || null)}
            className="px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#2E86C1] focus:border-transparent"
          >
            <option value="">Барлық құжат түрлері</option>
            {docTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-2">
          <h3 className="font-semibold text-gray-900 mb-4">Санаттар</h3>
          <button 
            onClick={() => setSelectedCategory(null)}
            className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
              selectedCategory === null ? 'bg-[#EBF5FB] text-[#1A5276] font-medium' : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            Барлық санаттар
          </button>
          {categories.map((cat, idx) => (
            <button 
              key={idx} 
              onClick={() => setSelectedCategory(cat)}
              className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                selectedCategory === cat ? 'bg-[#EBF5FB] text-[#1A5276] font-medium' : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        <div className="md:col-span-3 space-y-4">
          {loading ? (
            <div className="text-center py-10 text-gray-500">Жүктелуде...</div>
          ) : paginatedDocs.length > 0 ? (
            <>
              {paginatedDocs.map((doc) => (
                <div key={doc.id} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Book className="w-6 h-6 text-[#2E86C1] mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-medium text-[#1A5276]">
                          {doc.title_kk || doc.title_ru}
                        </h3>
                        {doc.title_kk && doc.title_ru && (
                          <p className="text-sm text-gray-600 mt-1">{doc.title_ru}</p>
                        )}
                        <div className="flex gap-2 mt-2">
                          {doc.category && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                              {doc.category}
                            </span>
                          )}
                          {doc.doc_type && (
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded">
                              {docTypes.find(t => t.value === doc.doc_type)?.label || doc.doc_type}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-3">
                    {doc.adilet_url && (
                      <a href={doc.adilet_url} target="_blank" rel="noreferrer" className="text-sm text-[#2E86C1] hover:underline">
                        Толық мәтін (adilet.zan.kz)
                      </a>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-sm text-gray-600">
                    {currentPage} / {totalPages}
                  </span>
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-10 text-gray-500 bg-white rounded-lg border border-gray-200">
              Сұраныс бойынша құжаттар табылмады.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
