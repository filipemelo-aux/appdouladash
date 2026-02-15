
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { getProfile, type Profile } from '../services/api';

/**
 * Hook customizado para verificar a sessão do Supabase e buscar o perfil do usuário
 * através de uma Edge Function.
 * 
 * @returns Um objeto contendo:
 * - `profile`: O objeto de perfil do usuário autenticado e ativo, ou `null`.
 * - `loading`: Um booleano que indica se a verificação está em andamento.
 */
export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          setProfile(null);
          return;
        }

        const userProfile = await getProfile();

        if (!userProfile.active) {
          await supabase.auth.signOut();
          setProfile(null);
        } else {
          setProfile(userProfile);
        }
      } catch (error) {
        console.error('Falha ao buscar perfil ou sessão:', error);
        await supabase.auth.signOut();
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []); // O array de dependências vazio garante que o efeito rode apenas uma vez na montagem.

  return { profile, loading };
};
