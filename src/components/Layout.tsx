import { Outlet, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { logOut } from '../firebase';
import { MessageSquare, BookOpen, Users, FileText, Calculator, AlertTriangle, LogOut, Menu, X, Settings, PanelLeftClose, PanelLeftOpen, Scale, Loader2, Globe } from 'lucide-react';
import { useState } from 'react';
import { useLangStore } from '../store/langStore';
import { t } from '../utils/i18n';

export default function Layout() {
  const { user, loading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { lang, setLang } = useLangStore();

  // Show loading while auth state initializes
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f5f5f7]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#0071e3] mx-auto mb-3" />
          <p className="text-[14px] text-[#86868b]">{t(lang, 'nav', 'loading')}</p>
        </div>
      </div>
    );
  }

  // Redirect unauthenticated users to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const handleLogout = async () => {
    await logOut();
    navigate('/');
  };

  const navItems = [
    { name: t(lang, 'nav', 'chat'), path: '/chat', icon: MessageSquare },
    { name: t(lang, 'nav', 'laws'), path: '/laws', icon: BookOpen },
    { name: t(lang, 'nav', 'lawyers'), path: '/lawyers', icon: Users },
    { name: t(lang, 'nav', 'templates'), path: '/templates', icon: FileText },
    { name: t(lang, 'nav', 'calculators'), path: '/calculators', icon: Calculator },
    { name: t(lang, 'nav', 'sos'), path: '/sos', icon: AlertTriangle, color: 'text-[#ff3b30]' },
    { name: t(lang, 'nav', 'settings'), path: '/profile', icon: Settings },
  ];

  return (
    <div className="flex flex-col h-screen bg-[#f5f5f7] overflow-hidden">
      {/* Universal Header - Redesigned for Premium Look */}
      <header className="flex items-center justify-between px-4 md:px-8 py-3 md:py-4 bg-white/40 backdrop-blur-2xl border-b border-black/[0.03] z-[100] sticky top-0">
        <Link to="/" className="flex items-center gap-2 md:gap-3 group">
          <div className="w-7 h-7 md:w-9 md:h-9 bg-[#1d1d1f] rounded-[10px] flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-black/10">
            <Scale className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
          <span className="text-[15px] md:text-[18px] font-bold text-[#1d1d1f] tracking-tight whitespace-nowrap">
            ЗаңКеңес<span className="text-[#0071e3]">AI</span>
          </span>
        </Link>

        <div className="flex items-center gap-2 md:gap-5">
          {/* Language Switcher - Compact on Mobile */}
          <button
            onClick={() => setLang(lang === 'kk' ? 'ru' : 'kk')}
            className="flex items-center gap-1.5 px-2.5 md:px-4 py-1.5 md:py-2 text-[12px] md:text-[13px] font-semibold text-[#1d1d1f]/80 bg-black/[0.04] hover:bg-black/[0.08] rounded-full transition-all active:scale-95"
          >
            <Globe className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#0071e3]" />
            <span>{lang === 'kk' ? 'ҚАЗ' : 'РУС'}</span>
          </button>
          
          {user && (
            <div className="flex items-center gap-2 md:gap-4 pl-2 md:pl-5 border-l border-black/[0.06]">
              <Link to="/profile" className="flex items-center gap-2 group">
                <div className="hidden sm:block text-right">
                  <p className="text-[12px] md:text-[13px] font-bold text-[#1d1d1f] leading-none mb-1 group-hover:text-[#0071e3] transition-colors">{user.displayName || t(lang, 'common', 'user')}</p>
                  <p className="text-[10px] md:text-[11px] text-[#86868b] leading-none">{user.email}</p>
                </div>
                <div className="w-7 h-7 md:w-8 md:h-8 bg-black/[0.03] rounded-full border border-black/[0.05] flex items-center justify-center group-hover:bg-[#0071e3]/10 transition-colors">
                  <Settings className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#86868b] group-hover:text-[#0071e3]" />
                </div>
              </Link>
              
              <button 
                onClick={handleLogout} 
                className="p-1.5 md:p-2 text-[#86868b] hover:text-[#ff3b30] hover:bg-[#ff3b30]/10 rounded-full transition-all active:scale-90"
                title={t(lang, 'nav', 'logout')}
              >
                <LogOut className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-hidden relative flex-col flex">
        <Outlet />
      </main>

      <div className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2 z-[100]">
        <nav className="flex items-center gap-1.5 p-1.5 bg-black/90 backdrop-blur-3xl rounded-[28px] border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center gap-2.5 px-5 py-3 rounded-[22px] transition-all duration-300 group ${
                  isActive 
                    ? 'bg-white/15 text-white' 
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className={`w-[18px] h-[18px] transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
                <span className="text-[14px] font-semibold tracking-tight whitespace-nowrap">
                  {item.name}
                </span>
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-1 bg-[#0071e3] rounded-full shadow-[0_0_12px_rgba(0,113,227,1)]" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile Navigation (Pill style too) */}
      <div className="md:hidden absolute bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-[400px]">
        <nav className="flex items-center justify-around p-2 bg-black/90 backdrop-blur-2xl rounded-full border border-white/10 shadow-2xl">
          {navItems.slice(0, 5).map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`p-3 rounded-full transition-all duration-300 ${
                  isActive ? 'bg-white/20 text-white' : 'text-white/40'
                }`}
              >
                <item.icon className="w-6 h-6" />
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
