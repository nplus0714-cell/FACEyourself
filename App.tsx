
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ZenLayout } from './components/ZenLayout';
import { scoreDailyAwareness, type DailyAwarenessAnswers } from './data/dailyAwarenessQuestions';
import type { DailyAwarenessResult } from './data/dailyAwarenessPreview';
import { saveDailyAwarenessResult } from './services/memberAwarenessJournal';
import { CONTENT_CATALOG, ContentItem } from './data/contentCatalog';
import { FACE_MAP, getFaceCode } from './constants';
import { FaceScores, UserState, DiaryEntry, Language, PersonalityProfile } from './types';
import { signOut, toAuthUser } from './services/authService';
import { getSupabaseClient } from './lib/supabase';
import { claimPendingGuestAssessment } from './services/guestResultClaim';
import { generateDailyAwarenessReflection } from './services/geminiService';
import { hasSurvivalKitEntitlement } from './services/memberEntitlements';
import { recordMemberActivity } from './services/memberActivity';
import { getMemberAssessmentHistory } from './services/memberAssessmentHistory';
import { getBrowserPendingAssessment, isFaceScores } from './services/localAssessmentResult';
import { applyPageMetadata } from './lib/pageMetadata';
import { FEATURE_FLAGS } from './config/featureFlags';
import { trackFunnelEvent } from './services/funnelAnalytics';
import { clearLocalAssessmentProgress } from './services/localAssessmentProgress';
import { FunnelLanding } from './components/FunnelLanding';

// Keep the public funnel lightweight; the existing deeper surfaces load only
// when their routes are visited.
const FaceAssessment = React.lazy(() => import('./components/FaceAssessment').then((module) => ({ default: module.FaceAssessment })));
const FunnelResult = React.lazy(() => import('./components/FunnelResult').then((module) => ({ default: module.FunnelResult })));
const SurvivalGuideLanding = React.lazy(() => import('./components/SurvivalGuideLanding').then((module) => ({ default: module.SurvivalGuideLanding })));
const SurvivalGuideReader = React.lazy(() => import('./components/SurvivalGuideReader').then((module) => ({ default: module.SurvivalGuideReader })));
const PersonalTradingManual = React.lazy(() => import('./components/PersonalTradingManual').then((module) => ({ default: module.PersonalTradingManual })));
const FaceSequentialMockup = React.lazy(() => import('./components/FaceSequentialMockup').then((module) => ({ default: module.FaceSequentialMockup })));
const Dashboard = React.lazy(() => import('./components/Dashboard').then((module) => ({ default: module.Dashboard })));
const RoleGallery = React.lazy(() => import('./components/RoleGallery').then((module) => ({ default: module.RoleGallery })));
const CompatibilityWheel = React.lazy(() => import('./components/CompatibilityWheel').then((module) => ({ default: module.CompatibilityWheel })));
const AboutFace = React.lazy(() => import('./components/AboutFace').then((module) => ({ default: module.AboutFace })));
const CoachProfile = React.lazy(() => import('./components/CoachProfile').then((module) => ({ default: module.CoachProfile })));
const ContentHub = React.lazy(() => import('./components/ContentHub').then((module) => ({ default: module.ContentHub })));
const ContentDetail = React.lazy(() => import('./components/ContentDetail').then((module) => ({ default: module.ContentDetail })));
const MirrorTrade = React.lazy(() => import('./components/MirrorTrade').then((module) => ({ default: module.MirrorTrade })));
const ResultPreview = React.lazy(() => import('./components/ResultPreview').then((module) => ({ default: module.ResultPreview })));
const AuthDialog = React.lazy(() => import('./components/AuthDialog').then((module) => ({ default: module.AuthDialog })));
const MemberHome = React.lazy(() => import('./components/MemberHome').then((module) => ({ default: module.MemberHome })));
const MemberWorkspace = React.lazy(() => import('./components/MemberWorkspace').then((module) => ({ default: module.MemberWorkspace })));
const ResearchAdmin = React.lazy(() => import('./components/ResearchAdmin').then((module) => ({ default: module.ResearchAdmin })));
const DailyAwarenessCheckIn = React.lazy(() => import('./components/DailyAwarenessCheckIn').then((module) => ({ default: module.DailyAwarenessCheckIn })));
const ReadingLayerPrototype = React.lazy(() => import('./components/ReadingLayerPrototype').then((module) => ({ default: module.ReadingLayerPrototype })));
const NotFoundPage = React.lazy(() => import('./components/NotFoundPage').then((module) => ({ default: module.NotFoundPage })));
const LegalPage = React.lazy(() => import('./components/LegalPage').then((module) => ({ default: module.LegalPage })));

const STORAGE_KEY = 'face_zen_diary_v3';
const DAILY_ANSWERS_KEY = 'face-daily-v1-answers';
const DAILY_RESULT_KEY = 'face-daily-v1-result';
const DAILY_AWAITING_LOGIN_KEY = 'face-daily-v1-awaiting-login';

type AppView = 'landing' | 'dna-test' | 'sequential-test-mockup' | 'daily-test' | 'dashboard' | 'history' | 'report-detail' | 'role-gallery' | 'role-detail' | 'compatibility' | 'shared-dashboard' | 'about-face' | 'coach-profile' | 'content-hub' | 'content-detail' | 'survival-kit' | 'survival-guide' | 'survival-guide-full' | 'personal-trading-manual' | 'mirror-trade' | 'result-preview' | 'reading-prototype' | 'member-home' | 'research-admin' | 'privacy' | 'terms' | 'refund-policy' | 'data-deletion' | 'not-found';

const roleCodeFromPath = (path: string): string | null => {
  const prefix = path.startsWith('/types/')
    ? '/types/'
    : path.startsWith('/share/')
      ? '/share/'
      : null;
  if (!prefix) return null;

  try {
    const code = decodeURIComponent(path.slice(prefix.length))
      .replace(/\/+$/, '')
      .toUpperCase();
    return FACE_MAP[code]?.code ?? null;
  } catch {
    return null;
  }
};

const viewFromPath = (path: string): AppView => {
  if (path === '/privacy') return 'privacy';
  if (path === '/terms') return 'terms';
  if (path === '/refund-policy') return 'refund-policy';
  if (path === '/data-deletion') return 'data-deletion';
  if (path === '/my-result') return 'dashboard';
  if (path === '/journal/history') return 'history';
  if (path === '/preview-results') return 'result-preview';
  if (path === '/reading-prototype') return 'reading-prototype';
  if (path === '/daily-awareness-result') return 'member-home';
  if (path === '/deep-dive') return FEATURE_FLAGS.dailyAwareness ? 'daily-test' : 'member-home';
  if (path === '/research-admin') return 'research-admin';
  if (path === '/me') return 'member-home';
  if (path === '/mirror-trade') return 'mirror-trade';
  if (path === '/types/compatibility') return 'compatibility';
  if (path.startsWith('/types/') || path.startsWith('/share/')) {
    return roleCodeFromPath(path) ? 'role-detail' : 'not-found';
  }
  if (path === '/types') return 'role-gallery';
  if (path.startsWith('/watch/')) {
    const slug = path.slice('/watch/'.length);
    return CONTENT_CATALOG.some((item) => item.slug === slug && item.status === 'published') ? 'content-detail' : 'not-found';
  }
  if (path === '/watch') return 'content-hub';
  if (path === '/survival-kit') return 'survival-kit';
  if (path === '/guide') return 'survival-guide';
  if (path === '/guide/line') return 'survival-guide-full';
  if (path === '/manual') return 'personal-trading-manual';
  if (path === '/test') return 'dna-test';
  if (path === '/test-mockup') return 'sequential-test-mockup';
  if (path === '/daily-awareness') return FEATURE_FLAGS.dailyAwareness ? 'daily-test' : 'member-home';
  if (path === '/about') return 'about-face';
  if (path === '/coach') return 'coach-profile';
  if (path === '/') return 'landing';
  return 'not-found';
};

const pathForView = (view: AppView) => ({
  landing: '/',
  'dna-test': '/test',
  'sequential-test-mockup': '/test-mockup',
  'daily-test': '/daily-awareness',
  'about-face': '/about',
  'coach-profile': '/coach',
  'role-gallery': '/types',
  compatibility: '/types/compatibility',
  'content-hub': '/watch',
  'survival-kit': '/survival-kit',
  'survival-guide': '/guide',
  'survival-guide-full': '/guide/line',
  'personal-trading-manual': '/manual',
  'mirror-trade': '/mirror-trade',
  'result-preview': '/preview-results',
  'reading-prototype': '/reading-prototype',
  'research-admin': '/research-admin',
  'member-home': '/me',
  privacy: '/privacy',
  terms: '/terms',
  'refund-policy': '/refund-policy',
  'data-deletion': '/data-deletion',
  dashboard: '/my-result',
  history: '/journal/history',
  'not-found': window.location.pathname,
}[view]);

const App: React.FC = () => {
  const [state, setState] = useState<UserState>({ user: null, dna: null, history: [], tempDaily: null });
  const [view, setView] = useState<AppView>(() => viewFromPath(window.location.pathname));
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);
  const [sharedDna, setSharedDna] = useState<FaceScores | null>(null);
  const [language, setLanguage] = useState<Language>('zh');
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(() => {
    const slug = window.location.pathname.replace('/watch/', '');
    return CONTENT_CATALOG.find((item) => item.slug === slug) ?? null;
  });
  const [selectedRoleCode, setSelectedRoleCode] = useState<string | null>(() => {
    return roleCodeFromPath(window.location.pathname);
  });
  const [previewResultCode, setPreviewResultCode] = useState<string | null>(() => new URLSearchParams(window.location.search).get('type'));
  const [pendingDailyAwareness, setPendingDailyAwareness] = useState<DailyAwarenessAnswers | null>(() => {
    try { return JSON.parse(sessionStorage.getItem(DAILY_ANSWERS_KEY) ?? 'null') as DailyAwarenessAnswers | null; }
    catch { return null; }
  });
  const [pendingDailyResult, setPendingDailyResult] = useState<DailyAwarenessResult | null>(() => {
    try { return JSON.parse(sessionStorage.getItem(DAILY_RESULT_KEY) ?? 'null') as DailyAwarenessResult | null; }
    catch { return null; }
  });
  const [showDailyResultAfterLogin, setShowDailyResultAfterLogin] = useState(() => sessionStorage.getItem(DAILY_AWAITING_LOGIN_KEY) === '1');
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isAuthResolved, setIsAuthResolved] = useState(false);
  const [hasSurvivalKitAccess, setHasSurvivalKitAccess] = useState(false);
  const [isLocalStateHydrated, setIsLocalStateHydrated] = useState(false);
  const [isMemberResultLoading, setIsMemberResultLoading] = useState(false);
  const [hydratedMemberId, setHydratedMemberId] = useState<string | null>(null);
  const [memberResultError, setMemberResultError] = useState(false);
  const recordedActivityRef = useRef(new Set<string>());
  
  const navigateTo = (nextView: AppView) => {
    const path = pathForView(nextView);
    if (path && window.location.pathname !== path) window.history.pushState({}, '', path);
    setView(nextView);
  };

  const restoreBaselineScores = useCallback(async (): Promise<FaceScores | null> => {
    if (state.dna) return state.dna;

    const browserResult = getBrowserPendingAssessment();
    if (browserResult) {
      setState((previous) => ({ ...previous, dna: browserResult.scores }));
      return browserResult.scores;
    }

    try {
      const records = await getMemberAssessmentHistory();
      const latest = records[0];
      if (!latest) return null;
      const baseline: DiaryEntry = {
        id: latest.id,
        date: latest.completedAt,
        scores: latest.scores,
        marketScenario: '24 題基準測驗',
        isBaseline: true,
      };
      setState((previous) => ({
        ...previous,
        dna: latest.scores,
        history: previous.history.some((entry) => entry.id === latest.id)
          ? previous.history
          : [baseline, ...previous.history],
      }));
      return latest.scores;
    } catch (error) {
      console.warn('Unable to restore the baseline assessment for FACE Daily', error);
      return null;
    }
  }, [state.dna]);

  const clearPendingDailyAwareness = () => {
    setPendingDailyAwareness(null);
    setPendingDailyResult(null);
    setShowDailyResultAfterLogin(false);
    sessionStorage.removeItem(DAILY_ANSWERS_KEY);
    sessionStorage.removeItem(DAILY_RESULT_KEY);
    sessionStorage.removeItem(DAILY_AWAITING_LOGIN_KEY);
  };

  const openContent = (item: ContentItem) => {
    setSelectedContent(item);
    const path = `/watch/${item.slug}`;
    if (window.location.pathname !== path) window.history.pushState({}, '', path);
    setView('content-detail');
  };

  const openRole = (role: PersonalityProfile) => {
    setSelectedRoleCode(role.code);
    const path = `/types/${role.code}`;
    if (window.location.pathname !== path) window.history.pushState({}, '', path);
    setView('role-detail');
  };

  const openResultPreview = (code: string) => {
    window.history.pushState({}, '', `/preview-results?type=${code}`);
    setPreviewResultCode(code);
    setView('result-preview');
  };

  const backToResultPreviewList = () => {
    window.history.pushState({}, '', '/preview-results');
    setPreviewResultCode(null);
    setView('result-preview');
  };

  useEffect(() => {
    if (['/deep-dive', '/daily-awareness-result'].includes(window.location.pathname)) {
      const destination = FEATURE_FLAGS.dailyAwareness && window.location.pathname === '/deep-dive'
        ? '/daily-awareness'
        : '/me';
      window.history.replaceState({}, '', destination);
      setView(FEATURE_FLAGS.dailyAwareness && destination === '/daily-awareness' ? 'daily-test' : 'member-home');
    }
    if (!FEATURE_FLAGS.dailyAwareness && window.location.pathname === '/daily-awareness') {
      window.history.replaceState({}, '', '/me');
      setView('member-home');
    }
    if (window.location.pathname === '/reading-prototype') {
      const requestedCode = new URLSearchParams(window.location.search).get('type');
      const code = requestedCode && FACE_MAP[requestedCode] ? requestedCode : null;
      const destination = code ? `/types/${code}` : '/types';
      window.history.replaceState({}, '', destination);
      setSelectedRoleCode(code);
      setView(code ? 'role-detail' : 'role-gallery');
    }
    if (window.location.pathname === '/test-mockup' && import.meta.env.PROD) {
      window.history.replaceState({}, '', '/test');
      setView('dna-test');
    }
    if (window.location.pathname === '/preview-results' && import.meta.env.PROD) {
      const requestedCode = new URLSearchParams(window.location.search).get('type');
      const code = requestedCode && FACE_MAP[requestedCode] ? requestedCode : null;
      const destination = code ? `/types/${code}` : '/types';
      window.history.replaceState({}, '', destination);
      setSelectedRoleCode(code);
      setView(code ? 'role-detail' : 'role-gallery');
    }
    const handlePopState = () => {
      const nextView = viewFromPath(window.location.pathname);
      if (nextView === 'content-detail') {
        const slug = window.location.pathname.replace('/watch/', '');
        setSelectedContent(CONTENT_CATALOG.find((item) => item.slug === slug) ?? null);
      }
      if (nextView === 'role-detail') {
        setSelectedRoleCode(roleCodeFromPath(window.location.pathname));
      }
      if (nextView === 'result-preview') {
        setPreviewResultCode(new URLSearchParams(window.location.search).get('type'));
      }
      if (nextView === 'not-found') {
        setSelectedContent(null);
        setSelectedRoleCode(null);
      }
      setView(nextView);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // This is a single-page app, so route changes do not reset the browser's
  // scroll position by default. Every view transition should begin at the top.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [view]);

  useEffect(() => {
    if (view === 'dna-test') trackFunnelEvent('quiz_landing_view');
  }, [view]);

  useEffect(() => {
    applyPageMetadata({
      path: window.location.pathname,
      profile: view === 'role-detail' && selectedRoleCode ? FACE_MAP[selectedRoleCode] : null,
      content: view === 'content-detail' ? selectedContent : null,
      isNotFound: view === 'not-found',
    });
  }, [selectedContent, selectedRoleCode, view]);

  useEffect(() => {
    // 檢查是否有分享連結
    const urlParams = new URLSearchParams(window.location.search);
    const dnaShare = urlParams.get('dna_share');
    if (dnaShare) {
      try {
        const parts = dnaShare.split('_');
        const scores: any = {};
        parts.forEach(p => {
          const key = p[0];
          const val = parseInt(p.substring(1));
          if (key && !isNaN(val)) scores[key] = val;
        });
        if (Object.keys(scores).length >= 8) {
          setSharedDna(scores as FaceScores);
          setView('shared-dashboard');
          return;
        }
      } catch (e) {
        console.error("Failed to parse shared DNA", e);
      }
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) as Partial<UserState> : null;
      const pending = getBrowserPendingAssessment();
      setState((previous) => ({
        ...previous,
        dna: !parsed?.user && isFaceScores(parsed?.dna) ? parsed.dna : pending?.scores ?? previous.dna,
        history: !parsed?.user && Array.isArray(parsed?.history) ? parsed.history : previous.history,
        tempDaily: isFaceScores(parsed?.tempDaily) ? parsed.tempDaily : null,
      }));
    } catch (error) {
      console.warn('Unable to restore the local FACE result', error);
      const pending = getBrowserPendingAssessment();
      if (pending) setState((previous) => ({ ...previous, dna: pending.scores }));
    } finally {
      setIsLocalStateHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isLocalStateHydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); 
  }, [isLocalStateHydrated, state]);

  useEffect(() => {
    if (!isLocalStateHydrated || !isAuthResolved || !state.user) return;
    let active = true;
    const memberId = state.user.id;
    setIsMemberResultLoading(true);
    setMemberResultError(false);
    void (async () => {
      try {
        await claimPendingGuestAssessment();
      } catch (error) {
        console.warn('Unable to claim the guest result yet', error);
      }
      try {
        const records = await getMemberAssessmentHistory();
        if (!active) return;
        const latest = records[0];
        const history: DiaryEntry[] = records.map((record) => ({
          id: record.id,
          date: record.completedAt,
          scores: record.scores,
          marketScenario: '24 題基準測驗',
          isBaseline: true,
        }));
        setState((previous) => previous.user?.id === memberId ? {
          ...previous,
          dna: latest?.scores ?? previous.dna,
          history,
        } : previous);
        setHydratedMemberId(memberId);
      } catch (error) {
        console.warn('Unable to restore the latest member assessment', error);
        if (active) setMemberResultError(true);
      } finally {
        if (active) setIsMemberResultLoading(false);
      }
    })();
    return () => { active = false; };
  }, [isAuthResolved, isLocalStateHydrated, state.user?.id]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    try {
      const supabase = getSupabaseClient();

      void supabase.auth.getSession().then(({ data }) => {
        const authUser = data.session ? toAuthUser(data.session.user) : null;
        setState((previous) => {
          if (previous.user?.id === authUser?.id) return previous;
          const comingFromGuest = !previous.user && !!authUser;
          return { ...previous, user: authUser, dna: comingFromGuest ? previous.dna : null, history: comingFromGuest ? previous.history : [], tempDaily: null };
        });
        if (authUser) {
          const activityKey = `session_restored:${authUser.id}`;
          if (!recordedActivityRef.current.has(activityKey)) {
            recordedActivityRef.current.add(activityKey);
            void recordMemberActivity('session_restored', authUser.id).catch((error) => console.warn('Unable to record restored session', error));
          }
          void hasSurvivalKitEntitlement()
            .then(setHasSurvivalKitAccess)
            .catch((error) => console.warn('Unable to load member entitlement', error));
        } else {
          setHasSurvivalKitAccess(false);
          setIsMemberResultLoading(false);
          setHydratedMemberId(null);
        }
      }).catch((error) => console.warn('Unable to restore the auth session', error))
        .finally(() => setIsAuthResolved(true));

      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        const authUser = session ? toAuthUser(session.user) : null;
        setState((previous) => {
          if (previous.user?.id === authUser?.id) return previous;
          const comingFromGuest = !previous.user && !!authUser;
          return { ...previous, user: authUser, dna: comingFromGuest ? previous.dna : null, history: comingFromGuest ? previous.history : [], tempDaily: null };
        });
        setIsAuthResolved(true);
        if (authUser) {
          setIsAuthDialogOpen(false);
          if (showDailyResultAfterLogin && pendingDailyAwareness && pendingDailyResult) {
            const today = new Date().toLocaleDateString('en-CA');
            void saveDailyAwarenessResult(today, pendingDailyResult, pendingDailyAwareness)
              .then(() => {
                clearPendingDailyAwareness();
                navigateTo('member-home');
              })
              .catch((error) => console.warn('Unable to save daily awareness result', error));
          }
          if (event === 'SIGNED_IN') {
            const activityKey = `signed_in:${authUser.id}`;
            if (!recordedActivityRef.current.has(activityKey)) {
              recordedActivityRef.current.add(activityKey);
              void recordMemberActivity('signed_in', authUser.id).catch((error) => console.warn('Unable to record sign in', error));
            }
          }
          void hasSurvivalKitEntitlement()
            .then(setHasSurvivalKitAccess)
            .catch((error) => console.warn('Unable to refresh member entitlement', error));
        } else {
          setHasSurvivalKitAccess(false);
          setIsMemberResultLoading(false);
          setHydratedMemberId(null);
        }
      });
      unsubscribe = () => data.subscription.unsubscribe();
    } catch (error) {
      console.warn('Supabase Auth is not configured yet', error);
      setIsAuthResolved(true);
    }

    return () => unsubscribe?.();
  }, [showDailyResultAfterLogin, pendingDailyAwareness, pendingDailyResult]);

  const handleLogin = () => setIsAuthDialogOpen(true);

  const handleLogout = async () => {
    try {
      if (state.user) {
        await recordMemberActivity('signed_out', state.user.id).catch((error) => console.warn('Unable to record sign out', error));
        recordedActivityRef.current.delete(`signed_in:${state.user.id}`);
        recordedActivityRef.current.delete(`session_restored:${state.user.id}`);
      }
      await signOut();
    } catch (error) {
      console.error('Unable to sign out', error);
    } finally {
      setState((previous) => ({ ...previous, user: null, dna: null, history: [], tempDaily: null }));
      setIsMemberResultLoading(false);
      setHydratedMemberId(null);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleDnaComplete = (scores: FaceScores) => {
    const baseline: DiaryEntry = { 
      id: 'dna-' + Date.now(), 
      date: new Date().toLocaleDateString('zh-TW'), 
      scores, 
      marketScenario: language === 'zh' ? "24 題基準測驗" : "24-Question Baseline Test",
      isBaseline: true 
    };
    setState(p => ({ ...p, dna: scores, history: [baseline, ...p.history] }));
    navigateTo('dashboard');
  };

  const handleDailyComplete = (scores: FaceScores) => {
    setState(p => ({ ...p, tempDaily: scores }));
    navigateTo('dashboard');
  };

  useEffect(() => {
    const paymentStatus = new URLSearchParams(window.location.search).get('payment');
    if (paymentStatus !== 'success' || !state.user) return undefined;
    let active = true;
    let attempts = 0;
    const refresh = async () => {
      attempts += 1;
      try {
        const entitled = await hasSurvivalKitEntitlement();
        if (!active) return;
        setHasSurvivalKitAccess(entitled);
        if (!entitled && attempts < 6) window.setTimeout(() => void refresh(), 1500);
      } catch (error) {
        console.warn('Unable to verify payment entitlement yet', error);
        if (active && attempts < 6) window.setTimeout(() => void refresh(), 1500);
      }
    };
    void refresh();
    return () => { active = false; };
  }, [state.user]);

  const completeDailyAwareness = async (answers: DailyAwarenessAnswers) => {
    const baselineScores = await restoreBaselineScores();
    if (!baselineScores) {
      alert('找不到你的 24 題 FACE 人格結果。請先完成 FACE 測驗，再進行每日覺察。');
      navigateTo('dna-test');
      return;
    }

    setPendingDailyAwareness(answers);
    sessionStorage.setItem(DAILY_ANSWERS_KEY, JSON.stringify(answers));
    const scoredResult = scoreDailyAwareness(answers, getFaceCode(baselineScores));
    const generatedReflection = await generateDailyAwarenessReflection(answers);
    const dailyResult: DailyAwarenessResult = {
      ...scoredResult,
      reflectionText: generatedReflection ?? scoredResult.inferredMindset,
    };
    setPendingDailyResult(dailyResult);
    sessionStorage.setItem(DAILY_RESULT_KEY, JSON.stringify(dailyResult));
    if (!state.user) {
      setShowDailyResultAfterLogin(true);
      sessionStorage.setItem(DAILY_AWAITING_LOGIN_KEY, '1');
      setIsAuthDialogOpen(true);
      return;
    }
    try {
      await saveDailyAwarenessResult(new Date().toLocaleDateString('en-CA'), dailyResult, answers);
      clearPendingDailyAwareness();
      navigateTo('member-home');
    } catch (error) {
      console.warn('Unable to save daily awareness result', error);
      alert('今日覺察暫時無法儲存，請稍後再試。');
    }
  };

  const openDailyAwareness = async () => {
    if (!FEATURE_FLAGS.dailyAwareness) {
      navigateTo('member-home');
      return;
    }
    const baselineScores = await restoreBaselineScores();
    if (!baselineScores) {
      alert(language === 'zh' ? '你還沒有完成基準測驗。\n請先完成 24 題交易人格測驗。' : 'You have not completed the baseline test yet.\nPlease finish the 24-question trading style test first.');
      navigateTo('dna-test');
      return;
    }
    window.history.pushState({}, '', '/daily-awareness');
    setView('daily-test');
  };

  const handleRetestDna = () => {
    const confirmMsg = language === 'zh' 
      ? '這會清除你的測驗結果與歷史紀錄，並重新開始。確定嗎？'
      : 'This will clear your test result and history so you can start again. Continue?';
      
    if (window.confirm(confirmMsg)) {
      // 徹底清除狀態，達到「讓網頁忘記儲存紀錄」的效果
      setState(prev => ({ 
        ...prev, 
        dna: null, 
        history: [], 
        tempDaily: null 
      }));
      clearLocalAssessmentProgress();
      // 回到首頁重新開始
      setView('landing');
      
      // 確保 URL 乾淨（如果是從分享連結進來的）
      if (window.location.search.includes('dna_share')) {
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'zh' ? 'en' : 'zh');
  };

  return (
    <>
    <ZenLayout 
      user={state.user} 
      hasDna={!!state.dna} 
      onLogin={handleLogin} 
      onLogout={() => void handleLogout()}
      showNav={isAuthResolved && !!state.user && view !== 'shared-dashboard'}
      showAccountActions={isAuthResolved && !!state.user && view !== 'shared-dashboard'}
      activeView={view}
      onViewChange={(v) => {
        if (v === 'history') {
          alert(language === 'zh' ? '資料開發中，敬請期待' : 'Coming soon...');
          return;
        }
        navigateTo(v as AppView);
      }}
      wide={['landing', 'dashboard', 'role-gallery', 'role-detail', 'compatibility', 'history', 'report-detail', 'shared-dashboard', 'about-face', 'coach-profile', 'content-hub', 'content-detail', 'survival-kit', 'survival-guide', 'survival-guide-full', 'personal-trading-manual', 'mirror-trade', 'result-preview', 'reading-prototype', 'member-home', 'research-admin', 'privacy', 'terms', 'refund-policy', 'data-deletion'].includes(view)}
      isLanding={view === 'landing'}
      language={language}
      onToggleLanguage={toggleLanguage}
    >
      <React.Suspense fallback={<div className="py-24 text-center text-sm tracking-[0.12em] text-[#8C7E6D]" role="status">正在載入…</div>}>
      {view === 'landing' && (
        <FunnelLanding
          hasResult={Boolean(state.dna) && (!state.user || hydratedMemberId === state.user.id)}
          isLoggedIn={Boolean(state.user)}
          onStartTest={() => navigateTo('dna-test')}
          onViewResult={() => navigateTo('dashboard')}
          onOpenMemberHome={() => navigateTo('member-home')}
          onLogin={handleLogin}
        />
      )}

      {view === 'dna-test' && <FaceAssessment onComplete={handleDnaComplete} />}
      {view === 'sequential-test-mockup' && <FaceSequentialMockup onExit={() => navigateTo('landing')} />}
      
      {FEATURE_FLAGS.dailyAwareness && view === 'daily-test' && (
        <DailyAwarenessCheckIn
          onComplete={completeDailyAwareness}
          onExit={() => state.user ? navigateTo('member-home') : state.dna ? navigateTo('dashboard') : navigateTo('landing')}
        />
      )}

      {view === 'dashboard' && state.dna && isAuthResolved && !isMemberResultLoading && (!state.user || hydratedMemberId === state.user.id) && (
        state.user ? (
          <div className="space-y-8">
            <div className="border border-[#D1D1C7] bg-[#FCFBF8] px-6 py-6 sm:px-9">
              <p className="text-xs font-bold tracking-[0.18em] text-[#8C635B]">FACE Trader · 會員深度解讀</p>
              <p className="mt-3 text-sm leading-7 text-[#70665D]">這是你在公開結果頁看到的同一份測驗，現在可以往下看完整人格分析。指南與後續工具也會接續這份結果。</p>
              <button type="button" onClick={() => navigateTo('survival-kit')} className="mt-4 border-b border-[#4A382D] pb-1 text-sm font-bold text-[#4A382D]">接著看交易生存指南 →</button>
            </div>
            <Dashboard
              dna={state.dna}
              daily={state.tempDaily || undefined}
              history={state.history}
              user={state.user}
              onLoginRequest={handleLogin}
              onSave={(report, timestamp) => {
                if (!state.tempDaily) return;
                const entry: DiaryEntry = {
                  id: Date.now().toString(),
                  date: timestamp,
                  scores: state.tempDaily,
                  marketScenario: language === 'zh' ? '每日偏移覺察' : 'Daily Offset Awareness',
                  report,
                };
                setState((previous) => ({ ...previous, history: [entry, ...previous.history], tempDaily: null }));
                navigateTo('history');
              }}
              onGoToGallery={() => navigateTo('role-gallery')}
              onGoToMirrorTrade={() => navigateTo('mirror-trade')}
              onOpenContent={() => navigateTo('content-hub')}
              onOpenPricing={() => navigateTo('survival-kit')}
              onOpenCoach={() => navigateTo('coach-profile')}
              onOpenMemberHome={() => navigateTo('member-home')}
              onOpenCompatibility={() => navigateTo('compatibility')}
              onOpenDeepDive={() => void openDailyAwareness()}
              onStartAwareness={() => void openDailyAwareness()}
              onRetest={handleRetestDna}
              language={language}
            />
          </div>
        ) : <FunnelResult dna={state.dna} onOpenGuide={() => navigateTo('survival-kit')} onLogin={handleLogin} />
      )}

      {view === 'shared-dashboard' && sharedDna && (
        <div className="space-y-8 flex flex-col items-center">
          <div className="text-center space-y-2 py-8">
            <h2 className="text-2xl md:text-3xl serif text-[#2D2D2D]">{language === 'zh' ? '交易人格分享' : 'Trading Personality Shared'}</h2>
            <p className="text-[#8C7E6D] text-[10px] tracking-[0.2em] font-bold uppercase">Shared Trading Style</p>
          </div>
          <Dashboard 
            dna={sharedDna} 
            user={null} 
            onLoginRequest={handleLogin}
            isSharedView={true}
            language={language}
          />
          <div className="pb-24">
            <button 
              onClick={() => {
                window.history.replaceState({}, '', window.location.pathname);
              navigateTo('landing');
              }}
              className="px-12 py-5 bg-[#2D2D2D] text-white text-[12px] tracking-[0.6em] uppercase font-black shadow-2xl hover:bg-black transition-all"
            >
              {language === 'zh' ? '我也要做交易人格測驗' : 'Take the trading style test'}
            </button>
          </div>
        </div>
      )}

      {view === 'about-face' && <AboutFace onGoToMirrorTrade={() => navigateTo('mirror-trade')} onOpenCoach={() => navigateTo('coach-profile')} onStartTest={() => navigateTo('dna-test')} onExploreTypes={() => navigateTo('role-gallery')} onOpenContent={() => navigateTo('content-hub')} />}
      {view === 'coach-profile' && <CoachProfile onStartTest={() => navigateTo('dna-test')} onBackToAbout={() => navigateTo('about-face')} />}
      {view === 'mirror-trade' && <MirrorTrade user={state.user} onLogin={handleLogin} />}
      {view === 'member-home' && !FEATURE_FLAGS.dailyAwareness && state.user && <MemberWorkspace userName={state.user.name} hasAssessmentResult={!!state.dna && hydratedMemberId === state.user.id} onViewResult={() => navigateTo('dashboard')} onStartTest={() => navigateTo('dna-test')} onOpenGuide={() => navigateTo('survival-kit')} onOpenContent={() => navigateTo('content-hub')} onOpenGallery={() => navigateTo('role-gallery')} onOpenMirrorTrade={() => navigateTo('mirror-trade')} />}
      {view === 'member-home' && !FEATURE_FLAGS.dailyAwareness && !state.user && <div className="mx-auto max-w-xl py-24 text-center"><p className="text-sm leading-8 text-[#70665D]">登入後可接續測驗結果、完整人格分析與會員內容。</p><button type="button" onClick={handleLogin} className="mt-8 bg-[#2D2D2D] px-8 py-4 text-sm font-bold text-white">登入我的 FACE</button></div>}
      {view === 'member-home' && FEATURE_FLAGS.dailyAwareness && state.user && <MemberHome user={state.user} dna={state.dna} onViewResult={() => navigateTo('dashboard')} onStartTest={() => navigateTo('dna-test')} onStartAwareness={() => void openDailyAwareness()} onOpenContent={() => navigateTo('content-hub')} onNicknameChange={(nickname) => setState((previous) => previous.user ? { ...previous, user: { ...previous.user, name: nickname } } : previous)} hasSurvivalKitAccess={hasSurvivalKitAccess} />}
      {view === 'member-home' && FEATURE_FLAGS.dailyAwareness && !state.user && <div className="mx-auto max-w-xl py-24 text-center"><p className="text-sm leading-8 text-[#70665D]">登入後可以保存測驗結果、回看變化，並使用 RATE 鏡相診股。</p><button type="button" onClick={handleLogin} className="mt-8 bg-[#2D2D2D] px-8 py-4 text-sm font-bold text-white">登入並保存結果</button></div>}
      {view === 'result-preview' && <ResultPreview selectedCode={previewResultCode} onSelectCode={openResultPreview} onBackToList={backToResultPreviewList} language={language} onOpenDeepDive={() => openDailyAwareness()} onStartAwareness={openDailyAwareness} onRetest={() => navigateTo('dna-test')} />}
      {view === 'reading-prototype' && <ReadingLayerPrototype showPrototypeControls={!!state.user} previewOnly={!state.user} onUnlock={handleLogin} />}
      {view === 'research-admin' && state.user && <ResearchAdmin />}
      {view === 'research-admin' && !state.user && <div className="mx-auto max-w-xl py-24 text-center"><p className="text-sm leading-8 text-[#70665D]">研究後台僅開放管理者帳號。請先登入。</p><button type="button" onClick={handleLogin} className="mt-8 bg-[#2D2D2D] px-8 py-4 text-sm font-bold text-white">管理者登入</button></div>}
      {view === 'content-hub' && (
        <ContentHub
          hasDna={!!state.dna}
          isLoggedIn={!!state.user}
          hasSurvivalKitAccess={hasSurvivalKitAccess}
          language={language}
          onStartTest={() => navigateTo('dna-test')}
          onViewResult={() => state.dna ? navigateTo('dashboard') : navigateTo('dna-test')}
          onLoginRequest={handleLogin}
          onOpenPricing={() => navigateTo('personal-trading-manual')}
          onOpenContent={openContent}
        />
      )}

      {view === 'dashboard' && (!isLocalStateHydrated || !isAuthResolved || isMemberResultLoading || (!!state.user && hydratedMemberId !== state.user.id && !memberResultError)) && (
        <section className="mx-auto max-w-2xl py-28 text-center" role="status" aria-live="polite">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border border-[#CFC6B8] border-t-[#8C635B]" aria-hidden="true" />
          <p className="mt-6 text-sm leading-7 text-[#70665D]">正在找回你的 FACE 測驗結果…</p>
        </section>
      )}

      {view === 'dashboard' && state.user && memberResultError && !isMemberResultLoading && <section className="mx-auto max-w-2xl border border-[#B98A83] bg-[#F8EFED] px-7 py-14 text-center"><h1 className="serif text-3xl text-[#2D2D2D]">暫時無法讀取會員結果</h1><p className="mt-4 text-sm leading-7 text-[#70665D]">你的資料沒有被清除。請稍後重新整理，或確認網路連線。</p></section>}
      {view === 'dashboard' && isLocalStateHydrated && isAuthResolved && !isMemberResultLoading && !memberResultError && (!state.user || hydratedMemberId === state.user.id) && !state.dna && (
        <section className="mx-auto max-w-2xl border border-[#D1D1C7] bg-[#FCFBF8] px-7 py-20 text-center sm:px-12">
          <p className="text-xs font-medium tracking-[0.24em] text-[#8C635B]">MY FACE</p>
          <h1 className="mt-5 serif text-4xl leading-[1.4] text-[#2D2D2D] sm:text-5xl">尚未完成 FACE 測驗</h1>
          <p className="mx-auto mt-6 max-w-lg text-base leading-8 text-[#70665D]">
            完成 24 題後，這裡會立即顯示你的交易人格、優勢與容易卡住的地方。
          </p>
          <div className="mt-9 flex justify-center">
            <button type="button" onClick={() => navigateTo('dna-test')} className="bg-[#2D2D2D] px-8 py-4 text-sm font-medium text-white transition hover:bg-black">
              開始 FACE 測驗 →
            </button>
          </div>
        </section>
      )}
      {view === 'content-detail' && selectedContent && <ContentDetail item={selectedContent} isLoggedIn={!!state.user} hasSurvivalKitAccess={hasSurvivalKitAccess} onBack={() => navigateTo('content-hub')} onLoginRequest={handleLogin} onOpenPricing={() => navigateTo('personal-trading-manual')} onOpenContent={openContent} onStartTest={() => navigateTo('dna-test')} />}
      {view === 'survival-kit' && <SurvivalGuideLanding />}
      {view === 'survival-guide' && <SurvivalGuideReader onOpenManual={() => navigateTo('personal-trading-manual')} />}
      {view === 'survival-guide-full' && <SurvivalGuideReader fullFree onOpenManual={() => navigateTo('personal-trading-manual')} />}
      {view === 'personal-trading-manual' && <PersonalTradingManual isLoggedIn={!!state.user} onLogin={handleLogin} onOpenMemberHome={() => navigateTo('member-home')} />}

      {view === 'history' && (
        <div className="space-y-12 fade-in pb-40">
          <h2 className="text-5xl serif text-[#2D2D2D] border-b border-[#D1D1C7] pb-8">{language === 'zh' ? '覺察軌跡' : 'Awareness Track'}</h2>
          <div className="grid grid-cols-1 gap-8">
            {state.history.map(h => (
              <div key={h.id} className="bg-white p-8 rounded-xl border border-[#D1D1C7] flex justify-between items-center shadow-sm hover:border-[#2D2D2D] transition-all group">
                <div>
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-[10px] font-mono font-black text-[#8C7E6D] uppercase tracking-widest">{h.date}</span>
                    {h.isBaseline && <span className="bg-[#2D2D2D] text-white px-3 py-1 text-[8px] uppercase tracking-widest font-bold">DNA Baseline</span>}
                  </div>
                  <h4 className="text-xl serif font-bold text-[#2D2D2D]">{h.isBaseline ? (language === 'zh' ? '24 題基準測驗' : 'Baseline test') : (language === 'zh' ? '今日交易回顧' : 'Daily check-in')}</h4>
                </div>
                <button onClick={() => { setSelectedEntry(h); setView('report-detail'); }} className="px-8 py-3 bg-[#2D2D2D] text-white text-[10px] tracking-widest uppercase font-bold rounded-sm group-hover:bg-black transition-all">檢視詳情 View</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'report-detail' && selectedEntry && state.dna && (
        <Dashboard dna={state.dna} daily={selectedEntry.scores} history={state.history} staticReport={selectedEntry.report} user={state.user} onLoginRequest={handleLogin} language={language} onRetest={handleRetestDna} />
      )}
      
      {view === 'role-gallery' && <RoleGallery dna={state.dna} onOpenRole={openRole} onStartTest={() => navigateTo('dna-test')} onOpenMyFace={() => state.dna && navigateTo('dashboard')} />}
      {view === 'role-detail' && selectedRoleCode && FACE_MAP[selectedRoleCode] && (
        <ReadingLayerPrototype
          key={selectedRoleCode}
          profileCode={selectedRoleCode}
          showPrototypeControls={false}
          isUserType={!!state.dna && getFaceCode(state.dna) === selectedRoleCode}
          onBack={() => navigateTo('role-gallery')}
          previewOnly={!state.user}
          onUnlock={handleLogin}
        />
      )}
      {view === 'compatibility' && <CompatibilityWheel dna={state.dna} initialCode={new URLSearchParams(window.location.search).get('type')} onOpenRole={openRole} onStartTest={() => navigateTo('dna-test')} />}
      {view === 'privacy' && <LegalPage kind="privacy" />}
      {view === 'terms' && <LegalPage kind="terms" />}
      {view === 'refund-policy' && <LegalPage kind="refund" />}
      {view === 'data-deletion' && <LegalPage kind="data-deletion" />}
      {view === 'not-found' && <NotFoundPage onHome={() => navigateTo('landing')} onExploreTypes={() => navigateTo('role-gallery')} onOpenContent={() => navigateTo('content-hub')} />}
      </React.Suspense>
    </ZenLayout>
    {isAuthDialogOpen && <React.Suspense fallback={null}><AuthDialog onClose={() => setIsAuthDialogOpen(false)} /></React.Suspense>}
    </>
  );
};

export default App;
