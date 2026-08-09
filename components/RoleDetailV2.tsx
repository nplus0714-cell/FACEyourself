import React, { useState } from 'react';
import { PersonalityProfile } from '../types';
import { PERSONALITY_EDITORIAL_V2, DiscomfortItemV2, TreasureV2 } from '../data/personalityEditorialV2';
import { MASTER_PORTRAIT_BY_CODE } from '../data/masterPortraits';

interface RoleDetailV2Props {
  role: PersonalityProfile;
  isUserType: boolean;
  onBack: () => void;
  compact?: boolean;
  onOpenCompatibility?: () => void;
  onOpenRate?: () => void;
  onOpenContent?: () => void;
  onOpenRole?: (code: string) => void;
}

const toneFor = (code: string) => (code.startsWith('A') ? '#9A655C' : code.startsWith('P') ? '#667784' : '#7C856C');
const TRAIT_LABELS: Record<string, string> = {
  A: '積極', P: '保守',
  R: '理性', I: '感性',
  L: '長期', T: '短期',
  C: '集中', D: '分散',
};

/** 解析 **粗體** 內嵌標記。 */
const renderRich = (text: string): React.ReactNode =>
  text.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={index} className="font-bold text-[#2D2D2D]">{part.slice(2, -2)}</strong>
      : <React.Fragment key={index}>{part}</React.Fragment>,
  );

const Paragraphs: React.FC<{ items: string[]; className?: string }> = ({ items, className = '' }) => (
  <div className={`space-y-4 ${className}`}>
    {items.map((paragraph, index) => <p key={index}>{renderRich(paragraph)}</p>)}
  </div>
);

const SectionLabel: React.FC<{ number: string; title: string; tone: string }> = ({ number, title, tone }) => (
  <p className="text-sm font-bold leading-[1.7] tracking-[0.12em]" style={{ color: tone }}>
    {number}<br />{title}
  </p>
);

const GentleLink: React.FC<{ eyebrow: string; description: string; link: string; onClick: () => void; tone: string }> = ({ eyebrow, description, link, onClick, tone }) => (
  <aside className="ml-auto max-w-3xl border-t border-[#D1D1C7] pt-6 md:pl-[10rem]">
    <p className="text-xs font-bold tracking-[0.14em]" style={{ color: tone }}>{eyebrow}</p>
    <p className="mt-2 text-base leading-7 text-[#70665D]">{description}</p>
    <button type="button" onClick={onClick} className="mt-3 border-b border-current pb-1 text-sm font-bold text-[#2D2D2D] transition-opacity hover:opacity-60">
      {link} →
    </button>
  </aside>
);

/** 救贖動物的正方形線稿圖（personalities-v2-square-line）。 */
const saviorLineArt = (code: string): string => {
  const e = PERSONALITY_EDITORIAL_V2[code];
  return e ? `/images/personalities-v2-square-line/v2-${String(e.index).padStart(2, '0')}-${e.slug}-square-line.png` : '';
};

/** 救贖動物的正方形彩色圖（personalities-v2-square-color），滑鼠移入時顯示。 */
const saviorColorArt = (code: string): string => {
  const e = PERSONALITY_EDITORIAL_V2[code];
  return e ? `/images/personalities-v2-square-color/v2-${String(e.index).padStart(2, '0')}-${e.slug}-square-color.png` : '';
};

/** 「當你感覺不舒服時」互動：複選 → 送出 → 顯示對應救贖動物的線稿圖卡。 */
const DiscomfortSection: React.FC<{
  intro: string;
  items: DiscomfortItemV2[];
  tone: string;
  onOpenRole?: (code: string) => void;
}> = ({ intro, items, tone, onOpenRole }) => {
  const [picked, setPicked] = useState<number[]>([]);
  const [results, setResults] = useState<number[] | null>(null);
  const toggle = (i: number) =>
    setPicked((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));
  const ask = () => setResults([...picked].sort((a, b) => a - b));

  return (
    <div>
      <h3 className="text-base font-bold tracking-[0.08em]" style={{ color: tone }}>當你感覺到「不舒服」時…</h3>
      <p className="mt-3 text-base leading-[1.9] text-[#5F574F]">{intro}</p>

      <div className="mt-5 grid gap-3">
        {items.map((item, i) => {
          const on = picked.includes(i);
          return (
            <label
              key={item.feeling}
              className="flex cursor-pointer items-center gap-3 border px-4 py-4 transition"
              style={on ? { borderColor: tone, backgroundColor: `${tone}12` } : { borderColor: '#D1D1C7', backgroundColor: '#FFFFFF' }}
            >
              <input type="checkbox" className="sr-only" checked={on} onChange={() => toggle(i)} />
              <span
                className="grid h-5 w-5 shrink-0 place-items-center border text-xs font-bold text-white transition"
                style={on ? { borderColor: tone, backgroundColor: tone } : { borderColor: '#C9C4BA' }}
                aria-hidden="true"
              >
                {on ? '✓' : ''}
              </span>
              <span className="text-base font-bold leading-[1.5] text-[#2D2D2D]">{item.feeling}</span>
            </label>
          );
        })}
      </div>

      <button
        type="button"
        onClick={ask}
        className="mt-4 w-full py-4 text-base font-bold tracking-[0.06em] text-white transition hover:opacity-90"
        style={{ backgroundColor: tone }}
      >
        聽聽牠們怎麼說 🐾
      </button>

      {results !== null && (
        <div className="mt-5 space-y-4">
          {results.length === 0 ? (
            <p className="py-2 text-center text-sm text-[#8C7E6D]">先勾一個最有感的，牠們才知道怎麼幫你 🙂</p>
          ) : (
            results.map((i) => {
              const item = items[i];
              const art = saviorLineArt(item.saviorCode);
              const colorArt = saviorColorArt(item.saviorCode);
              return (
                <div key={item.feeling} className="fade-in flex flex-col items-center gap-5 border border-[#D1D1C7] bg-white p-5 sm:flex-row sm:items-start sm:gap-8 sm:p-7">
                  {art && (
                    <button
                      type="button"
                      onClick={() => onOpenRole?.(item.saviorCode)}
                      disabled={!onOpenRole}
                      className="group relative shrink-0 self-center overflow-hidden border border-[#E4DFD6] transition enabled:hover:border-[#8C635B] disabled:cursor-default"
                      style={{ backgroundColor: `${tone}0D` }}
                      aria-label={onOpenRole ? `認識 ${item.saviorName}` : item.saviorName}
                    >
                      <div className="relative h-64 w-64 transition-transform duration-500 group-hover:scale-[1.03] sm:h-72 sm:w-72">
                        <img src={colorArt} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-contain opacity-0 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-100" />
                        <img src={art} alt={item.saviorName} className="absolute inset-0 h-full w-full object-contain opacity-100 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-0" />
                      </div>
                      {onOpenRole && (
                        <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-white/85 py-1.5 text-center text-xs font-bold tracking-[0.08em] opacity-0 transition group-hover:opacity-100" style={{ color: tone }}>
                          點圖片認識牠 →
                        </span>
                      )}
                    </button>
                  )}
                  <div className="min-w-0 text-center sm:pt-3 sm:text-left">
                    <p className="serif text-2xl leading-[1.5] text-[#2D2D2D] md:text-3xl">
                      {item.saviorName}<span className="ml-2 align-middle text-base font-normal text-[#8C7E6D] md:text-lg">想對你說</span>
                    </p>
                    <p className="mt-2 text-sm tracking-[0.06em] text-[#8C7E6D]">轉念 · {item.shift}</p>
                    <p className="mt-4 serif text-xl leading-[2] text-[#514942] md:text-2xl md:leading-[2]">「{item.advice}」</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

/** 專屬寶物卡：圖片邊框邀請點擊，點開後功能文字下拉展開。 */
const TreasureCard: React.FC<{ treasure: TreasureV2; tone: string }> = ({ treasure, tone }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="group flex flex-col bg-[#F7F4EF] p-5 text-left transition duration-200 hover:-translate-y-0.5"
        style={{
          border: `1px solid ${open ? tone : '#D1D1C7'}`,
          boxShadow: open ? `0 10px 26px ${tone}22` : '0 1px 2px rgba(45,45,45,.05)',
        }}
      >
        {treasure.image && (
          <div
            className="mb-4 overflow-hidden border transition-colors duration-200"
            style={{ borderColor: open ? tone : '#E4DFD6', backgroundColor: `${tone}10` }}
          >
            <img
              src={treasure.image}
              alt={treasure.name}
              className="aspect-square h-full w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-[1.05]"
            />
          </div>
        )}
        <div className="flex items-center justify-between gap-2">
          <p className="serif text-xl leading-[1.4] text-[#2D2D2D]">{treasure.name}</p>
          <span
            className="shrink-0 text-sm leading-none transition-transform duration-300"
            style={{ color: tone, transform: open ? 'rotate(180deg)' : 'none' }}
            aria-hidden="true"
          >
            ▾
          </span>
        </div>
        <span className="mt-1.5 text-xs font-bold tracking-[0.1em]" style={{ color: tone }}>
          {open ? '收合' : '點開看功能'}
        </span>
      </button>
      {open && (
        <p
          className="fade-in border border-t-0 bg-white px-5 py-4 text-base leading-[1.9] text-[#5F574F]"
          style={{ borderColor: tone }}
        >
          {treasure.body}
        </p>
      )}
    </div>
  );
};

export const RoleDetailV2: React.FC<RoleDetailV2Props> = ({ role, isUserType, onBack, compact = false, onOpenCompatibility, onOpenRate, onOpenContent, onOpenRole }) => {
  const tone = toneFor(role.code);
  const editorial = PERSONALITY_EDITORIAL_V2[role.code]!;
  const nn = String(editorial.index).padStart(2, '0');
  const textImage = `/images/personalities-v2-text/v2-${nn}-${editorial.slug}-text.png`;
  const landscapeImage = `/images/personalities-v2-landscape/v2-${nn}-${editorial.slug}-landscape.png`;
  const masterPortrait = MASTER_PORTRAIT_BY_CODE[role.code];

  return (
    <article className="mx-auto max-w-6xl pb-24 pt-2 fade-in md:pt-8">
      {!compact && <button type="button" onClick={onBack} className="text-base font-bold text-[#70665D] transition hover:text-[#2D2D2D]">
        ← 回到 16 型圖鑑
      </button>}

      {!compact && <header className="relative mt-7 overflow-hidden border border-[#D1D1C7] bg-[#F7F4EF] md:mt-10">
        <img src={textImage} alt={role.name} className="block w-full" />
        {isUserType && <p className="absolute left-4 top-4 px-3 py-1.5 text-sm font-bold text-white shadow-md" style={{ backgroundColor: tone }}>你的交易人格</p>}
      </header>}

      <div className="mx-auto mt-12 max-w-4xl space-y-14 md:mt-16 md:space-y-20">
        {/* 人格速寫 */}
        <section className="border-y border-[#D1D1C7] py-7">
          <div className="grid gap-5 md:grid-cols-[10rem_1fr]">
            <p className="text-sm font-bold leading-[1.8] tracking-[0.12em]" style={{ color: tone }}>人格速寫</p>
            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold tracking-[0.16em]" style={{ color: tone }}>別人眼中的你</p>
                <p className="mt-1.5 serif text-2xl leading-[1.6] text-[#2D2D2D] md:text-3xl">{editorial.slangName}</p>
              </div>
              <div>
                <p className="text-xs font-bold tracking-[0.16em]" style={{ color: tone }}>你眼中的自己</p>
                <p className="mt-1.5 text-base leading-[1.9] text-[#5F574F] md:text-lg">{editorial.statusLine}</p>
              </div>
              <ul className="flex flex-wrap gap-2" aria-label="人格關鍵字">
                {editorial.tags.map((tag) => <li key={tag} className="border border-[#D1D1C7] bg-white px-3 py-1.5 text-xs tracking-[0.08em] text-[#70665D]">{tag}</li>)}
              </ul>
            </div>
          </div>
        </section>

        {/* 01 你是這樣的人 */}
        <section className="grid gap-7 md:grid-cols-[10rem_1fr]">
          <SectionLabel number="01" title="你是這樣的人" tone={tone} />
          <div>
            <Paragraphs items={editorial.portrait} className="serif text-xl leading-[2] text-[#2D2D2D] md:text-2xl" />
            <div className="mt-8 border border-[#D1D1C7] bg-[#F7F4EF] p-6 md:p-7">
              <p className="text-xs font-bold tracking-[0.14em]" style={{ color: tone }}>🔎 跟你同款的傳奇操盤手</p>
              <div className="mt-4 grid gap-5 sm:grid-cols-[10.5rem_1fr] sm:items-start">
                {masterPortrait && (
                  <figure className="overflow-hidden border border-[#D1D1C7] bg-[#FBFAF7]">
                    <img src={masterPortrait} alt={editorial.master.name} className="aspect-square h-full w-full object-cover" />
                  </figure>
                )}
                <div>
                  <h2 className="serif text-2xl leading-[1.6] text-[#2D2D2D]">{editorial.master.name}</h2>
                  <p className="mt-3 text-base leading-[2] text-[#5F574F]">{renderRich(editorial.master.body)}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 02 你天生的優勢 */}
        <section className="grid gap-7 border-y border-[#D1D1C7] py-12 md:grid-cols-[10rem_1fr] md:py-14">
          <SectionLabel number="02" title="你天生的優勢" tone={tone} />
          <Paragraphs items={editorial.strength} className="text-base leading-[2] text-[#5F574F] md:text-lg" />
        </section>

        {/* 03 一個值得覺察的地方 */}
        <section className="grid gap-7 md:grid-cols-[10rem_1fr]">
          <SectionLabel number="03" title="一個值得覺察的地方" tone={tone} />
          <div>
            <Paragraphs items={editorial.awareness.body} className="text-base leading-[2] text-[#5F574F] md:text-lg" />
            <p className="mt-6 border-l-2 pl-5 serif text-xl leading-[1.9] text-[#2D2D2D]" style={{ borderColor: tone }}>{editorial.awareness.note}</p>
          </div>
        </section>

        {/* 04 讓自己更好 */}
        <section className="grid gap-7 border-y border-[#D1D1C7] py-12 md:grid-cols-[10rem_1fr] md:py-14">
          <SectionLabel number="04" title="讓自己更好" tone={tone} />
          <div className="space-y-12">
            <p className="serif text-xl leading-[1.9] text-[#2D2D2D] md:text-2xl">{editorial.improveIntro}</p>

            {/* 兩種未來 */}
            <div>
              <h3 className="text-base font-bold tracking-[0.08em]" style={{ color: tone }}>兩種未來，你會怎麼選？</h3>
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                {editorial.futures.map((future, index) => (
                  <div key={future.label} className={`border border-[#D1D1C7] p-7 ${index === 0 ? 'bg-white' : 'bg-[#F7F4EF]'}`}>
                    <p className="text-lg font-bold" style={{ color: tone }}>{future.label}</p>
                    <p className="mt-4 text-base leading-[2] text-[#5F574F]">{future.body}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 當你感覺不舒服時（互動：複選 → 對應救贖動物線稿圖卡） */}
            <DiscomfortSection
              key={role.code}
              intro={editorial.discomfort.intro}
              items={editorial.discomfort.items}
              tone={tone}
              onOpenRole={onOpenRole}
            />

            {/* 三個專屬寶物 */}
            <div>
              <h3 className="text-base font-bold tracking-[0.08em]" style={{ color: tone }}>{role.name}的三個專屬寶物</h3>
              <p className="mt-1 text-sm text-[#8C7E6D]">點一下卡片，展開看看它怎麼幫你 ▾</p>
              <div className="mt-5 grid items-start gap-5 md:grid-cols-3">
                {editorial.treasures.map((treasure) => (
                  <TreasureCard key={treasure.name} treasure={treasure} tone={tone} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {onOpenRate && (
          <GentleLink
            eyebrow="RATE 鏡相診股"
            description="想知道真實持倉是否符合你的交易習慣，可以用 RATE 對照你的選擇與部位。"
            link="認識 RATE 鏡相診股"
            onClick={onOpenRate}
            tone={tone}
          />
        )}

        {onOpenCompatibility && (
          <div className="flex flex-col gap-4 border border-[#D1D1C7] bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold tracking-[0.16em]" style={{ color: tone }}>交易互補輪盤</p>
              <p className="mt-2 text-sm leading-[1.8] text-[#70665D]">從你的類型出發，查看相鄰人格與完全鏡像如何補上盲點。</p>
            </div>
            <button type="button" onClick={onOpenCompatibility} className="shrink-0 border-b border-[#2D2D2D] pb-1 text-sm font-bold text-[#2D2D2D] transition hover:text-[#8C635B]">開啟交易互補輪盤 →</button>
          </div>
        )}

        {onOpenContent && (
          <GentleLink
            eyebrow="交易解憂 Bar"
            description="想慢慢理解這些交易習慣，可以從影片與文章裡找到更貼近自己的情境。"
            link="去交易解憂 Bar 看內容"
            onClick={onOpenContent}
            tone={tone}
          />
        )}

        {/* 一句話祝福（底色維持 + 動物浮水印滿版） */}
        <section className="relative overflow-hidden px-8 py-14 text-center text-white md:px-16 md:py-20" style={{ backgroundColor: tone }}>
          <img
            src={landscapeImage}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.18] mix-blend-soft-light"
          />
          <div className="relative z-10">
            <p className="text-sm font-bold tracking-[0.16em] text-white/70">一句話祝福</p>
            <p className="mx-auto mt-6 max-w-3xl serif text-2xl leading-[1.9] md:text-3xl">{editorial.blessing}</p>
          </div>
        </section>
      </div>
    </article>
  );
};
