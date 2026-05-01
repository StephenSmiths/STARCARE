import { describe, expect, it } from 'vitest'
import type { ServiceFormRecord } from '../../serviceForms/types/serviceForm'
import { buildFormSubmissionOverview, buildTeamReportPlainText } from './workAnalysisReviewSummaryService'

const row = (status: ServiceFormRecord['status'], owner = 'owner-a'): ServiceFormRecord =>
  ({
    id: crypto.randomUUID(),
    sessionId: 's1',
    sessionDate: '2026-05-01',
    staffProfileId: 'st1',
    residentId: 'r1',
    residentName: '院友甲',
    narrative: '紀要',
    status,
    ownerActorId: owner,
    createdAt: 't',
    updatedAt: 't',
    submittedAt: null,
    reviewedAt: null,
    reviewerActorId: null,
    reviewNote: null,
  }) as ServiceFormRecord

describe('workAnalysisReviewSummaryService (PDF 02【7】)', () => {
  it('聚合各狀態筆數與待審填表人數', () => {
    const forms = [
      row('DRAFT', 'a'),
      row('SUBMITTED', 'a'),
      row('SUBMITTED', 'b'),
      row('APPROVED'),
      row('REJECTED_NEEDS_REVISION'),
    ]
    const o = buildFormSubmissionOverview(forms)
    expect(o).toMatchObject({
      total: 5,
      draft: 1,
      submitted: 2,
      approved: 1,
      rejectedNeedsRevision: 1,
      pendingOwnerCount: 2,
    })
  })

  it('buildTeamReportPlainText 含待審摘要', () => {
    const overview = buildFormSubmissionOverview([])
    const text = buildTeamReportPlainText(overview, [
      {
        sessionDate: '2026-05-02',
        residentName: '院友乙',
        ownerActorId: 'owner-xyz',
        narrative: '內容',
      },
    ])
    expect(text).toContain('待審')
    expect(text).toContain('院友乙')
  })
})
