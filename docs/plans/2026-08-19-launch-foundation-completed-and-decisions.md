# FACE v2.5｜上線基礎完成項目與明日決策

日期：2026-08-19

## 今晚已完成（不需要產品決策）

1. `/my-result` 結果復原
   - 讀取目前 24 題暫存 `face_pending_assessment_v3`。
   - 相容舊 40 題暫存 `face_pending_assessment_v1`。
   - 登入後在本機無結果時，從 Supabase 讀取最近一筆 baseline assessment。
   - 增加「載入中」與「尚未完成測驗」畫面，不再空白。
   - 避免 React 初始空狀態在資料尚未復原前覆寫 localStorage。

2. 正式路由收斂
   - 公開人格正式網址統一為 `/types/:code`。
   - `/reading-prototype?type=CODE` 自動轉到 `/types/CODE`。
   - 正式環境的 `/preview-results` 轉到對應正式人格頁。
   - 正式環境的 `/test-mockup` 轉到 `/test`。
   - 會員中心、內容中心與人格圖鑑的「我的結果」改走 `/my-result`。
   - 無效人格、文章與未知網址改為真正的 404 畫面。

3. SEO 基礎
   - 首頁、16 型人格、內容中心、文章、關於、作者與方案頁使用獨立 title／description。
   - 動態設定 canonical、Open Graph、Twitter Card 與 robots。
   - 私人、測驗、後台、覺察、結果與開發頁設為 noindex。
   - 新增 `public/robots.txt`。
   - 新增 `public/sitemap.xml`，包含首頁、16 型人格與公開文章 001～007。
   - 新增 404 並設為 noindex。

4. 導覽與內容路徑
   - Logo、主導覽、人格卡、文章卡、方案入口與文章上下篇改為真正的 `<a href>`。
   - 暫時隱藏未完成英文版入口。
   - 會員選單支援點擊，不再只依賴 hover。
   - 正式內容中心隱藏 3 支示範影片，但保留程式與資料為 draft。
   - 文章新增上一篇、下一篇與 24 題測驗入口。

5. 收款安全閘
   - 正式交付完成前，前端購買按鈕停用並明確顯示「暫不收款」。
   - 後端建立 ECPay 訂單預設拒絕，避免繞過前端誤收款。
   - 完成驗收後需同時設定：
     - 前端 `VITE_PAYMENTS_ENABLED=true`
     - 後端 `PAYMENTS_ENABLED=true`

## 明天需要產品負責人決定

### A. 法律與信任資訊

- 對外聯絡 Email／聯絡方式。
- 服務提供者名稱（個人、工作室或公司）。
- 退款與取消規則：適用期間、數位內容開始提供後如何處理。
- 帳號與資料刪除申請管道、預計處理天數。
- 隱私政策要列出的實際第三方：Supabase、Google Form／Sheets、Email 服務、ECPay、分析工具。

完成以上資料後再建立正式：隱私權政策、使用條款、退款政策、資料刪除說明與全站 footer 連結。

### B. NT$590 交付定義

- 使用者實際買到的內容清單與完成狀態。
- 付款後第一個落地頁。
- 是永久存取、期間存取，或版本存取。
- 交易計畫卡、風險報酬計算器、事件交易日曆尚未完成時，是否先排除於販售內容。
- 訂單 Email 的寄件名稱、寄件信箱、內容與存取連結。
- 付款成功、失敗、重複通知、退款後撤權的驗收案例。

### C. 早鳥／候補名單

- 正式收款前 CTA 要導向哪裡：Google Form、Email 留資或既有研究問卷。
- 需要收集的最少欄位與同意文字。
- 是否承諾早鳥價、通知時間或額外權益。

### D. 漏斗分析與隱私

- 是否使用站內 Supabase 事件、PostHog，或其他分析工具。
- 是否允許匿名 session id、保存多久、Cookie／同意提示如何呈現。
- 確認後再實作 `landing_view` 到 `purchase_success` 的事件漏斗，避免先收集再補告知。

### E. 發布動作

- 審閱本次修改後，再決定是否 commit、push 與部署 Vercel。
- 部署後提交 sitemap 到 Google Search Console，並逐頁檢查 canonical 與索引狀態。
