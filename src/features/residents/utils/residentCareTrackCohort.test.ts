import { describe, expect, it } from 'vitest'
import type { Resident } from '../types/resident'
import { isDementiaCareCohort, isSubsidizedRehabCohort } from './residentCareTrackCohort'

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

describe('residentCareTrackCohort（PDF 01 §4.1／§4.2）', () => {
  it('isSubsidizedRehabCohort：資助或雙軌', () => {
    expect(isSubsidizedRehabCohort(base({ serviceType: 'Subsidized_Rehab' }))).toBe(true)
    expect(isSubsidizedRehabCohort(base({ serviceType: 'Both' }))).toBe(true)
    expect(isSubsidizedRehabCohort(base({ serviceType: 'Dementia_Service' }))).toBe(false)
  })

  it('isDementiaCareCohort：認知或雙軌且 dementiaLevel≠None', () => {
    expect(isDementiaCareCohort(base({ serviceType: 'Dementia_Service', dementiaLevel: 'Mild' }))).toBe(true)
    expect(isDementiaCareCohort(base({ serviceType: 'Both', dementiaLevel: 'Moderate' }))).toBe(true)
    expect(isDementiaCareCohort(base({ serviceType: 'Dementia_Service', dementiaLevel: 'None' }))).toBe(false)
    expect(isDementiaCareCohort(base({ serviceType: 'Subsidized_Rehab', dementiaLevel: 'Mild' }))).toBe(false)
  })
})
