import { supabase } from "../services/supabaseClient";

export async function getAccessToken() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) {
    console.error("No active session", error);
    return null;
  }

  return session.access_token;
}
