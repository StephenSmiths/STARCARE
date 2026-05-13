import { defineConfig, devices } from '@playwright/test'

/**
 * 可選登入 E2E：建置時 **保留** `VITE_SUPABASE_*`（讀取執行環境／`.env`），與 `playwright.config.ts` 之 demo bundle 分離。
 * 執行：`E2E_AUTH_EMAIL`、`E2E_AUTH_PASSWORD` 已設定時跑 `npm run test:e2e:auth`；未設定則測試標記為 skip。登入步驟見 `e2e/helpers/authLogin.ts`；案例分 **`auth-login.spec.ts`**（儀表盤～排班）與 **`auth-login.staff-modules.spec.ts`**（其餘 hash）；**`auth-login.system-settings-p2.spec.ts`**（**`#system-settings`** **P2** **h3**；優先 **`E2E_AUTH_TEAMLEAD_*`**，否則 **`E2E_AUTH_ADMIN_*`**，與 **`VITE_SUPABASE_*`**）；涵蓋 `#service-forms`…`#user-manual`（預設 **Staff** 可進；無 **`view:work-analysis-review`**／**`view:system-settings`**）。
 */
export default defineConfig({
  testDir: 'e2e',
  testMatch: '**/auth-login*.spec.ts',
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:4174',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run build && npm run preview -- --host 127.0.0.1 --port 4174 --strictPort',
    url: 'http://127.0.0.1:4174',
    reuseExistingServer: process.env.PW_REUSE_SERVER === '1',
    timeout: 120_000,
    env: { ...process.env },
  },
})
