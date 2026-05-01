import {
  createActivitySessionImportRepository,
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
  ): Promise<ActivitySessionImportCommitResult> {
    return repository.commitRows(actorId, rows)
  }
}

export const activitySessionImportService = new ActivitySessionImportService()
