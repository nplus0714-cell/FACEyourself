
import React, { useEffect, useState, useMemo } from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip,
} from 'recharts';
import { FaceScores, ReportContent, AuthUser, DiaryEntry, Language } from '../types';
import { FACE_MAP, getFaceCode } from '../constants';
import { generateDynamicReport } from '../services/geminiService';
import { ShareModal } from './ShareModal';
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
  onRetest?: () => void;
  isSharedView?: boolean;
  language: Language;
}

const calcRatio = (v1: number, v2: number) => {
  const total = v1 + v2;
  return total === 0 ? 50 : Math.round((v1 / total) * 100);
};

export const Dashboard: React.FC<DashboardProps> = ({ dna, daily, staticReport, onSave, onGoToGallery, onRetest, isSharedView, language }) => {
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
      getPairData('Focus 交易動機', '積極型 (A)', 'A', '保守型 (P)', 'P'),
      getPairData('Analysis 決測邏輯', '理性數據 (R)', 'R', '感應直覺 (I)', 'I'),
      getPairData('Cycle 交易週期', '長期投資 (L)', 'L', '短期投機 (T)', 'T'),
      getPairData('Exposure 資金管理', '集中 (C)', 'C', '分散 (D)', 'D'),
    ];
  }, [dna, daily]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#2D2D2D] text-white px-3 py-2 text-[10px] shadow-2xl border border-white/10 rounded-sm">
          <p className="font-bold border-b border-white/20 mb-1 pb-1 uppercase tracking-widest">{payload[0].payload.subject}</p>
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
        <div className="w-8 h-8 border-2 border-dashed border-[#8C635B] rounded-full animate-spin"></div>
        <p className="text-[10px] tracking-[0.4em] text-[#8C635B] font-bold uppercase">解碼靈魂波動中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-32 fade-in px-1 max-w-2xl mx-auto">
      {/* 操作按鈕區 */}
      {!isSharedView && (
        <div className="flex flex-wrap justify-center gap-3 mb-4">
          <button 
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-3 px-6 py-2 border-[0.5px] border-[#2D2D2D] text-[10px] tracking-[0.4em] uppercase font-bold hover:bg-[#2D2D2D] hover:text-white transition-all shadow-sm group"
          >
            <span>{t.common.share}</span>
            <span className="opacity-40 group-hover:opacity-100">›</span>
          </button>
          
          <button 
            onClick={onRetest}
            className="flex items-center gap-3 px-6 py-2 border-[0.5px] border-[#8C7E6D]/50 text-[10px] tracking-[0.4em] uppercase font-bold text-[#8C7E6D] hover:border-[#2D2D2D] hover:text-[#2D2D2D] transition-all shadow-sm"
          >
            <i className="fa-solid fa-rotate-right text-[9px]"></i>
            <span>{t.common.retestDna}</span>
          </button>
        </div>
      )}

      {/* 頂部數據分析卡 */}
      <div className="bg-white border border-[#D1D1C7] rounded-sm shadow-sm overflow-hidden p-4 md:p-8 space-y-4">
        <div className="text-center space-y-1">
          <span className="text-[8px] font-black text-[#8C635B] uppercase tracking-[0.3em] block">{t.dashboard.analysis}</span>
          <h2 className="text-xl serif text-[#2D2D2D] font-bold tracking-tight">{t.dashboard.title}</h2>
        </div>

        <div className="bg-[#FBFBFA] border border-[#D1D1C7]/20 p-2 md:p-4 rounded-sm">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="80%" margin={{ top: 0, right: 30, bottom: 0, left: 30 }}>
                <PolarGrid stroke="#D1D1C7" strokeDasharray="4 4" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fontSize: 9, fontWeight: 700, fill: '#2D2D2D', fontFamily: 'Noto Serif TC' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Radar dataKey="base" stroke="#2D2D2D" strokeWidth={1} fill="#2D2D2D" fillOpacity={0.03} />
                {daily && <Radar dataKey="current" stroke="#8C635B" strokeWidth={2} fill="#8C635B" fillOpacity={0.15} dot={{ r: 2.5, fill: '#8C635B' }} />}
              </RadarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="max-w-md mx-auto space-y-4 border-t border-[#D1D1C7]/30 pt-4">
            {faceData.map((item, idx) => {
              const deepColor = daily ? '#8C635B' : '#2D2D2D';
              const lightColor = '#D1D1C7';
              return (
                <div key={idx} className="space-y-1">
                  <div className="text-center">
                    <span className="text-[11px] font-bold serif italic text-[#2D2D2D] tracking-widest">{item.label}</span>
                  </div>
                  <div className="relative">
                    <div className="flex justify-between items-end mb-0.5 px-0.5">
                      <div className="text-left w-1/2">
                        <p className={`text-[9px] font-bold ${item.v1 >= item.v2 ? 'text-[#2D2D2D]' : 'text-[#8C7E6D]'}`}>{item.l1Name}</p>
                        <p className={`text-base font-mono font-black ${item.v1 >= item.v2 ? 'text-[#2D2D2D]' : 'text-[#8C7E6D]/50'}`}>{item.v1}%</p>
                      </div>
                      <div className="text-right w-1/2">
                        <p className={`text-[9px] font-bold ${item.v2 > item.v1 ? 'text-[#2D2D2D]' : 'text-[#8C7E6D]'}`}>{item.l2Name}</p>
                        <p className={`text-base font-mono font-black ${item.v2 > item.v1 ? 'text-[#2D2D2D]' : 'text-[#8C7E6D]/50'}`}>{item.v2}%</p>
                      </div>
                    </div>
                    <div className="h-[10px] w-full bg-[#E6E6E1] rounded-full overflow-hidden flex relative shadow-inner">
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

      {/* 完整文案內容 */}
      <div className="bg-white border border-[#D1D1C7] rounded-sm shadow-sm overflow-hidden flex flex-col items-center">
        <div className="relative aspect-[21/9] w-full overflow-hidden">
          <img src={profile.imageUrl} className="w-full h-full object-cover grayscale-[0.2]" alt={profile.name} />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
          {/* 人格代碼移動至左上角 */}
          <div className="absolute top-3 left-3">
            <span className="bg-[#2D2D2D] text-white text-[9px] px-3 py-1 font-bold tracking-[0.1em] uppercase shadow-lg inline-block">{code}</span>
          </div>
        </div>

        <div className="p-4 md:p-10 space-y-8 text-center w-full">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl serif text-[#2D2D2D] font-black tracking-tighter">【{profile.name}】</h1>
            <div className="w-10 h-[1px] bg-[#D1D1C7] mx-auto"></div>
            <p className="text-lg italic font-bold text-[#8C635B] serif leading-relaxed px-2">「{profile.motto}」</p>
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
             <span className="text-[9px] font-black text-[#8C7E6D] uppercase tracking-[0.4em] block">{t.dashboard.portrait}</span>
             <p className="text-[15px] leading-[1.6] text-[#2D2D2D] serif italic opacity-90">{profile.portrait}</p>
          </div>

          <div className="bg-[#F5F5F0] p-6 border-y border-[#D1D1C7]/30 shadow-inner max-w-xl mx-auto space-y-2">
             <p className="text-[9px] font-black text-[#8C7E6D] uppercase tracking-[0.3em]">{t.dashboard.psychology}</p>
             <p className="text-[16px] leading-relaxed text-[#2D2D2D] font-bold serif">{profile.psychology.mechanism}</p>
             <p className="text-[13px] leading-relaxed text-[#8C7E6D] serif italic mt-2 border-t border-[#D1D1C7]/20 pt-2">“{profile.psychology.scene}”</p>
          </div>

          <div className="space-y-4 pt-2">
            <h4 className="text-[11px] font-black text-[#A64D4D] uppercase tracking-[0.5em] flex flex-col items-center gap-1.5">
              {t.dashboard.blindSpots}
              <span className="w-12 h-[1px] bg-[#A64D4D]"></span>
            </h4>
            <div className="space-y-6 max-w-xl mx-auto">
              {profile.blindSpots.map((bs, i) => (
                <div key={i} className="space-y-2">
                  <p className="text-[15px] font-black text-[#2D2D2D] tracking-wider">【{bs.title}】</p>
                  <p className="text-[14px] leading-[1.6] text-[#555] serif italic">{bs.description}</p>
                  <p className="text-[12px] leading-relaxed text-[#A64D4D] font-bold border-t border-[#A64D4D]/10 pt-2 max-w-sm mx-auto">{bs.behavior}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6 pt-2">
            <h4 className="text-[11px] font-black text-[#8C635B] uppercase tracking-[0.6em] flex flex-col items-center gap-1.5">
              {t.dashboard.kit}
            </h4>
            <div className="grid grid-cols-1 gap-4 max-w-xl mx-auto">
              {Object.entries(profile.pouches).map(([key, value], i) => {
                const icons = ['💊', '🛡️', '✨'];
                const labels = t.dashboard.pouchLabels;
                return (
                  <div key={key} className="bg-white border-b border-[#D1D1C7]/60 p-4 space-y-1 shadow-sm">
                    <span className="text-2xl block mb-0.5">{icons[i]}</span>
                    <p className="text-[9px] font-black text-[#8C7E6D] uppercase tracking-widest">{labels[i]}</p>
                    <p className="text-[14px] font-bold text-[#2D2D2D] serif italic leading-relaxed px-1">{value}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-[#2D2D2D] text-white p-8 text-center space-y-4 rounded-t-2xl mt-4 relative overflow-hidden w-full">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-[#8C635B]"></div>
            <p className="text-[9px] uppercase tracking-[0.8em] opacity-40 font-black">{t.dashboard.blessing}</p>
            <p className="text-xl md:text-2xl serif italic font-medium leading-[1.6] tracking-tight">「{profile.antidote}」</p>
          </div>

          {!isSharedView && onGoToGallery && (
            <button onClick={onGoToGallery} className="w-full max-w-xs py-3 text-[10px] tracking-[0.3em] text-[#2D2D2D] font-black border border-[#2D2D2D] hover:bg-[#2D2D2D] hover:text-white transition-all uppercase">
              探索十六型靈魂圖鑑
            </button>
          )}
        </div>
      </div>

      {daily && report && (
        <div className="bg-white border border-[#D1D1C7] rounded-sm shadow-xl overflow-hidden animate-fade-in flex flex-col items-center mt-8">
          <div className="bg-[#2D2D2D] text-white py-3 w-full text-[9px] tracking-[0.4em] font-bold uppercase text-center">{t.dashboard.offsetInsight}</div>
          <div className="p-4 md:p-8 space-y-10 text-center w-full">
            <section className="space-y-4">
              <h4 className="text-[12px] font-black text-[#2D2D2D] uppercase tracking-[0.4em]">1. 今日偏移畫像</h4>
              <p className="text-[16px] text-[#2D2D2D] font-bold leading-[1.6] serif italic bg-[#FBFBFA] p-6 rounded-sm shadow-inner border border-[#8C635B]/5 max-w-xl mx-auto">「{report.soulPortrait.description}」</p>
            </section>
            <section className="space-y-4">
              <h4 className="text-[12px] font-black text-[#2D2D2D] uppercase tracking-[0.4em]">2. 內心張力安撫</h4>
              <div className="space-y-4 max-w-xl mx-auto">
                <div className="bg-[#F5F5F0] p-4 rounded-sm border-y border-[#A64D4D]/10">
                  <p className="text-[14px] leading-[1.6] text-[#2D2D2D] font-bold serif italic px-2">{report.innerPain}</p>
                </div>
                <div className="bg-[#8C635B] p-6 rounded-sm text-white shadow-md">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-2 opacity-70">Emergency Warning</p>
                  <p className="text-[17px] font-black italic leading-snug">「{report.blindSpot}」</p>
                </div>
              </div>
            </section>
            <section className="space-y-4">
              <h4 className="text-[12px] font-black text-[#2D2D2D] uppercase tracking-[0.4em]">3. 禪式回歸建議</h4>
              <div className="bg-[#FBFBFA] p-6 border border-[#D1D1C7]/20 flex flex-col items-center gap-3 rounded-sm max-w-xl mx-auto">
                <span className="text-3xl">🧘</span>
                <p className="text-[15px] text-[#2D2D2D] font-black leading-[1.7] serif italic px-2">{report.zenSolution}</p>
              </div>
            </section>
            <div className="space-y-8">
               <h4 className="text-[12px] font-black text-[#8C635B] uppercase tracking-[0.4em]">4. 保命與祝福</h4>
               <div className="grid grid-cols-1 gap-4 max-w-xl mx-auto">
                  <div className="bg-white border-y border-[#D1D1C7]/40 p-4 space-y-2 shadow-sm">
                    <span className="text-2xl block opacity-60">🛡️</span>
                    <p className="text-[8px] font-black text-[#8C7E6D] uppercase tracking-widest">今日保命符</p>
                    <p className="text-[14px] font-bold text-[#2D2D2D] serif italic leading-relaxed">{report.antiHangover.lifesaver}</p>
                  </div>
                  <div className="bg-[#2D2D2D] p-8 rounded-sm text-white text-center space-y-4 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-[#8C635B]"></div>
                    <p className="text-[9px] uppercase tracking-[0.6em] opacity-40 font-black">Daily Blessing</p>
                    <p className="text-lg md:text-xl serif italic font-medium leading-relaxed">「{report.antiHangover.blessing}」</p>
                  </div>
               </div>
            </div>
            {onSave && (
               <div className="pt-4">
                 <button onClick={() => onSave(report, new Date().toLocaleDateString('zh-TW'))} className="w-full max-w-xs py-5 bg-[#8C635B] text-white text-[13px] tracking-[0.6em] uppercase font-black shadow-lg hover:bg-[#7D5A50] transition-colors rounded-sm">{t.common.archive}</button>
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
