import {
  createActivitySessionImportRepository,
  type ActivitySessionImportCommitOptions,
  type ActivitySessionImportCommitResult,
  type ActivitySessionImportPreviewRow,
  type ActivitySessionImportRow,
  type ActivitySessionImportValidationResult,
} from '../repositories/activitySessionImportRepository'
import { hydrateAuditTrailAfterLocalRecord } from './auditTrailHydrationService'

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
    const result = await repository.commitRows(actorId, rows, options)
    hydrateAuditTrailAfterLocalRecord()
    return result
  }
}

export const activitySessionImportService = new ActivitySessionImportService()
