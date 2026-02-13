import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const authHeader = req.headers.get("Authorization");

  if (!authHeader) {
    return new Response(
      JSON.stringify({ error: "Missing Authorization header" }),
      { status: 401, headers: corsHeaders }
    );
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const jwt = authHeader.replace("Bearer ", "");

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(jwt);

  if (error || !user) {
    return new Response(
      JSON.stringify({ error: "Invalid JWT" }),
      { status: 401, headers: corsHeaders }
    );
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, name, email, role, active, must_change_password")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return new Response(
      JSON.stringify({ error: "Profile not found" }),
      { status: 404, headers: corsHeaders }
    );
  }

  if (!profile.active) {
    return new Response(
      JSON.stringify({ error: "User inactive" }),
      { status: 403, headers: corsHeaders }
    );
  }

  return new Response(JSON.stringify(profile), {
    status: 200,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
});
