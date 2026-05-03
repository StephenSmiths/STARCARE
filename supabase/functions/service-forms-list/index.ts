/** 查詢 `service_forms`；`approvedOnly=1` 時僅 APPROVED（PDF 02【10】／Seq 23） */
import { getServiceClient } from '../_shared/supabaseAdmin.ts'
import { corsHeaders, emptyOk, json } from '../_shared/http.ts'
import { requireStaffUser } from '../_shared/requireStaffUser.ts'
import { dbRowToForm } from '../_shared/serviceFormMapping.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return emptyOk()
  if (req.method !== 'GET') return json({ error: '僅支援 GET' }, 405)
  const staff = await requireStaffUser(req)
  if (staff instanceof Response) return staff
  try {
    const url = new URL(req.url)
    const facilityId = (url.searchParams.get('facilityId') ?? 'facility-main').trim()
    const approvedOnlyRaw = url.searchParams.get('approvedOnly')
    const approvedOnly = approvedOnlyRaw === '1' || approvedOnlyRaw === 'true'
    const supabase = getServiceClient()
    let query = supabase
      .from('service_forms')
      .select('*')
      .eq('is_deleted', false)
      .eq('facility_id', facilityId)
      .order('updated_at', { ascending: false })
    if (approvedOnly) {
      query = query.eq('status', 'APPROVED')
    }
    if (staff.role === 'staff') {
      query = query.eq('owner_actor_id', staff.user.id)
    }
    const { data, error } = await query
    if (error) return json({ error: error.message }, 400)
    const rows = (data ?? []).map((row) => dbRowToForm(row as Record<string, unknown>))
    return new Response(JSON.stringify(rows), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    return json({ error: String(e) }, 500)
  }
})
