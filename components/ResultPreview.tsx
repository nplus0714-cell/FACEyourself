import React from 'react';
import { FACE_MAP } from '../constants';
import { RESULT_PREVIEW_CODES, createPreviewScores } from '../data/resultPreview';
import { Language } from '../types';
import { Dashboard } from './Dashboard';

interface ResultPreviewProps {
  selectedCode: string | null;
  onSelectCode: (code: string) => void;
  onBackToList: () => void;
  language: Language;
}

export const ResultPreview: React.FC<ResultPreviewProps> = ({ selectedCode, onSelectCode, onBackToList, language }) => {
  if (selectedCode && FACE_MAP[selectedCode]) {
    return (
      <div className="fade-in">
        <div className="mb-8 flex items-center justify-between border-b border-[#D1D1C7] pb-5">
          <p className="text-xs font-bold tracking-[0.16em] text-[#8C635B]">RESULT PAGE PREVIEW · {selectedCode}</p>
          <button type="button" onClick={onBackToList} className="border border-[#D1D1C7] bg-white px-4 py-2 text-xs font-bold text-[#5F574F] transition hover:border-[#2D2D2D] hover:text-[#2D2D2D]">返回 16 型清單</button>
        </div>
        <Dashboard dna={createPreviewScores(selectedCode)} user={null} onLoginRequest={() => undefined} isSharedView language={language} />
        <p className="mt-8 text-center text-xs leading-6 text-[#8C7E6D]">這是版型測試用的模擬分數，不會寫入你的測驗紀錄。</p>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-5xl pb-24 pt-4 fade-in">
      <div className="border-y border-[#D1D1C7] py-10 text-center md:py-14">
        <p className="text-xs font-bold tracking-[0.2em] text-[#8C635B]">RESULT PAGE PREVIEW</p>
        <h1 className="mt-5 serif text-3xl leading-[1.6] text-[#2D2D2D] md:text-4xl">16 型人格結果頁測試</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[#5F574F]">直接選一型查看完成測驗後的結果頁排版與閱讀感受。這些都是測試資料，不會影響你的帳戶紀錄。</p>
      </div>

      <div className="mt-10 grid grid-cols-2 border-l border-t border-[#D1D1C7] sm:grid-cols-4">
        {RESULT_PREVIEW_CODES.map((code) => {
          const profile = FACE_MAP[code];
          return (
            <button key={code} type="button" onClick={() => onSelectCode(code)} className="group min-h-40 border-b border-r border-[#D1D1C7] bg-[#FBFBFA] p-5 text-left transition hover:bg-[#F0E8E4] sm:min-h-44">
              <p className="text-xs font-bold tracking-[0.14em] text-[#8C635B]">{code}</p>
              <p className="mt-5 serif text-xl leading-8 text-[#2D2D2D] group-hover:text-[#8C635B]">{profile.name}</p>
              <p className="mt-3 text-xs leading-6 text-[#8C7E6D]">查看結果頁 →</p>
            </button>
          );
        })}
      </div>
    </section>
  );
};
