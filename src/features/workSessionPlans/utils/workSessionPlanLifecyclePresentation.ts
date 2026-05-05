import type { WorkSessionLifecycleStatus, WorkSessionPlanRow } from '../services/workSessionPlanService'

/** 活動時段生命週期狀態顯示文案（PDF 02【4】／Seq 16） */
export function workSessionLifecycleStatusLabel(s: WorkSessionLifecycleStatus): string {
  if (s === 'PENDING') return '待接收'
  if (s === 'ACCEPTED') return '已接收'
  if (s === 'REJECTED') return '已拒絕'
  return '已完成'
}

/** 服務類型簡述（我的工作計劃列表） */
export function workSessionPlanRowServiceLabel(row: WorkSessionPlanRow): string {
  return row.serviceType === 'Dementia_Service' ? '認知軌' : '資助復康'
}
