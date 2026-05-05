# STARCARE 正式上線檢查清單（Go-Live）

> **對照**：運維、憑證與前端 **`npm run ci`** 等文件總覽見 **`docs/business-logic.md`** §0（**`.cursorrules`** §3「部署與驗收閘門」、**`README.md`** 文件表）；序號清單主檔「**運維與工程**」路徑彙列見 **`docs/pdf-sequenced-gap-checklist.md`**。

**全案收尾與證據留痕**：見 **`README.md`**「專案收尾」小節；快速啟動 **`docs/project-completion-kickoff-checklist-2026-05.md`**；完成度盤點 **`docs/project-completion-audit-2026-05-05.md`**；證據索引 **`docs/project-completion-evidence-index-2026-05.md`**。

## 0. 今日上線目標
- [ ] 完成最小閉環驗收（登入 -> 排班 -> 儲存 -> DB 驗證）
- [ ] 完成安全收尾（PAT 輪替、舊 PAT 停用；見 **`docs/security-token-rotation-checklist.md`**；**§D** 可選 **`npm run ci`**）
- [ ] 完成部署狀態確認（migration/functions；見 **`docs/supabase-deploy-runbook.md`** §2／§3）

## 1. 身分與授權（Auth / RLS）
- [ ] 至少有 1 位 `admin` 與 1 位 `staff` 可成功登入。
- [ ] `public.user_roles` 可查到對應 `user_id` 與 `role`。
- [ ] 未授權帳號呼叫 Edge API 時，回應 `401/403`（抽測至少 1 次）。
- [ ] `residents` / `scheduling_history` 的讀取符合 RLS 預期。

### 1.1 可選：Playwright（demo 煙霧／登入，本機或 CI）
- [ ] 本機 **`npm run ci`**（`lint`→`typecheck`→`vitest`→**`build:demo`**（清空 `VITE_SUPABASE_*` 建置）→`PW_PREVIEW_ONLY=1` 之 Playwright demo 全套）已通過；與 GitHub Actions 對照見 `docs/feature-list.md` §8。
- [ ] `.env` 已設 `VITE_SUPABASE_URL`、`VITE_SUPABASE_ANON_KEY`，並設測試帳號之 `E2E_AUTH_EMAIL`、`E2E_AUTH_PASSWORD`（見 `.env.example`）。
- [ ] `npm run test:e2e:auth` 通過（`playwright.auth.config.ts`：登入後見儀表盤審計區、側欄「登出」；`/#service-forms` 見 **Staff／待審** 與審計標題且無「無法載入時段或院友資料」；`/#work-session-plans` 見 **我的工作計劃** 與審計標題且無「無法載入工作計劃時段，請稍後重試。」；`/#residents` 見 **院友資料概覽** 與 **最近審計紀錄** 且無「無法載入院友名單，請稍後重試。」；`/#scheduling` 見 **本次排班指派** 與 **排班與相關操作審計** 且無「無法連線載入院友或時段資料，請檢查網路與 API 設定。」；`/#notification-center` 見 **未讀通知** 與 **審計紀錄節錄**；`/#historical-documents` 見 **母本要求僅展示** 與 **匯出審計**；並涵蓋 **開工／收工交更**、**復康追蹤**、**評估管理**、**用戶手冊** 等 Staff 可進 hash，詳見 `e2e/auth-login.spec.ts`、`e2e/auth-login.staff-modules.spec.ts`）；或本機一鍵 **`npm run test:e2e:all`**（先 demo 煙霧再可選登入）。

## 2. 部署與版本一致性（DB / Functions）
- [ ] `npx supabase migration list`：`Local` 與 `Remote` 完全一致（亦可 **`npm run ops:verify`** 併查，見 **`docs/supabase-deploy-runbook.md`** §3）。
- [ ] `npx supabase functions list`：所有已部署 functions 皆為 **`ACTIVE`**，且覆蓋 **`package.json`** 之 **`ops:deploy:all`** 所列範圍（含 import validate+commit、審計、**service-forms-*** 等；**§2** 為建議部署指令；舊版腳本遺漏之補佈見 **`docs/supabase-deploy-runbook.md`** §2）。新增 Edge 之 PR 檢核見 **`docs/pdf03-cursorrules-alignment.md`** §3。
- [ ] 本次上線時間與操作者已記錄（留存於內部紀錄）。

## 3. 智能排班閉環驗收（業務）
- [ ] 新增 1 位院友（含 funding_type）。
- [ ] 按「啟動智能排班」可產生指派（Pass 結果可見）。
- [ ] 無衝突時可按「一鍵儲存排班結果」。
- [ ] 前端出現儲存成功提示。
- [ ] `public.scheduling_history` 有新增資料列。
- [ ] `actor_id` 對應目前登入使用者 UUID（非 `TeamLead_demo`）。

## 4. 資料驗證 SQL（上線當天必跑）
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

## 4.1 批量匯入壓測紀錄（500 筆）
- [x] `docs/residents-import-500-valid.csv`：500 筆全合法，預檢快速完成（欄位與 **`/residents-import-template.csv`** 一致，含可選 **`assessmentNextDueDate`**）。
- [x] `docs/residents-import-500-mixed-errors.csv`：500 筆（約 10% 錯誤），預檢快速完成且錯誤回報正確（同上欄位結構）。
- [x] 已完成確認匯入流程（可匯入資料成功寫入院友清單）。
- [ ] 匯入後 SQL 驗證完成（請執行 `docs/residents-import-verification.sql`，已含 **`admission_date`**／**`assessment_next_due_date`**）。

## 4.2 Phase 3 Day 5（匯入 UX 與驗收收口）
- [x] 三個匯入模組已統一「本地格式錯誤先修正，再進行預檢」防呆。
- [x] 三個匯入模組已新增批次摘要卡（總數/成功/失敗/耗時/批次時間）。
- [x] 三個匯入模組已新增最近 10 次匯入歷史。
- [x] 已建立驗收文件：
  - `docs/phase3-day5-acceptance.md`
  - `docs/phase3-day5-acceptance-result-2026-04-30.md`

## 5. 風險與回復方案
- [ ] 已備妥回復路徑：`docs/supabase-deploy-runbook.md`（含可選 **`npm run ci`** 與審計 §8 交叉引用）。
- [ ] 已確認 Edge 契約：**`docs/residents-edge-function-contract.md`**（院友 CRUD／匯入）；**`docs/assessment-completion-records-contract.md`**（評估完成／審計；與 **§8** RES-06 抽測併用）。
- [ ] 若儲存失敗，先看前端錯誤訊息，再查 function logs 與 SQL 寫入狀態。

## 6. 憑證與安全（必做）
- [ ] 產生新 PAT 後，完成驗證部署（細節與部署後自檢見 **`docs/security-token-rotation-checklist.md`**；**§D** 含可選 **`npm run ci`**（與 **`.github/workflows/ci.yml`** 同源）及 **`acceptance:*`**／全閘對照鏈結）。
- [ ] 停用舊 PAT。
- [ ] 確認 `.env` 未入版控（`.gitignore` 生效）。
- [ ] 不在聊天與文件中貼出新 PAT/service role key。

## 7. 上線簽核（簡版）
- [ ] 產品/業務確認：排班結果符合預期。
- [ ] 技術確認：部署、RLS、審計資料正常（審計 UI／DB／RLS 抽測勾選項見 **§8**）。
- [ ] 決策人確認：允許正式上線。

## 8. 審計紀錄（RES-06）正式庫抽測
與 **`docs/feature-list.md`** 之 **RES-06** 對照；本節勾選完成後，可將該功能列狀態改為 **`已完成`**。  
若上線範圍含評估完成補登，**`assessment-completion-records-append`** 成功後寫入 **`audit_events`** 之欄位與預期，見 **`docs/assessment-completion-records-contract.md`**。

- [ ] 以 **`teamlead`** 或 **`admin`** 登入：儀表 **`/#dashboard`** 首屏底部見 **全域審計摘要**（或等效區塊），列表可載入、無持續性錯誤提示。
- [ ] 至少開啟一處含 **`AuditTrailPanel`** 的模組（例如 **`/#scheduling`**、**`/#residents`**、**`/#service-forms`**），見審計標題與列表區；與 **`e2e/auth-login.spec.ts`**／**`e2e/auth-login.staff-modules.spec.ts`** 預期一致。
- [ ] 於 UI 執行 **1 次**會觸發 **`audit-trail-append`** 的操作（例如排班儲存、院友主檔更新、服務表單送審等，依當日上線範圍）；成功後重新整理該頁或返回儀表，新事件出現於審計列表或摘要（依產品行為）。
- [ ] （建議）於 Supabase SQL Editor 執行下列查詢，確認 **`public.audit_events`** 有對應時間之新列、**`actor_id`** 為目前登入使用者 UUID（文字）、**`is_deleted`** 為 **false**：

```sql
select id, action, entity_type, entity_id, actor_id, occurred_at
from public.audit_events
where is_deleted = false
order by occurred_at desc
limit 20;
```

- [ ] **RLS 抽測**：**`staff`** 帳號僅能見 **`actor_id`＝本人** 之事件；**`teamlead`／`admin`** 可見全院 **`is_deleted = false`** 列（與 **`supabase/migrations/20260502133000_audit_events.sql`** 註解一致）。
