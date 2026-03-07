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
    <div className="space-y-16 fade-in pb-40 px-3 max-w-5xl mx-auto">
      {/* Header - 安縵風格氣場 */}
      <div className="flex flex-col items-center space-y-8 border-b border-[#D1D1C7]/60 pb-12 pt-6">
        <div className="text-center space-y-3">
          <span className="text-xs text-[#8C7E6D] uppercase tracking-[0.8em] font-black block">The Soul Archive</span>
          <h2 className="text-4xl md:text-5xl serif text-[#2D2D2D] font-extralight tracking-[0.2em]">靈魂圖鑑</h2>
        </div>
        <button 
          onClick={onBack} 
          className="w-full max-w-xs text-xs tracking-[0.6em] uppercase text-[#2D2D2D] border border-[#2D2D2D] py-5 hover:bg-[#2D2D2D] hover:text-white transition-all duration-1000 font-bold shadow-md active:scale-95"
        >
          返回 DASHBOARD
        </button>
      </div>

      {/* 列表網格 - 增加卡片呼吸感 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {roles.map((role) => {
          const isUserType = userCode === role.code;
          return (
            <div 
              key={role.code} 
              onClick={() => setSelectedRole(role)}
              className={`flex bg-[#FBFBFA] border transition-all duration-1000 cursor-pointer overflow-hidden h-44 shadow-sm ${
                isUserType 
                ? 'border-[#8C635B] ring-1 ring-[#8C635B]/20 bg-white' 
                : 'border-[#D1D1C7]/40 hover:border-[#2D2D2D] hover:shadow-xl'
              }`}
            >
              <div className="relative w-[38%] h-full overflow-hidden">
                <img src={role.imageUrl} className={`w-full h-full object-cover grayscale transition-all duration-1000 scale-105 group-hover:scale-110 ${isUserType ? 'grayscale-0 opacity-100' : 'opacity-70'}`} alt={role.name} />
                <div className="absolute top-3 left-3">
                  <span className={`text-[10px] font-mono px-2 py-1 shadow-sm ${isUserType ? 'bg-[#8C635B] text-white' : 'bg-white/90 text-[#8C7E6D]'}`}>{role.id}</span>
                </div>
              </div>
              <div className="w-[62%] p-8 flex flex-col justify-center space-y-3">
                <h3 className={`text-xl md:text-2xl serif font-black tracking-tight ${isUserType ? 'text-[#8C635B]' : 'text-[#2D2D2D]'}`}>【{role.name}】</h3>
                <p className="text-sm text-[#8C7E6D] line-clamp-2 serif italic leading-relaxed tracking-wide">{role.motto}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 詳情 Modal - 深度修復壓字問題 */}
      {selectedRole && (
        <div 
          className={`fixed inset-0 z-[100] flex justify-center bg-[#1A1A1A]/95 backdrop-blur-2xl overflow-y-auto transition-all duration-500 ${isClosing ? 'opacity-0' : 'opacity-100'}`} 
          onClick={closeModal}
          ref={modalContainerRef}
        >
          <div 
            className={`bg-[#FBFBFA] w-full max-w-3xl min-h-screen relative transition-all duration-700 transform ${isClosing ? 'translate-y-20 opacity-0' : 'translate-y-0 opacity-100 shadow-2xl'}`} 
            onClick={e => e.stopPropagation()}
          >
            {/* Sticky Header */}
            <div className="sticky top-0 z-50 bg-[#FBFBFA]/90 backdrop-blur-md border-b border-[#D1D1C7]/30 px-8 py-6 flex justify-between items-center">
              <span className="text-xs tracking-[0.5em] font-black text-[#8C7E6D] uppercase">{selectedRole.id} / {selectedRole.code}</span>
              <button onClick={closeModal} className="text-4xl text-[#8C7E6D] hover:text-[#2D2D2D] p-2 transition-colors">&times;</button>
            </div>

            <div className="pb-40 flex flex-col items-center">
              {/* 視覺定錨區 */}
              <div className="bg-white border-b border-[#D1D1C7]/20 pb-16 w-full flex flex-col items-center">
                <div className="aspect-[21/9] w-full overflow-hidden relative shadow-lg">
                  <img src={selectedRole.imageUrl} className="w-full h-full object-cover grayscale-[0.1]" alt={selectedRole.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
                  <div className="absolute top-5 left-5">
                    <span className="bg-[#2D2D2D] text-white text-xs px-5 py-2 font-bold tracking-[0.2em] uppercase shadow-xl inline-block">{selectedRole.code}</span>
                  </div>
                </div>

                <div className="px-10 mt-16 space-y-8 text-center w-full">
                  <h1 className="text-4xl md:text-6xl serif text-[#2D2D2D] font-black tracking-tight">【{selectedRole.name}】</h1>
                  <div className="w-20 h-[0.5px] bg-[#8C635B] mx-auto"></div>
                  <p className="text-2xl md:text-4xl serif italic font-extralight text-[#8C635B] leading-[1.6] px-6 tracking-wide">「{selectedRole.motto}」</p>
                </div>
              </div>

              {/* 內容區 - 空間大幅擴張 */}
              <div className="px-8 md:px-20 mt-20 space-y-20 text-center w-full max-w-3xl">
                
                {/* 人格全貌 */}
                <div className="space-y-8">
                  <span className="text-xs font-black text-[#8C7E6D] uppercase tracking-[0.6em] block">Full Portrait / 人格全貌</span>
                  <p className="text-xl md:text-2xl leading-[1.9] text-[#2D2D2D] serif italic tracking-wide opacity-90">{selectedRole.portrait}</p>
                </div>

                {/* ✅ 修復：核心心理機制區塊 - 增加內距與外距，防止壓字 */}
                <div className="bg-[#F5F5F0] py-16 px-10 md:px-20 border-y border-[#D1D1C7]/40 shadow-inner space-y-8 my-20">
                   <p className="text-xs font-black text-[#8C7E6D] uppercase tracking-[0.5em] mb-4">Psychology / 核心心理機制</p>
                   <p className="text-2xl md:text-3xl leading-[1.8] text-[#2D2D2D] font-bold serif">{selectedRole.psychology.mechanism}</p>
                   <p className="text-lg leading-relaxed text-[#8C7E6D] serif italic mt-10 border-t border-[#D1D1C7]/20 pt-8 tracking-[0.15em]">“{selectedRole.psychology.scene}”</p>
                </div>

                {/* 盲區 */}
                <div className="space-y-12">
                  <h4 className="text-sm font-black text-[#A64D4D] uppercase tracking-[0.6em] flex flex-col items-center gap-4">
                    Blind Spots / 投資盲區
                    <span className="w-20 h-[0.5px] bg-[#A64D4D]"></span>
                  </h4>
                  <div className="space-y-16">
                    {selectedRole.blindSpots.map((bs, i) => (
                      <div key={i} className="space-y-5">
                        <p className="text-2xl font-black text-[#2D2D2D] tracking-widest">【{bs.title}】</p>
                        <p className="text-lg md:text-xl leading-[1.8] text-[#555] serif italic">{bs.description}</p>
                        <p className="text-base md:text-lg leading-relaxed text-[#A64D4D] font-bold border-t border-[#A64D4D]/15 pt-5 max-w-lg mx-auto">{bs.behavior}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 回歸練習 */}
                <div className="space-y-12">
                  <h4 className="text-sm font-black text-[#4D7A4D] uppercase tracking-[0.6em] flex flex-col items-center gap-4">
                    Practice / 回歸練習
                    <span className="w-20 h-[0.5px] bg-[#4D7A4D]"></span>
                  </h4>
                  <div className="space-y-8">
                    {selectedRole.exercises.map((ex, i) => (
                      <div key={i} className="bg-white p-10 md:p-14 border border-[#D1D1C7]/60 shadow-md rounded-sm space-y-6">
                        <div className="text-xs font-black text-[#4D7A4D] uppercase tracking-widest">Exercise 0{i+1}：{ex.title}</div>
                        <p className="text-2xl leading-[1.7] text-[#2D2D2D] font-bold serif italic tracking-wide">“{ex.technique}”</p>
                        <p className="text-sm text-[#8C7E6D] uppercase tracking-[0.3em] font-black">— {ex.effect}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 三個錦囊 */}
                <div className="space-y-12">
                  <h4 className="text-sm font-black text-[#8C635B] uppercase tracking-[0.8em]">Emergency Kit / 靈魂錦囊</h4>
                  <div className="grid grid-cols-1 gap-8 text-center">
                    {Object.values(selectedRole.pouches).map((p, i) => {
                       const icons = ['💊', '🛡️', '✨'];
                       return (
                        <div key={i} className="bg-white border-b border-[#D1D1C7]/60 p-8 space-y-4 shadow-sm hover:shadow-xl transition-all">
                            <span className="text-5xl block mb-3">{icons[i]}</span>
                            <p className="text-xl md:text-2xl font-bold text-[#2D2D2D] serif leading-[1.7] italic px-6">{p}</p>
                        </div>
                       );
                    })}
                  </div>
                </div>

                {/* 解酒錠 */}
                <div className="bg-[#2D2D2D] text-white p-16 md:p-24 text-center space-y-10 rounded-t-[3rem] mt-24 relative overflow-hidden w-full shadow-2xl">
                  <div className="absolute top-0 left-0 w-full h-2 bg-[#8C635B]"></div>
                  <p className="text-xs uppercase tracking-[1.4em] opacity-40 font-black pl-[1.4em]">Soul Blessing</p>
                  <p className="text-3xl md:text-5xl serif italic font-extralight leading-[1.8] tracking-widest px-6">「{selectedRole.antidote}」</p>
                </div>
              </div>
            </div>

            {/* Sticky Footer Button */}
            <div className="sticky bottom-0 bg-[#FBFBFA]/95 backdrop-blur-2xl p-8 md:p-12 border-t border-[#D1D1C7]/30 shadow-2xl z-[60]">
              <button onClick={closeModal} className="w-full py-7 bg-[#2D2D2D] text-white text-base tracking-[1.2em] uppercase font-black shadow-2xl transition-all hover:bg-black active:scale-[0.98]">關閉 CLOSE</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
