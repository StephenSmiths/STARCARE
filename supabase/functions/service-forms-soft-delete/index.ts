import { insertAuditEvent } from '../_shared/insertAuditEvent.ts'
import { getServiceClient } from '../_shared/supabaseAdmin.ts'
import { emptyOk, json } from '../_shared/http.ts'
import { requireStaffUser } from '../_shared/requireStaffUser.ts'

type Body = { id?: string }

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return emptyOk()
  if (req.method !== 'POST') return json({ error: '僅支援 POST' }, 405)
  const staff = await requireStaffUser(req)
  if (staff instanceof Response) return staff
  try {
    const body = (await req.json()) as Body
    const id = String(body.id ?? '').trim()
    if (!id) return json({ error: '缺少 id' }, 400)
    const supabase = getServiceClient()
    const { data: row, error: selErr } = await supabase
      .from('service_forms')
      .select('owner_actor_id, status, session_id, is_deleted')
      .eq('id', id)
      .maybeSingle()
    if (selErr) return json({ error: selErr.message }, 400)
    if (!row) return json({ ok: true, id, note: 'no_row' })
    if (row.is_deleted) return json({ ok: true, id, note: 'already_deleted' })
    if (row.status === 'APPROVED') return json({ error: '已核准表單不可軟刪除' }, 400)
    if (staff.role === 'staff' && row.owner_actor_id !== staff.user.id) {
      return json({ error: 'Staff 僅可軟刪除本人表單' }, 403)
    }

    const { error } = await supabase.from('service_forms').update({ is_deleted: true }).eq('id', id).eq('is_deleted', false)
    if (error) return json({ error: error.message }, 400)

    const audit = await insertAuditEvent(supabase, {
      action: 'FORM_SOFT_DELETE',
      entity_type: 'Scheduling',
      entity_id: id,
      actor_id: staff.user.id,
      before_state: JSON.stringify({ status: row.status, sessionId: row.session_id }),
      after_state: null,
      detail: '軟刪除服務表單（本機＋DB is_deleted）',
    })
    if (!audit.ok) {
      await supabase.from('service_forms').update({ is_deleted: false }).eq('id', id).eq('is_deleted', true)
      return json({ error: `審計落庫失敗，已回溯軟刪：${audit.message}` }, 500)
    }
    return json({ ok: true, id })
  } catch (e) {
    return json({ error: String(e) }, 500)
  }
})
