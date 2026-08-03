
import { Language } from './types';

export const translations: Record<Language, any> = {
  zh: {
    nav: {
      overview: '我的結果',
      gallery: '人格圖鑑',
      about: '關於 FACE',
      bar: '解憂 Bar',
      watch: '內容中心'
    },
    landing: {
      title: '投資沒有標準答案\n只有適合你的交易方式',
      motto: '先看懂自己，再看懂市場',
      supportingLine: '找到你的交易舒適圈',
      startTest: '開始 40 題交易人格測驗',
      dnaTest: 'trading style test',
      todayAwareness: '今日交易回顧',
      today: 'DAILY CHECK-IN',
      dashboard: '查看我的結果',
      footer: 'FACE 幫你看見自己的獲利動機、決策邏輯、交易週期與資金管理傾向。'
    },
    common: {
      logout: '登出',
      login: '登入',
      retest: '重新測驗',
      retestDna: '重新做 40 題測驗',
      back: '返回',
      share: '分享結果',
      archive: '儲存今日回顧',
      loadingQuestions: '正在整理今日市場資訊...',
      zenMotto: '完成後，看看今天的市場讓你的想法偏向哪一邊。',
      step: '步驟'
    },
    dashboard: {
      analysis: 'FACE 分數',
      title: '你的四個交易面向',
      baseEnergy: '原始結果',
      todayStatus: '今日狀態',
      portrait: '你的交易人格',
      psychology: '你的決策習慣',
      blindSpots: '可能的盲點',
      kit: '實用提醒',
      blessing: '一句提醒',
      offsetInsight: '今天和你平常的差異',
      pouchLabels: ['風險提醒', '思考提醒', '行動提醒']
    }
  },
  en: {
    nav: {
      overview: 'Overview',
      gallery: 'Gallery',
      about: 'About FACE',
      bar: 'Solace Bar',
      watch: 'Watch'
    },
    landing: {
      title: 'Understand How You Trade,\nNot Just Your Returns',
      motto: '40 questions. About 6 minutes. Find your FACE trading style.',
      supportingLine: 'Find the trading approach that feels right for you.',
      startTest: 'Start the 40-Question Test',
      dnaTest: 'TRADING STYLE TEST',
      todayAwareness: 'Today’s Trade Review',
      today: 'DAILY CHECK-IN',
      dashboard: 'View My Results',
      footer: 'FACE helps you understand your profit motivation, decision logic, trading cycle, and capital management.'
    },
    common: {
      logout: 'Logout',
      login: 'GOOGLE SIGN IN',
      retest: 'Retest',
      retestDna: 'Retake the 40-Question Test',
      back: 'Back',
      share: 'SHARE MY RESULTS',
      archive: 'SAVE TODAY\'S REVIEW',
      loadingQuestions: 'Preparing today\'s market context...',
      zenMotto: 'See how today\'s market may be shaping your decisions.',
      step: 'Step'
    },
    dashboard: {
      analysis: 'FACE SCORES',
      title: 'Your Four Trading Dimensions',
      baseEnergy: 'Baseline Result',
      todayStatus: 'Today Status',
      portrait: 'Your Trading Style',
      psychology: 'Your Decision Habits',
      blindSpots: 'Possible Blind Spots',
      kit: 'Practical Reminders',
      blessing: 'One Reminder',
      offsetInsight: 'How Today Differs from Your Usual Style',
      pouchLabels: ['Risk', 'Thinking', 'Action']
    }
  }
};
