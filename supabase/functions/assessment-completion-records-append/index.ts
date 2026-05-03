import { insertAssessmentCompletionAuditEvents } from '../_shared/appendAssessmentCompletionAudit.ts'
import { getServiceClient } from '../_shared/supabaseAdmin.ts'
import { emptyOk, json } from '../_shared/http.ts'
import { requireStaffUser } from '../_shared/requireStaffUser.ts'

/** PDF 02【9】／01 §5：寫入評估完成紀錄；recorded_by 須為 JWT 本人；爭議以 01 PDF 為準 */

const toStr = (v: unknown): string => {
  if (v === null || v === undefined) return ''
  return String(v).trim()
}

const DISC = new Set(['PT', 'OT'])

type InsertRow = {
  id: string
  resident_id: string
  resident_name: string
  cycle_anchor_date: string
  discipline: string
  version_label: string
  recorded_by_actor_id: string
  completed_at: string
  is_deleted: boolean
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return emptyOk()
  if (req.method !== 'POST') return json({ error: '僅支援 POST' }, 405)
  const staff = await requireStaffUser(req)
  if (staff instanceof Response) return staff
  let body: { records?: unknown[] }
  try {
    body = (await req.json()) as { records?: unknown[] }
  } catch {
    return json({ error: 'JSON 解析失敗' }, 400)
  }
  const incoming = body.records ?? []
  if (!Array.isArray(incoming) || incoming.length === 0) return json({ error: 'records 不可為空' }, 400)
  if (incoming.length > 20) return json({ error: '單次最多 20 筆' }, 400)

  const actorId = staff.user.id
  const rows: InsertRow[] = []
  for (let i = 0; i < incoming.length; i += 1) {
    const r = incoming[i] as Record<string, unknown>
    const id = toStr(r.id)
    const resident_id = toStr(r.resident_id)
    const resident_name = toStr(r.resident_name)
    const cycle_anchor_date = toStr(r.cycle_anchor_date)
    const discipline = toStr(r.discipline)
    const version_label = toStr(r.version_label)
    const recorded_by_actor_id = toStr(r.recorded_by_actor_id)
    let completed_at = toStr(r.completed_at)
    if (!id) return json({ error: `第 ${i + 1} 筆缺少 id` }, 400)
    if (!resident_id) return json({ error: `第 ${i + 1} 筆缺少 resident_id` }, 400)
    if (!resident_name) return json({ error: `第 ${i + 1} 筆缺少 resident_name` }, 400)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(cycle_anchor_date)) {
      return json({ error: `第 ${i + 1} 筆 cycle_anchor_date 須為 YYYY-MM-DD` }, 400)
    }
    if (!DISC.has(discipline)) return json({ error: `第 ${i + 1} 筆 discipline 僅允許 PT／OT` }, 400)
    if (!version_label) return json({ error: `第 ${i + 1} 筆缺少 version_label` }, 400)
    if (!recorded_by_actor_id) return json({ error: `第 ${i + 1} 筆缺少 recorded_by_actor_id` }, 400)
    if (recorded_by_actor_id !== actorId) {
      return json({ error: 'recorded_by_actor_id 須為目前登入者' }, 403)
    }
    if (!completed_at || Number.isNaN(Date.parse(completed_at))) {
      completed_at = new Date().toISOString()
    }
    rows.push({
      id,
      resident_id,
      resident_name,
      cycle_anchor_date,
      discipline,
      version_label,
      recorded_by_actor_id,
      completed_at,
      is_deleted: false,
    })
  }

  const supabase = getServiceClient()
  const resIds = [...new Set(rows.map((x) => x.resident_id))]
  const { data: existRows, error: exErr } = await supabase
    .from('residents')
    .select('id')
    .in('id', resIds)
    .eq('is_deleted', false)
  if (exErr) return json({ error: exErr.message }, 400)
  const okIds = new Set((existRows ?? []).map((x) => String((x as { id: string }).id)))
  for (const id of resIds) {
    if (!okIds.has(id)) return json({ error: `院友不存在或已刪除：${id}` }, 400)
  }

  const { error: insErr } = await supabase.from('assessment_completion_records').insert(rows)
  if (insErr) {
    if (insErr.code === '23505') {
      return json({ error: '此週期該科別已有紀錄（不可重複登錄）' }, 409)
    }
    return json({ error: insErr.message }, 400)
  }
  const audit = await insertAssessmentCompletionAuditEvents(supabase, actorId, rows)
  if (!audit.auditOk) {
    console.error('[assessment-completion-records-append] audit_events', audit.auditMessage ?? '')
  }
  return json({ ok: true, inserted: rows.length, audit_ok: audit.auditOk })
})
