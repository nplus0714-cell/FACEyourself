
import React, { useState, useEffect } from 'react';
import { ZenLayout } from './components/ZenLayout';
import { Assessment } from './components/Assessment';
import { FaceAssessment } from './components/FaceAssessment';
import { Dashboard } from './components/Dashboard';
import { RoleGallery } from './components/RoleGallery';
import { ZenDnaChart } from './components/ZenDnaChart';
import { AboutFace } from './components/AboutFace';
import { WorryFreeBar } from './components/WorryFreeBar';
import { DAILY_QUESTIONS } from './constants';
import { FaceScores, UserState, DiaryEntry, AuthUser, Language } from './types';
import { generateMarketAwareQuestions } from './services/geminiService';
import { translations } from './i18n';

const STORAGE_KEY = 'face_zen_diary_v3';

const App: React.FC = () => {
  const [state, setState] = useState<UserState>({ user: null, dna: null, history: [], tempDaily: null });
  const [view, setView] = useState<'landing' | 'dna-test' | 'daily-test' | 'dashboard' | 'history' | 'report-detail' | 'role-gallery' | 'shared-dashboard' | 'about-face' | 'worry-free-bar'>('landing');
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);
  const [sharedDna, setSharedDna] = useState<FaceScores | null>(null);
  const [language, setLanguage] = useState<Language>('zh');
  
  const [dynamicDailyQuestions, setDynamicDailyQuestions] = useState<any[]>(DAILY_QUESTIONS);
  const [isFetchingQuestions, setIsFetchingQuestions] = useState(false);

  const t = translations[language];

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
        if (parsed.dna && view === 'landing' && !dnaShare) setView('dashboard');
      } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => { 
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); 
  }, [state]);

  const handleLogin = () => {
    const mockUser: AuthUser = {
      id: 'u-' + Date.now(),
      name: language === 'zh' ? 'FACE 使用者' : 'FACE Member',
      email: 'zen@face.diary',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'
    };
    setState(prev => ({ ...prev, user: mockUser }));
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
    <ZenLayout 
      user={state.user} 
      hasDna={!!state.dna} 
      onLogin={handleLogin} 
      onLogout={() => setState(p => ({ ...p, user: null }))}
      showNav={view !== 'landing' && view !== 'shared-dashboard'}
      activeView={view}
      onViewChange={(v) => {
        if (v === 'history') {
          alert(language === 'zh' ? '資料開發中，敬請期待' : 'Coming soon...');
          return;
        }
        setView(v);
      }}
      wide={['dashboard', 'role-gallery', 'history', 'report-detail', 'shared-dashboard', 'about-face', 'worry-free-bar'].includes(view)}
      isLanding={view === 'landing'}
      language={language}
      onToggleLanguage={toggleLanguage}
    >
      {view === 'landing' && (
        <div className="relative min-h-[72vh] md:min-h-[85vh] flex flex-col items-center justify-center fade-in px-0 sm:px-6">
          <ZenDnaChart />
          
          <div className="relative z-10 flex flex-col items-center space-y-7 md:space-y-12 max-w-4xl mx-auto w-full text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl serif text-[#2D2D2D] tracking-tight leading-[1.25] font-normal whitespace-pre-line">
              {t.landing.title}
            </h1>
            
            <p className="max-w-md text-[#8C7E6D] text-sm md:text-[15px] tracking-wide font-medium leading-relaxed">
              {t.landing.motto}
            </p>

            <div className="pt-3 md:pt-8 w-full max-w-lg mx-auto">
              {!state.dna ? (
                <button 
                  onClick={() => setView('dna-test')} 
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

          <div className="absolute bottom-0 left-0 w-full text-center pb-4 md:pb-8 px-2 sm:px-6">
            <p className="text-[#8C7E6D] text-[13px] md:text-[13px] tracking-wide font-medium leading-relaxed max-w-2xl mx-auto opacity-80">
              {t.landing.footer}
            </p>
          </div>
        </div>
      )}

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

      {view === 'about-face' && <AboutFace />}
      {view === 'worry-free-bar' && <WorryFreeBar />}

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
      
      {view === 'role-gallery' && <RoleGallery onBack={() => setView('dashboard')} dna={state.dna} />}
    </ZenLayout>
  );
};

export default App;
