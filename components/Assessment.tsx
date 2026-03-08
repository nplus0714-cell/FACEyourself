import React, { useState } from 'react';
import { FaceScores, Language } from '../types';
import { translations } from '../i18n';

interface Question {
  id: string;
  pair: string[];
  category: string;
  text: string;
  labels: string[];
}

interface AssessmentProps {
  questions: Question[];
  onComplete: (scores: FaceScores) => void;
  title: string;
  weightPerQuestion: number;
  language: Language;
}

export const Assessment: React.FC<AssessmentProps> = ({ questions, onComplete, title, weightPerQuestion, language }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, 'A' | 'B'>>({});
  const t = translations[language];

  const currentQ = questions[step];
  const totalSteps = questions.length;

  const handleChoice = (choice: 'A' | 'B') => {
    const updated = { ...answers, [currentQ.id]: choice };
    setAnswers(updated);
    
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      const final: FaceScores = { A: 0, P: 0, R: 0, I: 0, L: 0, T: 0, C: 0, D: 0 };
      
      questions.forEach(q => {
        const choice = updated[q.id];
        if (!choice) return;
        
        const primaryTrait = q.pair[0];   
        const secondaryTrait = q.pair[1]; 
        
        if (choice === 'A') {
          (final as any)[primaryTrait] += weightPerQuestion;
        } else {
          (final as any)[secondaryTrait] += weightPerQuestion;
        }
      });
      onComplete(final);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const categories = [
    { en: 'FOCUS', zh: '動機', key: 'FOCUS 動機' },
    { en: 'ANALYSIS', zh: '邏輯', key: 'ANALYSIS 邏輯' },
    { en: 'CYCLE', zh: '頻率', key: 'CYCLE 頻率' },
    { en: 'EXPOSURE', zh: '行為', key: 'EXPOSURE 行為' }
  ];

  return (
    <div className="max-w-xl mx-auto py-4 px-4 flex flex-col min-h-[75vh] justify-center fade-in">
      
      {/* 頂部維度：比照 Aman 風格，增加字距與可讀性 */}
      <div className="text-center mb-8 space-y-6">
        <div className="grid grid-cols-4 gap-0 border-[0.5px] border-[#D1D1C7]/60 w-full overflow-hidden bg-white/40 shadow-sm">
          {categories.map((cat) => {
            const isActive = currentQ.category === cat.key;
            return (
              <div 
                key={cat.en} 
                className={`flex flex-col items-center justify-center py-4 px-1 transition-all duration-700 ${
                  isActive 
                  ? 'bg-[#2D2D2D] text-white scale-100' 
                  : 'text-[#8C7E6D] opacity-60'
                }`}
              >
                {/* ✅ 放大：text-[8px] -> text-[10px] md:text-xs，增加字距 */}
                <span className="text-[10px] tracking-[0.25em] font-mono leading-none">{cat.en}</span>
                {/* ✅ 放大：text-[9px] -> text-xs (12px) */}
                <span className="text-xs tracking-widest serif mt-1.5 leading-none font-bold">
                  {language === 'zh' ? cat.zh : cat.en}
                </span>
              </div>
            );
          })}
        </div>

        <div className="space-y-2">
          {/* ✅ 放大標題層次 */}
          <h2 className="text-lg md:text-xl serif text-[#2D2D2D] tracking-[0.2em] font-light">
            {title}
          </h2>
          <div className="w-10 h-[0.5px] bg-[#2D2D2D]/30 mx-auto"></div>
        </div>
        
        <div className="flex justify-between items-center px-1 max-w-md mx-auto">
            {/* ✅ 放大：text-[8px] -> text-xs (12px) 並增加字距 */}
            <p className="text-xs tracking-[0.35em] text-[#8C7E6D] uppercase font-mono">
              {t.common.step} {step + 1} / {totalSteps}
            </p>
            {step > 0 && (
              <button 
                onClick={handleBack}
                /* ✅ 放大：text-[8px] -> text-xs (12px) */
                className="text-xs tracking-[0.2em] text-[#2D2D2D] uppercase border-b border-[#2D2D2D]/40 pb-1 hover:opacity-60 transition-opacity"
              >
                {t.common.back}
              </button>
            )}
        </div>
      </div>
      
      {/* 題目區塊：比照安縵，讓文字更有份量 */}
      <div className="space-y-8">
        <div className="text-center min-h-[80px] flex items-center justify-center px-4">
          {/* ✅ 確保題目在手機上是顯眼的 20px (text-xl) */}
          <p className="text-xl md:text-2xl leading-[1.6] serif text-[#2D2D2D] italic font-normal tracking-wide">
            {currentQ.text}
          </p>
        </div>

        {/* 選項區塊：增加點擊範圍與文字易讀性 */}
        <div className="grid grid-cols-1 gap-4">
          <button 
            onClick={() => handleChoice('A')} 
            className="group relative flex items-center p-6 bg-white border border-[#D1D1C7]/60 hover:border-[#2D2D2D] hover:bg-[#2D2D2D] transition-all duration-500 rounded-none text-left shadow-sm"
          >
            <div className="flex items-center gap-6 w-full">
              {/* ✅ 選項標籤放大：text-[8px] -> text-[10px] */}
              <span className="text-[10px] font-mono text-[#8C7E6D] group-hover:text-white/40 tracking-widest uppercase shrink-0">OPTION A</span>
              {/* ✅ 核心選項文字：text-lg (18px)，與 16Personalities 對標 */}
              <span className="text-lg md:text-xl tracking-tight text-[#2D2D2D] group-hover:text-white font-normal transition-colors serif flex-grow">
                {currentQ.labels[0]}
              </span>
              <span className="opacity-0 group-hover:opacity-100 transition-all text-white text-xl">›</span>
            </div>
          </button>

          <button 
            onClick={() => handleChoice('B')} 
            className="group relative flex items-center p-6 bg-white border border-[#D1D1C7]/60 hover:border-[#2D2D2D] hover:bg-[#2D2D2D] transition-all duration-500 rounded-none text-left shadow-sm"
          >
            <div className="flex items-center gap-6 w-full">
              <span className="text-[10px] font-mono text-[#8C7E6D] group-hover:text-white/40 tracking-widest uppercase shrink-0">OPTION B</span>
              <span className="text-lg md:text-xl tracking-tight text-[#2D2D2D] group-hover:text-white font-normal transition-colors serif flex-grow">
                {currentQ.labels[1]}
              </span>
              <span className="opacity-0 group-hover:opacity-100 transition-all text-white text-xl">›</span>
            </div>
          </button>
        </div>
      </div>

      <div className="mt-12 text-center">
        <div className="inline-block py-3 border-t border-[#D1D1C7]/30 w-full max-w-[200px]">
          {/* ✅ 底部資訊放大至可閱讀尺寸 */}
          <p className="text-[10px] tracking-[0.5em] text-[#8C7E6D] uppercase font-light italic opacity-60">
            SOUL MINDFULNESS
          </p>
        </div>
      </div>
    </div>
  );
};
