# STARCARE Phase 5 Day 1 交付包索引

## 一、目標
- 提供 Phase 5 Day 1（KPI 趨勢伺服端持久化）的一頁式交付索引，便於驗收與交接。

## 二、核心變更
- Migration：
  - `supabase/migrations/20260430195000_scheduling_kpi_history.sql`
- Edge Functions：
  - `supabase/functions/scheduling-kpi-history-list/index.ts`
  - `supabase/functions/scheduling-kpi-history-upsert/index.ts`
  - `supabase/functions/scheduling-kpi-history-clear/index.ts`
- 前端同步層：
  - `src/repositories/schedulingKpiHistoryRepository.ts`
  - `src/services/schedulingKpiHistorySyncService.ts`
  - `src/features/scheduling/hooks/useSchedulingKpiHistory.ts`

## 三、驗收與操作文件
- 最終打包寄送清單：
  - `docs/phase5-final-delivery-package.md`
- 發送模板：
  - `docs/phase5-delivery-message-template.md`
- 完成報告：
  - `docs/phase5-day1-completion-report.md`
- 對外摘要：
  - `docs/phase5-day1-external-summary.md`
- 自動驗收 Runbook：
  - `docs/phase5-day1-automation-runbook.md`
- 自動驗收報告（每次執行更新）：
  - `docs/phase5-day1-automation-report.md`
- 交付驗證報告（每次驗證更新）：
  - `docs/phase5-day1-delivery-verification-report.md`
- 收口摘要（每次收口更新）：
  - `docs/phase5-day1-closeout-summary.md`

## 四、關鍵 npm 指令
- `npm run acceptance:phase5`
- **`npm run ops:deploy:all`**（已含 **`db push --yes`** 與全部 Edge；見 **`docs/supabase-deploy-runbook.md`** §2）；僅 schema、暫不重佈 Edge 時可單獨 **`npm run db:push`**
- `npm run delivery:phase5`
- `npm run delivery:phase5:zip`
- `npm run delivery:phase5:clean`
- `npm run delivery:phase5:verify`
- `npm run closeout:phase5:summary`
- `npm run closeout:phase5:status`
- `npm run closeout:phase5`
- `npm run closeout:phase5:fresh`

## 五、建議交接順序
1. 先提供 `docs/phase5-day1-automation-report.md`（驗收證據）
2. 再提供 `docs/phase5-day1-automation-runbook.md`（操作與復核）
3. 最後附上本索引（`docs/phase5-day1-delivery-index.md`）作為導覽

## 六、完成判定
- [ ] `npm run acceptance:phase5` 結果為 PASS
- [ ] UI 已驗證同步失敗提示與重試成功提示
- [ ] Migration 與三個 KPI Edge Functions 已完成部署（建議 **`npm run ops:deploy:all`**；見 **`docs/supabase-deploy-runbook.md`** §2）
