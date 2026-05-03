import { getServiceClient } from '../_shared/supabaseAdmin.ts'
import { emptyOk, json } from '../_shared/http.ts'
import { guardTeamLeadOrAdmin } from '../_shared/guardTeamLeadOrAdmin.ts'
import { buildResidentCreatePayload } from '../_shared/residentWritePayload.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return emptyOk()
  if (req.method !== 'POST') return json({ error: '僅支援 POST' }, 405)
  const denied = await guardTeamLeadOrAdmin(req)
  if (denied) return denied
  try {
    const body = (await req.json()) as Record<string, unknown>
    const parsed = buildResidentCreatePayload(body)
    if (!parsed.ok) return json({ error: parsed.message }, 400)
    const supabase = getServiceClient()
    const { error } = await supabase.from('residents').insert(parsed.row)
    if (error) return json({ error: error.message }, 400)
    return json({ ok: true }, 201)
  } catch (e) {
    return json({ error: String(e) }, 500)
  }
})
