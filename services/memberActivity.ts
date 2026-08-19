import { getSupabaseClient } from '../lib/supabase';

export type MemberActivityType = 'signed_in' | 'signed_out' | 'session_restored';

export const recordMemberActivity = async (
  eventType: MemberActivityType,
  userId: string,
): Promise<void> => {
  const { error } = await getSupabaseClient().from('member_activity_events').insert({
    user_id: userId,
    event_type: eventType,
    metadata: {
      app_version: '2.5.0',
      path: window.location.pathname,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  });
  if (error) throw error;
};
