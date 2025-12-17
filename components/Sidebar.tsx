import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Ticket, MessageSquareWarning, ShieldCheck, LogOut, Users, Bell } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [customLogo, setCustomLogo] = useState<string | null>(localStorage.getItem('customLogo'));

  useEffect(() => {
    // Listen for custom logo changes from Settings page
    const handleLogoChange = () => {
      setCustomLogo(localStorage.getItem('customLogo'));
    };
    
    window.addEventListener('logoChange', handleLogoChange);
    return () => window.removeEventListener('logoChange', handleLogoChange);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  // Mock notification count
  const notificationCount = 3;

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/tickets', label: 'Tickets & Tarefas', icon: Ticket },
    { path: '/advisor', label: 'Consultor de Protocolo', icon: ShieldCheck },
    { path: '/knowledge', label: 'Base de Conhecimento (N0)', icon: MessageSquareWarning },
  ];

  const configItems = [
    { path: '/notifications', label: 'Notificações', icon: Bell, badge: notificationCount },
    { path: '/settings', label: 'Adm & Equipe', icon: Users },
  ];

  return (
    <div className="w-64 h-screen bg-brand-900 text-white flex flex-col fixed left-0 top-0 shadow-xl z-50">
      <div className="p-6 border-b border-brand-800 flex flex-col gap-2">
        {/* Dynamic Logo Rendering */}
        <div className="w-48 self-start -ml-2 h-16 flex items-center">
          {customLogo ? (
             <img src={customLogo} alt="Logo Empresa" className="max-w-full max-h-full object-contain" />
          ) : (
             <Logo className="w-full h-auto" />
          )}
        </div>
        <p className="text-xs text-brand-200 opacity-70 pl-1 mt-1">Área do Agente</p>
      </div>

      <nav className="flex-1 p-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                active 
                  ? 'bg-brand-500 text-brand-900 font-bold shadow-md translate-x-1' 
                  : 'text-brand-100 hover:bg-brand-800 hover:text-white'
              }`}
            >
              <Icon size={20} className={active ? 'text-brand-900' : ''} />
              <span className={active ? 'text-brand-900' : ''}>{item.label}</span>
            </Link>
          );
        })}

        <div className="pt-4 mt-4 border-t border-brand-800">
          <p className="px-4 text-xs font-semibold text-brand-300 uppercase tracking-wider mb-2">Pessoal</p>
          {configItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative ${
                  active 
                    ? 'bg-brand-500 text-brand-900 font-bold shadow-md translate-x-1' 
                    : 'text-brand-100 hover:bg-brand-800 hover:text-white'
                }`}
              >
                <div className="relative">
                  <Icon size={20} className={active ? 'text-brand-900' : ''}/>
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-brand-900">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className={active ? 'text-brand-900' : ''}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-brand-800">
        <button className="flex items-center gap-3 px-4 py-3 text-brand-100 hover:text-white hover:bg-brand-800 w-full rounded-lg transition-colors">
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;