import type { Resident } from '../../residents/types/resident'
import type { AssessmentDueTask } from '../../residents/services/assessmentDueTaskService'
import { assessmentDueTaskRepository } from '../../../repositories/assessmentDueTaskRepository'

export const buildAssessmentDueSoonTasks = async (
  residents: Resident[],
  now: Date,
  leadDays: number = 14,
): Promise<AssessmentDueTask[]> =>
  assessmentDueTaskRepository.listDueWithinLeadDays(residents, { now, leadDays })
