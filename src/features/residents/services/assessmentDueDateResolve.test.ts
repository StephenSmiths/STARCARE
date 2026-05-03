import { describe, expect, it } from 'vitest'
import { resolveNextAssessmentDueUtc } from './assessmentDueDateResolve'

describe('assessmentDueDateResolve', () => {
  const todayUtc = new Date(Date.UTC(2026, 4, 1))
  const endDate = new Date(Date.UTC(2026, 4, 15))

  it('有 assessmentNextDueDate 且在視窗內則採用', () => {
    const next = resolveNextAssessmentDueUtc(
      { admissionDate: '2020-01-01', assessmentNextDueDate: '2026-05-10' },
      todayUtc,
      endDate,
    )
    expect(next?.toISOString().slice(0, 10)).toBe('2026-05-10')
  })

  it('明確到期早於 today 則不採用', () => {
    expect(
      resolveNextAssessmentDueUtc(
        { admissionDate: '2025-01-01', assessmentNextDueDate: '2026-04-15' },
        todayUtc,
        endDate,
      ),
    ).toBeNull()
  })

  it('無明確欄位時依入院週期推算', () => {
    const next = resolveNextAssessmentDueUtc(
      { admissionDate: '2025-11-12' },
      todayUtc,
      endDate,
    )
    expect(next).not.toBeNull()
    expect(next!.getTime()).toBeGreaterThanOrEqual(todayUtc.getTime())
    expect(next!.getTime()).toBeLessThanOrEqual(endDate.getTime())
  })
})
