import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Crosshair, Gauge, Link2, PauseCircle, Pencil, Save, Shield, Zap, type LucideIcon } from 'lucide-react';
import { FACE_MAP, getFaceCode } from '../constants';
import { getMemberAssessmentHistory, type MemberAssessmentRecord } from '../services/memberAssessmentHistory';
import { getMemberAwarenessJournal, saveMemberDiaryEntry, saveMemberNickname } from '../services/memberAwarenessJournal';
import { getDailyAwarenessState, type DailyAwarenessStateCode } from '../data/dailyAwarenessPreview';
import type { DailyAwarenessResult, DailyAwarenessStatusCode } from '../data/dailyAwarenessPreview';
import type { DailyAwarenessAnswers } from '../data/dailyAwarenessQuestions';
import type { AuthUser, FaceScores } from '../types';

interface MemberHomeProps {
  user: AuthUser;
  dna: FaceScores | null;
  onViewResult: (code: string) => void;
  onStartTest: () => void;
  onStartAwareness: () => void;
  onOpenContent: () => void;
  onNicknameChange: (nickname: string) => void;
  hasSurvivalKitAccess: boolean;
}

type CalendarMode = 'week' | 'month';
type LocalDiary = Record<string, string>;
type AwarenessByDate = Record<string, { stateCode: DailyAwarenessStateCode; answers: DailyAwarenessAnswers | null; result: DailyAwarenessResult | null }>;

const AWARENESS_ICON: Record<DailyAwarenessStateCode, { icon: LucideIcon; tone: string; soft: string }> = {
  steady: { icon: Gauge, tone: '#56705A', soft: '#E5EEE5' },
  watching: { icon: Crosshair, tone: '#667784', soft: '#E5EAED' },
  chasing: { icon: Zap, tone: '#A06050', soft: '#F2E4DF' },
  attached: { icon: Link2, tone: '#8C635B', soft: '#EFE3DF' },
  guarded: { icon: Shield, tone: '#746A57', soft: '#ECE9DF' },
  resetting: { icon: PauseCircle, tone: '#706784', soft: '#EAE7F0' },
};

const RESULT_STATUS_ICON: Record<DailyAwarenessStatusCode, { icon: LucideIcon; label: string; tone: string; soft: string }> = {
  stable: { icon: Gauge, label: '穩定', tone: '#56705A', soft: '#E5EEE5' },
  fluctuating: { icon: Crosshair, label: '有波動', tone: '#667784', soft: '#E5EAED' },
  conflicted: { icon: Link2, label: '拉扯', tone: '#9A725A', soft: '#F1E7E0' },
  deviated: { icon: Zap, label: '偏離', tone: '#A06050', soft: '#F2E4DF' },
  pause_needed: { icon: PauseCircle, label: '需要暫停', tone: '#8C4E4B', soft: '#F2DFDE' },
  not_observed: { icon: Shield, label: '尚未觀察', tone: '#70665D', soft: '#ECE9E4' },
};

const AwarenessIcon: React.FC<{ code: DailyAwarenessStateCode; active?: boolean; size?: number }> = ({ code, active = false, size = 16 }) => {
  const config = AWARENESS_ICON[code];
  const Icon = config.icon;
  return <span className="inline-grid shrink-0 place-items-center rounded-full" style={{ width: size + 12, height: size + 12, color: active ? '#8C635B' : config.tone, backgroundColor: active ? '#FFFFFF' : config.soft }} aria-hidden="true"><Icon size={size} strokeWidth={1.9} /></span>;
};

const ResultStatusIcon: React.FC<{ code: DailyAwarenessStatusCode; active?: boolean; size?: number }> = ({ code, active = false, size = 16 }) => {
  const config = RESULT_STATUS_ICON[code];
  const Icon = config.icon;
  return <span className="inline-grid shrink-0 place-items-center rounded-full" style={{ width: size + 12, height: size + 12, color: active ? '#8C635B' : config.tone, backgroundColor: active ? '#FFFFFF' : config.soft }} aria-hidden="true"><Icon size={size} strokeWidth={1.9} /></span>;
};

const dateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const startOfWeek = (date: Date) => {
  const next = new Date(date);
  const day = next.getDay() || 7;
  next.setDate(next.getDate() - day + 1);
  next.setHours(0, 0, 0, 0);
  return next;
};

const addDays = (date: Date, amount: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
};

const formatLongDate = (date: Date) => new Intl.DateTimeFormat('zh-TW', {
  year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
}).format(date);

const formatRecordDate = (value: string) => new Intl.DateTimeFormat('zh-TW', {
  year: 'numeric', month: 'long', day: 'numeric',
}).format(new Date(value));

export const MemberHome: React.FC<MemberHomeProps> = ({ user, dna, onViewResult, onStartTest, onStartAwareness, onOpenContent, onNicknameChange, hasSurvivalKitAccess }) => {
  const diaryStorageKey = `face-awareness-diary-v1:${user.id}`;
  const nicknameStorageKey = `face-member-nickname-v1:${user.id}`;
  const [records, setRecords] = useState<MemberAssessmentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [mode, setMode] = useState<CalendarMode>('week');
  const [cursorDate, setCursorDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [diary, setDiary] = useState<LocalDiary>(() => {
    try { return JSON.parse(localStorage.getItem(diaryStorageKey) ?? '{}') as LocalDiary; }
    catch { return {}; }
  });
  const [awareness, setAwareness] = useState<AwarenessByDate>({});
  const [draft, setDraft] = useState('');
  const [savedNotice, setSavedNotice] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [syncError, setSyncError] = useState(false);
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [nickname, setNickname] = useState(() => localStorage.getItem(nicknameStorageKey) ?? user.name);
  const [nicknameDraft, setNicknameDraft] = useState(() => localStorage.getItem(nicknameStorageKey) ?? user.name);

  useEffect(() => {
    let active = true;
    void getMemberAssessmentHistory()
      .then((history) => { if (active) setRecords(history); })
      .catch((error) => { console.warn('Unable to load member assessment history', error); if (active) setLoadError(true); })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    void getMemberAwarenessJournal()
      .then(async (remoteJournal) => {
        if (!active) return;
        const localEntries = (() => {
          try { return JSON.parse(localStorage.getItem(diaryStorageKey) ?? '{}') as LocalDiary; }
          catch { return {}; }
        })();
        const mergedEntries = { ...localEntries, ...remoteJournal.entries };
        setDiary(mergedEntries);
        setAwareness(remoteJournal.awareness);
        localStorage.setItem(diaryStorageKey, JSON.stringify(mergedEntries));
        if (remoteJournal.nickname) {
          setNickname(remoteJournal.nickname);
          setNicknameDraft(remoteJournal.nickname);
          localStorage.setItem(nicknameStorageKey, remoteJournal.nickname);
          onNicknameChange(remoteJournal.nickname);
        }
        const missingRemoteEntries = Object.entries(localEntries).filter(([key]) => !(key in remoteJournal.entries));
        await Promise.all(missingRemoteEntries.map(([key, content]) => saveMemberDiaryEntry(key, content)));
      })
      .catch((error) => {
        console.warn('Unable to sync member awareness journal', error);
        if (active) setSyncError(true);
      });
    return () => { active = false; };
  }, [diaryStorageKey, nicknameStorageKey]);

  useEffect(() => {
    setDraft(diary[dateKey(selectedDate)] ?? '');
    setSavedNotice(false);
  }, [selectedDate, diary]);

  const todayKey = dateKey(new Date());
  const todayAwareness = awareness[todayKey];
  const todayState = todayAwareness ? getDailyAwarenessState(todayAwareness.stateCode) : null;
  const todayResult = todayAwareness?.result ?? null;
  // The journal belongs to the signed-in member. Prefer their latest saved
  // baseline, then the animal stored with today's awareness result.
  const currentCode = records[0]?.code ?? todayResult?.faceCode ?? (dna ? getFaceCode(dna) : null);
  const currentRole = currentCode ? FACE_MAP[currentCode] : null;
  const todayReflection = todayResult?.reflectionText ?? todayResult?.inferredMindset ?? todayResult?.summary;
  const selectedAwareness = awareness[dateKey(selectedDate)];
  const selectedState = selectedAwareness ? getDailyAwarenessState(selectedAwareness.stateCode) : null;
  const selectedResult = selectedAwareness?.result ?? null;
  const awarenessHeadline = (headline: string) => currentRole
    ? headline.replace(/^獵豹狙擊手/, currentRole.name)
    : headline;
  const displayedRecords = useMemo(() => records.slice(0, 5), [records]);
  const visibleDates = useMemo(() => {
    if (mode === 'week') {
      const first = startOfWeek(cursorDate);
      return Array.from({ length: 7 }, (_, index) => addDays(first, index));
    }
    const firstOfMonth = new Date(cursorDate.getFullYear(), cursorDate.getMonth(), 1);
    const first = startOfWeek(firstOfMonth);
    return Array.from({ length: 42 }, (_, index) => addDays(first, index));
  }, [cursorDate, mode]);
  const calendarTitle = mode === 'week'
    ? `${new Intl.DateTimeFormat('zh-TW', { month: 'long', day: 'numeric' }).format(visibleDates[0])}－${new Intl.DateTimeFormat('zh-TW', { month: 'long', day: 'numeric' }).format(visibleDates[6])}`
    : new Intl.DateTimeFormat('zh-TW', { year: 'numeric', month: 'long' }).format(cursorDate);

  const moveCalendar = (direction: -1 | 1) => {
    const next = new Date(cursorDate);
    if (mode === 'week') next.setDate(next.getDate() + direction * 7);
    else next.setMonth(next.getMonth() + direction, 1);
    setCursorDate(next);
  };

  const saveDiary = async () => {
    const key = dateKey(selectedDate);
    const normalizedContent = draft.trim();
    const next = { ...diary, [key]: normalizedContent };
    if (!next[key]) delete next[key];
    setDiary(next);
    localStorage.setItem(diaryStorageKey, JSON.stringify(next));
    setIsSaving(true);
    setSyncError(false);
    try {
      await saveMemberDiaryEntry(key, normalizedContent);
      setSavedNotice(true);
    } catch (error) {
      console.warn('Unable to save member diary entry', error);
      setSyncError(true);
    } finally {
      setIsSaving(false);
    }
  };

  const saveNickname = async () => {
    const normalizedNickname = nicknameDraft.trim().slice(0, 30);
    if (!normalizedNickname) return;
    localStorage.setItem(nicknameStorageKey, normalizedNickname);
    setNickname(normalizedNickname);
    onNicknameChange(normalizedNickname);
    setIsEditingNickname(false);
    setSyncError(false);
    try {
      await saveMemberNickname(normalizedNickname);
    } catch (error) {
      console.warn('Unable to save member nickname', error);
      setSyncError(true);
    }
  };

  return <section className="mx-auto max-w-6xl pb-28 pt-2 fade-in md:pt-8">
    <div className="flex gap-px overflow-x-auto border border-[#D1D1C7] bg-[#D1D1C7] hide-scrollbar" aria-label="我的 FACE 功能">
      <button type="button" className="shrink-0 bg-[#4A382D] px-5 py-4 text-sm font-bold text-white md:flex-1">FACE 自我覺察日記</button>
      {['交易計畫卡', '風險報酬計算器', '事件交易日曆'].map((tool) => <button key={tool} type="button" disabled className="shrink-0 cursor-not-allowed bg-[#F3EFE9] px-5 py-4 text-sm font-bold text-[#8C7E6D] md:flex-1" aria-label={`${tool}，${hasSurvivalKitAccess ? '已解鎖、功能建置中' : '付費方案解鎖'}`}>{tool}<span className="ml-2 text-[10px]">{hasSurvivalKitAccess ? '已解鎖 · 建置中' : '付費解鎖'}</span></button>)}
    </div>

    <div className="mt-8 overflow-hidden border border-[#CFC6B8] bg-[#F7F2EB]">
      <div className="grid md:grid-cols-[0.8fr_1.2fr]">
        <div className="relative min-h-[20rem] overflow-hidden bg-white md:min-h-[30rem]">
          {currentRole ? <img src={currentRole.landscapeImageUrl} alt={currentRole.name} className="absolute inset-0 h-full w-full object-cover mix-blend-multiply" /> : <div className="grid h-full place-items-center text-sm text-[#8C7E6D]">完成 24 題後顯示你的動物</div>}
          <div className="absolute inset-0 bg-gradient-to-t from-[#2D2D2D]/55 via-transparent to-transparent" />
          {currentRole && <div className="absolute inset-x-0 bottom-0 p-6 text-white"><p className="text-xs font-bold tracking-[0.16em] text-white/65">固定交易人格 · {currentCode}</p><h2 className="mt-2 serif text-3xl">{currentRole.name}</h2></div>}
        </div>
        <div className="flex flex-col justify-center px-7 py-10 md:px-12 md:py-14">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-bold tracking-[0.2em] text-[#8C635B]">TODAY'S AWARENESS · PRIVATE</p>
            {isEditingNickname ? <div className="flex max-w-xs gap-2"><label className="sr-only" htmlFor="member-nickname">暱稱</label><input id="member-nickname" value={nicknameDraft} maxLength={30} onChange={(event) => setNicknameDraft(event.target.value)} className="min-w-0 flex-1 border border-[#8C635B] bg-white px-3 py-2 text-sm font-bold text-[#2D2D2D]" /><button type="button" onClick={saveNickname} className="bg-[#4A382D] px-3 text-xs font-bold text-white">儲存</button></div> : <button type="button" onClick={() => { setNicknameDraft(nickname); setIsEditingNickname(true); }} className="inline-flex items-center gap-1 border-b border-[#8C7E6D] pb-1 text-xs font-bold text-[#70665D]"><Pencil size={13} />{nickname}</button>}
          </div>
          <h1 className="mt-5 serif text-4xl leading-[1.45] text-[#2D2D2D] md:text-5xl">{nickname} 的自我覺察日記</h1>
          {todayState ? <>
            <div className="mt-6 max-w-2xl border-y border-[#D8CDBD] py-6">
              <p className="text-[13px] font-normal leading-[1.7] tracking-[0.16em] text-[#8C635B]">當日覺察結果{currentRole ? ` · ${currentRole.name}` : ''}</p>
              <p className="mt-4 serif text-[1.45rem] font-normal leading-[1.9] text-[#352E2A] md:text-[1.7rem]">{todayReflection ?? todayState.summary}</p>
            </div>
            <div className="mt-6 border-l-2 border-[#8C635B] pl-5"><p className="text-xs font-bold tracking-[0.12em] text-[#8C635B]">今日一問</p><p className="mt-2 text-base font-bold leading-7 text-[#2D2D2D]">{todayResult?.reflectionQuestion ?? todayState.reminder}</p></div>
          </> : <>
            <h2 className="mt-5 serif text-3xl leading-[1.5] text-[#2D2D2D] md:text-4xl">你還沒開啟今日覺察</h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-[#5F574F]">開始今日的自我覺察，並留下你對盤勢的看法吧。</p>
          </>}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row"><button type="button" onClick={onStartAwareness} className="bg-[#8C635B] px-7 py-4 text-sm font-bold text-white transition hover:bg-[#754F48]">{todayState ? '更新今日的自我覺察' : '開始今日的自我覺察'}</button><button type="button" onClick={currentCode ? () => onViewResult(currentCode) : onStartTest} className="border border-[#4A382D] bg-white px-7 py-4 text-sm font-bold text-[#2D2D2D]">{currentCode ? '查看我的動物圖鑑' : '先完成 24 題測驗'}</button></div>
        </div>
      </div>
    </div>

    <section className="mt-8 border border-[#CFC6B8] bg-white">
      <header className="flex flex-col gap-5 border-b border-[#D1D1C7] p-5 sm:flex-row sm:items-center sm:justify-between md:px-8">
        <div><p className="text-[11px] font-bold tracking-[0.2em] text-[#8C635B]">AWARENESS CALENDAR</p><h2 className="mt-2 serif text-3xl text-[#2D2D2D]">我的日記本</h2></div>
        <div className="flex border border-[#D1D1C7]" role="group" aria-label="日記顯示模式"><button type="button" onClick={() => setMode('week')} aria-pressed={mode === 'week'} className={`px-5 py-2 text-sm font-bold ${mode === 'week' ? 'bg-[#4A382D] text-white' : 'bg-white text-[#70665D]'}`}>週</button><button type="button" onClick={() => setMode('month')} aria-pressed={mode === 'month'} className={`border-l border-[#D1D1C7] px-5 py-2 text-sm font-bold ${mode === 'month' ? 'bg-[#4A382D] text-white' : 'bg-white text-[#70665D]'}`}>月</button></div>
      </header>

      <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
        <div className="border-b border-[#D1D1C7] p-5 md:p-8 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between gap-3"><button type="button" onClick={() => moveCalendar(-1)} aria-label={mode === 'week' ? '上一週' : '上個月'} className="border border-[#D1D1C7] p-2 text-[#70665D]"><ChevronLeft size={18} /></button><p className="font-bold text-[#2D2D2D]">{calendarTitle}</p><button type="button" onClick={() => moveCalendar(1)} aria-label={mode === 'week' ? '下一週' : '下個月'} className="border border-[#D1D1C7] p-2 text-[#70665D]"><ChevronRight size={18} /></button></div>
          <div className="mt-5 grid grid-cols-7 text-center text-[11px] font-bold text-[#8C7E6D]">{['一','二','三','四','五','六','日'].map((day) => <span key={day} className="py-2">{day}</span>)}</div>
          <div className="grid grid-cols-7 gap-px bg-[#D1D1C7]">
            {visibleDates.map((date) => {
              const key = dateKey(date); const active = key === dateKey(selectedDate); const hasEntry = Boolean(diary[key] || awareness[key]); const outsideMonth = mode === 'month' && date.getMonth() !== cursorDate.getMonth();
              const dailyState = awareness[key] ? getDailyAwarenessState(awareness[key].stateCode) : null;
              const dailyResult = awareness[key]?.result ?? null;
              const stateLabel = dailyResult ? dailyResult.statusLabel : dailyState?.shortName;
              return <button key={key} type="button" onClick={() => setSelectedDate(date)} aria-label={`${formatLongDate(date)}${stateLabel ? `，覺察狀態：${stateLabel}` : hasEntry ? '，已有日記' : ''}`} className={`relative flex min-h-[4.75rem] flex-col items-center gap-1 bg-white p-2 text-sm transition md:min-h-[5.25rem] ${active ? 'font-bold text-white !bg-[#8C635B]' : outsideMonth ? 'text-[#B8B0A8]' : 'text-[#2D2D2D] hover:bg-[#F3EFE9]'}`}><span>{date.getDate()}</span>{dailyResult ? <ResultStatusIcon code={dailyResult.statusCode} active={active} /> : dailyState ? <AwarenessIcon code={dailyState.code} active={active} /> : hasEntry ? <span className={`mt-auto h-1.5 w-1.5 rounded-full ${active ? 'bg-white' : 'bg-[#8C635B]'}`} /> : null}</button>;
            })}
          </div>
          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-3" aria-label="覺察狀態圖例">{(['stable', 'fluctuating', 'conflicted', 'deviated', 'pause_needed'] as DailyAwarenessStatusCode[]).map((code) => { const status = RESULT_STATUS_ICON[code]; return <span key={code} className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#70665D]"><ResultStatusIcon code={code} size={13} />{status.label}</span>; })}</div>
          <button type="button" onClick={() => { const today = new Date(); setCursorDate(today); setSelectedDate(today); }} className="mt-5 text-xs font-bold text-[#8C635B]">回到今天</button>
        </div>

        <div className="p-5 md:p-8">
          <p className="text-xs font-bold tracking-[0.12em] text-[#8C635B]">{formatLongDate(selectedDate)}</p>
          {selectedState && <div className="mt-4 border border-[#D1D1C7] bg-[#F7F2EB] p-5"><p className="text-[10px] font-bold tracking-[0.16em] text-[#8C635B]">當日覺察結果</p><h3 className="mt-2 serif text-2xl leading-9 text-[#2D2D2D]">{selectedResult ? `${selectedResult.statusLabel} · ${selectedResult.patternLabel}` : awarenessHeadline(selectedState.headline)}</h3><p className="mt-3 text-sm leading-7 text-[#70665D]">{selectedResult?.summary ?? selectedState.summary}</p>{selectedResult && <p className="mt-3 border-t border-[#D8CDBD] pt-3 text-xs leading-6 text-[#8C7E6D]">可能的預期心態：{selectedResult.inferredMindset}</p>}</div>}
          <h3 className="mt-3 serif text-2xl text-[#2D2D2D]">今天想替自己記下什麼？</h3>
          <label className="sr-only" htmlFor="daily-journal-entry">每日自我覺察日記</label>
          <textarea id="daily-journal-entry" value={draft} maxLength={1000} onChange={(event) => { setDraft(event.target.value); setSavedNotice(false); }} placeholder="可以記錄今天的情緒波動、交易念頭、做得好的地方，或明天想提醒自己的事……" className="mt-5 min-h-64 w-full resize-y border border-[#D1D1C7] bg-[#FCFBF8] p-5 text-base leading-8 text-[#2D2D2D] outline-none transition placeholder:text-[#A69D93] focus:border-[#8C635B]" />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3"><p className={`text-xs ${draft.length >= 950 ? 'font-bold text-[#A64D4D]' : 'text-[#8C7E6D]'}`}>{draft.length} / 1000 字</p><div className="flex items-center gap-3">{savedNotice && !syncError && <span className="text-xs font-bold text-[#56705A]">已同步，每天僅保留一篇日記</span>}{syncError && <span className="text-xs font-bold text-[#A64D4D]">暫存於此裝置，連線恢復後再同步</span>}<button type="button" disabled={isSaving} onClick={saveDiary} className="inline-flex items-center gap-2 bg-[#4A382D] px-6 py-3 text-sm font-bold text-white disabled:opacity-50"><Save size={15} />{isSaving ? '同步中…' : '保存日記'}</button></div></div>
        </div>
      </div>
    </section>

    <div className="mt-8 grid gap-5 md:grid-cols-[1.25fr_.75fr]">
      <article className="border border-[#D1D1C7] bg-white p-7 md:p-9"><p className="text-[11px] font-bold tracking-[0.2em] text-[#8C635B]">RECENT FACE RECORDS</p><h2 className="mt-4 serif text-3xl text-[#2D2D2D]">最近紀錄</h2><div className="mt-5 min-h-20 text-sm leading-8 text-[#70665D]">{isLoading ? '正在讀取你的紀錄…' : loadError ? '目前無法讀取紀錄，請稍後再試。' : displayedRecords.length ? displayedRecords.map((record) => <p key={record.id}>{formatRecordDate(record.completedAt)} · {record.code}</p>) : '完成第一次每日覺察後，會從這裡開始累積。'}</div></article>
      <article className="border border-[#D1D1C7] bg-[#F3EFE9] p-7 md:p-9"><p className="text-[11px] font-bold tracking-[0.2em] text-[#8C635B]">交易解憂 BAR</p><h2 className="mt-4 serif text-2xl text-[#2D2D2D]">還在觀望付費方案？</h2><p className="mt-4 text-sm leading-7 text-[#70665D]">先從文章與頻道繼續理解情緒、策略與清醒交易。</p><button type="button" onClick={onOpenContent} className="mt-7 border-b border-[#2D2D2D] pb-1 text-sm font-bold text-[#2D2D2D]">前往文章與頻道 →</button></article>
    </div>
  </section>;
};
