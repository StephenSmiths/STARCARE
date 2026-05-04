# Seq 25：院友管理（PDF 02【12】）對照骨架

> **對照**：母本 **`docs/pdf/02-STARCARE-智能院舍照護管理系統.pdf`** **【12】**；條文整理 **`docs/business-logic.md`**（**01 §5** 軟刪除、防重覆提交）；序號總表 **`docs/pdf-sequenced-gap-checklist.md`** Seq **25**；P0 **`docs/pdf-alignment-p0-backlog.md`** Seq **25**。  
> **上一序號**：**`docs/seq24-ai-report-center-pdf02-traceability.md`**（AI 報告【11】）。  
> **Edge 契約**：**`docs/residents-edge-function-contract.md`**（與 **go-live** 抽測並讀）。  
> **用途**：將 **單筆 CRUD、批量匯入預檢、匯出名單、載入錯誤句、審計** 與母本對表；標示 **xlsx** 與 **02 用語逐字** 簽核缺口。

---

## 1. 畫面與模組

| 區塊 | 元件／Hook | 說明 |
|------|------------|------|
| 概覽／列表 | `ResidentsOverviewPanel`、`ResidentsListPanel` | 名單、編輯入口、軟刪（**`softDeleteBusyResidentId`**）。 |
| 單筆表單 | `ResidentsSingleResidentForm`＋`ResponsiveFormSheet` | 由 **`ResidentsDashboard`** 組合；**`residentSubmitLockRef`**。 |
| 批量 | `ResidentsImportPanel` | CSV 預檢／提交（與 **`residents-import-template.csv`** 機讀欄對齊，見主檔敘述）。 |
| 評估待辦 | `ResidentsAssessmentDuePanel` | 與 **Seq 9／22** 評估週期 UI 呼應。 |
| 後台區塊 | `ResidentsAdminWriteSections` | 權限 **`view:residents`** 守門。 |
| 資料 | **`useResidents`** | **`runResidentListRefresh`** → **`RESIDENT_LIST_LOAD_ERROR_MESSAGE`**。 |

**路由**：`view:residents`、**`#residents`**。

---

## 2. 服務與 Repository

| 層 | 路徑 | 說明 |
|----|------|------|
| 服務 | **`residentService`** | **`createResident`**／**`updateResident`**／**`softDeleteResident`**；審計 **`CREATE`**／**`UPDATE`**／**`SOFT_DELETE`**（**`entityType: 'Resident'`**）；**`runWithSubmitLock`**（防重覆鍵）。 |
| 實作 | **`ResidentEdgeRepository`**／**`InMemoryResidentRepository`** | **`createResidentRepository()`** 依環境切換（demo／真庫）。 |

---

## 3. 匯出與審計

| 項目 | 程式錨點 | 母本／P0 |
|------|----------|----------|
| 名單匯出 | **`downloadResidentsExportCsv`**（**`residentsExportCsvService`**） | UTF-8 BOM CSV；末三欄代碼與範本一致（主檔 Seq 25 敘述） |
| 審計 | **`RESIDENTS_EXPORT`**（**`ResidentsDashboard`**） | 母本若堅持 **xlsx** 見 P0 |

---

## 4. 載入閉環（E2E 錨點）

- 固定錯誤句：**`RESIDENT_LIST_LOAD_ERROR_MESSAGE`**（**`residentListRefreshOutcome.ts`**），與 **`e2e/auth-login`** **`/#residents`** 斷言一致。

---

## 5. 自動化測試（摘錄）

| 測試檔 | 涵蓋 |
|--------|------|
| `residentService.test.ts` | CRUD／審計 mock |
| `residentListRefreshOutcome.test.ts` | 載入失敗句 |
| `residentsExportCsvService.test.ts` | 匯出欄位 |
| `residentCsvParser.test.ts` | 匯入解析 |

---

## 6. 維護閉環

- 變更 **`ResidentInput`** 白名單、**Edge 路徑**或 **匯出欄位**時：同步本檔、**`docs/residents-edge-function-contract.md`**、**`pdf-sequenced-gap-checklist.md`** Seq 25、**`pdf-sequenced-gap-checklist-revision-log.md`**（**`docs/pdf03-cursorrules-alignment.md`** §4）。
- **下一序號**：員工管理 **Seq 26**（02【13】）— **`docs/seq26-staff-management-pdf02-traceability.md`**（互鏈本序號）。

---

| 日期 | 說明 |
|------|------|
| 2026-05-04 | 初版：Seq 25 **對照骨架**；與 Seq 24 互鏈。 |
| 2026-05-04 | §6：與 **`seq26-staff-management-pdf02-traceability.md`** 互鏈。 |
