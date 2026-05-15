/**
 * PDF 02【3】／`business-logic-pdf02-scheduling-clarification-2026-05-09.md` §7.2：
 * 週更表匯入時，活動 id 自活動主檔中擇定（職位＋服務類型＋`workPlanCascadeCatalog` 允許之 **Group／Individual** 訓練列；以雜湊擇一以利分佈與測試穩定）。
 */
import type { Activity } from '../../../repositories/activityRepository'
import { isActivityPermittedByWorkPlanCatalogForStaffRole } from '../../../services/schedulingWorkPlanCatalogSkill'
import type { StaffProfileRoleType } from '../../../services/schedulingService'
import { WEEKLY_ROSTER_SERVICE_TYPE_TO_ACTIVITY_ID } from '../constants/weeklyRosterImportConstants'

const SERVICE_LABEL_TO_TYPE: Record<string, 'Subsidized_Rehab' | 'Dementia_Care'> = {
  資助復康服務: 'Subsidized_Rehab',
  認知障礙症服務: 'Dementia_Care',
}

const rosterRoles = new Set<string>(['PT', 'PTA', 'OT', 'OTA'])

/** 與 `weeklyRosterDraftsToImportRows` 擇 id 相同之雜湊（單元測試可對齊預期）。 */
export const weeklyRosterActivityPickHash = (key: string, modulo: number): number => {
  if (modulo <= 0) return 0
  let h = 2166136261 >>> 0
  for (let i = 0; i < key.length; i += 1) {
    h = Math.imul(h ^ key.charCodeAt(i), 16777619) >>> 0
  }
  return h % modulo
}

export const pickWeeklyRosterActivityId = (
  serviceLabel: string,
  role: string,
  staffProfileId: string,
  sessionDate: string,
  rowIndex: number,
  activities: readonly Activity[],
): string => {
  const fallback = WEEKLY_ROSTER_SERVICE_TYPE_TO_ACTIVITY_ID[serviceLabel] ?? ''
  const st = SERVICE_LABEL_TO_TYPE[serviceLabel]
  if (!st || !rosterRoles.has(role)) return fallback
  const roleTyped = role as StaffProfileRoleType
  const candidates = activities
    .filter(
      (a) =>
        a.serviceType === st &&
        a.activityKind === 'Training' &&
        (a.deliveryMode === 'Group' || a.deliveryMode === 'Individual') &&
        isActivityPermittedByWorkPlanCatalogForStaffRole(a, roleTyped),
    )
    .sort((a, b) => a.id.localeCompare(b.id))
  if (candidates.length === 0) return fallback
  const key = `${staffProfileId}|${sessionDate}|${rowIndex}`
  const idx = weeklyRosterActivityPickHash(key, candidates.length)
  return candidates[idx]!.id
}
