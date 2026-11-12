import React, { useState } from 'react';
import { ga4Configured, isMeasuredPath, readAnalyticsConsent, setAnalyticsConsent } from '../services/ga4Analytics';

export const AnalyticsConsent: React.FC<{ settings?: boolean }> = ({ settings = false }) => {
  const [choice, setChoice] = useState(readAnalyticsConsent);
  if (!ga4Configured || (!settings && (choice || !isMeasuredPath(location.pathname)))) return null;

  const choose = (value: 'granted' | 'denied') => {
    setAnalyticsConsent(value);
    setChoice(value);
  };

  return (
    <aside className="my-5 border border-[#CFC6B8] bg-[#F4EEE7] px-4 py-3 text-sm leading-7 text-[#4B4138]" aria-label="網站分析偏好">
      <p>允許 Google Analytics 記錄瀏覽來源與測驗進度。你可在隱私權政策頁變更選擇。</p>
      {settings && <p role="status">目前選擇　{choice === 'granted' ? '允許分析' : choice === 'denied' ? '略過分析' : '尚未選擇'}</p>}
      <div className="mt-2 flex flex-wrap gap-2">
        <button type="button" onClick={() => choose('granted')} className="min-h-11 border border-[#6B5447] px-4 font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">允許分析</button>
        <button type="button" onClick={() => choose('denied')} className="min-h-11 border border-[#6B5447] px-4 font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">略過分析</button>
      </div>
    </aside>
  );
};
