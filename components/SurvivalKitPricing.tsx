import React, { useState } from 'react';

const benefits = [
  {
    label: '完整數位指南',
    description: '從交易幻覺、風險承擔到復盤，建立一套能持續執行的交易規則。',
  },
  {
    label: 'FACE 完整人格報告',
    description: '看懂你的交易優勢、慣性盲點，以及更適合你的部位與週期。',
  },
  {
    label: '4 個核心實作工具',
    description: '交易情緒日記、期望值計算器、交易計畫卡與倉位計算器、復盤報告。',
  },
  {
    label: '30 天練習計畫',
    description: '把人格洞察轉成下一步能開始、能追蹤，也能回頭檢視的行動。',
  },
];

export const SurvivalKitPricing: React.FC = () => {
  const [isStartingCheckout, setIsStartingCheckout] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const startCheckout = async () => {
    setIsStartingCheckout(true);
    setCheckoutError(null);
    try {
      const response = await fetch('/api/payments/ecpay/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productCode: 'face-survival-kit' }),
      });
      const payload = await response.json() as {
        action?: string;
        fields?: Record<string, string>;
        error?: { message?: string };
      };
      if (!response.ok || !payload.action || !payload.fields) {
        throw new Error(payload.error?.message || '目前無法建立付款訂單。');
      }

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = payload.action;
      Object.entries(payload.fields).forEach(([name, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : '目前無法建立付款訂單。');
      setIsStartingCheckout(false);
    }
  };

  return (
  <section id="survival-kit" className="scroll-mt-8 border border-[#B9AA9D] bg-[#F7F4EF]" aria-labelledby="survival-kit-title">
    <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)]">
      <div className="border-b border-[#D1D1C7] p-7 sm:p-10 lg:border-b-0 lg:border-r lg:p-14">
        <p className="text-xs font-bold tracking-[0.24em] text-[#8C635B]">PAID PLAN · EARLY BIRD</p>
        <h2 id="survival-kit-title" className="mt-5 serif text-4xl leading-[1.4] text-[#2D2D2D] md:text-5xl">
          FACE 交易生存包
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-[1.9] text-[#5F554E]">
          不是告訴你買什麼，而是陪你找出：你是哪一種交易者，以及下一步可以怎麼做。
        </p>

        <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {benefits.map((benefit, index) => (
            <article key={benefit.label} className="border-t border-[#D1D1C7] pt-5">
              <p className="text-[11px] font-bold tracking-[0.18em] text-[#8C635B]">
                {String(index + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-3 text-base font-bold text-[#2D2D2D]">{benefit.label}</h3>
              <p className="mt-2 text-sm leading-[1.85] text-[#70665D]">{benefit.description}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="flex flex-col justify-between bg-[#2D2D2D] p-7 text-white sm:p-10 lg:p-14">
        <div>
          <p className="text-xs font-bold tracking-[0.24em] text-white/50">一次付費 · 數位內容</p>
          <div className="mt-7 flex flex-wrap items-end gap-x-4 gap-y-2">
            <p className="serif text-5xl leading-none md:text-6xl">
              <span className="mr-2 text-lg">NT$</span>699
            </p>
            <p className="pb-1 text-sm text-white/45 line-through">NT$899</p>
          </div>
          <p className="mt-5 text-sm leading-[1.8] text-white/65">早鳥優惠期間，完整內容與工具一次解鎖。</p>

          <ul className="mt-9 space-y-4 text-sm leading-7 text-white/85">
            <li className="flex gap-3"><span aria-hidden="true" className="text-[#D9C7A9]">✓</span><span>完整指南與四套可反覆使用的工具</span></li>
            <li className="flex gap-3"><span aria-hidden="true" className="text-[#D9C7A9]">✓</span><span>依 FACE 人格整理的盲點與練習方向</span></li>
            <li className="flex gap-3"><span aria-hidden="true" className="text-[#D9C7A9]">✓</span><span>購買後引導，從第一篇交易日記開始</span></li>
          </ul>
        </div>

        <div className="mt-10">
          <button
            type="button"
            onClick={() => void startCheckout()}
            disabled={isStartingCheckout}
            className="flex w-full items-center justify-center bg-white px-6 py-4 text-center text-sm font-bold tracking-[0.08em] text-[#2D2D2D] transition hover:bg-[#D9C7A9] disabled:cursor-wait disabled:opacity-65"
          >
            {isStartingCheckout ? '正在前往安全付款頁…' : '立即購買早鳥方案 →'}
          </button>
          {checkoutError && <p role="alert" className="mt-3 text-sm leading-6 text-[#F2B8B5]">{checkoutError}</p>}
          <p className="mt-4 text-xs leading-6 text-white/45">
            本產品提供交易教育、自我覺察與風險管理工具，不提供個別標的、買賣時點、持倉建議或報酬保證。
          </p>
        </div>
      </div>
    </div>
  </section>
  );
};
