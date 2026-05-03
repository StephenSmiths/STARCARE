import { describe, expect, it } from 'vitest'
import { SCHEDULING_DATA_LOAD_ERROR_MESSAGE } from './schedulingDataLoadMessage'
import { runSchedulingReloadPageData } from './schedulingReloadPageData'
import type { Resident } from '../../residents/types/resident'
import type { SchedulingSession } from '../../../services/schedulingService'

const resident: Resident = {
  id: 'r-1',
  name: '測',
  bedNumber: 'B1',
  area: 'A',
  gender: 'Female',
  age: 80,
  admissionDate: '2026-01-01',
  fundingType: 'Private',
  serviceType: 'Subsidized_Rehab',
  dementiaLevel: 'None',
  isSpecialCareCase: false,
  healthCondition: '',
  medicationRecord: '',
  isDeleted: false,
}

const session: SchedulingSession = {
  id: 's-1',
  staffId: 'st-1',
  staffName: 'OT',
  date: '2026-05-01',
  timeSlot: '10:00',
  serviceType: 'Subsidized_Rehab',
  capacity: 1,
}

describe('runSchedulingReloadPageData', () => {
  it('成功時回傳映射後院友與時段筆數', async () => {
    const out = await runSchedulingReloadPageData('facility-main', {
      listActiveResidents: async () => [resident],
      listSchedulingSessions: async () => [session],
      prefetchRules: () => {},
    })
    expect(out.ok).toBe(true)
    if (out.ok) {
      expect(out.sessionCount).toBe(1)
      expect(out.schedulingResidents).toEqual([
        {
          id: 'r-1',
          name: '測',
          fundingType: 'Private',
          isSpecialCareCase: false,
          weeklyCompletedCount: 0,
          assignedDates: [],
        },
      ])
    }
  })

  it('純認知軌院友不進入排班頁名單（01 §4.1）', async () => {
    const dementiaOnly: Resident = {
      ...resident,
      id: 'r-dm',
      serviceType: 'Dementia_Service',
      dementiaLevel: 'Mild',
    }
    const out = await runSchedulingReloadPageData('facility-main', {
      listActiveResidents: async () => [resident, dementiaOnly],
      listSchedulingSessions: async () => [session],
      prefetchRules: () => {},
    })
    expect(out.ok).toBe(true)
    if (out.ok) {
      expect(out.schedulingResidents).toHaveLength(1)
      expect(out.schedulingResidents[0]?.id).toBe('r-1')
    }
  })

  it('依賴拋錯時回傳固定 loadError', async () => {
    const out = await runSchedulingReloadPageData('facility-main', {
      listActiveResidents: async () => {
        throw new Error('x')
      },
      listSchedulingSessions: async () => [],
      prefetchRules: () => {},
    })
    expect(out.ok).toBe(false)
    if (!out.ok) {
      expect(out.loadError).toBe(SCHEDULING_DATA_LOAD_ERROR_MESSAGE)
    }
  })
})
