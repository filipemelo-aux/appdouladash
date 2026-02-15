
import { supabase } from './supabaseClient';
import type { ClientFormData } from '../types/clientForm';

/**
 * Interface que representa a estrutura completa de um cliente,
 * correspondendo à tabela 'clients' no banco de dados.
 */
export interface Client {
  id: string; // uuid
  owner_id: string; // uuid
  full_name: string;
  email: string | null;
  phone: string | null;
  status: string;
  created_at: string; // timestamp
  cpf?: string | null;
  cep?: string | null;
  street?: string | null;
  number?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  state?: string | null;
  companion_name?: string | null;
  companion_phone?: string | null;
  situation?: string | null;
  dpp?: string | null;
  baby_names?: string | null;
  plan?: string | null;
  amount?: number | null;
  payment_method?: string | null;
  payment_type?: string | null;
  notes?: string | null;
}

/**
 * Tipo para os dados necessários ao criar um novo cliente.
 * Importado diretamente do tipo do formulário do wizard.
 */
export type ClientCreateData = ClientFormData;

/**
 * Tipo para os dados ao atualizar um cliente.
 * Todos os campos são opcionais.
 */
export type ClientUpdateData = Partial<ClientCreateData>;

/**
 * Busca todos os clientes pertencentes ao usuário autenticado.
 * A ordenação é feita pela data de criação, dos mais recentes para os mais antigos.
 * @returns Uma Promise que resolve para um array de Clientes.
 * @throws Lança um erro se a busca falhar.
 */
export const getClients = async (): Promise<Client[]> => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar clientes:', error.message);
    throw new Error('Não foi possível buscar os clientes.');
  }

  return data;
};

/**
 * Cria um novo registro de cliente vinculado ao usuário autenticado.
 * @param clientData - Os dados do novo cliente a ser criado.
 * @returns Uma Promise que resolve para o objeto do cliente recém-criado.
 * @throws Lança um erro se o usuário não estiver autenticado ou se a criação falhar.
 */
export const createClient = async (clientData: ClientCreateData): Promise<Client> => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Usuário não autenticado. Ação não permitida.');
  }

  // Garante que campos vazios opcionais sejam nulos no banco de dados
  const sanitizedData: { [key: string]: any } = Object.fromEntries(
    Object.entries(clientData).map(([key, value]) => [key, value === '' ? null : value])
  );

  // Converte o valor monetário de string para número
  if (sanitizedData.amount && typeof sanitizedData.amount === 'string') {
    sanitizedData.amount = parseFloat(sanitizedData.amount.replace(/\./g, '').replace(',', '.'));
  }

  const recordToInsert = {
    ...sanitizedData,
    full_name: clientData.full_name, // Garante que o campo obrigatório esteja presente
    owner_id: user.id,
    status: clientData.status || 'active', // Garante um status padrão
  };

  const { data, error } = await supabase
    .from('clients')
    .insert(recordToInsert)
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar cliente:', error.message);
    throw new Error('Não foi possível cadastrar o cliente.');
  }

  return data;
};

/**
 * Atualiza os dados de um cliente existente.
 * A política de RLS garante que o usuário só pode atualizar seus próprios clientes.
 * @param id - O ID (uuid) do cliente a ser atualizado.
 * @param clientData - Um objeto com os campos a serem atualizados.
 * @returns Uma Promise que resolve para o objeto do cliente atualizado.
 * @throws Lança um erro se a atualização falhar.
 */
export const updateClient = async (id: string, clientData: ClientUpdateData): Promise<Client> => {
  const { data, error } = await supabase
    .from('clients')
    .update(clientData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erro ao atualizar cliente:', error.message);
    throw new Error('Não foi possível atualizar os dados do cliente.');
  }

  return data;
};

/**
 * Deleta um cliente.
 * A política de RLS garante que o usuário só pode deletar seus próprios clientes.
 * @param id - O ID (uuid) do cliente a ser deletado.
 * @returns Uma Promise que resolve quando a operação é concluída.
 * @throws Lança um erro se a deleção falhar.
 */
export const deleteClient = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao deletar cliente:', error.message);
    throw new Error('Não foi possível deletar o cliente.');
  }
};
