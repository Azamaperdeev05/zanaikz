import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { User, Globe, MapPin, Loader2, CheckCircle2, PieChart, TrendingUp, Search, ChevronDown, X } from 'lucide-react';
import { useLangStore } from '../store/langStore';
import { t } from '../utils/i18n';

export default function Profile() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);
  
  const { lang, setLang } = useLangStore();
  
  const [formData, setFormData] = useState({
    full_name: '',
    language: lang,
    region: ''
  });

  const [analytics, setAnalytics] = useState<{ topic: string, count: number }[]>([]);
  const [analyzing, setAnalyzing] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            full_name: data.full_name || user.displayName || '',
            language: data.language || 'kk',
            region: data.region || ''
          });
        }
        
        // Fetch sessions for analytics
        const q = query(collection(db, 'sessions'), where('userId', '==', user.uid));
        const sessionsSnap = await getDocs(q);
        
        const topicsCount: Record<string, number> = {};
        let total = 0;
        
        sessionsSnap.forEach(snap => {
          const title = snap.data().title?.toLowerCase() || '';
          if (title === 'жаңа чат' || title === 'новый чат') return;
          
          let matched = false;
          // Simple keyword matching
          const keywords = [
            { k: ['алимент', 'бала', 'неке', 'ажырасу'], t: lang === 'kk' ? 'Отбасы құқығы' : 'Семейное право' },
            { k: ['салық', 'көлік', 'айыппұл'], t: lang === 'kk' ? 'Салық және Айыппұл' : 'Налоги и Штрафы' },
            { k: ['еңбек', 'демалыс', 'жұмыс', 'өтемақы', 'декрет'], t: lang === 'kk' ? 'Еңбек қатынастары' : 'Трудовые отношения' },
            { k: ['несие', 'қарыз', 'банк', 'мүлік'], t: lang === 'kk' ? 'Мүлік және Қаржы' : 'Имущество и Финансы' }
          ];
          
          for (const grp of keywords) {
            if (grp.k.some(kw => title.includes(kw))) {
              topicsCount[grp.t] = (topicsCount[grp.t] || 0) + 1;
              matched = true;
              total++;
              break;
            }
          }
          
          if (!matched && title.length > 0) {
            const otherTopic = lang === 'kk' ? 'Басқа сұрақтар' : 'Другие вопросы';
            topicsCount[otherTopic] = (topicsCount[otherTopic] || 0) + 1;
            total++;
          }
        });
        
        const sortedTopics = Object.entries(topicsCount)
          .map(([topic, count]) => ({ topic, count: Math.round((count / total) * 100) }))
          .sort((a, b) => b.count - a.count);
          
        setAnalytics(sortedTopics);

      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
        setAnalyzing(false);
      }
    };
    fetchProfile();
  }, [user, lang]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setMessage(null);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        full_name: formData.full_name,
        language: formData.language,
        region: formData.region
      });
      setMessage({ type: 'success', text: t(lang, 'profile', 'save') + ' ✅' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ type: 'error', text: lang === 'kk' ? 'Қате орын алды' : 'Произошла ошибка' });
    } finally {
      setSaving(false);
    }
  };

  const handleLanguageChange = (newLang: 'kk' | 'ru') => {
    setFormData({...formData, language: newLang});
    setLang(newLang); // Update global state immediately
  };

  const REGIONS = [
    "Астана қаласы", "Алматы қаласы", "Шымкент қаласы",
    "Абай облысы", "Ақмола облысы", "Ақтөбе облысы",
    "Алматы облысы", "Атырау облысы", "Батыс Қазақстан облысы",
    "Жамбыл облысы", "Жетісу облысы", "Қарағанды облысы",
    "Қостанай облысы", "Қызылорда облысы", "Маңғыстау облысы",
    "Павлодар облысы", "Солтүстік Қазақстан облысы", "Түркістан облысы",
    "Ұлытау облысы", "Шығыс Қазақстан облысы"
  ];

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full bg-[#f5f5f7]">
        <div className="text-center">
          <h2 className="text-[20px] font-bold text-[#1d1d1f] mb-3">{lang === 'kk' ? 'Кіріңіз' : 'Войдите'}</h2>
          <Link to="/login" className="text-[14px] font-medium text-white bg-[#0071e3] px-5 py-2 rounded-full inline-block">{t(lang, 'nav', 'login')}</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="w-6 h-6 animate-spin text-[#86868b]" /></div>;
  }

  return (
    <div className="p-5 lg:p-8 max-w-[520px] mx-auto h-full overflow-y-auto w-full">
      <h1 className="text-[28px] font-bold text-[#1d1d1f] tracking-tight mb-8">{t(lang, 'profile', 'title')}</h1>
      
      {/* Avatar / Info */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 bg-[#0071e3]/[0.08] rounded-full flex items-center justify-center">
          <User className="w-7 h-7 text-[#0071e3]" />
        </div>
        <div>
          <h2 className="text-[17px] font-semibold text-[#1d1d1f]">{formData.full_name || user.displayName || t(lang, 'common', 'user')}</h2>
          <p className="text-[13px] text-[#86868b]">{user.email}</p>
        </div>
      </div>
      
      {message && (
        <div className={`p-3.5 mb-6 rounded-xl flex items-center gap-2 text-[13px] font-medium ${
          message.type === 'success' ? 'bg-[#34c759]/[0.08] text-[#34c759] border border-[#34c759]/10' : 'bg-[#ff3b30]/[0.06] text-[#ff3b30] border border-[#ff3b30]/10'
        }`}>
          {message.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 mb-10">
        {/* Name */}
        <div>
          <label className="block text-[12px] font-semibold text-[#86868b] uppercase tracking-wider mb-2">{t(lang, 'profile', 'fullName')}</label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            className="block w-full px-4 py-3 bg-[#f5f5f7] border border-transparent rounded-[16px] text-[15px] text-[#1d1d1f] focus:outline-none focus:ring-4 focus:ring-[#0071e3]/10 focus:bg-white focus:border-[#0071e3]/20 transition-all font-medium"
          />
        </div>

        {/* Language */}
        <div>
          <label className="block text-[12px] font-semibold text-[#86868b] uppercase tracking-wider mb-2">{lang === 'kk' ? 'Интерфейс тілі' : 'Язык интерфейса'}</label>
          <div className="flex bg-[#f5f5f7] p-1.5 rounded-[16px] border border-black/[0.03]">
            <button 
              type="button"
              onClick={() => handleLanguageChange('kk')} 
              className={`flex-1 py-2.5 text-[14px] font-bold rounded-[12px] transition-all duration-200 ${lang === 'kk' ? 'bg-white shadow-md text-[#0071e3] scale-[1.02]' : 'text-[#86868b] hover:text-[#1d1d1f]'}`}
            >
              Қазақша
            </button>
            <button 
              type="button"
              onClick={() => handleLanguageChange('ru')} 
              className={`flex-1 py-2.5 text-[14px] font-bold rounded-[12px] transition-all duration-200 ${lang === 'ru' ? 'bg-white shadow-md text-[#0071e3] scale-[1.02]' : 'text-[#86868b] hover:text-[#1d1d1f]'}`}
            >
              Русский
            </button>
          </div>
        </div>

        {/* Region */}
        <div>
          <label className="block text-[12px] font-semibold text-[#86868b] uppercase tracking-wider mb-2">{lang === 'kk' ? 'Аймақ' : 'Регион'}</label>
          <button
            type="button"
            onClick={() => setIsRegionModalOpen(true)}
            className="flex items-center justify-between w-full px-4 py-3 bg-[#f5f5f7] border border-transparent rounded-[16px] text-[15px] text-[#1d1d1f] hover:bg-black/[0.04] transition-all font-medium text-left"
          >
            <span className={formData.region ? "text-[#1d1d1f]" : "text-[#86868b]"}>
              {formData.region || (lang === 'kk' ? 'Аймақты таңдаңыз' : 'Выберите регион')}
            </span>
            <ChevronDown className="w-5 h-5 text-[#86868b]" />
          </button>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#0071e3] text-white rounded-[16px] hover:bg-[#0077ED] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all text-[15px] font-bold shadow-lg shadow-[#0071e3]/20"
          >
            {saving && <Loader2 className="w-5 h-5 animate-spin" />}
            {saving ? (lang === 'kk' ? 'Сақталуда…' : 'Сохранение…') : t(lang, 'profile', 'save')}
          </button>
        </div>
      </form>

      {/* Analytics Section */}
      <div className="border-t border-black/[0.04] pt-8 pb-32">
        <div className="flex items-center gap-2 mb-2">
          <PieChart className="w-5 h-5 text-[#0071e3]" />
          <h2 className="text-[18px] font-semibold text-[#1d1d1f]">{t(lang, 'profile', 'historyTitle')}</h2>
        </div>
        <p className="text-[13px] text-[#86868b] mb-6 font-medium">{t(lang, 'profile', 'historyDesc')}</p>

        {analyzing ? (
          <div className="flex justify-center py-6">
            <Loader2 className="w-5 h-5 animate-spin text-[#86868b]" />
          </div>
        ) : analytics.length > 0 ? (
          <div className="space-y-5">
            {analytics.map((item, idx) => (
              <div key={idx} className="group">
                <div className="flex justify-between text-[13px] mb-2">
                  <span className="font-bold text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors">{item.topic}</span>
                  <span className="text-[#0071e3] font-black">{item.count}%</span>
                </div>
                <div className="h-3 w-full bg-[#f5f5f7] rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-[#0071e3] to-[#5ac8fa] rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${item.count}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-[#f5f5f7] rounded-[24px] border border-black/[0.02]">
            <Search className="w-10 h-10 text-[#86868b]/30 mx-auto mb-3" />
            <p className="text-[14px] text-[#86868b] font-medium">{t(lang, 'profile', 'noHistory')}</p>
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
                  Қазақстанның 20 өңірі
                </p>
              </div>
              <button
                onClick={() => setIsRegionModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#86868b] rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 md:p-6 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {REGIONS.map((region) => (
                  <button
                    key={region}
                    onClick={() => {
                      setFormData({ ...formData, region });
                      setIsRegionModalOpen(false);
                    }}
                    className={`flex items-center gap-3 p-4 rounded-xl text-left transition-all active:scale-[0.98] ${
                      formData.region === region
                        ? 'bg-[#0071e3] text-white shadow-md'
                        : 'bg-white hover:bg-[#0071e3]/5 border border-black/[0.04] hover:border-[#0071e3]/30 text-[#1d1d1f]'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      formData.region === region ? 'bg-white/20' : 'bg-[#f5f5f7]'
                    }`}>
                      <MapPin className={`w-4 h-4 ${formData.region === region ? 'text-white' : 'text-[#86868b]'}`} />
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
