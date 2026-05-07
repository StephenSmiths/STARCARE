# STARCARE Phase 4 Day 4 交付包索引

> **對照**：運維與文件總覽 **`docs/business-logic.md`** §0（**`.cursorrules`** §3）；上一階 **`docs/phase3-day5-acceptance.md`**／**`docs/phase3-day5-acceptance-result-2026-04-30.md`**；窄版 **`acceptance:day4`** 與全閘 **`npm run ci`** 對照見 **§二** 及 **`docs/feature-list.md`** §8；序號主檔「**運維與工程**」列 **`docs/pdf-sequenced-gap-checklist.md`**；**全案收尾**：**`README.md`**「專案收尾」（**`docs/business-logic.md`** §0 **全案收尾執行** 併述 **README** 表前互鏈指引（含各檔 **對照**／**全案收尾母索引**））、**`docs/project-completion-evidence-index-2026-05.md`**、**`docs/project-completion-kickoff-checklist-2026-05.md`**；Gate A 自動證據固定入口 **`docs/evidence/gate-a-latest.md`**（檔內 **Next Command** 與 **`preflight:strict`** 並列；**`npm run gatea:evidence:list`**／**`npm run gatea:evidence:refresh`**／**`npm run gatea:evidence:preflight:strict`**；檔尾 blockquote 四行：**`gateALatestMarkdownFooterLines`**（**`docs/gate-a-status-2026-05-06-commands-appendix.md#gate-a-appendix-latest-segment`** 下文 **`latest`** 段））；多數 **`gatea:evidence:*`** 終端 stdout 頁尾 **`scripts/gate-a-markdown-footer.mjs`**（**Export 契約**）。

## 一、目標
- 提供 Day 4 交付內容的一頁式索引，方便交接、驗收與回溯。

## 二、核心腳本
- 自動驗收腳本：
  - `scripts/phase4-day4-acceptance.mjs`
- npm 指令：
  - `npm run acceptance:day4`
- （可選、與 GitHub Actions 全閘一致）**`npm run ci`**：`acceptance:day4` **不含** **`typecheck`**、**`build:demo`**、Playwright；見 **`docs/phase4-day4-automation-runbook.md`** §三、**`docs/feature-list.md`** §8、**`docs/supabase-deploy-runbook.md`** §6。

## 三、操作文件
- 自動驗收 Runbook：
  - `docs/phase4-day4-automation-runbook.md`
- 手動 UI 檢核清單：
  - `docs/phase4-day4-ui-smoke-checklist.md`

## 四、自動輸出報告
- 自動驗收報告（每次執行更新）：
  - `docs/phase4-day4-automation-report.md`

## 五、Day 4 驗收步驟（建議）
1. 執行自動驗收
   - `npm run acceptance:day4`
2. 開啟報告
   - `docs/phase4-day4-automation-report.md`
3. 進行 UI 手動 smoke test
   - `docs/phase4-day4-ui-smoke-checklist.md`
4. 合併留存
   - 將自動報告 + 手動清單一起存檔至當日驗收紀錄

## 六、相關依賴文件（建議一併附上）
- `docs/phase3-day5-acceptance.md`
- `docs/phase3-day5-acceptance-result-2026-04-30.md`
- `docs/activity-sessions-import-verification.sql`
- `docs/residents-import-verification.sql`

## 七、驗收完成判定
- [ ] 自動驗收報告為 PASS
- [ ] UI smoke checklist 已完成勾選
- [ ] （建議）**`npm run ci`** 已通過（與 **`.github/workflows/ci.yml`** 指令集合一致；見 **`docs/feature-list.md`** §8）
- [ ] 當日驗收人與 Go/No-Go 已填寫
