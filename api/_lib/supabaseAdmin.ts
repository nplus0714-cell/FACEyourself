import { createClient, type User } from '@supabase/supabase-js';
import { ApiError } from './http';

export const getAdminClient = () => {
  const url = (process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL)?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !serviceRoleKey) {
    throw new Error('Supabase server storage is not configured');
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
};

const readBearerToken = (request: Request): string | null => {
  const authorization = request.headers.get('authorization')?.trim() ?? '';
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || null;
};

export const getOptionalAuthenticatedUser = async (request: Request): Promise<User | null> => {
  const token = readBearerToken(request);
  if (!token) return null;

  const { data, error } = await getAdminClient().auth.getUser(token);
  if (error || !data.user) {
    throw new ApiError(401, 'INVALID_SESSION', '登入狀態已失效，請重新登入。');
  }
  if (data.user.is_anonymous) return null;
  return data.user;
};

export const requireAuthenticatedUser = async (request: Request): Promise<User> => {
  const user = await getOptionalAuthenticatedUser(request);
  if (!user) {
    throw new ApiError(401, 'LOGIN_REQUIRED', '請先登入後再繼續。');
  }
  return user;
};
