import { getServiceClient } from '../_shared/supabaseAdmin.ts'
import { emptyOk, json } from '../_shared/http.ts'
import { requireStaffUser } from '../_shared/requireStaffUser.ts'
import { formToDbRow, isServiceFormApiRecord } from '../_shared/serviceFormMapping.ts'

type Body = { facilityId?: string; form?: unknown }

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return emptyOk()
  if (req.method !== 'POST') return json({ error: '僅支援 POST' }, 405)
  const staff = await requireStaffUser(req)
  if (staff instanceof Response) return staff
  try {
    const body = (await req.json()) as Body
    const facilityId = (body.facilityId ?? 'facility-main').trim()
    if (!isServiceFormApiRecord(body.form)) return json({ error: 'form 格式錯誤' }, 400)
    const f = body.form
    if (staff.role === 'staff' && f.ownerActorId !== staff.user.id) {
      return json({ error: 'Staff 僅可 upsert 本人為 owner 之表單' }, 403)
    }
    const row = formToDbRow(facilityId, f)
    const supabase = getServiceClient()
    const { error } = await supabase.from('service_forms').upsert(row, { onConflict: 'id' })
    if (error) return json({ error: error.message }, 400)
    return json({ ok: true })
  } catch (e) {
    return json({ error: String(e) }, 500)
  }
})
