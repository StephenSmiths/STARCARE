import { guardStaffUser } from '../_shared/guardStaffUser.ts'
import { emptyOk, json } from '../_shared/http.ts'
import { getServiceClient } from '../_shared/supabaseAdmin.ts'

type IncomingRow = Record<string, unknown>
type ErrorItem = { rowIndex: number; field: string; message: string }

const toStr = (value: unknown): string => String(value ?? '').trim()

const normalize = (row: IncomingRow) => ({
  id: toStr(row.id),
  facility_id: toStr(row.facilityId ?? row.facility_id) || 'facility-main',
  activity_id: toStr(row.activityId ?? row.activity_id),
  staff_profile_id: toStr(row.staffProfileId ?? row.staff_profile_id),
  session_date: toStr(row.sessionDate ?? row.session_date),
  time_slot: toStr(row.timeSlot ?? row.time_slot),
  capacity: Number(row.capacity),
})

const validateRow = (row: ReturnType<typeof normalize>, rowIndex: number): ErrorItem[] => {
  const errors: ErrorItem[] = []
  if (!row.facility_id) errors.push({ rowIndex, field: 'facility_id', message: 'facility_id 不可為空' })
  if (!row.activity_id) errors.push({ rowIndex, field: 'activity_id', message: 'activity_id 不可為空' })
  if (!row.staff_profile_id) {
    errors.push({ rowIndex, field: 'staff_profile_id', message: 'staff_profile_id 不可為空' })
  }
  if (!row.session_date) errors.push({ rowIndex, field: 'session_date', message: 'session_date 不可為空' })
  if (!row.time_slot) errors.push({ rowIndex, field: 'time_slot', message: 'time_slot 不可為空' })
  if (!Number.isFinite(row.capacity) || row.capacity < 1) {
    errors.push({ rowIndex, field: 'capacity', message: 'capacity 需為大於等於 1 的數字' })
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

    const supabase = getServiceClient()
    const activityIds = Array.from(new Set(rows.map((r) => r.activity_id).filter(Boolean)))
    const staffIds = Array.from(new Set(rows.map((r) => r.staff_profile_id).filter(Boolean)))
    const ids = rows.map((r) => r.id).filter(Boolean)

    if (activityIds.length > 0) {
      const { data, error } = await supabase.from('activities').select('id').in('id', activityIds)
      if (error) return json({ error: error.message }, 400)
      const exists = new Set((data ?? []).map((x) => String(x.id)))
      rows.forEach((row, idx) => {
        if (row.activity_id && !exists.has(row.activity_id)) {
          errors.push({ rowIndex: idx + 1, field: 'activity_id', message: 'activity_id 不存在' })
        }
      })
    }
    if (staffIds.length > 0) {
      const { data, error } = await supabase.from('staff_profiles').select('id').in('id', staffIds)
      if (error) return json({ error: error.message }, 400)
      const exists = new Set((data ?? []).map((x) => String(x.id)))
      rows.forEach((row, idx) => {
        if (row.staff_profile_id && !exists.has(row.staff_profile_id)) {
          errors.push({ rowIndex: idx + 1, field: 'staff_profile_id', message: 'staff_profile_id 不存在' })
        }
      })
    }
    if (ids.length > 0) {
      const { data, error } = await supabase
        .from('activity_sessions')
        .select('id')
        .eq('is_deleted', false)
        .in('id', ids)
      if (error) return json({ error: error.message }, 400)
      const exists = new Set((data ?? []).map((x) => String(x.id)))
      rows.forEach((row, idx) => {
        if (row.id && exists.has(row.id)) {
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
