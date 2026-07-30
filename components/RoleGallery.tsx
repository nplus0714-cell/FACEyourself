import React, { useMemo, useState } from 'react';
import { FACE_MAP, getFaceCode } from '../constants';
import { PersonalityProfile, FaceScores } from '../types';

interface RoleGalleryProps { dna: FaceScores | null; onOpenRole: (role: PersonalityProfile) => void; onStartTest: () => void; onOpenCompatibility: () => void; }

const FILTERS = [
  { id: 'all', label: '全部 16 型', traits: [] },
  { id: 'focus', label: '獲利動機', traits: ['A', 'P'] },
  { id: 'analysis', label: '決策邏輯', traits: ['R', 'I'] },
  { id: 'cycle', label: '交易週期', traits: ['L', 'T'] },
  { id: 'exposure', label: '資金管理', traits: ['C', 'D'] },
] as const;

const roleTone = (code: string) => code.startsWith('F') ? '#9A655C' : code.startsWith('P') ? '#667784' : '#7C856C';
const dimensionLabel = (code: string) => [
  ['獲利動機', code[0] === 'F' ? '主動尋找' : '耐心等待'],
  ['決策邏輯', code[1] === 'R' ? '規則分析' : '直覺感受'],
  ['交易週期', code[2] === 'L' ? '長期累積' : '順勢調整'],
  ['資金管理', code[3] === 'C' ? '集中主軸' : '多元組合'],
];

export const RoleGallery: React.FC<RoleGalleryProps> = ({ dna, onOpenRole, onStartTest, onOpenCompatibility }) => {
  const roles = useMemo(() => Object.values(FACE_MAP).sort((a, b) => a.code.localeCompare(b.code)), []);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['id']>('all');
  const userCode = dna ? getFaceCode(dna) : null;
  const userRole = userCode ? roles.find((role) => role.code === userCode) : null;
  const visibleRoles = filter === 'all' ? roles : roles.filter((role) => (FILTERS.find((item) => item.id === filter)?.traits ?? []).some((trait) => role.code.includes(trait)));

  return <div className="mx-auto max-w-7xl pb-28 pt-2 fade-in md:pt-8">
    <header className="grid overflow-hidden border border-[#D1D1C7] bg-[#F4F0E9] md:grid-cols-[1.1fr_0.9fr]">
      <div className="p-8 md:p-14 lg:p-16">
        <p className="text-xs font-bold tracking-[0.3em] text-[#8C635B]">FACE TYPE ATLAS</p>
        <h1 className="mt-6 serif text-4xl leading-[1.42] text-[#2D2D2D] md:text-6xl">16 型<br />交易風格圖鑑</h1>
        <p className="mt-7 max-w-xl text-base leading-[2] text-[#70665D] md:text-lg">交易沒有一種正確姿勢。從你看機會、做判斷、掌握節奏與配置風險的習慣，理解你比較適合怎麼走。</p>
      </div>
      <div className="relative min-h-60 overflow-hidden bg-[#2D2D2D] p-8 text-white md:p-14">
        <span className="absolute -right-9 -top-12 serif text-[15rem] leading-none text-white/[0.06]">F</span>
        <p className="relative text-xs font-bold tracking-[0.24em] text-white/50">HOW TO READ THE ATLAS</p>
        <div className="relative mt-10 grid grid-cols-2 gap-x-8 gap-y-8">
          {[['F', '獲利動機'], ['A', '決策邏輯'], ['C', '交易週期'], ['E', '資金管理']].map(([letter, label]) => <div key={letter} className="border-l border-white/25 pl-4"><p className="serif text-3xl">{letter}</p><p className="mt-1 text-sm text-white/70">{label}</p></div>)}
        </div>
        <p className="relative mt-8 text-sm leading-[1.7] text-white/60">每一型都是四個字母的組合。點進任何一型，就能看見它在交易中的樣子。</p>
      </div>
    </header>

    {userRole ? <section className="mt-8 grid overflow-hidden border border-[#8C635B]/40 bg-white md:grid-cols-[0.82fr_1.18fr]" aria-label="你的交易風格">
      <div className="relative flex min-h-64 items-end overflow-hidden p-8 md:p-10" style={{ backgroundColor: `${roleTone(userRole.code)}18` }}>
        <span className="absolute -left-2 -top-6 serif text-[9rem] leading-none" style={{ color: `${roleTone(userRole.code)}28` }}>{userRole.code}</span>
        <div className="relative"><p className="text-xs font-bold tracking-[0.22em] text-[#8C635B]">YOUR STYLE</p><h2 className="mt-3 serif text-4xl text-[#2D2D2D]">{userRole.name}</h2></div>
      </div>
      <div className="p-8 md:p-10"><p className="text-lg leading-[1.9] text-[#514942]">{userRole.motto}</p><div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-y border-[#D1D1C7] py-6">{dimensionLabel(userRole.code).map(([label, value]) => <div key={label}><p className="text-xs font-bold tracking-[0.15em] text-[#8C7E6D]">{label}</p><p className="mt-1 text-sm text-[#2D2D2D]">{value}</p></div>)}</div><button type="button" onClick={() => onOpenRole(userRole)} className="mt-7 border-b border-[#2D2D2D] pb-1 text-sm font-bold text-[#2D2D2D]">閱讀你的完整說明 →</button></div>
    </section> : <section className="mt-8 flex flex-col items-start justify-between gap-5 border border-[#D1D1C7] bg-white p-7 md:flex-row md:items-center md:p-9"><div><p className="text-xs font-bold tracking-[0.2em] text-[#8C635B]">YOUR STYLE</p><p className="mt-3 text-base leading-[1.8] text-[#70665D]">完成測驗後，這裡會用一張專屬導讀卡帶你進入自己的類型。</p></div><button type="button" onClick={onStartTest} className="border border-[#2D2D2D] px-5 py-3 text-sm font-bold text-[#2D2D2D] transition hover:bg-[#2D2D2D] hover:text-white">開始測驗 →</button></section>}

    <section className="mt-14 md:mt-20"><div className="flex flex-col justify-between gap-5 border-b border-[#D1D1C7] pb-6 md:flex-row md:items-end"><div><p className="text-xs font-bold tracking-[0.22em] text-[#8C635B]">BROWSE THE ATLAS</p><h2 className="mt-3 serif text-3xl text-[#2D2D2D] md:text-4xl">找到你想了解的交易方式</h2></div><div className="flex flex-col items-start gap-3 md:items-end"><p className="text-sm leading-[1.8] text-[#70665D]">點一型，閱讀它在不同市場情境下的反應。</p><button type="button" onClick={onOpenCompatibility} className="border-b border-[#2D2D2D] pb-1 text-sm font-bold text-[#2D2D2D] transition hover:text-[#8C635B]">開啟交易互補輪盤 →</button></div></div>
      <nav className="mt-6 flex gap-3 overflow-x-auto pb-2" aria-label="圖鑑篩選">{FILTERS.map((item) => <button key={item.id} type="button" onClick={() => setFilter(item.id)} className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-bold transition ${filter === item.id ? 'bg-[#2D2D2D] text-white' : 'border border-[#D1D1C7] bg-white text-[#70665D] hover:border-[#2D2D2D]'}`}>{item.label}</button>)}</nav>
      <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{visibleRoles.map((role) => { const own = userCode === role.code; const tone = roleTone(role.code); return <button key={role.code} type="button" onClick={() => onOpenRole(role)} className={`group relative min-h-[15rem] overflow-hidden border bg-white p-6 text-left transition duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#8C635B] focus:ring-offset-4 ${own ? 'border-[#8C635B]' : 'border-[#D1D1C7]'}`}>
        <div className="absolute inset-x-0 top-0 h-1.5" style={{ backgroundColor: tone }} /><p className="text-xs font-bold tracking-[0.18em]" style={{ color: tone }}>{role.code}</p>{own && <p className="mt-3 inline-block border px-2 py-1 text-[10px] font-bold" style={{ borderColor: `${tone}66`, color: tone }}>你的類型</p>}<h3 className="mt-8 serif text-3xl leading-[1.35] text-[#2D2D2D] group-hover:text-[#8C635B]">{role.name}</h3><p className="mt-4 line-clamp-2 text-sm leading-[1.85] text-[#70665D]">{role.motto}</p><div className="absolute bottom-6 left-6 right-6 flex items-center justify-between border-t border-[#D1D1C7] pt-4"><span className="text-[10px] font-bold tracking-[0.14em] text-[#8C7E6D]">{role.code.split('').join(' · ')}</span><span className="text-sm" style={{ color: tone }}>→</span></div>
      </button>})}</div>
    </section>
  </div>;
};
