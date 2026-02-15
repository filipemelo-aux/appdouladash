
import React from 'react';
import type { ClientFormData } from '../../../types/clientForm';

interface StepProps {
    formData: ClientFormData;
    onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    errors: { [key: string]: string };
}

const StepPregnancy: React.FC<StepProps> = ({ formData, onFormChange, errors }) => {
    return (
        <div className="space-y-6 animate-fadeInUp">
            <h2 className="text-lg font-medium text-brand-800">Dados da Gestação</h2>
            <div className="space-y-6">
                {/* Situação */}
                <div>
                    <label className="block text-sm font-medium text-brand-700">Situação <span className="text-red-500">*</span></label>
                    <fieldset className="mt-2">
                        <legend className="sr-only">Escolha a situação</legend>
                        <div className="flex items-center space-x-6">
                            <div className="flex items-center">
                                <input id="gestante" name="situation" type="radio" value="Gestante" checked={formData.situation === 'Gestante'} onChange={onFormChange} className="focus:ring-brand-500 h-4 w-4 text-brand-600 border-brand-300" />
                                <label htmlFor="gestante" className="ml-3 block text-sm font-medium text-brand-700">Gestante</label>
                            </div>
                            <div className="flex items-center">
                                <input id="puerpera" name="situation" type="radio" value="Puérpera" checked={formData.situation === 'Puérpera'} onChange={onFormChange} className="focus:ring-brand-500 h-4 w-4 text-brand-600 border-brand-300" />
                                <label htmlFor="puerpera" className="ml-3 block text-sm font-medium text-brand-700">Puérpera</label>
                            </div>
                        </div>
                    </fieldset>
                    {errors.situation && <p className="mt-1 text-sm text-red-600">{errors.situation}</p>}
                </div>

                {/* Data Provável do Parto */}
                <div>
                    <label htmlFor="dpp" className="block text-sm font-medium text-brand-700">Data Provável do Parto (DPP)</label>
                    <input type="date" name="dpp" id="dpp" value={formData.dpp ?? ''} onChange={onFormChange} className="mt-1 block w-full border-brand-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm" />
                </div>
                
                {/* Nomes do Bebê */}
                <div>
                    <label htmlFor="baby_names" className="block text-sm font-medium text-brand-700">Nomes do Bebê</label>
                    <input type="text" name="baby_names" id="baby_names" value={formData.baby_names ?? ''} onChange={onFormChange} className="mt-1 block w-full border-brand-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm" placeholder="Ex: João, Maria, etc." />
                </div>
            </div>
        </div>
    );
};

export default StepPregnancy;
