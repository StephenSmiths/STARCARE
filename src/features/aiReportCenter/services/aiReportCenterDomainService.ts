import type { AiReportRecord } from '../types/aiReportCenter'

/** PDF 02【11】占位：後端 AI 接上後替換為實際摘要／引用資料來源 */
export const buildPlaceholderAiReportBody = (title: string): string =>
  [
    `【報告草稿】${title}`,
    '',
    '（骨架）此區將承載 Team Lead 核准前之 AI 生成內容；可編輯後「採用」鎖定版本，再「發放」對外。',
    '',
    `- 生成：占位文字，待接模型與提示詞治理。`,
    `- 編輯／採用：DRAFT → ADOPTED。`,
    `- 發放：ADOPTED → DISTRIBUTED（審計紀錄）。`,
  ].join('\n')

const findIndex = (rows: AiReportRecord[], id: string): number => rows.findIndex((r) => r.id === id)

const touch = (row: AiReportRecord, patch: Partial<AiReportRecord>): AiReportRecord => ({
  ...row,
  ...patch,
  updatedAt: new Date().toISOString(),
})

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
  const i = findIndex(rows, id)
  if (i < 0) throw new Error('找不到報告')
  const row = rows[i]
  if (row.status !== 'DRAFT') throw new Error('僅草稿可編輯內容')
  if (row.createdByActorId !== actorId) throw new Error('僅建立者可編輯此草稿')
  const nextRow = touch(row, { bodyText })
  const next = [...rows]
  next[i] = nextRow
  return next
}

export const adoptAiReport = (actorId: string, id: string, rows: AiReportRecord[]): AiReportRecord[] => {
  const i = findIndex(rows, id)
  if (i < 0) throw new Error('找不到報告')
  const row = rows[i]
  if (row.status !== 'DRAFT') throw new Error('僅草稿可採用為正式版本')
  if (row.createdByActorId !== actorId) throw new Error('僅建立者可採用此草稿')
  const ts = new Date().toISOString()
  const nextRow = touch(row, { status: 'ADOPTED', adoptedAt: ts })
  const next = [...rows]
  next[i] = nextRow
  return next
}

export const distributeAiReport = (actorId: string, id: string, rows: AiReportRecord[]): AiReportRecord[] => {
  const i = findIndex(rows, id)
  if (i < 0) throw new Error('找不到報告')
  const row = rows[i]
  if (row.status !== 'ADOPTED') throw new Error('須先採用後才可發放')
  if (row.createdByActorId !== actorId) throw new Error('僅建立者可發放此報告')
  const ts = new Date().toISOString()
  const nextRow = touch(row, { status: 'DISTRIBUTED', distributedAt: ts })
  const next = [...rows]
  next[i] = nextRow
  return next
}
