
import React, { useState, useMemo } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import type { ClientFormData } from '../../types/clientForm';
import { createClient } from '../../services/clientsService';

import StepPersonal from './steps/StepPersonal';
import StepPregnancy from './steps/StepPregnancy';
import StepPlan from './steps/StepPlan';
import StepNotes from './steps/StepNotes';

// --- UI Components ---
const CheckIcon: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const LoadingSpinner: React.FC = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const STEPS = [
  { id: 1, name: 'Dados Pessoais' },
  { id: 2, name: 'Gestação' },
  { id: 3, name: 'Plano e Pagamento' },
  { id: 4, name: 'Observações' }
];

const Stepper: React.FC<{ currentStep: number, goToStep: (step: number) => void }> = ({ currentStep, goToStep }) => (
    <nav aria-label="Progress">
        <ol role="list" className="flex items-center">
            {STEPS.map((step, stepIdx) => (
                <li key={step.name} className={`relative ${stepIdx !== STEPS.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
                    {step.id < currentStep ? (
                        <>
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="h-0.5 w-full bg-brand-600" />
                            </div>
                            <button onClick={() => goToStep(step.id)} className="relative flex h-8 w-8 items-center justify-center bg-brand-600 rounded-full hover:bg-brand-700 transition-colors">
                                <CheckIcon className="h-5 w-5 text-white" />
                            </button>
                        </>
                    ) : step.id === currentStep ? (
                        <>
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="h-0.5 w-full bg-gray-200" />
                            </div>
                            <span className="relative flex h-8 w-8 items-center justify-center bg-white border-2 border-brand-600 rounded-full" aria-current="step">
                                <span className="h-2.5 w-2.5 bg-brand-600 rounded-full" />
                            </span>
                        </>
                    ) : (
                        <>
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="h-0.5 w-full bg-gray-200" />
                            </div>
                            <span className="relative flex h-8 w-8 items-center justify-center bg-white border-2 border-brand-300 rounded-full"></span>
                        </>
                    )}
                </li>
            ))}
        </ol>
    </nav>
);

// --- Main Wizard Component ---
const ClientFormWizard: React.FC = () => {
    const navigate = ReactRouterDOM.useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<ClientFormData>({
        full_name: '',
        phone: '',
        situation: '',
        plan: '',
        status: 'active',
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateStep = (): boolean => {
        const newErrors: { [key: string]: string } = {};
        if (currentStep === 1) {
            if (!formData.full_name.trim()) newErrors.full_name = 'O nome completo é obrigatório.';
            if (!formData.phone.trim()) newErrors.phone = 'O telefone é obrigatório.';
        }
        if (currentStep === 2) {
            if (!formData.situation) newErrors.situation = 'A situação é obrigatória.';
        }
        if (currentStep === 3) {
            if (!formData.plan.trim()) newErrors.plan = 'O plano é obrigatório.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const isNextButtonDisabled = useMemo(() => {
        switch (currentStep) {
            case 1: return !formData.full_name?.trim() || !formData.phone?.trim();
            case 2: return !formData.situation;
            case 3: return !formData.plan?.trim();
            default: return false;
        }
    }, [formData, currentStep]);

    const nextStep = () => {
        if (validateStep()) {
            if (currentStep < STEPS.length) setCurrentStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(prev => prev + 1);
    };
    
    const goToStep = (step: number) => {
      if (step < currentStep) {
        setCurrentStep(step);
      }
    }

    const handleSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        setErrors({});
        try {
            await createClient(formData);
            navigate('/clients');
        } catch (err: any) {
            setErrors({ submit: err.message || 'Ocorreu um erro ao criar o cliente. Tente novamente.' });
            setIsSubmitting(false);
        }
    };

    const renderStep = () => {
        const commonProps = { formData, onFormChange: handleFormChange, errors };
        switch (currentStep) {
            case 1: return <StepPersonal {...commonProps} />;
            case 2: return <StepPregnancy {...commonProps} />;
            case 3: return <StepPlan {...commonProps} />;
            case 4: return <StepNotes {...commonProps} />;
            default: return <div>Etapa não encontrada</div>;
        }
    };
    
    return (
        <div>
            <Stepper currentStep={currentStep} goToStep={goToStep}/>
            <div className="mt-8 min-h-[350px]">
                {renderStep()}
            </div>
            
            {errors.submit && <p className="mt-4 text-sm text-red-600 text-center">{errors.submit}</p>}

            <div className="mt-10 pt-6 border-t border-brand-100 flex justify-between items-center">
                <button type="button" onClick={prevStep} disabled={currentStep === 1} className="px-4 py-2 text-sm font-medium text-brand-700 bg-white border border-brand-300 rounded-md hover:bg-brand-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    Voltar
                </button>
                {currentStep < STEPS.length ? (
                    <button type="button" onClick={nextStep} disabled={isNextButtonDisabled} className="px-4 py-2 text-sm font-medium text-white bg-brand-600 border border-transparent rounded-md hover:bg-brand-700 disabled:bg-brand-300 disabled:cursor-not-allowed">
                        Próximo
                    </button>
                ) : (
                    <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 disabled:bg-green-400">
                        {isSubmitting && <LoadingSpinner />}
                        <span className={isSubmitting ? 'ml-2' : ''}>Salvar Cliente</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default ClientFormWizard;
