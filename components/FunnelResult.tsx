import React, { useEffect, useMemo, useState } from 'react';
import { Facebook, Instagram, Music2, Youtube } from 'lucide-react';
import { FACE_MAP, getFaceCode } from '../constants';
import { trackFunnelEvent } from '../services/funnelAnalytics';
import type { FaceScores } from '../types';
import { ShareModal } from './ShareModal';
import { submitNpcQuestion } from '../services/npcQuestionService';
import { getFaceRadarData, getFaceScorePairs } from '../lib/faceScorePresentation';
import { ReadingLayerPrototype } from './ReadingLayerPrototype';

interface FunnelResultProps {
  dna: FaceScores;
  saveStatus?: 'cloud' | 'browser' | 'memory' | null;
  onOpenGuide: () => void;
  onLogin: () => void;
  initialEmail?: string;
}

const MESSAGE_TOPICS = ['交易疑問', '內容疑問', '網站建議', '其他'] as const;

const PRIMARY_CHANNELS = [
  { label: 'YouTube', handle: '@FACETrader-k1h', href: 'https://www.youtube.com/@FACETrader-k1h', Icon: Youtube, color: 'text-[#C4302B]' },
  { label: 'Instagram', handle: '@face_tradernpc', href: 'https://www.instagram.com/face_tradernpc', Icon: Instagram, color: 'text-[#B44F7B]' },
  { label: 'Facebook', handle: '@61594374326311', href: 'https://www.facebook.com/61594374326311', Icon: Facebook, color: 'text-[#1877F2]' },
  { label: 'TikTok', handle: '@face_tradernpc', href: 'https://www.tiktok.com/@face_tradernpc', Icon: Music2, color: 'text-[#2D2D2D]' },
] as const;

export const FunnelResult: React.FC<FunnelResultProps> = ({ dna, saveStatus, onOpenGuide, onLogin, initialEmail = '' }) => {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState(initialEmail);
  const [feedbackTopic, setFeedbackTopic] = useState<(typeof MESSAGE_TOPICS)[number]>('交易疑問');
  const [feedbackConsent, setFeedbackConsent] = useState(false);
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [feedbackError, setFeedbackError] = useState('');
  const code = useMemo(() => getFaceCode(dna), [dna]);
  const profile = FACE_MAP[code] ?? FACE_MAP.ARTC;
  const resultVisualization = useMemo(() => ({
    pairs: getFaceScorePairs(dna),
    radarData: getFaceRadarData(dna),
  }), [dna]);

  useEffect(() => {
    trackFunnelEvent('result_view');
  }, []);

  const openGuide = () => {
    trackFunnelEvent('survival_guide_click');
    onOpenGuide();
  };

  const openShare = () => {
    trackFunnelEvent('result_share_click');
    setIsShareOpen(true);
  };

  return (
    <div className="mx-auto max-w-5xl pb-20 fade-in">
      {saveStatus === 'browser' && <p role="alert" className="mb-6 border border-[#B98A83] bg-[#F8EFED] px-5 py-4 text-sm leading-7 text-[#744A44]">雲端暫時無法保存這次測驗。結果已暫存在這個瀏覽器；請勿清除瀏覽資料。服務恢復後，登入時會再嘗試存入帳號。</p>}
      {saveStatus === 'memory' && <p role="alert" className="mb-6 border border-[#B98A83] bg-[#F8EFED] px-5 py-4 text-sm leading-7 text-[#744A44]">這次結果目前無法保存到雲端或此瀏覽器。請先留在本頁閱讀，離開或重新整理後可能需要重新測驗。</p>}
      <ReadingLayerPrototype
        profileCode={code}
        showPrototypeControls={false}
        isUserType
        previewOnly
        onUnlock={onLogin}
        resultVisualization={resultVisualization}
      />

      <section className="relative mx-auto mt-12 min-h-[310px] max-w-3xl overflow-hidden border border-[#D1D1C7] bg-[#2D2D2D] text-white" aria-labelledby="guide-cta-title">
        <img src="/images/content-hub/survival-guide-cover.png" alt="金雕與北極熊閱讀 FACE 交易生存指南" className="absolute inset-0 h-full w-full object-cover saturate-110" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#211916]/95 via-[#211916]/68 to-[#211916]/20" />
        <div className="relative flex min-h-[310px] max-w-xl flex-col justify-end p-7 sm:p-10">
          <p className="text-xs font-medium tracking-[0.22em] text-[#E9D39A]">FACE 交易生存指南</p>
          <h2 id="guide-cta-title" className="mt-3 serif text-3xl leading-[1.35] sm:text-4xl">下一步，學著走出去。</h2>
          <p className="mt-4 text-sm leading-7 text-white/85">從破繭、生存、進攻到歸真，慢慢整理出一套你做得出來的交易過程。</p>
          <button type="button" onClick={openGuide} className="mt-7 w-fit border-b border-white/80 pb-1 text-sm font-medium text-white transition hover:border-[#E9D39A] hover:text-[#E9D39A]">看生存篇試讀，領取免費章節 →</button>
        </div>
      </section>

      <section className="mx-auto mt-8 grid max-w-3xl gap-4 sm:grid-cols-2" aria-label="分享結果與提供回饋">
        <button type="button" onClick={openShare} className="group relative min-h-64 overflow-hidden border border-[#D1D1C7] bg-[#2D2D2D] p-6 text-left text-white sm:p-8">
          <img src="/images/homepage-trading-salon.png" alt="FACE 動物交易沙龍" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#211916]/95 via-[#211916]/50 to-[#211916]/10" />
          <div className="relative flex min-h-48 flex-col justify-end"><p className="text-xs font-medium tracking-[0.2em] text-[#E9D39A]">SHARE FACE</p><h2 className="mt-3 serif text-3xl leading-[1.3]">分享這份結果</h2><p className="mt-3 text-sm leading-6 text-white/80">把你的交易傾向，傳給也在交易路上的朋友。</p><span className="mt-5 w-fit border-b border-white/80 pb-1 text-sm font-medium">分享給朋友 →</span></div>
        </button>
        <button type="button" onClick={() => { trackFunnelEvent('result_feedback_click'); setIsFeedbackOpen(true); }} className="group relative min-h-64 overflow-hidden border border-[#D1D1C7] bg-[#2D2D2D] p-6 text-left text-white sm:p-8">
          <img src="/images/npc/ask-npc-bar-background.jpg" alt="交易解憂 Bar 的 NPC" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#211916]/95 via-[#211916]/50 to-[#211916]/10" />
          <div className="relative flex min-h-48 flex-col justify-end"><p className="text-xs font-medium tracking-[0.2em] text-[#E9D39A]">MESSAGE NPC</p><h2 className="mt-3 serif text-3xl leading-[1.3]">想對 NPC 說的話</h2><p className="mt-3 text-sm leading-6 text-white/80">留下你的交易困惑，或告訴我網站可以更好的地方。</p><span className="mt-5 w-fit border-b border-white/80 pb-1 text-sm font-medium">留下私密留言 →</span></div>
        </button>
      </section>

      <section className="mx-auto mt-8 max-w-3xl" aria-labelledby="follow-face-title">
        <h2 id="follow-face-title" className="mb-5 serif text-2xl text-[#2D2D2D]">歡迎追蹤</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {PRIMARY_CHANNELS.map((channel) => <a key={channel.label} href={channel.href} target="_blank" rel="noopener noreferrer" aria-label={`FACE Trader｜知己交易 ${channel.handle}（另開視窗）`} className="flex min-h-20 items-center gap-4 border border-[#D1D1C7] bg-white px-5 py-4 text-[#2D2D2D] transition hover:border-[#8C635B] hover:bg-[#F7F4EF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8C635B]">
            <channel.Icon size={26} strokeWidth={1.7} className={`shrink-0 ${channel.color}`} aria-hidden="true" />
            <span className="min-w-0"><span className="block text-base font-bold">FACE Trader｜知己交易</span><span className="mt-1 block break-all text-xs font-normal text-[#70665D]">{channel.handle}</span></span>
          </a>)}
        </div>
      </section>

      {isFeedbackOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2D2D2D]/60 px-4 py-6" role="dialog" aria-modal="true" aria-labelledby="feedback-title">
        <form className="max-h-full w-full max-w-lg overflow-y-auto border border-[#D1D1C7] bg-[#FCFBF8] p-6 shadow-2xl sm:p-9" onSubmit={async (event) => {
          event.preventDefault();
          if (!feedback.trim() || !feedbackEmail.trim() || !feedbackConsent) return;
          setFeedbackStatus('sending');
          setFeedbackError('');
          try {
            await submitNpcQuestion({ email: feedbackEmail, message: `【${feedbackTopic}】\n${feedback}`, faceCode: code, consent: feedbackConsent });
            setFeedbackStatus('sent');
          } catch (error) {
            setFeedbackError(error instanceof Error ? error.message : '目前無法送出，請稍後再試。');
            setFeedbackStatus('error');
          }
        }}>
          <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold tracking-[0.18em] text-[#8C635B]">給 FACE 設計者</p><h2 id="feedback-title" className="mt-3 serif text-3xl text-[#2D2D2D]">想對設計者說的話</h2></div><button type="button" onClick={() => setIsFeedbackOpen(false)} className="text-2xl text-[#70665D]" aria-label="關閉">×</button></div>
          <p className="mt-4 text-sm leading-7 text-[#70665D]">對交易有疑問、對內容有疑問，或想給網站建議，都可以留在這裡。留言不會公開；請留下 Email，方便我回覆你。</p>
          <fieldset className="mt-6"><legend className="text-sm font-bold text-[#4A382D]">你想聊什麼？</legend><div className="mt-3 grid grid-cols-2 gap-2">{MESSAGE_TOPICS.map((topic) => <label key={topic} className={`cursor-pointer border px-3 py-2.5 text-center text-sm ${feedbackTopic === topic ? 'border-[#8C635B] bg-[#F3EAE4] text-[#4A382D]' : 'border-[#D1D1C7] bg-white text-[#70665D]'}`}><input className="sr-only" type="radio" name="feedback-topic" value={topic} checked={feedbackTopic === topic} onChange={() => setFeedbackTopic(topic)} />{topic}</label>)}</div></fieldset>
          <label htmlFor="feedback-message" className="mt-5 block text-sm font-bold text-[#4A382D]">你想說的話</label>
          <textarea id="feedback-message" required value={feedback} onChange={(event) => { setFeedback(event.target.value); setFeedbackStatus('idle'); }} rows={4} maxLength={3900} placeholder="例如：交易時遇到的困惑、內容看不懂的地方，或網站可以改進的地方……" className="mt-2 w-full resize-y border border-[#D1D1C7] bg-white px-4 py-3 text-sm leading-7 text-[#2D2D2D] outline-none focus:border-[#8C635B]" />
          <label htmlFor="feedback-email" className="mt-4 block text-sm font-bold text-[#4A382D]">回覆用 Email</label>
          <input id="feedback-email" type="email" required autoComplete="email" value={feedbackEmail} onChange={(event) => { setFeedbackEmail(event.target.value); setFeedbackStatus('idle'); }} placeholder="you@example.com" className="mt-2 w-full border border-[#D1D1C7] bg-white px-4 py-3 text-sm text-[#2D2D2D] outline-none focus:border-[#8C635B]" />
          <label className="mt-5 flex items-start gap-3 text-xs leading-6 text-[#70665D]"><input type="checkbox" required checked={feedbackConsent} onChange={(event) => setFeedbackConsent(event.target.checked)} className="mt-1" /><span>我同意 FACE 依<a href="/privacy" className="underline underline-offset-2">隱私權政策</a>處理 Email、留言與人格代碼，僅用於回覆這次留言。</span></label>
          {feedbackStatus === 'sent' && <p role="status" className="mt-3 text-sm text-[#527257]">已收到你的私密留言；若需要回覆，我會寄到你留下的 Email。</p>}
          {feedbackStatus === 'error' && <p role="alert" className="mt-3 text-sm text-[#A35D55]">{feedbackError}</p>}
          <button type="submit" disabled={feedbackStatus === 'sending' || feedbackStatus === 'sent'} className="mt-6 min-h-12 w-full bg-[#2D2D2D] px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-45">{feedbackStatus === 'sending' ? '正在送出…' : feedbackStatus === 'sent' ? '已送出' : '送出私密留言'}</button>
        </form>
      </div>}

      {isShareOpen && <ShareModal dna={dna} profile={profile} onClose={() => setIsShareOpen(false)} />}
    </div>
  );
};
