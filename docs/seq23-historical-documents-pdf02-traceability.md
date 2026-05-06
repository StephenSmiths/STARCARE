# Seq 23：歷史文件（PDF 02【10】）對照骨架

> **對照**：母本 **`docs/pdf/02-STARCARE-智能院舍照護管理系統.pdf`** **【10】**；條文整理 **`docs/business-logic.md`**（**01 §2.2** 核准後鎖定）；序號總表 **`docs/pdf-sequenced-gap-checklist.md`** Seq **23**；P0 **`docs/pdf-alignment-p0-backlog.md`** Seq **23**。  
> **上一序號**：**`docs/seq22-assessment-management-pdf02-traceability.md`**（評估管理【9】）。  
> **用途**：將 **僅 `APPROVED`、遠端優先載入、篩選、CSV 匯出、審計** 與母本「歷史文件」對表；標示 **xlsx 語意** 與 **PDF 逐字簽核** 缺口。

> **全案收尾與證據留痕**：**`README.md`**「專案收尾」（**`docs/project-completion-*.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log.md`** 及歸檔 **`docs/pdf-sequenced-gap-checklist-revision-log-2026-05-01a.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p2.md`**）；**`docs/project-completion-evidence-index-2026-05.md`**；**`docs/project-completion-kickoff-checklist-2026-05.md`**；Gate A 自動證據固定入口 **`docs/evidence/gate-a-latest.md`**（**`npm run gatea:evidence:list`**／**`npm run gatea:evidence:refresh`**）。

---

## 1. 畫面與模組

| 區塊 | 元件／Hook | 說明 |
|------|------------|------|
| 工具列 | `HistoricalDocumentsToolbar` | 日期區間、關鍵字、匯出按鈕（**`exportCsv`**）。 |
| 列表 | `HistoricalDocumentsTable` | **`workspace.rows`**（已篩選之核准列）。 |
| 頁殼 | `HistoricalDocumentsHome` | **`dataSource`** 說明（雲端 vs 本機備援）、**`AuditTrailPanel`**。 |
| 工作區 | `useHistoricalDocumentsWorkspace` | **`loadApprovedServiceFormsDbPrimary`**；失敗則 **`selectApprovedServiceForms(loadServiceForms())`**；**`exportLock`**。 |

**路由**：`view:historical-documents`、**`#historical-documents`**。

---

## 2. 網域與資料來源

| 函式／型別 | 說明 |
|------------|------|
| **`selectApprovedServiceForms`** | **`status === 'APPROVED'`**（**01 §2.2**／**PDF 02【10】**） |
| **`filterApprovedServiceFormsForArchive`** | 日期區間、關鍵字（院友／紀要）、依 **`reviewedAt`／`updatedAt`** 新到舊 |
| **`HistoricalDocumentsFilters`** | `dateFrom`／`dateTo`／`keyword` |
| **`loadApprovedServiceFormsDbPrimary`** | **`serviceFormSyncService`**；**`approvedOnly`** Edge（與主檔 Seq 3／23 敘述一致） |

---

## 3. 匯出與審計

| 項目 | 程式錨點 | 母本／P0 |
|------|----------|----------|
| 檔案格式 | **`downloadApprovedServiceFormsCsv`**（UTF-8 BOM CSV，Excel 可開） | 母本若堅持 **xlsx** 見 P0 **Seq 23** |
| 審計 | **`HISTORICAL_DOCUMENTS_EXPORT`**（`useHistoricalDocumentsWorkspace`） | **`notificationCenterService`** 衍生通知 |

---

## 4. 與 Seq 17 關係

- 表單型別與狀態機見 **`docs/seq17-service-forms-pdf02-traceability.md`**；本模組僅**讀取**已核准列並匯出，不變更 **`ServiceFormStatus`**。

---

## 5. 自動化測試與 E2E 錨點

| 測試／E2E | 涵蓋 |
|-----------|------|
| `historicalDocumentsDomainService.test.ts` | 篩選／排序 |
| `approvedServiceFormsCsvService.test.ts` | CSV 產出 |
| `e2e/smoke.spec.ts` | `#historical-documents`、**匯出審計** |
| `e2e/auth-login.staff-modules.spec.ts` | **`/#historical-documents`** |

---

## 6. 維護閉環

- 變更 **`loadApprovedServiceFormsDbPrimary`** 契約、**篩選欄位**或 **`HISTORICAL_DOCUMENTS_EXPORT`** 時：同步本檔、**`docs/seq17-service-forms-pdf02-traceability.md`**、**`pdf-sequenced-gap-checklist.md`** Seq 23、**`pdf-sequenced-gap-checklist-revision-log.md`**（**`docs/pdf03-cursorrules-alignment.md`** §4）。
- **下一序號**：AI 報告中心 **Seq 24**（02【11】）— **`docs/seq24-ai-report-center-pdf02-traceability.md`**（互鏈本序號）。

---

| 日期 | 說明 |
|------|------|
| 2026-05-04 | 初版：Seq 23 **對照骨架**；與 Seq 22 互鏈。 |
| 2026-05-04 | §6：與 **`seq24-ai-report-center-pdf02-traceability.md`** 互鏈。 |
