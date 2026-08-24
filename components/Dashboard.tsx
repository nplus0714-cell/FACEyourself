import React, { useEffect, useState, useMemo } from 'react';
import { FaceScores, ReportContent, AuthUser, DiaryEntry, Language, FaceDimension, FaceTrait } from '../types';
import { FACE_MAP, getFaceCode } from '../constants';
import { generateDynamicReport } from '../services/geminiService';
import { ShareModal } from './ShareModal';
import { ReadingLayerPrototype } from './ReadingLayerPrototype';
import { BookOpen, Compass, FileText, MessageCircle, PlayCircle, RotateCcw, Share2 } from 'lucide-react';
import { translations } from '../i18n';

interface DashboardProps {
  dna: FaceScores;
  daily?: FaceScores;
  history?: DiaryEntry[];
  staticReport?: ReportContent;
  onSave?: (report: ReportContent, timestamp: string) => void;
  user: AuthUser | null;
  onLoginRequest: () => void;
  onGoToGallery?: () => void;
  onGoToMirrorTrade?: () => void;
  onOpenContent?: () => void;
  onOpenPricing?: () => void;
  onOpenCoach?: () => void;
  onOpenMemberHome?: () => void;
  onOpenCompatibility?: () => void;
  onOpenDeepDive?: (code: string) => void;
  onStartAwareness?: () => void;
  onRetest?: () => void;
  isSharedView?: boolean;
  language: Language;
}

const calcRatio = (v1: number, v2: number) => {
  const total = v1 + v2;
  return total === 0 ? 50 : Math.round((v1 / total) * 100);
};

export const Dashboard: React.FC<DashboardProps> = ({ dna, daily, staticReport, onSave, user, onLoginRequest, onGoToGallery, onGoToMirrorTrade, onOpenContent, onOpenPricing, onOpenCoach, onOpenMemberHome, onOpenCompatibility, onOpenDeepDive, onRetest, isSharedView, language }) => {
  const code = getFaceCode(dna);
  const profile = FACE_MAP[code] || FACE_MAP['ARLC'];
  const [report, setReport] = useState<ReportContent | null>(staticReport || null);
  const [loading, setLoading] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const t = translations[language];

  useEffect(() => {
    if (staticReport) { setReport(staticReport); return; }
    if (daily) {
      setLoading(true);
      generateDynamicReport(dna, daily, profile).then(res => {
        if (res) setReport(res);
        setLoading(false);
      });
    }
  }, [daily, dna, profile, staticReport]);

  const radarData = useMemo(() => [
    { subject: '積極 A', base: dna.A, current: daily?.A ?? dna.A },
    { subject: '理性 R', base: dna.R, current: daily?.R ?? dna.R },
    { subject: '長期 L', base: dna.L, current: daily?.L ?? dna.L },
    { subject: '集中 C', base: dna.C, current: daily?.C ?? dna.C },
    { subject: '保守 P', base: dna.P, current: daily?.P ?? dna.P },
    { subject: '感性 I', base: dna.I, current: daily?.I ?? dna.I },
    { subject: '交易 T', base: dna.T, current: daily?.T ?? dna.T },
    { subject: '分散 D', base: dna.D, current: daily?.D ?? dna.D },
  ], [dna, daily]);

  const faceData = useMemo(() => {
    const scores = daily || dna;
    const getPairData = (dimension: FaceDimension, label: string, l1Name: string, l1Key: FaceTrait, l2Name: string, l2Key: FaceTrait) => {
      const v1 = calcRatio(scores[l1Key], scores[l2Key]);
      const v2 = 100 - v1;
      return {
        dimension,
        label,
        l1Name,
        l2Name,
        v1,
        v2,
        isBalanced: v1 >= 45 && v1 <= 55,
        confidence: daily ? null : dna.assessmentMeta?.confidenceByDimension[dimension] ?? null,
      };
    };
    return [
      getPairData('FOCUS', '獲利動機', '積極型 (A)', 'A', '保守型 (P)', 'P'),
      getPairData('ANALYSIS', '決策邏輯', '理性數據 (R)', 'R', '感應直覺 (I)', 'I'),
      getPairData('CYCLE', '交易週期', '長期投資 (L)', 'L', '短期投機 (T)', 'T'),
      getPairData('EXPOSURE', '資金管理', '集中 (C)', 'C', '分散 (D)', 'D'),
    ];
  }, [dna, daily]);

  const skippedScenarioCount = dna.assessmentMeta?.skippedQuestionIds.length ?? 0;
  const scenarioQuestionCount = dna.assessmentMeta?.scenarioQuestionCount ?? 16;
  const hasInsufficientScenarioData = dna.assessmentMeta?.hasInsufficientData
    ?? skippedScenarioCount / scenarioQuestionCount > 0.5;

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-6">
        <div className="w-10 h-10 border-2 border-dashed border-[#8C635B] rounded-full animate-spin"></div>
        <p className="text-sm tracking-[0.16em] text-[#8C635B] font-bold">正在整理你的測驗結果...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-32 fade-in max-w-6xl mx-auto">
      
      {/* 操作按鈕區 */}
      {false && !isSharedView && (
        <div className="space-y-5 pt-8">
          <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6">
          <button 
            onClick={() => setIsShareModalOpen(true)}
            className="flex justify-center items-center gap-4 px-10 py-5 border border-[#2D2D2D] text-xs tracking-[0.5em] uppercase font-bold hover:bg-[#2D2D2D] hover:text-white transition-all shadow-md group active:scale-95"
          >
            <span>{t.common.share}</span>
            <span className="opacity-40 group-hover:opacity-100">›</span>
          </button>
          
          <button 
            onClick={onRetest}
            className="flex justify-center items-center gap-4 px-10 py-5 border border-[#8C7E6D]/50 text-xs tracking-[0.5em] uppercase font-bold text-[#8C7E6D] hover:border-[#2D2D2D] hover:text-[#2D2D2D] transition-all shadow-md active:scale-95"
          >
            <i className="fa-solid fa-rotate-right text-[10px]"></i>
            <span>{t.common.retestDna}</span>
          </button>
          </div>

          <section className="grid gap-px overflow-hidden border border-[#D1D1C7] bg-[#D1D1C7] text-left md:grid-cols-2">
            <button type="button" onClick={onGoToGallery} className="bg-white p-6 transition hover:bg-[#F7F4EF] md:p-7">
              <p className="text-[11px] font-bold tracking-[0.18em] text-[#8C635B]">YOUR RESULT</p>
              <h2 className="mt-3 serif text-2xl text-[#2D2D2D]">查看我的人格輪廓</h2>
              <p className="mt-3 text-sm leading-7 text-[#70665D]">從你的結果延伸閱讀完整的交易人格說明。</p>
            </button>
            <button type="button" onClick={onOpenContent} className="bg-white p-6 transition hover:bg-[#F7F4EF] md:p-7">
              <p className="text-[11px] font-bold tracking-[0.18em] text-[#8C635B]">WORRY-FREE BAR</p>
              <h2 className="mt-3 serif text-2xl text-[#2D2D2D]">看交易解憂 Bar</h2>
              <p className="mt-3 text-sm leading-7 text-[#70665D]">用影片與文章了解交易心態、人格與決策習慣。</p>
            </button>
            {user ? <button type="button" onClick={onOpenMemberHome} className="bg-[#F7F4EF] p-6 transition hover:bg-[#EEE9E1] md:p-7"><p className="text-[11px] font-bold tracking-[0.18em] text-[#8C635B]">MY FACE</p><h2 className="mt-3 serif text-2xl text-[#2D2D2D]">結果已保存</h2><p className="mt-3 text-sm leading-7 text-[#70665D]">回到我的 FACE，日後可查看測驗變化與 RATE。</p></button> : <button type="button" onClick={onLoginRequest} className="bg-[#F7F4EF] p-6 transition hover:bg-[#EEE9E1] md:p-7"><p className="text-[11px] font-bold tracking-[0.18em] text-[#8C635B]">SAVE MY FACE</p><h2 className="mt-3 serif text-2xl text-[#2D2D2D]">保存我的測驗結果</h2><p className="mt-3 text-sm leading-7 text-[#70665D]">登入後可記錄日後變化，並開啟 RATE 鏡相診股。</p></button>}
            <a href="https://line.me/ti/p/@227bctxh" target="_blank" rel="noreferrer" className="bg-[#2D2D2D] p-6 text-white transition hover:bg-black md:p-7"><p className="text-[11px] font-bold tracking-[0.18em] text-white/55">FIRST CONVERSATION</p><h2 className="mt-3 serif text-2xl">覺得交易卡住？</h2><p className="mt-3 text-sm leading-7 text-white/75">可聊交易壓力、決策流程與 FACE／RATE 的使用方式。</p><p className="mt-3 text-xs leading-5 text-white/50">不提供個別股票買賣建議、進出場時點、目標價、持股比例或報酬預估。</p></a>
          </section>
        </div>
      )}

      {hasInsufficientScenarioData && (
        <div className="mx-auto max-w-4xl border border-[#C99562] bg-[#FFF5E8] px-6 py-5 text-left text-[#6A4529]" role="alert">
          <p className="text-sm font-bold tracking-[0.08em]">問卷回答缺少足夠資料，產出的結果可能失真</p>
          <p className="mt-2 text-sm leading-7">你有 {skippedScenarioCount}／{scenarioQuestionCount} 題交易情境選擇「不適用於我」。本頁仍依其餘回答換算，但建議只作初步參考，並在累積更多交易經驗後重新測驗。</p>
        </div>
      )}

          {/* Use the latest editorial content and layout from the personality atlas. */}
          <ReadingLayerPrototype
            profileCode={code}
            showPrototypeControls={false}
            isUserType={!isSharedView}
            onShareResult={() => setIsShareModalOpen(true)}
            onViewGallery={onGoToGallery}
            resultVisualization={{
              pairs: faceData,
              radarData,
              showCurrent: Boolean(daily),
            }}
          />

          {!isSharedView && onOpenPricing && onOpenCoach && (
            <section className="mx-auto max-w-5xl border border-stone-200 bg-[#FCFBF8] p-6 sm:p-8 md:p-10" aria-labelledby="result-next-steps-heading">
              <div className="max-w-2xl">
                <p className="text-xs font-bold tracking-[0.2em] text-[#8C635B]">NEXT STEPS · {profile.code}</p>
                <h2 id="result-next-steps-heading" className="mt-3 serif text-3xl leading-[1.5] text-[#2D2D2D] md:text-4xl">從看見自己，走到下一個適合你的動作</h2>
                <p className="mt-4 text-sm leading-7 text-[#70665D] md:text-base">不需要一次做完。你可以先從內容開始；想把觀察變成方法時，再回來使用 FACE Survival 或申請一對一初談。</p>
              </div>

              <div className="mt-8 grid gap-px overflow-hidden border border-[#D1D1C7] bg-[#D1D1C7] md:grid-cols-2">
                <article className="bg-[#F7F4EF] p-6 md:p-7">
                  <PlayCircle size={24} strokeWidth={1.5} className="text-[#8C635B]" aria-hidden="true" />
                  <p className="mt-6 text-[11px] font-bold tracking-[0.18em] text-[#8C635B]">FOR {profile.name.toUpperCase()} · VIDEO</p>
                  <h3 className="mt-3 serif text-2xl text-[#2D2D2D]">你的交易人格影片</h3>
                  <p className="mt-3 text-sm leading-7 text-[#70665D]">針對你的優勢、壓力反應與常見盲點的短片解讀，正在製作中。</p>
                  <span className="mt-6 inline-flex border border-[#B9AA9D] px-3 py-2 text-xs font-bold tracking-[0.08em] text-[#8C7E6D]">即將推出</span>
                </article>

                <article className="bg-white p-6 md:p-7">
                  <FileText size={24} strokeWidth={1.5} className="text-[#8C635B]" aria-hidden="true" />
                  <p className="mt-6 text-[11px] font-bold tracking-[0.18em] text-[#8C635B]">FOR {profile.name.toUpperCase()} · READING</p>
                  <h3 className="mt-3 serif text-2xl text-[#2D2D2D]">最適合你的延伸文章</h3>
                  <p className="mt-3 text-sm leading-7 text-[#70665D]">依人格整理的專屬閱讀路徑正在編輯；完成後，會從你的結果直接帶你進入最相關的主題。</p>
                  <span className="mt-6 inline-flex border border-[#B9AA9D] px-3 py-2 text-xs font-bold tracking-[0.08em] text-[#8C7E6D]">即將推出</span>
                </article>

                <button type="button" onClick={onOpenPricing} className="group bg-white p-6 text-left transition hover:bg-[#F7F4EF] md:p-7">
                  <Compass size={24} strokeWidth={1.5} className="text-[#8C635B]" aria-hidden="true" />
                  <p className="mt-6 text-[11px] font-bold tracking-[0.18em] text-[#8C635B]">FACE SURVIVAL</p>
                  <h3 className="mt-3 serif text-2xl text-[#2D2D2D]">把觀察整理成可持續的方法</h3>
                  <p className="mt-3 text-sm leading-7 text-[#70665D]">從生存、計畫到覺察，先用一套通用框架，替每一次決定留下一個可以回看的依據。</p>
                  <span className="mt-6 inline-flex text-sm font-bold text-[#2D2D2D] transition group-hover:text-[#8C635B]">查看 FACE 生存指南 →</span>
                </button>

                <button type="button" onClick={onOpenCoach} className="group bg-[#2D2D2D] p-6 text-left text-white transition hover:bg-[#3A302B] md:p-7">
                  <MessageCircle size={24} strokeWidth={1.5} className="text-[#D9C7A9]" aria-hidden="true" />
                  <p className="mt-6 text-[11px] font-bold tracking-[0.18em] text-white/55">1V1 FIRST CONVERSATION</p>
                  <h3 className="mt-3 serif text-2xl">想把困擾說得更清楚？</h3>
                  <p className="mt-3 text-sm leading-7 text-white/75">可聊交易壓力、決策流程與 FACE 的使用方式；不提供個別標的、買賣時點或報酬預估。</p>
                  <span className="mt-6 inline-flex text-sm font-bold text-white transition group-hover:text-[#D9C7A9]">了解 1V1 初談 →</span>
                </button>
              </div>
            </section>
          )}

          {!isSharedView && (
            <div className="mx-auto flex max-w-xl flex-wrap justify-center gap-3 border-t border-stone-200 pt-8">
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="inline-flex items-center gap-2 border border-stone-900 px-6 py-3 text-sm font-bold tracking-[0.08em] text-stone-900 transition-colors hover:bg-stone-900 hover:text-white"
              >
                <Share2 size={16} strokeWidth={1.7} aria-hidden="true" />
                分享結果
              </button>
              <button
                onClick={onRetest}
                className="inline-flex items-center gap-2 border border-stone-300 px-6 py-3 text-sm font-bold tracking-[0.08em] text-stone-600 transition-colors hover:border-stone-900 hover:text-stone-900"
              >
                <RotateCcw size={16} strokeWidth={1.7} aria-hidden="true" />
                重新測驗
              </button>
              {onGoToGallery && (
                <button
                  onClick={onGoToGallery}
                  className="inline-flex items-center gap-2 border border-stone-300 px-6 py-3 text-sm font-bold tracking-[0.08em] text-stone-600 transition-colors hover:border-stone-900 hover:text-stone-900"
                >
                  <BookOpen size={16} strokeWidth={1.7} aria-hidden="true" />
                  查看圖鑑
                </button>
              )}
            </div>
          )}

          {false && <>
          {/* 4. 人格全貌 (Portrait) */}
          <div className="space-y-8 max-w-3xl mx-auto pt-8 md:pt-12">
             <span className="text-[10px] md:text-xs font-black text-[#8C7E6D] uppercase tracking-[0.6em] block">{t.dashboard.portrait}</span>
             <p className="text-lg md:text-2xl leading-[2.2] text-[#2D2D2D] serif italic tracking-wide px-2 md:px-0">{profile.portrait}</p>
          </div>

          {/* 5. 核心心理機制 (Psychology) */}
          <div className="bg-[#F5F5F0] py-16 md:py-24 px-6 md:px-24 border-y border-[#D1D1C7]/40 shadow-inner max-w-3xl mx-auto space-y-8 my-16">
             <p className="text-[10px] md:text-xs font-black text-[#8C7E6D] uppercase tracking-[0.5em] mb-4">{t.dashboard.psychology}</p>
             <p className="text-xl md:text-3xl leading-[2] text-[#2D2D2D] font-bold serif tracking-wide">{profile.psychology.mechanism}</p>
             <p className="text-base md:text-xl leading-[1.9] text-[#8C7E6D] serif italic mt-10 border-t border-[#D1D1C7]/30 pt-8 tracking-wide">“{profile.psychology.scene}”</p>
          </div>

          {/* 6. 投資盲區 (Blind Spots) */}
          <div className="space-y-12 md:space-y-16 pt-8">
            <h4 className="text-xs md:text-sm font-black text-[#8C635B] uppercase tracking-[0.8em] flex flex-col items-center gap-6">
              {t.dashboard.blindSpots}
              <span className="w-16 h-[1px] bg-[#8C635B]/50"></span>
            </h4>
            <div className="space-y-12 md:space-y-16 max-w-3xl mx-auto">
              {profile.blindSpots.map((bs, i) => (
                <div key={i} className="space-y-6 md:space-y-8 bg-white border border-[#D1D1C7]/30 py-12 md:py-16 px-6 md:px-12 shadow-sm">
                  <p className="text-xl md:text-2xl font-black text-[#2D2D2D] tracking-widest">【{bs.title}】</p>
                  <p className="text-base md:text-xl leading-[2] text-[#555] serif italic tracking-wide">{bs.description}</p>
                  <p className="text-sm md:text-lg leading-relaxed text-[#8C635B] font-bold border-t border-[#D1D1C7]/20 pt-6 mt-4 max-w-lg mx-auto">{bs.behavior}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 7. 錦囊 (Kit) */}
          <div className="space-y-12 pt-12">
            <h4 className="text-xs md:text-sm font-black text-[#8C635B] uppercase tracking-[1em] flex flex-col items-center gap-6 mb-8">
              {t.dashboard.kit}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-4xl mx-auto">
              {Object.entries(profile.pouches).map(([key, value], i) => {
                const icons = ['💊', '🛡️', '✨'];
                const labels = t.dashboard.pouchLabels;
                return (
                  <div key={key} className="bg-[#FBFBFA] border border-[#D1D1C7]/40 py-12 px-6 space-y-6 shadow-sm flex flex-col items-center text-center">
                    <span className="text-4xl md:text-5xl block opacity-90">{icons[i]}</span>
                    <p className="text-[10px] md:text-xs font-black text-[#8C7E6D] uppercase tracking-widest border-b border-[#D1D1C7]/50 pb-3">{labels[i]}</p>
                    <p className="text-lg md:text-xl font-bold text-[#2D2D2D] serif leading-[1.8] tracking-wide pt-2">{value}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 8. 靈魂處方箋 (Blessing) */}
          <div className="bg-[#2D2D2D] text-white py-16 px-6 md:p-24 text-center space-y-10 rounded-sm mt-24 relative overflow-hidden w-full shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-2 bg-[#8C635B]"></div>
            <p className="text-[10px] md:text-xs uppercase tracking-[1em] opacity-40 font-black">{t.dashboard.blessing}</p>
            <p className="text-2xl md:text-4xl serif italic font-extralight leading-[2.1] tracking-wide">「{profile.antidote}」</p>
          </div>

          </>}

      {/* 動態分析報告 (每日解憂) */}
      {daily && report && (
        <div className="bg-white border border-[#D1D1C7] rounded-sm shadow-2xl overflow-hidden animate-fade-in flex flex-col items-center mt-20 mb-32">
          <div className="bg-[#2D2D2D] text-white py-6 w-full text-[10px] md:text-xs tracking-[0.6em] font-bold uppercase text-center">{t.dashboard.offsetInsight}</div>
          
          {/* ✅ 修正此區塊的手機端 Padding，確保不憋屈 */}
          <div className="p-6 md:p-24 space-y-16 md:space-y-20 text-center w-full">
            <section className="space-y-8">
              <h4 className="text-[10px] md:text-sm font-black text-[#2D2D2D] uppercase tracking-[0.6em]">1. 今日偏移畫像</h4>
              <p className="text-lg md:text-3xl text-[#2D2D2D] font-bold leading-[2] serif italic bg-[#FBFBFA] py-12 md:py-20 px-6 md:px-10 rounded-sm shadow-inner border border-[#8C635B]/10 max-w-3xl mx-auto">「{report.soulPortrait.description}」</p>
            </section>
            
            <section className="space-y-10">
              <h4 className="text-[10px] md:text-sm font-black text-[#2D2D2D] uppercase tracking-[0.6em]">2. 內心張力安撫</h4>
              <div className="space-y-8 md:space-y-10 max-w-2xl mx-auto">
                <div className="bg-[#F5F5F0] py-12 md:py-20 px-6 md:px-10 rounded-sm border-y border-[#A64D4D]/15">
                  <p className="text-lg md:text-2xl leading-[2] text-[#2D2D2D] font-bold serif italic px-2 md:px-6">{report.innerPain}</p>
                </div>
                <div className="bg-[#8C635B] py-10 md:py-12 px-6 md:px-10 rounded-sm text-white shadow-2xl">
                  <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] mb-4 opacity-80">Emergency Warning</p>
                  <p className="text-xl md:text-3xl font-black italic leading-tight tracking-wider">「{report.blindSpot}」</p>
                </div>
              </div>
            </section>

            <section className="space-y-10">
              <h4 className="text-[10px] md:text-sm font-black text-[#2D2D2D] uppercase tracking-[0.3em]">3. 下一步建議</h4>
              <div className="bg-[#FBFBFA] py-12 md:py-20 px-6 md:px-10 border border-[#D1D1C7]/40 flex flex-col items-center gap-6 rounded-sm max-w-2xl mx-auto shadow-sm">
                <span className="text-4xl md:text-5xl">🧘</span>
                <p className="text-xl md:text-3xl text-[#2D2D2D] font-black leading-[2] serif italic px-2 md:px-8">{report.zenSolution}</p>
              </div>
            </section>

            <div className="space-y-12 md:space-y-16">
               <h4 className="text-[10px] md:text-sm font-black text-[#8C635B] uppercase tracking-[0.3em]">4. 風險提醒與下一步</h4>
               <div className="grid grid-cols-1 gap-8 md:gap-10 max-w-2xl mx-auto">
                  <div className="bg-white border-y border-[#D1D1C7]/60 py-12 md:py-20 px-6 md:px-10 space-y-6 shadow-sm">
                    <span className="text-4xl md:text-5xl block opacity-80">🛡️</span>
                    <p className="text-[10px] md:text-xs font-black text-[#8C7E6D] uppercase tracking-[0.3em]">今天的風險提醒</p>
                    <p className="text-lg md:text-2xl font-bold text-[#2D2D2D] serif italic leading-[2] px-2 md:px-8">{report.antiHangover.lifesaver}</p>
                  </div>
                  <div className="bg-[#2D2D2D] py-16 md:py-20 px-6 md:px-10 rounded-sm text-white text-center space-y-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-[#8C635B]"></div>
                    <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] opacity-40 font-black">TODAY'S REMINDER</p>
                    <p className="text-xl md:text-4xl serif italic font-extralight leading-[2] tracking-widest">「{report.antiHangover.blessing}」</p>
                  </div>
               </div>
            </div>

            {onSave && (
               <div className="pt-12 md:pt-16">
                 <button onClick={() => onSave(report, new Date().toLocaleDateString('zh-TW'))} className="w-full max-w-lg py-6 md:py-8 bg-[#8C635B] text-white text-sm md:text-base tracking-[1em] md:tracking-[1.2em] uppercase font-black shadow-2xl hover:bg-[#7D5A50] transition-all rounded-none active:scale-[0.98]">{t.common.archive}</button>
               </div>
            )}
          </div>
        </div>
      )}

      {isShareModalOpen && (
        <ShareModal 
          dna={dna} 
          profile={profile} 
          onClose={() => setIsShareModalOpen(false)} 
        />
      )}
    </div>
  );
};
