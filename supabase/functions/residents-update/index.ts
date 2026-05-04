import { insertAuditEvent } from '../_shared/insertAuditEvent.ts'
import { getServiceClient } from '../_shared/supabaseAdmin.ts'
import { requireTeamLeadOrAdmin } from '../_shared/guardTeamLeadOrAdmin.ts'
import { emptyOk, json } from '../_shared/http.ts'
import { buildResidentUpdatePayload } from '../_shared/residentWritePayload.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return emptyOk()
  if (req.method !== 'POST') return json({ error: '僅支援 POST' }, 405)
  const staff = await requireTeamLeadOrAdmin(req)
  if (staff instanceof Response) return staff
  const actorId = staff.user.id
  try {
    const body = (await req.json()) as Record<string, unknown>
    const parsed = buildResidentUpdatePayload(body)
    if (!parsed.ok) return json({ error: parsed.message }, 400)
    const supabase = getServiceClient()
    const { data: prev, error: selErr } = await supabase
      .from('residents')
      .select('*')
      .eq('id', parsed.id)
      .eq('is_deleted', false)
      .maybeSingle()
    if (selErr) return json({ error: selErr.message }, 400)
    if (!prev) return json({ error: '找不到院友資料' }, 404)

    const { error } = await supabase.from('residents').update(parsed.fields).eq('id', parsed.id)
    if (error) return json({ error: error.message }, 400)

    const after = { ...prev, ...parsed.fields }
    const audit = await insertAuditEvent(supabase, {
      action: 'UPDATE',
      entity_type: 'Resident',
      entity_id: parsed.id,
      actor_id: actorId,
      before_state: JSON.stringify(prev),
      after_state: JSON.stringify(after),
      detail: '修改院友資料',
    })
    if (!audit.ok) {
      const revert: Record<string, unknown> = {}
      for (const key of Object.keys(parsed.fields)) {
        revert[key] = (prev as Record<string, unknown>)[key]
      }
      await supabase.from('residents').update(revert).eq('id', parsed.id)
      return json({ error: `審計落庫失敗，已回溯本次修改：${audit.message}` }, 500)
    }
    return json({ ok: true })
  } catch (e) {
    return json({ error: String(e) }, 500)
  }
})
