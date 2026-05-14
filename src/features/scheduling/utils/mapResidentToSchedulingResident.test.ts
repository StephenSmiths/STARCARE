import { describe, expect, it } from 'vitest'
import type { Resident } from '../../residents/types/resident'
import { mapResidentToSchedulingResident } from './mapResidentToSchedulingResident'

const minimalResident = (over: Partial<Resident>): Resident => ({
  id: 'r-1',
  name: '陳大文',
  bedNumber: 'A01',
  area: '一樓',
  gender: 'Male',
  age: 80,
  admissionDate: '2024-01-01',
  fundingType: 'GradeA_Subsidized',
  serviceType: 'Subsidized_Rehab',
  dementiaLevel: 'Mild',
  isSpecialCareCase: false,
  healthCondition: '',
  medicationRecord: '',
  isDeleted: false,
  ...over,
})

describe('mapResidentToSchedulingResident', () => {
  it('僅帶入引擎所需欄位，本週次數與指派日期歸零', () => {
    const sr = mapResidentToSchedulingResident(
      minimalResident({
        id: 'x',
        name: '李小姐',
        fundingType: 'Voucher',
        isSpecialCareCase: true,
      }),
    )
    expect(sr).toEqual({
      id: 'x',
      name: '李小姐',
      fundingType: 'Voucher',
      isSpecialCareCase: true,
      weeklyCompletedCount: 0,
      assignedDates: [],
    })
  })
})
