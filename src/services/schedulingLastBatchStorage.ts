/** 01 §5／Seq 10：記住最近一次成功寫入之 scheduling_history batch_id（sessionStorage，僅本機分頁） */
const KEY = 'starcare-scheduling-last-batch-id'

export const writeLastSchedulingBatchId = (batchId: string): void => {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(KEY, batchId)
  } catch {
    /* 私密模式等 */
  }
}

export const readLastSchedulingBatchId = (): string | null => {
  if (typeof window === 'undefined') return null
  try {
    return sessionStorage.getItem(KEY)
  } catch {
    return null
  }
}

export const clearLastSchedulingBatchId = (): void => {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
}
