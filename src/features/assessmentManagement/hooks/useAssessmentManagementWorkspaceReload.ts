import { useCallback, useEffect, useState } from 'react'
import type { Resident } from '../../residents/types/resident'
import type { AssessmentDueTask } from '../../residents/services/assessmentDueTaskService'
import type { AssessmentCompletionRecord } from '../types/assessmentManagement'
import { loadAssessmentManagementWorkspaceBundle } from '../services/assessmentManagementWorkspaceLoad'

/** PDF 02【9】評估管理：院友／完成紀錄／待辦載入 */
export const useAssessmentManagementWorkspaceReload = () => {
  const [residents, setResidents] = useState<Resident[]>([])
  const [completions, setCompletions] = useState<AssessmentCompletionRecord[]>([])
  const [loadError, setLoadError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [dueSoonTasks, setDueSoonTasks] = useState<AssessmentDueTask[]>([])

  const reload = useCallback(async () => {
    setLoadError('')
    setIsLoading(true)
    try {
      const outcome = await loadAssessmentManagementWorkspaceBundle()
      if (!outcome.ok) {
        setLoadError('無法載入院友資料')
        setResidents([])
        setCompletions([])
        setDueSoonTasks([])
      } else {
        setResidents(outcome.data.residents)
        setCompletions(outcome.data.completions)
        setDueSoonTasks(outcome.data.dueSoonTasks)
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    queueMicrotask(() => void reload())
  }, [reload])

  return {
    residents,
    completions,
    dueSoonTasks,
    loadError,
    isLoading,
    reload,
  }
}
