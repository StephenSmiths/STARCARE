import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

/** 與 `audit-trail-append` 同欄位上限（01 §5／Seq 12） */
const MAX_TEXT = 32000

const clamp = (s: string): string => (s.length <= MAX_TEXT ? s : s.slice(0, MAX_TEXT))

type BatchRow = { batch_id: string }

/**
 * 排班批次儲存後落庫審計（`SCHEDULE_BATCH_SAVE`）；與前端 `SchedulingPersistenceService` 敘述對齊。
 * 失敗時呼叫端應回溯本次 `scheduling_history` 插入（見 `schedule-assignments-batch`）。
 */
export const insertSchedulingBatchAuditEvent = async (
  supabase: SupabaseClient,
  actorId: string,
  rows: BatchRow[],
): Promise<{ ok: true } | { ok: false; message: string }> => {
  if (!rows.length) return { ok: false, message: 'rows 不可為空' }
  const batchId = rows[0]?.batch_id?.trim()
  if (!batchId) return { ok: false, message: 'batch_id 無效' }
  const occurredAt = new Date().toISOString()
  const afterState = JSON.stringify({ count: rows.length, batchId })
  const detail = `一鍵儲存：批量寫入 scheduling_history（batch=${batchId}）`
  const { error } = await supabase.from('audit_events').insert({
    action: 'SCHEDULE_BATCH_SAVE',
    entity_type: 'Scheduling',
    entity_id: batchId,
    actor_id: actorId,
    before_state: null,
    after_state: clamp(afterState),
    detail: clamp(detail),
    occurred_at: occurredAt,
  })
  if (error) return { ok: false, message: error.message }
  return { ok: true }
}
