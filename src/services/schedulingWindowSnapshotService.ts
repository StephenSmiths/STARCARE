import { p1FieldsFromPolicyBundle } from '../features/systemSettings/domain/p1FieldsFromPolicyBundle'
import { loadSystemSettings } from '../features/systemSettings/repository/systemSettingsRepository'
import type { SystemSettingsSnapshot } from '../features/systemSettings/types'
import { createSchedulingPolicyRepository } from '../repositories/schedulingPolicyRepository'
import { getSupabaseBrowserCredentials } from './supabaseBrowserEnv'

/**
 * PDF 02【16】Seq 29：排班乾跑用之「有效視窗快照」— 本機設定為底，若已連線且存在 **`policyVersion`** 則覆寫 P1（午休／開工準備／數字上限）。
 */
export const resolveSchedulingWindowSnapshot = async (
  facilityId: string,
): Promise<SystemSettingsSnapshot> => {
  const local = loadSystemSettings()
  if (!getSupabaseBrowserCredentials()) return local
  try {
    const bundle = await createSchedulingPolicyRepository().getCurrentBundle(facilityId)
    if (bundle?.policyVersion) {
      return { ...local, ...p1FieldsFromPolicyBundle(bundle) }
    }
  } catch {
    // 網路／Edge 失敗時回落本機，不中斷排班
  }
  return local
}
