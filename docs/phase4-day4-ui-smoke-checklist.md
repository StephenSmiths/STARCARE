# STARCARE Phase 4 Day 4 UI 快速檢核清單

## 一、用途
- 配合 `npm run acceptance:day4` 的自動驗收，補上人工 UI Smoke Test（約 5-10 分鐘）。
- （可選）與 **`.github/workflows/ci.yml`** 一致之程式閘門：**`npm run ci`**（**`acceptance:day4`** 不含 **`typecheck`**、**`build:demo`**、Playwright；見 **`docs/feature-list.md`** §8。）

## 二、檢核步驟（手動）

### 1) 排班主頁
- [ ] 進入 `#scheduling`，頁面可正常載入，無空白或錯誤提示。
- [ ] 點擊「啟動智能排班」後，指派列表與衝突區塊有反應。
- [ ] KPI 卡片（覆蓋率/衝突率/平均指派/待補齊）有顯示數值。
- [ ] KPI 趨勢區塊可看到最新快照（執行排班後）。
- [ ] 點擊「下載 KPI 趨勢 CSV」可成功下載。

### 2) 匯入頁（Residents / Staff / Activity Sessions）
- [ ] 上傳一份 valid CSV，可正常預檢與提交。
- [ ] 上傳 mixed-errors CSV，可顯示錯誤清單。
- [ ] 本地格式錯誤時，顯示「先修正 CSV」提示，且不呼叫 API。
- [ ] 匯入摘要卡顯示總數/成功/失敗/耗時/批次時間。
- [ ] 最近 10 次匯入歷史有新增紀錄。

### 3) 長列表可用性
- [ ] 院友管理清單可搜尋、篩選、分頁。
- [ ] 表格/清單有區塊內滾動，不造成整頁過長難操作。

## 三、記錄
- 驗收日期：
- 驗收人：
- 結果：Go / No-Go
- 備註：
