
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
      title: '交易像一面鏡子\n心態決定你能走多遠',
      motto: '只要 5 分鐘，',
      supportingLine: '透過 FACE 交易心理測驗，看懂自己的交易人格、情緒反應與決策模式，\n找到真正適合你的交易方式。',
      startTest: '開始測驗',
      dnaTest: '約 5 分鐘',
      todayAwareness: '今日交易回顧',
      today: 'DAILY CHECK-IN',
      dashboard: '查看我的結果',
      footer: 'FACE 幫你看見自己的獲利動機、決策邏輯、交易週期與資金管理傾向。'
    },
    common: {
      logout: '登出',
      login: '登入',
      retest: '重新測驗',
      retestDna: '重新做 24 題測驗',
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
      title: 'Your trading mindset is a mirror.\nIt reflects the person behind every decision.',
      motto: 'In just 5 minutes,',
      supportingLine: 'Understand your trading personality, emotional reactions, and decision patterns—and find the approach that truly fits you.',
      startTest: 'Start Test',
      dnaTest: 'ABOUT 5 MINUTES',
      todayAwareness: 'Today’s Trade Review',
      today: 'DAILY CHECK-IN',
      dashboard: 'View My Results',
      footer: 'FACE helps you understand your profit motivation, decision logic, trading cycle, and capital management.'
    },
    common: {
      logout: 'Logout',
      login: 'GOOGLE SIGN IN',
      retest: 'Retest',
      retestDna: 'Retake the 24-Question Test',
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
