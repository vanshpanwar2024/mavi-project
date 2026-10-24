import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jgppzmnzknikwyahuqig.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_gUanVVhA69Es9hTD1rberQ_jVUHU1UV';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables! Check your .env.local file or hosting provider settings.");
}

export const supabase = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey
)