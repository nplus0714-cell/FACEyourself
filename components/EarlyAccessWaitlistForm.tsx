import React, { useState } from 'react';
import { SITE_IDENTITY } from '../data/siteIdentity';
import {
  joinEarlyAccessWaitlist,
  type EarlyAccessInterest,
} from '../services/earlyAccessWaitlist';

interface EarlyAccessWaitlistFormProps {
  source?: string;
}

const interestOptions: Array<{ value: EarlyAccessInterest; label: string }> = [
  { value: 'full_system', label: '完整 FACE 系統' },
  { value: 'survival_guide', label: '交易生存指南' },
  { value: 'daily_journal', label: 'FACE Daily 覺察日誌' },
  { value: 'trading_tools', label: '交易工具' },
  { value: 'unsure', label: '還不確定，想先了解' },
];

export const EarlyAccessWaitlistForm: React.FC<EarlyAccessWaitlistFormProps> = ({
  source = 'survival-kit-pricing',
}) => {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [interest, setInterest] = useState<EarlyAccessInterest | ''>('');
  const [website, setWebsite] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await joinEarlyAccessWaitlist({
        email,
        nickname,
        interest,
        source,
        marketingConsent,
        website,
      });
      setIsComplete(true);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '目前無法完成登記，請稍後再試。');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isComplete) {
    return (
      <div role="status" className="border border-white/20 bg-white/10 p-6">
        <p className="serif text-2xl leading-[1.5] text-white">已加入早鳥候補名單</p>
        <p className="mt-3 text-sm leading-7 text-white/75">
          產品開放、早鳥方案與交付資訊會寄到 <span className="text-[#E6D5B8]">{email.trim()}</span>。
        </p>
        <p className="mt-4 text-xs leading-6 text-white/50">加入不代表購買，也不會自動扣款。</p>
      </div>
    );
  }

  return (
    <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4">
      <div>
        <label htmlFor="early-access-email" className="mb-2 block text-xs tracking-[0.12em] text-[#E6D5B8]">
          EMAIL <span className="text-white/55">必填</span>
        </label>
        <input
          id="early-access-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="w-full border border-white/20 bg-white/10 px-4 py-3 text-base text-white outline-none placeholder:text-white/35 focus:border-[#E6D5B8]"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="early-access-nickname" className="mb-2 block text-xs tracking-[0.12em] text-[#E6D5B8]">
            暱稱 <span className="text-white/45">選填</span>
          </label>
          <input
            id="early-access-nickname"
            type="text"
            autoComplete="nickname"
            maxLength={30}
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            className="w-full border border-white/20 bg-white/10 px-4 py-3 text-base text-white outline-none placeholder:text-white/35 focus:border-[#E6D5B8]"
          />
        </div>
        <div>
          <label htmlFor="early-access-interest" className="mb-2 block text-xs tracking-[0.12em] text-[#E6D5B8]">
            最想使用 <span className="text-white/45">選填</span>
          </label>
          <select
            id="early-access-interest"
            value={interest}
            onChange={(event) => setInterest(event.target.value as EarlyAccessInterest | '')}
            className="w-full border border-white/20 bg-[#5F4540] px-4 py-3 text-base text-white outline-none focus:border-[#E6D5B8]"
          >
            <option value="">請選擇</option>
            {interestOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="early-access-website">Website</label>
        <input
          id="early-access-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
      </div>

      <label className="flex cursor-pointer items-start gap-3 text-xs leading-6 text-white/70">
        <input
          type="checkbox"
          required
          checked={marketingConsent}
          onChange={(event) => setMarketingConsent(event.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 accent-[#D9C7A9]"
        />
        <span>
          我同意接收產品開放、早鳥方案與服務相關通知，並已閱讀
          <a href="/privacy" className="mx-1 text-[#E6D5B8] underline underline-offset-4">隱私權政策</a>。
        </span>
      </label>

      {errorMessage && <p role="alert" className="text-sm leading-6 text-[#F2B8B5]">{errorMessage}</p>}

      <button
        type="submit"
        disabled={isSubmitting || !email.trim() || !marketingConsent}
        className="flex w-full items-center justify-center bg-white px-6 py-4 text-center text-sm font-bold tracking-[0.08em] text-[#2D2D2D] transition hover:bg-[#D9C7A9] disabled:cursor-wait disabled:opacity-65"
      >
        {isSubmitting ? '正在登記…' : '加入早鳥候補名單 →'}
      </button>
      <p className="text-xs leading-6 text-white/50">
        加入不代表購買，也不會自動扣款；可隨時寄信至 {SITE_IDENTITY.email} 要求停止通知。
      </p>
    </form>
  );
};
