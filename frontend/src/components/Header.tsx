
import React from 'react';
import { supabase } from '../services/supabaseClient';
import * as ReactRouterDOM from 'react-router-dom';

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
  collapsed: boolean;
  toggleCollapse: () => void;
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen, collapsed, toggleCollapse }) => {
  const navigate = ReactRouterDOM.useNavigate();
  const { pathname } = ReactRouterDOM.useLocation();

  const routeTitles: { [key: string]: string } = {
    '/dashboard': 'Dashboard',
    '/clients': 'Clientes',
    '/agenda': 'Agenda',
    '/settings': 'Configurações',
  };

  const title = routeTitles[pathname] || 'Dashboard';

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login', { replace: true });
  };

  return (
    <header className="h-[70px] bg-white border-b border-brand-100 shadow-sm flex-shrink-0">
      <div className="flex items-center justify-between h-full px-4 md:px-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-brand-500 hover:text-brand-700 focus:outline-none"
            aria-label="Open sidebar"
          >
            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <button
            onClick={toggleCollapse}
            className="hidden md:block text-brand-500 hover:text-brand-700 focus:outline-none"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronDoubleRightIcon /> : <ChevronDoubleLeftIcon />}
          </button>

          <div className="hidden md:block">
            {pathname !== '/dashboard' && (
              <nav className="text-sm text-brand-500 mb-1">
                <ReactRouterDOM.Link to="/dashboard" className="hover:text-brand-600 transition-colors">
                  Início
                </ReactRouterDOM.Link>
                <span className="mx-2">/</span>
                <span>{title}</span>
              </nav>
            )}
            <h1 className="text-xl font-semibold text-brand-800">{title}</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
            <div className="relative">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer">
                    <span className="text-sm font-semibold text-brand-600">FS</span>
                </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-brand-600 hover:text-brand-600 focus:outline-none transition-colors duration-200"
            >
              Sair
            </button>
        </div>
      </div>
    </header>
  );
};

const ChevronDoubleLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
  </svg>
);

const ChevronDoubleRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
  </svg>
);


export default Header;
