import type { AiReportRecord } from '../types/aiReportCenter'

export const findAiReportIndex = (rows: AiReportRecord[], id: string): number =>
  rows.findIndex((r) => r.id === id)

export const touchAiReportRecord = (
  row: AiReportRecord,
  patch: Partial<AiReportRecord>,
): AiReportRecord => ({
  ...row,
  ...patch,
  updatedAt: new Date().toISOString(),
})
