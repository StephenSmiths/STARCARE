import { useCallback, useRef, useState } from 'react'
import { globalAuditTrailService } from '../../../services/auditTrailService'
import { validateSystemSettings } from '../domain/systemSettingsValidation'
import { loadSystemSettings, saveSystemSettings } from '../repository/systemSettingsRepository'
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
    const before = loadSystemSettings()
    saveSystemSettings(draft)
    globalAuditTrailService.record({
      action: 'SYSTEM_SETTINGS_SAVE',
      entityType: 'Scheduling',
      entityId: 'system-settings',
      actorId,
      beforeState: JSON.stringify(before),
      afterState: JSON.stringify(draft),
      detail: '儲存院舍系統設定（本地暫存）（PDF 02【16】Seq 29）',
      occurredAt: new Date().toISOString(),
    })
    setSavedMessage('已儲存（僅本機瀏覽器；後端同步待接）')
    setIsSaving(false)
    lockRef.current = false
  }, [actorId, draft])

  return { draft, setField, validationErrors, savedMessage, save, isSaving }
}
