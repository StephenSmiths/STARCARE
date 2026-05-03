import { useEffect, useRef } from 'react'
import { useSystemSettingsExternalVersion } from './useSystemSettingsExternalVersion'

/**
 * 略過首次掛載；之後 `systemSettingsExternalStore` 版本變更時執行 `invalidate`。
 * 用於 StrictMode 下避免與初次 `queueMicrotask(reload)` 重疊之雙載（以版本比對）。
 */
export const useInvalidateOnSystemSettingsExternalChange = (
  invalidate: () => void | Promise<void>,
): void => {
  const version = useSystemSettingsExternalVersion()
  const prev = useRef(-1)

  useEffect(() => {
    const v = version
    if (prev.current < 0) {
      prev.current = v
      return
    }
    if (prev.current === v) return
    prev.current = v
    void invalidate()
  }, [invalidate, version])
}
