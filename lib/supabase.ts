import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

let client: SupabaseClient<Database> | null = null;

export class SupabaseConfigurationError extends Error {
  constructor() {
    super('Supabase 尚未設定。請加入 VITE_SUPABASE_URL 與 VITE_SUPABASE_ANON_KEY。');
    this.name = 'SupabaseConfigurationError';
  }
}

export const getSupabaseClient = (): SupabaseClient<Database> => {
  if (client) return client;

  const url = import.meta.env.VITE_SUPABASE_URL?.trim();
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

  if (!url || !anonKey) {
    throw new SupabaseConfigurationError();
  }

  client = createClient<Database>(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  return client;
};
