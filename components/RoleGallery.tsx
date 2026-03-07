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
    <div className="space-y-12 fade-in pb-40 px-2 max-w-5xl mx-auto">
      {/* Header - 質感提升 */}
      <div className="flex flex-col items-center space-y-6 border-b border-[#D1D1C7]/60 pb-10 pt-4">
        <div className="text-center space-y-2">
          {/* ✅ 放大：text-[9px] -> text-xs (12px) 並增加字距 */}
          <span className="text-xs text-[#8C7E6D] uppercase tracking-[0.8em] font-black block">The Soul Archive</span>
          <h2 className="text-4xl serif text-[#2D2D2D] font-light tracking-[0.2em]">靈魂圖鑑</h2>
        </div>
        <button 
          onClick={onBack} 
          className="w-full max-w-xs text-xs tracking-[0.5em] uppercase text-[#2D2D2D] border border-[#2D2D2D] py-4 hover:bg-[#2D2D2D] hover:text-white transition-all duration-700 font-bold shadow-md"
        >
          返回 DASHBOARD
        </button>
      </div>

      {/* 列表網格 - 增加卡片高度與文字大小 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roles.map((role) => {
          const isUserType = userCode === role.code;
          return (
            <div 
              key={role.code} 
              onClick={() => setSelectedRole(role)}
              className={`flex bg-[#FBFBFA] border transition-all duration-1000 cursor-pointer overflow-hidden h-40 shadow-sm ${
                isUserType 
                ? 'border-[#8C635B] ring-1 ring-[#8C635B]/20 bg-white' 
                : 'border-[#D1D1C7]/40 hover:border-[#2D2D2D] hover:shadow-xl'
              }`}
            >
              <div className="relative w-[35%] h-full overflow-hidden">
                <img src={role.imageUrl} className={`w-full h-full object-cover grayscale transition-all duration-1000 ${isUserType ? 'grayscale-0 opacity-100' : 'opacity-70 group-hover:opacity-100'}`} alt={role.name} />
                <div className="absolute top-2 left-2">
                  <span className={`text-[10px] font-mono px-2 py-1 ${isUserType ? 'bg-[#8C635B] text-white' : 'bg-white/90 text-[#8C7E6D]'}`}>{role.id}</span>
                </div>
              </div>
              <div className="w-[65%] p-6 flex flex-col justify-center space-y-2">
                <h3 className={`text-xl md:text-2xl serif font-black tracking-tight ${isUserType ? 'text-[#8C635B]' : 'text-[#2D2D2D]'}`}>【{role.name}】</h3>
                <p className="text-xs md:text-sm text-[#8C7E6D] line-clamp-2 serif italic leading-relaxed tracking-wide">{role.motto}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 詳情 Modal - 安縵風格深度優化 */}
      {selectedRole && (
        <div 
          className={`fixed inset-0 z-[100] flex justify-center bg-[#1A1A1A]/95 backdrop-blur-xl overflow-y-auto transition-all duration-500 ${isClosing ? 'opacity-0' : 'opacity-100'}`} 
          onClick={closeModal}
          ref={modalContainerRef}
        >
          <div 
            className={`bg-[#FBFBFA] w-full max-w-3xl min-h-screen relative transition-all duration-700 transform ${isClosing ? 'translate-y-20 opacity-0' : 'translate-y-0 opacity-100 shadow-2xl'}`} 
            onClick={e => e.stopPropagation()}
          >
            {/* Sticky Header */}
            <div className="sticky top-0 z-50 bg-[#FBFBFA]/90 backdrop-blur-md border-b border-[#D1D1C7]/30 px-8 py-5 flex justify-between items-center">
              <span className="text-xs tracking-[0.4em] font-black text-[#8C7E6D] uppercase">{selectedRole.id} / {selectedRole.code}</span>
              <button onClick={closeModal} className="text-3xl text-[#8C7E6D] hover:text-[#2D2D2D] p-2 transition-colors">&times;</button>
            </div>

            <div className="pb-32 flex flex-col items-center">
              {/* 視覺定錨區 - 比照 Dashboard 放大 */}
              <div className="bg-white border-b border-[#D1D1C7]/20 pb-12 w-full flex flex-col items-center">
                <div className="aspect-[21/9] w-full overflow-hidden relative shadow-lg">
                  <img src={selectedRole.imageUrl} className="w-full h-full object-cover grayscale-[0.1]" alt={selectedRole.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#2D2D2D] text-white text-[11px] px-4 py-2 font-bold tracking-[0.2em] uppercase shadow-lg inline-block">{selectedRole.code}</span>
                  </div>
                </div>

                <div className="px-8 mt-12 space-y-6 text-center w-full">
                  <h1 className="text-4xl md:text-5xl serif text-[#2D2D2D] font-black tracking-tight">【{selectedRole.name}】</h1>
                  <div className="w-16 h-[0.5px] bg-[#8C635B] mx-auto"></div>
                  <p className="text-2xl md:text-3xl serif italic font-light text-[#8C635B] leading-relaxed px-4 tracking-wide">「{selectedRole.motto}」</p>
                </div>
              </div>

              {/* 內容區 - 文字全體放大 */}
              <div className="px-8 md:px-16 mt-16 space-y-16 text-center w-full max-w-2xl">
                <div className="space-y-6">
                  <span className="text-xs font-black text-[#8C7E6D] uppercase tracking-[0.6em] block">Full Portrait / 人格全貌</span>
                  {/* ✅ 放大：text-[15px] -> text-lg (18px) */}
                  <p className="text-lg md:text-xl leading-[1.8] text-[#2D2D2D] serif italic tracking-wide opacity-90">{selectedRole.portrait}</p>
                </div>

                <div className="bg-[#F5F5F0] p-10 md:p-14 border-y border-[#D1D1C7]/40 shadow-inner space-y-6">
                   <p className="text-xs font-black text-[#8C7E6D] uppercase tracking-[0.5em]">Psychology / 核心心理機制</p>
                   {/* ✅ 放大：text-[16px] -> text-xl (20px) */}
                   <p className="text-xl md:text-2xl leading-relaxed text-[#2D2D2D] font-bold serif">{selectedRole.psychology.mechanism}</p>
                   <p className="text-base leading-relaxed text-[#8C7E6D] serif italic mt-6 border-t border-[#D1D1C7]/20 pt-6 tracking-widest">“{selectedRole.psychology.scene}”</p>
                </div>

                {/* 盲區 */}
                <div className="space-y-10">
                  <h4 className="text-sm font-black text-[#A64D4D] uppercase tracking-[0.6em] flex flex-col items-center gap-3">
                    Blind Spots / 投資盲區
                    <span className="w-16 h-[0.5px] bg-[#A64D4D]"></span>
                  </h4>
                  <div className="space-y-12">
                    {selectedRole.blindSpots.map((bs, i) => (
                      <div key={i} className="space-y-4">
                        <p className="text-xl font-black text-[#2D2D2D] tracking-widest">【{bs.title}】</p>
                        <p className="text-lg leading-[1.7] text-[#555] serif italic">{bs.description}</p>
                        <p className="text-[15px] leading-relaxed text-[#A64D4D] font-bold border-t border-[#A64D4D]/15 pt-4 max-w-md mx-auto">{bs.behavior}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 回歸練習 */}
                <div className="space-y-10">
                  <h4 className="text-sm font-black text-[#4D7A4D] uppercase tracking-[0.6em] flex flex-col items-center gap-3">
                    Practice / 回歸練習
                    <span className="w-16 h-[0.5px] bg-[#4D7A4D]"></span>
                  </h4>
                  <div className="space-y-6">
                    {selectedRole.exercises.map((ex, i) => (
                      <div key={i} className="bg-white p-8 border border-[#D1D1C7]/60 shadow-md rounded-sm space-y-4">
                        <div className="text-[10px] font-black text-[#4D7A4D] uppercase tracking-widest">Exercise 0{i+1}：{ex.title}</div>
                        {/* ✅ 放大核心練習文字 */}
                        <p className="text-xl leading-relaxed text-[#2D2D2D] font-bold serif italic tracking-wide">“{ex.technique}”</p>
                        <p className="text-xs text-[#8C7E6D] uppercase tracking-[0.2em] font-black">— {ex.effect}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 三個錦囊 */}
                <div className="space-y-10">
                  <h4 className="text-sm font-black text-[#8C635B] uppercase tracking-[0.8em]">Emergency Kit / 靈魂錦囊</h4>
                  <div className="grid grid-cols-1 gap-6 text-center">
                    {Object.values(selectedRole.pouches).map((p, i) => {
                       const icons = ['💊', '🛡️', '✨'];
                       return (
                        <div key={i} className="bg-white border-b border-[#D1D1C7]/60 p-6 space-y-3 shadow-sm hover:shadow-lg transition-all">
                            <span className="text-4xl block mb-2">{icons[i]}</span>
                            {/* ✅ 提升易讀性 */}
                            <p className="text-lg md:text-xl font-bold text-[#2D2D2D] serif leading-relaxed italic px-4">{p}</p>
                        </div>
                       );
                    })}
                  </div>
                </div>

                {/* 解酒錠 - 極致質感結尾 */}
                <div className="bg-[#2D2D2D] text-white p-14 text-center space-y-8 rounded-t-3xl mt-16 relative overflow-hidden w-full shadow-2xl">
                  <div className="absolute top-0 left-0 w-full h-[1.5px] bg-[#8C635B]"></div>
                  <p className="text-xs uppercase tracking-[1.2em] opacity-40 font-black pl-[1.2em]">Soul Blessing</p>
                  <p className="text-2xl md:text-4xl serif italic font-light leading-[1.8] tracking-widest px-4">「{selectedRole.antidote}」</p>
                </div>
              </div>
            </div>

            {/* Sticky Footer Button - 讓「關閉」在手機上極好點擊 */}
            <div className="sticky bottom-0 bg-[#FBFBFA]/90 backdrop-blur-xl p-8 border-t border-[#D1D1C7]/30 shadow-2xl">
              <button onClick={closeModal} className="w-full py-6 bg-[#2D2D2D] text-white text-sm tracking-[1em] uppercase font-black shadow-2xl transition-all hover:bg-black active:scale-95">關閉 CLOSE</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
