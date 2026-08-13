import React from 'react';
import { CalendarCheck, RefreshCw, ShieldCheck } from 'lucide-react';
import { PersonalityProfile } from '../types';
import { PERSONALITY_EDITORIAL } from '../data/personalityEditorial';
import { PERSONALITY_EDITORIAL_V2 } from '../data/personalityEditorialV2';
import { MASTER_PORTRAIT_BY_CODE } from '../data/masterPortraits';
import { FACE_MAP } from '../constants';
import { RoleDetailV2 } from './RoleDetailV2';
import { RoleDetailPrototype } from './RoleDetailPrototype';
import { FACE_2_PROTOTYPES } from '../data/faceProfilePrototype';

const NAME_TO_CODE: Record<string, string> = Object.values(FACE_MAP).reduce((map, role) => {
  map[role.name] = role.code;
  return map;
}, {} as Record<string, string>);

interface RoleDetailProps {
  role: PersonalityProfile;
  isUserType: boolean;
  onBack: () => void;
  compact?: boolean;
  onOpenCompatibility?: () => void;
  onOpenRate?: () => void;
  onOpenContent?: () => void;
  onOpenDeepDive?: (code: string) => void;
  onOpenRole?: (code: string) => void;
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

export const RoleDetail: React.FC<RoleDetailProps> = ({ role, isUserType, onBack, compact = false, onOpenCompatibility, onOpenRate, onOpenContent, onOpenDeepDive, onOpenRole }) => {
  // 已完成 FACE 2.0 專用內容的類型使用新原型；未遷移的類型維持既有 V2 版型。
  if (FACE_2_PROTOTYPES[role.code]) {
    return (
      <RoleDetailPrototype
        role={role}
        isUserType={isUserType}
        onBack={onBack}
        compact={compact}
        onOpenCompatibility={onOpenCompatibility}
        onOpenRate={onOpenRate}
        onOpenContent={onOpenContent}
        onOpenDeepDive={onOpenDeepDive}
      />
    );
  }

  // 已遷移到 V2 圖鑑內容的代碼改用 V2 版型；其餘沿用舊版。
  if (PERSONALITY_EDITORIAL_V2[role.code]) {
    return (
      <RoleDetailV2
        role={role}
        isUserType={isUserType}
        onBack={onBack}
        compact={compact}
        onOpenCompatibility={onOpenCompatibility}
        onOpenRate={onOpenRate}
        onOpenContent={onOpenContent}
        onOpenRole={onOpenRole}
      />
    );
  }

  const tone = toneFor(role.code);
  const editorial = PERSONALITY_EDITORIAL[role.code];
  const masterPortraitUrl = MASTER_PORTRAIT_BY_CODE[role.code];
  const decision = editorial?.decision ?? { title: role.psychology.mechanism, scene: role.psychology.scene, desireTitle: '', desireScene: '' };
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
        {(editorial?.slangName || editorial?.statusLine || editorial?.tags) && (
          <section className="border-y border-[#D1D1C7] py-7">
            <div className="grid gap-5 md:grid-cols-[10rem_1fr]">
              <p className="text-sm font-bold leading-[1.8] tracking-[0.12em]" style={{ color: tone }}>人格速寫</p>
              <div className="space-y-6">
                {editorial.slangName && (
                  <div>
                    <p className="text-xs font-bold tracking-[0.16em]" style={{ color: tone }}>別人眼中的你</p>
                    <p className="mt-1.5 serif text-2xl leading-[1.6] text-[#2D2D2D] md:text-3xl">{editorial.slangName}</p>
                  </div>
                )}
                {editorial.statusLine && (
                  <div>
                    <p className="text-xs font-bold tracking-[0.16em]" style={{ color: tone }}>你眼中的自己</p>
                    <p className="mt-1.5 text-base leading-[1.9] text-[#5F574F] md:text-lg">{editorial.statusLine}</p>
                  </div>
                )}
                {editorial.tags && (
                  <ul className="flex flex-wrap gap-2" aria-label="人格關鍵字">
                    {editorial.tags.map((tag) => <li key={tag} className="border border-[#D1D1C7] bg-white px-3 py-1.5 text-xs tracking-[0.08em] text-[#70665D]">{tag}</li>)}
                  </ul>
                )}
              </div>
            </div>
          </section>
        )}

        <section className="grid gap-7 md:grid-cols-[10rem_1fr]">
          <SectionLabel number="01" title="你的靈魂畫像" tone={tone} />
          <div>
            <p className="text-base font-bold tracking-[0.08em]" style={{ color: tone }}>角色描述</p>
            <ReadableText text={editorial?.portrait ?? role.portrait} className="mt-3 serif text-xl leading-[2] text-[#2D2D2D] md:text-2xl" />
            {editorial?.master && (
              <div className="mt-8 border border-[#D1D1C7] bg-[#F7F4EF] p-5 md:p-7">
                <div className="grid gap-6 sm:grid-cols-[10.5rem_1fr] sm:items-start">
                  {masterPortraitUrl && (
                    <figure className="overflow-hidden border border-[#D1D1C7] bg-[#FBFAF7]">
                      <img
                        src={masterPortraitUrl}
                        alt={`${editorial.master.name} 的投資大師肖像`}
                        className="aspect-square h-full w-full object-contain"
                      />
                    </figure>
                  )}
                  <div>
                    <p className="text-xs font-bold tracking-[0.14em]" style={{ color: tone }}>傳奇大師</p>
                    <h2 className="mt-3 serif text-2xl leading-[1.6] text-[#2D2D2D]">{editorial.master.name}</h2>
                    <p className="mt-3 text-base leading-[1.9] text-[#5F574F]">{editorial.master.description}</p>
                    <p className="mt-5 border-t border-[#D1D1C7] pt-4 serif text-xl leading-[1.8] text-[#70665D]">{editorial.master.quote}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="grid gap-7 border-y border-[#D1D1C7] py-12 md:grid-cols-[10rem_1fr] md:py-14">
          <SectionLabel number="02" title="內心的痛苦與不安" tone={tone} />
          <div>
            <h2 className="serif text-2xl leading-[1.7] text-[#2D2D2D] md:text-3xl">{decision.title}</h2>
            <ReadableText text={decision.scene} className="mt-3 text-base leading-[2] text-[#5F574F] md:text-lg" />
            {decision.desireTitle && decision.desireScene && (
              <div className="mt-8 border-t border-[#D1D1C7] pt-7">
                <h3 className="text-xl font-bold leading-[1.7] text-[#2D2D2D] md:text-2xl">{decision.desireTitle}</h3>
                <ReadableText text={decision.desireScene} className="mt-3 text-base leading-[2] text-[#5F574F] md:text-lg" />
              </div>
            )}
          </div>
        </section>

        <section className="grid gap-7 md:grid-cols-[10rem_1fr]">
          <SectionLabel number="03" title="投資盲區與危機" tone={tone} />
          <div>
            {editorial?.blindSpotSummary && <p className="mb-6 border-l-2 pl-5 serif text-xl leading-[1.9] text-[#2D2D2D] md:text-2xl" style={{ borderColor: tone }}>{editorial.blindSpotSummary}</p>}
            <div className="grid gap-5 sm:grid-cols-2">
              {pressurePoints.map((point) => (
                <div key={point.title} className={`border border-[#D1D1C7] bg-white p-7 ${pressurePoints.length === 1 ? 'sm:col-span-2' : ''}`}>
                  <h3 className="text-xl font-bold leading-[1.5] text-[#2D2D2D]">{point.title}</h3>
                  <ReadableText text={point.description} className="mt-3 text-base leading-[2] text-[#5F574F]" />
                  <ReadableText text={point.action} className="mt-5 border-t border-[#D1D1C7] pt-4 text-base font-bold leading-[1.9]" />
                </div>
              ))}
            </div>
            {editorial?.checklist && (
              <div className="mt-6 border border-[#D1D1C7] bg-[#F7F4EF] p-7">
                <h3 className="text-xl font-bold text-[#2D2D2D]">本週自我檢核</h3>
                <p className="mt-3 text-base leading-[1.9] text-[#5F574F]">{editorial.checklist.intro}</p>
                <ul className="mt-5 space-y-3 text-base leading-[1.8] text-[#514942]">
                  {editorial.checklist.items.map((item) => <li key={item} className="flex gap-3"><span className="mt-1.5 h-3.5 w-3.5 shrink-0 border" style={{ borderColor: tone }} aria-hidden="true" /><span>{item}</span></li>)}
                </ul>
              </div>
            )}
          </div>
        </section>

        <section className="grid gap-7 border-y border-[#D1D1C7] py-12 md:grid-cols-[10rem_1fr] md:py-14">
          <SectionLabel number="04" title={editorial?.actionsTitle ?? '解決方法：讓心靜下來'} tone={tone} />
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

        {editorial?.superpower && (
          <section className="grid gap-7 md:grid-cols-[10rem_1fr]">
            <SectionLabel number="05" title="隱藏能力" tone={tone} />
            <div>
              <h2 className="serif text-2xl leading-[1.7] text-[#2D2D2D] md:text-3xl">{editorial.superpower.title}</h2>
              <ReadableText text={editorial.superpower.description} className="mt-4 text-base leading-[2] text-[#5F574F] md:text-lg" />
            </div>
          </section>
        )}

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
          <SectionLabel number={editorial?.superpower ? "06" : "05"} title={editorial?.pouchesTitle ?? '解酒錠'} tone={tone} />
          <div>
            <h2 className="serif text-2xl leading-[1.5] text-[#2D2D2D] md:text-3xl">給你的三個錦囊</h2>
            <div className="mt-7 grid gap-6 md:grid-cols-3">
              {[
                { label: '保命', text: pouches.safety, hint: '先替自己設一道保護線', Icon: ShieldCheck },
                { label: '轉念', text: pouches.mindset, hint: '換個角度，讓情緒慢下來', Icon: RefreshCw },
                { label: '行動', text: pouches.behavior, hint: '今天就能做的小行動', Icon: CalendarCheck },
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

        {editorial?.future && (
          <section className="grid gap-7 border-y border-[#D1D1C7] py-12 md:grid-cols-[10rem_1fr] md:py-14">
            <SectionLabel number="07" title={editorial.future.title ?? '三個月後的你'} tone={tone} />
            <div className="grid gap-5 md:grid-cols-2">
              <div className="border border-[#D1D1C7] bg-white p-7">
                <h3 className="text-lg font-bold" style={{ color: tone }}>劇本 A｜沒有修正</h3>
                <ReadableText text={editorial.future.withoutChange} className="mt-4 text-base leading-[2] text-[#5F574F]" />
              </div>
              <div className="border border-[#D1D1C7] bg-[#F7F4EF] p-7">
                <h3 className="text-lg font-bold" style={{ color: tone }}>劇本 B｜開始修正</h3>
                <ReadableText text={editorial.future.withChange} className="mt-4 text-base leading-[2] text-[#5F574F]" />
              </div>
            </div>
          </section>
        )}

        {editorial?.relationships && (
          <section className="grid gap-7 md:grid-cols-[10rem_1fr]">
            <SectionLabel number="08" title={editorial.relationshipsTitle ?? '思維轉換與自我救贖'} tone={tone} />
            <div>
              <div className="grid gap-4 sm:grid-cols-3">
                {editorial.relationships.map((relationship) => {
                  const neighbour = FACE_MAP[relationship.code];
                  return (
                    <button
                      key={relationship.code}
                      type="button"
                      onClick={() => onOpenRole?.(relationship.code)}
                      disabled={!onOpenRole}
                      className="group flex flex-col items-center border border-[#D1D1C7] bg-white p-5 text-center transition enabled:hover:border-[#8C635B] enabled:hover:bg-[#F7F4EF] disabled:cursor-default"
                    >
                      <span className="text-xs font-bold tracking-[0.18em]" style={{ color: tone }}>{relationship.label}</span>
                      <span className="mt-3 aspect-square w-full overflow-hidden bg-[#F4F0E9]">
                        {neighbour && <img src={neighbour.sketchImageUrl} alt={relationship.name} className="h-full w-full object-contain mix-blend-multiply transition duration-500 group-hover:scale-105" />}
                      </span>
                      <span className="mt-3 text-xs tracking-[0.18em] text-[#8C7E6D]">{relationship.code}</span>
                      <span className="serif text-lg leading-[1.5] text-[#2D2D2D] group-hover:text-[#8C635B]">{relationship.name}</span>
                    </button>
                  );
                })}
              </div>
              {onOpenCompatibility && (
                <div className="mt-8 flex flex-col gap-4 border border-[#D1D1C7] bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-bold tracking-[0.16em]" style={{ color: tone }}>交易互補輪盤</p>
                    <p className="mt-2 text-sm leading-[1.8] text-[#70665D]">從你的類型出發，查看相鄰人格與完全鏡像如何補上盲點。</p>
                  </div>
                  <button type="button" onClick={onOpenCompatibility} className="shrink-0 border-b border-[#2D2D2D] pb-1 text-sm font-bold text-[#2D2D2D] transition hover:text-[#8C635B]">開啟交易互補輪盤 →</button>
                </div>
              )}
              {editorial.transformationGuide && (
                <div className="mt-8 border border-[#D1D1C7] bg-[#F7F4EF] p-6 md:p-8">
                  <h3 className="serif text-2xl leading-[1.6] text-[#2D2D2D]">當你感覺「不舒服」時，試著看看其他交易者</h3>
                  <p className="mt-3 text-base leading-[1.9] text-[#5F574F]">{editorial.transformationGuide.intro}</p>
                  <div className="mt-6 hidden grid-cols-[1.3fr_0.7fr_1.7fr] gap-5 border-b border-[#D1D1C7] pb-3 text-xs font-bold tracking-[0.12em] md:grid" style={{ color: tone }}>
                    <span>當你感覺到</span><span>思維轉換</span><span>自我救贖</span>
                  </div>
                  <div className="divide-y divide-[#D1D1C7] border-b border-[#D1D1C7]">
                    {editorial.transformationGuide.rows.map((row) => {
                      const saviorCode = NAME_TO_CODE[row.saviorName];
                      return (
                        <div key={`${row.feeling}-${row.saviorName}`} className="grid gap-2 py-5 text-sm leading-[1.8] text-[#514942] md:grid-cols-[1.3fr_0.7fr_1.7fr] md:gap-5">
                          <p><span className="font-bold md:hidden" style={{ color: tone }}>當你感覺到｜</span>{row.feeling}</p>
                          <p style={{ color: tone }}><span className="font-bold text-[#514942] md:hidden">思維轉換｜</span>{row.shift}</p>
                          <p>
                            <span className="font-bold md:hidden" style={{ color: tone }}>自我救贖｜</span>
                            {saviorCode && onOpenRole
                              ? <button type="button" onClick={() => onOpenRole(saviorCode)} className="font-bold text-[#2D2D2D] underline decoration-[#8C635B]/50 underline-offset-2 transition hover:text-[#8C635B]">{row.saviorName}</button>
                              : <span className="font-bold text-[#2D2D2D]">{row.saviorName}</span>}
                            <span className="text-[#5F574F]">{row.saviorQuote}</span>
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </section>
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

        <section className="px-8 py-12 text-center text-white md:px-16 md:py-16" style={{ backgroundColor: tone }}>
          <p className="text-sm font-bold tracking-[0.16em] text-white/70">一句話祝福</p>
          <p className="mx-auto mt-6 max-w-3xl serif text-2xl leading-[1.9] md:text-3xl">{editorial?.reminder ?? role.antidote}</p>
        </section>
      </div>
    </article>
  );
};
