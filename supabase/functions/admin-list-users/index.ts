// supabase/functions/admin-list-users/index.ts

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    // 1. Cria um cliente com privilégios de administrador.
    const serviceRoleClient = createClient(
      Deno['env'].get('SUPABASE_URL')!,
      Deno['env'].get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // 2. Valida se o chamador é um admin ou assistente para proteger a função.
    const authHeader =
  req.headers.get('authorization') ??
  req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('Missing Authorization header');
    }
    const jwt = authHeader.replace('Bearer ', '');
    
    const anonClient = createClient(
        Deno['env'].get('SUPABASE_URL')!, 
        Deno['env'].get('SUPABASE_ANON_KEY')!
    );
    const { data: { user }, error: userError } = await anonClient.auth.getUser(jwt);

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Authentication failed' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    const { data: callerProfile, error: profileError } = await serviceRoleClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !callerProfile || !['admin', 'assistant'].includes(callerProfile.role)) {
      return new Response(JSON.stringify({ error: 'Forbidden: Caller is not an admin or assistant' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 403,
      });
    }

    // 3. Busca todos os perfis de usuário.
    const { data, error } = await serviceRoleClient
      .from('profiles')
      .select('id, full_name, email, role, active, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
