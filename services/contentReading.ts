import type { ContentItem } from '../data/contentCatalog';
import { getSupabaseClient } from '../lib/supabase';
import { getAnonymousVisitorId } from './assessmentPersistence';

export type ReadingEvent = 'open' | 'progress';

export const createReadingSessionId = (): string => crypto.randomUUID();

export const recordContentReading = async (
  item: ContentItem,
  sessionId: string,
  event: ReadingEvent,
  progress: number,
): Promise<void> => {
  const { data } = await getSupabaseClient().auth.getSession();
  const isMemberSession = Boolean(data.session?.user && !data.session.user.is_anonymous);
  const token = isMemberSession ? data.session?.access_token : undefined;
  const accessMode = item.requiresPurchase
    ? 'paid'
    : item.requiresLogin
      ? 'login_required'
      : 'public';
  const response = await fetch('/api/analytics/content-reading', {
    method: 'POST',
    keepalive: true,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      contentId: item.id,
      contentSlug: item.slug,
      accessMode,
      anonymousVisitorId: token ? undefined : getAnonymousVisitorId(),
      sessionId,
      event,
      progress,
    }),
  });
  if (!response.ok && response.status !== 401) {
    throw new Error(`Unable to record content reading (${response.status})`);
  }
};
