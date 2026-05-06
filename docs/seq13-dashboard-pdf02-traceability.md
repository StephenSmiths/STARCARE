# Seq 13：儀表盤（PDF 02【1】）逐欄對照骨架

> **對照**：母本 **`docs/pdf/02-STARCARE-智能院舍照護管理系統.pdf`** **【1】儀表盤**；條文整理 **`docs/business-logic.md`**（§4.1～§4.3、§5 審計）；序號總表 **`docs/pdf-sequenced-gap-checklist.md`** Seq **13**；P0 可勾項 **`docs/pdf-alignment-p0-backlog.md`** B 區第一列。  
> **用途**：供產品／客戶將 **PDF 頁碼／【N】** 填入「母本定位」欄，並於「驗收證據」勾選或附 PR／截圖／E2E 連結後，方可視為 **Seq 13 逐欄對表** 完成。爭議時以 **簽核 PDF** 為準。

> **全案收尾與證據留痕**：**`README.md`**「專案收尾」（**`docs/business-logic.md`** §0 **全案收尾執行** 併述 **README** 表前互鏈指引；**`docs/project-completion-*.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log.md`** 及歸檔 **`docs/pdf-sequenced-gap-checklist-revision-log-2026-05-01a.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p2.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p3.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p4.md`**）；**`docs/project-completion-evidence-index-2026-05.md`**；**`docs/project-completion-kickoff-checklist-2026-05.md`**；Gate A 自動證據固定入口 **`docs/evidence/gate-a-latest.md`**（檔內 **Next Command** 與 **`preflight:strict`** 並列；**`npm run gatea:evidence:list`**／**`npm run gatea:evidence:refresh`**／**`npm run gatea:evidence:preflight:strict`**）。

---

## 1. 畫面區塊總覽

| 區塊（畫面） | 主要元件 | 說明 |
|-------------|-----------|------|
| 建議動線 | `DashboardDailyFlowPanel` | 新手導引（權限分 Staff／管理職）；與 02【1】是否逐字一致 **待母本對表**。 |
| 週三零次提醒 | `DashboardTeamLeadWednesdayCard` | 僅 **TeamLead／Admin**；邏輯對齊 **01 §4.1**（`buildMidweekSubsidizedZeroAlerts`）。 |
| 核心指標 | `DashboardOverviewPanel` | 六格摘要；數值來自 `buildDashboardSummary`。 |
| 快速連結 | `DashboardHome` 內靜態 `#hash` | 排班／院友／員工匯入；與 02【1】是否必列 **待母本對表**。 |
| 審計摘要 | `AuditTrailPanel` | 與 **Seq 12** 同源合併；見 **01 §5**。 |

---

## 2. 逐欄對照表（骨架）

**欄位說明**

- **母本定位**：請填 **PDF 頁碼** 或 **【N】**（與母本圖註一致）。  
- **程式／資料來源**：實作錨點（Repository／Service／Hook）。  
- **驗收證據**：`待簽核` → 改為 `已簽核` 時請附 **證據鏈**（截圖、手測紀錄、E2E、或 SQL）。

| # | 畫面標籤（中文） | 母本定位（待填） | 程式／資料來源 | 驗收證據 |
|---|-----------------|------------------|----------------|----------|
| 1 | 院友總數（在住） | 02【1】＿＿頁 | `residentService.listActiveResidents()` → `residents.length`（`useDashboardOverview`） | 待簽核 |
| 2 | §4.1 資助復康族群人數（卡片提示內） | 01 **§4.1** | `mapActiveResidentsToSubsidizedSchedulingResidents` → `subsidizedRehabCohortCount` | `dashboardSummaryService.test.ts`；正式庫抽樣 **待簽核** |
| 3 | 員工總數（概覽） | 02【1】＿＿頁 | `staffManagementService.listStaffOverview` → `staffRows.length` | 待簽核 |
| 4 | 今日活動時段（分軌：資助復康 · 認知） | 01 **§4.2** | `schedulingConfigService.listSchedulingSessions` + `countSessionsOnLocalDateByTrack` | 待簽核 |
| 5 | 本週合規（最近 KPI 覆蓋率） | 02【1】／01 **§4** | `schedulingKpiHistorySyncService.loadLocal` → `lastWeeklyCoveragePercent`；分母提示綁 §4.1 族群 | 待簽核 |
| 6 | 待辦（評估 14 天內到期） | 01 **§4.3** | `assessmentDueTaskRepository.listDueWithinLeadDays` | 待簽核（與 **Seq 9** 正式模型上線後複驗） |
| 7 | 今日團隊 PT／OT（另含「其他」人數） | 02【1】＿＿頁 | `rehabDisciplineFamilyFromStaff`（**僅** `staff_profiles.role_type`） | P0 子項已程式收斂；**母本逐字** 待簽核 |
| 8 | 合規：週三資助復康零次提醒 | 01 **§4.1** | `buildMidweekSubsidizedZeroAlerts` + `DashboardTeamLeadWednesdayCard` | 待簽核 |
| 9 | 全域審計摘要（儀表盤） | 01 **§5** | `useAuditTrailList` + `AuditTrailPanel` | `e2e/smoke.spec.ts` 首屏；正式庫 **Seq 12** 待簽核 |
| 10 | 建議從哪裡開始？（動線導引） | 02【1】＿＿頁 | `DashboardDailyFlowPanel`（`useAuth` 權限） | 待簽核 |

---

## 3. 自動化測試錨點（補證據用）

| 測試檔 | 涵蓋列 |
|--------|--------|
| `src/features/dashboard/services/dashboardSummaryService.test.ts` | #2～#7 之數值彙總與 PT/OT 分類 |
| `e2e/smoke.spec.ts` | 首屏 `#dashboard`、`儀表盤` 標題 |
| `e2e/auth-login.spec.ts` | 登入後儀表盤＋審計標題 |

---

## 4. 維護閉環

- 變更 **`DashboardSummary`** 欄位或 **`useDashboardOverview`** 資料來源時：同步更新 **本表** 與 **`docs/pdf-alignment-p0-backlog.md`** Seq 13 敘述；序號主檔修訂列寫入 **`docs/pdf-sequenced-gap-checklist-revision-log.md`**（見 **`docs/pdf03-cursorrules-alignment.md`** §4）。
- **下一序號（02 模組）**：**Seq 14** **`docs/seq14-work-plan-pdf02-traceability.md`** → **Seq 15** **`docs/seq15-scheduling-pdf02-traceability.md`** → **Seq 16** **`docs/seq16-work-session-plans-pdf02-traceability.md`** → **Seq 17** **`docs/seq17-service-forms-pdf02-traceability.md`** → **Seq 18** **`docs/seq18-shift-start-handover-pdf02-traceability.md`** → **Seq 19** **`docs/seq19-end-shift-handover-pdf02-traceability.md`** → **Seq 20** **`docs/seq20-work-analysis-review-pdf02-traceability.md`** → **Seq 21** **`docs/seq21-rehab-activity-tracking-pdf02-traceability.md`** → **Seq 22** **`docs/seq22-assessment-management-pdf02-traceability.md`** → **Seq 23** **`docs/seq23-historical-documents-pdf02-traceability.md`** → **Seq 24** **`docs/seq24-ai-report-center-pdf02-traceability.md`** → **Seq 25** **`docs/seq25-residents-management-pdf02-traceability.md`** → **Seq 26** **`docs/seq26-staff-management-pdf02-traceability.md`** → **Seq 27** **`docs/seq27-notification-center-pdf02-traceability.md`** → **Seq 28** **`docs/seq28-user-manual-pdf02-traceability.md`** → **Seq 29** **`docs/seq29-system-settings-pdf02-traceability.md`**（02【16】末序；**03** 工程 **Seq 35～38** 對照骨架 **`docs/seq35-pdf03-cursorrules-alignment-traceability.md`** 起鏈，總表 **`pdf-sequenced-gap-checklist.md`** C 區）。

---

| 日期 | 說明 |
|------|------|
| 2026-05-04 | 初版：Seq 13 **逐欄對照骨架**（母本頁碼／簽核欄位留白）。 |
| 2026-05-04 | 維護閉環增 **Seq 14** 鏈結：**`docs/seq14-work-plan-pdf02-traceability.md`**。 |
| 2026-05-04 | 「下一序號」擴鏈：**Seq 15** **`docs/seq15-scheduling-pdf02-traceability.md`**。 |
| 2026-05-04 | 「下一序號」再擴：**Seq 16** **`docs/seq16-work-session-plans-pdf02-traceability.md`**。 |
| 2026-05-04 | 「下一序號」再擴：**Seq 17** **`docs/seq17-service-forms-pdf02-traceability.md`**。 |
| 2026-05-04 | 「下一序號」再擴：**Seq 18** **`docs/seq18-shift-start-handover-pdf02-traceability.md`**。 |
| 2026-05-04 | 「下一序號」再擴：**Seq 19** **`docs/seq19-end-shift-handover-pdf02-traceability.md`**。 |
| 2026-05-04 | 「下一序號」再擴：**Seq 20** **`docs/seq20-work-analysis-review-pdf02-traceability.md`**。 |
| 2026-05-04 | 「下一序號」再擴：**Seq 21** **`docs/seq21-rehab-activity-tracking-pdf02-traceability.md`**。 |
| 2026-05-04 | 「下一序號」再擴：**Seq 22** **`docs/seq22-assessment-management-pdf02-traceability.md`**。 |
| 2026-05-04 | 「下一序號」再擴：**Seq 23** **`docs/seq23-historical-documents-pdf02-traceability.md`**。 |
| 2026-05-04 | 「下一序號」再擴：**Seq 24** **`docs/seq24-ai-report-center-pdf02-traceability.md`**。 |
| 2026-05-04 | 「下一序號」再擴：**Seq 25** **`docs/seq25-residents-management-pdf02-traceability.md`**。 |
| 2026-05-04 | 「下一序號」再擴：**Seq 26** **`docs/seq26-staff-management-pdf02-traceability.md`**。 |
| 2026-05-04 | 「下一序號」再擴：**Seq 27** **`docs/seq27-notification-center-pdf02-traceability.md`**。 |
| 2026-05-04 | 「下一序號」再擴：**Seq 28** **`docs/seq28-user-manual-pdf02-traceability.md`**。 |
| 2026-05-04 | 「下一序號」再擴：**Seq 29** **`docs/seq29-system-settings-pdf02-traceability.md`**（02【16】末序）。 |
| 2026-05-04 | 「下一序號」補 **03／C 區**：**Seq 35** **`docs/seq35-pdf03-cursorrules-alignment-traceability.md`** 起鏈至 **Seq 38**（見 **`pdf-sequenced-gap-checklist.md`** C 區）。 |
