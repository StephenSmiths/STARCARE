import { useCallback, useState } from 'react'
import type { SchedulingViewModel } from '../types/schedule'

/** 排班試算結果、存檔旗標與防連點狀態（與機構資料載入後清空預覽對齊）。 */
export const useSchedulingRunPreviewState = () => {
  const [saveError, setSaveError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [result, setResult] = useState<SchedulingViewModel>({
    assignments: [],
    conflicts: [],
    underTargetResidents: [],
  })
  const [isRunning, setIsRunning] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const clearPreviewState = useCallback(() => {
    setResult({ assignments: [], conflicts: [], underTargetResidents: [] })
    setSaveSuccess(false)
    setSaveError('')
  }, [])

  return {
    saveError,
    setSaveError,
    saveSuccess,
    setSaveSuccess,
    result,
    setResult,
    isRunning,
    setIsRunning,
    isSaving,
    setIsSaving,
    clearPreviewState,
  }
}
