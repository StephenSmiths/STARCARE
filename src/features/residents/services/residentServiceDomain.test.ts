import { describe, expect, it } from 'vitest'
import type { Resident, ResidentInput } from '../types/resident'
import {
  normalizeResidentAssessmentAnchor,
  normalizeResidentInput,
  residentToInput,
  validateResidentInput,
} from './residentServiceDomain'
import { deriveBirthDateFromAge } from '../utils/residentBirthDate'

const validBase = (): ResidentInput => ({
  name: '甲',
  bedNumber: 'B1',
  area: '東區',
  gender: 'Male',
  birthDate: '1954-01-01',
  age: 72,
  admissionDate: '2026-01-01',
  fundingType: 'Private',
  serviceType: 'Subsidized_Rehab',
  dementiaLevel: 'None',
  isSpecialCareCase: false,
  healthCondition: '穩定',
  medicationRecord: '無',
})

const sampleResident = (overrides: Partial<Resident> = {}): Resident => ({
  id: 'r-1',
  name: '乙',
  bedNumber: 'B2',
  area: '西區',
  gender: 'Female',
  age: 80,
  admissionDate: '2026-02-01',
  assessmentNextDueDate: '2026-06-01',
  fundingType: 'GradeA_Subsidized',
  serviceType: 'Dementia_Service',
  dementiaLevel: 'Mild',
  isSpecialCareCase: true,
  healthCondition: '',
  medicationRecord: '',
  isDeleted: false,
  ...overrides,
})

describe('residentServiceDomain', () => {
  it('normalizeResidentInput：僅空白之評估到期日改為 null', () => {
    const out = normalizeResidentInput({
      ...validBase(),
      assessmentNextDueDate: '   ',
    })
    expect(out.assessmentNextDueDate).toBeNull()
  })

  it('normalizeResidentAssessmentAnchor：undefined／null 錨點為 null', () => {
    expect(normalizeResidentAssessmentAnchor(sampleResident({ assessmentNextDueDate: undefined }))).toMatchObject({
      assessmentNextDueDate: null,
    })
    expect(normalizeResidentAssessmentAnchor(sampleResident({ assessmentNextDueDate: null }))).toMatchObject({
      assessmentNextDueDate: null,
    })
  })

  it('residentToInput：與 Resident 欄位對齊', () => {
    const r = sampleResident()
    expect(residentToInput(r)).toEqual({
      name: r.name,
      bedNumber: r.bedNumber,
      area: r.area,
      gender: r.gender,
      birthDate: deriveBirthDateFromAge(r.age),
      age: r.age,
      admissionDate: r.admissionDate,
      assessmentNextDueDate: r.assessmentNextDueDate ?? null,
      fundingType: r.fundingType,
      serviceType: r.serviceType,
      dementiaLevel: r.dementiaLevel,
      isSpecialCareCase: r.isSpecialCareCase,
      healthCondition: r.healthCondition,
      medicationRecord: r.medicationRecord,
    })
  })

  it('validateResidentInput：必填、出生日期、funding_type', () => {
    expect(() => validateResidentInput({ ...validBase(), name: '   ' })).toThrow(/姓名/)
    expect(() => validateResidentInput({ ...validBase(), admissionDate: '' })).toThrow(/入院日期/)
    expect(() => validateResidentInput({ ...validBase(), birthDate: '2026-13-99' })).toThrow(/出生日期/)
    expect(() => validateResidentInput({ ...validBase(), birthDate: '2026-01-01', age: 0 })).toThrow(
      /年齡/,
    )
    expect(() =>
      validateResidentInput({ ...validBase(), birthDate: '1800-01-01', age: 131 }),
    ).toThrow(/年齡/)
    expect(() =>
      validateResidentInput({
        ...validBase(),
        fundingType: 'Invalid' as ResidentInput['fundingType'],
      }),
    ).toThrow(/funding_type/)
  })

  it('validateResidentInput：評估到期須為 YYYY-MM-DD', () => {
    expect(() =>
      validateResidentInput({ ...validBase(), assessmentNextDueDate: '06-15-2026' }),
    ).toThrow(/YYYY-MM-DD/)
  })

  it('validateResidentInput：評估到期為 null 或空字串跳過格式檢查', () => {
    expect(() => validateResidentInput({ ...validBase(), assessmentNextDueDate: null })).not.toThrow()
    expect(() => validateResidentInput({ ...validBase(), assessmentNextDueDate: '' })).not.toThrow()
  })
})
