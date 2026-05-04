# STARCARE System

智能院舍照護管理前端（React + TypeScript + Vite）。業務母本與缺口追蹤見 `docs/pdf/` 與下列文件。

## 文件入口

| 文件 | 用途 |
|------|------|
| [docs/feature-list.md](docs/feature-list.md) | 功能清單、CI／E2E／Dependabot 說明（§8） |
| [docs/pdf-sequenced-gap-checklist.md](docs/pdf-sequenced-gap-checklist.md) | PDF 對齊序號檢核 |
| [docs/business-logic.md](docs/business-logic.md) | 01 條文整理 |
| [docs/go-live-checklist.md](docs/go-live-checklist.md) | 上線檢核 |
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
- **CI**：推上 GitHub 後由 [`.github/workflows/ci.yml`](.github/workflows/ci.yml) 執行（含 Playwright 快取；demo 建置為 **`npm run build:demo`**，避免與本機 `.env` 內嵌 Supabase 混用）。

## 技術棧

React 19、Vite 8、Tailwind CSS 4、Vitest、Playwright、Supabase JS。ESLint 設定見 `eslint.config.js`。

---

以下為建立專案時之 Vite 範本說明（React Compiler、ESLint 型別規則等），可選讀：[Vite 官方文件](https://vite.dev/guide/)、[React 文件](https://react.dev/)。
