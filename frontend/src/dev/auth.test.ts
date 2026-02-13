import { supabase } from "../services/supabaseClient";

export async function testAuthLogin() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: "filipe.silvamelo@live.com",
    password: "85461010",
  });

  if (error) {
    console.error("AUTH ERROR", error);
    return;
  }

  console.log("AUTH OK");
  console.log("USER:", data.user?.id);
  console.log("ACCESS TOKEN:", data.session?.access_token);
}
