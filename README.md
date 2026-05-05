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
```

- **Supabase**：複製 `.env.example` 為 `.env` 並填入 `VITE_SUPABASE_URL`、`VITE_SUPABASE_ANON_KEY` 後即可走真實登入與 Edge。
- **後端部署**：見 [docs/supabase-deploy-runbook.md](docs/supabase-deploy-runbook.md)；建議 **`npm run ops:deploy:all`**（含 migration 與目前倉庫所列 Edge，**§2**）。
- **CI**：推上 GitHub 後由 [`.github/workflows/ci.yml`](.github/workflows/ci.yml) 執行（含 Playwright 快取；demo 建置為 **`npm run build:demo`**，避免與本機 `.env` 內嵌 Supabase 混用）。
- **憑證與部署後自檢**：[docs/security-token-rotation-checklist.md](docs/security-token-rotation-checklist.md) **§D**（可選 **`npm run ci`**；與 [docs/go-live-checklist.md](docs/go-live-checklist.md) §6 對齊）。

## 技術棧

React 19、Vite 8、Tailwind CSS 4、Vitest、Playwright、Supabase JS。ESLint 設定見 `eslint.config.js`。

---

以下為建立專案時之 Vite 範本說明（React Compiler、ESLint 型別規則等），可選讀：[Vite 官方文件](https://vite.dev/guide/)、[React 文件](https://react.dev/)。
