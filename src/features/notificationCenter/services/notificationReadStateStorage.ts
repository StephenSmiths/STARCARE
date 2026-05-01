const STORAGE_KEY = 'starcare-notification-read-v1'

export const loadReadNotificationIds = (): string[] => {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as string[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export const saveReadNotificationIds = (ids: string[]): void => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
}
