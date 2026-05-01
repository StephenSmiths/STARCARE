import { describe, expect, it } from 'vitest'
import { buildAssessmentDueTasksCsv } from './assessmentDueTaskCsvService'

describe('assessmentDueTaskCsvService', () => {
  it('應輸出待辦 CSV 標頭與資料列', () => {
    const csv = buildAssessmentDueTasksCsv([
      {
        residentId: 'r-1',
        residentName: '王院友',
        bedNumber: 'A-12',
        dueDate: '2026-05-14',
        dueInDays: 13,
      },
    ])
    const lines = csv.replace(/^\uFEFF/, '').split('\n').filter((line) => line.length > 0)
    expect(lines[0]).toBe('院友ID,院友姓名,床號,到期日,剩餘天數')
    expect(lines[1]).toBe('r-1,王院友,A-12,2026-05-14,13')
  })
})
