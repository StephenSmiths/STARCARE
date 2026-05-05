# STARCARE 前端效能收斂摘要（2026-05-05）

> 對照：`docs/business-logic.md` §0、專案根 `.cursorrules` §3、`README.md`、`docs/pdf-sequenced-gap-checklist.md`（運維與工程）

## 本次目標

- 降低首屏入口檔體積，縮短初始解析與執行時間。
- 在不改變既有業務流程（Auth、模組切換、審計顯示）的前提下，優先採用低風險拆包策略。

## 主要調整

- **模組頁面 lazy loading**
  - `src/app/AppMainViews.tsx` 改為按功能頁動態載入（`React.lazy` + `Suspense`）。
  - 各功能首頁改由 chunk 分離（如 `residents`、`scheduling`、`serviceForms` 等）。
- **入口重元件延遲載入**
  - `src/App.tsx` 將 `SchedulingAppLayout`、`AppMainViews` 改為動態載入。
- **登入頁拆包**
  - `src/App.tsx` 將 `SignInScreen` 改為動態載入。
  - `src/features/auth/index.ts` 移除 `SignInScreen` 靜態 re-export，避免動態匯入失效。
- **Vendor 拆分**
  - `vite.config.ts` 新增 `manualChunks`：
    - `vendor-react`
    - `vendor-supabase`
    - 其餘第三方 `vendor`

## 成果對照（build:demo）

- 早期入口檔：`index` 約 **585.64 kB**
- 第一輪 lazy 後：`index` 約 **344.36 kB**
- 第二輪入口延遲後：`index` 約 **332.70 kB**
- 第三輪 vendor 拆分後：`index` 約 **41.21 kB**
- SignInScreen 拆包後：`index` 約 **40.12 kB**
- 模組描述按需載入後：`index` 約 **38.27 kB**
- 預載策略優化後：`index` 約 **38.47 kB**（體積近似持平，改善首次切頁體感）

> 註：第三方依賴已分攤至 `vendor-react`（約 186.14 kB）與 `vendor-supabase`（約 100.18 kB），可由瀏覽器快取重用。

## 驗證結果

- `npm run lint`：通過
- `npm run typecheck`：通過
- `npm run test`：通過（63 files / 175 tests）
- `npm run build:demo`：通過
- `npm run perf:bundle-report`：可輸出 `index` / `vendor-react` / `vendor-supabase` / 核心模組 chunk 與總 JS 體積
- `npm run perf:bundle-report:json`：可輸出 `dist/bundle-report.json`（供機器比對）
- `npm run perf:bundle-baseline:save`：可將當前報告保存為 `docs/perf-baselines/bundle-report-latest.json`
- `npm run perf:bundle-diff -- <base.json> <current.json>`：可比較兩份報告的 chunk 與 total-js 增減
- `npm run perf:bundle-diff:md -- <base.json> <current.json>`：可輸出可貼 PR 的 Markdown 差異表
- `npm run perf:bundle-check:demo`：可執行門檻檢查（現行：`index <= 45kB`、`total-js <= 620kB`）
- CI：`build:demo` 後自動執行 bundle budget check，避免體積回退進入主線
- CI：會輸出並上傳 `dist/bundle-report.json` 為 `bundle-report` artifact，便於下載留存
- CI：會額外產生並上傳 `dist/bundle-diff.md`（對照 `docs/perf-baselines/bundle-report-latest.json`）
- GitHub Actions：最新連續主線 run 綠燈（#116、#117、#118）

## 相關提交（依時間）

- `f44ab5d` perf(app): 以 lazy loading 拆分主功能模組
- `6095a7e` perf(app): 延遲載入 App 入口重元件
- `3b6a51d` perf(build): 拆分 vendor chunk 降低入口載入負擔
- `018cf55` perf(app): 拆出 SignInScreen chunk 並縮小入口檔
- `53a0559` perf(app): 模組描述字串改為按需載入
- `ea275dd` perf(app): 預載 viewDescriptions 模組降低描述延遲
- `a894e42` perf(app): 已登入後預載工作台核心模組
- `ebea22b` perf(app): 延後建立預載 promise 避免提前抓包
- `d62cce6` chore(perf): 新增 bundle 體積報告腳本
- `7035132` chore(perf): 新增 bundle 體積門檻檢查模式
- `f8acb99` chore(ci): 納入 bundle 體積門檻檢查
- `0c9f9b2` chore(perf): 支援輸出 JSON bundle 報告
- `4d714c9` chore(perf): 新增 bundle JSON 差異比對腳本
- `5924329` chore(perf): 新增 Markdown bundle 差異報告
- `b4329cf` chore(perf): 新增 baseline 保存指令與基準檔

## 下一階段建議

- 針對 `scheduling` / `residents` 內部再做次級面板拆分（互動後才載入），降低切頁首幀負載。
- 對高頻模組加入 `modulepreload` 策略，平衡首屏與切頁體感。
- 以 Lighthouse 與 Web Vitals（FCP/LCP/TTI）建立固定基準，納入每次釋出驗收清單。

## 操作範例（團隊可直接複用）

```bash
# 1) 產生最新 bundle JSON
npm run perf:bundle-report:json

# 2) 比對兩份 JSON 並輸出 markdown（可貼 PR）
npm run perf:bundle-diff:md -- dist/bundle-report-base.json dist/bundle-report.json --out docs/perf-diff.md

# 3) 本機預算檢查（與 CI 門檻一致）
npm run perf:bundle-check:demo
```
