# STARCARE Supabase 部署與驗收 Runbook

## 1) 前置條件
- 已安裝 Node.js 與 npm。
- 專案根目錄已有 `.env`（包含 `VITE_SUPABASE_URL`、`VITE_SUPABASE_ANON_KEY`）。
- 已有 Supabase `Project Ref` 與 `Personal Access Token`（PAT）。

## 2) 一次性綁定與部署
在專案根目錄執行（`<...>` 請替換）：

```bash
SUPABASE_ACCESS_TOKEN="<PAT>" npx supabase link --project-ref "<PROJECT_REF>" --yes
SUPABASE_ACCESS_TOKEN="<PAT>" npx supabase db push --yes
SUPABASE_ACCESS_TOKEN="<PAT>" npx supabase functions deploy residents-create
SUPABASE_ACCESS_TOKEN="<PAT>" npx supabase functions deploy residents-get
SUPABASE_ACCESS_TOKEN="<PAT>" npx supabase functions deploy residents-list
SUPABASE_ACCESS_TOKEN="<PAT>" npx supabase functions deploy residents-soft-delete
SUPABASE_ACCESS_TOKEN="<PAT>" npx supabase functions deploy residents-update
SUPABASE_ACCESS_TOKEN="<PAT>" npx supabase functions deploy schedule-assignments-batch
SUPABASE_ACCESS_TOKEN="<PAT>" npx supabase functions deploy scheduling-sessions-list
```

## 3) 快速狀態檢查
```bash
SUPABASE_ACCESS_TOKEN="<PAT>" npx supabase migration list
SUPABASE_ACCESS_TOKEN="<PAT>" npx supabase functions list
```

驗收標準：
- migration 的 `Local` 與 `Remote` 版本一致。
- 7 支 function 皆為 `ACTIVE`。

## 4) 功能驗收（閉環）
1. 前端登入（應先看到登入頁，登入後可見左下 email / 登出）。
2. 新增院友。
3. 在智能排班按「啟動智能排班」。
4. 按「一鍵儲存排班結果」。
5. 成功提示出現：「排班結果已成功儲存，審計紀錄已寫入」。

## 5) SQL 驗收查詢
### 5.1 排班寫入驗收
```sql
select
  id,
  resident_id,
  session_id,
  staff_id,
  pass,
  actor_id,
  batch_id,
  created_at
from public.scheduling_history
where is_deleted = false
order by created_at desc
limit 10;
```

### 5.2 角色授權驗收
```sql
select
  ur.user_id,
  ur.role,
  au.email,
  ur.created_at
from public.user_roles ur
left join auth.users au on au.id = ur.user_id
order by ur.created_at desc
limit 20;
```

## 6) 前端儲存庫 CI 煙霧（可選，與遠端驗收併用）
- 於前端 repo 執行 **`npm run ci`**：含 **`lint`**、**`typecheck`**、**`vitest`**、**`npm run build:demo`**（清空 **`VITE_SUPABASE_*`** 之 bundle）與 Playwright demo 全套，驗骨幹路由與審計標題；與 **`.github/workflows/ci.yml`** 同源，**不需**遠端 Supabase 已連線亦可先跑。
- 可選登入真實專案：**`npm run test:e2e:auth`**（**`playwright.auth.config.ts`** 使用 **`npm run build`** 保留 **`VITE_*`**），環境變數見 **`.env.example`**（**`E2E_AUTH_*`**）。
- 審計 **`audit_events`** 與 UI 之正式庫抽測勾選項見 **`docs/go-live-checklist.md`** §8。

## 7) 常見問題
- `Cannot find project ref`：先執行 `supabase link`。
- `Access token not provided`：設定 `SUPABASE_ACCESS_TOKEN` 或先 `supabase login`。
- `unknown flag: --all`：目前 CLI 不支援 `functions deploy --all`，請逐支部署。
- `verify_jwt expected map/struct`：不要在 `config.toml` 寫舊版布林格式。
