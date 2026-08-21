import React, { useEffect, useRef, useState } from 'react';
import { getSupabaseClient } from '../lib/supabase';
import { EARLY_ACCESS_MAILTO, PRODUCT_PREVIEW_DISCLAIMER, SITE_IDENTITY } from '../data/siteIdentity';

// 正式交付、訂單通知與退款規則完成驗收後，才由環境設定開啟收款。
const COMMERCE_ENABLED = import.meta.env.VITE_PAYMENTS_ENABLED === 'true';

const learningPath = [
  {
    step: '01',
    title: '破繭｜停止追逐答案',
    description: '不猜必中，先準備下一步。',
  },
  {
    step: '02',
    title: '生存｜為錯誤設下邊界',
    description: '控制代價，保留下一次機會。',
  },
  {
    step: '03',
    title: '進攻｜讓優勢形成結果',
    description: '看懂風報，該行動時行動。',
  },
  {
    step: '04',
    title: '歸真｜建立自己的方法',
    description: '找到符合個性與生活的節奏。',
  },
];

const plannedContents = [
  'FACE Survival｜建立交易原則與風險邊界',
  'FACE Daily｜記錄情緒、計畫與行動落差',
  '交易計畫卡｜進場前寫下條件與部位',
  'RR 風報計算機｜把把握度換成可比較的數字',
  'RATE 鏡相診斷儀＋擴充包｜診斷持股、安排複查',
];

const productSlideOrder = [
  '/images/survival-kit/face-detail-survival-chapters.png',
  '/images/survival-kit/face-detail-survival-guide.png',
  '/images/survival-kit/face-detail-complete-set.png',
  '/images/survival-kit/face-detail-daily-journal.png',
  '/images/survival-kit/face-detail-trading-tools.png',
  '/images/survival-kit/face-physical-concept.png',
  '/images/survival-kit/face-desktop-mockup.png',
  '/images/survival-kit/face-mobile-suite.png',
  '/images/survival-kit/face-physical-design-board.png',
  '/images/survival-kit/face-ecosystem-overview.png',
];

const productSlides = [
  {
    title: '完整交易系統',
    description: '指南、日誌與工具，連成一套交易流程。',
    src: '/images/survival-kit/face-ecosystem-overview.png',
    alt: 'FACE 交易生存指南、覺察日誌與交易工具的桌機及手機系統示意',
  },
  {
    title: '四階段交易路徑',
    description: '破繭、生存、進攻、歸真。',
    src: '/images/survival-kit/face-detail-survival-chapters.png',
    alt: 'FACE Survival 交易生存指南封面與四階段章節內頁特寫',
  },
  {
    title: '每天帶得走的交易流程',
    description: '看盤前後，隨手記錄與複查。',
    src: '/images/survival-kit/face-mobile-suite.png',
    alt: 'FACE Survival、FACE Daily 與交易工具箱的手機介面示意',
  },
  {
    title: '一本用來反覆複查的指南',
    description: '在風險與情緒裡，回到原則。',
    src: '/images/survival-kit/face-detail-survival-guide.png',
    alt: '酒紅色 FACE Survival 交易生存指南與書寫工具特寫',
  },
  {
    title: '每天留下一次自我覺察',
    description: '看見情緒與行動的落差。',
    src: '/images/survival-kit/face-detail-daily-journal.png',
    alt: 'FACE Daily 自我覺察日誌封面與內頁特寫',
  },
  {
    title: '把抽象感覺寫成可以檢查的數字',
    description: '把感覺變成可檢查的數字。',
    src: '/images/survival-kit/face-detail-trading-tools.png',
    alt: 'FACE 交易計畫卡、風險計算與 RATE 診斷工具特寫',
  },
  {
    title: '從指南到工具的完整組合',
    description: '從理解、記錄到實際執行。',
    src: '/images/survival-kit/face-detail-complete-set.png',
    alt: 'FACE Survival、FACE Daily、計畫卡與交易工具完整組合特寫',
  },
  {
    title: '從閱讀到實際操作',
    description: '讓原則落地成每天可用的工具。',
    src: '/images/survival-kit/face-physical-concept.png',
    alt: 'FACE 實體指南、日誌、計畫卡與風險工具的產品概念陳列',
  },
  {
    title: '桌機版系統模擬',
    description: '所有工具，集中在同一個工作台。',
    src: '/images/survival-kit/face-desktop-mockup.png',
    alt: 'FACE 交易學習與實踐系統的桌機版介面模擬圖',
  },
  {
    title: '實體產品設計',
    description: '完整產品規格與系統設計。',
    src: '/images/survival-kit/face-physical-design-board.png',
    alt: 'FACE Survival、FACE Daily 與交易工具的實體產品設計規格圖',
  },
].sort(
  (left, right) => productSlideOrder.indexOf(left.src) - productSlideOrder.indexOf(right.src),
);

const productLoopSlides = [...productSlides, productSlides[0]];

interface SurvivalKitPricingProps {
  isLoggedIn?: boolean;
  hasAccess?: boolean;
  onRequireLogin?: () => void;
  onOpenMemberAccess?: () => void;
}

export const SurvivalKitPricing: React.FC<SurvivalKitPricingProps> = ({
  isLoggedIn = false,
  hasAccess = false,
  onRequireLogin,
  onOpenMemberAccess,
}) => {
  const [isStartingCheckout, setIsStartingCheckout] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [activeProductSlide, setActiveProductSlide] = useState(0);
  const [isProductCarouselPaused, setIsProductCarouselPaused] = useState(false);
  const productCarouselRef = useRef<HTMLDivElement>(null);
  const productLoopResetTimerRef = useRef<number | null>(null);
  const isProductLoopingRef = useRef(false);
  const productDragRef = useRef({
    isDragging: false,
    pointerId: -1,
    startX: 0,
    startScrollLeft: 0,
  });

  const showProductSlide = (index: number) => {
    const carousel = productCarouselRef.current;

    if (productLoopResetTimerRef.current !== null) {
      window.clearTimeout(productLoopResetTimerRef.current);
      productLoopResetTimerRef.current = null;
    }
    isProductLoopingRef.current = false;

    if (index >= productSlides.length && carousel) {
      isProductLoopingRef.current = true;
      setActiveProductSlide(0);
      carousel.scrollTo({
        left: carousel.clientWidth * productSlides.length,
        behavior: 'smooth',
      });
      productLoopResetTimerRef.current = window.setTimeout(() => {
        carousel.scrollTo({ left: 0, behavior: 'auto' });
        isProductLoopingRef.current = false;
        setActiveProductSlide(0);
        productLoopResetTimerRef.current = null;
      }, 700);
      return;
    }

    const nextIndex = (index + productSlides.length) % productSlides.length;
    setActiveProductSlide(nextIndex);
    if (carousel) {
      carousel.scrollTo({
        left: carousel.clientWidth * nextIndex,
        behavior: index < 0 ? 'auto' : 'smooth',
      });
    }
  };

  const syncProductSlide = () => {
    const carousel = productCarouselRef.current;
    if (!carousel || carousel.clientWidth === 0 || isProductLoopingRef.current) return;
    const nextIndex = Math.round(carousel.scrollLeft / carousel.clientWidth);
    if (nextIndex >= 0 && nextIndex < productSlides.length) {
      setActiveProductSlide(nextIndex);
    }
  };

  const startProductDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    const carousel = productCarouselRef.current;
    if (!carousel) return;

    productDragRef.current = {
      isDragging: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: carousel.scrollLeft,
    };
    carousel.setPointerCapture(event.pointerId);
    setIsProductCarouselPaused(true);
  };

  const moveProductDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const carousel = productCarouselRef.current;
    const drag = productDragRef.current;
    if (!carousel || !drag.isDragging || drag.pointerId !== event.pointerId) return;

    event.preventDefault();
    carousel.scrollLeft = drag.startScrollLeft - (event.clientX - drag.startX);
  };

  const finishProductDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const carousel = productCarouselRef.current;
    const drag = productDragRef.current;
    if (!carousel || !drag.isDragging || drag.pointerId !== event.pointerId) return;

    if (carousel.hasPointerCapture(event.pointerId)) {
      carousel.releasePointerCapture(event.pointerId);
    }
    productDragRef.current.isDragging = false;
    const nextIndex = Math.round(carousel.scrollLeft / carousel.clientWidth);
    showProductSlide(nextIndex);
    setIsProductCarouselPaused(false);
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isProductCarouselPaused || prefersReducedMotion || document.hidden) return;

    const timer = window.setTimeout(() => {
      showProductSlide(activeProductSlide + 1);
    }, 4600);

    return () => window.clearTimeout(timer);
  }, [activeProductSlide, isProductCarouselPaused]);

  useEffect(() => () => {
    if (productLoopResetTimerRef.current !== null) {
      window.clearTimeout(productLoopResetTimerRef.current);
    }
  }, []);

  const startCheckout = async () => {
    if (!COMMERCE_ENABLED) {
      setCheckoutError('方案內容目前開放預覽，正式交付完成前不會收款。');
      return;
    }
    if (hasAccess) {
      onOpenMemberAccess?.();
      return;
    }
    if (!isLoggedIn) {
      onRequireLogin?.();
      return;
    }
    setIsStartingCheckout(true);
    setCheckoutError(null);
    try {
      const { data } = await getSupabaseClient().auth.getSession();
      const accessToken = data.session?.access_token;
      if (!accessToken) {
        setIsStartingCheckout(false);
        onRequireLogin?.();
        return;
      }
      const response = await fetch('/api/payments/ecpay/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
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
    <section id="survival-kit" className="scroll-mt-8 overflow-hidden border border-[#C8B5A8] bg-[#F3ECE5]" aria-labelledby="survival-kit-title">
      <div className="grid lg:grid-cols-[minmax(0,0.88fr)_minmax(28rem,1.12fr)]">
        <div className="order-2 flex flex-col justify-center border-b border-[#CDBCAF] bg-[#F3ECE5] p-7 sm:p-10 lg:order-none lg:border-b-0 lg:border-r lg:p-14">
          <p className="text-xs font-bold tracking-[0.24em] text-[#8C635B]">PLAN PREVIEW · EARLY ACCESS</p>
          <h2 id="survival-kit-title" className="mt-5 serif text-4xl leading-[1.4] text-[#2D2D2D] md:text-5xl">
            FACE Survival<br />交易生存指南
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-[1.85] text-[#5F554E]">
            市場一動，你是否還做得到<span className="text-[#9D665C]">原本知道的事？</span>
          </p>
          <p className="mt-4 max-w-xl text-base leading-[1.85] text-[#70665D]">
            從原則、計畫到複查，建立能長期執行的交易系統。
          </p>
          <p className="mt-6 max-w-xl border-l-2 border-[#A66F63] pl-5 serif text-xl leading-[1.7] text-[#2D2D2D]">
            看錯能退，看對能留。
          </p>
          <div className="mt-8 grid max-w-xl grid-cols-3 border-y border-[#D1C3B7] py-4 text-center text-sm leading-[1.65] text-[#70665D]">
            <p className="border-r border-[#D1C3B7]"><span className="block text-xs tracking-[0.12em] text-[#9D665C]">交易前</span>寫下計畫</p>
            <p className="border-r border-[#D1C3B7]"><span className="block text-xs tracking-[0.12em] text-[#9D665C]">持有中</span>複查條件</p>
            <p><span className="block text-xs tracking-[0.12em] text-[#9D665C]">離場後</span>留下紀錄</p>
          </div>
        </div>

        <div
          className="order-1 border-b border-[#CDBCAF] bg-[#82685E] p-5 text-white sm:p-8 lg:order-none lg:border-b-0 lg:p-10"
          onMouseEnter={() => setIsProductCarouselPaused(true)}
          onMouseLeave={() => setIsProductCarouselPaused(false)}
          onFocusCapture={() => setIsProductCarouselPaused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
              setIsProductCarouselPaused(false);
            }
          }}
          onTouchStart={() => setIsProductCarouselPaused(true)}
          onTouchEnd={() => setIsProductCarouselPaused(false)}
        >
          <div className="mb-5">
            <p className="text-xs tracking-[0.22em] text-white/45">PRODUCT PREVIEW</p>
          </div>

          <div role="region" aria-roledescription="carousel" aria-label="FACE 產品照預覽">
            <div
              ref={productCarouselRef}
              onScroll={syncProductSlide}
              onPointerDown={startProductDrag}
              onPointerMove={moveProductDrag}
              onPointerUp={finishProductDrag}
              onPointerCancel={finishProductDrag}
              className="flex cursor-grab snap-x snap-mandatory select-none overflow-x-auto active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {productLoopSlides.map((slide, index) => {
                const isLoopClone = index === productSlides.length;
                return (
                <figure
                  key={`${slide.src}-${index}`}
                  className="min-w-full snap-center border border-[#D8C6B8] bg-[#F2EAE1]"
                  role={isLoopClone ? undefined : 'group'}
                  aria-roledescription={isLoopClone ? undefined : 'slide'}
                  aria-label={isLoopClone ? undefined : `${index + 1} / ${productSlides.length}`}
                  aria-hidden={isLoopClone ? true : undefined}
                >
                  <div className="aspect-[4/3] overflow-hidden bg-[#F2EAE1] p-2 sm:p-3">
                    <img
                      src={slide.src}
                      alt={isLoopClone ? '' : slide.alt}
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                      className="block h-full w-full object-contain object-center"
                    />
                  </div>
                  <figcaption className="border-t border-white/15 bg-[#74584F] px-5 py-4">
                    <p className="serif text-xl leading-[1.5] text-white">{slide.title}</p>
                    <p className="mt-1 text-sm leading-[1.75] text-white/65">{slide.description}</p>
                    <p className="mt-3 border-t border-white/15 pt-3 text-xs leading-5 text-white/55">{PRODUCT_PREVIEW_DISCLAIMER}</p>
                  </figcaption>
                </figure>
                );
              })}
            </div>
          </div>

          <div className="mt-5">
            <div className="flex gap-2" aria-label="選擇產品圖片">
              {productSlides.map((slide, index) => (
                <button
                  key={slide.src}
                  type="button"
                  onClick={() => showProductSlide(index)}
                  className={`h-2 transition-all ${activeProductSlide === index ? 'w-8 bg-[#D9C7A9]' : 'w-2 bg-white/30 hover:bg-white/55'}`}
                  aria-label={`查看第 ${index + 1} 張：${slide.title}`}
                  aria-current={activeProductSlide === index ? 'true' : undefined}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid border-t border-[#C8B5A8] lg:grid-cols-[minmax(0,1.08fr)_minmax(20rem,0.92fr)]">
        <div className="border-b border-[#CDBCAF] bg-[#E9DDD0] p-7 sm:p-10 lg:border-b-0 lg:border-r lg:p-14">
          <p className="text-xs font-bold tracking-[0.22em] text-[#8C635B]">THE SURVIVAL PATH</p>
          <h3 className="mt-4 serif text-3xl leading-[1.5] text-[#2D2D2D]">四段路徑，建立自己的交易系統</h3>
          <ol className="mt-7 grid gap-x-10 gap-y-6 sm:grid-cols-2">
            {learningPath.map((item) => (
              <li key={item.step} className="border-t border-[#D1D1C7] pt-4">
                <div className="flex items-baseline gap-3">
                  <span className="shrink-0 text-sm font-bold tracking-[0.1em] text-[#8C635B]">{item.step}</span>
                  <h4 className="serif text-xl leading-[1.55] text-[#2D2D2D]">{item.title}</h4>
                </div>
                <p className="mt-2 pl-9 text-[15px] leading-[1.75] text-[#70665D]">{item.description}</p>
              </li>
            ))}
          </ol>

          <a
            href="/watch/trading-decisions-under-uncertainty"
            className="group mt-10 grid overflow-hidden border border-[#C8B5A8] bg-[#F7F1EA] transition hover:border-[#9D6B61] hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#8C635B] focus:ring-offset-4 sm:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]"
            aria-label="免費試閱 FACE 生存指南：交易不是找到正確性，而是學會在不確定中做決定"
          >
            <figure className="border-b border-[#D7C9BC] sm:border-b-0 sm:border-r">
              <div className="aspect-[16/9] overflow-hidden bg-[#EFE5DA] sm:h-full sm:min-h-48 sm:aspect-auto">
                <img
                  src="/images/survival-kit/face-detail-survival-chapters.png"
                  alt="FACE Survival 交易生存指南與四階段章節示意"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.025]"
                />
              </div>
              <figcaption className="sr-only">{PRODUCT_PREVIEW_DISCLAIMER}</figcaption>
            </figure>
            <div className="flex flex-col justify-center p-6 sm:p-7">
              <p className="text-xs font-medium tracking-[0.2em] text-[#9D665C]">FREE PREVIEW · 序言</p>
              <h4 className="mt-3 serif text-xl leading-[1.55] text-[#2D2D2D] sm:text-2xl">
                交易不是找到正確性，而是學會在不確定中做決定
              </h4>
              <p className="mt-3 text-sm leading-[1.8] text-[#70665D]">
                先讀一篇，看看 FACE 如何把交易心理整理成可以帶走的判斷方式。
              </p>
              <span className="mt-5 text-sm font-medium text-[#8C635B]">免費試閱交易生存指南 →</span>
            </div>
          </a>
          <p className="mt-3 text-xs leading-5 text-[#8C8178]">{PRODUCT_PREVIEW_DISCLAIMER}</p>
        </div>

        <div className="flex flex-col justify-between bg-[#5F4540] p-7 text-white sm:p-10 lg:p-14">
          <div>
            <p className="text-xs font-bold tracking-[0.24em] text-white/50">EARLY ACCESS · 完整系統預覽</p>
            <h3 className="mt-5 serif text-3xl leading-[1.5] text-white">把判斷，變成每天做得到的行動</h3>
            <p className="mt-4 text-sm leading-[1.8] text-white/70">
              先寫計畫，再依條件複查；讓決策回到紀律，不被情緒接手。
            </p>
            <div className="mt-7 flex flex-wrap items-end gap-x-5 gap-y-3">
              <div>
                <p className="mb-2 text-xs tracking-[0.14em] text-[#D9C7A9]">早鳥價</p>
                <p className="serif text-5xl leading-none md:text-6xl">
                  <span className="mr-2 text-lg">NT$</span>590
                </p>
              </div>
              <div className="pb-1">
                <p className="mb-1 text-xs tracking-[0.1em] text-white/45">正式定價</p>
                <p className="text-sm text-white/45 line-through">NT$1,190</p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-[1.75] text-white/65">一次付費；正式交付驗收後開放早鳥購買。</p>

            <p className="mt-9 text-xs font-bold tracking-[0.16em] text-[#D9C7A9]">完整方案內容</p>
            <ul className="mt-5 space-y-4 text-sm leading-7 text-white/85">
              {plannedContents.map((item) => (
                <li key={item} className="flex gap-3 border-b border-white/10 pb-4 last:border-b-0 last:pb-0">
                  <span aria-hidden="true" className="text-[#D9C7A9]">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10">
            {!COMMERCE_ENABLED ? (
              <a
                href={EARLY_ACCESS_MAILTO}
                className="flex w-full items-center justify-center bg-white px-6 py-4 text-center text-sm font-bold tracking-[0.08em] text-[#2D2D2D] transition hover:bg-[#D9C7A9]"
              >
                加入早鳥候補名單 →
              </a>
            ) : (
              <button
                type="button"
                onClick={() => void startCheckout()}
                disabled={isStartingCheckout}
                className="flex w-full items-center justify-center bg-white px-6 py-4 text-center text-sm font-bold tracking-[0.08em] text-[#2D2D2D] transition hover:bg-[#D9C7A9] disabled:cursor-wait disabled:opacity-65"
              >
                {hasAccess
                  ? '已解鎖，進入我的 FACE →'
                  : isStartingCheckout
                    ? '正在前往安全付款頁…'
                    : isLoggedIn
                      ? '立即解鎖我的生存指南 →'
                      : '登入後解鎖生存指南 →'}
              </button>
            )}
            {checkoutError && <p role="alert" className="mt-3 text-sm leading-6 text-[#F2B8B5]">{checkoutError}</p>}
            {!COMMERCE_ENABLED && <p className="mt-3 text-sm leading-6 text-[#D9C7A9]">以 Email 登記，不會立即收款；正式開放時會寄送方案與交付說明。</p>}
            <p className="mt-4 text-xs leading-6 text-white/45">
              本產品提供交易教育、自我覺察與風險管理工具，不提供個別標的、買賣時點、持倉建議或報酬保證。
            </p>
            <dl className="mt-5 grid grid-cols-[5.5rem_1fr] gap-x-3 gap-y-1 border-t border-white/10 pt-4 text-xs leading-6 text-white/50">
              <dt>品牌</dt><dd>{SITE_IDENTITY.brand}</dd>
              <dt>服務提供者</dt><dd>{SITE_IDENTITY.provider}</dd>
              <dt>聯絡信箱</dt><dd><a href={`mailto:${SITE_IDENTITY.email}`} className="underline underline-offset-4">{SITE_IDENTITY.email}</a></dd>
              <dt>聯絡地址</dt><dd>{SITE_IDENTITY.address}</dd>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
};
