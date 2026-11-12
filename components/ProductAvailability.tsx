import React, { useEffect, useRef } from 'react';

// Availability only; no pricing, SKU or entitlement decisions belong here.
const availableItems = [
  { title: '24 題交易人格測驗', status: '免費・免登入', copy: '約 5 分鐘看見你的交易偏好，完成後立即閱讀人格結果。', href: '/test', action: '開始測驗' },
  { title: '完整人格分析', status: '登入免費', copy: '接續同一份測驗結果，登入後免費閱讀完整分析；尚未測驗也可以從結果頁開始。', href: '/my-result', action: '查看我的結果' },
  { title: '交易生存指南', status: '免費篇章已開放', copy: '破繭與生存可直接讀完整篇章，不需先加 LINE。進攻與歸真目前提供試讀。', href: '/guide/line', action: '閱讀免費篇章' },
  { title: 'RATE 鏡相診股', status: '登入後體驗示範', copy: '體驗持倉整理介面。資料與功能屬示範，目前沒有即時行情或雲端持倉保存。', href: '/mirror-trade', action: '了解 RATE 示範' },
] as const;

export const ProductAvailability: React.FC = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (window.location.hash !== '#available-now') return;
    // This route is lazy-loaded; its anchor may not exist at initial navigation.
    const frame = window.requestAnimationFrame(() => {
      titleRef.current?.scrollIntoView({ block: 'start' });
      titleRef.current?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return <section className="mt-10 border border-[#D1D1C7] bg-[#F7F4EF] p-6 sm:p-10" aria-labelledby="available-now">
    <p className="text-xs font-bold tracking-[0.18em] text-[#8C635B]">免費內容與工具狀態</p>
    <h2 id="available-now" ref={titleRef} tabIndex={-1} className="mt-3 scroll-mt-6 serif text-3xl leading-[1.5] text-[#2D2D2D] focus:outline-none">現在可以從這些地方開始</h2>
    <p className="mt-4 text-sm leading-7 text-[#70665D]">先使用已開放的內容；付費說明書與其他交易工具仍在規劃，價格及開放時間未定。</p>
    <div className="mt-7 grid gap-4 sm:grid-cols-2">
      {availableItems.map((item) => <article key={item.title} className="flex flex-col border border-[#D1D1C7] bg-white p-6">
        <p className="w-fit border border-[#C6D4C9] bg-[#F0F5F0] px-3 py-1 text-xs font-medium text-[#355A40]">{item.status}</p>
        <h3 className="mt-4 serif text-2xl text-[#2D2D2D]">{item.title}</h3>
        <p className="mt-3 text-sm leading-7 text-[#70665D]">{item.copy}</p>
        <a href={item.href} className="mt-auto inline-flex min-h-11 w-fit items-center pt-5 text-sm font-bold text-[#4A382D] underline underline-offset-4">{item.action} →</a>
      </article>)}
    </div>
    <div className="mt-5 border-t border-[#D1D1C7] pt-5 text-sm leading-7 text-[#70665D]">
      <p><strong className="font-medium text-[#4A382D]">尚未公開：</strong>FACE Daily 與其他交易工具仍在整理，暫未提供完整產品使用或下載。</p>
      <a href="#manual-plan" className="mt-2 inline-flex min-h-11 items-center text-sm font-bold text-[#4A382D] underline underline-offset-4">了解付費說明書的規劃內容 →</a>
    </div>
  </section>;
};
