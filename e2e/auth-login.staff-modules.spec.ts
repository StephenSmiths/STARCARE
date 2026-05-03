import { expect, test } from '@playwright/test'
import { getE2EAuthCredentialsOrSkip, loginWithE2ECredentials } from './helpers/authLogin'

/** 與 `auth-login.spec.ts` 同組 describe，拆檔以遵守單檔 ≤200 行（Seq 3／37）。 */
test.describe('auth-login（可選，Seq 3 登入後路徑）', () => {
  test('登入後可開啟通知中心（#notification-center）', async ({ page }, testInfo) => {
    const creds = getE2EAuthCredentialsOrSkip(testInfo)
    await loginWithE2ECredentials(page, creds)
    await page.goto('/#notification-center')
    await expect(page).toHaveURL(/#notification-center/)
    await expect(page.getByRole('heading', { name: '通知中心', exact: true })).toBeVisible()
    await expect(page.getByText(/未讀通知/)).toBeVisible()
    await expect(page.getByRole('heading', { name: /審計紀錄節錄/ })).toBeVisible()
  })

  test('登入後可開啟歷史文件（#historical-documents）', async ({ page }, testInfo) => {
    const creds = getE2EAuthCredentialsOrSkip(testInfo)
    await loginWithE2ECredentials(page, creds)
    await page.goto('/#historical-documents')
    await expect(page).toHaveURL(/#historical-documents/)
    await expect(page.getByRole('heading', { name: '歷史文件', exact: true })).toBeVisible()
    await expect(page.getByText(/母本要求僅展示/)).toBeVisible({ timeout: 25_000 })
    await expect(page.getByRole('heading', { name: /匯出審計/ })).toBeVisible()
  })

  test('登入後可開啟開工接更（#shift-start-handover）', async ({ page }, testInfo) => {
    const creds = getE2EAuthCredentialsOrSkip(testInfo)
    await loginWithE2ECredentials(page, creds)
    await page.goto('/#shift-start-handover')
    await expect(page).toHaveURL(/#shift-start-handover/)
    await expect(page.getByRole('heading', { name: '開工接更', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: '開工接更（PDF 02【5b】）' })).toBeVisible({ timeout: 25_000 })
    await expect(page.getByRole('heading', { name: /開工接更審計/ })).toBeVisible()
  })

  test('登入後可開啟收工交更（#shift-end-handover）', async ({ page }, testInfo) => {
    const creds = getE2EAuthCredentialsOrSkip(testInfo)
    await loginWithE2ECredentials(page, creds)
    await page.goto('/#shift-end-handover')
    await expect(page).toHaveURL(/#shift-end-handover/)
    await expect(page.getByRole('heading', { name: '收工交更', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: '收工交更（PDF 02【6】）' })).toBeVisible({ timeout: 25_000 })
    await expect(page.getByRole('heading', { name: /收工交更審計/ })).toBeVisible()
  })

  test('登入後可開啟復康活動追蹤（#rehab-activity-tracking）', async ({ page }, testInfo) => {
    const creds = getE2EAuthCredentialsOrSkip(testInfo)
    await loginWithE2ECredentials(page, creds)
    await page.goto('/#rehab-activity-tracking')
    await expect(page).toHaveURL(/#rehab-activity-tracking/)
    await expect(page.getByRole('heading', { name: '復康活動追蹤', exact: true })).toBeVisible()
    await expect(page.getByText(/乾跑預覽/)).toBeVisible({ timeout: 25_000 })
    await expect(page.getByRole('heading', { name: /復康／排班相關審計/ })).toBeVisible()
  })

  test('登入後可開啟評估管理（#assessment-management）', async ({ page }, testInfo) => {
    const creds = getE2EAuthCredentialsOrSkip(testInfo)
    await loginWithE2ECredentials(page, creds)
    await page.goto('/#assessment-management')
    await expect(page).toHaveURL(/#assessment-management/)
    await expect(page.getByRole('heading', { name: '評估管理', exact: true })).toBeVisible()
    await expect(page.getByText(/週期與待辦規則/)).toBeVisible({ timeout: 25_000 })
    await expect(page.getByRole('heading', { name: /評估相關審計/ })).toBeVisible()
  })

  test('登入後可開啟用戶手冊（#user-manual）', async ({ page }, testInfo) => {
    const creds = getE2EAuthCredentialsOrSkip(testInfo)
    await loginWithE2ECredentials(page, creds)
    await page.goto('/#user-manual')
    await expect(page).toHaveURL(/#user-manual/)
    await expect(page.getByRole('heading', { name: '用戶手冊', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: '快速上手', exact: true })).toBeVisible()
  })
})
