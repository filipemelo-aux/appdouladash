
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import type { User } from '@supabase/supabase-js';

/**
 * Hook customizado para verificar a sessão do usuário no Supabase.
 * 
 * @returns Um objeto contendo:
 * - `user`: O objeto do usuário autenticado ou `null` se não houver sessão.
 * - `loading`: Um booleano que indica se a verificação da sessão está em andamento.
 */
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Erro ao buscar sessão do Supabase:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUserSession();
  }, []); // O array de dependências vazio garante que o efeito rode apenas uma vez.

  return { user, loading };
};
