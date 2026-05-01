import { describe, expect, it } from 'vitest'
import { buildSchedulingComplianceAlertsCsv } from './schedulingComplianceAlertCsvService'

describe('週三零次提醒 CSV', () => {
  it('應輸出標頭與提醒列內容', () => {
    const csv = buildSchedulingComplianceAlertsCsv(
      [
        {
          code: 'MIDWEEK_SUBSIDIZED_ZERO',
          level: 'high',
          residentId: 'r-1',
          residentName: '王院友',
          fundingType: 'Voucher',
          message: '週三提醒：王院友（Voucher）資助復康次數仍為 0，請 TeamLead 優先跟進。',
        },
      ],
      new Date('2026-05-01T00:00:00.000Z'),
    )
    const lines = csv.replace(/^\uFEFF/, '').split('\n').filter((line) => line.length > 0)
    expect(lines[0]).toBe('提醒代碼,提醒等級,院友ID,院友姓名,資助類別,提醒內容,匯出日期')
    expect(lines[1]).toContain('MIDWEEK_SUBSIDIZED_ZERO')
    expect(lines[1]).toContain('高優先')
    expect(lines[1]).toContain('王院友')
    expect(lines[1]).toContain('院舍券')
    expect(lines[1]).toContain('2026-05-01T00:00:00.000Z')
  })
})
