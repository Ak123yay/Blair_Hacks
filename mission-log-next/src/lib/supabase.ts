import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const isConfigured = supabaseUrl.startsWith('https://') && supabaseAnonKey;

export const supabase = isConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null;

export type User = {
  id: string;
  email: string;
};

export async function getUser(): Promise<User | null> {
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return { id: user.id, email: user.email! };
}

export async function signInWithEmail(email: string, password: string) {
  if (!supabase) return { error: new Error('Supabase not configured'), data: null };
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUpWithEmail(email: string, password: string) {
  if (!supabase) return { error: new Error('Supabase not configured'), data: null };
  return supabase.auth.signUp({ email, password });
}

export async function signInWithGoogle() {
  if (!supabase) return { error: new Error('Supabase not configured'), data: null };
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`,
    },
  });
}

export async function signOut() {
  if (!supabase) return { error: null };
  return supabase.auth.signOut();
}