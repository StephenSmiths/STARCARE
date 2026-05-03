/** PDF 01 §3.1／§3「服務類型隔離」／02【16】：資助復康選時段之共用門檻（`schedulingCore` 二階段選時段會呼叫） */
import type {
  ConflictType,
  SchedulingConstraints,
  SchedulingResident,
  SchedulingSession,
  StaffProfileRoleType,
} from './schedulingService'

/** PDF 02【16】／01 §3：SC「僅治療師」時可承接之職類（註冊 PT／OT） */
export const isRegisteredTherapistRole = (role: StaffProfileRoleType): boolean => role === 'PT' || role === 'OT'

/** 與上次服務日距離是否在「禁止」範圍內（預設 minGap=1 即相鄰曆日不可） */
export const isWithinGapDays = (previousDate: string, nextDate: string, minGapDays: number): boolean => {
  if (minGapDays <= 0) return false
  const oneDayMs = 24 * 60 * 60 * 1000
  const diff = Math.abs(new Date(nextDate).getTime() - new Date(previousDate).getTime())
  return diff > 0 && diff <= oneDayMs * minGapDays
}

/**
 * PDF 01 §3.1：資助復康時段之硬性檢查（不含「相鄰日間隔」）。
 * PDF 01 §3：`serviceType !== Subsidized_Rehab` 回傳 `skip`（與認知軌永不混用），不更新衝突訊息。
 */
export const evalSessionCoreForPick = (
  resident: SchedulingResident,
  session: SchedulingSession,
  sessionUsage: Map<string, number>,
  staffSlotSet: Set<string>,
  constraints: SchedulingConstraints,
):
  | { tag: 'skip' }
  | { tag: 'fail'; conflictType: ConflictType; reason: string }
  | { tag: 'core-ok' } => {
  if (session.serviceType !== 'Subsidized_Rehab') return { tag: 'skip' }
  if (session.skillMatched === false) {
    return { tag: 'fail', conflictType: 'SKILL_MISMATCH', reason: '員工技能不符合此活動要求' }
  }
  if (
    resident.isSpecialCareCase &&
    constraints.allowScTherapistOnly === true &&
    session.staffRoleType !== undefined &&
    !isRegisteredTherapistRole(session.staffRoleType)
  ) {
    return {
      tag: 'fail',
      conflictType: 'SKILL_MISMATCH',
      reason: 'SC 個案依設定僅可分配予註冊治療師（PT／OT）',
    }
  }
  const effectiveCapacity = Math.min(session.capacity, constraints.groupCapacityLimit)
  if ((sessionUsage.get(session.id) ?? 0) >= effectiveCapacity) {
    return { tag: 'fail', conflictType: 'NO_CAPACITY', reason: '該時段容量已滿' }
  }
  const sameDayCount = resident.assignedDates.filter((date) => date === session.date).length
  if (sameDayCount >= constraints.dailySameServiceLimit) {
    return { tag: 'fail', conflictType: 'DAILY_LIMIT', reason: '院友同日不可重複安排同類服務' }
  }
  if (staffSlotSet.has(`${session.staffId}|${session.date}|${session.timeSlot}`)) {
    return { tag: 'fail', conflictType: 'STAFF_SLOT_DUPLICATED', reason: '同一員工同一時段不可重複安排' }
  }
  return { tag: 'core-ok' }
}
