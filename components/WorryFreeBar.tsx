import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const WorryFreeBar: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [selectedDrink, setSelectedDrink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const menu = [
    { id: 'fomo', name: 'FOMO 特調', icon: '✨', description: '針對錯失恐懼、想追高熱門股的焦慮。', prompt: '我感到 FOMO (錯失恐懼)，看著別人的標的狂飆而我的沒動，我感到焦慮。請給我一段極具禪意且富有哲理的寬慰與建議，字數約 120 字。' },
    { id: 'loss', name: '回撤苦艾酒', icon: '🌿', description: '針對帳面虧損、淨值下滑帶來的生理不安。', prompt: '我的帳面正在回撤，我感到心跳加速與不安。請以一位智慧長者的口吻，給我一段關於波動與價值的對話，字數約 120 字。' },
    { id: 'doubt', name: '自我懷疑補藥', icon: '💎', description: '針對連續失利、懷疑系統有效性的迷失。', prompt: '我連續交易失利，開始懷疑自己的判斷與能力。請給我一段充滿力量但溫柔的鼓勵，告訴我如何與挫折共處，字數約 120 字。' },
    { id: 'greed', name: '貪婪解毒水', icon: '🌑', description: '針對獲利後過度自信、無法收手的亢奮。', prompt: '我發現自己變得很貪婪，不斷想加大槓桿，停不下來。請給我一段嚴肅但慈悲的警示，讓我清醒過來，字數約 120 字。' }
  ];

  const orderDrink = async (item: typeof menu[0]) => {
    setLoading(true);
    setSelectedDrink(item.name);
    setResponse(null);

    try {
      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `您是一位在深山經營「交易解憂酒吧」的禪修大師。現在一位投資者點了「${item.name}」。
        請針對他的內心苦處提供禪宗式的指引：${item.prompt}
        文案風格：極致優雅、詩意、冷靜、且最後要提供一個簡單的「當下動作」來平復心境。`
      });
      setResponse(result.text || '「大師今日靜默。請深呼吸，再試一次。」');
    } catch (e) {
      setResponse('「酒窖正在重整。請閉上眼，感受此刻的呼吸。」');
    } finally {
      setLoading(false);
    }
  };

  const copyBlessing = () => {
    if (!response) return;
    const shareUrl = "https://faceyourself.vercel.app";
    const fullText = `我在「交易解憂 Bar」點了一杯【${selectedDrink}】，大師說：\n\n「${response}」\n\n測測看你的投資靈魂 DNA：${shareUrl}`;
    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 space-y-20 fade-in min-h-[85vh] flex flex-col">
      <div className="text-center space-y-6">
        {/* ✅ 標籤放大 */}
        <div className="inline-block px-4 py-1.5 border border-[#8C635B] text-[#8C635B] text-xs tracking-[0.5em] uppercase font-black">Late Night Session</div>
        <h2 className="text-4xl md:text-5xl serif text-[#2D2D2D] font-light tracking-[0.2em]">交易解憂 Bar</h2>
        <p className="text-[#8C7E6D] text-lg serif italic opacity-80 px-4">「入座。在這裡，盈虧只是過往雲煙。」</p>
      </div>

      {!response && !loading && (
        <div className="space-y-12">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-16 h-[0.5px] bg-[#D1D1C7]"></div>
            <p className="text-xs text-[#8C7E6D] font-mono tracking-[0.4em] uppercase">Drink List</p>
          </div>
          
          <div className="grid grid-cols-1 gap-8">
            {menu.map((item) => (
              <button
                key={item.id}
                onClick={() => orderDrink(item)}
                className="group p-10 bg-white border border-[#D1D1C7]/50 hover:border-[#2D2D2D] hover:shadow-2xl transition-all duration-700 text-left flex justify-between items-center relative overflow-hidden shadow-sm"
              >
                <div className="absolute top-0 left-0 w-1.5 h-0 bg-[#8C635B] group-hover:h-full transition-all duration-700"></div>
                <div className="space-y-3 z-10">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all">{item.icon}</span>
                    {/* ✅ 調酒名稱放大 */}
                    <h3 className="text-2xl serif font-bold text-[#2D2D2D] tracking-tight">{item.name}</h3>
                  </div>
                  {/* ✅ 描述文字放大至 text-base */}
                  <p className="text-base text-[#8C7E6D] serif italic leading-relaxed tracking-wide">{item.description}</p>
                </div>
                <div className="flex flex-col items-end z-10">
                  <span className="text-[11px] font-mono tracking-[0.3em] text-[#D1D1C7] group-hover:text-[#2D2D2D] transition-colors mb-3 font-bold uppercase">ORDER</span>
                  <span className="text-3xl opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">🍸</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="flex-grow flex flex-col items-center justify-center space-y-10 animate-pulse">
          <div className="relative w-28 h-28">
            <div className="absolute inset-0 border-t-2 border-[#8C635B] rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold tracking-[0.4em] text-[#8C635B] uppercase">Mixing</span>
            </div>
          </div>
          <div className="text-center space-y-4">
            <p className="text-lg md:text-xl tracking-[0.5em] text-[#2D2D2D] font-bold uppercase">調酒師正在傾聽你的心跳...</p>
            <p className="text-sm md:text-base text-[#8C7E6D] italic tracking-widest">「當心安靜下來，苦味也會變甘醇。」</p>
          </div>
        </div>
      )}

      {response && (
        <div className="flex-grow animate-fade-in flex flex-col items-center">
          {/* ✅ 解憂內容區塊：放大文字與內距 */}
          <div className="w-full bg-[#2D2D2D] text-white p-12 md:p-20 border border-[#2D2D2D] shadow-2xl relative rounded-sm">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-[#8C635B]"></div>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 border-b border-white/10 pb-8 gap-6">
              <div className="flex items-center gap-4">
                 <span className="w-2.5 h-2.5 rounded-full bg-[#8C635B] animate-pulse"></span>
                 <span className="text-xs font-black uppercase tracking-[0.4em] text-white/60">{selectedDrink} / 完飲</span>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={copyBlessing}
                  className={`text-xs tracking-widest uppercase transition-all border px-5 py-2.5 ${copied ? 'bg-white text-[#2D2D2D] border-white' : 'text-white/40 border-white/20 hover:text-white hover:bg-white/10'}`}
                >
                  {copied ? '已複製祝福' : '複製祝福'}
                </button>
                <button 
                  onClick={() => setResponse(null)} 
                  className="text-xs tracking-widest text-white/40 uppercase hover:text-white transition-all border border-white/20 px-5 py-2.5 hover:bg-white/10"
                >
                  Menu
                </button>
              </div>
            </div>

            {/* ✅ 核心回覆文字：大字級、高行距 */}
            <p className="text-2xl md:text-3xl leading-[1.8] text-white/95 serif italic font-light whitespace-pre-line text-justify tracking-wide">
              {response}
            </p>

            <div className="mt-20 flex flex-col items-center md:items-start space-y-6 pt-12 border-t border-white/5">
              <p className="text-xs tracking-[0.5em] text-white/30 uppercase font-bold">Soul Sommelier Signature</p>
              <div className="w-20 h-20 opacity-30">
                <svg viewBox="0 0 100 100" className="w-full h-full stroke-white fill-none">
                  <path d="M20,50 C20,20 80,20 80,50 C80,80 20,80 20,50 Z" strokeWidth="0.5" />
                  <path d="M40,40 L60,60 M60,40 L40,60" strokeWidth="0.5" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <button 
              onClick={() => setResponse(null)}
              className="px-16 py-5 bg-transparent border border-[#2D2D2D] text-[#2D2D2D] text-sm tracking-[0.6em] font-black uppercase hover:bg-[#2D2D2D] hover:text-white transition-all shadow-xl active:scale-95"
            >
              再喝一杯 Another Round
            </button>
          </div>
        </div>
      )}

      <div className="mt-auto py-12 text-center opacity-40 border-t border-[#D1D1C7]/40">
        <p className="text-xs tracking-[0.3em] font-mono font-bold">DISCLAIMER: NO FINANCIAL ADVICE. ZEN VIBES ONLY.</p>
      </div>
    </div>
  );
};
