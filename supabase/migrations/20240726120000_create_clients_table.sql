
-- Cria a tabela para armazenar os clientes
CREATE TABLE public.clients (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text,
    phone text,
    status text DEFAULT 'active',
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Adiciona comentários para documentação
COMMENT ON TABLE public.clients IS 'Armazena as informações dos clientes vinculados a um usuário.';
COMMENT ON COLUMN public.clients.owner_id IS 'ID do usuário (de auth.users) que é proprietário deste registro de cliente.';

-- Habilita a Segurança em Nível de Linha (RLS) na tabela de clientes
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Cria as políticas de RLS para a tabela de clientes

-- 1. Política de SELECT: Permite que usuários leiam apenas os seus próprios clientes.
CREATE POLICY "Allow users to view their own clients"
ON public.clients
FOR SELECT
USING (auth.uid() = owner_id);

-- 2. Política de INSERT: Permite que usuários insiram clientes apenas para si mesmos.
CREATE POLICY "Allow users to insert their own clients"
ON public.clients
FOR INSERT
WITH CHECK (auth.uid() = owner_id);

-- 3. Política de UPDATE: Permite que usuários atualizem apenas seus próprios clientes.
CREATE POLICY "Allow users to update their own clients"
ON public.clients
FOR UPDATE
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);

-- 4. Política de DELETE: Permite que usuários deletem apenas seus próprios clientes.
CREATE POLICY "Allow users to delete their own clients"
ON public.clients
FOR DELETE
USING (auth.uid() = owner_id);
