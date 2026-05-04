# STARCARE 評估完成紀錄（Assessment Completion）契約

> **範圍**：PDF 02【9】／01 §5；資料表 **`assessment_completion_records`**；讀寫經 Edge；**爭議以 `docs/pdf/01-STARCare-核心業務邏輯與-SOP.pdf` 為準**。  
> **對照**：運維與文件總覽 **`docs/business-logic.md`** §0（**`.cursorrules`** §3）；序號主檔「**運維與工程**」列 **`docs/pdf-sequenced-gap-checklist.md`**；審計正式庫抽測 **`docs/go-live-checklist.md`** §8（RES-06）。

## 1. 資料表（PostgreSQL）

- **主鍵**：`id`（TEXT，與前端產生之 UUID 字串一致）。
- **外鍵**：`resident_id` → **`public.residents.id`**（院友須 **`is_deleted = false`**）。
- **欄位**：`resident_name`、`cycle_anchor_date`（DATE）、`discipline`（**`PT`** | **`OT`**）、`version_label`、`recorded_by_actor_id`（須為登入者 **`auth.uid()`** 字串）、`completed_at`（TIMESTAMPTZ）、`is_deleted`、`created_at`、`updated_at`。
- **唯一性**：同一 **`resident_id` + `cycle_anchor_date` + `discipline`** 在 **`is_deleted = false`** 時僅一筆（部分唯一索引）。

## 2. Edge：`GET assessment-completion-records-list`

- **授權**：**`requireStaffUser`**（staff／teamlead／admin）。
- **回應**：`{ "records": [ { snake_case 列… } ] }`，依 **`completed_at`** 降序，最多 2000 筆未軟刪列。

## 3. Edge：`POST assessment-completion-records-append`

- **授權**：**`requireStaffUser`**。
- **請求 Body**：`{ "records": [ … ] }`，單次 **1～20** 筆；每筆 snake_case 與 §1 一致；**`recorded_by_actor_id` 必須等於 JWT `sub`**。
- **`completed_at`**：可選；空或無效則伺服端 **`now()`**。
- **成功**：`200 + { "ok": true, "inserted": number }`。
  - 主檔寫入後依 **院友** 分組寫入 **`audit_events`**（**`action`** = **`ASSESSMENT_COMPLETION_RECORD`**、**`entity_type`** = **`Resident`**、**`entity_id`** = **`resident_id`**）；**`after_state`**／**`detail`** 長度與 **`audit-trail-append`** 同上限（32000）。
  - 若審計寫入失敗：本次插入之列標 **`is_deleted = true`**（軟刪回溯），回應 **`500`**；不回傳成功 **`ok`**。
- **錯誤**：`409`（唯一索引衝突，訊息：**此週期該科別已有紀錄（不可重複登錄）**）；`400`／`401`／`403`／`500` 同既有 Edge 慣例。

## 4. 前端 Repository

- **`assessmentCompletionRecordRepository`**（`src/repositories/assessmentCompletionRecordRepository.ts`）：**`listActive`**、**`append`**；**`append`** 附 **`X-Idempotency-Key`**。
- **型別映射**：**`assessmentCompletionRecordMapper.ts`**（**`mapAssessmentCompletionRecordRow`**、**`toAssessmentCompletionAppendPayload`**）。

## 5. 與本機儲存

- **`assessmentCompletionStorage`**（localStorage）仍作備援；**`useAssessmentManagementWorkspace`** 合併遠端／本機時以 **同 tuple**（院友／錨點／科別）**遠端優先**。
