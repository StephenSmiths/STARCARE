# `pdf-sequenced-gap-checklist` 修訂／日誌（重出）

> **對照**：主檔 **`docs/pdf-sequenced-gap-checklist.md`**（Seq 1–38、**「運維與工程」**列與 §A–C 主表）；為遵守專案單檔 **≤200** 行，原主檔末尾修訂表移出至本檔。**2026-05-01** 同日最早一批列另見 **`docs/pdf-sequenced-gap-checklist-revision-log-2026-05-01a.md`**。新增修訂列請寫入下表；維護閉環見 **`docs/pdf03-cursorrules-alignment.md`** §4。

---

## 主檔修訂紀錄

| 日期 | 說明 |
|------|------|
| 註 | **2026-05-01** 同日早期多筆（Seq／模組初始化等）已歸檔於 **`docs/pdf-sequenced-gap-checklist-revision-log-2026-05-01a.md`**；以下續列同日後段與之後日期。 |
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
| 2026-05-03 | **`business-logic.md`** §0 增運維 Runbook 連結（§6 **`npm run ci`**）；**`pdf03-cursorrules-alignment.md`** §4 維護項補 runbook／README／清單日誌同步。 |
| 2026-05-03 | **`supabase-deploy-runbook.md`** §2／§3：改推 **`npm run ops:deploy:all`**（權威清單見 **`package.json`**）；驗收改 **`ops:verify`**／`functions list`，移除過時「7 支」；常見問題補 **`ops:deploy:all`**；**`client-delivery-remediation-plan.md`** §7.3 行 9 鏈結 **go-live**／runbook。 |
| 2026-05-03 | **`go-live-checklist.md`** §2 對齊 **`ops:deploy:all`**／**`ops:verify`** 與 runbook；**`phase5-day1-automation-runbook.md`**／**`phase5-final-delivery-package.md`** 收口改單一 **`ops:deploy:all`**（含 db push）。 |
| 2026-05-03 | **`phase5-day1-delivery-index.md`**：§4／§6 與 **`ops:deploy:all`**（含 db push）及 runbook §2 對齊。 |
| 2026-05-03 | **`feature-list.md`** §7：補 **`ops:deploy:all`**／runbook §2 說明；Edge 表增 **`staff-soft-delete`**、**`audit-trail-append`**／**`list`**；頁尾 runbook 註記 §2／§6；**`README.md`** 增後端部署要點。 |
| 2026-05-03 | **`package.json`** **`ops:deploy:all`**：補 **`service-forms-list`**／**`upsert`**／**`soft-delete`**（與 **`supabase/functions/`** 一致）；**`feature-list.md`** §7 改列 **`scheduling-kpi-history-upsert`**／**`clear`** 全名並註明新增 Edge 須同步腳本與本表。 |
| 2026-05-03 | **`supabase-deploy-runbook.md`** §2：補舊版 **`ops:deploy:all`** 須重跑以佈署 **service-forms-*** 之說明；**`pdf03-cursorrules-alignment.md`** §3／§4 增新 Edge 與 **`ops:deploy:all`** 同步項；主表 Seq 37「與現況對照」同步。 |
| 2026-05-03 | **`go-live-checklist.md`** §2：functions 項補 **service-forms-***、runbook §2 舊腳本補佈、**pdf03** §3；**§6** PAT 項鏈結憑證清單；**`security-token-rotation-checklist.md`** §D 補 **`ops:verify`**／**`ops:deploy:all`** 對照 runbook；**`README.md`** 文件表增憑證清單連結。 |
| 2026-05-03 | **`go-live-checklist.md`** §0：PAT／部署目標鏈結憑證清單與 runbook；**`business-logic.md`** §0 增憑證清單一行。 |
| 2026-05-03 | **`client-delivery-remediation-plan.md`** §2 增上線／runbook／憑證附件說明；**`feature-list.md`** 頁尾、**`pdf03-cursorrules-alignment.md`** §4 維護項補 **`security-token-rotation-checklist`**。 |
| 2026-05-03 | **`README.md`** 文件表增 **client-delivery**、**pdf03**；**`phase4-day4-automation-runbook.md`**／**`phase5-day1-automation-runbook.md`** 雲端檢查項補 **runbook** §3 與 **`npm run ops:verify`**；**`feature-list.md`** §8 README 項同步；**`client-delivery-remediation-plan.md`** §8 修訂紀錄對照 README。 |
| 2026-05-03 | 主檔「**相關檔**」增 **運維與工程** 一行（**go-live**／**runbook**／憑證／**pdf03**）；**`pdf-alignment-p0-backlog.md`** 首段增 **工程／驗收附錄**（**`npm run ci`**、**`ops:deploy:all`**、§8、憑證清單）及修訂紀錄 **2026-05-03**。 |
| 2026-05-03 | **`README.md`** 文件表增 **`pdf-alignment-p0-backlog.md`**；**`business-logic.md`** §0 增 P0 backlog 一行；**`feature-list.md`** §8 README 項同步；**`client-delivery-remediation-plan.md`** §2 第 4 點補 P0 backlog。 |
| 2026-05-03 | **`README.md`** 文件表增 **`adr-0001-scheduling-logic-placement.md`**；**`business-logic.md`** §0 增 Seq 36 ADR 一行；**`pdf03-cursorrules-alignment.md`** §3 增排班權威檢核、§4 維護補 **`adr-0001`**；**`feature-list.md`** §8 同步；主表 Seq 37「與現況對照」一句話補 **Seq 36**／**`adr-0001`**；主檔「**運維與工程**」增 **`adr-0001`** 鏈結。 |
| 2026-05-03 | **`adr-0001-scheduling-logic-placement.md`** 文末增「相關文件」；**`README.md`** 文件表增 **`assessment-completion-records-contract.md`**；**`business-logic.md`** §0、**`feature-list.md`** §8 同步；**`pdf03-cursorrules-alignment.md`** §4 維護補領域契約例。 |
| 2026-05-03 | **`go-live-checklist.md`** §5：Edge 契約改 **`docs/`** 路徑並納入評估契約；**`README.md`** 增 **`residents-edge-function-contract.md`**；**`business-logic.md`** §0、**`feature-list.md`** §8、**`pdf03`** §4 例句同步。 |
| 2026-05-03 | **`pdf-alignment-p0-backlog.md`** 工程附錄、**`client-delivery-remediation-plan.md`** §2：補 **`residents-edge-function-contract`**／**`assessment-completion-records-contract`** 鏈結。 |
| 2026-05-03 | **`feature-list.md`** Edge 表：院友列補 **`residents-edge-function-contract.md`** 鏈結。 |
| 2026-05-03 | **`go-live-checklist.md`** §8：補 **`assessment-completion-records-contract.md`** 對照；**`.github/workflows/ci.yml`** 註解標明與 **`npm run ci`** 指令集合等同；**`supabase-deploy-runbook.md`** §6 補一句與 **`ci.yml`** 分步對照。 |
| 2026-05-03 | **`phase5-day1-delivery-index.md`** §四：補 **`npm run ci`** 與 runbook／**`feature-list`** §8；**`phase4-day4-automation-runbook.md`**／**`phase5-day1-automation-runbook.md`**：標明 **`acceptance:day4`**／**`acceptance:phase5`** 與 **`npm run ci`** 之差異。 |
| 2026-05-03 | **`phase4-day4-delivery-index.md`** §二、**`phase4-final-delivery-package.md`**／**`phase5-final-delivery-package.md`** §五：補 **`npm run ci`**（建議）與窄版 acceptance 之對照。 |
| 2026-05-03 | **`phase4-delivery-message-template.md`**／**`phase5-delivery-message-template.md`**、**`phase4-day4-ui-smoke-checklist.md`** §一：補 **`npm run ci`**（全閘）說明。 |
| 2026-05-03 | **`phase4-day5-external-summary.md`**／**`phase5-day1-external-summary.md`**（驗收結果）；**`phase4-day4-delivery-index.md`** §七、**`phase5-day1-delivery-index.md`** §六：補 **`npm run ci`**（建議／續維護）說明或勾選項。 |
| 2026-05-03 | **`phase4-day5-completion-report.md`**／**`phase5-day1-completion-report.md`**：新增 §七「續維護（與 CI 全閘對齊）」。 |
| 2026-05-03 | **`scripts/phase4-day4-acceptance.mjs`**／**`phase5-day1-acceptance.mjs`**：自動驗收報告增「與 **`npm run ci`** 對照」段落；**`phase3-day5-acceptance-result-2026-04-30.md`** 增 §六；已重產 **`phase4-day4-automation-report.md`**、**`phase5-day1-automation-report.md`**。 |
| 2026-05-03 | **`phase3-day5-acceptance.md`** 增 §九；**`business-logic.md`** §0 增分階交付索引（Phase 4／5）鏈結；**`feature-list.md`** 頁尾產生說明補 **`acceptance:*`**／**`npm run ci`** 索引。 |
| 2026-05-03 | **`README.md`** 文件表增 Phase 4／5 **交付索引**列；**`feature-list.md`** §8 README 項同步。 |
| 2026-05-03 | **`pdf03-cursorrules-alignment.md`** §4：維護項補 **`README`** 文件表之交付索引與 **`npm run ci`**／**`acceptance:*`** 對照；**`client-delivery-remediation-plan.md`** §8 修訂紀錄對照。 |
| 2026-05-03 | **`pdf03-cursorrules-alignment.md`** §3 PR 檢核「文件入口」補 **`README`** 交付索引列；**`pdf-alignment-p0-backlog.md`** 工程附錄補分階 **`acceptance:*`** 鏈結。 |
| 2026-05-03 | **`security-token-rotation-checklist.md`** §D：部署後自檢增可選 **`npm run ci`**；**`adr-0001-scheduling-logic-placement.md`**「相關文件」補 **`feature-list`** §8 與 Phase 交付索引。 |
| 2026-05-03 | **`go-live-checklist.md`** §6：PAT 驗證部署項補鏈結 **`security-token-rotation-checklist.md`** §D（可選 **`npm run ci`**、**`acceptance:*`** 對照）；**`business-logic.md`** §0 憑證一行同步。 |
| 2026-05-03 | 主檔「**運維與工程**」、**`rbac-seq1-verification-checklist.md`** §1、**`pdf-alignment-p0-backlog.md`** 工程附錄、**`feature-list.md`** 頁尾、**`client-delivery-remediation-plan.md`** §2：憑證敘述統一標 **§D**／可選 **`npm run ci`**。 |
| 2026-05-03 | **`README.md`** 憑證列、**`go-live-checklist.md`** §0、**`supabase-deploy-runbook.md`** §6、**`feature-list.md`** §8 README 項：補 **§D**／可選 **`npm run ci`** 與 **`go-live`** §6 鏈結。 |
| 2026-05-03 | **`README.md`** 常用指令區增「憑證與部署後自檢」短文（**`security-token-rotation-checklist.md`** §D、**`go-live-checklist.md`** §6）；**`feature-list.md`** §8 README 項同步。 |
| 2026-05-03 | **`.cursorrules`** §3 增「部署與驗收閘門」；**`pdf03-cursorrules-alignment.md`** §4 維護項補 **`.cursorrules`** 變更時之同步對象。 |
| 2026-05-03 | **`business-logic.md`** §0：補 **`.cursorrules`** §3 與運維文件連動及 **`pdf03`** §4 維護責任；**§8** 修訂紀錄一筆；**`feature-list.md`** §8 README 項同步。 |
| 2026-05-03 | **`README.md`** **`business-logic`** 列、**`pdf-alignment-p0-backlog.md`** 工程附錄、**`pdf03-cursorrules-alignment.md`** §3、**`feature-list.md`** §8 README 項：補 **`.cursorrules`** §3／**`business-logic`** §0 對照。 |
| 2026-05-03 | **`README.md`** 開頭、`pdf-sequenced-gap-checklist.md`「相關檔」、**`feature-list.md`** 頁尾：補 **`.cursorrules`** §3 與 **`business-logic.md`** §0 一句式入口。 |
| 2026-05-03 | **`go-live-checklist.md`**、**`supabase-deploy-runbook.md`**、`pdf03-cursorrules-alignment.md` 標題下增 **對照／與 §0** 引導至 **`business-logic.md`** §0、**`.cursorrules`** §3。 |
| 2026-05-03 | **`security-token-rotation-checklist.md`** 標題下增對照 **`business-logic.md`** §0、**`go-live-checklist.md`**、**`supabase-deploy-runbook.md`** 之引導。 |
| 2026-05-03 | **`feature-list.md`** 開首維護方式、**`pdf-alignment-p0-backlog.md`**、**`adr-0001-scheduling-logic-placement.md`**、**`rbac-seq1-verification-checklist.md`**：增 **對照** 引導至 **`business-logic.md`** §0／**`.cursorrules`** §3（及 **`go-live`** §8／**`pdf03`**／序號表）。 |
| 2026-05-03 | **`residents-edge-function-contract.md`**、**`assessment-completion-records-contract.md`**：開首增 **對照** **`business-logic.md`** §0／**`go-live-checklist.md`**（§8）。 |
| 2026-05-03 | **`client-delivery-remediation-plan.md`** 開首增 **內部工程入口**；**`phase3-day5-acceptance.md`** 增 **對照** Phase 4／5 索引與 **`business-logic.md`** §0。 |
| 2026-05-03 | **`phase3-day5-acceptance-result-2026-04-30.md`**、**`phase4-day4-delivery-index.md`**、**`phase5-day1-delivery-index.md`**：開首增 **對照**（**`business-logic.md`** §0、Phase 鏈、**`npm run ci`**／**`acceptance:*`**）。 |
| 2026-05-03 | Phase 4／5 **Runbook**、**UI smoke**、**完成報告**、**對外摘要**、**打包／發送模板** 開首增 **對照**；acceptance／verify／closeout **腳本**產出之報告／摘要／狀態開首增 **對照**。 |
| 2026-05-04 | **`stage2-completion-report.md`**、**`stage2-external-summary.md`**、**`stage3-day3-completion-note.md`**、**`stage3-day5-external-summary.md`**：開首增 **對照**（**`business-logic.md`** §0、Phase 3／4 鏈）。 |
| 2026-05-04 | **`business-logic.md`** §0、**`README.md`**、**`feature-list.md`** 頁尾、**`pdf03-cursorrules-alignment.md`** §3／§4、**`pdf-alignment-p0-backlog.md`**：Stage 2／Phase 3 **歷史追溯**路徑與 **§0** 互鏈。 |
| 2026-05-05 | 主檔「**運維與工程**」句末補 **Stage 2／Phase 3** 歷史追溯入口（**`business-logic.md`** §0、**`README.md`**）；**`pdf03-cursorrules-alignment.md`** §4 維護項補主檔該列之同步責任。 |
| 2026-05-06 | **`.cursorrules`** §3、**`pdf-alignment-p0-backlog.md`** 工程附錄、**`feature-list.md`** §8／頁尾、**`pdf03-cursorrules-alignment.md`** §3：補 **`.cursorrules`** §3 與序號主檔「**運維與工程**」列之閉環同步說明。 |
| 2026-05-07 | **`README.md`** 開頭與文件表 **`pdf-sequenced-gap-checklist.md`** 列：補「**運維與工程**」與 **§0**／**§3** 對齊；**`feature-list.md`** §8 README 項、**`pdf03`** §3「文件入口」同步。 |
| 2026-05-08 | 標題下增 **對照**（**`business-logic.md`** §0、**`README`**、**`pdf-alignment-p0-backlog.md`**、主檔「**運維與工程**」）；**`go-live-checklist.md`** 開首 **對照** 補 **`pdf-sequenced`**；**`ci.yml`** 註解補文件入口；**`pdf03`** §3「文件入口」補 **`ci.yml`**、§4 維護補主檔 **對照**；**`feature-list.md`** §8 CI 項同步。 |
| 2026-05-09 | **`supabase-deploy-runbook.md`**、**`security-token-rotation-checklist.md`**、**`rbac-seq1-verification-checklist.md`** 開首 **對照** 補 **`pdf-sequenced`**「**運維與工程**」列（與 **go-live**／runbook／憑證同列）。 |
| 2026-05-10 | **`residents-edge-function-contract.md`**、**`assessment-completion-records-contract.md`**、**`feature-list.md`** 開首、**`pdf03`** 標題區／§4、**`adr-0001`** 開首 **對照** 補 **`pdf-sequenced`**「**運維與工程**」列。 |
| 2026-05-11 | **`business-logic.md`** §0 **`pdf-sequenced`** 敘述；**`client-delivery-remediation-plan.md`** 內部入口／**§2**；**`pdf-alignment-p0-backlog.md`** 開首 **對照**；**`feature-list.md`** §8。 |
| 2026-05-12 | **`phase*.md`**、**`stage*.md`** 開首 **對照** 補 **`pdf-sequenced`**「**運維與工程**」列；acceptance／verify／closeout **腳本** 產出 **對照** 同步。 |
| 2026-05-13 | **`.cursorrules`** §3、**`README.md`**、**`business-logic.md`** §0、**`pdf03`** §3、**`feature-list.md`** §8、**`ci.yml`**：明示 **`phase*.md`**／**`stage*.md`** 與 **`pdf-sequenced`**「**運維與工程**」互鏈。 |
| 2026-05-14 | **`feature-list.md`** 頁尾、**`pdf03`** §4：補 **`README`**／**§0**／**`ci.yml`**／**`phase*.md`**／**`stage*.md`** 維護閉環。 |
| 2026-05-15 | **`business-logic.md`** §8 重出 **`business-logic-revision-log.md`**（單檔 ≤200 行）；**`README.md`** 文件表、**`pdf03`** §4、**`business-logic.md`** §0 表列、**`feature-list.md`** 頁尾、**`pdf-alignment-p0-backlog.md`** Seq 38 同步。 |
| 2026-05-16 | 修訂表自 **`pdf-sequenced-gap-checklist.md`** 拆出（單檔 ≤200 行）；**`pdf03`** §3／§4、**`README.md`** 文件表、**`feature-list.md`** 頁尾、**`business-logic-revision-log.md`** 一筆；同日最早列歸檔 **`pdf-sequenced-gap-checklist-revision-log-2026-05-01a.md`**（本檔續列 ≤200 行）。 |
