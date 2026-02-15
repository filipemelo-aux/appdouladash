
import React from 'react';
import type { ClientFormData } from '../../../types/clientForm';

interface StepProps {
    formData: ClientFormData;
    onFormChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    errors: { [key: string]: string };
}

const ReviewItem: React.FC<{ label: string; value?: string | null }> = ({ label, value }) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="text-sm font-medium text-brand-500">{label}</dt>
        <dd className="mt-1 text-sm text-brand-900 sm:mt-0 sm:col-span-2">{value || <span className="text-gray-400">Não informado</span>}</dd>
    </div>
);

const StepNotes: React.FC<StepProps> = ({ formData, onFormChange }) => {
    return (
        <div className="space-y-8 animate-fadeInUp">
            <div>
                <h2 className="text-lg font-medium text-brand-800">Observações Gerais</h2>
                <textarea name="notes" id="notes" value={formData.notes ?? ''} onChange={onFormChange} rows={4} className="mt-2 block w-full border-brand-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm" placeholder="Adicione qualquer observação ou informação adicional sobre a cliente aqui."></textarea>
            </div>
            
            <div>
                <h2 className="text-lg font-medium text-brand-800">Revisão das Informações</h2>
                <div className="mt-2 border-t border-b border-brand-100 divide-y divide-gray-200">
                    {/* Dados Pessoais */}
                    <ReviewItem label="Nome Completo" value={formData.full_name} />
                    <ReviewItem label="Telefone" value={formData.phone} />
                    <ReviewItem label="CPF" value={formData.cpf} />
                    <ReviewItem label="Endereço" value={
                        [formData.street, formData.number, formData.neighborhood, formData.city, formData.state, formData.cep]
                        .filter(Boolean).join(', ')
                    } />
                    <ReviewItem label="Acompanhante" value={formData.companion_name} />
                    <ReviewItem label="Tel. Acompanhante" value={formData.companion_phone} />
                    {/* Gestação */}
                    <ReviewItem label="Situação" value={formData.situation} />
                    <ReviewItem label="DPP" value={formData.dpp ? new Date(formData.dpp + 'T00:00:00').toLocaleDateString('pt-BR') : undefined} />
                    <ReviewItem label="Nomes do Bebê" value={formData.baby_names} />
                    {/* Plano e Pagamento */}
                    <ReviewItem label="Plano" value={formData.plan} />
                    <ReviewItem label="Valor" value={formData.amount ? `R$ ${formData.amount}` : undefined}/>
                    <ReviewItem label="Método de Pagamento" value={formData.payment_method} />
                    <ReviewItem label="Tipo de Pagamento" value={formData.payment_type} />
                </div>
            </div>
        </div>
    );
};

export default StepNotes;
