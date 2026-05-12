# 系統設定院舍政策：多表資料結構說明

> **PRD**：`docs/system-settings-policy-prd-2026-05-09.md`。  
> **Edge 契約**：**`docs/scheduling-policy-edge-function-contract.md`**。  
> **SQL 骨架**：**`supabase/migrations/20260509153000_facility_scheduling_policy_versioned_skeleton.sql`**（表／觸發器）、**`supabase/migrations/20260509153100_facility_scheduling_policy_versioned_rls.sql`**（RLS）。  
> **母本**：PDF 02【16】智能排班設定、復康服務基本設定。  
> **對照骨架與測試**：**`docs/seq29-system-settings-pdf02-traceability.md`** 第 4 節；**Staging／UAT**（**二之一** 無 env 指令表）：**`docs/uat/system-settings-policy-p1-uat-and-staging-2026-05-09.md`**；**`npm run test:e2e:system-settings-policy`**、**`npm run test:e2e:smoke`**（**`hash #system-settings`**）。

以下為 **邏輯表** 清單；實際欄位名以 **`20260509153000`**／**`20260509153100`** migration 為準，演進時可增欄不改表意。

---

## 1. 版本頭表：`facility_scheduling_policy_versions`

**用途**：同一院舍 **一條版本列** 對應一組 `effective_from`（及結束後之 `effective_until`、狀態）。

| 欄位（概念） | 說明 |
|--------------|------|
| `id` | UUID，主鍵。 |
| `facility_id` | 外鍵 → `facilities.id`。 |
| `effective_from` | **生效起始**（TIMESTAMPTZ）；儲存時須 **≥ 伺服器現在**（客戶 R1）。 |
| `effective_until` | **生效結束**（可 NULL）；新版生效時寫入舊版，使區間 **不重疊**（客戶 R2）。 |
| `status` | `scheduled`（未到期）／`active`（現行）／`superseded`（已被取代）。 |
| `change_summary` | 變更原因／備註（客戶 R5）。 |
| `created_by_user_id` | 建立者（`auth.users` 或應用程式 actor，實作再定）。 |
| `created_at` / `updated_at` | 審計用。 |

**約束建議**：

- 同一 `facility_id` 下 **至多一筆** `status = 'active'`（部分唯一索引）。  
- 任意兩筆已提交版本之 `[effective_from, coalesce(effective_until, 'infinity'))` **不得重疊**（應用程式或 DB exclusion 強制）。

---

## 2. 智能排班設定（子表）

### 2.1 `facility_policy_non_therapy_slots`

**用途**：非治療時段（午休、上午文件、下午文件、其他）；每筆為 **一個時間窗**（建議存 **當地 TIME** 或 **HH:mm** 字串 + 院舍時區，第二階段定）。

| 欄位（概念） | 說明 |
|--------------|------|
| `policy_version_id` | FK → 版本頭表。 |
| `slot_kind` | 如 `LUNCH`／`MORNING_DOC`／`AFTERNOON_DOC`／`OTHER`。 |
| `time_start` / `time_end` | 當日時段。 |

### 2.2 開工準備

以 **`facility_policy_non_therapy_slots.slot_kind = 'SHIFT_PREP_BLOCK'`** 表示（與 migration 一致）；若改為獨立布林欄，可於後續 migration 調整。

### 2.3 `facility_policy_numeric_limits`

**用途**：排班規則數值上限（**每版本最多一列**，`UNIQUE(policy_version_id)`）。

| 欄位（概念） | 說明 |
|--------------|------|
| `therapist_group_sessions_daily_cap` | 治療師小組每日上限節數。 |
| `assistant_group_sessions_daily_cap` | 治療助理小組每日上限節數。 |
| `group_participant_cap` | 小組活動上限參與人數。 |

### 2.4 `facility_policy_fixed_activities`

**用途**：固定活動（可多筆）。

| 欄位（概念） | 說明 |
|--------------|------|
| `service_type` | `Subsidized_Rehab`／`Dementia_Care`（與既有 enum 一致）。 |
| `time_start` / `time_end` | 活動時段。 |
| `delivery_mode` | `Individual`／`Group`。 |
| `activity_name` | 文字。 |
| `role_pt` … `role_ota` |  BOOLEAN 或位元遮罩，對應負責職位。 |

---

## 3. 復康服務基本設定（子表）

### 3.1 `facility_policy_subsidized_tier`

**用途**：資助復康 **甲一／院舍券／私位** 各一列（或三列），每版本三筆內以 `funding_tier` 區分。

| `funding_tier` | 程式對譯 |
|----------------|----------|
| `GradeA_Subsidized` | 甲一買位 |
| `Voucher` | 院舍券 |
| `Private` | 私位 |

| 欄位（概念） | 說明 |
|--------------|------|
| `enabled` | 是否啟用該列服務策略。 |
| `weekly_min_sessions` | 每週最低次數（整數）。 |
| `special_care_therapist_only` | SC 是否只限治療師。 |

### 3.2 `facility_policy_subsidized_role_offerings`

**用途**：職類 × 個別／小組 × 節長 **矩陣**（多列：每列 `(policy_version_id, funding_tier, role_type, slot_variant)`）。

| `role_type` | `PT`／`PTA`／`OT`／`OTA` |
| `slot_variant` | 如 `IND_15`／`IND_30`／`GRP_30`／`GRP_60`（與 PDF 勾選項對齊）。 |

### 3.3 `facility_policy_subsidized_pass_order`

**用途**：甲一服務 **Pass 優先次序**（有序：`sort_order` 小在前）。

| 欄位 | 說明 |
|------|------|
| `sort_order` | 1,2,3… |
| `funding_tier` | `GradeA_Subsidized`／`Voucher`／`Private` 之一，每版恰好三列（驗收於應用層）。 |

### 3.4 `facility_policy_dementia_core`

**用途**：認知障礙症服務 **單列**（每版本一筆）：是否啟用、每週最低次數、SC 是否只限治療師。

### 3.5 `facility_policy_dementia_role_offerings`

**用途**：OT／OTA × 個別／小組（列舉與 3.2 類同，僅 `service_track = Dementia`）。

---

## 4. 讀取規則（實作契約）

| 場景 | 讀哪一版 |
|------|----------|
| **即時排班** | `effective_from <= now()` 且 **最新**且 `status = 'active'`（結算邏輯須與 R2 一致）。 |
| **歷史報表（某日 D）** | 選滿足 `effective_from <= D 終日` 且 `(effective_until IS NULL OR effective_until > D 始日)` 之版本；若邊界重疊須禁止於寫入層。 |

---

## 5. 與既有 `scheduling_rules` 之差異

| 項目 | `scheduling_rules`（現行） | 新政策表 |
|------|---------------------------|----------|
| 版本 | 院舍單列、無 `effective_from` | **多版本 + 生效區間** |
| 欄位 | 單表扁平 | **多表** 對應 PDF 區塊 |
| 報表回溯 | 難以對應「當時規則」 | 可依 R4 **對日取版** |

---

## 6. 修訂紀錄

| 日期 | 說明 |
|------|------|
| 2026-05-13 | 開首互鏈 **seq29** 第 4 節、**UAT** **二之一** 與 **demo** **E2E** 指令。 |
| 2026-05-09 | 初版：表清單、欄位概念、讀取契約。 |
