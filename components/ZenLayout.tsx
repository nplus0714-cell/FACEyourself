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
  const t = translations[language];

  const handleLogoClick = () => {
    onViewChange?.('landing');
  };

  const isAssessmentView = activeView === 'dna-test' || activeView === 'daily-test';

  return (
    <div className={`min-h-screen relative flex flex-col items-center transition-colors duration-1000 bg-zen-paper px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-12`}>
      <div className={`${(wide ? 'max-w-6xl' : 'max-w-4xl') + ' w-full'} transition-all duration-500`}>
        
        {/* Header - 質感深度優化 */}
        <header className={`${isAssessmentView ? 'mb-5 md:mb-8' : 'mb-10 md:mb-16'} text-center relative`}>
          <div className="flex justify-between items-center gap-3 mb-6 md:mb-8">
            <div 
              className="flex items-center gap-4 cursor-pointer group" 
              onClick={handleLogoClick}
              title="返回首頁"
            >
               {/* ✅ LOGO 放大 */}
               <div className={`w-10 h-10 border border-[#2D2D2D] flex items-center justify-center font-bold text-sm transition-all group-hover:bg-[#2D2D2D] group-hover:text-white`}>F</div>
               <div className="text-left">
                  {/* ✅ 主標題與副標題字體同步放大 */}
                  <h1 className={`text-xs sm:text-sm font-black tracking-[0.2em] sm:tracking-[0.3em] leading-none text-[#2D2D2D]`}>FACE</h1>
                  <p className={`hidden sm:block text-[11px] tracking-[0.12em] mt-1.5 text-[#8C7E6D] font-medium`}>Trading style journal</p>
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
                  className="relative"
                  onMouseEnter={() => setIsMenuOpen(true)}
                  onMouseLeave={() => setIsMenuOpen(false)}
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
                  
                  <div className={`absolute top-full right-0 mt-2 pt-2 z-50 transition-all duration-300 ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
                    <div className="bg-white border border-[#D1D1C7] shadow-2xl rounded-sm min-w-[180px] overflow-hidden">
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

          {/* Nav - 安縵風格：極寬字距 */}
          {showNav && !isAssessmentView && onViewChange && (
            <nav className="mb-8 md:mb-10 flex flex-wrap justify-center text-xs tracking-[0.08em] sm:tracking-[0.2em] md:tracking-[0.45em] uppercase border-b border-[#D1D1C7]/60 pb-5 md:pb-8 gap-y-4 md:gap-y-6">
              <div className="flex flex-wrap justify-center gap-x-5 sm:gap-x-8 md:gap-x-16 px-2 sm:px-6">
                {!hasDna && <button 
                  onClick={() => onViewChange('dna-test')} 
                  className={`whitespace-nowrap hover:text-[#2D2D2D] transition-all pb-1 ${activeView === 'dna-test' ? 'text-[#2D2D2D] font-black border-b-2 border-[#2D2D2D]' : 'text-[#8C7E6D]'}`}
                >
                  開始測驗
                </button>}
                {hasDna && <button 
                  onClick={() => onViewChange('dashboard')} 
                  className={`whitespace-nowrap hover:text-[#2D2D2D] transition-all pb-1 ${activeView === 'dashboard' ? 'text-[#2D2D2D] font-black border-b-2 border-[#2D2D2D]' : 'text-[#8C7E6D]'}`}
                >
                  {t.nav.overview}
                </button>}
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
              </div>
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
