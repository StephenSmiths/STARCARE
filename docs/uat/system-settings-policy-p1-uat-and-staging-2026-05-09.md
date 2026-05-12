# 院舍政策 P1：Staging 檢查與 UAT 劇本

> **對照**：**`docs/system-settings-policy-prd-2026-05-09.md`** §6 P1、**`docs/scheduling-policy-edge-function-contract.md`**、**`docs/supabase-deploy-runbook.md`**。  
> **前端**：**`#system-settings`**（系統設定）— 排班時窗、數字上限、**提交政策版本**。

---

## 一、Staging 環境前置（營運／工程）

1. **Supabase**：目標專案已執行 **`npm run db:push`**（含 **`20260509153000`**、**`20260509153100`**、**`20260509160000`** 等 migration）。  
2. **Edge**：已部署 **`scheduling-policy-current-get`**、**`scheduling-policy-at-get`**、**`scheduling-policy-version-validate`**、**`scheduling-policy-version-commit`**（見 **`package.json`** 之 **`ops:deploy:all`**）。  
3. **前端**：Staging build 已注入 **`VITE_SUPABASE_URL`**、**`VITE_SUPABASE_ANON_KEY`**（與該專案一致）。  
4. **帳號**：至少一組 **TeamLead** 或 **Admin**（`user_roles`），用於寫入；可另備 **Staff** 驗證無權限者無法進入系統設定（若產品啟用 `view:system-settings` 僅 TL／Admin）。  
5. **院舍**：`facilities` 內存在 **`facility-main`**（或與前端預設一致之 `STARCARE_DEFAULT_FACILITY_ID`）。

---

## 二、UAT 劇本（業務／TL）

| 編號 | 操作 | 預期 |
|------|------|------|
| U1 | 以 TL／Admin 登入 Staging，進入 **系統設定** | 可見「排班時窗」「數字上限」「提交政策版本」區塊；未設 env 時僅見本機儲存說明 |
| U2 | 調整午休起訖、勾選「開工準備」、修改三項數字上限，按 **儲存設定（本機）** | 成功訊息；重新整理後本機值保留 |
| U3 | 未填變更原因或未勾選確認即按 **提交政策版本** | 出現阻擋訊息，不呼叫成功 commit |
| U4 | 填寫變更原因、勾選確認、生效時間選「此刻」或數分鐘後，按 **提交政策版本** | 成功訊息含版本 id 前綴；無 R_OVERLAP／R_EFFECTIVE 錯誤 |
| U5 | 以相同表單連按兩次提交（相同內容） | 第二次可能 **409** 或 **R_OVERLAP**（視 idempotency 與生效日）；屬預期防重／不重疊行為 |
| U6 | 再開新分頁載入系統設定 | 若 U4 成功，午休／上限應與伺服器 **scheduling-policy-current-get** 一致（由 hydrate 帶入） |

---

## 三、已知限制（第一版）

- **P2 欄位**（固定活動、資助矩陣等）仍須在後端或第二階段 UI 維護；本 P1 表單提交時會**保留**伺服器上既有子表，僅覆寫非治療時段與數字上限。  
- **審計**：Edge commit 會寫 **`audit_events`**；本機「儲存設定」仍為 **`SYSTEM_SETTINGS_SAVE`** 審計列，兩者並存至全鏈收斂。  
- **智能排班乾跑**：已於 **`runSubsidizedRehabSchedulingOrchestration`** 併用 **`schedulingWindowSnapshotService.resolveSchedulingWindowSnapshot`**（有 **`policyVersion`** 時與雲端 P1 一致）；**復康活動追蹤**乾跑仍僅本機視窗（待下一階段收斂）。

---

## 修訂紀錄

| 日期 | 說明 |
|------|------|
| 2026-05-09 | 初版：P1 畫面接 API 後之 Staging／UAT 合併文件。 |
