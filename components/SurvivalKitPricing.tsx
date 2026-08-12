import React, { useState } from 'react';

// 生存指南不是「更多人格介紹」，而是回答「我這種人到底該怎麼交易」的方向感。
// 這 7 個問題來自商業漏斗規劃，是這份「個人交易使用說明書」的核心大綱。
const questions = [
  '我最適合什麼交易環境？',
  '什麼行情最容易讓我失控？',
  '我的優勢最常在什麼情況下變成盲點？',
  '我在部位、停損、持有、加碼上最需要注意什麼？',
  '連續虧損時，我最容易出現哪種心理反應？',
  '大行情來時，我最容易錯過或做錯什麼？',
  '我的交易生存守則是什麼？',
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
          FACE 交易生存指南
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-[1.9] text-[#5F554E]">
          你已經知道自己是哪一種交易者了。這份指南只回答一件事——<span className="font-bold text-[#2D2D2D]">你這種人，到底該怎麼交易？</span>
        </p>
        <p className="mt-4 max-w-2xl text-base leading-[1.9] text-[#70665D]">
          它像一份「個人交易使用說明書」，不是 16 型人格百科；買的不是更多介紹，而是屬於你的方向感。
        </p>

        <p className="mt-10 text-sm font-bold tracking-[0.14em] text-[#8C635B]">這份指南會回答你這一型的 7 個關鍵問題</p>
        <ol className="mt-5 grid gap-x-10 gap-y-5 sm:grid-cols-2">
          {questions.map((question, index) => (
            <li key={question} className="flex gap-3 border-t border-[#D1D1C7] pt-4">
              <span className="shrink-0 text-sm font-bold tracking-[0.1em] text-[#8C635B]">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="text-base leading-[1.7] text-[#2D2D2D]">{question}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="flex flex-col justify-between bg-[#2D2D2D] p-7 text-white sm:p-10 lg:p-14">
        <div>
          <p className="text-xs font-bold tracking-[0.24em] text-white/50">一次付費 · 數位內容</p>
          <div className="mt-7 flex flex-wrap items-end gap-x-4 gap-y-2">
            <p className="serif text-5xl leading-none md:text-6xl">
              <span className="mr-2 text-lg">NT$</span>590
            </p>
            <p className="pb-1 text-sm text-white/45 line-through">NT$790</p>
          </div>
          <p className="mt-5 text-sm leading-[1.8] text-white/65">早鳥優惠期間，你這一型的完整生存指南一次解鎖。</p>

          <ul className="mt-9 space-y-4 text-sm leading-7 text-white/85">
            <li className="flex gap-3"><span aria-hidden="true" className="text-[#D9C7A9]">✓</span><span>回答你這一型最關鍵的 7 個交易問題</span></li>
            <li className="flex gap-3"><span aria-hidden="true" className="text-[#D9C7A9]">✓</span><span>依 FACE 人格整理的優勢、盲點與適合的部位與週期</span></li>
            <li className="flex gap-3"><span aria-hidden="true" className="text-[#D9C7A9]">✓</span><span>附可反覆使用的實作工具與 30 天練習方向</span></li>
          </ul>
        </div>

        <div className="mt-10">
          <button
            type="button"
            onClick={() => void startCheckout()}
            disabled={isStartingCheckout}
            className="flex w-full items-center justify-center bg-white px-6 py-4 text-center text-sm font-bold tracking-[0.08em] text-[#2D2D2D] transition hover:bg-[#D9C7A9] disabled:cursor-wait disabled:opacity-65"
          >
            {isStartingCheckout ? '正在前往安全付款頁…' : '立即解鎖我的生存指南 →'}
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
