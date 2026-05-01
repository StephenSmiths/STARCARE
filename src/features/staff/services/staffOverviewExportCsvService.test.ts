import { describe, expect, it } from 'vitest'
import { buildStaffOverviewExportCsv } from './staffOverviewExportCsvService'

describe('staffOverviewExportCsvService', () => {
  it('應輸出含 BOM 之員工概覽 CSV', () => {
    const csv = buildStaffOverviewExportCsv([
      { staffId: 's-1', staffName: '治療師,王', sessionCount: 8, skillCount: 3 },
    ])
    const lines = csv.replace(/^\uFEFF/, '').split('\n').filter((line) => line.length > 0)
    expect(lines[0]).toBe('員工ID,名稱,可排時段數,技能數')
    expect(lines[1]).toBe('s-1,"治療師,王",8,3')
  })
})
