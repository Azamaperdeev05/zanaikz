import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { User, Globe, MapPin, Save, Loader2, CheckCircle2 } from 'lucide-react';

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
      setMessage({ type: 'success', text: 'Профиль сәтті сақталды!' });
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ type: 'error', text: 'Сақтау кезінде қате пайда болды.' });
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Профильді көру үшін жүйеге кіріңіз</h2>
          <a href="/login" className="px-6 py-2 bg-[#1A5276] text-white rounded-md hover:bg-[#154360]">Кіру</a>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="w-8 h-8 animate-spin text-[#2E86C1]" /></div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto h-full overflow-y-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Жеке профиль</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-[#1A5276]">
              <User className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{formData.full_name || user.displayName || 'Пайдаланушы'}</h2>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>
          
          {message && (
            <div className={`p-4 mb-6 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
              {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : null}
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Толық аты-жөні</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-[#2E86C1] focus:border-[#2E86C1]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Интерфейс тілі</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-[#2E86C1] focus:border-[#2E86C1]"
                >
                  <option value="kk">Қазақша</option>
                  <option value="ru">Русский</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Аймақ / Қала</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  placeholder="Мысалы: Астана қ."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-[#2E86C1] focus:border-[#2E86C1]"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-[#1A5276] text-white rounded-md hover:bg-[#154360] disabled:opacity-50 transition-colors"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Сақтау
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
