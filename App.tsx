
import React, { useState, useEffect, useRef } from 'react';
import { ZenLayout } from './components/ZenLayout';
import { FaceAssessment } from './components/FaceAssessment';
import { FaceSequentialMockup } from './components/FaceSequentialMockup';
import { Dashboard } from './components/Dashboard';
import { RoleGallery } from './components/RoleGallery';
import { CompatibilityWheel } from './components/CompatibilityWheel';
import { AboutFace } from './components/AboutFace';
import { CoachProfile } from './components/CoachProfile';
import { ContentHub } from './components/ContentHub';
import { ContentDetail } from './components/ContentDetail';
import { SurvivalKitPricing } from './components/SurvivalKitPricing';
import { LandingInfo } from './components/LandingInfo';
import { MirrorTrade } from './components/MirrorTrade';
import { ResultPreview } from './components/ResultPreview';
import { AuthDialog } from './components/AuthDialog';
import { MemberHome } from './components/MemberHome';
import { LastAssessmentCard } from './components/LastAssessmentCard';
import { ResearchAdmin } from './components/ResearchAdmin';
import { DailyAwarenessCheckIn } from './components/DailyAwarenessCheckIn';
import { DailyAwarenessResultPreview } from './components/DailyAwarenessResultPreview';
import { ReadingLayerPrototype } from './components/ReadingLayerPrototype';
import { NotFoundPage } from './components/NotFoundPage';
import { LegalPage } from './components/LegalPage';
import { scoreDailyAwareness, type DailyAwarenessAnswers } from './data/dailyAwarenessQuestions';
import type { DailyAwarenessResult } from './data/dailyAwarenessPreview';
import { saveDailyAwarenessResult } from './services/memberAwarenessJournal';
import { CONTENT_CATALOG, ContentItem } from './data/contentCatalog';
import { FACE_MAP, getFaceCode } from './constants';
import { FaceScores, UserState, DiaryEntry, Language, PersonalityProfile } from './types';
import { translations } from './i18n';
import { signOut, toAuthUser } from './services/authService';
import { getSupabaseClient } from './lib/supabase';
import { claimPendingGuestAssessment } from './services/guestResultClaim';
import { generateDailyAwarenessReflection } from './services/geminiService';
import { hasSurvivalKitEntitlement } from './services/memberEntitlements';
import { recordMemberActivity } from './services/memberActivity';
import { getMemberAssessmentHistory } from './services/memberAssessmentHistory';
import { getBrowserPendingAssessment, isFaceScores } from './services/localAssessmentResult';
import { applyPageMetadata } from './lib/pageMetadata';

const STORAGE_KEY = 'face_zen_diary_v3';

type AppView = 'landing' | 'dna-test' | 'sequential-test-mockup' | 'daily-test' | 'daily-result' | 'dashboard' | 'history' | 'report-detail' | 'role-gallery' | 'role-detail' | 'compatibility' | 'shared-dashboard' | 'about-face' | 'coach-profile' | 'content-hub' | 'content-detail' | 'survival-kit' | 'mirror-trade' | 'result-preview' | 'reading-prototype' | 'member-home' | 'research-admin' | 'privacy' | 'terms' | 'refund-policy' | 'data-deletion' | 'not-found';

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
  if (path === '/daily-awareness-result') return 'daily-result';
  if (path === '/deep-dive') return 'daily-test';
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
  if (path === '/test') return 'dna-test';
  if (path === '/test-mockup') return 'sequential-test-mockup';
  if (path === '/daily-awareness') return 'daily-test';
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
  'daily-result': '/daily-awareness-result',
  'about-face': '/about',
  'coach-profile': '/coach',
  'role-gallery': '/types',
  compatibility: '/types/compatibility',
  'content-hub': '/watch',
  'survival-kit': '/survival-kit',
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
  const [pendingDailyAwareness, setPendingDailyAwareness] = useState<DailyAwarenessAnswers | null>(null);
  const [pendingDailyResult, setPendingDailyResult] = useState<DailyAwarenessResult | null>(() => {
    try { return JSON.parse(sessionStorage.getItem('face-daily-v1-result') ?? 'null') as DailyAwarenessResult | null; }
    catch { return null; }
  });
  const [showDailyResultAfterLogin, setShowDailyResultAfterLogin] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [hasSurvivalKitAccess, setHasSurvivalKitAccess] = useState(false);
  const [isLocalStateHydrated, setIsLocalStateHydrated] = useState(false);
  const [isMemberResultLoading, setIsMemberResultLoading] = useState(false);
  const claimedGuestResultRef = useRef(false);
  const recordedActivityRef = useRef(new Set<string>());
  
  const t = translations[language];

  const navigateTo = (nextView: AppView) => {
    const path = pathForView(nextView);
    if (path && window.location.pathname !== path) window.history.pushState({}, '', path);
    setView(nextView);
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
    if (window.location.pathname === '/deep-dive') {
      window.history.replaceState({}, '', '/daily-awareness');
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
        dna: isFaceScores(parsed?.dna) ? parsed.dna : pending?.scores ?? previous.dna,
        history: Array.isArray(parsed?.history) ? parsed.history : previous.history,
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
    let active = true;
    if (!isLocalStateHydrated || !state.user || state.dna || view !== 'dashboard') return () => { active = false; };

    setIsMemberResultLoading(true);
    void getMemberAssessmentHistory()
      .then((records) => {
        if (!active || !records[0]) return;
        const latest = records[0];
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
      })
      .catch((error) => console.warn('Unable to restore the latest member assessment', error))
      .finally(() => { if (active) setIsMemberResultLoading(false); });

    return () => { active = false; };
  }, [isLocalStateHydrated, state.dna, state.user?.id, view]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    try {
      const supabase = getSupabaseClient();

      void supabase.auth.getSession().then(({ data }) => {
        const authUser = data.session ? toAuthUser(data.session.user) : null;
        setState((previous) => (
          previous.user?.id === authUser?.id ? previous : { ...previous, user: authUser }
        ));
        if (authUser && !claimedGuestResultRef.current) {
          claimedGuestResultRef.current = true;
          void claimPendingGuestAssessment().catch((error) => console.warn('Unable to claim the guest result yet', error));
        } else if (!authUser) {
          claimedGuestResultRef.current = false;
        }
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
        }
      });

      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        const authUser = session ? toAuthUser(session.user) : null;
        setState((previous) => (
          previous.user?.id === authUser?.id ? previous : { ...previous, user: authUser }
        ));
        if (authUser) {
          setIsAuthDialogOpen(false);
          if (showDailyResultAfterLogin && pendingDailyAwareness) {
            const dailyResult = pendingDailyResult ?? scoreDailyAwareness(pendingDailyAwareness, state.dna ? getFaceCode(state.dna) : 'ARTC');
            const today = new Date().toLocaleDateString('en-CA');
            void saveDailyAwarenessResult(today, dailyResult, pendingDailyAwareness)
              .then(() => navigateTo('daily-result'))
              .catch((error) => console.warn('Unable to save daily awareness result', error));
            setShowDailyResultAfterLogin(false);
          }
          if (!claimedGuestResultRef.current) {
            claimedGuestResultRef.current = true;
            void claimPendingGuestAssessment().catch((error) => console.warn('Unable to claim the guest result yet', error));
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
          claimedGuestResultRef.current = false;
          setHasSurvivalKitAccess(false);
        }
      });
      unsubscribe = () => data.subscription.unsubscribe();
    } catch (error) {
      console.warn('Supabase Auth is not configured yet', error);
    }

    return () => unsubscribe?.();
  }, [showDailyResultAfterLogin, pendingDailyAwareness, pendingDailyResult, state.dna]);

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
      setState((previous) => ({ ...previous, user: null }));
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
    setPendingDailyAwareness(answers);
    const scoredResult = scoreDailyAwareness(answers, state.dna ? getFaceCode(state.dna) : 'ARTC');
    const generatedReflection = await generateDailyAwarenessReflection(answers);
    const dailyResult: DailyAwarenessResult = {
      ...scoredResult,
      reflectionText: generatedReflection ?? scoredResult.inferredMindset,
    };
    setPendingDailyResult(dailyResult);
    sessionStorage.setItem('face-daily-v1-result', JSON.stringify(dailyResult));
    if (!state.user) {
      setShowDailyResultAfterLogin(true);
      setIsAuthDialogOpen(true);
      return;
    }
    try {
      await saveDailyAwarenessResult(new Date().toLocaleDateString('en-CA'), dailyResult, answers);
      navigateTo('daily-result');
    } catch (error) {
      console.warn('Unable to save daily awareness result', error);
      alert('今日覺察暫時無法儲存，請稍後再試。');
    }
  };

  const openDailyAwareness = () => {
    window.history.pushState({}, '', '/daily-awareness');
    setView('daily-test');
  };

  const startDailyAwareness = () => {
    if (!state.dna) {
      alert(language === 'zh' ? '你還沒有完成基準測驗。\n請先完成 24 題交易人格測驗。' : 'You have not completed the baseline test yet.\nPlease finish the 24-question trading style test first.');
      navigateTo('landing');
      return;
    }
    
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
      showNav={view !== 'shared-dashboard'}
      activeView={view}
      onViewChange={(v) => {
        if (v === 'history') {
          alert(language === 'zh' ? '資料開發中，敬請期待' : 'Coming soon...');
          return;
        }
        navigateTo(v as AppView);
      }}
      wide={['landing', 'dashboard', 'role-gallery', 'role-detail', 'compatibility', 'history', 'report-detail', 'shared-dashboard', 'about-face', 'coach-profile', 'content-hub', 'content-detail', 'survival-kit', 'mirror-trade', 'result-preview', 'reading-prototype', 'member-home', 'research-admin', 'privacy', 'terms', 'refund-policy', 'data-deletion'].includes(view)}
      isLanding={view === 'landing'}
      language={language}
      onToggleLanguage={toggleLanguage}
    >
      {view === 'landing' && <>
        {new URLSearchParams(window.location.search).get('payment') && (
          <div className={`mb-8 border px-5 py-4 text-sm leading-7 ${new URLSearchParams(window.location.search).get('payment') === 'success' ? 'border-[#78947A] bg-[#EEF4EE] text-[#314D35]' : 'border-[#B98A83] bg-[#F8EFED] text-[#75463F]'}`} role="status">
            {new URLSearchParams(window.location.search).get('payment') === 'success'
              ? hasSurvivalKitAccess
                ? '付款已完成，FACE 交易生存指南與付費工具權益已綁定到你的會員帳號。'
                : '付款已完成，系統正在核對並開通你的會員權益。'
              : new URLSearchParams(window.location.search).get('payment') === 'cancelled'
                ? '你已返回 FACE，這筆付款尚未完成。'
                : '付款未完成或驗證失敗，請重新操作；若已扣款請先聯絡我們確認。'}
          </div>
        )}
        <div className="-mx-4 fade-in sm:-mx-6 md:mx-0">
          <section className="relative isolate min-h-[760px] overflow-hidden border-y border-[#CFC6B8] bg-[#F6F1E9] sm:min-h-[850px] lg:min-h-[880px] lg:border">
            <div className="absolute inset-x-0 bottom-0 h-[38%] overflow-hidden sm:h-[48%] lg:h-[62%]" aria-hidden="true">
              <img
                src="/images/homepage-trading-salon.png"
                alt=""
                className="absolute inset-0 h-full w-full scale-[1.03] object-cover object-[52%_center] opacity-70 mix-blend-multiply saturate-[0.82] contrast-[0.92]"
              />
              <span className="absolute inset-0 bg-[linear-gradient(to_bottom,#F6F1E9_0%,rgba(246,241,233,0.96)_8%,rgba(246,241,233,0.72)_24%,rgba(246,241,233,0.18)_52%,rgba(246,241,233,0.04)_76%)]" />
              <span className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(246,241,233,0.48)_100%)]" />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,253,248,0.9),transparent_45%)]" aria-hidden="true" />

            <div className="relative z-10 flex flex-col items-center px-6 pb-72 pt-12 text-center sm:px-12 sm:pb-80 sm:pt-16 lg:mx-auto lg:max-w-5xl lg:px-14 lg:pb-[22rem] lg:pt-20 xl:px-20">
              <p className="text-[10px] font-bold tracking-[0.28em] text-[#8C635B] sm:text-xs">FACE · TRADING SELF-AWARENESS</p>

              <h1 className="mt-6 max-w-[22rem] serif text-[1.75rem] leading-[1.62] text-[#2D2D2D] sm:max-w-2xl sm:text-[2.65rem] sm:leading-[1.55] lg:mt-8 lg:max-w-3xl lg:text-[3.25rem] lg:leading-[1.48] xl:text-[3.55rem]">
                {String(t.landing.title).split('\n').map((line: string, index: number) => (
                  <span key={line} className={index === 0 ? 'block' : 'mt-1 block sm:mt-2'}>{line}</span>
                ))}
              </h1>

              <div className="my-7 flex items-center gap-3 text-[#B59E7B] sm:my-8" aria-hidden="true">
                <span className="h-px w-10 bg-current sm:w-14" />
                <span className="h-2 w-2 rotate-45 border border-current" />
                <span className="h-px w-10 bg-current sm:w-14" />
              </div>

              <div className="max-w-[21rem] text-[15px] leading-[2] text-[#625A53] sm:max-w-xl sm:text-lg sm:leading-[2.05] lg:max-w-lg">
                <p className="font-medium text-[#4B433D]">{t.landing.motto}</p>
                {String(t.landing.supportingLine).split('\n').map((line: string) => <p key={line}>{line}</p>)}
              </div>

              <div className="mt-8 w-full max-w-[21rem] sm:mt-10 sm:max-w-sm lg:max-w-md">
                {!state.dna ? (
                  <button
                    type="button"
                    onClick={() => navigateTo('dna-test')}
                    className="group flex min-h-14 w-full items-center justify-center gap-5 border border-[#4A382D] bg-[#4A382D] px-7 py-4 text-base font-bold tracking-[0.12em] text-white shadow-[0_12px_30px_rgba(74,56,45,0.18)] transition hover:bg-[#34261F] focus-visible:outline-[#8C635B] sm:min-h-16 sm:text-lg"
                  >
                    <span>{t.landing.startTest}</span>
                    <span className="text-2xl font-light transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
                  </button>
                ) : (
                  <div className="grid gap-3">
                    <button
                      type="button"
                      onClick={startDailyAwareness}
                      className="min-h-14 w-full border border-[#8C635B] bg-[#8C635B] px-6 py-4 text-base font-bold tracking-[0.1em] text-white transition hover:bg-[#754F48]"
                    >
                      {t.landing.todayAwareness}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateTo('dashboard')}
                      className="min-h-12 w-full border border-[#4A382D] bg-white/70 px-6 py-3 text-sm font-bold tracking-[0.1em] text-[#2D2D2D] transition hover:bg-white"
                    >
                      {t.landing.dashboard}
                    </button>
                  </div>
                )}

                <div className="mt-4">
                  <LastAssessmentCard
                    user={state.user}
                    localScores={state.dna}
                    localCompletedAt={state.history.find((entry) => entry.isBaseline)?.date}
                    onViewResult={(scores) => {
                      setState((previous) => ({ ...previous, dna: scores, tempDaily: null }));
                      navigateTo('dashboard');
                    }}
                  />
                </div>
              </div>
            </div>

          </section>
        </div>
        <LandingInfo
          onStartTest={() => navigateTo('dna-test')}
          onExploreTypes={() => navigateTo('role-gallery')}
          onOpenContent={() => navigateTo('content-hub')}
          onAbout={() => navigateTo('about-face')}
          isLoggedIn={!!state.user}
          hasSurvivalKitAccess={hasSurvivalKitAccess}
          onRequireLogin={handleLogin}
          onOpenMemberHome={() => navigateTo('member-home')}
        />
      </>}

      {view === 'dna-test' && <FaceAssessment onComplete={handleDnaComplete} />}
      {view === 'sequential-test-mockup' && <FaceSequentialMockup onExit={() => navigateTo('landing')} />}
      
      {view === 'daily-test' && (
        <DailyAwarenessCheckIn
          onComplete={completeDailyAwareness}
          onExit={() => state.user ? navigateTo('member-home') : state.dna ? navigateTo('dashboard') : navigateTo('landing')}
        />
      )}

      {view === 'daily-result' && pendingDailyResult && (
        <DailyAwarenessResultPreview
          result={pendingDailyResult}
          faceCode={state.dna ? getFaceCode(state.dna) : pendingDailyResult.faceCode}
          onBack={() => navigateTo('daily-test')}
          onOpenJournal={() => navigateTo('member-home')}
        />
      )}

      {view === 'daily-result' && !pendingDailyResult && (
        <div className="mx-auto max-w-2xl py-28 text-center fade-in"><h1 className="serif text-4xl text-[#2D2D2D]">今天還沒有完成每日照鏡</h1><p className="mt-5 leading-8 text-[#70665D]">完成八題後，這裡才會出現今天的覺察結果。</p><button type="button" onClick={() => navigateTo('daily-test')} className="mt-8 bg-[#8C635B] px-7 py-4 text-sm font-bold text-white">開始今日照鏡</button></div>
      )}

      {view === 'dashboard' && state.dna && (
        <div className="space-y-6">
          <div className="flex justify-end mb-4">
             <button onClick={startDailyAwareness} className="px-8 py-3 bg-[#8C635B] text-white text-[12px] tracking-[0.4em] uppercase font-black rounded-sm shadow-lg hover:bg-[#7D5A50] transition-all">
                {language === 'zh' ? '進行今日覺察 Today Check-in' : 'Today Check-in'}
             </button>
          </div>
          <Dashboard 
            dna={state.dna} 
            daily={state.tempDaily || undefined} 
            history={state.history}
            user={state.user} 
            onLoginRequest={handleLogin} 
            onSave={(report, ts) => {
              if (!state.tempDaily) return;
              const entry: DiaryEntry = { 
                id: Date.now().toString(), 
                date: ts, 
                scores: state.tempDaily, 
                marketScenario: language === 'zh' ? "每日偏移覺察" : "Daily Offset Awareness",
                report 
              };
              setState(p => ({ ...p, history: [entry, ...p.history], tempDaily: null }));
              setView('history');
            }} 
            onGoToGallery={() => navigateTo('role-gallery')}
            onGoToMirrorTrade={() => navigateTo('mirror-trade')}
            onOpenContent={() => navigateTo('content-hub')}
            onOpenMemberHome={() => navigateTo('member-home')}
            onOpenCompatibility={() => navigateTo('compatibility')}
            onOpenDeepDive={() => openDailyAwareness()}
            onStartAwareness={openDailyAwareness}
            onRetest={handleRetestDna}
            language={language}
          />
        </div>
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
            onLoginRequest={() => {}} 
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

      {view === 'about-face' && <AboutFace onGoToMirrorTrade={() => navigateTo('mirror-trade')} onOpenCoach={() => navigateTo('coach-profile')} />}
      {view === 'coach-profile' && <CoachProfile onStartTest={() => navigateTo('dna-test')} onBackToAbout={() => navigateTo('about-face')} />}
      {view === 'mirror-trade' && <MirrorTrade user={state.user} onLogin={handleLogin} />}
      {view === 'member-home' && state.user && <MemberHome user={state.user} dna={state.dna} onViewResult={() => navigateTo('dashboard')} onStartTest={() => navigateTo('dna-test')} onStartAwareness={openDailyAwareness} onOpenContent={() => navigateTo('content-hub')} onNicknameChange={(nickname) => setState((previous) => previous.user ? { ...previous, user: { ...previous.user, name: nickname } } : previous)} hasSurvivalKitAccess={hasSurvivalKitAccess} />}
      {view === 'member-home' && !state.user && <div className="mx-auto max-w-xl py-24 text-center"><p className="text-sm leading-8 text-[#70665D]">登入後可以保存測驗結果、回看變化，並使用 RATE 鏡相診股。</p><button type="button" onClick={handleLogin} className="mt-8 bg-[#2D2D2D] px-8 py-4 text-sm font-bold text-white">登入並保存結果</button></div>}
      {view === 'result-preview' && <ResultPreview selectedCode={previewResultCode} onSelectCode={openResultPreview} onBackToList={backToResultPreviewList} language={language} onOpenDeepDive={() => openDailyAwareness()} onStartAwareness={openDailyAwareness} onRetest={() => navigateTo('dna-test')} />}
      {view === 'reading-prototype' && <ReadingLayerPrototype />}
      {view === 'research-admin' && state.user && <ResearchAdmin />}
      {view === 'research-admin' && !state.user && <div className="mx-auto max-w-xl py-24 text-center"><p className="text-sm leading-8 text-[#70665D]">研究後台僅開放管理者帳號。請先登入。</p><button type="button" onClick={handleLogin} className="mt-8 bg-[#2D2D2D] px-8 py-4 text-sm font-bold text-white">管理者登入</button></div>}
      {view === 'content-hub' && (
        <ContentHub
          hasDna={!!state.dna}
          isLoggedIn={!!state.user}
          language={language}
          onStartTest={() => navigateTo('dna-test')}
          onViewResult={() => state.dna ? navigateTo('dashboard') : navigateTo('dna-test')}
          onLoginRequest={handleLogin}
          onOpenPricing={() => navigateTo('survival-kit')}
          onOpenContent={openContent}
        />
      )}

      {view === 'dashboard' && (!isLocalStateHydrated || isMemberResultLoading) && (
        <section className="mx-auto max-w-2xl py-28 text-center" role="status" aria-live="polite">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border border-[#CFC6B8] border-t-[#8C635B]" aria-hidden="true" />
          <p className="mt-6 text-sm leading-7 text-[#70665D]">正在找回你的 FACE 測驗結果…</p>
        </section>
      )}

      {view === 'dashboard' && isLocalStateHydrated && !isMemberResultLoading && !state.dna && (
        <section className="mx-auto max-w-2xl border border-[#D1D1C7] bg-[#FCFBF8] px-7 py-20 text-center sm:px-12">
          <p className="text-xs font-medium tracking-[0.24em] text-[#8C635B]">MY FACE</p>
          <h1 className="mt-5 serif text-4xl leading-[1.4] text-[#2D2D2D] sm:text-5xl">尚未完成 FACE 測驗</h1>
          <p className="mx-auto mt-6 max-w-lg text-base leading-8 text-[#70665D]">
            完成 24 題後，這裡會顯示你的交易人格與四個決策面向。若你曾用其他帳號作答，請先登入正確帳號。
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <button type="button" onClick={() => navigateTo('dna-test')} className="bg-[#2D2D2D] px-8 py-4 text-sm font-medium text-white transition hover:bg-black">
              開始 FACE 測驗 →
            </button>
            {!state.user && <button type="button" onClick={handleLogin} className="border border-[#8C7E6D] bg-white px-8 py-4 text-sm font-medium text-[#4A382D] transition hover:bg-[#F3F0EB]">
              登入找回結果
            </button>}
          </div>
        </section>
      )}
      {view === 'content-detail' && selectedContent && <ContentDetail item={selectedContent} isLoggedIn={!!state.user} onBack={() => navigateTo('content-hub')} onLoginRequest={handleLogin} onOpenPricing={() => navigateTo('survival-kit')} onOpenContent={openContent} onStartTest={() => navigateTo('dna-test')} />}
      {view === 'survival-kit' && <section className="mx-auto max-w-6xl pb-28 pt-4 fade-in md:pt-10">
        <button type="button" onClick={() => navigateTo('content-hub')} className="text-sm font-medium text-[#70665D] transition hover:text-[#2D2D2D]">← 回到內容中心</button>
        <header className="mx-auto max-w-3xl pb-10 pt-12 text-center md:pb-14 md:pt-16">
          <p className="text-xs font-medium tracking-[0.28em] text-[#8C635B]">FACE PAID PLAN</p>
          <h1 className="mt-5 serif text-4xl leading-[1.45] text-[#2D2D2D] md:text-6xl">FACE 交易生存指南</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-[2] text-[#70665D] md:text-lg">從公開文章建立觀念，再把它整理成適合你這一型的交易使用說明書。</p>
        </header>
        <SurvivalKitPricing
          isLoggedIn={!!state.user}
          hasAccess={hasSurvivalKitAccess}
          onRequireLogin={handleLogin}
          onOpenMemberAccess={() => navigateTo('member-home')}
        />
      </section>}

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
        />
      )}
      {view === 'compatibility' && <CompatibilityWheel dna={state.dna} initialCode={new URLSearchParams(window.location.search).get('type')} onOpenRole={openRole} onStartTest={() => navigateTo('dna-test')} />}
      {view === 'privacy' && <LegalPage kind="privacy" />}
      {view === 'terms' && <LegalPage kind="terms" />}
      {view === 'refund-policy' && <LegalPage kind="refund" />}
      {view === 'data-deletion' && <LegalPage kind="data-deletion" />}
      {view === 'not-found' && <NotFoundPage onHome={() => navigateTo('landing')} onExploreTypes={() => navigateTo('role-gallery')} onOpenContent={() => navigateTo('content-hub')} />}
    </ZenLayout>
    {isAuthDialogOpen && <AuthDialog onClose={() => setIsAuthDialogOpen(false)} />}
    </>
  );
};

export default App;
