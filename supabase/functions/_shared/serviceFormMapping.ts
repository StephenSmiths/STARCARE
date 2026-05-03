/** 01 §2.2：DB 列與前端 ServiceFormRecord 對應（Seq 3 Edge） */

export type ServiceFormApiRecord = {
  id: string
  sessionId: string
  sessionDate: string
  staffProfileId: string
  residentId: string
  residentName: string
  narrative: string
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED_NEEDS_REVISION'
  ownerActorId: string
  createdAt: string
  updatedAt: string
  submittedAt: string | null
  reviewedAt: string | null
  reviewerActorId: string | null
  reviewNote: string | null
}

export const isServiceFormApiRecord = (v: unknown): v is ServiceFormApiRecord => {
  if (!v || typeof v !== 'object') return false
  const o = v as Record<string, unknown>
  const st = o.status
  return (
    typeof o.id === 'string' &&
    typeof o.sessionId === 'string' &&
    typeof o.sessionDate === 'string' &&
    typeof o.staffProfileId === 'string' &&
    typeof o.residentId === 'string' &&
    typeof o.residentName === 'string' &&
    typeof o.narrative === 'string' &&
    typeof o.ownerActorId === 'string' &&
    typeof o.createdAt === 'string' &&
    typeof o.updatedAt === 'string' &&
    (st === 'DRAFT' || st === 'SUBMITTED' || st === 'APPROVED' || st === 'REJECTED_NEEDS_REVISION')
  )
}

export const formToDbRow = (facilityId: string, f: ServiceFormApiRecord) => ({
  id: f.id,
  facility_id: facilityId,
  session_id: f.sessionId,
  session_date: f.sessionDate.slice(0, 10),
  staff_profile_id: f.staffProfileId,
  resident_id: f.residentId,
  resident_name: f.residentName,
  narrative: f.narrative,
  status: f.status,
  owner_actor_id: f.ownerActorId,
  created_at: f.createdAt,
  updated_at: f.updatedAt,
  submitted_at: f.submittedAt,
  reviewed_at: f.reviewedAt,
  reviewer_actor_id: f.reviewerActorId,
  review_note: f.reviewNote,
  is_deleted: false,
})

export const dbRowToForm = (r: Record<string, unknown>): ServiceFormApiRecord => ({
  id: String(r.id),
  sessionId: String(r.session_id),
  sessionDate: String(r.session_date).slice(0, 10),
  staffProfileId: String(r.staff_profile_id),
  residentId: String(r.resident_id),
  residentName: String(r.resident_name),
  narrative: String(r.narrative ?? ''),
  status: r.status as ServiceFormApiRecord['status'],
  ownerActorId: String(r.owner_actor_id),
  createdAt: String(r.created_at),
  updatedAt: String(r.updated_at),
  submittedAt: r.submitted_at ? String(r.submitted_at) : null,
  reviewedAt: r.reviewed_at ? String(r.reviewed_at) : null,
  reviewerActorId: r.reviewer_actor_id ? String(r.reviewer_actor_id) : null,
  reviewNote: r.review_note ? String(r.review_note) : null,
})
