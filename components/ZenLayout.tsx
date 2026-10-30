import React, { useEffect, useRef, useState } from 'react';
import { AuthUser, Language } from '../types';
import { translations } from '../i18n';
import { FaceWordmark } from './FaceWordmark';
import { SiteFooter } from './SiteFooter';

interface ZenLayoutProps {
  children: React.ReactNode;
  title?: string;
  wide?: boolean;
  user?: AuthUser | null;
  hasDna?: boolean;
  onLogin?: () => void;
  onLogout?: () => void;
  showNav?: boolean;
  showAccountActions?: boolean;
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
  showAccountActions = true,
  activeView,
  onViewChange,
  isLanding,
  language,
  onToggleLanguage
}) => {
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const menuCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t = translations[language];

  const openUserMenu = () => {
    if (menuCloseTimer.current) clearTimeout(menuCloseTimer.current);
    setIsAccountMenuOpen(true);
  };

  const closeUserMenuLater = () => {
    if (menuCloseTimer.current) clearTimeout(menuCloseTimer.current);
    // Leave enough time for the pointer to travel from the avatar to the menu.
    menuCloseTimer.current = setTimeout(() => setIsAccountMenuOpen(false), 700);
  };

  const handleLogoClick = () => {
    setIsMobileNavOpen(false);
    onViewChange?.('landing');
  };

  const handleInternalLink = (event: React.MouseEvent<HTMLAnchorElement>, view: string) => {
    event.preventDefault();
    setIsMobileNavOpen(false);
    onViewChange?.(view);
  };

  const isAssessmentView = activeView === 'dna-test' || activeView === 'daily-test';

  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [activeView]);

  useEffect(() => {
    if (!isMobileNavOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMobileNavOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [isMobileNavOpen]);

  return (
    <div className={`face-site min-h-screen relative flex flex-col items-center transition-colors duration-1000 bg-zen-paper px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-12`}>
      <div className={`${(wide ? 'max-w-6xl' : 'max-w-4xl') + ' w-full'} transition-all duration-500`}>
        
        {/* Header - 質感深度優化 */}
        <header className={`${isAssessmentView ? 'mb-5 md:mb-8' : isLanding ? 'mb-0' : 'mb-10 md:mb-16'} text-center relative`}>
          <div className={`flex items-center gap-3 mb-7 md:mb-9 ${showAccountActions ? 'justify-between' : 'justify-center'}`}>
            <a
              href="/"
              className="group flex items-center gap-3"
              onClick={(event) => { event.preventDefault(); handleLogoClick(); }}
              title="返回首頁"
              aria-label="FACE 首頁"
            >
               <FaceWordmark className="h-[3.25rem] w-[8.25rem] shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 sm:h-[3.875rem] sm:w-[9.75rem]" />
            </a>

            {showAccountActions && <div className="flex shrink-0 items-center gap-1 sm:gap-6">
              {showNav && !isAssessmentView && (
                <button
                  type="button"
                  onClick={() => setIsMobileNavOpen((open) => !open)}
                  aria-expanded={isMobileNavOpen}
                  aria-controls="mobile-site-navigation"
                  aria-label={isMobileNavOpen ? '關閉網站選單' : '開啟網站選單'}
                  className="grid h-11 w-11 place-items-center rounded-full text-[#2D2D2D] transition hover:bg-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8C635B] sm:hidden"
                >
                  <span className="sr-only">{isMobileNavOpen ? '關閉網站選單' : '開啟網站選單'}</span>
                  <span aria-hidden="true" className="relative block h-4 w-5">
                    <span className={`absolute left-0 top-0.5 h-px w-5 bg-current transition ${isMobileNavOpen ? 'translate-y-[6px] rotate-45' : ''}`} />
                    <span className={`absolute left-0 top-[7px] h-px w-5 bg-current transition ${isMobileNavOpen ? 'opacity-0' : ''}`} />
                    <span className={`absolute bottom-0.5 left-0 h-px w-5 bg-current transition ${isMobileNavOpen ? '-translate-y-[6px] -rotate-45' : ''}`} />
                  </span>
                </button>
              )}
              {user ? (
                <div 
                  className="relative -mb-3 pb-3"
                  onMouseEnter={openUserMenu}
                  onMouseLeave={closeUserMenuLater}
                >
                  <button type="button" onClick={() => setIsAccountMenuOpen((open) => !open)} aria-expanded={isAccountMenuOpen} aria-label="開啟會員選單" className="flex items-center gap-3 rounded-full p-1.5 transition-all hover:bg-white/60">
                    <div className="text-right hidden md:block px-1">
                      {/* ✅ 用戶名稱放大 */}
                      <p className={`text-xs font-black uppercase tracking-widest text-[#2D2D2D]`}>{user.name}</p>
                    </div>
                    <img 
                      src={user.avatar} 
                      className="w-10 h-10 rounded-full border border-white shadow-md grayscale hover:grayscale-0 transition-all" 
                      alt={user.name} 
                    />
                  </button>
                  
                  {isAccountMenuOpen && <div className="absolute right-0 top-full z-50 animate-fade-in">
                    <div className="bg-white border border-[#D1D1C7] shadow-2xl rounded-sm min-w-[180px] overflow-hidden">
                      <button
                        onClick={() => {
                          setIsAccountMenuOpen(false);
                          onViewChange?.('member-home');
                        }}
                        className="w-full text-left px-5 py-4 text-xs tracking-[0.18em] text-[#2D2D2D] hover:bg-[#F3F0EB] transition-colors flex items-center gap-4 font-bold"
                      >
                        我的 FACE
                      </button>
                      <button 
                        onClick={() => {
                          setIsAccountMenuOpen(false);
                          onLogout?.();
                        }}
                        className="w-full text-left px-5 py-4 text-xs tracking-[0.3em] uppercase text-[#A64D4D] hover:bg-[#A64D4D] hover:text-white transition-colors flex items-center gap-4 font-bold"
                      >
                        {t.common.logout}
                      </button>
                    </div>
                  </div>}
                </div>
              ) : (
                <button 
                  onClick={onLogin}
                  className="flex items-center gap-0 sm:gap-3 px-3 py-2 sm:px-6 sm:py-3 bg-white border border-[#2D2D2D] text-xs tracking-[0.08em] sm:tracking-[0.3em] uppercase hover:bg-[#2D2D2D] hover:text-white transition-all font-bold shadow-md whitespace-nowrap"
                >
                  {t.common.login}
                </button>
              )}
            </div>}
          </div>

          {/* Nav */}
          {showNav && !isAssessmentView && onViewChange && (
            <>
              <nav
                id="mobile-site-navigation"
                aria-label="網站導覽"
                hidden={!isMobileNavOpen}
                className={`${isLanding ? 'mb-0' : 'mb-8'} -mx-4 animate-fade-in border-y border-[#D1D1C7]/60 bg-[#F8F5EF]/95 px-4 py-2 text-left sm:hidden`}
              >
                <a href="/test" onClick={(event) => handleInternalLink(event, 'dna-test')} className="flex min-h-12 items-center justify-between border-b border-[#D1D1C7]/50 px-2 text-sm font-medium text-[#2D2D2D]">
                  開始測驗 <span aria-hidden="true">→</span>
                </a>
                <a href="/types" onClick={(event) => handleInternalLink(event, 'role-gallery')} className="flex min-h-12 items-center justify-between border-b border-[#D1D1C7]/50 px-2 text-sm font-medium text-[#2D2D2D]">
                  {t.nav.gallery} <span aria-hidden="true">→</span>
                </a>
                <a href="/about" onClick={(event) => handleInternalLink(event, 'about-face')} className="flex min-h-12 items-center justify-between border-b border-[#D1D1C7]/50 px-2 text-sm font-medium text-[#2D2D2D]">
                  {t.nav.about} <span aria-hidden="true">→</span>
                </a>
                <a href="/watch" onClick={(event) => handleInternalLink(event, 'content-hub')} className="flex min-h-12 items-center justify-between border-b border-[#D1D1C7]/50 px-2 text-sm font-medium text-[#2D2D2D]">
                  {t.nav.watch} <span aria-hidden="true">→</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileNavOpen(false);
                    user ? onViewChange('member-home') : onLogin?.();
                  }}
                  className="flex min-h-12 items-center justify-between px-2 text-left text-sm font-bold text-[#2D2D2D]"
                >
                  我的 FACE <span aria-hidden="true">→</span>
                </button>
              </nav>

              <nav aria-label="網站導覽" className={`${isLanding ? 'mb-0' : 'mb-8 md:mb-10'} hidden items-end gap-x-9 border-b border-[#D1D1C7]/60 text-sm font-medium leading-6 tracking-[0.04em] sm:flex sm:justify-center md:gap-x-12 md:text-base`}>
                <a
                  href="/test"
                  onClick={(event) => handleInternalLink(event, 'dna-test')}
                  className={`shrink-0 snap-start whitespace-nowrap border-b-2 px-0.5 pb-4 transition-all hover:text-[#2D2D2D] md:px-1 md:pb-5 ${(activeView === 'dna-test' || activeView === 'landing') ? 'border-[#2D2D2D] font-black text-[#2D2D2D]' : 'border-transparent text-[#8C7E6D]'}`}
                >
                  開始測驗
                </a>
                <a
                  href="/types"
                  onClick={(event) => handleInternalLink(event, 'role-gallery')}
                  className={`shrink-0 snap-start whitespace-nowrap border-b-2 px-0.5 pb-4 transition-all hover:text-[#2D2D2D] md:px-1 md:pb-5 ${activeView === 'role-gallery' ? 'border-[#2D2D2D] font-black text-[#2D2D2D]' : 'border-transparent text-[#8C7E6D]'}`}
                >
                  {t.nav.gallery}
                </a>
                <a
                  href="/about"
                  onClick={(event) => handleInternalLink(event, 'about-face')}
                  className={`shrink-0 snap-start whitespace-nowrap border-b-2 px-0.5 pb-4 transition-all hover:text-[#2D2D2D] md:px-1 md:pb-5 ${activeView === 'about-face' ? 'border-[#2D2D2D] font-black text-[#2D2D2D]' : 'border-transparent text-[#8C7E6D]'}`}
                >
                  {t.nav.about}
                </a>
                <a
                  href="/watch"
                  onClick={(event) => handleInternalLink(event, 'content-hub')}
                  className={`shrink-0 snap-start whitespace-nowrap border-b-2 px-0.5 pb-4 transition-all hover:text-[#2D2D2D] md:px-1 md:pb-5 ${['content-hub', 'content-detail', 'survival-kit'].includes(activeView ?? '') ? 'border-[#2D2D2D] font-black text-[#2D2D2D]' : 'border-transparent text-[#8C7E6D]'}`}
                >
                  {t.nav.watch}
                </a>
                <button
                  onClick={() => user ? onViewChange('member-home') : onLogin?.()}
                  className={`shrink-0 snap-start whitespace-nowrap border-b-2 px-0.5 pb-4 transition-all hover:text-[#2D2D2D] md:px-1 md:pb-5 ${activeView === 'member-home' ? 'border-[#2D2D2D] font-black text-[#2D2D2D]' : 'border-transparent text-[#8C7E6D]'}`}
                  aria-label={user ? '前往我的 FACE' : '登入後前往我的 FACE'}
                >
                  我的 FACE
                </button>
              </nav>
            </>
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
        {!isAssessmentView && <SiteFooter />}
      </div>
    </div>
  );
};
