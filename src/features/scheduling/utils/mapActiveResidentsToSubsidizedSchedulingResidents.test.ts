import { describe, expect, it } from 'vitest'
import type { Resident } from '../../residents/types/resident'
import { mapActiveResidentsToSubsidizedSchedulingResidents } from './mapActiveResidentsToSubsidizedSchedulingResidents'

const base = (over: Partial<Resident>): Resident =>
  ({
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
  }) as Resident

describe('mapActiveResidentsToSubsidizedSchedulingResidents', () => {
  it('排除純認知軌院友', () => {
    const out = mapActiveResidentsToSubsidizedSchedulingResidents([
      base({ id: 'a', serviceType: 'Subsidized_Rehab' }),
      base({ id: 'b', serviceType: 'Dementia_Service', dementiaLevel: 'Mild' }),
    ])
    expect(out).toHaveLength(1)
    expect(out[0]?.id).toBe('a')
  })
})
