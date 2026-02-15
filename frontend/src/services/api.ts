
import { supabase } from './supabaseClient';

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  must_change_password: boolean;
}

export const getProfile = async (): Promise<Profile> => {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    throw new Error(`Authentication error: ${sessionError.message}`);
  }

  if (!session) {
    throw new Error('User not authenticated. No session found.');
  }

  const { access_token } = session;

  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/me`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response.' }));
    throw new Error(errorData.error || `Failed to fetch profile: ${response.statusText}`);
  }

  const profileData = await response.json();
  return profileData as Profile;
};
