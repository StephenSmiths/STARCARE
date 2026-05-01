import { describe, expect, it } from 'vitest'
import type { Resident } from '../../residents/types/resident'
import type { SchedulingSession } from '../../../services/schedulingService'
import {
  buildDementiaServiceTrackSnapshot,
  buildSubsidizedRehabTrackSnapshot,
} from './rehabActivityTrackingSnapshotService'

const baseResident = (overrides: Partial<Resident>): Resident =>
  ({
    id: 'r1',
    name: '測試院友',
    bedNumber: 'A01',
    area: '一區',
    gender: 'Male',
    age: 80,
    admissionDate: '2025-01-01',
    fundingType: 'GradeA_Subsidized',
    serviceType: 'Subsidized_Rehab',
    dementiaLevel: 'None',
    isSpecialCareCase: false,
    healthCondition: '',
    medicationRecord: '',
    isDeleted: false,
    ...overrides,
  }) as Resident

const rehabSession = (): SchedulingSession =>
  ({
    id: 'sr1',
    staffId: 'st1',
    staffName: '治療師',
    date: '2026-05-04',
    timeSlot: '10:00',
    serviceType: 'Subsidized_Rehab',
    capacity: 8,
  }) as SchedulingSession

describe('rehabActivityTrackingSnapshotService (PDF 02【8】)', () => {
  const constraints = {
    dailySameServiceLimit: 1,
    minGapDaysSameService: 1,
    groupCapacityLimit: Number.POSITIVE_INFINITY,
  }

  it('資助復康軌僅納入 Subsidized_Rehab／Both', () => {
    const residents = [
      baseResident({ id: 'a', serviceType: 'Subsidized_Rehab' }),
      baseResident({ id: 'b', serviceType: 'Dementia_Service', dementiaLevel: 'Mild' }),
    ]
    const snap = buildSubsidizedRehabTrackSnapshot('actor-1', residents, [rehabSession()], constraints)
    expect(snap.cohortCount).toBe(1)
    expect(snap.rows.some((row) => row.id === 'b')).toBe(false)
  })

  it('認知軌僅納入 Dementia_Service／Both 且 dementiaLevel≠None', () => {
    const residents = [
      baseResident({
        id: 'd1',
        serviceType: 'Dementia_Service',
        dementiaLevel: 'Moderate',
      }),
      baseResident({ id: 'r_only', serviceType: 'Subsidized_Rehab', dementiaLevel: 'None' }),
    ]
    const demSession: SchedulingSession = {
      ...rehabSession(),
      id: 'dm1',
      serviceType: 'Dementia_Service',
    }
    const snap = buildDementiaServiceTrackSnapshot(residents, [demSession], constraints)
    expect(snap.cohortCount).toBe(1)
    expect(snap.rows[0]?.id).toBe('d1')
  })
})
