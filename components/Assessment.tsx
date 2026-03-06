
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
    <div className="max-w-xl mx-auto py-2 px-2 flex flex-col min-h-[70vh] justify-center fade-in">
      {/* 頂部維度：1x4 並排橫向佈局 */}
      <div className="text-center mb-6 space-y-4">
        <div className="grid grid-cols-4 gap-1 border-[0.5px] border-[#D1D1C7]/40 w-full overflow-hidden bg-white/20">
          {categories.map((cat) => {
            const isActive = currentQ.category === cat.key;
            return (
              <div 
                key={cat.en} 
                className={`flex flex-col items-center justify-center py-2 px-1 transition-all duration-700 ${
                  isActive 
                  ? 'bg-[#2D2D2D] text-white' 
                  : 'text-[#8C7E6D]'
                }`}
              >
                <span className="text-[8px] tracking-[0.1em] font-mono opacity-80 leading-none">{cat.en}</span>
                <span className="text-[9px] tracking-widest serif mt-1 leading-none">{language === 'zh' ? cat.zh : cat.en}</span>
              </div>
            );
          })}
        </div>

        <div className="space-y-1">
          <h2 className="text-base md:text-lg serif text-[#2D2D2D] tracking-[0.15em] font-light">
            {title}
          </h2>
          <div className="w-6 h-[0.5px] bg-[#2D2D2D]/30 mx-auto"></div>
        </div>
        
        <div className="flex justify-between items-center px-2 max-w-sm mx-auto">
            <p className="text-[8px] tracking-[0.3em] text-[#8C7E6D] uppercase font-mono">
              {t.common.step} {step + 1} / {totalSteps}
            </p>
            {step > 0 && (
              <button 
                onClick={handleBack}
                className="text-[8px] tracking-[0.15em] text-[#2D2D2D] uppercase border-b border-[#2D2D2D]/30 pb-0.5"
              >
                {t.common.back}
              </button>
            )}
        </div>
      </div>
      
      {/* 題目區塊：減少留白，斜體非粗體 */}
      <div className="space-y-4">
        <div className="text-center min-h-[60px] flex items-center justify-center px-4">
          <p className="text-lg md:text-xl leading-snug serif text-[#2D2D2D] italic font-normal tracking-wide">
            {currentQ.text}
          </p>
        </div>

        {/* 選項區塊：緊湊設計 */}
        <div className="grid grid-cols-1 gap-3">
          <button 
            onClick={() => handleChoice('A')} 
            className="group relative flex items-center p-4 bg-white/40 border-[0.5px] border-[#D1D1C7]/60 hover:border-[#2D2D2D] hover:bg-[#2D2D2D] transition-all duration-500 rounded-none text-left shadow-sm"
          >
            <div className="flex items-center gap-4 w-full">
              <span className="text-[8px] font-mono text-[#8C7E6D] group-hover:text-white/40 tracking-tighter uppercase shrink-0">OPTION A</span>
              <span className="text-base md:text-lg tracking-tight text-[#2D2D2D] group-hover:text-white font-normal transition-colors serif flex-grow">
                {currentQ.labels[0]}
              </span>
              <span className="opacity-0 group-hover:opacity-100 transition-all text-white text-lg">›</span>
            </div>
          </button>

          <button 
            onClick={() => handleChoice('B')} 
            className="group relative flex items-center p-4 bg-white/40 border-[0.5px] border-[#D1D1C7]/60 hover:border-[#2D2D2D] hover:bg-[#2D2D2D] transition-all duration-500 rounded-none text-left shadow-sm"
          >
            <div className="flex items-center gap-4 w-full">
              <span className="text-[8px] font-mono text-[#8C7E6D] group-hover:text-white/40 tracking-tighter uppercase shrink-0">OPTION B</span>
              <span className="text-base md:text-lg tracking-tight text-[#2D2D2D] group-hover:text-white font-normal transition-colors serif flex-grow">
                {currentQ.labels[1]}
              </span>
              <span className="opacity-0 group-hover:opacity-100 transition-all text-white text-lg">›</span>
            </div>
          </button>
        </div>
      </div>

      <div className="mt-8 text-center">
        <div className="inline-block py-2 border-t border-[#D1D1C7]/20 w-full max-w-[160px]">
          <p className="text-[7px] tracking-[0.5em] text-[#8C7E6D] uppercase font-light italic opacity-50">
            SOUL MINDFULNESS
          </p>
        </div>
      </div>
    </div>
  );
};
