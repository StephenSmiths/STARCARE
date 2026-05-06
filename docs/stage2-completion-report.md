# STARCARE Stage 2 完成報告

> **對照**：歷史追溯用；後續分階與驗收見 **`docs/phase3-day5-acceptance.md`** 起；運維與文件總覽 **`docs/business-logic.md`** §0（**`.cursorrules`** §3）；序號主檔「**運維與工程**」列 **`docs/pdf-sequenced-gap-checklist.md`**；**全案收尾**：**`README.md`**「專案收尾」、**`docs/project-completion-evidence-index-2026-05.md`**、**`docs/project-completion-kickoff-checklist-2026-05.md`**；Gate A 自動證據固定入口 **`docs/evidence/gate-a-latest.md`**（檔內 **Next Command** 與 **`preflight:strict`** 並列；**`npm run gatea:evidence:list`**／**`npm run gatea:evidence:refresh`**／**`npm run gatea:evidence:preflight:strict`**）。

## 一、範圍與結論
- Stage 2 目標：由 Stage 1 MVP 進一步補強「真實排班模型」與「批量匯入閉環」。
- 結論：Stage 2 核心範圍已完成，並通過功能驗收與基本壓測（500 筆 CSV）。

## 二、已完成項目
### 2.1 資料模型（Day 1）
- 已新增核心資料表：
  - `facilities`
  - `staff_profiles`
  - `activities`
  - `activity_sessions`
  - `scheduling_rules`
  - `staff_skills`
- 所有新實體遵循：
  - 軟刪除（`is_deleted`）
  - `created_at` / `updated_at`
  - RLS（`staff/admin` 可讀）
  - `updated_at` trigger

### 2.2 Edge Functions（Day 2）
- 新增：
  - `activities-list`
  - `activity-sessions-list`
  - `scheduling-rules-get`
  - `staff-skills-list`
  - `residents-import-validate`
  - `residents-import-commit`
- 全部接入授權防線（`guardStaffUser`）。

### 2.3 前端接線（Day 3）
- 新增 repositories / service：
  - `activityRepository`
  - `activitySessionRepository`
  - `schedulingRulesRepository`
  - `staffSkillsRepository`
  - `schedulingConfigService`
- 排班資料來源改為優先讀 DB（保留 fallback，避免中斷）。

### 2.4 排班規則接入（Day 4）
- 排班引擎新增規則化約束：
  - 每日同類上限（`dailySameServiceLimit`）
  - 同類最小間隔天數（`minGapDaysSameService`）
  - 小組容量上限（`groupCapacityLimit`）
  - 技能不匹配衝突（`SKILL_MISMATCH`）

### 2.5 批量匯入閉環（Day 4-5）
- 院友 CSV 流程完成：
  - 本地解析
  - dry-run 預檢（欄位、枚舉、年齡、重覆床號、DB 床號衝突）
  - commit 寫入
  - 成功訊息與列表刷新
- 匯入 UI 補強：
  - 下載範本
  - 錯誤列表前 20 + 展開全部

## 三、驗收結果
### 3.1 技術閘門
- `lint`：通過
- `test`：通過
- `build`：通過

### 3.2 端到端功能
- Auth + RLS + 排班 + 儲存：通過
- 批量匯入（Dry-run + Commit）：通過
- SQL 驗證：可用（見 `docs/residents-import-verification.sql`）

### 3.3 壓測（CSV）
- `residents-import-500-valid.csv`：500 筆全合法，預檢快速完成。
- `residents-import-500-mixed-errors.csv`：500 筆（約 10% 錯誤），預檢快速完成且錯誤回報正確。

## 四、目前已知限制（非阻塞）
- 認知障礙症服務軌道（Dementia 軌）仍屬下一階段深化（目前以資助復康主流程為主）。
- 匯入功能目前集中在院友，員工/活動時段批量匯入可在 Phase 3 擴充。
- 目前 UI 側重實用驗收，後續可再做可用性優化（排序/搜尋/分頁）。

## 五、建議下一階段（Phase 3）
1. 員工與活動時段的批量匯入（含 dry-run/commit）。
2. 認知障礙症軌道完整化（嚴重度優先 + 覆蓋率報表）。
3. 匯入後台任務化（進度條、批次ID、可重試）。
4. E2E 自動化（登入 -> 匯入 -> 排班 -> 儲存 -> SQL 驗證）。

## 六、相關文件
- `docs/go-live-checklist.md`
- `docs/supabase-deploy-runbook.md`
- `docs/security-token-rotation-checklist.md`
- `docs/residents-import-verification.sql`
