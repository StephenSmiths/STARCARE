/**
 * 01 §3／Seq 4／§4.1：資助復康排班乾跑資料載入＋引擎呼叫（從 useScheduling 抽出以控行數）；
 * 院友僅 **`mapActiveResidentsToSubsidizedSchedulingResidents`**；時段先 **`resolveSchedulingWindowSnapshot`**（雲端 P1 優先）再以視窗過濾，最後 **`filterToSubsidizedRehabServiceOnly`**。
 */
import { schedulingService } from '../../../services/schedulingService'
import type { SchedulingResident } from '../../../services/schedulingService'
import { schedulingConfigService } from '../../../services/schedulingConfigService'
import { resolveSchedulingWindowSnapshot } from '../../../services/schedulingWindowSnapshotService'
import { residentService } from '../../residents/services/residentService'
import { mapActiveResidentsToSubsidizedSchedulingResidents } from '../utils/mapActiveResidentsToSubsidizedSchedulingResidents'
import { buildEngineConstraintsFromRulesAndUi, cloneResidents, cloneSessions } from '../hooks/schedulingHookHelpers'
import {
  filterSchedulingSessionsForSubsidizedEngine,
  filterToSubsidizedRehabServiceOnly,
} from './schedulingSessionWindowFilterService'
import { calculateSchedulingKpis, type SchedulingKpiRunRecord } from '../../../services/schedulingKpiService'
import type { SchedulingViewModel } from '../types/schedule'

export type SubsidizedRehabRunOutcome =
  | { kind: 'empty' }
  | {
      kind: 'ok'
      nextResidents: SchedulingResident[]
      viewModel: SchedulingViewModel
      kpiRecord: SchedulingKpiRunRecord
    }
  | { kind: 'error' }

export const runSubsidizedRehabSchedulingOrchestration = async (
  actorId: string,
  facilityId: string,
): Promise<SubsidizedRehabRunOutcome> => {
  try {
    const [residentRows, sessionRows, rules, windowSnapshot] = await Promise.all([
      residentService.listActiveResidents(),
      schedulingConfigService.listSchedulingSessions(facilityId),
      schedulingConfigService.getRules(facilityId),
      resolveSchedulingWindowSnapshot(facilityId),
    ])
    const latestResidents = mapActiveResidentsToSubsidizedSchedulingResidents(residentRows)
    if (latestResidents.length === 0) {
      return { kind: 'empty' }
    }
    const nextResidents = cloneResidents(latestResidents)
    const sessionCopy = cloneSessions(
      filterToSubsidizedRehabServiceOnly(
        filterSchedulingSessionsForSubsidizedEngine(sessionRows, windowSnapshot),
      ),
    )
    const output = schedulingService.runSubsidizedRehabScheduling(
      actorId,
      nextResidents,
      sessionCopy,
      buildEngineConstraintsFromRulesAndUi(rules),
    )
    const snapshot = calculateSchedulingKpis(nextResidents, output.assignments, output.conflicts)
    const kpiRecord: SchedulingKpiRunRecord = {
      ranAt: new Date().toISOString(),
      kpis: snapshot,
      residentCount: nextResidents.length,
      assignmentCount: output.assignments.length,
      conflictCount: output.conflicts.length,
      actorId,
    }
    return {
      kind: 'ok',
      nextResidents,
      viewModel: {
        assignments: output.assignments,
        conflicts: output.conflicts,
        underTargetResidents: output.underTargetResidents,
        previewSessions: sessionCopy,
      },
      kpiRecord,
    }
  } catch {
    return { kind: 'error' }
  }
}
