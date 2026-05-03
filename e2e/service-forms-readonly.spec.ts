import { expect, test } from '@playwright/test'
import {
  acceptAllDialogs,
  expectStaffServiceFormFieldsReadOnly,
  loadServiceFormsDemoPage,
} from './helpers/serviceFormsDemo'

/** 01 §2.2：已核准／已提交表單「檢視」時欄位鎖定（Seq 3 demo）。 */
test.describe('service-forms readonly (demo)', () => {
  test('已核准表單檢視時欄位鎖定不可編輯（01 §2.2）', async ({ page }) => {
    const formJson = JSON.stringify([
      {
        id: 'e2e-form-approved-readonly',
        sessionId: 'session-1',
        sessionDate: '2026-04-30',
        staffProfileId: 'staff-ot-1',
        residentId: 'demo-resident-e2e-1',
        residentName: '本機示範院友',
        narrative: '已鎖定紀要 E2E',
        status: 'APPROVED',
        ownerActorId: 'TeamLead_demo',
        createdAt: '2026-05-01T00:00:00.000Z',
        updatedAt: '2026-05-01T03:00:00.000Z',
        submittedAt: '2026-05-01T01:00:00.000Z',
        reviewedAt: '2026-05-01T03:00:00.000Z',
        reviewerActorId: 'actor-lead-seed',
        reviewNote: null,
      },
    ])
    acceptAllDialogs(page)
    const { staff } = await loadServiceFormsDemoPage(page, formJson)
    await expect(staff.getByText('已核准（鎖定）', { exact: true })).toBeVisible()
    await staff.getByRole('button', { name: '檢視' }).click()
    await expectStaffServiceFormFieldsReadOnly(staff)
  })

  test('已提交（待審）表單檢視時欄位鎖定不可編輯（01 §2.2）', async ({ page }) => {
    const formJson = JSON.stringify([
      {
        id: 'e2e-form-submitted-readonly',
        sessionId: 'session-1',
        sessionDate: '2026-04-30',
        staffProfileId: 'staff-ot-1',
        residentId: 'demo-resident-e2e-1',
        residentName: '本機示範院友',
        narrative: '已提交待審 E2E 紀要',
        status: 'SUBMITTED',
        ownerActorId: 'TeamLead_demo',
        createdAt: '2026-05-01T00:00:00.000Z',
        updatedAt: '2026-05-01T01:00:00.000Z',
        submittedAt: '2026-05-01T01:00:00.000Z',
        reviewedAt: null,
        reviewerActorId: null,
        reviewNote: null,
      },
    ])
    acceptAllDialogs(page)
    const { staff } = await loadServiceFormsDemoPage(page, formJson)
    await expect(staff.getByText('待審', { exact: true })).toBeVisible()
    await staff.getByRole('button', { name: '檢視' }).click()
    await expectStaffServiceFormFieldsReadOnly(staff)
  })
})
