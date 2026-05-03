import type { Resident, ResidentRecord } from '../types/resident'
import { toResident, toResidentRecord } from './residentMapper'

/** 無 Supabase 時供表單／排班 demo 可選之院友（Seq 3 E2E 與本機預覽） */
const inMemoryDemoResidentSeeds: ResidentRecord[] = [
  {
    id: 'demo-resident-e2e-1',
    name: '本機示範院友',
    bed_number: 'D-01',
    area: '示範區',
    gender: 'Male',
    age: 80,
    admission_date: '2026-01-01',
    funding_type: 'Private',
    service_type: 'Subsidized_Rehab',
    dementia_level: 'None',
    is_special_care: false,
    health_condition: '穩定',
    medication_record: '無',
    is_deleted: false,
  },
]

export interface ResidentRepository {
  listResidents: () => Promise<Resident[]>
  createResident: (resident: Resident) => Promise<void>
  updateResident: (resident: Resident) => Promise<void>
  softDeleteResident: (id: string) => Promise<void>
  findResidentById: (id: string) => Promise<Resident | null>
}

export class InMemoryResidentRepository implements ResidentRepository {
  /** 無 Supabase：含示範種子列；另可於院友管理新增，或改 .env 走真實 API。 */
  private residents: ResidentRecord[] = [...inMemoryDemoResidentSeeds]

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
