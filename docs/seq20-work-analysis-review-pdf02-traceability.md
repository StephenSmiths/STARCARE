# Seq 20：智能工作分析／表單審核（PDF 02【7】）對照骨架

> **對照**：母本 **`docs/pdf/02-STARCARE-智能院舍照護管理系統.pdf`** **【7】**；條文整理 **`docs/business-logic.md`**（**01 §2.2** 表單審批與 **Seq 12** 審計）；序號總表 **`docs/pdf-sequenced-gap-checklist.md`** Seq **20**；P0 **`docs/pdf-alignment-p0-backlog.md`** Seq **20**。  
> **上一序號**：**`docs/seq19-end-shift-handover-pdf02-traceability.md`**（收工交更【6】）。  
> **用途**：將 **提交概況、團隊報告、複用表單審核、回饋占位、審計／通知閉環** 與母本對表；標示 **後端報表、電郵／即時推送** 缺口。

> **全案收尾與證據留痕**：**`README.md`**「專案收尾」（**`docs/business-logic.md`** §0 **全案收尾執行** 併述 **README** 表前互鏈指引（含各檔 **對照**／**全案收尾母索引**）；**`docs/project-completion-*.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log.md`** 及歸檔 **`docs/pdf-sequenced-gap-checklist-revision-log-2026-05-01a.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p2.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p3.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p4.md`**）；**`docs/project-completion-evidence-index-2026-05.md`**；**`docs/project-completion-kickoff-checklist-2026-05.md`**；Gate A 自動證據固定入口 **`docs/evidence/gate-a-latest.md`**（檔內 **Next Command** 與 **`preflight:strict`** 並列；**`npm run gatea:evidence:list`**／**`npm run gatea:evidence:refresh`**／**`npm run gatea:evidence:preflight:strict`**）。

---

## 1. 畫面與模組

| 區塊 | 元件／Hook | 說明 |
|------|------------|------|
| 提交概況 | `SubmissionOverviewCards` | 依 **`buildFormSubmissionOverview(workspace.allForms)`** 聚合（**Seq 17** 同源資料）。 |
| 團隊報告 | `TeamReportActionsPanel` | **`buildTeamReportPlainText`** → 剪貼簿複製（非後端報表）。 |
| 審批 | `ServiceFormReviewPanel` | 複用 **`useServiceFormsWorkspace`**（`pendingReview`、核准／退回）。 |
| 回饋／通知 | `FeedbackAndNotifyStubs` | 回饋草稿 **localStorage** `starcare-work-analysis-feedback-draft-v1`；通知段說明 **Seq 27【14】**。 |
| 頁殼 | `WorkAnalysisReviewHome` | 載入／錯誤、`AuditTrailPanel`（**`FORM_*`** 與通知中心同源）。 |

**路由**：`view:work-analysis-review`（TeamLead／Admin）、**`#work-analysis-review`**（**Staff 無此路由**，見 **`WorkAnalysisReviewHome`** 註解）。

---

## 2. 資料與邏輯

| 資料／邏輯 | 來源 | 母本／P0 落差（待簽核） |
|------------|------|-------------------------|
| 表單全集 | `useServiceFormsWorkspace.allForms` | 主檔敘述：正式版應 **後端報表** 為權威 |
| 待審列表 | `pendingReview`（`status === 'SUBMITTED'`） | 與 **02【7】** 逐字對表 |
| 概況統計 | `workAnalysisReviewSummaryService` | 純函式、無 I/O |

---

## 3. 審計與通知

| 機制 | 說明 |
|------|------|
| 全域審計 | **`AuditTrailPanel`**＋`useAuditTrailList`；**`FORM_SUBMIT`**／**`FORM_APPROVE`**／**`FORM_REJECT_REVISION`**／**`FORM_SOFT_DELETE`**（與 **Seq 12**、**Seq 27** 衍生通知同源）。 |
| 回饋草稿 | 僅本機；UI 提示「正式版應入庫並寫審計」。 |

---

## 4. 自動化測試與 E2E 錨點

| 測試／E2E | 涵蓋 |
|-----------|------|
| `workAnalysisReviewSummaryService.test.ts` | `buildFormSubmissionOverview`、`buildTeamReportPlainText` |
| `e2e/smoke.spec.ts` | `#work-analysis-review`、**表單與審批相關審計** 標題 |

---

## 5. 維護閉環

- 變更 **`FormSubmissionOverview`** 欄位、**`ServiceFormReviewPanel`** 契約或 **表單審計 `action`** 時：同步本檔、**`docs/seq17-service-forms-pdf02-traceability.md`**（表單域）、**`pdf-sequenced-gap-checklist.md`** Seq 20、**`pdf-sequenced-gap-checklist-revision-log.md`**（**`docs/pdf03-cursorrules-alignment.md`** §4）。
- **下一序號**：復康活動追蹤 **Seq 21**（02【8】）— **`docs/seq21-rehab-activity-tracking-pdf02-traceability.md`**（互鏈本序號）。

---

| 日期 | 說明 |
|------|------|
| 2026-05-04 | 初版：Seq 20 **對照骨架**；與 Seq 19 互鏈。 |
| 2026-05-04 | §5：與 **`seq21-rehab-activity-tracking-pdf02-traceability.md`** 互鏈。 |
