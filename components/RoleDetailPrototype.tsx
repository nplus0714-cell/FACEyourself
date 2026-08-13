import React from 'react';
import { FACE_2_PROTOTYPES } from '../data/faceProfilePrototype';
import type { PersonalityProfile } from '../types';

interface RoleDetailPrototypeProps {
  role: PersonalityProfile;
  isUserType: boolean;
  onBack: () => void;
  compact?: boolean;
  onOpenCompatibility?: () => void;
  onOpenRate?: () => void;
  onOpenContent?: () => void;
  onOpenDeepDive?: (code: string) => void;
}

const toneFor = (code: string) => (code.startsWith('A') ? '#9A655C' : '#667784');

const SectionLabel: React.FC<{ number: string; title: string; tone: string }> = ({ number, title, tone }) => (
  <div>
    <p className="font-mono text-xs font-bold tracking-[0.18em]" style={{ color: tone }}>{number}</p>
    <h2 className="mt-2 serif text-2xl leading-[1.55] text-[#2D2D2D] md:text-3xl">{title}</h2>
  </div>
);

const Arrow = () => <span aria-hidden="true" className="text-[#B59E7B]">↓</span>;

export const RoleDetailPrototype: React.FC<RoleDetailPrototypeProps> = ({
  role,
  isUserType,
  onBack,
  compact = false,
  onOpenCompatibility,
  onOpenRate,
  onOpenContent,
  onOpenDeepDive,
}) => {
  const profile = FACE_2_PROTOTYPES[role.code]!;
  const tone = toneFor(role.code);
  const activePrototypeCount = Object.keys(FACE_2_PROTOTYPES).length;

  return (
    <article className="mx-auto max-w-6xl pb-24 pt-2 fade-in md:pt-8">
      {!compact && (
        <button type="button" onClick={onBack} className="text-base font-bold text-[#70665D] transition hover:text-[#2D2D2D]">
          ← 回到 16 型圖鑑
        </button>
      )}

      {!compact && (
        <header className="relative mt-7 overflow-hidden border border-[#CFC6B8] bg-[#F4EEE7] md:mt-10">
          <div className="grid min-h-[34rem] md:grid-cols-[1.08fr_0.92fr]">
            <div className="relative min-h-[23rem] overflow-hidden md:min-h-full">
              <img src={role.landscapeImageUrl} alt={role.name} className="absolute inset-0 h-full w-full object-cover object-center mix-blend-multiply" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#F4EEE7]/35 md:to-[#F4EEE7]" />
              <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                <span className="bg-[#2D2D2D] px-3 py-2 text-[11px] font-bold tracking-[0.16em] text-white">FACE 2.0 PROTOTYPE</span>
                {isUserType && <span className="px-3 py-2 text-[11px] font-bold tracking-[0.12em] text-white" style={{ backgroundColor: tone }}>你的交易人格</span>}
              </div>
            </div>
            <div className="relative z-10 flex flex-col justify-center px-7 py-10 md:-ml-10 md:px-12 md:py-14">
              <p className="font-mono text-sm font-bold tracking-[0.24em]" style={{ color: tone }}>{profile.code}</p>
              <h1 className="mt-4 serif text-4xl leading-[1.35] text-[#2D2D2D] md:text-5xl">{profile.name}</h1>
              <p className="mt-3 text-sm tracking-[0.12em] text-[#70665D]">{profile.traits.join(' × ')}</p>
              <div className="my-7 h-px w-16" style={{ backgroundColor: tone }} />
              <p className="serif text-xl leading-[1.9] text-[#493E37] md:text-2xl">{profile.coreDescription}</p>
            </div>
          </div>
        </header>
      )}

      <div className={`mx-auto max-w-5xl space-y-16 md:space-y-24 ${compact ? 'mt-0' : 'mt-16 md:mt-24'}`}>
        <aside className="flex flex-col gap-4 border border-[#D1D1C7] bg-white px-6 py-5 sm:flex-row sm:items-center sm:justify-between" aria-label="原型說明">
          <div>
            <p className="text-xs font-bold tracking-[0.16em]" style={{ color: tone }}>{profile.code} · FACE 2.0 TEMPLATE TEST</p>
            <p className="mt-2 text-sm leading-7 text-[#70665D]">這份原型描述的是可能的交易傾向，不是能力評分、投資建議或心理診斷。</p>
          </div>
          <span className="shrink-0 border border-[#D1D1C7] px-3 py-2 text-xs font-bold text-[#70665D]">已套用 {activePrototypeCount} 型</span>
        </aside>

        <section className="grid gap-7 md:grid-cols-[11rem_1fr]">
          <SectionLabel number="01" title="你的 FACE" tone={tone} />
          <div className="border-l-2 pl-6 md:pl-9" style={{ borderColor: tone }}>
            <p className="serif text-2xl leading-[1.9] text-[#2D2D2D] md:text-3xl">{profile.coreDescription}</p>
            <ul className="mt-7 flex flex-wrap gap-2" aria-label={`${profile.code} 四個交易維度`}>
              {profile.traits.map((trait, index) => (
                <li key={trait} className="border border-[#D1D1C7] bg-[#F7F4EF] px-4 py-2 text-sm text-[#5F574F]">
                  <span className="mr-2 font-mono text-xs font-bold" style={{ color: tone }}>{profile.code[index]}</span>{trait}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="grid gap-7 border-y border-[#D1D1C7] py-12 md:grid-cols-[11rem_1fr] md:py-16">
          <SectionLabel number="02" title="兩面鏡子" tone={tone} />
          <div className="grid gap-px overflow-hidden border border-[#D1D1C7] bg-[#D1D1C7] md:grid-cols-2">
            <div className="bg-white p-7 md:p-9">
              <p className="text-xs font-bold tracking-[0.15em]" style={{ color: tone }}>別人眼中的你</p>
              <p className="mt-5 text-base leading-[2] text-[#5F574F] md:text-lg">{profile.outsideView}</p>
            </div>
            <div className="bg-[#F7F4EF] p-7 md:p-9">
              <p className="text-xs font-bold tracking-[0.15em]" style={{ color: tone }}>你眼中的自己</p>
              <p className="mt-5 serif text-xl leading-[2] text-[#2D2D2D] md:text-2xl">「{profile.insideVoice}」</p>
            </div>
          </div>
        </section>

        <section className="grid gap-7 md:grid-cols-[11rem_1fr]">
          <SectionLabel number="03" title="你的交易天賦" tone={tone} />
          <div>
            <p className="serif text-2xl leading-[1.8] text-[#2D2D2D] md:text-3xl">{profile.talent.headline}</p>
            <div className="mt-6 space-y-4 text-base leading-[2] text-[#5F574F] md:text-lg">
              {profile.talent.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <div className="mt-8 border border-[#D1D1C7] bg-[#F7F4EF] p-6 md:p-8">
              <p className="text-sm font-bold tracking-[0.08em]" style={{ color: tone }}>比較容易發揮的決策環境</p>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {profile.talent.conditions.map((condition) => (
                  <li key={condition} className="flex gap-3 text-sm leading-7 text-[#5F574F]"><span style={{ color: tone }}>◆</span>{condition}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="grid gap-7 border-y border-[#D1D1C7] py-12 md:grid-cols-[11rem_1fr] md:py-16">
          <SectionLabel number="04" title="天賦的另一面" tone={tone} />
          <div>
            <p className="max-w-3xl text-base leading-[2] text-[#5F574F] md:text-lg">同一個特質，在不同市場環境下可能是武器，也可能是陷阱。重點不是消除天賦，而是看見它什麼時候開始用過頭。</p>
            <div className="mt-7 space-y-5">
              {profile.talentTurns.map((turn) => (
                <div key={turn.talent} className="grid gap-3 border border-[#D1D1C7] bg-white p-6 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center md:p-7">
                  <div><p className="text-xs font-bold tracking-[0.12em]" style={{ color: tone }}>原本的天賦</p><p className="mt-2 font-bold leading-7 text-[#2D2D2D]">{turn.talent}</p></div>
                  <Arrow />
                  <div><p className="text-xs font-bold tracking-[0.12em] text-[#8C7E6D]">使用過頭</p><p className="mt-2 text-sm leading-7 text-[#5F574F]">{turn.overuse}</p></div>
                  <Arrow />
                  <div><p className="text-xs font-bold tracking-[0.12em] text-[#8C7E6D]">可能的陷阱</p><p className="mt-2 text-sm leading-7 text-[#5F574F]">{turn.trap}</p><p className="mt-2 text-xs leading-6 text-[#8C7E6D]">常見於：{turn.marketCondition}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-7 md:grid-cols-[11rem_1fr]">
          <SectionLabel number="05" title="你的失控觸發器" tone={tone} />
          <div className="space-y-6">
            {profile.triggers.map((trigger, index) => (
              <article key={trigger.title} className="overflow-hidden border border-[#D1D1C7] bg-white">
                <div className="flex items-start gap-4 bg-[#F7F4EF] px-6 py-5 md:px-8">
                  <span className="font-mono text-sm font-bold" style={{ color: tone }}>0{index + 1}</span>
                  <h3 className="serif text-xl leading-[1.5] text-[#2D2D2D] md:text-2xl">{trigger.title}</h3>
                </div>
                <div className="grid gap-px bg-[#E0DBD3] sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    ['事件', trigger.event],
                    ['情緒', trigger.emotion],
                    ['行為', trigger.behavior],
                    ['後果', trigger.consequence],
                  ].map(([label, body]) => (
                    <div key={label} className="bg-white p-5 md:p-6">
                      <p className="text-xs font-bold tracking-[0.12em]" style={{ color: tone }}>{label}</p>
                      <p className="mt-3 text-sm leading-7 text-[#5F574F]">{body}</p>
                    </div>
                  ))}
                </div>
                <p className="border-t border-[#D1D1C7] px-6 py-5 text-sm leading-7 text-[#493E37] md:px-8"><span className="mr-2 font-bold" style={{ color: tone }}>觀察提示</span>{trigger.watchFor}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden px-7 py-12 text-center text-white md:px-16 md:py-16" style={{ backgroundColor: tone }}>
          <p className="text-xs font-bold tracking-[0.18em] text-white/65">06 · 你最容易騙自己的那句話</p>
          <blockquote className="mx-auto mt-7 max-w-3xl serif text-3xl leading-[1.7] md:text-5xl">{profile.selfDeception.quote}</blockquote>
          <p className="mx-auto mt-7 max-w-2xl text-sm leading-8 text-white/80 md:text-base">{profile.selfDeception.context}</p>
          <p className="mx-auto mt-6 max-w-3xl border-t border-white/25 pt-6 text-sm leading-8 text-white"><span className="font-bold">換一面鏡子：</span>{profile.selfDeception.reframe}</p>
        </section>

        <section className="grid gap-7 md:grid-cols-[11rem_1fr]">
          <SectionLabel number="07" title="你的交易舒適圈" tone={tone} />
          <div>
            <p className="text-base leading-[2] text-[#5F574F] md:text-lg">{profile.comfortZone.intro}</p>
            <div className="mt-7 overflow-hidden border border-[#D1D1C7]">
              <div className="hidden grid-cols-[8rem_1fr_1fr] bg-[#2D2D2D] px-6 py-4 text-xs font-bold tracking-[0.12em] text-white md:grid">
                <span>面向</span><span>容易發揮</span><span>較容易磨損</span>
              </div>
              {profile.comfortZone.items.map((item) => (
                <div key={item.label} className="grid gap-4 border-t border-[#D1D1C7] bg-white p-6 first:border-t-0 md:grid-cols-[8rem_1fr_1fr] md:gap-6">
                  <p className="font-bold" style={{ color: tone }}>{item.label}</p>
                  <div><p className="mb-1 text-xs font-bold text-[#8C7E6D] md:hidden">容易發揮</p><p className="text-sm leading-7 text-[#5F574F]">{item.fit}</p></div>
                  <div><p className="mb-1 text-xs font-bold text-[#8C7E6D] md:hidden">較容易磨損</p><p className="text-sm leading-7 text-[#5F574F]">{item.friction}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-7 border-y border-[#D1D1C7] py-12 md:grid-cols-[11rem_1fr] md:py-16">
          <SectionLabel number="08" title="你的 3 條生存規則" tone={tone} />
          <div className="space-y-5">
            {profile.survivalRules.map((rule, index) => (
              <article key={rule.title} className="border border-[#D1D1C7] bg-[#F7F4EF] p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center font-mono text-sm font-bold text-white" style={{ backgroundColor: tone }}>{index + 1}</span>
                  <h3 className="serif text-xl leading-[1.6] text-[#2D2D2D] md:text-2xl">{rule.title}</h3>
                </div>
                <dl className="mt-6 grid gap-5 text-sm leading-7 md:grid-cols-3">
                  <div><dt className="font-bold" style={{ color: tone }}>什麼時候啟動</dt><dd className="mt-2 text-[#5F574F]">{rule.when}</dd></div>
                  <div><dt className="font-bold" style={{ color: tone }}>具體動作</dt><dd className="mt-2 text-[#5F574F]">{rule.action}</dd></div>
                  <div><dt className="font-bold" style={{ color: tone }}>完成前檢查</dt><dd className="mt-2 text-[#5F574F]">{rule.check}</dd></div>
                </dl>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-7 md:grid-cols-[11rem_1fr]">
          <SectionLabel number="09" title="FACE 給你的 3 個問題" tone={tone} />
          <div>
            <p className="text-base leading-[2] text-[#5F574F]">這三題不計分，也不會改變你的類型。它們只負責讓你停一下，看看交易背後正在運作的是什麼。</p>
            <ol className="mt-7 grid gap-5 md:grid-cols-3">
              {profile.reflectionQuestions.map((item) => (
                <li key={item.phase} className="flex min-h-[22rem] flex-col border border-[#D1D1C7] bg-white p-7">
                  <p className="text-xs font-bold tracking-[0.18em]" style={{ color: tone }}>{item.phase}</p>
                  <h3 className="mt-4 font-bold leading-7 text-[#2D2D2D]">{item.title}</h3>
                  <p className="mt-7 serif text-xl leading-[1.9] text-[#2D2D2D]">{item.question}</p>
                  <p className="mt-auto border-t border-[#D1D1C7] pt-5 text-xs leading-6 text-[#8C7E6D]">{item.nudge}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border border-[#CFC6B8] bg-[#F1EAE2] px-7 py-12 text-center md:px-14 md:py-16">
          <p className="text-xs font-bold tracking-[0.18em]" style={{ color: tone }}>10 · 今日自我覺察</p>
          <h2 className="mx-auto mt-5 max-w-3xl serif text-3xl leading-[1.65] text-[#2D2D2D] md:text-4xl">人格是長期習慣，今天的狀態需要每天看見。</h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-[2] text-[#5F574F]">用 8 題整理今天面對盤勢時的情緒、注意力與行動傾向。完成後，結果會直接存入你的自我覺察日記。</p>
          {onOpenDeepDive ? (
            <button type="button" onClick={() => onOpenDeepDive(role.code)} className="mt-9 bg-[#2D2D2D] px-8 py-4 text-sm font-bold tracking-[0.1em] text-white transition hover:bg-black">
              開始今日的 8 題自我覺察 →
            </button>
          ) : (
            <button type="button" disabled className="mt-9 cursor-not-allowed bg-[#2D2D2D] px-8 py-4 text-sm font-bold tracking-[0.1em] text-white opacity-55" aria-label="登入後開啟今日自我覺察">
              登入後開啟今日自我覺察
            </button>
          )}
          <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm font-bold text-[#5F574F]">
            {onOpenContent && <button type="button" onClick={onOpenContent} className="border-b border-current pb-1 hover:text-[#8C635B]">先去交易解憂 Bar →</button>}
            {onOpenCompatibility && <button type="button" onClick={onOpenCompatibility} className="border-b border-current pb-1 hover:text-[#8C635B]">查看交易互補輪盤 →</button>}
            {onOpenRate && <button type="button" onClick={onOpenRate} className="border-b border-current pb-1 hover:text-[#8C635B]">認識 RATE 鏡相診股 →</button>}
          </div>
        </section>
      </div>
    </article>
  );
};
