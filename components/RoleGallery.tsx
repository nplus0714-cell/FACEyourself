import React, { useMemo, useState } from 'react';
import { FACE_MAP, getFaceCode } from '../constants';
import { PersonalityProfile, FaceScores } from '../types';
import { PERSONALITY_EDITORIAL } from '../data/personalityEditorial';

interface RoleGalleryProps {
  dna: FaceScores | null;
  onOpenRole: (role: PersonalityProfile) => void;
  onStartTest: () => void;
  onOpenMyFace: () => void;
}

const roleTone = (code: string) => (code.startsWith('A') ? '#9A655C' : code.startsWith('P') ? '#667784' : '#7C856C');
const TRAIT_CN: Record<string, string> = { A: '積極', P: '保守', R: '理性', I: '感性', L: '長期', T: '短期', C: '集中', D: '分散' };
const traitSummary = (code: string) => code.split('').map((t) => TRAIT_CN[t]).join('／');

const AXES = [
  { en: 'Focus', label: '獲利動機', a: ['A', '積極', '進攻擴張'], b: ['P', '保守', '守護抗跌'] },
  { en: 'Analysis', label: '決策邏輯', a: ['R', '理性', '數據回測'], b: ['I', '感性', '盤感直覺'] },
  { en: 'Cycle', label: '交易週期', a: ['L', '長期', '複利時間'], b: ['T', '短期', '波段價差'] },
  { en: 'Exposure', label: '資金管理', a: ['C', '集中', '重壓深度'], b: ['D', '分散', '配置平衡'] },
] as const;

const CN_NUM = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四', '十五', '十六'];

export const RoleGallery: React.FC<RoleGalleryProps> = ({ dna, onOpenRole, onStartTest, onOpenMyFace }) => {
  const roles = useMemo(() => Object.values(FACE_MAP)
    .map((role) => ({
      ...role,
      slang: PERSONALITY_EDITORIAL[role.code]?.slangName ?? '',
      cardLine: PERSONALITY_EDITORIAL[role.code]?.cardLine ?? role.motto,
    })), []);

  const userCode = dna ? getFaceCode(dna) : null;
  const userRole = userCode ? roles.find((r) => r.code === userCode) : null;

  const [pattern, setPattern] = useState<(string | null)[]>([null, null, null, null]);
  const activeFilter = pattern.some(Boolean);
  const visibleRoles = roles.filter((r) => pattern.every((p, i) => !p || r.code[i] === p));
  const soleMatchCode = activeFilter && visibleRoles.length === 1 ? visibleRoles[0].code : null;

  const toggle = (axis: number, val: string) => setPattern((prev) => prev.map((p, i) => (i === axis ? (p === val ? null : val) : p)));
  const reset = () => setPattern([null, null, null, null]);

  return (
    <div className="mx-auto max-w-7xl pb-28 fade-in">
      {/* HERO */}
      <header className="relative overflow-hidden border border-[#D1D1C7]">
        <img
          src="/images/homepage-trading-salon.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[center_35%] opacity-70"
        />
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#FBFAF7]/70 via-[#FBFAF7]/80 to-[#FBFAF7]" aria-hidden="true" />
        <div className="relative px-6 py-20 text-center md:py-28">
          <p className="text-xs font-bold tracking-[0.32em] text-[#8C635B]">FACE TYPE ATLAS</p>
          <h1 className="mt-6 serif text-5xl leading-[1.15] text-[#2D2D2D] md:text-7xl">交易人格 16 型</h1>
          <p className="mt-5 serif text-base tracking-[0.5em] text-[#8C7E6D] md:text-lg">F　A　C　E</p>
          <p className="mx-auto mt-7 max-w-xl text-base leading-[2] text-[#5F574F] md:text-lg">
            四個維度、十六種靈魂。從獲利動機、決策邏輯、交易週期到資金管理，找出屬於你的那頭獸——以及牠的天賦、盲點與自我救贖。
          </p>
        </div>
      </header>

      {/* FACE 四維 + 快速篩選 + 正式測驗 */}
      <section className="mt-8 border border-[#D1D1C7] bg-[#F7F4EF] p-6 md:p-9" aria-labelledby="dimension-title">
        <p className="text-xs font-bold tracking-[0.28em] text-[#8C635B]">FIND YOUR TYPE</p>
        <h2 id="dimension-title" className="mt-3 max-w-4xl serif text-4xl leading-[1.45] text-[#2D2D2D] md:text-5xl">四個維度，描繪交易人格輪廓</h2>
        <p className="mt-4 text-base leading-[1.9] text-[#70665D]">在每個維度選擇較接近你的一側，快速查看對應的人格；若想獲得完整判讀，可以進行 40 題正式測驗。</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="FACE 四個維度">
          {AXES.map((ax, i) => (
            <div key={ax.en} className="relative border border-[#D1D1C7] bg-white p-5">
              <span className="absolute inset-y-0 left-0 w-1 bg-[#8C635B]/70" aria-hidden="true" />
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#8C635B]">{ax.en}</p>
              <h3 className="mt-2 serif text-2xl text-[#2D2D2D]">{ax.label}</h3>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {[ax.a, ax.b].map(([letter, name, hint]) => {
                  const on = pattern[i] === letter;
                  return (
                    <button
                      key={letter}
                      type="button"
                      onClick={() => toggle(i, letter)}
                      aria-pressed={on}
                      title={hint}
                      className={`border px-3 py-3 text-left transition ${on ? 'border-[#2D2D2D] bg-[#2D2D2D] text-white' : 'border-[#D1D1C7] bg-[#FBFAF7] text-[#70665D] hover:border-[#8C635B]'}`}
                    >
                      <span className="block text-xs font-bold tracking-[0.16em] opacity-70">{letter}</span>
                      <span className="mt-1 block text-sm font-bold">{name}</span>
                      <span className="mt-1 block text-[11px] leading-[1.5] opacity-60">{hint}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-5 border-t border-[#D1D1C7] pt-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#70665D]">
              <span>
                {!activeFilter
                  ? '目前顯示全部 16 型'
                  : visibleRoles.length === 1
                    ? <>你選出的輪廓是 <b className="serif text-lg font-normal text-[#8C635B]">{visibleRoles[0].name}</b></>
                    : <>目前符合 <b className="text-[#8C635B]">{CN_NUM[visibleRoles.length] ?? visibleRoles.length}</b> 型</>}
              </span>
              {activeFilter && <button type="button" onClick={reset} className="border-b border-current pb-0.5 transition hover:text-[#2D2D2D]">重設選擇</button>}
            </div>
            {userRole && <p className="mt-2 text-sm text-[#70665D]">你的正式測驗結果：<button type="button" onClick={onOpenMyFace} className="font-bold text-[#2D2D2D] underline decoration-[#8C635B]/50 underline-offset-4">{userRole.name} {userRole.code}</button></p>}
          </div>
          <button type="button" onClick={onStartTest} className="w-full border border-[#2D2D2D] bg-white px-6 py-4 text-sm font-bold text-[#2D2D2D] transition hover:bg-[#2D2D2D] hover:text-white md:w-auto">{userRole ? '重新測驗' : '開始 40 題測驗'} →</button>
        </div>
      </section>

      {/* 十六型畫廊 */}
      <section className="mt-10" aria-labelledby="sixteen-types-title">
        <div className="border-b border-[#D1D1C7] pb-5">
          <p className="text-xs font-bold tracking-[0.24em] text-[#8C635B]">THE SIXTEEN</p>
          <h2 id="sixteen-types-title" className="mt-2 serif text-3xl text-[#2D2D2D] md:text-4xl">十六型人物誌</h2>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {visibleRoles.map((role) => {
          const own = userCode === role.code;
          const sole = soleMatchCode === role.code;
          const tone = roleTone(role.code);
          return (
            <button
              key={role.code}
              type="button"
              onClick={() => onOpenRole(role)}
              className={`group overflow-hidden border bg-white text-left transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_34px_-20px_rgba(45,45,45,0.35)] focus:outline-none focus:ring-2 focus:ring-[#8C635B] focus:ring-offset-2 ${sole ? 'border-[#8C635B] ring-2 ring-[#8C635B]/30' : own ? 'border-[#8C635B]' : 'border-[#D1D1C7] hover:border-[#8C635B]'}`}
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-[#F4F0E9]">
                <img src={role.landscapeImageUrl} alt={role.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
                {own && <span className="absolute left-3 top-3 bg-[#8C635B] px-2 py-1 text-[10px] font-bold tracking-[0.1em] text-white">你的類型</span>}
              </div>
              <div className="border-t border-[#D1D1C7] px-5 py-4">
                <p className="text-[11px] font-bold tracking-[0.28em]" style={{ color: tone }}>{role.code}</p>
                <p className="mt-1.5 text-xs tracking-[0.04em] text-[#8C7E6D]">{traitSummary(role.code)}</p>
                <h3 className="mt-3 serif text-2xl leading-[1.5] text-[#2D2D2D]">{role.name}</h3>
                {role.slang && <p className="mt-2 border-t border-dashed border-[#D1D1C7] pt-3 text-sm leading-[1.7] text-[#70665D]">{role.slang}</p>}
              </div>
            </button>
          );
        })}
        </div>
      </section>

      <section className="mt-14 overflow-hidden rounded-[0.7rem] bg-[#344A38] px-7 py-14 text-center text-[#F5F0E5] md:px-14 md:py-20">
        <p className="text-xs font-bold tracking-[0.34em] text-[#E7DFCE]/75">FACE · TRADING PERSONA</p>
        <h2 className="mt-7 serif text-4xl leading-[1.4] md:text-5xl">認識自己，是交易的第一課</h2>
        <p className="mx-auto mt-6 max-w-3xl text-base leading-[2] text-[#E7DFCE]/85 md:text-lg">每一型都有天賦，也都有盲點。看懂你的獸，也看懂牠的鄰居——當你卡關時，答案往往就藏在隔壁那一型身上。</p>
      </section>
    </div>
  );
};
