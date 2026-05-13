# 院舍政策 P1：Staging 檢查與 UAT 劇本

> **對照**：**`docs/system-settings-policy-prd-2026-05-09.md`** §6 **P1**／**P2**、**`docs/scheduling-policy-edge-function-contract.md`**、**`docs/supabase-deploy-runbook.md`**。  
> **前端**：**`#system-settings`**（系統設定）— **智能排班設定**、**復康服務基本設定**、**政策版本（雲端提交）**（用語對齊 PDF 02【16】）；已設 **`VITE_SUPABASE_*`** 且 Edge 可用時 **P2** 雲端卡與 **二之二** 手動抽測對齊 **`SystemSettingsHome`** **`edgeEnabled`**（見 **`docs/seq29-system-settings-pdf02-traceability.md`** §1）。

---

## 一、Staging 環境前置（營運／工程）

1. **Supabase**：目標專案已執行 **`npm run db:push`**（含 **`20260509153000`**、**`20260509153100`**、**`20260509160000`** 等 migration）。  
2. **Edge**：已部署 **`scheduling-policy-current-get`**、**`scheduling-policy-at-get`**、**`scheduling-policy-versions-list`**、**`scheduling-policy-version-validate`**、**`scheduling-policy-version-commit`**（見 **`package.json`** 之 **`ops:deploy:all`**）。  
3. **前端**：Staging build 已注入 **`VITE_SUPABASE_URL`**、**`VITE_SUPABASE_ANON_KEY`**（與該專案一致）。  
   - **對齊 Vercel 與 Supabase（手動＋本機檢查）**  
     - Supabase：**Project Settings → API**：**Project URL** 應等於 Vercel 的 **`VITE_SUPABASE_URL`**（含 **`https://`**，結尾不要多斜線）；**anon public** 應等於 **`VITE_SUPABASE_ANON_KEY`**。兩邊不一致會連錯專案或驗證失敗（有時仍表現成 `Failed to fetch`）。  
     - Vercel：敏感變數無法在 UI 檢視內容屬正常；以 Supabase API 頁複製為準，於 Vercel **覆寫**後 **Redeploy**。  
     - 本機：可 **`npm run vercel:pull-env`** 拉下 Vercel 變數後，執行 **`npm run verify:supabase-vite-env`**（格式與遮罩摘要）；需網路驗證時加 **`npm run verify:supabase-vite-env:ping`**。  
4. **帳號**：至少一組 **TeamLead** 或 **Admin**（`user_roles`），用於寫入；可另備 **Staff** 驗證無權限者無法進入系統設定（若產品啟用 `view:system-settings` 僅 TL／Admin）。  
5. **院舍**：`facilities` 內存在 **`facility-main`**（或與前端預設一致之 `STARCARE_DEFAULT_FACILITY_ID`）。

---

## 二、UAT 劇本（業務／TL）

| 編號 | 操作 | 預期 |
|------|------|------|
| U1 | 以 TL／Admin 登入 Staging，進入 **系統設定** | 可見 **智能排班設定**、**復康服務基本設定**、**政策版本（雲端提交）**；已設 env 時可見 **目前政策版本（雲端摘要）**、**政策版本列表（雲端）**，並可見 **二之二** 所列 **P2** 小節標題（**固定活動（雲端政策 P2）**、**資助復康三列**／**資助職類矩陣**／**資助 Pass 優先次序**／**認知障礙症政策** 等）；未設 env 時僅見本機儲存說明 |
| U2 | 調整午休起訖、勾選「開工準備」、修改三項數字上限，按 **儲存設定（本機）** | 成功訊息；重新整理後本機值保留 |
| U3 | 未填變更原因或未勾選確認即按 **提交政策版本** | 出現阻擋訊息，不呼叫成功 commit |
| U4 | 填寫變更原因、勾選確認、生效時間選「此刻」或數分鐘後，按 **提交政策版本** | 成功訊息含版本 id 前綴；無 R_OVERLAP／R_EFFECTIVE 錯誤 |
| U5 | 以相同表單連按兩次提交（相同內容） | 第二次可能 **409** 或 **R_OVERLAP**（視 idempotency 與生效日）；屬預期防重／不重疊行為 |
| U6 | 再開新分頁載入系統設定 | 若 U4 成功，午休／上限應與伺服器 **scheduling-policy-current-get** 一致（由 hydrate 帶入） |
| U7 | U4 成功後，於同一頁檢視 **政策版本列表（雲端）** | 新列出現於表首（依 effective_from 新→舊）；狀態與變更摘要與提交內容合理一致 |

---

## 二之二、P2 區塊（Staging；需 `VITE_SUPABASE_*`）

**前提**：完成 **§一**；前端 **`edgeEnabled`** 為真（與 **`src/features/systemSettings/components/SystemSettingsHome.tsx`** 一致）。補 **PRD** §6 **P2** 於 **UI** 之可視化抽測；**Playwright** 仍以 **二之一** 無 env 情境為主（不強制覆蓋本段）。已設 **`VITE_SUPABASE_*`** 與 **`E2E_AUTH_TEAMLEAD_*`**（優先）或 **`E2E_AUTH_ADMIN_*`** 之本機可增跑 **`npm run test:e2e:auth`** 內 **`e2e/auth-login.system-settings-p2.spec.ts`**（僅斷言五 **P2** **h3**；與 **`SystemSettingsHome.policyP2Titles.test.tsx`** Vitest 並讀）。

| 編號 | 操作 | 預期 |
|------|------|------|
| U8 | 於 **智能排班設定** 展開 **固定活動（雲端政策 P2）** | 見 **新增**（或空列表說明）；**`aria-controls`**／收合 **`hidden`** 與 **二之一** 語意一致 |
| U9 | 於 **復康服務基本設定** 依序展開 **資助復康三列**／**資助職類矩陣**／**資助 Pass 優先次序**／**認知障礙症政策** | 各 **P2** 卡標題與表單骨架可見；未改動欄位亦可重跑 **U3**／**U4**（提交時 **`mergeP1DraftIntoPolicyBundle`** 對未 **hydrate** 之子表保留雲端列，見 **PRD** §6 與 **`docs/seq29-system-settings-pdf02-traceability.md`** §1／§4 **`mergeP1DraftIntoPolicyBundle`** 列） |

---

## 二之一、無 Supabase 建置之自動化煙霧（工程）

**情境**：本機 **`build:demo`** 清空 **`VITE_SUPABASE_*`**，對齊上表 **U1**「未設 env 時僅見本機儲存說明」之版面與 **a11y** 摺疊語意。

| 指令 | 涵蓋 |
|------|------|
| **`npm run test:e2e:system-settings-policy`** | **`/#system-settings`**：**Pdf16** 兩大節、**`ListSectionPanel`**（排班時間／規則／資助復康於復康大節內篩選／政策）**`aria-controls`**／**`hidden`**、政策 **收合**／**展開**、五區 **`aria-controls`** 目標 **`id`** 全相異、**審計** 展開／收合與搜尋 **`placeholder`**、無 Edge 說明 |
| **`npm run test:e2e:smoke`** | 同上模組之 **`hash #system-settings`** 路徑（與多 hash 審計標題一併跑）；細目見 **`docs/seq29-system-settings-pdf02-traceability.md`** 第 4 節、修訂表 **`docs/seq29-system-settings-pdf02-traceability-revision-log.md`**（**`e2e/smoke.spec.ts`** 列） |

**上線勾單對照**：**`docs/go-live-checklist.md`** §5「已確認 Edge 契約」列 **`scheduling-policy-*`**，並與本節 **Playwright** 指令互鏈；已設 env 之 Staging 可增跑 **二之二** **P2** 摺疊與提交語意抽測。**`docs/supabase-deploy-runbook.md`** §2 **Seq 29**、§6 **CI 煙霧** 亦述及本節。

**工程維護互鏈**：**`README.md`** 常用指令 **CI**、**`docs/feature-list.md`** §8 第 3／7 點、**`docs/pdf03-cursorrules-alignment.md`** §3／§4、**`docs/seq29-system-settings-pdf02-traceability.md`** §5、**`docs/seq29-system-settings-pdf02-traceability-revision-log.md`**、**`.github/workflows/ci.yml`** 檔首 **Seq 29【16】**（與上項 **上線勾單** 併讀）；**P2** Staging 手動見同檔 **二之二**。

---

## 三、已知限制（第一版）

- **P2 UI 與自動化**：固定活動、資助三列／職類矩陣／Pass 次序、認知障礙政策等 **雲端卡** 僅在 **`VITE_SUPABASE_*`** 有效且 Edge 已部署時顯示；**Staging** 手動抽測見 **二之二**。**二之一** demo **E2E** 仍僅覆蓋 **P1** 摺疊與 **a11y**（無 env）。  
- **提交與子表**：**`mergeP1DraftIntoPolicyBundle`** 對未在本工作階段 **hydrate** 的 **P2** 子表保留雲端列；已 hydrate 或草稿非空者依合併規則覆寫（細節見 **PRD** §6、**`mergeP1DraftIntoPolicyBundle.test.ts`**）。**P1** 欄位（非治療時段、數字上限等）仍併入每次提交。  
- **審計**：Edge commit 會寫 **`audit_events`**；本機「儲存設定」仍為 **`SYSTEM_SETTINGS_SAVE`** 審計列，兩者並存至全鏈收斂。  
- **智能排班乾跑**：已於 **`runSubsidizedRehabSchedulingOrchestration`** 併用 **`schedulingWindowSnapshotService.resolveSchedulingWindowSnapshot`**（有 **`policyVersion`** 時與雲端 P1 一致）。  
- **復康活動追蹤**：**`useRehabActivityTrackingLoad`** 並行載入 **`windowSnapshot`**，**`buildSubsidizedRehabTrackSnapshot`**／**`buildDementiaServiceTrackSnapshot`** 與排班乾跑同源過濾；雲端提交成功後 **`bumpSystemSettingsExternalVersion`** 觸發跨頁重載。

---

## 四、修訂紀錄

| 日期 | 說明 |
|------|------|
| 2026-05-09 | **二之二** 前提段：補 **`npm run test:e2e:auth`** **`e2e/auth-login.system-settings-p2.spec.ts`**（**`E2E_AUTH_TEAMLEAD_*`** 優先／**`E2E_AUTH_ADMIN_*`**）與 Vitest 並讀。 |
| 2026-05-09 | **二之二** 前提段正文：**`E2E_AUTH_TEAMLEAD_*`** 優先敘述（對齊 **`e2e/auth-login.system-settings-p2.spec.ts`**）。 |
| 2026-05-09 | **二之二**：**P2** Staging 手動抽測（**U8**／**U9**）；**§三** 重寫 **P2** 限制（對齊 **`SystemSettingsHome`** **`edgeEnabled`** 與 **`mergeP1DraftIntoPolicyBundle`**）；**U1**、blockquote、**二之一** 上線勾單句併 **二之二**；**PRD** §6 **P2**、**`seq29`** §4／§5、**`go-live-checklist`** §5、主／**seq29** 修訂日誌互鏈。 |
| 2026-05-23 | **二之一**：補 **上線勾單** 與 **`go-live-checklist`** §5、**`supabase-deploy-runbook`** §2／§6 互鏈。 |
| 2026-05-15 | **二之一**／**`runbook`** §2／§6、**`business-logic`** §0、**Edge 契約**、**P0 backlog**、**`feature-list`** Edge 表、**PRD**：**UAT** **二之一** 括註「段末 **工程維護互鏈**」對齊。 |
| 2026-05-16 | **Schema**／**對客範本**／**PRD** §6、**`feature-list`** §8 第 5 點、**`README`**、**`pdf-sequenced`** 主表 Seq 29：**二之一** 補「段末 **工程維護互鏈**」。 |
| 2026-05-14 | **二之一** 段末增 **工程維護互鏈**（**`README`** **CI**、**`feature-list`** §8 第 3／7 點、**`pdf03`** §3／§4、**`seq29`** §5、**`ci.yml`** **Seq 29【16】**）；**`go-live-checklist`** §5 前向煙霧句併 **工程維護**；**`seq29`** 開首 **UAT** 括註、**§5** **runbook**／**go-live** 維護句對齊。 |
| 2026-05-13 | 增 **二之一**：無 Supabase 建置下 **`test:e2e:system-settings-policy`**／**`test:e2e:smoke`**（**`#system-settings`**）與 **U1**、**seq29** §4 對照。 |
| 2026-05-12 | Staging 前置 Edge 增 **`scheduling-policy-versions-list`**；U1 預期含版本列表；增 **U7**；本機 demo E2E：**`npm run test:e2e:system-settings-policy`**（**`e2e/system-settings-policy-p1-demo.spec.ts`**）。 |
| 2026-05-09 | 補 Staging：`VITE_SUPABASE_*` 與 Vercel／Dashboard 對齊說明；新增 **`npm run verify:supabase-vite-env`**、**`npm run verify:supabase-vite-env:ping`**。 |
| 2026-05-09 | **二之一**：**`test:e2e:smoke`** 表列細目與 **工程維護互鏈** 併 **`docs/seq29-system-settings-pdf02-traceability-revision-log.md`**。 |
| 2026-05-09 | 初版：P1 畫面接 API 後之 Staging／UAT 合併文件。 |
