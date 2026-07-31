import React, { useState, useMemo, useEffect } from 'react';
import Markdown from 'react-markdown';
import { 
  ResponsiveContainer, Tooltip, Legend, 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { 
  Wallet, LayoutDashboard, Info, 
  RotateCcw, Gauge, Layers, Calculator,
  TrendingUp, TrendingDown, Target, Globe, Factory,
  ArrowRight, AlertCircle, CheckCircle2, XCircle, FilterX, Sparkles, Search, X, ShieldAlert, PieChart, Activity, Upload, FileSpreadsheet
} from 'lucide-react';

export const MirrorTradeDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState('risk'); 
  const [totalCapital, setTotalCapital] = useState(5000000);
  const [compareTarget, setCompareTarget] = useState('market'); 
  const [enabledIds, setEnabledIds] = useState<string[]>([]);
  
  // 推薦彈窗狀態
  const [recModalData, setRecModalData] = useState<any>(null);
  const [selectedIndicator, setSelectedIndicator] = useState<string | null>(null);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [categoryPopularity, setCategoryPopularity] = useState<Record<string, number>>({});
  
  // 導入持股狀態
  const [importModalOpen, setImportModalOpen] = useState(false);
  
  const COLORS = ['#97A97C', '#B4A7AF', '#D4A373', '#89B0AE', '#E28E8E'];

  // 擴充版資料庫 (加入更多標的以供 AI 推薦搜尋)
  const stockDatabase = [
    { id: '6830', name: '汎銓', price: 192.5, sector: '半導體檢測', beta: 1.45, eps: 6.82, pe: 28.2, marketCap: 14.2, momentum: 85, bias5: 3.5, bias60: 12.2, bias240: 18.5, indMom: 85, stockMom: 75 },
    { id: '6451', name: '訊芯-KY', price: 238.0, sector: 'CPO封裝', beta: 1.65, eps: 5.12, pe: 46.5, marketCap: 25.4, momentum: 92, bias5: -1.2, bias60: 15.8, bias240: 22.1, indMom: 85, stockMom: 65 },
    { id: '5243', name: '乙盛-KY', price: 68.4, sector: '車用/衛星', beta: 0.88, eps: 3.45, pe: 19.8, marketCap: 11.5, momentum: 65, bias5: 1.5, bias60: 4.2, bias240: 8.5, indMom: 70, stockMom: 60 },
    { id: '3305', name: '昇貿', price: 109.5, sector: '電子材料', beta: 1.25, eps: 4.10, pe: 26.7, marketCap: 14.8, momentum: 78, bias5: 0.5, bias60: 2.1, bias240: 5.2, indMom: 65, stockMom: 70 },
    { id: '5439', name: '高技', price: 112.0, sector: '高階PCB', beta: 1.18, eps: 5.92, pe: 18.9, marketCap: 10.2, momentum: 72, bias5: 2.1, bias60: 5.5, bias240: 12.0, indMom: 75, stockMom: 80 },
    // 隱藏推薦池
    { id: '2330', name: '台積電', price: 780.0, sector: '晶圓代工', beta: 1.15, eps: 32.34, pe: 24.1, marketCap: 202.5, momentum: 88, bias5: 1.5, bias60: 5.2, bias240: 15.5, indMom: 80, stockMom: 85 },
    { id: '3017', name: '奇鋐', price: 540.0, sector: '散熱模組', beta: 1.55, eps: 14.11, pe: 38.2, marketCap: 28.5, momentum: 90, bias5: 4.5, bias60: 18.2, bias240: 25.5, indMom: 90, stockMom: 85 },
    { id: '3231', name: '緯創', price: 120.5, sector: 'AI伺服器', beta: 1.35, eps: 4.08, pe: 29.5, marketCap: 35.0, momentum: 75, bias5: -2.5, bias60: 8.2, bias240: 12.5, indMom: 75, stockMom: 70 },
    { id: '2303', name: '聯電', price: 52.5, sector: '晶圓代工', beta: 0.95, eps: 4.93, pe: 10.6, marketCap: 65.2, momentum: 55, bias5: -1.5, bias60: -4.2, bias240: 2.5, indMom: 60, stockMom: 50 },
    { id: '3583', name: '辛耘', price: 285.0, sector: '半導體檢測', beta: 1.48, eps: 7.10, pe: 40.1, marketCap: 18.5, momentum: 86, bias5: 5.5, bias60: 15.2, bias240: 22.5, indMom: 85, stockMom: 80 },
    { id: '6274', name: '台燿', price: 155.0, sector: '高階PCB', beta: 1.20, eps: 7.05, pe: 22.0, marketCap: 15.6, momentum: 70, bias5: 2.5, bias60: 8.2, bias240: 15.5, indMom: 70, stockMom: 65 },
    { id: '1560', name: '中砂', price: 305.0, sector: '半導體設備', beta: 1.38, eps: 6.85, pe: 44.5, marketCap: 16.8, momentum: 82, bias5: 3.5, bias60: 12.2, bias240: 18.5, indMom: 80, stockMom: 75 },
    { id: '3037', name: '欣興', price: 180.0, sector: 'IC載板', beta: 1.4, eps: 8.5, pe: 21.1, marketCap: 25.5, momentum: 80, bias5: 2.5, bias60: 10.2, bias240: 15.5, indMom: 80, stockMom: 75 },
    { id: '3189', name: '景碩', price: 105.0, sector: 'IC載板', beta: 1.2, eps: 5.5, pe: 19.1, marketCap: 15.5, momentum: 70, bias5: 1.5, bias60: 5.2, bias240: 10.5, indMom: 70, stockMom: 65 },
    { id: '8046', name: '南電', price: 250.0, sector: 'IC載板', beta: 1.5, eps: 12.5, pe: 20.0, marketCap: 30.5, momentum: 85, bias5: 3.5, bias60: 15.2, bias240: 20.5, indMom: 85, stockMom: 80 },
    { id: '2313', name: '華通', price: 80.0, sector: 'PCB', beta: 1.1, eps: 4.5, pe: 17.7, marketCap: 12.5, momentum: 75, bias5: 1.5, bias60: 5.2, bias240: 10.5, indMom: 75, stockMom: 70 },
    { id: '2368', name: '金像電', price: 220.0, sector: 'PCB', beta: 1.6, eps: 10.5, pe: 20.9, marketCap: 28.5, momentum: 90, bias5: 4.5, bias60: 18.2, bias240: 25.5, indMom: 90, stockMom: 85 },
    { id: '3044', name: '健鼎', price: 210.0, sector: 'PCB', beta: 1.3, eps: 11.5, pe: 18.2, marketCap: 25.5, momentum: 80, bias5: 2.5, bias60: 10.2, bias240: 15.5, indMom: 80, stockMom: 75 },
    { id: '4958', name: '臻鼎-KY', price: 120.0, sector: 'PCB', beta: 1.2, eps: 8.5, pe: 14.1, marketCap: 18.5, momentum: 70, bias5: 1.5, bias60: 5.2, bias240: 10.5, indMom: 70, stockMom: 65 },
    { id: '2383', name: '台光電', price: 450.0, sector: '銅箔基板', beta: 1.7, eps: 20.5, pe: 21.9, marketCap: 40.5, momentum: 95, bias5: 5.5, bias60: 20.2, bias240: 30.5, indMom: 95, stockMom: 90 },
    { id: '6213', name: '聯茂', price: 110.0, sector: '銅箔基板', beta: 1.3, eps: 6.5, pe: 16.9, marketCap: 15.5, momentum: 75, bias5: 2.5, bias60: 8.2, bias240: 12.5, indMom: 75, stockMom: 70 },
    { id: '6672', name: '騰輝電子-KY', price: 130.0, sector: '銅箔基板', beta: 1.2, eps: 8.5, pe: 15.2, marketCap: 12.5, momentum: 70, bias5: 1.5, bias60: 5.2, bias240: 10.5, indMom: 70, stockMom: 65 },
    { id: '3450', name: '聯鈞', price: 180.0, sector: '光通訊', beta: 1.5, eps: 6.5, pe: 27.6, marketCap: 18.5, momentum: 85, bias5: 3.5, bias60: 15.2, bias240: 20.5, indMom: 85, stockMom: 80 },
    { id: '4979', name: '華星光', price: 140.0, sector: '光通訊', beta: 1.4, eps: 5.5, pe: 25.4, marketCap: 15.5, momentum: 80, bias5: 2.5, bias60: 10.2, bias240: 15.5, indMom: 80, stockMom: 75 },
    { id: '3163', name: '波若威', price: 120.0, sector: '光通訊', beta: 1.3, eps: 4.5, pe: 26.6, marketCap: 12.5, momentum: 75, bias5: 1.5, bias60: 5.2, bias240: 10.5, indMom: 75, stockMom: 70 },
    { id: '3081', name: '聯亞', price: 150.0, sector: '光通訊', beta: 1.4, eps: 6.5, pe: 23.0, marketCap: 15.5, momentum: 80, bias5: 2.5, bias60: 10.2, bias240: 15.5, indMom: 80, stockMom: 75 },
    { id: '1536', name: '和大', price: 70.0, sector: '汽車零組件', beta: 1.1, eps: 3.5, pe: 20.0, marketCap: 12.5, momentum: 70, bias5: 1.5, bias60: 5.2, bias240: 10.5, indMom: 70, stockMom: 65 },
    { id: '2231', name: '為升', price: 150.0, sector: '車用電子', beta: 1.2, eps: 8.5, pe: 17.6, marketCap: 18.5, momentum: 75, bias5: 2.5, bias60: 8.2, bias240: 12.5, indMom: 75, stockMom: 70 },
    { id: '6279', name: '胡連', price: 160.0, sector: '汽車零組件', beta: 1.3, eps: 9.5, pe: 16.8, marketCap: 20.5, momentum: 80, bias5: 3.5, bias60: 10.2, bias240: 15.5, indMom: 80, stockMom: 75 },
    { id: '1319', name: '東陽', price: 110.0, sector: '汽車零組件', beta: 1.0, eps: 6.5, pe: 16.9, marketCap: 15.5, momentum: 70, bias5: 1.5, bias60: 5.2, bias240: 10.5, indMom: 70, stockMom: 65 },
    { id: '2317', name: '鴻海', price: 150.0, sector: 'EMS', beta: 1.1, eps: 10.5, pe: 14.2, marketCap: 200.5, momentum: 80, bias5: 2.5, bias60: 8.2, bias240: 15.5, indMom: 80, stockMom: 75 },
    { id: '4938', name: '和碩', price: 100.0, sector: 'EMS', beta: 1.0, eps: 6.5, pe: 15.3, marketCap: 50.5, momentum: 70, bias5: 1.5, bias60: 5.2, bias240: 10.5, indMom: 70, stockMom: 65 },
    { id: '2324', name: '仁寶', price: 40.0, sector: '筆記型電腦', beta: 0.9, eps: 2.5, pe: 16.0, marketCap: 20.5, momentum: 65, bias5: 0.5, bias60: 2.2, bias240: 5.5, indMom: 65, stockMom: 60 },
    { id: '3231', name: '緯創', price: 120.0, sector: '筆記型電腦', beta: 1.3, eps: 4.5, pe: 26.6, marketCap: 35.5, momentum: 75, bias5: 2.5, bias60: 8.2, bias240: 12.5, indMom: 75, stockMom: 70 },
  ];

  // 載入 CSV 資料
  useEffect(() => {
    const loadCsvData = async () => {
      try {
        const response = await fetch('/data.csv');
        if (response.ok) {
          const text = await response.text();
          const rows = text.split('\n').map(row => row.split(','));
          const headers = rows[0];
          const data = rows.slice(1).map(row => {
            const obj: any = {};
            headers.forEach((header, i) => {
              obj[header.trim()] = row[i]?.trim();
            });
            return obj;
          }).filter(row => row.stock_id); // 過濾掉空行
          setCsvData(data);

          // 計算各產業/概念的熱門程度 (出現次數)
          const pop: Record<string, number> = {};
          data.forEach(row => {
            if (row.concept_name) {
              pop[row.concept_name] = (pop[row.concept_name] || 0) + 1;
            }
          });
          setCategoryPopularity(pop);
        } else {
          console.error("Failed to load CSV data");
        }
      } catch (error) {
        console.error("Error loading CSV data:", error);
      }
    };
    loadCsvData();
  }, []);

  const benchmarkData: any = {
    market: { name: '全大盤加權', beta: 1.00, marketCap: 45.0, pe: 18.5, eps: 4.20, momentum: 70 },
    industry: { name: '相關產業', beta: 1.28, marketCap: 32.0, pe: 24.5, eps: 5.10, momentum: 82 }
  };

  const [stocksState, setStocksState] = useState<any[]>([]);

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const rows = text.split('\n').map(row => row.trim()).filter(row => row);
      if (rows.length <= 1) {
        alert('CSV 檔案格式錯誤或無資料');
        return;
      }

      const headers = rows[0].split(',').map(h => h.trim());
      const idIndex = headers.findIndex(h => h.includes('代號') || h.includes('ID') || h.includes('id') || h.includes('stock_id'));
      const nameIndex = headers.findIndex(h => h.includes('名稱') || h.includes('Name') || h.includes('name'));
      const weightIndex = headers.findIndex(h => h.includes('權重') || h.includes('銓重') || h.includes('比例') || h.includes('Weight') || h.includes('weight'));
      
      const extractedStocks = rows.slice(1).map(row => {
        const cols = row.split(',');
        const parsedWeight = weightIndex !== -1 ? parseFloat(cols[weightIndex]) : null;
        return {
          id: idIndex !== -1 ? cols[idIndex]?.trim() : null,
          name: nameIndex !== -1 ? cols[nameIndex]?.trim() : null,
          weight: !isNaN(parsedWeight as number) ? parsedWeight : null
        };
      }).filter(s => s.id || s.name);

      if (extractedStocks.length > 0) {
        const hasExplicitWeights = extractedStocks.some(s => s.weight !== null);
        
        let newStocks = extractedStocks.map((es, index) => {
          const existing = stockDatabase.find(s => s.id === es.id || s.name === es.name);
          const baseStock = existing || {
            id: es.id || `MOCK${index}`,
            name: es.name || '未知標的',
            price: 100,
            sector: '未知',
            beta: 1.0,
            eps: 5.0,
            pe: 15.0,
            marketCap: 20.0,
            momentum: 50,
            bias5: 0,
            bias60: 0,
            bias240: 0,
            indMom: 50,
            stockMom: 50
          };
          
          return {
            ...baseStock,
            targetWeight: es.weight !== null ? es.weight : 0,
            manualPrice: undefined,
            shares: undefined
          };
        });

        if (hasExplicitWeights) {
          // 正規化權重至 100
          const totalWeight = newStocks.reduce((sum, s) => sum + s.targetWeight, 0);
          if (totalWeight > 0) {
            newStocks = newStocks.map(s => ({
              ...s,
              targetWeight: Math.round((s.targetWeight / totalWeight) * 100)
            }));
            // 修正四捨五入誤差
            const currentSum = newStocks.reduce((sum, s) => sum + s.targetWeight, 0);
            if (currentSum !== 100 && newStocks.length > 0) {
              newStocks[0].targetWeight += (100 - currentSum);
            }
          }
        } else {
          // 均分權重
          const weightPerStock = Math.floor(100 / newStocks.length);
          const remainder = 100 - (weightPerStock * newStocks.length);
          newStocks = newStocks.map((s, i) => ({
            ...s,
            targetWeight: i === 0 ? weightPerStock + remainder : weightPerStock
          }));
        }

        setStocksState(newStocks);
        setEnabledIds(newStocks.map(s => s.id));
        setImportModalOpen(false);
      } else {
        alert('無法解析出股票資訊，請確認 CSV 內容。');
      }
    };
    reader.readAsText(file);
  };

  // --- 輔助函數：將 Raw Data 轉換為 0-100 分數 ---
  const scaleData = (val: number, min: number, max: number, inverse = false) => {
    let score = ((val - min) / (max - min)) * 100;
    if (inverse) score = 100 - score;
    return Math.max(0, Math.min(100, Math.round(score)));
  };

  // --- 標的性格分類引擎 (AI 基因標籤) ---
  const getStockTags = (s: any) => {
    return {
      marketCap: s.marketCap >= 20 ? { label: '大型股', type: 'mc' } : s.marketCap >= 10 ? { label: '中型股', type: 'mc' } : { label: '小型股', type: 'mc' },
      beta: s.beta >= 1.2 ? { label: '高波動', type: 'beta' } : s.beta >= 0.8 ? { label: '中波動', type: 'beta' } : { label: '低波動', type: 'beta' },
      pe: s.pe >= 30 ? { label: '高估值(動能)', type: 'pe' } : s.pe >= 15 ? { label: '合理估值', type: 'pe' } : { label: '低估值(價值)', type: 'pe' },
      eps: s.eps >= 5 ? { label: '高獲利', type: 'eps' } : s.eps >= 2 ? { label: '穩健獲利', type: 'eps' } : { label: '低獲利', type: 'eps' },
      momentum: s.momentum >= 80 ? { label: '強勢動能', type: 'mo' } : s.momentum >= 60 ? { label: '溫和動能', type: 'mo' } : { label: '弱勢動能', type: 'mo' },
    };
  };

  // --- 尋找相似標的邏輯 (族群加權 60%、上下游供應鏈/基本面 40%) ---
  const findSimilarStocks = (targetStock: any) => {
    const targetTags = getStockTags(targetStock);
    const targetRows = csvData.filter(row => row.stock_id === targetStock.id);
    const targetIndustries = targetRows.filter(r => r.group_type === '產業').map(r => r.concept_name);
    const targetConcepts = targetRows.filter(r => r.group_type === '概念').map(r => r.concept_name);

    // 取得所有 CSV 與內建資料庫中的唯一股票 ID
    const csvStockIds = csvData.map(r => r.stock_id);
    const dbStockIds = stockDatabase.map(s => s.id);
    const uniqueStockIds = Array.from(new Set([...csvStockIds, ...dbStockIds])).filter(id => id !== targetStock.id);

    let scoredStocks = uniqueStockIds.map(id => {
      const candRows = csvData.filter(r => r.stock_id === id);
      let dbStock = stockDatabase.find(s => s.id === id);
      
      const candName = candRows[0]?.stock_name || dbStock?.name || '未知';
      let candIndustries = candRows.filter(r => r.group_type === '產業').map(r => r.concept_name);
      const candConcepts = candRows.filter(r => r.group_type === '概念').map(r => r.concept_name);

      if (candIndustries.length === 0 && dbStock && dbStock.sector) {
        candIndustries = [dbStock.sector];
      }

      // 1. 族群加權 (佔比 80%)：大幅提高權重，同產業給 50 分，同概念給 30 分
      const sharedInd = candIndustries.filter(ind => targetIndustries.includes(ind));
      const sharedCon = candConcepts.filter(con => targetConcepts.includes(con));
      
      let groupScore = (sharedInd.length * 50) + (sharedCon.length * 30);
      groupScore = Math.min(80, groupScore); // 最高 80 分

      // 2. 上下游供應鏈/基本面基因加權 (佔比 20%)
      if (!dbStock) {
         dbStock = {
           id, name: candName,
           price: (parseInt(id) % 500) + 10,
           beta: (parseInt(id) % 150) / 100 + 0.5,
           marketCap: (parseInt(id) % 200) + 10,
           pe: (parseInt(id) % 40) + 10,
           eps: (parseInt(id) % 200) / 10,
           momentum: (parseInt(id) % 60) + 40,
           sector: candIndustries[0] || candConcepts[0] || '未知',
           bias5: 0, bias60: 0, bias240: 0, indMom: 50, stockMom: 50
         };
      }
      
      const candTags = getStockTags(dbStock);
      let fundScore = 0;
      const geneticTagsDisplay: any[] = [];
      
      Object.keys(candTags).forEach(key => {
        const cTag = (candTags as any)[key].label;
        const tTag = (targetTags as any)[key].label;
        const isMatch = cTag === tTag;
        if (isMatch) fundScore += 4;
        geneticTagsDisplay.push({ label: cTag, isMatch });
      });

      const totalScore = groupScore + fundScore;

      let reasonParts = [];
      if (sharedInd.length > 0) reasonParts.push(`同產業(${sharedInd[0]})`);
      else if (sharedCon.length > 0) reasonParts.push(`同概念(${sharedCon[0]})`);
      else reasonParts.push(`上下游供應鏈`);

      const allSharedCats = [...sharedInd, ...sharedCon].sort((a, b) => (categoryPopularity[b] || 0) - (categoryPopularity[a] || 0));

      return {
        id,
        name: candName,
        sector: candIndustries[0] || candConcepts[0] || '未知',
        score: totalScore,
        groupScore,
        fundScore,
        sharedIndCount: sharedInd.length,
        matchedTags: allSharedCats.slice(0, 3), 
        geneticTagsDisplay, 
        matchReason: reasonParts.join('、'),
        pe: typeof dbStock.pe === 'number' ? dbStock.pe.toFixed(1) : dbStock.pe,
        momentum: dbStock.momentum
      };
    });

    scoredStocks = (scoredStocks.filter(s => s !== null) as any[])
      .filter(s => s.score > 0)
      .sort((a, b) => {
        if (b.sharedIndCount !== a.sharedIndCount) {
          return b.sharedIndCount - a.sharedIndCount;
        }
        return b.score - a.score;
      })
      .slice(0, 10);

    setRecModalData({ 
      target: targetStock, 
      tags: targetTags, 
      industries: targetIndustries,
      concepts: targetConcepts,
      recommendations: scoredStocks 
    });
  };

  const renderCustomTick = (props: any) => {
    const { x, y, payload } = props;
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={4}
          textAnchor="middle"
          fill="#5D5D5A"
          className="text-[10px] font-black uppercase tracking-widest"
        >
          {payload.value}
        </text>
      </g>
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#97A97C'; // 綠色 (優)
    if (score >= 60) return '#89B0AE'; // 青色 (良)
    if (score >= 40) return '#D4A373'; // 橘色 (中)
    return '#E28E8E'; // 紅色 (警示)
  };

  const getIndicatorStatus = (key: string, score: number) => {
    if (key === '風險偏好') return score >= 60 ? '高 (積極型)' : score >= 40 ? '中 (穩健型)' : '低 (保守型)';
    if (key === '價值信念') return score >= 60 ? '成長型' : score >= 40 ? '均衡型' : '價值型';
    if (key === '集散程度') return score >= 60 ? '分散 (安全)' : score >= 40 ? '適度' : '集中 (風險)';
    if (key === '趨勢強弱') return score >= 60 ? '強勢 (多頭)' : score >= 40 ? '中性' : '疲弱 (修正)';
    if (key === '產業強弱') return score >= 60 ? '主流 (熱點)' : score >= 40 ? '穩健' : '非主流 (冷門)';
    return '未知';
  };

  const getIndicatorAnalysis = (key: string, score: number, portfolioAvg: any) => {
    if (key === '風險偏好') {
      const capType = portfolioAvg.marketCap >= 20 ? '大型股' : portfolioAvg.marketCap >= 10 ? '中型股' : '中小型股';
      if (score >= 60) return `目前持股屬於「積極型」，偏向${capType}配置，具備高爆發力與較高的市場連動性。`;
      if (score >= 40) return `目前持股屬於「穩健型」，以${capType}為主，波動與大盤同步，具備長期增值潛力。`;
      return `目前持股屬於「保守型」，以權值${capType}為主，防禦性極佳，適合在市場動盪時保全資產。`;
    }
    if (key === '價值信念') {
      if (score >= 60) return `目前持股屬於「成長型」，市場給予較高估值溢價，看重未來獲利動能而非當前便宜與否。`;
      if (score >= 40) return `目前持股屬於「均衡型」，財務穩健且獲利能力與估值水位處於相對合理的平衡區間。`;
      return `目前持股屬於「價值型」，財務極度穩健且具備高安全邊際，目前股價處於相對低估值的價值區。`;
    }
    if (key === '集散程度') {
      if (score >= 60) return `目前持股屬於「分散配置」，有效降低了單一標的或特定產業波動對整體資產的衝擊。`;
      if (score >= 40) return `目前持股屬於「適度配置」，核心持股明確且產業分佈均衡，兼顧了風險控管與獲利效率。`;
      return `目前持股屬於「集中配置」，風險較高但資金利用率極大，具備極強的獲利爆發力與轉向靈活性。`;
    }
    if (key === '趨勢強弱') {
      if (score >= 60) return `目前持股屬於「短期動能型」，股價處於強勢噴發階段，適合順勢交易或短波段的積極操作。`;
      if (score >= 40) return `目前持股屬於「波段趨勢型」，中期趨勢穩健向上，適合中線佈局並持有至趨勢反轉。`;
      return `目前持股屬於「長期投資型」，股價處於低基期或修正探底期，需以長線眼光耐心等待價值回歸。`;
    }
    if (key === '產業強弱') {
      if (score >= 60) return `目前持股處於「市場主流熱點」，資金關注度極高，是當前盤面上的領漲核心族群。`;
      if (score >= 40) return `目前持股處於「產業輪動區」，基本面支撐穩健，等待市場資金輪動回流帶動表現。`;
      return `目前持股處於「產業冷門/調整期」，市場關注度較低，需警惕流動性風險或等待產業景氣循環轉向。`;
    }
    return '';
  };

  // 核心計算邏輯
  const portfolioData = useMemo(() => {
    const activeRaw = stocksState.filter(s => enabledIds.includes(s.id));
    const activeCount = activeRaw.length;
    const totalEnabledWeight = activeRaw.reduce((sum, s) => sum + s.targetWeight, 0);

    let currentTotalValue = 0;
    const finalStocks = activeRaw.map(stock => {
      const p = stock.manualPrice || stock.price;
      const effectiveWeight = totalEnabledWeight > 0 ? (stock.targetWeight / totalEnabledWeight) * 100 : 0;
      
      const alloc = totalCapital * (effectiveWeight / 100);
      let q = stock.shares;
      if (q === null || q === undefined || q === '') {
        q = Math.floor((alloc / p) / 100) * 100;
      } else {
        q = q * 1000;
      }
      const marketValue = p * q;
      currentTotalValue += marketValue;
      
      return { ...stock, effectiveWeight, displayShares: q, marketValue };
    });

    const cashBalance = totalCapital - currentTotalValue;
    const cashWeight = totalCapital > 0 ? (cashBalance / totalCapital) * 100 : 0;

    const portfolioAvg = {
      beta: finalStocks.reduce((acc, s) => acc + (s.beta * (s.effectiveWeight / 100)), 0),
      marketCap: finalStocks.reduce((acc, s) => acc + (s.marketCap * (s.effectiveWeight / 100)), 0),
      pe: finalStocks.reduce((acc, s) => acc + (s.pe * (s.effectiveWeight / 100)), 0),
      eps: finalStocks.reduce((acc, s) => acc + (s.eps * (s.effectiveWeight / 100)), 0),
      momentum: finalStocks.reduce((acc, s) => acc + (s.momentum * (s.effectiveWeight / 100)), 0),
      bias5: finalStocks.reduce((acc, s) => acc + (s.bias5 * (s.effectiveWeight / 100)), 0),
      bias60: finalStocks.reduce((acc, s) => acc + (s.bias60 * (s.effectiveWeight / 100)), 0),
      bias240: finalStocks.reduce((acc, s) => acc + (s.bias240 * (s.effectiveWeight / 100)), 0),
      indMom: finalStocks.reduce((acc, s) => acc + (s.indMom * (s.effectiveWeight / 100)), 0),
      stockMom: finalStocks.reduce((acc, s) => acc + (s.stockMom * (s.effectiveWeight / 100)), 0),
      maxInd: 0,
      maxSingle: 0
    };

    // 計算產業權重
    const sectorWeights: Record<string, number> = {};
    finalStocks.forEach(s => {
      sectorWeights[s.sector] = (sectorWeights[s.sector] || 0) + s.effectiveWeight;
      if (s.effectiveWeight > portfolioAvg.maxSingle) portfolioAvg.maxSingle = s.effectiveWeight;
    });
    portfolioAvg.maxInd = Math.max(...Object.values(sectorWeights), 0);

    // 計算雷達圖數據 (優化後的評分邏輯)
    const processedStocks = finalStocks.map(stock => {
      const getScore82 = (val: number, benchVal: number, min: number, max: number, inverse = false) => {
        const absScore = scaleData(val, min, max, inverse);
        const excess = inverse ? (benchVal - val) : (val - benchVal);
        const maxExcess = inverse ? (benchVal - min) : (max - benchVal);
        const relScore = scaleData(excess, 0, Math.max(maxExcess, 1)); 
        return absScore * 0.8 + relScore * 0.2;
      };

      // 1. 風險偏好：強化高 Beta 的進攻性評分
      const riskPrefScore = getScore82(stock.beta, benchmarkData.market.beta, 0.5, 1.8);

      // 2. 價值信念：高分代表「高溢價成長」，而非傳統價值。高 PE + 成長潛力 = 高分
      const peScore = getScore82(stock.pe, benchmarkData.market.pe, 10, 50, false); // 高 PE 分數高
      const epsScore = getScore82(stock.eps, benchmarkData.market.eps, 0, 15, false);
      const valueBeliefScore = (peScore * 0.7 + epsScore * 0.3); // 偏重估值溢價反映成長預期
      
      // 3. 集散程度：引入數量懲罰。5 支股票基準分約 50-60
      const stockConScore = stock.effectiveWeight > 25 ? Math.max(0, 100 - (stock.effectiveWeight - 25) * 4) : 100;
      const indConScore = sectorWeights[stock.sector] > 40 ? Math.max(0, 100 - (sectorWeights[stock.sector] - 40) * 2) : 100;
      const countFactor = Math.min(1, (activeCount / 25) + 0.4); // 5 支約 0.6
      const concentrationScore = ((stockConScore + indConScore) / 2) * countFactor;

      // 4. 趨勢強弱：調整乖離率敏感度，目標 ~60
      const trendScore = (getScore82(stock.bias5, 0, -8, 8) + getScore82(stock.bias60, 0, -15, 15) + getScore82(stock.bias240, 0, -25, 25)) / 3;

      // 5. 產業強弱：針對電子/熱點族群優化，目標 ~70
      const industryScore = (getScore82(stock.stockMom, 65, 0, 100) + getScore82(stock.indMom, 75, 0, 100)) / 2;

      return {
        ...stock,
        riskPrefScore,
        valueBeliefScore,
        concentrationScore,
        trendScore,
        industryScore
      };
    });

    const totalScores: Record<string, number> = {
      '風險偏好': Math.round(processedStocks.reduce((acc, s) => acc + (s.riskPrefScore * (s.effectiveWeight / 100)), 0)),
      '價值信念': Math.round(processedStocks.reduce((acc, s) => acc + (s.valueBeliefScore * (s.effectiveWeight / 100)), 0)),
      '集散程度': Math.round(processedStocks.reduce((acc, s) => acc + (s.concentrationScore * (s.effectiveWeight / 100)), 0)),
      '趨勢強弱': Math.round(processedStocks.reduce((acc, s) => acc + (s.trendScore * (s.effectiveWeight / 100)), 0)),
      '產業強弱': Math.round(processedStocks.reduce((acc, s) => acc + (s.industryScore * (s.effectiveWeight / 100)), 0))
    };

    const categories = ['風險偏好', '價值信念', '集散程度', '趨勢強弱', '產業強弱'];
    const dynamicRadarData = categories.map(cat => {
      const dataPoint: any = {
        subject: cat,
        A: totalScores[cat],
        fullMark: 100
      };
      
      let cumulative = 0;
      processedStocks.forEach(s => {
        let score = 0;
        if (cat === '風險偏好') score = s.riskPrefScore;
        else if (cat === '價值信念') score = s.valueBeliefScore;
        else if (cat === '集散程度') score = s.concentrationScore;
        else if (cat === '趨勢強弱') score = s.trendScore;
        else if (cat === '產業強弱') score = s.industryScore;
        
        // 計算加權後的貢獻度並累加
        const weightedContribution = score * (s.effectiveWeight / 100);
        cumulative += weightedContribution;
        dataPoint[`stock_${s.id}`] = Math.round(cumulative);
      });
      
      return dataPoint;
    });

    const indicatorDetails: any = {
      '風險偏好': {
        status: getIndicatorStatus('風險偏好', totalScores['風險偏好']),
        keyFeature: totalScores['風險偏好'] >= 60 ? '「積極進攻狀態」' : totalScores['風險偏好'] >= 40 ? '「穩健平衡狀態」' : '「保守防禦狀態」',
        analysis: getIndicatorAnalysis('風險偏好', totalScores['風險偏好'], portfolioAvg),
        metrics: [
          { label: '組合加權 Beta', value: portfolioAvg.beta.toFixed(2), unit: '', desc: '反映整體波動性' },
          { label: '加權市值規模', value: portfolioAvg.marketCap.toFixed(1), unit: ' B', desc: '平均資產體量' }
        ],
        diagnosis: `
### 📊 總體診斷：${getIndicatorStatus('風險偏好', totalScores['風險偏好'])}
**「你是一位身手矯健的衝浪者，專找大浪挑戰。」**
從持股來看，你目前正處於 **「${totalScores['風險偏好'] >= 60 ? '積極進攻' : '防禦穩健'}狀態」**。這份名單反映了你對市場波動的接受程度與進攻意願。

---

### 🔍 組合特徵分析：
* **Beta 係數 (波動性)：**
    反映組合與大盤的連動性。高 Beta 代表你偏好高成長、高波動的標的。
* **公司市值 (標的體質)：**
    市值規模決定了組合的穩定性。中小型股通常具備較高的爆發力。

---

### ⚖️ 策略解析：
${getIndicatorAnalysis('風險偏好', totalScores['風險偏好'], portfolioAvg)}

---

### 🧪 計算公式文檔
本指標採用 **8:2 絕對與相對基準權重法**。
1. **絕對位階 (80%)**：$Score(Beta, 0.5, 2.0)$，衡量組合原始波動性。
2. **相對基準 (20%)**：$Score(Beta - 1.0, 0, 1.0)$，衡量相對於大盤的進攻動能。
        `
      },
      '價值信念': {
        status: getIndicatorStatus('價值信念', totalScores['價值信念']),
        keyFeature: totalScores['價值信念'] >= 60 ? '「追逐溢價成長」' : totalScores['價值信念'] >= 40 ? '「基本面均衡」' : '「低估值價值」',
        analysis: getIndicatorAnalysis('價值信念', totalScores['價值信念'], portfolioAvg),
        metrics: [
          { label: '加權預估 EPS', value: portfolioAvg.eps.toFixed(2), unit: ' 元', desc: '獲利能力基石' },
          { label: '加權本益比 PE', value: portfolioAvg.pe.toFixed(1), unit: ' 倍', desc: '市場估值期待' }
        ],
        diagnosis: `
### 📊 總體診斷：${getIndicatorStatus('價值信念', totalScores['價值信念'])}
**「你是一位眼光獨到的獵頭，專門挖掘高薪天才。」**
你的持股反映出對於 **「${totalScores['價值信念'] >= 60 ? '成長' : '價值'}」** 的重視。

---

### 🔍 組合特徵分析：
* **獲利能力 (EPS)：**
    反映持股的賺錢能力，是股價的長期支撐。
* **估值水位 (PE)：**
    反映市場對未來的期待值。

---

### ⚖️ 策略解析：
${getIndicatorAnalysis('價值信念', totalScores['價值信念'], portfolioAvg)}

---

### 🧪 計算公式文檔
綜合考量 **獲利能力 (EPS)** 與 **估值水位 (PE)**。
1. **獲利分**：$getScore82(EPS, 4.2, 0, 10)$。
2. **估值分**：$getScore82(PE, 18.5, 10, 60, \text{Inverse})$。
        `
      },
      '集散程度': {
        status: getIndicatorStatus('集散程度', totalScores['集散程度']),
        keyFeature: totalScores['集散程度'] >= 60 ? '「極度風險分散」' : totalScores['集散程度'] >= 40 ? '「均衡配置狀態」' : '「重倉單一板塊」',
        analysis: getIndicatorAnalysis('集散程度', totalScores['集散程度'], portfolioAvg),
        metrics: [
          { label: '最大產業佔比', value: portfolioAvg.maxInd.toFixed(1), unit: '%', desc: '最高產業權重' },
          { label: '最大持股佔比', value: portfolioAvg.maxSingle.toFixed(1), unit: '%', desc: '最高單一權重' }
        ],
        diagnosis: `
### 📊 總體診斷：${getIndicatorStatus('集散程度', totalScores['集散程度'])}
**「你是一位謹慎的領航員，將貨物分裝在不同船隻上。」**
目前的配置顯示你對於 **「風險分散」** 的態度。

---

### 🔍 組合特徵分析：
* **產業分佈：**
    資金在不同產業間的分配情況。
* **個股權重：**
    單一標的對整體組合的影響力。

---

### ⚖️ 策略解析：
${getIndicatorAnalysis('集散程度', totalScores['集散程度'], portfolioAvg)}

---

### 🧪 計算公式文檔
衡量權重分配結構，權重越低分數越高。
1. **個股集中度 (50%)**：以 30% 為界。
2. **產業集中度 (50%)**：以 50% 為界。
        `
      },
      '趨勢強弱': {
        status: getIndicatorStatus('趨勢強弱', totalScores['趨勢強弱']),
        keyFeature: totalScores['趨勢強弱'] >= 60 ? '「多頭動能噴發」' : totalScores['趨勢強弱'] >= 40 ? '「盤整待變狀態」' : '「空頭修正狀態」',
        analysis: getIndicatorAnalysis('趨勢強弱', totalScores['趨勢強弱'], portfolioAvg),
        metrics: [
          { label: '加權短期乖離', value: portfolioAvg.bias5.toFixed(1), unit: '%', desc: '短期動能位階' },
          { label: '加權中期乖離', value: portfolioAvg.bias60.toFixed(1), unit: '%', desc: '中期趨勢位階' }
        ],
        diagnosis: `
### 📊 總體診斷：${getIndicatorStatus('趨勢強弱', totalScores['趨勢強弱'])}
**「你正搭乘一列全速前進的高鐵，風阻雖大但動能十足。」**
你的持股目前正處於 **「${totalScores['趨勢強弱'] >= 60 ? '強勢' : '弱勢/盤整'}」** 趨勢中。

---

### 🔍 組合特徵分析：
* **乖離率表現：**
    股價與均線的距離，反映短中長期的超買或超賣狀態。
* **動能慣性：**
    趨勢的持續性。

---

### ⚖️ 策略解析：
${getIndicatorAnalysis('趨勢強弱', totalScores['趨勢強弱'], portfolioAvg)}

---

### 🧪 計算公式文檔
綜合 **5MA、60MA、240MA** 乖離率。
1. **各天期評分**：採 $getScore82(Bias, 0, Min, Max)$。
        `
      },
      '產業強弱': {
        status: getIndicatorStatus('產業強弱', totalScores['產業強弱']),
        keyFeature: totalScores['產業強弱'] >= 60 ? '「資金熱點中心」' : totalScores['產業強弱'] >= 40 ? '「產業輪動狀態」' : '「冷門觀察狀態」',
        analysis: getIndicatorAnalysis('產業強弱', totalScores['產業強弱'], portfolioAvg),
        metrics: [
          { label: '主流產業動能', value: portfolioAvg.indMom.toFixed(0), unit: ' pt', desc: '產業資金熱度' },
          { label: '標的領先指標', value: portfolioAvg.stockMom.toFixed(0), unit: ' pt', desc: '個股相對強度' }
        ],
        diagnosis: `
### 📊 總體診斷：${getIndicatorStatus('產業強弱', totalScores['產業強弱'])}
**「你正站在百貨公司的週年慶門口，人潮就是錢潮。」**
你的持股高度契合目前的 **「市場主流」**。

---

### 🔍 組合特徵分析：
* **產業動能：**
    所選板塊的資金吸引力。
* **個股強度：**
    持股在產業內的領先地位。

---

### ⚖️ 策略解析：
${getIndicatorAnalysis('產業強弱', totalScores['產業強弱'], portfolioAvg)}

---

### 🧪 計算公式文檔
衡量資金流向與市場主流契合度。
1. **個股動能 (50%)**：$getScore82(StockMom, 70, 0, 100)$。
2. **產業動能 (50%)**：$getScore82(IndMom, 82, 0, 100)$。
        `
      }
    };

    return { 
      stocks: processedStocks, 
      activeCount, 
      totalCapital, 
      cashBalance, 
      cashWeight,
      portfolioAvg, 
      dynamicRadarData, 
      categories, 
      totalScores, 
      indicatorDetails 
    };
  }, [stocksState, enabledIds, totalCapital]);
  const toggleStock = (id: string) => {
    setEnabledIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleUpdate = (id: string, field: string, value: any) => {
    setStocksState(prev => prev.map(s => s.id === id ? { ...s, [field]: value === '' ? null : parseFloat(value) } : s));
  };


  return (
    <div className="mirror-trade-demo p-1 text-[#2D2D2D] select-none relative md:p-2">
      <div className="mx-auto max-w-6xl space-y-8">
        
        {/* Header */}
        <div className="flex flex-col justify-between gap-6 border-y border-[#D1D1C7] py-6 md:flex-row md:items-end">
          <div className="flex items-start gap-4">
            <LayoutDashboard className="mt-1 text-[#8C635B]" size={20} />
            <div>
              <p className="text-xs font-bold tracking-[0.18em] text-[#8C7E6D]">RATE · MIRRORTRADE</p>
              <h1 className="mt-2 serif text-3xl leading-none text-[#2D2D2D]">RATE 鏡相診股</h1>
              <p className="mt-3 text-sm leading-7 text-[#5F574F]">認識自己用 FACE，檢驗持倉用 RATE</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={() => setImportModalOpen(true)}
              className="flex items-center gap-2 border border-[#2D2D2D] bg-white px-4 py-2 text-xs font-bold tracking-[0.08em] text-[#2D2D2D] transition-all hover:bg-[#2D2D2D] hover:text-white"
            >
              <Upload size={14} />
              導入持股
            </button>
            <div className="flex border border-[#D1D1C7] bg-white p-1">
              <button onClick={() => setActiveTab('risk')} className={`px-4 py-2 text-xs font-bold tracking-[0.06em] transition-all ${activeTab === 'risk' ? 'bg-[#2D2D2D] text-white' : 'text-[#8C7E6D]'}`}>策略健檢</button>
              <button onClick={() => setActiveTab('calc')} className={`px-4 py-2 text-xs font-bold tracking-[0.06em] transition-all ${activeTab === 'calc' ? 'bg-[#2D2D2D] text-white' : 'text-[#8C7E6D]'}`}>部位試算</button>
            </div>
          </div>
        </div>

        {stocksState.length === 0 ? (
          <section className="border border-[#D1D1C7] bg-[#F7F4EF] px-6 py-14 md:px-12 md:py-20">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-bold tracking-[0.18em] text-[#8C635B]">知行合一檢測</p>
              <h2 className="mt-5 serif text-3xl leading-[1.6] text-[#2D2D2D] md:text-4xl">認識自己用 FACE，<br />檢驗持倉用 RATE</h2>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#5F574F]">好的交易，建立在知行合一的基礎上。FACE 幫你向內認識最舒適的獲利動機與決策邏輯；RATE 則用數據向外掃描你的真實持倉。</p>
            </div>

            <figure className="mx-auto mt-10 max-w-4xl overflow-hidden border border-[#D1D1C7] bg-white">
              <img src="/images/rate-diagnosis-preview.png" alt="RATE 鏡相診股示意：五邊形評估、診斷報告與持股配置" className="block h-auto w-full" />
              <figcaption className="border-t border-[#D1D1C7] px-5 py-4 text-left text-sm leading-7 text-[#5F574F]">RATE 會把五個持倉面向整理成一份可閱讀的健檢報告：左側看整體輪廓，右側看重點提醒，下方看持股與配置比例。</figcaption>
            </figure>

            <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 border-l border-t border-[#D1D1C7] sm:grid-cols-2">
              <div className="border-b border-r border-[#D1D1C7] bg-white/70 p-6">
                <p className="text-xs font-bold tracking-[0.12em] text-[#8C635B]">R · Risk ↔ F · Focus／獲利動機</p>
                <h3 className="mt-3 text-xl font-bold text-[#2D2D2D]">對照風險偏好</h3>
                <p className="mt-3 text-sm leading-7 text-[#5F574F]">你追求獲利的方式，和實際部位承受的風險，是否匹配？</p>
              </div>
              <div className="border-b border-r border-[#D1D1C7] bg-white/70 p-6">
                <p className="text-xs font-bold tracking-[0.12em] text-[#657582]">A · Allocation ↔ E · Exposure／資金管理</p>
                <h3 className="mt-3 text-xl font-bold text-[#2D2D2D]">對照集散程度</h3>
                <p className="mt-3 text-sm leading-7 text-[#5F574F]">你的資產配置是集中還是分散，是否符合你能承受的壓力？</p>
              </div>
              <div className="border-b border-r border-[#D1D1C7] bg-white/70 p-6">
                <p className="text-xs font-bold tracking-[0.12em] text-[#8C635B]">T · Trend ↔ C · Cycle／交易週期</p>
                <h3 className="mt-3 text-xl font-bold text-[#2D2D2D]">對照趨勢強弱</h3>
                <p className="mt-3 text-sm leading-7 text-[#5F574F]">你的操作節奏，和持股現在所處的趨勢階段，是否合拍？</p>
              </div>
              <div className="border-b border-r border-[#D1D1C7] bg-white/70 p-6">
                <p className="text-xs font-bold tracking-[0.12em] text-[#657582]">E · Evaluation ↔ A · Analysis／決策邏輯</p>
                <h3 className="mt-3 text-xl font-bold text-[#2D2D2D]">對照價值信念</h3>
                <p className="mt-3 text-sm leading-7 text-[#5F574F]">你對持股價值的評估與信念，是否真的反映在目前持有的標的？</p>
              </div>
            </div>

            <div className="mx-auto mt-6 flex max-w-4xl flex-col gap-3 border border-[#D1D1C7] bg-[#EEE9E1] px-6 py-5 sm:flex-row sm:items-start">
              <div className="shrink-0 text-xs font-bold tracking-[0.12em] text-[#8C635B]">環境參考</div>
              <p className="text-sm leading-7 text-[#5F574F]"><strong className="font-bold text-[#2D2D2D]">產業強弱</strong>是第五個環境指標，不用來定義你的人格，而是協助你理解目前的市場環境與持股處境。</p>
            </div>

            <div className="mx-auto mt-12 max-w-2xl border-t border-[#D1D1C7] pt-10 text-center">
              <p className="text-xs font-bold tracking-[0.18em] text-[#8C635B]">尚未輸入持股</p>
              <h3 className="mt-4 serif text-2xl leading-[1.6] text-[#2D2D2D]">先放進你的持股，<br className="hidden sm:block" />再看投資方式是否真的像你。</h3>
              <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#5F574F]">可直接匯入 CSV 持股清單。資料目前只用於這次瀏覽器中的試算，不會自動公開或分享。</p>
              <button type="button" onClick={() => setImportModalOpen(true)} className="mt-8 bg-[#2D2D2D] px-7 py-4 text-sm font-bold tracking-[0.1em] text-white transition hover:bg-black">開始 RATE 持倉檢驗</button>
            </div>
          </section>
        ) : activeTab === 'risk' ? (
          <div className="space-y-4 animate-in fade-in duration-500">
            
            {/* Section 1 & 2: 綜合風險評估雷達與核心指標總結解析 (恢復原本的五角圖設計) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-white flex flex-col items-center">
                <h2 className="text-xs font-black uppercase tracking-widest w-full text-left mb-6 text-[#A8A8A2]">綜合風險評估雷達</h2>
                <div className="w-full h-[350px]">
                  {portfolioData.activeCount > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="75%" data={portfolioData.dynamicRadarData}>
                        <PolarGrid stroke="#EBECE7" strokeDasharray="3 3" />
                        <PolarAngleAxis dataKey="subject" tick={renderCustomTick} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        {[...portfolioData.stocks].reverse().map((stock) => {
                          const cIdx = stocksState.findIndex(x => x.id === stock.id);
                          return (
                            <Radar 
                              key={`radar-${stock.id}`} 
                              name={stock.name} 
                              dataKey={`stock_${stock.id}`} 
                              stroke={COLORS[cIdx % COLORS.length]} 
                              strokeWidth={3} 
                              fill={COLORS[cIdx % COLORS.length]} 
                              fillOpacity={0.7} 
                            />
                          );
                        })}
                      </RadarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full w-full flex flex-col items-center justify-center text-slate-300 gap-4">
                       <FilterX size={48} />
                       <span className="text-sm font-bold tracking-widest uppercase">請點亮至少一支股票以檢視圖表</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-4 justify-center">
                  {stocksState.map((s, idx) => (
                    <button 
                      key={`btn-${s.id}`}
                      onClick={() => toggleStock(s.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border ${enabledIds.includes(s.id) ? 'bg-white border-slate-200 shadow-sm text-[#5D5D5A]' : 'bg-slate-50 border-transparent text-slate-400 opacity-60'}`}
                    >
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: enabledIds.includes(s.id) ? COLORS[idx % COLORS.length] : '#CBD5E1' }}></div>
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-sm border border-white space-y-4">
                <h2 className="text-xs font-black uppercase tracking-widest text-[#A8A8A2] mb-4">核心指標總結解析</h2>
                {portfolioData.categories.map((key) => (
                  <div key={key} onClick={() => setSelectedIndicator(key)} className="flex items-center gap-4 bg-[#F9F9F7] p-5 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all group cursor-pointer active:scale-95">
                    <div className="w-8 flex justify-center text-[#8E8E8A]">
                      {key === '風險偏好' ? <ShieldAlert size={20}/> : key === '價值信念' ? <PieChart size={20}/> : key === '集散程度' ? <Activity size={20}/> : key === '趨勢強弱' ? <TrendingUp size={20}/> : <Info size={20}/>}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="text-xs font-black uppercase tracking-widest text-[#5D5D5A]">{key}</div>
                          <div className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-black text-[#8E8E8A]">
                            {portfolioData.indicatorDetails[key].status}
                          </div>
                        </div>
                        <div className="text-[10px] font-black text-[#A8A8A2] tracking-widest">
                          {portfolioData.indicatorDetails[key].keyFeature}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#97A97C] shrink-0" />
                          <div className="text-[12px] text-[#5D5D5A] leading-relaxed font-medium">
                            {portfolioData.indicatorDetails[key].analysis}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-16 text-center py-2 rounded-xl bg-white border border-slate-100 shadow-sm">
                      <div className="text-lg font-black font-mono" style={{ color: getScoreColor(portfolioData.totalScores[key]) }}>{portfolioData.totalScores[key]}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: 個股明細清單與 AI 尋找相近 */}
            <div className="bg-white rounded-2xl border border-white shadow-sm overflow-hidden pb-8">
              <div className="p-5 border-b border-slate-50 bg-[#F9F9F7]">
                <h3 className="font-bold text-[#5D5D5A] text-xs uppercase tracking-widest flex items-center gap-2 text-slate-400">
                  <Layers className="w-4 h-4 text-[#A8A8A2]" /> 個股曝險與動能清單
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#F9F9F7] text-[#A8A8A2] font-black uppercase tracking-tighter border-b border-slate-100 whitespace-nowrap">
                    <tr>
                      <th className="px-4 py-4 font-bold">標的名稱 (代號)</th>
                      <th className="px-4 py-4 font-bold">產業板塊</th>
                      <th className="px-4 py-4 text-center font-bold">BETA</th>
                      <th className="px-4 py-4 text-center font-bold">市值(B)</th>
                      <th className="px-4 py-4 text-center font-bold">EPS</th>
                      <th className="px-4 py-4 text-center font-bold">PE</th>
                      <th className="px-4 py-4 text-center font-bold">5MA乖離</th>
                      <th className="px-4 py-4 text-center font-bold">60MA乖離</th>
                      <th className="px-4 py-4 text-center font-bold">240MA乖離</th>
                      <th className="px-4 py-4 text-center font-bold">產業動能</th>
                      <th className="px-4 py-4 text-center font-bold">個股動能</th>
                      <th className="px-4 py-4 text-center font-bold text-[#89B0AE]">交易解憂推薦</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {portfolioData.stocks.map((stock) => {
                      const cIdx = stocksState.findIndex(x => x.id === stock.id);
                      return (
                        <tr key={`table-${stock.id}`} className="hover:bg-[#F9F9F7] transition-colors group whitespace-nowrap">
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                               <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: COLORS[cIdx % COLORS.length] }}></div>
                               <div className="font-bold text-[#5D5D5A]">{stock.name}</div>
                               <span className="text-[9px] text-slate-400 font-mono tracking-tighter">({stock.id})</span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-wrap gap-1">
                              {(() => {
                                const cats = csvData.filter(row => row.stock_id === stock.id);
                                cats.sort((a, b) => (categoryPopularity[b.concept_name] || 0) - (categoryPopularity[a.concept_name] || 0));
                                const displayTags = cats.length > 0 ? cats.slice(0, 2).map(c => c.concept_name) : [stock.sector];
                                return displayTags.map((tag, i) => (
                                  <span key={i} className="text-[10px] px-2 py-0.5 bg-[#EBECE7] rounded text-[#5D5D5A] font-bold uppercase tracking-widest whitespace-nowrap">
                                    {tag}
                                  </span>
                                ));
                              })()}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center font-mono font-bold text-[#8E8E8A]">{stock.beta.toFixed(2)}</td>
                          <td className="px-4 py-4 text-center font-mono text-indigo-400 font-black">{stock.marketCap}B</td>
                          <td className="px-4 py-4 text-center font-bold text-[#97A97C]">${stock.eps.toFixed(2)}</td>
                          <td className="px-4 py-4 text-center font-bold text-[#D4A373]">{stock.pe}x</td>
                          <td className={`px-4 py-4 text-center font-mono font-bold ${stock.bias5 > 0 ? 'text-[#E28E8E]' : 'text-[#97A97C]'}`}>{stock.bias5 > 0 ? '+' : ''}{stock.bias5}%</td>
                          <td className={`px-4 py-4 text-center font-mono font-bold ${stock.bias60 > 0 ? 'text-[#E28E8E]' : 'text-[#97A97C]'}`}>{stock.bias60 > 0 ? '+' : ''}{stock.bias60}%</td>
                          <td className={`px-4 py-4 text-center font-mono font-bold ${stock.bias240 > 0 ? 'text-[#E28E8E]' : 'text-[#97A97C]'}`}>{stock.bias240 > 0 ? '+' : ''}{stock.bias240}%</td>
                          <td className="px-4 py-4 text-center">
                             <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#EBECE7] text-[#97A97C] font-black">
                                {stock.indMom}
                             </div>
                          </td>
                          <td className="px-4 py-4 text-center">
                             <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#EBECE7] text-[#89B0AE] font-black">
                                {stock.stockMom}
                             </div>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <button 
                              onClick={() => findSimilarStocks(stock)}
                              className="text-[#89B0AE] hover:text-white hover:bg-[#89B0AE] transition-all flex items-center gap-1.5 mx-auto bg-white px-3 py-1.5 rounded-lg shadow-sm border border-[#89B0AE]/20 font-bold text-[10px]"
                            >
                              <Search size={12} /> 找相似
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* Calculator Page */
          <div className="animate-in slide-in-from-right duration-700 space-y-6 pb-20">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2 md:px-0">
                <div className="bg-white p-6 rounded-3xl border border-white shadow-sm flex flex-col justify-center">
                    <div className="flex justify-between items-end mb-4 px-2">
                       <span className="text-xs font-bold text-[#A8A8A2] uppercase tracking-widest flex items-center gap-2"><Wallet className="w-4 h-4"/> 持股試算總市值</span>
                       <span className="text-2xl font-black text-[#5D5D5A] tracking-tighter">${portfolioData.stocks.reduce((acc,s)=>acc+s.marketValue,0).toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-[#F4F4F2] h-4 rounded-full overflow-hidden flex shadow-inner">
                       {portfolioData.stocks.map((s, i) => {
                          const cIdx = stocksState.findIndex(x => x.id === s.id);
                          return (
                            <div key={`calc-prog-${s.id}`} style={{ width: `${(s.marketValue/totalCapital)*100}%`, backgroundColor: COLORS[cIdx % COLORS.length] }} className="h-full border-r border-white/30"></div>
                          );
                       })}
                    </div>
                </div>
                <div className="bg-[#B4A7AF] p-6 rounded-3xl text-white shadow-xl shadow-[#B4A7AF]/20 flex flex-col justify-center relative overflow-hidden">
                    <div className="flex justify-between items-center relative z-10">
                       <span className="text-xs font-bold text-white/70 uppercase tracking-widest">現金餘額</span>
                       <span className="text-2xl font-black font-mono">${portfolioData.cashBalance.toLocaleString()}</span>
                    </div>
                    <div className="mt-2 text-xs font-medium text-white/50 tracking-wide relative z-10">
                      當前現金比重：{portfolioData.cashWeight.toFixed(1)}%
                    </div>
                    <FilterX className="absolute -right-4 -bottom-4 w-24 h-24 text-white/5" />
                </div>
             </div>

             <div className="bg-white rounded-3xl shadow-sm border border-white overflow-hidden">
              <div className="p-5 border-b border-slate-50 bg-[#F9F9F7] flex justify-between items-center">
                <h2 className="font-bold text-[#5D5D5A] text-xs uppercase tracking-widest">比例分配編輯器</h2>
                <div className="bg-white px-4 py-1.5 rounded-xl border border-white flex items-center gap-3 shadow-sm">
                  <span className="text-[10px] text-[#A8A8A2] font-black uppercase tracking-tighter">總資產設定</span>
                  <input type="number" value={totalCapital} onChange={(e) => setTotalCapital(Number(e.target.value))} className="text-sm font-bold text-[#97A97C] focus:outline-none w-28 bg-transparent text-right border-b border-[#97A97C]/20" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="text-[#A8A8A2] uppercase border-b border-slate-100 font-black tracking-tighter">
                      <th className="px-6 py-6 font-bold">標的名稱</th>
                      <th className="px-6 py-6 text-center">目標比例 (%)</th>
                      <th className="px-6 py-6 text-center">單價</th>
                      <th className="px-6 py-6 text-right">試算市值</th>
                      <th className="px-6 py-6 text-center">實際權重</th>
                      <th className="px-6 py-6"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {stocksState.map((stock) => {
                      const p = stock.manualPrice || stock.price;
                      const alloc = totalCapital * (stock.targetWeight / 100);
                      let q = stock.shares;
                      if (q === null || q === undefined || q === '') {
                        q = Math.floor((alloc / p) / 100) * 100;
                      } else {
                        q = q * 1000;
                      }
                      const mv = p * q;
                      const actW = totalCapital > 0 ? (mv / totalCapital) * 100 : 0;

                      return (
                        <tr key={`calc-${stock.id}`} className="hover:bg-[#F9F9F7]">
                          <td className="px-6 py-6">
                            <div className="font-bold text-[#5D5D5A]">{stock.name}</div>
                            <div className="text-[9px] text-[#A8A8A2] font-mono tracking-tighter">{stock.id}</div>
                          </td>
                          <td className="px-6 py-6 text-center">
                            <div className="flex items-center justify-center gap-4">
                               <input type="range" min="0" max="100" value={stock.targetWeight} onChange={(e) => handleUpdate(stock.id, 'targetWeight', e.target.value)} className="w-24 accent-[#97A97C]" />
                               <span className="w-8 text-center text-[11px] font-black text-[#97A97C]">{stock.targetWeight}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-6 text-center text-slate-400 font-mono text-sm font-bold">${p}</td>
                          <td className="px-6 py-6 text-right font-black text-[#5D5D5A]">${mv.toLocaleString()}</td>
                          <td className="px-6 py-6 text-center text-[#97A97C] font-black">
                             {actW.toFixed(1)}%
                          </td>
                          <td className="px-6 py-6 text-right px-4">
                            <button onClick={() => handleUpdate(stock.id, 'targetWeight', 20)} className="p-2 text-[#D4D4D0] hover:text-[#E28E8E] transition-colors"><RotateCcw size={16} /></button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- 指標詳情 Modal --- */}
        {selectedIndicator && portfolioData.indicatorDetails[selectedIndicator] && (
          <div className="fixed inset-0 bg-[#4A4A48]/60 backdrop-blur-md z-[60] flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden border border-white flex flex-col">
              <div className="p-8 bg-[#F9F9F7] border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-white shadow-sm text-[#97A97C] border border-slate-50"><Calculator size={24} /></div>
                  <div>
                    <h2 className="text-2xl font-black text-[#5D5D5A] tracking-tight">{selectedIndicator} <span className="ml-2 text-[#97A97C]">{portfolioData.totalScores[selectedIndicator]} 分</span></h2>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#A8A8A2] mt-1">Portfolio Weighted Analysis</p>
                  </div>
                </div>
                <button onClick={() => setSelectedIndicator(null)} className="p-2 bg-white rounded-full shadow-sm text-[#A8A8A2] hover:text-[#5D5D5A] transition-colors"><X size={24} /></button>
              </div>
              <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {portfolioData.indicatorDetails[selectedIndicator].metrics.map((item: any, i: number) => (
                    <div key={i} className="bg-[#F9F9F7] p-6 rounded-2xl border border-slate-50">
                      <div className="text-[10px] font-black text-[#A8A8A2] uppercase tracking-[0.2em] mb-2">{item.label}</div>
                      <div className="flex items-baseline gap-1">
                        <div className="text-4xl font-black font-mono text-[#5D5D5A] tracking-tighter">{item.value}</div>
                        <div className="text-sm font-black text-[#A8A8A2]">{item.unit}</div>
                      </div>
                      <p className="text-[11px] text-[#A8A8A2] mt-4 leading-relaxed font-medium">{item.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-[#A8A8A2] uppercase tracking-[0.2em] flex items-center gap-2"><Layers size={14} className="text-[#97A97C]" /> 詳細診斷說明</h3>
                  <div className="p-7 rounded-2xl border border-[#97A97C]/20 bg-[#97A97C]/5 shadow-inner overflow-y-auto max-h-[400px]">
                    <div className="text-sm leading-relaxed text-[#5D5D5A] font-medium prose prose-sm prose-slate max-w-none">
                      <Markdown>{portfolioData.indicatorDetails[selectedIndicator].diagnosis}</Markdown>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- AI 交易解憂：標的推薦 Modal --- */}
        {recModalData && (
          <div className="fixed inset-0 bg-[#4A4A48]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden border border-white">
               
               <div className="p-6 bg-[#89B0AE] text-white relative">
                 <button onClick={() => setRecModalData(null)} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors bg-black/10 p-3 -m-2 rounded-full z-10 cursor-pointer">
                    <X size={24} />
                 </button>
                 <div className="flex items-center gap-2 mb-2 opacity-80">
                    <Sparkles size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">交易解憂 AI 引擎</span>
                 </div>
                 <h2 className="text-2xl font-black mb-1">尋找相近標的分析</h2>
                 <p className="text-xs font-medium text-white/80">
                   根據「{recModalData.target.name}」的五大特徵，為您比對投資人格相符之潛力清單。
                 </p>
               </div>

               <div className="p-8 space-y-8 bg-[#FDFDFB]">
                 
                 {/* 目標特徵解析 */}
                 <div>
                    <h3 className="text-[10px] font-black text-[#A8A8A2] uppercase tracking-widest mb-3 border-b border-slate-100 pb-2">Target DNA 標的基因解析</h3>
                    <div className="flex items-center gap-4">
                       <div className="w-16 h-16 rounded-2xl bg-[#F9F9F7] border border-slate-200 flex flex-col items-center justify-center shrink-0">
                          <span className="text-xl font-black text-[#5D5D5A]">{recModalData.target.name}</span>
                       </div>
                       <div className="flex flex-wrap gap-2">
                          {recModalData.industries.map((ind: string, i: number) => (
                             <span key={`ind-${i}`} className="px-2.5 py-1 text-[10px] font-bold bg-[#89B0AE] border border-[#89B0AE] text-white rounded-md shadow-sm">
                               產業: {ind}
                             </span>
                          ))}
                          {recModalData.concepts.map((con: string, i: number) => (
                             <span key={`con-${i}`} className="px-2.5 py-1 text-[10px] font-bold bg-[#97A97C] border border-[#97A97C] text-white rounded-md shadow-sm">
                               概念: {con}
                             </span>
                          ))}
                          {Object.values(recModalData.tags).map((t: any, i) => (
                             <span key={i} className="px-2.5 py-1 text-[10px] font-bold bg-white border border-slate-200 text-[#89B0AE] rounded-md shadow-sm">
                               {t.label}
                             </span>
                          ))}
                       </div>
                    </div>
                 </div>

                 {/* 推薦清單 */}
                 <div>
                    <h3 className="text-[10px] font-black text-[#A8A8A2] uppercase tracking-widest mb-3 border-b border-slate-100 pb-2">Recommendation 相似標的推薦</h3>
                    <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                       {recModalData.recommendations.map((rec: any, i: number) => (
                         <div key={rec.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl bg-white border border-[#89B0AE]/20 hover:shadow-md transition-shadow relative overflow-hidden group">
                            
                            {/* 匹配度標籤 */}
                            <div className="absolute top-0 right-0 bg-[#89B0AE] text-white text-[9px] font-black px-3 py-1 rounded-bl-xl shadow-sm flex gap-2">
                               <span>族群 {rec.groupScore}/80</span>
                               <span>上下游 {rec.fundScore}/20</span>
                               <span className="border-l border-white/30 pl-2">總分 {rec.score}</span>
                            </div>

                            <div className="flex flex-col min-w-[120px]">
                               <div className="flex items-center gap-2">
                                  <span className="text-base font-black text-[#5D5D5A]">{rec.name}</span>
                                  <span className="text-[10px] text-slate-400 font-mono">({rec.id})</span>
                               </div>
                               <span className="text-[10px] text-[#97A97C] font-bold">{rec.sector}</span>
                               <span className="text-[9px] text-[#A8A8A2] mt-1">{rec.matchReason}</span>
                            </div>
                            
                            <div className="flex-1 flex flex-col gap-1.5 justify-center">
                               {rec.matchedTags && rec.matchedTags.length > 0 && (
                                 <div className="flex flex-wrap gap-1.5">
                                   {rec.matchedTags.map((tag: string, j: number) => (
                                     <span key={`cat-${j}`} className="px-2 py-0.5 text-[9px] font-bold bg-[#EBECE7] text-[#5D5D5A] rounded-full">
                                       ✓ {tag}
                                     </span>
                                   ))}
                                 </div>
                               )}
                               {rec.geneticTagsDisplay && rec.geneticTagsDisplay.length > 0 && (
                                 <div className="flex flex-wrap gap-1.5">
                                   {rec.geneticTagsDisplay.map((tagObj: any, j: number) => (
                                     <span key={`gen-${j}`} className={`px-2 py-0.5 text-[9px] font-bold rounded-full border ${tagObj.isMatch ? 'border-[#89B0AE]/30 text-[#89B0AE] bg-[#89B0AE]/5' : 'border-[#E28E8E]/40 text-[#E28E8E] bg-[#E28E8E]/5'}`}>
                                       {tagObj.isMatch ? '✓' : '✗'} {tagObj.label}
                                     </span>
                                   ))}
                                 </div>
                               )}
                            </div>

                            <div className="flex gap-4 text-center sm:text-right shrink-0">
                               <div className="flex flex-col">
                                 <span className="text-[9px] text-slate-400 font-bold">PE</span>
                                 <span className="text-xs font-mono font-bold text-[#D4A373]">{rec.pe}x</span>
                               </div>
                               <div className="flex flex-col">
                                 <span className="text-[9px] text-slate-400 font-bold">動能</span>
                                 <span className="text-xs font-mono font-black text-[#97A97C]">{rec.momentum}</span>
                               </div>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>

               </div>
            </div>
          </div>
        )}

        {/* --- 導入持股 Modal --- */}
        {importModalOpen && (
          <div className="fixed inset-0 bg-[#4A4A48]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden border border-white">
               
               <div className="p-6 bg-[#5D5D5A] text-white relative">
                 <button onClick={() => setImportModalOpen(false)} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors bg-black/10 p-3 -m-2 rounded-full z-10 cursor-pointer">
                    <X size={24} />
                 </button>
                 <div className="flex items-center gap-2 mb-2 opacity-80">
                    <FileSpreadsheet size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">CSV 快速匯入</span>
                 </div>
                 <h2 className="text-2xl font-black mb-1">導入持股清單</h2>
                 <p className="text-xs font-medium text-white/80">
                   上傳包含「代號」或「名稱」欄位的 CSV 檔案，系統將自動為您解析並取代目前的持股組合。
                 </p>
               </div>

               <div className="p-8 space-y-6 bg-[#FDFDFB]">
                 
                 <div className="space-y-2">
                   <label className="text-xs font-bold text-[#A8A8A2] uppercase tracking-widest">上傳 CSV 檔案</label>
                   <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-slate-200 border-dashed rounded-xl cursor-pointer bg-white hover:bg-slate-50 transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <FileSpreadsheet className="w-10 h-10 mb-3 text-slate-400" />
                              <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">點擊選擇檔案</span> 或拖曳至此</p>
                              <p className="text-xs text-slate-400">僅支援 .csv 格式</p>
                          </div>
                          <input type="file" className="hidden" accept=".csv" onChange={handleCsvUpload} />
                      </label>
                   </div>
                 </div>

                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <h4 className="text-xs font-bold text-[#5D5D5A] mb-2">💡 支援的 CSV 欄位格式範例：</h4>
                    <div className="text-xs text-slate-500 font-mono bg-white p-2 rounded border border-slate-200 leading-relaxed">
                      代號, 名稱, 權重<br/>
                      2330, 台積電, 40<br/>
                      2317, 鴻海, 30<br/>
                      2454, 聯發科, 30
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2">
                      * 至少需包含「代號」或「名稱」其中之一。<br/>
                      * 若未提供「權重」，系統將自動平均分配。
                    </p>
                 </div>

               </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
