import React from 'react';

export const AboutFace: React.FC = () => {
  const dimensions = [
    {
      id: 'F',
      title: 'Focus 獲利動機',
      description: '追求獵人的快感？還是農夫的安穩？了解核心動機，才能在波動中定錨。',
      icon: 'fa-solid fa-bullseye',
      color: '#A68A64'
    },
    {
      id: 'A',
      title: 'Analysis 決策邏輯',
      description: '依賴冰冷的數據？還是敏銳的直覺？邏輯決定了你在不確定性中的定力。',
      icon: 'fa-solid fa-brain',
      color: '#78716C'
    },
    {
      id: 'C',
      title: 'Cycle 交易週期',
      description: '適合長線的複利？還是短線的衝刺？時間刻度決定了你的心跳節律。',
      icon: 'fa-solid fa-hourglass-half',
      color: '#576B5F'
    },
    {
      id: 'E',
      title: 'Exposure 資金管理',
      description: '習慣重倉一擊必殺？還是分散尋求庇護？行為體現了你對風險的理解。',
      icon: 'fa-solid fa-shield-halved',
      color: '#2D2D2D'
    }
  ];

  const socialLinks = {
    facebook: "https://www.facebook.com/profile.php?id=61585260510757&locale=zh_TW",
    instagram: "https://www.instagram.com/the_trading_post234/",
    threads: "https://www.threads.com/@the_trading_post234?xmt=AQF0L-LuDhBrr-ph13qsPUU4fAPWhMiGrETCyAWw6c6fOHk"
  };

  return (
    <div className="pb-40 fade-in">
      
      {/* 1 & 2. Hero + Mirror System Block */}
      <div className="relative bg-[#F5F5F0] pt-32 pb-32 mb-24 rounded-sm overflow-hidden">
        
        {/* 背景浮水印 */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.12] grayscale select-none flex items-center justify-center">
          <img 
            src="/images/background3.jpg" 
            alt="FACE Background Watermark" 
            className="w-full h-full object-cover object-center scale-105"
          />
        </div>

        {/* 1. Hero Section */}
        <section className="relative z-10 flex flex-col items-center text-center px-6 mb-32">
          <div className="max-w-4xl space-y-10">
            {/* ✅ 放大：text-[10px] -> text-xs (12px) */}
            <p className="serif text-[#8C635B] text-xs tracking-[0.5em] uppercase font-black animate-pulse">Inner Peace Trading</p>
            <h1 className="text-4xl md:text-7xl serif text-[#2D2D2D] font-light leading-tight tracking-tight">
              交易沒有標準答案<br />
              只有<span className="italic font-normal text-[#8C635B]">平靜</span>後的倒影
            </h1>
            <div className="w-12 h-[0.5px] bg-[#8C635B]/30 mx-auto"></div>
            {/* ✅ 放大：text-lg -> text-xl (在手機上更清晰) */}
            <p className="text-xl md:text-2xl text-[#8C7E6D] serif italic max-w-2xl mx-auto leading-relaxed px-4">
              「FACE 系統不是一張成績單，而是一面『後照鏡』。<br />
              當你了解鏡中的自己，市場便不再是戰場，而是一場關於修煉的旅程。」
            </p>
          </div>
        </section>

        {/* 2. FACE Mirror System */}
        <section className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="text-center space-y-6 mb-20">
            <div className="w-[1px] h-16 bg-[#8C635B] mx-auto opacity-40"></div>
            <h2 className="text-3xl serif text-[#2D2D2D] tracking-widest font-bold">看見視線死角</h2>
            <p className="text-lg text-[#8C7E6D] serif italic">透過 FACE 四維光譜，重新認識你的交易體質</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {dimensions.map((dim) => (
              <div key={dim.id} className="group p-10 bg-white border border-[#D1D1C7]/30 hover:border-[#2D2D2D] hover:shadow-2xl transition-all duration-700 text-center space-y-6 rounded-sm">
                <div 
                  className="w-16 h-16 rounded-full bg-[#F5F5F0] flex items-center justify-center mx-auto text-2xl transition-all duration-500 group-hover:text-white"
                  style={{ '--hover-bg': dim.color } as any}
                >
                  <i className={`${dim.icon} transition-colors duration-500 group-hover:text-white`}></i>
                </div>
                <style>{`
                  .group:hover .w-16.h-16 { background-color: ${dim.color}; }
                `}</style>
                <div className="space-y-2">
                  <h3 className="text-2xl serif font-bold text-[#2D2D2D]">{dim.title}</h3>
                </div>
                {/* ✅ 放大：text-[14px] -> text-base (16px) */}
                <p className="text-base leading-relaxed text-[#555] serif italic">
                  {dim.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 3. Founder / NPC Section */}
      <section className="bg-[#E6E6E1]/30 py-24 rounded-sm mb-32">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-16 md:gap-24">
            <div className="w-full md:w-1/2 relative">
              <div className="absolute -top-4 -left-4 w-full h-full border border-[#8C635B]/20 rounded-sm"></div>
              <img 
                src="/images/NPC Bartender.jpg" 
                alt="NPC Bartender" 
                className="relative z-10 w-full grayscale-[0.4] hover:grayscale-0 transition-all duration-1000 rounded-sm shadow-xl"
              />
            </div>
            
            <div className="w-full md:w-1/2 space-y-8">
              <div className="space-y-2">
                {/* ✅ 放大：text-[10px] -> text-sm (14px) */}
                <h4 className="text-[#8C635B] text-sm font-black tracking-[0.4em] uppercase">Founder & Guide</h4>
                <h2 className="text-4xl serif text-[#2D2D2D] leading-tight font-light">
                  我是 NPC，<br />這間解憂 Bar 的 Bartender
                </h2>
              </div>
              
              {/* ✅ 放大：text-lg -> text-xl，提升故事的可讀性 */}
              <div className="space-y-6 text-[#555] serif italic leading-loose text-xl text-justify">
                <p>
                  這個「Bar」與其說是酒吧，不如說是一個讓靈魂休息的茶室。
                  我知道在充滿雜訊的交易世界裡，要始終保持清醒是多麼費力。
                </p>
                <p>
                  我就像一位旁觀的 Bartender，不問你的輸贏，<strong className="text-[#2D2D2D] font-bold">只專注於擦亮手中的杯子。</strong>
                </p>
                <p>
                  這裡沒有焦慮的喊盤聲，只有讓情緒沉澱的精油香氣。
                  我想提供一個安靜的角落，陪你過濾掉多餘的雜訊，去蕪存菁。
                </p>
              </div>
              
              <div className="pt-8 border-t border-[#D1D1C7]/50">
                <p className="serif italic text-2xl text-[#2D2D2D] font-medium">「累的時候，歡迎光臨。」</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Footer Section */}
      <section className="bg-[#2D2D2D] py-32 text-center px-6 rounded-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#8C635B]"></div>
        <div className="relative z-10 space-y-12">
          <div className="space-y-4">
            <p className="text-white/40 serif italic tracking-[0.2em] text-xl">追蹤社群，領取每日『解酒錠』</p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-2xl mx-auto">
            {/* ✅ 優化：text-[11px] -> text-xs，增加按鈕點擊感 */}
            <a 
              href={socialLinks.facebook} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 py-4 px-6 bg-transparent border border-white/20 text-white text-xs tracking-[0.4em] uppercase font-black hover:bg-white hover:text-[#2D2D2D] transition-all flex items-center justify-center gap-3"
            >
              <i className="fa-brands fa-facebook-f text-lg"></i> Facebook
            </a>
            <a 
              href={socialLinks.instagram} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 py-4 px-6 bg-white text-[#2D2D2D] text-xs tracking-[0.4em] uppercase font-black hover:bg-[#8C635B] hover:text-white transition-all shadow-xl flex items-center justify-center gap-3"
            >
              <i className="fa-brands fa-instagram text-lg"></i> Instagram
            </a>
            <a 
              href={socialLinks.threads} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 py-4 px-6 bg-transparent border border-white/20 text-white text-xs tracking-[0.4em] uppercase font-black hover:bg-white hover:text-[#2D2D2D] transition-all flex items-center justify-center gap-3"
            >
              <i className="fa-brands fa-threads text-lg"></i> Threads
            </a>
          </div>

          <div className="pt-20 border-t border-white/5 space-y-6">
            <div className="flex items-center justify-center gap-3 opacity-30">
              <span className="w-8 h-[1px] bg-white"></span>
              <span className="serif font-bold text-base tracking-[0.3em] text-white">交易解憂 Bar</span>
              <span className="w-8 h-[1px] bg-white"></span>
            </div>
            <p className="text-xs text-white/20 font-mono tracking-widest uppercase">© 2024 Trading Solace Bar. All rights reserved.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
