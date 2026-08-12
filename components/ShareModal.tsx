import React, { useEffect, useMemo, useState } from 'react';
import { FaceScores, PersonalityProfile } from '../types';
import { PERSONALITY_EDITORIAL } from '../data/personalityEditorial';

interface ShareModalProps {
  dna: FaceScores;
  profile: PersonalityProfile;
  onClose: () => void;
}

type CopyState = 'idle' | 'copied';

export const ShareModal: React.FC<ShareModalProps> = ({ dna, profile, onClose }) => {
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const [canUseNativeShare, setCanUseNativeShare] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    setCanUseNativeShare(typeof navigator !== 'undefined' && Boolean(navigator.share));

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const shareUrl = useMemo(() => {
    const traits = ['A', 'P', 'R', 'I', 'L', 'T', 'C', 'D'] as const;
    const scores = traits.map((key) => `${key}${dna[key]}`).join('_');
    return `https://faceyourself.vercel.app?dna_share=${scores}`;
  }, [dna]);

  const shareText = PERSONALITY_EDITORIAL[profile.code]?.shareText
    ?? `我完成 FACE 交易人格測驗，結果是「${profile.name}」。`;

  const copyShareMessage = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopyState('copied');
      window.setTimeout(() => setCopyState('idle'), 2200);
    } catch (error) {
      console.error('Unable to copy the sharing message', error);
    }
  };

  const openShareWindow = (url: string, name: string) => {
    window.open(url, name, 'noopener,noreferrer,width=640,height=640');
  };

  const shareToLine = () => {
    openShareWindow(
      `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      'face-share-line',
    );
  };

  const shareToFacebook = () => {
    openShareWindow(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      'face-share-facebook',
    );
  };

  const shareToThreads = () => {
    openShareWindow(
      `https://www.threads.net/intent/post?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`,
      'face-share-threads',
    );
  };

  const shareToX = () => {
    openShareWindow(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      'face-share-x',
    );
  };

  const nativeShare = async () => {
    try {
      await navigator.share({
        title: '我的 FACE 交易人格',
        text: shareText,
        url: shareUrl,
      });
    } catch (error) {
      if ((error as Error).name !== 'AbortError') console.error('Unable to open native sharing', error);
    }
  };

  const secondaryActions = [
    { label: 'Facebook', icon: 'fa-facebook-f', color: 'text-[#1877F2]', onClick: shareToFacebook },
    { label: 'Instagram', icon: 'fa-instagram', color: 'text-[#C13584]', onClick: copyShareMessage },
    { label: 'Threads', icon: 'fa-threads', color: 'text-[#2D2D2D]', onClick: shareToThreads },
    { label: 'X', icon: 'fa-x-twitter', color: 'text-[#2D2D2D]', onClick: shareToX },
  ];

  return (
    <div
      className="fixed inset-0 z-[110] flex items-start justify-center overflow-y-auto bg-[#2D2D2D]/70 p-4 py-8 backdrop-blur-sm md:items-center md:p-8"
      onClick={onClose}
      role="presentation"
    >
      <section
        aria-labelledby="share-dialog-title"
        aria-modal="true"
        role="dialog"
        className="relative my-auto w-full max-w-[40rem] border border-[#D1D1C7] bg-[#FCFBF8] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="h-1 w-full bg-[#8C635B]" />
        <button
          type="button"
          onClick={onClose}
          aria-label="關閉分享視窗"
          className="absolute right-4 top-4 grid h-10 w-10 place-items-center text-2xl leading-none text-[#8C7E6D] transition-colors hover:bg-[#F0ECE6] hover:text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#8C635B]"
        >
          ×
        </button>

        <div className="px-6 py-8 sm:px-10 sm:py-10">
          <div className="border-b border-[#D1D1C7] pb-7 pr-10">
            <p className="text-[11px] font-bold tracking-[0.24em] text-[#8C635B]">SHARE YOUR RESULT</p>
            <h2 id="share-dialog-title" className="mt-3 serif text-[28px] leading-[1.45] text-[#2D2D2D] sm:text-[34px]">
              分享你的交易人格
            </h2>
            <p className="mt-3 max-w-xl text-[15px] leading-7 text-[#6F655B] sm:text-base">
              把結果分享給朋友，一起看看你們在市場中的自然選擇有什麼不同。
            </p>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={shareToLine}
              className="group flex min-h-[76px] items-center justify-between border border-[#06C755] bg-[#06C755] px-5 text-left text-white transition-colors hover:bg-[#05ad4a] focus:outline-none focus:ring-2 focus:ring-[#2D2D2D] focus:ring-offset-2"
            >
              <span>
                <span className="block text-[11px] font-bold tracking-[0.18em] text-white/70">RECOMMENDED</span>
                <span className="mt-1 block text-base font-bold">分享至 LINE</span>
              </span>
              <i className="fa-brands fa-line text-2xl" aria-hidden="true" />
            </button>

            {canUseNativeShare ? (
              <button
                type="button"
                onClick={nativeShare}
                className="group flex min-h-[76px] items-center justify-between bg-[#2D2D2D] px-5 text-left text-white transition-colors hover:bg-[#151515] focus:outline-none focus:ring-2 focus:ring-[#8C635B] focus:ring-offset-2"
              >
                <span>
                  <span className="block text-[11px] font-bold tracking-[0.18em] text-white/55">MOBILE</span>
                  <span className="mt-1 block text-base font-bold">更多分享方式</span>
                </span>
                <i className="fa-solid fa-share-nodes text-xl" aria-hidden="true" />
              </button>
            ) : (
              <button
                type="button"
                onClick={copyShareMessage}
                className="group flex min-h-[76px] items-center justify-between bg-[#2D2D2D] px-5 text-left text-white transition-colors hover:bg-[#151515] focus:outline-none focus:ring-2 focus:ring-[#8C635B] focus:ring-offset-2"
              >
                <span>
                  <span className="block text-[11px] font-bold tracking-[0.18em] text-white/55">STEP 1</span>
                  <span className="mt-1 block text-base font-bold">{copyState === 'copied' ? '已複製分享文字' : '複製分享文字'}</span>
                </span>
                <i className="fa-solid fa-copy text-lg" aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="mt-8 border-t border-[#D1D1C7] pt-6">
            <p className="text-sm font-bold text-[#2D2D2D]">其他平台</p>
            <p className="mt-1 text-sm leading-6 text-[#8C7E6D]">Instagram 會先複製文字與連結，再貼到貼文或限時動態。</p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {secondaryActions.map(({ label, icon, color, onClick }) => (
                <button
                  type="button"
                  key={label}
                  onClick={onClick}
                  className="flex min-h-[62px] items-center justify-center gap-2 border border-[#D1D1C7] bg-white px-3 text-sm font-semibold text-[#2D2D2D] transition-colors hover:border-[#8C635B] hover:bg-[#F7F4EF] focus:outline-none focus:ring-2 focus:ring-[#8C635B] focus:ring-offset-2"
                >
                  <i className={`fa-brands ${icon} ${color}`} aria-hidden="true" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-7 border-l-2 border-[#CDBCB1] bg-[#F7F4EF] px-4 py-3 text-sm leading-6 text-[#6F655B]">
            朋友打開連結後，只會看到這次的交易人格結果，不會看到你的帳號、測驗答案或歷史紀錄。
          </div>
        </div>
      </section>
    </div>
  );
};
