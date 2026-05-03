import type { Resident } from '../../residents/types/resident'
import type { SchedulingResident, SchedulingSession } from '../../../services/schedulingService'
import { mapActiveResidentsToSubsidizedSchedulingResidents } from '../utils/mapActiveResidentsToSubsidizedSchedulingResidents'
import { SCHEDULING_DATA_LOAD_ERROR_MESSAGE } from './schedulingDataLoadMessage'

/** 供 `useScheduling.reloadSchedulingData` 與單元測試注入（Seq 15）。 */
export type SchedulingReloadPageDataDeps = {
  listActiveResidents: () => Promise<Resident[]>
  listSchedulingSessions: (facilityId: string) => Promise<SchedulingSession[]>
  prefetchRules: (facilityId: string) => void | Promise<unknown>
}

export type SchedulingReloadPageDataSuccess = {
  ok: true
  schedulingResidents: SchedulingResident[]
  sessionCount: number
}

export type SchedulingReloadPageDataFailure = {
  ok: false
  loadError: typeof SCHEDULING_DATA_LOAD_ERROR_MESSAGE
}

export type SchedulingReloadPageDataOutcome = SchedulingReloadPageDataSuccess | SchedulingReloadPageDataFailure

/** PDF 02【3】／01 §4.1：並載院友與活動時段；院友僅納入資助復康合規族群；失敗句見 `schedulingDataLoadMessage`。 */
export async function runSchedulingReloadPageData(
  facilityId: string,
  deps: SchedulingReloadPageDataDeps,
): Promise<SchedulingReloadPageDataOutcome> {
  try {
    const [residentRows, sessionRows] = await Promise.all([
      deps.listActiveResidents(),
      deps.listSchedulingSessions(facilityId),
    ])
    void deps.prefetchRules(facilityId)
    const schedulingResidents = mapActiveResidentsToSubsidizedSchedulingResidents(residentRows)
    return { ok: true, schedulingResidents, sessionCount: sessionRows.length }
  } catch {
    return { ok: false, loadError: SCHEDULING_DATA_LOAD_ERROR_MESSAGE }
  }
}
