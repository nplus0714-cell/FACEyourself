# FACE 測驗來源追蹤

## 正式站 GA4

GA4 資源使用 `FaceYourself` 的正式網頁串流。訪客允許 Google Analytics 後才會載入 Google 標記，隱私權政策頁可以變更偏好。程式手動送出站內換頁的 `page_view`，串流的「加強型評估」已關閉。查詢參數只保留合規格式的 UTM，測驗事件只含題號與頁面資訊。請勿把個人資料或識別碼放入 UTM。

| 事件 | 定義 |
| --- | --- |
| `quiz_landing_view` | 進入測驗頁 |
| `quiz_start` | 首次作答 |
| `quiz_question_progress` | 本次測驗首次回答某一題，題號為 `question_number` |
| `quiz_complete` | 回答全部 24 題並算出結果，在 GA4 標記為重要事件 |

- 在 GA4 的「流量開發」用「工作階段來源／媒介」及「工作階段廣告活動」查看社群、搜尋、轉介及直接流量，並選擇 `quiz_complete` 觀察各來源的完成情況。
- 在「探索」用封閉式漏斗 `quiz_landing_view` → `quiz_start` → `quiz_complete`，依來源或裝置拆分。完成率用同一漏斗中的完成使用者數除以開始使用者數。總事件次數會包含同一訪客的重測，適合看測驗次數。
- 在「探索」篩選 `quiz_question_progress`，使用「測驗題號」維度及使用者數看哪幾題掉得最多。以啟用日後的資料為準，等累積樣本再判讀。

## 追蹤範圍與隱私

既有的站內來源追蹤保存瀏覽器產生的匿名 UUID、UTM 標記、測驗事件時間、路徑及題號。它**不保存**測驗答案、姓名、Email、IP 位址、完整 referrer URL 或登入 Token。站內報表按第一個記錄到的來源歸因，GA4 的流量開發報表則按各次工作階段的來源歸因。

`first_*` 是第一來源，永不被後續造訪覆寫；`last_*` 是最近一次帶 UTM 的來源。站內跳轉不會把它誤改為 `direct`。報表依第一來源歸因。

## 個人檔案固定連結

| 平台 | 連結 |
| --- | --- |
| YouTube | `https://faceyourself.vercel.app/test?utm_source=youtube&utm_medium=profile&utm_campaign=brand_launch` |
| Facebook | `https://faceyourself.vercel.app/test?utm_source=facebook&utm_medium=profile&utm_campaign=brand_launch` |
| Instagram | `https://faceyourself.vercel.app/test?utm_source=instagram&utm_medium=profile&utm_campaign=brand_launch` |
| Threads | `https://faceyourself.vercel.app/test?utm_source=threads&utm_medium=profile&utm_campaign=brand_launch` |

文章、影片或貼文的 CTA 請保持相同 `utm_source`，並依形式更換 `utm_medium`：`post`、`reel`、`video` 或 `story`。同一檔內容可用 `utm_content` 放置穩定識別字，例如 `survival_01`；僅使用小寫英數、底線與連字號。

製作新一批社群宣傳連結時，可統一使用 `utm_medium=social`，並用 `utm_content` 區分版位和素材，如 `profile`、`reel_survival_01`。現有連結仍可用「工作階段來源／媒介」比對。

## Supabase 報表

套用 migration 後，Supabase Dashboard 的 SQL Editor 可執行：

```sql
select *
from public.funnel_source_summary
order by test_completers desc, test_starters desc, acquired_visitors desc;
```

欄位意義：

- `acquired_visitors`：首次被記錄到的匿名測驗訪客數。
- `test_landings`：進入 `/test` 的次數。
- `test_starters`：至少開始一次測驗的匿名訪客數。
- `test_completers`：至少完成一次測驗的匿名訪客數。
- `completion_rate`：完成者 ÷ 開始者。

這個累積報表仍包含舊版在開啟測驗時記錄的開始事件。2026-11-12 上線後，開始事件改為首次作答。衡量新流程的完成率時，請用上線後的資料。

此 view 是管理端用途；瀏覽器帳號沒有讀取權限。
