# STARCARE 正式上線檢查清單（Go-Live）

## 0. 今日上線目標
- [ ] 完成最小閉環驗收（登入 -> 排班 -> 儲存 -> DB 驗證）
- [ ] 完成安全收尾（PAT 輪替、舊 PAT 停用）
- [ ] 完成部署狀態確認（migration/functions）

## 1. 身分與授權（Auth / RLS）
- [ ] 至少有 1 位 `admin` 與 1 位 `staff` 可成功登入。
- [ ] `public.user_roles` 可查到對應 `user_id` 與 `role`。
- [ ] 未授權帳號呼叫 Edge API 時，回應 `401/403`（抽測至少 1 次）。
- [ ] `residents` / `scheduling_history` 的讀取符合 RLS 預期。

## 2. 部署與版本一致性（DB / Functions）
- [ ] `npx supabase migration list`：`Local` 與 `Remote` 完全一致。
- [ ] `npx supabase functions list`：所有已部署 functions 皆為 `ACTIVE`（含 residents/staff/activity-sessions import validate+commit）。
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
- [x] `docs/residents-import-500-valid.csv`：500 筆全合法，預檢快速完成。
- [x] `docs/residents-import-500-mixed-errors.csv`：500 筆（約 10% 錯誤），預檢快速完成且錯誤回報正確。
- [x] 已完成確認匯入流程（可匯入資料成功寫入院友清單）。
- [ ] 匯入後 SQL 驗證完成（請執行 `docs/residents-import-verification.sql`）。

## 4.2 Phase 3 Day 5（匯入 UX 與驗收收口）
- [x] 三個匯入模組已統一「本地格式錯誤先修正，再進行預檢」防呆。
- [x] 三個匯入模組已新增批次摘要卡（總數/成功/失敗/耗時/批次時間）。
- [x] 三個匯入模組已新增最近 10 次匯入歷史。
- [x] 已建立驗收文件：
  - `docs/phase3-day5-acceptance.md`
  - `docs/phase3-day5-acceptance-result-2026-04-30.md`

## 5. 風險與回復方案
- [ ] 已備妥回復路徑：`supabase-deploy-runbook.md`。
- [ ] 已確認 Edge function contract：`residents-edge-function-contract.md`。
- [ ] 若儲存失敗，先看前端錯誤訊息，再查 function logs 與 SQL 寫入狀態。

## 6. 憑證與安全（必做）
- [ ] 產生新 PAT 後，完成驗證部署。
- [ ] 停用舊 PAT。
- [ ] 確認 `.env` 未入版控（`.gitignore` 生效）。
- [ ] 不在聊天與文件中貼出新 PAT/service role key。

## 7. 上線簽核（簡版）
- [ ] 產品/業務確認：排班結果符合預期。
- [ ] 技術確認：部署、RLS、審計資料正常。
- [ ] 決策人確認：允許正式上線。
