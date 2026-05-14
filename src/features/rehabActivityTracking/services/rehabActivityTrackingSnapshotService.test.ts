import { describe, expect, it } from 'vitest'
import type { Resident } from '../../residents/types/resident'
import type { SchedulingSession } from '../../../services/schedulingService'
import { DEFAULT_SYSTEM_SETTINGS } from '../../systemSettings/repository/systemSettingsRepository'
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
    const snap = buildSubsidizedRehabTrackSnapshot('actor-1', residents, [rehabSession()], constraints, DEFAULT_SYSTEM_SETTINGS)
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
    const snap = buildDementiaServiceTrackSnapshot(residents, [demSession], constraints, DEFAULT_SYSTEM_SETTINGS)
    expect(snap.cohortCount).toBe(1)
    expect(snap.rows[0]?.id).toBe('d1')
  })

  it('衝突節錄附中文類型標籤（P1 小組每日場次上限）', () => {
    const capped = { ...constraints, therapistGroupSessionsDailyCap: 1 }
    const residents = [
      baseResident({ id: 'a', serviceType: 'Dementia_Service', dementiaLevel: 'Mild' }),
      baseResident({ id: 'b', serviceType: 'Dementia_Service', dementiaLevel: 'Moderate' }),
    ]
    const cogGroup = (id: string, timeSlot: string): SchedulingSession =>
      ({
        id,
        staffId: 's1',
        staffName: 'OT',
        date: '2026-06-01',
        timeSlot,
        serviceType: 'Dementia_Service',
        capacity: 4,
        staffRoleType: 'OT',
      }) as SchedulingSession
    const snap = buildDementiaServiceTrackSnapshot(
      residents,
      [cogGroup('g1', '09:00'), cogGroup('g2', '10:00')],
      capped,
      DEFAULT_SYSTEM_SETTINGS,
    )
    expect(snap.conflictCount).toBeGreaterThan(0)
    expect(snap.conflictSampleLines?.some((line) => line.includes('小組活動每日場次上限'))).toBe(true)
  })

  it('資助復康軌衝突節錄附中文類型標籤（P1 小組每日場次上限）', () => {
    const capped = { ...constraints, therapistGroupSessionsDailyCap: 1 }
    const residents = [
      baseResident({ id: 'a', serviceType: 'Subsidized_Rehab' }),
      baseResident({ id: 'b', serviceType: 'Subsidized_Rehab' }),
    ]
    const rehabGroup = (id: string, timeSlot: string): SchedulingSession =>
      ({
        id,
        staffId: 's1',
        staffName: 'OT',
        date: '2026-06-01',
        timeSlot,
        serviceType: 'Subsidized_Rehab',
        capacity: 4,
        staffRoleType: 'OT',
      }) as SchedulingSession
    const snap = buildSubsidizedRehabTrackSnapshot(
      'actor-1',
      residents,
      [rehabGroup('g1', '09:00'), rehabGroup('g2', '10:00')],
      capped,
      DEFAULT_SYSTEM_SETTINGS,
    )
    expect(snap.conflictCount).toBeGreaterThan(0)
    expect(snap.conflictSampleLines?.length).toBeGreaterThan(0)
    expect(snap.conflictSampleLines?.some((line) => line.includes('小組活動每日場次上限'))).toBe(true)
  })
})
