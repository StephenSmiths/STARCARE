import { expect, test, type TestInfo } from '@playwright/test'
import { loginWithE2ECredentials } from './helpers/authLogin'

const getCredsByPrefix = (prefix: 'E2E_AUTH_TEAMLEAD' | 'E2E_AUTH_ADMIN') => {
  const email = process.env[`${prefix}_EMAIL`]?.trim()
  const password = process.env[`${prefix}_PASSWORD`]?.trim()
  if (!email || !password) return null
  return { email, password }
}

/** **TeamLead**／**Admin** 具 **`view:system-settings`**；**Staff** 會被導回儀表盤。優先 **`E2E_AUTH_TEAMLEAD_*`**，否則 **`E2E_AUTH_ADMIN_*`**（與 **`auth-login.user-role-admin.spec.ts`** Admin 鍵名同源）。 */
const requireTeamLeadOrAdminCreds = (testInfo: TestInfo) => {
  const tl = getCredsByPrefix('E2E_AUTH_TEAMLEAD')
  if (tl) return tl
  const admin = getCredsByPrefix('E2E_AUTH_ADMIN')
  testInfo.skip(
    !admin,
    '未設定 E2E_AUTH_TEAMLEAD_* 或 E2E_AUTH_ADMIN_EMAIL／E2E_AUTH_ADMIN_PASSWORD，略過（見 .env.example）',
  )
  return admin!
}

test.describe('auth-login（Seq 29 系統設定 P2，需 TeamLead 或 Admin 憑證）', () => {
  test('登入後 #system-settings 可見五處 P2 小節 h3', async ({ page }, testInfo) => {
    const supabaseUrl = process.env.VITE_SUPABASE_URL?.trim()
    const anonKey = process.env.VITE_SUPABASE_ANON_KEY?.trim()
    testInfo.skip(!supabaseUrl || !anonKey, '未設定 VITE_SUPABASE_URL／VITE_SUPABASE_ANON_KEY（auth 建置需兩鍵）')
    const creds = requireTeamLeadOrAdminCreds(testInfo)
    await loginWithE2ECredentials(page, creds)
    await page.goto('/#system-settings')
    await expect(page).toHaveURL(/#system-settings/, { timeout: 25_000 })
    await expect(page.getByRole('heading', { name: '系統設定', exact: true })).toBeVisible()

    const titles = [
      '固定活動（雲端政策 P2）',
      '資助復康三列（雲端政策 P2）',
      '資助職類矩陣（雲端政策 P2）',
      '資助 Pass 優先次序（雲端政策 P2）',
      '認知障礙症政策（雲端政策 P2）',
    ] as const

    for (const name of titles) {
      const h = page.getByRole('heading', { name, exact: true })
      await expect(h).toBeVisible({ timeout: 25_000 })
      expect(await h.evaluate((el) => el.tagName.toLowerCase())).toBe('h3')
    }
  })
})
