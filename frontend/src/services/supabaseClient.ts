// FIX: The `/// <reference types="vite/client" />` directive is failing, likely due to a missing `tsconfig.json`.
// This manual type definition for `import.meta.env` serves as a workaround to resolve TypeScript errors.
declare global {
  interface ImportMeta {
    readonly env: {
      readonly VITE_SUPABASE_URL: string;
      readonly VITE_SUPABASE_ANON_KEY: string;
    };
  }
}

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
