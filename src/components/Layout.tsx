import { Outlet, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { logOut } from '../firebase';
import { MessageSquare, BookOpen, Users, FileText, Calculator, AlertTriangle, LogOut, Menu, X, Settings, PanelLeftClose, PanelLeftOpen, Scale, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function Layout() {
  const { user, loading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Show loading while auth state initializes
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f5f5f7]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#0071e3] mx-auto mb-3" />
          <p className="text-[14px] text-[#86868b]">Жүктелуде...</p>
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
    { name: 'Чат', path: '/chat', icon: MessageSquare },
    { name: 'Заңнамалар', path: '/laws', icon: BookOpen },
    { name: 'Заңгерлер', path: '/lawyers', icon: Users },
    { name: 'Құжат үлгілері', path: '/templates', icon: FileText },
    { name: 'Калькуляторлар', path: '/calculators', icon: Calculator },
    { name: 'SOS', path: '/sos', icon: AlertTriangle, color: 'text-[#ff3b30]' },
    { name: 'Баптаулар', path: '/profile', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#f5f5f7]">
      {/* Sidebar (Desktop) */}
      <aside 
        className={`hidden md:flex flex-col bg-white/80 backdrop-blur-xl border-r border-black/[0.06] transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'w-0 overflow-hidden opacity-0 border-none' : 'w-[240px] opacity-100'
        }`}
      >
        <div className="p-4 border-b border-black/[0.04] flex justify-between items-center whitespace-nowrap">
          <Link to="/" className="flex items-center gap-2">
            <Scale className="w-4.5 h-4.5 text-[#1d1d1f]" />
            <span className="text-[15px] font-semibold text-[#1d1d1f] tracking-tight">ЗаңКеңес AI</span>
          </Link>
          <button 
            onClick={() => setIsSidebarCollapsed(true)} 
            className="p-1.5 text-[#86868b] hover:text-[#1d1d1f] hover:bg-black/[0.04] rounded-lg transition-colors" 
            title="Жабу"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto whitespace-nowrap">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2.5 px-3 py-[7px] rounded-lg transition-all text-[13px] ${
                location.pathname.startsWith(item.path)
                  ? 'bg-[#0071e3]/10 text-[#0071e3] font-semibold'
                  : `text-[#1d1d1f]/70 hover:bg-black/[0.04] ${item.color || ''}`
              }`}
            >
              <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-black/[0.04] whitespace-nowrap">
          {user ? (
            <div className="flex items-center justify-between gap-2">
              <Link to="/profile" className="flex-1 min-w-0 hover:bg-black/[0.03] p-2 rounded-lg transition-colors">
                <p className="font-medium text-[13px] text-[#1d1d1f] truncate">{user.displayName || 'Пайдаланушы'}</p>
                <p className="text-[#86868b] truncate text-[11px]">{user.email}</p>
              </Link>
              <button onClick={handleLogout} className="p-2 text-[#86868b] hover:text-[#ff3b30] hover:bg-[#ff3b30]/10 rounded-lg flex-shrink-0 transition-colors" title="Шығу">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="block w-full py-2 text-center text-white bg-[#0071e3] rounded-lg hover:bg-[#0077ED] text-[13px] font-medium transition-colors">
              Кіру
            </Link>
          )}
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden flex flex-col w-full h-full">
        <header className="flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-xl border-b border-black/[0.06]">
          <Link to="/" className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#1d1d1f]" />
            <span className="text-[15px] font-semibold text-[#1d1d1f] tracking-tight">ЗаңКеңес AI</span>
          </Link>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-1.5 text-[#86868b]">
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        {isMobileMenuOpen && (
          <div className="absolute top-[49px] left-0 right-0 bottom-0 bg-white/95 backdrop-blur-xl z-50 flex flex-col">
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] ${
                    location.pathname.startsWith(item.path)
                      ? 'bg-[#0071e3]/10 text-[#0071e3] font-semibold'
                      : `text-[#1d1d1f]/70 ${item.color || ''}`
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t border-black/[0.04]">
              {user ? (
                <div className="space-y-3">
                  <div className="px-4 py-2.5 bg-[#f5f5f7] rounded-xl">
                    <p className="font-medium text-[#1d1d1f] text-[14px] truncate">{user.displayName || 'Пайдаланушы'}</p>
                    <p className="text-[#86868b] truncate text-[12px]">{user.email}</p>
                  </div>
                  <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="flex items-center justify-center gap-2 w-full py-3 text-[#ff3b30] bg-[#ff3b30]/[0.06] rounded-xl text-[14px] font-medium">
                    <LogOut className="w-4 h-4" />
                    Шығу
                  </button>
                </div>
              ) : (
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block w-full py-3 text-center text-white bg-[#0071e3] rounded-xl text-[14px] font-medium">
                  Кіру
                </Link>
              )}
            </div>
          </div>
        )}

        <main className="flex-1 overflow-hidden relative">
          <Outlet />
        </main>
      </div>

      {/* Desktop Main Content Area */}
      <main className="hidden md:flex flex-1 overflow-hidden relative flex-col">
        {isSidebarCollapsed && (
          <button 
            onClick={() => setIsSidebarCollapsed(false)} 
            className="absolute top-3 left-3 z-50 p-1.5 bg-white/80 backdrop-blur-xl border border-black/[0.06] rounded-lg text-[#86868b] hover:text-[#1d1d1f] hover:bg-white transition-colors"
            title="Ашу"
          >
            <PanelLeftOpen className="w-4 h-4" />
          </button>
        )}
        <Outlet />
      </main>
    </div>
  );
}
