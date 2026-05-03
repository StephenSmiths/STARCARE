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
})
