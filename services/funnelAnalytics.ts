import { getAnonymousVisitorId } from './assessmentPersistence';

export type FunnelEventType = 'test_landing' | 'test_started' | 'test_completed';

const SESSION_ID_KEY = 'face_funnel_session_id_v1';
const trackedEvents = new Set<FunnelEventType>();

const getFunnelSessionId = (): string => {
  const existing = sessionStorage.getItem(SESSION_ID_KEY);
  if (existing) return existing;
  const sessionId = crypto.randomUUID();
  sessionStorage.setItem(SESSION_ID_KEY, sessionId);
  return sessionId;
};

const getAttribution = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    source: params.get('utm_source') ?? undefined,
    medium: params.get('utm_medium') ?? undefined,
    campaign: params.get('utm_campaign') ?? undefined,
    content: params.get('utm_content') ?? undefined,
  };
};

/**
 * Best-effort anonymous funnel tracking. It never includes assessment answers,
 * names, email addresses, referrer URLs, or authentication tokens.
 */
export const trackTestFunnelEvent = (eventType: FunnelEventType): void => {
  if (trackedEvents.has(eventType)) return;
  trackedEvents.add(eventType);

  try {
    void fetch('/api/analytics/funnel', {
      method: 'POST',
      keepalive: true,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        anonymousVisitorId: getAnonymousVisitorId(),
        sessionId: getFunnelSessionId(),
        eventType,
        path: window.location.pathname,
        attribution: getAttribution(),
      }),
    }).then((response) => {
      if (!response.ok) throw new Error(`Funnel tracking failed (${response.status})`);
    }).catch((error) => console.warn('Unable to record anonymous funnel event', error));
  } catch (error) {
    // Analytics must never block the test when browser storage or networking
    // is unavailable.
    console.warn('Unable to prepare anonymous funnel event', error);
  }
};
