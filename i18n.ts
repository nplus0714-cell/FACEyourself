
import { Language } from './types';

export const translations: Record<Language, any> = {
  zh: {
    nav: {
      overview: '我的結果',
      gallery: '16 型交易風格',
      about: '關於 FACE',
      bar: '解憂 Bar'
    },
    landing: {
      title: '看懂你的交易習慣，\n不只看輸贏',
      motto: '40 題，約 6 分鐘，找出你的 FACE 交易風格。',
      startTest: '開始 40 題交易人格測驗',
      dnaTest: 'trading style test',
      todayAwareness: '今日交易回顧',
      today: 'DAILY CHECK-IN',
      dashboard: '查看我的結果',
      footer: 'FACE 幫你看見自己在機會、風險、決策與交易節奏上的傾向。'
    },
    common: {
      logout: '登出',
      login: '登入',
      retest: '重新測驗',
      retestDna: '重新做 40 題測驗',
      back: '返回',
      share: '分享我的結果',
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
      portrait: '你的交易風格',
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
      bar: 'Solace Bar'
    },
    landing: {
      title: 'Understand How You Trade,\nNot Just Your Returns',
      motto: '40 questions. About 6 minutes. Find your FACE trading style.',
      startTest: 'Start the 40-Question Test',
      dnaTest: 'TRADING STYLE TEST',
      todayAwareness: 'Today’s Trade Review',
      today: 'DAILY CHECK-IN',
      dashboard: 'View My Results',
      footer: 'FACE helps you understand how you approach opportunity, risk, decisions, and timing.'
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
