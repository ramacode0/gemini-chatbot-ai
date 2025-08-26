import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPA_URL; const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPA_KEY;

if (!supabaseUrl || !supabaseAnonKey) { throw new Error("Supabase URL or Anon Key is missing from environment variables."); }

export const supabase = createClient(supabaseUrl, supabaseAnonKey);