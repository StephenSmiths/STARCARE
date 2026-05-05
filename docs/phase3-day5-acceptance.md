# STARCARE Phase 3 Day 5 驗收清單

> **對照**：後續分階交付與 **`acceptance:*`**／**`npm run ci`** 見 **`docs/phase4-day4-delivery-index.md`**、**`docs/phase5-day1-delivery-index.md`**（詳 **`docs/feature-list.md`** §8）；運維總覽 **`docs/business-logic.md`** §0（**`.cursorrules`** §3）；序號主檔「**運維與工程**」列 **`docs/pdf-sequenced-gap-checklist.md`**；**全案收尾**：**`README.md`**「專案收尾」、**`docs/project-completion-evidence-index-2026-05.md`**、**`docs/project-completion-kickoff-checklist-2026-05.md`**。

## 一、驗收目標
- 確認三個批量匯入模組（院友 / 員工 / 活動時段）在 Day 5 功能下均可穩定運作。
- 確認 UI 已提供：
  - 匯入結果摘要卡（總數、成功、失敗、耗時、批次時間）
  - 最近 10 次匯入歷史
  - 本地格式錯誤先擋下，不呼叫 API

## 二、前置條件
- [ ] 已登入可用帳號（`staff` 或 `admin` 角色）
- [ ] 已完成資料庫 migration（至少包含 `20260430143000_seed_default_activities.sql`）
- [ ] 已部署相關 Edge Functions（含所有 import validate/commit）
- [ ] 前端已重新整理（避免舊版快取）

## 三、測試檔案（建議）
- 院友
  - [ ] `docs/residents-import-valid.csv`
  - [ ] `docs/residents-import-500-mixed-errors.csv`
- 員工
  - [ ] `docs/staff-import-200-valid.csv`
  - [ ] `docs/staff-import-200-mixed-errors.csv`
- 活動時段
  - [ ] `docs/activity-sessions-import-200-valid.csv`
  - [ ] `docs/activity-sessions-import-200-mixed-errors-db-aligned.csv`

## 四、驗收步驟與預期結果

### 4.1 院友匯入（Residents）
1. [ ] 上傳 valid 檔
   - 預期：預檢顯示可匯入 > 0、錯誤 0
2. [ ] 點擊「確認匯入有效資料」
   - 預期：顯示成功訊息
3. [ ] 檢查摘要卡
   - 預期：顯示 `stage=確認匯入`、成功筆數與實際一致
4. [ ] 檢查匯入歷史
   - 預期：新增 1 筆紀錄，最新一筆在最上方
5. [ ] 上傳 mixed-errors 檔
   - 預期：顯示錯誤列表；若有本地格式錯誤，先提示修正，不發 API

### 4.2 員工匯入（Staff）
1. [ ] 上傳 `staff-import-200-valid.csv`
   - 預期：預檢可匯入 200、錯誤 0
2. [ ] 點擊確認匯入
   - 預期：成功訊息顯示匯入 200 筆
3. [ ] 檢查摘要卡與歷史
   - 預期：資料完整，時間與耗時有顯示
4. [ ] 上傳 mixed-errors 檔
   - 預期：可顯示預檢錯誤，且不會出現混亂狀態

### 4.3 活動時段匯入（Activity Sessions）
1. [ ] 上傳 `activity-sessions-import-200-valid.csv`
   - 預期：預檢總數 200、可匯入 200、錯誤 0
2. [ ] 點擊確認匯入
   - 預期：成功訊息顯示匯入 200 筆
3. [ ] 上傳 `activity-sessions-import-200-mixed-errors-db-aligned.csv`
   - 預期：約 10% 錯誤，錯誤內容合理（不存在 ID、capacity 非法、欄位缺漏等）
4. [ ] 檢查摘要卡與歷史
   - 預期：最新結果與歷史列表一致

## 五、SQL 驗證（建議）
- [ ] 執行 `docs/residents-import-verification.sql`
- [ ] 執行 `docs/activity-sessions-import-verification.sql`
- [ ] 核對總量與前端匯入結果一致

## 六、UI/UX 驗收重點
- [ ] 本地格式錯誤時顯示明確提示文案
- [ ] 本地格式錯誤時不呼叫後端預檢 API
- [ ] 長列表可透過搜尋/篩選/分頁操作
- [ ] 清單區塊具備內部滾動，不影響整頁可讀性

## 七、完成標準（Go / No-Go）
- [ ] 三個匯入模組 valid 檔都可完成預檢與提交
- [ ] mixed-errors 檔都可正確顯示錯誤
- [ ] 摘要卡與歷史功能在三個模組均可用
- [ ] lint / test / build 全部通過

## 八、驗收紀錄
- 驗收日期：
- 驗收人：
- 結果：Go / No-Go
- 備註：

## 九、續維護（與 CI 全閘對齊）
- 本清單 **§七** 之 **`lint`／`test`／`build`** 為當時最低閘門；與 **`.github/workflows/ci.yml`** **指令集合一致**之程式全閘請執行 **`npm run ci`**（含 **`typecheck`**、**`build:demo`**、Playwright）。見 **`docs/feature-list.md`** §8、**`docs/supabase-deploy-runbook.md`** §6。後續 Phase 之窄版自動驗收見 **`docs/phase4-day4-delivery-index.md`**、**`docs/phase5-day1-delivery-index.md`**（各附 **`acceptance:*`** 與 **`npm run ci`** 對照）。
