---
title: FACE 銷售閉環 P0（訂單綁定 + 權益交付）
created_at: 2026-08-09
topic: face-sales-loop-p0
status: awaiting-confirmation
---

# FACE 銷售閉環 P0：訂單綁定使用者 + 付款成功發放權益

## 目標

用最短路徑打通銷售閉環：
`登入 → 做測驗 → 看結果 →(結果頁)購買 → 綁定帳號 → 付款成功自動發放權益 → 站內進入生存包`。

已鎖定的兩個決策：

- **結帳身分模式：登入後才可結帳（非匿名的正式帳號）。**
- **P0 交付形式：站內 gated 頁面（`/kit`）。**

## 原則：閉環不等於漏斗好、體驗好

打通金流只證明「路走得通」，不代表轉換率好。銷售閉環是一條**穿過整個漏斗的縱切線**；切過每一站時，順手把那一站的動機銜接、資訊層級與下一步引導一起做對。因此「直接長在成交路徑上的 UX」拉進 Sprint 1，與閉環一起做；不在成交路徑上的留存/獲客工作才延後。

### 漏斗 × 閉環 × UX 對照

| 漏斗站 | 閉環動作 | 同站的漏斗/UX 品質 | 指標 |
|---|---|---|---|
| 首頁 | — | 主按鈕只留「開始測驗」；3 信任點（約5分鐘/不評斷好壞/立即看見輪廓）；購買區不搶主 CTA 焦點 | 首頁→開始測驗 % |
| 測驗 | — | 進度感、可續作、全程免登入 | 40 題完成率 |
| 結果頁 | 放購買 CTA（閉環入口） | 先身分後分數再「接下來可以做什麼」；購買/分享/保存有層級，分享不壓過理解結果 | 停留、CTA 點擊 |
| 登入 | 綁定 user_id 的前提 | 登入是「保存+RATE」加值，非看結果的門檻；登入後自動 claim 訪客結果 | 結果後登入率 |
| 購買→交付 | P0-1 綁定 + P0-2 發放 | 付款成功即時可進 `/kit`；狀態清楚；失敗有明確回饋 | 結帳完成率 |
| 會員/回訪 | 權益顯示於 `/me` | `/me` 一眼看到最新結果/歷史/生存包/RATE；內容中心給回訪理由 | 回訪、加 LINE/RATE 點擊 |

## 執行順序（合併使用者留存路線圖後的最優解）

| Sprint | 內容 | 屬性 |
|---|---|---|
| 0 | 正式站驗收 Google / LINE / Email 登入與資料保存 | P0-1 的硬前提 |
| 1 | P0-1 訂單綁定 + P0-2 權益交付 + 結果頁購買 CTA + **首頁單一 CTA/信任點 + 結果頁資訊層級 + 付款後狀態體驗** | 銷售閉環核心＋成交路徑上的 UX |
| 1.5 | 隱私 / 條款 / 退款 / 投資免責 4 頁 + ECPay 轉正式環境 | 收真錢前必做 |
| 2 | 內容中心 3+3、文章 SEO、RATE 完整化、PostHog 四指標 | 留存/獲客（不在成交路徑上） |

非工程關鍵路徑：`/kit` 內的實際產品內容（數位指南＋4 工具＋30 天計畫）需並行產出，第一版可先為 PDF/清單。

---

## P0-1：訂單綁定使用者

### 資料層
新 migration `supabase/migrations/202608xxxxxx_add_payment_order_owner.sql`：

- `payment_orders` 新增：
  - `user_id uuid references auth.users (id)`
  - `email text`
  - `face_code text`（購買當下的人格代碼，供 CRM 分析）
- 新增 index `payment_orders_user_idx (user_id, created_at desc)`。
- 新增 RLS policy：`authenticated` 可 `select` `user_id = auth.uid()` 的訂單（讓會員中心 / 成功頁能查自己的訂單狀態）。insert / update 仍僅 service role。

### API
- `api/payments/ecpay/create.ts`
  - 讀取 `Authorization: Bearer <access_token>`。
  - 以 Supabase 驗證 token 取得 user；未登入回 `401 UNAUTHENTICATED`。
  - 將 `userId / email / faceCode` 傳入 `createPaymentOrder`。
- `api/_lib/paymentOrders.ts`
  - `createPaymentOrder` 參數新增 `userId / email / faceCode` 並寫入 insert。
  - `getPaymentOrder` 一併回傳 `user_id`（供 notify 發放權益使用）。

### 前端
- `components/SurvivalKitPricing.tsx`
  - 未登入時，點購買先開 `AuthDialog`（新增 `onRequireLogin` 或以 session 判斷）。
  - 已登入才 `fetch('/api/payments/ecpay/create')`，並在 header 帶 `getSession()` 的 `access_token`。
  - 需要一個管道把「登入請求」上拋到 `App.tsx`（重用既有 `handleLogin` / `setIsAuthDialogOpen`）。

**成果：** 每筆 `payment_orders` 都能對應到會員、email 與當時人格。

---

## P0-2：付款成功發放權益 + 站內交付

### 資料層
新 migration `supabase/migrations/202608xxxxxx_create_entitlements.sql`：

- `entitlements` 表：
  - `id uuid pk`
  - `user_id uuid references auth.users (id)`
  - `product_code text`（`face-survival-kit`）
  - `payment_order_id uuid references payment_orders (id)`
  - `status text default 'active' check (status in ('active','revoked'))`
  - `granted_at timestamptz default now()`、`revoked_at timestamptz`
  - `unique (user_id, product_code)`（防重複發放）
- RLS：`authenticated` 可 `select` `user_id = auth.uid()`；insert / update 僅 service role。

### API
- `api/payments/ecpay/notify.ts`（server-to-server 可信回呼）
  - 訂單轉 `paid` 後，於同一流程 `insert into entitlements`（`user_id = order.user_id`）。
  - 冪等：靠既有 `status === 'paid'` 判斷 + `unique(user_id, product_code)`；ECPay 重送不會重複發放。

### 前端
- 新 `services/entitlementService.ts`：`getMyEntitlements()` / `hasEntitlement('face-survival-kit')`。
- 新 gated 路由 `/kit`（`App.tsx` 路由表 + `viewFromPath` / `pathForView`）：
  - 有權益 → 渲染生存包內容容器（P0 先做可放內容的骨架）。
  - 無權益 → 導購（回生存包區塊）。
- `App.tsx` 首頁 `?payment=success` 區塊：靜態橫幅改為「進入你的生存包 →」按鈕，檢查權益後導 `/kit`。
- `components/MemberHome.tsx`：新增一張卡顯示購買狀態與 `/kit` 入口。
- `components/Dashboard.tsx`（結果頁）：新增生存包 CTA，作為閉環入口（使用者剛認識盲點時銜接）。

**成果：** 付款成功自動發放，使用者當場與日後從 `/me` 都能進入產品。

---

## 驗收

| 項目 | 檢查 | 通過訊號 |
|---|---|---|
| Build | `npm run build` | 無 TS 錯誤，production build 成功 |
| Migration | 套用到 Supabase 分支 | 兩張表 / 欄位 / RLS 建立成功 |
| 綁定 | 登入後結帳，查 `payment_orders` | 訂單帶正確 `user_id / email / face_code` |
| 未登入擋購 | 未登入點購買 | 先跳登入，不會建立訂單 |
| 發放冪等 | stage 模擬付款成功（含重送 notify） | `entitlements` 只有一筆 active |
| 交付 | 付款成功 → `/kit` | 有權益者看到內容；無權益者被導購 |
| 會員視圖 | `/me` | 顯示購買狀態與生存包入口 |
| 隔離 | 用另一帳號查 | 看不到別人的訂單與權益（RLS） |

## 收真錢前（Sprint 1.5）務必完成

- 隱私權、服務條款、退款/資料刪除、投資教育免責 4 頁。
- 先在 stage 完成端到端測試，再設 `ECPAY_ENV=production` 與正式商店代碼。
- 訂單/權益發放失敗的錯誤告警（避免收款成功但發放失敗無人知）。

## 範圍外（本 P0 不做）

- 生存包實際內容產出（並行的內容工作）。
- Email 收據 / 通知（列 P1）。
- 退款流程、跨 provider 帳號合併、PostHog 量測。
