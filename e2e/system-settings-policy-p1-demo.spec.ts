import { expect, test } from '@playwright/test'

/**
 * Demo 建置（`VITE_SUPABASE_*` 清空）：與 **`npm run test:e2e:smoke`** 同型 preview；
 * 驗證 Seq 29 P1：**Pdf16 大節**、**政策版本** landmark 與無 Edge 時之本機說明（對照 UAT 未設 env 預期）。
 */
test.describe('system-settings policy P1（demo 無 Supabase）', () => {
  test('政策區塊標題與本機儲存說明可見', async ({ page }) => {
    await page.goto('/#system-settings')
    await expect(page).toHaveURL(/#system-settings/)
    await expect(page.getByRole('heading', { name: '系統設定', exact: true })).toBeVisible()
    const schedulingHeading = page.getByRole('heading', { name: '智能排班設定', exact: true })
    await expect(schedulingHeading).toBeVisible()
    const schedulingSectionId = await schedulingHeading.getAttribute('id')
    expect(schedulingSectionId).toBeTruthy()
    await expect(page.locator(`section[aria-labelledby="${schedulingSectionId}"]`)).toHaveCount(1)
    const localGroup = page.getByRole('group', { name: '本機設定（瀏覽器儲存）' })
    await expect(localGroup).toBeVisible()
    await expect(localGroup).toHaveAttribute('aria-busy', 'false')
    const policyHeading = page.getByRole('heading', { name: '政策版本（雲端提交）（P1）', exact: true })
    await expect(policyHeading).toBeVisible()
    const policyHeadingId = await policyHeading.getAttribute('id')
    expect(policyHeadingId).toBeTruthy()
    await expect(page.locator(`section[aria-labelledby="${policyHeadingId}"]`)).toHaveCount(1)
    await expect(page.getByText('未偵測到 Supabase 環境變數')).toBeVisible()
    await expect(page.getByRole('button', { name: '儲存設定（本機）' })).toBeVisible()
  })
})
