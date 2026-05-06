# STARCARE 核心業務邏輯與 SOP 規範

## 0. 權威來源與檔案位置

客戶提供之 PDF 已統一置於 **`docs/pdf/`**（檔名不含特殊字元，便於版控與搜尋）：

| 順序 | 檔案（相對於專案根目錄） | 說明 |
|------|--------------------------|------|
| 1 | **`docs/pdf/01-STARCare-核心業務邏輯與-SOP.pdf`** | **本文件§1–§5 的對齊母本**（RBAC、狀態機、雙軌排班、合規、資料完整性）；爭議時以此 PDF 為準。 |
| 2 | **`docs/pdf/02-STARCARE-智能院舍照護管理系統.pdf`** | 整體產品背景、分類、**功能清單【1】～【16】** 與流程細節；與 01 若有衝突須由**產品／客戶**裁定。 |
| 3 | **`docs/pdf/03-STARCARE-工程規範-Closed-Loop.pdf`** | 工程／閉環開發規範（與 `.cursorrules` 可並讀；若兩者衝突以**客戶簽核版 PDF**為準）。 |
| 4 | **本檔 `docs/business-logic.md`**（**§8** 修訂全文見 **`docs/business-logic-revision-log.md`**） | PDF 之**繁體中文整理版**＋**與程式對照／落差**；客戶更新 PDF 後應先完成簽核再同步修訂本檔。 |

**備註**：專案根目錄舊版 PDF（含 `#` 檔名或空檔）已移除，請一律以 **`docs/pdf/`** 內三份為準。

**對客戶之補強與分期交付說明**：見 **`docs/client-delivery-remediation-plan.md`**（會議邀請範本、對照矩陣範本、驗收階段）。  
**依序補回 Feature／缺漏**：見 **`docs/pdf-sequenced-gap-checklist.md`**（Seq **1～38**：01 鐵律→02【1】～【16】→03 工程對照；開首 **對照**；主檔「**運維與工程**」列與本節及 **`README.md`**、**`.cursorrules`** §3 對齊）。  
**母本 P0 可勾選 backlog**：見 **`docs/pdf-alignment-p0-backlog.md`**（與上列序號檢核配套）。  
**架構決策（排班演算放置，Seq 36）**：見 **`docs/adr-0001-scheduling-logic-placement.md`**。  
**母本 03／工程治理對照骨架（Seq 35～38）**：**`docs/seq35-pdf03-cursorrules-alignment-traceability.md`**（起鏈）；矩陣與 PR 檢核 **`docs/pdf03-cursorrules-alignment.md`**；總表 **`docs/pdf-sequenced-gap-checklist.md`** **C**。  
**評估完成紀錄 Edge 契約（Seq 22）**：見 **`docs/assessment-completion-records-contract.md`**。  
**院友 Edge 契約**：見 **`docs/residents-edge-function-contract.md`**。  
**運維與部署 Runbook**：見 **`docs/supabase-deploy-runbook.md`**（Supabase 部署、SQL 驗收；**§6** 可選前端 **`npm run ci`**，與 GitHub Actions 同源）。  
**憑證與 PAT 輪替**：見 **`docs/security-token-rotation-checklist.md`**（**§D** 部署後自檢含可選 **`npm run ci`**）。  
**分階交付與自動驗收索引**：**`docs/phase4-day4-delivery-index.md`**、**`docs/phase5-day1-delivery-index.md`**（窄版 **`acceptance:*`** 與 **`npm run ci`** 全閘對照見各索引及 **`docs/feature-list.md`** §8）；**`docs/phase3-day5-acceptance.md`** 起 **`docs/phase*.md`**／**`docs/stage*.md`** 開首 **對照** 互鏈 **`docs/pdf-sequenced-gap-checklist.md`** 主檔「**運維與工程**」列。  
**Stage 2／Phase 3 歷史追溯（非現行交付權威）**：**`docs/stage2-completion-report.md`**、**`docs/stage2-external-summary.md`**、**`docs/stage3-day3-completion-note.md`**、**`docs/stage3-day5-external-summary.md`**（各開首 **對照** 鏈回本節）；正式分階驗收自 **`docs/phase3-day5-acceptance.md`** 起。  
**專案工程規範（`.cursorrules`）**：**§3**「部署與驗收閘門」與上列 **`runbook`**／憑證／**`README.md`**／**`go-live-checklist.md`** 連動並讀；修訂該段時見 **`docs/pdf03-cursorrules-alignment.md`** §4。  
**全案收尾執行（完成度、兩週計畫、證據留痕）**：見 **`README.md`**「專案收尾」小節（表列 **`docs/project-completion-*.md`** 全束與 **`docs/pdf-sequenced-gap-checklist-revision-log.md`** 及歸檔 **`docs/pdf-sequenced-gap-checklist-revision-log-2026-05-01a.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p2.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p3.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p4.md`**）；快速啟動 **`docs/project-completion-kickoff-checklist-2026-05.md`**；盤點 **`docs/project-completion-audit-2026-05-05.md`**；證據索引 **`docs/project-completion-evidence-index-2026-05.md`**（與 **`docs/go-live-checklist.md`** 併用）；Gate A 自動證據固定入口 **`docs/evidence/gate-a-latest.md`**（檔內 **Next Command** 與 **`preflight:strict`** 並列；**`npm run gatea:evidence:list`**／**`npm run gatea:evidence:refresh`**／取證前嚴格檢查 **`npm run gatea:evidence:preflight:strict`**；手順 **`docs/gate-a-evidence-capture-2026-05-06.md`**）。

### 0.1 三份母本版本追蹤（Seq 38）

> 用途：提供可稽核的母本版本指紋，避免「同名檔案已被替換但未通知」造成驗收落差。

**對照骨架**：**`docs/seq38-pdf-versions-traceability.md`**（版次／日期與 **`business-logic-revision-log.md`** §8 連動）。

| 檔案路徑 | 版次／日期（若 PDF 未標示則填 `待客戶補充`） | SHA-256 |
|----------|-----------------------------------------------|---------|
| `docs/pdf/01-STARCare-核心業務邏輯與-SOP.pdf` | 待客戶補充 | `500ce1558b893c330bf67726db2019c14d5b68fbd4ea1630dc7a36693c29d12d` |
| `docs/pdf/02-STARCARE-智能院舍照護管理系統.pdf` | 待客戶補充 | `9cf06fc343897697ebcd31ea16ab940bc9124e973de83c576dd06f079ee81bca` |
| `docs/pdf/03-STARCARE-工程規範-Closed-Loop.pdf` | 待客戶補充 | `3adb8c98e8ec4c0d8d48ba5c2d3215ec757b673f29c167d8ddda01c049cbc331` |

---

## 1. 角色與權限模型（RBAC）

系統必須實作下列**三種角色**，並嚴格限制資料存取：

1. **Admin（系統管理員）**  
   全系統最高權限；可管理設定、員工資料與全域參數。

2. **TeamLead（部門主管）**  
   管理所屬團隊工作計劃、審批表單、**觸發智能排班**、查看團隊合規報告。

3. **Staff（一般復康人員 PT/OT/PTA/OTA）**  
   僅能查看自己的排班、提交服務表單。  
   **絕對不可（NEVER）** 修改排班規則或審批自己的表單。

---

## 2. 核心實體狀態機（State Machines）

### 2.1 工作節（Session）

- `PENDING`（待接收）→ `ACCEPTED`（已接收）或 `REJECTED`（已拒絕）
- `ACCEPTED` → `COMPLETED`（已完成服務；程式於表單 **APPROVED** 時寫入，見 `features/workSessions`）
- **約束**：僅當工作節為 `ACCEPTED` 時，Staff 才可提交服務表單。

### 2.2 表單（Form）

- `DRAFT`（草稿）→ `SUBMITTED`（已提交待審）
- `SUBMITTED` → `APPROVED`（主管已批准）或 `REJECTED_NEEDS_REVISION`（退回重改）
- **約束**：狀態為 `APPROVED` 後資料**鎖定（Locked）**，任何人不得再修改內容。

---

## 3. 鐵律 SOP 1：智能排班演算法（Smart Scheduling Logic）

當 **TeamLead** 觸發「智能排班」時，後端工作流 **必須（MUST）** 遵守 **雙軌排班邏輯**：員工更表／班次已標明 **服務類型**，系統須依該類型選擇對應排班引擎。

### 3.1 基礎約束（Global Constraints）

- **服務類型隔離（Service Type Isolation）**  
  - 班次為「**資助復康服務**」→ 只可安排符合該服務條件之院友。  
  - 班次為「**認知障礙症服務**」→ 只可安排**有認知障礙**之院友。  
  - 兩者 **絕對不可（NEVER）混用**。

- **單日限制**：同一院友，每日 **最多 1 次** 同類型服務。

- **間隔限制**：同一院友、同類型服務 **不可（NEVER）** 排在**連續兩日**（例如週一排了則週二不可，**除非**系統已無其他可用時段）。

- **優先級**：標記為 **Special Case（SC）** 的院友，於所有排班邏輯中享有 **最高優先分配權**。

### 3.2 軌道 A：「資助復康服務」— 三階段（3-Pass Algorithm）

**觸發**：員工班次服務類型為「資助復康服務」。  
引擎須 **依序** 執行 Pass 1→2→3；前一段未完成 **不可** 進入下一段。

| Pass | 對象 | 目標／說明 |
|------|------|------------|
| **Pass 1** | 甲一買位（EA1） | 優先排班；**每週須滿足 2 次服務**。 |
| **Pass 2** | 院舍券（Voucher） | 依院友**評估等級**，滿足其 **每週／每月** 最低服務次數。 |
| **Pass 3** | 私位（Private） | 班次尚有剩餘工時時，最後才分配。 |

### 3.3 軌道 B：「認知障礙症服務」（Dementia Service Logic）

**觸發**：員工班次服務類型為「認知障礙症服務」。

- **忽略資助類型**：**完全不考慮（IGNORE）** 甲一／院舍券／私位。
- **嚴重度優先**：優先序僅依 **認知障礙程度**（例：重度私位院友可優先於輕度甲一院友）。
- **無固定每週次數上限**：目標為 **盡量平均分配**，覆蓋盡可能多之服務對象。

---

## 4. 鐵律 SOP 2：合規與追蹤（Compliance & Tracking）

系統必須自動計算並即時顯示 **合規率（Compliance Rate）**。  
**「資助復康服務」與「認知障礙症服務」** 之統計 **必須完全獨立**，**絕對不可（NEVER）混淆或交叉計算**。

### 4.1 「資助復康服務」合規

- **合規標準**：「甲一買位」與「院舍券」院友，於 **週一至週日** 內，須有 **至少 2 次** 狀態為 `APPROVED` 之 **「資助復康服務」** 紀錄。
- **嚴格排除**：若院友該次為「認知障礙症服務」，該次 **絕對不可（NEVER）** 計入資助復康合規次數。
- **預警（Alerts）**：若 **每週三** 時，某甲一／院舍券院友之資助復康完成次數 **仍為 0**，系統 **必須（MUST）** 對 **TeamLead** 儀表板產生 **高優先級 Alert**。

### 4.2 「認知障礙症服務」統計

獨立呈現覆蓋率、輕／中／重 參與人次與頻率；**不與**資助合規率掛鉤。

### 4.3 評估表到期追蹤（Assessments Tracking）

評估表（Assessment）到期前 **14 天**，系統必須自動加入 Staff 的 **待辦（Pending Tasks）**。

---

## 5. 資料庫與防呆（Data Integrity & Validation）

1. **軟刪除（Soft Delete）**  
   院友、員工、表單、排班等實體 **絕對不可（NEVER）硬刪除（Hard Delete）**；須以 `is_deleted` 或 `status = DISCHARGED/INACTIVE` 等標記。

2. **防重覆提交**  
   表單提交與排班確認按鈕須 **防抖（Debounce）或鎖定**，避免因網路延遲重複寫入。

3. **審計軌跡（Audit Trail）**  
   凡狀態變更（尤指表單審批、排班修改），背景须記錄：**操作者 ID**、**時間**、**變更前狀態**、**變更後狀態**。

---

## 6. 領域術語與程式列舉對照（院友模組）

下列與 `src/features/residents/types/resident.ts` 一致，便於 UI／API 命名與 PDF 用語對譯：

| PDF／業務用語 | 程式欄位／值 |
|----------------|--------------|
| 甲一買位（EA1） | `fundingType: 'GradeA_Subsidized'` |
| 院舍券 | `fundingType: 'Voucher'` |
| 私位 | `fundingType: 'Private'` |
| 資助復康服務 | `serviceType: 'Subsidized_Rehab'` |
| 認知障礙症服務 | `serviceType: 'Dementia_Service'` |
| 兩者皆有（若業務允許） | `serviceType: 'Both'` |
| Special Case（SC） | `isSpecialCareCase: true` |
| 認知障礙程度（輕／中／重等） | `dementiaLevel`：`None` \| `Mild` \| `Moderate` \| `Severe` |

---

## 7. 與目前應用程式實作對照（落差摘要）

> 供工程與驗收用；細節以程式與 DB 為準，並應逐項對 PDF 簽核。

| PDF 要求 | 現況（摘要） |
|----------|----------------|
| **§1 RBAC**（Admin／TeamLead／Staff） | Auth／`user_roles` 與 Edge `requireStaffUser` 已有方向；**UI 層完整三分角色與權限矩陣**需再對照產品。 |
| **§2 Session／Form 狀態機** | 若產品範圍含「工作節／服務表單審批」，需確認是否已有對應模組與 DB；**目前主畫面以排班／匯入／院友為主**。 |
| **§3 後端 MUST 雙軌排班** | PDF 要求後端工作流；現行 **排班演算主要於前端 `schedulingService`**（與「優先 Edge／DB」工程規範有張力）。**建議**：文件化架構決策或規劃搬移後端。 |
| **§3.1 間隔限制例外**（無其他時段） | 已於 `schedulingCore.pickSession` 二階段選時段：先滿足相鄰日限制，若無任何可排時段再放寬相鄰限制；`schedulingService.section31.test.ts` 有單元測試。 |
| **§3.2 週目標常數（Seq 6）** | `schedulingTargets.getWeeklyTargetByFundingType`：甲一／券=**2**、私位=**1**；券之「依評估」仍為固定 2（待 assessment）；私位若 02 訂「每週最多 2」須客戶裁定後再改程式。測試：`schedulingTargets.test.ts`。 |
| **§3 雙軌隔離（Seq 4）** | 資助復康乾跑：`filterToSubsidizedRehabServiceOnly`＋`runSubsidizedRehabSchedulingOrchestration`；引擎內 `evalSessionCoreForPick` 對非 `Subsidized_Rehab` 為 `skip`。測試：`schedulingService.dualTrack.test.ts`、`schedulingCoreSessionGates.test.ts`、`schedulingSessionWindowFilterService.test.ts`。認知乾跑仍見 `dementiaTrackDryRunService`。 |
| **§3.3 認知軌（Seq 7）** | `filterToDementiaServiceOnly`＋`buildDementiaServiceTrackSnapshot` 先依 `dementiaSeverityRank` 排序；`runDementiaTrackDryRun` 用 `isWithinGapDays` 與二階段間隔；`mapResidentToDementiaSchedulingResident` 固定 `fundingType: Private` 使週標不依資助類型。測試：`dementiaTrackDryRunService.test.ts`。廣泛覆蓋／週目標數仍待 PDF。 |
| **§4.1 資助週三警示／排班名單（Seq 8）** | `residentCareTrackCohort.isSubsidizedRehabCohort` 經 **`mapActiveResidentsToSubsidizedSchedulingResidents`** 統一：`runSchedulingReloadPageData`、`runSubsidizedRehabSchedulingOrchestration`、`useDashboardOverview`（週三警示）、`buildSubsidizedRehabTrackSnapshot`；純 `Dementia_Service` 院友不混入資助復康合規計算；`DashboardTeamLeadWednesdayCard`；**`DashboardSummary.subsidizedRehabCohortCount`**／**`DashboardOverviewPanel`** 與全院友總數分示。測試：`residentCareTrackCohort.test.ts`、`schedulingReloadPageData.test.ts`、`mapActiveResidentsToSubsidizedSchedulingResidents.test.ts`。 |
| **§4.2 認知服務統計獨立** | 儀表盤 **`countSessionsOnLocalDateByTrack`**、`DashboardSummary` 之今日兩軌時段計數；復康追蹤兩區塊。其餘 KPI／報表仍須逐頁確認 **未與資助復康混算**（PDF NEVER）。測試：`dashboardSummaryService.test.ts`。 |
| **§4.3 評估表 14 天待辦（Seq 9）** | DB **`residents.assessment_next_due_date`**（可選）；有值且落在視窗內時優先於入住週期（**`assessmentDueDateResolve`**／**`_shared/assessmentDueFromAdmission`** 須同步）。**`assessmentDueTaskRepository`**＋Edge **`assessment-due-list`**；失敗或未登入回退本機。**錨點寫入**：單筆 **`residentService`**（更新合併後正規化、可清空）、批量 **`residents-import-validate`／`commit`** 與範本／匯出 CSV；Edge **`residents-create`／`residents-update`** 經 **`residentWritePayload`** 白名單與日期格式驗證。測試：`assessmentDueDateResolve.test.ts`、`assessmentDueTaskService.test.ts`、`assessmentDueTaskRepository.test.ts`、`residentService.test.ts`。 |
| **PDF 02【9】評估完成紀錄（Seq 22）** | DB **`assessment_completion_records`**（PT／OT、`cycle_anchor_date`、軟刪 **`is_deleted`**）；RLS 與院友表一致（staff／teamlead／admin 可讀未刪）。Edge **`assessment-completion-records-list`**／**`assessment-completion-records-append`**（**`recorded_by_actor_id`** 須為 JWT 本人、單次最多 20 筆、**`X-Idempotency-Key`**）；append 成功後 **`audit_events`**（**`ASSESSMENT_COMPLETION_RECORD`**，見 **`appendAssessmentCompletionAudit`**）；**`assessmentCompletionRecordRepository`**；評估管理 **`useAssessmentManagementWorkspace`**：載入合併遠端／本機（**`mergeAssessmentCompletionRecordsRemotePrimary`**），補登先寫 **localStorage** 再 **`append`**，失敗提示仍保留本機；前端 **`globalAuditTrailService`** 仍寫本機審計軌跡。契約：**`docs/assessment-completion-records-contract.md`**。測試：`assessmentCompletionRecordMapper.test.ts`、`mergeAssessmentCompletionRecords.test.ts`。 |
| **§5 Audit／防抖／軟刪** | 軟刪除（院友等）與方向一致；**審計完整寫入**與**全系統防抖**宜做逐功能盤點。 |

---

## 8. 修訂紀錄

**全文表**：為遵守專案單檔 **≤200** 行，歷次修訂列已重出至 **`docs/business-logic-revision-log.md`**（仍視為本檔 **§8**；新增一筆請寫入該檔）。維護閉環見 **`docs/pdf03-cursorrules-alignment.md`** §4。
