import type { Page } from '@playwright/test'

/** 主登入為 Staff（含 GATEA_STAFF 補齊 E2E_AUTH）且未另設 TL／Admin。 */
export function isStaffOnlyE2ELogin(): boolean {
  const staffOnly =
    Boolean(process.env.E2E_AUTH_EMAIL?.trim()) &&
    !process.env.E2E_AUTH_TEAMLEAD_EMAIL?.trim() &&
    !process.env.E2E_AUTH_ADMIN_EMAIL?.trim()
  const gateaFallback =
    Boolean(process.env.GATEA_STAFF_EMAIL?.trim()) &&
    process.env.E2E_AUTH_EMAIL?.trim() === process.env.GATEA_STAFF_EMAIL?.trim()
  return staffOnly || gateaFallback
}

/** Staff 無 `view:residents`；真庫 E2E 以 Gate A staff 帳跑時略過該路徑。 */
export const shouldSkipResidentsModuleForStaffE2E = isStaffOnlyE2ELogin

/** 待審區塊預設收合；ListSectionPanel 內容未展開時不掛載子樹。 */
export async function expandServiceFormsReviewSection(page: Page): Promise<void> {
  const section = page.locator('section').filter({
    has: page.getByRole('heading', { name: '待審核清單' }),
  })
  const expandBtn = section.getByRole('button', { name: '展開' })
  if (await expandBtn.isVisible()) {
    await expandBtn.click()
  }
}
