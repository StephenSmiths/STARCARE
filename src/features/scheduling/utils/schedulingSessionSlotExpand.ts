import type { SchedulingPolicyBundle } from '../../../repositories/schedulingPolicyTypes'
import type { SchedulingSession } from '../../../services/schedulingService'
import { resolvePolicySlotChunkMinutes } from './policySlotChunkMinutes'
import {
  schedulingSessionTimeSlotDurationMinutes,
  splitHmTimeRangeByChunkMinutes,
} from './schedulingHmTimeRangeSplit'
import {
  isP2SplitSchedulingSessionId,
  P2_SESSION_SPLIT_MARKER,
} from './schedulingSessionIdNormalize'

/** 智能排班乾跑：將過長 activity session 依 P2 節長展開為多個引擎時段（id 帶 `~p2~`）。 */
export const expandSchedulingSessionsByPolicySlotDuration = (
  sessions: SchedulingSession[],
  bundle: SchedulingPolicyBundle | null | undefined,
): SchedulingSession[] => {
  const out: SchedulingSession[] = []
  for (const s of sessions) {
    if (isP2SplitSchedulingSessionId(s.id)) {
      out.push(s)
      continue
    }
    const [startRaw, endRaw] = s.timeSlot.split('-').map((x) => x.trim())
    if (!startRaw || !endRaw) {
      out.push(s)
      continue
    }
    const isGroup = s.capacity > 1
    const role = s.staffRoleType ?? 'PT'
    const chunk = resolvePolicySlotChunkMinutes(role, isGroup, bundle)
    const duration = schedulingSessionTimeSlotDurationMinutes(s.timeSlot)
    if (duration <= chunk) {
      out.push(s)
      continue
    }
    const parts = splitHmTimeRangeByChunkMinutes(startRaw, endRaw, chunk)
    if (parts.length <= 1) {
      out.push(s)
      continue
    }
    parts.forEach((part, index) => {
      out.push({
        ...s,
        id: `${s.id}${P2_SESSION_SPLIT_MARKER}${index}`,
        timeSlot: `${part.startHm}-${part.endHm}`,
      })
    })
  }
  return out
}
