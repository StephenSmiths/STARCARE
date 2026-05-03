import { describe, expect, it } from 'vitest'
import {
  mapAssessmentCompletionRecordRow,
  toAssessmentCompletionAppendPayload,
} from './assessmentCompletionRecordMapper'
import type { AssessmentCompletionRecord } from '../features/assessmentManagement/types/assessmentManagement'

describe('mapAssessmentCompletionRecordRow', () => {
  it('將 snake 列轉為 AssessmentCompletionRecord', () => {
    const row = {
      id: 'r1',
      resident_id: 'resident-x',
      resident_name: '王',
      cycle_anchor_date: '2026-01-15',
      discipline: 'PT' as const,
      version_label: 'PT-2026-A',
      recorded_by_actor_id: 'actor-1',
      completed_at: '2026-02-01T08:30:00.000Z',
    }
    const out = mapAssessmentCompletionRecordRow(row)
    expect(out.residentId).toBe('resident-x')
    expect(out.cycleAnchorDate).toBe('2026-01-15')
    expect(out.completedAt).toContain('2026-02-01')
  })

  it('toAssessmentCompletionAppendPayload 與 list 列可互轉', () => {
    const domain: AssessmentCompletionRecord = {
      id: 'x1',
      residentId: 'r1',
      residentName: '乙',
      cycleAnchorDate: '2026-03-01',
      discipline: 'OT',
      versionLabel: 'OT-v2',
      recordedByActorId: 'actor-z',
      completedAt: '2026-03-02T12:00:00.000Z',
    }
    const payload = toAssessmentCompletionAppendPayload(domain)
    expect(payload.resident_id).toBe('r1')
    const back = mapAssessmentCompletionRecordRow(payload)
    expect(back.versionLabel).toBe('OT-v2')
  })
})
