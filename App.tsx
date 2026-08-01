
import React, { useState, useEffect, useRef } from 'react';
import { ZenLayout } from './components/ZenLayout';
import { Assessment } from './components/Assessment';
import { FaceAssessment } from './components/FaceAssessment';
import { Dashboard } from './components/Dashboard';
import { RoleGallery } from './components/RoleGallery';
import { RoleDetail } from './components/RoleDetail';
import { CompatibilityWheel } from './components/CompatibilityWheel';
import { ZenDnaChart } from './components/ZenDnaChart';
import { AboutFace } from './components/AboutFace';
import { CoachProfile } from './components/CoachProfile';
import { ContentHub } from './components/ContentHub';
import { ContentDetail } from './components/ContentDetail';
import { LandingInfo } from './components/LandingInfo';
import { MirrorTrade } from './components/MirrorTrade';
import { ResultPreview } from './components/ResultPreview';
import { AuthDialog } from './components/AuthDialog';
import { MemberHome } from './components/MemberHome';
import { CONTENT_CATALOG, ContentItem } from './data/contentCatalog';
import { DAILY_QUESTIONS, FACE_MAP, getFaceCode } from './constants';
import { FaceScores, UserState, DiaryEntry, Language, PersonalityProfile } from './types';
import { generateMarketAwareQuestions } from './services/geminiService';
import { translations } from './i18n';
import { signOut, toAuthUser } from './services/authService';
import { getSupabaseClient } from './lib/supabase';
import { claimPendingGuestAssessment } from './services/guestResultClaim';

const STORAGE_KEY = 'face_zen_diary_v3';

type AppView = 'landing' | 'dna-test' | 'daily-test' | 'dashboard' | 'history' | 'report-detail' | 'role-gallery' | 'role-detail' | 'compatibility' | 'shared-dashboard' | 'about-face' | 'coach-profile' | 'content-hub' | 'content-detail' | 'mirror-trade' | 'result-preview' | 'member-home';

const viewFromPath = (path: string): AppView => {
  if (path === '/preview-results') return 'result-preview';
  if (path === '/me') return 'member-home';
  if (path === '/mirror-trade') return 'mirror-trade';
  if (path === '/types/compatibility') return 'compatibility';
  if (path.startsWith('/types/')) return 'role-detail';
  if (path === '/types') return 'role-gallery';
  if (path.startsWith('/watch/')) return 'content-detail';
  if (path === '/watch') return 'content-hub';
  if (path === '/test') return 'dna-test';
  if (path === '/about') return 'about-face';
  if (path === '/coach') return 'coach-profile';
  return 'landing';
};

const pathForView = (view: AppView) => ({
  landing: '/',
  'dna-test': '/test',
  'about-face': '/about',
  'coach-profile': '/coach',
  'role-gallery': '/types',
  compatibility: '/types/compatibility',
  'content-hub': '/watch',
  'mirror-trade': '/mirror-trade',
  'result-preview': '/preview-results',
  'member-home': '/me',
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
    const code = window.location.pathname.replace('/types/', '');
    return FACE_MAP[code]?.code ?? null;
  });
  const [previewResultCode, setPreviewResultCode] = useState<string | null>(() => new URLSearchParams(window.location.search).get('type'));
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const claimedGuestResultRef = useRef(false);
  
  const [dynamicDailyQuestions, setDynamicDailyQuestions] = useState<any[]>(DAILY_QUESTIONS);
  const [isFetchingQuestions, setIsFetchingQuestions] = useState(false);

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
    const handlePopState = () => {
      const nextView = viewFromPath(window.location.pathname);
      if (nextView === 'content-detail') {
        const slug = window.location.pathname.replace('/watch/', '');
        setSelectedContent(CONTENT_CATALOG.find((item) => item.slug === slug) ?? null);
      }
      if (nextView === 'role-detail') {
        const code = window.location.pathname.replace('/types/', '');
        setSelectedRoleCode(FACE_MAP[code]?.code ?? null);
      }
      if (nextView === 'result-preview') {
        setPreviewResultCode(new URLSearchParams(window.location.search).get('type'));
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

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState(parsed);
        // 如果有 DNA，且當前是 landing 則自動進 Dashboard
        if (parsed.dna && window.location.pathname === '/' && !dnaShare) setView('dashboard');
      } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => { 
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); 
  }, [state]);

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
      });

      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        const authUser = session ? toAuthUser(session.user) : null;
        setState((previous) => (
          previous.user?.id === authUser?.id ? previous : { ...previous, user: authUser }
        ));
        if (authUser) {
          setIsAuthDialogOpen(false);
          if (!claimedGuestResultRef.current) {
            claimedGuestResultRef.current = true;
            void claimPendingGuestAssessment().catch((error) => console.warn('Unable to claim the guest result yet', error));
          }
        } else {
          claimedGuestResultRef.current = false;
        }
      });
      unsubscribe = () => data.subscription.unsubscribe();
    } catch (error) {
      console.warn('Supabase Auth is not configured yet', error);
    }

    return () => unsubscribe?.();
  }, []);

  const handleLogin = () => setIsAuthDialogOpen(true);

  const handleLogout = async () => {
    try {
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
      marketScenario: language === 'zh' ? "40 題基準測驗" : "40-Question Baseline Test",
      isBaseline: true 
    };
    setState(p => ({ ...p, dna: scores, history: [baseline, ...p.history] }));
    setView('dashboard');
  };

  const handleDailyComplete = (scores: FaceScores) => {
    setState(p => ({ ...p, tempDaily: scores }));
    setView('dashboard');
  };

  const startDailyAwareness = async () => {
    if (!state.dna) {
      alert(language === 'zh' ? '你還沒有完成基準測驗。\n請先完成 40 題交易人格測驗。' : 'You have not completed the baseline test yet.\nPlease finish the 40-question trading style test first.');
      setView('landing');
      return;
    }
    
    setIsFetchingQuestions(true);
    setView('daily-test');
    
    try {
      const dynamicQs = await generateMarketAwareQuestions();
      if (dynamicQs && dynamicQs.length > 0) {
        setDynamicDailyQuestions(dynamicQs);
      } else {
        setDynamicDailyQuestions(DAILY_QUESTIONS);
      }
    } catch (e) {
      console.error(e);
      setDynamicDailyQuestions(DAILY_QUESTIONS);
    } finally {
      setIsFetchingQuestions(false);
    }
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
      wide={['dashboard', 'role-gallery', 'role-detail', 'compatibility', 'history', 'report-detail', 'shared-dashboard', 'about-face', 'coach-profile', 'content-hub', 'content-detail', 'mirror-trade', 'result-preview', 'member-home'].includes(view)}
      isLanding={view === 'landing'}
      language={language}
      onToggleLanguage={toggleLanguage}
    >
      {view === 'landing' && <>
        <div className="relative min-h-[62vh] md:min-h-[72vh] flex flex-col items-center justify-center fade-in px-0 sm:px-6">
          <ZenDnaChart />
          
          <div className="relative z-10 flex flex-col items-center space-y-7 md:space-y-10 max-w-4xl mx-auto w-full text-center">
            <h1 className="text-center text-3xl md:text-5xl lg:text-6xl serif text-[#2D2D2D] tracking-tight leading-[1.75] md:leading-[1.68] font-normal whitespace-pre-line">
              {t.landing.title}
            </h1>
            
            <p className="mx-auto max-w-3xl text-center text-[#8C7E6D] text-3xl md:text-4xl tracking-wide font-medium leading-[1.7]">
              {t.landing.motto}
            </p>
            <p className="mx-auto max-w-3xl -translate-y-2 text-center text-[#6F6258] text-[34px] md:text-[44px] tracking-wide leading-[1.7]">
              {t.landing.supportingLine}
            </p>

            <div className="w-full max-w-lg mx-auto">
              {!state.dna ? (
                <button 
                  onClick={() => navigateTo('dna-test')} 
                  className="w-full py-6 md:py-7 bg-[#2D2D2D] text-white text-[16px] font-bold rounded-sm shadow-xl hover:bg-black transition-all flex flex-col items-center justify-center leading-none"
                >
                  <span className="tracking-wide serif">{t.landing.startTest}</span>
                  <span className="text-[10px] tracking-[0.28em] opacity-60 mt-3 font-mono font-light">{t.landing.dnaTest}</span>
                </button>
              ) : (
                <div className="flex flex-col gap-4">
                  <button 
                    onClick={startDailyAwareness} 
                    className="w-full py-7 bg-[#8C635B] text-white text-[16px] uppercase font-bold rounded-sm shadow-xl hover:bg-[#7D5A50] transition-all flex flex-col items-center justify-center leading-none"
                  >
                    <span className="tracking-[0.6em] pl-[0.6em] serif">{t.landing.todayAwareness}</span>
                    <span className="text-[11px] tracking-[1.2em] opacity-70 mt-4 pl-[1.2em] font-mono font-light">{t.landing.today}</span>
                  </button>
                  <button 
                    onClick={() => setView('dashboard')} 
                    className="w-full py-5 bg-white border border-[#2D2D2D] text-[#2D2D2D] text-[12px] tracking-[0.6em] uppercase font-bold hover:bg-[#FBFBFA] transition-all pl-[0.6em]"
                  >
                    {t.landing.dashboard}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <LandingInfo
          onStartTest={() => navigateTo('dna-test')}
          onExploreTypes={() => setView('role-gallery')}
          onOpenContent={() => navigateTo('content-hub')}
          onAbout={() => navigateTo('about-face')}
        />
      </>}

      {view === 'dna-test' && <FaceAssessment onComplete={handleDnaComplete} />}
      
      {view === 'daily-test' && (
        isFetchingQuestions ? (
          <div className="py-40 flex flex-col items-center justify-center space-y-8 fade-in">
            <div className="relative w-24 h-24">
               <div className="absolute inset-0 border-4 border-[#D1D1C7] border-t-[#8C635B] rounded-full animate-spin"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] font-black text-[#8C635B] animate-pulse">ZEN</span>
               </div>
            </div>
            <div className="text-center space-y-3">
               <p className="text-[14px] tracking-[0.6em] text-[#2D2D2D] font-bold uppercase">{t.common.loadingQuestions}</p>
               <p className="text-[11px] text-[#8C7E6D] italic">{t.common.zenMotto}</p>
            </div>
          </div>
        ) : (
          <Assessment title={language === 'zh' ? "今日收盤心境覺察" : "Daily Close Mindfulness"} questions={dynamicDailyQuestions} weightPerQuestion={20} onComplete={handleDailyComplete} language={language} />
        )
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
            onGoToGallery={() => setView('role-gallery')}
            onGoToMirrorTrade={() => navigateTo('mirror-trade')}
            onOpenContent={() => navigateTo('content-hub')}
            onOpenMemberHome={() => navigateTo('member-home')}
            onOpenCompatibility={() => navigateTo('compatibility')}
            onRetest={handleRetestDna}
            language={language}
          />
        </div>
      )}

      {view === 'shared-dashboard' && sharedDna && (
        <div className="space-y-8 flex flex-col items-center">
          <div className="text-center space-y-2 py-8">
            <h2 className="text-2xl md:text-3xl serif text-[#2D2D2D]">{language === 'zh' ? '交易風格分享' : 'Trading Style Shared'}</h2>
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
                setView('landing');
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
      {view === 'member-home' && state.user && <MemberHome user={state.user} dna={state.dna} onViewResult={() => navigateTo('dashboard')} onStartTest={() => navigateTo('dna-test')} onOpenRate={() => navigateTo('mirror-trade')} />}
      {view === 'member-home' && !state.user && <div className="mx-auto max-w-xl py-24 text-center"><p className="text-sm leading-8 text-[#70665D]">登入後可以保存測驗結果、回看變化，並使用 RATE 鏡相診股。</p><button type="button" onClick={handleLogin} className="mt-8 bg-[#2D2D2D] px-8 py-4 text-sm font-bold text-white">登入並保存結果</button></div>}
      {view === 'result-preview' && <ResultPreview selectedCode={previewResultCode} onSelectCode={openResultPreview} onBackToList={backToResultPreviewList} language={language} />}
      {view === 'content-hub' && (
        <ContentHub
          hasDna={!!state.dna}
          language={language}
          onStartTest={() => navigateTo('dna-test')}
          onViewResult={() => setView('dashboard')}
          onOpenContent={openContent}
        />
      )}
      {view === 'content-detail' && selectedContent && <ContentDetail item={selectedContent} onBack={() => navigateTo('content-hub')} />}

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
                  <h4 className="text-xl serif font-bold text-[#2D2D2D]">{h.isBaseline ? (language === 'zh' ? '40 題基準測驗' : 'Baseline test') : (language === 'zh' ? '今日交易回顧' : 'Daily check-in')}</h4>
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
      
      {view === 'role-gallery' && <RoleGallery dna={state.dna} onOpenRole={openRole} onStartTest={() => navigateTo('dna-test')} onOpenCompatibility={() => navigateTo('compatibility')} onOpenMyFace={() => navigateTo('member-home')} />}
      {view === 'role-detail' && selectedRoleCode && FACE_MAP[selectedRoleCode] && <RoleDetail role={FACE_MAP[selectedRoleCode]} isUserType={!!state.dna && getFaceCode(state.dna) === selectedRoleCode} onBack={() => navigateTo('role-gallery')} />}
      {view === 'compatibility' && <CompatibilityWheel dna={state.dna} onOpenRole={openRole} onStartTest={() => navigateTo('dna-test')} />}
    </ZenLayout>
    {isAuthDialogOpen && <AuthDialog onClose={() => setIsAuthDialogOpen(false)} />}
    </>
  );
};

export default App;
