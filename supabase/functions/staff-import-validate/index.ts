import { guardStaffUser } from '../_shared/guardStaffUser.ts'
import { emptyOk, json } from '../_shared/http.ts'
import { getServiceClient } from '../_shared/supabaseAdmin.ts'

type IncomingRow = Record<string, unknown>
type ErrorItem = { rowIndex: number; field: string; message: string }

const ROLE_TYPES = new Set(['PT', 'OT', 'PTA', 'OTA', 'TeamLead'])
const SERVICE_SCOPE = new Set(['Subsidized_Rehab', 'Dementia_Care', 'Both'])

const toStr = (value: unknown): string => String(value ?? '').trim()

const normalize = (row: IncomingRow) => ({
  id: toStr(row.id),
  facility_id: toStr(row.facilityId ?? row.facility_id) || 'facility-main',
  display_name: toStr(row.displayName ?? row.display_name),
  role_type: toStr(row.roleType ?? row.role_type),
  service_scope: toStr(row.serviceScope ?? row.service_scope),
})

const validateRow = (row: ReturnType<typeof normalize>, rowIndex: number): ErrorItem[] => {
  const errors: ErrorItem[] = []
  if (!row.display_name) errors.push({ rowIndex, field: 'display_name', message: '姓名不可為空' })
  if (!row.facility_id) errors.push({ rowIndex, field: 'facility_id', message: 'facility_id 不可為空' })
  if (!ROLE_TYPES.has(row.role_type)) errors.push({ rowIndex, field: 'role_type', message: 'role_type 非法' })
  if (!SERVICE_SCOPE.has(row.service_scope)) {
    errors.push({ rowIndex, field: 'service_scope', message: 'service_scope 非法' })
  }
  return errors
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return emptyOk()
  if (req.method !== 'POST') return json({ error: '僅支援 POST' }, 405)
  const denied = await guardStaffUser(req)
  if (denied) return denied
  try {
    const body = (await req.json()) as { rows?: IncomingRow[] }
    const incoming = body.rows ?? []
    if (incoming.length === 0) return json({ error: 'rows 不可為空' }, 400)
    const rows = incoming.map(normalize)
    const errors: ErrorItem[] = []
    rows.forEach((row, idx) => errors.push(...validateRow(row, idx + 1)))

    const seenIds = new Set<string>()
    for (let i = 0; i < rows.length; i += 1) {
      const id = rows[i].id
      if (!id) continue
      if (seenIds.has(id)) errors.push({ rowIndex: i + 1, field: 'id', message: 'CSV 內 id 重覆' })
      seenIds.add(id)
    }

    const ids = rows.map((r) => r.id).filter(Boolean)
    if (ids.length > 0) {
      const supabase = getServiceClient()
      const { data, error } = await supabase
        .from('staff_profiles')
        .select('id')
        .eq('is_deleted', false)
        .in('id', ids)
      if (error) return json({ error: error.message }, 400)
      const existed = new Set((data ?? []).map((item) => String(item.id)))
      rows.forEach((row, idx) => {
        if (row.id && existed.has(row.id)) {
          errors.push({ rowIndex: idx + 1, field: 'id', message: 'id 已存在於系統' })
        }
      })
    }

    const invalidRows = new Set(errors.map((item) => item.rowIndex))
    const preview = rows.filter((_row, idx) => !invalidRows.has(idx + 1))
    return json({
      ok: errors.length === 0,
      summary: { total: rows.length, valid: preview.length, invalid: invalidRows.size },
      errors,
      preview,
    })
  } catch (error) {
    return json({ error: String(error) }, 500)
  }
})
