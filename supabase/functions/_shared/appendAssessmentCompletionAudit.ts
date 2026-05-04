import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

/** 與 `audit-trail-append` 同欄位上限（01 §5） */
const MAX_TEXT = 32000

const clamp = (s: string): string => (s.length <= MAX_TEXT ? s : s.slice(0, MAX_TEXT))

export type AssessmentAuditRow = {
  id: string
  resident_id: string
  resident_name: string
  cycle_anchor_date: string
  discipline: string
  version_label: string
}

/**
 * 評估完成寫入後之審計（`action=ASSESSMENT_COMPLETION_RECORD`）；依院友分筆落庫。
 * 失敗時由呼叫端回溯主檔（見 `assessment-completion-records-append`）。
 */
export const insertAssessmentCompletionAuditEvents = async (
  supabase: SupabaseClient,
  actorId: string,
  rows: AssessmentAuditRow[],
): Promise<{ auditOk: boolean; auditMessage?: string }> => {
  const occurredAt = new Date().toISOString()
  const byResident = new Map<string, AssessmentAuditRow[]>()
  for (const r of rows) {
    const list = byResident.get(r.resident_id) ?? []
    list.push(r)
    byResident.set(r.resident_id, list)
  }
  for (const [rid, list] of byResident) {
    const name = list[0]?.resident_name ?? ''
    const afterState = JSON.stringify(
      list.map((x) => ({
        id: x.id,
        discipline: x.discipline,
        version_label: x.version_label,
        cycle_anchor_date: x.cycle_anchor_date,
      })),
    )
    const detail = `評估完成紀錄：${name}（${list.map((x) => `${x.discipline} ${x.version_label}`).join('、')}）`
    const { error } = await supabase.from('audit_events').insert({
      action: 'ASSESSMENT_COMPLETION_RECORD',
      entity_type: 'Resident',
      entity_id: rid,
      actor_id: actorId,
      before_state: null,
      after_state: clamp(afterState),
      detail: clamp(detail),
      occurred_at: occurredAt,
    })
    if (error) return { auditOk: false, auditMessage: error.message }
  }
  return { auditOk: true }
}
