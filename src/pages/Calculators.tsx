import { useState } from 'react';
import { 
  Calculator as CalcIcon, Baby, Scale, Briefcase, 
  ChevronRight, CheckCircle2, Calculator, Receipt,
  Clock, Car, ShieldAlert, CreditCard, HeartPulse
} from 'lucide-react';
import { useLangStore } from '../store/langStore';
import { t } from '../utils/i18n';

export default function Calculators() {
  const { lang } = useLangStore();
  const [activeTab, setActiveTab] = useState<'alimony' | 'duty' | 'severance' | 'mrp' | 'tax' | 'penalty' | 'maternity' | 'pdd' | 'carTax' | 'loan'>('tax');

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
    return new Intl.NumberFormat(lang === 'kk' ? 'kk-KZ' : 'ru-RU', { style: 'currency', currency: 'KZT', maximumFractionDigits: 0 }).format(Math.max(0, val));
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
          <div className="bg-white p-4 md:p-8 rounded-[24px] md:rounded-[32px] border border-black/[0.04] shadow-md animate-in fade-in slide-in-from-bottom-2 duration-300 overflow-hidden">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-black/[0.04]">
              <div className="w-12 h-12 bg-[#ff2d55]/[0.08] rounded-2xl flex items-center justify-center text-[#ff2d55]"><Baby className="w-6 h-6" /></div>
              <div>
                <h2 className="text-[20px] font-bold text-[#1d1d1f] tracking-tight">{lang === 'kk' ? 'Алимент есептегіш' : 'Калькулятор алиментов'}</h2>
                <p className="text-[13px] text-[#86868b] font-medium">{lang === 'kk' ? 'ҚР «Неке және отбасы» кодексі (139-бап)' : 'Кодекс РК «О браке и семье» (статья 139)'}</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-[12px] font-bold text-[#86868b] uppercase tracking-widest mb-2.5">{lang === 'kk' ? 'Таза айлық табыс' : 'Чистый месячный доход'}</label>
                <input type="number" value={income} onChange={(e) => setIncome(e.target.value)} placeholder="250000" className="w-full px-5 py-3.5 rounded-2xl bg-[#f5f5f7] border border-transparent focus:bg-white focus:border-[#ff2d55]/20 focus:ring-4 focus:ring-[#ff2d55]/5 outline-none transition-all text-[16px] font-medium" />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#86868b] uppercase tracking-widest mb-2.5">{lang === 'kk' ? 'Балалар саны' : 'Количество детей'}</label>
                <div className="flex bg-[#f5f5f7] p-1.5 rounded-2xl border border-black/[0.02]">
                  {[1, 2, 3].map((num) => (
                    <button key={num} onClick={() => setChildrenCount(num)} className={`flex-1 py-2.5 text-[14px] font-bold rounded-xl transition-all ${childrenCount === num ? 'bg-white shadow-md text-[#1d1d1f] scale-[1.02]' : 'text-[#86868b] hover:text-[#1d1d1f]'}`}>
                      {num === 3 ? '3+' : `${num} ${lang === 'kk' ? 'бала' : 'ребенка'}`}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-[#ff2d55]/[0.03] p-7 rounded-[28px] border border-[#ff2d55]/10 mt-8">
                <h3 className="text-[13px] font-bold text-[#ff2d55] uppercase tracking-widest mb-1.5">{lang === 'kk' ? 'Ай сайынғы алимент:' : 'Ежемесячные алименты:'}</h3>
                <p className="text-[36px] font-black text-[#1d1d1f] tracking-tighter">{formatCurrency(calculateAlimony())}</p>
              </div>
            </div>
          </div>
        );
      case 'tax':
        const taxRes = calculateTaxes();
        return (
          <div className="bg-white p-4 md:p-8 rounded-[24px] md:rounded-[32px] border border-black/[0.04] shadow-md animate-in fade-in slide-in-from-bottom-2 duration-300 overflow-hidden">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-black/[0.04]">
              <div className="w-12 h-12 bg-[#ff3b30]/[0.08] rounded-2xl flex items-center justify-center text-[#ff3b30]"><Receipt className="w-6 h-6" /></div>
              <div>
                <h2 className="text-[20px] font-bold text-[#1d1d1f] tracking-tight">{lang === 'kk' ? 'Жалақыдан салық' : 'Налоги с зарплаты'}</h2>
                <p className="text-[13px] text-[#86868b] font-medium">{lang === 'kk' ? '2024 жылғы мөлшерлеме бойынша' : 'По ставкам 2024 года'}</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-[12px] font-bold text-[#86868b] uppercase tracking-widest mb-2.5">{lang === 'kk' ? 'Есептелген жалақы (Gross)' : 'Начисленная зарплата (Gross)'}</label>
                <input type="number" value={grossSalary} onChange={(e) => setGrossSalary(e.target.value)} placeholder="300000" className="w-full px-5 py-3.5 rounded-2xl bg-[#f5f5f7] border border-transparent focus:bg-white focus:border-[#ff3b30]/20 focus:ring-4 focus:ring-[#ff3b30]/5 outline-none transition-all text-[16px] font-medium" />
              </div>
              <div className="space-y-3 pt-4">
                <div className="flex justify-between items-center p-4 bg-[#f5f5f7] rounded-xl">
                  <span className="text-[14px] font-bold text-[#86868b]">{lang === 'kk' ? 'Зейнетақы (ОПВ 10%):' : 'Пенсионка (ОПВ 10%):'}</span>
                  <span className="text-[16px] font-black text-[#1d1d1f]">{formatCurrency(taxRes.pension)}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-[#f5f5f7] rounded-xl">
                  <span className="text-[14px] font-bold text-[#86868b]">{lang === 'kk' ? 'Сақтандыру (ВОСМС 2%):' : 'Страховка (ВОСМС 2%):'}</span>
                  <span className="text-[16px] font-black text-[#1d1d1f]">{formatCurrency(taxRes.osms)}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-[#f5f5f7] rounded-xl">
                  <span className="text-[14px] font-bold text-[#86868b] text-[#ff3b30]">{lang === 'kk' ? 'Табыс салығы (ИПН):' : 'Подоходный налог (ИПН):'}</span>
                  <span className="text-[16px] font-black text-[#ff3b30]">{formatCurrency(taxRes.ipn)}</span>
                </div>
                <div className="bg-[#34c759]/[0.08] p-7 rounded-[28px] border border-[#34c759]/20 mt-4">
                   <h3 className="text-[13px] font-bold text-[#34c759] uppercase tracking-widest mb-1.5">{lang === 'kk' ? 'Қолға алатын сома (Net):' : 'На руки (Net):'}</h3>
                   <p className="text-[36px] font-black text-[#1d1d1f] tracking-tighter">{formatCurrency(taxRes.netSalary)}</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'mrp':
        return (
          <div className="bg-white p-4 md:p-8 rounded-[24px] md:rounded-[32px] border border-black/[0.04] shadow-md animate-in fade-in slide-in-from-bottom-2 duration-300 overflow-hidden">
             <div className="flex items-center gap-3 mb-6 pb-6 border-b border-black/[0.04]">
              <div className="w-12 h-12 bg-[#ff9500]/[0.08] rounded-2xl flex items-center justify-center text-[#ff9500]"><Calculator className="w-6 h-6" /></div>
              <div>
                <h2 className="text-[20px] font-bold text-[#1d1d1f] tracking-tight">{lang === 'kk' ? 'АЕК (МРП) есептегіш' : 'Калькулятор МРП'}</h2>
                <p className="text-[13px] text-[#86868b] font-medium">{lang === 'kk' ? 'Айлық есептік көрсеткіш' : 'Месячный расчетный показатель'}</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-[12px] font-bold text-[#86868b] uppercase tracking-widest mb-2.5">{lang === 'kk' ? 'АЕК саны' : 'Количество МРП'}</label>
                <input type="number" value={mrpCount} onChange={(e) => setMrpCount(e.target.value)} className="w-full px-5 py-3.5 rounded-2xl bg-[#f5f5f7] border border-transparent focus:bg-white focus:border-[#ff9500]/20 focus:ring-4 focus:ring-[#ff9500]/5 outline-none transition-all text-[16px] font-medium" />
              </div>
              <div className="flex gap-2">
                {(['2024', '2025', '2026'] as const).map(year => (
                  <button key={year} onClick={() => setMrpYear(year)} className={`flex-1 py-3 rounded-xl text-[14px] font-bold transition-all ${mrpYear === year ? 'bg-[#1d1d1f] text-white shadow-lg scale-[1.02]' : 'bg-[#f5f5f7] text-[#86868b]'}`}>
                    {year}
                  </button>
                ))}
              </div>
              <div className="bg-[#ff9500]/[0.03] p-7 rounded-[28px] border border-[#ff9500]/10">
                <h3 className="text-[13px] font-bold text-[#ff9500] uppercase tracking-widest mb-1.5">{lang === 'kk' ? 'Теңгемен сомасы:' : 'Сумма в тенге:'}</h3>
                <p className="text-[36px] font-black text-[#1d1d1f] tracking-tighter">{formatCurrency(calculateMrp())}</p>
                <p className="text-[12px] text-[#86868b] mt-2">1 АЕК = {formatCurrency(mrpRates[mrpYear])}</p>
              </div>
            </div>
          </div>
        );
      case 'duty':
        return (
          <div className="bg-white p-4 md:p-8 rounded-[24px] md:rounded-[32px] border border-black/[0.04] shadow-md animate-in fade-in slide-in-from-bottom-2 duration-300 overflow-hidden">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-black/[0.04]">
              <div className="w-12 h-12 bg-[#34c759]/[0.08] rounded-2xl flex items-center justify-center text-[#34c759]"><Scale className="w-6 h-6" /></div>
              <div>
                <h2 className="text-[20px] font-bold text-[#1d1d1f] tracking-tight">{lang === 'kk' ? 'Мемлекеттік баж' : 'Госпошлина'}</h2>
                <p className="text-[13px] text-[#86868b] font-medium">{lang === 'kk' ? 'Сотқа жүгіну кезінде' : 'При обращении в суд'}</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-[12px] font-bold text-[#86868b] uppercase tracking-widest mb-2.5">{lang === 'kk' ? 'Талап сомасы' : 'Сумма иска'}</label>
                <input type="number" value={claimAmount} onChange={(e) => setClaimAmount(e.target.value)} placeholder="1000000" className="w-full px-5 py-3.5 rounded-2xl bg-[#f5f5f7] border border-transparent focus:bg-white focus:border-[#34c759]/20 focus:ring-4 focus:ring-[#34c759]/5 outline-none transition-all text-[16px] font-medium" />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#86868b] uppercase tracking-widest mb-2.5">{lang === 'kk' ? 'Кім арыз береді?' : 'Кто подаёт иск?'}</label>
                <div className="flex bg-[#f5f5f7] p-1.5 rounded-2xl border border-black/[0.02]">
                  <button onClick={() => setEntityType('individual')} className={`flex-1 py-2.5 text-[14px] font-bold rounded-xl transition-all ${entityType === 'individual' ? 'bg-white shadow-md text-[#1d1d1f]' : 'text-[#86868b]'}`}>{lang === 'kk' ? 'Жеке тұлға (1%)' : 'Физ. лицо (1%)'}</button>
                  <button onClick={() => setEntityType('legal')} className={`flex-1 py-2.5 text-[14px] font-bold rounded-xl transition-all ${entityType === 'legal' ? 'bg-white shadow-md text-[#1d1d1f]' : 'text-[#86868b]'}`}>{lang === 'kk' ? 'Заңды тұлға (3%)' : 'Юр. лицо (3%)'}</button>
                </div>
              </div>
              <div className="bg-[#34c759]/[0.03] p-7 rounded-[28px] border border-[#34c759]/10 mt-8">
                <h3 className="text-[13px] font-bold text-[#34c759] uppercase tracking-widest mb-1.5">{lang === 'kk' ? 'Мемлекеттік баж:' : 'Госпошлина:'}</h3>
                <p className="text-[36px] font-black text-[#1d1d1f] tracking-tighter">{formatCurrency(calculateDuty())}</p>
              </div>
            </div>
          </div>
        );
      case 'severance':
        return (
          <div className="bg-white p-4 md:p-8 rounded-[24px] md:rounded-[32px] border border-black/[0.04] shadow-md animate-in fade-in slide-in-from-bottom-2 duration-300 overflow-hidden">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-black/[0.04]">
              <div className="w-12 h-12 bg-[#5856d6]/[0.08] rounded-2xl flex items-center justify-center text-[#5856d6]"><Briefcase className="w-6 h-6" /></div>
              <div>
                <h2 className="text-[20px] font-bold text-[#1d1d1f] tracking-tight">{lang === 'kk' ? 'Жұмыстан шығу өтемақысы' : 'Компенсация при увольнении'}</h2>
                <p className="text-[13px] text-[#86868b] font-medium">{lang === 'kk' ? 'ҚР Еңбек кодексі 131-бап' : 'Статья 131 ТК РК'}</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-[12px] font-bold text-[#86868b] uppercase tracking-widest mb-2.5">{lang === 'kk' ? 'Орташа айлық жалақы' : 'Средняя месячная зарплата'}</label>
                <input type="number" value={avgSalary} onChange={(e) => setAvgSalary(e.target.value)} placeholder="300000" className="w-full px-5 py-3.5 rounded-2xl bg-[#f5f5f7] border border-transparent focus:bg-white focus:border-[#5856d6]/20 focus:ring-4 focus:ring-[#5856d6]/5 outline-none transition-all text-[16px] font-medium" />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#86868b] uppercase tracking-widest mb-2.5">{lang === 'kk' ? 'Босату себебі' : 'Причина увольнения'}</label>
                <div className="flex flex-col gap-2">
                  {([{v: 'liquidation' as const, kk: 'Кәсіпорын таратылуы', ru: 'Ликвидация'}, {v: 'reduction' as const, kk: 'Штат қысқарту', ru: 'Сокращение штата'}, {v: 'decline' as const, kk: 'Жұмыс беруші бастамасы', ru: 'Инициатива работодателя'}]).map(r => (
                    <button key={r.v} onClick={() => setReason(r.v)} className={`py-3 px-4 rounded-xl text-[14px] font-bold text-left transition-all ${reason === r.v ? 'bg-[#5856d6] text-white shadow-lg' : 'bg-[#f5f5f7] text-[#86868b]'}`}>{lang === 'kk' ? r.kk : r.ru}</button>
                  ))}
                </div>
              </div>
              <div className="bg-[#5856d6]/[0.03] p-7 rounded-[28px] border border-[#5856d6]/10 mt-8">
                <h3 className="text-[13px] font-bold text-[#5856d6] uppercase tracking-widest mb-1.5">{lang === 'kk' ? 'Өтемақы сомасы:' : 'Сумма компенсации:'}</h3>
                <p className="text-[36px] font-black text-[#1d1d1f] tracking-tighter">{formatCurrency(calculateSeverance())}</p>
              </div>
            </div>
          </div>
        );
      case 'penalty':
        return (
          <div className="bg-white p-4 md:p-8 rounded-[24px] md:rounded-[32px] border border-black/[0.04] shadow-md animate-in fade-in slide-in-from-bottom-2 duration-300 overflow-hidden">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-black/[0.04]">
              <div className="w-12 h-12 bg-[#ff3b30]/[0.08] rounded-2xl flex items-center justify-center text-[#ff3b30]"><Clock className="w-6 h-6" /></div>
              <div>
                <h2 className="text-[20px] font-bold text-[#1d1d1f] tracking-tight">{lang === 'kk' ? 'Өсімпұл есептегіш' : 'Калькулятор пени'}</h2>
                <p className="text-[13px] text-[#86868b] font-medium">{lang === 'kk' ? 'Мерзімі өткен борыш бойынша' : 'По просроченной задолженности'}</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-[12px] font-bold text-[#86868b] uppercase tracking-widest mb-2.5">{lang === 'kk' ? 'Борыш сомасы' : 'Сумма долга'}</label>
                <input type="number" value={debtAmount} onChange={(e) => setDebtAmount(e.target.value)} placeholder="500000" className="w-full px-5 py-3.5 rounded-2xl bg-[#f5f5f7] border border-transparent focus:bg-white focus:border-[#ff3b30]/20 focus:ring-4 focus:ring-[#ff3b30]/5 outline-none transition-all text-[16px] font-medium" />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#86868b] uppercase tracking-widest mb-2.5">{lang === 'kk' ? 'Мерзімі өткен күн саны' : 'Дней просрочки'}</label>
                <input type="number" value={overdueDays} onChange={(e) => setOverdueDays(e.target.value)} placeholder="30" className="w-full px-5 py-3.5 rounded-2xl bg-[#f5f5f7] border border-transparent focus:bg-white focus:border-[#ff3b30]/20 focus:ring-4 focus:ring-[#ff3b30]/5 outline-none transition-all text-[16px] font-medium" />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#86868b] uppercase tracking-widest mb-2.5">{lang === 'kk' ? 'Базалық мөлшерлеме (%)' : 'Базовая ставка (%)'}</label>
                <input type="number" value={baseRate} onChange={(e) => setBaseRate(e.target.value)} className="w-full px-5 py-3.5 rounded-2xl bg-[#f5f5f7] border border-transparent focus:bg-white focus:border-[#ff3b30]/20 focus:ring-4 focus:ring-[#ff3b30]/5 outline-none transition-all text-[16px] font-medium" />
              </div>
              <div className="bg-[#ff3b30]/[0.03] p-7 rounded-[28px] border border-[#ff3b30]/10 mt-8">
                <h3 className="text-[13px] font-bold text-[#ff3b30] uppercase tracking-widest mb-1.5">{lang === 'kk' ? 'Өсімпұл сомасы:' : 'Сумма пени:'}</h3>
                <p className="text-[36px] font-black text-[#1d1d1f] tracking-tighter">{formatCurrency(calculatePenalty())}</p>
              </div>
            </div>
          </div>
        );
      case 'maternity': {
        const matRes = calculateMaternity();
        return (
          <div className="bg-white p-4 md:p-8 rounded-[24px] md:rounded-[32px] border border-black/[0.04] shadow-md animate-in fade-in slide-in-from-bottom-2 duration-300 overflow-hidden">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-black/[0.04]">
              <div className="w-12 h-12 bg-[#ff2d55]/[0.08] rounded-2xl flex items-center justify-center text-[#ff2d55]"><HeartPulse className="w-6 h-6" /></div>
              <div>
                <h2 className="text-[20px] font-bold text-[#1d1d1f] tracking-tight">{lang === 'kk' ? 'Декреттік төлем' : 'Декретные выплаты'}</h2>
                <p className="text-[13px] text-[#86868b] font-medium">{lang === 'kk' ? 'Жүктілік және бала күтімі бойынша' : 'По беременности и уходу за ребёнком'}</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-[12px] font-bold text-[#86868b] uppercase tracking-widest mb-2.5">{lang === 'kk' ? 'Орташа айлық жалақы' : 'Среднемесячная зарплата'}</label>
                <input type="number" value={maternitySalary} onChange={(e) => setMaternitySalary(e.target.value)} placeholder="300000" className="w-full px-5 py-3.5 rounded-2xl bg-[#f5f5f7] border border-transparent focus:bg-white focus:border-[#ff2d55]/20 focus:ring-4 focus:ring-[#ff2d55]/5 outline-none transition-all text-[16px] font-medium" />
              </div>
              <div className="space-y-3 pt-4">
                <div className="bg-[#ff2d55]/[0.03] p-7 rounded-[28px] border border-[#ff2d55]/10">
                  <h3 className="text-[13px] font-bold text-[#ff2d55] uppercase tracking-widest mb-1.5">{lang === 'kk' ? 'Бір жолғы төлем:' : 'Единовременная выплата:'}</h3>
                  <p className="text-[36px] font-black text-[#1d1d1f] tracking-tighter">{formatCurrency(matRes.oneTime)}</p>
                </div>
                <div className="bg-[#af52de]/[0.03] p-7 rounded-[28px] border border-[#af52de]/10">
                  <h3 className="text-[13px] font-bold text-[#af52de] uppercase tracking-widest mb-1.5">{lang === 'kk' ? 'Ай сайынғы (1 жасқа дейін):' : 'Ежемесячно (до 1 года):'}</h3>
                  <p className="text-[36px] font-black text-[#1d1d1f] tracking-tighter">{formatCurrency(matRes.monthly)}</p>
                </div>
              </div>
            </div>
          </div>
        );
      }
      case 'pdd':
        return (
          <div className="bg-white p-4 md:p-8 rounded-[24px] md:rounded-[32px] border border-black/[0.04] shadow-md animate-in fade-in slide-in-from-bottom-2 duration-300 overflow-hidden">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-black/[0.04]">
              <div className="w-12 h-12 bg-[#ff9500]/[0.08] rounded-2xl flex items-center justify-center text-[#ff9500]"><ShieldAlert className="w-6 h-6" /></div>
              <div>
                <h2 className="text-[20px] font-bold text-[#1d1d1f] tracking-tight">{lang === 'kk' ? 'Жол ережесі айыппұлы' : 'Штраф ПДД'}</h2>
                <p className="text-[13px] text-[#86868b] font-medium">{lang === 'kk' ? 'ҚР ӘҚБтК бойынша' : 'По КоАП РК'}</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-[12px] font-bold text-[#86868b] uppercase tracking-widest mb-2.5">{lang === 'kk' ? 'АЕК мөлшері (бұзушылық)' : 'Размер в МРП (нарушение)'}</label>
                <input type="number" value={pddViolation} onChange={(e) => setPddViolation(e.target.value)} placeholder="5" className="w-full px-5 py-3.5 rounded-2xl bg-[#f5f5f7] border border-transparent focus:bg-white focus:border-[#ff9500]/20 focus:ring-4 focus:ring-[#ff9500]/5 outline-none transition-all text-[16px] font-medium" />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#86868b] uppercase tracking-widest mb-2.5">{lang === 'kk' ? '7 күн ішінде төлейсіз бе?' : 'Оплатите в течение 7 дней?'}</label>
                <div className="flex bg-[#f5f5f7] p-1.5 rounded-2xl border border-black/[0.02]">
                  <button onClick={() => setPaidEarly(true)} className={`flex-1 py-2.5 text-[14px] font-bold rounded-xl transition-all ${paidEarly ? 'bg-white shadow-md text-[#34c759]' : 'text-[#86868b]'}`}>{lang === 'kk' ? 'Иә (−50%)' : 'Да (−50%)'}</button>
                  <button onClick={() => setPaidEarly(false)} className={`flex-1 py-2.5 text-[14px] font-bold rounded-xl transition-all ${!paidEarly ? 'bg-white shadow-md text-[#ff3b30]' : 'text-[#86868b]'}`}>{lang === 'kk' ? 'Жоқ (толық)' : 'Нет (полная)'}</button>
                </div>
              </div>
              <div className="bg-[#ff9500]/[0.03] p-7 rounded-[28px] border border-[#ff9500]/10 mt-8">
                <h3 className="text-[13px] font-bold text-[#ff9500] uppercase tracking-widest mb-1.5">{lang === 'kk' ? 'Айыппұл сомасы:' : 'Сумма штрафа:'}</h3>
                <p className="text-[36px] font-black text-[#1d1d1f] tracking-tighter">{formatCurrency(calculatePdd())}</p>
              </div>
            </div>
          </div>
        );
      case 'carTax':
        return (
          <div className="bg-white p-4 md:p-8 rounded-[24px] md:rounded-[32px] border border-black/[0.04] shadow-md animate-in fade-in slide-in-from-bottom-2 duration-300 overflow-hidden">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-black/[0.04]">
              <div className="w-12 h-12 bg-[#0071e3]/[0.08] rounded-2xl flex items-center justify-center text-[#0071e3]"><Car className="w-6 h-6" /></div>
              <div>
                <h2 className="text-[20px] font-bold text-[#1d1d1f] tracking-tight">{lang === 'kk' ? 'Көлік салығы' : 'Транспортный налог'}</h2>
                <p className="text-[13px] text-[#86868b] font-medium">{lang === 'kk' ? 'Жылдық көлік салығы (шамамен)' : 'Годовой транспортный налог (приблизительно)'}</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-[12px] font-bold text-[#86868b] uppercase tracking-widest mb-2.5">{lang === 'kk' ? 'Қозғалтқыш көлемі (АЕК)' : 'Объём двигателя (МРП)'}</label>
                <input type="number" value={engineVolume} onChange={(e) => setEngineVolume(e.target.value)} placeholder="3" className="w-full px-5 py-3.5 rounded-2xl bg-[#f5f5f7] border border-transparent focus:bg-white focus:border-[#0071e3]/20 focus:ring-4 focus:ring-[#0071e3]/5 outline-none transition-all text-[16px] font-medium" />
              </div>
              <div className="bg-[#0071e3]/[0.03] p-7 rounded-[28px] border border-[#0071e3]/10 mt-8">
                <h3 className="text-[13px] font-bold text-[#0071e3] uppercase tracking-widest mb-1.5">{lang === 'kk' ? 'Жылдық салық:' : 'Годовой налог:'}</h3>
                <p className="text-[36px] font-black text-[#1d1d1f] tracking-tighter">{formatCurrency(calculateCarTax())}</p>
              </div>
            </div>
          </div>
        );
      case 'loan': {
        const loanRes = calculateLoan();
        return (
          <div className="bg-white p-4 md:p-8 rounded-[24px] md:rounded-[32px] border border-black/[0.04] shadow-md animate-in fade-in slide-in-from-bottom-2 duration-300 overflow-hidden">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-black/[0.04]">
              <div className="w-12 h-12 bg-[#af52de]/[0.08] rounded-2xl flex items-center justify-center text-[#af52de]"><CreditCard className="w-6 h-6" /></div>
              <div>
                <h2 className="text-[20px] font-bold text-[#1d1d1f] tracking-tight">{lang === 'kk' ? 'Несие есептегіш' : 'Кредитный калькулятор'}</h2>
                <p className="text-[13px] text-[#86868b] font-medium">{lang === 'kk' ? 'Аннуитеттік төлем' : 'Аннуитетный платёж'}</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-[12px] font-bold text-[#86868b] uppercase tracking-widest mb-2.5">{lang === 'kk' ? 'Несие сомасы' : 'Сумма кредита'}</label>
                <input type="number" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} placeholder="5000000" className="w-full px-5 py-3.5 rounded-2xl bg-[#f5f5f7] border border-transparent focus:bg-white focus:border-[#af52de]/20 focus:ring-4 focus:ring-[#af52de]/5 outline-none transition-all text-[16px] font-medium" />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#86868b] uppercase tracking-widest mb-2.5">{lang === 'kk' ? 'Жылдық пайыз (%)' : 'Годовая ставка (%)'}</label>
                <input type="number" value={loanPercent} onChange={(e) => setLoanPercent(e.target.value)} className="w-full px-5 py-3.5 rounded-2xl bg-[#f5f5f7] border border-transparent focus:bg-white focus:border-[#af52de]/20 focus:ring-4 focus:ring-[#af52de]/5 outline-none transition-all text-[16px] font-medium" />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#86868b] uppercase tracking-widest mb-2.5">{lang === 'kk' ? 'Мерзімі (жыл)' : 'Срок (лет)'}</label>
                <input type="number" value={loanYears} onChange={(e) => setLoanYears(e.target.value)} className="w-full px-5 py-3.5 rounded-2xl bg-[#f5f5f7] border border-transparent focus:bg-white focus:border-[#af52de]/20 focus:ring-4 focus:ring-[#af52de]/5 outline-none transition-all text-[16px] font-medium" />
              </div>
              <div className="space-y-3 pt-4">
                <div className="flex justify-between items-center p-4 bg-[#f5f5f7] rounded-xl">
                  <span className="text-[14px] font-bold text-[#86868b]">{lang === 'kk' ? 'Ай сайынғы төлем:' : 'Ежемесячный платёж:'}</span>
                  <span className="text-[16px] font-black text-[#1d1d1f]">{formatCurrency(loanRes.monthly)}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-[#f5f5f7] rounded-xl">
                  <span className="text-[14px] font-bold text-[#86868b]">{lang === 'kk' ? 'Жалпы сома:' : 'Общая сумма:'}</span>
                  <span className="text-[16px] font-black text-[#1d1d1f]">{formatCurrency(loanRes.total)}</span>
                </div>
                <div className="bg-[#af52de]/[0.03] p-7 rounded-[28px] border border-[#af52de]/10">
                  <h3 className="text-[13px] font-bold text-[#af52de] uppercase tracking-widest mb-1.5">{lang === 'kk' ? 'Артық төлем:' : 'Переплата:'}</h3>
                  <p className="text-[36px] font-black text-[#1d1d1f] tracking-tighter">{formatCurrency(loanRes.overpay)}</p>
                </div>
              </div>
            </div>
          </div>
        );
      }
    }
  };

  const navItems = [
    { id: 'tax', name: t(lang, 'calculators', 'tax'), icon: Receipt, color: 'text-[#ff3b30]' },
    { id: 'alimony', name: t(lang, 'calculators', 'alimony'), icon: Baby, color: 'text-[#ff2d55]' },
    { id: 'maternity', name: t(lang, 'calculators', 'maternity'), icon: HeartPulse, color: 'text-[#ff2d55]' },
    { id: 'pdd', name: t(lang, 'calculators', 'pdd'), icon: ShieldAlert, color: 'text-[#ff9500]' },
    { id: 'penalty', name: t(lang, 'calculators', 'penalty'), icon: Clock, color: 'text-[#ff3b30]' },
    { id: 'loan', name: t(lang, 'calculators', 'loan'), icon: CreditCard, color: 'text-[#af52de]' },
    { id: 'carTax', name: t(lang, 'calculators', 'carTax'), icon: Car, color: 'text-[#0071e3]' },
    { id: 'mrp', name: t(lang, 'calculators', 'mrp'), icon: Calculator, color: 'text-[#ff9500]' },
    { id: 'duty', name: t(lang, 'calculators', 'duty'), icon: Scale, color: 'text-[#34c759]' },
    { id: 'severance', name: t(lang, 'calculators', 'severance'), icon: Briefcase, color: 'text-[#5856d6]' },
  ] as const;

  return (
    <div className="flex flex-col lg:flex-row h-full p-4 lg:p-8 gap-4 lg:gap-8 max-w-[1400px] mx-auto overflow-hidden w-full box-border">
      {/* Mobile Title */}
      <div className="lg:hidden shrink-0">
        <h1 className="text-[20px] font-bold text-[#1d1d1f] tracking-tight mb-3">{t(lang, 'calculators', 'title')}</h1>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl whitespace-nowrap transition-all active:scale-[0.97] border ${
                activeTab === item.id 
                  ? 'bg-[#1d1d1f] text-white border-transparent' 
                  : 'bg-white text-[#1d1d1f]/60 border-black/[0.04]'
              }`}
            >
              <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-white' : item.color}`} />
              <span className="text-[13px] font-bold">{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-64 shrink-0 flex-col h-full overflow-hidden">
        <h1 className="text-[28px] font-bold text-[#1d1d1f] tracking-tight mb-5 shrink-0">{t(lang, 'calculators', 'title')}</h1>
        <div className="space-y-1.5 overflow-y-auto no-scrollbar pr-2">
          {navItems.map((item) => (
             <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-5 py-4 rounded-[22px] transition-all group active:scale-[0.98] border ${
                  activeTab === item.id 
                    ? 'bg-[#1d1d1f] text-white border-transparent shadow-xl' 
                    : 'bg-transparent text-[#1d1d1f]/60 border-transparent hover:bg-black/[0.03]'
                }`}
             >
                <div className={`p-2 rounded-xl transition-all ${activeTab === item.id ? 'bg-white/10' : 'bg-black/[0.02] group-hover:bg-white shadow-sm'}`}>
                  <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : item.color}`} />
                </div>
                <span className="text-[14px] font-bold tracking-tight">{item.name}</span>
                {activeTab === item.id && <ChevronRight className="w-4 h-4 ml-auto text-white/50" />}
             </button>
          ))}
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 lg:max-w-xl mx-auto w-full lg:pt-12 overflow-y-auto overflow-x-hidden no-scrollbar pb-28 md:pb-32">
        {renderCalculator()}
        
        {/* Info Card */}
        <div className="mt-6 md:mt-8 bg-[#f5f5f7] p-5 md:p-7 rounded-[24px] md:rounded-[32px] border border-black/[0.02]">
           <div className="flex items-center gap-3 mb-3">
             <div className="p-2 bg-white rounded-xl shadow-sm"><CheckCircle2 className="w-5 h-5 text-[#34c759]" /></div>
             <h4 className="text-[14px] font-bold text-[#1d1d1f]">{lang === 'kk' ? 'Ескерту' : 'Примечание'}</h4>
           </div>
           <p className="text-[13px] text-[#86868b] leading-relaxed font-medium">
             {lang === 'kk' 
               ? 'Есептеулер ақпараттық сипатта болады. Нақты мөлшерлерді құзыретті органдар немесе заңгерлерден нақтылауды ұсынамыз.'
               : 'Расчеты носят информационный характер. Рекомендуем уточнять точные суммы в компетентных органах или у юристов.'}
           </p>
        </div>
      </div>
    </div>
  );
}
