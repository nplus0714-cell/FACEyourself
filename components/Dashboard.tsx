import React, { useEffect, useState, useMemo } from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip,
} from 'recharts';
import { FaceScores, ReportContent, AuthUser, DiaryEntry, Language } from '../types';
import { FACE_MAP, getFaceCode } from '../constants';
import { generateDynamicReport } from '../services/geminiService';
import { ShareModal } from './ShareModal';
import { RoleDetail } from './RoleDetail';
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
  onRetest?: () => void;
  isSharedView?: boolean;
  language: Language;
}

const calcRatio = (v1: number, v2: number) => {
  const total = v1 + v2;
  return total === 0 ? 50 : Math.round((v1 / total) * 100);
};

export const Dashboard: React.FC<DashboardProps> = ({ dna, daily, staticReport, onSave, onGoToGallery, onGoToMirrorTrade, onRetest, isSharedView, language }) => {
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
    const getPairData = (label: string, l1Name: string, l1Key: keyof FaceScores, l2Name: string, l2Key: keyof FaceScores) => {
      const v1 = calcRatio(scores[l1Key], scores[l2Key]);
      const v2 = 100 - v1;
      return { label, l1Name, l2Name, v1, v2 };
    };
    return [
      getPairData('獲利動機', '積極型 (A)', 'A', '保守型 (P)', 'P'),
      getPairData('決策邏輯', '理性數據 (R)', 'R', '感應直覺 (I)', 'I'),
      getPairData('交易週期', '長期投資 (L)', 'L', '短期投機 (T)', 'T'),
      getPairData('資金管理', '集中 (C)', 'C', '分散 (D)', 'D'),
    ];
  }, [dna, daily]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#2D2D2D] text-white px-6 py-3 text-xs shadow-2xl border border-white/10 rounded-sm">
          <p className="font-bold border-b border-white/20 mb-2 pb-1 uppercase tracking-widest">{payload[0].payload.subject}</p>
          <p className="opacity-80">{t.dashboard.baseEnergy}: {payload[0].value}%</p>
          {daily && <p className="text-[#D9B5AF] font-bold">{t.dashboard.todayStatus}: {payload[1].value}%</p>}
        </div>
      );
    }
    return null;
  };

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
      {!isSharedView && (
        <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 mb-12 pt-8">
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
      )}

      {/* ✅ 合併後的「完整靈魂報告卷軸」 */}
      <div className="bg-[#F7F4EF] border border-[#D1D1C7] overflow-hidden flex flex-col items-center">
        
        {/* 1. 照片區塊 */}
        <div className="grid w-full border-b border-[#D1D1C7] md:grid-cols-[0.95fr_1.05fr]">
          <div className="relative min-h-[280px] bg-white md:min-h-[420px]">
            <img 
              src={profile.imageUrl} 
              className="h-full w-full object-contain p-5 grayscale-[0.15] md:p-8" 
              alt={profile.name} 
              loading="lazy" 
            />
            <div className="absolute left-4 top-4 md:left-6 md:top-6">
              <span className="inline-block bg-[#2D2D2D] px-4 py-2 text-xs font-bold tracking-[0.2em] text-white">{code}</span>
            </div>
          </div>
          <div className="flex flex-col justify-center px-7 py-10 text-left md:px-12 md:py-14">
            <p className="text-xs font-bold tracking-[0.2em] text-[#8C635B]">FACE RESULT REPORT</p>
            <h1 className="mt-5 serif text-3xl leading-[1.45] text-[#2D2D2D] md:text-5xl">{profile.name}</h1>
            <p className="mt-4 text-sm tracking-[0.12em] text-[#8C7E6D]">{code}　{profile.attributes}</p>
            <div className="my-7 h-px w-16 bg-[#CDBCB1]"></div>
            <p className="serif text-xl leading-[1.9] text-[#8C635B] md:text-2xl">「{profile.motto}」</p>
            <p className="mt-7 text-base leading-8 text-[#5F574F]">這份報告會整理你的四個交易傾向，幫你理解什麼樣的策略，才是你能長期執行的方式。</p>
          </div>
        </div>

        {/* 內容區塊 Wrapper */}
        <div className="w-full space-y-10 p-6 text-center md:space-y-14 md:p-10">
          
          {/* FACE 分數 */}
          {/* 修正 1：將卡片外層的手機版上下間距縮小，space-y-12 降為 space-y-6 */}
          <div className="mx-auto grid max-w-4xl gap-6 border-y border-[#D1D1C7] py-9 text-left md:grid-cols-2 md:gap-x-8 md:gap-y-6 md:py-10">
            <div className="grid gap-4 md:col-span-2 md:grid-cols-[9rem_1fr] md:gap-6">
              <p className="text-sm font-bold leading-[1.7] tracking-[0.12em] text-[#8C635B]">FACE SCORE<br />四個交易面向</p>
              <div>
                <h2 className="serif text-2xl leading-[1.55] text-[#2D2D2D] md:text-3xl">你的 FACE 分數</h2>
                <p className="mt-3 text-base leading-[2] text-[#5F574F]">這四組分數不是好或壞，而是你在市場中比較自然的選擇方式。</p>
              </div>
            </div>

            {/* 修正 2：雷達圖高度在手機版降為 260px，並縮減 mb-12 為 mb-4 */}
            <div className="h-[260px] w-full md:h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} outerRadius={window.innerWidth < 768 ? "65%" : "76%"} margin={{ top: 10, right: 24, bottom: 10, left: 24 }}>
                  <PolarGrid stroke="#D1D1C7" strokeDasharray="4 4" />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fontSize: window.innerWidth < 768 ? 10 : 13, fontWeight: 700, fill: '#2D2D2D', fontFamily: 'Noto Serif TC' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Radar dataKey="base" stroke="#2D2D2D" strokeWidth={1} fill="#2D2D2D" fillOpacity={0.03} />
                  {daily && <Radar dataKey="current" stroke="#8C635B" strokeWidth={2} fill="#8C635B" fillOpacity={0.15} dot={{ r: 4, fill: '#8C635B' }} />}
                </RadarChart>
              </ResponsiveContainer>
            </div>
            
            {/* 修正 3：下方條狀圖的頂部間距 pt-12 改為 pt-6 */}
            <div className="mx-auto max-w-2xl space-y-3 border-t border-[#D1D1C7] pt-4 md:mx-0 md:grid md:h-[360px] md:max-w-none md:grid-rows-[repeat(4,minmax(0,1fr))] md:gap-0 md:space-y-0 md:border-l md:border-t-0 md:pl-8 md:pt-0">
              {faceData.map((item, idx) => {
                const deepColor = daily ? '#8C635B' : '#2D2D2D';
                const lightColor = '#D1D1C7';
                return (
                  <div key={idx} className="border-t border-[#D1D1C7] pt-3 first:border-t-0 first:pt-0 md:flex md:min-h-0 md:flex-col md:justify-center md:py-0">
                    <div className="mb-3 md:mb-3">
                      <span className="serif text-[0.9rem] leading-none text-[#2D2D2D]">{item.label}</span>
                    </div>
                    <div className="relative">
                      <div className="mb-1 flex items-end justify-between px-1 md:mb-0.5">
                        <div className="text-left w-1/2">
                          <p className={`serif text-[0.68rem] ${item.v1 >= item.v2 ? 'text-[#2D2D2D]' : 'text-[#8C7E6D]'}`}>{item.l1Name}</p>
                          <p className={`serif mt-0.5 text-[1.35rem] leading-none ${item.v1 >= item.v2 ? 'text-[#2D2D2D]' : 'text-[#8C7E6D]/50'}`}>{item.v1}%</p>
                        </div>
                        <div className="text-right w-1/2">
                          <p className={`serif text-[0.68rem] ${item.v2 > item.v1 ? 'text-[#2D2D2D]' : 'text-[#8C7E6D]'}`}>{item.l2Name}</p>
                          <p className={`serif mt-0.5 text-[1.35rem] leading-none ${item.v2 > item.v1 ? 'text-[#2D2D2D]' : 'text-[#8C7E6D]/50'}`}>{item.v2}%</p>
                        </div>
                      </div>
                      <div className="flex h-2 w-full overflow-hidden bg-[#E6E6E1]">
                        <div className="h-full transition-all duration-1000" style={{ width: `${item.v1}%`, backgroundColor: item.v1 >= item.v2 ? deepColor : lightColor }}></div>
                        <div className="h-full transition-all duration-1000" style={{ width: `${item.v2}%`, backgroundColor: item.v2 > item.v1 ? deepColor : lightColor }}></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

          {/* Use the same editorial content and layout as the personality catalogue. */}
          <RoleDetail role={profile} isUserType={false} onBack={() => undefined} compact />

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

          {!isSharedView && onGoToGallery && (
            <div className="pt-16 md:pt-24 flex justify-center">
              <button onClick={onGoToGallery} className="w-full max-w-md py-6 px-4 text-xs tracking-[0.5em] text-[#2D2D2D] font-black border border-[#2D2D2D] hover:bg-[#2D2D2D] hover:text-white transition-all uppercase shadow-md active:scale-95">
                查看 16 型交易風格
              </button>
            </div>
          )}

          {!isSharedView && onGoToMirrorTrade && (
            <section className="mx-auto mt-12 max-w-2xl border border-[#D1D1C7] bg-[#F7F4EF] px-6 py-12 text-center md:mt-16 md:px-12 md:py-16">
              <p className="text-[11px] font-black tracking-[0.22em] text-[#8C635B]">NEXT STEP · RATE</p>
              <h3 className="mt-5 serif text-2xl leading-[1.65] text-[#2D2D2D] md:text-3xl"><span className="block">認識自己用 FACE，</span><span className="block">檢驗持倉用 RATE。</span></h3>
              <p className="mx-auto mt-5 max-w-lg text-base leading-8 text-[#5F574F]"><span className="block">用 RATE 鏡相診股，檢查真實持倉是否符合你的交易人格。</span><span className="mt-1 block">找出讓你焦慮、猶豫或抱不住的策略落差。</span></p>
              <button onClick={onGoToMirrorTrade} className="mt-8 border border-[#2D2D2D] bg-[#2D2D2D] px-8 py-4 text-sm font-bold tracking-[0.12em] text-white transition hover:bg-transparent hover:text-[#2D2D2D]">前往 RATE 鏡相診股</button>
            </section>
          )}
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
