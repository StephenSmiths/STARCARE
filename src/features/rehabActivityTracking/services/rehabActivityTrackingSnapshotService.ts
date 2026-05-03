import type { Resident } from '../../residents/types/resident'
import { isDementiaCareCohort } from '../../residents/utils/residentCareTrackCohort'
import type { SchedulingConstraints } from '../../../services/schedulingService'
import {
  schedulingService,
  type SchedulingResident,
  type SchedulingSession,
} from '../../../services/schedulingService'
import { getWeeklyTargetByFundingType } from '../../../services/schedulingTargets'
import { mapActiveResidentsToSubsidizedSchedulingResidents } from '../../scheduling/utils/mapActiveResidentsToSubsidizedSchedulingResidents'
import { cloneResidents, cloneSessions } from '../../scheduling/hooks/schedulingHookHelpers'
import {
  filterSchedulingSessionsForSubsidizedEngine,
  filterToDementiaServiceOnly,
} from '../../scheduling/services/schedulingSessionWindowFilterService'
import { DEMENTIA_WEEKLY_TARGET, runDementiaTrackDryRun } from './dementiaTrackDryRunService'

/** PDF 02【8】完成列表列（單一軌道） */
export type RehabActivityTrackRow = {
  id: string
  name: string
  weeklyTarget: number
  weeklyCompleted: number
  isCompliant: boolean
  /** 認知軌道：嚴重度標示 */
  dementiaLevel?: Resident['dementiaLevel']
}

export type RehabActivityTrackSnapshot = {
  trackLabel: string
  cohortCount: number
  sessionCount: number
  compliantCount: number
  assignmentCount: number
  conflictCount: number
  rows: RehabActivityTrackRow[]
}

const dementiaSeverityRank = (level: Resident['dementiaLevel']): number => {
  if (level === 'Severe') return 0
  if (level === 'Moderate') return 1
  if (level === 'Mild') return 2
  return 99
}

/** 將院友轉為認知乾跑用 SchedulingResident（資助類別不參與該軌目標計算） */
export const mapResidentToDementiaSchedulingResident = (r: Resident): SchedulingResident => ({
  id: r.id,
  name: r.name,
  fundingType: 'Private',
  isSpecialCareCase: r.isSpecialCareCase,
  weeklyCompletedCount: 0,
  assignedDates: [],
})

/** 資助復康軌：乾跑智能排班但不寫 SCHEDULING_RUN 審計（Seq 21） */
export const buildSubsidizedRehabTrackSnapshot = (
  actorId: string,
  residentsAll: Resident[],
  sessionsAll: SchedulingSession[],
  constraints: SchedulingConstraints,
): RehabActivityTrackSnapshot => {
  const mappedBase = mapActiveResidentsToSubsidizedSchedulingResidents(residentsAll)
  const rehabSessions = sessionsAll.filter((s) => s.serviceType === 'Subsidized_Rehab')
  const engineSessions = filterSchedulingSessionsForSubsidizedEngine(rehabSessions)
  const residentsIn = cloneResidents(mappedBase)
  const sessionsIn = cloneSessions(engineSessions)
  const result = schedulingService.runSubsidizedRehabScheduling(actorId, residentsIn, sessionsIn, constraints, {
    recordAudit: false,
  })
  const compliantCount = residentsIn.filter(
    (r) => r.weeklyCompletedCount >= getWeeklyTargetByFundingType(r.fundingType),
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

/** 認知障礙症軌：獨立乾跑（01 §3.3／§4 與復康軌統計分離） */
export const buildDementiaServiceTrackSnapshot = (
  residentsAll: Resident[],
  sessionsAll: SchedulingSession[],
  constraints: SchedulingConstraints,
): RehabActivityTrackSnapshot => {
  const cohort = [...residentsAll.filter(isDementiaCareCohort)].sort(
    (a, b) => dementiaSeverityRank(a.dementiaLevel) - dementiaSeverityRank(b.dementiaLevel),
  )
  const dementiaEngineSessions = filterToDementiaServiceOnly(
    filterSchedulingSessionsForSubsidizedEngine(sessionsAll),
  )
  const mapped = cohort.map(mapResidentToDementiaSchedulingResident)
  const { assignments, conflicts, residentsOut } = runDementiaTrackDryRun(
    mapped,
    dementiaEngineSessions,
    constraints,
  )
  const levelById = new Map(cohort.map((c) => [c.id, c.dementiaLevel]))
  const compliantCount = residentsOut.filter((r) => r.weeklyCompletedCount >= DEMENTIA_WEEKLY_TARGET).length
  const rows: RehabActivityTrackRow[] = residentsOut.map((r) => ({
    id: r.id,
    name: r.name,
    weeklyTarget: DEMENTIA_WEEKLY_TARGET,
    weeklyCompleted: r.weeklyCompletedCount,
    isCompliant: r.weeklyCompletedCount >= DEMENTIA_WEEKLY_TARGET,
    dementiaLevel: levelById.get(r.id),
  }))
  return {
    trackLabel: '認知障礙症服務',
    cohortCount: cohort.length,
    sessionCount: dementiaEngineSessions.length,
    compliantCount,
    assignmentCount: assignments.length,
    conflictCount: conflicts.length,
    rows,
  }
}
