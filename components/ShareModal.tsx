
import React, { useState, useEffect } from 'react';
import { FaceScores, PersonalityProfile } from '../types';

interface ShareModalProps {
  dna: FaceScores;
  profile: PersonalityProfile;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ dna, profile, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [igCopied, setIgCopied] = useState(false);

  // 當彈窗開啟時，鎖定背景滾動
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // 指定分享的基礎網址
  const shareBaseUrl = "https://faceyourself.vercel.app";

  const generateShareUrl = () => {
    const scores = Object.entries(dna).map(([k, v]) => `${k}${v}`).join('_');
    return `${shareBaseUrl}?dna_share=${scores}`;
  };

  const shareText = `測測看你是什麼交易風格？什麼動物～我在「FACE 投資人格日記」測出的靈魂定錨是：【${profile.name}】！`;

  const handleCopy = () => {
    const fullText = `${shareText}\n${generateShareUrl()}`;
    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleIgCopy = () => {
    const fullText = `${shareText}\n${generateShareUrl()}`;
    navigator.clipboard.writeText(fullText).then(() => {
      setIgCopied(true);
      setTimeout(() => setIgCopied(false), 2000);
    });
  };

  const shareToLine = () => {
    const url = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(generateShareUrl())}&text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareToFB = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(generateShareUrl())}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareToThreads = () => {
    const url = `https://www.threads.net/intent/post?text=${encodeURIComponent(shareText + ' ' + generateShareUrl())}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareToX = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(generateShareUrl())}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'FACE 投資人格日記',
        text: shareText,
        url: generateShareUrl(),
      }).catch(console.error);
    } else {
      handleCopy();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[110] flex justify-center items-start bg-[#2D2D2D]/80 backdrop-blur-sm p-4 overflow-y-auto pt-12 md:pt-20 fade-in overscroll-contain"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-xs border border-[#D1D1C7] shadow-2xl relative overflow-hidden flex flex-col items-center animate-fade-in-down mb-20"
        onClick={e => e.stopPropagation()}
      >
        {/* Decorative Header */}
        <div className="w-full h-1 bg-[#8C635B]"></div>
        <button 
          onClick={onClose} 
          className="absolute top-2 right-3 text-2xl text-[#8C7E6D] hover:text-[#2D2D2D] transition-colors z-10"
        >
          &times;
        </button>
        
        <div className="p-6 md:p-8 space-y-5 w-full text-center">
          <div className="space-y-1">
            <span className="text-[9px] tracking-[0.4em] text-[#8C7E6D] uppercase font-black block">Share Session</span>
            <h3 className="text-xl serif text-[#2D2D2D] font-bold tracking-widest">分享我的靈魂</h3>
            <div className="w-6 h-[0.5px] bg-[#D1D1C7] mx-auto mt-1"></div>
          </div>

          <div className="grid grid-cols-1 gap-1.5 w-full">
            {/* 1. 複製連結 */}
            <button 
              onClick={handleCopy}
              className="group flex items-center justify-between px-4 py-3 border border-[#D1D1C7]/40 hover:border-[#2D2D2D] transition-all bg-[#FBFBFA]/50"
            >
              <div className="flex flex-col items-start text-left">
                <span className="text-[7px] font-mono text-[#8C7E6D] uppercase tracking-widest mb-0.5">Method 01</span>
                <span className="text-[11px] font-bold text-[#2D2D2D] serif uppercase tracking-[0.1em]">
                  {copied ? '已複製！' : '複製連結與文本'}
                </span>
              </div>
              <i className="fa-solid fa-link text-[#8C7E6D] group-hover:text-[#2D2D2D] transition-colors text-base"></i>
            </button>

            {/* 2. 分享至 LINE */}
            <button 
              onClick={shareToLine}
              className="group flex items-center justify-between px-4 py-3 border border-[#D1D1C7]/40 hover:border-[#06C755] hover:bg-[#06C755]/5 transition-all"
            >
              <div className="flex flex-col items-start text-left">
                <span className="text-[7px] font-mono text-[#8C7E6D] uppercase tracking-widest mb-0.5">Method 02</span>
                <span className="text-[11px] font-bold text-[#2D2D2D] serif uppercase tracking-[0.1em]">分享至 LINE</span>
              </div>
              <i className="fa-brands fa-line text-xl text-[#06C755]"></i>
            </button>

            {/* 3. 分享至 FB */}
            <button 
              onClick={shareToFB}
              className="group flex items-center justify-between px-4 py-3 border border-[#D1D1C7]/40 hover:border-[#1877F2] hover:bg-[#1877F2]/5 transition-all"
            >
              <div className="flex flex-col items-start text-left">
                <span className="text-[7px] font-mono text-[#8C7E6D] uppercase tracking-widest mb-0.5">Method 03</span>
                <span className="text-[11px] font-bold text-[#2D2D2D] serif uppercase tracking-[0.1em]">分享至 FB</span>
              </div>
              <i className="fa-brands fa-facebook-f text-lg text-[#1877F2]"></i>
            </button>

            {/* 4. 分享至 IG */}
            <button 
              onClick={handleIgCopy}
              className="group flex items-center justify-between px-4 py-3 border border-[#D1D1C7]/40 hover:border-[#E4405F] hover:bg-[#E4405F]/5 transition-all"
            >
              <div className="flex flex-col items-start text-left">
                <span className="text-[7px] font-mono text-[#8C7E6D] uppercase tracking-widest mb-0.5">Method 04</span>
                <span className="text-[11px] font-bold text-[#2D2D2D] serif uppercase tracking-[0.1em]">
                   {igCopied ? '已複製！' : '分享至 Instagram'}
                </span>
              </div>
              <i className="fa-brands fa-instagram text-xl text-[#E4405F]"></i>
            </button>

            {/* 5. 分享至 Threads */}
            <button 
              onClick={shareToThreads}
              className="group flex items-center justify-between px-4 py-3 border border-[#D1D1C7]/40 hover:border-[#2D2D2D] hover:bg-black/5 transition-all"
            >
              <div className="flex flex-col items-start text-left">
                <span className="text-[7px] font-mono text-[#8C7E6D] uppercase tracking-widest mb-0.5">Method 05</span>
                <span className="text-[11px] font-bold text-[#2D2D2D] serif uppercase tracking-[0.1em]">分享至 Threads</span>
              </div>
              <i className="fa-brands fa-threads text-lg text-[#2D2D2D]"></i>
            </button>

            {/* 6. 分享至 X (Twitter) */}
            <button 
              onClick={shareToX}
              className="group flex items-center justify-between px-4 py-3 border border-[#D1D1C7]/40 hover:border-[#2D2D2D] hover:bg-black/5 transition-all"
            >
              <div className="flex flex-col items-start text-left">
                <span className="text-[7px] font-mono text-[#8C7E6D] uppercase tracking-widest mb-0.5">Method 06</span>
                <span className="text-[11px] font-bold text-[#2D2D2D] serif uppercase tracking-[0.1em]">分享至 X (Twitter)</span>
              </div>
              <i className="fa-brands fa-x-twitter text-lg text-[#2D2D2D]"></i>
            </button>

            {/* 7. 系統原生分享 */}
            {navigator.share && (
              <button 
                onClick={handleNativeShare}
                className="group flex items-center justify-between px-4 py-3 bg-[#2D2D2D] text-white hover:bg-black transition-all mt-1"
              >
                <div className="flex flex-col items-start text-left">
                  <span className="text-[7px] font-mono opacity-50 uppercase tracking-widest mb-0.5">Method 07</span>
                  <span className="text-[11px] font-bold serif uppercase tracking-[0.1em]">系統原生分享</span>
                </div>
                <i className="fa-solid fa-share-nodes text-base"></i>
              </button>
            )}
          </div>

          <p className="text-[9px] text-[#8C7E6D] italic serif leading-relaxed opacity-60 px-2 mt-2">
            「測完快分享給朋友！在交流中完善真實的自己。」
          </p>
        </div>
        
        <div className="w-full p-3 bg-[#F5F5F0] border-t border-[#D1D1C7]/30 text-center">
            <p className="text-[7px] tracking-[0.2em] font-mono text-[#8C7E6D] uppercase font-bold">Soul Diary Protocol V3.4</p>
        </div>
      </div>
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};
