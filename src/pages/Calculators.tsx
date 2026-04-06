import { useState } from 'react';
import { 
  Calculator as CalcIcon, Baby, Scale, Briefcase, 
  ChevronRight, CheckCircle2, Calculator, Receipt,
  Clock, Car, ShieldAlert, CreditCard, HeartPulse
} from 'lucide-react';

export default function Calculators() {
  const [activeTab, setActiveTab] = useState<'alimony' | 'duty' | 'severance' | 'mrp' | 'tax' | 'penalty' | 'maternity' | 'pdd' | 'carTax' | 'loan'>('alimony');

  // Existing States
  const [income, setIncome] = useState<string>('');
  const [childrenCount, setChildrenCount] = useState<number>(1);
  const [claimAmount, setClaimAmount] = useState<string>('');
  const [entityType, setEntityType] = useState<'individual' | 'legal'>('individual');
  const [avgSalary, setAvgSalary] = useState<string>('');
  const [reason, setReason] = useState<'liquidation' | 'reduction' | 'decline'>('liquidation');
  const [mrpCount, setMrpCount] = useState<string>('1');
  const [mrpYear, setMrpYear] = useState<'2024' | '2025' | '2026'>('2024');
  const [grossSalary, setGrossSalary] = useState<string>('');
  
  // New States
  const [debtAmount, setDebtAmount] = useState<string>('');
  const [overdueDays, setOverdueDays] = useState<string>('');
  const [baseRate, setBaseRate] = useState<string>('14.75');

  const [maternitySalary, setMaternitySalary] = useState<string>('');

  const [pddViolation, setPddViolation] = useState<string>('5');
  const [paidEarly, setPaidEarly] = useState<boolean>(true);

  const [engineVolume, setEngineVolume] = useState<string>('3');

  const [loanAmount, setLoanAmount] = useState<string>('');
  const [loanPercent, setLoanPercent] = useState<string>('15');
  const [loanYears, setLoanYears] = useState<string>('5');

  // MRP Constants Base
  const mrpRates = {
    '2024': 3692,
    '2025': 3932,
    '2026': 4188
  };

  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('kk-KZ', { style: 'currency', currency: 'KZT', maximumFractionDigits: 0 }).format(Math.max(0, val));
  };

  // ---- CALCULATIONS ----
  const calculateAlimony = () => {
    const numIncome = parseFloat(income.replace(/[\s,]/g, '')) || 0;
    let percentage = childrenCount === 1 ? 0.25 : childrenCount === 2 ? 0.3333 : 0.5;
    return numIncome * percentage;
  };

  const calculateDuty = () => {
    const amount = parseFloat(claimAmount.replace(/[\s,]/g, '')) || 0;
    const rate = entityType === 'individual' ? 0.01 : 0.03;
    return amount * rate;
  };

  const calculateSeverance = () => {
    const salary = parseFloat(avgSalary.replace(/[\s,]/g, '')) || 0;
    return reason === 'decline' ? salary * 2 : salary; 
  };

  const calculateMrp = () => {
    const count = parseFloat(mrpCount) || 0;
    return count * mrpRates[mrpYear];
  };

  const calculateTaxes = () => {
    const salary = parseFloat(grossSalary.replace(/[\s,]/g, '')) || 0;
    const pension = salary * 0.10; // 10% ОПВ
    const osms = salary * 0.02; // 2% ВОСМС
    const baseForIpn = salary - pension - osms - (14 * mrpRates[mrpYear]);
    const ipn = Math.max(0, baseForIpn * 0.10); 
    const netSalary = Math.max(0, salary - pension - osms - ipn);
    return { pension, osms, ipn, netSalary };
  };

  const calculatePenalty = () => {
    const p = parseFloat(debtAmount.replace(/[\s,]/g, '')) || 0;
    const d = parseFloat(overdueDays) || 0;
    const r = parseFloat(baseRate) || 14.75;
    return p * (r / 100) / 365 * d;
  };

  const calculateMaternity = () => {
    const s = parseFloat(maternitySalary.replace(/[\s,]/g, '')) || 0;
    const oneTime = s * 4.2 * 0.9;
    const monthly = s * 0.4 * 0.9;
    return { oneTime, monthly };
  };

  const calculatePdd = () => {
    const mrp = parseFloat(pddViolation) || 0;
    const total = mrp * mrpRates[mrpYear];
    return paidEarly ? total * 0.5 : total;
  };

  const calculateCarTax = () => {
    const v = parseFloat(engineVolume) || 0;
    return v * mrpRates[mrpYear];
  };

  const calculateLoan = () => {
    const p = parseFloat(loanAmount.replace(/[\s,]/g, '')) || 0;
    const rate = parseFloat(loanPercent) || 0;
    const years = parseFloat(loanYears) || 0;
    if (!p || !rate || !years) return { monthly: 0, total: 0, overpay: 0 };
    
    const r = (rate / 100) / 12;
    const n = years * 12;
    const monthly = p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = monthly * n;
    const overpay = total - p;
    return { monthly, total, overpay };
  };

  const renderCalculator = () => {
    switch (activeTab) {
      case 'alimony':
        return (
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-black/[0.04]">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-black/[0.04]">
              <div className="w-10 h-10 bg-[#ff2d55]/[0.08] rounded-xl flex items-center justify-center"><Baby className="w-5 h-5 text-[#ff2d55]" /></div>
              <div>
                <h2 className="text-[17px] font-semibold text-[#1d1d1f]">Алимент есептегіш</h2>
                <p className="text-[12px] text-[#86868b]">ҚР «Неке және отбасы» кодексі (139-бап)</p>
              </div>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-[12px] font-semibold text-[#86868b] uppercase tracking-wider mb-2">Таза айлық табыс</label>
                <input type="number" value={income} onChange={(e) => setIncome(e.target.value)} placeholder="250000" className="w-full px-4 py-2.5 rounded-xl border border-black/[0.06] text-[15px] text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 transition-all" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#86868b] uppercase tracking-wider mb-2">Балалар саны</label>
                <div className="flex bg-[#f5f5f7] p-1 rounded-xl border border-black/[0.04]">
                  {[1, 2, 3].map((num) => (
                    <button key={num} onClick={() => setChildrenCount(num)} className={`flex-1 py-2 text-[13px] font-medium rounded-lg transition-all ${childrenCount === num ? 'bg-white shadow-sm text-[#1d1d1f]' : 'text-[#86868b]'}`}>
                      {num === 3 ? '3+' : `${num} бала`}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-[#f5f5f7] p-5 rounded-xl border border-black/[0.04] mt-6">
                <h3 className="text-[12px] font-semibold text-[#86868b] uppercase tracking-wider mb-1">Ай сайынғы алимент:</h3>
                <p className="text-[32px] font-bold text-[#1d1d1f] tracking-tight">{formatCurrency(calculateAlimony())}</p>
              </div>
            </div>
          </div>
        );

      case 'penalty':
        return (
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600"><Clock className="w-6 h-6" /></div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Өсімпұл (Пеня) есептегіш</h2>
                <p className="text-sm text-gray-500">Азаматтық кодекстің 353-бабына сай қарызды кешіктіргені үшін</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Негізгі қарыз сомасы</label>
                <input type="number" value={debtAmount} onChange={(e) => setDebtAmount(e.target.value)} placeholder="Мысалы: 1000000" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#2E86C1] outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Кешіктірілген күндер</label>
                  <input type="number" value={overdueDays} onChange={(e) => setOverdueDays(e.target.value)} placeholder="Мысалы: 45" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#2E86C1] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Базалық мөлшерлеме (%)</label>
                  <input type="number" value={baseRate} onChange={(e) => setBaseRate(e.target.value)} placeholder="14.75" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#2E86C1] outline-none" />
                </div>
              </div>
              <div className="bg-red-50 p-6 rounded-xl border border-red-100 mt-8">
                <h3 className="text-sm font-medium text-red-800 mb-1">Сот арқылы талап етілетін өсімпұл (Пеня):</h3>
                <p className="text-4xl font-bold text-red-600">{formatCurrency(calculatePenalty())}</p>
                <p className="text-xs text-red-500 mt-2">*Толық шартта өзге мөлшерлеме көрсетілмесе, Ұлттық банктің мөлшерлемесімен есептеледі.</p>
              </div>
            </div>
          </div>
        );

      case 'maternity':
        return (
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
              <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center text-pink-600"><HeartPulse className="w-6 h-6" /></div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Декреттік төлем (Ана капиталы)</h2>
                <p className="text-sm text-gray-500">Жүктілік пен босануға байланысты төленетін жәрдемақы</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Соңғы 12 айдағы орташа айлығыңыз</label>
                <input type="number" value={maternitySalary} onChange={(e) => setMaternitySalary(e.target.value)} placeholder="Мысалы: 350000" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#2E86C1] outline-none" />
              </div>
              <div className="bg-pink-50 p-6 rounded-xl border border-pink-100 mt-8 grid gap-4">
                <div>
                  <h3 className="text-sm font-medium text-pink-800 mb-1">Бір реттік декреттік төлем (~126 күнге):</h3>
                  <p className="text-3xl font-bold text-pink-600">{formatCurrency(calculateMaternity().oneTime)}</p>
                </div>
                <div className="h-px bg-pink-200"></div>
                <div>
                  <h3 className="text-sm font-medium text-pink-800 mb-1">Бала 1.5 жасқа толғанша ай сайынғы жәрдемақы:</h3>
                  <p className="text-3xl font-bold text-pink-600">{formatCurrency(calculateMaternity().monthly)} <span className="text-lg font-normal text-pink-800">/ айына</span></p>
                </div>
                <p className="text-xs text-pink-500 mt-2">*Есептеуде зейнетақы жарнасы (10%) ұсталынған таза қолға тиетін сома көрсетілген.</p>
              </div>
            </div>
          </div>
        );

      case 'pdd':
        return (
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600"><ShieldAlert className="w-6 h-6" /></div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">ЖОЛ Ережесі (ПДД) Айыппұлы</h2>
                <p className="text-sm text-gray-500">Көлік жүргізушілеріне арналған айыппұл көлемі</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Жылды таңдаңыз</label>
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  {(['2024', '2025', '2026'] as const).map(year => (
                    <button key={year} onClick={() => setMrpYear(year)} className={`flex-1 py-1.5 text-sm font-medium rounded-lg ${mrpYear === year ? 'bg-white shadow text-[#2E86C1]' : 'text-gray-500'}`}>{year}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Құқық бұзушылық түрі</label>
                <select value={pddViolation} onChange={(e) => setPddViolation(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#2E86C1] outline-none">
                  <option value="3">Тоқтау сызығын басу (3 АЕК)</option>
                  <option value="5">Жылдамдықты 10-20 км/сағ асыру (5 АЕК)</option>
                  <option value="5">Телефонмен сөйлесу / Қауіпсіздік белдігін тақпау (5 АЕК)</option>
                  <option value="10">Бағдаршамның қызыл түсіне өту (10 АЕК)</option>
                  <option value="10">Құжатсыз көлік жүргізу (10 АЕК)</option>
                  <option value="30">Қарсы бетке шығу (30 АЕК)</option>
                </select>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="early" checked={paidEarly} onChange={(e) => setPaidEarly(e.target.checked)} className="w-5 h-5 text-[#2E86C1] rounded border-gray-300 focus:ring-[#2E86C1]" />
                <label htmlFor="early" className="text-sm text-gray-700 font-medium">7 күн ішінде төлеу (50% жеңілдік)</label>
              </div>
              <div className="bg-orange-50 p-6 rounded-xl border border-orange-100 mt-8">
                <h3 className="text-sm font-medium text-orange-800 mb-1">Төленуге тиіс сома:</h3>
                <p className="text-4xl font-bold text-orange-600">{formatCurrency(calculatePdd())}</p>
              </div>
            </div>
          </div>
        );

      case 'carTax':
        return (
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600"><Car className="w-6 h-6" /></div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Көлік салығы</h2>
                <p className="text-sm text-gray-500">Жеңіл автомобильдер үшін салық көлемі</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Жылды таңдаңыз</label>
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  {(['2024', '2025', '2026'] as const).map(year => (
                    <button key={year} onClick={() => setMrpYear(year)} className={`flex-1 py-1.5 text-sm font-medium rounded-lg ${mrpYear === year ? 'bg-white shadow text-[#2E86C1]' : 'text-gray-500'}`}>{year}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Қозғалтқыш көлемі (Куб)</label>
                <select value={engineVolume} onChange={(e) => setEngineVolume(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#2E86C1] outline-none">
                  <option value="1">1100-ден 1500 текше см-ге дейін (2 АЕК)</option>
                  <option value="3">1500-ден 2000 текше см-ге дейін (3 АЕК)</option>
                  <option value="7">2000-нан 2500 текше см-ге дейін (7 АЕК)</option>
                  <option value="9">2500-нан 3000 текше см-ге дейін (9 АЕК)</option>
                  <option value="15">3000-нан 4000 текше см-ге дейін (15 АЕК)</option>
                  <option value="117">4000 текше см-ден жоғары (117 АЕК)</option>
                </select>
              </div>
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mt-8">
                <h3 className="text-sm font-medium text-blue-800 mb-1">Жылдық көлік салығы:</h3>
                <p className="text-4xl font-bold text-blue-600">{formatCurrency(calculateCarTax())}</p>
              </div>
            </div>
          </div>
        );

      case 'loan':
        return (
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600"><CreditCard className="w-6 h-6" /></div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Несие / Ипотека калькуляторы</h2>
                <p className="text-sm text-gray-500">Айлық төлем мен артық төлемді (переплата) есептеу</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Несие сомасы (қанша алмақсыз)</label>
                <input type="number" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} placeholder="Мысалы: 5000000" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#2E86C1] outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Пайыздық мөлшерлеме (%)</label>
                  <input type="number" value={loanPercent} onChange={(e) => setLoanPercent(e.target.value)} placeholder="15" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#2E86C1] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Мерзімі (Жылмен)</label>
                  <input type="number" value={loanYears} onChange={(e) => setLoanYears(e.target.value)} placeholder="5" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#2E86C1] outline-none" />
                </div>
              </div>
              <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 mt-8 grid gap-4">
                <div>
                  <h3 className="text-sm font-medium text-purple-800 mb-1">Ай сайынғы төлем:</h3>
                  <p className="text-3xl font-bold text-purple-600">{formatCurrency(calculateLoan().monthly)}</p>
                </div>
                <div className="h-px bg-purple-200"></div>
                <div>
                  <h3 className="text-sm font-medium text-purple-800 mb-1">Банкке артық төлем (Переплата):</h3>
                  <p className="text-xl font-bold text-purple-500">{formatCurrency(calculateLoan().overpay)}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'tax':
        return (
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600"><Receipt className="w-6 h-6" /></div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Жалақыдан салық (ЖТС, Зейнетақы)</h2>
                <p className="text-sm text-gray-500">Қолға тиетін таза жалақыны есептеу (Netto / Brutto)</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Есептелген жалақы мөлшері (Брутто)</label>
                <input type="number" value={grossSalary} onChange={(e) => setGrossSalary(e.target.value)} placeholder="Мысалы: 300000" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 outline-none text-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Есептеу жылы (АЕК шегерімі үшін)</label>
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  {(['2024', '2025', '2026'] as const).map(year => (
                    <button key={year} onClick={() => setMrpYear(year)} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${mrpYear === year ? 'bg-white shadow text-red-600' : 'text-gray-500 hover:text-gray-900'}`}>{year}</button>
                  ))}
                </div>
              </div>
              {grossSalary && (
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mt-8 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Обязательные пенсионные взносы (10%)</span>
                    <span className="font-medium text-red-500">-{formatCurrency(calculateTaxes().pension)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Медициналық сақтандыру ВОСМС (2%)</span>
                    <span className="font-medium text-red-500">-{formatCurrency(calculateTaxes().osms)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Жеке табыс салығы ЖТС (10%)</span>
                    <span className="font-medium text-red-500">-{formatCurrency(calculateTaxes().ipn)}</span>
                  </div>
                  <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                    <span className="font-bold text-gray-900">Таза қолға алатын жалақы:</span>
                    <span className="text-2xl font-bold text-green-600">{formatCurrency(calculateTaxes().netSalary)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'mrp':
        return (
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600"><Calculator className="w-6 h-6" /></div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">АЕК (МРП) калькуляторы</h2>
                <p className="text-sm text-gray-500">Айлық есептік көрсеткішті теңгеге аудару</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Жылды таңдаңыз</label>
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  {(['2024', '2025', '2026'] as const).map(year => (
                    <button key={year} onClick={() => setMrpYear(year)} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${mrpYear === year ? 'bg-white shadow text-amber-600' : 'text-gray-500'}`}>{year}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">АЕК саны</label>
                <input type="number" value={mrpCount} onChange={(e) => setMrpCount(e.target.value)} placeholder="Мысалы: 5" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 outline-none text-lg" />
              </div>
              <div className="bg-amber-50 p-6 rounded-xl border border-amber-100 mt-8">
                <h3 className="text-sm font-medium text-amber-800 mb-1">Толық сома (Теңгемен):</h3>
                <p className="text-4xl font-bold text-amber-600">{formatCurrency(calculateMrp())}</p>
              </div>
            </div>
          </div>
        );

      case 'duty':
        return (
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
             <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600"><Scale className="w-6 h-6" /></div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Мемлекеттік баж есептегіш</h2>
                <p className="text-sm text-gray-500">ҚР Салық кодексі (610-бап), мүліктік даулар</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Талап қою сомасы (қанша ақша өндірмексіз, теңгемен)</label>
                <input type="number" value={claimAmount} onChange={(e) => setClaimAmount(e.target.value)} placeholder="Мысалы: 500000" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none text-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Сіз кімсіз?</label>
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  <button onClick={() => setEntityType('individual')} className={`flex-1 py-3 text-sm font-medium rounded-lg transition-all ${entityType === 'individual' ? 'bg-white shadow text-green-600' : 'text-gray-500'}`}>Жеке тұлға (1%)</button>
                  <button onClick={() => setEntityType('legal')} className={`flex-1 py-3 text-sm font-medium rounded-lg transition-all ${entityType === 'legal' ? 'bg-white shadow text-green-600' : 'text-gray-500'}`}>Заңды тұлға (3%)</button>
                </div>
              </div>
              <div className="bg-green-50 p-6 rounded-xl border border-green-100 mt-8">
                <h3 className="text-sm font-medium text-green-800 mb-1">Облигациялық сот бажы:</h3>
                <p className="text-4xl font-bold text-green-600">{formatCurrency(calculateDuty())}</p>
              </div>
            </div>
          </div>
        );

      case 'severance':
        return (
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600"><Briefcase className="w-6 h-6" /></div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Жұмыстан шығу өтемақысы</h2>
                <p className="text-sm text-gray-500">ҚР Еңбек кодексі (131-бап)</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Орташа айлық жалақыңыз (теңгемен)</label>
                <input type="number" value={avgSalary} onChange={(e) => setAvgSalary(e.target.value)} placeholder="Мысалы: 300000" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none text-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Жұмыстан босатылу себебі</label>
                <div className="flex flex-col gap-2">
                  <button onClick={() => setReason('liquidation')} className={`text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all flex items-center justify-between ${reason === 'liquidation' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}>Кәсіпорынның таратылуы <div className={`w-4 h-4 rounded-full border-2 ${reason === 'liquidation' ? 'border-indigo-500 bg-indigo-500' : 'border-gray-300'}`} /></button>
                  <button onClick={() => setReason('reduction')} className={`text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all flex items-center justify-between ${reason === 'reduction' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}>Қызметкерлер санының қысқаруы <div className={`w-4 h-4 rounded-full border-2 ${reason === 'reduction' ? 'border-indigo-500 bg-indigo-500' : 'border-gray-300'}`} /></button>
                  <button onClick={() => setReason('decline')} className={`text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all flex items-center justify-between ${reason === 'decline' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}>Кәсіпорынның экономикалық жағдайының нашарлауы <div className={`w-4 h-4 rounded-full border-2 ${reason === 'decline' ? 'border-indigo-500 bg-indigo-500' : 'border-gray-300'}`} /></button>
                </div>
              </div>
              <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 mt-8">
                <h3 className="text-sm font-medium text-indigo-800 mb-1">Берілетін өтемақы мөлшері:</h3>
                <p className="text-4xl font-bold text-indigo-600">{formatCurrency(calculateSeverance())}</p>
                <p className="text-sm text-indigo-700 mt-2 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" />{reason === 'decline' ? 'Орташа жалақы 2 ай көлемінде төленеді' : 'Орташа жалақы 1 ай көлемінде төленеді'}</p>
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  const navItems = [
    { id: 'tax', name: 'Жалақыдан салық', icon: Receipt, color: 'text-[#ff3b30]' },
    { id: 'alimony', name: 'Алимент', icon: Baby, color: 'text-[#ff2d55]' },
    { id: 'maternity', name: 'Декреттік төлем', icon: HeartPulse, color: 'text-[#ff2d55]' },
    { id: 'pdd', name: 'ПДД Айыппұл', icon: ShieldAlert, color: 'text-[#ff9500]' },
    { id: 'penalty', name: 'Өсімпұл', icon: Clock, color: 'text-[#ff3b30]' },
    { id: 'loan', name: 'Несие', icon: CreditCard, color: 'text-[#af52de]' },
    { id: 'carTax', name: 'Көлік салығы', icon: Car, color: 'text-[#0071e3]' },
    { id: 'mrp', name: 'АЕК (МРП)', icon: Calculator, color: 'text-[#ff9500]' },
    { id: 'duty', name: 'Мем. баж', icon: Scale, color: 'text-[#34c759]' },
    { id: 'severance', name: 'Жұм. өтемақы', icon: Briefcase, color: 'text-[#5856d6]' },
  ] as const;

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto h-full flex flex-col lg:flex-row gap-4 lg:gap-8 overflow-hidden">
      
      {/* Mobile Top Navigation */}
      <div className="lg:hidden shrink-0">
        <h1 className="text-[20px] font-bold text-[#1d1d1f] tracking-tight mb-3">Калькуляторлар</h1>
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide snap-x">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`snap-start shrink-0 flex items-center gap-2 px-3.5 py-[6px] rounded-full transition-all border text-[13px] font-medium ${
                  isActive 
                    ? 'bg-[#1d1d1f] border-[#1d1d1f] text-white' 
                    : 'bg-white border-black/[0.06] text-[#1d1d1f]/70 hover:bg-[#f5f5f7]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : item.color}`} />
                <span className="whitespace-nowrap">{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop Sidebar Navigation */}
      <div className="hidden lg:flex w-64 shrink-0 flex-col h-full overflow-hidden">
        <h1 className="text-[28px] font-bold text-[#1d1d1f] tracking-tight mb-5 shrink-0">Калькуляторлар</h1>
        <div className="space-y-0.5 overflow-y-auto pr-3 pb-10 scrollbar-hide">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-[7px] rounded-lg transition-all text-left text-[13px] ${
                  isActive ? 'bg-[#0071e3]/10 text-[#0071e3] font-semibold' : 'text-[#1d1d1f]/70 hover:bg-black/[0.03]'
                }`}
              >
                <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'text-[#0071e3]' : item.color}`} />
                <span className="flex-1">{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Calculator Main Area */}
      <div className="flex-1 max-w-3xl overflow-y-auto lg:pr-6 pb-20 scrollbar-hide h-full">
        {renderCalculator()}
      </div>
    </div>
  );
}
