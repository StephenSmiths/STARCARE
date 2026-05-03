/** 01 §5／Seq 12：審計事件列表（RLS 語意由 Edge 以角色過濾，service_client 查詢） */
import { getServiceClient } from '../_shared/supabaseAdmin.ts'
import { corsHeaders, emptyOk, json } from '../_shared/http.ts'
import { requireStaffUser } from '../_shared/requireStaffUser.ts'

const rowToJson = (row: Record<string, unknown>) => ({
  id: row.id as string,
  action: row.action as string,
  entityType: row.entity_type as string,
  entityId: row.entity_id as string,
  actorId: row.actor_id as string,
  beforeState: row.before_state as string | null,
  afterState: row.after_state as string | null,
  detail: row.detail as string,
  occurredAt: row.occurred_at as string,
})

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return emptyOk()
  if (req.method !== 'GET') return json({ error: '僅支援 GET' }, 405)
  const staff = await requireStaffUser(req)
  if (staff instanceof Response) return staff
  const url = new URL(req.url)
  const rawLimit = Number(url.searchParams.get('limit') ?? '200')
  const limit = Number.isFinite(rawLimit) ? Math.min(500, Math.max(1, Math.floor(rawLimit))) : 200
  const supabase = getServiceClient()
  let q = supabase
    .from('audit_events')
    .select(
      'id, action, entity_type, entity_id, actor_id, before_state, after_state, detail, occurred_at',
    )
    .eq('is_deleted', false)
    .order('occurred_at', { ascending: false })
    .limit(limit)
  if (staff.role === 'staff') {
    q = q.eq('actor_id', staff.user.id)
  }
  const { data, error } = await q
  if (error) return json({ error: error.message }, 400)
  const rows = (data ?? []).map((r) => rowToJson(r as Record<string, unknown>))
  return new Response(JSON.stringify(rows), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})
