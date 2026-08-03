import React, { useRef, useState } from 'react';
import { AuthUser, Language } from '../types';
import { translations } from '../i18n';

interface ZenLayoutProps {
  children: React.ReactNode;
  title?: string;
  wide?: boolean;
  user?: AuthUser | null;
  hasDna?: boolean;
  onLogin?: () => void;
  onLogout?: () => void;
  showNav?: boolean;
  activeView?: string;
  onViewChange?: (view: any) => void;
  isLanding?: boolean;
  language: Language;
  onToggleLanguage: () => void;
}

export const ZenLayout: React.FC<ZenLayoutProps> = ({ 
  children, 
  title, 
  wide, 
  user, 
  hasDna,
  onLogin, 
  onLogout,
  showNav,
  activeView,
  onViewChange,
  language,
  onToggleLanguage
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t = translations[language];

  const openUserMenu = () => {
    if (menuCloseTimer.current) clearTimeout(menuCloseTimer.current);
    setIsMenuOpen(true);
  };

  const closeUserMenuLater = () => {
    if (menuCloseTimer.current) clearTimeout(menuCloseTimer.current);
    // Leave enough time for the pointer to travel from the avatar to the menu.
    menuCloseTimer.current = setTimeout(() => setIsMenuOpen(false), 700);
  };

  const handleLogoClick = () => {
    onViewChange?.('landing');
  };

  const isAssessmentView = activeView === 'dna-test' || activeView === 'daily-test';

  return (
    <div className={`min-h-screen relative flex flex-col items-center transition-colors duration-1000 bg-zen-paper px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-12`}>
      <div className={`${(wide ? 'max-w-6xl' : 'max-w-4xl') + ' w-full'} transition-all duration-500`}>
        
        {/* Header - 質感深度優化 */}
        <header className={`${isAssessmentView ? 'mb-5 md:mb-8' : 'mb-10 md:mb-16'} text-center relative`}>
          <div className="flex justify-between items-center gap-3 mb-7 md:mb-9">
            <div 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={handleLogoClick}
              title="返回首頁"
            >
               {/* ✅ LOGO 放大 */}
               <svg viewBox="0 0 64 72" className="h-14 w-12 shrink-0 overflow-visible text-[#8C635B] transition-transform duration-300 group-hover:scale-105 sm:h-16 sm:w-14" aria-label="FACE mirror chalice mark">
                 <ellipse cx="32" cy="11" rx="22" ry="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                 <path d="M10 11c.4 13.5 5.5 25.4 18 30.5v13.2c0 4.2-3.2 7-8.7 8.4M54 11c-.4 13.5-5.5 25.4-18 30.5v13.2c0 4.2 3.2 7 8.7 8.4" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
                 <path d="M16 64h32" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
                 <path d="M27.5 23c-2.8 1.8-4.2 4.4-4.2 7.4 0 2.2 1 3.8 2.7 5.1l-2.3 1.8 2.7 1.6c.7 2.1 2.1 3.5 4.3 4.2" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.35" />
                 <path d="M36.5 23c2.8 1.8 4.2 4.4 4.2 7.4 0 2.2-1 3.8-2.7 5.1l2.3 1.8-2.7 1.6c-.7 2.1-2.1 3.5-4.3 4.2" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.35" />
               </svg>
               <div className="hidden">
                  {/* ✅ 主標題與副標題字體同步放大 */}
                  <h1 className={`text-xs sm:text-sm font-black tracking-[0.2em] sm:tracking-[0.3em] leading-none text-[#2D2D2D]`}>FACE</h1>
                  <p className={`hidden sm:block text-[11px] tracking-[0.12em] mt-1.5 text-[#8C7E6D] font-medium`}>Trading style journal</p>
               </div>
               <div>
                 <span className="serif block text-[1.9rem] leading-none tracking-[0.16em] text-[#2D2D2D] sm:text-[2.15rem]">FACE</span>
               </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-6">
              {/* Language Switcher - 提升點擊範圍 */}
              <button 
                onClick={onToggleLanguage}
                className="px-3 py-2 sm:px-8 sm:py-2.5 border border-[#D1D1C7] text-xs tracking-[0.12em] sm:tracking-[0.2em] uppercase hover:bg-[#2D2D2D] hover:text-white transition-all font-bold bg-white/50 shadow-sm"
              >
                {language === 'zh' ? 'EN' : '中'}
              </button>

              {user ? (
                <div 
                  className="relative -mb-3 pb-3"
                  onMouseEnter={openUserMenu}
                  onMouseLeave={closeUserMenuLater}
                >
                  <div className="flex items-center gap-3 cursor-pointer p-1.5 rounded-full hover:bg-white/60 transition-all">
                    <div className="text-right hidden md:block px-1">
                      {/* ✅ 用戶名稱放大 */}
                      <p className={`text-xs font-black uppercase tracking-widest text-[#2D2D2D]`}>{user.name}</p>
                    </div>
                    <img 
                      src={user.avatar} 
                      className="w-10 h-10 rounded-full border border-white shadow-md grayscale hover:grayscale-0 transition-all" 
                      alt={user.name} 
                    />
                  </div>
                  
                  <div className={`absolute top-full right-0 z-50 transition-all duration-200 ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 pointer-events-none'}`}>
                    <div className="bg-white border border-[#D1D1C7] shadow-2xl rounded-sm min-w-[180px] overflow-hidden">
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          onViewChange?.('member-home');
                        }}
                        className="w-full text-left px-5 py-4 text-xs tracking-[0.18em] text-[#2D2D2D] hover:bg-[#F3F0EB] transition-colors flex items-center gap-4 font-bold"
                      >
                        我的 FACE
                      </button>
                      <button 
                        onClick={() => {
                          setIsMenuOpen(false);
                          onLogout?.();
                        }}
                        className="w-full text-left px-5 py-4 text-xs tracking-[0.3em] uppercase text-[#A64D4D] hover:bg-[#A64D4D] hover:text-white transition-colors flex items-center gap-4 font-bold"
                      >
                        {t.common.logout}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={onLogin}
                  className="flex items-center gap-0 sm:gap-3 px-3 py-2 sm:px-6 sm:py-3 bg-white border border-[#2D2D2D] text-xs tracking-[0.08em] sm:tracking-[0.3em] uppercase hover:bg-[#2D2D2D] hover:text-white transition-all font-bold shadow-md whitespace-nowrap"
                >
                  {t.common.login}
                </button>
              )}
            </div>
          </div>

          {/* Nav */}
          {showNav && !isAssessmentView && onViewChange && (
            <nav className="mb-8 md:mb-10 flex flex-wrap justify-center gap-x-5 gap-y-4 border-b border-[#D1D1C7]/60 pb-5 text-[15px] font-medium leading-6 tracking-[0.06em] sm:gap-x-8 md:gap-x-12 md:pb-8 md:text-base">
                <button 
                  onClick={() => onViewChange('dna-test')} 
                  className={`whitespace-nowrap hover:text-[#2D2D2D] transition-all pb-1 ${activeView === 'dna-test' ? 'text-[#2D2D2D] font-black border-b-2 border-[#2D2D2D]' : 'text-[#8C7E6D]'}`}
                >
                  開始測驗
                </button>
                <button 
                  onClick={() => onViewChange('role-gallery')} 
                  className={`whitespace-nowrap hover:text-[#2D2D2D] transition-all pb-1 ${activeView === 'role-gallery' ? 'text-[#2D2D2D] font-black border-b-2 border-[#2D2D2D]' : 'text-[#8C7E6D]'}`}
                >
                  {t.nav.gallery}
                </button>
                <button 
                  onClick={() => onViewChange('about-face')} 
                  className={`whitespace-nowrap hover:text-[#2D2D2D] transition-all pb-1 ${activeView === 'about-face' ? 'text-[#2D2D2D] font-black border-b-2 border-[#2D2D2D]' : 'text-[#8C7E6D]'}`}
                >
                  {t.nav.about}
                </button>
                <button 
                  onClick={() => onViewChange('content-hub')} 
                  className={`whitespace-nowrap hover:text-[#2D2D2D] transition-all pb-1 ${activeView === 'content-hub' ? 'text-[#2D2D2D] font-black border-b-2 border-[#2D2D2D]' : 'text-[#8C7E6D]'}`}
                >
                  {t.nav.watch}
                </button>
            </nav>
          )}

          {title && !isAssessmentView && (
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-light tracking-[0.25em] border-b border-[#D1D1C7]/60 pb-6 inline-block serif text-[#2D2D2D]">
                {title}
              </h2>
            </div>
          )}
        </header>

        <main className={`fade-in relative z-10`}>
          {children}
        </main>
      </div>
    </div>
  );
};
