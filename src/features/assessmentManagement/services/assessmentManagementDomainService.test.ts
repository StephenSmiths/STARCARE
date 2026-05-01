import { describe, expect, it } from 'vitest'
import type { Resident } from '../../residents/types/resident'
import type { AssessmentCompletionRecord } from '../types/assessmentManagement'
import {
  appendAssessmentCompletionsForCurrentAnchor,
  ASSESSMENT_OVERDUE_GRACE_DAYS,
  buildAssessmentOverdueRows,
  computeAssessmentCompletionRatePercent,
  computeLastPassedCycleAnchor,
} from './assessmentManagementDomainService'

const baseResident = (over: Partial<Resident> & Pick<Resident, 'id' | 'admissionDate'>): Resident => ({
  name: '院友甲',
  bedNumber: 'A01',
  area: '東翼',
  gender: 'Male',
  age: 80,
  fundingType: 'Private',
  serviceType: 'Both',
  dementiaLevel: 'None',
  isSpecialCareCase: false,
  healthCondition: '',
  medicationRecord: '',
  isDeleted: false,
  ...over,
})

describe('assessmentManagementDomainService（PDF 02【9】／Seq 22）', () => {
  it('computeLastPassedCycleAnchor：無效入院日回傳 null', () => {
    expect(computeLastPassedCycleAnchor('bad', new Date('2026-05-01T00:00:00.000Z'))).toBeNull()
  })

  it('buildAssessmentOverdueRows：錨點後逾寬限且缺科列入', () => {
    const ref = new Date('2026-05-15T00:00:00.000Z')
    const r = baseResident({ id: 'r1', admissionDate: '2025-11-01' })
    const anchor = computeLastPassedCycleAnchor(r.admissionDate, ref)
    expect(anchor).toBeTruthy()
    const days = anchor
      ? Math.round(
          (Date.UTC(2026, 4, 15) - new Date(`${anchor}T00:00:00.000Z`).getTime()) / (24 * 60 * 60 * 1000),
        )
      : 0
    expect(days).toBeGreaterThan(ASSESSMENT_OVERDUE_GRACE_DAYS)
    const rows = buildAssessmentOverdueRows([r], [], ref)
    expect(rows).toHaveLength(1)
    expect(rows[0].missingPt).toBe(true)
    expect(rows[0].missingOt).toBe(true)
  })

  it('computeAssessmentCompletionRatePercent：雙科皆齊計入完成', () => {
    const ref = new Date('2026-05-15T00:00:00.000Z')
    const r1 = baseResident({ id: 'a', admissionDate: '2025-11-01' })
    const r2 = baseResident({ id: 'b', admissionDate: '2025-11-02', name: '乙' })
    const anchor1 = computeLastPassedCycleAnchor(r1.admissionDate, ref)!
    const anchor2 = computeLastPassedCycleAnchor(r2.admissionDate, ref)!
    const completions: AssessmentCompletionRecord[] = [
      {
        id: '1',
        residentId: 'a',
        residentName: r1.name,
        cycleAnchorDate: anchor1,
        discipline: 'PT',
        versionLabel: 'v1',
        recordedByActorId: 'x',
        completedAt: '2026-05-01T00:00:00.000Z',
      },
      {
        id: '2',
        residentId: 'a',
        residentName: r1.name,
        cycleAnchorDate: anchor1,
        discipline: 'OT',
        versionLabel: 'v1',
        recordedByActorId: 'x',
        completedAt: '2026-05-01T00:00:00.000Z',
      },
      {
        id: '3',
        residentId: 'b',
        residentName: r2.name,
        cycleAnchorDate: anchor2,
        discipline: 'PT',
        versionLabel: 'v1',
        recordedByActorId: 'x',
        completedAt: '2026-05-01T00:00:00.000Z',
      },
    ]
    expect(computeAssessmentCompletionRatePercent([r1, r2], completions, ref)).toBe(50)
  })

  it('appendAssessmentCompletionsForCurrentAnchor：可僅補 OT', () => {
    const ref = new Date('2026-05-10T12:00:00.000Z')
    const r = baseResident({ id: 'r1', admissionDate: '2025-11-01' })
    const anchor = computeLastPassedCycleAnchor(r.admissionDate, ref)!
    const existing: AssessmentCompletionRecord[] = [
      {
        id: 'pt1',
        residentId: r.id,
        residentName: r.name,
        cycleAnchorDate: anchor,
        discipline: 'PT',
        versionLabel: 'A',
        recordedByActorId: 'u',
        completedAt: '2026-05-09T00:00:00.000Z',
      },
    ]
    const next = appendAssessmentCompletionsForCurrentAnchor('actor', r, '', 'OT-B', existing, ref)
    expect(next).toHaveLength(2)
    expect(next[0].discipline).toBe('OT')
    expect(next[0].versionLabel).toBe('OT-B')
  })

  it('appendAssessmentCompletionsForCurrentAnchor：雙科已齊拋錯', () => {
    const ref = new Date('2026-05-10T00:00:00.000Z')
    const r = baseResident({ id: 'r1', admissionDate: '2025-11-01' })
    const anchor = computeLastPassedCycleAnchor(r.admissionDate, ref)!
    const existing: AssessmentCompletionRecord[] = [
      {
        id: '1',
        residentId: r.id,
        residentName: r.name,
        cycleAnchorDate: anchor,
        discipline: 'PT',
        versionLabel: 'a',
        recordedByActorId: 'u',
        completedAt: '2026-05-01T00:00:00.000Z',
      },
      {
        id: '2',
        residentId: r.id,
        residentName: r.name,
        cycleAnchorDate: anchor,
        discipline: 'OT',
        versionLabel: 'b',
        recordedByActorId: 'u',
        completedAt: '2026-05-01T00:00:00.000Z',
      },
    ]
    expect(() =>
      appendAssessmentCompletionsForCurrentAnchor('actor', r, 'x', 'y', existing, ref),
    ).toThrow(/皆已紀錄/)
  })
})
