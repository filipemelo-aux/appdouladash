import { supabase } from "../services/supabaseClient";

export async function testMe() {
  // 1️⃣ Garantir usuário autenticado
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("No authenticated user", userError);
    return;
  }

  // 2️⃣ Pegar sessão ATUAL
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session?.access_token) {
    console.error("No valid session", sessionError);
    return;
  }

  const token = session.access_token;

  console.log("TOKEN ENVIADO PARA /me:", token);

  // 3️⃣ Chamar Edge Function
  
const res = await fetch(
  `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/me`,
  {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      "Content-Type": "application/json",
    },
  }
);


  const data = await res.json();

  console.log("ME STATUS:", res.status);
  console.log("ME RESPONSE:", data);
}
