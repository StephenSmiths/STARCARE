import type { ScheduleSession } from '../types/schedule'
import {
  InMemorySchedulingRepository,
  type SchedulingRepository,
} from '../repositories/schedulingRepository'

export class SchedulingService {
  private readonly repository: SchedulingRepository

  constructor(repository: SchedulingRepository) {
    this.repository = repository
  }

  async getSessions(): Promise<ScheduleSession[]> {
    // 對齊 SOP 3 排班流程：排班資料由服務層集中提供，避免在 UI 夾帶業務規則。
    return this.repository.listSessions()
  }
}

export const schedulingService = new SchedulingService(new InMemorySchedulingRepository())
