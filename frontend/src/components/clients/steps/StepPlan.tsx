
import React from 'react';
import type { ClientFormData } from '../../../types/clientForm';

interface StepProps {
    formData: ClientFormData;
    onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    errors: { [key: string]: string };
}

const StepPlan: React.FC<StepProps> = ({ formData, onFormChange, errors }) => {
    return (
        <div className="space-y-6 animate-fadeInUp">
            <h2 className="text-lg font-medium text-brand-800">Plano e Pagamento</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Plano */}
                <div className="md:col-span-2">
                    <label htmlFor="plan" className="block text-sm font-medium text-brand-700">Plano <span className="text-red-500">*</span></label>
                    <input type="text" name="plan" id="plan" value={formData.plan} onChange={onFormChange} className={`mt-1 block w-full border-brand-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm ${errors.plan ? 'border-red-500' : ''}`} placeholder="Ex: Plano Parto Completo" />
                     {errors.plan && <p className="mt-1 text-sm text-red-600">{errors.plan}</p>}
                </div>
                {/* Valor */}
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-brand-700">Valor (R$)</label>
                    <input type="text" name="amount" id="amount" value={formData.amount ?? ''} onChange={onFormChange} className="mt-1 block w-full border-brand-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm" placeholder="Ex: 1.500,00"/>
                </div>
                <div></div> {/* Spacer */}
                {/* Método de Pagamento */}
                <div>
                    <label htmlFor="payment_method" className="block text-sm font-medium text-brand-700">Método de Pagamento</label>
                    <select name="payment_method" id="payment_method" value={formData.payment_method ?? ''} onChange={onFormChange} className="mt-1 block w-full border-brand-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm">
                        <option value="">Selecione...</option>
                        <option value="PIX">PIX</option>
                        <option value="Cartão">Cartão</option>
                        <option value="Dinheiro">Dinheiro</option>
                        <option value="Transferência">Transferência</option>
                    </select>
                </div>
                {/* Tipo de Pagamento */}
                <div>
                    <label htmlFor="payment_type" className="block text-sm font-medium text-brand-700">Tipo de Pagamento</label>
                    <select name="payment_type" id="payment_type" value={formData.payment_type ?? ''} onChange={onFormChange} className="mt-1 block w-full border-brand-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm">
                        <option value="">Selecione...</option>
                        <option value="À vista">À vista</option>
                        <option value="Parcelado">Parcelado</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default StepPlan;
