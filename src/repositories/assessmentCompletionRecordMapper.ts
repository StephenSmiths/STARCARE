import type { AssessmentCompletionRecord } from '../features/assessmentManagement/types/assessmentManagement'

/** Edge／PostgREST snake_case 列（PDF 02【9】評估完成紀錄） */
export type AssessmentCompletionRecordRow = {
  id: string
  resident_id: string
  resident_name: string
  cycle_anchor_date: string
  discipline: 'PT' | 'OT'
  version_label: string
  recorded_by_actor_id: string
  completed_at: string
}

const ymd = (value: string): string => {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toISOString().slice(0, 10)
}

const iso = (value: string): string => {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toISOString()
}

export const mapAssessmentCompletionRecordRow = (row: AssessmentCompletionRecordRow): AssessmentCompletionRecord => ({
  id: row.id,
  residentId: row.resident_id,
  residentName: row.resident_name,
  cycleAnchorDate: ymd(row.cycle_anchor_date),
  discipline: row.discipline,
  versionLabel: row.version_label,
  recordedByActorId: row.recorded_by_actor_id,
  completedAt: iso(row.completed_at),
})

/** Edge **`assessment-completion-records-append`** 請求列（snake_case） */
export const toAssessmentCompletionAppendPayload = (
  r: AssessmentCompletionRecord,
): AssessmentCompletionRecordRow => ({
  id: r.id,
  resident_id: r.residentId,
  resident_name: r.residentName,
  cycle_anchor_date: r.cycleAnchorDate,
  discipline: r.discipline,
  version_label: r.versionLabel,
  recorded_by_actor_id: r.recordedByActorId,
  completed_at: r.completedAt,
})
