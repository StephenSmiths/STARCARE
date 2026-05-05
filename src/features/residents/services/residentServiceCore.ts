import type { ResidentRepository } from '../repositories/residentRepository'
import type { Resident, ResidentInput } from '../types/resident'
import {
  recordResidentCreateAudit,
  recordResidentSoftDeleteAudit,
  recordResidentUpdateAudit,
} from './residentServiceAuditTrail'
import {
  normalizeResidentAssessmentAnchor,
  normalizeResidentInput,
  residentToInput,
  validateResidentInput,
} from './residentServiceDomain'

export class ResidentService {
  private readonly repository: ResidentRepository
  private readonly inFlightKeys = new Set<string>()
  /** Supabase 模式下院友寫入已由 Edge 落庫 `audit_events`，僅更新記憶體軌跡避免重覆 append */
  private readonly skipRemoteAuditPersist: boolean

  constructor(repository: ResidentRepository, skipRemoteAuditPersist = false) {
    this.repository = repository
    this.skipRemoteAuditPersist = skipRemoteAuditPersist
  }

  async listActiveResidents(): Promise<Resident[]> {
    const residents = await this.repository.listResidents()
    return residents.filter((resident) => !resident.isDeleted)
  }

  async createResident(actorId: string, input: ResidentInput): Promise<void> {
    return this.runWithSubmitLock(`create:${actorId}:${input.bedNumber}`, async () => {
      const clean = normalizeResidentInput(input)
      validateResidentInput(clean)
      const resident: Resident = {
        id: `resident-${crypto.randomUUID()}`,
        ...clean,
        isDeleted: false,
      }
      await this.repository.createResident(resident)
      recordResidentCreateAudit(actorId, resident, this.skipRemoteAuditPersist)
    })
  }

  async updateResident(actorId: string, id: string, input: ResidentInput): Promise<void> {
    return this.runWithSubmitLock(`update:${actorId}:${id}`, async () => {
      const previous = await this.getResidentOrThrow(id)
      const merged: Resident = { ...previous, ...input }
      const updated = normalizeResidentAssessmentAnchor(merged)
      validateResidentInput(residentToInput(updated))
      await this.repository.updateResident(updated)
      recordResidentUpdateAudit(actorId, id, previous, updated, this.skipRemoteAuditPersist)
    })
  }

  async softDeleteResident(actorId: string, id: string): Promise<void> {
    return this.runWithSubmitLock(`soft-delete:${actorId}:${id}`, async () => {
      const previous = await this.getResidentOrThrow(id)
      await this.repository.softDeleteResident(id)
      const updated: Resident = { ...previous, isDeleted: true }
      recordResidentSoftDeleteAudit(actorId, id, previous, updated, this.skipRemoteAuditPersist)
    })
  }

  private async getResidentOrThrow(id: string): Promise<Resident> {
    const resident = await this.repository.findResidentById(id)
    if (!resident) {
      throw new Error('找不到院友資料')
    }
    return resident
  }

  private async runWithSubmitLock<T>(key: string, task: () => Promise<T>): Promise<T> {
    // 依據防重覆提交規範：同一操作鍵在完成前不可重入。
    if (this.inFlightKeys.has(key)) {
      throw new Error('請勿重覆提交，系統仍在處理中')
    }
    this.inFlightKeys.add(key)
    try {
      return await task()
    } finally {
      this.inFlightKeys.delete(key)
    }
  }
}
