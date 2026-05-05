import { useCallback, useRef, useState } from 'react'
/** 勿自 `../index` barrel 匯入：index 匯出之 `SystemSettingsHome` 依賴本 hook，會循環依賴 */
import { validateSystemSettings } from '../domain/systemSettingsValidation'
import { loadSystemSettings } from '../repository/systemSettingsRepository'
import { saveSystemSettingsWithAudit } from '../services/systemSettingsPersistService'
import type { SystemSettingsSnapshot } from '../types'

export interface UseSystemSettingsResult {
  draft: SystemSettingsSnapshot
  setField: <K extends keyof SystemSettingsSnapshot>(key: K, value: SystemSettingsSnapshot[K]) => void
  validationErrors: string[]
  savedMessage: string | null
  save: () => void
  isSaving: boolean
}

export const useSystemSettings = (actorId: string): UseSystemSettingsResult => {
  const lockRef = useRef(false)
  const [draft, setDraft] = useState<SystemSettingsSnapshot>(() => loadSystemSettings())
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [savedMessage, setSavedMessage] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const setField = useCallback(<K extends keyof SystemSettingsSnapshot>(
    key: K,
    value: SystemSettingsSnapshot[K],
  ) => {
    setDraft((prev) => ({ ...prev, [key]: value }))
    setSavedMessage(null)
  }, [])

  const save = useCallback(() => {
    if (lockRef.current) return
    const v = validateSystemSettings(draft)
    setValidationErrors(v.errors)
    if (!v.ok) return
    lockRef.current = true
    setIsSaving(true)
    saveSystemSettingsWithAudit(actorId, draft)
    setSavedMessage('已儲存（僅本機瀏覽器；後端同步待接）')
    setIsSaving(false)
    lockRef.current = false
  }, [actorId, draft])

  return { draft, setField, validationErrors, savedMessage, save, isSaving }
}
