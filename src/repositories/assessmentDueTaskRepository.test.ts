import { describe, expect, it } from 'vitest'
import type { Resident } from '../features/residents/types/resident'
import { buildAssessmentDueTasks } from '../features/residents/services/assessmentDueTaskService'
import { createAssessmentDueTaskRepository } from './assessmentDueTaskRepository'

const base = (over: Partial<Resident>): Resident =>
  ({
    id: 'r1',
    name: 'A',
    bedNumber: 'B1',
    area: '一區',
    gender: 'Male',
    age: 80,
    admissionDate: '2025-01-01',
    fundingType: 'Private',
    serviceType: 'Subsidized_Rehab',
    dementiaLevel: 'None',
    isSpecialCareCase: false,
    healthCondition: '',
    medicationRecord: '',
    isDeleted: false,
    ...over,
  }) as Resident

describe('assessmentDueTaskRepository', () => {
  it('本機模式與 buildAssessmentDueTasks 一致', async () => {
    const repo = createAssessmentDueTaskRepository()
    const residents = [base({})]
    const now = new Date('2026-05-10T12:00:00.000Z')
    const fromRepo = await repo.listDueWithinLeadDays(residents, { now, leadDays: 14 })
    const direct = buildAssessmentDueTasks(residents, { now, leadDays: 14 })
    expect(fromRepo).toEqual(direct)
  })
})
