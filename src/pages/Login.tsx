import { useNavigate } from 'react-router-dom';
import { signInWithGoogle, signInWithEmail, registerWithEmail } from '../firebase';
import { Scale, Mail, Lock, User, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

type AuthMode = 'login' | 'register';

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await signInWithGoogle();
      if (user) {
        navigate('/chat');
      }
    } catch (err: any) {
      console.error("Login failed", err);
      setError(getErrorMessage(err.code));
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Барлық өрістерді толтырыңыз');
      return;
    }

    if (mode === 'register') {
      if (!fullName.trim()) {
        setError('Аты-жөніңізді жазыңыз');
        return;
      }
      if (password.length < 6) {
        setError('Құпия сөз кемінде 6 таңбадан тұруы тиіс');
        return;
      }
      if (password !== confirmPassword) {
        setError('Құпия сөздер сәйкес келмейді');
        return;
      }
    }

    setIsLoading(true);
    try {
      if (mode === 'register') {
        await registerWithEmail(email, password, fullName);
      } else {
        await signInWithEmail(email, password);
      }
      navigate('/chat');
    } catch (err: any) {
      console.error("Auth failed", err);
      if (err.code === 'auth/email-already-in-use') {
        setMode('login');
        setError('Бұл email-мен аккаунт бар. Құпия сөзіңізді жазып кіріңіз.');
      } else {
        setError(getErrorMessage(err.code));
      }
      setIsLoading(false);
    }
  };

  const getErrorMessage = (code: string): string => {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'Бұл email-мен тіркелген аккаунт бар';
      case 'auth/invalid-email':
        return 'Email мекенжайы дұрыс емес';
      case 'auth/user-not-found':
        return 'Мұндай email-мен аккаунт табылмады';
      case 'auth/wrong-password':
        return 'Құпия сөз қате';
      case 'auth/invalid-credential':
        return 'Email немесе құпия сөз қате';
      case 'auth/weak-password':
        return 'Құпия сөз тым қарапайым';
      case 'auth/too-many-requests':
        return 'Тым көп сұраныс. Кейінірек қайталаңыз';
      case 'auth/popup-blocked':
        return 'Popup терезесі блокталды';
      default:
        return 'Қателік орын алды. Қайталап көріңіз';
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError(null);
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col justify-center py-12 px-6">
      <div className="mx-auto w-full max-w-[380px]">
        {/* Back to landing */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-[13px] text-[#0071e3] font-medium mb-6 hover:opacity-70 transition-opacity"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Басты бетке
        </button>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#1d1d1f] rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Scale className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-[28px] font-bold text-[#1d1d1f] tracking-tight leading-tight">
            {mode === 'login' ? 'Жүйеге кіру' : 'Тіркелу'}
          </h1>
          <p className="text-[15px] text-[#86868b] mt-2">
            {mode === 'login' 
              ? 'Құқықтық көмек алу үшін кіріңіз' 
              : 'ЗаңКеңес AI-ға тіркеліңіз'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-black/[0.06] p-6 space-y-4">
          {/* Google Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex justify-center items-center gap-2.5 py-3 px-4 bg-[#f5f5f7] hover:bg-[#e8e8ed] border border-black/[0.06] rounded-xl text-[14px] font-medium text-[#1d1d1f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <svg className="animate-spin h-4 w-4 text-[#86868b]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <img className="h-4 w-4" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
            )}
            Google арқылы {mode === 'login' ? 'кіру' : 'тіркелу'}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-black/[0.06]"></div>
            <span className="text-[12px] text-[#86868b] font-medium">немесе</span>
            <div className="flex-1 h-px bg-black/[0.06]"></div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-3">
            {mode === 'register' && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b]" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Аты-жөні"
                  className="w-full pl-10 pr-4 py-3 bg-[#f5f5f7] border border-black/[0.06] rounded-xl text-[14px] text-[#1d1d1f] placeholder:text-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 transition-all"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email мекенжайы"
                className="w-full pl-10 pr-4 py-3 bg-[#f5f5f7] border border-black/[0.06] rounded-xl text-[14px] text-[#1d1d1f] placeholder:text-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 transition-all"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Құпия сөз"
                className="w-full pl-10 pr-10 py-3 bg-[#f5f5f7] border border-black/[0.06] rounded-xl text-[14px] text-[#1d1d1f] placeholder:text-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-[#1d1d1f] transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {mode === 'register' && (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Құпия сөзді растау"
                  className="w-full pl-10 pr-4 py-3 bg-[#f5f5f7] border border-black/[0.06] rounded-xl text-[14px] text-[#1d1d1f] placeholder:text-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 transition-all"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#0071e3] hover:bg-[#0077ED] text-white rounded-xl text-[14px] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading 
                ? (mode === 'login' ? 'Кіру...' : 'Тіркелу...') 
                : (mode === 'login' ? 'Кіру' : 'Тіркелу')}
            </button>
          </form>

          {/* Error */}
          {error && (
            <div className="p-3 bg-[#ff3b30]/[0.06] border border-[#ff3b30]/10 rounded-xl">
              <p className="text-[13px] text-[#ff3b30]">{error}</p>
            </div>
          )}
        </div>

        {/* Switch mode */}
        <div className="mt-5 text-center">
          <p className="text-[13px] text-[#86868b]">
            {mode === 'login' ? 'Аккаунтыңыз жоқ па?' : 'Аккаунтыңыз бар ма?'}{' '}
            <button 
              onClick={switchMode} 
              className="text-[#0071e3] font-semibold hover:underline"
            >
              {mode === 'login' ? 'Тіркелу' : 'Кіру'}
            </button>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center">
          <p className="text-[11px] text-[#86868b] leading-relaxed">
            Деректеріңіз шифрланған және қорғалған.
            <br />Жалғастыра отырып, құпиялылық саясатын қабылдайсыз.
          </p>
        </div>
      </div>
    </div>
  );
}
