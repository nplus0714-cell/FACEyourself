import React, { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, Mail, RefreshCw, ShieldCheck, Users } from 'lucide-react';
import { loadResearchAdminData, ResearchAdminData } from '../services/researchAdminService';

const Stat = ({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) => (
  <div className="border border-[#D6CEC2] bg-white p-5 shadow-sm">
    <div className="flex items-center justify-between text-[#8C635B]">{icon}<span className="text-3xl serif text-[#2D2D2D]">{value}</span></div>
    <p className="mt-4 text-xs font-bold tracking-[0.14em] text-[#6F655D]">{label}</p>
  </div>
);

export const ResearchAdmin: React.FC = () => {
  const [data, setData] = useState<ResearchAdminData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true); setError('');
    try { setData(await loadResearchAdminData()); }
    catch (cause) { setError(cause instanceof Error ? cause.message : '無法讀取研究資料。'); }
    finally { setLoading(false); }
  };

  useEffect(() => { void refresh(); }, []);

  if (loading && !data) return <div className="py-32 text-center text-sm tracking-widest text-[#746A61]">正在驗證研究資料…</div>;
  if (error && !data) return <div className="mx-auto max-w-xl border border-[#B98A83] bg-[#F8EFED] p-8 text-sm leading-7 text-[#75463F]"><b>無法開啟研究後台</b><br />{error}<br />請確認已使用管理者帳號登入。</div>;
  if (!data) return null;

  return <section className="space-y-8 pb-24">
    <div className="flex flex-col gap-4 border-b border-[#D1C8BC] pb-7 sm:flex-row sm:items-end sm:justify-between">
      <div><p className="text-xs font-bold tracking-[0.22em] text-[#8C635B]">RESEARCH DATA REVIEW</p><h1 className="mt-3 text-4xl serif text-[#2D2D2D]">研究資料管理</h1><p className="mt-3 text-sm leading-7 text-[#6F655D]">只有通過完整性與一致性檢查的資料會標示為「可研究」。</p></div>
      <button type="button" onClick={() => void refresh()} disabled={loading} className="flex items-center justify-center gap-2 border border-[#4A382D] bg-white px-5 py-3 text-xs font-bold tracking-widest text-[#4A382D] disabled:opacity-50"><RefreshCw size={15} className={loading ? 'animate-spin' : ''} />重新整理</button>
    </div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <Stat label="總回覆" value={data.summary.total} icon={<Users size={20} />} />
      <Stat label="可研究" value={data.summary.researchReady} icon={<ShieldCheck size={20} />} />
      <Stat label="需檢查" value={data.summary.needsReview} icon={<AlertTriangle size={20} />} />
      <Stat label="可寄結果" value={data.summary.canSendResult} icon={<Mail size={20} />} />
      <Stat label="可行銷" value={data.summary.canMarket} icon={<CheckCircle2 size={20} />} />
    </div>
    <div className="overflow-x-auto border border-[#D6CEC2] bg-white">
      <table className="min-w-[1050px] w-full text-left text-sm">
        <thead className="bg-[#F1ECE5] text-xs tracking-wider text-[#665C54]"><tr>{['提交時間','Email','答案','結果','四面向分數','研究狀態','聯絡資格'].map((name) => <th key={name} className="px-4 py-4">{name}</th>)}</tr></thead>
        <tbody>{data.submissions.map((row) => <tr key={row.id} className="border-t border-[#E2DBD1] align-top">
          <td className="whitespace-nowrap px-4 py-5 text-xs text-[#6F655D]">{new Date(row.submittedAt).toLocaleString('zh-TW')}</td>
          <td className="px-4 py-5"><div>{row.emailMasked || '未提供'}</div><div className={`mt-1 text-xs ${row.emailUsable ? 'text-[#527257]' : 'text-[#A35D55]'}`}>{row.emailUsable ? '格式可用' : '不可寄送'}</div></td>
          <td className="px-4 py-5"><b>{row.answerCount}/40</b><div className="mt-1 text-xs text-[#756B62]">不適用 {row.notApplicableCount} 題</div><div className={`mt-1 text-xs ${row.calibrationComplete ? 'text-[#527257]' : 'text-[#8B7664]'}`}>校準題：{row.calibrationComplete ? '完整' : '舊版／未填'}</div></td>
          <td className="px-4 py-5"><span className="font-bold tracking-widest">{row.faceCode}</span></td>
          <td className="px-4 py-5 text-xs leading-6 text-[#5F5650]">A {row.scores.A} / P {row.scores.P}<br />R {row.scores.R} / I {row.scores.I}<br />L {row.scores.L} / T {row.scores.T}<br />C {row.scores.C} / D {row.scores.D}</td>
          <td className="px-4 py-5">{row.researchReady ? <span className="inline-flex bg-[#EAF2EA] px-3 py-1 text-xs font-bold text-[#426248]">可研究</span> : <span className="inline-flex bg-[#F6E8E5] px-3 py-1 text-xs font-bold text-[#934F47]">需排除</span>}<div className="mt-2 max-w-[220px] text-xs leading-5 text-[#8A5B54]">{row.issues.join('、')}</div></td>
          <td className="px-4 py-5 text-xs leading-6"><div>結果：{row.canSendResult ? '可寄' : '不可寄'}</div><div>行銷：{row.canMarket ? '可寄' : '不可寄'}</div></td>
        </tr>)}</tbody>
      </table>
    </div>
    <p className="text-xs leading-6 text-[#7B7168]">判定規則：研究同意有效、40 題代碼完整且無重複、四組分數各自合計 100、人格代碼格式正確、不適用題數未超過 8 題。行銷資格另需明確同意行銷且尚未退訂。</p>
  </section>;
};
