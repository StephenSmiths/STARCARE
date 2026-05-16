import type { SchedulingPolicyBundle } from '../../../repositories/schedulingPolicyTypes'
import { WEEKLY_ROSTER_DEFAULT_CAPACITY } from '../constants/weeklyRosterImportConstants'
import { resolvePolicySlotChunkMinutes } from './policySlotChunkMinutes'
import { splitHmTimeRangeByChunkMinutes } from './schedulingHmTimeRangeSplit'
import type { WeeklyRosterDraftRow } from './weeklyRosterImportParseText'

/**
 * PDF 02【16】P2：週更表列若時段長於政策節長，切為多列（匯入後產生多個 activity session）。
 */
export const expandWeeklyRosterDraftsByPolicySlotDuration = (
  drafts: WeeklyRosterDraftRow[],
  bundle: SchedulingPolicyBundle | null | undefined,
): WeeklyRosterDraftRow[] => {
  const out: WeeklyRosterDraftRow[] = []
  for (const d of drafts) {
    const isGroup = WEEKLY_ROSTER_DEFAULT_CAPACITY > 1
    const chunk = resolvePolicySlotChunkMinutes(d.role, isGroup, bundle)
    const parts = splitHmTimeRangeByChunkMinutes(d.startHm, d.endHm, chunk)
    if (parts.length <= 1) {
      out.push(d)
      continue
    }
    parts.forEach((part, splitPart) => {
      out.push({
        ...d,
        startHm: part.startHm,
        endHm: part.endHm,
        splitPart,
      })
    })
  }
  return out
}
