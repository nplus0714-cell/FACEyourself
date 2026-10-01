import React from 'react';

interface MemberWorkspaceProps {
  userName: string;
  hasAssessmentResult: boolean;
  onViewResult: () => void;
  onStartTest: () => void;
  onOpenGuide: () => void;
  onOpenContent: () => void;
  onOpenGallery: () => void;
  onOpenMirrorTrade: () => void;
}

export const MemberWorkspace: React.FC<MemberWorkspaceProps> = ({
  userName,
  hasAssessmentResult,
  onViewResult,
  onStartTest,
  onOpenGuide,
  onOpenContent,
  onOpenGallery,
  onOpenMirrorTrade,
}) => (
  <div className="mx-auto max-w-5xl pb-24 fade-in">
    <header className="border border-[#D1D1C7] bg-[#FCFBF8] px-7 py-10 sm:px-11 sm:py-14">
      <p className="text-xs font-bold tracking-[0.2em] text-[#8C635B]">FACE Trader · 知己交易</p>
      <h1 className="mt-4 serif text-4xl leading-[1.4] text-[#2D2D2D] sm:text-5xl">{userName}，從你的 FACE 繼續</h1>
      <p className="mt-5 max-w-2xl text-base leading-8 text-[#70665D]">公開測驗是起點；登入後，你會在同一份結果上看到完整人格分析，並接著閱讀指南與探索其他已開放內容。</p>
      <button type="button" onClick={hasAssessmentResult ? onViewResult : onStartTest} className="mt-7 min-h-12 bg-[#4A382D] px-7 py-3 text-sm font-bold text-white transition hover:bg-[#34261F]">
        {hasAssessmentResult ? '查看我的完整人格分析 →' : '先完成 FACE 測驗 →'}
      </button>
    </header>

    <section className="mt-9" aria-labelledby="member-path-title">
      <h2 id="member-path-title" className="serif text-3xl text-[#2D2D2D]">接著可以做什麼？</h2>
      <div className="mt-5 grid gap-px border border-[#D1D1C7] bg-[#D1D1C7] sm:grid-cols-2">
        {[
          { number: '01', title: '交易生存指南', description: '延續測驗看見的模式，從破繭與生存走向可用的交易原則。', action: onOpenGuide },
          { number: '02', title: '人格圖鑑', description: '認識你的類型，也比較其他交易人格的優勢與盲點。', action: onOpenGallery },
          { number: '03', title: '文章與頻道', description: '從同一份指南文章出發，延伸閱讀交易心理與決策主題。', action: onOpenContent },
          { number: '04', title: 'RATE 鏡相診股', description: '回到原本的進階探索功能，檢視它如何接上你的 FACE 結果。', action: onOpenMirrorTrade },
        ].map((item) => <button key={item.number} type="button" onClick={item.action} className="bg-white p-6 text-left transition hover:bg-[#F7F4EF] sm:p-8"><p className="font-mono text-xs text-[#9A6D62]">{item.number}</p><h3 className="mt-3 serif text-2xl text-[#2D2D2D]">{item.title}</h3><p className="mt-3 text-sm leading-7 text-[#70665D]">{item.description}</p><span className="mt-5 inline-block border-b border-[#4A382D] pb-1 text-sm font-bold text-[#4A382D]">前往查看 →</span></button>)}
      </div>
    </section>

    <section className="mt-9 border border-[#D1D1C7] bg-[#F7F4EF] px-6 py-7 sm:px-9">
      <p className="text-xs font-bold tracking-[0.18em] text-[#8C635B]">仍在建置</p>
      <h2 className="mt-3 serif text-2xl text-[#2D2D2D]">日記與交易道具</h2>
      <p className="mt-3 text-sm leading-7 text-[#70665D]">自我覺察日記目前暫停開放；交易計畫卡、計算器等舊版頁面也仍是功能佔位。它們會沿用你的 FACE 結果接續擴充，不會另做一套不相干的測驗。</p>
    </section>
  </div>
);
