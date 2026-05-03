import type { Resident } from '../types/resident'

/** 院友名單載入失敗時 UI 與 E2E 共用（01 §5／Seq 25，與工作計劃頁固定句同級）。 */
export const RESIDENT_LIST_LOAD_ERROR_MESSAGE = '無法載入院友名單，請稍後重試。' as const

export type ResidentListRefreshOutcome = {
  residents: Resident[]
  errorMessage: string
}

/** 封裝 try/catch，供 `useResidents` 與單元測試共用。 */
export async function runResidentListRefresh(
  listActiveResidents: () => Promise<Resident[]>,
): Promise<ResidentListRefreshOutcome> {
  try {
    const residents = await listActiveResidents()
    return { residents, errorMessage: '' }
  } catch {
    return { residents: [], errorMessage: RESIDENT_LIST_LOAD_ERROR_MESSAGE }
  }
}
