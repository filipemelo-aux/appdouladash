import { createPortal } from 'react-dom';
import React, { useState, useEffect, useCallback } from 'react';
import type { ClientFormData } from '../../types/clientForm';
import { createClient, updateClient } from '../../services/clientsService';
import type { Client } from '../../services/clientsService';


interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode?: 'create' | 'view' | 'edit';
  initialData?: Client | null;
}


const initialState: ClientFormData = {
  full_name: '',
  phone: '',
  cpf: '',
  cep: '',
  street: '',
  number: '',
  neighborhood: '',
  city: '',
  state: '',
  companion_name: '',
  companion_phone: '',
  situation: '',
  dpp: '',
  baby_names: '',
  plan: '',
  amount: '',
  payment_method: '',
  payment_type: '',
  notes: '',
  status: 'active',
};

/* ================= MASKS ================= */

const maskCEP = (value: string) =>
  value.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2').slice(0, 9);

const maskPhone = (value: string) =>
  value
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .slice(0, 15);

const maskCPF = (value: string) =>
  value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .slice(0, 14);

/* ================= COMPONENT ================= */

const ClientFormModal: React.FC<ClientFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  mode = 'create',
  initialData = null,
}) => {

  const isViewMode = mode === 'view'; // ✅ AGORA ESTÁ NO LUGAR CERTO
  const isEditMode = mode === 'edit';
  const [formData, setFormData] = useState<ClientFormData>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);

  const inputStyle =
    'h-9 w-full rounded-md border border-brand-100 bg-brand-50/60 px-3 text-sm text-brand-700 placeholder:text-gray-400 uppercase transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-300 focus:bg-white';

  useEffect(() => {
    if (initialData) {
      setFormData({
        full_name: initialData.full_name ?? '',
        phone: initialData.phone ?? '',
        cpf: initialData.cpf ?? '',
        cep: initialData.cep ?? '',
        street: initialData.street ?? '',
        number: initialData.number ?? '',
        neighborhood: initialData.neighborhood ?? '',
        city: initialData.city ?? '',
        state: initialData.state ?? '',
        companion_name: initialData.companion_name ?? '',
        companion_phone: initialData.companion_phone ?? '',
        situation: initialData.situation ?? '',
        dpp: initialData.dpp ?? '',
        baby_names: initialData.baby_names ?? '',
        plan: initialData.plan ?? '',
        amount: initialData.amount ?? '',
        payment_method: initialData.payment_method ?? '',
        payment_type: initialData.payment_type ?? '',
        notes: initialData.notes ?? '',
        status: initialData.status ?? 'active',
      });
    } else {
      setFormData(initialState);
    }
  }, [initialData]);


  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'phone' || name === 'companion_phone') {
      newValue = maskPhone(value);
    } else if (name === 'cpf') {
      newValue = maskCPF(value);
    } else if (name === 'cep') {
      newValue = maskCEP(value);
    } else {
      newValue = value.toUpperCase();
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const fetchAddress = useCallback(async (cep: string) => {
    const cleaned = cep.replace(/\D/g, '');
    if (cleaned.length !== 8) return;

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`);
      const data = await res.json();

      if (data.erro) throw new Error();

      setFormData((prev) => ({
        ...prev,
        street: (data.logradouro || '').toUpperCase(),
        neighborhood: (data.bairro || '').toUpperCase(),
        city: (data.localidade || '').toUpperCase(),
        state: (data.uf || '').toUpperCase(),
      }));

      setCepError(null);
    } catch {
      setCepError('CEP NÃO ENCONTRADO');
    }
  }, []);

  useEffect(() => {
    if (formData.cep.replace(/\D/g, '').length === 8) {
      fetchAddress(formData.cep);
    }
  }, [formData.cep, fetchAddress]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isViewMode) return;

    setIsSubmitting(true);

    try {
      if (isEditMode && initialData?.id) {
        await updateClient(initialData.id, formData);
      } else {
        await createClient(formData);
      }

      onSuccess();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-brand-800">
            {isViewMode
              ? 'Visualizar Cliente'
              : isEditMode
                ? 'Editar Cliente'
                : 'Nova Cliente'}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-brand-600 transition"
          >
            ✕
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

            {/* DADOS PESSOAIS */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Dados Pessoais
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder="Nome da cliente"
                  disabled={isViewMode}
                  className={inputStyle}
                />
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="(00) 00000-0000"
                  disabled={isViewMode}
                  className={inputStyle}
                />
                <input
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleInputChange}
                  placeholder="000.000.000-00"
                  disabled={isViewMode}
                  className={inputStyle}
                />
              </div>
            </div>

            {/* ENDEREÇO */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Endereço
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input name="cep" value={formData.cep} onChange={handleInputChange} placeholder="CEP" disabled={isViewMode} className={inputStyle} />
                <input
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  placeholder="Logradouro"
                  disabled={isViewMode}
                  className={`md:col-span-2 ${inputStyle}`}
                />
                <input name="number" value={formData.number} onChange={handleInputChange} placeholder="Número" disabled={isViewMode} className={inputStyle} />
                <input name="neighborhood" value={formData.neighborhood} onChange={handleInputChange} placeholder="Bairro" disabled={isViewMode} className={inputStyle} />
                <input name="city" value={formData.city} onChange={handleInputChange} placeholder="Cidade" disabled={isViewMode} className={inputStyle} />
                <input name="state" value={formData.state} onChange={handleInputChange} placeholder="UF" disabled={isViewMode} maxLength={2} className={inputStyle} />
              </div>
            </div>

            {/* ================= ACOMPANHANTE ================= */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Acompanhante
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium">
                    Nome do Acompanhante
                  </label>
                  <input
                    name="companion_name"
                    value={formData.companion_name}
                    onChange={handleInputChange}
                    placeholder="Nome do acompanhante"
                    disabled={isViewMode}
                    className="h-9 w-full rounded-md border px-3 text-sm uppercase"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium">
                    Telefone do Acompanhante
                  </label>
                  <input
                    name="companion_phone"
                    value={formData.companion_phone}
                    onChange={handleInputChange}
                    placeholder="(00) 00000-0000"
                    disabled={isViewMode}
                    className="h-9 w-full rounded-md border px-3 text-sm uppercase"
                  />
                </div>
              </div>
            </div>

            {/* ================= STATUS E GESTAÇÃO ================= */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Status e Gestação
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium">Situação *</label>
                  <select
                    name="situation"
                    value={formData.situation}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                    className="h-9 w-full rounded-md border px-3 text-sm"
                  >
                    <option value="">Selecione...</option>
                    <option value="Gestante">Gestante</option>
                    <option value="Puérpera">Puérpera</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium">DPP</label>
                  <input
                    type="date"
                    name="dpp"
                    value={formData.dpp}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                    className="h-9 w-full rounded-md border px-3 text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium">Nomes do(s) Bebê(s)</label>
                  <input
                    name="baby_names"
                    value={formData.baby_names}
                    onChange={handleInputChange}
                    placeholder="Nome1, Nome2..."
                    disabled={isViewMode}
                    className="h-9 w-full rounded-md border px-3 text-sm uppercase"
                  />
                </div>
              </div>
            </div>

            {/* ================= PLANO E PAGAMENTO ================= */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Plano e Pagamento
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium">Plano *</label>
                  <input
                    name="plan"
                    value={formData.plan}
                    onChange={handleInputChange}
                    placeholder="Básico"
                    disabled={isViewMode}
                    className="h-9 w-full rounded-md border px-3 text-sm uppercase"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium">Valor (R$)</label>
                  <input
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="2000"
                    disabled={isViewMode}
                    className="h-9 w-full rounded-md border px-3 text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium">Método de Pagamento</label>
                  <input
                    name="payment_method"
                    value={formData.payment_method}
                    onChange={handleInputChange}
                    placeholder="PIX"
                    disabled={isViewMode}
                    className="h-9 w-full rounded-md border px-3 text-sm uppercase"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium">Tipo de Pagamento</label>
                  <input
                    name="payment_type"
                    value={formData.payment_type}
                    onChange={handleInputChange}
                    placeholder="À Vista"
                    disabled={isViewMode}
                    className="h-9 w-full rounded-md border px-3 text-sm uppercase"
                  />
                </div>
              </div>
            </div>

            {/* OBSERVAÇÕES */}
            <div>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Anotações sobre a cliente..."
                disabled={isViewMode}
                className="w-full rounded-md border border-brand-100 bg-brand-50/60 px-3 py-2 text-sm text-brand-700 uppercase min-h-[70px] resize-none focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-300"
              />
            </div>

          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 rounded-md border border-brand-100 bg-white text-brand-600 text-sm hover:bg-brand-50 transition"
            >
              Voltar
            </button>

                        {!isViewMode && (
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="h-9 px-4 rounded-md bg-brand-500 text-white text-sm hover:bg-brand-600 transition shadow-sm"
                          >
                            {isSubmitting
                              ? 'Salvando...'
                              : isEditMode
                                ? 'Editar'
                                : 'Cadastrar'}
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                </div>,
                document.body
              );
            };
            
            export default ClientFormModal;
