/** 01 §5：scheduling_history 依 batch_id 軟刪除（Seq 10）；僅 TeamLead／Admin */
import { insertAuditEvent } from '../_shared/insertAuditEvent.ts'
import { getServiceClient } from '../_shared/supabaseAdmin.ts'
import { emptyOk, json } from '../_shared/http.ts'
import { requireStaffUser } from '../_shared/requireStaffUser.ts'

type Body = { batch_id?: string }

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return emptyOk()
  if (req.method !== 'POST') return json({ error: '僅支援 POST' }, 405)
  const staff = await requireStaffUser(req)
  if (staff instanceof Response) return staff
  if (staff.role === 'staff') {
    return json({ error: '僅 TeamLead／Admin 可軟刪除排班歷史批次' }, 403)
  }
  try {
    const body = (await req.json()) as Body
    const batchId = String(body.batch_id ?? '').trim()
    if (!batchId) return json({ error: '缺少 batch_id' }, 400)
    const supabase = getServiceClient()
    const { data, error } = await supabase
      .from('scheduling_history')
      .update({ is_deleted: true })
      .eq('batch_id', batchId)
      .eq('is_deleted', false)
      .select('id')
    if (error) return json({ error: error.message }, 400)
    const touchedIds = (data ?? []).map((r) => String(r.id))
    const n = touchedIds.length
    if (n === 0) return json({ ok: true, batch_id: batchId, updated: 0 })

    const audit = await insertAuditEvent(supabase, {
      action: 'SCHEDULING_HISTORY_BATCH_SOFT_DELETE',
      entity_type: 'Scheduling',
      entity_id: batchId,
      actor_id: staff.user.id,
      before_state: JSON.stringify({ batchId, rowCount: n }),
      after_state: JSON.stringify({ is_deleted: true, ids: touchedIds }),
      detail: '軟刪除 scheduling_history 批次（is_deleted）',
    })
    if (!audit.ok) {
      if (touchedIds.length > 0) {
        await supabase.from('scheduling_history').update({ is_deleted: false }).in('id', touchedIds)
      }
      return json({ error: `審計落庫失敗，已回溯批次軟刪：${audit.message}` }, 500)
    }
    return json({ ok: true, batch_id: batchId, updated: n })
  } catch (e) {
    return json({ error: String(e) }, 500)
  }
})
