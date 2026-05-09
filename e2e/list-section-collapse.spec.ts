import { expect, test, type Page } from '@playwright/test'

const toggleListSection = async (
  page: Page,
  headingName: RegExp,
  expectDefaultExpanded: boolean,
  revealText: RegExp,
) => {
  const sections = page.locator('section').filter({
    has: page.getByRole('heading', { name: headingName }),
  })
  const count = await sections.count()
  expect(count).toBeGreaterThan(0)
  const section = sections.first()

  const expandBtn = section.getByRole('button', { name: '展開' })
  const collapseBtn = section.getByRole('button', { name: '收合' })

  if (expectDefaultExpanded) {
    await expect(collapseBtn).toBeVisible()
    await collapseBtn.click()
    await expect(expandBtn).toBeVisible()
    await expandBtn.click()
  } else {
    await expect(expandBtn).toBeVisible()
    await expandBtn.click()
  }

  await expect(section.getByText(revealText)).toBeVisible()
}

test.describe('list section collapse', () => {
  test('staff-import：員工資料概覽可收合再展開', async ({ page }) => {
    await page.goto('/#staff-import')
    await expect(page.getByRole('heading', { name: '員工管理', exact: true })).toBeVisible()
    await toggleListSection(page, /員工資料概覽/, true, /匯出 Excel/)
  })

  test('activity-sessions-import：活動時段列表預設收合', async ({ page }) => {
    await page.goto('/#activity-sessions-import')
    await expect(page.getByRole('heading', { name: '活動時段匯入', exact: true })).toBeVisible()
    await toggleListSection(page, /活動時段列表/, false, /依 Seq 10/)
  })

  test('historical-documents：歷史文件清單預設收合', async ({ page }) => {
    await page.goto('/#historical-documents')
    await expect(page.getByRole('heading', { name: '歷史文件', exact: true })).toBeVisible()
    await toggleListSection(page, /已核准歷史文件清單/, false, /工作節日期/)
  })

  test('service-forms：待審核清單預設收合', async ({ page }) => {
    await page.goto('/#service-forms')
    await expect(page.getByRole('heading', { name: '服務表單', exact: true })).toBeVisible()
    await toggleListSection(page, /待審核清單/, false, /待審服務表單/)
  })

  test('assessment-management：完成紀錄預設收合', async ({ page }) => {
    await page.goto('/#assessment-management')
    await expect(page.getByRole('heading', { name: '評估管理', exact: true })).toBeVisible()
    await toggleListSection(page, /完成紀錄（最近優先）/, false, /版本/)
  })

  test('dashboard：快速連結預設收合', async ({ page }) => {
    await page.goto('/#dashboard')
    await expect(page.getByRole('heading', { name: '儀表盤', exact: true })).toBeVisible()
    await toggleListSection(page, /快速連結/, false, /智能排班/)
  })

  test('user-manual：文件章節可展開', async ({ page }) => {
    await page.goto('/#user-manual')
    const manualIntro = page.getByText(/此頁提供站內操作摘要/)
    test.skip((await manualIntro.count()) === 0, '預覽資料未開放用戶手冊視圖，跳過此案例')
    await expect(manualIntro).toBeVisible()
    await toggleListSection(page, /快速上手/, true, /左側選單已分組/)
  })
})
