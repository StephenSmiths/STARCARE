import { SYSTEM_SETTINGS_STORAGE_KEY } from '../localStorageKeys'
import type { SystemSettingsSnapshot } from '../types'

export const DEFAULT_SYSTEM_SETTINGS: SystemSettingsSnapshot = {
  schedulingWindowStart: '07:00',
  schedulingWindowEnd: '22:00',
  nonTherapyWindowStart: '12:00',
  nonTherapyWindowEnd: '14:00',
  rulesEngineEnabled: true,
  fixedActivitiesEnabled: true,
  serviceTypesEnabled: true,
  specialCareTherapistOnly: false,
}

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v)

export const parseStoredSnapshot = (raw: string | null): SystemSettingsSnapshot | null => {
  if (!raw) return null
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!isRecord(parsed)) return null
    const g = (k: string): unknown => parsed[k]
    const schedulingWindowStart = g('schedulingWindowStart')
    const schedulingWindowEnd = g('schedulingWindowEnd')
    const nonTherapyWindowStart = g('nonTherapyWindowStart')
    const nonTherapyWindowEnd = g('nonTherapyWindowEnd')
    const rulesEngineEnabled = g('rulesEngineEnabled')
    const fixedActivitiesEnabled = g('fixedActivitiesEnabled')
    const serviceTypesEnabled = g('serviceTypesEnabled')
    const specialCareTherapistOnly = g('specialCareTherapistOnly')
    if (
      typeof schedulingWindowStart !== 'string' ||
      typeof schedulingWindowEnd !== 'string' ||
      typeof nonTherapyWindowStart !== 'string' ||
      typeof nonTherapyWindowEnd !== 'string' ||
      typeof rulesEngineEnabled !== 'boolean' ||
      typeof fixedActivitiesEnabled !== 'boolean' ||
      typeof serviceTypesEnabled !== 'boolean' ||
      typeof specialCareTherapistOnly !== 'boolean'
    ) {
      return null
    }
    return {
      schedulingWindowStart,
      schedulingWindowEnd,
      nonTherapyWindowStart,
      nonTherapyWindowEnd,
      rulesEngineEnabled,
      fixedActivitiesEnabled,
      serviceTypesEnabled,
      specialCareTherapistOnly,
    }
  } catch {
    return null
  }
}

export const loadSystemSettings = (): SystemSettingsSnapshot => {
  if (typeof window === 'undefined') return { ...DEFAULT_SYSTEM_SETTINGS }
  const parsed = parseStoredSnapshot(window.localStorage.getItem(SYSTEM_SETTINGS_STORAGE_KEY))
  return parsed ? { ...DEFAULT_SYSTEM_SETTINGS, ...parsed } : { ...DEFAULT_SYSTEM_SETTINGS }
}

export const saveSystemSettings = (snapshot: SystemSettingsSnapshot): void => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(SYSTEM_SETTINGS_STORAGE_KEY, JSON.stringify(snapshot))
}
