import { describe, expect, it } from 'vitest'
import { buildResidentsExportCsv } from './residentsExportCsvService'

describe('residentsExportCsvService', () => {
  it('應輸出含 BOM 之標頭與列資料', () => {
    const csv = buildResidentsExportCsv([
      {
        id: 'r-1',
        name: '王,小明',
        bedNumber: 'A-01',
        area: '東翼',
        gender: 'Male',
        age: 78,
        admissionDate: '2025-01-01',
        fundingType: 'GradeA_Subsidized',
        serviceType: 'Both',
        dementiaLevel: 'Mild',
        isSpecialCareCase: true,
        healthCondition: '穩定',
        medicationRecord: '藥A',
        isDeleted: false,
      },
    ])
    const lines = csv.replace(/^\uFEFF/, '').split('\n').filter((line) => line.length > 0)
    expect(lines[0]).toContain('院友ID,姓名,床號')
    expect(lines[1]).toContain('"王,小明"')
    expect(lines[1]).toContain('甲一買位（EA1）')
    expect(lines[1]).toContain('雙軌')
  })
})
