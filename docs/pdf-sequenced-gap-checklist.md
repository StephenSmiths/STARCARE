# PDF 對齊：依序補回／缺漏檢核清單（Sequenced Checklist）

> **用途**：依 **客戶 PDF**（`docs/pdf/01…`、`02…`、`03…`）與現行程式對照，列出**建議執行順序**（Seq）；每項勾選後代表「已對母本驗證或已補齊」。  
> **狀態欄建議填**：`未開始`／`進行中`／`已驗證`（已驗證＝對照 PDF 有證據，非僅自認完成）。  
> **02 編號**：PDF 內 **【5】出現兩次**（填寫表單、開工接更），本清單拆成 **【5】** 與 **【5b】** 以利追蹤。

**相關檔**：`docs/feature-list.md`（現況盤點）、`docs/business-logic.md`（01 條文整理）、`docs/client-delivery-remediation-plan.md`（對客戶流程）、`docs/pdf-alignment-p0-backlog.md`（母本全對齊 P0 可勾選項）。

---

## A. 鐵律與資料治理（`01`—建議優先 Seq 1～12）

| Seq | PDF／條款 | 補回項目／缺漏細節 | 與現況對照（摘要） | 驗收提示 |
|-----|------------|--------------------|-------------------|----------|
| 1 | 01 §1 RBAC | Admin／TeamLead／Staff **三分權限**於 UI／API 完整落地（含「Staff 不可審批自己」） | 已補前端角色解析＋權限矩陣雛型、migration/Edge 三角色授權，並新增 `docs/rbac-seq1-verification-checklist.md` 與單元測試；待實庫執行抽測 | 權限矩陣表＋抽測帳號；**`audit_events`** RLS 見 **go-live** §8 |
| 2 | 01 §2 Session | 工作節 `PENDING→ACCEPTED/REJECTED→COMPLETED` 與「僅 ACCEPTED 可填表」 | 已補 `features/workSessions`：`completeWorkSessionAfterFormApproved`（表單核准→`COMPLETED`）、審計 `WORK_SESSION_COMPLETED`；`resolveLifecycleStatus`／接收拒絕仍於 `workSessionPlans`；表單域已用 `assertSessionAcceptedForSubmit`；仍待 **DB 真相**、與活動時段／排班寫回之正式狀態機 | 狀態流 E2E |
| 3 | 01 §2 Form | 表單 `DRAFT→SUBMITTED→APPROVED/REJECTED…`；`APPROVED` 後鎖定 | 已補 `service_forms` migration、`service-forms-list`／`service-forms-upsert` Edge、`serviceFormRepository` 與 `useServiceFormsWorkspace` 合併遠端＋localStorage 雙寫；已補 **authenticated SELECT RLS**；**歷史文件**頁已改以 Edge `approvedOnly` 為展示主體（`loadApprovedServiceFormsDbPrimary`），失敗時備援本機已核准；已補 **Playwright 煙霧**（`playwright.config.ts`：`webServer` 清空 `VITE_SUPABASE_*` 走 demo；`e2e/smoke.spec.ts` 已涵蓋 `src/app/viewRouting.ts` 之 **全部** `ViewId` hash：各測模組標題＋頁底審計或手冊「快速上手」）；**表單狀態 E2E**：`e2e/service-forms-state.spec.ts`、**`e2e/service-forms-readonly.spec.ts`**＋`e2e/helpers/serviceFormsDemo.ts`（demo：`staff-ot-1`＋種子院友；localStorage 以 **goto→evaluate→reload** 種入，避免與首屏 hydrate 競態）；已接收節次儲存草稿見「草稿」；**草稿→提交審核** 後「我的表單」為待審且紀要出現在待審區；**01 §1**：本人提交後點 **核准** 或 **退回重改**→**確認退回** 時 `alert` 均含「不可審批本人表單」；他人 `SUBMITTED` 可核准／待審 **退回重改**＋**確認退回** 後待審清空；**`REJECTED_NEEDS_REVISION`** 可再儲存草稿；**`APPROVED`**／**`SUBMITTED`** 檢視鎖定見 **`service-forms-readonly`**；本人 **`SUBMITTED`** 可於「我的表單」**軟刪除**（§5）；共用 **`expectStaffServiceFormFieldsReadOnly`**、**`loadServiceFormsDemoPage`**；`npm run test:e2e`（本機有 `.env` 之 Supabase 時須先 **`npm run build:demo`** 再跑，與 CI 同源 bundle；否則 webServer 預設 **`npm run build && npm run preview`**）；CI 於 **`npm run build:demo`** 後設 **`PW_PREVIEW_ONLY=1`** 僅 **`preview`**；**GitHub Actions** `.github/workflows/ci.yml` 已串 `lint`／**`typecheck`**／`test`／**`build:demo`**／`test:e2e`（含 `concurrency`、Playwright 快取、`develop` 分支）；本機 **`npm run ci`** 對應同一路徑；**可選登入 E2E**：`playwright.auth.config.ts`（保留 `VITE_*` 建置、`4174` preview）、`e2e/auth-login.spec.ts`、`npm run test:e2e:auth`（需 `E2E_AUTH_EMAIL`／`E2E_AUTH_PASSWORD`；未設則 skip；通過時驗證側欄「登出」與 `#app-sidebar-nav`、`/#service-forms`（模組標題、**Staff／待審** 面板、審計區；排除 **無法載入時段或院友資料**）**、**`/#work-session-plans`**（**我的工作計劃**、審計區；排除 **無法載入工作計劃時段，請稍後重試。**）**、**`/#residents`**（**院友資料概覽**、**最近審計紀錄** 標題；排除 **無法載入院友名單，請稍後重試。**）**、**`/#scheduling`**（**本次排班指派**、審計區；排除 **無法連線載入院友或時段資料，請檢查網路與 API 設定。**）；仍待登入真庫之完整表單審批閉環 E2E | 狀態＋不可編輯證明 |
| 4 | 01 §3 | **雙軌**（資助復康 vs 認知）**絕不混用**；演算與 02 Pass 細節一致 | 已補 **`filterToSubsidizedRehabServiceOnly`** 於 **`runSubsidizedRehabSchedulingOrchestration`**；**`evalSessionCoreForPick`** 略過非資助時段；**`schedulingService.dualTrack.test.ts`**、**`schedulingCoreSessionGates.test.ts`**、視窗服務測試；認知軌仍 **`dementiaTrackDryRunService`**；**仍待**與 02 **逐條對表**簽核 | 測試案例＋對照 02 文字 |
| 5 | 01 §3.1 | **單日 1 次同類**、**不可連續兩日**及「無其他時段」例外 | 已補 **`schedulingCore.pickSession`** 二階段選時段（先滿足間隔，別無他選再放寬相鄰日）＋**`schedulingCoreSessionGates`**；**`schedulingService.section31.test.ts`** 覆蓋同日、僅相鄰兩日、有週三替代三情境；仍待 **PDF 頁碼簽核** | 邊界週測 |
| 6 | 01 §3.2 | Pass1/2/3 順序與目標（甲一每週 2 次、券依評估、私位剩餘）與 **02** 私位「每週最多 2 次」等是否一致 | **`schedulingTargets`** 已註解現況數值；**`schedulingTargets.test.ts`** 鎖定甲一／券=2、私位=1 與 **`buildTopUpQueue`** 缺額排序；券動態次數、私位是否改 2 **仍待客戶對表裁定** | 客戶裁定單一版本 |
| 7 | 01 §3.3 | 認知軌道：**忽略資助**、嚴重度優先、廣泛覆蓋 | **`dementiaTrackDryRunService`**：`isWithinGapDays`、與資助軌一致之**二階段間隔**；**`filterToDementiaServiceOnly`**＋快照先 **`dementiaSeverityRank`** 排序；**`dementiaTrackDryRunService.test.ts`**；**仍待**與 PDF「廣泛覆蓋」演算法逐欄對表 | 同上 |
| 8 | 01 §4.1 | 合規統計**兩軌獨立**；**週三**甲一／券資助復康仍 0 次→**TeamLead Alert** | 已補 **`residentCareTrackCohort`**；**`mapActiveResidentsToSubsidizedSchedulingResidents`** 供 **`runSchedulingReloadPageData`**、**`runSubsidizedRehabSchedulingOrchestration`**、**`useDashboardOverview`**（週三警示）、**`buildSubsidizedRehabTrackSnapshot`** 共用；**`residentCareTrackCohort.test.ts`**、**`mapActiveResidentsToSubsidizedSchedulingResidents.test.ts`**；**§4.2**：儀表盤 **`countSessionsOnLocalDateByTrack`** 分軌顯示今日時段；仍待與 PDF 逐欄對表及正式庫週完成次 | 模擬週三情境 |
| 9 | 01 §4.3 | 評估到期前 **14 天** 進 Staff 待辦 | 已補 **`residents.assessment_next_due_date`**、**`assessmentDueDateResolve`**、院友單筆表單「下次評估到期日」＋**`residentService`** 正規化／驗證；**`residents-import-validate`／`commit`** 可選 **`assessmentNextDueDate`**／**`assessment_next_due_date`**（`YYYY-MM-DD`）；**`public/residents-import-template.csv`** 與 **`parseResidentCsv`** 對齊；Residents／儀表／評估管理經 **`assessmentDueTaskRepository`**（async；**`assessment-due-list`**）；仍待正式 assessment 全流程與 PDF 簽核 | 待辦 API＋UI |
| 10 | 01 §5 | **全系統**軟刪除（院友外：員工／表單／排班） | 院友軟刪既有；已補員工軟刪（連動 skills/activity/scheduling sessions）與活動時段手動軟刪入口；**服務表單**已補 `service-forms-soft-delete` 等；**排班歷史**已補 `scheduling-history-soft-delete` Edge、`schedulingHistoryBatchSoftDeleteService`、智能排班頁「軟刪除上次儲存批次」（TeamLead／Admin）、`SCHEDULING_HISTORY_BATCH_SOFT_DELETE` 審計、`schedulingLastBatchStorage` | DB `is_deleted` 抽樣 |
| 11 | 01 §5 | **全系統**表單提交＋排班確認 **防抖／鎖定** | 已完成排班儲存、院友表單、三大匯入確認、登入、軟刪除、KPI 重試同步之 UI＋Hook 鎖；關鍵 Edge POST 已附 `X-Idempotency-Key`（待後端端到端驗證） | 雙擊測試＋網路延遲重入測試 |
| 12 | 01 §5 | **Audit Trail** 寫入：操作者、時間、變更前後（表單審批、排班修改） | 院友 CRUD、排班執行/儲存已寫入；新增「週三提醒匯出」與「評估到期待辦匯出」審計事件；共用 `AuditTrailPanel` 支援 action/entity（含 Staff）/keyword，且排班儀表亦顯示全域軌跡；已補 `FORM_*`、`SHIFT_START_HANDOVER_*`、`SHIFT_END_HANDOVER_*`；**`scheduling_history`** 已補 authenticated **SELECT** RLS；**審計落庫**：`audit_events`、RLS、Edge **`audit-trail-append`**／**`audit-trail-list`**、`auditTrailRepository.append`／`listRecent`；登入後 **`hydrateAuditTrailFromRemote`** 合併遠端列；**`useAuditTrailList`** 訂閱更新（排班／歷史文件／評估／AI 報告／院友／通知中心）；通知項 **`remoteId`** 為 id；仍待正式庫抽測（勾選項見 **`docs/go-live-checklist.md`** §8） | Edge／表設計＋畫面；**go-live** §8 |

---

## B. 產品功能模組（`02`【1】～【16】—建議 Seq 13～34）

| Seq | 02 編號 | 補回項目／缺漏細節 | 與現況對照（摘要） | 驗收提示 |
|-----|---------|--------------------|-------------------|----------|
| 13 | 【1】 | 儀表盤：院友／員工總數、今日工作節、本週合規、待辦、今日團隊分 PT/OT | 已新增 `features/dashboard`：`dashboardSummaryService` 彙總（含 **`subsidizedRehabCohortCount`** 與全院友總數分示 §4.1）、`DashboardHome`、`DashboardDailyFlowPanel`、`DashboardTeamLeadWednesdayCard`（Seq 8 週三零次預覽）、`useDashboardOverview` 合併 `buildMidweekSubsidizedZeroAlerts`；**儀表盤底部**已嵌入 **`AuditTrailPanel`**＋`useAuditTrailList`（與 Seq 12 遠端合併同源）；**Playwright** 首屏煙霧已斷言「**全域審計摘要**」標題；RBAC `view:dashboard`、側欄分組；本週合規取最近 KPI 快取、PT/OT **僅**依 **`staff_profiles.role_type`**（無主檔／TeamLead 歸「其他」，**已移除顯示名推斷**）；仍待與 02 逐欄對表 | 對照 02 欄位逐項 |
| 14 | 【2】 | 創建工作計劃：日期、員工、工作節欄位、列表預覽、儲存即指派 | 已新增 `features/workPlans`：`workPlanDraftService`／`workPlanCommitService`（預檢→`activity-sessions-import-commit`）、`WorkPlansHome`（頁底 **`AuditTrailPanel`**＋`useAuditTrailList`）、`view:work-plan-compose`（Admin／TeamLead）；審計 `WORK_PLAN_SESSION_COMMIT`；migration 種子認知活動 `activity-dementia-01`；**五步進度列**：`WorkPlanSopStepper`（依表單狀態標示目前步驟／完成；PDF 02【2】Seq 14 對照用）；仍待與 PDF SOP **逐屏**簽核及 **DB 狀態機**（若母本要求與現行發布流程不同） | SOP 1～5 步 |
| 15 | 【3】 | 智能排班：**導入週更表→確認→排班→預覽→確認採用**；雙軌與 Pass 與 02 備註 | 已補五步進度 UI（`SchedulingWorkflowStepper`）、排班頁內 CSV 週更表（共用活動時段預檢／提交）、確認勾選後才可「啟動智能排班」、`sessionCount`／`reloadSchedulingData`；**活動時段匯入** `ActivitySessionImportPanel` 頁底 **`AuditTrailPanel`**＋`useAuditTrailList`；**`schedulingDataLoadMessage`** 統一 **`useScheduling`** 初始載入／乾跑錯誤句；**`e2e/auth-login`** 已驗 **`/#scheduling`**（排除該句）。仍待與 02 逐步 UI 逐字對表及更表欄位客製 | 流程錄影＋資料 |
| 16 | 【4】 | 我的工作計劃（選日／狀態／列表／詳情／接收或拒絕）；**團隊計劃**（TeamLead、批量刪除） | 已新增 `features/workSessionPlans`、`view:work-session-plans`（Staff／TeamLead／Admin）；`WorkSessionPlansHome` 頁底 **`AuditTrailPanel`**＋`useAuditTrailList`；`workSessionResponseStore`（localStorage）+ `WORK_SESSION_ACCEPT`／`REJECT`／`TEAM_BULK_SOFT_DELETE`／`WORK_SESSION_COMPLETED` 審計；表單核准後工作節標 `COMPLETED`（`features/workSessions`）；**`e2e/auth-login`**（可選登入）已驗 **`/#work-session-plans`** 載入（**我的工作計劃**、**工作節與計劃審計**；排除 **無法載入工作計劃時段，請稍後重試。**）；仍待 DB 正式 session 狀態與活動時段寫回 | 角色分測 |
| 17 | 【5】 | 填寫表單：選日、找工作節、填寫、提交→同步表單審核 | 已新增 `features/serviceForms`：`serviceFormDomainService`（01 §2.1／§2.2）、localStorage、`FORM_*` 審計、`ServiceFormsHome` 頁底 **`AuditTrailPanel`**＋`useAuditTrailList`、`view:service-forms`、`#service-forms`；已接 **Edge 表單 list/upsert** 與 `service_forms` 表（見 Seq 3）；工作節 COMPLETED 見 Seq 2／16；**RLS**：`service_forms_rls`；歷史文件讀庫主體見 Seq 23；**單元測試**拆為 **`serviceFormDomainService.guards.test.ts`**（Node：`assertSessionAcceptedForSubmit`、`assertFormEditable` 之 `APPROVED`／`SUBMITTED` 鎖定，§2.2）與 **`serviceFormDomainService.lifecycle.test.ts`**（happy-dom：提交／核准／`REJECTED_NEEDS_REVISION` 後再 `upsertDraft`；**SUBMITTED**／**APPROVED** 後再儲存拒絕）；已移除併存之單檔以避免重複執行 | 與 §2 表單狀態連動 |
| 18 | 【5b】 | 開工接更：代表、部門概覽、院舍資訊、注意事項、歷史、簽名 | 已新增 `features/shiftStartHandover`、`shiftStartHandoverDomainService`（對齊六步）、localStorage、`SHIFT_START_HANDOVER_*` 審計、`ShiftStartHandoverHome` 頁底 **`AuditTrailPanel`**＋`useAuditTrailList`、`view:shift-start-handover`、`#shift-start-handover`；仍待 DB／電子簽與 PDF 逐字對表 | PDF SOP 六步 |
| 19 | 【6】 | 收工交更：數據概覽、跟進、新增事項、提醒、報告、簽名 | 已新增 `features/endShiftHandover`、`endShiftHandoverDomainService`（對齊五步＋簽名）、localStorage、`SHIFT_END_HANDOVER_*` 審計、`EndShiftHandoverHome` 頁底 **`AuditTrailPanel`**＋`useAuditTrailList`、`view:shift-end-handover`、`#shift-end-handover`；仍待 DB／電子簽與 PDF 逐字對表 | |
| 20 | 【7】 | 智能工作分析／表單審核：提交概況、團隊報告、審批、回饋、通知 | 已新增 `features/workAnalysisReview`（`workAnalysisReviewSummaryService`、`SubmissionOverviewCards`、`TeamReportActionsPanel`）、複用 `ServiceFormReviewPanel`、回饋占位；`view:work-analysis-review`（TeamLead／Admin）、`#work-analysis-review`；`useServiceFormsWorkspace.allForms` 供全系統聚合；頁底 **`AuditTrailPanel`**＋`useAuditTrailList`（與 Seq 12 審計同源）；**站內通知**：`FORM_SUBMIT`／`FORM_APPROVE`／`FORM_REJECT_REVISION`／`FORM_SOFT_DELETE` 已進通知中心（審計衍生）；仍待後端報表、推送通道（電郵／即時）與 PDF 逐字對表 | |
| 21 | 【8】 | 復康活動追蹤：兩軌統計、合規總覽、院友完成列表 | 已新增 `features/rehabActivityTracking`：`rehabActivityTrackingSnapshotService`（資助復康乾跑呼叫 `runSubsidizedRehabScheduling` 且 `recordAudit:false`）、`dementiaTrackDryRunService`（認知時段獨立乾跑）、`RehabActivityTrackingHome` 成功載入後頁底 **`AuditTrailPanel`**＋`useAuditTrailList`、`#rehab-activity-tracking`、`view:rehab-activity-tracking`；仍待與 02 完整看板逐欄對表及認知引擎與正式 SOP 完全對齊 | 與 01 §4 不混算 |
| 22 | 【9】 | 評估管理：到期追蹤、歷史、待處理／逾期、完成率；**版本管理** PT/OT | 已補 `features/assessmentManagement`：`assessmentManagementDomainService`（180 日錨點、14 日逾期寬限、完成率）、localStorage、`ASSESSMENT_COMPLETION_RECORD` 審計、`view:assessment-management`（Staff／TeamLead／Admin）、`#assessment-management`；已補 DB **`assessment_completion_records`**、Edge **`assessment-completion-records-list`**／**`append`**（append 後 **`audit_events`**，**`audit_ok`** 欄位）、**`assessmentCompletionRecordRepository`** 與載入／補登寫庫（本機備援）；仍待 PDF 逐字對表 | 與 Seq 9 呼應 |
| 23 | 【10】 | 歷史文件：僅 `APPROVED`、篩選、匯出 Excel | 已補 `features/historicalDocuments`：展示以 **`loadApprovedServiceFormsDbPrimary`**（遠端核准列為主、成功後併入本機快取）為主，`mergeApprovedFormsFromRemote` 仍保留供他處；載入／備援狀態與說明文案；`mergeServiceFormSnapshotsById` 等單元測試；仍待 xlsx／PDF 逐字對表 | |
| 24 | 【11】 | AI 報告中心（Team Lead）：生成、編輯／採用、發放 | 已補 `features/aiReportCenter`：`aiReportCenterDomainService`（DRAFT→ADOPTED→DISTRIBUTED）、`aiReportCenterRepository`／localStorage、`AI_REPORT_CENTER_*` 審計、`view:ai-report-center`（TeamLead／Admin）、`#ai-report-center`；仍待真正 AI、發放對象／Seq 27 通知與 PDF 逐字對表 | |
| 25 | 【12】 | 院友管理：單筆欄位、批量、**預覽**、**匯出 Excel** | 已補院友名單匯出（UTF-8 BOM CSV，Excel 可開；含 **下次評估到期日**（§4.3 錨點）；末三欄 **資助類別代碼／服務類型代碼／特殊照護代碼** 與 `residents-import-template.csv` 機讀欄語意一致）與 `RESIDENTS_EXPORT` 審計；單筆＋批量預檢流程既有；**`useResidents`** 名單載入失敗寫入固定 **`無法載入院友名單，請稍後重試。`**；**`e2e/auth-login`**（可選登入）已驗 **`/#residents`** 載入（**院友資料概覽**、**最近審計紀錄** 標題並排除該錯誤句）。仍待真正 xlsx 與 02 用語逐字對照 | 對照 02 SOP |
| 26 | 【13】 | 員工管理：單筆、批量、預覽、**匯出**；部門／TeamLead／Member 架構 | 已補員工概覽匯出（UTF-8 BOM CSV，Excel 可開；欄位含 **職類**＝`staff_profiles.role_type`，無主檔時空白）與 `STAFF_EXPORT` 審計；**單筆主檔**：Edge **`staff-profile-update`**（`guardTeamLeadOrAdmin`）、`staffProfileUpdateRepository`、`StaffProfileEditSheet`＋`StaffOverviewPanel` 編輯；**`staff-profiles-list`** 增 **`service_scope`**；審計 `UPDATE`；`ops:deploy:all` 納入 deploy。仍待部門/TeamLead/Member 完整架構與 PDF 逐字對表 | |
| 27 | 【14】 | 通知中心 | 已補 `features/notificationCenter`：以審計事件衍生通知（未讀/已讀/重整）、`view:notification-center`、`#notification-center`；`NotificationCenterHome` 底部 **`AuditTrailPanel`**（與 `useNotificationCenter` 內 **`auditTrail`** 同源，不重複訂閱）；已納入服務表單相關審計 `FORM_SUBMIT`、`FORM_APPROVE`、`FORM_REJECT_REVISION`、`FORM_SOFT_DELETE` 及排班 **`SCHEDULING_HISTORY_BATCH_SOFT_DELETE`**（標題／嚴重度）；仍待推送通道（電郵/即時）與收件對象規則 | |
| 28 | 【15】 | 用戶手冊 | 已補 `features/userManual` 站內指引頁（快速上手含左側選單分組說明、閉環流程、文件參考）與 `view:user-manual`、`#user-manual`；**Playwright** 煙霧已覆蓋 `#user-manual`（模組標題＋「快速上手」）；仍待正式圖文版手冊與角色分章節 | 可先做連結／PDF |
| 29 | 【16】 | 系統設定：排班時間、非治療時段、規則、固定活動、服務類型啟用、SC 是否僅治療師等 | 已補 `features/systemSettings` 與 `schedulingSessionWindowFilterService`：`SystemSettingsHome` 頁底 **`AuditTrailPanel`**＋`useAuditTrailList`；`rulesEngineEnabled` 為真時，智能排班與復康／認知乾跑以**排班視窗＋非治療時段（僅資助復康）**過濾 sessions；**SC 僅治療師**：`scheduling_rules.allow_sc_therapist_only` 與本機 **`specialCareTherapistOnly`** 經 **`buildEngineConstraintsFromRulesAndUi`** 合併後驅動 **`pickSession`**（時段帶 **`staffRoleType`**）；仍待後端院舍設定 API、與 PDF 逐欄對表 | 對照 02 表單欄位 |

---

## C. 工程規範（`03`—建議 Seq 35～38）

| Seq | PDF／條款 | 補回項目／缺漏細節 | 與現況對照（摘要） | 驗收提示 |
|-----|------------|--------------------|-------------------|----------|
| 35 | 03 | 與 `.cursorrules` **並讀**；若有衝突，**客戶簽核 PDF 優先** | 已補 `docs/pdf03-cursorrules-alignment.md`（對照矩陣＋維護說明）；仍待客戶 PDF 換版後覆核 | 差異表 |
| 36 | 03＋01 | 「複雜邏輯優先 Edge／DB」vs 現行**前端排班** | 已補 `docs/adr-0001-scheduling-logic-placement.md`（MVP 前端／上線後端權威之遷移原則） | 書面架構決策 |
| 37 | 03 | 閉環／SRP／200 行等工程約束於**新模組**落實 | 已於 `docs/pdf03-cursorrules-alignment.md` §3 納入 PR 檢核表（含 CI／E2E 變更時 **`build:demo`**／**`.env.example`** 同步項）；**Dependabot** `.github/dependabot.yml`（npm 週一檢查、上限 8 PR）；既有碼仍漸進收斂 | Code review 規則 |
| 38 | 全份 | **三 PDF 版本號／日期**寫入 `docs/business-logic.md` 修訂或獨立 `VERSIONS` | 已補 `docs/business-logic.md` §0.1（含三份母本 SHA-256）；等待客戶補版次／日期 | 客戶確認信 |

---

## 使用方式

1. **由 Seq 小到大執行**；同一 Seq 未完成前，不建議跳去依賴它的模組（例如未做【4】則【5】難驗收）。  
2. 每勾一項，請在內部 issue **貼上 PDF 頁碼或【N】**，方便稽核。  
3. 本表與 `docs/feature-list.md` **雙向更新**：程式交付後改 `feature-list` 狀態；本表「已驗證」由產品簽。

---

| 日期 | 說明 |
|------|------|
| 2026-05-01 | 初版：合併 `01` 鐵律缺口與 `02`【1】～【16】為單一序號清單。 |
| 2026-05-01 | 更新 Seq 11、Seq 38 現況摘要：納入已落地防重覆提交範圍、Edge idempotency header 進度與 PDF 版本追蹤進度。 |
| 2026-05-01 | 更新 Seq 1 現況摘要：新增前端 RBAC 權限矩陣雛型與 `Staff 不可審批自己` 規則函式。 |
| 2026-05-01 | 更新 Seq 1 現況摘要：補上後端三角色對齊 migration 與 Edge `requireStaffUser` 角色擴充。 |
| 2026-05-01 | 更新 Seq 1 現況摘要：補 RBAC 抽測清單文件與 `permissions` 單元測試。 |
| 2026-05-01 | 更新 Seq 8 現況摘要：新增週三資助復康 0 次高優先提醒與對應單元測試。 |
| 2026-05-01 | 更新 Seq 8 現況摘要：補 KPI 區「週三 0 次提醒」摘要卡（含名單預覽）。 |
| 2026-05-01 | 更新 Seq 8 現況摘要：補「週三提醒清單」CSV 匯出與對應測試。 |
| 2026-05-01 | 更新 Seq 9 現況摘要：補 14 天評估到期待辦骨架（估算規則＋UI＋測試）。 |
| 2026-05-01 | 更新 Seq 12 現況摘要：補週三提醒匯出與評估到期待辦匯出的 Audit Trail 事件。 |
| 2026-05-01 | 更新 Seq 12 現況摘要：院友頁 Audit Trail 面板升級為可篩選（action/entity/關鍵字）。 |
| 2026-05-01 | 更新 Seq 10 現況摘要：補員工軟刪除端到端（UI→Service/Repository→Edge Function）。 |
| 2026-05-01 | 更新 Seq 10 現況摘要：補活動時段手動軟刪除端到端（列表入口＋Edge Function）。 |
| 2026-05-01 | 更新 Seq 17 現況摘要：補填寫表單／審核閉環（前端模組＋審計＋RBAC）； persistence 仍為本地暫存。 |
| 2026-05-01 | 更新 Seq 18 現況摘要：補開工接更骨架（六步 UI、草稿／提交、審計）；並修正 `#scheduling` hash 路由對應。 |
| 2026-05-01 | 更新 Seq 19 現況摘要：補收工交更骨架（五步摘要＋簽名、草稿／提交、審計）。 |
| 2026-05-01 | 更新 Seq 20 現況摘要：補工作分析／表單審核頁（提交概況、團隊報告複製、審批複用、回饋占位）。 |
| 2026-05-01 | 更新 Seq 21 現況摘要：補復康活動追蹤兩軌頁（乾跑預覽、分軌列表）；排班引擎支援關閉審計以利追蹤頁試算。 |
| 2026-05-01 | 更新 Seq 22 現況摘要：補評估管理頁（逾期／14 天內到期／完成率／PT·OT 版本本地紀錄）與網域單元測試。 |
| 2026-05-01 | 更新 Seq 12／22：`AuditTrailPanel` 補齊 `ASSESSMENT_COMPLETION_RECORD` 與開收工交更動作篩選；評估管理頁嵌入全域審計節錄。 |
| 2026-05-01 | 更新 Seq 23：歷史文件頁（僅 APPROVED、日期／關鍵字篩選、CSV 匯出）與 `HISTORICAL_DOCUMENTS_EXPORT`；RBAC `view:historical-documents`。 |
| 2026-05-01 | 更新 Seq 24：AI 報告中心骨架與四類審計動作；修正 `#historical-documents` hash 對應與 module 描述遺漏。 |
| 2026-05-01 | 更新 Seq 25：院友名單新增「匯出 Excel（CSV）」與 `RESIDENTS_EXPORT` 審計事件。 |
| 2026-05-01 | 更新 Seq 26：員工概覽新增「匯出 Excel（CSV）」與 `STAFF_EXPORT` 審計事件。 |
| 2026-05-01 | 更新 Seq 27：通知中心骨架（審計事件衍生通知、已讀狀態、RBAC 與路由）。 |
| 2026-05-01 | 更新 Seq 28：新增用戶手冊頁（站內操作摘要）與 `view:user-manual` 路由入口。 |
| 2026-05-01 | 更新 Seq 29：排班／復康乾跑讀取系統設定之排班視窗與非治療時段（`schedulingSessionWindowFilterService`＋單元測試）。 |
| 2026-05-01 | 更新 Seq 2／16：`features/workSessions`＋表單核准寫入 `COMPLETED` 與 `WORK_SESSION_COMPLETED` 審計；Seq 35–37：`pdf03-cursorrules-alignment.md`、`adr-0001-scheduling-logic-placement.md`。 |
| 2026-05-01 | 更新 Seq 3／17：`service_forms` migration、`service-forms-list`／`service-forms-upsert`、`serviceFormRepository` 與表單工作區遠端合併。 |
| 2026-05-01 | 更新 Seq 23：`serviceFormSyncService` 共用合併；歷史文件頁載入／重整會拉 Edge 表單；刪除 `historicalDocumentsRepository.ts`。 |
| 2026-05-01 | 更新 Seq 23：`service-forms-list` 支援 `approvedOnly`；歷史文件改 `mergeApprovedFormsFromRemote`。 |
| 2026-05-01 | 更新 Seq 10：服務表單軟刪除（Edge `service-forms-soft-delete`、Repository、`useServiceFormsWorkspace.softDelete`、UI、`FORM_SOFT_DELETE`）。 |
| 2026-05-01 | 更新 Seq 27：`notificationCenterService` 納入 `FORM_SOFT_DELETE` 審計衍生通知（標題／嚴重度）。 |
| 2026-05-01 | 更新 Seq 20／27：通知中心納入 `FORM_SUBMIT`、`FORM_APPROVE`、`FORM_REJECT_REVISION`（與既有 `FORM_SOFT_DELETE`）審計衍生站內通知。 |
| 2026-05-01 | 更新 Seq 3／17：`service_forms` 補 authenticated **SELECT** RLS（staff 本人／teamlead+admin 全院未刪；寫入仍僅 Edge／service_role）。 |
| 2026-05-02 | 更新 Seq 13／28：儀表盤新增「建議從哪裡開始」、側欄分組導覽、手冊快速上手補充選單說明（新手上手）。 |
| 2026-05-02 | 更新 Seq 3／17／23：歷史文件頁以 Edge 核准列為展示主體（`loadApprovedServiceFormsDbPrimary`）、遠端失敗備援本機與 UI 狀態。 |
| 2026-05-02 | 更新 Seq 10：`scheduling_history` 依 batch 軟刪（Edge、Repository、`SchedulingHistoryUndoPanel`、審計）。 |
| 2026-05-02 | 更新 Seq 27：通知中心納入 `SCHEDULING_HISTORY_BATCH_SOFT_DELETE`。 |
| 2026-05-02 | 更新 Seq 8／13：儀表盤為 TeamLead／Admin 增加週三資助復康零次提醒預覽卡（`DashboardTeamLeadWednesdayCard`）。 |
| 2026-05-02 | 更新 Seq 12：`scheduling_history` 補 authenticated SELECT RLS（staff 本人 actor／teamlead+admin 全院未刪）。 |
| 2026-05-02 | 更新 Seq 3：Playwright E2E 骨架與煙霧測試（`test:e2e`）；Vitest 排除 `e2e/`（`vitest.config.ts`）。 |
| 2026-05-02 | 更新 Seq 12：`audit_events`＋`audit-trail-append`＋Repository；`globalAuditTrailService.record` 非阻塞落庫；`ops:deploy:all` 納入 deploy。 |
| 2026-05-02 | 更新 Seq 12：`audit-trail-list`、`hydrateAuditTrailFromRemote`、`mergeRemoteAuditTrail`、`useAuditTrailList`；通知 id 支援 `remoteId`。 |
| 2026-05-02 | 更新 Seq 13：`DashboardHome` 底部嵌入 `AuditTrailPanel`（與審計遠端合併同源）。 |
| 2026-05-02 | 更新 Seq 20／3：`WorkAnalysisReviewHome` 嵌入 `AuditTrailPanel`；E2E 補 `#work-analysis-review` 煙霧。 |
| 2026-05-02 | 更新 Seq 14／16／17／29／3：`ServiceFormsHome`、`WorkSessionPlansHome`、`SystemSettingsHome`、`WorkPlansHome` 頁底審計面板；E2E 補 `#work-session-plans`。 |
| 2026-05-02 | 更新 Seq 18／19／21／3：`ShiftStartHandoverHome`、`EndShiftHandoverHome`、`RehabActivityTrackingHome` 頁底審計；E2E 補 `#shift-start-handover`。 |
| 2026-05-02 | 更新 Seq 15／26／27／3：`ActivitySessionImportPanel`、`StaffImportPanel`、`NotificationCenterHome` 審計區；`useNotificationCenter` 回傳 `auditTrail`；E2E 補 `#staff-import`。 |
| 2026-05-01 | 更新 Seq 3：E2E 煙霧補 `#activity-sessions-import`、`#notification-center`（模組標題＋審計標題）。 |
| 2026-05-01 | 更新 Seq 3／28：E2E 煙霧補 `#user-manual`（模組標題＋「快速上手」）；與 `docs/feature-list.md` §8 雙向註記 Playwright 覆蓋 hash。 |
| 2026-05-01 | 更新 Seq 3：`e2e/smoke.spec.ts` 擴至 **全部** `ViewId`（含 `#scheduling`、`#service-forms`、`#historical-documents`、`#work-plan`、`#residents`、`#shift-end-handover`、`#rehab-activity-tracking`、`#assessment-management`、`#system-settings`、`#ai-report-center`）；`feature-list` §8 同步。 |
| 2026-05-01 | 更新 Seq 3／13：`e2e/smoke.spec.ts` 改為 **`HASH_AUDIT_CASES` 資料驅動**；首屏補 **`全域審計摘要`** 斷言；`toHaveURL` 改為不含誤判之必填尾斜線。 |
| 2026-05-01 | 更新 Seq 3：`playwright.auth.config.ts`、`e2e/auth-login.spec.ts`、`npm run test:e2e:auth`；`playwright.config.ts` 排除 `auth-login`；`.env.example` 補 `E2E_AUTH_*`。 |
| 2026-05-01 | 更新 Seq 3：`auth-login` 登入後補側欄 **`#app-sidebar-nav`**、**「登出」** 斷言；`docs/go-live-checklist.md` §1.1 可選 Playwright 登入項。 |
| 2026-05-01 | 更新 Seq 3：`.github/workflows/ci.yml`（`lint`／`test`／`test:e2e`）；`npm run test:e2e:all`（煙霧＋可選登入）。 |
| 2026-05-01 | 更新 Seq 3：`playwright.config.ts` 支援 **`PW_PREVIEW_ONLY`**；CI 分步 demo 建置＋煙霧（**2026-05-03** 起標準化 **`npm run build:demo`**）；workflow 加 **`concurrency`**。 |
| 2026-05-01 | 更新 Seq 3：CI 加 **Playwright 瀏覽器 cache**、push 分支含 **`develop`**；`package.json` 新增 **`npm run ci`**。 |
| 2026-05-01 | 更新 Seq 37：新增 **`.github/dependabot.yml`**（npm 依賴週更 PR）。 |
| 2026-05-01 | 更新 `README.md`：STARCARE 入口、文件表、常用指令與 CI；呼應 `feature-list` §8 第 3 點。 |
| 2026-05-01 | 更新 Seq 3／37：`npm run typecheck`（`tsc -b --noEmit`）納入 **`npm run ci`** 與 GitHub Actions；`pdf03-cursorrules-alignment` PR 檢核表補文件同步項。 |
| 2026-05-01 | 更新 Seq 3／17：`serviceFormDomainService.test.ts` 補 **01 §2.2** `assertFormEditable`（`APPROVED`／`SUBMITTED`）單元測試。 |
| 2026-05-01 | 更新 Seq 17：`serviceFormDomainService.test.ts` 設 **`@vitest-environment happy-dom`**，補 **核准後** `upsertDraftServiceForm` 再儲存拒絕之整合測試。 |
| 2026-05-01 | 更新 Seq 17：同上檔補 **SUBMITTED** 後 `upsertDraftServiceForm` 再儲存拒絕（happy-dom）。 |
| 2026-05-01 | 更新 Seq 17：同上檔補 **退回後** `REJECTED_NEEDS_REVISION` 可再 `upsertDraft`（happy-dom）。 |
| 2026-05-02 | 更新 Seq 17：`serviceFormDomainService` 測試拆分為 **`serviceFormDomainService.guards.test.ts`**（Node）與 **`serviceFormDomainService.lifecycle.test.ts`**（happy-dom）；移除併存之 **`serviceFormDomainService.test.ts`**，避免同一案例重複跑兩次。 |
| 2026-05-02 | 更新 Seq 3：demo 綁定 `staff-ot-1`（`resolveStaffProfileIdForWorkPlans`）、`InMemoryResidentRepository` 種子院友；新增 **`e2e/service-forms-state.spec.ts`**（草稿／待審核准）。 |
| 2026-05-02 | 更新 Seq 3：**`e2e/service-forms-state.spec.ts`** 補 **退回重改**（`REJECTED_NEEDS_REVISION`）後載入再儲存草稿之 E2E（01 §2.2）。 |
| 2026-05-02 | 更新 Seq 3：**`e2e/service-forms-state.spec.ts`** 補待審區 **退回重改**→**確認退回** UI 路徑（01 §2.2）。 |
| 2026-05-02 | 更新 Seq 3：**`APPROVED` 檢視鎖定** E2E；抽 **`e2e/helpers/serviceFormsDemo.ts`**；表單種子改 **goto→evaluate→reload** 以穩定 hydrate。 |
| 2026-05-02 | 更新 Seq 3：**`SUBMITTED`（待審）檢視鎖定** E2E；**`expectStaffServiceFormFieldsReadOnly`** 共用唯讀斷言。 |
| 2026-05-02 | 更新 Seq 3：**草稿→提交審核** 閉環 E2E；**`loadServiceFormsDemoPage`** 收斂種子後定位器。 |
| 2026-05-02 | 更新 Seq 1／3：demo E2E **不可審批本人已提交表單**（`fillAcceptedSessionDraftAndSubmit`＋`alert` 斷言，01 §1）。 |
| 2026-05-02 | 更新 Seq 1／3：同上 E2E 補 **退回重改** 路徑之自審阻擋（`rejectServiceFormRevision` 與核准同規則）。 |
| 2026-05-02 | 更新 Seq 3／5：抽 **`e2e/service-forms-readonly.spec.ts`**（唯讀檢視）；**本人 SUBMITTED 軟刪除** E2E（`service-forms-state`）。 |
| 2026-05-02 | 更新 Seq 3：**`e2e/auth-login.spec.ts`** 於可選登入通過時另驗 **`/#service-forms`**（模組標題與審計區）；`feature-list` §8、`go-live-checklist` §1.1 同步。 |
| 2026-05-02 | 更新 Seq 3：**`auth-login`** 之 **`/#service-forms`** 案例補 **Staff／待審** 標題可見與排除 **`無法載入時段或院友資料`**（真庫工作區載入）。 |
| 2026-05-02 | 更新 Seq 3：抽 **`e2e/helpers/authLogin.ts`**（可選登入憑證＋`loginWithE2ECredentials`）；`.env.example` 補 **`starcare_staff_profile_id`** 與 E2E 關係說明。 |
| 2026-05-02 | 更新 Seq 3／16：**`e2e/auth-login.spec.ts`** 增 **`/#work-session-plans`** 可選登入載入斷言（對齊 **`useWorkSessionPlans`** 時段來源）。 |
| 2026-05-02 | 更新 Seq 3／25：**`e2e/auth-login.spec.ts`** 增 **`/#residents`** 可選登入載入斷言（**院友資料概覽**、審計區標題）。 |
| 2026-05-02 | 更新 Seq 25／3：**`useResidents`** 名單 **`refresh`** 補 try/catch 與固定錯誤句；**`auth-login`** **`/#residents`** 斷言排除該句。 |
| 2026-05-02 | 更新 Seq 25：抽 **`residentListRefreshOutcome`**（`runResidentListRefresh`＋**`RESIDENT_LIST_LOAD_ERROR_MESSAGE`**）與 **`residentListRefreshOutcome.test.ts`**；**`useResidents`**／**`auth-login`** 共用常數。 |
| 2026-05-02 | 更新 Seq 3／15：**`schedulingDataLoadMessage`**；**`e2e/auth-login`** 增 **`/#scheduling`** 可選登入斷言。 |
| 2026-05-02 | 更新 Seq 15：抽 **`schedulingReloadPageData`**（`runSchedulingReloadPageData`＋測試）以收斂 **`useScheduling`** 行數。 |
| 2026-05-02 | 更新 Seq 3／23／27：**`e2e/auth-login`** 增 **`/#notification-center`**、**`/#historical-documents`** 可選登入斷言；`feature-list` §8、`go-live-checklist` §1.1 同步。 |
| 2026-05-02 | 更新 Seq 3／18／19／21／22／28：**`e2e/auth-login`** 增 **開工／收工交更**、**復康追蹤**、**評估管理**、**用戶手冊** hash；註記預設 Staff 與 **`playwright.auth.config`** 範圍。 |
| 2026-05-02 | 更新 Seq 3／37：可選登入拆 **`e2e/auth-login.staff-modules.spec.ts`**；**`playwright.auth.config`**／**`playwright.config`** 改 **`auth-login*.spec.ts`**；`feature-list` §8、`go-live-checklist` §1.1 同步。 |
| 2026-05-02 | 更新 Seq 13／母本 P0：`staff-profiles-list` Edge、**`staffProfilesListRepository`**、**`StaffOverviewRow.roleType`**；**`rehabDisciplineFamilyFromStaff`** 優先 `role_type`；**`ops:deploy:all`** 納入 deploy；`pdf-alignment-p0-backlog` changelog；主清單「相關檔」連結 P0 backlog。 |
| 2026-05-02 | 更新 Seq 26：`staffOverviewExportCsv` 匯出增 **職類** 欄（`role_type`）；`StaffOverviewPanel` 說明同步。 |
| 2026-05-02 | 更新 Seq 25：`residentsExportCsv` 匯出增機讀代碼末三欄（對齊批量匯入範本）；`ResidentsDashboard` 說明、`feature-list` RES-04 備註同步。 |
| 2026-05-02 | 更新 Seq 14／26：`WorkPlanComposerPanel` 員工選單顯示 **role_type**；`StaffOverviewPanel` 表格增 **職類** 欄。 |
| 2026-05-02 | 更新 Seq 26：`staff-profile-update` Edge、**`guardTeamLeadOrAdmin`**、**`staffProfileUpdateRepository`**、**`StaffProfileEditSheet`**；**`staff-profiles-list`** 回傳 **service_scope**；**`StaffOverviewRow.serviceScope`**；**`useStaffManagementOverview.reload`**。 |
| 2026-05-02 | 更新 Seq 1／26：**`staff-import-validate`**、**`staff-import-commit`**、**`staff-soft-delete`** 改 **`guardTeamLeadOrAdmin`**（Staff JWT 一律 403）；**`StaffOverviewPanel`** 無 `view:staff-import` 時操作欄顯示「—」；**`rbac-seq1-verification-checklist`** 增 4b。 |
| 2026-05-02 | 更新 Seq 1／25／15：**`residents-create`**／**update**／**soft-delete**、**`residents-import-validate`**／**commit**、**`activity-sessions-import-validate`**／**commit**、**`activity-sessions-soft-delete`** 改 **`guardTeamLeadOrAdmin`**；**`rbac-seq1-verification-checklist`** 增 4c。 |
| 2026-05-02 | 更新 Seq 1／25／15：前端 **`ResidentsDashboard`**（**`ResidentsAdminWriteSections`**、`ResidentsListPanel`）、**`ActivitySessionImportPanel`**／**`ActivitySessionListPanel`** 依 **`view:residents`**／**`view:activity-sessions-import`** 隱藏寫入 UI，與 Edge 403 一致。 |
| 2026-05-02 | 更新 Seq 13／29：**`rehabDisciplineFamilyFromStaff`** 移除顯示名推斷（無 `role_type` 歸其他）；**`schedulingCore.pickSession`** 於 **`allowScTherapistOnly`** 時擋 SC→PTA／OTA／TeamLead（有 **`staffRoleType`** 時）；**`schedulingConfigService.listSchedulingSessions`** 併 **`staff-profiles-list`**；**`buildEngineConstraintsFromRulesAndUi`** 合併 **`scheduling_rules`** 與本機 **SC 僅治療師**；種子時段補 **`staffRoleType`**。 |
| 2026-05-02 | 更新 Seq 29：**`systemSettingsExternalStore`**（bump＋`storage`）與 **`saveSystemSettings`** 聯動；**`useRehabActivityTracking`** 以 **`useSyncExternalStore`** 訂閱，使乾跑約束於儲存設定或他分頁變更後重算。 |
| 2026-05-02 | 更新 Seq 15／29：**`schedulingConfigService.listSchedulingSessions`** 對 **`staff-profiles-list`** **`.catch(() => [])`**，主檔失敗時仍載入活動時段（略過 **`staffRoleType`**）。 |
| 2026-05-02 | 更新 Seq 15／29：**`useInvalidateOnSystemSettingsExternalChange`**／**`useSystemSettingsExternalVersion`**（抽離 **`useReloadWhenSystemSettingsChange`**）；**`useScheduling`**、**`useDashboardOverview`**、**`useRehabActivityTracking`** 於本機設定變更時重載或重算；**`getStaffProfilesUnavailableLastList`**＋**`SchedulingDataAlerts`** 主檔降級提示。 |
| 2026-05-02 | 更新 Seq 37：**`useSchedulingRunAndSave`** 抽離啟動排班／儲存指派；**`systemSettings/index`** 匯出 **`useInvalidateOnSystemSettingsExternalChange`**、**`useSystemSettingsExternalVersion`**。 |
| 2026-05-02 | 更新 Seq 29／37：排班／儀表盤／復康追蹤改由 **`../../systemSettings`** barrel import；**`systemSettingsExternalStore.test.ts`**。 |
| 2026-05-02 | 更新 Seq 14／29：**`systemSettings/index`** 增 **`loadSystemSettings`**、**`saveSystemSettings`**、**`SystemSettingsSnapshot`**、**`isValidHm`**／**`hmLessThan`**；排班 **`schedulingHookHelpers`**／**`schedulingSessionWindowFilterService`** 改 barrel；**`useWorkPlanComposer`** 以 **`loadMeta` 序號**＋**`useInvalidateOnSystemSettingsExternalChange`** 於設定變更時重載員工／活動。 |
| 2026-05-02 | 更新 Seq 10／15／29：**`useActivitySessionList`** 抽 **`loadList`** 序號防競態＋**`useInvalidateOnSystemSettingsExternalChange`**；**`useSystemSettings`** 註解說明不可自 **`index`** barrel 匯入（循環依賴）。 |
| 2026-05-02 | 更新 Seq 26／29：**`useStaffManagementOverview`** 增 **`loadSeqRef`** 與 **`useInvalidateOnSystemSettingsExternalChange(reload)`**（職類主檔與他分頁設定同步）。 |
| 2026-05-02 | 更新 Seq 16／29：**`useWorkSessionPlans`** 之 **`reload`** 增 **`loadSeqRef`**＋**`useInvalidateOnSystemSettingsExternalChange(reload)`**（時段含 **`staffRoleType`** 與本機設定同步）。 |
| 2026-05-01 | 更新 Seq 17／29：**`useServiceFormsWorkspace`** 以 **`loadSeqRef`**／**`reloadContext`** 防遠端合併競態、**`mergeRemoteForms`** 僅回傳合併結果並由通過序號之 **`reloadContext`** 寫入 **`setForms`**；**`useInvalidateOnSystemSettingsExternalChange(reloadContext)`**；**`npm run lint`／`typecheck`／`test`** 已通過。 |
| 2026-05-01 | 更新 Seq 5／13：**`schedulingService.test.ts`** 補 **01 §3.1** 同日上限與相鄰日間隔之單元測試；**`pdf-alignment-p0-backlog`** 勾選「PT/OT 以 `role_type`」子項（逐欄對表仍待）。 |
| 2026-05-01 | 更新 Seq 5：**`schedulingCore`** 二階段選時段實作「無其他可用時段」例外；**`schedulingCoreSessionGates`**；§3.1 測試拆 **`schedulingService.section31.test.ts`**（`schedulingService.test.ts` 控行數）。 |
| 2026-05-01 | 更新 Seq 6：**`schedulingTargets`** 註解現況數值與私位／券待裁定事項；新增 **`schedulingTargets.test.ts`**。 |
| 2026-05-01 | 更新 Seq 4：**`filterToSubsidizedRehabServiceOnly`**、乾跑串接、**`schedulingService.dualTrack.test.ts`**／**`schedulingCoreSessionGates.test.ts`**。 |
| 2026-05-01 | 更新 Seq 7：**`filterToDementiaServiceOnly`**、認知軌 **`pickDementiaSession`** 二階段間隔＋**`dementiaTrackDryRunService.test.ts`**。 |
| 2026-05-01 | 更新 Seq 8：**`residentCareTrackCohort`**；排班載入／儀表週三警示僅資助復康合規族群；**`schedulingReloadPageData`** 測試。 |
| 2026-05-01 | 更新 Seq 8／§4.2：**`dashboardSummaryService`** 今日時段分軌欄位、**`DashboardOverviewPanel`** 文案。 |
| 2026-05-02 | 更新 Seq 8：**`mapActiveResidentsToSubsidizedSchedulingResidents`** 擴及 **`useDashboardOverview`** 週三警示與 **`buildSubsidizedRehabTrackSnapshot`**（與排班載入／乾跑 orchestration 同源篩選）。 |
| 2026-05-02 | 更新 Seq 13：**`DashboardSummary.subsidizedRehabCohortCount`**／**`DashboardOverviewPanel`** 提示與 KPI 分母 §4.1 族群一致；**`calculateSchedulingKpis`** 註解。 |
| 2026-05-02 | 更新 Seq 9：**`assessmentDueTaskRepository`**（MVP 委派入住週期估算）；儀表盤／院友頁／評估管理統一走 Repository。 |
| 2026-05-02 | 更新 Seq 9：Edge **`assessment-due-list`**、**`ops:deploy:all`** 納入 deploy；Repository 改 **`src/repositories`** async＋Edge 失敗回退。 |
| 2026-05-02 | 更新 Seq 9：**`assessment_next_due_date`** migration、**`assessmentDueDateResolve`**、院友 **`Resident`**／mapper 對齊。 |
| 2026-05-02 | 更新 Seq 9：院友 **`ResidentsSingleResidentForm`**／**`ResidentsDashboard`** 可維護評估到期日；**`residentService`** 驗證與單元測試。 |
| 2026-05-02 | 更新 Seq 9／25：批量匯入／匯出 CSV 納入可選 **下次評估到期日**（Edge validate／commit、**`residentsExportCsvService`**、範本、**`docs/residents-import-*.csv`**）；**`residents-edge-function-contract`** 補匯入契約。 |
| 2026-05-02 | 更新 Seq 9：**`docs/residents-import-verification.sql`** 納入 **`admission_date`**／**`assessment_next_due_date`** 與錨點篩選查詢；**`go-live-checklist`** §4.1 勾選說明同步。 |
| 2026-05-02 | 更新 Seq 9／契約：**`residents-create`**／**`residents-update`** Edge 改白名單寫入＋**`assessment_next_due_date`** 格式驗證（**`_shared/residentWritePayload.ts`**）；**`is_deleted`** 僅經 **`residents-soft-delete`**。 |
| 2026-05-02 | 更新 Seq 9：**`business-logic.md`** §7 §4.3／§8 補錨點寫入路徑與 **`residentService`** 更新正規化；**`pdf-alignment-p0-backlog`** changelog 同步。 |
| 2026-05-02 | 更新 Seq 22：migration **`assessment_completion_records`**、Edge **`assessment-completion-records-list`**、**`assessmentCompletionRecordRepository`**、評估管理載入合併遠端／本機；**`ops:deploy:all`** 納入 deploy。 |
| 2026-05-02 | 更新 Seq 22：Edge **`assessment-completion-records-append`**、Repository **`append`**、**`useAssessmentManagementWorkspace`** 提交流程；**`ops:deploy:all`** 納入 deploy。 |
| 2026-05-02 | 更新 Seq 12／22：**`appendAssessmentCompletionAudit`**（**`audit_events`**）；**`docs/assessment-completion-records-contract.md`**。 |
| 2026-05-03 | 更新 Seq 14：**`WorkPlanSopStepper`**＋`WorkPlanComposerPanel` 嵌入；五步 UI 與排班 **`SchedulingWorkflowStepper`** 同類進度提示（逐屏簽核／狀態機仍待）。 |
| 2026-05-03 | 更新 CORE-05／Seq 15：**`SchedulingToolbar`**、**`SchedulingSavePanel`** 改引用 **`uiTokens`**；**`e2e/smoke`** 之 **`#work-plan`** 增斷言頁內 **五步** 標題。 |
| 2026-05-03 | 更新 CORE-05：**`uiTokens`** 增橫幅／區塊／琥珀次要鈕語意；**`SchedulingDataAlerts`**、**`SchedulingConflictsPanel`**、**`SchedulingReportBar`**、**`SchedulingStatsCards`** 改引用。 |
| 2026-05-03 | 更新 CORE-05：**`KpiCards`**／**`KpiTrendPanel`**／**`KpiTrendFilterBar`**／**`ResidentTable`**＋**`panelMutedInset`**、**`surfaceCardCompactWarn`**、**`surfaceTableShell`**、**`inlineNotice*`**。 |
| 2026-05-03 | 更新 CORE-05：**`SchedulingWorkflowSection`**（**`rosterConfirmChoiceCard`**、**`textUrgentHint`**）、**`SchedulingDashboard`** 指派空狀態、**`SchedulingSidebar`** 登出（**`sidebarMutedButton`**）。 |
| 2026-05-03 | 更新 CORE-05：**`SchedulingSidebar`** 品牌／分組／導覽鏈結／頁尾與 **`SchedulingAppLayout`** backdrop／頂欄標題，統一走 **`sidebar*`**／**`mobileNavBackdrop`**／**`mobileTopBarTitle`**。 |
| 2026-05-03 | 更新 CORE-05：**`AuditTrailPanel`**、**`ImportRunSummaryCard`**、**`ImportRunHistoryList`**＋**`auditTrailPanel`**、**`metaChip`**、**`importRunSummaryShell`** 等（跨模組審計／匯入 SHR）。 |
| 2026-05-03 | 更新 CORE-05：**`ResponsiveFormSheet`**（**`formSheetBackdrop`** 等）、**`DashboardHome`** 快速連結區。 |
| 2026-05-03 | 更新 CORE-05／Seq 13：**`DashboardDailyFlowPanel`**、**`DashboardOverviewPanel`**、**`DashboardTeamLeadWednesdayCard`**＋**`dashboardFlow*`**、**`dashboardStatTile*`**、**`hashLinkProse`** 等。 |
| 2026-05-03 | 更新 CORE-05／RES：**`ResidentsOverviewPanel`**、**`ResidentsAssessmentDuePanel`**、**`ResidentsDashboard`**、**`ResidentsSingleResidentForm`**＋**`residentKpiTile*`**、**`formInlineError`**、**`listCalloutAmber`**。 |
| 2026-05-03 | 更新 CORE-05／RES：**`ResidentsImportPanel`**、**`ResidentsListPanel`**、**`ResidentsAdminWriteSections`**＋**`residentImport*`**、**`residentList*`**、**`dryRunStatusPill*`**、**`btnPager`**。 |
| 2026-05-03 | 更新 CORE-05：**`StaffImportPanel`**、**`StaffOverviewPanel`**、**`StaffProfileEditSheet`**；**`ServiceFormsHome`**、**`ServiceFormStaffPanel`**、**`ServiceFormReviewPanel`**、**`ServiceFormMyFormsList`**＋**`modal*`**、**`table*`**、**`reviewQueue*`**、**`myFormsList*`**。 |
| 2026-05-03 | 更新 CORE-05：**`uiTokens`** 拆為 **`base`**／**`extended`**（單檔 &lt;200 行）；**`ActivitySessionImportPanel`**、**`ActivitySessionListPanel`**、**`SignInScreen`**＋**`authSignIn*`**、**`emptyInlineMutedBox`**、**`tableScrollTall`**。 |
| 2026-05-03 | 更新 CORE-05：**`TeamWorkPlanPanel`**／**`MyWorkPlanPanel`**、交更／接更 **`ShiftStartHandover*`**／**`EndShiftHandover*`**、**`SchedulingDashboard`** 指派列表、**`RehabActivityTrackingHome`**、**`HistoricalDocumentsTable`**＋**`listDivideShell`**、**`handoverHistory*`**、**`schedulingWorkflow*`** 等。 |
| 2026-05-03 | 更新 CORE-05：**`AssessmentSummaryCards`**、**`UserManualHome`**、**`SchedulingKpiTrendPanel`**、**`SubmissionOverviewCards`**、**`SchedulingWeeklyRosterPanel`**＋**`bulletListDiscSm`**、**`submissionStatTile*`**、**`statDdXl`**。 |
| 2026-05-03 | 更新 CORE-05：**`SystemSettingsHome`**、**`SchedulingHistoryUndoPanel`**、**`ResidentsOverviewPanel`**、**`FeedbackAndNotifyStubs`**、**`SchedulingConflictsPanel`**、**`AssessmentManagementHome`**、**`AiReportList`**、**`WorkPlanComposerPanel`**、**`HistoricalDocumentsToolbar`**、**`NotificationCenterHome`**＋**`formToggleLabel`**、**`settings*`**、**`composer*`**、**`notificationMetaRow`** 等。 |
| 2026-05-03 | 更新 CORE-05：**`inlineDangerCompact`**（工作計劃 meta 錯誤）；**`WorkPlanSopStepper`**／**`SchedulingWorkflowStepper`** 共用 **stepper***；**`SchedulingStatsCards`**／**`SchedulingKpiCards`**、**`SchedulingToolbar`**、**`SchedulingKpiTrendPanel`**、**`HistoricalDocumentsHome`**；接更／交更 **handoverEditorGrid**。 |
| 2026-05-03 | 更新 CORE-05：**`SchedulingResidentTable`**（**`residentTable*`**／**`rosterStatus*`**）、**`RehabTrackSection`**（**`rehabTrack*`**）、**`DashboardOverviewPanel`**（**`dashboardStatGrid`**）；**`SchedulingToolbar`**／**`SchedulingSavePanel`**／**`SchedulingReportBar`** 改 **複合 shell／鈕 token**（**`schedulingToolbarRunButton`** 等）。 |
| 2026-05-03 | 更新 CORE-05：抽 **`uiTokens/schedulingSurfaces`**（排班殼／院友表／復康表／儀表格等）；**`HistoricalDocumentsToolbar`**（**`historicalDocuments*`**）、**`SchedulingKpiTrendFilterBar`**／**`SchedulingKpiTrendPanel`**（**`schedulingKpiTrend*`**）。 |
| 2026-05-03 | 更新 CORE-05：**`extended`** 銜接 **`base`** 組複合字串（**`signInAccentButtonFullWidth`**、**`formSheetCloseButtonSecondary`**、**`aiReportComposer*`**、**`auditTrailFilter*`**／**`formInputMaxXsTextXs`**、**`tableCellNowrap`**、**`handoverHistorySignatureMeta`**、**`btnDangerOutlineDisabled`**、**`btnCompactDisabled`**、**`staffTableRowSecondaryAction`**）；**`schedulingSurfaces`** 增 **`residentTableToolbar*`**；多元件改引用。 |
| 2026-05-03 | 更新 CORE-05：抽 **`uiTokens/extendedComposites`**（原 **`extended`** 內與 **`base`** 組字段）；**`SubmissionOverviewCards`**／**`ResidentsOverviewPanel`**／**`AssessmentSummaryCards`** 等改 **`statDd*`**／**`statValueLg*`**；匯入／員工表／通知／交更首頁等改 **`blockHelpMt2`**、**`btn*Mt2`**、**`handoverHomeContentWidth`** 等；**`hashLinkAccentMl2`** 改字面組字（`hashLinkAccent` 在 extended）。 |
| 2026-05-03 | 更新 CORE-05：**`schedulingSurfaces`** 增排班五步 **`schedulingWorkflowStep*`**／**`schedulingStatValue2xlAmber900`**／**`schedulingMidweekKpiHintAmber`**；**`extendedComposites`** 增 **`workPlanStep*`**、**`tableCompactTh`**、歷史文件表／評估表 **`historicalDocuments*`**／**`assessmentTable*`**、**`residentForm*`**、**`rosterConfirmChoiceCardMuted`**；**`SchedulingWorkflowStepper`**／**`WorkPlanSopStepper`**／**`SchedulingKpiCards`**／**`HistoricalDocumentsTable`**／**`AssessmentManagementTables`** 等改引用。 |
| 2026-05-03 | 更新 CORE-05：**`notificationSeverityBadge*`**、**`sidebarShellMobile*`**／**`sidebarNavLinkRow*`**、**`appMainContentArea`**；**`schedulingSurfaces`** 增院友資助 **`residentTableFundingBadgeShell`**／**`residentFundingBadge*`**；**`NotificationCenterHome`**、**`SchedulingSidebar`**、**`SchedulingResidentTable`**、**`App.tsx`** 改引用。 |
| 2026-05-03 | 更新 CORE-05：院友資助改 **`residentTableFundingBadgeGradeA`**／**`Voucher`**／**`Private`** 整段 token（**`*.tsx` 內 `className={\`` 模板已清零**）；**`appAuthSessionLoadingRoot`** 收斂 **`App`** 載入畫面。 |
| 2026-05-03 | 更新 CORE-05：**`extended`** 增 **`layoutSpaceY*`**（儀表／排班／通知等頁堆疊）；**`schedulingSurfaces`** 增 **`schedulingAppMainColumn`**、**`sidebarNavScrollStack`**、**`sidebarFooterUserStack`**；**`extendedComposites`** 增 **`formSheetViewportRoot`**、**`formSheetTitleShrinkWrap`**；**`SchedulingAppLayout`**／**`SchedulingSidebar`**／**`ResponsiveFormSheet`** 與多首頁改引用。 |
| 2026-05-03 | 更新 CORE-05：**`extended`** 增 **`layoutFlexBetweenGap2`**／**`layoutFlexWrapBetweenGap2`**／**`layoutFlexWrapGap2`**／**`layoutFlexGap2`**、**`dashboardQuickLinksList`**；匯入／員工／活動／評估待辦、**`SchedulingReportBar`**、工作計劃、歷史工具列、服務表單列表、交更／接更、院友單筆表單、**`AiReportList`**／**`AiReportCenterHome`**、**`NotificationCenterHome`**、KPI 趨勢／過濾、**`DashboardHome`** 快速連結條列等改引用。 |
| 2026-05-03 | 更新 CORE-05：**`extended`** 增 **`textBodySubtleSm`**、**`layoutFlexItemsCenterGap2`**、**`layoutFlexWrapItemsCenterGap2*`**、**`layoutFlexWrapItemsEndGap3Mt4`**、**`layoutFlexGap2Mt2`**；**`schedulingSurfaces`** 增 **`schedulingKpiTrendFilterSummary`**／**`schedulingKpiTrendFilterGrid`**；**`AuditTrailPanel`**、院友／員工匯入與列表、週更表、工作節計劃篩選列、KPI 過濾列、AI／工作分析首頁、**`AssessmentCompletionForm`** 錯誤句改 **`formInlineError`**。 |
| 2026-05-03 | 更新 CORE-05：**`extended`** 增 **`tableMinWidthCollapse`**、**`tableBodyDivideSlate100`**、**`layoutGrid*`**／**`layoutFlexCol*`**／**`layoutSpaceY1*`**／**`layoutSpacerMt*`**／**`layoutMb4`**、**`textWeightMedium*`**、**`textMono`**、**`textXsMt1`**、**`textSubtleMl1Slate600`**、**`importRun*`**；**`schedulingSurfaces`** 增 **`sidebarNavItemsStack`**；評估／歷史表、接更／交更、匯入摘要、排班側欄與院友表、儀表週三卡、**`MyWorkPlanPanel`** 等改引用。 |
| 2026-05-03 | 更新 CORE-05：**`extended`** 增 **`textWeightSemibold`**、**`proseStrongInset`**、**`textSemiboldSlate800`**、**`textSemiboldAmber950`**、**`textMono11`**、**`layoutListItemPy2`**；**`WorkPlanSopStepper`**／**`SchedulingWorkflowStepper`**、**`SchedulingDashboard`**、歷史文件首頁、儀表流程、**`SchedulingConflictsPanel`**、**`SchedulingHistoryUndoPanel`** 改引用；**`src` 內 `className="…"` 裸字串已清零**（仍可有 **`className={\``** 或 **`cn()`** 等動態組字）。 |
| 2026-05-03 | 更新 CORE-05：**`schedulingSurfaces`** 增 **`schedulingStatCardTitleAmber900`**（**`SchedulingKpiCards`** 週三警示標題）；**`extended`** 以 **`layoutFlexWrapBetweenGap2Py2`** 取代 **`composerDraftRow`**（**`WorkPlanComposerPanel`** 草稿列）。 |
| 2026-05-03 | 更新 **`docs/feature-list.md`**：**CORE-05**（**`uiTokens`**）狀態改為 **`已完成`**（現況：`src` 內 TSX 樣式收斂與裸字串／條件字面量清理達標；後續新畫面為維護性延續）。 |
| 2026-05-03 | 更新 Seq 3／CI：**`npm run build:demo`**（建置時清空 **`VITE_SUPABASE_*`**）、**`npm run ci`**／**`test:e2e:smoke`** 與 **`.github/workflows/ci.yml`** 對齊；**`.env.example`**、**`go-live-checklist.md`** §1.1、**`feature-list.md`** §8 補本機與 demo bundle 一致之說明。 |
| 2026-05-03 | 新增 **`docs/go-live-checklist.md`** §8：**RES-06** 審計正式庫抽測（儀表摘要、`AuditTrailPanel`、`audit_events` SQL、RLS）；**`feature-list.md`** RES-06 備註與 §8「建議後續補強」第 2 點交叉引用 go-live §8。 |
| 2026-05-03 | 校正 Seq 3 摘要：本機／CI 與 **`build:demo`**、**`PW_PREVIEW_ONLY`** 一致敘述；Seq 12 驗收提示鏈結 **go-live** §8；**`playwright.config.ts`** 註解改 **`npm run build:demo`**（取代過時「先 build」）。 |
| 2026-05-03 | 日誌 **`2026-05-01`** Seq 3 列：將「demo `build`」改為註明 **2026-05-03** 起 **`npm run build:demo`**；**`go-live-checklist.md`** §7 技術確認項鏈結審計 **§8**；Seq 1 驗收提示＋**`rbac-seq1-verification-checklist.md`** 前置條件鏈結 **go-live** §8（審計 RLS）。 |
| 2026-05-03 | 更新 Seq 37：**`pdf03-cursorrules-alignment.md`** §3 PR 檢核表補 **`.env.example`**、**`build:demo`**／**`npm run ci`** 與 **`playwright.auth`** 例外；主表 Seq 37「與現況對照」同步。 |
| 2026-05-03 | **`supabase-deploy-runbook.md`** 新增 §6（前端 **`npm run ci`**／**`build:demo`**、可選 **`test:e2e:auth`**、鏈結 **go-live** §8）；§7 為常見問題；**`feature-list.md`** §8 CI 項補 **pdf03** §3；**`go-live-checklist.md`** §5 回復路徑改 **`docs/`** 前綴。 |
| 2026-05-03 | **`README.md`** 文件表增 **`docs/supabase-deploy-runbook.md`**；**`feature-list.md`** 頁尾產生說明納入 runbook §6。 |
