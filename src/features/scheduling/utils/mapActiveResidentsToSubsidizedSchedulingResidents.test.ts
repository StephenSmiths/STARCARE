import { describe, expect, it } from 'vitest'
import type { Resident } from '../../residents/types/resident'
import { mapActiveResidentsToSubsidizedSchedulingResidents } from './mapActiveResidentsToSubsidizedSchedulingResidents'

const base = (over: Partial<Resident>): Resident => ({
  id: 'r',
  name: 'n',
  bedNumber: 'B',
  area: 'A',
  gender: 'Male',
  age: 80,
  admissionDate: '2026-01-01',
  fundingType: 'Private',
  serviceType: 'Subsidized_Rehab',
  dementiaLevel: 'None',
  isSpecialCareCase: false,
  healthCondition: '',
  medicationRecord: '',
  isDeleted: false,
  ...over,
})

describe('mapActiveResidentsToSubsidizedSchedulingResidents', () => {
  it('空列回傳空陣列', () => {
    expect(mapActiveResidentsToSubsidizedSchedulingResidents([])).toEqual([])
  })

  it('排除純認知軌院友（僅 Dementia_Service）', () => {
    const out = mapActiveResidentsToSubsidizedSchedulingResidents([
      base({ id: 'a', serviceType: 'Subsidized_Rehab' }),
      base({ id: 'b', serviceType: 'Dementia_Service', dementiaLevel: 'Mild' }),
    ])
    expect(out).toHaveLength(1)
    expect(out[0]?.id).toBe('a')
  })

  it('納入 Both 服務類型並對應排班引擎欄位', () => {
    const out = mapActiveResidentsToSubsidizedSchedulingResidents([
      base({
        id: 'both-1',
        name: '雙軌',
        serviceType: 'Both',
        fundingType: 'GradeA_Subsidized',
        isSpecialCareCase: true,
      }),
    ])
    expect(out).toEqual([
      {
        id: 'both-1',
        name: '雙軌',
        fundingType: 'GradeA_Subsidized',
        isSpecialCareCase: true,
        weeklyCompletedCount: 0,
        assignedDates: [],
      },
    ])
  })

  it('保留原陣列順序（僅過濾）', () => {
    const out = mapActiveResidentsToSubsidizedSchedulingResidents([
      base({ id: 'x', serviceType: 'Subsidized_Rehab' }),
      base({ id: 'y', serviceType: 'Dementia_Service', dementiaLevel: 'Severe' }),
      base({ id: 'z', serviceType: 'Both' }),
    ])
    expect(out.map((r) => r.id)).toEqual(['x', 'z'])
  })
})
