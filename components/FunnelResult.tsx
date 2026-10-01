import React, { useEffect, useMemo, useState } from 'react';
import { FACE_MAP, getFaceCode } from '../constants';
import { trackFunnelEvent } from '../services/funnelAnalytics';
import type { FaceScores } from '../types';
import { ShareModal } from './ShareModal';
import { submitNpcQuestion } from '../services/npcQuestionService';
import { getFaceRadarData, getFaceScorePairs } from '../lib/faceScorePresentation';
import { ReadingLayerPrototype } from './ReadingLayerPrototype';

interface FunnelResultProps {
  dna: FaceScores;
  onOpenGuide: () => void;
  onLogin: () => void;
  initialEmail?: string;
}

const MESSAGE_TOPICS = ['交易疑問', '內容疑問', '網站建議', '其他'] as const;

export const FunnelResult: React.FC<FunnelResultProps> = ({ dna, onOpenGuide, onLogin, initialEmail = '' }) => {
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
      <ReadingLayerPrototype
        profileCode={code}
        showPrototypeControls={false}
        isUserType
        previewOnly
        onUnlock={onLogin}
        resultVisualization={resultVisualization}
      />

      <section className="mx-auto mt-12 max-w-3xl bg-[#2D2D2D] px-7 py-10 text-center text-white sm:px-12 sm:py-14" aria-labelledby="guide-cta-title">
        <p className="text-xs font-bold tracking-[0.2em] text-[#D9C7A9]">下一步</p>
        <h2 id="guide-cta-title" className="mt-4 serif text-3xl leading-[1.5] sm:text-4xl">知道自己卡在哪裡之後，<br className="hidden sm:block" />下一步是想辦法走出去。</h2>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-white/72 sm:text-base">了解自己只是開始的第一步。一個交易者會不斷經歷四個階段：破繭（理解交易）、生存（學習停損）、進攻（持續獲利）、歸真（認識自己）。</p>
        <button type="button" onClick={openGuide} className="mt-8 min-h-14 w-full max-w-sm bg-white px-7 py-4 text-base font-bold tracking-[0.08em] text-[#2D2D2D] transition hover:bg-[#D9C7A9]">
          看生存篇試讀，領取免費章節 →
        </button>
      </section>

      <div className="mt-8 flex flex-col items-center justify-center gap-4 text-sm sm:flex-row sm:gap-8">
        <button type="button" onClick={openShare} className="border-b border-[#8C7E6D]/50 pb-1 font-medium text-[#4A382D] transition hover:border-[#2D2D2D]">
          覺得有幫助？分享給朋友
        </button>
        <button
          type="button"
          onClick={() => { trackFunnelEvent('result_feedback_click'); setIsFeedbackOpen(true); }}
          className="border-b border-[#8C7E6D]/50 pb-1 font-medium text-[#4A382D] transition hover:border-[#2D2D2D]"
        >
          想對設計者說的話
        </button>
      </div>

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
