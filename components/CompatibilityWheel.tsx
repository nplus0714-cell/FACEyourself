import React, { useEffect, useMemo, useState } from 'react';
import { FACE_MAP, getFaceCode } from '../constants';
import { FaceScores, PersonalityProfile } from '../types';

interface CompatibilityWheelProps {
  dna: FaceScores | null;
  onOpenRole: (role: PersonalityProfile) => void;
  onStartTest: () => void;
}

type RelationKind = 'axis' | 'opposite';

interface WheelNode {
  code: string;
  label: string;
  kind: RelationKind;
  axis?: string;
  action?: string;
  question?: string;
}

const AXES = [
  { label: '心態調整', accent: '#9A6256', directions: { A: { action: '轉為保守', question: '覺得每天主動出擊太耗費精力，想要轉攻為守，讓資產自己長大？' }, P: { action: '轉為積極', question: '覺得過度保守導致資產成長太慢，想多一點參與感，主動爭取超額報酬？' } } },
  { label: '腦袋切換', accent: '#607889', directions: { I: { action: '轉為理性', question: '是否常因恐懼貪婪而追高殺低？想建立一套有憑有據、可複製的邏輯系統？' }, R: { action: '轉為感性', question: '是否看太多數據反而不敢下單？想找回對市場的敏銳直覺與盤感？' } } },
  { label: '節奏調整', accent: '#A48355', directions: { T: { action: '拉長週期', question: '是否覺得頻繁進出只賺到便當錢？想試著抱住一個大波段，賺取倍數獲利？' }, L: { action: '加快節奏', question: '是否覺得資金卡在那裡都不動很沒效率？想利用波動賺取短線的現金流？' } } },
  { label: '籌碼調整', accent: '#667B70', directions: { C: { action: '轉為分散', question: '是否因為重押單一標的而患得患失？想透過資產配置來降低歸零風險？' }, D: { action: '轉為集中', question: '是否覺得買了一堆股票卻相互抵銷績效？想集中火力，重押你最有信心的機會？' } } },
];

const flipLetter = (letter: string) => ({ A: 'P', P: 'A', R: 'I', I: 'R', L: 'T', T: 'L', C: 'D', D: 'C' }[letter] ?? letter);
const flipAt = (code: string, index: number) => code.split('').map((letter, letterIndex) => letterIndex === index ? flipLetter(letter) : letter).join('');
const flipAll = (code: string) => code.split('').map(flipLetter).join('');

const pointForIndex = (index: number, total: number, radius = 43) => {
  const angle = (-90 + (360 / total) * index) * (Math.PI / 180);
  return { x: 50 + Math.cos(angle) * radius, y: 50 + Math.sin(angle) * radius };
};

export const CompatibilityWheel: React.FC<CompatibilityWheelProps> = ({ dna, onOpenRole, onStartTest }) => {
  const codes = useMemo(() => Object.keys(FACE_MAP).sort(), []);
  const measuredCode = dna ? getFaceCode(dna) : null;
  const [selectedCode, setSelectedCode] = useState(measuredCode ?? codes[0]);
  const [activeCode, setActiveCode] = useState(measuredCode ?? flipAt(codes[0], 0));
  const [hoveredCode, setHoveredCode] = useState<string | null>(null);

  useEffect(() => {
    if (measuredCode) {
      setSelectedCode(measuredCode);
      setActiveCode(flipAt(measuredCode, 0));
    }
  }, [measuredCode]);

  const relations = useMemo<WheelNode[]>(() => [
    ...AXES.map((axis, index) => {
      const direction = axis.directions[selectedCode[index] as keyof typeof axis.directions];
      return { code: flipAt(selectedCode, index), label: `${axis.label}：${direction.action}`, kind: 'axis' as const, axis: axis.label, action: direction.action, question: direction.question };
    }),
    { code: flipAll(selectedCode), label: '四個面向都不同', kind: 'opposite', action: '完全對立' },
  ], [selectedCode]);

  const relationCodes = new Set(relations.map((relation) => relation.code));
  const oppositeCode = flipAll(selectedCode);
  const active = relations.find((relation) => relation.code === activeCode) ?? relations[0];
  const selectedRole = FACE_MAP[selectedCode];
  const activeRole = FACE_MAP[active.code];
  const relationPoints = relations.map((relation) => pointForIndex(codes.indexOf(relation.code), codes.length));

  const chooseType = (code: string) => {
    setSelectedCode(code);
    setActiveCode(flipAt(code, 0));
  };

  return <main className="mx-auto w-full max-w-6xl px-5 py-10 md:px-10 md:py-16">
    <header className="max-w-3xl">
      <p className="text-xs font-bold tracking-[0.24em] text-[#8C635B]">FACE COMPATIBILITY WHEEL</p>
      <h1 className="mt-4 serif text-4xl leading-[1.35] text-[#2D2D2D] md:text-6xl">交易互補輪盤</h1>
      <p className="mt-5 text-base leading-[2] text-[#70665D] md:text-lg">16 型都在這張星圖上。先選一型，再看它與四種相關型及一種完全對立型形成的五邊關係。</p>
    </header>

    <section className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] lg:items-start">
      <div className="border border-[#D1D1C7] bg-white p-4 shadow-sm md:p-9">
        <div className="flex flex-col gap-4 border-b border-[#E3DED7] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.18em] text-[#8C7E6D]">EXPLORE THE 16 TYPES</p>
            <p className="mt-2 text-sm leading-[1.8] text-[#70665D]">點擊外圈代碼即可切換中心，重新畫出它的五邊關係。</p>
            <div className="mt-3 flex flex-wrap gap-x-3 gap-y-2 text-[11px] font-bold">{AXES.map((axis) => <span key={axis.label} className="inline-flex items-center gap-1.5" style={{ color: axis.accent }}><i className="h-2 w-2 rounded-full" style={{ backgroundColor: axis.accent }} />{axis.label}</span>)}<span className="inline-flex items-center gap-1.5 text-[#2D2D2D]"><i className="h-2 w-2 rounded-full bg-[#2D2D2D]" />完全對立</span></div>
          </div>
          <select value={selectedCode} onChange={(event) => chooseType(event.target.value)} className="min-w-[13rem] border border-[#BDB5AA] bg-[#FCFBF8] px-4 py-3 text-sm font-bold text-[#2D2D2D] outline-none focus:border-[#8C635B]">
            {codes.map((code) => <option key={code} value={code}>{code} · {FACE_MAP[code].name}</option>)}
          </select>
        </div>

        <div className="relative mx-auto mt-8 aspect-square w-full max-w-[650px]">
          <svg viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible" aria-hidden="true">
            <defs>
              <radialGradient id="wheel-glow" cx="50%" cy="50%" r="55%"><stop offset="0%" stopColor="#F8F3EC" /><stop offset="100%" stopColor="#FCFBF8" /></radialGradient>
            </defs>
            <circle cx="50" cy="50" r="43" fill="url(#wheel-glow)" stroke="none" />
            {relationPoints.map((point, index) => {
              const next = relationPoints[(index + 1) % relationPoints.length];
              const tint = relations[index].kind === 'opposite' ? '#2D2D2D' : AXES[index].accent;
              return <polygon key={`tint-${relations[index].code}`} points={`50,50 ${point.x},${point.y} ${next.x},${next.y}`} fill={tint} fillOpacity="0.055" />;
            })}
            {relationPoints.map((from, index) => relationPoints.slice(index + 1).map((to, offset) => <line key={`connection-${index}-${offset}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="#8B7D70" strokeOpacity="0.3" strokeWidth="0.2" />))}
            {relationPoints.map((point, index) => <line key={relations[index].code} x1="50" y1="50" x2={point.x} y2={point.y} stroke={relations[index].kind === 'opposite' ? '#2D2D2D' : AXES[index].accent} strokeOpacity="0.3" strokeWidth="0.2" />)}
            <circle cx="50" cy="50" r="11.5" fill="#2D2D2D" />
          </svg>

          <div className="absolute left-1/2 top-1/2 z-10 flex h-[30%] w-[30%] min-h-[8rem] min-w-[8rem] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-4 border-white bg-[#2D2D2D] px-4 text-center text-white shadow-xl md:min-h-[10rem] md:min-w-[10rem]">
            <p className="text-[10px] font-bold tracking-[0.18em] text-white/60">當前動物</p>
            <p className="mt-2 serif text-3xl md:text-4xl">{selectedRole.code}</p>
            <p className="mt-2 text-sm font-bold leading-[1.35] text-white md:text-base">{selectedRole.name}</p>
          </div>

          {codes.map((code, index) => {
            if (code === selectedCode) return null;
            const point = pointForIndex(index, codes.length);
            const role = FACE_MAP[code];
            const relation = relations.find((item) => item.code === code);
            const isRelated = relationCodes.has(code);
            const isOpposite = code === oppositeCode;
            const isHovered = hoveredCode === code;
            const accent = relation?.kind === 'opposite' ? '#2D2D2D' : relation?.axis ? AXES.find((axis) => axis.label === relation.axis)?.accent : '#8C7E6D';
            return <button key={code} type="button" aria-label={`${code} ${role.name}`} onMouseEnter={() => setHoveredCode(code)} onMouseLeave={() => setHoveredCode(null)} onFocus={() => setHoveredCode(code)} onBlur={() => setHoveredCode(null)} onClick={() => chooseType(code)} className={`absolute z-20 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-center shadow-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#8C635B] focus:ring-offset-2 md:h-11 md:w-11 ${isOpposite ? 'border-2 border-[#2D2D2D] bg-white text-[#2D2D2D] opacity-100 ring-2 ring-[#2D2D2D] ring-offset-2' : isRelated ? 'bg-[#FCFBF8] text-[#6F6258]' : 'border-[#D6D0C8] bg-[#ECE8E2] text-[#9A9289] opacity-55'} hover:scale-125 hover:bg-white hover:opacity-100 hover:shadow-lg`} style={{ left: `${point.x}%`, top: `${point.y}%`, ...(isRelated && !isOpposite ? { borderColor: accent, color: accent } : {}) }}>
              <span className="serif text-xs font-bold md:text-sm">{code}</span>
              <span className={`pointer-events-none absolute left-1/2 top-full z-30 mt-3 w-max max-w-[10rem] -translate-x-1/2 border border-[#D1D1C7] bg-white px-3 py-2 text-[11px] leading-[1.45] text-[#2D2D2D] shadow-lg transition ${isHovered ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0'}`}><strong className="block">{role.name}</strong>{relation?.action && <span className="mt-1 block font-bold" style={{ color: accent }}>{relation.action}</span>}</span>
            </button>;
          })}
        </div>
        <p className="mt-4 text-center text-xs leading-[1.8] text-[#8C7E6D]">四色連線各代表一個可調整面向；深灰線是完全對立型。未選中的類型會淡化成背景。</p>
      </div>

      <aside className="border border-[#D1D1C7] bg-[#FCFBF8] p-7 md:p-9 lg:sticky lg:top-8">
        <p className="text-xs font-bold tracking-[0.2em] text-[#8C635B]">YOUR SELECTED ANIMAL</p>
        <p className="mt-5 serif text-4xl text-[#2D2D2D]">{selectedRole.code}</p>
        <h2 className="mt-2 serif text-3xl leading-[1.35] text-[#2D2D2D]">{selectedRole.name}</h2>
        <p className="mt-5 text-sm leading-[1.95] text-[#70665D]">{selectedRole.portrait}</p>

        <section className="mt-7 border-t border-[#D1D1C7] pt-6">
          <p className="text-xs font-bold tracking-[0.18em] text-[#8C7E6D]">四種相關型</p>
          <div className="mt-4 space-y-2">{relations.filter((relation) => relation.kind === 'axis').map((relation) => {
            const role = FACE_MAP[relation.code];
            const accent = AXES.find((axis) => axis.label === relation.axis)?.accent ?? '#8C635B';
            return <button key={relation.code} type="button" onClick={() => setActiveCode(relation.code)} className={`flex w-full items-center justify-between border px-3 py-3 text-left transition hover:bg-white ${activeCode === relation.code ? 'bg-white' : 'border-[#E2DCD4]'}`} style={activeCode === relation.code ? { borderColor: accent, boxShadow: `inset 3px 0 0 ${accent}` } : undefined}><span><strong className="text-sm text-[#2D2D2D]">{role.name}</strong><span className="ml-2 text-xs text-[#8C7E6D]">{role.code}</span></span><span className="text-xs" style={{ color: accent }}>{relation.action}</span></button>;
          })}</div>
        </section>

        <section className="mt-6 border-t border-[#D1D1C7] pt-6">
          <p className="text-xs font-bold tracking-[0.18em] text-[#8C7E6D]">完全對立型</p>
          <button type="button" onClick={() => setActiveCode(oppositeCode)} className={`mt-4 flex w-full items-center justify-between border px-3 py-3 text-left transition hover:bg-white ${activeCode === oppositeCode ? 'border-[#2D2D2D] bg-white shadow-sm' : 'border-[#BDB5AA]'}`}><span><strong className="text-sm text-[#2D2D2D]">{FACE_MAP[oppositeCode].name}</strong><span className="ml-2 text-xs text-[#8C7E6D]">{oppositeCode}</span></span><span className="text-xs font-bold text-[#2D2D2D]">最遠視角</span></button>
        </section>

        <div className="mt-7 border-t border-[#D1D1C7] pt-6">
          <p className="text-sm font-bold text-[#2D2D2D]">正在查看：{activeRole.name}</p>
          <p className="mt-3 text-sm leading-[1.95] text-[#70665D]">{active.kind === 'opposite' ? '這是四個面向皆相反的類型；最容易感到陌生，也最能提醒你還有其他判斷方式。' : `想試著${active.action}嗎？${active.question}`}</p>
          <button type="button" onClick={() => onOpenRole(activeRole)} className="mt-6 w-full border border-[#2D2D2D] px-5 py-3.5 text-sm font-bold text-[#2D2D2D] transition hover:bg-[#2D2D2D] hover:text-white">閱讀 {activeRole.code} 的完整說明 →</button>
        </div>
      </aside>
    </section>

    {!measuredCode && <section className="mt-10 flex flex-col gap-5 border border-[#D1D1C7] bg-[#EEE8DF] p-7 md:flex-row md:items-center md:justify-between md:p-9"><div><p className="serif text-2xl text-[#2D2D2D]">想從自己的類型開始？</p><p className="mt-2 text-sm leading-[1.8] text-[#70665D]">完成測驗後，輪盤會自動以你的 FACE 結果為中心。</p></div><button type="button" onClick={onStartTest} className="shrink-0 bg-[#2D2D2D] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-black">開始測驗 →</button></section>}
  </main>;
};
