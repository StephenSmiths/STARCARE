import { describe, expect, it } from 'vitest'
import {
  buildCsvImportCommitFailureSummary,
  buildCsvImportCommitSuccessSummary,
  buildCsvImportDryRunSummary,
} from './csvImportRunSummary'

describe('csvImportRunSummary', () => {
  it('buildCsvImportDryRunSummary：對齊 validation summary', () => {
    const s = buildCsvImportDryRunSummary({ total: 10, valid: 8, invalid: 2 }, 100, '2026-05-04T12:00:00.000Z')
    expect(s).toEqual({
      stage: 'dry-run',
      total: 10,
      success: 8,
      failed: 2,
      durationMs: 100,
      ranAt: '2026-05-04T12:00:00.000Z',
    })
  })

  it('buildCsvImportCommitSuccessSummary', () => {
    const s = buildCsvImportCommitSuccessSummary(10, 7, 200, 't')
    expect(s.success).toBe(7)
    expect(s.failed).toBe(3)
  })

  it('buildCsvImportCommitFailureSummary', () => {
    const s = buildCsvImportCommitFailureSummary(5, 50, 't')
    expect(s.success).toBe(0)
    expect(s.failed).toBe(5)
  })
})
