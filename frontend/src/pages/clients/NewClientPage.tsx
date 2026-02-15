
import React from 'react';
import ClientFormWizard from '../../components/clients/ClientFormWizard';

const NewClientPage: React.FC = () => {
    return (
        <div className="bg-white p-8 rounded-xl shadow-sm">
            <div className="mb-12 border-b pb-6">
                <h1 className="text-2xl font-semibold text-brand-800">Novo Cliente</h1>
                <p className="mt-1 text-sm text-brand-600">Siga os passos para cadastrar um novo cliente no sistema.</p>
            </div>
            <ClientFormWizard />
        </div>
    );
};

export default NewClientPage;
