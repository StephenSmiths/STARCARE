import {
  type ResidentImportCommitResult,
  type ResidentImportPreviewRow,
  createResidentImportRepository,
  type ResidentImportRow,
  type ResidentImportValidationResult,
} from '../repositories/residentImportRepository'

const repository = createResidentImportRepository()

export class ResidentImportService {
  async validateRows(rows: ResidentImportRow[]): Promise<ResidentImportValidationResult> {
    return repository.validateRows(rows)
  }

  async commitRows(
    actorId: string,
    rows: ResidentImportPreviewRow[],
  ): Promise<ResidentImportCommitResult> {
    return repository.commitRows(actorId, rows)
  }
}

export const residentImportService = new ResidentImportService()
