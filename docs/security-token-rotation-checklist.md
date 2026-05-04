# STARCARE Token 輪替與憑證安全清單

> **對照**：運維、部署與前端 **`npm run ci`** 等文件總覽見 **`docs/business-logic.md`** §0（**`.cursorrules`** §3「部署與驗收閘門」）；上線勾選項見 **`docs/go-live-checklist.md`**；Supabase 部署見 **`docs/supabase-deploy-runbook.md`**；序號清單主檔「**運維與工程**」路徑彙列見 **`docs/pdf-sequenced-gap-checklist.md`**（與本檔、**`go-live`**、**`runbook`** 同列）。

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
