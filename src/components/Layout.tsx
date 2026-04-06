import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { logOut } from '../firebase';
import { MessageSquare, BookOpen, Users, FileText, Calculator, AlertTriangle, LogOut, Menu, X, Settings, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useState } from 'react';

export default function Layout() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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
    { name: 'SOS', path: '/sos', icon: AlertTriangle, color: 'text-red-500' },
    { name: 'Баптаулар', path: '/profile', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar (Desktop) */}
      <aside 
        className={`hidden md:flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'w-0 overflow-hidden opacity-0 border-none' : 'w-64 opacity-100'
        }`}
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center whitespace-nowrap">
          <Link to="/" className="text-xl font-bold text-[#1A5276]">ЗаңКеңес AI</Link>
          <button 
            onClick={() => setIsSidebarCollapsed(true)} 
            className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-md transition-colors" 
            title="Бүйірлік тақтаны жабу"
          >
            <PanelLeftClose className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto whitespace-nowrap">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                location.pathname.startsWith(item.path)
                  ? 'bg-blue-50 text-[#2E86C1]'
                  : 'text-gray-700 hover:bg-gray-100'
              } ${item.color || ''}`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200 whitespace-nowrap">
          {user ? (
            <div className="flex items-center justify-between gap-2">
              <Link to="/profile" className="flex-1 min-w-0 hover:bg-gray-50 p-1.5 rounded-md transition-colors">
                <p className="font-medium text-gray-900 truncate">{user.displayName || 'Пайдаланушы'}</p>
                <p className="text-gray-500 truncate text-xs">{user.email}</p>
              </Link>
              <button onClick={handleLogout} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md flex-shrink-0" title="Шығу">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="block w-full py-2 text-center text-white bg-[#1A5276] rounded-md hover:bg-[#154360]">
              Кіру
            </Link>
          )}
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden flex flex-col w-full h-full">
        <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <Link to="/" className="text-xl font-bold text-[#1A5276]">ЗаңКеңес AI</Link>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-500">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-[61px] left-0 right-0 bottom-0 bg-white z-50 flex flex-col">
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md text-lg ${
                    location.pathname.startsWith(item.path)
                      ? 'bg-blue-50 text-[#2E86C1]'
                      : 'text-gray-700'
                  } ${item.color || ''}`}
                >
                  <item.icon className="w-6 h-6" />
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t border-gray-200">
              {user ? (
                <div className="space-y-3">
                  <div className="px-4 py-2 bg-gray-50 rounded-md">
                    <p className="font-medium text-gray-900 truncate">{user.displayName || 'Пайдаланушы'}</p>
                    <p className="text-gray-500 truncate text-sm">{user.email}</p>
                  </div>
                  <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="flex items-center justify-center gap-2 w-full py-3 text-red-600 bg-red-50 rounded-md">
                    <LogOut className="w-5 h-5" />
                    Шығу
                  </button>
                </div>
              ) : (
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block w-full py-3 text-center text-white bg-[#1A5276] rounded-md">
                  Кіру
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-hidden relative">
          <Outlet />
        </main>
      </div>

      {/* Desktop Main Content Area */}
      <main className="hidden md:flex flex-1 overflow-hidden relative flex-col">
        {isSidebarCollapsed && (
          <button 
            onClick={() => setIsSidebarCollapsed(false)} 
            className="absolute top-4 left-4 z-50 p-1.5 bg-white border border-gray-200 rounded-md shadow-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
            title="Бүйірлік тақтаны ашу"
          >
            <PanelLeftOpen className="w-5 h-5" />
          </button>
        )}
        <Outlet />
      </main>
    </div>
  );
}
