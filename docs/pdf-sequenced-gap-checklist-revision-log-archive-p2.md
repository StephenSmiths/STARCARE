# `pdf-sequenced-gap-checklist` 修訂紀錄歸檔（p2：2026-05-01～02 中段）

> **對照**：主修訂日誌 **`docs/pdf-sequenced-gap-checklist-revision-log.md`**；**2026-05-01** 同日最早列 **`docs/pdf-sequenced-gap-checklist-revision-log-2026-05-01a.md`**。另段歸檔 **p3**（**2026-05-02** 相關列）見 **`docs/pdf-sequenced-gap-checklist-revision-log-archive-p3.md`**；**p4**（**2026-05-01**～**05-03** 前段）見 **`docs/pdf-sequenced-gap-checklist-revision-log-archive-p4.md`**；**p5**（**2026-05-03** 續列）見 **`docs/pdf-sequenced-gap-checklist-revision-log-archive-p5.md`**。本檔收錄自該主日誌再拆出之原列 **12–50**（RLS／審計／E2E 煙霧等），以符合單檔 ≤200 行。  
> **全案收尾與證據留痕**：**`README.md`**「專案收尾」（**`docs/business-logic.md`** §0 **全案收尾執行** 併述 **README** 表前互鏈指引（含各檔 **對照**／**全案收尾母索引**）；**`docs/project-completion-*.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log.md`** 及歸檔 **`docs/pdf-sequenced-gap-checklist-revision-log-2026-05-01a.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p2.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p3.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p4.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p5.md`**）；**`docs/project-completion-evidence-index-2026-05.md`**；**`docs/project-completion-kickoff-checklist-2026-05.md`**。

---

## 修訂紀錄（歸檔段）

| 日期 | 說明 |
|------|------|
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
