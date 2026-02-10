/// <reference lib="deno.ns" />

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const authHeader =
  req.headers.get('authorization') ??
  req.headers.get('authorization');

    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing Authorization header' }),
        { status: 401, headers: corsHeaders }
      );
    }

    const supabaseAuth = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    const {
      data: { user },
      error: authError,
    } = await supabaseAuth.auth.getUser();

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Usuário não autenticado' }),
        { status: 401, headers: corsHeaders }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data: clients, error: clientsError } = await supabaseAdmin
      .from('clients')
      .select(
        `
        id,
        created_at,
        full_name,
        dpp,
        profiles (
          email
        )
      `
      )
      .order('created_at', { ascending: false });

    if (clientsError) {
      return new Response(
        JSON.stringify({ error: clientsError.message }),
        { status: 500, headers: corsHeaders }
      );
    }

    const clientsList = clients ?? [];

    const result = clientsList.map((c: any) => ({
      id: c.id,
      created_at: c.created_at,
      full_name: c.full_name,
      dpp: c.dpp,
      email: c.profiles?.email ?? '',
    }));

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Erro desconhecido';

    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: corsHeaders }
    );
  }
});
