import { getServiceClient } from '../_shared/supabaseAdmin.ts'
import { emptyOk, json } from '../_shared/http.ts'
import { requireStaffUser } from '../_shared/requireStaffUser.ts'

type Body = { facilityId?: string }

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return emptyOk()
  if (req.method !== 'POST') return json({ error: '僅支援 POST' }, 405)
  const staff = await requireStaffUser(req)
  if (staff instanceof Response) return staff
  const body = (await req.json()) as Body
  const facilityId = (body.facilityId ?? '').trim()
  if (!facilityId) return json({ error: 'facilityId 不可為空' }, 400)
  const supabase = getServiceClient()
  const { error } = await supabase
    .from('scheduling_kpi_history')
    .update({ is_deleted: true, deleted_at: new Date().toISOString() })
    .eq('facility_id', facilityId)
    .eq('is_deleted', false)
  if (error) return json({ error: error.message }, 400)
  return json({ ok: true })
})
