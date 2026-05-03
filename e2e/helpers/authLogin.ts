import { expect, type Page, type TestInfo } from '@playwright/test'

/** 可選登入 E2E 憑證（未設則 `test:e2e:auth` 內各案例 skip）。 */
export function getE2EAuthCredentials(): { email: string; password: string } | null {
  const email = process.env.E2E_AUTH_EMAIL?.trim()
  const password = process.env.E2E_AUTH_PASSWORD?.trim()
  if (!email || !password) return null
  return { email, password }
}

/** 未設 `E2E_AUTH_*` 時略過；已設則回傳非空憑證。 */
export function getE2EAuthCredentialsOrSkip(testInfo: TestInfo): { email: string; password: string } {
  const creds = getE2EAuthCredentials()
  testInfo.skip(!creds, '未設定 E2E_AUTH_EMAIL／E2E_AUTH_PASSWORD，略過（見 .env.example）')
  return creds!
}

/** 由登入頁輸入帳密並等待導向儀表盤（Seq 3 可選登入路徑）。 */
export async function loginWithE2ECredentials(
  page: Page,
  creds: { email: string; password: string },
): Promise<void> {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'STARCARE 登入' })).toBeVisible()
  await page.getByLabel('電子郵件').fill(creds.email)
  await page.getByLabel('密碼').fill(creds.password)
  await page.getByRole('button', { name: '登入' }).click()
  await expect(page).toHaveURL(/#dashboard/, { timeout: 25_000 })
}
