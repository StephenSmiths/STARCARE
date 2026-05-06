# STARCARE Phase 5 Day 1 自動驗收 Runbook

> **對照**：運維與文件總覽 **`docs/business-logic.md`** §0（**`.cursorrules`** §3）；交付索引 **`docs/phase5-day1-delivery-index.md`**；窄版 **`acceptance:phase5`** 與全閘 **`npm run ci`** 見 **§三**、**`docs/feature-list.md`** §8；序號主檔「**運維與工程**」列 **`docs/pdf-sequenced-gap-checklist.md`**；**全案收尾**：**`README.md`**「專案收尾」（**`docs/business-logic.md`** §0 **全案收尾執行** 併述 **README** 表前互鏈指引（含 **對照**／**全案收尾母索引**））、**`docs/project-completion-evidence-index-2026-05.md`**、**`docs/project-completion-kickoff-checklist-2026-05.md`**；Gate A 自動證據固定入口 **`docs/evidence/gate-a-latest.md`**（檔內 **Next Command** 與 **`preflight:strict`** 並列；**`npm run gatea:evidence:list`**／**`npm run gatea:evidence:refresh`**／**`npm run gatea:evidence:preflight:strict`**）。

## 一、目標
- 驗證 KPI 趨勢伺服端持久化基礎能力（migration、Edge Functions、前端同步層）已就緒。

## 二、執行指令
```bash
npm run acceptance:phase5
```

若需一鍵完成驗收 + ZIP 交付，可改用：
```bash
npm run closeout:phase5
```

若需先清理舊交付物再重建（建議正式寄送前）：
```bash
npm run closeout:phase5:fresh
```

若需單獨驗證交付產物完整性（資料夾/ZIP/MANIFEST）：
```bash
npm run delivery:phase5:verify
```

若需產出收口摘要（整合驗收+交付驗證結果）：
```bash
npm run closeout:phase5:summary
```

若需快速查看當前收口狀態快照（是否可直接發送）：
```bash
npm run closeout:phase5:status
```

## 三、腳本會做的事
1. 檢查以下關鍵檔案是否存在：
   - `supabase/migrations/20260430195000_scheduling_kpi_history.sql`
   - `supabase/functions/scheduling-kpi-history-list/index.ts`
   - `supabase/functions/scheduling-kpi-history-upsert/index.ts`
   - `supabase/functions/scheduling-kpi-history-clear/index.ts`
   - `src/repositories/schedulingKpiHistoryRepository.ts`
   - `src/services/schedulingKpiHistorySyncService.ts`
   - `src/features/scheduling/hooks/useSchedulingKpiHistory.ts`
2. 依序執行：
   - `npm run lint`
   - `npm run test`
   - （本腳本**不含** **`npm run typecheck`**、**`npm run build`**／**`build:demo`**、Playwright；若需與 GitHub Actions 一致之全閘，另執行 **`npm run ci`**，見 **`docs/feature-list.md`** §8、**`docs/supabase-deploy-runbook.md`** §6。）
3. 若有 `SUPABASE_ACCESS_TOKEN`，額外執行（與 **`docs/supabase-deploy-runbook.md`** §3 對照；亦可 **`npm run ops:verify`**）：
   - `npx supabase migration list`
   - `npx supabase functions list`
4. 產生報告：
   - `docs/phase5-day1-automation-report.md`

## 四、環境變數（可選）
- `SUPABASE_ACCESS_TOKEN`
  - 有提供：會檢查雲端 migration/functions 狀態
  - 未提供：自動略過雲端檢查，不影響本機驗收

## 五、判定規則
- 任一檢查失敗，腳本會以非 0 退出碼結束（CI/終端可直接判定失敗）。
- 全部通過則報告顯示 `PASS`。

## 六、收口建議
- 驗收通過後執行 **`npm run ops:deploy:all`**（已含 **`db push --yes`**；見 **`docs/supabase-deploy-runbook.md`** §2）。
- 部署完成後在 UI 實測一次「執行排班 -> KPI 趨勢新增 -> 清除趨勢」閉環流程。
- 若網路中斷或 Edge 暫時不可用，KPI 趨勢面板應顯示同步失敗提示（黃色警示），並保留本機快取資料。
- 操作「重試同步」成功後，面板應顯示一次性同步成功提示（綠色訊息），約 4 秒後自動消失。

## 七、手動驗收重點（UI）
1. 正常網路下執行一次排班，確認 KPI 趨勢新增且無同步錯誤提示。
2. 模擬同步失敗（例如暫時斷網）後再執行排班，確認顯示黃色同步失敗提示。
3. 還原網路並點擊「重試同步」，確認資料可恢復同步，且顯示綠色成功提示後自動消失。
