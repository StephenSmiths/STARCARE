import type { Resident } from '../../residents/types/resident'
import type { SchedulingConstraints } from '../../../services/schedulingService'
import {
  schedulingService,
  type SchedulingResident,
  type SchedulingSession,
} from '../../../services/schedulingService'
import { getWeeklyTargetByFundingType } from '../../../services/schedulingTargets'
import { mapActiveResidentsToSubsidizedSchedulingResidents } from '../../scheduling/utils/mapActiveResidentsToSubsidizedSchedulingResidents'
import { cloneResidents, cloneSessions } from '../../scheduling/hooks/schedulingHookHelpers'
import { filterSchedulingSessionsForSubsidizedEngine } from '../../scheduling/services/schedulingSessionWindowFilterService'
import type { SystemSettingsSnapshot } from '../../systemSettings/types'
import type { RehabActivityTrackRow, RehabActivityTrackSnapshot } from './rehabActivityTrackingSnapshotTypes'

/** 資助復康軌：乾跑智能排班但不寫 SCHEDULING_RUN 審計（Seq 21）；時段過濾用 `windowSnapshot`（雲端 P1 合併見 `resolveSchedulingWindowSnapshot`） */
export const buildSubsidizedRehabTrackSnapshot = (
  actorId: string,
  residentsAll: Resident[],
  sessionsAll: SchedulingSession[],
  constraints: SchedulingConstraints,
  windowSnapshot: SystemSettingsSnapshot,
): RehabActivityTrackSnapshot => {
  const mappedBase = mapActiveResidentsToSubsidizedSchedulingResidents(residentsAll)
  const rehabSessions = sessionsAll.filter((s) => s.serviceType === 'Subsidized_Rehab')
  const engineSessions = filterSchedulingSessionsForSubsidizedEngine(rehabSessions, windowSnapshot)
  const residentsIn = cloneResidents(mappedBase)
  const sessionsIn = cloneSessions(engineSessions)
  const result = schedulingService.runSubsidizedRehabScheduling(actorId, residentsIn, sessionsIn, constraints, {
    recordAudit: false,
  })
  const compliantCount = residentsIn.filter(
    (r: SchedulingResident) => r.weeklyCompletedCount >= getWeeklyTargetByFundingType(r.fundingType),
  ).length
  const rows: RehabActivityTrackRow[] = residentsIn.map((r) => {
    const t = getWeeklyTargetByFundingType(r.fundingType)
    return {
      id: r.id,
      name: r.name,
      weeklyTarget: t,
      weeklyCompleted: r.weeklyCompletedCount,
      isCompliant: r.weeklyCompletedCount >= t,
    }
  })
  return {
    trackLabel: '資助復康服務',
    cohortCount: mappedBase.length,
    sessionCount: engineSessions.length,
    compliantCount,
    assignmentCount: result.assignments.length,
    conflictCount: result.conflicts.length,
    rows,
  }
}
