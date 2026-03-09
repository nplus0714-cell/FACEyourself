import React, { useState, useEffect, useRef } from 'react';
import { FACE_MAP, getFaceCode } from '../constants';
import { PersonalityProfile, FaceScores } from '../types';

interface RoleGalleryProps {
  onBack: () => void;
  dna: FaceScores | null;
}

export const RoleGallery: React.FC<RoleGalleryProps> = ({ onBack, dna }) => {
  const roles = Object.values(FACE_MAP).sort((a, b) => a.id.localeCompare(b.id));
  const [selectedRole, setSelectedRole] = useState<PersonalityProfile | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const modalContainerRef = useRef<HTMLDivElement>(null);
  
  const userCode = dna ? getFaceCode(dna) : null;

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedRole(null);
      setIsClosing(false);
    }, 400);
  };

  useEffect(() => {
    if (selectedRole && modalContainerRef.current) {
      modalContainerRef.current.scrollTop = 0;
    }
  }, [selectedRole]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div className="space-y-16 fade-in pb-40 px-4 md:px-12 max-w-6xl mx-auto">
      {/* 外部 Header */}
      <div className="flex flex-col items-center space-y-8 border-b border-[#D1D1C7]/60 pb-12 pt-6">
        <div className="text-center space-y-3">
          <span className="text-xs text-[#8C7E6D] uppercase tracking-[0.5em] font-black block">The Soul Archive</span>
          <h2 className="text-4xl md:text-5xl serif text-[#2D2D2D] font-extralight tracking-[0.2em]">靈魂圖鑑</h2>
        </div>
        <button 
          onClick={onBack} 
          className="w-full max-w-xs text-xs tracking-[0.5em] uppercase text-[#2D2D2D] border border-[#2D2D2D] py-5 hover:bg-[#2D2D2D] hover:text-white transition-all duration-1000 font-bold shadow-md active:scale-95"
        >
          返回 DASHBOARD
        </button>
      </div>

      {/* 列表網格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14">
        {roles.map((role) => {
          const isUserType = userCode === role.code;
          return (
            <div 
              key={role.code} 
              onClick={() => setSelectedRole(role)}
              className={`flex flex-col transition-all duration-1000 cursor-pointer overflow-hidden shadow-sm group active:scale-95 md:active:scale-100 ${
                isUserType 
                ? 'border border-[#8C635B] ring-1 ring-[#8C635B]/20 bg-white' 
                : 'border border-[#D1D1C7]/40 bg-white hover:border-[#2D2D2D] hover:shadow-2xl'
              }`}
            >
              <div className="relative w-full overflow-hidden bg-[#1A1A1A]">
                <img src={role.imageUrl} className={`w-full h-auto block transition-transform duration-1000 group-hover:scale-105 ${isUserType ? 'grayscale-0' : 'grayscale opacity-85'}`} alt={role.name} />
                <div className="absolute top-0 left-0 z-10">
                  <span className={`text-[10px] font-mono px-4 py-2 tracking-[0.2em] uppercase block ${isUserType ? 'bg-[#8C635B] text-white' : 'bg-white/95 text-[#2D2D2D]'}`}>{role.id}</span>
                </div>
              </div>
              <div className="p-8 md:p-12 flex flex-col items-center text-center space-y-5">
                <h3 className={`text-2xl serif font-black tracking-widest ${isUserType ? 'text-[#8C635B]' : 'text-[#2D2D2D]'}`}>【{role.name}】</h3>
                <div className="w-10 h-[0.5px] bg-[#D1D1C7] mx-auto"></div>
                <p className="text-base text-[#8C7E6D] serif italic tracking-wide px-2 md:px-4">{role.motto}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 詳情 Modal */}
      {selectedRole && (
        <div 
          className={`fixed inset-0 z-[100] flex justify-center bg-[#1A1A1A]/85 backdrop-blur-md overflow-y-auto transition-all duration-500 ${isClosing ? 'opacity-0' : 'opacity-100'}`} 
          onClick={closeModal}
          ref={modalContainerRef}
        >
          <div 
            className={`bg-[#FBFBFA] w-full max-w-4xl min-h-screen relative transition-all duration-700 transform ${isClosing ? 'translate-y-20 opacity-0' : 'translate-y-0 opacity-100'}`} 
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-[60] bg-[#FBFBFA]/95 backdrop-blur-md px-6 md:px-10 py-6 md:py-8 flex justify-between items-center text-[#8C7E6D]">
              <span className="text-xs tracking-[0.5em] font-black uppercase">{selectedRole.id} / {selectedRole.code}</span>
              <button onClick={closeModal} className="text-4xl font-light hover:text-[#2D2D2D] transition-colors">&times;</button>
            </div>

            <div className="pb-32 flex flex-col items-center">
              {/* 圖片區 */}
              <div className="w-full flex flex-col items-center pt-8 px-4 md:px-20 relative z-10 bg-[#FBFBFA]">
                <img src={selectedRole.imageUrl} className="w-full h-auto max-h-[70vh] object-contain transition-all duration-1000" alt={selectedRole.name} />
                <div className="mt-12 md:mt-16 space-y-6 md:space-y-8 text-center w-full max-w-4xl pb-12 border-b border-[#D1D1C7]/40">
                  <h1 className="text-4xl md:text-6xl serif text-[#2D2D2D] font-black flex flex-col items-center gap-6 leading-tight">
                    <span className="w-12 h-[1px] bg-[#8C635B]/50"></span>
                    【{selectedRole.name}】
                    <span className="w-12 h-[1px] bg-[#8C635B]/50"></span>
                  </h1>
                  <p className="text-xl md:text-3xl serif italic font-light text-[#8C7E6D] leading-[1.8] tracking-wide px-4">「{selectedRole.motto}」</p>
                </div>
              </div>

              {/* ✅ 內容區塊：修復過大留白，將手機版區塊間距大幅縮減 (mt-16 降為 mt-10，space-y-24 降為 space-y-12) */}
              <div className="px-6 md:px-24 mt-10 md:mt-20 space-y-12 md:space-y-32 text-center w-full max-w-4xl relative z-10">
                
                {/* 1. 人格全貌 */}
                {/* 修正：移除多餘的 pb-8，減少下方無效留白 */}
                <div className="space-y-6 md:space-y-12 bg-[#FBFBFA]">
                  <span className="text-[10px] md:text-xs font-black text-[#D1D1C7] uppercase tracking-[0.8em] block">Full Portrait / 人格全貌</span>
                  {/* 收緊字距為 tracking-wide，避免中文字散開 */}
                  <p className="text-lg md:text-2xl leading-[2.2] text-[#2D2D2D] serif italic tracking-wide">{selectedRole.portrait}</p>
                </div>

                {/* 2. 核心心理機制 */}
                {/* 修正：將手機版強制推開的 my-12 移除，並把內部上下留白降為 py-10 */}
                <div className="bg-white py-10 md:py-24 px-6 md:px-24 border border-[#D1D1C7]/30 shadow-sm space-y-6 md:space-y-12 my-2 md:my-20">
                  <p className="text-[10px] md:text-xs font-black text-[#8C7E6D] uppercase tracking-[0.5em] mb-4">Psychology / 核心心理機制</p>
                  <p className="text-xl md:text-4xl leading-[2] text-[#2D2D2D] font-bold serif tracking-wide">{selectedRole.psychology.mechanism}</p>
                  <div className="w-12 h-[1px] bg-[#D1D1C7]/50 mx-auto mt-6 md:mt-8 mb-4 md:mb-6"></div>
                  <p className="text-base md:text-2xl leading-[1.9] text-[#8C7E6D] serif italic tracking-wide">“{selectedRole.psychology.scene}”</p>
                </div>

                {/* 3. 投資盲區 */}
                <div className="pt-8 md:pt-16 space-y-12 md:space-y-20 bg-[#FBFBFA]">
                  <h4 className="text-xs md:text-sm font-black text-[#8C635B] uppercase tracking-[0.8em] flex flex-col items-center gap-6 mb-8">
                    Blind Spots / 投資盲區
                    <span className="w-16 h-[1px] bg-[#8C635B]/50"></span>
                  </h4>
                  <div className="space-y-12 md:space-y-16">
                    {selectedRole.blindSpots.map((bs, i) => (
                      <div key={i} className="bg-white border border-[#D1D1C7]/30 py-12 md:py-24 px-6 md:px-20 text-center shadow-sm">
                        <p className="text-xl md:text-2xl font-black text-[#2D2D2D] tracking-wider mb-6 md:mb-10">【{bs.title}】</p>
                        <p className="text-base md:text-xl leading-[2] text-[#555] serif italic tracking-wide mb-8 md:mb-12">{bs.description}</p>
                        <p className="text-sm md:text-lg leading-relaxed text-[#8C635B] font-bold pt-6 md:pt-10 mt-6 border-t border-[#D1D1C7]/20 max-w-xl mx-auto">{bs.behavior}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. 祝福語區塊：確保字體能橫向延伸 */}
                <div className="bg-[#2D2D2D] text-white py-16 px-6 md:p-32 text-center space-y-10 md:space-y-14 mt-16 md:mt-40 shadow-2xl relative z-10 rounded-sm">
                  <div className="space-y-4">
                    <span className="text-[10px] uppercase tracking-[0.8em] text-white/30 font-black block">Soul Blessing</span>
                    <span className="text-[10px] text-white/20 uppercase tracking-[0.5em] block">靈魂處方箋</span>
                  </div>
                  {/* 移除了強制擠壓的 px 設定，將 tracking 修正為正常易讀的寬度 */}
                  <p className="text-xl md:text-5xl serif italic font-extralight leading-[2.2] tracking-wide">
                    「{selectedRole.antidote}」
                  </p>
                  <div className="pt-8 opacity-10">
                    <div className="w-12 h-[0.5px] bg-white mx-auto"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* 底部關閉按鈕 */}
            <div className="pb-24 pt-12 flex justify-center bg-[#FBFBFA] relative z-[70]">
              <button onClick={closeModal} className="px-16 md:px-24 py-5 md:py-6 border border-[#2D2D2D] text-[#2D2D2D] text-xs tracking-[0.6em] uppercase font-black hover:bg-[#2D2D2D] hover:text-white transition-all duration-700 active:scale-95">關閉閱覽 CLOSE</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};