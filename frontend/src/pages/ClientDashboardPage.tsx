
import React from 'react';

const ClientDashboardPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-brand-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-brand-800 mb-4">Dashboard do Cliente</h1>
        <p className="text-brand-600">Bem-vindo(a) à sua área!</p>
      </div>
    </div>
  );
};

export default ClientDashboardPage;
