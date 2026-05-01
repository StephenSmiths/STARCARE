import { getServiceClient } from '../_shared/supabaseAdmin.ts'
import { emptyOk, json } from '../_shared/http.ts'
import { guardStaffUser } from '../_shared/guardStaffUser.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return emptyOk()
  if (req.method !== 'POST') return json({ error: '僅支援 POST' }, 405)
  const denied = await guardStaffUser(req)
  if (denied) return denied
  try {
    const body = (await req.json()) as Record<string, unknown>
    const supabase = getServiceClient()
    const { error } = await supabase.from('residents').insert(body)
    if (error) return json({ error: error.message }, 400)
    return json({ ok: true }, 201)
  } catch (e) {
    return json({ error: String(e) }, 500)
  }
})
