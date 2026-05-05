# Seq 26：員工管理（PDF 02【13】）對照骨架

> **對照**：母本 **`docs/pdf/02-STARCARE-智能院舍照護管理系統.pdf`** **【13】**；條文整理 **`docs/business-logic.md`**（**01 §5** 軟刪除、RBAC）；序號總表 **`docs/pdf-sequenced-gap-checklist.md`** Seq **26**；P0 **`docs/pdf-alignment-p0-backlog.md`** Seq **26**。  
> **上一序號**：**`docs/seq25-residents-management-pdf02-traceability.md`**（院友管理【12】）。  
> **用途**：將 **概覽／單筆主檔、批量匯入預檢、CSV 匯出、審計** 與母本對表；標示 **部門／TeamLead／Member 架構** 與 **PDF 逐字簽核** 缺口。

> **全案收尾與證據留痕**：**`README.md`**「專案收尾」（**`docs/project-completion-*.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log.md`** 及歸檔 **`docs/pdf-sequenced-gap-checklist-revision-log-2026-05-01a.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p2.md`**）；**`docs/project-completion-evidence-index-2026-05.md`**；**`docs/project-completion-kickoff-checklist-2026-05.md`**。

---

## 1. 畫面與路由

| 區塊 | 元件／Hook | 說明 |
|------|------------|------|
| 頁殼 | **`StaffImportPanel`** | 內含 **`StaffOverviewPanel`**（上）＋批量匯入（下）＋**`AuditTrailPanel`**。 |
| 概覽 | **`StaffOverviewPanel`** | **`useStaffManagementOverview`**（**`loadSeqRef`** 防競態）、匯出、編輯 **`StaffProfileEditSheet`**。 |
| 批量 | **`useStaffImportDryRun`** | 上傳 CSV → 預檢 → **`commitValidatedRows`**；**`/staff-import-template.csv`**。 |

**路由**：權限鍵 **`view:staff-import`**；hash **`#staff-import`**（**`AppMainViews`**）。

---

## 2. 服務與 Repository

| 層 | 路徑 | 說明 |
|----|------|------|
| 服務 | **`staffManagementService`** | **`listStaffOverview`**（**`staffProfilesListRepository`**＋時段＋技能彙總）、**`updateStaffProfile`**（**`staffProfileUpdateRepository`** → Edge **`staff-profile-update`**，`guardTeamLeadOrAdmin`）、**`softDeleteStaff`**（審計 **`SOFT_DELETE`**） |
| 列表 | **`staff-profiles-list`** | 主檔 **`role_type`**、**`service_scope`**（與 **Seq 13** 儀表盤 PT/OT 敘述一致） |

---

## 3. 匯出與審計

| `action` | 觸發 | 備註 |
|----------|------|------|
| **`STAFF_EXPORT`** | **`StaffOverviewPanel.exportCsv`** | **`downloadStaffOverviewExportCsv`**（UTF-8 BOM CSV） |
| **`UPDATE`**（Staff） | **`updateStaffProfile`** | `display_name`／**`role_type`**／**`service_scope`** |

---

## 4. 載入與防重覆

| 項目 | 程式錨點 |
|------|----------|
| 概覽載入失敗 | **`無法載入員工資料概覽，請稍後再試。`**（**`useStaffManagementOverview`**） |
| 軟刪 | **`softDeleteLockRef`**、**`softDeleteBusyStaffId`** |
| 系統設定變更重載 | **`useInvalidateOnSystemSettingsExternalChange(reload)`** |

---

## 5. 自動化測試與 E2E 錨點

| 測試／E2E | 涵蓋 |
|-----------|------|
| `staffOverviewExportCsvService.test.ts` | 匯出欄位（含 **職類**） |
| `e2e/smoke.spec.ts` | **`#staff-import`**、**員工與匯入審計** |

---

## 6. 維護閉環

- 變更 **`StaffOverviewRow`**、**Edge `staff-profile-update`** 白名單或 **匯入欄位**時：同步本檔、**`pdf-sequenced-gap-checklist.md`** Seq 26、**`pdf-sequenced-gap-checklist-revision-log.md`**（**`docs/pdf03-cursorrules-alignment.md`** §4）；與 **Seq 1** RBAC 清單、`ops:deploy:all` 部署範圍並核。
- **下一序號**：通知中心 **Seq 27**（02【14】）— **`docs/seq27-notification-center-pdf02-traceability.md`**（互鏈本序號）。

---

| 日期 | 說明 |
|------|------|
| 2026-05-04 | 初版：Seq 26 **對照骨架**；與 Seq 25 互鏈。 |
| 2026-05-04 | §6：與 **`seq27-notification-center-pdf02-traceability.md`** 互鏈。 |
