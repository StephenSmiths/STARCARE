import type { AiReportRecord } from '../types/aiReportCenter'
import { buildPlaceholderAiReportBody } from './aiReportCenterPlaceholderBody'
import { findAiReportIndex, touchAiReportRecord } from './aiReportCenterDomainRecordHelpers'

/** 建立草稿並置頂 */
export const prependAiReportDraft = (
  actorId: string,
  titleRaw: string,
  existing: AiReportRecord[],
): { next: AiReportRecord[]; created: AiReportRecord } => {
  const title = titleRaw.trim() || '未命名 AI 報告'
  const ts = new Date().toISOString()
  const created: AiReportRecord = {
    id: crypto.randomUUID(),
    title,
    bodyText: buildPlaceholderAiReportBody(title),
    status: 'DRAFT',
    createdByActorId: actorId,
    createdAt: ts,
    updatedAt: ts,
    adoptedAt: null,
    distributedAt: null,
  }
  return { next: [created, ...existing], created }
}

export const updateAiReportDraftBody = (
  actorId: string,
  id: string,
  bodyText: string,
  rows: AiReportRecord[],
): AiReportRecord[] => {
  const i = findAiReportIndex(rows, id)
  if (i < 0) throw new Error('找不到報告')
  const row = rows[i]
  if (row.status !== 'DRAFT') throw new Error('僅草稿可編輯內容')
  if (row.createdByActorId !== actorId) throw new Error('僅建立者可編輯此草稿')
  const nextRow = touchAiReportRecord(row, { bodyText })
  const next = [...rows]
  next[i] = nextRow
  return next
}
