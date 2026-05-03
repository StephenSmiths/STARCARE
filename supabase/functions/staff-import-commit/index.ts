import { guardTeamLeadOrAdmin } from '../_shared/guardTeamLeadOrAdmin.ts'
import { emptyOk, json } from '../_shared/http.ts'
import { getServiceClient } from '../_shared/supabaseAdmin.ts'

type PreviewRow = {
  id?: string
  facility_id: string
  display_name: string
  role_type: 'PT' | 'OT' | 'PTA' | 'OTA' | 'TeamLead'
  service_scope: 'Subsidized_Rehab' | 'Dementia_Care' | 'Both'
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return emptyOk()
  if (req.method !== 'POST') return json({ error: '僅支援 POST' }, 405)
  const denied = await guardTeamLeadOrAdmin(req)
  if (denied) return denied
  try {
    const body = (await req.json()) as { rows?: PreviewRow[]; actorId?: string }
    const rows = body.rows ?? []
    const actorId = String(body.actorId ?? '').trim()
    if (!actorId) return json({ error: '缺少 actorId' }, 400)
    if (rows.length === 0) return json({ error: 'rows 不可為空' }, 400)

    const ids = rows.map((row) => row.id).filter(Boolean) as string[]
    if (ids.length > 0) {
      const supabase = getServiceClient()
      const { data, error } = await supabase
        .from('staff_profiles')
        .select('id')
        .eq('is_deleted', false)
        .in('id', ids)
      if (error) return json({ error: error.message }, 400)
      const existed = (data ?? []).map((item) => String(item.id))
      if (existed.length > 0) return json({ error: `id 已存在：${existed.join(', ')}` }, 409)
    }

    const insertRows = rows.map((row) => ({
      id: row.id?.trim() || `staff-${crypto.randomUUID()}`,
      facility_id: row.facility_id,
      display_name: row.display_name,
      role_type: row.role_type,
      service_scope: row.service_scope,
      is_deleted: false,
    }))
    const supabase = getServiceClient()
    const { error } = await supabase.from('staff_profiles').insert(insertRows)
    if (error) return json({ error: error.message }, 400)
    return json({
      ok: true,
      inserted: insertRows.length,
      actorId,
      staffIds: insertRows.map((row) => row.id),
    })
  } catch (error) {
    return json({ error: String(error) }, 500)
  }
})
