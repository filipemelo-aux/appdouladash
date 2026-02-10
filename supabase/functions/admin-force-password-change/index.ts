// supabase/functions/admin-force-password-change/index.ts

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    // 1. Setup Admin and Anon clients
    const serviceRoleClient = createClient(
      // FIX: Use bracket notation to access Deno env variables to avoid type errors.
      Deno['env'].get('SUPABASE_URL')!,
      Deno['env'].get('SUPABASE_SERVICE_ROLE_KEY')!
    );
    const anonClient = createClient(
      // FIX: Use bracket notation to access Deno env variables to avoid type errors.
      Deno['env'].get('SUPABASE_URL')!,
      Deno['env'].get('SUPABASE_ANON_KEY')!
    );

    // 2. Verify JWT and caller's role (must be admin)
    const authHeader =
  req.headers.get('authorization') ??
  req.headers.get('authorization');
    if (!authHeader) throw new Error('Missing Authorization header');
    const jwt = authHeader.replace('Bearer ', '');
    
    const { data: { user: caller }, error: userError } = await anonClient.auth.getUser(jwt);
    if (userError || !caller) {
      return new Response(JSON.stringify({ error: 'Authentication failed' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: callerProfile, error: profileError } = await serviceRoleClient
      .from('profiles')
      .select('role')
      .eq('id', caller.id)
      .single();
      
    if (profileError || callerProfile?.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Forbidden: Caller is not an admin' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 3. Get target user ID from request body
    const { userId } = await req.json();
    if (!userId) {
      throw new Error("userId is required");
    }

    // 4. Update the user's profile
    const { error: updateError } = await serviceRoleClient
      .from('profiles')
      .update({ must_change_password: true })
      .eq('id', userId);
      
    if (updateError) {
      throw updateError;
    }

    return new Response(JSON.stringify({ message: 'User is now required to change password on next login.' }), {
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
