# STARCARE 核心業務邏輯與 SOP 規範

## 0. 權威來源與檔案位置

客戶提供之 PDF 已統一置於 **`docs/pdf/`**（檔名不含特殊字元，便於版控與搜尋）：

| 順序 | 檔案（相對於專案根目錄） | 說明 |
|------|--------------------------|------|
| 1 | **`docs/pdf/01-STARCare-核心業務邏輯與-SOP.pdf`** | **本文件§1–§5 的對齊母本**（RBAC、狀態機、雙軌排班、合規、資料完整性）；爭議時以此 PDF 為準。 |
| 2 | **`docs/pdf/02-STARCARE-智能院舍照護管理系統.pdf`** | 整體產品背景、分類、**功能清單【1】～【16】** 與流程細節；與 01 若有衝突須由**產品／客戶**裁定。 |
| 3 | **`docs/pdf/03-STARCARE-工程規範-Closed-Loop.pdf`** | 工程／閉環開發規範（與 `.cursorrules` 可並讀；若兩者衝突以**客戶簽核版 PDF**為準）。 |
| 4 | **本檔 `docs/business-logic.md`** | PDF 之**繁體中文整理版**＋**與程式對照／落差**；客戶更新 PDF 後應先完成簽核再同步修訂本檔。 |

**備註**：專案根目錄舊版 PDF（含 `#` 檔名或空檔）已移除，請一律以 **`docs/pdf/`** 內三份為準。

**對客戶之補強與分期交付說明**：見 **`docs/client-delivery-remediation-plan.md`**（會議邀請範本、對照矩陣範本、驗收階段）。  
**依序補回 Feature／缺漏**：見 **`docs/pdf-sequenced-gap-checklist.md`**（Seq **1～38**：01 鐵律→02【1】～【16】→03 工程對照；開首 **對照**；主檔「**運維與工程**」列與本節及 **`README.md`**、**`.cursorrules`** §3 對齊）。  
**母本 P0 可勾選 backlog**：見 **`docs/pdf-alignment-p0-backlog.md`**（與上列序號檢核配套）。  
**架構決策（排班演算放置，Seq 36）**：見 **`docs/adr-0001-scheduling-logic-placement.md`**。  
**評估完成紀錄 Edge 契約（Seq 22）**：見 **`docs/assessment-completion-records-contract.md`**。  
**院友 Edge 契約**：見 **`docs/residents-edge-function-contract.md`**。  
**運維與部署 Runbook**：見 **`docs/supabase-deploy-runbook.md`**（Supabase 部署、SQL 驗收；**§6** 可選前端 **`npm run ci`**，與 GitHub Actions 同源）。  
**憑證與 PAT 輪替**：見 **`docs/security-token-rotation-checklist.md`**（**§D** 部署後自檢含可選 **`npm run ci`**）。  
**分階交付與自動驗收索引**：**`docs/phase4-day4-delivery-index.md`**、**`docs/phase5-day1-delivery-index.md`**（窄版 **`acceptance:*`** 與 **`npm run ci`** 全閘對照見各索引及 **`docs/feature-list.md`** §8）。  
**Stage 2／Phase 3 歷史追溯（非現行交付權威）**：**`docs/stage2-completion-report.md`**、**`docs/stage2-external-summary.md`**、**`docs/stage3-day3-completion-note.md`**、**`docs/stage3-day5-external-summary.md`**（各開首 **對照** 鏈回本節）；正式分階驗收自 **`docs/phase3-day5-acceptance.md`** 起。  
**專案工程規範（`.cursorrules`）**：**§3**「部署與驗收閘門」與上列 **`runbook`**／憑證／**`README.md`**／**`go-live-checklist.md`** 連動並讀；修訂該段時見 **`docs/pdf03-cursorrules-alignment.md`** §4。

### 0.1 三份母本版本追蹤（Seq 38）

> 用途：提供可稽核的母本版本指紋，避免「同名檔案已被替換但未通知」造成驗收落差。

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

| 日期 | 說明 |
|------|------|
| 2026-05-01 | 依根目錄 PDF `# STARCare 系統核心業務邏輯與 SOP 規範 (business-logic).pdf` 全文整理並增列程式對照／落差；取代先前僅占位之版本。 |
| 2026-05-01 | §7：§3.1「無其他可用時段」間隔例外已對齊 `schedulingCore.pickSession` 二階段邏輯；測試見 `schedulingService.section31.test.ts`。 |
| 2026-05-01 | §7：補 §3.2 週目標常數（Seq 6）與 `schedulingTargets.test.ts` 說明。 |
| 2026-05-01 | §7：補 §3 雙軌隔離（Seq 4）與乾跑／門檻測試路徑。 |
| 2026-05-01 | §7：補 §3.3 認知軌（Seq 7）與 `dementiaTrackDryRunService`／`filterToDementiaServiceOnly` 說明。 |
| 2026-05-01 | §7：補 §4.1 兩軌分離（Seq 8）與 `residentCareTrackCohort`。 |
| 2026-05-02 | §7：§4.1 補 **`mapActiveResidentsToSubsidizedSchedulingResidents`**（排班載入／乾跑 orchestration／儀表週三警示／復康追蹤資助軌共用）。 |
| 2026-05-02 | §7：儀表 **`DashboardSummary.subsidizedRehabCohortCount`**；**`calculateSchedulingKpis`** 註解標明 KPI 分母須為 §4.1 族群。 |
| 2026-05-02 | §7：§4.3 補 **`assessmentDueTaskRepository`**（待遠端 API 時替換實作）。 |
| 2026-05-02 | §7：§4.3 補 Edge **`assessment-due-list`** 與 **`assessmentDueFromAdmission`**（與前端演算雙源同步維護）。 |
| 2026-05-02 | §7：§4.3 補 **`residents.assessment_next_due_date`** migration 與 **`assessmentDueDateResolve`**（錨點優先）。 |
| 2026-05-02 | §7：§4.3 院友單筆表單可維護評估到期日（**`residentService`** 正規化／審計沿用 UPDATE）。 |
| 2026-05-02 | §7：§4.3 補錨點寫入閉環（批量匯入／匯出、**`residents-create`／`update`** 白名單、**`validateInput`** 接受清空）；**§7** 對照列同步。 |
| 2026-05-02 | §7：補 PDF 02【9】**`assessment_completion_records`** 表、**`assessment-completion-records-list`**、Repository 與評估管理載入合併；§8 同步。 |
| 2026-05-02 | §7：§4.3／02【9】補 Edge **`assessment-completion-records-append`**、Repository **`append`**、評估管理提交流程（本機＋雲端、**`reload`** 合併）。 |
| 2026-05-02 | §7：02【9】**`assessment-completion-records-append`** 成功後寫 **`audit_events`**（**`appendAssessmentCompletionAudit`**）；契約見 **`docs/assessment-completion-records-contract.md`**。 |
| 2026-05-01 | §7：補 §4.2 儀表盤今日時段分軌計數。 |
| 2026-05-01 | 客戶三份 PDF 改存 **`docs/pdf/01…` `02…` `03…`**；更新本節權威路徑；移除根目錄舊 PDF。 |
| 2026-05-01 | 新增 §0.1「三份母本版本追蹤（Seq 38）」；登錄三份 PDF 的 SHA-256 指紋，供客戶版本確認與稽核。 |
| 2026-05-03 | §0：補 **`.cursorrules`** §3「部署與驗收閘門」與本節運維／憑證／**`README`**／**`go-live`** 連動；維護責任見 **`docs/pdf03-cursorrules-alignment.md`** §4。 |
| 2026-05-03 | **`go-live-checklist.md`**、**`supabase-deploy-runbook.md`**、**`pdf03-cursorrules-alignment.md`** 標題下增對照 **`business-logic.md`** §0／**`.cursorrules`** §3 之引導。 |
| 2026-05-03 | **`security-token-rotation-checklist.md`** 標題下增對照 **`business-logic.md`** §0、**`go-live-checklist.md`**、**`supabase-deploy-runbook.md`** 之引導。 |
| 2026-05-03 | **`feature-list.md`** 開首、**`pdf-alignment-p0-backlog.md`**、**`adr-0001`**、**`rbac-seq1-verification-checklist.md`**：增對照 **`business-logic.md`** §0／**`.cursorrules`** §3；**`feature-list.md`** §8 SOP 欄一句同步。 |
| 2026-05-03 | **`residents-edge-function-contract.md`**、**`assessment-completion-records-contract.md`**：開首增對照 **`business-logic.md`** §0、**`go-live-checklist.md`**。 |
| 2026-05-03 | **`client-delivery-remediation-plan.md`** 開首、**`phase3-day5-acceptance.md`**：補內部工程入口／Phase 索引與 **`business-logic.md`** §0 對照。 |
| 2026-05-03 | **`phase3-day5-acceptance-result-2026-04-30.md`**、**`phase4-day4-delivery-index.md`**、**`phase5-day1-delivery-index.md`**：開首增 **對照**（**`business-logic.md`** §0、Phase 鏈、**`npm run ci`**／**`acceptance:*`**）。 |
| 2026-05-03 | Phase 4／5 **Runbook**、**UI smoke**、**完成報告**、**對外摘要**、**打包／發送模板** 開首增 **對照**；**`scripts/phase4-day4-acceptance.mjs`**、**`phase5-day1-acceptance.mjs`**、**`phase5-verify-delivery-artifacts.mjs`**、**`phase5-generate-closeout-summary.mjs`**、**`phase5-print-closeout-status.mjs`**：產出 Markdown 開首增 **對照**（與 **`business-logic.md`** §0、交付索引一致）。 |
| 2026-05-04 | **`stage2-completion-report.md`**、**`stage2-external-summary.md`**、**`stage3-day3-completion-note.md`**、**`stage3-day5-external-summary.md`**：開首增 **對照**（**`business-logic.md`** §0、Phase 3 驗收與 Phase 4 索引）。 |
| 2026-05-04 | §0：增 **Stage 2／Phase 3 歷史追溯**一行；**`README.md`** 文件表、**`feature-list.md`** 頁尾／§8、**`pdf03-cursorrules-alignment.md`** §3 PR 檢核／§4、**`pdf-alignment-p0-backlog.md`** 修訂紀錄同步。 |
| 2026-05-05 | **`pdf-sequenced-gap-checklist.md`** 主檔「**運維與工程**」：補 **Stage 2／Phase 3** 與 **§0**／**`README`** 互鏈一句；**`pdf03-cursorrules-alignment.md`** §4 維護項補「主檔「**運維與工程**」列」同步對象。 |
| 2026-05-06 | **`.cursorrules`** §3：補 **`pdf-sequenced-gap-checklist.md`** 主檔「**運維與工程**」與 §0 對齊；**`pdf-alignment-p0-backlog.md`** 工程附錄、**`feature-list.md`** §8 README 項／頁尾、**`pdf03-cursorrules-alignment.md`** §3 PR 檢核（**`.cursorrules`** §3 專項）同步。 |
| 2026-05-07 | **`README.md`** 開頭與文件表 **`pdf-sequenced-gap-checklist.md`** 列：補「**運維與工程**」與 **§0**／**§3** 對齊說明；**`feature-list.md`** §8 README 項、**`pdf03-cursorrules-alignment.md`** §3「文件入口」同步。 |
| 2026-05-08 | **`pdf-sequenced-gap-checklist.md`** 標題下增 **對照**；**`go-live-checklist.md`** 開首 **對照** 補 **`pdf-sequenced`**「**運維與工程**」；**`.github/workflows/ci.yml`** 註解補文件入口一句；**`pdf03-cursorrules-alignment.md`** §3「文件入口」補 **`ci.yml`** 註解、§4 維護補序號主檔 **對照**；**`feature-list.md`** §8 CI 項同步。 |
| 2026-05-09 | **`supabase-deploy-runbook.md`**、**`security-token-rotation-checklist.md`**、**`rbac-seq1-verification-checklist.md`** 開首 **對照**：補 **`pdf-sequenced-gap-checklist.md`** 主檔「**運維與工程**」列（與 **go-live**／runbook／憑證同列）。 |
| 2026-05-10 | **`residents-edge-function-contract.md`**、**`assessment-completion-records-contract.md`**、**`feature-list.md`** 開首、**`pdf03-cursorrules-alignment.md`** 標題區／§4、**`adr-0001-scheduling-logic-placement.md`** 開首 **對照**：補 **`pdf-sequenced-gap-checklist.md`**「**運維與工程**」列。 |
| 2026-05-11 | §0 **`pdf-sequenced`** 一行補開首 **對照**／「**運維與工程**」與本節及 **`README`**／**§3** 對齊；**`client-delivery-remediation-plan.md`** 內部入口／**§2**、**`pdf-alignment-p0-backlog.md`** 開首 **對照**、**`feature-list.md`** §8 README 項同步。 |
| 2026-05-12 | **`docs/phase*.md`**、**`docs/stage*.md`** 開首 **對照** 補 **`pdf-sequenced-gap-checklist.md`**「**運維與工程**」列；**`scripts/phase4-day4-acceptance.mjs`**、**`phase5-day1-acceptance.mjs`**、**`phase5-verify-delivery-artifacts.mjs`**、**`phase5-generate-closeout-summary.mjs`**、**`phase5-print-closeout-status.mjs`** 產出 **對照** 同步。 |
