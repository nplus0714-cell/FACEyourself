
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
        請針對他的內心苦楚提供禪宗式的指引：${item.prompt}
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
    const shareUrl = "https://guileless-sopapillas-e84b99.netlify.app";
    const fullText = `我在「交易解憂 Bar」點了一杯【${selectedDrink}】，大師說：\n\n「${response}」\n\n測測看你的投資靈魂 DNA：${shareUrl}`;
    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-16 fade-in min-h-[80vh] flex flex-col">
      <div className="text-center space-y-4">
        <div className="inline-block px-3 py-1 border border-[#8C635B] text-[#8C635B] text-[8px] tracking-[0.5em] uppercase font-black">Late Night Session</div>
        <h2 className="text-4xl serif text-[#2D2D2D] font-light tracking-widest">交易解憂 Bar</h2>
        <p className="text-[#8C7E6D] text-[15px] serif italic opacity-80">「入座。在這裡，盈虧只是過往雲煙。」</p>
      </div>

      {!response && !loading && (
        <div className="space-y-10">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-[1px] bg-[#D1D1C7]"></div>
            <p className="text-[12px] text-[#8C7E6D] font-mono tracking-[0.3em] uppercase">Drink List</p>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {menu.map((item) => (
              <button
                key={item.id}
                onClick={() => orderDrink(item)}
                className="group p-8 bg-white border border-[#D1D1C7]/40 hover:border-[#2D2D2D] hover:shadow-2xl transition-all duration-700 text-left flex justify-between items-center relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-0 bg-[#8C635B] group-hover:h-full transition-all duration-700"></div>
                <div className="space-y-2 z-10">
                  <div className="flex items-center gap-3">
                    <span className="text-xl opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all">{item.icon}</span>
                    <h3 className="text-xl serif font-bold text-[#2D2D2D] tracking-tight">{item.name}</h3>
                  </div>
                  <p className="text-[13px] text-[#8C7E6D] serif italic leading-relaxed">{item.description}</p>
                </div>
                <div className="flex flex-col items-end z-10">
                  <span className="text-[9px] font-mono tracking-widest text-[#D1D1C7] group-hover:text-[#2D2D2D] transition-colors mb-2">ORDER</span>
                  <span className="text-2xl opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">🍸</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="flex-grow flex flex-col items-center justify-center space-y-8 animate-pulse">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 border-t-2 border-[#8C635B] rounded-full animate-spin"></div>
            <div className="absolute inset-4 border-b-2 border-[#2D2D2D]/20 rounded-full animate-spin-reverse" style={{ animationDirection: 'reverse' }}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] font-bold tracking-widest text-[#8C635B] uppercase">Mixing</span>
            </div>
          </div>
          <div className="text-center space-y-2">
            <p className="text-[14px] tracking-[0.6em] text-[#2D2D2D] font-bold uppercase">調酒師正在傾聽你的心跳...</p>
            <p className="text-[11px] text-[#8C7E6D] italic">「當心安靜下來，苦味也會變甘醇。」</p>
          </div>
        </div>
      )}

      {response && (
        <div className="flex-grow animate-fade-in flex flex-col items-center">
          <div className="w-full bg-[#2D2D2D] text-white p-10 md:p-16 border border-[#2D2D2D] shadow-2xl relative rounded-sm">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#8C635B]"></div>
            
            <div className="flex justify-between items-center mb-10 border-b border-white/10 pb-6">
              <div className="flex items-center gap-3">
                 <span className="w-2 h-2 rounded-full bg-[#8C635B] animate-pulse"></span>
                 <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/60">{selectedDrink} / 完飲</span>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={copyBlessing}
                  className={`text-[10px] tracking-widest uppercase transition-all border px-4 py-1.5 ${copied ? 'bg-white text-[#2D2D2D] border-white' : 'text-white/40 border-white/20 hover:text-white hover:bg-white/10'}`}
                >
                  {copied ? '已複製祝福' : '複製祝福文案'}
                </button>
                <button 
                  onClick={() => setResponse(null)} 
                  className="text-[10px] tracking-widest text-white/40 uppercase hover:text-white transition-all border border-white/20 px-4 py-1.5 hover:bg-white/10"
                >
                  返回 Menu
                </button>
              </div>
            </div>

            <p className="text-xl md:text-2xl leading-relaxed text-white/95 serif italic font-medium whitespace-pre-line text-center md:text-left">
              {response}
            </p>

            <div className="mt-16 flex flex-col items-center md:items-start space-y-4 pt-10 border-t border-white/5">
              <p className="text-[10px] tracking-[0.4em] text-white/30 uppercase font-black">Soul Sommelier Signature</p>
              <div className="w-16 h-16 opacity-40">
                <svg viewBox="0 0 100 100" className="w-full h-full stroke-white fill-none">
                  <path d="M20,50 C20,20 80,20 80,50 C80,80 20,80 20,50 Z" strokeWidth="0.5" />
                  <path d="M40,40 L60,60 M60,40 L40,60" strokeWidth="0.5" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <button 
              onClick={() => setResponse(null)}
              className="px-12 py-4 bg-transparent border border-[#2D2D2D] text-[#2D2D2D] text-[12px] tracking-[0.5em] font-black uppercase hover:bg-[#2D2D2D] hover:text-white transition-all shadow-lg"
            >
              再喝一杯 Another Round
            </button>
          </div>
        </div>
      )}

      <div className="mt-auto py-10 text-center opacity-40 border-t border-[#D1D1C7]/30">
        <p className="text-[9px] tracking-[0.2em] font-mono font-bold">DISCLAIMER: NO FINANCIAL ADVICE. ZEN VIBES ONLY.</p>
      </div>
    </div>
  );
};
