import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle, BarChart3, CheckCircle2, ClipboardCopy, Download, Eye, EyeOff,
  FileCheck2, Flag, FlaskConical, ListChecks, Mail, MessageSquareText, RefreshCw, Save, Search, ShieldCheck, Users,
} from 'lucide-react';
import { FACE_MAP } from '../constants';
import { FACE_24_REVIEW_QUESTIONS } from '../data/faceQuestions24Review';
import {
  loadResearchAdminData, saveResearchReview, type FaceScoreKey, type ResearchAdminData,
  type ResearchQuestionStatus, type ResearchReviewDecision, type ResearchSubmission,
} from '../services/researchAdminService';

type AdminTab = 'overview' | 'questions' | 'responses' | 'feedback';
type StatusFilter = 'all' | 'included' | 'excluded' | 'sample_review' | 'duplicate' | 'result' | 'marketing';
type QuestionDimensionFilter = 'all' | 'FOCUS' | 'ANALYSIS' | 'CYCLE' | 'EXPOSURE';
type QuestionStatusFilter = 'all' | ResearchQuestionStatus;

const SCORE_KEYS: FaceScoreKey[] = ['A', 'P', 'R', 'I', 'L', 'T', 'C', 'D'];
const AXES: Array<{ label: string; left: FaceScoreKey; right: FaceScoreKey; leftLabel: string; rightLabel: string }> = [
  { label: '獲利動機', left: 'A', right: 'P', leftLabel: '積極', rightLabel: '保守' },
  { label: '決策邏輯', left: 'R', right: 'I', leftLabel: '理性', rightLabel: '感性' },
  { label: '交易週期', left: 'L', right: 'T', leftLabel: '長期', rightLabel: '短期' },
  { label: '資金管理', left: 'C', right: 'D', leftLabel: '集中', rightLabel: '分散' },
];
const DIMENSION_LABELS: Record<Exclude<QuestionDimensionFilter, 'all'>, string> = {
  FOCUS: '獲利動機 A／P', ANALYSIS: '決策邏輯 R／I', CYCLE: '交易週期 L／T', EXPOSURE: '資金管理 C／D',
};
const QUESTION_STATUS_LABELS: Record<ResearchQuestionStatus, string> = {
  collecting: '蒐集中', healthy: '目前穩定', watch: '持續觀察', review: '優先檢查',
};
const ANALYSIS_STAGE_LABELS = {
  collecting: '資料蒐集中', preliminary: '初步題目檢查', screening: '修題候選篩選', stable: '穩定性驗證',
};
const QUESTION_BY_CODE = new Map(FACE_24_REVIEW_QUESTIONS.map((question) => [
  `face-v2-${String(question.id).padStart(2, '0')}`,
  question,
]));

const QuestionStatusBadge = ({ status }: { status: ResearchQuestionStatus }) => {
  const className = {
    collecting: 'bg-[#EEEAE4] text-[#70675F]',
    healthy: 'bg-[#E7F0E8] text-[#426248]',
    watch: 'bg-[#F4EEDC] text-[#7A643A]',
    review: 'bg-[#F4E4E1] text-[#914D46]',
  }[status];
  return <span className={`inline-flex px-2.5 py-1 text-xs font-medium ${className}`}>{QUESTION_STATUS_LABELS[status]}</span>;
};

const Stat = ({ label, value, note, icon }: { label: string; value: number; note?: string; icon: React.ReactNode }) => (
  <div className="border border-[#D6CEC2] bg-white p-5 shadow-[0_8px_24px_rgba(70,54,44,0.04)]">
    <div className="flex items-start justify-between gap-4 text-[#8C635B]">{icon}<span className="serif text-3xl text-[#2D2D2D]">{value}</span></div>
    <p className="mt-4 text-xs font-medium tracking-[0.13em] text-[#5E554E]">{label}</p>
    {note && <p className="mt-1 text-xs leading-5 text-[#8A8077]">{note}</p>}
  </div>
);

const formatDateTime = (value: string) => new Intl.DateTimeFormat('zh-TW', {
  year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
}).format(new Date(value));

const recordValues = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
  if (typeof value === 'string' && value.trim()) return [value.trim()];
  return [];
};

const distribution = (rows: ResearchSubmission[], key: string) => {
  const counts = new Map<string, number>();
  rows.forEach((row) => recordValues(row.market[key]).forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1)));
  return [...counts.entries()].map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'zh-TW'));
};

const DistributionList = ({ title, items, denominator }: { title: string; items: Array<{ label: string; count: number }>; denominator: number }) => (
  <section className="border border-[#D6CEC2] bg-white p-5 sm:p-6">
    <h3 className="serif text-xl text-[#332E2A]">{title}</h3>
    {items.length > 0 ? <div className="mt-5 space-y-4">{items.map((item) => {
      const percentage = denominator > 0 ? Math.round((item.count / denominator) * 100) : 0;
      return <div key={item.label}>
        <div className="mb-1.5 flex items-start justify-between gap-4 text-sm leading-6"><span>{item.label}</span><span className="shrink-0 tabular-nums text-[#8C635B]">{item.count} · {percentage}%</span></div>
        <div className="h-1.5 bg-[#EEE9E2]"><div className="h-full bg-[#9B7268]" style={{ width: `${percentage}%` }} /></div>
      </div>;
    })}</div> : <p className="mt-5 text-sm text-[#857A70]">尚無資料</p>}
  </section>
);

const StatusBadge = ({ row }: { row: ResearchSubmission }) => row.researchReady
  ? <span className="inline-flex bg-[#EAF2EA] px-2.5 py-1 text-xs font-medium text-[#426248]">可研究</span>
  : <span className="inline-flex bg-[#F6E8E5] px-2.5 py-1 text-xs font-medium text-[#934F47]">需檢查</span>;

const ReviewBadge = ({ decision }: { decision: ResearchReviewDecision }) => {
  const config = {
    included: ['納入分析', 'bg-[#E7F0E8] text-[#426248]'],
    excluded: ['排除樣本', 'bg-[#F4E4E1] text-[#914D46]'],
    needs_review: ['待人工確認', 'bg-[#F4EEDC] text-[#7A643A]'],
  }[decision];
  return <span className={`inline-flex px-2.5 py-1 text-xs font-medium ${config[1]}`}>{config[0]}</span>;
};

const csvCell = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;

export const ResearchAdmin: React.FC = () => {
  const [data, setData] = useState<ResearchAdminData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<AdminTab>('overview');
  const [query, setQuery] = useState('');
  const [versionFilter, setVersionFilter] = useState('current');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [revealedEmails, setRevealedEmails] = useState<Set<string>>(new Set());
  const [copyNotice, setCopyNotice] = useState('');
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [reviewDecision, setReviewDecision] = useState<ResearchReviewDecision>('included');
  const [reviewReason, setReviewReason] = useState('');
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewSaving, setReviewSaving] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [questionDimension, setQuestionDimension] = useState<QuestionDimensionFilter>('all');
  const [questionStatus, setQuestionStatus] = useState<QuestionStatusFilter>('all');

  const refresh = async () => {
    setLoading(true); setError('');
    try { setData(await loadResearchAdminData()); }
    catch (cause) { setError(cause instanceof Error ? cause.message : '無法讀取研究資料。'); }
    finally { setLoading(false); }
  };

  useEffect(() => { void refresh(); }, []);

  const currentRows = useMemo(() => data?.submissions.filter((row) => row.assessmentVersion === data.currentAssessmentVersion) ?? [], [data]);
  const analysisRows = useMemo(() => currentRows.filter((row) => row.includedInAnalysis), [currentRows]);
  const axisAverages = useMemo(() => Object.fromEntries(SCORE_KEYS.map((key) => [key, analysisRows.length > 0
    ? Math.round(analysisRows.reduce((total, row) => total + Number(row.scores[key] ?? 0), 0) / analysisRows.length) : 0])) as Record<FaceScoreKey, number>, [analysisRows]);
  const faceDistribution = useMemo(() => {
    const counts = new Map<string, number>();
    analysisRows.forEach((row) => counts.set(row.faceCode, (counts.get(row.faceCode) ?? 0) + 1));
    return [...counts.entries()].map(([code, count]) => ({ code, count })).sort((a, b) => b.count - a.count || a.code.localeCompare(b.code));
  }, [analysisRows]);
  const qualitativeRows = useMemo(() => currentRows.filter((row) => Object.values(row.feedback).some((value) => value.trim())), [currentRows]);
  const questionAnalysis = data?.questionAnalysis;
  const filteredQuestionAnalysis = useMemo(() => (questionAnalysis?.questions ?? []).filter((question) => {
    if (questionDimension !== 'all' && question.dimension !== questionDimension) return false;
    if (questionStatus !== 'all' && question.status !== questionStatus) return false;
    return true;
  }), [questionAnalysis, questionDimension, questionStatus]);
  const filteredRows = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return (data?.submissions ?? []).filter((row) => {
      if (versionFilter === 'current' && row.assessmentVersion !== data?.currentAssessmentVersion) return false;
      if (versionFilter !== 'current' && versionFilter !== 'all' && row.assessmentVersion !== versionFilter) return false;
      if (statusFilter === 'included' && !row.includedInAnalysis) return false;
      if (statusFilter === 'excluded' && row.reviewDecision !== 'excluded') return false;
      if (statusFilter === 'sample_review' && row.reviewDecision !== 'needs_review') return false;
      if (statusFilter === 'duplicate' && !row.duplicateCandidate) return false;
      if (statusFilter === 'result' && !row.canSendResult) return false;
      if (statusFilter === 'marketing' && !row.canMarket) return false;
      if (!normalized) return true;
      const role = FACE_MAP[row.faceCode]?.name ?? '';
      return [row.email, row.emailMasked, row.faceCode, role, row.assessmentVersion].some((value) => value?.toLowerCase().includes(normalized));
    });
  }, [data, query, statusFilter, versionFilter]);

  const toggleEmail = (id: string) => setRevealedEmails((previous) => {
    const next = new Set(previous);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  const copyEmail = async (row: ResearchSubmission) => {
    if (!row.email) return;
    await navigator.clipboard.writeText(row.email);
    setCopyNotice(row.id);
    window.setTimeout(() => setCopyNotice(''), 1600);
  };

  const openReview = (row: ResearchSubmission) => {
    setReviewingId(row.id);
    setReviewDecision(row.reviewDecision);
    setReviewReason(row.exclusionReason ?? '');
    setReviewNotes(row.reviewNotes ?? '');
    setReviewError('');
  };

  const submitReview = async () => {
    if (!reviewingId) return;
    if (reviewDecision === 'excluded' && !reviewReason.trim()) {
      setReviewError('排除樣本時，請選擇或填寫原因。');
      return;
    }
    setReviewSaving(true);
    setReviewError('');
    try {
      await saveResearchReview({
        submissionId: reviewingId,
        decision: reviewDecision,
        exclusionReason: reviewDecision === 'excluded' ? reviewReason : undefined,
        notes: reviewNotes,
      });
      setReviewingId(null);
      await refresh();
    } catch (cause) {
      setReviewError(cause instanceof Error ? cause.message : '無法儲存審查結果。');
    } finally {
      setReviewSaving(false);
    }
  };

  const exportCsv = () => {
    const headers = ['提交時間', 'Email', '人格代碼', '人格名稱', '問卷版本', '答案數', '不適用題數', '資料完整', '樣本決策', '排除原因', '研究備註', '疑似重複', '可寄結果', '可行銷', ...SCORE_KEYS, '難以選擇', '感覺重複', '都不像我'];
    const lines = filteredRows.map((row) => [
      row.submittedAt, row.email ?? '', row.faceCode, FACE_MAP[row.faceCode]?.name ?? '', row.assessmentVersion,
      `${row.answerCount}/${row.expectedAnswerCount}`, row.notApplicableCount, row.researchReady ? '是' : '否', row.reviewDecision, row.exclusionReason ?? '', row.reviewNotes ?? '', row.duplicateCandidate ? '是' : '否', row.canSendResult ? '是' : '否', row.canMarket ? '是' : '否',
      ...SCORE_KEYS.map((key) => row.scores[key]), row.feedback.difficult ?? '', row.feedback.repetitive ?? '', row.feedback.neither ?? '',
    ]);
    const csv = [headers, ...lines].map((line) => line.map(csvCell).join(',')).join('\r\n');
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `face-research-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  if (loading && !data) return <div className="py-32 text-center text-sm tracking-widest text-[#746A61]">正在驗證研究資料…</div>;
  if (error && !data) return <div className="mx-auto max-w-xl border border-[#B98A83] bg-[#F8EFED] p-8 text-sm leading-7 text-[#75463F]"><span className="font-medium">無法開啟研究後台</span><br />{error}<br />請確認已使用管理者帳號登入。</div>;
  if (!data) return null;

  const versions = Object.keys(data.summary.byVersion);
  const currentReady = analysisRows.length;

  return <section className="pb-24">
    <div className="flex flex-col gap-5 border-b border-[#D1C8BC] pb-7 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-medium tracking-[0.22em] text-[#8C635B]">RESEARCH DATA · v1</p>
        <h1 className="serif mt-3 text-4xl text-[#2D2D2D] sm:text-5xl">研究資料後台</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6F655D]">以 24 題 v2.5 為主要研究樣本；舊版資料保留供版本比較，不混入本期統計。</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={exportCsv} className="inline-flex items-center gap-2 border border-[#BFB5A8] bg-white px-4 py-3 text-sm font-medium text-[#4A382D]"><Download size={16} />匯出目前篩選</button>
        <button type="button" onClick={() => void refresh()} disabled={loading} className="inline-flex items-center gap-2 border border-[#4A382D] bg-[#4A382D] px-4 py-3 text-sm font-medium text-white disabled:opacity-50"><RefreshCw size={16} className={loading ? 'animate-spin' : ''} />重新整理</button>
      </div>
    </div>

    {error && <div className="mt-5 border border-[#D9B7B0] bg-[#FAEFED] px-4 py-3 text-sm text-[#824F47]">重新整理失敗，畫面保留上一次資料：{error}</div>}

    <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
      <Stat label="全部回覆" value={data.summary.total} note="含歷史版本" icon={<Users size={20} />} />
      <Stat label="v2.5 回覆" value={data.summary.currentVersion} note="24 題正式研究版" icon={<BarChart3 size={20} />} />
      <Stat label="納入分析" value={data.summary.includedSamples} note="v2.5 有效樣本" icon={<FileCheck2 size={20} />} />
      <Stat label="排除樣本" value={data.summary.excludedSamples} note="人工或品質排除" icon={<ShieldCheck size={20} />} />
      <Stat label="待人工確認" value={data.summary.needsSampleReview} note="尚未作出決策" icon={<AlertTriangle size={20} />} />
      <Stat label="疑似重複" value={data.summary.duplicateCandidates} note="只提示，不自動排除" icon={<Flag size={20} />} />
      <Stat label="可寄結果" value={data.summary.canSendResult} note="同意且 Email 可用" icon={<Mail size={20} />} />
      <Stat label="可行銷" value={data.summary.canMarket} note="另有行銷同意" icon={<CheckCircle2 size={20} />} />
    </div>

    <nav className="mt-8 flex gap-1 overflow-x-auto border-b border-[#CFC6BA]" aria-label="研究後台分頁">
      {([
        ['overview', '研究總覽'], ['questions', '題目分析'], ['responses', '回覆名單'], ['feedback', `質性回饋 ${qualitativeRows.length}`],
      ] as Array<[AdminTab, string]>).map(([value, label]) => <button key={value} type="button" onClick={() => setTab(value)} className={`shrink-0 border-b-2 px-5 py-3 text-sm font-medium transition ${tab === value ? 'border-[#8C635B] text-[#5E4039]' : 'border-transparent text-[#746A61] hover:text-[#2D2D2D]'}`}>{label}</button>)}
    </nav>

    {tab === 'overview' && <div className="mt-7 space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="border border-[#D6CEC2] bg-white p-5 sm:p-7">
          <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs tracking-[0.15em] text-[#8C635B]">FACE AXIS</p><h2 className="serif mt-2 text-2xl">四個面向平均</h2></div><p className="text-xs text-[#857A70]">v2.5 納入樣本 n = {currentReady}</p></div>
          {currentReady > 0 ? <div className="mt-7 space-y-6">{AXES.map((axis) => <div key={axis.label}>
            <div className="flex items-baseline justify-between gap-4"><h3 className="text-sm font-medium">{axis.label}</h3><span className="text-xs text-[#82776F]">{axis.leftLabel} {axisAverages[axis.left]} / {axis.rightLabel} {axisAverages[axis.right]}</span></div>
            <div className="mt-2 flex h-2 overflow-hidden bg-[#EEE9E2]"><div className="bg-[#A97B70]" style={{ width: `${axisAverages[axis.left]}%` }} /><div className="bg-[#66767B]" style={{ width: `${axisAverages[axis.right]}%` }} /></div>
            <div className="mt-1.5 flex justify-between text-xs text-[#8A8077]"><span>{axis.left} {axis.leftLabel}</span><span>{axis.right} {axis.rightLabel}</span></div>
          </div>)}</div> : <p className="mt-8 text-sm leading-7 text-[#857A70]">尚無已確認納入分析的 v2.5 資料。</p>}
        </section>

        <section className="border border-[#D6CEC2] bg-white p-5 sm:p-7">
          <div className="flex items-end justify-between gap-3"><div><p className="text-xs tracking-[0.15em] text-[#8C635B]">16 TYPES</p><h2 className="serif mt-2 text-2xl">人格結果分布</h2></div><span className="text-xs text-[#857A70]">n = {currentReady}</span></div>
          {faceDistribution.length > 0 ? <div className="mt-6 grid gap-3 sm:grid-cols-2">{faceDistribution.map(({ code, count }) => {
            const percentage = currentReady > 0 ? Math.round((count / currentReady) * 100) : 0;
            return <div key={code} className="border border-[#E0D8CE] p-3"><div className="flex justify-between gap-3"><span className="text-sm"><span className="mr-2 text-xs text-[#9B7268]">{code}</span>{FACE_MAP[code]?.name ?? '未知類型'}</span><span className="text-sm tabular-nums">{count}</span></div><div className="mt-2 h-1 bg-[#EEE9E2]"><div className="h-full bg-[#8C635B]" style={{ width: `${percentage}%` }} /></div></div>;
          })}</div> : <p className="mt-8 text-sm text-[#857A70]">尚無資料</p>}
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <DistributionList title="交易經驗" items={distribution(analysisRows, 'experience')} denominator={currentReady} />
        <DistributionList title="交易頻率" items={distribution(analysisRows, 'frequency')} denominator={currentReady} />
        <DistributionList title="價格接受度" items={distribution(analysisRows, 'price')} denominator={currentReady} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <DistributionList title="目前最常遇到的困擾" items={distribution(analysisRows, 'challenge')} denominator={currentReady} />
        <DistributionList title="最想獲得的內容" items={distribution(analysisRows, 'interest')} denominator={currentReady} />
      </div>
      <p className="text-xs leading-6 text-[#7B7168]">本頁統計只採用「24 題 v2.5、通過資料品質檢查，且審查決策為納入分析」的樣本。疑似重複只會進入人工確認，不會自動刪除原始回覆。</p>
    </div>}

    {tab === 'questions' && <div className="mt-7 space-y-6">
      {!questionAnalysis ? <section className="border border-[#D6CEC2] bg-white px-6 py-14 text-center">
        <FlaskConical size={28} className="mx-auto text-[#9B7268]" />
        <h2 className="serif mt-4 text-2xl text-[#332E2A]">題目分析資料尚未連線</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#746A61]">前端框架已完成；更新 research-admin Edge Function 後，這裡會顯示 24 題分布、區辨度、四面向信度與兩階段情境一致性。</p>
      </section> : <>
        <section className="border border-[#CDBFB1] bg-[#F4EEE7] p-5 sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <FlaskConical size={24} className="mt-1 shrink-0 text-[#8C635B]" />
              <div><p className="text-xs font-medium tracking-[0.16em] text-[#8C635B]">ANALYSIS STAGE</p><h2 className="serif mt-2 text-2xl text-[#332E2A]">{ANALYSIS_STAGE_LABELS[questionAnalysis.stage]}</h2><p className="mt-2 text-sm leading-7 text-[#6F655D]">目前納入 n = {questionAnalysis.sampleSize}。n &lt; {questionAnalysis.minimumForItemReview} 時只描述分布，不判定題目好壞；達 n = {questionAnalysis.minimumForStableReview} 後才進入穩定性驗證。</p></div>
            </div>
            <div className="grid shrink-0 grid-cols-2 gap-px border border-[#CDBFB1] bg-[#CDBFB1] text-center">
              <div className="bg-white px-5 py-3"><span className="block text-xs text-[#82776F]">開始題目檢查</span><span className="serif mt-1 block text-2xl">n ≥ {questionAnalysis.minimumForItemReview}</span></div>
              <div className="bg-white px-5 py-3"><span className="block text-xs text-[#82776F]">穩定性驗證</span><span className="serif mt-1 block text-2xl">n ≥ {questionAnalysis.minimumForStableReview}</span></div>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3"><BarChart3 size={20} className="text-[#8C635B]" /><div><p className="text-xs tracking-[0.14em] text-[#8C635B]">DIMENSION CHECK</p><h2 className="serif mt-1 text-2xl">四面向整體檢查</h2></div></div>
          <div className="mt-4 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">{questionAnalysis.dimensions.map((dimension) => <article key={dimension.dimension} className="border border-[#D6CEC2] bg-white p-5">
            <h3 className="text-sm font-medium text-[#4F4741]">{DIMENSION_LABELS[dimension.dimension]}</h3>
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
              <div><dt className="text-xs text-[#887D74]">Cronbach α</dt><dd className="serif mt-1 text-2xl text-[#332E2A]">{dimension.cronbachAlpha ?? '—'}</dd><span className="text-[11px] text-[#998F86]">完整樣本 n={dimension.completeCaseCount}</span></div>
              <div><dt className="text-xs text-[#887D74]">自評方向一致</dt><dd className="serif mt-1 text-2xl text-[#332E2A]">{dimension.directionalAgreementPercentage === null ? '—' : `${dimension.directionalAgreementPercentage}%`}</dd><span className="text-[11px] text-[#998F86]">有效 n={dimension.directionalCalibrationCount}</span></div>
              <div className="col-span-2 border-t border-[#E4DDD4] pt-3"><dt className="text-xs text-[#887D74]">自評與測驗平均落差</dt><dd className="mt-1 text-sm text-[#4F4741]">{dimension.meanCalibrationGap === null ? '資料不足' : `${dimension.meanCalibrationGap} 分`} <span className="ml-1 text-xs text-[#998F86]">校準 n={dimension.calibrationCount}</span></dd></div>
            </dl>
          </article>)}</div>
        </section>

        <section>
          <div className="flex items-center gap-3"><ListChecks size={20} className="text-[#8C635B]" /><div><p className="text-xs tracking-[0.14em] text-[#8C635B]">TWO-STAGE SCENARIOS</p><h2 className="serif mt-1 text-2xl">兩階段情境一致性</h2></div></div>
          <p className="mt-2 text-sm leading-7 text-[#746A61]">同一情境的兩題都明確選向 A 或 B 時，檢查方向是否一致。它用來觀察壓力延續後是否轉向，不代表轉向就是錯誤。</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{questionAnalysis.scenarioGroups.map((group) => <article key={group.group} className="border border-[#D6CEC2] bg-white p-4">
            <div className="flex items-center justify-between gap-3"><span className="text-xs font-medium tracking-wider text-[#8C635B]">{group.group}</span><span className="serif text-2xl">{group.sameDirectionPercentage === null ? '—' : `${group.sameDirectionPercentage}%`}</span></div>
            <p className="mt-2 text-sm text-[#4F4741]">{DIMENSION_LABELS[group.dimension]}</p><p className="mt-1 text-xs text-[#8A8077]">明確作答 n={group.eligibleCount}</p>
          </article>)}</div>
        </section>

        <section>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs tracking-[0.14em] text-[#8C635B]">ITEM REVIEW</p><h2 className="serif mt-1 text-2xl">24 題逐題檢查</h2><p className="mt-2 text-sm leading-7 text-[#746A61]">分布與統計只負責指出「值得看哪一題」，修題仍需搭配難選、重複、都不像我的文字回饋。</p></div><span className="text-sm text-[#746A61]">顯示 {filteredQuestionAnalysis.length} 題</span></div>
          <div className="mt-4 grid gap-3 border border-[#D6CEC2] bg-white p-4 sm:grid-cols-2">
            <label><span className="mb-1.5 block text-xs text-[#746A61]">FACE 面向</span><select value={questionDimension} onChange={(event) => setQuestionDimension(event.target.value as QuestionDimensionFilter)} className="h-11 w-full border border-[#CFC6BA] bg-[#FCFBF8] px-3 text-sm"><option value="all">全部面向</option>{Object.entries(DIMENSION_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            <label><span className="mb-1.5 block text-xs text-[#746A61]">檢查狀態</span><select value={questionStatus} onChange={(event) => setQuestionStatus(event.target.value as QuestionStatusFilter)} className="h-11 w-full border border-[#CFC6BA] bg-[#FCFBF8] px-3 text-sm"><option value="all">全部狀態</option>{Object.entries(QUESTION_STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          </div>
          <div className="mt-4 grid gap-4 xl:grid-cols-2">{filteredQuestionAnalysis.map((item) => {
            const number = Number(item.code.slice(-2));
            const question = QUESTION_BY_CODE.get(item.code);
            return <article key={item.code} className="border border-[#D6CEC2] bg-white p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4"><div><div className="flex flex-wrap items-center gap-2"><span className="text-xs font-medium tracking-[0.14em] text-[#8C635B]">Q{number} · {DIMENSION_LABELS[item.dimension]}</span>{item.group && <span className="bg-[#F0ECE6] px-2 py-1 text-[11px] text-[#746A61]">{item.group}</span>}</div><h3 className="serif mt-2 text-xl text-[#332E2A]">{question?.title ?? item.code}</h3></div><QuestionStatusBadge status={item.status} /></div>
              {question && <><p className="mt-3 text-sm leading-7 text-[#5E554E]">{question.prompt}</p><div className="mt-3 grid gap-2 text-xs leading-5 sm:grid-cols-2"><div className="border-l-2 border-[#A97B70] bg-[#F8F3EF] px-3 py-2"><span className="mr-1 text-[#9B7268]">A</span>{question.optionA}</div><div className="border-l-2 border-[#66767B] bg-[#F1F4F4] px-3 py-2"><span className="mr-1 text-[#66767B]">B</span>{question.optionB}</div></div></>}
              <div className="mt-5">
                <div className="flex h-3 overflow-hidden bg-[#EEE9E2]" aria-label={`A ${item.sideAPercentage}%，中間 ${item.middlePercentage}%，B ${item.sideBPercentage}%`}><div className="bg-[#A97B70]" style={{ width: `${item.sideAPercentage}%` }} /><div className="bg-[#C9C2B8]" style={{ width: `${item.middlePercentage}%` }} /><div className="bg-[#66767B]" style={{ width: `${item.sideBPercentage}%` }} /></div>
                <div className="mt-2 flex flex-wrap justify-between gap-x-3 gap-y-1 text-xs tabular-nums text-[#746A61]"><span>A {item.sideAPercentage}%</span>{item.type === 'bipolar' && <span>中間 {item.middlePercentage}%</span>}<span>B {item.sideBPercentage}%</span><span>不適用 {item.notApplicablePercentage}%</span></div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[#E4DDD4] pt-4 text-xs"><div><span className="block text-[#8A8077]">修正後題目－總分相關</span><strong className="mt-1 block text-base font-medium text-[#3F3934]">{item.discrimination === null ? '—' : `r = ${item.discrimination}`}</strong><span className="text-[#998F86]">完整樣本 n={item.discriminationSampleSize}</span></div><div><span className="block text-[#8A8077]">A 向平均值</span><strong className="mt-1 block text-base font-medium text-[#3F3934]">{item.meanAValue ?? '—'} / 10</strong><span className="text-[#998F86]">有效 n={item.applicableCount}</span></div></div>
              {item.flags.length > 0 ? <ul className="mt-4 flex flex-wrap gap-2">{item.flags.map((flag) => <li key={flag} className="bg-[#F4E4E1] px-2.5 py-1 text-xs text-[#914D46]">{flag}</li>)}</ul> : <p className="mt-4 text-xs leading-6 text-[#7B7168]">{item.status === 'collecting' ? `樣本未達 ${questionAnalysis.minimumForItemReview}，暫不產生警示。` : '目前沒有觸發量化警示。'}</p>}
            </article>;
          })}</div>
          {filteredQuestionAnalysis.length === 0 && <div className="border border-t-0 border-[#D6CEC2] bg-white py-14 text-center text-sm text-[#857A70]">沒有符合篩選條件的題目。</div>}
        </section>
      </>}
    </div>}

    {tab === 'responses' && <div className="mt-7">
      <div className="grid gap-3 border border-[#D6CEC2] bg-white p-4 md:grid-cols-[minmax(220px,1fr)_220px_180px_auto]">
        <label className="relative"><span className="sr-only">搜尋</span><Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8178]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜尋 Email、代碼或動物" className="h-11 w-full border border-[#CFC6BA] bg-[#FCFBF8] pl-10 pr-3 text-sm outline-none focus:border-[#8C635B]" /></label>
        <label><span className="sr-only">問卷版本</span><select value={versionFilter} onChange={(event) => setVersionFilter(event.target.value)} className="h-11 w-full border border-[#CFC6BA] bg-[#FCFBF8] px-3 text-sm"><option value="current">目前 v2.5（24 題）</option><option value="all">全部版本</option>{versions.filter((version) => version !== data.currentAssessmentVersion).map((version) => <option key={version} value={version}>{version.includes('40q') ? '歷史 40 題版' : version}</option>)}</select></label>
        <label><span className="sr-only">資料狀態</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as StatusFilter)} className="h-11 w-full border border-[#CFC6BA] bg-[#FCFBF8] px-3 text-sm"><option value="all">全部狀態</option><option value="included">納入分析</option><option value="excluded">排除樣本</option><option value="sample_review">待人工確認</option><option value="duplicate">疑似重複</option><option value="result">可寄結果</option><option value="marketing">可行銷</option></select></label>
        <div className="flex items-center justify-end text-sm text-[#756B62]">顯示 {filteredRows.length} 筆</div>
      </div>

      {reviewingId && (() => {
        const row = data.submissions.find((item) => item.id === reviewingId);
        if (!row) return null;
        return <section className="mt-4 border border-[#A98A7B] bg-[#F8F3ED] p-5 sm:p-6" aria-label="樣本審查">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div><p className="text-xs font-medium tracking-[0.14em] text-[#8C635B]">SAMPLE REVIEW</p><h2 className="serif mt-2 text-2xl">審查 {FACE_MAP[row.faceCode]?.name ?? row.faceCode}</h2><p className="mt-2 text-sm text-[#746A61]">{formatDateTime(row.submittedAt)} · {row.answerCount}/{row.expectedAnswerCount} 題{row.duplicateCandidate ? ` · 同版本共 ${row.duplicateGroupSize} 筆回覆` : ''}</p></div>
            <button type="button" onClick={() => setReviewingId(null)} className="border border-[#CFC1B5] bg-white px-4 py-2 text-sm text-[#5E554E]">取消</button>
          </div>
          <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <fieldset><legend className="text-sm font-medium text-[#4F4741]">樣本決策</legend><div className="mt-3 grid gap-2 sm:grid-cols-3 lg:grid-cols-1">{([
              ['included', '納入分析', '資料會計入總覽統計'], ['needs_review', '待人工確認', '保留回覆，但暫不納入'], ['excluded', '排除樣本', '保留原始資料與排除原因'],
            ] as Array<[ResearchReviewDecision, string, string]>).map(([value, label, description]) => <label key={value} className={`cursor-pointer border p-3 ${reviewDecision === value ? 'border-[#8C635B] bg-white' : 'border-[#D8CEC3] bg-[#FBF8F4]'}`}><input type="radio" name="review-decision" value={value} checked={reviewDecision === value} onChange={() => { setReviewDecision(value); if (value !== 'excluded') setReviewReason(''); }} className="mr-2 accent-[#8C635B]" /><span className="text-sm font-medium">{label}</span><span className="mt-1 block pl-5 text-xs leading-5 text-[#7C7168]">{description}</span></label>)}</div></fieldset>
            <div className="space-y-4">
              {reviewDecision === 'excluded' && <label className="block"><span className="text-sm font-medium text-[#4F4741]">排除原因</span><select value={reviewReason} onChange={(event) => setReviewReason(event.target.value)} className="mt-2 h-11 w-full border border-[#CFC1B5] bg-white px-3 text-sm"><option value="">請選擇</option><option value="同一受試者重複填答">同一受試者重複填答</option><option value="資料完整性未通過">資料完整性未通過</option><option value="未同意研究使用">未同意研究使用</option><option value="內部測試資料">內部測試資料</option><option value="其他研究排除條件">其他研究排除條件</option></select></label>}
              <label className="block"><span className="text-sm font-medium text-[#4F4741]">研究備註</span><textarea value={reviewNotes} onChange={(event) => setReviewNotes(event.target.value.slice(0, 2000))} rows={4} placeholder="例如：保留最新一次填答；舊回覆僅供版本比較。" className="mt-2 w-full resize-y border border-[#CFC1B5] bg-white p-3 text-sm leading-6 outline-none focus:border-[#8C635B]" /><span className="mt-1 block text-right text-xs text-[#8A8077]">{reviewNotes.length}/2000</span></label>
              {reviewError && <p className="text-sm text-[#934F47]">{reviewError}</p>}
              <button type="button" onClick={() => void submitReview()} disabled={reviewSaving} className="inline-flex items-center gap-2 bg-[#4A382D] px-5 py-3 text-sm font-medium text-white disabled:opacity-50"><Save size={16} />{reviewSaving ? '儲存中…' : '儲存審查結果'}</button>
            </div>
          </div>
        </section>;
      })()}

      <div className="mt-4 space-y-3 lg:hidden">{filteredRows.map((row) => {
        const revealed = revealedEmails.has(row.id);
        return <article key={row.id} className="border border-[#D6CEC2] bg-white p-4">
          <div className="flex items-start justify-between gap-3"><div><p className="text-xs text-[#81766D]">{formatDateTime(row.submittedAt)}</p><h3 className="mt-1.5 text-lg">{FACE_MAP[row.faceCode]?.name ?? row.faceCode}<span className="ml-2 text-xs tracking-wider text-[#9B7268]">{row.faceCode}</span></h3></div><ReviewBadge decision={row.reviewDecision} /></div>
          {row.duplicateCandidate && <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-[#8B654D]"><Flag size={13} />疑似重複：同一受試者同版本共 {row.duplicateGroupSize} 筆</p>}
          <div className="mt-4 border-y border-[#E5DED5] py-3 text-sm"><div className="flex items-center justify-between gap-2"><span className="break-all">{revealed ? row.email ?? '未提供' : row.emailMasked ?? '未提供'}</span>{row.email && <span className="flex gap-1"><button type="button" aria-label={revealed ? '隱藏 Email' : '顯示 Email'} onClick={() => toggleEmail(row.id)} className="p-2 text-[#756B62]">{revealed ? <EyeOff size={16} /> : <Eye size={16} />}</button><button type="button" aria-label="複製 Email" onClick={() => void copyEmail(row)} className="p-2 text-[#756B62]"><ClipboardCopy size={16} /></button></span>}</div>{copyNotice === row.id && <p className="text-xs text-[#527257]">已複製</p>}</div>
          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs leading-5 text-[#655C55]"><span>答案 {row.answerCount}/{row.expectedAnswerCount}</span><span>不適用 {row.notApplicableCount}</span><span>寄結果 {row.canSendResult ? '是' : '否'}</span><span>行銷 {row.canMarket ? '是' : '否'}</span></div>
          {row.issues.length > 0 && <p className="mt-3 text-xs leading-5 text-[#8A5B54]">{row.issues.join('、')}</p>}
          {row.exclusionReason && <p className="mt-2 text-xs leading-5 text-[#8A5B54]">排除原因：{row.exclusionReason}</p>}
          <button type="button" onClick={() => openReview(row)} className="mt-4 w-full border border-[#A98A7B] bg-[#FCFAF7] px-4 py-2.5 text-sm font-medium text-[#5E4039]">審查這筆樣本</button>
        </article>;
      })}</div>

      <div className="mt-4 hidden overflow-x-auto border border-[#D6CEC2] bg-white lg:block">
        <table className="w-full min-w-[1280px] text-left text-sm">
          <thead className="bg-[#F1ECE5] text-xs font-medium tracking-wider text-[#665C54]"><tr>{['提交時間', 'Email', '答案', '結果', '四面向分數', '資料品質', '樣本審查', '聯絡資格'].map((name) => <th key={name} className="px-4 py-4">{name}</th>)}</tr></thead>
          <tbody>{filteredRows.map((row) => {
            const revealed = revealedEmails.has(row.id);
            return <tr key={row.id} className="border-t border-[#E2DBD1] align-top">
              <td className="whitespace-nowrap px-4 py-5 text-xs text-[#6F655D]">{formatDateTime(row.submittedAt)}<div className="mt-1 text-[11px] text-[#9A9086]">{row.assessmentVersion === data.currentAssessmentVersion ? 'v2.5 · 24 題' : '歷史版本'}</div></td>
              <td className="max-w-[230px] px-4 py-5"><div className="flex items-center gap-1"><span className="min-w-0 break-all">{revealed ? row.email ?? '未提供' : row.emailMasked ?? '未提供'}</span>{row.email && <><button type="button" aria-label={revealed ? '隱藏 Email' : '顯示 Email'} onClick={() => toggleEmail(row.id)} className="shrink-0 p-1.5 text-[#756B62]">{revealed ? <EyeOff size={15} /> : <Eye size={15} />}</button><button type="button" aria-label="複製 Email" onClick={() => void copyEmail(row)} className="shrink-0 p-1.5 text-[#756B62]"><ClipboardCopy size={15} /></button></>}</div><div className={`mt-1 text-xs ${row.emailUsable ? 'text-[#527257]' : 'text-[#A35D55]'}`}>{copyNotice === row.id ? '已複製' : row.emailUsable ? '格式可用' : '不可寄送'}</div></td>
              <td className="px-4 py-5"><span className="font-medium">{row.answerCount}/{row.expectedAnswerCount}</span><div className="mt-1 text-xs text-[#756B62]">不適用 {row.notApplicableCount} 題</div><div className={`mt-1 text-xs ${row.calibrationComplete ? 'text-[#527257]' : 'text-[#8B7664]'}`}>校準題：{row.calibrationComplete ? '完整' : '舊版／未填'}</div></td>
              <td className="px-4 py-5"><span className="font-medium tracking-widest">{row.faceCode}</span><div className="mt-1 text-xs text-[#6F655D]">{FACE_MAP[row.faceCode]?.name ?? '未知類型'}</div></td>
              <td className="px-4 py-5 text-xs leading-6 text-[#5F5650]">A {row.scores.A} / P {row.scores.P}<br />R {row.scores.R} / I {row.scores.I}<br />L {row.scores.L} / T {row.scores.T}<br />C {row.scores.C} / D {row.scores.D}</td>
              <td className="px-4 py-5"><StatusBadge row={row} />{row.issues.length > 0 && <div className="mt-2 max-w-[220px] text-xs leading-5 text-[#8A5B54]">{row.issues.join('、')}</div>}</td>
              <td className="px-4 py-5"><ReviewBadge decision={row.reviewDecision} />{row.duplicateCandidate && <div className="mt-2 flex max-w-[190px] items-start gap-1.5 text-xs leading-5 text-[#8B654D]"><Flag size={13} className="mt-0.5 shrink-0" />同一受試者同版本共 {row.duplicateGroupSize} 筆</div>}{row.exclusionReason && <div className="mt-2 max-w-[190px] text-xs leading-5 text-[#8A5B54]">{row.exclusionReason}</div>}<button type="button" onClick={() => openReview(row)} className="mt-3 border-b border-[#8C635B] pb-0.5 text-xs font-medium text-[#6C4A43]">編輯審查</button></td>
              <td className="px-4 py-5 text-xs leading-6"><div>結果：{row.canSendResult ? '可寄' : '不可寄'}</div><div>行銷：{row.canMarket ? '可寄' : '不可寄'}</div><div>已退訂：{row.unsubscribed ? '是' : '否'}</div></td>
            </tr>;
          })}</tbody>
        </table>
      </div>
      {filteredRows.length === 0 && <div className="border-x border-b border-[#D6CEC2] bg-white py-16 text-center text-sm text-[#857A70]">沒有符合條件的回覆。</div>}
      <p className="mt-4 text-xs leading-6 text-[#7B7168]">Email 預設遮罩，只在管理者主動展開或匯出時顯示。請依受試者的結果寄送與行銷同意分開使用。</p>
    </div>}

    {tab === 'feedback' && <div className="mt-7">
      <div className="mb-5 flex items-center gap-3"><MessageSquareText size={20} className="text-[#8C635B]" /><p className="text-sm text-[#6F655D]">v2.5 中填寫「難選、重複、都不像我」的原始文字，共 {qualitativeRows.length} 筆。</p></div>
      {qualitativeRows.length > 0 ? <div className="grid gap-4 xl:grid-cols-2">{qualitativeRows.map((row) => <article key={row.id} className="border border-[#D6CEC2] bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#E2DBD1] pb-4"><div><p className="text-xs text-[#81766D]">{formatDateTime(row.submittedAt)}</p><h2 className="mt-1 text-lg">{FACE_MAP[row.faceCode]?.name ?? row.faceCode}<span className="ml-2 text-xs tracking-wider text-[#9B7268]">{row.faceCode}</span></h2></div><StatusBadge row={row} /></div>
        <dl className="mt-5 space-y-5">{[
          ['difficult', '哪些題目難以選擇？'], ['repetitive', '哪些題目感覺重複？'], ['neither', '哪些選項都不像你？'],
        ].map(([key, label]) => row.feedback[key]?.trim() ? <div key={key}><dt className="text-xs font-medium tracking-wider text-[#9B7268]">{label}</dt><dd className="mt-1.5 whitespace-pre-wrap text-sm leading-7 text-[#4F4741]">{row.feedback[key]}</dd></div> : null)}</dl>
      </article>)}</div> : <div className="border border-[#D6CEC2] bg-white py-16 text-center text-sm text-[#857A70]">目前沒有質性回饋。</div>}
    </div>}

    <footer className="mt-10 border-t border-[#D1C8BC] pt-5 text-xs leading-6 text-[#7B7168]">資料更新時間：{formatDateTime(data.generatedAt)}。資料品質與樣本審查分開處理：前者檢查研究同意、24 題完整性、分數與人格代碼；後者決定是否納入統計。原始問卷與排除紀錄都會保留。行銷資格另需 Email 可用、明確同意行銷且尚未退訂。</footer>
  </section>;
};
