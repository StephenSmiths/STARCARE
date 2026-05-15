# Seq 17：填寫表單（PDF 02【5】）對照骨架

> **對照**：母本 **`docs/pdf/02-STARCARE-智能院舍照護管理系統.pdf`** **【5】**；條文整理 **`docs/business-logic.md`**（**01 §2.1** 僅 ACCEPTED 可填、**§2.2** 狀態鎖）；序號總表 **`docs/pdf-sequenced-gap-checklist.md`** Seq **17**；P0 **`docs/pdf-alignment-p0-backlog.md`** Seq **17**；真庫 E2E 敘述見 **Seq 3**。  
> **上一序號**：**`docs/seq16-work-session-plans-pdf02-traceability.md`**（工作節 **COMPLETED** 與本模組閉環）。  
> **用途**：將 **選日→選節→填寫→提交→審核** 與 **01 §2** 狀態機對表；標示 **localStorage／Edge `service_forms`** 雙寫與 **RLS** 驗收缺口。

> **全案收尾與證據留痕**：**`README.md`**「專案收尾」（**`docs/business-logic.md`** §0 **全案收尾執行** 併述 **README** 表前互鏈指引（含各檔 **對照**／**全案收尾母索引**）；**`docs/project-completion-*.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log.md`** 及歸檔 **`docs/pdf-sequenced-gap-checklist-revision-log-2026-05-01a.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p2.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p3.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p4.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p5.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-seq29-2026-05-09b.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-gate-a-stdout-2026-05-09.md`**）；**`docs/project-completion-evidence-index-2026-05.md`**；**`docs/project-completion-kickoff-checklist-2026-05.md`**；Gate A 自動證據固定入口 **`docs/evidence/gate-a-latest.md`**（檔內 **Next Command** 與 **`preflight:strict`** 並列；**`npm run gatea:evidence:list`**／**`npm run gatea:evidence:refresh`**／**`npm run gatea:evidence:preflight:strict`**；檔尾 blockquote 四行：**`gateALatestMarkdownFooterLines`**（**`docs/gate-a-status-2026-05-06-commands-appendix.md#gate-a-appendix-latest-segment`** 下文 **`latest`** 段））；多數 **`gatea:evidence:*`** 終端 stdout 末兩行 **`gateAStandardCloseoutBlockquotes`**（**第一行**併主日誌 **Gate A／stdout** 細列歸檔 **`docs/pdf-sequenced-gap-checklist-revision-log-archive-gate-a-stdout-2026-05-09.md`**；**第二行**併 **人工／strict-http／keep=1**）維護：**`scripts/gate-a-markdown-footer.mjs`**（**Export 契約**）；人工 **`docs/gate-a-manual-evidence-checklist-2026-05-06.md`** 開首（strict-http／keep=1；**`docs/go-live-checklist.md`** §0.1）。

---

## 1. 畫面與模組

| 區塊 | 元件／Hook | 說明 |
|------|------------|------|
| 員工填寫 | `ServiceFormStaffPanel` | 選日、選工作節、草稿、提交（`useServiceFormsWorkspace`）。 |
| 審核 | `ServiceFormReviewPanel` | 核准／退回（權限 `action:approve-form`、`canApproveForm`）。 |
| 頁殼 | `ServiceFormsHome` | 載入中／錯誤、**`AuditTrailPanel`**。 |
| 工作區 | `useServiceFormsWorkspace` | 時段、院友、`mergeServiceFormsWithRemote`、`serviceFormRepository`。 |

---

## 2. 表單狀態（01 §2.2）與程式

| 狀態 | 允許動作（現況） | 程式錨點 | 母本定位（待填） |
|------|------------------|----------|------------------|
| `DRAFT` | 儲存草稿、提交 | `upsertDraftServiceForm`、`submitServiceForm` | 02【5】＿＿頁 |
| `SUBMITTED` | 主管核准／退回 | `approveServiceForm`、`rejectServiceFormRevision` | 02【5】＿＿頁 |
| `APPROVED` | 鎖定不可改 | `assertFormEditable` | **01 §2.2** |
| `REJECTED_NEEDS_REVISION` | 再改草稿 | `upsertDraftServiceForm` | 02【5】＿＿頁 |

**工作節前置**：`assertSessionAcceptedForSubmit`（**01 §2.1**）依 **`resolveLifecycleStatus`**（與 **Seq 16** `workSessionResponseStore` 同源）。

---

## 3. 審計動作（`FORM_*`）

| `action` | 觸發 | 備註 |
|----------|------|------|
| `FORM_DRAFT_UPSERT` | `upsertDraftServiceForm` | 草稿儲存 |
| `FORM_SUBMIT` | `submitServiceForm` | 待審 |
| `FORM_APPROVE` | `approveServiceForm` | 鎖定；並 **`completeWorkSessionAfterFormApproved`**（**`WORK_SESSION_COMPLETED`**） |
| `FORM_REJECT_REVISION` | `rejectServiceFormRevision` | 退回意見必填 |
| `FORM_SOFT_DELETE` | `softDeleteServiceForm` | 見 **`serviceFormSoftDeleteService`** |

---

## 4. 持久化與遠端

| 層 | 路徑 | 驗收備註 |
|----|------|----------|
| 本機 | `serviceFormStorage`（**localStorage**） | 與母本「是否允許以本機為準」**待簽核** |
| 遠端 | **`serviceFormRepository`**、`mergeServiceFormsWithRemote`（**`serviceFormSyncService`**） | 對表 **Seq 3** 真庫 E2E／RLS **`service_forms_rls`** |

---

## 5. 自動化測試錨點

| 測試檔 | 涵蓋 |
|--------|------|
| `serviceFormDomainService.guards.test.ts` | §2.1／§2.2 守門 |
| `serviceFormDomainService.lifecycle.test.ts` | 提交／核准／退回流程 |
| `serviceFormSoftDeleteService.test.ts` | 軟刪 |
| `e2e/service-forms-*.spec.ts` | UI 狀態（demo） |

---

## 6. 維護閉環

- 變更 **`ServiceFormStatus`**、`serviceFormDomainService` 或 **Edge 契約**時：同步本檔、**`pdf-sequenced-gap-checklist.md`** Seq 17、**`pdf-sequenced-gap-checklist-revision-log.md`**（**`docs/pdf03-cursorrules-alignment.md`** §4）。
- **下一序號**：開工接更 **Seq 18**（02【5b】）— **`docs/seq18-shift-start-handover-pdf02-traceability.md`**（互鏈本序號）。

---

| 日期 | 說明 |
|------|------|
| 2026-05-04 | 初版：Seq 17 **對照骨架**；與 Seq 16 互鏈。 |
| 2026-05-04 | §6：與 **`seq18-shift-start-handover-pdf02-traceability.md`** 互鏈。 |
