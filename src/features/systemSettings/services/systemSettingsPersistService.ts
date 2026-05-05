import { recordAuditTrailThenHydrate } from '../../../services/auditTrailHydrationService'
import { loadSystemSettings, saveSystemSettings } from '../repository/systemSettingsRepository'
import type { SystemSettingsSnapshot } from '../types'

/** PDF 02【16】Seq 29：校驗通過後落本機、寫審計並合併遠端列 */
export const saveSystemSettingsWithAudit = (actorId: string, draft: SystemSettingsSnapshot): void => {
  const before = loadSystemSettings()
  saveSystemSettings(draft)
  recordAuditTrailThenHydrate({
    action: 'SYSTEM_SETTINGS_SAVE',
    entityType: 'Scheduling',
    entityId: 'system-settings',
    actorId,
    beforeState: JSON.stringify(before),
    afterState: JSON.stringify(draft),
    detail: '儲存院舍系統設定（本地暫存）（PDF 02【16】Seq 29）',
    occurredAt: new Date().toISOString(),
  })
}
