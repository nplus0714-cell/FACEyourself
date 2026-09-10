# FACE 測驗來源追蹤

## 追蹤範圍與隱私

來源追蹤只保存瀏覽器產生的匿名 UUID、UTM 標記、進入測驗／開始／完成的時間與測驗路徑。它**不保存**測驗答案、姓名、Email、IP 位址、完整 referrer URL 或登入 Token。

`first_*` 是第一來源，永不被後續造訪覆寫；`last_*` 是最近一次帶 UTM 的來源。站內跳轉不會把它誤改為 `direct`。報表依第一來源歸因。

## 個人檔案固定連結

| 平台 | 連結 |
| --- | --- |
| YouTube | `https://faceyourself.vercel.app/test?utm_source=youtube&utm_medium=profile&utm_campaign=brand_launch` |
| Facebook | `https://faceyourself.vercel.app/test?utm_source=facebook&utm_medium=profile&utm_campaign=brand_launch` |
| Instagram | `https://faceyourself.vercel.app/test?utm_source=instagram&utm_medium=profile&utm_campaign=brand_launch` |
| Threads | `https://faceyourself.vercel.app/test?utm_source=threads&utm_medium=profile&utm_campaign=brand_launch` |

文章、影片或貼文的 CTA 請保持相同 `utm_source`，並依形式更換 `utm_medium`：`post`、`reel`、`video` 或 `story`。同一檔內容可用 `utm_content` 放置穩定識別字，例如 `survival_01`；僅使用小寫英數、底線與連字號。

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

此 view 是管理端用途；瀏覽器帳號沒有讀取權限。
