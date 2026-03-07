import React, { useMemo } from 'react';

export const ZenDnaChart: React.FC = () => {
  // 生成具備波動感的靜態基礎數據
  const chartData = useMemo(() => {
    const data = [];
    let currentY = 50; 
    const totalSteps = 60; 

    for (let i = 0; i < totalSteps; i++) {
      const volatility = (Math.random() - 0.5) * 4;
      const open = currentY;
      const close = currentY + volatility;
      const high = Math.min(open, close) - Math.random() * 3;
      const low = Math.max(open, close) + Math.random() * 3;

      data.push({
        x: i * 45, 
        open,
        close,
        high,
        low,
        mid: (open + close) / 2
      });

      currentY = close;
      if (currentY < 10) currentY = 15;
      if (currentY > 90) currentY = 85;
    }
    return data;
  }, []);

  const dnaPaths = useMemo(() => {
    if (chartData.length === 0) return { pathA: "", pathB: "" };

    const getPath = (isA: boolean) => {
      let path = `M ${chartData[0].x} ${chartData[0].mid}`;
      for (let i = 1; i < chartData.length; i++) {
        const p = chartData[i];
        const prev = chartData[i - 1];
        const phase = isA ? 0 : Math.PI;
        const yOffset = Math.sin(i * 0.2 + phase) * 18;
        const y = p.mid + yOffset;
        const cpX = (prev.x + p.x) / 2;
        path += ` Q ${cpX} ${y}, ${p.x} ${y}`;
      }
      return path;
    };

    return { pathA: getPath(true), pathB: getPath(false) };
  }, [chartData]);

  return (
    /* ✅ 調整：透明度從 0.15 降至 0.08，讓背景極致安靜 */
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.08] z-0">
      <style>{`
        @keyframes floatWave {
          0% { transform: translateX(0px); }
          50% { transform: translateX(-40px); }
          100% { transform: translateX(0px); }
        }
        @keyframes pulseOpacity {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        .animate-zen-wave {
          animation: floatWave 35s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulseOpacity 12s ease-in-out infinite;
        }
      `}</style>
      
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 2400 100" 
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full animate-zen-wave"
      >
        <g className="animate-pulse-slow">
          {/* ✅ 流動的 DNA 線條：線條變細、顏色更淡 */}
          <path 
            d={dnaPaths.pathA} 
            fill="none" 
            stroke="#2D2D2D" 
            strokeWidth="0.1" 
            strokeDasharray="4 8"
            opacity="0.2"
          />
          <path 
            d={dnaPaths.pathB} 
            fill="none" 
            stroke="#8C7E6D" 
            strokeWidth="0.08" 
            opacity="0.15"
          />

          {/* ✅ 隱約的 K 線波動：捨棄紅綠色，改用統一灰調，減少視覺干擾 */}
          {chartData.map((p, i) => {
            const neutralColor = "#8C7E6D";
            const bodyHeight = Math.max(Math.abs(p.open - p.close), 0.8);
            
            return (
              <g key={`k-${i}`} opacity={0.2}>
                <line x1={p.x} y1={p.high} x2={p.x} y2={p.low} stroke={neutralColor} strokeWidth="0.2" />
                <rect 
                  x={p.x - 2} 
                  y={Math.min(p.open, p.close)} 
                  width="4" 
                  height={bodyHeight} 
                  fill="transparent" 
                  stroke={neutralColor} 
                  strokeWidth="0.15"
                />
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};
