# STARCARE Supabase 部署與驗收 Runbook

> **對照**：**`docs/business-logic.md`** §0（**`.cursorrules`** §3「部署與驗收閘門」）；PAT／部署後自檢（可選 **`npm run ci`**）見 **`docs/security-token-rotation-checklist.md`** **§D**；序號清單主檔「**運維與工程**」路徑彙列見 **`docs/pdf-sequenced-gap-checklist.md`**（與 **`go-live-checklist.md`**、本 runbook、憑證清單同列）。

**全案收尾與證據留痕**：見 **`README.md`**「專案收尾」；證據索引 **`docs/project-completion-evidence-index-2026-05.md`**；快速啟動 **`docs/project-completion-kickoff-checklist-2026-05.md`**。

## 1) 前置條件
- 已安裝 Node.js 與 npm。
- 專案根目錄已有 `.env`（包含 `VITE_SUPABASE_URL`、`VITE_SUPABASE_ANON_KEY`）。
- 已有 Supabase `Project Ref` 與 `Personal Access Token`（PAT）。

## 2) 一次性綁定與部署
在專案根目錄執行（`<...>` 請替換）。**建議**以 **`package.json`** 之 **`ops:deploy:all`** 為權威清單（含 **`db push --yes`** 與目前倉庫所列全部 Edge functions）；數量隨版本變更，**勿**再以固定支數對照。

```bash
export SUPABASE_ACCESS_TOKEN="<PAT>"
npx supabase link --project-ref "<PROJECT_REF>" --yes
npm run ops:deploy:all
```

若需單支除錯，可改 **`npx supabase functions deploy <function-name>`**（名稱與 **`ops:deploy:all`** 內之 **`deploy …`** 一致）。

- 遠端若曾以**舊版** **`ops:deploy:all`**（未含 **`service-forms-list`**／**`upsert`**／**`soft-delete`**）部署，請再執行一次 **`npm run ops:deploy:all`** 以補齊服務表單 Edge；變更說明見 **`docs/pdf-sequenced-gap-checklist.md`**（**2026-05-03**）。

## 3) 快速狀態檢查
```bash
SUPABASE_ACCESS_TOKEN="<PAT>" npx supabase migration list
SUPABASE_ACCESS_TOKEN="<PAT>" npx supabase functions list
# 或專案腳本（同上需 PAT／已 link）
npm run ops:verify
```

驗收標準：
- migration 的 `Local` 與 `Remote` 版本一致。
- **`supabase functions list`**（或 **`npm run ops:verify`**）所見之已部署 functions 皆為 **`ACTIVE`**，且覆蓋 **`ops:deploy:all`** 目前列舉範圍（以倉庫 **`package.json`** 為準）。

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
- 於前端 repo 執行 **`npm run ci`**：含 **`lint`**、**`typecheck`**、**`vitest`**、**`npm run build:demo`**（清空 **`VITE_SUPABASE_*`** 之 bundle）與 Playwright demo 全套，驗骨幹路由與審計標題；與 **`.github/workflows/ci.yml`** 同源（該 workflow 為分步執行、指令集合相同），**不需**遠端 Supabase 已連線亦可先跑。
- 可選登入真實專案：**`npm run test:e2e:auth`**（**`playwright.auth.config.ts`** 使用 **`npm run build`** 保留 **`VITE_*`**），環境變數見 **`.env.example`**（**`E2E_AUTH_*`**）。
- 審計 **`audit_events`** 與 UI 之正式庫抽測勾選項見 **`docs/go-live-checklist.md`** §8。
- PAT／部署後自檢（含可選 **`npm run ci`**、**`acceptance:*`**／全閘對照）見 **`docs/security-token-rotation-checklist.md`** **§D**、**`docs/go-live-checklist.md`** §6。

## 7) 常見問題
- `Cannot find project ref`：先執行 `supabase link`。
- `Access token not provided`：設定 `SUPABASE_ACCESS_TOKEN` 或先 `supabase login`。
- `unknown flag: --all`：CLI 不支援 `functions deploy --all`；請用 **`npm run ops:deploy:all`** 或逐支 **`supabase functions deploy <name>`**。
- `verify_jwt expected map/struct`：不要在 `config.toml` 寫舊版布林格式。
