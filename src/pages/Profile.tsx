import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { User, Globe, MapPin, Loader2, CheckCircle2 } from 'lucide-react';

export default function Profile() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  const [formData, setFormData] = useState({
    full_name: '',
    language: 'kk',
    region: ''
  });

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
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

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
      setMessage({ type: 'success', text: 'Сақталды.' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ type: 'error', text: 'Қате пайда болды.' });
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full bg-[#f5f5f7]">
        <div className="text-center">
          <h2 className="text-[20px] font-bold text-[#1d1d1f] mb-3">Кіріңіз</h2>
          <a href="/login" className="text-[14px] font-medium text-white bg-[#0071e3] px-5 py-2 rounded-full">Кіру</a>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="w-6 h-6 animate-spin text-[#86868b]" /></div>;
  }

  return (
    <div className="p-5 lg:p-8 max-w-[520px] mx-auto h-full overflow-y-auto">
      <h1 className="text-[28px] font-bold text-[#1d1d1f] tracking-tight mb-8">Баптаулар</h1>
      
      {/* Avatar / Info */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 bg-[#0071e3]/[0.08] rounded-full flex items-center justify-center">
          <User className="w-7 h-7 text-[#0071e3]" />
        </div>
        <div>
          <h2 className="text-[17px] font-semibold text-[#1d1d1f]">{formData.full_name || user.displayName || 'Пайдаланушы'}</h2>
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

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-[12px] font-semibold text-[#86868b] uppercase tracking-wider mb-2">Аты-жөні</label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            className="block w-full px-4 py-2.5 bg-white border border-black/[0.06] rounded-xl text-[14px] text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 focus:border-[#0071e3]/40 transition-all"
          />
        </div>

        {/* Language */}
        <div>
          <label className="block text-[12px] font-semibold text-[#86868b] uppercase tracking-wider mb-2">Интерфейс тілі</label>
          <div className="flex bg-[#f5f5f7] p-1 rounded-xl border border-black/[0.04]">
            <button 
              type="button"
              onClick={() => setFormData({...formData, language: 'kk'})} 
              className={`flex-1 py-2 text-[13px] font-medium rounded-lg transition-all ${formData.language === 'kk' ? 'bg-white shadow-sm text-[#1d1d1f]' : 'text-[#86868b]'}`}
            >
              Қазақша
            </button>
            <button 
              type="button"
              onClick={() => setFormData({...formData, language: 'ru'})} 
              className={`flex-1 py-2 text-[13px] font-medium rounded-lg transition-all ${formData.language === 'ru' ? 'bg-white shadow-sm text-[#1d1d1f]' : 'text-[#86868b]'}`}
            >
              Русский
            </button>
          </div>
        </div>

        {/* Region */}
        <div>
          <label className="block text-[12px] font-semibold text-[#86868b] uppercase tracking-wider mb-2">Аймақ</label>
          <input
            type="text"
            name="region"
            value={formData.region}
            onChange={handleChange}
            placeholder="Мысалы: Астана"
            className="block w-full px-4 py-2.5 bg-white border border-black/[0.06] rounded-xl text-[14px] text-[#1d1d1f] placeholder:text-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 transition-all"
          />
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-[#0071e3] text-white rounded-xl hover:bg-[#0077ED] disabled:opacity-50 transition-colors text-[14px] font-medium"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? 'Сақтау…' : 'Сақтау'}
          </button>
        </div>
      </form>
    </div>
  );
}
