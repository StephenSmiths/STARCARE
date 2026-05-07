# STARCARE Phase 5 Day 1 完成報告

> **對照**：交付索引 **`docs/phase5-day1-delivery-index.md`**、打包清單 **`docs/phase5-final-delivery-package.md`**；運維總覽 **`docs/business-logic.md`** §0（**`.cursorrules`** §3）；序號主檔「**運維與工程**」列 **`docs/pdf-sequenced-gap-checklist.md`**；**全案收尾**：**`README.md`**「專案收尾」（**`docs/business-logic.md`** §0 **全案收尾執行** 併述 **README** 表前互鏈指引（含各檔 **對照**／**全案收尾母索引**））、**`docs/project-completion-evidence-index-2026-05.md`**、**`docs/project-completion-kickoff-checklist-2026-05.md`**；Gate A 自動證據固定入口 **`docs/evidence/gate-a-latest.md`**（檔內 **Next Command** 與 **`preflight:strict`** 並列；**`npm run gatea:evidence:list`**／**`npm run gatea:evidence:refresh`**／**`npm run gatea:evidence:preflight:strict`**；檔尾 blockquote 四行：**`gateALatestMarkdownFooterLines`**（**`docs/gate-a-status-2026-05-06-commands-appendix.md#gate-a-appendix-latest-segment`** 下文 **`latest`** 段））；多數 **`gatea:evidence:*`** 終端 stdout 頁尾 **`scripts/gate-a-markdown-footer.mjs`**（**Export 契約**）。

## 一、範圍與結論
- 本階段目標：將排班 KPI 趨勢由「本機快取」升級為「伺服端可持久化與可重試同步」。
- 結論：Phase 5 Day 1 已完成資料層、API 層、前端同步層與驗收自動化，達到可部署狀態。

## 二、已完成項目

### 2.1 資料庫與資料治理
- 新增 migration：`supabase/migrations/20260430195000_scheduling_kpi_history.sql`
- 建立 `scheduling_kpi_history` 表，包含：
  - KPI 快照數值欄位
  - `actor_id`（操作者）
  - `is_deleted` / `deleted_at`（軟刪除）
- 補上 RLS 政策（staff/admin 可讀、authenticated 且 actor 相符可寫）。

### 2.2 Edge Functions（Repository Pattern 對應）
- 新增三個函式：
  - `scheduling-kpi-history-list`
  - `scheduling-kpi-history-upsert`
  - `scheduling-kpi-history-clear`
- 皆套用 `requireStaffUser`，維持角色授權一致性。
- 清除行為採 soft delete，符合不可硬刪除規範。

### 2.3 前端同步與容錯
- 新增 repository/service：
  - `src/repositories/schedulingKpiHistoryRepository.ts`
  - `src/services/schedulingKpiHistorySyncService.ts`
- 新增 `useSchedulingKpiHistory` hook，完成：
  - 啟動時 hydrate 伺服端資料
  - append / clear 同步
  - 同步失敗時 fallback 本機快取
  - 手動「重試同步」機制
  - 重試成功一次性提示（約 4 秒自動消失）

### 2.4 驗收與交付自動化
- 新增自動驗收：
  - `scripts/phase5-day1-acceptance.mjs`
  - `npm run acceptance:phase5`
  - `docs/phase5-day1-automation-report.md`
- 新增交付打包：
  - `scripts/phase5-create-delivery-bundle.mjs`
  - `npm run delivery:phase5`
  - `npm run delivery:phase5:zip`
  - `npm run delivery:phase5:clean`

## 三、驗收結果
- `npm run lint`：通過
- `npm run test`：通過
- `npm run acceptance:phase5`：PASS
- 交付包腳本：可正常產出 `delivery/phase5-day1-YYYY-MM-DD/`

## 四、現況限制（非阻塞）
- 自動驗收未包含 UI E2E（目前維持人工 smoke 驗收）。
- `acceptance:phase5` 的 Supabase 線上檢查仍依賴 `SUPABASE_ACCESS_TOKEN`。

## 五、下一步建議（Phase 5 Day 2）
1. 補 KPI 同步流程 E2E（斷網 -> 重試 -> 恢復）測試腳本。
2. 新增伺服端 KPI 歷史查詢過濾（日期區間 / 操作者）。
3. 規劃週/月維度 KPI 圖表視圖，支援管理層回顧。

## 六、文件索引
- `docs/phase5-day1-delivery-index.md`
- `docs/phase5-day1-automation-runbook.md`
- `docs/phase5-day1-automation-report.md`

## 七、續維護（與 CI 全閘對齊）
- **`acceptance:phase5`** 僅涵蓋 `lint`／`test`（及可選遠端檢查）；與 **`.github/workflows/ci.yml`** **指令集合一致**之程式全閘請執行 **`npm run ci`**（含 **`typecheck`**、**`build:demo`**、Playwright）。見 **`docs/feature-list.md`** §8、**`docs/phase5-day1-automation-runbook.md`** §三、**`docs/supabase-deploy-runbook.md`** §6。
