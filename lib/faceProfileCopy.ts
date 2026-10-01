import type { FaceProfilePrototype } from '../data/faceProfilePrototype';

/** The same editorial copy is used in the full member reading and its public excerpt. */
export const getDecisionAction = (profile: FaceProfilePrototype): string => {
  const evidence = profile.code[1] === 'R'
    ? '把進場證據與失效條件各寫成一句話'
    : '把盤感翻成一個能被觀察與否證的條件';
  const timing = profile.code[2] === 'L'
    ? '設定下一次複查時間，不在盤中反覆重寫長期假設'
    : '進場前先寫下這一段行情的離場與失效位置';
  const exposure = profile.code[3] === 'C'
    ? '確認單一判斷失效時的最大損失仍在上限內'
    : '檢查不同部位是否其實承受同一種風險';
  return `${evidence}；${timing}；${exposure}。`;
};

export const getTalentPsychology = (profile: FaceProfilePrototype): string => {
  const evidence = profile.code[1] === 'R'
    ? '你的優勢來自把資訊轉成可核對的條件；但資料超過決策容量後，更多分析可能降低辨識力。'
    : '你的優勢來自快速整合分散訊號；但情緒提高時，最近、最鮮明的訊號容易被不成比例地放大。';
  const exposure = profile.code[3] === 'C'
    ? '集中能提高注意力，也會讓單一判斷更容易牽動自我認同。'
    : '分散能降低單點風險，標的過多時卻可能形成分散錯覺與注意力稀釋。';
  return `${evidence}${exposure}`;
};
