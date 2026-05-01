# STARCARE Residents Edge Function 契約

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
- **請求 Body**：`ResidentRecord`（建立時 `is_deleted` 應為 `false`）
- **成功回應**：`201` 或 `200`

### 3.4 POST `/functions/v1/residents-update`
- **用途**：更新院友資料。
- **請求 Body**：`ResidentRecord`
- **成功回應**：`200`

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
