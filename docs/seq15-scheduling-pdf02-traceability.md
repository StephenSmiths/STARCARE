# Seq 15：智能排班（PDF 02【3】）逐步對照骨架

> **對照**：母本 **`docs/pdf/02-STARCARE-智能院舍照護管理系統.pdf`** **【3】**；條文整理 **`docs/business-logic.md`**（§3 排班流程、§4 雙軌）；序號總表 **`docs/pdf-sequenced-gap-checklist.md`** Seq **15**；P0 **`docs/pdf-alignment-p0-backlog.md`**（Seq 15 兩列：逐步 UI、週更表欄位客製）。  
> **上一序號**：**`docs/seq14-work-plan-pdf02-traceability.md`**。  
> **用途**：將 **02【3】** 每一步與畫面／引擎／儲存鏈結；**§6** 專列週更表 CSV 與母本欄位是否一致（客製需求入口）。

> **全案收尾與證據留痕**：**`README.md`**「專案收尾」（**`docs/business-logic.md`** §0 **全案收尾執行** 併述 **README** 表前互鏈指引（含各檔 **對照**／**全案收尾母索引**）；**`docs/project-completion-*.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log.md`** 及歸檔 **`docs/pdf-sequenced-gap-checklist-revision-log-2026-05-01a.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p2.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p3.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p4.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p5.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-seq29-2026-05-09b.md`**）；**`docs/project-completion-evidence-index-2026-05.md`**；**`docs/project-completion-kickoff-checklist-2026-05.md`**；Gate A 自動證據固定入口 **`docs/evidence/gate-a-latest.md`**（檔內 **Next Command** 與 **`preflight:strict`** 並列；**`npm run gatea:evidence:list`**／**`npm run gatea:evidence:refresh`**／**`npm run gatea:evidence:preflight:strict`**；檔尾 blockquote 四行：**`gateALatestMarkdownFooterLines`**（**`docs/gate-a-status-2026-05-06-commands-appendix.md#gate-a-appendix-latest-segment`** 下文 **`latest`** 段））；多數 **`gatea:evidence:*`** 終端 stdout 頁尾 **`scripts/gate-a-markdown-footer.mjs`**（**Export 契約**）。

---

## 1. 畫面與模組總覽

| 區塊 | 主要元件／Hook | 說明 |
|------|----------------|------|
| 五步＋週更表＋確認 | `SchedulingWorkflowSection`、`SchedulingWorkflowStepper`、`SchedulingWeeklyRosterPanel` | 進度模型 **`buildSchedulingWorkflowUiModel`**（`schedulingWorkflowStepService`）。 |
| 工具列與執行 | `SchedulingToolbar` | 「啟動智能排班」；阻擋理由見 `SchedulingDashboard` `runBlockedReason`。 |
| 統計與 KPI | `SchedulingStatsCards`、`SchedulingKpiCards`、`SchedulingKpiTrendPanel` | 本週合規、趨勢、本地快取同步狀態。 |
| 表格與指派 | `SchedulingResidentTable`、指派列表區塊 | 院友本週次數與本次指派預覽。 |
| 衝突與儲存 | `SchedulingConflictsPanel`、`SchedulingSavePanel` | 無衝突方可批量寫入（閉環敘述見 UI）。 |
| 報表 | `SchedulingReportBar` | 合規 CSV、週三提醒 CSV。 |
| 歷史撤銷 | `SchedulingHistoryUndoPanel` | 批次軟刪（**01 §5**）。 |
| 審計 | `AuditTrailPanel`（`useScheduling` 同源審計） | 與 **Seq 12** 合併策略一致。 |
| 資料載入與執行 | `useScheduling` | 載入院友／時段、`runScheduling`、`saveScheduleAssignments` 等。 |

---

## 2. 五步（UI 文案）與程式狀態

| 步驟 | `SchedulingWorkflowStepper` 標籤 | 母本定位（待填） | 程式訊號（摘要） | 驗收證據 |
|------|-----------------------------------|------------------|------------------|----------|
| 1 | 導入週更表 | 02【3】＿＿頁 | `sessionCount > 0`（時段載入後） | 待簽核 |
| 2 | 確認 | 02【3】＿＿頁 | `rosterConfirmed === true`（勾選框） | 待簽核 |
| 3 | 智能排班 | 02【3】＿＿頁 | `assignmentCount > 0` | 待簽核；與 **Pass 1–3** 母本對照見 **Seq 4～7** |
| 4 | 預覽 | 02【3】＿＿頁 | `conflictCount === 0` | 待簽核 |
| 5 | 確認採用 | 02【3】＿＿頁 | `saveSuccess`（儲存成功） | 待簽核 |

---

## 3. 引擎與資料閉環（錨點）

| 能力 | 程式錨點 | 備註 |
|------|----------|------|
| 3-Pass 與約束 | `schedulingService`（`src/services/schedulingService.ts` 等） | 與 **01** 條文對表見 **Seq 4～6** 專檔／測試 |
| 雙軌隔離 | `filterToSubsidizedRehabServiceOnly` 等（排班載入鏈） | **Seq 4** |
| 儲存與審計 | `saveScheduleAssignments`（`useScheduling`） | 須與 **`scheduling_history`**／審計規格對表 |

---

## 4. 自動化測試錨點

| 測試／E2E | 涵蓋範圍 |
|-----------|----------|
| `src/services/schedulingService*.test.ts`、`src/features/scheduling/services/schedulingWorkflowStepService.test.ts` | 排班規則與五步 UI 訊號（**`buildSchedulingWorkflowUiModel`** 含 **step5Done**／儲存成功） |
| `src/services/schedulingConflictLabels.test.ts` | **`schedulingConflictTypeLabel`**（全 **`ConflictType`**）／**`formatSchedulingConflictLine`**（與 **`SchedulingConflictsPanel`** 一致） |
| `src/services/schedulingTargets.test.ts` | **`getWeeklyTargetByFundingType`**／**`hasUnmetTarget`**／**`buildTopUpQueue`**（PDF 01 §3.2；補位排序與已達標略過） |
| `src/repositories/schedulingSessionRepository.test.ts` | **`InMemorySchedulingSessionRepository`** 淺拷貝；**`createSchedulingSessionRepository`**（無憑證→**InMemory**／有憑證→**Edge**）；**`EdgeSchedulingSessionRepository.listSessions`**（成功／**HTTP** 錯／**請先登入**／連線包裝錯；**`fetch`**／**`buildEdgeInvokeHeaders`** mock） |
| `src/features/scheduling/hooks/schedulingHookHelpers.test.ts` | **`mapRulesToConstraints`**／**`buildEngineConstraintsFromRulesAndUi`**（DB **`SchedulingRules`** 與本機 **SC 僅治療師** OR；PDF 02【16】）；**`cloneResidents`**／**`cloneSessions`** |
| `src/features/scheduling/hooks/schedulingKpiHistoryFilter.test.ts` | **`EMPTY_SCHEDULING_KPI_HISTORY_FILTER`**／**`toSchedulingKpiHistoryQuery`**（空字串→**`undefined`**、**`limit`**＝**`SCHEDULING_KPI_HISTORY_LIMIT`**） |
| `src/features/scheduling/utils/weeklyRosterStaffLookup.test.ts` | **`buildWeeklyRosterStaffProfileLookup`**（姓名＋Tab＋職位→**`staff_profiles.id`**；略過 **TeamLead**；歧義鍵） |
| `src/features/scheduling/utils/weeklyRosterImportParseText.test.ts` | **`normalizeWeeklyRosterHm`**／**`parseWeeklyRosterSheetText`**／**`weeklyRosterDraftsToImportRows`**（週更表 CSV→草稿→**`ActivitySessionImportRow`**） |
| `src/features/scheduling/utils/runWeeklyRosterActivityImportDryRun.test.ts` | **`runWeeklyRosterActivityImportDryRun`**（**`parse_errors`**（表頭／歧義／主檔對照）／**`empty_rows`**／**`throw`**、**`validated`** 委派 **`runActivitySessionRowsDryRun`**；**`importOriginal`** partial mock **`parseWeeklyRosterSheetText`**） |
| `src/features/activitySessions/utils/activitySessionImportDryRunFlow.test.ts` | **`runActivitySessionRowsDryRun`**／**`runActivitySessionCsvDryRun`**／**`commitActivitySessionCsvPreview`**（預檢鏈；提交失敗 **Error**／非 **Error** **`userMessage`**） |
| `src/features/scheduling/utils/residentTableFundingPresentation.test.ts` | **`residentFundingLabel`**／**`residentFundingBadgeClass`**（院友表資助類別與 **`uiTokens`** 徽章樣式） |
| `src/features/scheduling/utils/mapResidentToSchedulingResident.test.ts` | **`mapResidentToSchedulingResident`**（主檔→**`SchedulingResident`**；本週次數與指派日期歸零） |
| `src/features/scheduling/utils/mapActiveResidentsToSubsidizedSchedulingResidents.test.ts` | **`mapActiveResidentsToSubsidizedSchedulingResidents`**（**PDF 01** 資助復康合規族群過濾；**`Both`**／純 **`Dementia_Service`**） |
| `src/features/scheduling/repositories/schedulingRepository.test.ts` | **`InMemorySchedulingRepository.listSessions`**（示範 **`Subsidized_Rehab`**／**`Dementia_Service`** 列） |
| `src/features/scheduling/services/schedulingService.test.ts` | **`SchedulingService`**（**`getSessions`** → **`listSessions`**；與 **`src/services/schedulingService.ts`** 區分之 features 薄封裝） |
| `src/features/scheduling/utils/buildSchedulingWorkspaceReturn.test.ts` | **`buildSchedulingWorkspaceReturn`**（**`canSave`**＝有指派且無衝突；儀表回傳組字） |
| `src/features/scheduling/constants/weeklyRosterImportConstants.test.ts` | **`WEEKLY_ROSTER_REQUIRED_HEADERS`**／**`WEEKLY_ROSTER_SERVICE_TYPE_TO_ACTIVITY_ID`**／**`WEEKLY_ROSTER_DEFAULT_CAPACITY`**（週更表欄位與種子活動 id 契約） |
| `src/features/scheduling/constants/schedulingSessionRepositorySingleton.test.ts` | **`schedulingSessionRepository`**（**`listSessions`**；**`getSupabaseBrowserCredentials`** mock **null** → **InMemory** 預設列） |
| `src/features/scheduling/config/schedulingNavConfig.test.ts` | **`SCHEDULING_NAV_GROUPS`**（**`#scheduling`**／**`view:scheduling`**；側欄項目結構） |
| `src/features/scheduling/services/schedulingDataLoadMessage.test.ts` | **`SCHEDULING_DATA_LOAD_ERROR_MESSAGE`**（載入失敗固定句） |
| `src/features/scheduling/hooks/schedulingWorkspaceDefaults.test.ts` | **`SCHEDULING_WORKSPACE_FACILITY_ID`**（與 **`STARCARE_DEFAULT_FACILITY_ID`** 一致） |
| `src/features/scheduling/services/schedulingCsvExportAuditService.test.ts` | **`recordWeeklyComplianceExportAudit`**／**`recordComplianceAlertsExportAudit`**（CSV 匯出審計 payload；**`recordAuditTrailThenHydrate`**） |
| `src/features/scheduling/hooks/schedulingPageReloadExecutor.test.ts` | **`executeSchedulingPageReload`**（成功／失敗／**`clearPreview`** 與 **`runSchedulingReloadPageData`** 閉環） |
| `src/features/scheduling/hooks/useSchedulingDerived.test.tsx` | **`useSchedulingDerived`**（**`stats`**／**`tableRows`**／**`complianceAlerts`** 與週目標；**`happy-dom`**） |
| `src/features/scheduling/components/SchedulingWorkflowSection.test.tsx` | **`SchedulingWorkflowSection`**（確認勾選、無時段 **disabled**、週更表 **`onRosterImportCommitted`**；**`happy-dom`**） |
| `src/features/scheduling/components/SchedulingWorkflowStepper.test.tsx` | **`SchedulingWorkflowStepper`**（時段徽章、五步 **hint**、**`aria-label`**、完成勾前綴；**`happy-dom`**） |
| `src/features/scheduling/components/SchedulingDataAlerts.test.tsx` | **`SchedulingDataAlerts`**（職類載入降級、合規警示、載入／儲存錯誤與成功橫幅；**`happy-dom`**） |
| `src/features/scheduling/components/SchedulingToolbar.test.tsx` | **`SchedulingToolbar`**（啟動排班、`disableRun`／**`title`**、**`isRunning`**；**`happy-dom`**） |
| `src/features/scheduling/components/SchedulingSavePanel.test.tsx` | **`SchedulingSavePanel`**（一鍵儲存、衝突時勿儲存說明、**`isSaving`**；**`happy-dom`**） |
| `src/features/scheduling/components/SchedulingReportBar.test.tsx` | **`SchedulingReportBar`**（合規 CSV／週三提醒 CSV、**`disabled`**／**`alertDisabled`**；**`happy-dom`**） |
| `src/features/scheduling/components/SchedulingStatsCards.test.tsx` | **`SchedulingStatsCards`**（總院友／已達標／待補齊三卡；**`happy-dom`**） |
| `src/features/scheduling/components/SchedulingConflictsPanel.test.tsx` | **`SchedulingConflictsPanel`**（無衝突提示、衝突列 **`formatSchedulingConflictLine`**；**`happy-dom`**） |
| `src/features/scheduling/components/SchedulingKpiCards.test.tsx` | **`SchedulingKpiCards`**（KPI 四卡格式化、週三警示摘要；**`happy-dom`**） |
| `src/features/scheduling/components/SchedulingHistoryUndoPanel.test.tsx` | **`SchedulingHistoryUndoPanel`**（**Staff** 無按鈕、**batch id**／**`isUndoing`**；**`happy-dom`**） |
| `src/features/scheduling/components/SchedulingAssignmentsList.test.tsx` | **`SchedulingAssignmentsList`**（空狀態引導、指派列 **Pass**／**sessionId**；**`happy-dom`**） |
| `src/features/scheduling/components/SchedulingKpiTrendFilterBar.test.tsx` | **`SchedulingKpiTrendFilterBar`**（過濾摘要、**`onApplyFilter`**／**`onResetFilter`**、**`isApplyingFilter`**；**`happy-dom`**） |
| `src/features/scheduling/components/SchedulingKpiTrendHistoryTable.test.tsx` | **`SchedulingKpiTrendHistoryTable`**（表頭、單列 Δ「—」、雙列數值 Δ；**`happy-dom`**） |
| `src/features/scheduling/utils/schedulingKpiTrendFormat.test.ts` | **`formatKpiTrendRanAtLocal`**／**`formatDeltaPercentPoints`**／**`formatDeltaDecimal`**（KPI 趨勢時間與 Δ 符號；零變化／無前值） |
| `src/features/scheduling/components/SchedulingSidebar.test.tsx` | **`SchedulingSidebar`**（導覽 **`onRequestClose`**、**`useAuth`** 登出；**`happy-dom`**） |
| `src/features/scheduling/components/SchedulingKpiTrendPanel.test.tsx` | **`SchedulingKpiTrendPanel`**（工具列、同步訊息、**`ListSectionPanel`** 展開後空／有資料；**`happy-dom`**） |
| `src/features/scheduling/components/SchedulingAppLayout.test.tsx` | **`SchedulingAppLayout`**（選單／backdrop／側欄 **`onRequestClose`**／**`hashchange`**；**`happy-dom`**） |
| `src/features/scheduling/components/SchedulingResidentTablePager.test.tsx` | **`SchedulingResidentTablePager`**（上一頁／下一頁 **disabled** 與頁碼更新；**`happy-dom`**） |
| `src/features/scheduling/components/SchedulingResidentTableToolbar.test.tsx` | **`SchedulingResidentTableToolbar`**（關鍵字、狀態篩選、**`pageSize`** 與 **`resetPage`**；**`happy-dom`**） |
| `src/features/scheduling/components/SchedulingResidentTableBody.test.tsx` | **`SchedulingResidentTableBody`**（空列、待補齊／已達標、資助標籤；**`happy-dom`**） |
| `src/features/scheduling/components/SchedulingResidentTable.test.tsx` | **`SchedulingResidentTable`**（**`useSchedulingResidentTable`** 與關鍵字篩選閉環；**`happy-dom`**） |
| `src/features/scheduling/components/SchedulingWeeklyRosterPanel.test.tsx` | **`SchedulingWeeklyRosterPanel`**（週更表預檢 UI、**`useActivitySessionImportDryRun`** mock、選檔→**`validateWeeklyRosterSheetText`**；**`happy-dom`**） |
| `src/features/scheduling/components/SchedulingDashboard.test.tsx` | **`SchedulingDashboard`**（**`useSchedulingDashboardViewModel`**／**`useAuth`**／週更 dry-run mock；主區塊與 **loadError**／**`runBlockedReason`**／週更確認 **`setRosterConfirmed`**；**`happy-dom`**） |
| `src/features/scheduling/index.test.ts` | **`features/scheduling/index`**（**`SchedulingDashboard`**／**`SchedulingAppLayout`** 與 components 直引同一參照） |
| `src/app/AppMainViews.test.tsx` | **`AppMainViews`**（**`effectiveView`**＝**`scheduling`**／**`view:scheduling`**、**`Suspense`**／**`lazy`**；**`happy-dom`**） |
| `src/features/scheduling/hooks/useSchedulingCsvExports.test.tsx` | **`useSchedulingCsvExports`**（週合規／週三警示 CSV 與審計呼叫；**`happy-dom`**） |
| `src/features/scheduling/hooks/useSchedulingRunDryRun.test.tsx` | **`useSchedulingRunDryRun`**（乾跑成功／empty／error／連點鎖；**`happy-dom`**） |
| `src/features/scheduling/hooks/useSchedulingSaveAssignments.test.tsx` | **`useSchedulingSaveAssignments`**（落庫成功／錯誤訊息／連點鎖；**`happy-dom`**） |
| `src/features/scheduling/hooks/useSchedulingBatchUndo.test.tsx` | **`useSchedulingBatchUndo`**（本機批次 id、撤銷呼叫 **`softDeleteSchedulingHistoryBatch`**；**`happy-dom`**） |
| `src/features/scheduling/hooks/useSchedulingFacilityReload.test.tsx` | **`useSchedulingFacilityReload`**（掛載重載、**`clearPreview`** 轉發、**`useInvalidateOnSystemSettingsExternalChange`**；**`happy-dom`**） |
| `src/features/scheduling/hooks/useSchedulingResidentTable.test.tsx` | **`useSchedulingResidentTable`**（關鍵字／狀態篩選／**`safePage`**／**`resetPage`**；**`happy-dom`**） |
| `src/features/scheduling/hooks/useSchedulingRunPreviewState.test.tsx` | **`useSchedulingRunPreviewState`**（**`clearPreviewState`** 清空試算與儲存旗標；**`happy-dom`**） |
| `src/features/scheduling/hooks/useSchedulingKpiHistoryFilterActions.test.tsx` | **`useSchedulingKpiHistoryFilterActions`**（**`applyHistoryFilter`**／**`resetHistoryFilter`**、**`hydrateFromServer`**；**`happy-dom`**） |
| `src/features/scheduling/hooks/useSchedulingDashboardViewModel.test.tsx` | **`useSchedulingDashboardViewModel`**（**`runBlockedReason`** 步驟①②與院友 gate、**`sessionCount`** 歸零重設勾選；**`happy-dom`**） |
| `src/features/scheduling/hooks/useSchedulingRunAndSave.test.tsx` | **`useSchedulingRunAndSave`**（委派 **`useSchedulingRunDryRun`**／**`useSchedulingSaveAssignments`** 參數與回傳；**`happy-dom`**） |
| `src/features/scheduling/hooks/useSchedulingKpiHistory.test.tsx` | **`useSchedulingKpiHistory`**（**`loadLocal`** 初始化與子 hook 註冊；effects／mutations mock） |
| `src/features/scheduling/hooks/useSchedulingKpiHistoryEffects.test.tsx` | **`usePersistSchedulingKpiRunHistory`**／**`useAutoClearKpiSyncNotice`**／**`useSchedulingKpiHistoryMountHydrate`**（KPI 歷史持久化、同步提示計時、掛載 hydrate、**unmount 後不寫 state**；**`happy-dom`**） |
| `src/features/scheduling/hooks/useSchedulingKpiHistoryMutations.test.tsx` | **`appendKpiRunRecord`**／**`exportKpiTrendCsv`**／**`clearKpiTrendHistory`**／**`retryKpiSync`**（KPI 歷史同步／匯出／重試；**`happy-dom`**） |
| `src/features/scheduling/hooks/useSchedulingWorkspace.test.tsx` | **`useSchedulingWorkspace`**（預設院舍與子 hook 參數組裝、**`buildSchedulingWorkspaceReturn`** 透傳；**`happy-dom`**） |
| `src/features/scheduling/hooks/useScheduling.test.ts` | **`useScheduling`** 為 **`useSchedulingWorkspace`** 之別名（同一函式參照；排班頁 facade 契約） |
| `src/features/scheduling/services/runSubsidizedRehabSchedulingOrchestration.test.ts` | **`runSubsidizedRehabSchedulingOrchestration`**（**ok**／**empty**／**error**；引擎與資料載入 mock） |
| `src/features/scheduling/services/schedulingSessionWindowFilterService.test.ts` | **`filterSchedulingSessionsForSubsidizedEngine`**／**`filterToSubsidizedRehabServiceOnly`**／**`filterToDementiaServiceOnly`**（視窗無效、無排除區間、**`timeSlot`** 無法解析；PDF 02【16】） |
| `e2e/smoke.spec.ts`（`#scheduling`） | 模組與審計標題可見 |
| `e2e/auth-login.spec.ts`（若含 `#scheduling`） | 登入後排班頁 |

---

## 5. 維護閉環

- 變更 **`SchedulingDashboard`**／**`features/scheduling/index.ts`**（公開匯出）／**`SchedulingWorkflowSection`**／**`SchedulingWorkflowStepper`**／**`SchedulingDataAlerts`**／**`SchedulingToolbar`**／**`SchedulingSavePanel`**／**`SchedulingReportBar`**／**`SchedulingStatsCards`**／**`SchedulingConflictsPanel`**／**`SchedulingKpiCards`**／**`SchedulingHistoryUndoPanel`**／**`SchedulingAssignmentsList`**／**`SchedulingKpiTrendFilterBar`**／**`SchedulingKpiTrendHistoryTable`**／**`SchedulingSidebar`**／**`SchedulingKpiTrendPanel`**／**`schedulingKpiTrendFormat.ts`**／**`SchedulingAppLayout`**／**`SchedulingResidentTablePager`**／**`SchedulingResidentTableToolbar`**／**`SchedulingResidentTableBody`**／**`SchedulingResidentTable`**／**`SchedulingWeeklyRosterPanel`** 文案、**`AppMainViews.tsx`**（**`view:scheduling`** **lazy**）、**`buildSchedulingWorkflowUiModel`** 條件、**`useScheduling`**／**`useSchedulingWorkspace`**／**`useSchedulingDashboardViewModel`**／**`useSchedulingDerived`**／**`useSchedulingCsvExports`**／**`useSchedulingRunDryRun`**／**`useSchedulingRunAndSave`**／**`useSchedulingRunPreviewState`**／**`useSchedulingKpiHistory`**／**`useSchedulingKpiHistoryEffects`**／**`useSchedulingKpiHistoryMutations`**／**`useSchedulingKpiHistoryFilterActions`**／**`useSchedulingSaveAssignments`**／**`useSchedulingBatchUndo`**／**`useSchedulingFacilityReload`**／**`useSchedulingResidentTable`** 儲存條件、**`executeSchedulingPageReload`**（**`schedulingPageReloadExecutor.ts`**）、**`runSubsidizedRehabSchedulingOrchestration.ts`**／**`schedulingTargets.ts`**／**`schedulingSessionWindowFilterService.ts`**、**`schedulingConflictLabels.ts`**、**`schedulingSessionRepository.ts`**、**`buildWeeklyRosterStaffProfileLookup`**、**`parseWeeklyRosterSheetText`**／**`weeklyRosterDraftsToImportRows`**（**`weeklyRosterImportParseText.ts`**／**`weeklyRosterStaffLookup.ts`**／**`runWeeklyRosterActivityImportDryRun.ts`**／**`activitySessionImportDryRunFlow.ts`**）、**`mapActiveResidentsToSubsidizedSchedulingResidents.ts`**、**`residentTableFundingPresentation.ts`**、**`mapResidentToSchedulingResident.ts`**、**`schedulingRepository.ts`**、**`features/scheduling/services/schedulingService.ts`**（薄封裝 **`getSessions`**）、**`buildSchedulingWorkspaceReturn.ts`**、**`schedulingCsvExportAuditService.ts`** 或 **`buildEngineConstraintsFromRulesAndUi`**／**`mapRulesToConstraints`**（**`schedulingHookHelpers.ts`**）時：同步本檔、**`pdf-sequenced-gap-checklist.md`** Seq 15、**`pdf-sequenced-gap-checklist-revision-log.md`**（**`docs/pdf03-cursorrules-alignment.md`** §4）。
- 變更 **`weeklyRosterImportConstants.ts`**（週更表欄位字面／活動主檔對照）、**`schedulingSessionRepositorySingleton.ts`**（可排時段全域 **Repository**）、**`schedulingNavConfig.ts`**（側欄 **#scheduling** 與 **`view:scheduling`**）、**`schedulingDataLoadMessage.ts`**、**`schedulingWorkspaceDefaults.ts`** 時：同步本檔、**`pdf-sequenced-gap-checklist.md`** Seq 15、**`pdf-sequenced-gap-checklist-revision-log.md`**（**`docs/pdf03-cursorrules-alignment.md`** §4）。
- **下一序號**：**Seq 16** **`docs/seq16-work-session-plans-pdf02-traceability.md`**（工作計劃【4】）→ **Seq 17** **`docs/seq17-service-forms-pdf02-traceability.md`**（填寫表單【5】）→ **Seq 18** **`docs/seq18-shift-start-handover-pdf02-traceability.md`**（開工接更【5b】）→ **Seq 19** **`docs/seq19-end-shift-handover-pdf02-traceability.md`**（收工交更【6】）→ **Seq 20** **`docs/seq20-work-analysis-review-pdf02-traceability.md`**（工作分析【7】）→ **Seq 21** **`docs/seq21-rehab-activity-tracking-pdf02-traceability.md`**（復康追蹤【8】）→ **Seq 22** **`docs/seq22-assessment-management-pdf02-traceability.md`**（評估管理【9】）→ **Seq 23** **`docs/seq23-historical-documents-pdf02-traceability.md`**（歷史文件【10】）→ **Seq 24** **`docs/seq24-ai-report-center-pdf02-traceability.md`**（AI 報告【11】）→ **Seq 25** **`docs/seq25-residents-management-pdf02-traceability.md`**（院友管理【12】）→ **Seq 26** **`docs/seq26-staff-management-pdf02-traceability.md`**（員工管理【13】）→ **Seq 27** **`docs/seq27-notification-center-pdf02-traceability.md`**（通知中心【14】）→ **Seq 28** **`docs/seq28-user-manual-pdf02-traceability.md`**（用戶手冊【15】）→ **Seq 29** **`docs/seq29-system-settings-pdf02-traceability.md`**（系統設定【16】）。

---

## 6. 週更表 CSV 欄位（P0：欄位與母本客製）

| CSV 欄位（現行程式／UI 說明） | 母本欄位或截圖編號（待填） | 與母本一致？ |
|------------------------------|---------------------------|--------------|
| `id` | ＿＿ | 待簽核 |
| `facilityId` | ＿＿ | 待簽核 |
| `activityId` | ＿＿ | 待簽核 |
| `staffProfileId` | ＿＿ | 待簽核 |
| `sessionDate` | ＿＿ | 待簽核 |
| `timeSlot` | ＿＿ | 待簽核 |
| `capacity` | ＿＿ | 待簽核 |

實作入口：**`SchedulingWeeklyRosterPanel`**（`useActivitySessionImportDryRun`）；與「活動時段匯入」共用預檢／提交鏈（見 **`docs/pdf-sequenced-gap-checklist.md`** Seq 15 主表敘述）。

---

| 日期 | 說明 |
|------|------|
| 2026-05-04 | 初版：Seq 15 **逐步／欄位對照骨架**；與 Seq 14 文件鏈互鏈。 |
| 2026-05-04 | 維護閉環增 **Seq 16** 鏈結：**`docs/seq16-work-session-plans-pdf02-traceability.md`**。 |
| 2026-05-04 | §5「下一序號」擴至 **Seq 17** **`docs/seq17-service-forms-pdf02-traceability.md`**。 |
| 2026-05-04 | §5「下一序號」擴至 **Seq 18** **`docs/seq18-shift-start-handover-pdf02-traceability.md`**。 |
| 2026-05-04 | §5「下一序號」擴至 **Seq 19** **`docs/seq19-end-shift-handover-pdf02-traceability.md`**。 |
| 2026-05-04 | §5「下一序號」擴至 **Seq 20** **`docs/seq20-work-analysis-review-pdf02-traceability.md`**。 |
| 2026-05-04 | §5「下一序號」擴至 **Seq 21** **`docs/seq21-rehab-activity-tracking-pdf02-traceability.md`**。 |
| 2026-05-04 | §5「下一序號」擴至 **Seq 22** **`docs/seq22-assessment-management-pdf02-traceability.md`**。 |
| 2026-05-04 | §5「下一序號」擴至 **Seq 23** **`docs/seq23-historical-documents-pdf02-traceability.md`**。 |
| 2026-05-04 | §5「下一序號」擴至 **Seq 24** **`docs/seq24-ai-report-center-pdf02-traceability.md`**。 |
| 2026-05-04 | §5「下一序號」擴至 **Seq 25** **`docs/seq25-residents-management-pdf02-traceability.md`**。 |
| 2026-05-04 | §5「下一序號」擴至 **Seq 26** **`docs/seq26-staff-management-pdf02-traceability.md`**。 |
| 2026-05-04 | §5「下一序號」擴至 **Seq 27** **`docs/seq27-notification-center-pdf02-traceability.md`**。 |
| 2026-05-04 | §5「下一序號」擴至 **Seq 28** **`docs/seq28-user-manual-pdf02-traceability.md`**。 |
| 2026-05-04 | §5「下一序號」擴至 **Seq 29** **`docs/seq29-system-settings-pdf02-traceability.md`**。 |
| 2026-05-09 | §4：補 **`schedulingHookHelpers.test.ts`**（**`buildEngineConstraintsFromRulesAndUi`**／**`mapRulesToConstraints`**；**SC 僅治療師** 與雲端規則 OR；**`cloneResidents`**／**`cloneSessions`**）；**`schedulingKpiHistoryFilter.test.ts`**（**`toSchedulingKpiHistoryQuery`**）。 |
| 2026-05-09 | §4／§6：補 **`weeklyRosterStaffLookup.test.ts`**（**`buildWeeklyRosterStaffProfileLookup`**；週更表姓名＋職位對主檔）。 |
| 2026-05-09 | §4／§6：擴 **`weeklyRosterImportParseText.test.ts`**（**`weeklyRosterDraftsToImportRows`** 與主檔 Map 合併）。 |
| 2026-05-09 | §4／§5：補 **`residentTableFundingPresentation.test.ts`**、**`mapResidentToSchedulingResident.test.ts`**（院友表資助呈現與主檔→引擎映射）。 |
| 2026-05-09 | §4：擴 **`mapActiveResidentsToSubsidizedSchedulingResidents.test.ts`**；補 **`buildSchedulingWorkspaceReturn.test.ts`**（**`canSave`** 與儀表回傳透傳）。 |
| 2026-05-09 | §4／§5：補週更表常數、側欄導覽、載入錯句、工作區預設院舍之 Vitest（**`weeklyRosterImportConstants`**／**`schedulingNavConfig`**／**`schedulingDataLoadMessage`**／**`schedulingWorkspaceDefaults`**）。 |
| 2026-05-09 | §4：補 **`schedulingCsvExportAuditService.test.ts`**、**`schedulingPageReloadExecutor.test.ts`**（CSV 匯出審計與頁面重載閉環）。 |
| 2026-05-09 | §4：補 **`useSchedulingDerived.test.tsx`**、**`useSchedulingCsvExports.test.tsx`**（衍生統計／表格與 CSV 匯出 hook；**`happy-dom`**）。 |
| 2026-05-09 | §4：補 **`useSchedulingRunDryRun.test.tsx`**、**`runSubsidizedRehabSchedulingOrchestration.test.ts`**（乾跑 hook 與編排服務）。 |
| 2026-05-09 | §4：補 **`useSchedulingSaveAssignments.test.tsx`**、**`useSchedulingBatchUndo.test.tsx`**（落庫與批次撤銷 hook）。 |
| 2026-05-09 | §4：補 **`useSchedulingFacilityReload.test.tsx`**、**`useSchedulingResidentTable.test.tsx`**（院舍重載與院友表篩選／分頁）。 |
| 2026-05-09 | §4：補 **`useSchedulingRunPreviewState.test.tsx`**、**`useSchedulingKpiHistoryFilterActions.test.tsx`**、**`useSchedulingDashboardViewModel.test.tsx`**（預覽清空、KPI 歷史 hydrate、儀表 gate）。 |
| 2026-05-09 | §4：補 **`useSchedulingRunAndSave.test.tsx`**、**`useSchedulingKpiHistory.test.tsx`**（乾跑＋儲存委派、KPI 歷史組裝）。 |
| 2026-05-09 | §4／§5：補 **`useSchedulingKpiHistoryEffects.test.tsx`**、**`useSchedulingKpiHistoryMutations.test.tsx`**（KPI 歷史持久化／hydrate／同步提示與 append／匯出／清除／重試）。 |
| 2026-05-09 | §4：補 **`useSchedulingWorkspace.test.tsx`**（工作區組裝層與 **`SCHEDULING_WORKSPACE_FACILITY_ID`** 傳遞）。 |
| 2026-05-09 | §4：擴 **`useSchedulingKpiHistoryEffects.test.tsx`**（**`useSchedulingKpiHistoryMountHydrate`**：成功／失敗 **Promise 落點前 unmount** 不觸發 setter）。 |
| 2026-05-09 | §4：補 **`useScheduling.test.ts`**（**`useScheduling`** 與 **`useSchedulingWorkspace`** 同一參照）。 |
| 2026-05-09 | §4：補 **`SchedulingWorkflowSection.test.tsx`**；擴 **`schedulingWorkflowStepService.test.ts`**（**`step5Done`**／**`saveSuccess`**）。 |
| 2026-05-09 | §4：補 **`SchedulingWorkflowStepper.test.tsx`**（五步進度列呈現與 **`aria-label`**）。 |
| 2026-05-09 | §4／§5：補 **`SchedulingDataAlerts.test.tsx`**、**`SchedulingToolbar.test.tsx`**（警示橫幅與啟動排班按鈕）。 |
| 2026-05-09 | §4／§5：補 **`SchedulingSavePanel.test.tsx`**、**`SchedulingReportBar.test.tsx`**（一鍵儲存與報表 CSV 列）。 |
| 2026-05-09 | §4／§5：補 **`SchedulingStatsCards.test.tsx`**、**`SchedulingConflictsPanel.test.tsx`**（統計卡與衝突列）。 |
| 2026-05-09 | §4／§5：補 **`SchedulingKpiCards.test.tsx`**、**`SchedulingHistoryUndoPanel.test.tsx`**（KPI 卡與批次軟刪）。 |
| 2026-05-09 | §4／§5：補 **`SchedulingAssignmentsList.test.tsx`**、**`SchedulingKpiTrendFilterBar.test.tsx`**（指派列與 KPI 過濾列）。 |
| 2026-05-09 | §4／§5：補 **`SchedulingKpiTrendHistoryTable.test.tsx`**、**`SchedulingSidebar.test.tsx`**（KPI 歷史表與側欄）。 |
| 2026-05-09 | §4／§5：補 **`SchedulingKpiTrendPanel.test.tsx`**、**`SchedulingAppLayout.test.tsx`**（KPI 趨勢面板與主佈局）。 |
| 2026-05-09 | §4／§5：補 **`SchedulingResidentTablePager.test.tsx`**、**`SchedulingResidentTableToolbar.test.tsx`**（院友表分頁與工具列）。 |
| 2026-05-09 | §4／§5：補 **`SchedulingResidentTableBody.test.tsx`**、**`SchedulingResidentTable.test.tsx`**（院友表表身與整表篩選）。 |
| 2026-05-09 | §4／§5：補 **`SchedulingWeeklyRosterPanel.test.tsx`**（週更表匯入與預檢／提交 UI）。 |
| 2026-05-09 | §4／§5：補 **`SchedulingDashboard.test.tsx`**（儀表板主內容與 vm 透傳煙霧）。 |
| 2026-05-09 | §4：補 **`index.test.ts`**；擴 **`SchedulingDashboard.test.tsx`**（週更確認勾選 **`setRosterConfirmed`**）。 |
| 2026-05-09 | §4／§5：補 **`runWeeklyRosterActivityImportDryRun.test.ts`**（週更活動預檢：**`parse_errors`**／**`empty_rows`**／**`throw`**）。 |
| 2026-05-09 | §4／§5：補 **`AppMainViews.test.tsx`**（主視圖 **scheduling**／**`view:scheduling`**、**`Suspense`**／**`lazy`**）。 |
| 2026-05-09 | §4：擴 **`runWeeklyRosterActivityImportDryRun.test.ts`**（主檔歧義、**`weeklyRosterDraftsToImportRows`** 錯誤、**`validated`** 委派；**`importOriginal`** partial mock）。 |
| 2026-05-09 | §4／§5：補 **`activitySessionImportDryRunFlow.test.ts`**（活動時段預檢／提交鏈；與週更預檢 **`runActivitySessionRowsDryRun`** 對齊）；§5 維護閉環補 **`activitySessionImportDryRunFlow.ts`**。 |
| 2026-05-09 | §4：擴 **`activitySessionImportDryRunFlow.test.ts`**（**`commitActivitySessionCsvPreview`**：**`Error`** 時 **`userMessage`** 透傳）。 |
| 2026-05-09 | §4：補 **`schedulingSessionWindowFilterService.test.ts`** 錨點列；擴測（視窗無效／無排除區間／**`timeSlot`** 無法解析）；§5 維護閉環補 **`schedulingSessionWindowFilterService.ts`**。 |
| 2026-05-09 | §4／§5：補 **`schedulingRepository.test.ts`**；擴 **`schedulingKpiTrendFormat.test.ts`**；§5 維護閉環補 **`schedulingRepository.ts`**／**`schedulingKpiTrendFormat.ts`**（KPI 趨勢列）。 |
| 2026-05-09 | §4／§5：補 **`schedulingService.test.ts`**（**`features/scheduling/services`** **`SchedulingService.getSessions`**）；§5 維護閉環補該路徑 **`schedulingService.ts`**。 |
| 2026-05-09 | §4／§5：補 **`schedulingSessionRepositorySingleton.test.ts`**（**`getSupabaseBrowserCredentials`** mock → **InMemory**）；§5 第二點補 **`schedulingSessionRepositorySingleton.ts`**。 |
| 2026-05-09 | §4：擴 **`schedulingConflictLabels.test.ts`**；補 **`schedulingSessionRepository.test.ts`**；§5 維護閉環補 **`schedulingConflictLabels.ts`**／**`schedulingSessionRepository.ts`**。 |
| 2026-05-09 | §4：擴 **`schedulingSessionRepository.test.ts`**（**`EdgeSchedulingSessionRepository`**）；補 **`schedulingTargets.test.ts`** 錨點；§5 維護閉環補 **`schedulingTargets.ts`**。 |
| 2026-05-09 | §4：擴 **`schedulingSessionRepository.test.ts`**（**`EdgeSchedulingSessionRepository.listSessions`**：**HTTP** 錯／**請先登入**／連線包裝錯）。 |
| 2026-05-09 | §4：擴 **`schedulingSessionRepository.test.ts`**（**`createSchedulingSessionRepository`**：有憑證→**Edge**）。 |
