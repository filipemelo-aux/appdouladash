
-- This migration script completely overhauls the clients table for a new, detailed wizard.
-- It runs after '20240726120000_create_clients_table.sql' and modifies the initial schema.

-- Rename 'name' to 'full_name' for clarity. This must run before dropping 'name'.
ALTER TABLE public.clients RENAME COLUMN name TO full_name;

-- Drop columns from the previous, simpler wizard structure if they exist.
ALTER TABLE public.clients
DROP COLUMN IF EXISTS birth_date,
DROP COLUMN IF EXISTS address,
DROP COLUMN IF EXISTS due_date,
DROP COLUMN IF EXISTS pregnancy_type,
DROP COLUMN IF EXISTS health_info,
DROP COLUMN IF EXISTS birth_location,
DROP COLUMN IF EXISTS birth_preferences;

-- Add all new columns required for the new 4-step wizard
ALTER TABLE public.clients
ADD COLUMN cpf text,
ADD COLUMN cep text,
ADD COLUMN street text,
ADD COLUMN "number" text,
ADD COLUMN neighborhood text,
ADD COLUMN city text,
ADD COLUMN state text,
ADD COLUMN companion_name text,
ADD COLUMN companion_phone text,
ADD COLUMN situation text,
ADD COLUMN dpp date,
ADD COLUMN baby_names text,
ADD COLUMN plan text,
ADD COLUMN amount numeric,
ADD COLUMN payment_method text,
ADD COLUMN payment_type text;

-- The 'notes' column was also in the old migration, so we ensure it exists.
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS notes text;


-- Add comments for all new columns for better documentation
COMMENT ON COLUMN public.clients.full_name IS 'Nome completo da cliente.';
COMMENT ON COLUMN public.clients.cpf IS 'CPF da cliente.';
COMMENT ON COLUMN public.clients.cep IS 'CEP do endereço da cliente.';
COMMENT ON COLUMN public.clients.street IS 'Rua do endereço da cliente.';
COMMENT ON COLUMN public.clients.number IS 'Número do endereço da cliente.';
COMMENT ON COLUMN public.clients.neighborhood IS 'Bairro do endereço da cliente.';
COMMENT ON COLUMN public.clients.city IS 'Cidade do endereço da cliente.';
COMMENT ON COLUMN public.clients.state IS 'Estado do endereço da cliente.';
COMMENT ON COLUMN public.clients.companion_name IS 'Nome do acompanhante.';
COMMENT ON COLUMN public.clients.companion_phone IS 'Telefone do acompanhante.';
COMMENT ON COLUMN public.clients.situation IS 'Situação atual da cliente (Gestante ou Puérpera).';
COMMENT ON COLUMN public.clients.dpp IS 'Data provável do parto (DPP).';
COMMENT ON COLUMN public.clients.baby_names IS 'Nomes sugeridos para o bebê.';
COMMENT ON COLUMN public.clients.plan IS 'Plano de serviço contratado.';
COMMENT ON COLUMN public.clients.amount IS 'Valor do plano contratado em BRL.';
COMMENT ON COLUMN public.clients.payment_method IS 'Método de pagamento (PIX, Cartão, etc.).';
COMMENT ON COLUMN public.clients.payment_type IS 'Tipo de pagamento (À vista ou Parcelado).';
COMMENT ON COLUMN public.clients.notes IS 'Observações gerais sobre a cliente.';
