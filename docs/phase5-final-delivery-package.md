# STARCARE Phase 5 最終打包寄送清單（Day 1）

> **對照**：交付索引 **`docs/phase5-day1-delivery-index.md`**；運維與 CI 總覽 **`docs/business-logic.md`** §0（**`.cursorrules`** §3）、**`docs/feature-list.md`** §8（**`npm run ci`**／**`acceptance:phase5`**）；序號主檔「**運維與工程**」列 **`docs/pdf-sequenced-gap-checklist.md`**；**全案收尾**：**`README.md`**「專案收尾」（**`docs/business-logic.md`** §0 **全案收尾執行** 併述 **README** 表前互鏈指引（含各檔 **對照**／**全案收尾母索引**））、**`docs/project-completion-evidence-index-2026-05.md`**、**`docs/project-completion-kickoff-checklist-2026-05.md`**；Gate A 自動證據固定入口 **`docs/evidence/gate-a-latest.md`**（檔內 **Next Command** 與 **`preflight:strict`** 並列；**`npm run gatea:evidence:list`**／**`npm run gatea:evidence:refresh`**／**`npm run gatea:evidence:preflight:strict`**；檔尾 blockquote 四行：**`gateALatestMarkdownFooterLines`**（**`docs/gate-a-status-2026-05-06-commands-appendix.md#gate-a-appendix-latest-segment`** 下文 **`latest`** 段））；多數 **`gatea:evidence:*`** 終端 stdout 末兩行 **`gateAStandardCloseoutBlockquotes`**（**第一行**併主日誌 **Gate A／stdout** 細列歸檔 **`docs/pdf-sequenced-gap-checklist-revision-log-archive-gate-a-stdout-2026-05-09.md`**；**第二行**併 **人工／strict-http／keep=1**）維護：**`scripts/gate-a-markdown-footer.mjs`**（**Export 契約**）；人工 **`docs/gate-a-manual-evidence-checklist-2026-05-06.md`** 開首（strict-http／keep=1；**`docs/go-live-checklist.md`** §0.1）。

## 一、用途
- 提供 Phase 5 Day 1 完成後的一次性寄送清單，分為「內部技術包」與「對外摘要包」。

## 二、內部技術包（建議完整附上）

### A. 收口與總結
- `docs/phase5-day1-completion-report.md`
- `docs/phase5-day1-delivery-index.md`
- `docs/phase5-final-delivery-package.md`
- `docs/phase5-delivery-message-template.md`

### B. 驗收與操作
- `docs/phase5-day1-automation-runbook.md`
- `docs/phase5-day1-automation-report.md`
- `docs/phase5-day1-delivery-verification-report.md`
- `docs/phase5-day1-closeout-summary.md`

### C. 後端實作與資料治理
- `supabase/migrations/20260430195000_scheduling_kpi_history.sql`
- `supabase/functions/scheduling-kpi-history-list/index.ts`
- `supabase/functions/scheduling-kpi-history-upsert/index.ts`
- `supabase/functions/scheduling-kpi-history-clear/index.ts`

### D. 前端同步與容錯
- `src/repositories/schedulingKpiHistoryRepository.ts`
- `src/services/schedulingKpiHistorySyncService.ts`
- `src/features/scheduling/hooks/useSchedulingKpiHistory.ts`

## 三、對外摘要包（管理層 / 客戶）
- `docs/phase5-day1-external-summary.md`

## 四、建議寄送順序
1. `phase5-day1-external-summary.md`（先給結論）
2. `phase5-day1-completion-report.md`（再給細節）
3. `phase5-day1-automation-report.md`（驗收證據）
4. `phase5-day1-delivery-index.md`（交接導覽）

## 五、寄送前最後檢查
- [ ] `npm run acceptance:phase5` 已再次執行且 PASS
- [ ] （建議）**`npm run ci`** 已通過（與 **`.github/workflows/ci.yml`** 指令集合一致；**`acceptance:phase5`** 為較窄閘門，見 **`docs/feature-list.md`** §8）
- [ ] `docs/phase5-day1-automation-report.md` 為最新時間
- [ ] **`npm run ops:deploy:all`** 已完成（已含 **`db push --yes`**；見 **`docs/supabase-deploy-runbook.md`** §2）
- [ ] 對外包不含敏感環境資訊（token / key / 私密連線資訊）

## 六、一鍵收口指令
- `npm run closeout:phase5`
  - 會依序執行：
    1. `npm run acceptance:phase5`
    2. `npm run delivery:phase5:zip`
    3. `npm run delivery:phase5:verify`
    4. `npm run closeout:phase5:summary`
- `npm run closeout:phase5:status`
  - 產出收口狀態快照：`docs/phase5-day1-closeout-status.md`
- `npm run closeout:phase5:fresh`
  - 會先清理舊交付產物，再執行完整收口流程
