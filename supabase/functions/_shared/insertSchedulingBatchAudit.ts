import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'
import { insertAuditEvent } from './insertAuditEvent.ts'

type BatchRow = { batch_id: string }

/**
 * 排班批次儲存後落庫審計（`SCHEDULE_BATCH_SAVE`）；與前端 `SchedulingPersistenceService` 敘述對齊。
 * 失敗時呼叫端應回溯本次 `scheduling_history` 插入（見 `schedule-assignments-batch`）。
 */
export const insertSchedulingBatchAuditEvent = async (
  supabase: SupabaseClient,
  actorId: string,
  rows: BatchRow[],
): Promise<{ ok: true; id: string } | { ok: false; message: string }> => {
  if (!rows.length) return { ok: false, message: 'rows 不可為空' }
  const batchId = rows[0]?.batch_id?.trim()
  if (!batchId) return { ok: false, message: 'batch_id 無效' }
  const afterState = JSON.stringify({ count: rows.length, batchId })
  const detail = `一鍵儲存：批量寫入 scheduling_history（batch=${batchId}）`
  return insertAuditEvent(supabase, {
    action: 'SCHEDULE_BATCH_SAVE',
    entity_type: 'Scheduling',
    entity_id: batchId,
    actor_id: actorId,
    before_state: null,
    after_state: afterState,
    detail,
  })
}
