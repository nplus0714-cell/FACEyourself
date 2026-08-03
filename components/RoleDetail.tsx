import React from 'react';
import { CalendarCheck, RefreshCw, ShieldCheck } from 'lucide-react';
import { PersonalityProfile } from '../types';
import { PERSONALITY_EDITORIAL } from '../data/personalityEditorial';

interface RoleDetailProps {
  role: PersonalityProfile;
  isUserType: boolean;
  onBack: () => void;
  compact?: boolean;
  onOpenCompatibility?: () => void;
  onOpenRate?: () => void;
  onOpenContent?: () => void;
}

const toneFor = (code: string) => (code.startsWith('A') ? '#9A655C' : code.startsWith('P') ? '#667784' : '#7C856C');
const TRAIT_LABELS: Record<string, string> = {
  A: '積極', P: '保守',
  R: '理性', I: '感性',
  L: '長期', T: '短期',
  C: '集中', D: '分散',
};
const splitSentences = (text: string) => text.match(/[^。]+。|[^。]+$/g) ?? [text];

const ReadableText: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => (
  <div className={`space-y-3 ${className}`}>
    {splitSentences(text).map((sentence, index) => (
      <p key={`${sentence}-${index}`}>{sentence.trim()}</p>
    ))}
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

export const RoleDetail: React.FC<RoleDetailProps> = ({ role, isUserType, onBack, compact = false, onOpenCompatibility, onOpenRate, onOpenContent }) => {
  const tone = toneFor(role.code);
  const editorial = PERSONALITY_EDITORIAL[role.code];
  const decision = editorial?.decision ?? { title: role.psychology.mechanism, scene: role.psychology.scene };
  const pressurePoints = editorial?.pressurePoints ?? role.blindSpots.map(({ title, description, behavior }) => ({ title, description, action: behavior }));
  const actions = editorial?.actions ?? role.exercises.map(({ title, technique, effect }) => ({ title, description: effect, steps: [technique] }));
  const pouches = editorial?.pouches ?? role.pouches;
  const traitSummary = role.code.split('').map((trait) => TRAIT_LABELS[trait]).join('／');

  return (
    <article className="mx-auto max-w-6xl pb-24 pt-2 fade-in md:pt-8">
      {!compact && <button type="button" onClick={onBack} className="text-base font-bold text-[#70665D] transition hover:text-[#2D2D2D]">
        ← 回到 16 型圖鑑
      </button>}

      {!compact && <header className="mt-7 grid overflow-hidden border border-[#D1D1C7] bg-white md:mt-10 md:grid-cols-2">
        <div className="relative min-h-[22rem] overflow-hidden" style={{ backgroundColor: `${tone}16` }}>
          <img src={role.landscapeImageUrl} alt={role.name} className="absolute inset-0 h-full w-full object-contain object-center mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        </div>
        <div className="flex flex-col justify-center p-8 md:p-12">
          <p className="text-sm font-bold tracking-[0.18em]" style={{ color: tone }}>FACE TYPE PROFILE</p>
          {isUserType && <p className="mt-5 w-fit px-3 py-1.5 text-sm font-bold text-white" style={{ backgroundColor: tone }}>你的交易人格</p>}
          <h1 className="mt-6 serif text-4xl leading-[1.45] text-[#2D2D2D] md:text-5xl">{role.name}</h1>
          <p className="mt-3 text-base font-bold tracking-[0.08em] text-[#70665D]"><span className="mr-4 tracking-[0.16em]" style={{ color: tone }}>{role.code}</span>{traitSummary}</p>
          <div className="mt-7 border-t border-[#D1D1C7] pt-5"><p className="text-sm font-bold tracking-[0.14em]" style={{ color: tone }}>座右銘</p><p className="mt-3 serif text-xl leading-[1.9] text-[#70665D] md:text-2xl">{editorial?.motto ?? role.motto}</p></div>
        </div>
      </header>}

      <div className="mx-auto mt-12 max-w-4xl space-y-14 md:mt-16 md:space-y-20">
        <section className="grid gap-7 md:grid-cols-[10rem_1fr]">
          <SectionLabel number="01" title="你的靈魂畫像" tone={tone} />
          <div>
            <p className="text-base font-bold tracking-[0.08em]" style={{ color: tone }}>角色描述</p>
            <ReadableText text={editorial?.portrait ?? role.portrait} className="mt-3 serif text-xl leading-[2] text-[#2D2D2D] md:text-2xl" />
          </div>
        </section>

        <section className="grid gap-7 border-y border-[#D1D1C7] py-12 md:grid-cols-[10rem_1fr] md:py-14">
          <SectionLabel number="02" title="內心的痛苦與不安" tone={tone} />
          <div>
            <h2 className="serif text-2xl leading-[1.7] text-[#2D2D2D] md:text-3xl">{decision.title}</h2>
            <ReadableText text={decision.scene} className="mt-3 text-base leading-[2] text-[#5F574F] md:text-lg" />
          </div>
        </section>

        <section className="grid gap-7 md:grid-cols-[10rem_1fr]">
          <SectionLabel number="03" title="投資盲區與危機" tone={tone} />
          <div className="grid gap-5 sm:grid-cols-2">
            {pressurePoints.map((point) => (
              <div key={point.title} className={`border border-[#D1D1C7] bg-white p-7 ${pressurePoints.length === 1 ? 'sm:col-span-2' : ''}`}>
                <h3 className="text-xl font-bold leading-[1.5] text-[#2D2D2D]">{point.title}</h3>
                <ReadableText text={point.description} className="mt-3 text-base leading-[2] text-[#5F574F]" />
                <ReadableText text={point.action} className="mt-5 border-t border-[#D1D1C7] pt-4 text-base font-bold leading-[1.9]" />
              </div>
            ))}
          </div>
        </section>

        {onOpenCompatibility && (
          <GentleLink
            eyebrow="交易互補輪盤"
            description="每個風格都有容易忽略的一面。看看和你相近、卻能補上盲點的交易方式。"
            link="打開完整交易互補輪盤"
            onClick={onOpenCompatibility}
            tone={tone}
          />
        )}

        <section className="grid gap-7 border-y border-[#D1D1C7] py-12 md:grid-cols-[10rem_1fr] md:py-14">
          <SectionLabel number="04" title="解決方法：讓心靜下來" tone={tone} />
          <div className="grid gap-5 md:grid-cols-2">
            {actions.map((action) => (
              <div key={action.title} className={`border border-[#D1D1C7] bg-[#F7F4EF] p-7 ${actions.length === 1 ? 'md:col-span-2' : ''}`}>
                <h3 className="text-xl font-bold leading-[1.5] text-[#2D2D2D]">{action.title}</h3>
                <ReadableText text={action.description} className="mt-3 text-base leading-[2] text-[#5F574F]" />
                <ol className="mt-5 space-y-3 border-t border-[#D1D1C7] pt-5 text-base leading-[1.9] text-[#514942]">
                  {action.steps.map((step, index) => <li key={step}><span className="mr-2 font-bold" style={{ color: tone }}>{index + 1}.</span>{step}</li>)}
                </ol>
              </div>
            ))}
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

        <section className="grid gap-7 border border-[#D1D1C7] bg-white p-7 md:grid-cols-[10rem_1fr] md:p-10">
          <SectionLabel number="05" title="解酒錠" tone={tone} />
          <div>
            <h2 className="serif text-2xl leading-[1.5] text-[#2D2D2D] md:text-3xl">給你的三個錦囊</h2>
            <div className="mt-7 grid gap-6 md:grid-cols-3">
              {[
                { label: '保命', text: pouches.safety, hint: '先替自己設一道保護線', Icon: ShieldCheck },
                { label: '轉念', text: pouches.mindset, hint: '換個角度，讓情緒慢下來', Icon: RefreshCw },
                { label: '小錦囊', text: pouches.behavior, hint: '今天就能做的小行動', Icon: CalendarCheck },
              ].map(({ label, text, hint, Icon }) => (
                <div key={label} className="border-t border-[#D1D1C7] pt-4">
                  <Icon aria-hidden="true" className="mb-4" size={26} strokeWidth={1.4} style={{ color: tone }} />
                  <p className="text-base font-bold" style={{ color: tone }}>{label}</p>
                  <p className="mt-1 text-sm leading-[1.7] text-[#8C7E6D]">{hint}</p>
                  <ReadableText text={text} className="mt-3 text-base leading-[2] text-[#5F574F]" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {onOpenContent && (
          <GentleLink
            eyebrow="交易解憂 Bar"
            description="想慢慢理解這些交易習慣，可以從影片與文章裡找到更貼近自己的情境。"
            link="去交易解憂 Bar 看內容"
            onClick={onOpenContent}
            tone={tone}
          />
        )}

        <section className="px-8 py-12 text-center text-white md:px-16 md:py-16" style={{ backgroundColor: tone }}>
          <p className="text-sm font-bold tracking-[0.16em] text-white/70">一句話祝福</p>
          <p className="mx-auto mt-6 max-w-3xl serif text-2xl leading-[1.9] md:text-3xl">{editorial?.reminder ?? role.antidote}</p>
        </section>
      </div>
    </article>
  );
};
