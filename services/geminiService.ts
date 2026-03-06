
import { GoogleGenAI, Type } from "@google/genai";
import { FaceScores, PersonalityProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateDynamicReport(
  dna: FaceScores, 
  daily: FaceScores, 
  profile: PersonalityProfile
) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        您是一位精通「行為金融學」與「禪修」的心理導師。
        用戶的靈魂 DNA 定錨人格為：【${profile.name} (${profile.code})】。
        今日市場收盤後，用戶進行了覺察，數據與其 DNA 基準產生了偏移。
        請根據 DNA 數據與今日覺察數據的差異，產出一份「偏移建議報告」。
        文案須極具深度且富有禪意，強調「覺察偏移即是回歸」。
      `,
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            soulPortrait: {
              type: Type.OBJECT,
              properties: {
                description: { type: Type.STRING },
                motto: { type: Type.STRING }
              },
              required: ["description", "motto"]
            },
            innerPain: { type: Type.STRING },
            blindSpot: { type: Type.STRING },
            zenSolution: { type: Type.STRING },
            antiHangover: {
              type: Type.OBJECT,
              properties: {
                mindset: { type: Type.STRING },
                lifesaver: { type: Type.STRING },
                blessing: { type: Type.STRING },
                micro: { type: Type.STRING }
              },
              required: ["mindset", "lifesaver", "blessing", "micro"]
            }
          },
          required: ["soulPortrait", "innerPain", "blindSpot", "zenSolution", "antiHangover"]
        },
        temperature: 0.8
      }
    });
    
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
}

/**
 * 獲取即時市場資訊並生成相關覺察題目
 */
export async function generateMarketAwareQuestions() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // 使用 Pro 模型以支持 Search
      contents: "請搜索今日台股（TWSE）與主要美股的最新盤勢、熱門板塊及情緒（特別是今日收盤後的市場焦點）。基於這些資訊，為『投資人格日記』生成 5 個今日專屬的覺察題目，必須包含 F.A.C.E. 維度（動機、邏輯、頻率、行為）。題目中要具體提到今天的市場現象（例如：今日大盤大漲/大跌、某個板塊領漲、或是震盪行情）。",
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              pair: { type: Type.ARRAY, items: { type: Type.STRING } },
              category: { type: Type.STRING },
              text: { type: Type.STRING, description: "包含今日盤勢具體細節的覺察問題" },
              labels: { type: Type.ARRAY, items: { type: Type.STRING }, description: "長度必須為 2，分別對應 A 與 B" }
            },
            required: ["id", "pair", "category", "text", "labels"]
          }
        }
      }
    });

    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Generate Market Questions Error:", error);
    return null; // 失敗時返回 null 讓組件使用 fallback
  }
}
