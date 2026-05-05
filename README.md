# STARCARE System

智能院舍照護管理前端（React + TypeScript + Vite）。業務母本與缺口追蹤見 `docs/pdf/` 與下列文件。工程規範與部署／驗收閘門見專案根目錄 **`.cursorrules`**（**§3**）及 **`docs/business-logic.md`** §0；序號清單主檔「**運維與工程**」路徑彙列見 **`docs/pdf-sequenced-gap-checklist.md`**（與 **§0**／**§3** 對齊）。**`docs/phase*.md`**／**`stage*.md`** 分階與歷史交付文件開首 **對照** 均互鏈該主檔「**運維與工程**」列。

## 文件入口

| 文件 | 用途 |
|------|------|
| [docs/feature-list.md](docs/feature-list.md) | 功能清單、CI／E2E／Dependabot 說明（§8） |
| [docs/pdf-sequenced-gap-checklist.md](docs/pdf-sequenced-gap-checklist.md) | PDF 對齊序號檢核（Seq 1～38）；主檔「**運維與工程**」列彙列 go-live／runbook／憑證等（與 [business-logic.md](docs/business-logic.md) §0、**`.cursorrules`** §3 一致）；修訂日誌 [pdf-sequenced-gap-checklist-revision-log.md](docs/pdf-sequenced-gap-checklist-revision-log.md) |
| [docs/pdf-alignment-p0-backlog.md](docs/pdf-alignment-p0-backlog.md) | 母本全對齊 P0 可勾選 backlog |
| [docs/business-logic.md](docs/business-logic.md) | 01 條文整理；**§0** 權威入口（含 **`.cursorrules`** §3 部署／驗收閘門連動）；**§8** 修訂表見 [business-logic-revision-log.md](docs/business-logic-revision-log.md) |
| [docs/phase3-day5-acceptance.md](docs/phase3-day5-acceptance.md) | Phase 3 Day 5 驗收（銜接 Phase 4 索引）；開首 **對照** 互鏈 [pdf-sequenced-gap-checklist.md](docs/pdf-sequenced-gap-checklist.md)「**運維與工程**」列 |
| [docs/adr-0001-scheduling-logic-placement.md](docs/adr-0001-scheduling-logic-placement.md) | ADR：排班演算放置（前端 vs Edge／DB，Seq 36） |
| [docs/residents-edge-function-contract.md](docs/residents-edge-function-contract.md) | 院友 Edge（CRUD／匯入）契約 |
| [docs/assessment-completion-records-contract.md](docs/assessment-completion-records-contract.md) | 評估完成紀錄 Edge 契約與審計（Seq 22） |
| [docs/client-delivery-remediation-plan.md](docs/client-delivery-remediation-plan.md) | 對客戶補強與分期交付說明 |
| [docs/phase4-day4-delivery-index.md](docs/phase4-day4-delivery-index.md)、[docs/phase5-day1-delivery-index.md](docs/phase5-day1-delivery-index.md) | 分階交付索引；**`acceptance:*`** 與 **`npm run ci`** 對照（見 [docs/feature-list.md](docs/feature-list.md) §8）；同目錄 **`phase*`**／**`stage*`** 開首 **對照** 互鏈 [pdf-sequenced-gap-checklist.md](docs/pdf-sequenced-gap-checklist.md)「**運維與工程**」列 |
| [docs/stage2-completion-report.md](docs/stage2-completion-report.md) 等（`stage2-*`、`stage3-*`） | Stage 2／Phase 3 歷史摘要與完成紀錄（追溯；開首 **對照** → [business-logic.md](docs/business-logic.md) §0） |
| [docs/pdf03-cursorrules-alignment.md](docs/pdf03-cursorrules-alignment.md) | PDF 03 × 工程規範對齊、PR 檢核表（Seq 35／37）；**Seq 35～38**（母本 03／C 區）對照骨架見 `docs/seq35-pdf03-cursorrules-alignment-traceability.md`（鏈至 `docs/seq38-pdf-versions-traceability.md`，總表 [pdf-sequenced-gap-checklist.md](docs/pdf-sequenced-gap-checklist.md) **C**） |
| [docs/perf-2026-05-05-bundle-splitting-summary.md](docs/perf-2026-05-05-bundle-splitting-summary.md) | 2026-05-05 拆包效能收斂摘要（入口體積對照、驗證結果、後續建議） |
| [docs/go-live-checklist.md](docs/go-live-checklist.md) | 上線檢核 |
| [docs/security-token-rotation-checklist.md](docs/security-token-rotation-checklist.md) | PAT／憑證輪替；**§D** 部署後自檢（可選 **`npm run ci`**） |
| [docs/supabase-deploy-runbook.md](docs/supabase-deploy-runbook.md) | §2 **`npm run ops:deploy:all`**（清單見 **`package.json`**）；§5 SQL；§6 **`npm run ci`**（與 Actions 同源） |
| [.env.example](.env.example) | 環境變數與可選 E2E 帳號 |

### 專案收尾（全案完成度，2026-05）

建議順序：可選先跑 [project-completion-kickoff-checklist-2026-05.md](docs/project-completion-kickoff-checklist-2026-05.md)（約 30 分鐘）→ 盤點 → 兩週計畫 → 追蹤板 → 日誌 → 證據索引。

執行時同步對照 [go-live-checklist.md](docs/go-live-checklist.md)、[supabase-deploy-runbook.md](docs/supabase-deploy-runbook.md)、[security-token-rotation-checklist.md](docs/security-token-rotation-checklist.md)。運維總覽 [business-logic.md](docs/business-logic.md) §0；序號主檔「運維與工程」列見 [pdf-sequenced-gap-checklist.md](docs/pdf-sequenced-gap-checklist.md)。

| 文件 | 用途 |
|------|------|
| [project-completion-audit-2026-05-05.md](docs/project-completion-audit-2026-05-05.md) | 完成率估算、缺口、工期 |
| [project-completion-2week-plan-2026-05-05.md](docs/project-completion-2week-plan-2026-05-05.md) | 兩週日程與 Gate |
| [project-completion-2week-tracker-2026-05-05.md](docs/project-completion-2week-tracker-2026-05-05.md) | 進度板與開工指令 |
| [project-completion-daily-log-2026-05.md](docs/project-completion-daily-log-2026-05.md) | EOD 與風險 |
| [project-completion-evidence-index-2026-05.md](docs/project-completion-evidence-index-2026-05.md) | PR／CI／SQL／截圖證據 |
| [project-completion-kickoff-checklist-2026-05.md](docs/project-completion-kickoff-checklist-2026-05.md) | 新成員 30 分鐘收尾啟動清單 |
| [pdf-sequenced-gap-checklist-revision-log.md](docs/pdf-sequenced-gap-checklist-revision-log.md) | 序號主檔修訂日誌（最新留痕） |
| [pdf-sequenced-gap-checklist-revision-log-2026-05-01a.md](docs/pdf-sequenced-gap-checklist-revision-log-2026-05-01a.md) | 修訂日誌歸檔（2026-05-01 前段；與主日誌並讀） |
| [pdf-sequenced-gap-checklist-revision-log-archive-p2.md](docs/pdf-sequenced-gap-checklist-revision-log-archive-p2.md) | 修訂日誌歸檔（p2：2026-05-01～02 中段） |

## 常用指令

```bash
npm install
npm run dev              # 開發伺服器
npm run typecheck        # tsc -b --noEmit（不含 vite bundle）
npm run ci               # lint → typecheck → 單元測試 → build:demo → Playwright（全套 demo）
npm run test:e2e:smoke   # build:demo 後僅跑 e2e/smoke.spec.ts（較快）
npm run test:e2e:all     # demo 煙霧 + 可選登入 E2E（無 E2E_AUTH_* 時登入段 skip）
npm run build
npm run build:demo       # 清空 VITE_SUPABASE_* 之 production bundle（與 CI demo E2E 同源）
npm run perf:bundle-report # 讀取 dist/assets 並輸出入口與關鍵 chunk 體積
npm run perf:bundle-report:demo # 一鍵 build:demo 後輸出 bundle 體積報告
npm run perf:bundle-check:demo  # 一鍵 build:demo 並檢查 index/total-js 體積門檻
npm run perf:bundle-report:json # 一鍵 build:demo 並輸出 dist/bundle-report.json
npm run perf:bundle:full # 一鍵 build + budget check + JSON + markdown diff
npm run perf:bundle:pr # 一鍵產生 PR 可貼的 baseline markdown 差異（dist/bundle-diff.md）
npm run perf:bundle-baseline:save # 將 dist/bundle-report.json 存為 docs/perf-baselines 基準檔
npm run perf:bundle-baseline:refresh # 一鍵重建報告並刷新 baseline
npm run perf:bundle-baseline:snapshot # 產生時間戳快照到 docs/perf-baselines/history/
npm run perf:bundle-history:md # 輸出 history 趨勢 markdown（stdout）
npm run perf:bundle-history:md:file # 產生 dist/bundle-history.md
npm run perf:bundle:record # 一鍵執行 report:json + snapshot + history markdown
npm run perf:bundle:ci # CI 同步流程：budget + json + baseline diff + history markdown + delta guard
npm run perf:bundle:ci:summary # 依 report/delta/diff 產出 dist/bundle-ci-summary.md（含 Top chunk 變化）
npm run perf:bundle-delta-check -- <base.json> <current.json> --max-index-delta-kb 8 --max-total-delta-kb 30 # 檢查相對 baseline 增幅
npm run perf:bundle-delta-check:baseline # 以 tracked baseline 執行 delta guard（index +8kB、total +30kB）
npm run perf:bundle-delta-check:baseline:json # 產生 dist/bundle-delta.json（機器可讀）
npm run perf:bundle-diff -- <base.json> <current.json> # 比對兩份 bundle JSON 差異
npm run perf:bundle-diff:md -- <base.json> <current.json> # 產生可貼 PR 的 Markdown 差異表
npm run perf:bundle-diff:md -- <base.json> <current.json> --out docs/perf-diff.md # 輸出到檔案
npm run perf:bundle-diff:baseline # 直接比對 baseline vs dist/bundle-report.json
npm run perf:bundle-diff:baseline:md # 直接產生 baseline vs current 的 Markdown 差異
npm run perf:bundle-diff:baseline:md:file # baseline Markdown 差異輸出到 dist/bundle-diff.md
```

- **Supabase**：複製 `.env.example` 為 `.env` 並填入 `VITE_SUPABASE_URL`、`VITE_SUPABASE_ANON_KEY` 後即可走真實登入與 Edge。
- **後端部署**：見 [docs/supabase-deploy-runbook.md](docs/supabase-deploy-runbook.md)；建議 **`npm run ops:deploy:all`**（含 migration 與目前倉庫所列 Edge，**§2**）。
- **CI**：推上 GitHub 後由 [`.github/workflows/ci.yml`](.github/workflows/ci.yml) 執行（含 Playwright 快取；demo 建置為 **`npm run build:demo`**，避免與本機 `.env` 內嵌 Supabase 混用）。
- **效能報告**：CI 會在 bundle budget check 後上傳 `bundle-report` artifact（`dist/bundle-report.json`）。
- **憑證與部署後自檢**：[docs/security-token-rotation-checklist.md](docs/security-token-rotation-checklist.md) **§D**（可選 **`npm run ci`**；與 [docs/go-live-checklist.md](docs/go-live-checklist.md) §6 對齊）。

## 技術棧

React 19、Vite 8、Tailwind CSS 4、Vitest、Playwright、Supabase JS。ESLint 設定見 `eslint.config.js`。

---

以下為建立專案時之 Vite 範本說明（React Compiler、ESLint 型別規則等），可選讀：[Vite 官方文件](https://vite.dev/guide/)、[React 文件](https://react.dev/)。
