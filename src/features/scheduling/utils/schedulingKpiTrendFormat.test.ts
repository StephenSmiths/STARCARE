import { describe, expect, it } from 'vitest'
import { formatDeltaDecimal, formatDeltaPercentPoints } from './schedulingKpiTrendFormat'

describe('schedulingKpiTrendFormat', () => {
  it('formatDeltaPercentPoints returns em dash when no previous', () => {
    expect(formatDeltaPercentPoints(10, undefined)).toBe('—')
  })

  it('formatDeltaPercentPoints shows signed delta', () => {
    expect(formatDeltaPercentPoints(12, 10)).toBe('+2.0 pt')
    expect(formatDeltaPercentPoints(8, 10)).toBe('-2.0 pt')
  })

  it('formatDeltaDecimal shows signed delta', () => {
    expect(formatDeltaDecimal(1.5, 1)).toBe('+0.50')
  })
})
