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
    <div className="p-6 max-w-7xl mx-auto h-full flex flex-col overflow-hidden">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Құжат үлгілері</h1>
        <p className="text-gray-500">Қазақстан Республикасының заңнамасына сәйкес 30 түрлі ресми құжаттың дайын үлгілері</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide shrink-0">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
              selectedCategory === cat
                ? 'bg-[#1A5276] text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 pb-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((tpl) => (
            <div key={tpl.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#2E86C1] transition-all group flex flex-col h-full">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-[#2E86C1] mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-md text-gray-900 mb-1 leading-tight">{tpl.title}</h3>
              <p className="text-xs text-[#2E86C1] mb-3 font-medium bg-blue-50 px-2 py-1 rounded inline-block w-fit">{tpl.category}</p>
              
              {/* Tooltip for description since it's quite long */}
              <p className="text-sm text-gray-500 mb-6 flex-1 line-clamp-3" title={tpl.description}>
                {tpl.description}
              </p>
              
              <div className="flex gap-2 mt-auto">
                <a 
                  href={tpl.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-100 flex items-center justify-center gap-2 text-gray-700 transition-colors"
                >
                  {tpl.link?.includes('.doc') || tpl.link?.includes('.pdf') ? <Download className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
                  {tpl.link?.includes('.doc') ? "DOCX жүктеу" : tpl.link?.includes('.pdf') ? "PDF жүктеу" : "Сайтқа өту"}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
