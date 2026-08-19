import { getSupabaseClient } from '../lib/supabase';

export const SURVIVAL_KIT_PRODUCT_CODE = 'face-survival-kit';

export const getActiveEntitlementCodes = async (): Promise<string[]> => {
  const supabase = getSupabaseClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!userData.user) return [];

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('member_entitlements')
    .select('product_code, expires_at')
    .eq('user_id', userData.user.id)
    .eq('status', 'active');
  if (error) throw error;

  return (data ?? [])
    .filter((item) => !item.expires_at || item.expires_at > now)
    .map((item) => item.product_code);
};

export const hasSurvivalKitEntitlement = async (): Promise<boolean> => (
  (await getActiveEntitlementCodes()).includes(SURVIVAL_KIT_PRODUCT_CODE)
);
