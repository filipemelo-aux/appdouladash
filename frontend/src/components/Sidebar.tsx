
import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  collapsed: boolean;
}

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isActive?: boolean;
  onClick: () => void;
  collapsed: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon, children, isActive, onClick, collapsed }) => (
  <ReactRouterDOM.Link
    to={to}
    onClick={onClick}
    title={String(children)}
    className={`flex items-center py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 border-l-4 ${
      isActive
        ? 'bg-brand-50 text-brand-700 font-semibold border-brand-600'
        : 'text-brand-600 hover:bg-brand-100 hover:text-brand-900 border-transparent'
    } ${
      collapsed ? 'justify-center px-2' : 'px-4'
    }`}
  >
    <div className={`transition-all duration-200 ${collapsed ? 'mr-0' : 'mr-3'}`}>{icon}</div>
    {/* FIX: Simplified text visibility logic to prevent disappearing text on mobile. */}
    {/* It now fades out and collapses width only when the sidebar is collapsed. */}
    <span className={`whitespace-nowrap transition-all duration-200 ${collapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
        {children}
    </span>
  </ReactRouterDOM.Link>
);

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen, collapsed }) => {
  const { pathname } = ReactRouterDOM.useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { name: 'Clientes', path: '/clients', icon: <ClientsIcon /> },
    { name: 'Agenda', path: '/agenda', icon: <AgendaIcon /> },
    { name: 'Configurações', path: '/settings', icon: <SettingsIcon /> },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          aria-hidden="true"
        ></div>
      )}
      
      <aside
        className={`bg-white border-r border-gray-100 flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out fixed inset-y-0 left-0 z-30 md:relative md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${collapsed ? 'md:w-20' : 'md:w-[260px]'}`}
      >
        <div className={`h-[70px] flex items-center border-b border-brand-100 transition-all duration-300 ${collapsed ? 'justify-center' : 'px-6'}`}>
          <div className="flex items-center space-x-2 overflow-hidden">
              <svg className="h-8 w-auto text-brand-600 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
              {/* FIX: Same transition logic as nav links for consistent behavior */}
              <span className={`text-xl font-bold text-brand-800 tracking-tight whitespace-nowrap transition-all duration-200 ${collapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
                  Papo de Doula
              </span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <NavLink 
              key={item.name} 
              to={item.path} 
              icon={item.icon} 
              isActive={pathname.startsWith(item.path)}
              onClick={() => setSidebarOpen(false)}
              collapsed={collapsed}
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

// SVG Icons
const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const ClientsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const AgendaIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);


export default Sidebar;
