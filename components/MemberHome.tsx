import React, { useEffect, useMemo, useState } from 'react';
import { getFaceCode } from '../constants';
import { getMemberAssessmentHistory, type MemberAssessmentRecord } from '../services/memberAssessmentHistory';
import type { AuthUser, FaceScores } from '../types';

interface MemberHomeProps {
  user: AuthUser;
  dna: FaceScores | null;
  onViewResult: () => void;
  onStartTest: () => void;
  onOpenRate: () => void;
}

const formatDate = (value: string): string => new Intl.DateTimeFormat('zh-TW', {
  year: 'numeric', month: 'long', day: 'numeric',
}).format(new Date(value));

export const MemberHome: React.FC<MemberHomeProps> = ({ user, dna, onViewResult, onStartTest, onOpenRate }) => {
  const [records, setRecords] = useState<MemberAssessmentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;
    void getMemberAssessmentHistory()
      .then((history) => { if (active) setRecords(history); })
      .catch((error) => { console.warn('Unable to load member assessment history', error); if (active) setLoadError(true); })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, []);

  const currentCode = records[0]?.code ?? (dna ? getFaceCode(dna) : null);
  const displayedRecords = useMemo(() => records.slice(0, 5), [records]);

  return <section className="mx-auto max-w-5xl pb-28 pt-2 fade-in md:pt-8">
    <p className="text-xs font-bold tracking-[0.22em] text-[#8C635B]">MY FACE</p>
    <div className="mt-5 grid gap-6 border-y border-[#D1D1C7] py-8 md:grid-cols-[1.1fr_.9fr] md:py-12">
      <div>
        <h1 className="serif text-4xl leading-[1.45] text-[#2D2D2D] md:text-5xl">你的 FACE 記錄</h1>
        <p className="mt-5 max-w-xl text-base leading-8 text-[#5F574F]">{user.name}，這裡會保存你登入後完成的測驗。每次重測都能回看當時的交易傾向，慢慢看見自己的變化。</p>
      </div>
      <div className="border border-[#D1D1C7] bg-[#F7F4EF] p-6 md:p-7">
        <p className="text-[11px] font-bold tracking-[0.18em] text-[#8C635B]">LATEST RESULT</p>
        {currentCode ? <><p className="mt-3 serif text-3xl text-[#2D2D2D]">{currentCode}</p><p className="mt-3 text-sm leading-6 text-[#70665D]">最近一次完成的 FACE 交易風格。</p></> : <p className="mt-3 text-sm leading-7 text-[#70665D]">完成測驗後，結果會顯示在這裡。</p>}
      </div>
    </div>

    <div className="mt-8 grid gap-5 md:grid-cols-3">
      <article className="border border-[#D1D1C7] bg-white p-7"><p className="text-[11px] font-bold tracking-[0.2em] text-[#8C635B]">01 · FACE</p><h2 className="mt-5 serif text-2xl text-[#2D2D2D]">查看目前結果</h2><p className="mt-4 text-sm leading-7 text-[#70665D]">回到你的結果頁，重看人格輪廓、分數與行動建議。</p><button type="button" onClick={currentCode ? onViewResult : onStartTest} className="mt-7 border-b border-[#2D2D2D] pb-1 text-sm font-bold text-[#2D2D2D]">{currentCode ? '查看我的結果 →' : '開始第一次測驗 →'}</button></article>
      <article className="border border-[#D1D1C7] bg-white p-7"><p className="text-[11px] font-bold tracking-[0.2em] text-[#8C635B]">02 · HISTORY</p><h2 className="mt-5 serif text-2xl text-[#2D2D2D]">測驗記錄</h2><div className="mt-4 min-h-14 text-sm leading-7 text-[#70665D]">{isLoading ? '正在讀取你的記錄…' : loadError ? '暫時無法讀取記錄，請稍後再試。' : displayedRecords.length ? displayedRecords.map((record) => <p key={record.id}>{formatDate(record.completedAt)} · {record.code}</p>) : '尚未有已保存的測驗記錄。'}</div><button type="button" onClick={onStartTest} className="mt-7 border-b border-[#2D2D2D] pb-1 text-sm font-bold text-[#2D2D2D]">重新測驗並記錄 →</button></article>
      <article className="border border-[#2D2D2D] bg-[#2D2D2D] p-7 text-white"><p className="text-[11px] font-bold tracking-[0.2em] text-white/55">03 · RATE</p><h2 className="mt-5 serif text-2xl">RATE 鏡相診股</h2><p className="mt-4 text-sm leading-7 text-white/75">輸入自選股，整理你的持股結構是否符合 FACE 交易風格。</p><button type="button" onClick={onOpenRate} className="mt-7 border-b border-white/70 pb-1 text-sm font-bold">開啟 RATE 鏡相診股 →</button></article>
    </div>
  </section>;
};
