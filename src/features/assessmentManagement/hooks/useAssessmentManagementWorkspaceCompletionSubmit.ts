import { useCallback, useRef, useState } from 'react'
import {
  loadAssessmentCompletions,
  saveAssessmentCompletions,
} from '../../../services/assessmentCompletionStorage'
import { assessmentCompletionRecordRepository } from '../../../repositories/assessmentCompletionRecordRepository'
import type { Resident } from '../../residents/types/resident'
import { appendAssessmentCompletionsForCurrentAnchor } from '../services/assessmentManagementDomainService'
import { recordAssessmentCompletionAudit } from '../services/assessmentCompletionAuditService'
import { isSupabaseBrowserConfigured } from '../../../services/supabaseBrowserEnv'

/** Edge `assessment-completion-records-append` 已成功時已落庫審計，避免重複 append */
const skipRemoteAssessmentAuditPersist = (remoteAppendSucceeded: boolean): boolean =>
  remoteAppendSucceeded && isSupabaseBrowserConfigured()

/** PDF 02【9】補登評估完成紀錄（防重覆提交／本機與雲端） */
export const useAssessmentManagementWorkspaceCompletionSubmit = (
  actorId: string,
  residents: Resident[],
) => {
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const submittingLock = useRef(false)

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
        let remoteAppendSucceeded = false
        try {
          await assessmentCompletionRecordRepository.append(added)
          remoteAppendSucceeded = true
        } catch (e) {
          const msg = e instanceof Error ? e.message : '雲端同步失敗'
          setSubmitError(`已寫入本機；${msg}`)
        }
        recordAssessmentCompletionAudit(
          actorId,
          resident,
          added,
          skipRemoteAssessmentAuditPersist(remoteAppendSucceeded),
        )
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

  return { submitError, isSubmitting, submitCompletion }
}
