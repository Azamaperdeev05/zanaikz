import { useState, useMemo } from 'react';
import { Users, MapPin, Phone, Search, Mail, Globe } from 'lucide-react';
import { lawyersData } from '../data/lawyers';

export default function Lawyers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const cities = useMemo(() => {
    const uniqueCities = new Set(lawyersData.map(lawyer => lawyer.city));
    return Array.from(uniqueCities).sort();
  }, []);

  const filteredLawyers = useMemo(() => {
    return lawyersData.filter((lawyer: any) => {
      const matchesSearch = 
        lawyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lawyer.specialization.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCity = selectedCity === '' || lawyer.city === selectedCity;
      return matchesSearch && matchesCity;
    });
  }, [searchQuery, selectedCity]);

  return (
    <div className="p-5 lg:p-8 max-w-6xl mx-auto h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-[28px] font-bold text-[#1d1d1f] tracking-tight mb-1">Заңгерлер</h1>
        <p className="text-[14px] text-[#86868b]">Қазақстанның тәжірибелі заңгерлері мен адвокаттары</p>
      </div>
      
      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 shrink-0">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#86868b] w-4 h-4" />
          <input
            type="text"
            placeholder="Аты-жөні немесе мамандығы…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-4 py-2.5 bg-white border border-black/[0.06] rounded-xl text-[14px] text-[#1d1d1f] placeholder:text-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 transition-all"
          />
        </div>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="sm:w-52 px-4 py-2.5 bg-white border border-black/[0.06] rounded-xl text-[14px] text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30"
        >
          <option value="">Барлық қалалар</option>
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto pb-6">
        {filteredLawyers.length === 0 ? (
          <div className="text-center py-16 text-[#86868b] text-[14px]">
            <Users className="w-10 h-10 mx-auto mb-3 text-[#d2d2d7]" />
            <p>Заңгерлер табылмады.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLawyers.map((lawyer: any) => (
              <div key={lawyer.id} className="bg-white p-5 rounded-2xl border border-black/[0.04] hover:border-black/[0.08] transition-colors flex flex-col h-full">
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
                    <a href={`tel:${lawyer.phone.replace(/[^0-9+]/g, '')}`} className="flex-1 py-2 text-center text-[12px] font-medium text-white bg-[#0071e3] rounded-lg hover:bg-[#0077ED] transition-colors">
                      Қоңырау шалу
                    </a>
                  )}
                  {lawyer.email && (
                    <a href={lawyer.email.includes('@') ? `mailto:${lawyer.email}` : `http://${lawyer.email}`} target="_blank" rel="noreferrer" className="flex-1 py-2 text-center text-[12px] font-medium text-[#0071e3] bg-[#0071e3]/[0.08] rounded-lg hover:bg-[#0071e3]/[0.14] transition-colors">
                      Жазу
                    </a>
                  )}
                  {lawyer.website && lawyer.website !== 'Н/Д' && (
                    <a href={lawyer.website.startsWith('http') ? lawyer.website : `https://${lawyer.website}`} target="_blank" rel="noreferrer" className="py-2 px-3 text-center text-[12px] font-medium text-[#86868b] bg-[#f5f5f7] rounded-lg hover:bg-[#e8e8ed] transition-colors">
                      <Globe className="w-3.5 h-3.5 inline" />
                    </a>
                  )}
                  {!lawyer.phone && !lawyer.email && (!lawyer.website || lawyer.website === 'Н/Д') && (
                    <span className="w-full py-2 text-center text-[12px] text-[#86868b]">Байланыс жоқ</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
