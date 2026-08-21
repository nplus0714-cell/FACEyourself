import React, { useState } from 'react';
import { SITE_IDENTITY } from '../data/siteIdentity';
import { joinEarlyAccessWaitlist } from '../services/earlyAccessWaitlist';

interface EarlyAccessWaitlistFormProps {
  source?: string;
}

export const EarlyAccessWaitlistForm: React.FC<EarlyAccessWaitlistFormProps> = ({
  source = 'survival-kit-pricing',
}) => {
  const [email, setEmail] = useState('');
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
        interest: 'survival_guide',
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
        <p className="serif text-2xl leading-[1.5] text-white">已為你保留早鳥通知</p>
        <p className="mt-3 text-sm leading-7 text-white/75">
          正式開放時，NT$590 早鳥方案、四項數位內容與購買方式會寄到 <span className="text-[#E6D5B8]">{email.trim()}</span>。
        </p>
        <p className="mt-4 text-xs leading-6 text-white/50">這只是提前卡位，不代表購買，也不會自動扣款。</p>
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
        {isSubmitting ? '正在登記…' : '輸入 Email，提前卡位早鳥優惠 →'}
      </button>
      <p className="text-xs leading-6 text-white/50">
        填寫 Email 並非購買，不會產生訂單或扣款；可隨時寄信至 {SITE_IDENTITY.email} 要求停止通知。
      </p>
    </form>
  );
};
