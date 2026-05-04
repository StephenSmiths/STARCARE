import { insertAuditEvent } from '../_shared/insertAuditEvent.ts'
import { getServiceClient } from '../_shared/supabaseAdmin.ts'
import { requireTeamLeadOrAdmin } from '../_shared/guardTeamLeadOrAdmin.ts'
import { emptyOk, json } from '../_shared/http.ts'
import { buildResidentCreatePayload } from '../_shared/residentWritePayload.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return emptyOk()
  if (req.method !== 'POST') return json({ error: '僅支援 POST' }, 405)
  const staff = await requireTeamLeadOrAdmin(req)
  if (staff instanceof Response) return staff
  const actorId = staff.user.id
  try {
    const body = (await req.json()) as Record<string, unknown>
    const parsed = buildResidentCreatePayload(body)
    if (!parsed.ok) return json({ error: parsed.message }, 400)
    const supabase = getServiceClient()
    const { error } = await supabase.from('residents').insert(parsed.row)
    if (error) return json({ error: error.message }, 400)
    const audit = await insertAuditEvent(supabase, {
      action: 'CREATE',
      entity_type: 'Resident',
      entity_id: parsed.row.id,
      actor_id: actorId,
      before_state: null,
      after_state: JSON.stringify(parsed.row),
      detail: '新增院友資料',
    })
    if (!audit.ok) {
      await supabase.from('residents').update({ is_deleted: true }).eq('id', parsed.row.id)
      return json({ error: `審計落庫失敗，已回溯新增（軟刪）：${audit.message}` }, 500)
    }
    return json({ ok: true }, 201)
  } catch (e) {
    return json({ error: String(e) }, 500)
  }
})
