# Seq 29：系統設定（PDF 02【16】）對照骨架

> **對照**：母本 **`docs/pdf/02-STARCARE-智能院舍照護管理系統.pdf`** **【16】**；條文整理 **`docs/business-logic.md`**（排班視窗與 **Seq 15** 引擎）；序號總表 **`docs/pdf-sequenced-gap-checklist.md`** Seq **29**；P0 **`docs/pdf-alignment-p0-backlog.md`** Seq **29**。  
> **上一序號**：**`docs/seq28-user-manual-pdf02-traceability.md`**（用戶手冊【15】）。  
> **用途**：將 **排班視窗、非治療時段、規則／服務開關、SC 僅治療師、本機儲存、審計、跨模組重載** 與母本對表；標示 **院舍設定後端 API** 與 **PDF 逐欄簽核** 缺口。  
> **UAT／Staging（P1）**：**`docs/uat/system-settings-policy-p1-uat-and-staging-2026-05-09.md`**；**對客範本**：**`docs/system-settings-policy-customer-reply-2026-05-09.md`**。

> **全案收尾與證據留痕**：**`README.md`**「專案收尾」（**`docs/business-logic.md`** §0 **全案收尾執行** 併述 **README** 表前互鏈指引（含各檔 **對照**／**全案收尾母索引**）；**`docs/project-completion-*.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log.md`** 及歸檔 **`docs/pdf-sequenced-gap-checklist-revision-log-2026-05-01a.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p2.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p3.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p4.md`**）；**`docs/project-completion-evidence-index-2026-05.md`**；**`docs/project-completion-kickoff-checklist-2026-05.md`**；Gate A 自動證據固定入口 **`docs/evidence/gate-a-latest.md`**（檔內 **Next Command** 與 **`preflight:strict`** 並列；**`npm run gatea:evidence:list`**／**`npm run gatea:evidence:refresh`**／**`npm run gatea:evidence:preflight:strict`**；檔尾 blockquote 四行：**`gateALatestMarkdownFooterLines`**（**`docs/gate-a-status-2026-05-06-commands-appendix.md#gate-a-appendix-latest-segment`** 下文 **`latest`** 段））；多數 **`gatea:evidence:*`** 終端 stdout 頁尾 **`scripts/gate-a-markdown-footer.mjs`**（**Export 契約**）。

---

## 1. 畫面與模組

| 區塊 | 元件／Hook | 說明 |
|------|------------|------|
| 排班與時段 | **`SystemSettingsHome`** 首段 | **HH:mm** 欄位：`schedulingWindowStart`／`End`、`nonTherapyWindowStart`／`End`；**開工準備**開關（`SHIFT_PREP_BLOCK`）。 |
| 數字上限（P1） | **`SystemSettingsNumericCapsCard`** | 與 Edge **`numericLimits`** 對齊；提交時併入 **`mergeP1DraftIntoPolicyBundle`**。 |
| 政策版本（雲端提交） | **`SystemSettingsCurrentPolicyVersionCard`**、**`SystemSettingsPolicySubmitCard`**、**`useSystemSettingsPolicySync`** | **`schedulingPolicyRepository`** → current-get 摘要／validate／commit；**`X-Idempotency-Key`**。 |
| 規則與服務 | 第二段 | **`rulesEngineEnabled`**、**`fixedActivitiesEnabled`**、**`serviceTypesEnabled`**。 |
| SC | 第三段 | **`specialCareTherapistOnly`**（與 DB **`scheduling_rules.allow_sc_therapist_only`** 併用敘述見主檔）。 |
| 儲存 | **`useSystemSettings`** | **`validateSystemSettings`**、**`lockRef`**、**`SYSTEM_SETTINGS_SAVE`** 審計。 |
| 審計 | **`AuditTrailPanel`**（頁底） | 與 **Seq 12** 同源；**`SYSTEM_SETTINGS_SAVE`** 亦進 **Seq 27** 通知。 |

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
| `systemSettingsValidation.test.ts` | 驗證規則 |
| `systemSettingsExternalStore.test.ts` | 版本 bump |
| `e2e/smoke.spec.ts` | **`#system-settings`**、**系統設定與相關審計** |

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
| **`docs/scheduling-policy-edge-function-contract.md`** | Edge **`scheduling-policy-*`** 四端點請求／回應契約（讀：staff／teamlead／admin；寫：teamlead／admin） |
| **`supabase/migrations/20260509153000_facility_scheduling_policy_versioned_skeleton.sql`** | PostgreSQL **表／觸發器**（單檔 ≤200 行） |
| **`supabase/migrations/20260509153100_facility_scheduling_policy_versioned_rls.sql`** | **RLS**（SELECT）；寫入預設走 Edge |

---

| 日期 | 說明 |
|------|------|
| 2026-05-04 | 初版：Seq 29 **對照骨架**（02【16】末序）；與 Seq 28 互鏈。 |
| 2026-05-04 | §5：補 **Seq 35～38**（03／C 區）對照骨架互鏈。 |
| 2026-05-09 | §6：院舍政策版本 PRD／Schema／Edge 契約／migration（**153000** 表、**153100** RLS）；客戶回函定案互鏈。 |
