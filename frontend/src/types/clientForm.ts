
export interface ClientFormData {
  // Step 1: Personal Data
  full_name: string; // Required
  phone: string; // Required
  cpf?: string;
  cep?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  companion_name?: string;
  companion_phone?: string;

  // Step 2: Pregnancy Data
  situation: 'Gestante' | 'Puérpera' | ''; // Required
  dpp?: string; // Date in YYYY-MM-DD format
  baby_names?: string;

  // Step 3: Plan and Payment
  plan: string; // Required
  amount?: string; // BRL currency string, e.g., "1.500,00"
  payment_method?: 'PIX' | 'Cartão' | 'Dinheiro' | 'Transferência' | '';
  payment_type?: 'À vista' | 'Parcelado' | '';

  // Step 4: Notes
  notes?: string;
  
  // System-managed properties
  status?: 'active' | 'inactive';
}
