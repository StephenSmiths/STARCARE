import type { AiReportRecord } from '../types/aiReportCenter'
import { findAiReportIndex, touchAiReportRecord } from './aiReportCenterDomainRecordHelpers'

export const adoptAiReport = (actorId: string, id: string, rows: AiReportRecord[]): AiReportRecord[] => {
  const i = findAiReportIndex(rows, id)
  if (i < 0) throw new Error('找不到報告')
  const row = rows[i]
  if (row.status !== 'DRAFT') throw new Error('僅草稿可採用為正式版本')
  if (row.createdByActorId !== actorId) throw new Error('僅建立者可採用此草稿')
  const ts = new Date().toISOString()
  const nextRow = touchAiReportRecord(row, { status: 'ADOPTED', adoptedAt: ts })
  const next = [...rows]
  next[i] = nextRow
  return next
}

export const distributeAiReport = (
  actorId: string,
  id: string,
  rows: AiReportRecord[],
): AiReportRecord[] => {
  const i = findAiReportIndex(rows, id)
  if (i < 0) throw new Error('找不到報告')
  const row = rows[i]
  if (row.status !== 'ADOPTED') throw new Error('須先採用後才可發放')
  if (row.createdByActorId !== actorId) throw new Error('僅建立者可發放此報告')
  const ts = new Date().toISOString()
  const nextRow = touchAiReportRecord(row, { status: 'DISTRIBUTED', distributedAt: ts })
  const next = [...rows]
  next[i] = nextRow
  return next
}
