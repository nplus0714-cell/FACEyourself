import React from 'react';
import { FACE_MAP } from '../constants';

interface BlindSpotWheelProps {
  code: string;
  onOpenFullWheel?: () => void;
}

const flipLetter = (letter: string) => ({ A: 'P', P: 'A', R: 'I', I: 'R', L: 'T', T: 'L', C: 'D', D: 'C' }[letter] ?? letter);
const flipAt = (code: string, index: number) => code.split('').map((letter, letterIndex) => letterIndex === index ? flipLetter(letter) : letter).join('');
const flipAll = (code: string) => code.split('').map(flipLetter).join('');

const DIRECTIONS: Record<string, { label: string; color: string }> = {
  A: { label: '轉為保守', color: '#9A6256' }, P: { label: '轉為積極', color: '#9A6256' },
  R: { label: '轉為感性', color: '#607889' }, I: { label: '轉為理性', color: '#607889' },
  L: { label: '加快節奏', color: '#A48355' }, T: { label: '拉長週期', color: '#A48355' },
  C: { label: '轉為分散', color: '#667B70' }, D: { label: '轉為集中', color: '#667B70' },
};

const POSITIONS = [{ left: '50%', top: '3%' }, { left: '96%', top: '39%' }, { left: '78%', top: '84%' }, { left: '22%', top: '84%' }, { left: '4%', top: '39%' }];

export const BlindSpotWheel: React.FC<BlindSpotWheelProps> = ({ code, onOpenFullWheel }) => {
  const related = code.split('').map((trait, index) => ({ code: flipAt(code, index), label: DIRECTIONS[trait]?.label ?? '', color: DIRECTIONS[trait]?.color ?? '#8C635B' }));
  const oppositeCode = flipAll(code);
  const currentRole = FACE_MAP[code];
  const oppositeRole = FACE_MAP[oppositeCode];

  return <section className="border border-[#D1D1C7] bg-[#F7F4EF] p-6 md:p-9">
    <div className="grid gap-8 lg:grid-cols-[minmax(18rem,0.85fr)_minmax(0,1fr)] lg:items-center">
      <div className="relative mx-auto aspect-square w-full max-w-[22rem]">
        <svg viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
          <polygon points="50,7 95,40 78,85 22,85 5,40" fill="#FCFBF8" stroke="#8B7D70" strokeOpacity="0.28" strokeWidth="0.35" />
          {[['50', '7'], ['95', '40'], ['78', '85'], ['22', '85'], ['5', '40']].map(([x, y]) => <line key={`${x}-${y}`} x1="50" y1="50" x2={x} y2={y} stroke="#8B7D70" strokeOpacity="0.24" strokeWidth="0.25" />)}
        </svg>
        <div className="absolute left-1/2 top-1/2 z-10 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-4 border-white bg-[#2D2D2D] px-3 text-center text-white shadow-lg"><span className="text-[10px] font-bold tracking-[0.14em] text-white/60">你現在的位置</span><strong className="mt-1 serif text-2xl">{code}</strong><span className="mt-1 text-xs font-bold leading-4">{currentRole?.name}</span></div>
        {related.map((item, index) => {
          const role = FACE_MAP[item.code]; const position = POSITIONS[index];
          return <div key={item.code} className="absolute z-10 w-24 -translate-x-1/2 -translate-y-1/2 text-center md:w-28" style={position}><div className="border border-[#D1D1C7] bg-white px-2 py-2 shadow-sm"><p className="text-[10px] font-bold tracking-[0.1em] text-[#8C7E6D]">{item.code}</p><p className="mt-1 text-xs font-bold leading-4 text-[#2D2D2D]">{role?.name}</p><p className="mt-1 text-[11px] font-bold" style={{ color: item.color }}>{item.label}</p></div></div>;
        })}
      </div>
      <div>
        <p className="text-xs font-bold tracking-[0.2em] text-[#8C635B]">WHEN YOU FEEL STUCK</p>
        <h3 className="mt-3 serif text-2xl leading-[1.45] text-[#2D2D2D] md:text-3xl">盲點不是缺點，是太習慣用同一種方法。</h3>
        <p className="mt-4 text-base leading-8 text-[#5F574F]">當你覺得焦慮、猶豫，或怎麼做都不對時，不必否定自己。試著從輪盤上的一個相鄰方向，借一點不同的做法回來。</p>
        <div className="mt-6 border-l-2 border-[#2D2D2D] bg-white px-5 py-4"><p className="text-xs font-bold tracking-[0.16em] text-[#8C7E6D]">潛在盲點</p><p className="mt-2 text-base font-bold text-[#2D2D2D]">{oppositeRole?.name} <span className="ml-2 text-sm font-normal text-[#8C7E6D]">{oppositeCode}</span></p><p className="mt-2 text-sm leading-6 text-[#70665D]">這是與你最不同的判斷方式；不必變成它，但它能提醒你看見平常容易忽略的角度。</p></div>
        {onOpenFullWheel && <button type="button" onClick={onOpenFullWheel} className="mt-6 border-b border-[#2D2D2D] pb-1 text-sm font-bold text-[#2D2D2D] transition hover:border-[#8C635B] hover:text-[#8C635B]">打開完整交易互補輪盤 →</button>}
      </div>
    </div>
  </section>;
};
