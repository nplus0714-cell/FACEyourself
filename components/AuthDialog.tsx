import React, { FormEvent, useState } from 'react';
import { sendEmailMagicLink, signInWithGoogle, signInWithLine } from '../services/authService';

interface AuthDialogProps {
  onClose: () => void;
}

const friendlyError = (error: unknown): string => {
  const message = error instanceof Error ? error.message : '登入暫時無法完成，請稍後再試。';
  if (message.includes('Supabase 尚未設定')) return '登入服務尚未完成設定，請稍後再試。';
  if (message.includes('provider') || message.includes('Provider')) return '此登入方式尚未啟用，請先使用其他方式登入。';
  return message;
};

export const AuthDialog: React.FC<AuthDialogProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState<'google' | 'line' | 'email' | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const begin = async (method: 'google' | 'line') => {
    setLoading(method);
    setError(null);
    try {
      if (method === 'google') await signInWithGoogle();
      else await signInWithLine();
    } catch (caught) {
      setError(friendlyError(caught));
      setLoading(null);
    }
  };

  const submitEmail = async (event: FormEvent) => {
    event.preventDefault();
    const normalizedEmail = email.trim();
    if (!normalizedEmail) return;

    setLoading('email');
    setError(null);
    setNotice(null);
    try {
      await sendEmailMagicLink(normalizedEmail);
      setNotice(`驗證連結已寄到 ${normalizedEmail}，請到信箱點開後回到 FACE。`);
    } catch (caught) {
      setError(friendlyError(caught));
    } finally {
      setLoading(null);
    }
  };

  return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#2D2D2D]/55 p-4" role="dialog" aria-modal="true" aria-labelledby="auth-dialog-title">
    <div className="w-full max-w-md border border-[#D1D1C7] bg-[#FCFBF8] p-7 shadow-2xl md:p-9">
      <div className="flex items-start justify-between gap-5"><div><p className="text-xs font-bold tracking-[0.22em] text-[#8C635B]">MEMBER ACCESS</p><h2 id="auth-dialog-title" className="mt-3 serif text-3xl text-[#2D2D2D]">登入並保存你的結果</h2></div><button type="button" onClick={onClose} className="text-2xl leading-none text-[#70665D] transition hover:text-[#2D2D2D]" aria-label="關閉登入視窗">×</button></div>
      <p className="mt-5 text-sm leading-[1.85] text-[#70665D]">不登入也能直接看結果、分享與看影片。登入後會把這次結果保存到你的帳號，未來能回看變化，並使用 RATE 鏡相診股。</p>

      <div className="mt-7 space-y-3"><button type="button" onClick={() => void begin('google')} disabled={loading !== null} className="flex w-full items-center justify-center border border-[#D1D1C7] bg-white px-5 py-3.5 text-sm font-bold text-[#2D2D2D] transition hover:border-[#2D2D2D] disabled:cursor-wait disabled:opacity-60">{loading === 'google' ? '正在前往 Google…' : '使用 Google 登入'}</button><button type="button" onClick={() => void begin('line')} disabled={loading !== null} className="flex w-full items-center justify-center bg-[#06C755] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#05B64D] disabled:cursor-wait disabled:opacity-60">{loading === 'line' ? '正在前往 LINE…' : '使用 LINE 登入'}</button></div>

      <div className="my-7 flex items-center gap-3 text-xs text-[#8C7E6D]"><span className="h-px flex-1 bg-[#D1D1C7]" />或用 Email 登入<span className="h-px flex-1 bg-[#D1D1C7]" /></div>
      <form onSubmit={submitEmail}><label className="sr-only" htmlFor="auth-email">Email</label><input id="auth-email" value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" placeholder="輸入你的 Email" required disabled={loading !== null} className="w-full border border-[#D1D1C7] bg-white px-4 py-3.5 text-sm text-[#2D2D2D] outline-none transition placeholder:text-[#A69D93] focus:border-[#2D2D2D] disabled:opacity-60" /><button type="submit" disabled={loading !== null} className="mt-3 w-full bg-[#2D2D2D] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-black disabled:cursor-wait disabled:opacity-60">{loading === 'email' ? '正在寄送…' : '寄送 Email 驗證連結'}</button></form>
      {notice && <p className="mt-5 border border-[#9DA99A] bg-[#EEF2EC] px-4 py-3 text-sm leading-6 text-[#40503F]">{notice}</p>}
      {error && <p className="mt-5 border border-[#B98A81] bg-[#F8ECE8] px-4 py-3 text-sm leading-6 text-[#87443D]">{error}</p>}
    </div>
  </div>;
};
