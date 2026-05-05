import { assessmentCompletionRecordRepository } from '../../../repositories/assessmentCompletionRecordRepository'
import { loadAssessmentCompletions } from '../../../services/assessmentCompletionStorage'
import type { AssessmentDueTask } from '../../residents/services/assessmentDueTaskService'
import { residentService } from '../../residents/services/residentService'
import type { Resident } from '../../residents/types/resident'
import type { AssessmentCompletionRecord } from '../types/assessmentManagement'
import { buildAssessmentDueSoonTasks } from './assessmentManagementDomainService'
import { mergeAssessmentCompletionRecordsRemotePrimary } from './mergeAssessmentCompletionRecords'

export type AssessmentManagementWorkspaceLoadOk = {
  residents: Resident[]
  completions: AssessmentCompletionRecord[]
  dueSoonTasks: AssessmentDueTask[]
}

/**
 * 載入院友、合併本機／遠端評估完成紀錄與待辦（PDF 02【9】）。
 */
export const loadAssessmentManagementWorkspaceBundle = async (): Promise<
  | { ok: true; data: AssessmentManagementWorkspaceLoadOk }
  | { ok: false }
> => {
  try {
    const rows = await residentService.listActiveResidents()
    const local = loadAssessmentCompletions()
    let completions: AssessmentCompletionRecord[]
    try {
      const remote = await assessmentCompletionRecordRepository.listActive()
      completions = mergeAssessmentCompletionRecordsRemotePrimary(remote, local)
    } catch {
      completions = local
    }
    const dueSoonTasks = await buildAssessmentDueSoonTasks(rows, new Date())
    return { ok: true, data: { residents: rows, completions, dueSoonTasks } }
  } catch {
    return { ok: false }
  }
}
