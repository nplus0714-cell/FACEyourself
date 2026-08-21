import { getSupabaseClient } from '../lib/supabase';

export type EarlyAccessInterest =
  | 'full_system'
  | 'survival_guide'
  | 'daily_journal'
  | 'trading_tools'
  | 'unsure';

export interface JoinEarlyAccessWaitlistInput {
  email: string;
  nickname?: string;
  interest?: EarlyAccessInterest | '';
  source: string;
  marketingConsent: boolean;
  website?: string;
}

const friendlyMessage = (message: string) => {
  if (message.includes('invalid_email')) return '請確認 Email 格式是否正確。';
  if (message.includes('marketing_consent_required')) return '請先勾選通知同意，再加入候補名單。';
  if (message.includes('nickname_too_long')) return '暱稱請控制在 30 個字以內。';
  if (message.includes('invalid_interest')) return '請重新選擇最想使用的內容。';
  return '目前無法完成登記，請稍後再試；若持續發生，可寄信與我們聯絡。';
};

export const joinEarlyAccessWaitlist = async (input: JoinEarlyAccessWaitlistInput) => {
  try {
    const { data, error } = await getSupabaseClient().rpc('join_early_access_waitlist', {
      p_email: input.email,
      p_nickname: input.nickname?.trim() || null,
      p_interest: input.interest || null,
      p_source: input.source,
      p_marketing_consent: input.marketingConsent,
      p_consent_version: 'early-access-v1',
      p_website: input.website?.trim() || null,
    });

    if (error) throw error;
    if (!data || data.ok !== true) throw new Error('invalid_waitlist_response');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(friendlyMessage(message));
  }
};
