import React from 'react';
import { PersonalityProfile } from '../types';

interface RoleDetailProps { role: PersonalityProfile; isUserType: boolean; onBack: () => void; }
const toneFor = (code: string) => code.startsWith('F') ? '#9A655C' : code.startsWith('P') ? '#667784' : '#7C856C';

export const RoleDetail: React.FC<RoleDetailProps> = ({ role, isUserType, onBack }) => {
  const tone = toneFor(role.code);
  return <article className="mx-auto max-w-6xl pb-28 pt-2 fade-in md:pt-8">
    <button type="button" onClick={onBack} className="text-sm font-bold text-[#70665D] transition hover:text-[#2D2D2D]">← 回到交易風格圖鑑</button>
    <header className="mt-7 grid overflow-hidden border border-[#D1D1C7] bg-white md:mt-10 md:grid-cols-2">
      <div className="relative min-h-[24rem] overflow-hidden" style={{ backgroundColor: `${tone}16` }}><img src={role.imageUrl} alt={role.name} className="absolute inset-0 h-full w-full object-cover object-top mix-blend-multiply" /><div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" /><p className="absolute bottom-7 left-7 text-6xl serif text-white md:bottom-10 md:left-10 md:text-8xl">{role.code}</p></div>
      <div className="flex flex-col justify-center p-8 md:p-14"><p className="text-xs font-bold tracking-[0.24em]" style={{ color: tone }}>FACE TYPE PROFILE</p>{isUserType && <p className="mt-5 w-fit px-3 py-1.5 text-xs font-bold text-white" style={{ backgroundColor: tone }}>你的交易風格</p>}<h1 className="mt-6 serif text-5xl leading-[1.35] text-[#2D2D2D] md:text-7xl">{role.name}</h1><p className="mt-6 serif text-xl leading-[1.9] text-[#70665D] md:text-2xl">{role.motto}</p></div>
    </header>
    <div className="mx-auto mt-12 max-w-4xl space-y-16 md:mt-20 md:space-y-24">
      <section className="grid gap-8 md:grid-cols-[7rem_1fr]"><p className="text-xs font-bold tracking-[0.2em]" style={{ color: tone }}>01<br />交易習慣</p><p className="serif text-2xl leading-[2] text-[#2D2D2D] md:text-3xl">{role.portrait}</p></section>
      <section className="grid gap-8 border-y border-[#D1D1C7] py-12 md:grid-cols-[7rem_1fr] md:py-16"><p className="text-xs font-bold tracking-[0.2em]" style={{ color: tone }}>02<br />做決定時</p><div><h2 className="serif text-3xl leading-[1.7] text-[#2D2D2D] md:text-5xl">{role.psychology.mechanism}</h2><p className="mt-6 text-base leading-[2] text-[#70665D] md:text-lg">{role.psychology.scene}</p></div></section>
      <section className="grid gap-8 md:grid-cols-[7rem_1fr]"><p className="text-xs font-bold tracking-[0.2em]" style={{ color: tone }}>03<br />壓力提醒</p><div className="grid gap-4 sm:grid-cols-2">{role.blindSpots.map((spot, index) => <div key={spot.title} className="border border-[#D1D1C7] bg-white p-6"><p className="text-xs font-bold" style={{ color: tone }}>0{index + 1}</p><h3 className="mt-5 text-xl font-bold text-[#2D2D2D]">{spot.title}</h3><p className="mt-3 text-sm leading-[1.9] text-[#70665D]">{spot.description}</p><p className="mt-5 border-t border-[#D1D1C7] pt-4 text-sm font-bold leading-[1.8]" style={{ color: tone }}>{spot.behavior}</p></div>)}</div></section>
      <section className="px-7 py-12 text-center text-white md:px-16 md:py-20" style={{ backgroundColor: tone }}><p className="text-xs font-bold tracking-[0.24em] text-white/60">一個提醒</p><p className="mx-auto mt-6 max-w-3xl serif text-3xl leading-[1.85] md:text-5xl">{role.antidote}</p></section>
      <section className="border border-[#D1D1C7] bg-[#F7F4EF] p-8 text-center md:p-12"><p className="text-xs font-bold tracking-[0.22em] text-[#8C635B]">NEXT CONTENT</p><h2 className="mt-3 serif text-3xl text-[#2D2D2D]">適合這一型的影片與文章</h2><p className="mx-auto mt-4 max-w-xl text-sm leading-[1.9] text-[#70665D]">下一步會依照你的交易風格，把站內影片與專欄推薦放在這裡。</p></section>
    </div>
  </article>;
};
