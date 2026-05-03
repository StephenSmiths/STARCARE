import { globalAuditTrailService } from '../../../services/auditTrailService'
import {
  InMemoryResidentRepository,
  type ResidentRepository,
} from '../repositories/residentRepository'
import { ResidentEdgeRepository } from '../repositories/residentEdgeRepository'
import type { Resident, ResidentInput } from '../types/resident'

export class ResidentService {
  private readonly repository: ResidentRepository
  private readonly auditTrailService = globalAuditTrailService
  private readonly inFlightKeys = new Set<string>()

  constructor(repository: ResidentRepository) {
    this.repository = repository
  }

  async listActiveResidents(): Promise<Resident[]> {
    const residents = await this.repository.listResidents()
    return residents.filter((resident) => !resident.isDeleted)
  }

  async createResident(actorId: string, input: ResidentInput): Promise<void> {
    return this.runWithSubmitLock(`create:${actorId}:${input.bedNumber}`, async () => {
      const clean = this.normalizeResidentInput(input)
      this.validateInput(clean)
      const resident: Resident = {
        id: `resident-${crypto.randomUUID()}`,
        ...clean,
        isDeleted: false,
      }
      await this.repository.createResident(resident)
      this.auditTrailService.record({
        action: 'CREATE',
        entityType: 'Resident',
        entityId: resident.id,
        actorId,
        beforeState: null,
        afterState: JSON.stringify(resident),
        detail: '新增院友資料',
        occurredAt: new Date().toISOString(),
      })
    })
  }

  async updateResident(actorId: string, id: string, input: ResidentInput): Promise<void> {
    return this.runWithSubmitLock(`update:${actorId}:${id}`, async () => {
      const previous = await this.getResidentOrThrow(id)
      const merged: Resident = { ...previous, ...input }
      const updated = this.normalizeResidentAssessmentAnchor(merged)
      this.validateInput(this.residentToInput(updated))
      await this.repository.updateResident(updated)
      this.auditTrailService.record({
        action: 'UPDATE',
        entityType: 'Resident',
        entityId: id,
        actorId,
        beforeState: JSON.stringify(previous),
        afterState: JSON.stringify(updated),
        detail: '修改院友資料',
        occurredAt: new Date().toISOString(),
      })
    })
  }

  async softDeleteResident(actorId: string, id: string): Promise<void> {
    return this.runWithSubmitLock(`soft-delete:${actorId}:${id}`, async () => {
      const previous = await this.getResidentOrThrow(id)
      await this.repository.softDeleteResident(id)
      const updated: Resident = { ...previous, isDeleted: true }
      this.auditTrailService.record({
        action: 'SOFT_DELETE',
        entityType: 'Resident',
        entityId: id,
        actorId,
        beforeState: JSON.stringify(previous),
        afterState: JSON.stringify(updated),
        detail: '軟刪除院友資料',
        occurredAt: new Date().toISOString(),
      })
    })
  }

  private async getResidentOrThrow(id: string): Promise<Resident> {
    const resident = await this.repository.findResidentById(id)
    if (!resident) {
      throw new Error('找不到院友資料')
    }
    return resident
  }

  /** 合併後院友主檔：§4.3 錨點空白字串正規化為 null（與 `normalizeResidentInput` 一致） */
  private normalizeResidentAssessmentAnchor(resident: Resident): Resident {
    const raw = resident.assessmentNextDueDate
    if (raw === undefined || raw === null) {
      return { ...resident, assessmentNextDueDate: null }
    }
    const t = String(raw).trim()
    return { ...resident, assessmentNextDueDate: t === '' ? null : t }
  }

  private residentToInput(resident: Resident): ResidentInput {
    return {
      name: resident.name,
      bedNumber: resident.bedNumber,
      area: resident.area,
      gender: resident.gender,
      age: resident.age,
      admissionDate: resident.admissionDate,
      assessmentNextDueDate: resident.assessmentNextDueDate ?? null,
      fundingType: resident.fundingType,
      serviceType: resident.serviceType,
      dementiaLevel: resident.dementiaLevel,
      isSpecialCareCase: resident.isSpecialCareCase,
      healthCondition: resident.healthCondition,
      medicationRecord: resident.medicationRecord,
    }
  }

  /** 空白評估錨點正規化為 null，供 DB／Edge 寫入 */
  private normalizeResidentInput(input: ResidentInput): ResidentInput {
    const raw = input.assessmentNextDueDate
    if (raw === undefined || raw === null) {
      return { ...input, assessmentNextDueDate: null }
    }
    const t = String(raw).trim()
    return { ...input, assessmentNextDueDate: t === '' ? null : t }
  }

  private validateInput(input: ResidentInput): void {
    if (!input.name.trim() || !input.bedNumber.trim() || !input.area.trim()) {
      throw new Error('姓名、床號與區域不可為空')
    }
    if (!input.admissionDate) {
      throw new Error('請提供入院日期')
    }
    if (input.age < 1 || input.age > 130) {
      throw new Error('年齡格式不正確')
    }
    if (!['GradeA_Subsidized', 'Voucher', 'Private'].includes(input.fundingType)) {
      throw new Error('funding_type 僅允許 GradeA_Subsidized、Voucher、Private')
    }
    const rawDue = input.assessmentNextDueDate
    let due: string | null = null
    if (rawDue != null) {
      const t = String(rawDue).trim()
      if (t !== '') due = t
    }
    if (due != null && !/^\d{4}-\d{2}-\d{2}$/.test(due)) {
      throw new Error('下次評估到期日須為 YYYY-MM-DD')
    }
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

const createResidentRepository = (): ResidentRepository => {
  const runtimeEnv: Record<string, string | undefined> = (() => {
    try {
      return (import.meta as ImportMeta & { env?: Record<string, string> }).env ?? {}
    } catch {
      return {}
    }
  })()
  const supabaseUrl = runtimeEnv.VITE_SUPABASE_URL
  const supabaseAnonKey = runtimeEnv.VITE_SUPABASE_ANON_KEY
  if (supabaseUrl && supabaseAnonKey) {
    return new ResidentEdgeRepository({ supabaseUrl, anonKey: supabaseAnonKey })
  }
  return new InMemoryResidentRepository()
}

export const residentService = new ResidentService(createResidentRepository())
