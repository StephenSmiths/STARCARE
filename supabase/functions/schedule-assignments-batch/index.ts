import { insertSchedulingBatchAuditEvent } from '../_shared/insertSchedulingBatchAudit.ts'
import { getServiceClient } from '../_shared/supabaseAdmin.ts'
import { emptyOk, json } from '../_shared/http.ts'
import { requireStaffUser } from '../_shared/requireStaffUser.ts'

type Row = {
  resident_id: string
  session_id: string
  staff_id: string
  pass: number
  service_type: string
  actor_id: string
  batch_id: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return emptyOk()
  if (req.method !== 'POST') return json({ error: '僅支援 POST' }, 405)
  const staff = await requireStaffUser(req)
  if (staff instanceof Response) return staff
  try {
    const body = (await req.json()) as { assignments?: Row[] }
    const rows = body.assignments
    if (!rows?.length) return json({ error: 'assignments 不可為空' }, 400)
    const uid = staff.user.id
    if (rows.some((row) => row.actor_id !== uid)) {
      return json({ error: 'actor_id 須與登入使用者 id 一致' }, 400)
    }
    const supabase = getServiceClient()
    const { error } = await supabase.from('scheduling_history').insert(rows)
    if (error) return json({ error: error.message }, 400)
    const actorId = String(uid)
    const audit = await insertSchedulingBatchAuditEvent(supabase, actorId, rows)
    if (!audit.ok) {
      const batchId = rows[0]?.batch_id ?? ''
      await supabase
        .from('scheduling_history')
        .update({ is_deleted: true })
        .eq('batch_id', batchId)
        .eq('is_deleted', false)
      return json({ error: `審計落庫失敗，已回溯本次排班批次（軟刪）：${audit.message}` }, 500)
    }
    return json({ ok: true, inserted: rows.length })
  } catch (e) {
    return json({ error: String(e) }, 500)
  }
})
