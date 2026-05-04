import {
  createActivitySessionImportRepository,
  type ActivitySessionImportCommitOptions,
  type ActivitySessionImportCommitResult,
  type ActivitySessionImportPreviewRow,
  type ActivitySessionImportRow,
  type ActivitySessionImportValidationResult,
} from '../repositories/activitySessionImportRepository'

const repository = createActivitySessionImportRepository()

export class ActivitySessionImportService {
  async validateRows(rows: ActivitySessionImportRow[]): Promise<ActivitySessionImportValidationResult> {
    return repository.validateRows(rows)
  }

  async commitRows(
    actorId: string,
    rows: ActivitySessionImportPreviewRow[],
    options?: ActivitySessionImportCommitOptions,
  ): Promise<ActivitySessionImportCommitResult> {
    return repository.commitRows(actorId, rows, options)
  }
}

export const activitySessionImportService = new ActivitySessionImportService()
