import { getServiceClient } from '../_shared/supabaseAdmin.ts'
import { emptyOk, json } from '../_shared/http.ts'
import { requireStaffUser } from '../_shared/requireStaffUser.ts'

const DEFAULT_LIMIT = 10

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return emptyOk()
  if (req.method !== 'GET') return json({ error: '僅支援 GET' }, 405)
  const staff = await requireStaffUser(req)
  if (staff instanceof Response) return staff
  const url = new URL(req.url)
  const facilityId = (url.searchParams.get('facility_id') ?? '').trim()
  if (!facilityId) return json({ error: 'facility_id 不可為空' }, 400)
  const actorId = (url.searchParams.get('actor_id') ?? '').trim()
  const from = (url.searchParams.get('from') ?? '').trim()
  const to = (url.searchParams.get('to') ?? '').trim()
  const limitRaw = Number.parseInt(url.searchParams.get('limit') ?? `${DEFAULT_LIMIT}`, 10)
  const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 50) : DEFAULT_LIMIT
  if (from && Number.isNaN(new Date(from).getTime())) return json({ error: 'from 格式錯誤' }, 400)
  if (to && Number.isNaN(new Date(to).getTime())) return json({ error: 'to 格式錯誤' }, 400)
  if (from && to && new Date(from).getTime() > new Date(to).getTime()) {
    return json({ error: 'from 不可晚於 to' }, 400)
  }
  const supabase = getServiceClient()
  let query = supabase
    .from('scheduling_kpi_history')
    .select(
      'ran_at, coverage_rate, conflict_rate_per_100, average_assignments_per_resident, under_target_rate, resident_count, assignment_count, conflict_count, actor_id',
    )
    .eq('facility_id', facilityId)
    .eq('is_deleted', false)
    .order('ran_at', { ascending: false })
    .limit(limit)
  if (actorId) query = query.eq('actor_id', actorId)
  if (from) query = query.gte('ran_at', from)
  if (to) query = query.lte('ran_at', to)
  const { data, error } = await query
  if (error) return json({ error: error.message }, 400)
  return json({ rows: data ?? [] })
})
