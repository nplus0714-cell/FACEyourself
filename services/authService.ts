import type { User } from '@supabase/supabase-js';
import type { AuthUser } from '../types';
import { getSupabaseClient } from '../lib/supabase';

const redirectTo = () => `${window.location.origin}/`;

export const toAuthUser = (user: User): AuthUser | null => {
  if (user.is_anonymous) return null;

  const metadata = user.user_metadata ?? {};
  const displayName = typeof metadata.full_name === 'string'
    ? metadata.full_name
    : typeof metadata.name === 'string'
      ? metadata.name
      : user.email?.split('@')[0] ?? 'FACE Member';
  const avatar = typeof metadata.avatar_url === 'string'
    ? metadata.avatar_url
    : typeof metadata.picture === 'string'
      ? metadata.picture
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=F4F0E9&color=2D2D2D`;

  return { id: user.id, name: displayName, email: user.email ?? '', avatar };
};

export const signInWithGoogle = async (): Promise<void> => {
  const { error } = await getSupabaseClient().auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: redirectTo() },
  });
  if (error) throw error;
};

export const signInWithLine = async (): Promise<void> => {
  const { error } = await getSupabaseClient().auth.signInWithOAuth({
    provider: 'custom:line' as never,
    options: { redirectTo: redirectTo() },
  });
  if (error) throw error;
};

export const sendEmailMagicLink = async (email: string): Promise<void> => {
  const { error } = await getSupabaseClient().auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectTo(),
      shouldCreateUser: true,
    },
  });
  if (error) throw error;
};

export const signOut = async (): Promise<void> => {
  const { error } = await getSupabaseClient().auth.signOut();
  if (error) throw error;
};
