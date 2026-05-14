import { describe, expect, it } from 'vitest'
import {
  formatDeltaDecimal,
  formatDeltaPercentPoints,
  formatKpiTrendRanAtLocal,
} from './schedulingKpiTrendFormat'

describe('schedulingKpiTrendFormat', () => {
  it('formatKpiTrendRanAtLocal：無效 ISO 回傳一字線', () => {
    expect(formatKpiTrendRanAtLocal('not-a-date')).toBe('-')
  })

  it('formatDeltaPercentPoints returns em dash when no previous', () => {
    expect(formatDeltaPercentPoints(10, undefined)).toBe('—')
  })

  it('formatDeltaPercentPoints shows signed delta', () => {
    expect(formatDeltaPercentPoints(12, 10)).toBe('+2.0 pt')
    expect(formatDeltaPercentPoints(8, 10)).toBe('-2.0 pt')
  })

  it('formatDeltaPercentPoints：零變化無正號前綴', () => {
    expect(formatDeltaPercentPoints(10, 10)).toBe('0.0 pt')
  })

  it('formatDeltaDecimal shows signed delta', () => {
    expect(formatDeltaDecimal(1.5, 1)).toBe('+0.50')
  })

  it('formatDeltaDecimal：無 previous 回傳一字線', () => {
    expect(formatDeltaDecimal(1, undefined)).toBe('—')
  })

  it('formatDeltaDecimal：零變化', () => {
    expect(formatDeltaDecimal(2, 2)).toBe('0.00')
  })

  it('formatKpiTrendRanAtLocal：合法 ISO 不為一字線', () => {
    expect(formatKpiTrendRanAtLocal('2026-05-09T12:00:00.000Z')).not.toBe('-')
  })
})
