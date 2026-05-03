import { describe, expect, it } from 'vitest'
import {
  RESIDENT_LIST_LOAD_ERROR_MESSAGE,
  runResidentListRefresh,
} from './residentListRefreshOutcome'
import type { Resident } from '../types/resident'

const sample: Resident = {
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

describe('runResidentListRefresh', () => {
  it('成功時回傳名單並清空錯誤訊息', async () => {
    const out = await runResidentListRefresh(async () => [sample])
    expect(out.residents).toEqual([sample])
    expect(out.errorMessage).toBe('')
  })

  it('列表函式拋錯時回傳空名單與固定錯誤句', async () => {
    const out = await runResidentListRefresh(async () => {
      throw new Error('network')
    })
    expect(out.residents).toEqual([])
    expect(out.errorMessage).toBe(RESIDENT_LIST_LOAD_ERROR_MESSAGE)
  })
})
