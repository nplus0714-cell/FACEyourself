import React, { useMemo, useState } from 'react';
import { FACE_MAP, getFaceCode } from '../constants';
import { PersonalityProfile, FaceScores } from '../types';
import { PERSONALITY_EDITORIAL } from '../data/personalityEditorial';

interface RoleGalleryProps {
  dna: FaceScores | null;
  onOpenRole: (role: PersonalityProfile) => void;
  onStartTest: () => void;
  onOpenCompatibility: () => void;
  onOpenMyFace: () => void;
}

const FILTERS = [
  { id: 'all', label: '全部 16 型', traits: [] },
  { id: 'focus', label: '獲利動機', traits: ['A', 'P'] },
  { id: 'analysis', label: '決策邏輯', traits: ['R', 'I'] },
  { id: 'cycle', label: '交易週期', traits: ['L', 'T'] },
  { id: 'exposure', label: '資金管理', traits: ['C', 'D'] },
] as const;

const roleTone = (code: string) => code.startsWith('F') ? '#9A655C' : code.startsWith('P') ? '#667784' : '#7C856C';
const TRAIT_LABELS: Record<string, string> = {
  A: '積極（A）',
  P: '保守（P）',
  R: '理性（R）',
  I: '感性（I）',
  L: '長期（L）',
  T: '短期（T）',
  C: '集中（C）',
  D: '分散（D）',
};
const traitSummary = (code: string) => code.split('').map((trait) => TRAIT_LABELS[trait]).join('／');
const resultDimensions = (scores: FaceScores) => {
  const choose = (first: number, second: number, firstLabel: string, secondLabel: string) => {
    const total = first + second;
    const chooseFirst = first >= second;
    return {
      option: chooseFirst ? firstLabel : secondLabel,
      percent: total === 0 ? 50 : Math.round(((chooseFirst ? first : second) / total) * 100),
    };
  };

  return [
    { label: '獲利動機', ...choose(scores.A, scores.P, '積極型(A)', '保守型(P)') },
    { label: '決策邏輯', ...choose(scores.R, scores.I, '理性數據(R)', '感應直覺(I)') },
    { label: '交易週期', ...choose(scores.L, scores.T, '長期投資(L)', '短期投機(T)') },
    { label: '資金管理', ...choose(scores.C, scores.D, '集中型(C)', '分散型(D)') },
  ];
};

export const RoleGallery: React.FC<RoleGalleryProps> = ({ dna, onOpenRole, onStartTest, onOpenCompatibility, onOpenMyFace }) => {
  const roles = useMemo(() => Object.values(FACE_MAP)
    .map((role) => ({ ...role, motto: PERSONALITY_EDITORIAL[role.code]?.cardLine ?? role.motto }))
    .sort((a, b) => a.code.localeCompare(b.code)), []);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['id']>('all');
  const userCode = dna ? getFaceCode(dna) : null;
  const userRole = userCode ? roles.find((role) => role.code === userCode) : null;
  const userScoreSummary = dna ? resultDimensions(dna) : [];
  const visibleRoles = filter === 'all' ? roles : roles.filter((role) => (FILTERS.find((item) => item.id === filter)?.traits ?? []).some((trait) => role.code.includes(trait)));

  return <div className="mx-auto max-w-7xl pb-28 pt-2 fade-in md:pt-8">
    <header className="grid overflow-hidden border border-[#D1D1C7] bg-[#F4F0E9] md:grid-cols-[1.1fr_0.9fr]">
      <div className="p-8 md:p-14 lg:p-16">
        <p className="text-xs font-bold tracking-[0.3em] text-[#8C635B]">FACE TYPE ATLAS</p>
        <h1 className="mt-6 serif text-4xl leading-[1.55] text-[#2D2D2D] md:text-6xl">人格圖鑑</h1>
        <p className="mt-7 max-w-xl text-base leading-[2.05] text-[#70665D] md:text-lg">交易沒有一種正確姿勢。從你看機會、做判斷、掌握節奏與配置風險的習慣，理解你比較適合怎麼走。</p>
      </div>
      <div className="relative min-h-60 overflow-hidden bg-[#2D2D2D] p-8 text-white md:p-14">
        <span className="absolute -right-9 -top-12 serif text-[15rem] leading-none text-white/[0.06]">F</span>
        <p className="relative text-xs font-bold tracking-[0.24em] text-white/50">HOW TO READ THE ATLAS</p>
        <div className="relative mt-10 grid grid-cols-2 gap-x-8 gap-y-8">
          {[['F', '獲利動機'], ['A', '決策邏輯'], ['C', '交易週期'], ['E', '資金管理']].map(([letter, label]) => <div key={letter} className="border-l border-white/25 pl-4"><p className="serif text-3xl">{letter}</p><p className="mt-1 text-sm text-white/70">{label}</p></div>)}
        </div>
        <p className="relative mt-8 text-sm leading-[1.85] text-white/60">每一型都是四個字母的組合。點進任何一型，就能看見它在交易中的樣子。</p>
      </div>
    </header>

    {userRole ? <section className="mt-8 grid overflow-hidden border border-[#8C635B]/40 bg-white md:grid-cols-[0.82fr_1.18fr]" aria-label="你的交易人格">
      <div className="relative flex min-h-[22rem] flex-col overflow-hidden p-8 md:p-10" style={{ backgroundColor: `${roleTone(userRole.code)}18` }}>
        <span className="absolute -left-2 -top-6 serif text-[9rem] leading-none" style={{ color: `${roleTone(userRole.code)}28` }}>{userRole.code}</span>
        <p className="relative text-xs font-bold tracking-[0.22em] text-[#8C635B]">YOUR STYLE</p><img src={userRole.sketchImageUrl} alt={userRole.name} className="relative mx-auto mt-4 h-48 w-full object-contain" /><h2 className="relative mt-auto serif text-4xl text-[#2D2D2D]">{userRole.name}</h2>
      </div>
      <div className="p-8 md:p-10"><p className="text-lg leading-[2] text-[#514942]">{userRole.motto}</p><div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 border-y border-[#D1D1C7] py-6">{userScoreSummary.map(({ label, option, percent }) => <div key={label}><p className="text-xs font-bold tracking-[0.15em] text-[#8C7E6D]">{label}</p><p className="mt-2 flex items-baseline justify-between gap-2 text-sm text-[#2D2D2D]"><span>{option}</span><strong className="serif text-2xl font-normal">{percent}%</strong></p></div>)}</div><button type="button" onClick={onOpenMyFace} className="mt-7 border-b border-[#2D2D2D] pb-1 text-sm font-bold text-[#2D2D2D]">閱讀你的完整說明 →</button></div>
    </section> : <section className="mt-8 flex flex-col items-start justify-between gap-5 border border-[#D1D1C7] bg-white p-7 md:flex-row md:items-center md:p-9"><div><p className="text-xs font-bold tracking-[0.2em] text-[#8C635B]">YOUR STYLE</p><p className="mt-3 text-base leading-[1.8] text-[#70665D]">完成測驗後，這裡會用一張專屬導讀卡帶你進入自己的類型。</p></div><button type="button" onClick={onStartTest} className="border border-[#2D2D2D] px-5 py-3 text-sm font-bold text-[#2D2D2D] transition hover:bg-[#2D2D2D] hover:text-white">開始測驗 →</button></section>}

    <section className="mt-14 md:mt-20"><div className="flex flex-col justify-between gap-5 border-b border-[#D1D1C7] pb-6 md:flex-row md:items-end"><div><p className="text-xs font-bold tracking-[0.22em] text-[#8C635B]">BROWSE THE ATLAS</p><h2 className="mt-3 serif text-3xl text-[#2D2D2D] md:text-4xl">找到你想了解的交易方式</h2></div><div className="flex flex-col items-start gap-3 md:items-end"><p className="text-sm leading-[1.8] text-[#70665D]">點一型，閱讀它在不同市場情境下的反應。</p><button type="button" onClick={onOpenCompatibility} className="border-b border-[#2D2D2D] pb-1 text-sm font-bold text-[#2D2D2D] transition hover:text-[#8C635B]">開啟交易互補輪盤 →</button></div></div>
      <nav className="mt-6 flex gap-3 overflow-x-auto pb-2" aria-label="圖鑑篩選">{FILTERS.map((item) => <button key={item.id} type="button" onClick={() => setFilter(item.id)} className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-bold transition ${filter === item.id ? 'bg-[#2D2D2D] text-white' : 'border border-[#D1D1C7] bg-white text-[#70665D] hover:border-[#2D2D2D]'}`}>{item.label}</button>)}</nav>
      <div className="mt-7 grid grid-cols-1 gap-0 border-l border-t border-[#D1D1C7] sm:grid-cols-2 lg:grid-cols-4">{visibleRoles.map((role) => { const own = userCode === role.code; const tone = roleTone(role.code); return <button key={role.code} type="button" onClick={() => onOpenRole(role)} className={`group relative aspect-square min-h-0 overflow-hidden border-b border-r border-[#D1D1C7] bg-white p-7 text-left transition duration-300 hover:bg-[#F7F4EF] focus:outline-none focus:ring-2 focus:ring-[#8C635B] focus:ring-inset ${own ? 'bg-[#F4F0E9]' : ''}`}>
        <span className="pointer-events-none absolute inset-0 z-0 h-full w-full" aria-hidden="true">
          <img src={role.sketchImageUrl} alt="" className="absolute inset-0 h-full w-full object-contain opacity-[0.38] transition duration-500 group-hover:opacity-[0.68] group-hover:contrast-125 group-focus:opacity-[0.68] group-focus:contrast-125" />
        </span>
        <span className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-white/80 via-white/10 to-white/85 transition duration-500 group-hover:from-white/55 group-hover:to-white/70 group-focus:from-white/55 group-focus:to-white/70" aria-hidden="true" />
        <div className="relative z-10">
        <p className="text-sm font-bold tracking-[0.16em]" style={{ color: tone }}>{role.code}</p><p className="mt-4 text-xs leading-6 tracking-[0.04em] text-[#8C7E6D]">{traitSummary(role.code)}</p>{own && <p className="mt-4 w-fit border px-2 py-1 text-[10px] font-bold" style={{ borderColor: `${tone}66`, color: tone }}>你的類型</p>}<h3 className={`${own ? 'mt-7' : 'mt-10'} serif text-[1.8rem] leading-[1.55] text-[#2D2D2D] group-hover:text-[#8C635B]`}>{role.name}</h3><p className="mt-8 text-sm text-[#8C7E6D] transition group-hover:text-[#2D2D2D]">查看人格輪廓 →</p>
        </div>
      </button>})}</div>
    </section>
  </div>;
};
