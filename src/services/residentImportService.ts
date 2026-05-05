import {
  type ResidentImportCommitResult,
  type ResidentImportPreviewRow,
  createResidentImportRepository,
  type ResidentImportRow,
  type ResidentImportValidationResult,
} from '../repositories/residentImportRepository'
import { hydrateAuditTrailAfterLocalRecord } from './auditTrailHydrationService'

const repository = createResidentImportRepository()

export class ResidentImportService {
  async validateRows(rows: ResidentImportRow[]): Promise<ResidentImportValidationResult> {
    return repository.validateRows(rows)
  }

  async commitRows(
    actorId: string,
    rows: ResidentImportPreviewRow[],
  ): Promise<ResidentImportCommitResult> {
    const result = await repository.commitRows(actorId, rows)
    hydrateAuditTrailAfterLocalRecord()
    return result
  }
}

export const residentImportService = new ResidentImportService()
