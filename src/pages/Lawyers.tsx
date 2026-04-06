import { useState, useMemo } from 'react';
import { Users, Star, MapPin, Phone, Search, Mail, Globe } from 'lucide-react';
import { lawyersData } from '../data/lawyers';

export default function Lawyers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  // Extract unique cities for the filter dropdown
  const cities = useMemo(() => {
    const uniqueCities = new Set(lawyersData.map(lawyer => lawyer.city));
    return Array.from(uniqueCities).sort();
  }, []);

  // Filter lawyers based on search query and selected city
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
    <div className="p-6 max-w-6xl mx-auto h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Заңгерлер анықтамасы</h1>
        <p className="text-gray-500">Қазақстанның барлық аймақтарындағы 100 тәжірибелі заңгерлер мен адвокаттар тізімі</p>
      </div>
      
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Аты-жөні немесе мамандығы бойынша іздеу..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-[#2E86C1] focus:border-[#2E86C1]"
          />
        </div>
        <div className="sm:w-64">
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-[#2E86C1] focus:border-[#2E86C1]"
          >
            <option value="">Барлық қалалар</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Lawyers Grid */}
      <div className="flex-1 overflow-y-auto pb-6">
        {filteredLawyers.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Сұраныс бойынша заңгерлер табылмады.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLawyers.map((lawyer: any) => (
              <div key={lawyer.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-[#2E86C1] flex-shrink-0">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 leading-tight mb-1">{lawyer.name}</h3>
                    <p className="text-sm text-[#2E86C1] line-clamp-2" title={lawyer.specialization}>
                      {lawyer.specialization}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3 text-sm text-gray-600 mb-6 flex-1">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
                    <span>{lawyer.city}, {lawyer.address}</span>
                  </div>
                  {lawyer.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 flex-shrink-0 text-gray-400" />
                      <span className="truncate">{lawyer.phone}</span>
                    </div>
                  )}
                  {lawyer.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 flex-shrink-0 text-gray-400" />
                      <a href={lawyer.email.includes('@') ? `mailto:${lawyer.email}` : `http://${lawyer.email}`} target="_blank" rel="noreferrer" className="hover:text-[#2E86C1] transition-colors truncate">
                        {lawyer.email}
                      </a>
                    </div>
                  )}
                </div>
                
                <div className="mt-auto pt-4 flex gap-2 w-full flex-wrap">
                  {lawyer.phone && (
                    <a
                      href={`tel:${lawyer.phone.replace(/[^0-9+]/g, '')}`}
                      className="flex-1 py-2 px-3 bg-[#F39C12] text-white rounded-lg hover:bg-[#D68910] font-medium transition-colors text-center text-sm flex items-center justify-center gap-1 min-w-[120px]"
                    >
                      <Phone className="w-4 h-4" /> Байланысу
                    </a>
                  )}
                  {lawyer.email && (
                    <a
                      href={lawyer.email.includes('@') ? `mailto:${lawyer.email}` : `http://${lawyer.email}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2 px-3 bg-[#2E86C1] text-white rounded-lg hover:bg-[#21618C] font-medium transition-colors text-center text-sm flex items-center justify-center gap-1 min-w-[120px]"
                    >
                      <Mail className="w-4 h-4" /> Жазу
                    </a>
                  )}
                  {lawyer.website && lawyer.website !== 'Н/Д' && (
                    <a
                      href={lawyer.website.startsWith('http') ? lawyer.website : `https://${lawyer.website}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2 px-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors text-center text-sm flex items-center justify-center gap-1 min-w-[120px]"
                    >
                      <Globe className="w-4 h-4" /> Сайт
                    </a>
                  )}
                  {/* Fallback pattern if none are provided */}
                  {!lawyer.phone && !lawyer.email && (!lawyer.website || lawyer.website === 'Н/Д') && (
                    <button disabled className="w-full py-2 bg-gray-300 text-gray-500 rounded-lg font-medium cursor-not-allowed">
                      Байланыс жоқ
                    </button>
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
