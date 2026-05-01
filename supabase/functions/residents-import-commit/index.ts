import { guardStaffUser } from '../_shared/guardStaffUser.ts'
import { emptyOk, json } from '../_shared/http.ts'
import { getServiceClient } from '../_shared/supabaseAdmin.ts'

type PreviewRow = {
  name: string
  bed_number: string
  area: string
  gender: 'Male' | 'Female'
  age: number
  admission_date: string
  funding_type: 'GradeA_Subsidized' | 'Voucher' | 'Private'
  service_type: 'Subsidized_Rehab' | 'Dementia_Service' | 'Both'
  dementia_level: 'Severe' | 'Moderate' | 'Mild' | 'None'
  is_special_care: boolean
  health_condition: string
  medication_record: string
}

type InsertRow = PreviewRow & { id: string; is_deleted: boolean }

const assertRows = (rows: PreviewRow[]): string | null => {
  if (rows.length === 0) return 'rows 不可為空'
  for (const row of rows) {
    if (!row.name || !row.bed_number || !row.area || !row.admission_date) {
      return '資料列缺少必要欄位'
    }
  }
  return null
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return emptyOk()
  if (req.method !== 'POST') return json({ error: '僅支援 POST' }, 405)
  const staff = await guardStaffUser(req)
  if (staff) return staff
  try {
    const body = (await req.json()) as { rows?: PreviewRow[]; actorId?: string }
    const rows = body.rows ?? []
    const actorId = String(body.actorId ?? '').trim()
    if (!actorId) return json({ error: '缺少 actorId' }, 400)
    const invalidReason = assertRows(rows)
    if (invalidReason) return json({ error: invalidReason }, 400)

    const dupInPayload = new Set<string>()
    const seen = new Set<string>()
    for (const row of rows) {
      if (seen.has(row.bed_number)) dupInPayload.add(row.bed_number)
      seen.add(row.bed_number)
    }
    if (dupInPayload.size > 0) {
      return json({ error: `匯入資料內床號重覆：${Array.from(dupInPayload).join(', ')}` }, 400)
    }

    const supabase = getServiceClient()
    const bedNumbers = rows.map((r) => r.bed_number)
    const { data: exists, error: existsErr } = await supabase
      .from('residents')
      .select('bed_number')
      .eq('is_deleted', false)
      .in('bed_number', bedNumbers)
    if (existsErr) return json({ error: existsErr.message }, 400)
    const occupied = (exists ?? []).map((x) => String(x.bed_number))
    if (occupied.length > 0) {
      return json({ error: `床號已存在：${occupied.join(', ')}` }, 409)
    }

    const insertRows: InsertRow[] = rows.map((row) => ({
      id: `resident-${crypto.randomUUID()}`,
      ...row,
      is_deleted: false,
    }))
    const { error: insertErr } = await supabase.from('residents').insert(insertRows)
    if (insertErr) return json({ error: insertErr.message }, 400)

    return json({
      ok: true,
      inserted: insertRows.length,
      actorId,
      residentIds: insertRows.map((r) => r.id),
    })
  } catch (error) {
    return json({ error: String(error) }, 500)
  }
})
