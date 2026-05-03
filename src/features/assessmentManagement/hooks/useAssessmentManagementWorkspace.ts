import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuthActorId } from '../../auth'
import { residentService } from '../../residents/services/residentService'
import type { Resident } from '../../residents/types/resident'
import type { AssessmentDueTask } from '../../residents/services/assessmentDueTaskService'
import { globalAuditTrailService } from '../../../services/auditTrailService'
import {
  loadAssessmentCompletions,
  saveAssessmentCompletions,
} from '../../../services/assessmentCompletionStorage'
import { assessmentCompletionRecordRepository } from '../../../repositories/assessmentCompletionRecordRepository'
import type { AssessmentCompletionRecord } from '../types/assessmentManagement'
import type { AssessmentOverdueRow } from '../services/assessmentManagementDomainService'
import {
  appendAssessmentCompletionsForCurrentAnchor,
  buildAssessmentDueSoonTasks,
  buildAssessmentOverdueRows,
  computeAssessmentCompletionRatePercent,
} from '../services/assessmentManagementDomainService'
import { mergeAssessmentCompletionRecordsRemotePrimary } from '../services/mergeAssessmentCompletionRecords'

export type AssessmentManagementWorkspaceState = {
  residents: Resident[]
  completions: AssessmentCompletionRecord[]
  overdueRows: AssessmentOverdueRow[]
  dueSoonTasks: AssessmentDueTask[]
  completionRatePercent: number
  loadError: string
  isLoading: boolean
  submitError: string
  isSubmitting: boolean
  reload: () => Promise<void>
  submitCompletion: (residentId: string, ptVersion: string, otVersion: string) => Promise<void>
}

/** PDF 02【9】評估管理：載入院友、本地完成紀錄與衍生指標 */
export const useAssessmentManagementWorkspace = (): AssessmentManagementWorkspaceState => {
  const actorId = useAuthActorId()
  const [residents, setResidents] = useState<Resident[]>([])
  const [completions, setCompletions] = useState<AssessmentCompletionRecord[]>([])
  const [loadError, setLoadError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dueSoonTasks, setDueSoonTasks] = useState<AssessmentDueTask[]>([])
  const submittingLock = useRef(false)

  const reload = useCallback(async () => {
    setLoadError('')
    setIsLoading(true)
    try {
      const rows = await residentService.listActiveResidents()
      setResidents(rows)
      const local = loadAssessmentCompletions()
      try {
        const remote = await assessmentCompletionRecordRepository.listActive()
        setCompletions(mergeAssessmentCompletionRecordsRemotePrimary(remote, local))
      } catch {
        setCompletions(local)
      }
      setDueSoonTasks(await buildAssessmentDueSoonTasks(rows, new Date()))
    } catch {
      setLoadError('無法載入院友資料')
      setResidents([])
      setCompletions([])
      setDueSoonTasks([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    queueMicrotask(() => void reload())
  }, [reload])

  const now = new Date()
  const overdueRows = buildAssessmentOverdueRows(residents, completions, now)
  const completionRatePercent = computeAssessmentCompletionRatePercent(residents, completions, now)

  const submitCompletion = useCallback(
    async (residentId: string, ptVersion: string, otVersion: string) => {
      if (submittingLock.current) return
      submittingLock.current = true
      setSubmitError('')
      setIsSubmitting(true)
      try {
        const resident = residents.find((row) => row.id === residentId)
        if (!resident) throw new Error('找不到院友')
        const existing = loadAssessmentCompletions()
        const next = appendAssessmentCompletionsForCurrentAnchor(
          actorId,
          resident,
          ptVersion,
          otVersion,
          existing,
        )
        const addedLen = next.length - existing.length
        const added = next.slice(0, addedLen)
        saveAssessmentCompletions(next)
        try {
          await assessmentCompletionRecordRepository.append(added)
        } catch (e) {
          const msg = e instanceof Error ? e.message : '雲端同步失敗'
          setSubmitError(`已寫入本機；${msg}`)
        }
        globalAuditTrailService.record({
          action: 'ASSESSMENT_COMPLETION_RECORD',
          entityType: 'Resident',
          entityId: resident.id,
          actorId,
          beforeState: null,
          afterState: JSON.stringify(
            added.map((row) => ({
              discipline: row.discipline,
              versionLabel: row.versionLabel,
              cycleAnchorDate: row.cycleAnchorDate,
            })),
          ),
          detail: `評估完成紀錄：${resident.name}（${added.map((r) => `${r.discipline} ${r.versionLabel}`).join('、')}）`,
          occurredAt: new Date().toISOString(),
        })
      } catch (e) {
        const msg = e instanceof Error ? e.message : '儲存失敗'
        setSubmitError(msg)
      } finally {
        submittingLock.current = false
        setIsSubmitting(false)
      }
    },
    [actorId, residents],
  )

  return {
    residents,
    completions,
    overdueRows,
    dueSoonTasks,
    completionRatePercent,
    loadError,
    isLoading,
    submitError,
    isSubmitting,
    reload,
    submitCompletion,
  }
}
