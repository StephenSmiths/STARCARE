# STARCARE Phase 4 Day 4 自動驗收 Runbook

> **對照**：運維與文件總覽 **`docs/business-logic.md`** §0（**`.cursorrules`** §3）；交付索引 **`docs/phase4-day4-delivery-index.md`**；窄版 **`acceptance:day4`** 與全閘 **`npm run ci`** 見 **§三**、**`docs/feature-list.md`** §8；序號主檔「**運維與工程**」列 **`docs/pdf-sequenced-gap-checklist.md`**；**全案收尾**：**`README.md`**「專案收尾」（**`docs/business-logic.md`** §0 **全案收尾執行** 併述 **README** 表前互鏈指引（含各檔 **對照**／**全案收尾母索引**））、**`docs/project-completion-evidence-index-2026-05.md`**、**`docs/project-completion-kickoff-checklist-2026-05.md`**；Gate A 自動證據固定入口 **`docs/evidence/gate-a-latest.md`**（檔內 **Next Command** 與 **`preflight:strict`** 並列；**`npm run gatea:evidence:list`**／**`npm run gatea:evidence:refresh`**／**`npm run gatea:evidence:preflight:strict`**；檔尾 blockquote 四行：**`gateALatestMarkdownFooterLines`**（**`docs/gate-a-status-2026-05-06-commands-appendix.md#gate-a-appendix-latest-segment`** 下文 **`latest`** 段））；多數 **`gatea:evidence:*`** 終端 stdout 末兩行 **`gateAStandardCloseoutBlockquotes`**（**第一行**併主日誌 **Gate A／stdout** 細列歸檔 **`docs/pdf-sequenced-gap-checklist-revision-log-archive-gate-a-stdout-2026-05-09.md`**；**第二行**併 **人工／strict-http／keep=1**）維護：**`scripts/gate-a-markdown-footer.mjs`**（**Export 契約**）；人工 **`docs/gate-a-manual-evidence-checklist-2026-05-06.md`** 開首（strict-http／keep=1；**`docs/go-live-checklist.md`** §0.1）。

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
   - （本腳本**不含** **`npm run typecheck`**、**`npm run build:demo`**、Playwright；若需與 GitHub Actions 一致之全閘，另於專案根目錄執行 **`npm run ci`**，見 **`docs/feature-list.md`** §8、**`docs/supabase-deploy-runbook.md`** §6。）
3. 若有 `SUPABASE_ACCESS_TOKEN`，額外執行（與 **`docs/supabase-deploy-runbook.md`** §3 對照；亦可 **`npm run ops:verify`**）：
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
