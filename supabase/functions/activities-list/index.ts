import { getServiceClient } from '../_shared/supabaseAdmin.ts'
import { corsHeaders, emptyOk, json } from '../_shared/http.ts'
import { guardStaffUser } from '../_shared/guardStaffUser.ts'

type ActivityRow = {
  id: string
  facility_id: string
  name: string
  service_type: 'Subsidized_Rehab' | 'Dementia_Care'
  activity_kind: 'Training' | 'Assessment' | 'Other'
  delivery_mode: 'Individual' | 'Group'
  min_duration_minutes: number
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return emptyOk()
  if (req.method !== 'GET') return json({ error: '僅支援 GET' }, 405)
  const denied = await guardStaffUser(req)
  if (denied) return denied
  try {
    const facilityId = new URL(req.url).searchParams.get('facilityId')
    const supabase = getServiceClient()
    let query = supabase
      .from('activities')
      .select('id, facility_id, name, service_type, activity_kind, delivery_mode, min_duration_minutes')
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })
    if (facilityId) {
      query = query.eq('facility_id', facilityId)
    }
    const { data, error } = await query
    if (error) return json({ error: error.message }, 400)
    const rows = ((data ?? []) as ActivityRow[]).map((row) => ({
      id: row.id,
      facilityId: row.facility_id,
      name: row.name,
      serviceType: row.service_type,
      activityKind: row.activity_kind,
      deliveryMode: row.delivery_mode,
      minDurationMinutes: row.min_duration_minutes,
    }))
    return new Response(JSON.stringify(rows), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return json({ error: String(error) }, 500)
  }
})
