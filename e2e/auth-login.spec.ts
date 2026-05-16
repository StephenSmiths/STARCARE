import { expect, test } from '@playwright/test'
import { RESIDENT_LIST_LOAD_ERROR_MESSAGE } from '../src/features/residents/services/residentListRefreshOutcome'
import { SCHEDULING_DATA_LOAD_ERROR_MESSAGE } from '../src/features/scheduling/services/schedulingDataLoadMessage'
import {
  expandServiceFormsReviewSection,
  isStaffOnlyE2ELogin,
  shouldSkipResidentsModuleForStaffE2E,
} from './helpers/authE2ERolePaths'
import { getE2EAuthCredentialsOrSkip, loginWithE2ECredentials } from './helpers/authLogin'

test.describe('auth-login（可選，Seq 3 登入後路徑）', () => {
  test('登入後可導向儀表盤並見全域審計摘要', async ({ page }, testInfo) => {
    const creds = getE2EAuthCredentialsOrSkip(testInfo)
    await loginWithE2ECredentials(page, creds)
    await expect(page.getByRole('heading', { name: '儀表盤', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: /全域審計摘要/ })).toBeVisible()
    await expect(page.locator('#app-sidebar-nav')).toBeVisible()
    await expect(page.getByRole('button', { name: '登出' })).toBeVisible()
  })

  test('登入後可開啟服務表單（#service-forms）並見模組標題', async ({ page }, testInfo) => {
    const creds = getE2EAuthCredentialsOrSkip(testInfo)
    await loginWithE2ECredentials(page, creds)
    await page.goto('/#service-forms')
    await expect(page).toHaveURL(/#service-forms/)
    await expect(page.getByRole('heading', { name: '服務表單', exact: true })).toBeVisible()
    // 工作區載入完成後才渲染 Staff／待審面板（與 demo 煙霧區隔：真庫須無 loadError）
    await expect(page.getByRole('heading', { name: '填寫服務表單（Staff）' })).toBeVisible({ timeout: 25_000 })
    await expandServiceFormsReviewSection(page)
    if (isStaffOnlyE2ELogin()) {
      await expect(page.getByRole('heading', { name: '表單審核' })).toBeVisible()
      await expect(page.getByText('Staff 無審批權限')).toBeVisible()
    } else {
      await expect(page.getByRole('heading', { name: '待審服務表單' })).toBeVisible({ timeout: 15_000 })
    }
    await expect(page.getByText('無法載入時段或院友資料')).toHaveCount(0)
    await expect(page.getByRole('heading', { name: /服務表單相關審計/ })).toBeVisible()
  })

  test('登入後可開啟工作計劃（#work-session-plans）並見我的計劃區塊', async ({ page }, testInfo) => {
    const creds = getE2EAuthCredentialsOrSkip(testInfo)
    await loginWithE2ECredentials(page, creds)
    await page.goto('/#work-session-plans')
    await expect(page).toHaveURL(/#work-session-plans/)
    await expect(page.getByRole('heading', { name: '工作計劃', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: '我的工作計劃' }).first()).toBeVisible({ timeout: 25_000 })
    await expect(page.getByText('無法載入工作計劃時段，請稍後重試。')).toHaveCount(0)
    await expect(page.getByRole('heading', { name: /工作節與計劃審計/ })).toBeVisible()
  })

  test('登入後可開啟院友管理（#residents）並見概覽與審計區', async ({ page }, testInfo) => {
    testInfo.skip(
      shouldSkipResidentsModuleForStaffE2E(),
      'Staff 無 view:residents；請用 E2E_AUTH_TEAMLEAD_* 或 Admin 帳號',
    )
    const creds = getE2EAuthCredentialsOrSkip(testInfo)
    await loginWithE2ECredentials(page, creds)
    await page.goto('/#residents')
    await expect(page).toHaveURL(/#residents/)
    await expect(page.getByRole('heading', { name: '院友管理', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: '院友資料概覽' })).toBeVisible({ timeout: 25_000 })
    await expect(page.getByText(RESIDENT_LIST_LOAD_ERROR_MESSAGE)).toHaveCount(0)
    await expect(page.getByRole('heading', { name: /最近審計紀錄/ })).toBeVisible()
  })

  test('登入後可開啟智能排班（#scheduling）並見排班主區塊', async ({ page }, testInfo) => {
    const creds = getE2EAuthCredentialsOrSkip(testInfo)
    await loginWithE2ECredentials(page, creds)
    await page.goto('/#scheduling')
    await expect(page).toHaveURL(/#scheduling/)
    await expect(page.getByRole('heading', { name: '智能排班', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: /本次排班指派/ })).toBeVisible({ timeout: 25_000 })
    await expect(page.getByText(SCHEDULING_DATA_LOAD_ERROR_MESSAGE)).toHaveCount(0)
    await expect(page.getByRole('heading', { name: /排班與相關操作審計/ })).toBeVisible()
  })
})
