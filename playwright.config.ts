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
 * **Demo 錄影**：`PW_DEMO_VIDEO=1` 時錄影、`slowMo`、viewport **1920×1080**、`deviceScaleFactor: 2`（錄影像素約 **3840×2160**，文字較銳利；勿只用 1080p×1× 否則放大播放易糊）。見 **`npm run test:e2e:demo:staff-batch-delete`**。
 */
const demoVideo = process.env.PW_DEMO_VIDEO === '1'
/** 邏輯 viewport（CSS px）；搭配 deviceScaleFactor:2 時錄影預設為寬高各 ×2 */
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
    // 不指定 size：依 Playwright 預設為 viewport×deviceScaleFactor（Demo 時約 3840×2160）
    video: demoVideo ? { mode: 'on' } : 'off',
    launchOptions: demoVideo
      ? {
          slowMo: 900,
          args: [`--window-size=${DEMO_VIEWPORT.width},${DEMO_VIEWPORT.height}`],
        }
      : undefined,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        ...(demoVideo ? { viewport: DEMO_VIEWPORT, deviceScaleFactor: 2 } : {}),
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
