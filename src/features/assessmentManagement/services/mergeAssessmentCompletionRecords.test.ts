import { describe, expect, it } from 'vitest'
import { mergeAssessmentCompletionRecordsRemotePrimary } from './mergeAssessmentCompletionRecords'
import type { AssessmentCompletionRecord } from '../types/assessmentManagement'

const base = (over: Partial<AssessmentCompletionRecord>): AssessmentCompletionRecord => ({
  id: over.id ?? 'i',
  residentId: over.residentId ?? 'r1',
  residentName: over.residentName ?? '甲',
  cycleAnchorDate: over.cycleAnchorDate ?? '2026-01-01',
  discipline: over.discipline ?? 'PT',
  versionLabel: over.versionLabel ?? 'v1',
  recordedByActorId: over.recordedByActorId ?? 'a',
  completedAt: over.completedAt ?? '2026-01-02T00:00:00.000Z',
})

describe('mergeAssessmentCompletionRecordsRemotePrimary', () => {
  it('同 tuple 以遠端覆蓋本機', () => {
    const local = [base({ id: 'L1', versionLabel: 'local' })]
    const remote = [base({ id: 'R1', versionLabel: 'db' })]
    const out = mergeAssessmentCompletionRecordsRemotePrimary(remote, local)
    expect(out).toHaveLength(1)
    expect(out[0]?.versionLabel).toBe('db')
    expect(out[0]?.id).toBe('R1')
  })

  it('併存不同 tuple', () => {
    const local = [base({ id: '1', discipline: 'PT' }), base({ id: '2', discipline: 'OT', versionLabel: 'o' })]
    const remote = [base({ id: '3', discipline: 'PT', versionLabel: 'db-pt' })]
    const out = mergeAssessmentCompletionRecordsRemotePrimary(remote, local)
    expect(out).toHaveLength(2)
    expect(out.find((r) => r.discipline === 'OT')?.versionLabel).toBe('o')
    expect(out.find((r) => r.discipline === 'PT')?.versionLabel).toBe('db-pt')
  })
})
