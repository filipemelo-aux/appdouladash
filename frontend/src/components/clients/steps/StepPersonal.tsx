
import React from 'react';
import type { ClientFormData } from '../../../types/clientForm';

interface StepProps {
    formData: ClientFormData;
    onFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    errors: { [key: string]: string };
}

const StepPersonal: React.FC<StepProps> = ({ formData, onFormChange, errors }) => {
    return (
        <div className="space-y-8 animate-fadeInUp">
            <div>
                <h2 className="text-lg font-medium text-brand-800">Dados da Cliente</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mt-4">
                    {/* Nome Completo */}
                    <div className="md:col-span-2">
                        <label htmlFor="full_name" className="block text-sm font-medium text-brand-700">Nome Completo <span className="text-red-500">*</span></label>
                        <input type="text" name="full_name" id="full_name" value={formData.full_name} onChange={onFormChange} className={`mt-1 block w-full border-brand-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm ${errors.full_name ? 'border-red-500' : ''}`} />
                        {errors.full_name && <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>}
                    </div>
                    {/* Telefone */}
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-brand-700">Telefone <span className="text-red-500">*</span></label>
                        <input type="tel" name="phone" id="phone" value={formData.phone} onChange={onFormChange} className={`mt-1 block w-full border-brand-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm ${errors.phone ? 'border-red-500' : ''}`} />
                        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                    </div>
                    {/* CPF */}
                    <div>
                        <label htmlFor="cpf" className="block text-sm font-medium text-brand-700">CPF</label>
                        <input type="text" name="cpf" id="cpf" value={formData.cpf ?? ''} onChange={onFormChange} className="mt-1 block w-full border-brand-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm" />
                    </div>
                    {/* Endereço */}
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-6 gap-x-6 gap-y-4 border-t pt-6 mt-2">
                        <div className="col-span-2">
                          <label htmlFor="cep" className="block text-sm font-medium text-brand-700">CEP</label>
                          <input type="text" name="cep" id="cep" value={formData.cep ?? ''} onChange={onFormChange} className="mt-1 block w-full border-brand-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm"/>
                        </div>
                        <div className="col-span-4">
                          <label htmlFor="street" className="block text-sm font-medium text-brand-700">Rua</label>
                          <input type="text" name="street" id="street" value={formData.street ?? ''} onChange={onFormChange} className="mt-1 block w-full border-brand-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm"/>
                        </div>
                        <div className="col-span-2">
                          <label htmlFor="number" className="block text-sm font-medium text-brand-700">Número</label>
                          <input type="text" name="number" id="number" value={formData.number ?? ''} onChange={onFormChange} className="mt-1 block w-full border-brand-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm"/>
                        </div>
                         <div className="col-span-4">
                          <label htmlFor="neighborhood" className="block text-sm font-medium text-brand-700">Bairro</label>
                          <input type="text" name="neighborhood" id="neighborhood" value={formData.neighborhood ?? ''} onChange={onFormChange} className="mt-1 block w-full border-brand-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm"/>
                        </div>
                        <div className="col-span-4">
                          <label htmlFor="city" className="block text-sm font-medium text-brand-700">Cidade</label>
                          <input type="text" name="city" id="city" value={formData.city ?? ''} onChange={onFormChange} className="mt-1 block w-full border-brand-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm"/>
                        </div>
                        <div className="col-span-2">
                          <label htmlFor="state" className="block text-sm font-medium text-brand-700">Estado</label>
                          <input type="text" name="state" id="state" value={formData.state ?? ''} onChange={onFormChange} className="mt-1 block w-full border-brand-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm"/>
                        </div>
                    </div>
                </div>
            </div>
             <div>
                <h2 className="text-lg font-medium text-brand-800">Dados do Acompanhante</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mt-4">
                    <div >
                        <label htmlFor="companion_name" className="block text-sm font-medium text-brand-700">Nome</label>
                        <input type="text" name="companion_name" id="companion_name" value={formData.companion_name ?? ''} onChange={onFormChange} className="mt-1 block w-full border-brand-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="companion_phone" className="block text-sm font-medium text-brand-700">Telefone</label>
                        <input type="tel" name="companion_phone" id="companion_phone" value={formData.companion_phone ?? ''} onChange={onFormChange} className="mt-1 block w-full border-brand-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm" />
                    </div>
                 </div>
            </div>
        </div>
    );
};

export default StepPersonal;
