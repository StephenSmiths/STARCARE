import type { ServiceFormRecord } from '../types/serviceForm'

export { todayYmd } from '../utils/serviceFormLocalDate'

/** 01 §2：表單狀態簡短標籤（UI） */
export const statusZh = (s: ServiceFormRecord['status']): string => {
  if (s === 'DRAFT') return '草稿'
  if (s === 'SUBMITTED') return '待審'
  if (s === 'APPROVED') return '已核准（鎖定）'
  return '退回重改'
}
