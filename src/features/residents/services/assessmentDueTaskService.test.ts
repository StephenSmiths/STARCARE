import { describe, expect, it } from 'vitest'
import { buildAssessmentDueTasks } from './assessmentDueTaskService'
import type { Resident } from '../types/resident'

const resident = (overrides: Partial<Resident>): Resident => ({
  id: overrides.id ?? 'r-1',
  name: overrides.name ?? '測試院友',
  bedNumber: overrides.bedNumber ?? 'A-01',
  area: overrides.area ?? '2/F',
  gender: overrides.gender ?? 'Female',
  age: overrides.age ?? 80,
  admissionDate: overrides.admissionDate ?? '2025-01-01',
  fundingType: overrides.fundingType ?? 'Voucher',
  serviceType: overrides.serviceType ?? 'Subsidized_Rehab',
  dementiaLevel: overrides.dementiaLevel ?? 'None',
  isSpecialCareCase: overrides.isSpecialCareCase ?? false,
  healthCondition: overrides.healthCondition ?? '',
  medicationRecord: overrides.medicationRecord ?? '',
  isDeleted: overrides.isDeleted ?? false,
})

describe('assessmentDueTaskService', () => {
  it('回傳 14 天內到期之待辦並依天數排序', () => {
    const tasks = buildAssessmentDueTasks(
      [
        resident({ id: 'a', name: '王院友', admissionDate: '2025-11-12' }), // 2026-05-11
        resident({ id: 'b', name: '李院友', admissionDate: '2025-11-16' }), // 2026-05-15
        resident({ id: 'c', name: '陳院友', admissionDate: '2025-11-20' }), // 2026-05-19 (超出14天)
      ],
      { now: new Date('2026-05-01T08:00:00.000Z') },
    )
    expect(tasks.map((item) => item.residentId)).toEqual(['a', 'b'])
    expect(tasks[0]?.dueInDays).toBe(10)
    expect(tasks[1]?.dueInDays).toBe(14)
  })

  it('無效日期會被忽略', () => {
    const tasks = buildAssessmentDueTasks(
      [resident({ id: 'x', admissionDate: 'bad-date' })],
      { now: new Date('2026-05-01T08:00:00.000Z') },
    )
    expect(tasks).toHaveLength(0)
  })
})
