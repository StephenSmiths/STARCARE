import { useCallback, useRef, useState } from 'react'
/** 勿自 `../index` barrel 匯入：index 匯出之 `SystemSettingsHome` 依賴本 hook，會循環依賴 */
import { validateSystemSettings } from '../domain/systemSettingsValidation'
import { p1FieldsFromPolicyBundle } from '../domain/p1FieldsFromPolicyBundle'
import { loadSystemSettings } from '../repository/systemSettingsRepository'
import { saveSystemSettingsWithAudit } from '../services/systemSettingsPersistService'
import type { SchedulingPolicyBundle } from '../../../repositories/schedulingPolicyTypes'
import type { SystemSettingsSnapshot } from '../types'

export interface UseSystemSettingsResult {
  draft: SystemSettingsSnapshot
  setField: <K extends keyof SystemSettingsSnapshot>(key: K, value: SystemSettingsSnapshot[K]) => void
  /** 自 `scheduling-policy-current-get` 合併 P1 欄位至草稿 */
  hydrateP1FromBundle: (bundle: SchedulingPolicyBundle) => void
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

  const hydrateP1FromBundle = useCallback((bundle: SchedulingPolicyBundle) => {
    setDraft((prev) => ({ ...prev, ...p1FieldsFromPolicyBundle(bundle) }))
    setSavedMessage(null)
  }, [])

  const save = useCallback(() => {
    if (lockRef.current) return
    const v = validateSystemSettings(draft)
    setValidationErrors(v.errors)
    if (!v.ok) return
    lockRef.current = true
    setIsSaving(true)
    /** 延至次一 macrotask：避免與 **`setIsSaving(false)`** 併入同一 React 批次，致 **`isSaving`**／**`aria-busy`** 無法被輔助技術感知（PDF 02【16】Seq 29 本機儲存閉環）。 */
    globalThis.setTimeout(() => {
      saveSystemSettingsWithAudit(actorId, draft)
      setSavedMessage('已儲存（本機瀏覽器；若已連線可另於下方「提交政策版本」同步雲端）')
      setIsSaving(false)
      lockRef.current = false
    }, 0)
  }, [actorId, draft])

  return { draft, setField, hydrateP1FromBundle, validationErrors, savedMessage, save, isSaving }
}
