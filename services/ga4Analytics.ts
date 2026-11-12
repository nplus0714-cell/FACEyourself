import { isPublishedContentSlug } from '../data/contentCatalogRoutes';
import { FACE_MAP } from '../constants';
import { readCampaignAttribution } from '../lib/campaignAttribution';

type Consent = 'granted' | 'denied';
type PageParameters = { page_location: string; page_referrer: string; page_title: string };
type GoogleTagWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
} & Partial<Record<`ga-disable-${string}`, boolean>>;

const consentKey = 'face_ga4_consent_v1';
const measurementId = import.meta.env.VITE_GA4_MEASUREMENT_ID?.trim() ?? '';
export const ga4Configured = /^G-[A-Z0-9]{5,20}$/.test(measurementId)
  && typeof window !== 'undefined' && window.location.hostname === 'faceyourself.vercel.app';

const publicPaths = new Set([
  '/', '/test', '/my-result', '/types', '/types/compatibility', '/watch', '/survival-kit',
  '/guide', '/guide/line', '/manual', '/about', '/coach', '/privacy',
]);
const quizEvents = new Set(['quiz_start', 'quiz_question_progress', 'quiz_complete']);

export function isMeasuredPath(path: string): boolean {
  return publicPaths.has(path)
    || (path.startsWith('/watch/') && isPublishedContentSlug(path.slice(7)))
    || (/^\/types\/[a-z]{4}$/i.test(path) && Object.hasOwn(FACE_MAP, path.slice(7).toUpperCase()));
}

const gaWindow = globalThis as unknown as GoogleTagWindow;
const disableKey = `ga-disable-${measurementId}` as const;
const campaign = ga4Configured ? readCampaignAttribution(new URLSearchParams(location.search)) : {};
let entryReferrer = '';
try {
  const referrer = new URL(document.referrer);
  if (['http:', 'https:'].includes(referrer.protocol) && referrer.origin !== location.origin) {
    entryReferrer = `${referrer.origin}/`;
  }
} catch { /* No referrer is a valid entry. */ }

function readSavedConsent(): Consent | null {
  if (!ga4Configured) return null;
  try {
    const saved = localStorage.getItem(consentKey);
    return saved === 'granted' || saved === 'denied' ? saved : null;
  } catch { return null; }
}

let consent = readSavedConsent();
export const readAnalyticsConsent = (): Consent | null => consent;
let tagInitialized = false;
let lastPath: string | null = null;
let previousPage = '';
let firstPage = true;
let currentPage: PageParameters | undefined;

const advertisingDenied = {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
} as const;

function initializeTag(page: PageParameters) {
  gaWindow.dataLayer ??= [];
  gaWindow.gtag ??= function () { gaWindow.dataLayer!.push(arguments); };
  gaWindow.gtag('consent', 'default', { ...advertisingDenied, analytics_storage: 'denied' });
  gaWindow.gtag('consent', 'update', { ...advertisingDenied, analytics_storage: 'granted' });
  gaWindow.gtag('js', new Date());
  gaWindow.gtag('config', measurementId, {
    ...page,
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
  const script = document.createElement('script');
  script.async = true;
  script.referrerPolicy = 'no-referrer';
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);
  tagInitialized = true;
}

export function trackGa4Page(path: string): void {
  if (!ga4Configured || consent !== 'granted') return;
  if (!isMeasuredPath(path)) {
    gaWindow[disableKey] = true;
    lastPath = null;
    return;
  }
  if (path === lastPath) return;

  gaWindow[disableKey] = false;
  const pageUrl = new URL(path, location.origin);
  if (firstPage) {
    for (const [key, value] of Object.entries(campaign)) pageUrl.searchParams.set(`utm_${key}`, value);
  }
  const page: PageParameters = {
    page_location: pageUrl.href,
    page_referrer: firstPage ? entryReferrer : previousPage,
    page_title: path === '/test' ? 'FACE 交易人格測驗' : 'FACE Trader 知己交易',
  };

  if (!tagInitialized) initializeTag(page);
  gaWindow.gtag?.('set', page);
  const parameters = { ...page, send_to: measurementId };
  gaWindow.gtag?.('event', 'page_view', parameters);
  if (path === '/test') gaWindow.gtag?.('event', 'quiz_landing_view', parameters);
  currentPage = page;
  lastPath = path;
  previousPage = `${location.origin}${path}`;
  firstPage = false;
}

export function trackGa4QuizEvent(event: string, step?: number): void {
  if (!ga4Configured || consent !== 'granted' || !quizEvents.has(event)) return;
  if (location.pathname !== '/test') return;
  trackGa4Page('/test');
  const parameters: Record<string, string | number> = { ...currentPage, send_to: measurementId };
  if (event === 'quiz_question_progress') {
    if (step === undefined || !Number.isInteger(step) || step < 1 || step > 24) return;
    parameters.question_number = step;
  }
  gaWindow.gtag?.('event', event, parameters);
}

export function setAnalyticsConsent(value: Consent): void {
  if (!ga4Configured || consent === value) return;
  consent = value;
  try { localStorage.setItem(consentKey, value); } catch { /* The choice still applies in this document. */ }
  gaWindow[disableKey] = value === 'denied';
  if (tagInitialized) {
    gaWindow.gtag?.('consent', 'update', { ...advertisingDenied, analytics_storage: value });
  }
  if (value === 'granted') trackGa4Page(location.pathname);
  else lastPath = null;
}
