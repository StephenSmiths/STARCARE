import { getServiceClient } from '../_shared/supabaseAdmin.ts'
import { emptyOk, json } from '../_shared/http.ts'
import { requireStaffUser } from '../_shared/requireStaffUser.ts'

/** 與前端 AuditTrailRecord 對齊；長度上限防濫用 */
const MAX_TEXT = 32000

const clamp = (s: string | null | undefined, max: number): string | null => {
  if (s == null) return null
  const t = String(s)
  return t.length <= max ? t : t.slice(0, max)
}

type Body = {
  event?: {
    action: string
    entityType: string
    entityId: string
    actorId: string
    beforeState: string | null
    afterState: string | null
    detail: string
    occurredAt: string
  }
}

const ENTITY_TYPES = new Set(['Resident', 'Staff', 'Scheduling', 'Reporting', 'Auth'])

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return emptyOk()
  if (req.method !== 'POST') return json({ error: '僅支援 POST' }, 405)
  const staff = await requireStaffUser(req)
  if (staff instanceof Response) return staff
  let body: Body
  try {
    body = (await req.json()) as Body
  } catch {
    return json({ error: 'JSON 解析失敗' }, 400)
  }
  const ev = body.event
  if (!ev || typeof ev !== 'object') return json({ error: '缺少 event' }, 400)
  const action = (ev.action ?? '').trim()
  if (!action || action.length > 80) return json({ error: 'action 無效' }, 400)
  if (!ENTITY_TYPES.has(ev.entityType ?? '')) return json({ error: 'entityType 無效' }, 400)
  const entityId = (ev.entityId ?? '').trim()
  if (!entityId || entityId.length > 256) return json({ error: 'entityId 無效' }, 400)
  const actorId = (ev.actorId ?? '').trim()
  if (actorId !== staff.user.id) return json({ error: 'actorId 必須為目前登入者' }, 403)
  const occurredAt = (ev.occurredAt ?? '').trim()
  if (!occurredAt) return json({ error: 'occurredAt 不可為空' }, 400)
  const supabase = getServiceClient()
  const { error } = await supabase.from('audit_events').insert({
    action,
    entity_type: ev.entityType,
    entity_id: entityId,
    actor_id: actorId,
    before_state: clamp(ev.beforeState, MAX_TEXT),
    after_state: clamp(ev.afterState, MAX_TEXT),
    detail: clamp(ev.detail, MAX_TEXT) ?? '',
    occurred_at: occurredAt,
  })
  if (error) return json({ error: error.message }, 400)
  return json({ ok: true })
})
