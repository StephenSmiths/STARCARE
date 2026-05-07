import { describe, expect, it } from 'vitest'
import { parseResidentCsv } from './residentCsvParser'

describe('parseResidentCsv', () => {
  it('可解析可選 assessmentNextDueDate', () => {
    const csv = [
      'name,bedNumber,area,gender,age,admissionDate,assessmentNextDueDate,fundingType,serviceType,dementiaLevel,isSpecialCareCase,healthCondition,medicationRecord',
      '甲,B1,一區,Male,80,2026-01-01,2026-12-01,Private,Subsidized_Rehab,None,false,,',
    ].join('\n')
    const { rows, errors } = parseResidentCsv(csv)
    expect(errors).toHaveLength(0)
    expect(rows[0]?.assessmentNextDueDate).toBe('2026-12-01')
  })

  it('可接受 assessment_next_due_date 表頭（其餘欄位仍為 camelCase）', () => {
    const csv = [
      'name,bedNumber,area,gender,age,admissionDate,assessment_next_due_date,fundingType,serviceType,dementiaLevel,isSpecialCareCase,healthCondition,medicationRecord',
      '乙,B2,二區,Female,75,2026-02-01,2026-03-01,Voucher,Both,Mild,false,x,y',
    ].join('\n')
    const { rows, errors } = parseResidentCsv(csv)
    expect(errors).toHaveLength(0)
    expect(rows[0]?.bedNumber).toBe('B2')
    expect(rows[0]?.assessmentNextDueDate).toBe('2026-03-01')
  })

  it('可解析中文表頭與中文欄位值', () => {
    const csv = [
      '中文姓名,英文姓名,床號,區域,性別,出生日期,年齡,入院日期,下次評估日期,資助類別,服務類型,認知障礙症程度,是否Special Care Case,健康狀況,用藥記錄',
      '丙,Resident C,B3,三區,男,1946年8月3日,79,2026/03/01,2026-06-01,甲一買位,資助復康服務,中度,是,需留意血壓,飯後服藥',
    ].join('\n')
    const { rows, errors } = parseResidentCsv(csv)
    expect(errors).toHaveLength(0)
    expect(rows[0]).toMatchObject({
      name: '丙',
      englishName: 'Resident C',
      bedNumber: 'B3',
      gender: 'Male',
      birthDate: '1946-08-03',
      admissionDate: '2026-03-01',
      assessmentNextDueDate: '2026-06-01',
      fundingType: 'GradeA_Subsidized',
      serviceType: 'Subsidized_Rehab',
      dementiaLevel: 'Moderate',
      isSpecialCareCase: true,
    })
  })

  it('服務類型可解析多選（中文頓號分隔）', () => {
    const csv = [
      '中文姓名,床號,區域,性別,年齡,入院日期,資助類別,服務類型,認知障礙症程度,是否Special Care Case,健康狀況,用藥記錄',
      '丁,B4,四區,女,76,2026-04-01,私位,資助復康服務、認知障礙症服務,輕度,否,穩定,無',
    ].join('\n')
    const { rows, errors } = parseResidentCsv(csv)
    expect(errors).toHaveLength(0)
    expect(rows[0]?.serviceType).toBe('Both')
    expect(rows[0]?.serviceTypes).toEqual(['Subsidized_Rehab', 'Dementia_Service'])
  })
})
