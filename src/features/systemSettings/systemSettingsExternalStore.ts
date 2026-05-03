import { SYSTEM_SETTINGS_STORAGE_KEY } from './localStorageKeys'

/** 供 `useSyncExternalStore` 訂閱：同分頁由 `saveSystemSettings` bump；他分頁靠 `storage` */
let version = 0
const listeners = new Set<() => void>()
let storageBound = false

const ensureStorageListener = (): void => {
  if (typeof window === 'undefined' || storageBound) return
  storageBound = true
  window.addEventListener('storage', (e: StorageEvent) => {
    if (e.key === SYSTEM_SETTINGS_STORAGE_KEY) bumpSystemSettingsExternalVersion()
  })
}

export const subscribeSystemSettingsExternal = (onStoreChange: () => void): (() => void) => {
  ensureStorageListener()
  listeners.add(onStoreChange)
  return () => {
    listeners.delete(onStoreChange)
  }
}

export const getSystemSettingsExternalVersion = (): number => version

export const bumpSystemSettingsExternalVersion = (): void => {
  version += 1
  for (const fn of listeners) fn()
}
