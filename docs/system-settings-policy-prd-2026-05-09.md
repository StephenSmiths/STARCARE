# 系統設定（PDF 02【16】）院舍政策 PRD

> **Edge 契約**：**`docs/scheduling-policy-edge-function-contract.md`**（**`scheduling-policy-current-get`**／**`scheduling-policy-at-get`**／**`scheduling-policy-versions-list`**／**`scheduling-policy-version-validate`**／**`scheduling-policy-version-commit`**）。  
> **對客回覆範本**（逐條同意／需調整）：**`docs/system-settings-policy-customer-reply-2026-05-09.md`**。  
> **對照母本**：`docs/pdf/02-STARCARE-智能院舍照護管理系統.pdf` **【16】**（智能排班設定、復康服務基本設定）。  
> **客戶定案日**：2026-05-09（多表存放、`effectiveFrom`、版本不重疊、分期驗收）。  
> **資料結構詳述**：`docs/system-settings-policy-schema-2026-05-09.md`。  
> **SQL 骨架**：**`supabase/migrations/20260509153000_facility_scheduling_policy_versioned_skeleton.sql`**（表／觸發器）、**`supabase/migrations/20260509153100_facility_scheduling_policy_versioned_rls.sql`**（RLS）。  
> **既有對照骨架**：**`docs/seq29-system-settings-pdf02-traceability.md`**、**`docs/seq29-system-settings-pdf02-traceability-revision-log.md`**（本 PRD 為其 **院舍後端政策** 延伸）。  
> **Demo E2E（無 Supabase）**：**`npm run test:e2e:system-settings-policy`**（**`e2e/system-settings-policy-p1-demo.spec.ts`**）、**`npm run test:e2e:smoke`**（**`hash #system-settings`**）；指令對照 **UAT** **二之一**（段末 **工程維護互鏈**）：**`docs/uat/system-settings-policy-p1-uat-and-staging-2026-05-09.md`**；見 **`docs/seq29-system-settings-pdf02-traceability.md`** 第 4 節、**`docs/seq29-system-settings-pdf02-traceability-revision-log.md`**。

---

## 1. 背景與目標

將【16】兩大區塊（**智能排班設定**、**復康服務基本設定**）化為院舍級 **可調參數**，作為排班、合規與報表之 **單一權威來源**；變更可稽核、可預排生效日，並與既有 `scheduling_rules`／`scheduling-rules-get` 逐步收斂（見 §7）。

---

## 2. 客戶已定規則（驗收底線）

| 編號 | 主題 | 客戶結論 |
|------|------|----------|
| R1 | 生效時間 | 變更須指定 **某一時刻起** 採用新規則；**禁止**生效時間早於「現在」（不可填今天以前）。**允許當日立即生效**（即 `effective_from` 可為「此刻」或未來任一時刻，但不得為過去）。 |
| R2 | 多版與重疊 | 同一院舍 **可預先建立** 尚未生效之新版；各版 **生效區間嚴格不重疊**；新版一生效，舊版 **自動終止**；須保留 **完整版本歷程** 供稽核。 |
| R3 | 排班讀取 | **日常排班**僅使用 **目前已生效** 之版本。 |
| R4 | 報表讀取 | **歷史報表**依 **實際排班日** 對應當時之 **生效版本** 回溯呈現。 |
| R5 | 權限與確認 | 僅 **Team Lead／管理員** 可變更；儲存前須 **二次確認** 並填寫 **變更原因／備註**（兩者皆須）。 |
| R6 | 分期 | **同意**分階段：第一階段 **排班時間設定＋基本數字上限**；第二階段 **固定活動、職類與節長矩陣、甲一／券／私位優先次序** 等。 |
| R7 | 儲存形態 | **多張資料表**（非單一大 JSON 包）。 |

---

## 3. 範圍對照（與客戶圖一致）

### 3.1 智能排班設定

- **排班時間設定**：午休、上午／下午文件時間、其他新增時段；**開工準備**（開工後 30 分鐘）是否啟用。  
- **排班規則設定**：治療師／治療助理 **小組活動每日上限節數**、**小組人數上限**；**固定活動**（服務類型、活動時段、個別／小組、名稱、負責職位 PT／PTA／OT／OTA）。

### 3.2 復康服務基本設定

- **資助復康服務**：甲一買位／院舍券／私位三列；是否啟用、每週最低次數、可提供職位與活動類別（個別 15／30、小組 30／60）、Special Care 是否只限治療師。  
- **甲一服務排程優先次序**：預設順序可調整（與院友 `FundingType`：`GradeA_Subsidized`／`Voucher`／`Private` 對齊）。  
- **認知障礙症服務**：是否啟用、每週最低次數、OT／OTA 與個別／小組、Special Care 是否只限治療師。

---

## 4. 使用者流程（概要）

1. Team Lead／Admin 進入 **系統設定**，選擇院舍（單院舍 MVP 可固定 `facility-main`）。  
2. 顯示 **目前生效版本** 摘要；可檢視 **已排程未來版本** 列表（唯讀或編輯未生效者，依實作策略）。  
3. **新建版本**：填寫參數 → 指定 `effective_from`（僅未來或現在）→ 填 **變更原因** → **二次確認** → 經 Edge **`validate`**／**`commit`** 寫入 DB。  
4. 背景或由 **排班讀取 API** 在 `effective_from` 到點後，將舊版標記為已取代、新版標記為生效（實作可採「讀取時惰性結算」或「排程 Job」，須另定 ADR）。  
5. 寫入 **Audit Trail**（操作者、時間、版本 id、摘要；細部欄位 diff 可第二階段強化）。

**Edge 回傳（與 **`docs/scheduling-policy-edge-function-contract.md`** §4.3／§4.4 一致）**：**`scheduling-policy-version-validate`** 失敗時 **HTTP 200**、**`ok: false`**、**`errors[]`**。**`scheduling-policy-version-commit`** 於寫入前再校驗失敗時 **HTTP 400**、同樣可帶 **`errors[]`**；前端於提交卡以同一列表呈現。

---

## 5. 非功能需求

- **軟刪除**：版本列本身以 **狀態**（`scheduled`／`active`／`superseded`）管理；不對政策版本做硬刪除（與專案資料完整性原則一致）。  
- **防重複提交**：儲存鈕 debounce 或鎖定（與 `.cursorrules` 一致）。  
- **權限**：寫入僅 **teamlead／admin**（JWT `user_roles`）；**staff** 是否直連讀表由 RLS 與產品決策；建議 **排班參數以 Edge 聚合讀取**，與現行 `scheduling-rules-get` 一致。  
- **國際化**：UI 文案繁中；DB 存 enum／代碼（英文／程式對譯）。

---

## 6. 分期驗收（與客戶一致）

| 階段 | 交付內容 | 驗收要點 |
|------|----------|----------|
| **P1** | 非治療時段列、開工準備開關、數字上限（小組節數／人數） | R1～R5、多表寫入、稽核、RLS 讀寫分離；`scheduling-rules-get` 可讀到 **現行有效** 聚合結果（或並行過渡期）。**Staging／UAT**：**`docs/uat/system-settings-policy-p1-uat-and-staging-2026-05-09.md`**（**二之一** 無 env **E2E** 指令表；段末 **工程維護互鏈**）。 |
| **P2** | 固定活動多筆、資助三列＋職類矩陣、Pass 順序、認知障礙區塊 | R2～R4 全鏈（含歷史報表對版）；與 PDF 逐欄對表簽核。**Staging／UAT**：**`docs/uat/system-settings-policy-p1-uat-and-staging-2026-05-09.md`** **二之二**（**`#system-settings`** **`edgeEnabled`**）；對照骨架 **`docs/seq29-system-settings-pdf02-traceability.md`** §1。 |

---

## 7. 與現行程式之關係

- **現狀**：`public.scheduling_rules` 為 **每院舍單列**；前端另有 `localStorage` 快照（見 `seq29`）。  
- **目標**：新政策表為 **權威**；過渡期可二選一：  
  - **A**：`scheduling-rules-get` 改為 **JOIN 現行 `facility_scheduling_policy_versions` ＋子表**，並對舊列做一次性遷移；或  
  - **B**：短期內 **新表優先**，缺欄時 fallback `scheduling_rules`（寫入 `docs/adr-*` 決策）。  
- **實作進度（路徑 B）**：**`scheduling-rules-get`** 於 **`facility_scheduling_policy_versions`** 對「現在」有適用列時，以 **`facility_policy_numeric_limits.group_participant_cap`** 覆寫回應之 **`groupCapacityLimit`**（與 **`scheduling-policy-current-get`** **`numericLimits.groupParticipantCap`** 同源）；其餘扁平欄仍取自 **`scheduling_rules`**。細節見 **`docs/scheduling-policy-edge-function-contract.md`** 開首 **既有讀規則**、**`docs/adr-0001-scheduling-logic-placement.md`** 與 Seq 29 主表。

---

## 8. 修訂紀錄

| 日期 | 說明 |
|------|------|
| 2026-05-09 | 初版：依客戶回函定稿 R1～R7、分期 P1／P2、與 seq29／遷移骨架互鏈。 |
| 2026-05-09 | 增列對客回覆範本互鏈：**`docs/system-settings-policy-customer-reply-2026-05-09.md`**。 |
| 2026-05-09 | §4 補 **validate**（HTTP 200）與 **commit**（HTTP 400）錯誤物件一致、前端同一列表呈現；互鏈 Edge 契約 **§4.3**／**§4.4**。 |
| 2026-05-12 | 開首 Edge 列舉補 **`scheduling-policy-versions-list`**（§4 版本列唯讀）；與 **`docs/scheduling-policy-edge-function-contract.md`** §4.2a 對齊。 |
| 2026-05-09 | §6 **P2** 列：**UAT** 補 **二之二**（Staging **`edgeEnabled`**）；互鏈 **`seq29`** §1。 |
| 2026-05-23 | §6 **P1** 列：**UAT** 補 **二之一**（無 env **E2E** 指令表）。 |
| 2026-05-15 | 開首 **Demo E2E**：**UAT** **二之一** 補括註「段末 **工程維護互鏈**」。 |
| 2026-05-16 | §6 **P1** 列：**UAT** **二之一** 補「段末 **工程維護互鏈**」。 |
| 2026-05-13 | 開首 **Demo E2E** 併列 **`test:e2e:smoke`**；互鏈 **UAT** **二之一** 與 **seq29** 第 4 節。 |
| 2026-05-09 | 開首 **既有對照骨架**／**Demo E2E** 併 **`docs/seq29-system-settings-pdf02-traceability-revision-log.md`**。 |
| 2026-05-12 | 開首互鏈補 **Demo E2E**（**`test:e2e:system-settings-policy`**／**seq29** §4）。 |
| 2026-05-09 | §7：補 **路徑 B** 已落地之 **`scheduling-rules-get`**／**`groupCapacityLimit`** 合併敘述；互鏈 Edge 契約、**ADR-0001**、Seq 29 主表。 |
