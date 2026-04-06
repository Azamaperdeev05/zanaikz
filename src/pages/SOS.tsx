import { AlertTriangle, Phone, ShieldAlert } from 'lucide-react';

export default function SOS() {
  return (
    <div className="p-6 max-w-4xl mx-auto h-full overflow-y-auto">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8 flex items-start gap-4">
        <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0" />
        <div>
          <h1 className="text-2xl font-bold text-red-800 mb-2">Шұғыл құқықтық көмек (SOS)</h1>
          <p className="text-red-700">
            Егер сіздің өміріңізге, денсаулығыңызға немесе бостандығыңызға қауіп төніп тұрса, дереу төмендегі нөмірлерге хабарласыңыз.
          </p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Phone className="w-5 h-5 text-[#2E86C1]" />
            Шұғыл нөмірлер
          </h2>
          <ul className="space-y-4">
            <li className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Полиция</span>
              <a href="tel:102" className="text-xl font-bold text-[#1A5276]">102</a>
            </li>
            <li className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Жедел жәрдем</span>
              <a href="tel:103" className="text-xl font-bold text-[#1A5276]">103</a>
            </li>
            <li className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Төтенше жағдайлар</span>
              <a href="tel:112" className="text-xl font-bold text-[#1A5276]">112</a>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#F39C12]" />
            Қысқаша нұсқаулықтар
          </h2>
          <div className="space-y-3">
            <button className="w-full text-left p-4 bg-orange-50 text-orange-800 rounded-lg font-medium hover:bg-orange-100 transition-colors">
              Сізді ұстаған кезде не істеу керек?
            </button>
            <button className="w-full text-left p-4 bg-blue-50 text-blue-800 rounded-lg font-medium hover:bg-blue-100 transition-colors">
              Тінту кезіндегі сіздің құқықтарыңыз
            </button>
            <button className="w-full text-left p-4 bg-gray-50 text-gray-800 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Адвокат талап ету құқығы
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
