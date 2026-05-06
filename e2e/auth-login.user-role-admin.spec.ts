import { expect, test, type TestInfo } from '@playwright/test'
import { loginWithE2ECredentials } from './helpers/authLogin'

const getCredsByPrefix = (prefix: 'E2E_AUTH_ADMIN' | 'E2E_AUTH_STAFF') => {
  const email = process.env[`${prefix}_EMAIL`]?.trim()
  const password = process.env[`${prefix}_PASSWORD`]?.trim()
  if (!email || !password) return null
  return { email, password }
}

const requireCreds = (testInfo: TestInfo, prefix: 'E2E_AUTH_ADMIN' | 'E2E_AUTH_STAFF') => {
  const creds = getCredsByPrefix(prefix)
  testInfo.skip(!creds, `未設定 ${prefix}_EMAIL／${prefix}_PASSWORD，略過`)
  return creds!
}

/** 從 localStorage 取 Supabase session access token（供 staff 403 API 抽測） */
const readAccessToken = async (page: Parameters<typeof test>[0]['page']): Promise<string> =>
  page.evaluate(() => {
    const key = Object.keys(localStorage).find((k) => k.includes('auth-token'))
    if (!key) return ''
    const raw = localStorage.getItem(key)
    if (!raw) return ''
    try {
      const parsed = JSON.parse(raw) as { access_token?: string }
      return typeof parsed.access_token === 'string' ? parsed.access_token : ''
    } catch {
      return ''
    }
  })

test.describe('auth-login（可選，user-role-admin）', () => {
  test('admin 可進入 #user-role-admin 並提交角色設定請求', async ({ page }, testInfo) => {
    const creds = requireCreds(testInfo, 'E2E_AUTH_ADMIN')
    await loginWithE2ECredentials(page, creds)
    await page.goto('/#user-role-admin')
    await expect(page).toHaveURL(/#user-role-admin/)
    await expect(page.getByRole('heading', { name: '使用者角色（Admin）', exact: true })).toBeVisible()
    await page.getByLabel('目標電子郵件').fill(creds.email)
    await page.getByLabel('新角色').selectOption('admin')
    await page.getByRole('button', { name: '變更角色' }).click()
    await expect(page.getByText(/已將使用者/)).toBeVisible({ timeout: 25_000 })
  })

  test('staff 呼叫 admin-user-role-set API 會回 403', async ({ page }, testInfo) => {
    const creds = requireCreds(testInfo, 'E2E_AUTH_STAFF')
    const supabaseUrl = process.env.VITE_SUPABASE_URL?.trim()
    const anonKey = process.env.VITE_SUPABASE_ANON_KEY?.trim()
    testInfo.skip(!supabaseUrl || !anonKey, '未設定 VITE_SUPABASE_URL／VITE_SUPABASE_ANON_KEY')
    await loginWithE2ECredentials(page, creds)
    const token = await readAccessToken(page)
    testInfo.skip(!token, '無法從 localStorage 取得 staff access token')
    const status = await page.evaluate(
      async ({ url, apikey, bearer }) => {
        const res = await fetch(`${url}/functions/v1/admin-user-role-set`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey,
            Authorization: `Bearer ${bearer}`,
          },
          body: JSON.stringify({ targetEmail: 'nobody@example.com', role: 'staff' }),
        })
        return res.status
      },
      { url: supabaseUrl!, apikey: anonKey!, bearer: token },
    )
    expect(status).toBe(403)
  })
})
