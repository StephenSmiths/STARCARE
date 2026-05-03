import { describe, expect, it } from 'vitest'
import { buildStaffOverviewExportCsv } from './staffOverviewExportCsvService'

describe('staffOverviewExportCsvService', () => {
  it('應輸出含 BOM 之員工概覽 CSV（含職類欄）', () => {
    const csv = buildStaffOverviewExportCsv([
      { staffId: 's-1', staffName: '治療師,王', roleType: 'PT', sessionCount: 8, skillCount: 3 },
      { staffId: 's-2', staffName: '無主檔', sessionCount: 0, skillCount: 0 },
    ])
    const lines = csv.replace(/^\uFEFF/, '').split('\n').filter((line) => line.length > 0)
    expect(lines[0]).toBe('員工ID,名稱,職類,可排時段數,技能數')
    expect(lines[1]).toBe('s-1,"治療師,王",PT,8,3')
    expect(lines[2]).toBe('s-2,無主檔,,0,0')
  })
})
