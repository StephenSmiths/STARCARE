# STARCARE Token 輪替與憑證安全清單

> **對照**：運維、部署與前端 **`npm run ci`** 等文件總覽見 **`docs/business-logic.md`** §0（**`.cursorrules`** §3「部署與驗收閘門」）；上線勾選項見 **`docs/go-live-checklist.md`**；Supabase 部署見 **`docs/supabase-deploy-runbook.md`**；序號清單主檔「**運維與工程**」路徑彙列見 **`docs/pdf-sequenced-gap-checklist.md`**（與本檔、**`go-live`**、**`runbook`** 同列）。

**全案收尾與證據留痕**：見 **`README.md`**「專案收尾」（**`docs/business-logic.md`** §0 **全案收尾執行** 併述 **README** 表前互鏈指引（含各檔 **對照**／**全案收尾母索引**）；**`docs/project-completion-*.md`**、主修訂日誌 **`docs/pdf-sequenced-gap-checklist-revision-log.md`** 及歸檔 **`docs/pdf-sequenced-gap-checklist-revision-log-2026-05-01a.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p2.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p3.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p4.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-p5.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-seq29-2026-05-09b.md`**、**`docs/pdf-sequenced-gap-checklist-revision-log-archive-gate-a-stdout-2026-05-09.md`**）；證據索引 **`docs/project-completion-evidence-index-2026-05.md`**；快速啟動 **`docs/project-completion-kickoff-checklist-2026-05.md`**；Gate A 自動證據固定入口 **`docs/evidence/gate-a-latest.md`**（檔內 **Next Command** 與 **`preflight:strict`** 並列；**`npm run gatea:evidence:list`**／**`npm run gatea:evidence:refresh`**／**`npm run gatea:evidence:preflight:strict`**；檔尾 blockquote 四行：**`gateALatestMarkdownFooterLines`**（**`docs/gate-a-status-2026-05-06-commands-appendix.md#gate-a-appendix-latest-segment`** 下文 **`latest`** 段））；多數 **`gatea:evidence:*`** 終端 stdout 末兩行 **`gateAStandardCloseoutBlockquotes`**（第二行併 **人工／strict-http／keep=1**）維護：**`scripts/gate-a-markdown-footer.mjs`**（**Export 契約**）；人工 **`docs/gate-a-manual-evidence-checklist-2026-05-06.md`** 開首（strict-http／keep=1；**`docs/go-live-checklist.md`** §0.1）。  
**兩週執行與日誌**：**`docs/project-completion-2week-plan-2026-05-05.md`**、**`docs/project-completion-2week-tracker-2026-05-05.md`**、**`docs/project-completion-daily-log-2026-05.md`**。

## 目標
降低憑證暴露風險，確保後續部署流程可持續。

## A. 立刻執行（高優先）
1. 到 Supabase Dashboard 建立一組新的 Personal Access Token（PAT）。
2. 以新 PAT 驗證可部署後，停用舊 PAT。
3. 確認本機終端未長期保存舊 PAT（必要時關閉舊 shell session）。

## B. 專案設定（已完成）
- `.gitignore` 已加入：
  - `.env`
  - `.env.*`
  - `!.env.example`

## C. 操作準則
- 不把 PAT、service role key 寫進版本庫。
- CLI 執行時使用環境變數傳入：
  - `SUPABASE_ACCESS_TOKEN="<PAT>" npx supabase ...`
- 前端只使用 `anon` key；`service role` 僅在 Edge/後端環境使用。

## D. 每次部署後自檢
1. `npx supabase migration list`：本地/遠端一致（或 **`npm run ops:verify`**，見 **`docs/supabase-deploy-runbook.md`** §3）。
2. `npx supabase functions list`：目標 functions 為 **`ACTIVE`**，且與 **`package.json`** 之 **`ops:deploy:all`** 列舉一致。
3. 前端走一次「登入 -> 排班 -> 一鍵儲存」閉環測試。
4. （可選）於前端 repo 執行 **`npm run ci`**（與 **`.github/workflows/ci.yml`** 指令集合同源；見 **`docs/supabase-deploy-runbook.md`** §6、**`docs/feature-list.md`** §8；**`acceptance:*`** 與全閘對照見 **`docs/phase4-day4-delivery-index.md`**、**`docs/phase5-day1-delivery-index.md`**）。
