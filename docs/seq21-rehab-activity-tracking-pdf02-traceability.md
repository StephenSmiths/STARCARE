# Seq 21：復康活動追蹤（PDF 02【8】）對照骨架

> **對照**：母本 **`docs/pdf/02-STARCARE-智能院舍照護管理系統.pdf`** **【8】**；條文整理 **`docs/business-logic.md`**（**01 §3／§4** 雙軌、不混算）；序號總表 **`docs/pdf-sequenced-gap-checklist.md`** Seq **21**；P0 **`docs/pdf-alignment-p0-backlog.md`** Seq **21**。  
> **上一序號**：**`docs/seq20-work-analysis-review-pdf02-traceability.md`**（工作分析【7】）。  
> **用途**：將 **兩軌乾跑快照、合規總覽、院友完成列表、審計面板** 與母本看板對表；標示 **與正式排班採用之差異** 與 **認知引擎／SOP** 驗收缺口。

> **全案收尾與證據留痕**：**`README.md`**「專案收尾」（**`docs/business-logic.md`** §0 **全案收尾執行** 併述 **README** 表前互鏈指引；**`docs/project-completion-*.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log.md`** 及歸檔 **`docs/pdf-sequenced-gap-checklist-revision-log-2026-05-01a.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p2.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p3.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p4.md`**）；**`docs/project-completion-evidence-index-2026-05.md`**；**`docs/project-completion-kickoff-checklist-2026-05.md`**；Gate A 自動證據固定入口 **`docs/evidence/gate-a-latest.md`**（檔內 **Next Command** 與 **`preflight:strict`** 並列；**`npm run gatea:evidence:list`**／**`npm run gatea:evidence:refresh`**／**`npm run gatea:evidence:preflight:strict`**）。

---

## 1. 畫面與模組

| 區塊 | 元件／Hook | 說明 |
|------|------------|------|
| 頁殼 | `RehabActivityTrackingHome` | 載入／錯誤／重試；說明為 **乾跑預覽**（未儲存排班、不寫 **`SCHEDULING_RUN`**）。 |
| 軌道區 | `RehabTrackSection` ×2 | **資助復康**（`showDementiaColumn={false}`）、**認知障礙症服務**（`showDementiaColumn`）。 |
| 資料 | `useRehabActivityTracking` | `residentService.listActiveResidents`、`schedulingConfigService.listSchedulingSessions`／`getRules`；**`useInvalidateOnSystemSettingsExternalChange`**。 |
| 審計 | `AuditTrailPanel` | 全域排班／匯出等；本頁乾跑不寫 **`SCHEDULING_RUN`**（見面板 **help**）。 |

**路由**：`view:rehab-activity-tracking`、**`#rehab-activity-tracking`**。

---

## 2. 快照服務（雙軌分離）

| 函式 | 軌道 | 程式錨點 | 備註 |
|------|------|----------|------|
| `buildSubsidizedRehabTrackSnapshot` | 資助復康 | `runSubsidizedRehabScheduling`（**`recordAudit: false`**） | `mapActiveResidentsToSubsidizedSchedulingResidents`、時段經 **`filterSchedulingSessionsForSubsidizedEngine`** |
| `buildDementiaServiceTrackSnapshot` | 認知 | `runDementiaTrackDryRun` | **`isDementiaCareCohort`**、`filterToDementiaServiceOnly`、**`DEMENTIA_WEEKLY_TARGET`**（**01 §3.3／§4** 與復康分離） |

**型別**：**`RehabActivityTrackSnapshot`**、**`RehabActivityTrackRow`**（週目標、預覽完成、達標、可選 **`dementiaLevel`**）。

---

## 3. 與 Seq 15／母本落差（待簽核）

| 項目 | 現況 | 母本／P0 |
|------|------|----------|
| 採用排班 | 僅預覽，**不**等同智能排班頁「確認採用」 | 02【8】逐欄對表 |
| 審計 | 乾跑不產生 **`SCHEDULING_RUN`** | 若母本要求追蹤頁寫入專用事件 **待裁定** |
| 認知引擎 | `dementiaTrackDryRunService` | 與正式 SOP **完全對齊** 仍待 **Seq 7**／客戶簽核 |

---

## 4. 自動化測試與 E2E 錨點

| 測試／E2E | 涵蓋 |
|-----------|------|
| `rehabActivityTrackingSnapshotService.test.ts` | 資助復康快照（mock 乾跑） |
| `dementiaTrackDryRunService.test.ts` | 認知軌乾跑 |
| `e2e/smoke.spec.ts` | `#rehab-activity-tracking`、**復康／排班相關審計** |
| `e2e/auth-login.staff-modules.spec.ts` | **`/#rehab-activity-tracking`** |

---

## 5. 維護閉環

- 變更 **`runSubsidizedRehabScheduling`** 契約、**`filterToDementiaServiceOnly`**、**`DEMENTIA_WEEKLY_TARGET`** 或 **`RehabTrackSection`** 欄位時：同步本檔、**`docs/seq15-scheduling-pdf02-traceability.md`**（排班域）、**`pdf-sequenced-gap-checklist.md`** Seq 21、**`pdf-sequenced-gap-checklist-revision-log.md`**（**`docs/pdf03-cursorrules-alignment.md`** §4）。
- **下一序號**：評估管理 **Seq 22**（02【9】）— **`docs/seq22-assessment-management-pdf02-traceability.md`**（互鏈本序號）。

---

| 日期 | 說明 |
|------|------|
| 2026-05-04 | 初版：Seq 21 **對照骨架**；與 Seq 20 互鏈。 |
| 2026-05-04 | §5：與 **`seq22-assessment-management-pdf02-traceability.md`** 互鏈。 |
