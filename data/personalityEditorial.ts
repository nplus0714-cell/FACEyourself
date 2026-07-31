/** Public-facing copy. Only profiles reviewed with the founder appear here. */
export interface PersonalityEditorial {
  cardLine: string;
  motto: string;
  portrait: string;
  decision: { title: string; scene: string };
  pressurePoints: Array<{ title: string; description: string; action: string }>;
  actions: Array<{ title: string; description: string; steps: string[] }>;
  pouches: { safety: string; mindset: string; behavior: string };
  reminder: string;
  shareText: string;
}

export const PERSONALITY_EDITORIAL: Partial<Record<string, PersonalityEditorial>> = {
  PILD: {
    cardLine: '市場再吵，也想用自己的步調慢慢走。',
    motto: '不看就不會虧，只要我心如止水，股市波動就與我無關。',
    portrait: '你擁有一種近乎超能力的「防禦性忽略」，能在全市場哀鴻遍野時，依然安穩地在海底睡覺。你的投資組合比白開水還淡，淡到有時候連你自己都忘了帳號密碼。',
    decision: {
      title: '你最怕的不是賠錢，而是發現自己一直在逃避現實。',
      scene: '你內心的焦慮往往來自於「對掌控感的放棄」。在心理學上，這是一種過度的自我保護。當市場行情大好，身邊的人都在討論翻倍的獲利時，你內心會有一種被時代拋下的孤獨感。這就像是你在大雨中拒絕撐傘，雖然避免了收傘的麻煩，卻在心理上默默承受著被淋濕的冷冽。',
    },
    pressurePoints: [
      { title: '假裝危險不存在', description: '用白話說，就是當你的房子已經在漏水了，你卻因為不想處理麻煩，而告訴自己「雨總會停的」。在投資上，這會讓你錯過調整資產的最佳時機；等到你真的發現不對勁時，可能那些公司已經病入膏肓，讓你連止損的餘地都沒有。', action: '不必每天看盤，但要保留一個固定回頭檢查的時間。' },
    ],
    actions: [
      { title: '往「積極參與」跨出一小步', description: '你不需要變成頻繁交易的短線客，但可以試著每季一次，主動去閱讀你持股的現況。這種練習能幫你把「鴕鳥心態」轉化為「有意識的守護」，讓你不是因為害怕而躺平，而是因為了解而安穩。', steps: ['固定每季選一天，打開帳戶並閱讀持股的近況。', '只檢查當初買進的理由是否還成立。', '有變化時先記下來，再決定是否需要調整。'] },
    ],
    pouches: {
      safety: '設定一個「警報帳戶」。當總資產變動超過 20% 時，讓系統主動傳簡訊給你，強迫你睜開眼看一下。',
      mindset: '不動如山是種智慧，但前提是你要確定你坐的那座山，不是一座活火山。',
      behavior: '找一個比你積極的朋友，每半年跟他吃一次飯，聽聽「外面的世界」正在發生什麼。',
    },
    reminder: '願你的平靜帶領你度過波動，在歲月中長成最豐滿的果實。',
    shareText: '我是「深海巨龜隱者」。我不追每天的漲跌，只想用看得懂的方式慢慢走。最近在練習：每季回頭看一次持股。',
  },
};
