
import React, { useState, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

// CSS para a animação de transição de página.
// Definido aqui para manter a alteração contida neste único arquivo.
const pageTransitionStyles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fadeInUp {
    animation: fadeInUp 300ms ease-in-out forwards;
  }
`;

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Inicializa o estado 'collapsed' a partir do localStorage, com fallback para 'false'.
  const [collapsed, setCollapsed] = useState(() => {
    try {
      const savedState = localStorage.getItem('sidebarCollapsed');
      return savedState ? JSON.parse(savedState) : false;
    } catch (error) {
      console.error("Falha ao ler o estado do sidebar do localStorage:", error);
      return false;
    }
  });

  const location = ReactRouterDOM.useLocation();

  // Efeito para salvar o estado 'collapsed' no localStorage sempre que ele mudar.
  useEffect(() => {
    try {
      localStorage.setItem('sidebarCollapsed', JSON.stringify(collapsed));
    } catch (error) {
      console.error("Falha ao salvar o estado do sidebar no localStorage:", error);
    }
  }, [collapsed]);

  // Efeito para bloquear o scroll do body quando o menu mobile está aberto.
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Função de limpeza para restaurar o scroll quando o componente for desmontado.
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);

  return (
    <>
      <style>{pageTransitionStyles}</style>
      <div className="flex h-screen bg-[#f6f3f1]">
        <Sidebar 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          collapsed={collapsed}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            setSidebarOpen={setSidebarOpen} 
            collapsed={collapsed} 
            toggleCollapse={() => setCollapsed(!collapsed)} 
          />
          <main className="flex-1 overflow-y-auto relative">
            {/* A 'key' com o pathname força a remontagem do div a cada mudança de rota,
                re-executando assim a animação de fade-in. */}
            <div key={location.pathname} className="p-4 md:p-8 animate-fadeInUp">
              <div className="max-w-7xl mx-auto">
                <ReactRouterDOM.Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
