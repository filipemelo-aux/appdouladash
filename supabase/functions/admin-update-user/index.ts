// supabase/functions/admin-update-user/index.ts

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    // 1. Extrai o token JWT do cabeçalho de autorização.
    const authHeader =
  req.headers.get('authorization') ??
  req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('Missing Authorization header');
    }
    const jwt = authHeader.replace('Bearer ', '');

    // 2. Cria um cliente anon para verificar o JWT e obter o usuário.
    const supabaseClient = createClient(
      Deno['env'].get('SUPABASE_URL')!,
      Deno['env'].get('SUPABASE_ANON_KEY')!
    );
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(jwt);

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Authentication failed' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }
    
    // 3. Cria um cliente com Service Role para privilégios elevados.
    const serviceRoleClient = createClient(
      Deno['env'].get('SUPABASE_URL')!,
      Deno['env'].get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // 4. Verifica se o usuário que fez a chamada é um administrador.
    const { data: adminProfile, error: adminError } = await serviceRoleClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
      
    if (adminError || !adminProfile || adminProfile.role !== 'admin') {
       return new Response(JSON.stringify({ error: 'Forbidden: Caller is not an admin' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 403,
      });
    }

    // 5. Analisa o corpo da requisição e atualiza o usuário alvo.
    const { userId, role, active } = await req.json();
    if (!userId) {
        throw new Error("userId is required");
    }

    const updateData: { role?: string; active?: boolean } = {};
    if (role !== undefined) updateData.role = role;
    if (active !== undefined) updateData.active = active;

    if (Object.keys(updateData).length === 0) {
      throw new Error("Pelo menos um campo (role ou active) deve ser fornecido para atualização.");
    }

    const { error: updateError } = await serviceRoleClient
      .from('profiles')
      .update(updateData)
      .eq('id', userId);
      
    if (updateError) {
      throw updateError;
    }

    return new Response(JSON.stringify({ message: 'User updated successfully' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
