import { getServiceClient } from '../_shared/supabaseAdmin.ts'
import { corsHeaders, emptyOk, json } from '../_shared/http.ts'
import { guardStaffUser } from '../_shared/guardStaffUser.ts'

type StaffProfileRow = {
  id: string
  facility_id: string
  display_name: string
  role_type: 'PT' | 'OT' | 'PTA' | 'OTA' | 'TeamLead'
  service_scope: 'Subsidized_Rehab' | 'Dementia_Care' | 'Both'
}

/** PDF 02【1】儀表盤等：讀取未刪除員工主檔之 role_type（Seq 13） */
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return emptyOk()
  if (req.method !== 'GET') return json({ error: '僅支援 GET' }, 405)
  const denied = await guardStaffUser(req)
  if (denied) return denied
  try {
    const facilityId = new URL(req.url).searchParams.get('facilityId')
    const supabase = getServiceClient()
    let query = supabase
      .from('staff_profiles')
      .select('id, facility_id, display_name, role_type, service_scope')
      .eq('is_deleted', false)
    if (facilityId) query = query.eq('facility_id', facilityId)
    const { data, error } = await query
    if (error) return json({ error: error.message }, 400)
    const rows = ((data ?? []) as StaffProfileRow[]).map((row) => ({
      id: row.id,
      facilityId: row.facility_id,
      displayName: row.display_name,
      roleType: row.role_type,
      serviceScope: row.service_scope,
    }))
    return new Response(JSON.stringify(rows), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return json({ error: String(error) }, 500)
  }
})
