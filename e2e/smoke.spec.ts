import { expect, test } from '@playwright/test'

/**
 * 與 `src/app/viewRouting.ts` 模組標題、各頁 `AuditTrailPanel` 標題對齊（demo 無 Supabase，Seq 3）。
 * **`#system-settings`** 另斷言本機草稿 **group**（Seq 29 P1）。
 * 不含 `#dashboard`（首屏另測）、不含 `#user-manual`（無審計區，另測）。
 */
const HASH_AUDIT_CASES: ReadonlyArray<{
  hash: string
  moduleTitle: string
  auditHeading: RegExp
  /** 頁內次要標題（例如 Seq 14 五步進度列） */
  pageHeading?: RegExp
}> = [
  { hash: 'work-analysis-review', moduleTitle: '工作分析／表單審核', auditHeading: /表單與審批相關審計/ },
  { hash: 'work-session-plans', moduleTitle: '工作計劃', auditHeading: /工作節與計劃審計/ },
  { hash: 'shift-start-handover', moduleTitle: '開工接更', auditHeading: /開工接更審計/ },
  { hash: 'staff-import', moduleTitle: '員工管理', auditHeading: /員工與匯入審計/ },
  { hash: 'activity-sessions-import', moduleTitle: '活動時段匯入', auditHeading: /活動時段與排班審計/ },
  { hash: 'notification-center', moduleTitle: '通知中心', auditHeading: /審計紀錄節錄/ },
  { hash: 'scheduling', moduleTitle: '智能排班', auditHeading: /排班與相關操作審計/ },
  { hash: 'service-forms', moduleTitle: '服務表單', auditHeading: /服務表單相關審計/ },
  { hash: 'historical-documents', moduleTitle: '歷史文件', auditHeading: /匯出審計/ },
  {
    hash: 'work-plan',
    moduleTitle: '創建工作計劃',
    auditHeading: /工作計劃發布審計/,
    pageHeading: /創建工作計劃（五步）/,
  },
  { hash: 'residents', moduleTitle: '院友管理', auditHeading: /最近審計紀錄/ },
  { hash: 'shift-end-handover', moduleTitle: '收工交更', auditHeading: /收工交更審計/ },
  { hash: 'rehab-activity-tracking', moduleTitle: '復康活動追蹤', auditHeading: /復康／排班相關審計/ },
  { hash: 'assessment-management', moduleTitle: '評估管理', auditHeading: /評估相關審計/ },
  { hash: 'system-settings', moduleTitle: '系統設定', auditHeading: /系統設定與相關審計/ },
  { hash: 'ai-report-center', moduleTitle: 'AI 報告中心', auditHeading: /報告中心審計/ },
]

test.describe('smoke', () => {
  test('audit panel 預設收合，可展開與收回', async ({ page }) => {
    await page.goto('/#staff-import')
    await expect(page.getByRole('heading', { name: '員工管理', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: '展開審計' })).toBeVisible()
    await expect(page.getByPlaceholder('搜尋 actor / entity / detail')).toHaveCount(0)

    await page.getByRole('button', { name: '展開審計' }).click()
    await expect(page.getByRole('button', { name: '收合審計' })).toBeVisible()
    await expect(page.getByPlaceholder('搜尋 actor / entity / detail')).toBeVisible()

    await page.getByRole('button', { name: '收合審計' }).click()
    await expect(page.getByRole('button', { name: '展開審計' })).toBeVisible()
    await expect(page.getByPlaceholder('搜尋 actor / entity / detail')).toHaveCount(0)
  })

  test('首屏載入、導向儀表盤且模組與審計標題可見', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#root')).toBeVisible()
    await expect(page).toHaveURL(/#dashboard/)
    await expect(page.getByRole('heading', { name: '儀表盤', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: /全域審計摘要/ })).toBeVisible()
  })

  for (const row of HASH_AUDIT_CASES) {
    test(`hash #${row.hash}：模組與審計標題`, async ({ page }) => {
      await page.goto(`/#${row.hash}`)
      await expect(page).toHaveURL(new RegExp(`#${row.hash}`))
      await expect(page.getByRole('heading', { name: row.moduleTitle, exact: true })).toBeVisible()
      if (row.pageHeading) {
        await expect(page.getByRole('heading', { name: row.pageHeading })).toBeVisible()
      }
      await expect(page.getByRole('heading', { name: row.auditHeading })).toBeVisible()
      if (row.hash === 'system-settings') {
        await expect(page.getByRole('group', { name: '本機設定（瀏覽器儲存）' })).toBeVisible()
      }
    })
  }

  test('hash #user-manual：模組與快速上手', async ({ page }) => {
    await page.goto('/#user-manual')
    await expect(page).toHaveURL(/#user-manual/)
    await expect(page.getByRole('heading', { name: '用戶手冊', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: '快速上手', exact: true })).toBeVisible()
  })
})
