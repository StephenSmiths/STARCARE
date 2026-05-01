import { getServiceClient } from '../_shared/supabaseAdmin.ts'
import { emptyOk, json } from '../_shared/http.ts'
import { requireStaffUser } from '../_shared/requireStaffUser.ts'

type Body = {
  facilityId?: string
  record?: {
    ranAt: string
    coverageRate: number
    conflictRatePer100: number
    averageAssignmentsPerResident: number
    underTargetRate: number
    residentCount: number
    assignmentCount: number
    conflictCount: number
  }
}

const isValidRecord = (value: Body['record']): value is NonNullable<Body['record']> => {
  if (!value) return false
  return (
    typeof value.ranAt === 'string' &&
    typeof value.coverageRate === 'number' &&
    typeof value.conflictRatePer100 === 'number' &&
    typeof value.averageAssignmentsPerResident === 'number' &&
    typeof value.underTargetRate === 'number' &&
    typeof value.residentCount === 'number' &&
    typeof value.assignmentCount === 'number' &&
    typeof value.conflictCount === 'number'
  )
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return emptyOk()
  if (req.method !== 'POST') return json({ error: '僅支援 POST' }, 405)
  const staff = await requireStaffUser(req)
  if (staff instanceof Response) return staff
  const body = (await req.json()) as Body
  const facilityId = (body.facilityId ?? '').trim()
  if (!facilityId) return json({ error: 'facilityId 不可為空' }, 400)
  if (!isValidRecord(body.record)) return json({ error: 'record 格式錯誤' }, 400)
  const supabase = getServiceClient()
  const { error } = await supabase.from('scheduling_kpi_history').insert({
    facility_id: facilityId,
    ran_at: body.record.ranAt,
    coverage_rate: body.record.coverageRate,
    conflict_rate_per_100: body.record.conflictRatePer100,
    average_assignments_per_resident: body.record.averageAssignmentsPerResident,
    under_target_rate: body.record.underTargetRate,
    resident_count: body.record.residentCount,
    assignment_count: body.record.assignmentCount,
    conflict_count: body.record.conflictCount,
    actor_id: staff.user.id,
  })
  if (error) return json({ error: error.message }, 400)
  return json({ ok: true })
})
