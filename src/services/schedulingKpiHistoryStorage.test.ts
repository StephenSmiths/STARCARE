import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { STARCARE_DEFAULT_FACILITY_ID } from '../constants/starcareDefaultFacilityId'
import type { SchedulingKpiRunRecord } from './schedulingKpiService'
import {
  clearKpiRunHistory,
  loadKpiRunHistory,
  saveKpiRunHistory,
  schedulingKpiHistoryStorageKey,
} from './schedulingKpiHistoryStorage'

const mockRecord = (): SchedulingKpiRunRecord => ({
  ranAt: '2026-04-30T12:00:00.000Z',
  kpis: {
    coverageRate: 1,
    conflictRatePer100: 2,
    averageAssignmentsPerResident: 3,
    underTargetRate: 4,
  },
  residentCount: 10,
  assignmentCount: 5,
  conflictCount: 1,
})

describe('schedulingKpiHistoryStorage', () => {
  const store: Record<string, string> = {}

  const stubBrowserStorage = () => {
    vi.stubGlobal('window', {
      localStorage: {
        getItem: (key: string) => store[key] ?? null,
        setItem: (key: string, value: string) => {
          store[key] = value
        },
        removeItem: (key: string) => {
          delete store[key]
        },
      },
    })
  }

  beforeEach(() => {
    Object.keys(store).forEach((key) => {
      delete store[key]
    })
    stubBrowserStorage()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('save then load round-trip', () => {
    const fid = STARCARE_DEFAULT_FACILITY_ID
    saveKpiRunHistory(fid, [mockRecord()])
    const loaded = loadKpiRunHistory(fid)
    expect(loaded).toHaveLength(1)
    expect(loaded[0].residentCount).toBe(10)
  })

  it('returns empty on invalid JSON', () => {
    const key = schedulingKpiHistoryStorageKey('facility-x')
    store[key] = 'not-json'
    expect(loadKpiRunHistory('facility-x')).toEqual([])
  })

  it('clear removes saved history', () => {
    const fid = STARCARE_DEFAULT_FACILITY_ID
    saveKpiRunHistory(fid, [mockRecord()])
    expect(loadKpiRunHistory(fid)).toHaveLength(1)
    clearKpiRunHistory(fid)
    expect(loadKpiRunHistory(fid)).toHaveLength(0)
  })
})
