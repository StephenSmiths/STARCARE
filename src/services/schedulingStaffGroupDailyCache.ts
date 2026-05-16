/** PDF 02【16】P1：員工每日小組活動場次增量計數（避免每次選時段掃描全表指派） */
import type { SchedulingSession } from './schedulingService'

export type StaffGroupDailyCache = Map<string, Set<string>>

const isGroupCapacitySession = (session: SchedulingSession): boolean => session.capacity > 1

export const staffGroupDailyCacheKey = (staffId: string, date: string): string => `${staffId}|${date}`

export const getStaffGroupSessionCount = (
  cache: StaffGroupDailyCache,
  staffId: string,
  date: string,
): number => cache.get(staffGroupDailyCacheKey(staffId, date))?.size ?? 0

export const noteStaffGroupSessionAssignment = (
  cache: StaffGroupDailyCache,
  session: SchedulingSession,
): void => {
  if (session.serviceType !== 'Subsidized_Rehab' || !isGroupCapacitySession(session)) return
  const key = staffGroupDailyCacheKey(session.staffId, session.date)
  const bucket = cache.get(key) ?? new Set<string>()
  bucket.add(session.id)
  cache.set(key, bucket)
}
