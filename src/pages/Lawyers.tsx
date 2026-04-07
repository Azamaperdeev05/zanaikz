import { useState, useMemo } from 'react';
import { Users, MapPin, Phone, Search, Mail, Globe, Map, ChevronDown, X } from 'lucide-react';
import { lawyersData } from '../data/lawyers';
import { useLangStore } from '../store/langStore';
import { t } from '../utils/i18n';

const REGION_MAPPING: Record<string, string[]> = {
  "Астана қаласы": ["Астана"],
  "Алматы қаласы": ["Алматы"],
  "Шымкент қаласы": ["Шымкент"],
  "Абай облысы": ["Семей", "Абай"],
  "Ақмола облысы": ["Көкшетау", "Ақмола"],
  "Ақтөбе облысы": ["Ақтөбе"],
  "Алматы облысы": ["Қонаев"],
  "Атырау облысы": ["Атырау"],
  "Батыс Қазақстан облысы": ["Орал", "БҚО"],
  "Жамбыл облысы": ["Тараз", "Жамбыл"],
  "Жетісу облысы": ["Талдықорған", "Жетісу"],
  "Қарағанды облысы": ["Қарағанды"],
  "Қостанай облысы": ["Қостанай"],
  "Қызылорда облысы": ["Қызылорда"],
  "Маңғыстау облысы": ["Ақтау", "Жаңаөзен", "Маңғыстау"],
  "Павлодар облысы": ["Павлодар"],
  "Солтүстік Қазақстан облысы": ["Петропавл", "СҚО"],
  "Түркістан облысы": ["Түркістан", "Түркістан облысы"],
  "Ұлытау облысы": ["Жезқазған", "Ұлытау"],
  "Шығыс Қазақстан облысы": ["Өскемен", "ШҚО"],
};

export default function Lawyers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);
  const { lang } = useLangStore();

  const filteredLawyers = useMemo(() => {
    return lawyersData.filter((lawyer: any) => {
      const matchesSearch = 
        lawyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lawyer.specialization.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesCity = true;
      if (selectedRegion !== '') {
        const mappedCities = REGION_MAPPING[selectedRegion] || [];
        matchesCity = mappedCities.includes(lawyer.city) || lawyer.city === selectedRegion;
      }
      return matchesSearch && matchesCity;
    });
  }, [searchQuery, selectedRegion]);

  return (
    <div className="p-5 lg:p-8 max-w-6xl mx-auto h-full flex flex-col relative">
      <div className="mb-6">
        <h1 className="text-[28px] font-bold text-[#1d1d1f] tracking-tight mb-1">{t(lang, 'lawyers', 'title')}</h1>
        <p className="text-[14px] text-[#86868b]">{t(lang, 'lawyers', 'subtitle')}</p>
      </div>
      
      {/* Search and Region Select Component */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 shrink-0">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#86868b] w-4 h-4" />
          <input
            type="text"
            placeholder={t(lang, 'lawyers', 'searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-4 py-2.5 bg-white border border-black/[0.06] rounded-xl text-[14px] text-[#1d1d1f] placeholder:text-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 transition-all font-medium"
          />
        </div>
        
        <button
          onClick={() => setIsRegionModalOpen(true)}
          className="flex items-center justify-between sm:w-64 px-4 py-2.5 bg-white border border-black/[0.06] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 transition-all active:scale-[0.98] group"
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <Map className="w-4 h-4 text-[#0071e3] shrink-0" />
            <span className="text-[14px] font-medium text-[#1d1d1f] truncate">
              {selectedRegion || (lang === 'kk' ? 'Аймақты таңдау' : 'Выберите регион')}
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-[#86868b] shrink-0 ml-2 group-hover:text-[#1d1d1f] transition-colors" />
        </button>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto pb-6">
        {filteredLawyers.length === 0 ? (
          <div className="text-center py-16 text-[#86868b] text-[14px] bg-white rounded-2xl border border-black/[0.04]">
            <MapPin className="w-10 h-10 mx-auto mb-3 text-[#d2d2d7]" />
            <p className="font-medium text-[#1d1d1f] mb-1">{t(lang, 'lawyers', 'notFound')}</p>
            <p>Басқа аймақты немесе кілт сөзді тексеріп көріңіз</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLawyers.map((lawyer: any) => (
              <div key={lawyer.id} className="bg-white p-5 rounded-2xl border border-black/[0.04] hover:border-black/[0.08] transition-colors flex flex-col h-full hover:shadow-sm">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-[#0071e3]/[0.08] rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-4.5 h-4.5 text-[#0071e3]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[15px] font-semibold text-[#1d1d1f] leading-tight">{lawyer.name}</h3>
                    <p className="text-[12px] text-[#0071e3] mt-0.5 line-clamp-1">{lawyer.specialization}</p>
                  </div>
                </div>
                
                <div className="space-y-1.5 text-[12px] text-[#86868b] mb-4 flex-1">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    <span>{lawyer.city}, {lawyer.address}</span>
                  </div>
                  {lawyer.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{lawyer.phone}</span>
                    </div>
                  )}
                  {lawyer.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{lawyer.email}</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-auto pt-3 flex gap-2 border-t border-black/[0.04]">
                  {lawyer.phone && (
                    <a href={`tel:${lawyer.phone.replace(/[^0-9+]/g, '')}`} className="flex-1 py-2.5 text-center text-[12px] font-bold text-white bg-[#0071e3] rounded-xl hover:bg-[#0077ED] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm">
                      {t(lang, 'lawyers', 'call')}
                    </a>
                  )}
                  {lawyer.email && (
                    <a href={lawyer.email.includes('@') ? `mailto:${lawyer.email}` : `http://${lawyer.email}`} target="_blank" rel="noreferrer" className="flex-1 py-2.5 text-center text-[12px] font-bold text-[#0071e3] bg-[#0071e3]/[0.08] rounded-xl hover:bg-[#0071e3]/[0.14] transition-all hover:scale-[1.02] active:scale-[0.98]">
                      {t(lang, 'lawyers', 'write')}
                    </a>
                  )}
                  {lawyer.website && lawyer.website !== 'Н/Д' && (
                    <a href={lawyer.website.startsWith('http') ? lawyer.website : `https://${lawyer.website}`} target="_blank" rel="noreferrer" className="py-2.5 px-3 text-center text-[12px] font-medium text-[#86868b] bg-[#f5f5f7] rounded-xl hover:bg-[#e8e8ed] transition-colors">
                      <Globe className="w-4 h-4 inline" />
                    </a>
                  )}
                  {!lawyer.phone && !lawyer.email && (!lawyer.website || lawyer.website === 'Н/Д') && (
                    <span className="w-full py-2.5 text-center text-[12px] text-[#86868b] font-medium">{t(lang, 'lawyers', 'noContact')}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Regions Modal */}
      {isRegionModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsRegionModalOpen(false)}
          />
          <div className="relative bg-[#f5f5f7] w-full max-w-4xl max-h-[90vh] rounded-[24px] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 md:p-6 bg-white border-b border-black/[0.04] shrink-0">
              <div>
                <h2 className="text-[20px] font-bold text-[#1d1d1f]">
                  {lang === 'kk' ? 'Аймақты таңдау' : 'Выберите регион'}
                </h2>
                <p className="text-[13px] text-[#86868b] mt-1">
                  Қазақстанның 20 өңірі (17 облыс және 3 республикалық маңызы бар қала)
                </p>
              </div>
              <button
                onClick={() => setIsRegionModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#86868b] rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body with 20 regions */}
            <div className="p-5 md:p-6 overflow-y-auto">
              <button
                onClick={() => {
                  setSelectedRegion('');
                  setIsRegionModalOpen(false);
                }}
                className={`w-full mb-6 p-4 rounded-xl text-center font-semibold transition-all active:scale-[0.98] ${
                  selectedRegion === '' 
                    ? 'bg-[#0071e3] text-white shadow-md' 
                    : 'bg-white text-[#1d1d1f] hover:bg-black/[0.02] border border-black/[0.06]'
                }`}
              >
                {t(lang, 'lawyers', 'allCities')}
              </button>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {Object.keys(REGION_MAPPING).map((region) => (
                  <button
                    key={region}
                    onClick={() => {
                      setSelectedRegion(region);
                      setIsRegionModalOpen(false);
                    }}
                    className={`flex items-center gap-3 p-4 rounded-xl text-left transition-all active:scale-[0.98] ${
                      selectedRegion === region
                        ? 'bg-[#0071e3] text-white shadow-md'
                        : 'bg-white hover:bg-[#0071e3]/5 border border-black/[0.04] hover:border-[#0071e3]/30 text-[#1d1d1f]'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      selectedRegion === region ? 'bg-white/20' : 'bg-[#f5f5f7]'
                    }`}>
                      <MapPin className={`w-4 h-4 ${selectedRegion === region ? 'text-white' : 'text-[#86868b]'}`} />
                    </div>
                    <span className="text-[14px] font-semibold leading-tight">{region}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
