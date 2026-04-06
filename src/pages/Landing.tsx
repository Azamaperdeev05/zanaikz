import { Link } from 'react-router-dom';
import { Scale, ShieldCheck, MessageSquare, BookOpen } from 'lucide-react';

export default function Landing() {
  return (
    <div className="h-full overflow-y-auto bg-white">
      {/* Hero Section */}
      <div className="bg-[#1A5276] text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Жасанды интеллект негізіндегі құқықтық кеңесші
          </h1>
          <p className="text-xl text-blue-100 mb-10">
            Қазақстан Республикасының заңнамасы бойынша қауіпсіз, дәл және тексерілген құқықтық кеңес алыңыз.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/chat" className="px-8 py-4 bg-[#F39C12] text-white font-semibold rounded-lg hover:bg-[#D68910] transition-colors text-lg">
              Сұрақ қою
            </Link>
            <Link to="/laws" className="px-8 py-4 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors text-lg">
              Заңнамаларды қарау
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Жүйенің мүмкіндіктері</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 text-[#2E86C1] rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Құқықтық кеңес чаты</h3>
              <p className="text-gray-600">
                Кез келген құқықтық сұраққа қарапайым тілде, нақты баптарға сілтеме жасай отырып жауап алыңыз.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 text-[#27AE60] rounded-lg flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Сенімділік және Қауіпсіздік</h3>
              <p className="text-gray-600">
                Жауаптар тек ресми дереккөздерге (adilet.zan.kz) негізделген. Сіздің деректеріңіз толық шифрланған.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-orange-100 text-[#F39C12] rounded-lg flex items-center justify-center mb-4">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Қосымша құралдар</h3>
              <p className="text-gray-600">
                Құжат үлгілері, құқықтық калькуляторлар және заңгерлер анықтамасы бір жерде.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
