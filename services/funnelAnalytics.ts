import { getAnonymousVisitorId } from './assessmentPersistence';

export type FunnelEventType =
  | 'quiz_landing_view'
  | 'quiz_start'
  | 'quiz_question_progress'
  | 'quiz_complete'
  | 'result_view'
  | 'result_share_click'
  | 'result_feedback_click'
  | 'survival_guide_click'
  | 'line_click'
  | 'guide_access'
  | 'guide_read_start';

interface FunnelEventOptions {
  step?: number;
  once?: boolean;
}

const SESSION_ID_KEY = 'face_funnel_session_id_v1';
const ATTRIBUTION_KEY = 'face_funnel_attribution_v1';
const trackedEvents = new Set<string>();

const getFunnelSessionId = (): string => {
  const existing = sessionStorage.getItem(SESSION_ID_KEY);
  if (existing) return existing;
  const sessionId = crypto.randomUUID();
  sessionStorage.setItem(SESSION_ID_KEY, sessionId);
  return sessionId;
};

const readAttribution = (): Record<string, string | undefined> => {
  const params = new URLSearchParams(window.location.search);
  const current = {
    source: params.get('utm_source') ?? undefined,
    medium: params.get('utm_medium') ?? undefined,
    campaign: params.get('utm_campaign') ?? undefined,
    content: params.get('utm_content') ?? undefined,
  };

  if (Object.values(current).some(Boolean)) {
    try { sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(current)); } catch { /* best effort */ }
    return current;
  }

  try {
    return JSON.parse(sessionStorage.getItem(ATTRIBUTION_KEY) ?? '{}') as Record<string, string | undefined>;
  } catch {
    return current;
  }
};

/**
 * Best-effort anonymous funnel tracking. It never includes assessment answers,
 * names, email addresses, referrer URLs, or authentication tokens.
 */
export const trackFunnelEvent = (eventType: FunnelEventType, options: FunnelEventOptions = {}): void => {
  const eventKey = `${eventType}:${options.step ?? ''}`;
  if (options.once !== false && trackedEvents.has(eventKey)) return;
  trackedEvents.add(eventKey);

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
        step: options.step,
        attribution: readAttribution(),
      }),
    }).then((response) => {
      if (import.meta.env.DEV && response.status === 404) return;
      if (!response.ok) throw new Error(`Funnel tracking failed (${response.status})`);
    }).catch((error) => console.warn('Unable to record anonymous funnel event', error));
  } catch (error) {
    // Analytics must never block the test when browser storage or networking
    // is unavailable.
    console.warn('Unable to prepare anonymous funnel event', error);
  }
};

/** @deprecated Use trackFunnelEvent with the V1 funnel event names. */
export const trackTestFunnelEvent = trackFunnelEvent;
