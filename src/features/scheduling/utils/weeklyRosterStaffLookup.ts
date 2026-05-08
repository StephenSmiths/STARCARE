import type { StaffProfileListRow } from '../../../repositories/staffProfilesListRepository'

/** 以「姓名 + Tab + 職位」對應 `staff_profiles.id`（週更表解析用）。 */
export const buildWeeklyRosterStaffProfileLookup = (
  staff: StaffProfileListRow[],
): { map: Map<string, string>; ambiguousKeys: string[] } => {
  const buckets = new Map<string, string[]>()
  for (const s of staff) {
    if (s.roleType === 'TeamLead') continue
    const key = `${s.displayName.trim()}\t${s.roleType}`
    const prev = buckets.get(key) ?? []
    prev.push(s.id)
    buckets.set(key, prev)
  }
  const ambiguousKeys: string[] = []
  const map = new Map<string, string>()
  buckets.forEach((ids, key) => {
    if (ids.length > 1) ambiguousKeys.push(key)
    else map.set(key, ids[0]!)
  })
  return { map, ambiguousKeys }
}
