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
      {/* Header */}
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

      {/* 列表網格：垂直化佈局確保圖片不被壓縮 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {roles.map((role) => {
          const isUserType = userCode === role.code;
          return (
            <div 
              key={role.code} 
              onClick={() => setSelectedRole(role)}
              className={`flex flex-col bg-[#FBFBFA] border transition-all duration-1000 cursor-pointer overflow-hidden shadow-sm group active:scale-95 md:active:scale-100 ${
                isUserType 
                ? 'border-[#8C635B] ring-1 ring-[#8C635B]/20 bg-white' 
                : 'border-[#D1D1C7]/40 hover:border-[#2D2D2D] hover:shadow-2xl'
              }`}
            >
              <div className="relative w-full h-60 md:h-52 overflow-hidden">
                <img 
                  src={role.imageUrl} 
                  className={`w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 ${
                    isUserType ? 'grayscale-0 opacity-100' : 'grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100'
                  }`} 
                  alt={role.name} 
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute top-4 left-4">
                  <span className={`text-xs font-mono px-3 py-1 shadow-sm tracking-widest ${
                    isUserType ? 'bg-[#8C635B] text-white' : 'bg-white/90 text-[#8C7E6D]'
                  }`}>
                    {role.id}
                  </span>
                </div>
              </div>

              <div className="p-10 flex flex-col items-center text-center space-y-4">
                <h3 className={`text-2xl serif font-black tracking-widest ${
                  isUserType ? 'text-[#8C635B]' : 'text-[#2D2D2D]'
                }`}>
                  【{role.name}】
                </h3>
                <div className="w-10 h-[0.5px] bg-[#D1D1C7] mx-auto"></div>
                <p className="text-base text-[#8C7E6D] serif italic leading-relaxed tracking-wide px-4">
                  {role.motto}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 詳情 Modal：完美舞台防止裁切 */}
      {selectedRole && (
        <div 
          className={`fixed inset-0 z-[100] flex justify-center bg-[#1A1A1A]/98 backdrop-blur-2xl overflow-y-auto transition-all duration-500 ${isClosing ? 'opacity-0' : 'opacity-100'}`} 
          onClick={closeModal}
          ref={modalContainerRef}
        >
          <div 
            className={`bg-[#1A1A1A] w-full max-w-4xl min-h-screen relative transition-all duration-700 transform ${isClosing ? 'translate-y-20 opacity-0' : 'translate-y-0 opacity-100 shadow-2xl'}`} 
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 z-50 bg-[#1A1A1A]/90 backdrop-blur-md border-b border-white/5 px-8 py-6 flex justify-between items-center text-white/40">
              <span className="text-xs tracking-[0.6em] font-black uppercase pl-[0.6em]">{selectedRole.id} / {selectedRole.code}</span>
              <button onClick={closeModal} className="text-5xl hover:text-white transition-colors">&times;</button>
            </div>

            <div className="pb-40 flex flex-col items-center">
              {/* 圖片展示區 - 解決裁切問題 */}
              <div className="bg-[#1A1A1A] w-full flex flex-col items-center pt-10 px-6 md:px-16">
                <div className="relative w-full max-h-[75vh] flex items-center justify-center">
                  <img 
                    src={selectedRole.imageUrl} 
                    className="w-full h-auto object-contain shadow-2xl transition-all duration-1000 grayscale-[0.05]" 
                    alt={selectedRole.name} 
                    loading="lazy"
                  />
                  <div className="absolute top-8 left-0">
                    <span className="bg-[#2D2D2D] text-white text-[10px] px-5 py-2 font-bold tracking-[0.3em] uppercase">{selectedRole.code}</span>
                  </div>
                </div>

                <div className="mt-20 space-y-10 text-center w-full max-w-4xl pb-16">
                  <h1 className="text-5xl md:text-7xl serif text-white font-black tracking-tight flex flex-col items-center gap-4">
                    <span className="w-16 h-[1.5px] bg-[#8C635B]"></span>
                    【{selectedRole.name}】
                    <span className="w-16 h-[1.5px] bg-[#8C635B]"></span>
                  </h1>
                  <p className="text-2xl md:text-4xl serif italic font-light text-[#D9B5AF] leading-[1.8] tracking-wide">「{selectedRole.motto}」</p>
                </div>
              </div>

              {/* 內容區塊 - Aman 質感留白 */}
              <div className="px-8 md:px-20 mt-24 space-y-24 text-center w-full max-w-4xl">
                <div className="space-y-10 px-6">
                  <span className="text-xs font-black text-white/40 uppercase tracking-[0.8em] block">Full Portrait / 人格全貌</span>
                  <p className="text-2xl md:text-3xl leading-[2.1] text-white/95 serif italic tracking-widest">{selectedRole.portrait}</p>
                </div>

                <div className="bg-[#1A1A1A] py-24 px-12 md:px-24 border border-white/5 space-y-10 my-24 relative">
                  <p className="text-xs font-black text-white/40 uppercase tracking-[0.6em] mb-4">Psychology / 核心心理機制</p>
                  <p className="text-3xl md:text-4xl leading-[2] text-white font-bold serif tracking-wider">{selectedRole.psychology.mechanism}</p>
                  <p className="text-xl md:text-2xl leading-[1.9] text-[#D9B5AF] serif italic mt-12 border-t border-white/10 pt-10 tracking-[0.2em]">“{selectedRole.psychology.scene}”</p>
                </div>

                <div className="space-y-16">
                  <h4 className="text-sm font-black text-[#D9B5AF] uppercase tracking-[1em] flex flex-col items-center gap-5">
                    Blind Spots / 投資盲區
                    <span className="w-24 h-[1.5px] bg-[#A64D4D]"></span>
                  </h4>
                  <div className="space-y-20">
                    {selectedRole.blindSpots.map((bs, i) => (
                      <div key={i} className="space-y-6 bg-white p-14 md:p-20 rounded-sm relative overflow-hidden text-center">
                        <div className="absolute top-0 left-0 w-2 h-full bg-[#A64D4D]"></div>
                        <p className="text-3xl font-black text-[#2D2D2D] tracking-widest">【{bs.title}】</p>
                        <p className="text-xl md:text-2xl leading-[1.9] text-[#555] serif italic tracking-wide">{bs.description}</p>
                        <p className="text-lg md:text-xl leading-relaxed text-[#A64D4D] font-bold border-t border-[#A64D4D]/10 pt-8 max-w-xl mx-auto">{bs.behavior}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#2D2D2D] text-white p-20 md:p-32 text-center space-y-12 rounded-t-[4rem] mt-24 relative overflow-hidden w-full shadow-3xl border-t-2 border-[#8C635B]">
                  <p className="text-[11px] uppercase tracking-[2em] opacity-40 font-black">Soul Blessing</p>
                  <p className="text-4xl md:text-6xl serif italic font-extralight leading-[1.8] tracking-widest">「{selectedRole.antidote}」</p>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-[#1A1A1A]/95 backdrop-blur-2xl p-10 md:p-14 border-t border-white/5 z-[60]">
              <button onClick={closeModal} className="w-full py-8 bg-[#8C635B] text-white text-base tracking-[1.8em] uppercase font-black hover:bg-[#7D5A50] transition-all pl-[1.8em]">關閉 CLOSE</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};