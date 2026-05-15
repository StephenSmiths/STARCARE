# STARCARE Phase 4 最終打包寄送清單

> **對照**：交付索引 **`docs/phase4-day4-delivery-index.md`**；運維與 CI 總覽 **`docs/business-logic.md`** §0（**`.cursorrules`** §3）、**`docs/feature-list.md`** §8（**`npm run ci`**／**`acceptance:day4`**）；序號主檔「**運維與工程**」列 **`docs/pdf-sequenced-gap-checklist.md`**；**全案收尾**：**`README.md`**「專案收尾」（**`docs/business-logic.md`** §0 **全案收尾執行** 併述 **README** 表前互鏈指引（含各檔 **對照**／**全案收尾母索引**））、**`docs/project-completion-evidence-index-2026-05.md`**、**`docs/project-completion-kickoff-checklist-2026-05.md`**；Gate A 自動證據固定入口 **`docs/evidence/gate-a-latest.md`**（檔內 **Next Command** 與 **`preflight:strict`** 並列；**`npm run gatea:evidence:list`**／**`npm run gatea:evidence:refresh`**／**`npm run gatea:evidence:preflight:strict`**；檔尾 blockquote 四行：**`gateALatestMarkdownFooterLines`**（**`docs/gate-a-status-2026-05-06-commands-appendix.md#gate-a-appendix-latest-segment`** 下文 **`latest`** 段））；多數 **`gatea:evidence:*`** 終端 stdout 末兩行 **`gateAStandardCloseoutBlockquotes`**（**第一行**併主日誌 **Gate A／stdout** 細列歸檔 **`docs/pdf-sequenced-gap-checklist-revision-log-archive-gate-a-stdout-2026-05-09.md`**；**第二行**併 **人工／strict-http／keep=1**）維護：**`scripts/gate-a-markdown-footer.mjs`**（**Export 契約**）；人工 **`docs/gate-a-manual-evidence-checklist-2026-05-06.md`** 開首（strict-http／keep=1；**`docs/go-live-checklist.md`** §0.1）。

## 一、用途
- 提供 Phase 4 完成後的一次性寄送清單，分為「內部技術包」與「對外摘要包」。

## 二、內部技術包（建議完整附上）

### A. 收口與總結
- `docs/phase4-day5-completion-report.md`
- `docs/phase4-day4-delivery-index.md`

### B. 驗收與操作
- `docs/phase4-day4-automation-runbook.md`
- `docs/phase4-day4-ui-smoke-checklist.md`
- `docs/phase4-day4-automation-report.md`

### C. 前期銜接文件（追溯用）
- `docs/phase3-day5-acceptance.md`
- `docs/phase3-day5-acceptance-result-2026-04-30.md`
- `docs/phase3-day5-completion-note.md`

### D. SQL 驗證與測試資料
- `docs/residents-import-verification.sql`
- `docs/activity-sessions-import-verification.sql`
- `docs/staff-import-200-valid.csv`
- `docs/staff-import-200-mixed-errors.csv`
- `docs/activity-sessions-import-200-valid.csv`
- `docs/activity-sessions-import-200-mixed-errors-db-aligned.csv`

## 三、對外摘要包（管理層 / 客戶）
- `docs/phase4-day5-external-summary.md`
- `docs/stage3-day5-external-summary.md`
- （可選）`docs/stage2-external-summary.md`（若需展示完整演進）

## 四、建議寄送順序
1. `phase4-day5-external-summary.md`（先給結論）
2. `phase4-day5-completion-report.md`（再給細節）
3. `phase4-day4-automation-report.md`（驗收證據）
4. `phase4-day4-ui-smoke-checklist.md`（人工驗收補充）

## 五、寄送前最後檢查
- [ ] `npm run acceptance:day4` 已再次執行且 PASS
- [ ] （建議）**`npm run ci`** 已通過（與 **`.github/workflows/ci.yml`** 指令集合一致；**`acceptance:day4`** 為較窄閘門，見 **`docs/feature-list.md`** §8）
- [ ] `docs/phase4-day4-automation-report.md` 為最新時間
- [ ] 若有人工驗收，`phase4-day4-ui-smoke-checklist.md` 已填寫驗收人與結果
- [ ] 對外包不含敏感環境資訊（token / key / 私密連線資訊）
