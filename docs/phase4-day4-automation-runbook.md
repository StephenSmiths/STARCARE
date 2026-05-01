# STARCARE Phase 4 Day 4 自動驗收 Runbook

## 一、目標
- 以一條指令完成本機驗收閘門與關鍵文件檢查，並輸出可留存的驗收報告。

## 二、執行指令
```bash
npm run acceptance:day4
```

## 三、腳本會做的事
1. 檢查關鍵文件是否存在（驗收清單、UI smoke 清單、SQL 驗證、主要測試 CSV）。
2. 依序執行：
   - `npm run lint`
   - `npm run test`
   - `npm run build`
3. 若有 `SUPABASE_ACCESS_TOKEN`，額外執行：
   - `npx supabase migration list`
   - `npx supabase functions list`
4. 產生報告：
   - `docs/phase4-day4-automation-report.md`

## 四、環境變數（可選）
- `SUPABASE_ACCESS_TOKEN`
  - 有提供：會檢查雲端 migration/functions 狀態
  - 未提供：自動略過雲端檢查，不影響本機驗收

## 五、判定規則
- 任一檢查失敗，腳本會以非 0 退出碼結束（CI/終端可直接判定失敗）。
- 全部通過則報告顯示 `PASS`。

## 六、收口建議
- 執行完成後，將 `docs/phase4-day4-automation-report.md` 附到當日驗收紀錄。
- 人工補跑 `docs/phase4-day4-ui-smoke-checklist.md`，把 UI 驗收結果一起留存。
- 若需交接打包，可執行 `npm run delivery:phase4` 產生 `delivery/phase4-YYYY-MM-DD/`。
- 若需直接寄送壓縮檔，可執行 `npm run delivery:phase4:zip` 產生 `.zip`。
- 若需清理本機交付產物，可執行 `npm run delivery:phase4:clean`。
- `delivery/` 已列入 `.gitignore`，請勿將交付包提交入版控。
