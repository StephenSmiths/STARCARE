# STARCARE System

智能院舍照護管理前端（React + TypeScript + Vite）。業務母本與缺口追蹤見 `docs/pdf/` 與下列文件。

## 文件入口

| 文件 | 用途 |
|------|------|
| [docs/feature-list.md](docs/feature-list.md) | 功能清單、CI／E2E／Dependabot 說明（§8） |
| [docs/pdf-sequenced-gap-checklist.md](docs/pdf-sequenced-gap-checklist.md) | PDF 對齊序號檢核（Seq 1～38） |
| [docs/pdf-alignment-p0-backlog.md](docs/pdf-alignment-p0-backlog.md) | 母本全對齊 P0 可勾選 backlog |
| [docs/business-logic.md](docs/business-logic.md) | 01 條文整理 |
| [docs/adr-0001-scheduling-logic-placement.md](docs/adr-0001-scheduling-logic-placement.md) | ADR：排班演算放置（前端 vs Edge／DB，Seq 36） |
| [docs/client-delivery-remediation-plan.md](docs/client-delivery-remediation-plan.md) | 對客戶補強與分期交付說明 |
| [docs/pdf03-cursorrules-alignment.md](docs/pdf03-cursorrules-alignment.md) | PDF 03 × 工程規範對齊、PR 檢核表（Seq 37） |
| [docs/go-live-checklist.md](docs/go-live-checklist.md) | 上線檢核 |
| [docs/security-token-rotation-checklist.md](docs/security-token-rotation-checklist.md) | PAT／憑證輪替與部署後自檢 |
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
```

- **Supabase**：複製 `.env.example` 為 `.env` 並填入 `VITE_SUPABASE_URL`、`VITE_SUPABASE_ANON_KEY` 後即可走真實登入與 Edge。
- **後端部署**：見 [docs/supabase-deploy-runbook.md](docs/supabase-deploy-runbook.md)；建議 **`npm run ops:deploy:all`**（含 migration 與目前倉庫所列 Edge，**§2**）。
- **CI**：推上 GitHub 後由 [`.github/workflows/ci.yml`](.github/workflows/ci.yml) 執行（含 Playwright 快取；demo 建置為 **`npm run build:demo`**，避免與本機 `.env` 內嵌 Supabase 混用）。

## 技術棧

React 19、Vite 8、Tailwind CSS 4、Vitest、Playwright、Supabase JS。ESLint 設定見 `eslint.config.js`。

---

以下為建立專案時之 Vite 範本說明（React Compiler、ESLint 型別規則等），可選讀：[Vite 官方文件](https://vite.dev/guide/)、[React 文件](https://react.dev/)。
