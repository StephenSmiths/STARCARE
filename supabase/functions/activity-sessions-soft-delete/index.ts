import { getServiceClient } from '../_shared/supabaseAdmin.ts'
import { emptyOk, json } from '../_shared/http.ts'
import { guardTeamLeadOrAdmin } from '../_shared/guardTeamLeadOrAdmin.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return emptyOk()
  if (req.method !== 'POST') return json({ error: '僅支援 POST' }, 405)
  const denied = await guardTeamLeadOrAdmin(req)
  if (denied) return denied
  try {
    const body = (await req.json()) as { id?: string }
    const id = String(body.id ?? '').trim()
    if (!id) return json({ error: '缺少 id' }, 400)
    const supabase = getServiceClient()
    const { error } = await supabase
      .from('activity_sessions')
      .update({ is_deleted: true })
      .eq('id', id)
      .eq('is_deleted', false)
    if (error) return json({ error: error.message }, 400)
    return json({ ok: true, id })
  } catch (e) {
    return json({ error: String(e) }, 500)
  }
})
