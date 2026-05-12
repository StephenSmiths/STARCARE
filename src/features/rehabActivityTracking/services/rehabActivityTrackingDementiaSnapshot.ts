import type { Resident } from '../../residents/types/resident'
import { isDementiaCareCohort } from '../../residents/utils/residentCareTrackCohort'
import type {
  SchedulingConstraints,
  SchedulingResident,
  SchedulingSession,
} from '../../../services/schedulingService'
import {
  filterSchedulingSessionsForSubsidizedEngine,
  filterToDementiaServiceOnly,
} from '../../scheduling/services/schedulingSessionWindowFilterService'
import type { SystemSettingsSnapshot } from '../../systemSettings/types'
import { DEMENTIA_WEEKLY_TARGET, runDementiaTrackDryRun } from './dementiaTrackDryRunService'
import type { RehabActivityTrackRow, RehabActivityTrackSnapshot } from './rehabActivityTrackingSnapshotTypes'

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

/** 認知障礙症軌：獨立乾跑（01 §3.3／§4 與復康軌統計分離）；時段過濾用 `windowSnapshot`（與資助軌一致） */
export const buildDementiaServiceTrackSnapshot = (
  residentsAll: Resident[],
  sessionsAll: SchedulingSession[],
  constraints: SchedulingConstraints,
  windowSnapshot: SystemSettingsSnapshot,
): RehabActivityTrackSnapshot => {
  const cohort = [...residentsAll.filter(isDementiaCareCohort)].sort(
    (a, b) => dementiaSeverityRank(a.dementiaLevel) - dementiaSeverityRank(b.dementiaLevel),
  )
  const dementiaEngineSessions = filterToDementiaServiceOnly(
    filterSchedulingSessionsForSubsidizedEngine(sessionsAll, windowSnapshot),
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
