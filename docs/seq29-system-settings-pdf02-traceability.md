# Seq 29：系統設定（PDF 02【16】）對照骨架

> **對照**：母本 **`docs/pdf/02-STARCARE-智能院舍照護管理系統.pdf`** **【16】**；條文整理 **`docs/business-logic.md`**（排班視窗與 **Seq 15** 引擎）；序號總表 **`docs/pdf-sequenced-gap-checklist.md`** Seq **29**；P0 **`docs/pdf-alignment-p0-backlog.md`** Seq **29**。  
> **修訂留痕**：日期列見 **`docs/seq29-system-settings-pdf02-traceability-revision-log.md`**（與本檔末節 **修訂紀錄** blockquote 併讀）。  
> **上一序號**：**`docs/seq28-user-manual-pdf02-traceability.md`**（用戶手冊【15】）。  
> **用途**：將 **排班視窗、非治療時段、規則／服務開關、SC 僅治療師、本機儲存、審計、跨模組重載** 與母本對表；標示 **院舍設定後端 API** 與 **PDF 逐欄簽核** 缺口。  
> **UAT／Staging（P1／P2）**：**`docs/uat/system-settings-policy-p1-uat-and-staging-2026-05-09.md`**（**二之一** 無 Supabase 建置之 **Playwright** 指令；**二之二** **`edgeEnabled`** 時 **P2** 手動抽測；段末 **工程維護互鏈**）；**對客範本**：**`docs/system-settings-policy-customer-reply-2026-05-09.md`**。  
> **Demo E2E（無 Supabase）**：**`npm run test:e2e:system-settings-policy`**（**`e2e/system-settings-policy-p1-demo.spec.ts`**）、**`npm run test:e2e:smoke`**（**`hash #system-settings`**）；與 **`README.md`** 常用指令並列。  
> **可選登入 E2E（含 Supabase；P2 標題）**：**`npm run test:e2e:auth`** 內 **`e2e/auth-login.system-settings-p2.spec.ts`**（優先 **`E2E_AUTH_TEAMLEAD_*`**，否則 **`E2E_AUTH_ADMIN_*`**；**`VITE_SUPABASE_*`**；見 **`playwright.auth.config.ts`**）。
> **CI（Seq 29）**：**`.github/workflows/ci.yml`** 檔首專段併 **`npm run ci`** 內 **`e2e/smoke`**；**`npm run ci`** 與 Actions 同步含 **`perf:bundle:ci`** 及 **`e2e/list-section-collapse.spec.ts`**（不重複 **`build:demo`**）；變更時對照 **`docs/pdf03-cursorrules-alignment.md`** §3、**`docs/seq35-pdf03-cursorrules-alignment-traceability.md`** §3、本檔 **§5**。

> **全案收尾與證據留痕**：**`README.md`**「專案收尾」（**`docs/business-logic.md`** §0 **全案收尾執行** 併述 **README** 表前互鏈指引（含各檔 **對照**／**全案收尾母索引**）；**`docs/project-completion-*.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log.md`** 及歸檔 **`docs/pdf-sequenced-gap-checklist-revision-log-2026-05-01a.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p2.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p3.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p4.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p5.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-seq29-2026-05-09b.md`**）；**`docs/project-completion-evidence-index-2026-05.md`**；**`docs/project-completion-kickoff-checklist-2026-05.md`**；Gate A 自動證據固定入口 **`docs/evidence/gate-a-latest.md`**（檔內 **Next Command** 與 **`preflight:strict`** 並列；**`npm run gatea:evidence:list`**／**`npm run gatea:evidence:refresh`**／**`npm run gatea:evidence:preflight:strict`**；檔尾 blockquote 四行：**`gateALatestMarkdownFooterLines`**（**`docs/gate-a-status-2026-05-06-commands-appendix.md#gate-a-appendix-latest-segment`** 下文 **`latest`** 段））；多數 **`gatea:evidence:*`** 終端 stdout 頁尾 **`scripts/gate-a-markdown-footer.mjs`**（**Export 契約**）。

---

## 1. 畫面與模組

| 區塊 | 元件／Hook | 說明 |
|------|------------|------|
| 排班與時段 | **`SystemSettingsHome`** 首段 | **HH:mm** 欄位：`schedulingWindowStart`／`End`、`nonTherapyWindowStart`／`End`；**開工準備**開關（`SHIFT_PREP_BLOCK`）；**`SystemSettingsNonTherapyIntervalsEditor`**（本機多段資助復康非治療排除、送審寫 **OTHER**）；**`SystemSettingsPdf16Section`** 外層 **`section aria-labelledby`** 與 **`h2`** 標題 **id**；內嵌各段 **`ListSectionPanel`** 為 **`section aria-labelledby`** 與 **`h2`／`h3`** 標題關聯，展開鈕 **`aria-controls`** 綁內容區 **`id`**（收合時 **`hidden`**）。 |
| 數字上限（P1） | **`SystemSettingsNumericCapsCard`** | 與 Edge **`numericLimits`** 對齊；提交時併入 **`mergeP1DraftIntoPolicyBundle`**。 |
| 固定活動（P2） | **`SystemSettingsFixedActivitiesCard`** | 雲端 **`facility_policy_fixed_activities`** 多筆；**`SystemSettingsSnapshot.policyFixedActivities`**／**`policyFixedActivitiesHydrated`**；**`p1FieldsFromPolicyBundle`** hydrate；**`mergeP1DraftIntoPolicyBundle`** 合併（未 hydrated 且草稿空時保留雲端列）；僅 **`edgeEnabled`** 時顯示。 |
| 資助復康三列（P2） | **`SystemSettingsSubsidizedTiersCard`** | 雲端 **`facility_policy_subsidized_tier`**；**`policySubsidizedTiers`**／**`policySubsidizedTiersHydrated`**；**`policySubsidizedTierDraft`**；合併規則同固定活動；僅 **`edgeEnabled`** 時顯示（復康大節內）。 |
| 資助職類矩陣（P2） | **`SystemSettingsSubsidizedRoleOfferingsCard`** | 雲端 **`facility_policy_subsidized_role_offerings`**（48 格）；**`policySubsidizedRoleOfferings`**／**`policySubsidizedRoleOfferingsHydrated`**；**`policySubsidizedRoleOfferingDraft`**；僅 **`edgeEnabled`**。 |
| 資助 Pass 次序（P2） | **`SystemSettingsPassOrderCard`** | 雲端 **`facility_policy_subsidized_pass_order`**；**`policySubsidizedPassOrder`**／**`policySubsidizedPassOrderHydrated`**；**`policyPassOrderDraft`**；合併規則同固定活動；僅 **`edgeEnabled`** 時顯示（復康大節內）。 |
| 認知障礙症政策（P2） | **`SystemSettingsDementiaPolicyCard`** | 雲端 **`facility_policy_dementia_core`**／**`facility_policy_dementia_role_offerings`**；**`policyDementiaCore`**／**`policyDementiaRoleOfferings`** 與 **`*Hydrated`**；**`policyDementiaDraft`**；僅 **`edgeEnabled`**。 |
| 政策版本（雲端提交） | **`SystemSettingsCurrentPolicyVersionCard`**、**`SystemSettingsPolicyVersionsListCard`**、**`SystemSettingsPolicySubmitCard`**、**`useSystemSettingsPolicySync`** | **`schedulingPolicyRepository`** → current-get／**versions-list** 摘要／validate／commit；**`X-Idempotency-Key`**；**`loadError`** 時目前版／版本列表卡皆顯示引導並可 **重新載入**（技術訊息見提交卡；**`isSubmitting`** 時重載鈕 **disabled**）；**`reloadPolicy`** 手動重試並行讀取；**`SystemSettingsPolicySubmitCard`** 於 **`validateErrors`** 清單上附 **`validate`**／**`commit`** 雲端校驗說明（**PRD** §4、Edge **§4.3**／**§4.4**）；**目前版／版本列表／提交** 三卡 **`article`** **`aria-busy`**（**`isPolicyLoading`** 或 **`isSubmitting`** 為真；提交卡另併 **`role="status"`**）；提交成功後 **`loadPolicy({ withLoadingIndicator: false, bypassSubmitLock: true })`** 靜默刷新（**`lockRef`** 期間阻擋一般 **`reloadPolicy`**），若失敗則 **`submitMessage`** 併述補救（**`loadPolicy`** 回傳 **`{ ok }`**）。 |
| 規則與服務 | 第二段 | **`rulesEngineEnabled`**、**`fixedActivitiesEnabled`**、**`serviceTypesEnabled`**。 |
| SC | 第三段 | **`specialCareTherapistOnly`**（與 DB **`scheduling_rules.allow_sc_therapist_only`** 併用敘述見主檔）。 |
| 儲存 | **`useSystemSettings`**、**`SystemSettingsHome`** 本機區 | **`validateSystemSettings`**、**`lockRef`**、**`SYSTEM_SETTINGS_SAVE`** 審計；**`save`** 於 **`setTimeout(0)`** 落檔（避免 **`isSaving`** 與 **`setIsSaving(false)`** 併批致無法觀測）；本機表單外殼 **`role="group"`** **`aria-label="本機設定（瀏覽器儲存）"`** **`aria-busy={isSaving}`**。 |
| 審計 | **`AuditTrailPanel`**（頁底） | 與 **Seq 12** 同源；**`section aria-labelledby`** 綁 **`h3`**（**`useId`**，避免多實例 **`id`** 衝突）；展開鈕 **`aria-controls`**、內容區收合時 **`hidden`**；**`SYSTEM_SETTINGS_SAVE`** 亦進 **Seq 27** 通知。 |

**路由**：`view:system-settings`、**`#system-settings`**。

---

## 2. 資料模型與持久化

| 型別／鍵 | 說明 |
|----------|------|
| **`SystemSettingsSnapshot`** | **`types.ts`**（註解 **PDF 02【16】Seq 29**） |
| **`SYSTEM_SETTINGS_STORAGE_KEY`** | **`starcare:system-settings:v1`**（**`localStorageKeys`**） |
| **`bumpSystemSettingsExternalVersion`** | 跨頁籤／同機 **`storage` event**（**`systemSettingsExternalStore`**） |

---

## 3. 與排班引擎（Seq 15／29）

| 機制 | 程式錨點 |
|------|----------|
| 時段過濾 | **`schedulingSessionWindowFilterService`**（**`subsidizedRehabNonTherapyIntervals`** 多段聯集排除資助復康；無鍵時 **`nonTherapyWindow*`**）、**`buildEngineConstraintsFromRulesAndUi`**（**`scheduling/hooks/schedulingHookHelpers`**）；**資助復康乾跑**另見 **`schedulingWindowSnapshotService.resolveSchedulingWindowSnapshot`**（有 **`policyVersion`** 時合併雲端 P1） |
| 扁平規則讀取與 P1 上限 | **`scheduling-rules-get`**：以 **`scheduling_rules`** 為基準列；現行政策版本存在時 **`groupCapacityLimit`** 以 P1 **`group_participant_cap`** 覆寫，**`enableSubsidizedRehab`**／**`enableDementiaCare`**／**`allowScTherapistOnly`** 與資助階／認知核心子表合併（與 **`scheduling-policy-current-get`** 子表語意一致；PRD §7 **B**）；**`therapistGroupSessionsDailyCap`**／**`assistantGroupSessionsDailyCap`** 取自 **`numericLimits`**（**`scheduling_rules`** 無對應欄）；**`dailySameServiceLimit`** 等其餘扁平欄仍取自 **`scheduling_rules`** |
| SC 僅治療師 | 與 **`pickSession`**、時段 **`staffRoleType`** 對齊（主檔 Seq 29 敘述） |
| P1 小組每日場次上限（資助復康引擎） | **`evalSessionCoreForPick`**（**`schedulingCoreSessionGates`**）：**`capacity > 1`** 之互異 **`Subsidized_Rehab`** 時段計；逾 **`therapistGroupSessionsDailyCap`**／**`assistantGroupSessionsDailyCap`**（職類分派）回 **`STAFF_GROUP_DAILY_CAP`**；**`mapRulesToConstraints`** 自 **`SchedulingRules`** 帶入 |
| P1 小組每日場次上限（認知引擎） | **`pickDementiaSession`**：同上邏輯，**`serviceType === 'Dementia_Service'`**；**`runDementiaTrackDryRun`** 傳入 **`assignments`** 累計 |

---

## 4. 自動化測試與 E2E

| 測試／E2E | 涵蓋 |
|-----------|------|
| `ListSectionPanel.test.tsx`（Vitest） | **`section`** **`aria-labelledby`** 與 **`h2`／`h3`** 標題 **id** 一致；**`aria-controls`**／收合 **`hidden`**；**`defaultExpanded={false}`** |
| `AuditTrailPanel.test.tsx`（Vitest） | **`section`** **`aria-labelledby`** 與 **`h3`** **id** 一致；同頁雙實例 **id** 不重複；**`aria-controls`**／展開篩選／**`hidden`**；**`defaultExpanded`** |
| `SystemSettingsPdf16Section.test.tsx`（Vitest） | **Pdf16** 大節 **`section`** **`aria-labelledby`** 與 **`h2`** **id** 一致（**智能排班設定**／**復康服務基本設定**）；**`description`** 說明段落呈現 |
| `SystemSettingsSchedulingWindowsCard.test.tsx`（Vitest） | PDF 02【16】**排班時間設定**卡：**HH:mm** 欄位標籤可見；輸入／**開工準備** checkbox 變更委派 **`setField`** |
| `SystemSettingsNumericCapsCard.test.tsx`（Vitest） | PDF 02【16】**排班規則設定** P1 數字上限：三欄 **`type="number"`** 標籤可見；變更委派 **`setField`**（數值） |
| `SystemSettingsRulesTogglesCard.test.tsx`（Vitest） | 規則引擎／固定活動／服務類型三 **checkbox**；勾選委派 **`setField`** |
| `SystemSettingsFixedActivitiesCard.test.tsx`（Vitest） | P2 固定活動：**新增** 鈕委派 **`setField('policyFixedActivities', …)`** |
| `SystemSettingsFixedActivitiesCard` 等 P2 卡測試（Vitest） | **`SubsidizedTiers`／`SubsidizedRoleOfferings`／`PassOrder`／`Dementia`** 等：**`setField`** 與 **`hydrated`** 旗標 |
| `mergeP1DraftIntoPolicyBundle.test.ts`（Vitest） | P2：**`policyFixedActivitiesHydrated`**／雲端列保留與草稿覆寫；**`policySubsidizedPassOrderHydrated`**／Pass；**`policySubsidizedTiersHydrated`**／資助三列；**`policySubsidizedRoleOfferingsHydrated`**／職類矩陣；**`policyDementia*Hydrated`**／認知核心與 8 格 |
| `p1FieldsFromPolicyBundle.test.ts`（Vitest） | hydrate：**`policyFixedActivities`**；**`policySubsidizedPassOrder`**；**`policySubsidizedTiers`**；**`policySubsidizedRoleOfferings`**；**`policyDementiaCore`**／**`policyDementiaRoleOfferings`** |
| `schedulingPolicyRepository.edgeReadWrite.test.ts`、`schedulingPolicyRepository.listPolicyVersionSummaries.test.ts`、`schedulingPolicyRepository.edgeResponseJson.test.ts`（Vitest） | **`EdgeSchedulingPolicyRepository`**：**請先登入**（**getCurrent**／**validate**／**commit** 不呼叫 **`fetch`**）／**fetch** 與 **`response.json()`** 連線包裝（**getCurrent**／**list**／**validate**／**commit**；與 **`schedulingKpiHistoryRepository`** Edge 訊息一致）；併既有 **current-get**／**versions-list**／**validate**／**commit** 路徑 |
| `SystemSettingsSpecialCareCard.test.tsx`（Vitest） | **Special Care 僅治療師** **checkbox**；**`rerender`** 更新 **`draft`** 後可驗證開→關 **`setField`** |
| `SystemSettingsHome.smoke.test.tsx`（Vitest） | **`SystemSettingsHome`** 煙霧：**`useAuth`**／**`useAuditTrailList`**／**`supabaseBrowserEnv`** mock 下 **Pdf16**／**政策**／**審計** **`section[aria-labelledby]`**、內層 **ListSectionPanel** 巢狀、**`aria-controls`**／**`hidden`** 初值、**`Set.size === 5`**、本機 **`group`** **`aria-busy`**、**儲存**、無 Edge **Supabase** 說明 |
| `SystemSettingsHome.interactions.test.tsx`（Vitest） | **`SystemSettingsHome`** 互動：**審計** 展開／收合與 **`placeholder`**；**資助復康** 展開後 **SC** 文案；**政策版本** **`ListSectionPanel`** **收合**／**展開** |
| `useSystemSettings.saveSavingState.test.ts`（Vitest） | **`save`** 延後儲存期間 **`isSaving`**；驗證失敗不觸發 **`saveSystemSettingsWithAudit`** |
| `systemSettingsValidation.test.ts` | 驗證規則 |
| `systemSettingsExternalStore.test.ts` | 版本 bump |
| `e2e/smoke.spec.ts` | 各 hash 模組與審計標題；**`#staff-import`** 審計 **`aria-controls`**／**`hidden`**；**`#system-settings`**：**本機設定（瀏覽器儲存）** **`group`**（**`aria-busy="false"`**）、**Pdf16 智能排班** 內 **排班時間設定**（含 **資助復康非治療排除** 多段 **`checkbox`**）／**排班規則設定（P1）** **`ListSectionPanel`**（**`aria-controls`**、無 **`hidden`**、兩內容區 **`id`** 有別）、**Pdf16 復康** 內 **資助復康服務（P1）** **`ListSectionPanel`** 預設收合（**展開**、**`aria-controls`**、**`hidden`**）、**政策版本** **`ListSectionPanel`** 預設展開、**收合**／**展開**、**`section[aria-labelledby]`**、**審計** **`section[aria-labelledby]`** 與 **展開審計**／**收合審計**（**`aria-controls`**、**`hidden`**、搜尋 **`placeholder`**）、五處 **`aria-controls`** 目標 **`id`** 全相異（**`Set.size === 5`**）、**儲存設定（本機）**、無 Edge 說明 |
| `e2e/auth-login.system-settings-p2.spec.ts` | **`npm run test:e2e:auth`**（**`playwright.auth.config.ts`**）：優先 **`E2E_AUTH_TEAMLEAD_*`**，否則 **`E2E_AUTH_ADMIN_*`** 登入後 **`#system-settings`** 五處 **P2** **`h3`** 可見（需 **`VITE_SUPABASE_*`**；未設憑證或鍵則 skip；與 **Vitest** **`SystemSettingsHome.policyP2Titles.test.tsx`**、**UAT** **二之二** 互補） |
| `SystemSettingsHome.policyP2Titles.test.tsx`（Vitest） | **P2**：**`getSupabaseBrowserCredentials`** mock 使 **`edgeEnabled`**；**`createSchedulingPolicyRepository`** mock 下五處 **`h3`**（固定活動／資助三列／職類矩陣／Pass／認知）可見（與 **UAT** **二之二** Staging 手動互補；**Playwright** 預設 bundle 清空 **`VITE_SUPABASE_*`** 不覆蓋 **App** 登入閘） |
| `e2e/system-settings-policy-p1-demo.spec.ts` | **`npm run test:e2e:system-settings-policy`**：本機區 **`group`**／**`aria-busy`**；**智能排班設定**／**復康服務基本設定**；**排班時間設定**（含 **資助復康非治療排除** 多段 **`checkbox`**）／**排班規則設定（P1）**（於 **Pdf16** 大節內篩 **`ListSectionPanel`**、**`h3`**、預設展開、**`aria-controls`**）與 **資助復康**（於復康大節內篩 **`ListSectionPanel`**、**`aria-controls`**／**`hidden`**／展開後 **SC** 文案）；**政策版本** **`ListSectionPanel`** **`section[aria-labelledby]`**、**收合**／**展開** 與 **`hidden`**；**排班時間／規則／資助復康／政策／審計** 五處 **`aria-controls`** 目標 **`id`** 全相異（**`Set.size === 5`**）；**審計** **展開審計**／**收合審計**（**`aria-controls`**、**`hidden`**、搜尋 **`placeholder`**）、無 Edge 本機說明。**P2** 雲端卡：Staging 手動見 **UAT** **二之二**（**`edgeEnabled`**）。 |
| `useSystemSettingsPolicySync*.test.ts`（Vitest） | 載入／提交成功與失敗路徑；**`commit`** 回 **`errors`** 時 **`validateErrors`**（**`@testing-library/react`**；含 **`submitFailures`** 提交例外） |
| `useSystemSettingsPolicySync.reload.test.ts`（Vitest） | **`loadError`** 後 **`reloadPolicy`** 成功則清除錯誤並 **hydrate** |
| `useSystemSettingsPolicySync.postCommitRefresh.test.ts`（Vitest） | 提交成功後靜默 **`loadPolicy`** 失敗時 **`submitMessage`** 補述與 **`loadError`** |
| `useSystemSettingsPolicySync.submitLockLoadPolicy.test.ts`（Vitest） | **`lockRef`** 期間 **`reloadPolicy`** 不觸發額外讀取；**`bypassSubmitLock`** 供提交後刷新 |
| `SystemSettingsPolicyVersionsListCard.test.tsx`（Vitest） | **`loadError`** 引導、重載鈕、**`aria-busy`**、**`isSubmitting`**；未啟用 Edge 不渲染 |
| `SystemSettingsCurrentPolicyVersionCard.test.tsx`（Vitest） | **`aria-busy`**（載入中／提交中） |
| `SystemSettingsPolicySubmitCard.test.tsx`（Vitest） | **`isPolicyLoading`**／**`isSubmitting`**、**`aria-busy`**／**`role="status"`**；**`validateErrors`** 前說明文案與 **`role="alert"`**；**`submitMessage`** 非「已建立」時 **`role="alert"`**（**`commit` HTTP 400** 之 **`errors`**） |

---

## 5. 維護閉環

- 變更 **`SystemSettingsSnapshot`** 欄位、**驗證規則**或 **審計 `detail`** 時：同步本檔、**`docs/seq15-scheduling-pdf02-traceability.md`**（排班域）、**`pdf-sequenced-gap-checklist.md`** Seq 29、**`pdf-sequenced-gap-checklist-revision-log.md`**（**`docs/pdf03-cursorrules-alignment.md`** §4）、**`docs/seq29-system-settings-pdf02-traceability-revision-log.md`**（本序號修訂表）。
- 變更 **`scheduling-policy-*`** 部署敘述（**`docs/supabase-deploy-runbook.md`** §2 **Seq 29**、§6）或 **`docs/go-live-checklist.md`** §5（Edge 契約／前向煙霧）時：維持與 **本檔** §4、**`docs/uat/system-settings-policy-p1-uat-and-staging-2026-05-09.md`** **二之一**／**二之二**（段末 **工程維護互鏈**）一致。
- 變更 **`schedulingPolicyRepository.ts`**（**`EdgeSchedulingPolicyRepository`** **`fetch`**／**`response.json()`** **try／catch**）或對應 **Vitest**（**`schedulingPolicyRepository.edgeReadWrite.test.ts`**／**`schedulingPolicyRepository.listPolicyVersionSummaries.test.ts`**／**`schedulingPolicyRepository.edgeResponseJson.test.ts`**）時：同步 **本檔** §4、**`docs/seq15-scheduling-pdf02-traceability.md`**（**`resolveSchedulingWindowSnapshot`**／**`createSchedulingPolicyRepository`** 鏈）、**`docs/pdf-sequenced-gap-checklist-revision-log.md`**（**Seq 29**）、**`docs/pdf03-cursorrules-alignment.md`** §3 **Seq 29【16】政策 validate／commit 與錯誤 UX** 檢核列。
- 變更 **`npm run ci`**、**`.github/workflows/ci.yml`**、**`e2e/smoke.spec.ts`**、**`e2e/system-settings-policy-p1-demo.spec.ts`**、**`e2e/auth-login.system-settings-p2.spec.ts`**、**`src/features/systemSettings/components/SystemSettingsHome.policyP2Titles.test.tsx`**、**`package.json`** **`test:e2e:smoke`**／**`test:e2e:system-settings-policy`**／**`test:e2e:auth`** 或 **`.env.example`** **Seq 29【16】** demo 煙霧註解時：維持 **`.github/workflows/ci.yml`** 檔首 **Seq 29【16】** 專段註解與 **本檔** §4、**UAT** **二之一**／**二之二**（段末 **工程維護互鏈**）、**`docs/pdf03-cursorrules-alignment.md`** §3、**`docs/feature-list.md`** §8 第 3 點（**README**／**CI**；含 **`.env.example`** 與 **`package.json`** 鍵名對照）、**`docs/business-logic.md`** §0 **02【16】院舍政策** 段（**`test:e2e:auth`** **P2** **`h3`** 前向）一致。
- 變更 **`docs/client-delivery-remediation-plan.md`** §2 **Seq 29**／前向煙霧敘述時：併 **`docs/uat/system-settings-policy-p1-uat-and-staging-2026-05-09.md`** **二之一**／**二之二**（段末 **工程維護互鏈**）、**本檔** §4 對齊。
- **下一序號（02 模組鏈結束）**：母本 **03** 工程治理 **Seq 35** — **`docs/seq35-pdf03-cursorrules-alignment-traceability.md`**（對 **`docs/pdf03-cursorrules-alignment.md`** 換版差異與閉環）；鏈 **Seq 36～38** 見該檔與 **`pdf-sequenced-gap-checklist.md`** **C 區**。

---

## 6. 院舍政策版本（客戶定案 2026-05-09）

**多表**＋**`effective_from` 分段生效**、版本不重疊、Team Lead／Admin 變更＋二次確認與備註、分期驗收（P1／P2）。詳見：

| 檔案 | 用途 |
|------|------|
| **`docs/system-settings-policy-prd-2026-05-09.md`** | PRD：R1～R7、流程、分期、與 `scheduling_rules` 接軌策略 |
| **`docs/system-settings-policy-schema-2026-05-09.md`** | 表清單、欄位概念、讀版規則；**§3.6** Edge 寫入／validate 與空陣列或完整網格（3／48／8） |
| **`docs/scheduling-policy-edge-function-contract.md`** | Edge **`scheduling-policy-*`** 五支（讀 staff／teamlead／admin；寫 teamlead／admin）；**§4.3** **`validate`** 網格完整性、**§5.2** **`errors[].code`**（**`schedulingPolicyDraftCompleteness.ts`**）。 |
| **`supabase/migrations/20260509153000_facility_scheduling_policy_versioned_skeleton.sql`** | PostgreSQL **表／觸發器**（單檔 ≤200 行） |
| **`supabase/migrations/20260509153100_facility_scheduling_policy_versioned_rls.sql`** | **RLS**（SELECT）；寫入預設走 Edge |

---

## 修訂紀錄

> **修訂表**：全列見 **`docs/seq29-system-settings-pdf02-traceability-revision-log.md`**（併讀 **`docs/pdf-sequenced-gap-checklist-revision-log.md`** **Seq 29** 相關列；本檔 **§1–§6**）。
