import { getSupabaseClient } from '../lib/supabase';

type PaidArticleResponse = {
  markdown?: string;
  error?: { code?: string; message?: string };
};

export const getPaidArticleMarkdown = async (slug: string): Promise<string> => {
  const { data } = await getSupabaseClient().auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error('LOGIN_REQUIRED');

  const response = await fetch(`/api/content/${encodeURIComponent(slug)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const payload = await response.json().catch(() => ({})) as PaidArticleResponse;
  if (!response.ok || !payload.markdown) {
    throw new Error(payload.error?.message || `Unable to load paid article (${response.status})`);
  }

  return payload.markdown;
};
