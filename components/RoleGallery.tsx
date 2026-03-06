
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
    <div className="space-y-8 fade-in pb-32 px-1 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col items-center space-y-4 border-b border-[#D1D1C7] pb-6 pt-2">
        <div className="text-center space-y-1">
          <span className="text-[9px] text-[#8C7E6D] uppercase tracking-[0.6em] font-black block">The Soul Archive</span>
          <h2 className="text-3xl serif text-[#2D2D2D] font-light tracking-widest">靈魂圖鑑</h2>
        </div>
        <button 
          onClick={onBack} 
          className="w-full max-w-[200px] text-[10px] tracking-[0.4em] uppercase text-[#2D2D2D] border border-[#2D2D2D] py-3 hover:bg-[#2D2D2D] hover:text-white transition-all duration-700 font-bold shadow-sm"
        >
          返回 DASHBOARD
        </button>
      </div>

      {/* 列表網格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((role) => {
          const isUserType = userCode === role.code;
          return (
            <div 
              key={role.code} 
              onClick={() => setSelectedRole(role)}
              className={`flex bg-[#FBFBFA] border transition-all duration-700 cursor-pointer overflow-hidden h-32 ${isUserType ? 'border-[#8C635B] ring-1 ring-[#8C635B]/10 shadow-lg' : 'border-[#D1D1C7]/40 hover:border-[#8C7E6D]'}`}
            >
              <div className="relative w-[35%] h-full overflow-hidden">
                <img src={role.imageUrl} className={`w-full h-full object-cover grayscale opacity-80 ${isUserType ? 'grayscale-0 opacity-100' : ''}`} alt={role.name} />
                <div className="absolute top-1.5 left-1.5">
                  <span className={`text-[7px] font-mono px-1.5 py-0.5 ${isUserType ? 'bg-[#8C635B] text-white' : 'bg-white/90 text-[#8C7E6D]'}`}>{role.id}</span>
                </div>
              </div>
              <div className="w-[65%] p-4 flex flex-col justify-center space-y-1">
                <h3 className={`text-lg serif font-black tracking-tight ${isUserType ? 'text-[#8C635B]' : 'text-[#2D2D2D]'}`}>【{role.name}】</h3>
                <p className="text-[10px] text-[#8C7E6D] line-clamp-2 serif italic leading-relaxed">{role.motto}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 詳情 Modal */}
      {selectedRole && (
        <div 
          className={`fixed inset-0 z-[100] flex justify-center bg-[#2D2D2D]/95 backdrop-blur-md overflow-y-auto transition-all duration-500 ${isClosing ? 'opacity-0' : 'opacity-100'}`} 
          onClick={closeModal}
          ref={modalContainerRef}
        >
          <div 
            className={`bg-[#FBFBFA] w-full max-w-2xl min-h-screen relative transition-all duration-500 transform ${isClosing ? 'translate-y-10 opacity-0' : 'translate-y-0 opacity-100 shadow-2xl'}`} 
            onClick={e => e.stopPropagation()}
          >
            {/* Sticky Header */}
            <div className="sticky top-0 z-50 bg-[#FBFBFA]/95 border-b border-[#D1D1C7]/30 px-6 py-4 flex justify-between items-center shadow-sm">
              <span className="text-[10px] tracking-[0.3em] font-black text-[#8C7E6D] uppercase">{selectedRole.id} / {selectedRole.code}</span>
              <button onClick={closeModal} className="text-2xl text-[#8C7E6D] hover:text-[#2D2D2D] p-1.5 transition-colors">&times;</button>
            </div>

            <div className="pb-24 flex flex-col items-center">
              {/* 視覺定錨區 */}
              <div className="bg-white border-b border-[#D1D1C7]/20 pb-10 w-full flex flex-col items-center">
                <div className="aspect-[21/9] w-full overflow-hidden relative">
                  <img src={selectedRole.imageUrl} className="w-full h-full object-cover grayscale-[0.1]" alt={selectedRole.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
                  {/* 人格代碼標籤移動至左上角 */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-[#2D2D2D] text-white text-[9px] px-3 py-1 font-bold tracking-[0.1em] uppercase shadow-md inline-block">{selectedRole.code}</span>
                  </div>
                </div>

                <div className="px-6 mt-8 space-y-4 text-center w-full">
                  <h1 className="text-3xl md:text-4xl serif text-[#2D2D2D] font-black tracking-tight">【{selectedRole.name}】</h1>
                  <div className="w-10 h-[1px] bg-[#8C635B] mx-auto"></div>
                  <p className="text-xl serif italic font-medium text-[#8C635B] leading-relaxed px-4">「{selectedRole.motto}」</p>
                </div>
              </div>

              {/* 內容區 */}
              <div className="px-6 md:px-12 mt-10 space-y-12 text-center w-full max-w-xl">
                <div className="space-y-4">
                  <span className="text-[9px] font-black text-[#8C7E6D] uppercase tracking-[0.4em] block">Full Portrait / 人格全貌</span>
                  <p className="text-[15px] leading-[1.6] text-[#2D2D2D] serif italic opacity-90">{selectedRole.portrait}</p>
                </div>

                <div className="bg-[#F5F5F0] p-6 border-y border-[#D1D1C7]/30 shadow-inner space-y-3">
                   <p className="text-[9px] font-black text-[#8C7E6D] uppercase tracking-[0.3em]">Psychology / 核心心理機制</p>
                   <p className="text-[16px] leading-relaxed text-[#2D2D2D] font-bold serif">{selectedRole.psychology.mechanism}</p>
                   <p className="text-[13px] leading-relaxed text-[#8C7E6D] serif italic mt-2 border-t border-[#D1D1C7]/20 pt-3">“{selectedRole.psychology.scene}”</p>
                </div>

                {/* 雙盲區 */}
                <div className="space-y-6">
                  <h4 className="text-[11px] font-black text-[#A64D4D] uppercase tracking-[0.5em] flex flex-col items-center gap-2">
                    Blind Spots / 投資盲區
                    <span className="w-12 h-[1px] bg-[#A64D4D]"></span>
                  </h4>
                  <div className="space-y-8">
                    {selectedRole.blindSpots.map((bs, i) => (
                      <div key={i} className="space-y-2">
                        <p className="text-[15px] font-black text-[#2D2D2D] tracking-wider">【{bs.title}】</p>
                        <p className="text-[14px] leading-[1.6] text-[#555] serif italic">{bs.description}</p>
                        <p className="text-[12px] leading-relaxed text-[#A64D4D] font-bold border-t border-[#A64D4D]/10 pt-2 max-w-sm mx-auto">{bs.behavior}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 回歸練習 */}
                <div className="space-y-6">
                  <h4 className="text-[11px] font-black text-[#4D7A4D] uppercase tracking-[0.5em] flex flex-col items-center gap-2">
                    Practice / 回歸練習
                    <span className="w-12 h-[1px] bg-[#4D7A4D]"></span>
                  </h4>
                  <div className="space-y-4">
                    {selectedRole.exercises.map((ex, i) => (
                      <div key={i} className="bg-white p-5 border border-[#D1D1C7]/40 shadow-sm rounded-sm space-y-2">
                        <div className="text-[8px] font-black text-[#4D7A4D] uppercase tracking-widest">Exercise 0{i+1}：{ex.title}</div>
                        <p className="text-[15px] leading-relaxed text-[#2D2D2D] font-bold serif italic">“{ex.technique}”</p>
                        <p className="text-[11px] text-[#8C7E6D] uppercase tracking-widest font-black">— {ex.effect}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 三個錦囊 */}
                <div className="space-y-6">
                  <h4 className="text-[11px] font-black text-[#8C635B] uppercase tracking-[0.6em]">Emergency Kit / 靈魂錦囊</h4>
                  <div className="grid grid-cols-1 gap-4 text-center">
                    {Object.values(selectedRole.pouches).map((p, i) => {
                       const icons = ['💊', '🛡️', '✨'];
                       return (
                        <div key={i} className="bg-white border-b border-[#D1D1C7]/50 p-4 space-y-1 shadow-sm">
                            <span className="text-2xl block mb-0.5">{icons[i]}</span>
                            <p className="text-[14px] font-bold text-[#2D2D2D] serif leading-relaxed italic px-2">{p}</p>
                        </div>
                       );
                    })}
                  </div>
                </div>

                {/* 解酒錠 */}
                <div className="bg-[#2D2D2D] text-white p-10 text-center space-y-6 rounded-t-2xl mt-12 relative overflow-hidden w-full">
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-[#8C635B]"></div>
                  <p className="text-[9px] uppercase tracking-[1em] opacity-30 font-black pl-[1em]">Soul Blessing</p>
                  <p className="text-xl md:text-2xl serif italic font-medium leading-[1.6] tracking-tight px-2">「{selectedRole.antidote}」</p>
                </div>
              </div>
            </div>

            {/* Footer Button */}
            <div className="sticky bottom-0 bg-[#FBFBFA]/95 backdrop-blur-md p-6 border-t border-[#D1D1C7]/20 shadow-2xl">
              <button onClick={closeModal} className="w-full py-4 bg-[#2D2D2D] text-white text-[12px] tracking-[0.8em] uppercase font-black shadow-xl transition-all hover:bg-black">關閉 CLOSE</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
