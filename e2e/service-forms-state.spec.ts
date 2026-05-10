import { expect, test } from '@playwright/test'
import {
  acceptAllDialogs,
  expandServiceFormsPendingReviewIfCollapsed,
  fillAcceptedSessionDraftAndSubmit,
  loadServiceFormsDemoPage,
} from './helpers/serviceFormsDemo'

/**
 * Seq 3／01 §2 與 **01 §1**（不可自審）：demo（無 Supabase）下表單狀態與審核閉環之 E2E。
 * 儲存種子見 `e2e/helpers/serviceFormsDemo.ts`（goto→evaluate→reload）。
 */
test.describe('service-forms state (demo)', () => {
  test('已接收工作節可儲存草稿並顯示「草稿」（01 §2.1）', async ({ page }) => {
    acceptAllDialogs(page)
    const { staff } = await loadServiceFormsDemoPage(page, 'clear')
    await staff.getByLabel('服務日期').fill('2026-04-30')
    await staff.getByLabel('工作節（已接收）').selectOption('session-1')
    await staff.getByLabel('院友').selectOption('demo-resident-e2e-1')
    await staff.getByPlaceholder('簡述本次服務內容…').fill('Playwright 草稿紀要')
    await staff.getByRole('button', { name: '儲存草稿' }).click()

    await expect(staff.getByText('Playwright 草稿紀要')).toBeVisible()
    await expect(staff.getByText('草稿', { exact: true })).toBeVisible()
  })

  test('已接收工作節：草稿可提交為待審並出現在待審區（01 §2.1／§2.2）', async ({ page }) => {
    acceptAllDialogs(page)
    const { staff, review } = await loadServiceFormsDemoPage(page, 'clear')
    await fillAcceptedSessionDraftAndSubmit(staff, 'E2E 一鍵提交紀要')
    await expandServiceFormsPendingReviewIfCollapsed(page)
    await expect(staff.getByText('待審', { exact: true })).toBeVisible()
    await expect(review.getByText('E2E 一鍵提交紀要')).toBeVisible()
  })

  test('不可審批本人已提交表單：核准與退回均阻擋（01 §1）', async ({ page }) => {
    const dialogs: string[] = []
    page.on('dialog', (d) => {
      dialogs.push(d.message())
      void d.accept()
    })
    const { staff, review } = await loadServiceFormsDemoPage(page, 'clear')
    await fillAcceptedSessionDraftAndSubmit(staff, 'E2E 自審阻擋紀要')
    await expandServiceFormsPendingReviewIfCollapsed(page)
    await review.getByRole('button', { name: '核准' }).click()
    expect(dialogs.some((m) => m.includes('不可審批本人表單'))).toBe(true)
    await review.getByRole('button', { name: '退回重改' }).click()
    await review.getByPlaceholder('請填寫退回原因（必填）').fill('主管測試退回原因')
    await review.getByRole('button', { name: '確認退回' }).click()
    expect(dialogs.filter((m) => m.includes('不可審批本人表單')).length).toBeGreaterThanOrEqual(2)
  })

  test('他人 SUBMITTED 表單可核准，待審清單清空（01 §2.2）', async ({ page }) => {
    const formJson = JSON.stringify([
      {
        id: 'e2e-form-pending-approve',
        sessionId: 'session-1',
        sessionDate: '2026-04-30',
        staffProfileId: 'staff-ot-1',
        residentId: 'demo-resident-e2e-1',
        residentName: '本機示範院友',
        narrative: 'E2E 待審紀要',
        status: 'SUBMITTED',
        ownerActorId: 'actor-other-staff-seed',
        createdAt: '2026-05-01T00:00:00.000Z',
        updatedAt: '2026-05-01T01:00:00.000Z',
        submittedAt: '2026-05-01T01:00:00.000Z',
        reviewedAt: null,
        reviewerActorId: null,
        reviewNote: null,
      },
    ])
    acceptAllDialogs(page)
    const { review } = await loadServiceFormsDemoPage(page, formJson)
    await expect(review.getByText('E2E 待審紀要')).toBeVisible()
    await review.getByRole('button', { name: '核准' }).click()
    await expect(review.getByText('目前沒有待審項目。')).toBeVisible()
  })

  test('退回重改後可載入並再儲存草稿（01 §2.2）', async ({ page }) => {
    const formJson = JSON.stringify([
      {
        id: 'e2e-form-rejected-revise',
        sessionId: 'session-1',
        sessionDate: '2026-04-30',
        staffProfileId: 'staff-ot-1',
        residentId: 'demo-resident-e2e-1',
        residentName: '本機示範院友',
        narrative: '初稿待修',
        status: 'REJECTED_NEEDS_REVISION',
        ownerActorId: 'TeamLead_demo',
        createdAt: '2026-05-01T00:00:00.000Z',
        updatedAt: '2026-05-01T02:00:00.000Z',
        submittedAt: '2026-05-01T01:00:00.000Z',
        reviewedAt: '2026-05-01T02:00:00.000Z',
        reviewerActorId: 'actor-lead-seed',
        reviewNote: '請補強紀錄',
      },
    ])
    acceptAllDialogs(page)
    const { staff } = await loadServiceFormsDemoPage(page, formJson)
    await expect(staff.getByText('退回重改', { exact: true })).toBeVisible()
    await staff.getByRole('button', { name: '載入編輯' }).click()
    await staff.getByPlaceholder('簡述本次服務內容…').fill('修訂版 E2E 紀要')
    await staff.getByRole('button', { name: '儲存草稿' }).click()
    await expect(staff.getByText('修訂版 E2E 紀要')).toBeVisible()
    await expect(staff.getByText('退回重改', { exact: true })).toBeVisible()
  })

  test('待審表單可經 UI 退回重改，待審清單清空（01 §2.2）', async ({ page }) => {
    const formJson = JSON.stringify([
      {
        id: 'e2e-form-pending-reject',
        sessionId: 'session-1',
        sessionDate: '2026-04-30',
        staffProfileId: 'staff-ot-1',
        residentId: 'demo-resident-e2e-1',
        residentName: '本機示範院友',
        narrative: 'E2E 待退回紀要',
        status: 'SUBMITTED',
        ownerActorId: 'actor-other-staff-seed',
        createdAt: '2026-05-01T00:00:00.000Z',
        updatedAt: '2026-05-01T01:00:00.000Z',
        submittedAt: '2026-05-01T01:00:00.000Z',
        reviewedAt: null,
        reviewerActorId: null,
        reviewNote: null,
      },
    ])
    acceptAllDialogs(page)
    const { review } = await loadServiceFormsDemoPage(page, formJson)
    await expect(review.getByText('E2E 待退回紀要')).toBeVisible()
    await review.getByRole('button', { name: '退回重改' }).click()
    await review.getByPlaceholder('請填寫退回原因（必填）').fill('請補強服務紀錄細節')
    await review.getByRole('button', { name: '確認退回' }).click()
    await expect(review.getByText('目前沒有待審項目。')).toBeVisible()
  })

  test('本人 SUBMITTED 表單可於我的表單軟刪除（01 §5）', async ({ page }) => {
    acceptAllDialogs(page)
    const { staff } = await loadServiceFormsDemoPage(page, 'clear')
    await fillAcceptedSessionDraftAndSubmit(staff, 'E2E 待軟刪紀要')
    await expect(staff.getByText('待審', { exact: true })).toBeVisible()
    const myFormsBlock = staff.getByRole('heading', { name: '我的表單', exact: true }).locator('..')
    await myFormsBlock.getByRole('button', { name: '軟刪除' }).click()
    await expect(staff.getByText('尚無紀錄。')).toBeVisible()
  })
})
