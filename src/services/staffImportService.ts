import {
  createStaffImportRepository,
  type StaffImportCommitResult,
  type StaffImportPreviewRow,
  type StaffImportRow,
  type StaffImportValidationResult,
} from '../repositories/staffImportRepository'

const repository = createStaffImportRepository()

export class StaffImportService {
  async validateRows(rows: StaffImportRow[]): Promise<StaffImportValidationResult> {
    return repository.validateRows(rows)
  }

  async commitRows(actorId: string, rows: StaffImportPreviewRow[]): Promise<StaffImportCommitResult> {
    return repository.commitRows(actorId, rows)
  }
}

export const staffImportService = new StaffImportService()
