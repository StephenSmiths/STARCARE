import { guardTeamLeadOrAdmin } from '../_shared/guardTeamLeadOrAdmin.ts'
import { emptyOk, json } from '../_shared/http.ts'
import { normalizeStaffProfileId } from '../_shared/staffProfileIdNormalize.ts'
import { getServiceClient } from '../_shared/supabaseAdmin.ts'

type IncomingRow = Record<string, unknown>
type ErrorItem = { rowIndex: number; field: string; message: string }

type PreviewRow = {
  id?: string
  facility_id: string
  display_name: string
  role_type: 'PT' | 'OT' | 'PTA' | 'OTA' | 'TeamLead'
  service_scope: 'Subsidized_Rehab' | 'Dementia_Care' | 'Both'
  gender: 'Male' | 'Female' | null
  phone: string
  email: string
}

const ROLE_TYPES = new Set(['PT', 'OT', 'PTA', 'OTA', 'TeamLead'])
const SERVICE_SCOPE = new Set(['Subsidized_Rehab', 'Dementia_Care', 'Both'])

const toStr = (value: unknown): string => String(value ?? '').trim()

const normalizeGender = (raw: string): { ok: true; value: 'Male' | 'Female' | null } | { ok: false } => {
  if (!raw) return { ok: true, value: null }
  const u = raw.toUpperCase()
  if (raw === 'Male' || raw === '男' || u === 'M') return { ok: true, value: 'Male' }
  if (raw === 'Female' || raw === '女' || u === 'F') return { ok: true, value: 'Female' }
  return { ok: false }
}

/** SOP PDF 02【13】員工批量匯入預檢；範本無院舍／ServiceScope 時預設 facility-main、Both。 */
const normalizeIn = (row: IncomingRow) => ({
  id: normalizeStaffProfileId(row.id),
  facility_id: toStr(row.facilityId ?? row.facility_id) || 'facility-main',
  display_name: toStr(row.displayName ?? row.display_name),
  role_type: toStr(row.roleType ?? row.role_type),
  service_scope: toStr(row.serviceScope ?? row.service_scope) || 'Both',
  phone: toStr(row.phone),
  email: toStr(row.email),
  gender_raw: toStr(row.gender),
})

const validateRow = (row: ReturnType<typeof normalizeIn>, rowIndex: number): ErrorItem[] => {
  const errors: ErrorItem[] = []
  if (!row.display_name) errors.push({ rowIndex, field: 'display_name', message: '姓名不可為空' })
  if (!row.facility_id) errors.push({ rowIndex, field: 'facility_id', message: '院舍編號不可為空' })
  if (!ROLE_TYPES.has(row.role_type)) {
    errors.push({ rowIndex, field: 'role_type', message: '職位非法（須為 PT／PTA／OT／OTA；舊檔可含 TeamLead）' })
  }
  if (!SERVICE_SCOPE.has(row.service_scope)) {
    errors.push({ rowIndex, field: 'service_scope', message: 'service_scope 非法' })
  }
  if (!normalizeGender(row.gender_raw).ok) {
    errors.push({ rowIndex, field: 'gender', message: '性別須為 男／女／M／F（或 Male／Female）' })
  }
  return errors
}

const toPreview = (row: ReturnType<typeof normalizeIn>): PreviewRow => {
  const g = normalizeGender(row.gender_raw)
  return {
    id: row.id || undefined,
    facility_id: row.facility_id,
    display_name: row.display_name,
    role_type: row.role_type as PreviewRow['role_type'],
    service_scope: row.service_scope as PreviewRow['service_scope'],
    gender: g.ok ? g.value : null,
    phone: row.phone,
    email: row.email,
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return emptyOk()
  if (req.method !== 'POST') return json({ error: '僅支援 POST' }, 405)
  const denied = await guardTeamLeadOrAdmin(req)
  if (denied) return denied
  try {
    const body = (await req.json()) as { rows?: IncomingRow[] }
    const incoming = body.rows ?? []
    if (incoming.length === 0) return json({ error: 'rows 不可為空' }, 400)
    const normalized = incoming.map(normalizeIn)
    const errors: ErrorItem[] = []
    normalized.forEach((row, idx) => errors.push(...validateRow(row, idx + 1)))

    const seenIds = new Set<string>()
    for (let i = 0; i < normalized.length; i += 1) {
      const id = normalized[i].id
      if (!id) continue
      if (seenIds.has(id)) errors.push({ rowIndex: i + 1, field: 'id', message: '檔案內員工編號重覆' })
      seenIds.add(id)
    }

    const ids = normalized.map((r) => r.id).filter(Boolean)
    if (ids.length > 0) {
      const supabase = getServiceClient()
      const { data, error } = await supabase
        .from('staff_profiles')
        .select('id')
        .eq('is_deleted', false)
        .in('id', ids)
      if (error) return json({ error: error.message }, 400)
      const existed = new Set((data ?? []).map((item) => String(item.id)))
      normalized.forEach((row, idx) => {
        if (row.id && existed.has(row.id)) {
          errors.push({ rowIndex: idx + 1, field: 'id', message: '員工編號已存在於系統' })
        }
      })
    }

    /** 與 staff_profiles.facility_id FK 對齊：預檢須驗證院舍主檔存在，避免預檢通過但匯入 400。 */
    const facilityIds = [...new Set(normalized.map((r) => r.facility_id).filter(Boolean))]
    if (facilityIds.length > 0) {
      const supabase = getServiceClient()
      const { data: facRows, error: facErr } = await supabase
        .from('facilities')
        .select('id')
        .eq('is_deleted', false)
        .in('id', facilityIds)
      if (facErr) return json({ error: facErr.message }, 400)
      const facOk = new Set((facRows ?? []).map((r) => String(r.id)))
      normalized.forEach((row, idx) => {
        if (!facOk.has(row.facility_id)) {
          errors.push({
            rowIndex: idx + 1,
            field: 'facility_id',
            message: `院舍編號不存在於系統：${row.facility_id}（請先建立 facilities 主檔，或範本留空以使用 facility-main）`,
          })
        }
      })
    }

    const invalidRows = new Set(errors.map((item) => item.rowIndex))
    const preview: PreviewRow[] = normalized
      .map((row, idx) => ({ row, idx }))
      .filter(({ idx }) => !invalidRows.has(idx + 1))
      .map(({ row }) => toPreview(row))

    return json({
      ok: errors.length === 0,
      summary: { total: normalized.length, valid: preview.length, invalid: invalidRows.size },
      errors,
      preview,
    })
  } catch (error) {
    return json({ error: String(error) }, 500)
  }
})
