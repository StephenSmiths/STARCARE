import { insertAuditEvent } from '../_shared/insertAuditEvent.ts'
import { requireTeamLeadOrAdmin } from '../_shared/guardTeamLeadOrAdmin.ts'
import { emptyOk, json } from '../_shared/http.ts'
import { getServiceClient } from '../_shared/supabaseAdmin.ts'

type PreviewRow = {
  id?: string
  facility_id: string
  display_name: string
  role_type: 'PT' | 'OT' | 'PTA' | 'OTA' | 'TeamLead'
  service_scope: 'Subsidized_Rehab' | 'Dementia_Care' | 'Both'
  gender?: 'Male' | 'Female' | null
  phone?: string
  email?: string
}

const rowPayload = (row: PreviewRow, id: string) => ({
  id,
  facility_id: row.facility_id,
  display_name: row.display_name,
  role_type: row.role_type,
  service_scope: row.service_scope,
  gender: row.gender ?? null,
  phone: row.phone ?? '',
  email: row.email ?? '',
  is_deleted: false,
})

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return emptyOk()
  if (req.method !== 'POST') return json({ error: '僅支援 POST' }, 405)
  const auth = await requireTeamLeadOrAdmin(req)
  if (auth instanceof Response) return auth
  try {
    const body = (await req.json()) as { rows?: PreviewRow[]; actorId?: string }
    const rows = body.rows ?? []
    const actorId = String(body.actorId ?? '').trim()
    if (!actorId) return json({ error: '缺少 actorId' }, 400)
    if (actorId !== auth.user.id) return json({ error: 'actorId 必須為目前登入者' }, 403)
    if (rows.length === 0) return json({ error: 'rows 不可為空' }, 400)

    const supabase = getServiceClient()
    const ids = rows.map((row) => row.id?.trim()).filter(Boolean) as string[]

    /** 同編號：僅 is_deleted===false 為現役；true／null 等皆視為可復原（勿用 Boolean(is_deleted) 致 null 誤判為可 INSERT）。 */
    const idState = new Map<string, 'active' | 'restore'>()
    if (ids.length > 0) {
      const { data: allRows, error: allErr } = await supabase.from('staff_profiles').select('id,is_deleted').in('id', ids)
      if (allErr) return json({ error: allErr.message }, 400)
      for (const r of allRows ?? []) {
        const sid = String(r.id)
        idState.set(sid, r.is_deleted === false ? 'active' : 'restore')
      }
      const activeIds = [...idState.entries()].filter(([, s]) => s === 'active').map(([i]) => i)
      if (activeIds.length > 0) return json({ error: `員工編號已存在：${activeIds.join(', ')}` }, 409)
    }

    const insertPayloads: Record<string, unknown>[] = []
    const restoreOps: { id: string; row: PreviewRow }[] = []

    for (const row of rows) {
      const trimmed = row.id?.trim()
      const id = trimmed || `staff-${crypto.randomUUID()}`
      if (trimmed && idState.get(trimmed) === 'restore') {
        restoreOps.push({ id: trimmed, row })
      } else {
        insertPayloads.push(rowPayload(row, id))
      }
    }

    if (insertPayloads.length > 0) {
      const { error: insErr } = await supabase.from('staff_profiles').insert(insertPayloads)
      if (insErr) return json({ error: insErr.message }, 400)
    }

    for (const { id, row } of restoreOps) {
      const { error: upErr } = await supabase
        .from('staff_profiles')
        .update({
          facility_id: row.facility_id,
          display_name: row.display_name,
          role_type: row.role_type,
          service_scope: row.service_scope,
          gender: row.gender ?? null,
          phone: row.phone ?? '',
          email: row.email ?? '',
          is_deleted: false,
        })
        .eq('id', id)
      if (upErr) return json({ error: upErr.message }, 400)
    }

    const batchId = `staff-import-${crypto.randomUUID()}`
    const staffIds = [
      ...insertPayloads.map((p) => String(p.id)),
      ...restoreOps.map((o) => o.id),
    ]
    const audit = await insertAuditEvent(supabase, {
      action: 'STAFF_IMPORT_COMMIT',
      entity_type: 'Staff',
      entity_id: batchId,
      actor_id: actorId,
      before_state: null,
      after_state: JSON.stringify({
        count: rows.length,
        batchId,
        staffIds,
        insertedNew: insertPayloads.length,
        restored: restoreOps.length,
      }),
      detail: `員工批量匯入（batch=${batchId}；新增 ${insertPayloads.length}、復原 ${restoreOps.length}）`,
    })
    if (!audit.ok) {
      if (insertPayloads.length > 0) {
        const newIds = insertPayloads.map((p) => String(p.id))
        await supabase.from('staff_profiles').update({ is_deleted: true }).in('id', newIds).eq('is_deleted', false)
      }
      for (const { id } of restoreOps) {
        await supabase.from('staff_profiles').update({ is_deleted: true }).eq('id', id).eq('is_deleted', false)
      }
      return json({ error: `審計落庫失敗，已回溯本次匯入（軟刪／復原回溯）：${audit.message}` }, 500)
    }

    return json({
      ok: true,
      inserted: rows.length,
      actorId,
      staffIds,
    })
  } catch (error) {
    return json({ error: String(error) }, 500)
  }
})
