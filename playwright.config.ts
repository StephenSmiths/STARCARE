import { defineConfig, devices } from '@playwright/test'

const previewHost = '127.0.0.1'
const previewPort = '4173'
const previewOnly = process.env.PW_PREVIEW_ONLY === '1'
const webServerCommand = previewOnly
  ? `npm run preview -- --host ${previewHost} --port ${previewPort} --strictPort`
  : `npm run build && npm run preview -- --host ${previewHost} --port ${previewPort} --strictPort`

/**
 * E2E：Seq 3 等流程之骨架；預設以 production build + preview（與 CI 一致）。
 * 未設 Supabase 時 App 以 TeamLead demo 權限載入儀表盤，無需真實登入。
 * `auth-login*.spec.ts` 僅供 `playwright.auth.config.ts`（含 Supabase 建置），見 `npm run test:e2e:auth`。
 * CI 可設 **`PW_PREVIEW_ONLY=1`** 並先 **`npm run build:demo`**（清空 `VITE_SUPABASE_*` 建置），避免 webServer 重複建置且與 demo bundle 一致。
 * 快速煙霧：`npm run test:e2e:smoke`（先 **`build:demo`** 再跑 `smoke.spec.ts`）。
 * 若本機 `.env` 含 Supabase，**務必**以 **`build:demo`** 建置後再跑 E2E，否則 bundle 內嵌真實 URL 會破壞 demo 流程（與 CI 不一致）。
 * 部分受限執行環境下 Chromium 可能 SIGSEGV，請於一般終端或 CI（Ubuntu）重跑。
 *
 * **Demo 錄影**：`PW_DEMO_VIDEO=1` 時 **`headless: false`**、`slowMo`、viewport **1920×1080**、**`deviceScaleFactor: 2`**（Retina／2× 彩現，錄影約 **3840×2160** 等效細節，比 1× 大字清晰）。
 * 勿再用 2560×1440×1×：檔案大但字緣仍易糊。`video` 不強制 `size`（由 Playwright 對齊實際擷取）。
 * 可選 **`PW_DEMO_USE_CHROME=1`** 改用本機 **Google Chrome**。
 */
const demoVideo = process.env.PW_DEMO_VIDEO === '1'
const demoUseChrome = process.env.PW_DEMO_USE_CHROME === '1'
/** Demo：Full HD 邏輯解析度 + 2× 裝置像素比（字體／邊緣較鋭） */
const DEMO_VIEWPORT = { width: 1920, height: 1080 } as const

export default defineConfig({
  testDir: 'e2e',
  testIgnore: '**/auth-login*.spec.ts',
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list']],
  use: {
    baseURL: `http://${previewHost}:${previewPort}`,
    trace: demoVideo ? 'off' : 'on-first-retry',
    video: demoVideo ? { mode: 'on' } : 'off',
    launchOptions: demoVideo
      ? {
          slowMo: 900,
          args: [
            '--force-device-scale-factor=2',
            // 外層視窗略大於 viewport，避免瀏覽器 UI 吃掉內容區
            `--window-size=${DEMO_VIEWPORT.width + 120},${DEMO_VIEWPORT.height + 140}`,
          ],
        }
      : undefined,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        ...(demoVideo
          ? {
              viewport: DEMO_VIEWPORT,
              deviceScaleFactor: 2,
              headless: false,
              ...(demoUseChrome ? { channel: 'chrome' as const } : {}),
            }
          : {}),
      },
    },
  ],
  webServer: {
    command: webServerCommand,
    url: `http://${previewHost}:${previewPort}`,
    // 預設不重用以避免本機已開的 preview（含 .env Supabase）與 E2E 所需之「無 Supabase」bundle 不一致。
    reuseExistingServer: process.env.PW_REUSE_SERVER === '1',
    timeout: 120_000,
    // 覆寫本機 .env，使 bundle 走「未設定 Supabase」之 TeamLead demo（見 AuthProvider），E2E 不需真實登入。
    env: {
      ...process.env,
      VITE_SUPABASE_URL: '',
      VITE_SUPABASE_ANON_KEY: '',
    },
  },
})
