# FACE 如鏡網站：Claude Code 專案說明

這是一個以 React 19、TypeScript 與 Vite 建置的 FACE 交易人格網站。請把本檔視為 Claude Code 進入專案後的第一份說明。

## 專案目標

- 以 40 題測驗辨識使用者的 FACE 四維交易人格。
- 提供 16 型動物人格圖鑑、完整人格說明、互補輪盤與結果頁。
- 維持「現代東方繪本」的視覺語言：奶油白、米灰、暖棕、霧藍灰、低飽和森林綠，搭配水彩與鉛筆線稿。
- 桌機與手機皆需可用，並保留足夠留白與成熟編輯感。

## 開發指令

```powershell
npm install
npm run dev
npm run build
npm run typecheck
```

- Vite 預設開發埠寫在 `vite.config.ts`，目前為 `3000`；若被占用，Vite 可能自動使用其他埠。
- 正式建置輸出到 `dist/`。
- Vercel 設定在 `vercel.json`，所有前端路徑會回到 `index.html`。

## 主要入口與路由

路由由 `App.tsx` 依 `window.location.pathname` 管理，沒有使用 React Router。

| 路徑 | 畫面 | 主要元件 |
|---|---|---|
| `/` | 首頁 | `components/LandingInfo.tsx` |
| `/test` | 40 題人格測驗 | `components/FaceAssessment.tsx` |
| `/types` | 16 型人格圖鑑 | `components/RoleGallery.tsx` |
| `/types/:code` | 單一人格詳情 | `components/RoleDetail.tsx` |
| `/types/compatibility` | 交易互補輪盤 | `components/CompatibilityWheel.tsx` |
| `/preview-results?type=AILC` | 結果頁預覽 | `components/ResultPreview.tsx` + `components/Dashboard.tsx` |
| `/watch` | 內容中心 | `components/ContentHub.tsx` |
| `/mirror-trade` | 鏡相診股 | `components/MirrorTrade.tsx` |
| `/me` | 會員中心 | `components/MemberHome.tsx` |

## 16 型資料來源

### 網站內資料

- `constants.tsx`
  - `FACE_MAP`：16 型基礎資料、圖片路徑、分數與測驗相關內容。
  - `getFaceCode()`：將四維分數轉為四字母人格代碼。
- `data/personalityEditorial.ts`
  - 16 型的長篇編輯內容。
  - 圖鑑詳情與測驗結果頁共用這份資料。
- `components/RoleDetail.tsx`
  - 同時服務 `/types/:code` 與結果頁中的完整人格說明。
  - 修改這裡時必須同時檢查兩個入口。

### 原始優化版 Markdown

最新版人物誌位於：

```text
C:\Users\nplus chang\Desktop\作圖\*_交易人格測驗_優化版.md
```

該資料夾另有：

- `交易人格16型圖鑑.html`：獨立單檔參考版圖鑑。
- `build.js`：由 16 份 Markdown 產生參考版 HTML。
- `AGENTS.md`：Markdown 固定結構、16 型代碼與關係規則。
- `webimg/`：參考版使用的壓縮圖片。

同步人物誌時，先讀取對應的 `*_優化版.md`，再更新 `data/personalityEditorial.ts`。若基礎座右銘或三個錦囊也有變動，同步更新 `constants.tsx`。除非使用者明確要求，不要一次改動其他人格。

## 圖片對照

- `public/images/homepage-trading-salon.png`：首頁彩色動物群像。
- `public/images/homepage-trading-salon-lineart.png`：淡線稿背景。
- `public/images/personalities/face-NN-landscape.png`：16:9 彩色人格圖。
- `public/images/personalities/face-NN-sketch.png`：正方形線稿人格圖。

圖片路徑已寫入 `FACE_MAP`。不要在元件中另建第二套人格與圖片對照。

## 視覺與排版規則

- 優先沿用目前色彩：`#FBFAF7`、`#F4F0E9`、`#2D2D2D`、`#70665D`、`#8C635B`、`#D1D1C7`。
- 中文主標使用既有 `.serif` 類別；正文維持清楚的行高與暖灰色。
- 避免霓虹色、飽和紅藍、3D 渲染、廉價股票海報感。
- 線稿背景必須低對比，文字區要有足夠遮罩，不能影響閱讀。
- 不要改成幼兒卡通或 Q 版風格。
- 維持現有全站導覽與 FACE 鏡子字標。

## 人格頁修改檢查

人格內容或版型變動後，至少確認：

1. `/types/AILC` 等圖鑑詳情頁內容正確。
2. `/preview-results?type=AILC` 的結果頁同步顯示相同內容。
3. `/types` 的卡片仍能進入正確人格頁。
4. `/types/compatibility` 的人格連結仍可用。
5. `npm run build` 成功。

## 後端與環境變數

- Supabase 用戶與測驗紀錄：`lib/supabase.ts`、`services/`、`supabase/`。
- Gemini 只由 `api/gemini/` 的伺服器端函式呼叫。
- 環境變數範例在 `.env.example`。
- 絕對不要提交 `.env.local`，也不要把 `GEMINI_API_KEY` 改成 `VITE_` 前綴。

## 修改原則

- 保留現有 React/Vite 架構，不要把獨立 HTML 整份貼入 `App.tsx`。
- 若參考 `交易人格16型圖鑑.html`，請拆解其設計並移植到既有元件，保留網站狀態、路由、會員與測驗功能。
- 優先修改現有元件與資料檔，不要建立重複的 16 型資料庫。
- 不要修改 `compound-engineering-plugin/`；它不是 FACE 網站功能的一部分。
- 工作區可能有使用者尚未提交的變更，不能重置或覆蓋無關檔案。

## 開啟方式

在 Claude Code 中選擇或切換到此資料夾：

```powershell
cd "C:\Users\nplus chang\Documents\FACE 如鏡網站優化"
claude
```

Claude Code 進入後應先閱讀本 `CLAUDE.md`，再依需求查看相關元件與資料檔。
