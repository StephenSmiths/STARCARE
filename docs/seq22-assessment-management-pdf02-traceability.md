# Seq 22：評估管理（PDF 02【9】）對照骨架

> **對照**：母本 **`docs/pdf/02-STARCARE-智能院舍照護管理系統.pdf`** **【9】**；條文整理 **`docs/business-logic.md`**（**§4.3** 評估錨點、**Seq 9** 待辦）；序號總表 **`docs/pdf-sequenced-gap-checklist.md`** Seq **22**；P0 **`docs/pdf-alignment-p0-backlog.md`** Seq **22**。  
> **上一序號**：**`docs/seq21-rehab-activity-tracking-pdf02-traceability.md`**（復康追蹤【8】）。  
> **用途**：將 **到期／逾期／完成率、PT·OT 版本補登、本機＋DB 合併、審計** 與母本對表；標示 **PDF 逐字對表** 與 **版本管理** 深度驗收缺口。

> **全案收尾與證據留痕**：**`README.md`**「專案收尾」（**`docs/business-logic.md`** §0 **全案收尾執行** 併述 **README** 表前互鏈指引（含各檔 **對照**／**全案收尾母索引**）；**`docs/project-completion-*.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log.md`** 及歸檔 **`docs/pdf-sequenced-gap-checklist-revision-log-2026-05-01a.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p2.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p3.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p4.md`**）；**`docs/project-completion-evidence-index-2026-05.md`**；**`docs/project-completion-kickoff-checklist-2026-05.md`**；Gate A 自動證據固定入口 **`docs/evidence/gate-a-latest.md`**（檔內 **Next Command** 與 **`preflight:strict`** 並列；**`npm run gatea:evidence:list`**／**`npm run gatea:evidence:refresh`**／**`npm run gatea:evidence:preflight:strict`**；檔尾 blockquote 四行：**`gateALatestMarkdownFooterLines`**（**`docs/gate-a-status-2026-05-06-commands-appendix.md`** **`latest`** 段））；多數 **`gatea:evidence:*`** 終端 stdout 頁尾 **`scripts/gate-a-markdown-footer.mjs`**（**Export 契約**）。

---

## 1. 畫面與模組

| 區塊 | 元件／Hook | 說明 |
|------|------------|------|
| 摘要 | `AssessmentSummaryCards` | 將到期筆數、逾期筆數、完成率（**`computeAssessmentCompletionRatePercent`**）。 |
| 補登 | `AssessmentCompletionForm` | 觸發 **`submitCompletion`**（PT／OT **`versionLabel`**）。 |
| 表格 | `AssessmentManagementTables` | 逾期列、將到期待辦、歷史 **`completions`**。 |
| 頁殼 | `AssessmentManagementHome` | 載入／錯誤、說明對齊 **Seq 9**（**180 日**週期）；**`AuditTrailPanel`**。 |
| 工作區 | `useAssessmentManagementWorkspace` | **`mergeAssessmentCompletionRecordsRemotePrimary`**；**`submittingLock`**；寫本機後 **`assessmentCompletionRecordRepository.append`**。 |

**路由**：`view:assessment-management`、**`#assessment-management`**（Staff／TeamLead／Admin）。

---

## 2. 網域邏輯（`assessmentManagementDomainService`）

| 概念 | 常數／函式 | 說明 |
|------|------------|------|
| 週期錨點 | **`computeLastPassedCycleAnchor`**、`ASSESSMENT_CYCLE_DAYS`（**`assessmentDueTaskService`**） | 入住日起每 **180** 日 |
| 逾期寬限 | **`ASSESSMENT_OVERDUE_GRACE_DAYS` = 14** | 錨點後超過寬限且缺 PT 或 OT → **`buildAssessmentOverdueRows`** |
| 將到期 | **`buildAssessmentDueSoonTasks`** | **`assessmentDueTaskRepository.listDueWithinLeadDays`**（預設 lead **14** 日） |
| 補登 | **`appendAssessmentCompletionsForCurrentAnchor`** | 可單獨補 PT 或 OT |

---

## 3. 持久化與 Edge

| 層 | 路徑 | 驗收備註 |
|----|------|----------|
| 本機 | **`assessmentCompletionStorage`**（與 **`loadAssessmentCompletions`**／**`saveAssessmentCompletions`**） | 遠端失敗時仍顯示本機 |
| 遠端 | **`assessmentCompletionRecordRepository`**（**`assessment-completion-records-list`**／**`append`**） | 契約見 **`docs/assessment-completion-records-contract.md`**；append 後 **`audit_events`**；審計失敗則軟刪本次列並 **`500`** |

---

## 4. 審計與通知

| `action` | 觸發 | 備註 |
|----------|------|------|
| **`ASSESSMENT_COMPLETION_RECORD`** | **`useAssessmentManagementWorkspace`** 補登成功後 | **`notificationCenterService`** 衍生通知 |

---

## 5. 自動化測試與 E2E 錨點

| 測試／E2E | 涵蓋 |
|-----------|------|
| `assessmentManagementDomainService.test.ts` | 錨點、逾期、完成率、append |
| `mergeAssessmentCompletionRecords.test.ts` | 遠端優先合併 |
| `e2e/smoke.spec.ts` | `#assessment-management` |
| `e2e/auth-login.staff-modules.spec.ts` | **`/#assessment-management`** |

---

## 6. 維護閉環

- 變更 **`ASSESSMENT_OVERDUE_GRACE_DAYS`**、**`AssessmentCompletionRecord`** 欄位或 **Edge 契約**時：同步本檔、**`docs/assessment-completion-records-contract.md`**、**`pdf-sequenced-gap-checklist.md`** Seq 22、**`pdf-sequenced-gap-checklist-revision-log.md`**（**`docs/pdf03-cursorrules-alignment.md`** §4）。
- **下一序號**：歷史文件 **Seq 23**（02【10】）— **`docs/seq23-historical-documents-pdf02-traceability.md`**（互鏈本序號）。

---

| 日期 | 說明 |
|------|------|
| 2026-05-04 | 初版：Seq 22 **對照骨架**；與 Seq 21 互鏈。 |
| 2026-05-04 | §6：與 **`seq23-historical-documents-pdf02-traceability.md`** 互鏈。 |
