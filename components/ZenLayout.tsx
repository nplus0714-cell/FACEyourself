
import React, { useState } from 'react';
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
  onLogin, 
  onLogout,
  showNav,
  activeView,
  onViewChange,
  language,
  onToggleLanguage
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = translations[language];

  const handleLogoClick = () => {
    onViewChange?.('landing');
  };

  const isAssessmentView = activeView === 'dna-test' || activeView === 'daily-test';

  return (
    <div className={`min-h-screen relative flex flex-col items-center transition-colors duration-1000 bg-zen-paper px-4 md:px-6 py-4 md:py-8`}>
      <div className={`${(wide ? 'max-w-6xl' : 'max-w-4xl') + ' w-full'} transition-all duration-500`}>
        
        {/* Header */}
        <header className={`${isAssessmentView ? 'mb-6' : 'mb-12'} text-center relative`}>
          <div className="flex justify-between items-center mb-6">
            <div 
              className="flex items-center gap-3 cursor-pointer group" 
              onClick={handleLogoClick}
              title="返回首頁"
            >
               <div className={`w-8 h-8 border border-[#2D2D2D] flex items-center justify-center font-bold text-[12px] transition-all group-hover:bg-[#2D2D2D] group-hover:text-white`}>F</div>
               <div className="text-left hidden sm:block">
                  <h1 className={`text-[13px] font-bold tracking-[0.2em] leading-none text-[#2D2D2D]`}>FACE</h1>
                  <p className={`text-[8px] tracking-widest uppercase mt-1 text-[#8C7E6D]`}>Investment Soul Diary</p>
               </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              {/* Language Switcher */}
              <button 
                onClick={onToggleLanguage}
                className="px-2 py-1.5 sm:px-3 sm:py-2 border border-[#D1D1C7] text-[10px] tracking-widest uppercase hover:bg-[#2D2D2D] hover:text-white transition-all font-bold bg-white/50"
              >
                {language === 'zh' ? 'EN' : '中'}
              </button>

              {user ? (
                <div 
                  className="relative"
                  onMouseEnter={() => setIsMenuOpen(true)}
                  onMouseLeave={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center gap-2 cursor-pointer p-1 rounded-full hover:bg-white/40 transition-all">
                    <div className="text-right hidden md:block px-1">
                      <p className={`text-[9px] font-bold uppercase tracking-wider text-[#2D2D2D]`}>{user.name}</p>
                    </div>
                    <img 
                      src={user.avatar} 
                      className="w-8 h-8 rounded-full border border-white shadow-sm grayscale hover:grayscale-0 transition-all" 
                      alt={user.name} 
                    />
                  </div>
                  
                  <div className={`absolute top-full right-0 mt-1 pt-2 z-50 transition-all duration-300 ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
                    <div className="bg-white border border-[#D1D1C7] shadow-xl rounded-sm min-w-[160px] overflow-hidden">
                      <button 
                        onClick={() => {
                          setIsMenuOpen(false);
                          onLogout?.();
                        }}
                        className="w-full text-left px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-[#A64D4D] hover:bg-[#A64D4D] hover:text-white transition-colors flex items-center gap-3 font-bold"
                      >
                        {t.common.logout}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={onLogin}
                  className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white border border-[#2D2D2D] text-[10px] tracking-[0.2em] uppercase hover:bg-[#2D2D2D] hover:text-white transition-all font-bold shadow-sm whitespace-nowrap"
                >
                  {t.common.login}
                </button>
              )}
            </div>
          </div>

          {showNav && !isAssessmentView && onViewChange && (
            <nav className="mb-8 flex flex-wrap justify-center text-[10px] tracking-[0.25em] uppercase border-b border-[#D1D1C7] pb-6 gap-y-4">
              <div className="flex flex-wrap justify-center gap-x-6 md:gap-x-12 px-4">
                <button 
                  onClick={() => onViewChange('dashboard')} 
                  className={`whitespace-nowrap hover:text-[#2D2D2D] transition-all ${activeView === 'dashboard' ? 'text-[#2D2D2D] font-bold border-b border-[#2D2D2D]' : 'text-[#8C7E6D]'}`}
                >
                  {t.nav.overview}
                </button>
                <button 
                  onClick={() => onViewChange('role-gallery')} 
                  className={`whitespace-nowrap hover:text-[#2D2D2D] transition-all ${activeView === 'role-gallery' ? 'text-[#2D2D2D] font-bold border-b border-[#2D2D2D]' : 'text-[#8C7E6D]'}`}
                >
                  {t.nav.gallery}
                </button>
                <button 
                  onClick={() => onViewChange('about-face')} 
                  className={`whitespace-nowrap hover:text-[#2D2D2D] transition-all ${activeView === 'about-face' ? 'text-[#2D2D2D] font-bold border-b border-[#2D2D2D]' : 'text-[#8C7E6D]'}`}
                >
                  {t.nav.about}
                </button>
                <button 
                  onClick={() => onViewChange('worry-free-bar')} 
                  className={`whitespace-nowrap hover:text-[#2D2D2D] transition-all ${activeView === 'worry-free-bar' ? 'text-[#2D2D2D] font-bold border-b border-[#2D2D2D]' : 'text-[#8C7E6D]'}`}
                >
                  {t.nav.bar}
                </button>
              </div>
            </nav>
          )}

          {title && !isAssessmentView && <h2 className="mt-4 text-xl font-medium tracking-widest border-b border-[#D1D1C7] pb-4 inline-block serif text-[#2D2D2D]">{title}</h2>}
        </header>

        <main className={`fade-in relative z-10`}>
          {children}
        </main>
      </div>
    </div>
  );
};
