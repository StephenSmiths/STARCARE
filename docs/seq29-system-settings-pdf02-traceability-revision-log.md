# Seq 29：系統設定（PDF 02【16】）修訂紀錄

> **對照**：技術對照骨架 **`docs/seq29-system-settings-pdf02-traceability.md`**（**§1–§6**）；序號總表 **`docs/pdf-sequenced-gap-checklist.md`** Seq **29**；**`docs/pdf03-cursorrules-alignment.md`** §4 **Seq 29** 維護項。  
> **全案收尾與證據留痕**：**`README.md`**「專案收尾」（**`docs/business-logic.md`** §0 **全案收尾執行** 併述 **README** 表前互鏈指引（含各檔 **對照**／**全案收尾母索引**）；**`docs/project-completion-*.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log.md`** 及歸檔 **`docs/pdf-sequenced-gap-checklist-revision-log-2026-05-01a.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p2.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p3.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p4.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p5.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-seq29-2026-05-09b.md`**）；**`docs/project-completion-evidence-index-2026-05.md`**；**`docs/project-completion-kickoff-checklist-2026-05.md`**；Gate A 自動證據固定入口 **`docs/evidence/gate-a-latest.md`**（檔內 **Next Command** 與 **`preflight:strict`** 並列；**`npm run gatea:evidence:list`**／**`npm run gatea:evidence:refresh`**／**`npm run gatea:evidence:preflight:strict`**；檔尾 blockquote 四行：**`gateALatestMarkdownFooterLines`**（**`docs/gate-a-status-2026-05-06-commands-appendix.md#gate-a-appendix-latest-segment`** 下文 **`latest`** 段））；多數 **`gatea:evidence:*`** 終端 stdout 頁尾 **`scripts/gate-a-markdown-footer.mjs`**（**Export 契約**）；人工 **`docs/gate-a-manual-evidence-checklist-2026-05-06.md`** 開首（strict-http／keep=1；**`docs/go-live-checklist.md`** §0.1）。

---

## 修訂紀錄

| 日期 | 說明 |
|------|------|
| 2026-05-09 | 開首 **CI** 句併 **`docs/seq35-pdf03-cursorrules-alignment-traceability.md`** §3（與 **§5** **pdf03** §3 維護併讀）。 |
| 2026-05-09 | §5：**`seq35-pdf03-cursorrules-alignment-traceability.md`** §3 維護閉環補 **pdf03** **Seq 29** 政策 PR 檢核與 **`seq29`** 主檔／修訂表互鏈（**03** C 區；與上列 **seq29** §5 主檔列併讀）。 |
| 2026-05-09 | §5：**`seq29-system-settings-pdf02-traceability.md`** 維護閉環補 **`pdf03-cursorrules-alignment.md`** §3 **validate／commit** 檢核列與三 **`schedulingPolicyRepository.*.test.ts`** 檔名（與上列 **pdf03** 修訂列併讀）。 |
| 2026-05-09 | §4／§5：**`pdf03-cursorrules-alignment.md`** §3 PR 檢核／§4 **Seq 29** 維護：政策 **Vitest** 列補 **`schedulingPolicyRepository.listPolicyVersionSummaries.test.ts`**／**`schedulingPolicyRepository.edgeResponseJson.test.ts`**（與 **`seq29-system-settings-pdf02-traceability.md`** §4 並讀）。 |
| 2026-05-09 | §4／§5：**`schedulingPolicyRepository.ts`** **`throwIfNetworkFailure`**；**getCurrent**／**list**／**validate**／**commit** **`response.json()`** 解析失敗併連線包裝（與上列 **pdf03** **Vitest** 列併讀）。 |
| 2026-05-09 | §4／§5：**`schedulingPolicyRepository.ts`** **`EdgeSchedulingPolicyRepository`** 四方法 **`fetch`** **try／catch**（**請先登入** 原樣拋出；其餘統一連線訊息與 **`cause`**）；Vitest **`schedulingPolicyRepository.edgeReadWrite.test.ts`**／**`schedulingPolicyRepository.listPolicyVersionSummaries.test.ts`** **連線包裝**；**`seq15-scheduling-pdf02-traceability.md`** §4／§5；主修訂日誌 **註** 併 **`docs/pdf-sequenced-gap-checklist-revision-log-archive-seq29-2026-05-09b.md`** 表末列。 |
| 2026-05-09 | §4：**`schedulingPolicyRepository.edgeReadWrite.test.ts`** 連線包裝補 **validate** **`fetch`** 拒絕、**commit** **請先登入** 不觸 **`fetch`**（與上列 **Edge** **try／catch** 併讀）。 |
| 2026-05-09 | **§4**／開首 **Demo E2E**：**`e2e/auth-login.system-settings-p2.spec.ts`**（**`npm run test:e2e:auth`**、優先 **`E2E_AUTH_TEAMLEAD_*`**／**`E2E_AUTH_ADMIN_*`**、**`VITE_SUPABASE_*`**）；**`.env.example`** 註解；**`playwright.auth.config.ts`** 檔首；併 **Vitest** **`SystemSettingsHome.policyP2Titles.test.tsx`** 列。 |
| 2026-05-09 | **UAT** 增 **二之二**（**P2** Staging）；**§4** **demo E2E** 列補 **P2** 手動；**§5** 維護句併 **二之二**；開首 **UAT** 括註 **P1**／**P2**；**`business-logic.md`** §0、**`pdf03-cursorrules-alignment.md`**、**`feature-list.md`**、**`client-delivery-remediation-plan.md`**、**`pdf-alignment-p0-backlog.md`** 全鏈互鏈；**Vitest** **`SystemSettingsHome.policyP2Titles.test.tsx`**（**P2** **h3**）。 |
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
| 2026-05-09 | §4：**`README.md`**：**`test:e2e:smoke`** 註解補 **`#system-settings`** **審計** 展開收合煙霧。 |
| 2026-05-23 | §6 **P1** 列：**UAT** 補 **二之一**；**`pdf-alignment-p0-backlog.md`** Seq 29：五支 Edge、**UAT**／**demo E2E** 互鏈；**`business-logic.md`** §0 補 **UAT**／**demo** 一句。 |
| 2026-05-23 | **`README.md`** 文件表與 **`pdf03`** §3：**Seq 29** PR 檢核併 **runbook**／**go-live**／**`seq29`** §5／**`feature-list`** §7。 |
| 2026-05-23 | **`pdf03`** §4／**`feature-list`** §7：**Seq 29** 維護與 **`scheduling-policy-*`** 列補 **runbook**／**go-live**／**`seq29`** §5。 |
| 2026-05-23 | **§5**：維護閉環增 **runbook**／**go-live**／**UAT** **二之一** 對齊；**`supabase-deploy-runbook.md`** §2／§6、**`docs/uat/system-settings-policy-p1-uat-and-staging-2026-05-09.md`** **二之一** 互鏈。 |
| 2026-05-23 | **`go-live-checklist.md`** §5：Edge 契約勾選項補 **UAT** **二之一** 與 **demo** **Playwright** 指令互鏈。 |
| 2026-05-13 | **Schema** 開首互鏈 **seq29**／**UAT** **二之一**／**demo E2E**；**`docs/feature-list.md`** §8 第 5 點補 **二之一** 與 **seq29** 第 4 節。 |
| 2026-05-13 | **Edge 契約**（**`docs/scheduling-policy-edge-function-contract.md`**）開首補 **前端 demo 煙霧**；**`docs/pdf03-cursorrules-alignment.md`** §3 **Seq 29** 檢核併列 **`test:e2e:smoke`** 與 **UAT** **二之一**。 |
| 2026-05-13 | **PRD** 開首 **Demo E2E** 併列 **`test:e2e:smoke`** 與 **UAT** **二之一**。 |
| 2026-05-13 | 開首 **Demo E2E** 併列 **`test:e2e:smoke`**（**`#system-settings`**）；**`docs/system-settings-policy-customer-reply-2026-05-09.md`** 開首互鏈 **UAT** **二之一**。 |
| 2026-05-13 | 開首 **UAT** 互鏈補 **二之一** 無 env 煙霧；**`docs/uat/system-settings-policy-p1-uat-and-staging-2026-05-09.md`** 增 **二之一** 與 **§四** 修訂紀錄。 |
| 2026-05-09 | §4：**`README.md`**：**`test:e2e:smoke`** 註解補 **`#system-settings`** 政策收合／**`Set.size === 5`**。 |
| 2026-05-09 | §4：**`e2e/smoke`** 於 **`#system-settings`** 補 **政策版本** **收合**／**展開** 與五區 **`aria-controls`** **`id`** **`Set.size === 5`**（與 **policy P1 demo E2E** 對齊）。 |
| 2026-05-09 | §4：**`README.md`**：**`test:e2e:system-settings-policy`** 註解補政策清單收合／**`Set.size === 5`**。 |
| 2026-05-09 | §4：**`e2e/system-settings-policy-p1-demo`** 補 **政策版本** **`ListSectionPanel`** **收合**／**展開**、復康內層於 **`rehabPdfSection`** 篩選、五區 **`aria-controls`** **`id`** **`Set.size === 5`**。 |
| 2026-05-09 | §4：**`README.md`**：**`test:e2e:system-settings-policy`** 註解補 **審計** 展開收合與 **seq29** §4 互鏈。 |
| 2026-05-09 | §4：**`e2e/system-settings-policy-p1-demo`** 補 **審計** **展開**／**收合** 與 **`aria-controls`**／**`hidden`**／搜尋 **`placeholder`**（與 **`e2e/smoke`** **`#system-settings`** 對齊）。 |
| 2026-05-09 | §4：**`e2e/smoke`** 於 **`#system-settings`** 補 **審計** **展開**／**收合** 與 **`aria-controls`**／**`hidden`**／搜尋 **`placeholder`**（與 **`#staff-import`** 單測及 **`SystemSettingsHome.interactions`** Vitest 對齊）。 |
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
| 2026-05-09 | §4：**`SystemSettingsHome.test.tsx`** 拆為 **`SystemSettingsHome.smoke.test.tsx`**／**`SystemSettingsHome.interactions.test.tsx`**（單檔維護與 **200** 行規則）。 |
| 2026-05-09 | §4：**`SystemSettingsHome.test`** 第四用例：**政策版本** **`ListSectionPanel`** **收合**／**展開** 與 **`hidden`**。 |
| 2026-05-09 | §4：**`SystemSettingsHome.test`** 第三用例：**資助復康** 展開後 **SC** 文案（對齊 **policy P1 demo E2E**）。 |
| 2026-05-09 | §4：**`SystemSettingsHome.test`** 第二用例：**審計** 展開／收合與 **`placeholder`**（對齊 **smoke** **#staff-import**）。 |
| 2026-05-09 | §4：**`SystemSettingsHome.test`**：**五區** **`aria-controls`** 目標 **`id`** 改以 **`Set.size === 5`** 斷言全相異。 |
| 2026-05-09 | §4：**`SystemSettingsHome.test`** 補 **政策／審計／排班時間** **`aria-controls`** 目標 **`id`** 兩兩有別。 |
| 2026-05-09 | §4：**`SystemSettingsHome.test`** 補 **`AuditTrailPanel`** **展開審計**／內容 **`hidden`**。 |
| 2026-05-09 | §4：**`SystemSettingsHome.test`** 補 **`ListSectionPanel`** **`aria-controls`**／內容區 **`hidden`** 與排班兩區 **`id`** 有別。 |
| 2026-05-09 | §4：**`SystemSettingsHome.test`** 補 **ListSectionPanel** 預設 **收合**／**展開** 鈕（**`within`** 範圍）。 |
| 2026-05-09 | §4：**`SystemSettingsHome.test`** 補 **Pdf16** 內層 **ListSectionPanel** **`section[aria-labelledby]`** 嵌於正確大節。 |
| 2026-05-09 | §4：**`SystemSettingsHome.test`** 補 **Pdf16**／**政策**／**審計** **`section[aria-labelledby]`** landmark。 |
| 2026-05-09 | §4：**`SystemSettingsHome.test`** 補 **排班規則**／**資助復康** **`h3`** 與本機 **`group`** **`aria-busy`**。 |
| 2026-05-09 | §4：**`SystemSettingsHome.test`** 補 **排班時間設定** **`h3`**、無 Edge **Supabase** 說明；**`supabaseBrowserEnv`** mock 使 **CI** 具 **`VITE_SUPABASE_*`** 時仍與 **demo** 一致。 |
| 2026-05-09 | §4：**`SystemSettingsHome.test`** 補 **審計** **`h3`** 標題可見；**`getByRole`** 移除 **`exact`** 以符合 **typecheck**。 |
| 2026-05-09 | §4：**`SystemSettingsHome.test.tsx`**：**`SystemSettingsHome`** 輕量整合（**`useAuth`**／**`useAuditTrailList`** mock）。 |
| 2026-05-09 | §4：**`SystemSettingsRulesTogglesCard.test`**／**`SystemSettingsSpecialCareCard.test`**：規則總開關與 **SC** **checkbox** **`setField`**（Vitest）。 |
| 2026-05-09 | §4：**`SystemSettingsNumericCapsCard.test.tsx`**：P1 數字上限欄位與 **`setField`**（Vitest）。 |
| 2026-05-09 | §4：**`SystemSettingsSchedulingWindowsCard.test.tsx`**：**排班時間設定**卡欄位與 **`setField`** 委派（Vitest）。 |
| 2026-05-09 | §4：**`SystemSettingsPdf16Section.test`** 斷言 **`description`** 說明段落呈現；**`afterEach(cleanup)`** 避免同檔連測 DOM 堆疊。 |
| 2026-05-09 | §4：**`SystemSettingsPdf16Section.test`** 補 **復康服務基本設定** 標題 **`aria-labelledby`** 用例。 |
| 2026-05-09 | §4：**`README.md`** 常用指令：**`test:e2e:smoke`** 註解補 **`#system-settings`** Seq 29 P1 煙霧與 **`docs/seq29-system-settings-pdf02-traceability.md`** 第 4 節對照。 |
| 2026-05-09 | §4：**`e2e/smoke`** 於 **`#system-settings`** 補 **政策版本**／**審計** **`section[aria-labelledby]`**（與 **policy P1 demo E2E** 對齊）。 |
| 2026-05-09 | **§5**：維護閉環增 **`.github/workflows/ci.yml`** 檔首 **Seq 29【16】** 專段；**`scheduling-policy-edge-function-contract.md`** §7 初版「四端點」修訂列括註（嗣後五支 Edge）。 |
| 2026-05-09 | **`pdf03-cursorrules-alignment.md`** §3 **文件入口**／§4 **Seq 29** 維護與 **`feature-list.md`** §8 第 7 點：**`ci.yml`** **Seq 29【16】** 專段與 **UAT** **二之一**／本檔 §4 對齊敘述。 |
| 2026-05-12 | 開首增 **CI（Seq 29）** 對照（**`ci.yml`**、**`npm run ci`**、**`pdf03`** §3、本檔 **§5**）；**`README.md`** 常用指令 **CI** 列互鏈 **pdf03**／本檔第 4 節。 |
| 2026-05-13 | **`feature-list.md`** §8 第 3 點：**README** **CI** 短列補 **Seq 29**／**`pdf03`** §3／本檔第 4 節；**`pdf03`** §4：**README** 維護句併 **CI** 列；**Seq 29** 維護檢視句併 **`feature-list`** §8 第 3 點；**§5** **CI／E2E** 維護句併 **`feature-list`** §8 第 3 點。 |
| 2026-05-14 | **UAT** **二之一** 段末 **工程維護互鏈**；**`go-live-checklist`** §5 前向煙霧句併 **工程維護**；開首 **UAT** 括註對齊；**§5** **runbook**／**go-live** 維護句併 **二之一** 段末互鏈。 |
| 2026-05-15 | **全鏈括註**：**`runbook`** §2／§6、**`business-logic`** §0、**Edge 契約** 開首、**P0 backlog** Seq 29、**`feature-list`** Edge 表、**PRD** 開首、**`pdf03`** §3、**§5** **CI／E2E** 句之 **UAT** **二之一**（段末 **工程維護互鏈**）。 |
| 2026-05-16 | **Schema**／**對客範本**／**PRD** §6 **P1**、**`feature-list`** §8 第 5 點、**`README`** 文件表與 **CI**、**`pdf-sequenced`** 主表 Seq 29 列：**UAT** **二之一** 補「段末 **工程維護互鏈**」括註。 |
| 2026-05-09 | **§5**：維護句增 **`client-delivery-remediation-plan.md`** §2 第 4 點（**Seq 29** 前向煙霧）對齊；**`pdf03`** §4 **Seq 29** 維護檢視句併 **`client-delivery`** §2；**`client-delivery`** §2 句末補 **UAT** **二之一**／**`seq29`**（與 **2026-05-15**／**2026-05-16** 列並讀）。 |
| 2026-05-09 | **`ci.yml`**／**`pdf03`** §3／§4、**`.env.example`**、**`package.json`**：**Seq 29【16】** demo／E2E 鍵、**UAT** **二之一**；維護句互鏈 **§5**。 |
| 2026-05-09 | **`feature-list.md`** §8 第 3 點：**CI** 括註併 **`.env.example`** **Seq 29【16】** demo 煙霧與 **`package.json`** 鍵名；**`pdf03`** §4 **README** 維護句同補；**§5** **CI／E2E** 維護句併 **§8** 第 3 點括註。 |
| 2026-05-09 | **P2**（固定活動／Pass）：**`policyFixedActivities`**、**`SystemSettingsFixedActivitiesCard`**、**`policySubsidizedPassOrder`**、**`SystemSettingsPassOrderCard`**、**`mergeP1DraftIntoPolicyBundle`**／**`p1FieldsFromPolicyBundle`**、**`policyPassOrderDraft`**；Vitest 見 §4。 |
| 2026-05-09 | **P2 切片（資助復康三列＋職類矩陣 48 格）**：**`policySubsidizedTiers`**／**`policySubsidizedRoleOfferings`** 與 **`*Hydrated`**、**`policySubsidizedTierDraft`**、**`policySubsidizedRoleOfferingDraft`**、**`POLICY_SUBSIDIZED_ROLE_TYPES`**／**`POLICY_SLOT_VARIANTS`**、**`SystemSettingsSubsidizedTiersCard`**／**`SystemSettingsSubsidizedRoleOfferingsCard`**、**`mergeP1DraftIntoPolicyBundle`**／**`p1FieldsFromPolicyBundle`**、**`systemSettingsValidation`**、**`systemSettingsRepository`**；**§1**／**§4**；Vitest **`merge`／`p1Fields`／`validation`** 與 P2 卡測試彙整列。 |
| 2026-05-09 | **P2 認知＋Edge validate**：**`policyDementiaDraft`**、**`SystemSettingsDementiaPolicyCard`**；**`schedulingPolicyDraftCompleteness`** 與 **`scheduling-policy-edge-function-contract.md`** **§4.3**／**§5.2**（**`BAD_TIER_COUNT`** 等）。 |
| 2026-05-09 | §1／§4／**PRD** §4：**`SystemSettingsPolicySubmitCard`** **`validate`**／**`commit`** 校驗說明與 **`useSystemSettingsPolicySync.test`** **commit** **`errors`**。 |
| 2026-05-09 | 修訂表自 **`seq29-system-settings-pdf02-traceability.md`** 拆出至本檔（主檔 **§1–§6** 技術骨架 ≤200 行；與 **`pdf-sequenced-gap-checklist-revision-log.md`** **Seq 29** 列併讀）。 |
| 2026-05-09 | **互鏈延伸**：**UAT** **二之一**（表列 **`test:e2e:smoke`**、**工程維護互鏈**）、**`.env.example`**、**`system-settings-policy-schema-2026-05-09.md`**、**`system-settings-policy-customer-reply-2026-05-09.md`**、**`business-logic-revision-log.md`** **2026-05-23** 列、**`client-delivery-remediation-plan.md`** 修訂表併列本檔；**`pdf-sequenced-gap-checklist-revision-log.md`** 同日留痕（與 **§5** 並讀）。 |
| 2026-05-09 | **PRD** 開首：**既有對照骨架**／**Demo E2E** 併本檔路徑（**`system-settings-policy-prd-2026-05-09.md`**）。 |
| 2026-05-09 | **Edge 契約** 開首：**對照**／**前端 demo 煙霧** 併本檔路徑（**`scheduling-policy-edge-function-contract.md`**）。 |
| 2026-05-09 | **`npm run ci` 與 Actions 對齊**：**`package.json`** **`ci`** 併 **`perf:bundle:ci`**、**`list-section-collapse`** **Playwright**；**`ci.yml`** 檔首、**`README`**、**`feature-list`** §8、**`pdf03`** §4、本檔 **CI（Seq 29）** 句。 |
| 2026-05-09 | **UAT** **二之二**／**`pdf03`**：**`system-settings-policy-p1-uat-and-staging-2026-05-09.md`** 前提段補 **`test:e2e:auth`** **`e2e/auth-login.system-settings-p2.spec.ts`**；**`pdf03-cursorrules-alignment.md`** §3／§4 **Seq 29** 維護句併 **`test:e2e:auth`**、Vitest **`SystemSettingsHome.policyP2Titles.test.tsx`**（與 **§4** **P2** 列並讀）。 |
| 2026-05-09 | **Seq 29／P2 auth E2E TeamLead**：**`e2e/auth-login.system-settings-p2.spec.ts`** 優先 **`E2E_AUTH_TEAMLEAD_*`**，否則 **`E2E_AUTH_ADMIN_*`**；**`.env.example`**、**`seq29-system-settings-pdf02-traceability.md`** 開首／§4、**`playwright.auth.config.ts`**、**`.github/workflows/ci.yml`**、**`feature-list.md`** §8 第 6 點、**`pdf03-cursorrules-alignment.md`** §3／§4、**`uat/...`** **二之二** 對齊。 |
| 2026-05-09 | **README**／**`go-live-checklist`** §1.1／§5／**`runbook`** §6：**`npm run test:e2e:auth`**、**P2** **`h3`**、**`E2E_AUTH_TEAMLEAD_*`** 優先之可發現性互鏈（與 **`e2e/auth-login.system-settings-p2.spec.ts`**、**`seq29`** 開首並讀）。 |
| 2026-05-09 | **`business-logic.md`** §0 院舍政策段：**`test:e2e:auth`** **`auth-login.system-settings-p2`** 前向（**`seq29`** 開首、**`go-live-checklist`** §1.1）；**`business-logic-revision-log.md`**。 |
| 2026-05-09 | **§5** 維護句：**`business-logic.md`** §0 **院舍政策** 段併 **`test:e2e:auth`** **P2** **`h3`** 前向。 |
| 2026-05-09 | **主修訂日誌歸檔**：**`pdf-sequenced-gap-checklist-revision-log.md`** 同日 **Seq 29** 互鏈批量 **16** 列移出至 **`docs/pdf-sequenced-gap-checklist-revision-log-archive-seq29-2026-05-09b.md`**（主檔 ≤200 行）；開首 **註**／blockquote 補 **`archive-seq29-2026-05-09b`** 入口。 |
| 2026-05-09 | 開首 **全案收尾** blockquote 長鏈補 **`docs/pdf-sequenced-gap-checklist-revision-log-archive-seq29-2026-05-09b.md`**；與 **`pdf-sequenced-gap-checklist-revision-log.md`** **歸檔副檔 seq29 互鏈全案（跨檔補鏈）** 列併讀。 |
| 2026-05-09 | **PRD** §7／**ADR-0001**：補 **`scheduling-rules-get`** **路徑 B** **`groupCapacityLimit`** 合併實作進度與附註（與 **`scheduling-policy-edge-function-contract.md`**、主修訂日誌、**`seq29-system-settings-pdf02-traceability.md`** §3 並讀）。 |
| 2026-05-09 | **資助復康多段非治療**：**`subsidizedRehabNonTherapyIntervals`**、**`filterSchedulingSessionsForSubsidizedEngine`**、**`p1FieldsFromPolicyBundle`**、**`mergeP1DraftIntoPolicyBundle`**（**MORNING_DOC**/**AFTERNOON_DOC**/**OTHER** 提交保留）、**`useSystemSettings`** **`setField`**；主表／**`seq29`** §3／主修訂日誌。 |
| 2026-05-09 | **多段 UI**：**`SystemSettingsNonTherapyIntervalsEditor`**、**`p1FieldsFromPolicyBundle`** 條件附加 **`subsidizedRehabNonTherapyIntervals`**、**`mergeP1`** **OTHER**／雲端 **OTHER**、**`setField(undefined)`** 刪鍵、**`subsidizedRehabNonTherapyIntervals.policy.test`**；**§1** 排班與時段列。 |
| 2026-05-09 | **`scheduling-rules-get`** 延伸：**`enableSubsidizedRehab`**／**`enableDementiaCare`**／**`allowScTherapistOnly`** 與子表合併；**`e2e/system-settings-policy-p1-demo.spec.ts`** 多段 **`checkbox`**；**§3** 扁平規則列、**§4** **E2E** 列；Edge 契約／主修訂日誌／主表 Seq 29 列。 |
| 2026-05-09 | **`e2e/smoke.spec.ts`** **`#system-settings`**：與 **P1 demo** 對齊，**排班時間設定** 內 **資助復康非治療排除** 多段 **`checkbox`** 可見；**§4** **smoke** 列。 |
| 2026-05-09 | **`scheduling-rules-get`**：**`therapistGroupSessionsDailyCap`**／**`assistantGroupSessionsDailyCap`**（**`numericLimits`**）；**`schedulingRulesRepository`** 型別；**§3** 扁平規則列。 |
| 2026-05-09 | **引擎 P1 小組場次**：**`evalSessionCoreForPick`** **STAFF_GROUP_DAILY_CAP**、**`countStaffGroupSessionsOnDate`**、**`mapRulesToConstraints`**；**`schedulingCoreSessionGates.test`**；**§3** 表列。 |
| 2026-05-09 | **認知軌 P1 小組場次**：**`pickDementiaSession`**／**`runDementiaTrackDryRun`** 共用 **`countStaffGroupSessionsOnDate`**（**`Dementia_Service`**）；**`dementiaTrackDryRunService.test`**；**§3** 表列。 |
