import { expect, test } from '@playwright/test'

/**
 * 與 `src/app/viewRouting.ts` 模組標題、各頁 **`AuditTrailPanel`** 標題對齊（demo 無 Supabase，Seq 3）。
 * 審計收合測試並斷言 **`aria-controls`** 與 **`hidden`**（Seq 12；與 Vitest 一致）。
 * **`#system-settings`** 另斷言本機草稿 **group**（**`aria-busy="false"`** 閒置）、**Pdf16 智能排班** 內 **排班時間設定**（含 **資助復康非治療排除** 多段 **`checkbox`**）／**排班規則設定（P1）** **`ListSectionPanel`**（**`aria-controls`**、無 **`hidden`**、兩區 **`id`** 有別）、**Pdf16 復康** 內 **資助復康服務（P1）** **`ListSectionPanel`** 預設收合（**展開**、**`aria-controls`**、**`hidden`**）、**政策版本** **`ListSectionPanel`** 預設展開、**收合**／**展開** 與 **`section[aria-labelledby]`**、**審計** **`section[aria-labelledby]`** 與 **展開審計**／**收合審計**（**`aria-controls`**、**`hidden`**、搜尋 **`placeholder`**）、**排班時間／規則／資助復康／政策／審計** 五區 **`aria-controls`** 目標 **`id`** 全相異（**`Set.size === 5`**）、**本機儲存** 鈕與無 Edge 說明（Seq 29 P1）。
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
    const expandAudit = page.getByRole('button', { name: '展開審計' })
    await expect(expandAudit).toBeVisible()
    const auditRegionId = await expandAudit.getAttribute('aria-controls')
    expect(auditRegionId).toBeTruthy()
    const auditRegion = page.locator(`[id="${auditRegionId}"]`)
    await expect(auditRegion).toHaveCount(1)
    await expect(auditRegion).toHaveAttribute('hidden', '')
    await expect(page.getByPlaceholder('搜尋 actor / entity / detail')).toHaveCount(0)

    await expandAudit.click()
    await expect(page.getByRole('button', { name: '收合審計' })).toBeVisible()
    await expect(auditRegion).not.toHaveAttribute('hidden')
    await expect(page.getByPlaceholder('搜尋 actor / entity / detail')).toBeVisible()

    await page.getByRole('button', { name: '收合審計' }).click()
    await expect(page.getByRole('button', { name: '展開審計' })).toBeVisible()
    await expect(auditRegion).toHaveAttribute('hidden', '')
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
        const localSettingsGroup = page.getByRole('group', { name: '本機設定（瀏覽器儲存）' })
        await expect(localSettingsGroup).toBeVisible()
        await expect(localSettingsGroup).toHaveAttribute('aria-busy', 'false')
        const schedulingHeading = page.getByRole('heading', { name: '智能排班設定', exact: true })
        await expect(schedulingHeading).toBeVisible()
        const schedulingSectionId = await schedulingHeading.getAttribute('id')
        expect(schedulingSectionId).toBeTruthy()
        const schedulingPdfSection = page.locator(`section[aria-labelledby="${schedulingSectionId}"]`)
        const scheduleTimeHeading = page.getByRole('heading', { name: '排班時間設定', exact: true })
        await expect(scheduleTimeHeading).toBeVisible()
        const scheduleTimePanel = schedulingPdfSection.locator('section').filter({ has: scheduleTimeHeading })
        const collapseScheduleTime = scheduleTimePanel.getByRole('button', { name: '收合' })
        await expect(collapseScheduleTime).toBeVisible()
        const scheduleTimeContentId = await collapseScheduleTime.getAttribute('aria-controls')
        expect(scheduleTimeContentId).toBeTruthy()
        await expect(page.locator(`[id="${scheduleTimeContentId}"]`)).not.toHaveAttribute('hidden')
        await expect(
          scheduleTimePanel.getByRole('checkbox', { name: /資助復康非治療排除/ }),
        ).toBeVisible()
        const rulesHeading = page.getByRole('heading', { name: '排班規則設定（P1）', exact: true })
        await expect(rulesHeading).toBeVisible()
        const rulesPanel = schedulingPdfSection.locator('section').filter({ has: rulesHeading })
        const collapseRules = rulesPanel.getByRole('button', { name: '收合' })
        await expect(collapseRules).toBeVisible()
        const rulesContentId = await collapseRules.getAttribute('aria-controls')
        expect(rulesContentId).toBeTruthy()
        expect(rulesContentId).not.toBe(scheduleTimeContentId)
        await expect(page.locator(`[id="${rulesContentId}"]`)).not.toHaveAttribute('hidden')
        const rehabHeading = page.getByRole('heading', { name: '復康服務基本設定', exact: true })
        await expect(rehabHeading).toBeVisible()
        const rehabSectionId = await rehabHeading.getAttribute('id')
        expect(rehabSectionId).toBeTruthy()
        expect(rehabSectionId).not.toBe(schedulingSectionId)
        const rehabPdfSection = page.locator(`section[aria-labelledby="${rehabSectionId}"]`)
        const subsidizedHeading = page.getByRole('heading', {
          name: '資助復康服務與認知障礙症服務（P1）',
          exact: true,
        })
        await expect(subsidizedHeading).toBeVisible()
        const subsidizedPanel = rehabPdfSection.locator('section').filter({ has: subsidizedHeading })
        const expandSubsidized = subsidizedPanel.getByRole('button', { name: '展開' })
        await expect(expandSubsidized).toBeVisible()
        const subsidizedContentId = await expandSubsidized.getAttribute('aria-controls')
        expect(subsidizedContentId).toBeTruthy()
        expect(subsidizedContentId).not.toBe(scheduleTimeContentId)
        expect(subsidizedContentId).not.toBe(rulesContentId)
        await expect(page.locator(`[id="${subsidizedContentId}"]`)).toHaveAttribute('hidden', '')
        const policyListHeading = page.getByRole('heading', {
          name: '政策版本（雲端提交）（P1）',
          exact: true,
        })
        await expect(policyListHeading).toBeVisible()
        await expect(page.getByRole('button', { name: '儲存設定（本機）' })).toBeVisible()
        await expect(page.getByText('未偵測到 Supabase 環境變數')).toBeVisible()
        const policyListPanel = page.locator('section').filter({ has: policyListHeading })
        const collapsePolicy = policyListPanel.getByRole('button', { name: '收合' })
        await expect(collapsePolicy).toBeVisible()
        const policyListContentId = await collapsePolicy.getAttribute('aria-controls')
        expect(policyListContentId).toBeTruthy()
        expect(policyListContentId).not.toBe(scheduleTimeContentId)
        expect(policyListContentId).not.toBe(rulesContentId)
        expect(policyListContentId).not.toBe(subsidizedContentId)
        const policyListContent = page.locator(`[id="${policyListContentId}"]`)
        await expect(policyListContent).toHaveCount(1)
        await expect(policyListContent).not.toHaveAttribute('hidden')
        await collapsePolicy.click()
        await expect(policyListContent).toHaveAttribute('hidden', '')
        await policyListPanel.getByRole('button', { name: '展開' }).click()
        await expect(policyListContent).not.toHaveAttribute('hidden')
        const policyListHeadingId = await policyListHeading.getAttribute('id')
        expect(policyListHeadingId).toBeTruthy()
        await expect(page.locator(`section[aria-labelledby="${policyListHeadingId}"]`)).toHaveCount(1)
        const auditTrailHeading = page.getByRole('heading', { name: '系統設定與相關審計（全域）', exact: true })
        await expect(auditTrailHeading).toBeVisible()
        const auditTrailHeadingId = await auditTrailHeading.getAttribute('id')
        expect(auditTrailHeadingId).toBeTruthy()
        const auditSection = page.locator(`section[aria-labelledby="${auditTrailHeadingId}"]`)
        await expect(auditSection).toHaveCount(1)
        const expandAuditSys = auditSection.getByRole('button', { name: '展開審計' })
        await expect(expandAuditSys).toBeVisible()
        const auditRegionIdSys = await expandAuditSys.getAttribute('aria-controls')
        expect(auditRegionIdSys).toBeTruthy()
        const auditRegionSys = page.locator(`[id="${auditRegionIdSys}"]`)
        await expect(auditRegionSys).toHaveCount(1)
        await expect(auditRegionSys).toHaveAttribute('hidden', '')
        await expect(page.getByPlaceholder('搜尋 actor / entity / detail')).toHaveCount(0)

        await expandAuditSys.click()
        await expect(auditSection.getByRole('button', { name: '收合審計' })).toBeVisible()
        await expect(auditRegionSys).not.toHaveAttribute('hidden')
        await expect(page.getByPlaceholder('搜尋 actor / entity / detail')).toBeVisible()

        await auditSection.getByRole('button', { name: '收合審計' }).click()
        await expect(expandAuditSys).toBeVisible()
        await expect(auditRegionSys).toHaveAttribute('hidden', '')
        await expect(page.getByPlaceholder('搜尋 actor / entity / detail')).toHaveCount(0)
        expect(
          new Set([
            scheduleTimeContentId!,
            rulesContentId!,
            subsidizedContentId!,
            policyListContentId!,
            auditRegionIdSys!,
          ]).size,
        ).toBe(5)
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
