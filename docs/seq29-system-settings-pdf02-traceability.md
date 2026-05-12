# Seq 29：系統設定（PDF 02【16】）對照骨架

> **對照**：母本 **`docs/pdf/02-STARCARE-智能院舍照護管理系統.pdf`** **【16】**；條文整理 **`docs/business-logic.md`**（排班視窗與 **Seq 15** 引擎）；序號總表 **`docs/pdf-sequenced-gap-checklist.md`** Seq **29**；P0 **`docs/pdf-alignment-p0-backlog.md`** Seq **29**。  
> **上一序號**：**`docs/seq28-user-manual-pdf02-traceability.md`**（用戶手冊【15】）。  
> **用途**：將 **排班視窗、非治療時段、規則／服務開關、SC 僅治療師、本機儲存、審計、跨模組重載** 與母本對表；標示 **院舍設定後端 API** 與 **PDF 逐欄簽核** 缺口。  
> **UAT／Staging（P1）**：**`docs/uat/system-settings-policy-p1-uat-and-staging-2026-05-09.md`**；**對客範本**：**`docs/system-settings-policy-customer-reply-2026-05-09.md`**。  
> **Demo E2E（無 Supabase）**：**`npm run test:e2e:system-settings-policy`**（**`e2e/system-settings-policy-p1-demo.spec.ts`**；與 **`README.md`** 常用指令並列）。

> **全案收尾與證據留痕**：**`README.md`**「專案收尾」（**`docs/business-logic.md`** §0 **全案收尾執行** 併述 **README** 表前互鏈指引（含各檔 **對照**／**全案收尾母索引**）；**`docs/project-completion-*.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log.md`** 及歸檔 **`docs/pdf-sequenced-gap-checklist-revision-log-2026-05-01a.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p2.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p3.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p4.md`**）；**`docs/project-completion-evidence-index-2026-05.md`**；**`docs/project-completion-kickoff-checklist-2026-05.md`**；Gate A 自動證據固定入口 **`docs/evidence/gate-a-latest.md`**（檔內 **Next Command** 與 **`preflight:strict`** 並列；**`npm run gatea:evidence:list`**／**`npm run gatea:evidence:refresh`**／**`npm run gatea:evidence:preflight:strict`**；檔尾 blockquote 四行：**`gateALatestMarkdownFooterLines`**（**`docs/gate-a-status-2026-05-06-commands-appendix.md#gate-a-appendix-latest-segment`** 下文 **`latest`** 段））；多數 **`gatea:evidence:*`** 終端 stdout 頁尾 **`scripts/gate-a-markdown-footer.mjs`**（**Export 契約**）。

---

## 1. 畫面與模組

| 區塊 | 元件／Hook | 說明 |
|------|------------|------|
| 排班與時段 | **`SystemSettingsHome`** 首段 | **HH:mm** 欄位：`schedulingWindowStart`／`End`、`nonTherapyWindowStart`／`End`；**開工準備**開關（`SHIFT_PREP_BLOCK`）；**`SystemSettingsPdf16Section`** 外層 **`section aria-labelledby`** 與 **`h2`** 標題 **id**；內嵌各段 **`ListSectionPanel`** 為 **`section aria-labelledby`** 與 **`h2`／`h3`** 標題關聯，展開鈕 **`aria-controls`** 綁內容區 **`id`**（收合時 **`hidden`**）。 |
| 數字上限（P1） | **`SystemSettingsNumericCapsCard`** | 與 Edge **`numericLimits`** 對齊；提交時併入 **`mergeP1DraftIntoPolicyBundle`**。 |
| 政策版本（雲端提交） | **`SystemSettingsCurrentPolicyVersionCard`**、**`SystemSettingsPolicyVersionsListCard`**、**`SystemSettingsPolicySubmitCard`**、**`useSystemSettingsPolicySync`** | **`schedulingPolicyRepository`** → current-get／**versions-list** 摘要／validate／commit；**`X-Idempotency-Key`**；**`loadError`** 時目前版／版本列表卡皆顯示引導並可 **重新載入**（技術訊息見提交卡；**`isSubmitting`** 時重載鈕 **disabled**）；**`reloadPolicy`** 手動重試並行讀取；**目前版／版本列表／提交** 三卡 **`article`** **`aria-busy`**（**`isPolicyLoading`** 或 **`isSubmitting`** 為真；提交卡另併 **`role="status"`**）；提交成功後 **`loadPolicy({ withLoadingIndicator: false, bypassSubmitLock: true })`** 靜默刷新（**`lockRef`** 期間阻擋一般 **`reloadPolicy`**），若失敗則 **`submitMessage`** 併述補救（**`loadPolicy`** 回傳 **`{ ok }`**）。 |
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
| 時段過濾 | **`schedulingSessionWindowFilterService`**、**`buildEngineConstraintsFromRulesAndUi`**（**`scheduling/hooks/schedulingHookHelpers`**）；**資助復康乾跑**另見 **`schedulingWindowSnapshotService.resolveSchedulingWindowSnapshot`**（有 **`policyVersion`** 時合併雲端 P1） |
| SC 僅治療師 | 與 **`pickSession`**、時段 **`staffRoleType`** 對齊（主檔 Seq 29 敘述） |

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
| `SystemSettingsSpecialCareCard.test.tsx`（Vitest） | **Special Care 僅治療師** **checkbox**；**`rerender`** 更新 **`draft`** 後可驗證開→關 **`setField`** |
| `SystemSettingsHome.test.tsx`（Vitest） | 整合：**`useAuth`**／**`useAuditTrailList`** mock 下 **Pdf16** 大節、**政策版本（P1）**、**審計** **`h3`** 標題、本機 **`group`** 與 **儲存設定（本機）** 可見 |
| `useSystemSettings.saveSavingState.test.ts`（Vitest） | **`save`** 延後儲存期間 **`isSaving`**；驗證失敗不觸發 **`saveSystemSettingsWithAudit`** |
| `systemSettingsValidation.test.ts` | 驗證規則 |
| `systemSettingsExternalStore.test.ts` | 版本 bump |
| `e2e/smoke.spec.ts` | 各 hash 模組與審計標題；**`#staff-import`** 審計 **`aria-controls`**／**`hidden`**；**`#system-settings`**：**本機設定（瀏覽器儲存）** **`group`**（**`aria-busy="false"`**）、**Pdf16 智能排班** 內 **排班時間設定**／**排班規則設定（P1）** **`ListSectionPanel`**（**`aria-controls`**、無 **`hidden`**、兩內容區 **`id`** 有別）、**Pdf16 復康** 內 **資助復康服務（P1）** **`ListSectionPanel`** 預設收合（**展開**、**`aria-controls`**、**`hidden`**）、**政策版本** **`ListSectionPanel`** 預設展開（**`aria-controls`**、無 **`hidden`**）與 **`section[aria-labelledby]`**、**審計** **`section[aria-labelledby]`**、**政策版本（P1）**、**儲存設定（本機）**、無 Edge 說明 |
| `e2e/system-settings-policy-p1-demo.spec.ts` | **`npm run test:e2e:system-settings-policy`**：本機區 **`group`**／**`aria-busy`**；**智能排班設定**／**復康服務基本設定**；**排班時間設定**／**排班規則設定（P1）**（於 **Pdf16** 大節內篩 **`ListSectionPanel`**、**`h3`**、預設展開、**`aria-controls`**）與 **資助復康** **`ListSectionPanel`** **`aria-controls`**／**`hidden`**／展開後 **SC** 文案；政策版本（P1）／**審計** **`section[aria-labelledby]`** 與對應標題 **id**、無 Edge 本機說明 |
| `useSystemSettingsPolicySync*.test.ts`（Vitest） | 載入／提交成功與失敗路徑（**`@testing-library/react`**） |
| `useSystemSettingsPolicySync.reload.test.ts`（Vitest） | **`loadError`** 後 **`reloadPolicy`** 成功則清除錯誤並 **hydrate** |
| `useSystemSettingsPolicySync.postCommitRefresh.test.ts`（Vitest） | 提交成功後靜默 **`loadPolicy`** 失敗時 **`submitMessage`** 補述與 **`loadError`** |
| `useSystemSettingsPolicySync.submitLockLoadPolicy.test.ts`（Vitest） | **`lockRef`** 期間 **`reloadPolicy`** 不觸發額外讀取；**`bypassSubmitLock`** 供提交後刷新 |
| `SystemSettingsPolicyVersionsListCard.test.tsx`（Vitest） | **`loadError`** 引導、重載鈕、**`aria-busy`**、**`isSubmitting`**；未啟用 Edge 不渲染 |
| `SystemSettingsCurrentPolicyVersionCard.test.tsx`（Vitest） | **`aria-busy`**（載入中／提交中） |
| `SystemSettingsPolicySubmitCard.test.tsx`（Vitest） | **`isPolicyLoading`**／**`isSubmitting`** 時提交鈕 **disabled**、**`aria-busy`** 與 **`role="status"`** |

---

## 5. 維護閉環

- 變更 **`SystemSettingsSnapshot`** 欄位、**驗證規則**或 **審計 `detail`** 時：同步本檔、**`docs/seq15-scheduling-pdf02-traceability.md`**（排班域）、**`pdf-sequenced-gap-checklist.md`** Seq 29、**`pdf-sequenced-gap-checklist-revision-log.md`**（**`docs/pdf03-cursorrules-alignment.md`** §4）。
- **下一序號（02 模組鏈結束）**：母本 **03** 工程治理 **Seq 35** — **`docs/seq35-pdf03-cursorrules-alignment-traceability.md`**（對 **`docs/pdf03-cursorrules-alignment.md`** 換版差異與閉環）；鏈 **Seq 36～38** 見該檔與 **`pdf-sequenced-gap-checklist.md`** **C 區**。

---

## 6. 院舍政策版本（客戶定案 2026-05-09）

**多表**＋**`effective_from` 分段生效**、版本不重疊、Team Lead／Admin 變更＋二次確認與備註、分期驗收（P1／P2）。詳見：

| 檔案 | 用途 |
|------|------|
| **`docs/system-settings-policy-prd-2026-05-09.md`** | PRD：R1～R7、流程、分期、與 `scheduling_rules` 接軌策略 |
| **`docs/system-settings-policy-schema-2026-05-09.md`** | 表清單、欄位概念、排班／報表讀版規則 |
| **`docs/scheduling-policy-edge-function-contract.md`** | Edge **`scheduling-policy-*`** 五支請求／回應契約（讀：staff／teamlead／admin；寫：teamlead／admin） |
| **`supabase/migrations/20260509153000_facility_scheduling_policy_versioned_skeleton.sql`** | PostgreSQL **表／觸發器**（單檔 ≤200 行） |
| **`supabase/migrations/20260509153100_facility_scheduling_policy_versioned_rls.sql`** | **RLS**（SELECT）；寫入預設走 Edge |

---

| 日期 | 說明 |
|------|------|
| 2026-05-04 | 初版：Seq 29 **對照骨架**（02【16】末序）；與 Seq 28 互鏈。 |
| 2026-05-04 | §5：補 **Seq 35～38**（03／C 區）對照骨架互鏈。 |
| 2026-05-09 | §6：院舍政策版本 PRD／Schema／Edge 契約／migration（**153000** 表、**153100** RLS）；客戶回函定案互鏈。 |
| 2026-05-12 | §4：補 **policy P1 demo E2E**、**`useSystemSettingsPolicySync`**／**`schedulingPolicyRepository`** Vitest；§6 契約敘述改 **五支** Edge。 |
| 2026-05-12 | §1／§4：政策版本列表於 **`loadError`** 顯示引導；**`SystemSettingsPolicyVersionsListCard.test.tsx`**。 |
| 2026-05-12 | §1／§4：**`reloadPolicy`** 手動重試讀取；**`useSystemSettingsPolicySync.reload.test.ts`**。 |
| 2026-05-12 | §1：版本列表 **`loadError`** 卡同掛 **重新載入**（與目前版卡一致）。 |
| 2026-05-12 | §1：提交鈕 **`isPolicyLoading`** 停用；成功後 **`loadPolicy`** 靜默刷新。 |
| 2026-05-12 | §1／§4：**`loadPolicy`** 回傳 **`{ ok }`**；提交後靜默刷新失敗時 **`submitMessage`** 補述；**`postCommitRefresh`** Vitest。 |
| 2026-05-12 | §1：**`SystemSettingsPolicySubmitCard`** 於 **`isPolicyLoading`** 附 **`role="status"`** 說明。 |
| 2026-05-12 | §1：**`SystemSettingsPolicySubmitCard`**：**`isSubmitting`** 併入 **`role="status"`**（與載入互斥單節點；提交中優先）。 |
| 2026-05-12 | §1／§4：提交卡 **`aria-busy`**；**`SystemSettingsPolicySubmitCard.test.tsx`** 斷言。 |
| 2026-05-12 | §1：目前版／版本列表 **重載鈕** 於 **`isSubmitting`** 時 **disabled**（與提交鎖並行）。 |
| 2026-05-12 | §1／§4：**`loadPolicy`** 遇 **`lockRef`** 早退（**`bypassSubmitLock`** 僅提交成功後靜默刷新）；**`submitLockLoadPolicy`** Vitest。 |
| 2026-05-12 | §1／§4：**目前版／版本列表** **`article`** **`aria-busy`**；**`CurrentPolicyVersionCard.test`**／擴充 **VersionsListCard.test**。 |
| 2026-05-12 | §1／§4：**`ListSectionPanel`** **`section aria-labelledby`**；**`ListSectionPanel.test`**；**policy P1 demo E2E** 斷言 **section** 與政策標題 **id**。 |
| 2026-05-12 | §1／§4：本機儲存 **`save`** **`setTimeout(0)`**；**`SystemSettingsHome`** **`role="group"`** **`aria-busy`**；**`useSystemSettings.saveSavingState.test`**；**policy P1 demo E2E** 本機 **group**。 |
| 2026-05-12 | §1／§4：**`SystemSettingsPdf16Section`** **`section aria-labelledby`**（**`h2`** **id**）；**`SystemSettingsPdf16Section.test`**；**policy P1 demo E2E** 斷言 **智能排班設定** 區段。 |
| 2026-05-12 | §4：**policy P1 demo E2E** 補 **復康服務基本設定** **`section[aria-labelledby]`** 與 **`id`** 有別於智能排班。 |
| 2026-05-12 | §1／§4：**`AuditTrailPanel`** 標題 **`useId`**（取代固定 **`audit-trail-heading`**）；**`AuditTrailPanel.test`**；**policy P1 demo E2E** 審計 **section**。 |
| 2026-05-12 | §4：**`e2e/smoke`** 於 **`#system-settings`** 斷言本機 **`group`**（Seq 29）。 |
| 2026-05-09 | §4：**`e2e/smoke`** 於 **`#system-settings`** 補 **政策版本（P1）** 區 **`heading`** 可見。 |
| 2026-05-09 | §4：**`e2e/smoke`** 於 **`#system-settings`** 補 **儲存設定（本機）** 與無 Edge 說明（**未偵測到 Supabase 環境變數**）。 |
| 2026-05-09 | §1／§4：**`ListSectionPanel`** 展開鈕 **`aria-controls`**、內容區 **`hidden`**；擴充 **`ListSectionPanel.test`**。 |
| 2026-05-09 | §1／§4：**`AuditTrailPanel`** 展開鈕 **`aria-controls`**、可摺疊內容 **`hidden`**；擴充 **`AuditTrailPanel.test`**。 |
| 2026-05-09 | §4：**`ListSectionPanel.test`**／**`AuditTrailPanel.test`** 補 **`defaultExpanded`** 邊界。 |
| 2026-05-09 | §4：**`e2e/smoke`** 審計收合測試斷言 **`aria-controls`**／**`hidden`**（**`#staff-import`**）。 |
| 2026-05-09 | §4：**`e2e/system-settings-policy-p1-demo`** 補 **資助復康** **`ListSectionPanel`** **`aria-controls`**／**`hidden`**。 |
| 2026-05-09 | §4：**`e2e/smoke`** 於 **`#system-settings`** 補 **政策版本** **`ListSectionPanel`** 預設展開（**`aria-controls`**）。 |
| 2026-05-09 | §4：**`e2e/system-settings-policy-p1-demo`** 補 **排班時間設定**（**`h3`**）**`ListSectionPanel`** 預設展開。 |
| 2026-05-09 | §4：**`e2e/system-settings-policy-p1-demo`** 補 **排班規則設定（P1）** **`ListSectionPanel`** 預設展開。 |
| 2026-05-09 | §4：**`e2e/smoke`** 於 **`#system-settings`** 補 **Pdf16 智能排班** 內 **排班時間**／**排班規則** **`ListSectionPanel`**（**`aria-controls`**、無 **`hidden`**、兩內容區 **`id`** 有別）。 |
| 2026-05-09 | §4：**`e2e/smoke`** 於 **`#system-settings`** 補 **Pdf16 復康** 內 **資助復康** **`ListSectionPanel`** 預設收合（**`aria-controls`**、**`hidden`**）。 |
| 2026-05-09 | §4：**`e2e/smoke`** 於 **`#system-settings`** 補本機 **`group`** **`aria-busy="false"`**（與 **policy P1 demo E2E** 對齊）。 |
| 2026-05-09 | §4：**`SystemSettingsHome.test`** 補 **審計** **`h3`** 標題可見；**`getByRole`** 移除 **`exact`** 以符合 **typecheck**。 |
| 2026-05-09 | §4：**`SystemSettingsHome.test.tsx`**：**`SystemSettingsHome`** 輕量整合（**`useAuth`**／**`useAuditTrailList`** mock）。 |
| 2026-05-09 | §4：**`SystemSettingsRulesTogglesCard.test`**／**`SystemSettingsSpecialCareCard.test`**：規則總開關與 **SC** **checkbox** **`setField`**（Vitest）。 |
| 2026-05-09 | §4：**`SystemSettingsNumericCapsCard.test.tsx`**：P1 數字上限欄位與 **`setField`**（Vitest）。 |
| 2026-05-09 | §4：**`SystemSettingsSchedulingWindowsCard.test.tsx`**：**排班時間設定**卡欄位與 **`setField`** 委派（Vitest）。 |
| 2026-05-09 | §4：**`SystemSettingsPdf16Section.test`** 斷言 **`description`** 說明段落呈現；**`afterEach(cleanup)`** 避免同檔連測 DOM 堆疊。 |
| 2026-05-09 | §4：**`SystemSettingsPdf16Section.test`** 補 **復康服務基本設定** 標題 **`aria-labelledby`** 用例。 |
| 2026-05-09 | §4：**`README.md`** 常用指令：**`test:e2e:smoke`** 註解補 **`#system-settings`** Seq 29 P1 煙霧與 **`docs/seq29-system-settings-pdf02-traceability.md`** 第 4 節對照。 |
| 2026-05-09 | §4：**`e2e/smoke`** 於 **`#system-settings`** 補 **政策版本**／**審計** **`section[aria-labelledby]`**（與 **policy P1 demo E2E** 對齊）。 |