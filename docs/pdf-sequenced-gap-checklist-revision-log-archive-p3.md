# `pdf-sequenced-gap-checklist` 修訂紀錄歸檔（p3：2026-05-02 初段）

> **對照**：主修訂日誌 **`docs/pdf-sequenced-gap-checklist-revision-log.md`**；**2026-05-01a** 同日最早列 **`docs/pdf-sequenced-gap-checklist-revision-log-2026-05-01a.md`**；**p2** 中段 **`docs/pdf-sequenced-gap-checklist-revision-log-archive-p2.md`**；**p4**（原主日誌列 **12–91**）見 **`docs/pdf-sequenced-gap-checklist-revision-log-archive-p4.md`**。本檔收錄自該主日誌再拆出之原列 **12–33**（E2E **`auth-login`** 模組覆蓋、院友／排程載入重構、職員檔與 Seq 1／25／15 RBAC 等），以符合單檔 ≤200 行。  
> **全案收尾與證據留痕**：**`README.md`**「專案收尾」（**`docs/project-completion-*.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log.md`** 及歸檔 **`docs/pdf-sequenced-gap-checklist-revision-log-2026-05-01a.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p2.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p3.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p4.md`**）；**`docs/project-completion-evidence-index-2026-05.md`**；**`docs/project-completion-kickoff-checklist-2026-05.md`**。

---

## 修訂紀錄（歸檔段）

| 日期 | 說明 |
|------|------|
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
