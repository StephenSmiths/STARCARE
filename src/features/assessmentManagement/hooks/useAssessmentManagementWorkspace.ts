import { useAuthActorId } from '../../auth'
import type { Resident } from '../../residents/types/resident'
import type { AssessmentDueTask } from '../../residents/services/assessmentDueTaskService'
import type { AssessmentCompletionRecord } from '../types/assessmentManagement'
import type { AssessmentOverdueRow } from '../services/assessmentManagementDomainService'
import {
  buildAssessmentOverdueRows,
  computeAssessmentCompletionRatePercent,
} from '../services/assessmentManagementDomainService'
import { useAssessmentManagementWorkspaceCompletionSubmit } from './useAssessmentManagementWorkspaceCompletionSubmit'
import { useAssessmentManagementWorkspaceReload } from './useAssessmentManagementWorkspaceReload'

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
  const {
    residents,
    completions,
    dueSoonTasks,
    loadError,
    isLoading,
    reload,
  } = useAssessmentManagementWorkspaceReload()

  const { submitError, isSubmitting, submitCompletion } =
    useAssessmentManagementWorkspaceCompletionSubmit(actorId, residents)

  const now = new Date()
  const overdueRows = buildAssessmentOverdueRows(residents, completions, now)
  const completionRatePercent = computeAssessmentCompletionRatePercent(residents, completions, now)

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
