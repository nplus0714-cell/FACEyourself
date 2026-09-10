import { getSupabaseClient } from '../lib/supabase';

export interface SubmitNpcQuestionInput {
  email: string;
  message: string;
  faceCode: string;
  source?: string;
  website?: string;
  consent: boolean;
}

export const submitNpcQuestion = async (input: SubmitNpcQuestionInput) => {
  try {
    const { data: { session } } = await getSupabaseClient().auth.getSession();
    const response = await fetch('/api/npc/questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
      },
      body: JSON.stringify({
        email: input.email.trim(),
        message: input.message.trim(),
        faceCode: input.faceCode,
        source: input.source ?? 'face-result',
        website: input.website?.trim() || '',
        consent: input.consent,
      }),
    });
    const body = await response.json().catch(() => null) as { submitted?: boolean; error?: { message?: string } } | null;
    if (!response.ok || body?.submitted !== true) {
      throw new Error(body?.error?.message || '目前無法送出，請稍後再試。');
    }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : '目前無法送出，請稍後再試。');
  }
};
