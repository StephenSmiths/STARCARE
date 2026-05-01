import type { ServiceFormRecord } from '../features/serviceForms/types/serviceForm'

const STORAGE_KEY = 'starcare-service-forms-v1'

/** 服務表單持久化（localStorage）；對齊 §5 軟刪除策略於正式版應改 DB `is_deleted` */
export const loadServiceForms = (): ServiceFormRecord[] => {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as ServiceFormRecord[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export const saveServiceForms = (rows: ServiceFormRecord[]): void => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rows))
}

export const upsertServiceForm = (form: ServiceFormRecord): ServiceFormRecord[] => {
  const all = loadServiceForms()
  const idx = all.findIndex((item) => item.id === form.id)
  const next = idx >= 0 ? [...all.slice(0, idx), form, ...all.slice(idx + 1)] : [form, ...all]
  saveServiceForms(next)
  return next
}
