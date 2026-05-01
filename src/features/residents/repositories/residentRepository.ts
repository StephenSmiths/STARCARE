import type { Resident, ResidentRecord } from '../types/resident'
import { toResident, toResidentRecord } from './residentMapper'

export interface ResidentRepository {
  listResidents: () => Promise<Resident[]>
  createResident: (resident: Resident) => Promise<void>
  updateResident: (resident: Resident) => Promise<void>
  softDeleteResident: (id: string) => Promise<void>
  findResidentById: (id: string) => Promise<Resident | null>
}

export class InMemoryResidentRepository implements ResidentRepository {
  /** 無 Supabase 時為空；請於院友管理新增，或設定 .env 改走真實 API。 */
  private residents: ResidentRecord[] = []

  async listResidents(): Promise<Resident[]> {
    return Promise.resolve(this.residents.map(toResident))
  }

  async createResident(resident: Resident): Promise<void> {
    this.residents = [toResidentRecord(resident), ...this.residents]
  }

  async updateResident(resident: Resident): Promise<void> {
    const record = toResidentRecord(resident)
    this.residents = this.residents.map((item) => (item.id === record.id ? record : item))
  }

  async softDeleteResident(id: string): Promise<void> {
    // 依據 SOP 5.1：刪除只允許改寫 is_deleted，不可硬刪除資料列。
    this.residents = this.residents.map((item) =>
      item.id === id ? { ...item, is_deleted: true } : item,
    )
  }

  async findResidentById(id: string): Promise<Resident | null> {
    const resident = this.residents.find((item) => item.id === id)
    if (!resident) {
      return Promise.resolve(null)
    }
    return Promise.resolve(toResident(resident))
  }
}
