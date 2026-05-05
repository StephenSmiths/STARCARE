import {
  createStaffImportRepository,
  type StaffImportCommitResult,
  type StaffImportPreviewRow,
  type StaffImportRow,
  type StaffImportValidationResult,
} from '../repositories/staffImportRepository'
import { hydrateAuditTrailAfterLocalRecord } from './auditTrailHydrationService'

const repository = createStaffImportRepository()

export class StaffImportService {
  async validateRows(rows: StaffImportRow[]): Promise<StaffImportValidationResult> {
    return repository.validateRows(rows)
  }

  async commitRows(actorId: string, rows: StaffImportPreviewRow[]): Promise<StaffImportCommitResult> {
    const result = await repository.commitRows(actorId, rows)
    hydrateAuditTrailAfterLocalRecord()
    return result
  }
}

export const staffImportService = new StaffImportService()
