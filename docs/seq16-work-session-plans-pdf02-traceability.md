# Seq 16：我的工作計劃／團隊計劃（PDF 02【4】）對照骨架

> **對照**：母本 **`docs/pdf/02-STARCARE-智能院舍照護管理系統.pdf`** **【4】**；條文整理 **`docs/business-logic.md`**（**01 §2.1** 工作節狀態）；序號總表 **`docs/pdf-sequenced-gap-checklist.md`** Seq **16**；P0 **`docs/pdf-alignment-p0-backlog.md`** Seq **16**。  
> **上一序號**：**`docs/seq15-scheduling-pdf02-traceability.md`**。  
> **用途**：標示 **現況（活動時段由後端載入＋接收／拒絕狀態本機持久化）** 與 **母本要求之 DB 權威狀態機** 落差，供對表簽核與後續改程式／Edge 時引用。

> **全案收尾與證據留痕**：**`README.md`**「專案收尾」（**`docs/project-completion-*.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log.md`** 及歸檔 **`docs/pdf-sequenced-gap-checklist-revision-log-2026-05-01a.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p2.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p3.md`**）；**`docs/project-completion-evidence-index-2026-05.md`**；**`docs/project-completion-kickoff-checklist-2026-05.md`**；Gate A 自動證據固定入口 **`docs/evidence/gate-a-latest.md`**（檔內 **Next Command** 與 **`preflight:strict`** 並列；**`npm run gatea:evidence:list`**／**`npm run gatea:evidence:refresh`**／**`npm run gatea:evidence:preflight:strict`**）。

---

## 1. 畫面與模組

| 區塊 | 元件／Hook | 說明 |
|------|------------|------|
| 我的工作計劃 | `MyWorkPlanPanel` | 選日、狀態篩選、接收／拒絕（`accept`／`reject`）。 |
| 團隊計劃 | `TeamWorkPlanPanel` | TeamLead／Admin 視角、批量軟刪（`bulkSoftDelete`）。 |
| 頁殼 | `WorkSessionPlansHome` | 組合兩面板＋**`AuditTrailPanel`**。 |
| 資料與動作 | `useWorkSessionPlans` | `schedulingConfigService.listSchedulingSessions` → `mergeSessionsWithResponses`。 |

---

## 2. 工作節狀態（01 §2.1）與現行程式

| 狀態（型別） | 權威來源（現況） | 母本／DB 目標（待簽核） | 驗收證據 |
|-------------|------------------|-------------------------|----------|
| `PENDING` | 無 `workSessionResponseStore` 紀錄 | 02【4】＿＿頁；是否須伺服器預設列 **待簽核** | 待簽核 |
| `ACCEPTED`／`REJECTED` | **`workSessionResponseStore`**（**localStorage**） | 與 **Seq 2**「DB 狀態機」對齊時程 **待簽核** | `workSessionPlanService.test.ts`（本機邏輯） |
| `COMPLETED` | 表單核准後 **`features/workSessions`**（見主清單 Seq 16 列） | 與 **02【5】**／**Seq 17** 閉環 **待簽核** | 待簽核 |

---

## 3. 審計動作（全域面板合併顯示）

| `action`（摘要） | 觸發點 | 備註 |
|------------------|--------|------|
| `WORK_SESSION_ACCEPT` | `acceptWorkSession` | 僅自 `PENDING` |
| `WORK_SESSION_REJECT` | `rejectWorkSession` | 僅自 `PENDING` |
| `WORK_SESSION_TEAM_BULK_SOFT_DELETE` | `bulkSoftDeleteWorkSessionsForTeam` | 迴圈 **`activitySessionRepository.softDeleteActivitySession`**；並 `workSessionResponseStore.remove` |
| `WORK_SESSION_COMPLETED` | `workSessionCompletionService`（**`features/workSessions`**） | 表單核准後轉 **COMPLETED**（與 **Seq 17** 閉環） |

---

## 4. 讀取與寫回（落差表）

| 資料 | 讀取（現況） | 寫回（現況） | P0「DB 正式 session」待辦 |
|------|-------------|-------------|---------------------------|
| 活動時段列表 | `schedulingConfigService.listSchedulingSessions` | 創建見 **Seq 14**；團隊批量軟刪寫 **Edge／DB** | 接收／拒絕是否須寫 **DB** 取代 localStorage **待簽核** |
| 接收／拒絕 | 合併 `mergeSessionsWithResponses` | **`workSessionResponseStore.set`** | 與母本 **02【4】** 對表後裁定 |

---

## 5. 自動化測試錨點

| 測試／E2E | 涵蓋範圍 |
|-----------|----------|
| `src/features/workSessionPlans/services/workSessionPlanService.test.ts` | 篩選、接收／拒絕、審計呼叫（mock） |
| `e2e/auth-login.spec.ts`（`#work-session-plans`） | 載入標題、排除固定錯誤句（見主清單 Seq 16 列） |

---

## 6. 維護閉環

- 變更 **`workSessionResponseStore`** 鍵名、`acceptWorkSession`／`rejectWorkSession` 規則或 **活動時段** API 時：同步本檔、**`pdf-sequenced-gap-checklist.md`** Seq 16、**`pdf-sequenced-gap-checklist-revision-log.md`**（**`docs/pdf03-cursorrules-alignment.md`** §4）。
- **下一序號**：填寫表單 **Seq 17**（02【5】）— **`docs/seq17-service-forms-pdf02-traceability.md`**（互鏈本序號）。

---

| 日期 | 說明 |
|------|------|
| 2026-05-04 | 初版：Seq 16 **對照骨架**（凸顯 localStorage vs DB 落差）。 |
| 2026-05-04 | §6：與 **`seq17-service-forms-pdf02-traceability.md`** 互鏈。 |
