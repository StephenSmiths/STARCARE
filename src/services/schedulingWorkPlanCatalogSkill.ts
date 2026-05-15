/**
 * PDF 02【3】／`docs/business-logic-pdf02-scheduling-clarification-2026-05-09.md` §7：
 * 智能排班活動內容以職位＋`workPlanCascadeCatalog` 為準；`skillMatched` 得於「目錄涵蓋」時為真，不依賴 `staff_skills` 逐筆映射。
 */
import type { Activity } from '../repositories/activityRepository'
import { allowedActivityTypesByRole, getContentOptions } from '../features/workPlans/constants/workPlanCascadeCatalog'
import type { WorkPlanActivityType } from '../features/workPlans/services/workPlanDraftService'
import type { StaffProfileRoleType } from './schedulingService'

export const mapActivityToWorkPlanActivityType = (activity: Activity): WorkPlanActivityType => {
  if (activity.activityKind === 'Assessment') return 'Assessment'
  if (activity.activityKind === 'Other') return 'Other'
  return activity.deliveryMode === 'Group' ? 'Group' : 'Individual'
}

const nameMatchesCatalogOption = (activityName: string, optionValue: string): boolean => {
  if (activityName === optionValue) return true
  if (optionValue.length >= 2 && activityName.includes(optionValue)) return true
  if (activityName.length >= 2 && optionValue.includes(activityName)) return true
  return false
}

/** 活動主檔名稱是否落在該職位於目錄中、對應活動類型之選項（含細項）。 */
export const isActivityPermittedByWorkPlanCatalogForStaffRole = (
  activity: Activity,
  role: StaffProfileRoleType | undefined,
): boolean => {
  if (role === undefined || role === 'TeamLead') return false
  const wt = mapActivityToWorkPlanActivityType(activity)
  if (!allowedActivityTypesByRole[role].includes(wt)) return false
  for (const o of getContentOptions(role, wt)) {
    if (nameMatchesCatalogOption(activity.name, o.value)) return true
    if (o.details?.some((d) => nameMatchesCatalogOption(activity.name, d))) return true
  }
  return false
}
