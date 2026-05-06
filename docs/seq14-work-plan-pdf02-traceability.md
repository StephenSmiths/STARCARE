# Seq 14：創建工作計劃（PDF 02【2】）逐屏／逐欄對照骨架

> **對照**：母本 **`docs/pdf/02-STARCARE-智能院舍照護管理系統.pdf`** **【2】**；條文整理 **`docs/business-logic.md`**（工作節／活動時段與 **01 §3** 等敘述）；序號總表 **`docs/pdf-sequenced-gap-checklist.md`** Seq **14**；P0 **`docs/pdf-alignment-p0-backlog.md`** Seq **14**。  
> **上一序號**：儀表盤對照見 **`docs/seq13-dashboard-pdf02-traceability.md`**。  
> **用途**：產品將 **PDF 頁碼／【N】／截圖編號** 填入「母本定位」；逐屏若與現行「預檢→`activity-sessions-import-commit`」流程不一致，須**客戶書面裁定**後再改程式或勾選 P0。

> **全案收尾與證據留痕**：**`README.md`**「專案收尾」（**`docs/project-completion-*.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log.md`** 及歸檔 **`docs/pdf-sequenced-gap-checklist-revision-log-2026-05-01a.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p2.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p3.md`**）；**`docs/project-completion-evidence-index-2026-05.md`**；**`docs/project-completion-kickoff-checklist-2026-05.md`**；Gate A 自動證據固定入口 **`docs/evidence/gate-a-latest.md`**（檔內 **Next Command** 與 **`preflight:strict`** 並列；**`npm run gatea:evidence:list`**／**`npm run gatea:evidence:refresh`**／**`npm run gatea:evidence:preflight:strict`**）。

---

## 1. 畫面與流程區塊

| 區塊 | 元件／模組 | 說明 |
|------|------------|------|
| 頁面殼 | `WorkPlansHome` | 嵌入表單＋頁底 **`AuditTrailPanel`**（`WORK_PLAN_SESSION_COMMIT` 等）。 |
| 五步進度 | `WorkPlanSopStepper` | 依表單狀態顯示 1～5 步（**非** DB 狀態機；與母本是否要求伺服器權威狀態 **待對表**）。 |
| 表單與預覽 | `WorkPlanComposerPanel` | 日期、員工、時段、名額、服務類型、預覽列表、儲存。 |
| 狀態與提交 | `useWorkPlanComposer` | `commitLockRef` 防重入發布；`workPlanCommitService`。 |
| 預檢與寫庫 | `workPlanCommitService` | `validate`→`commit`（**`activitySessionImportRepository`**）；審計 **`WORK_PLAN_SESSION_COMMIT`**。 |
| 草稿列驗證 | `workPlanDraftService` | `validateWorkPlanDraftLine`、`buildActivitySessionImportRows`。 |

---

## 2. SOP 五步與程式對照（骨架）

| 步驟（UI 文案） | 母本定位（待填） | 程式／資料行為 | 驗收證據 |
|----------------|------------------|----------------|----------|
| 1 選定計劃日期 | 02【2】＿＿頁 | `sessionDate`（`input type="date"`） | 待簽核 |
| 2 選定承接員工 | 02【2】＿＿頁 | `staffProfileId` ← `staffManagementService.listStaffOverview` | 待簽核 |
| 3 設定工作節 | 02【2】＿＿頁 | `timeSlot`、`capacity`、`serviceType`；活動主檔 `createActivityRepository().listActivities` | 待簽核 |
| 4 預覽並核對 | 02【2】＿＿頁 | `drafts[]`、`addDraft`／`removeDraft`；`validateWorkPlanDraftLine` | `workPlanDraftService.test.ts`；**逐屏** 待簽核 |
| 5 儲存並發布 | 02【2】＿＿頁 | `commitWorkPlanDrafts` → Edge 預檢／提交路徑；審計一筆 | 待簽核；與 **Seq 2**「工作節 DB 狀態機」是否需對齊 **待裁定** |

---

## 3. 審計與防重覆

| 項目 | 實作錨點 | 備註 |
|------|----------|------|
| 發布審計 | `workPlanCommitService` → `globalAuditTrailService.record`（`WORK_PLAN_SESSION_COMMIT`） | 與 **`AuditTrailPanel`** 合併顯示策略見 **Seq 12** |
| 防重覆提交 | `useWorkPlanComposer`：`commitLockRef` 於 `commitDrafts` 期間鎖定 | 與 **01** 防抖鐵律對表時請註明是否尚須 **Idempotency-Key**（**Seq 11**） |

---

## 4. 自動化測試錨點

| 測試檔 | 涵蓋範圍 |
|--------|----------|
| `src/features/workPlans/services/workPlanDraftService.test.ts` | 草稿列驗證、匯入列建構 |
| `e2e/smoke.spec.ts`（`#work-plan`） | 模組標題、「創建工作計劃（五步）」、`工作計劃發布審計` |

---

## 5. 維護閉環

- 變更 **`WorkPlanSopStepper`** 步驟文案、**`workPlanCommitService`** 契約或 **Edge** 名稱時：同步本檔、**`docs/pdf-sequenced-gap-checklist.md`** Seq 14、**`docs/pdf-sequenced-gap-checklist-revision-log.md`**（**`docs/pdf03-cursorrules-alignment.md`** §4）。
- **下一序號**：**Seq 15** **`docs/seq15-scheduling-pdf02-traceability.md`** → **Seq 16** **`docs/seq16-work-session-plans-pdf02-traceability.md`** → **Seq 17** **`docs/seq17-service-forms-pdf02-traceability.md`** → **Seq 18** **`docs/seq18-shift-start-handover-pdf02-traceability.md`** → **Seq 19** **`docs/seq19-end-shift-handover-pdf02-traceability.md`** → **Seq 20** **`docs/seq20-work-analysis-review-pdf02-traceability.md`** → **Seq 21** **`docs/seq21-rehab-activity-tracking-pdf02-traceability.md`** → **Seq 22** **`docs/seq22-assessment-management-pdf02-traceability.md`** → **Seq 23** **`docs/seq23-historical-documents-pdf02-traceability.md`** → **Seq 24** **`docs/seq24-ai-report-center-pdf02-traceability.md`** → **Seq 25** **`docs/seq25-residents-management-pdf02-traceability.md`** → **Seq 26** **`docs/seq26-staff-management-pdf02-traceability.md`** → **Seq 27** **`docs/seq27-notification-center-pdf02-traceability.md`** → **Seq 28** **`docs/seq28-user-manual-pdf02-traceability.md`** → **Seq 29** **`docs/seq29-system-settings-pdf02-traceability.md`**。

---

| 日期 | 說明 |
|------|------|
| 2026-05-04 | 初版：Seq 14 **逐屏／逐欄對照骨架**（與 Seq 13 文件鏈互鏈）。 |
| 2026-05-04 | 維護閉環增 **Seq 15** 鏈結：**`docs/seq15-scheduling-pdf02-traceability.md`**。 |
| 2026-05-04 | 「下一序號」擴至 **Seq 16** **`docs/seq16-work-session-plans-pdf02-traceability.md`**。 |
| 2026-05-04 | 「下一序號」擴至 **Seq 17** **`docs/seq17-service-forms-pdf02-traceability.md`**。 |
| 2026-05-04 | 「下一序號」擴至 **Seq 18** **`docs/seq18-shift-start-handover-pdf02-traceability.md`**。 |
| 2026-05-04 | 「下一序號」擴至 **Seq 19** **`docs/seq19-end-shift-handover-pdf02-traceability.md`**。 |
| 2026-05-04 | 「下一序號」擴至 **Seq 20** **`docs/seq20-work-analysis-review-pdf02-traceability.md`**。 |
| 2026-05-04 | 「下一序號」擴至 **Seq 21** **`docs/seq21-rehab-activity-tracking-pdf02-traceability.md`**。 |
| 2026-05-04 | 「下一序號」擴至 **Seq 22** **`docs/seq22-assessment-management-pdf02-traceability.md`**。 |
| 2026-05-04 | 「下一序號」擴至 **Seq 23** **`docs/seq23-historical-documents-pdf02-traceability.md`**。 |
| 2026-05-04 | 「下一序號」擴至 **Seq 24** **`docs/seq24-ai-report-center-pdf02-traceability.md`**。 |
| 2026-05-04 | 「下一序號」擴至 **Seq 25** **`docs/seq25-residents-management-pdf02-traceability.md`**。 |
| 2026-05-04 | 「下一序號」擴至 **Seq 26** **`docs/seq26-staff-management-pdf02-traceability.md`**。 |
| 2026-05-04 | 「下一序號」擴至 **Seq 27** **`docs/seq27-notification-center-pdf02-traceability.md`**。 |
| 2026-05-04 | 「下一序號」擴至 **Seq 28** **`docs/seq28-user-manual-pdf02-traceability.md`**。 |
| 2026-05-04 | 「下一序號」擴至 **Seq 29** **`docs/seq29-system-settings-pdf02-traceability.md`**。 |
