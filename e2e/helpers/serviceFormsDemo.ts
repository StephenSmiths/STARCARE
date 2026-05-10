import { expect, type Locator, type Page } from '@playwright/test'

/** 01 §2.2：`readOnly`／`disabled` 與 `ServiceFormStaffPanel` 一致。 */
/** 已接收 `session-1`＋種子院友之前提下，完成草稿並提交審核（01 §2.1）。 */
export const fillAcceptedSessionDraftAndSubmit = async (staff: Locator, narrative: string): Promise<void> => {
  await staff.getByLabel('服務日期').fill('2026-04-30')
  await staff.getByLabel('工作節（已接收）').selectOption('session-1')
  await staff.getByLabel('院友').selectOption('demo-resident-e2e-1')
  await staff.getByPlaceholder('簡述本次服務內容…').fill(narrative)
  await staff.getByRole('button', { name: '儲存草稿' }).click()
  await staff.getByRole('button', { name: '提交審核' }).click()
}

export const expectStaffServiceFormFieldsReadOnly = async (staff: Locator): Promise<void> => {
  await expect(staff.getByLabel('服務日期')).toBeDisabled()
  await expect(staff.getByLabel('工作節（已接收）')).toBeDisabled()
  await expect(staff.getByLabel('院友')).toBeDisabled()
  await expect(staff.getByLabel('服務紀要')).toHaveAttribute('readonly', '')
  await expect(staff.getByRole('button', { name: '儲存草稿' })).toBeDisabled()
  await expect(staff.getByRole('button', { name: '提交審核' })).toBeDisabled()
}

/** 與 `workSessionResponseStore` 預設種子一致（session-1 已接收）。 */
type WorkRow = { sessionId: string; status: string; actorId: string; occurredAt: string }
const workRowsAccepted: WorkRow[] = [
  {
    sessionId: 'session-1',
    status: 'ACCEPTED',
    actorId: 'TeamLead_demo',
    occurredAt: '2026-05-01T00:00:00.000Z',
  },
]

/**
 * 先載入 `#service-forms` 再寫入 localStorage 並 **reload**，讓前端 store 重新 hydrate（Seq 3 demo）。
 * 僅 `addInitScript` 時，部分環境下與首屏模組載入競態會導致選單無節次。
 */
export const prepareServiceFormsDemoStorage = async (page: Page, forms: 'clear' | string): Promise<void> => {
  await page.goto('/#service-forms')
  await page.evaluate(
    (opts: { mode: 'clear' | 'set'; formsJson: string; rows: WorkRow[] }) => {
      const kWork = 'starcare-work-session-responses-v1'
      const kForms = 'starcare-service-forms-v1'
      localStorage.setItem(kWork, JSON.stringify(opts.rows))
      if (opts.mode === 'clear') localStorage.removeItem(kForms)
      else localStorage.setItem(kForms, opts.formsJson)
    },
    {
      mode: forms === 'clear' ? 'clear' : 'set',
      formsJson: forms === 'clear' ? '' : forms,
      rows: workRowsAccepted,
    },
  )
  await page.reload()
}

/**
 * `ServiceFormsHome` 之「待審核清單」預設收合且子樹未掛載；審核斷言前須展開。
 * 提交表單後 `runSubmit` 會觸發 `reloadContext()`，整模組重掛載後此區塊會再次收合，須重複呼叫。
 */
export const expandServiceFormsPendingReviewIfCollapsed = async (page: Page): Promise<void> => {
  await expect(page.getByRole('heading', { name: '服務表單', exact: true })).toBeVisible()
  // 提交後 `reloadContext()` 期間僅顯示「載入服務表單模組…」，須待清單區掛回再判斷收合。
  await expect(page.getByRole('heading', { name: '待審核清單' })).toBeVisible({ timeout: 20_000 })
  const pendingListSection = page.locator('section').filter({
    has: page.getByRole('heading', { name: '待審核清單' }),
  })
  const expandBtn = pendingListSection.getByRole('button', { name: '展開' })
  if (await expandBtn.isVisible()) {
    await expandBtn.click()
  }
}

/** `prepareServiceFormsDemoStorage` 後斷言模組標題並回傳 Staff／待審區塊定位器。 */
export const loadServiceFormsDemoPage = async (
  page: Page,
  forms: 'clear' | string,
): Promise<{ staff: Locator; review: Locator }> => {
  await prepareServiceFormsDemoStorage(page, forms)
  await expandServiceFormsPendingReviewIfCollapsed(page)
  return {
    staff: page.locator('section').filter({ hasText: '填寫服務表單（Staff）' }),
    review: page.locator('section').filter({ hasText: '待審服務表單' }),
  }
}

export const acceptAllDialogs = (page: Page): void => {
  page.on('dialog', (d) => {
    void d.accept()
  })
}
