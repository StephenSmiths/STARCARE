# STARCARE Residents Edge Function 契約

> **對照**：運維與文件總覽 **`docs/business-logic.md`** §0（**`.cursorrules`** §3「部署與驗收閘門」）；院友功能列 **`docs/feature-list.md`**（§2／§7 Edge 表）；上線抽測 **`docs/go-live-checklist.md`**。

## 1. 目標與範圍
- 本文件定義 `residents` 模組對 Supabase Edge Function 的請求/回應契約。
- 本契約對應欄位以資料庫 snake_case 為準，避免前後端命名歧異。
- 軟刪除採 `is_deleted=true`，嚴禁硬刪除。

## 2. 欄位術語規範

### 2.1 ResidentRecord (資料庫/Edge 層)
```json
{
  "id": "resident-uuid",
  "name": "陳小玲",
  "bed_number": "A-101",
  "area": "A區",
  "gender": "Female",
  "age": 81,
  "admission_date": "2026-01-03",
  "assessment_next_due_date": null,
  "funding_type": "GradeA_Subsidized",
  "service_type": "Both",
  "dementia_level": "Moderate",
  "is_special_care": true,
  "health_condition": "步行需協助",
  "medication_record": "每日早晚服藥",
  "is_deleted": false
}
```

### 2.2 funding_type 固定值（鐵律）
- `GradeA_Subsidized`
- `Voucher`
- `Private`

> 任何非上述值必須回傳 `400 Bad Request`。

## 3. Edge Function 端點契約

### 3.1 GET `/functions/v1/residents-list`
- **用途**：查詢院友清單。
- **回應**：`ResidentRecord[]`
- **建議**：預設可回傳全量，前端 service 層再篩 `is_deleted=false`。

### 3.2 GET `/functions/v1/residents-get?id={residentId}`
- **用途**：查詢單一院友。
- **成功回應**：`200 + ResidentRecord`
- **不存在**：`404`

### 3.3 POST `/functions/v1/residents-create`
- **用途**：新增院友。
- **請求 Body**：與 **`ResidentRecord`** 相同 snake_case；Edge 僅白名單寫入可變欄位，**忽略**其餘鍵；**`is_deleted`** 固定寫入 **`false`**（不可經本端點軟刪）。
- **驗證**：與批量匯入一致之 **`funding_type`**／**`service_type`**／**`dementia_level`**／**`gender`**／年齡；**`assessment_next_due_date`** 可選，須 **`YYYY-MM-DD`** 或空／`null`（§4.3）。
- **成功回應**：`201` 或 `200`

### 3.4 POST `/functions/v1/residents-update`
- **用途**：更新院友資料。
- **請求 Body**：與 **`ResidentRecord`** 相同 snake_case（含 **`id`**）；Edge 僅更新白名單欄位，**不可**經本端點變更 **`is_deleted`**（請用 **`residents-soft-delete`**）。
- **驗證**：同 **§3.3**（含 **`assessment_next_due_date`**）。
- **成功回應**：`200`

### 3.5a GET `/functions/v1/assessment-due-list?lead_days=14`
- **用途**：PDF 01 §4.3 — 評估於 **`lead_days`**（1～90，預設 14）內到期之院友清單（已登入 staff/teamlead/admin）。
- **資料來源**：讀 **`residents`**（`is_deleted=false`）；若 **`assessment_next_due_date`** 有值且落在 \[today, today+lead\] 則採用，否則以 **`admission_date`** 每 180 天週期估算（與前端 **`assessmentDueDateResolve`** 須同步）。
- **成功回應**：`200 + { "tasks": [ { "residentId", "residentName", "bedNumber", "dueDate", "dueInDays" } ] }`

### 3.5 POST `/functions/v1/residents-soft-delete`
- **用途**：軟刪除院友。
- **請求 Body**
```json
{
  "id": "resident-uuid",
  "is_deleted": true
}
```
- **成功回應**：`200`
- **約束**：僅更新 `is_deleted`，不可刪除資料列。

### 3.6 POST `/functions/v1/residents-import-validate`
- **用途**：PDF 01 §4.3 — 院友 CSV 批量預檢（TeamLead／Admin）。
- **請求 Body**：`{ "rows": IncomingRow[] }`。每列可為 camelCase 或 snake_case 混用；與 **`public/residents-import-template.csv`** 對齊之常用鍵包含：
  - `name`、`bedNumber`／`bed_number`、`area`、`gender`、`age`、`admissionDate`／`admission_date`
  - **可選** `assessmentNextDueDate` 或 `assessment_next_due_date`：留空或 `null` 表示未設定；若有值須為 **`YYYY-MM-DD`**
  - `fundingType`／`funding_type`、`serviceType`／`service_type`、`dementiaLevel`／`dementia_level`、`isSpecialCareCase`／`is_special_care`、`healthCondition`／`health_condition`、`medicationRecord`／`medication_record`
- **成功回應**：`200 + { ok, summary, errors[], preview[] }`，其中 **`preview`** 之合法列已正規化為 DB 欄位名（含 **`assessment_next_due_date`**，可為 `null`）。

### 3.7 POST `/functions/v1/residents-import-commit`
- **用途**：將預檢通過之列寫入 **`residents`**（須先呼叫 validate 並由前端帶回 **`preview`** 形狀之列）。
- **請求 Body**：`{ "rows": PreviewRow[]; "actorId": string }`。`PreviewRow` 與 **`ResidentRecord`** 對齊之 snake_case，其中 **`assessment_next_due_date`** 為可選（`string | null` 或省略）。
- **成功回應**：`200 + { ok: true, inserted, actorId }`

## 4. 錯誤碼建議
- `400`：欄位驗證失敗（含 funding_type 非法值）
- `401/403`：授權失敗
- `404`：資料不存在
- `409`：重覆提交或資料衝突
- `429`：請求過載
- `5xx`：伺服器錯誤

## 5. 審計軌跡（Audit Trail）要求
- 每次寫入（create/update/soft-delete）皆需記錄：
  - `actor_id`
  - `entity_type=Resident`
  - `entity_id`
  - `before_state`
  - `after_state`
  - `occurred_at`
- 建議由 Edge Function 或後端 DB function 保證落庫，前端 `residentService` 保留同步記錄作防線。
