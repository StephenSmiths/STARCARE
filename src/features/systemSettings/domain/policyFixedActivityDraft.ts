import type { PolicyFixedActivityRow, SchedulingPolicyBundle } from '../../../repositories/schedulingPolicyTypes'

/** P2：新增一筆固定活動草稿（預設值僅供 UI；提交前仍須通過本機／Edge 校驗） */
export const createEmptyPolicyFixedActivityRow = (): PolicyFixedActivityRow => ({
  serviceType: 'Subsidized_Rehab',
  timeStart: '10:00',
  timeEnd: '11:00',
  deliveryMode: 'Group',
  activityName: '',
  rolePt: true,
  rolePta: false,
  roleOt: false,
  roleOta: false,
})

/** 自 bundle 帶入系統設定草稿（camelCase 與 Edge 一致） */
export const bundleFixedActivitiesToDraft = (
  rows: SchedulingPolicyBundle['fixedActivities'],
): PolicyFixedActivityRow[] =>
  rows.map((r) => ({
    serviceType: r.serviceType,
    timeStart: r.timeStart.length >= 5 ? r.timeStart.slice(0, 5) : r.timeStart,
    timeEnd: r.timeEnd.length >= 5 ? r.timeEnd.slice(0, 5) : r.timeEnd,
    deliveryMode: r.deliveryMode,
    activityName: r.activityName ?? '',
    rolePt: Boolean(r.rolePt),
    rolePta: Boolean(r.rolePta),
    roleOt: Boolean(r.roleOt),
    roleOta: Boolean(r.roleOta),
  }))

/** 合併提交用：草稿列形狀已與 bundle 一致 */
export const draftFixedActivitiesToBundle = (rows: PolicyFixedActivityRow[]): SchedulingPolicyBundle['fixedActivities'] => [...rows]
