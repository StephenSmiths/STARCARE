import type { ServiceFormRecord } from '../types/serviceForm'

/** 本地日期 YYYY-MM-DD（瀏覽器時區） */
export const todayYmd = (): string => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** 01 §2：表單狀態簡短標籤（UI） */
export const statusZh = (s: ServiceFormRecord['status']): string => {
  if (s === 'DRAFT') return '草稿'
  if (s === 'SUBMITTED') return '待審'
  if (s === 'APPROVED') return '已核准（鎖定）'
  return '退回重改'
}
