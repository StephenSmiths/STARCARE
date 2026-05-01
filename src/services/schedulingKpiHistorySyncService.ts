import {
  createSchedulingKpiHistoryRepository,
  type SchedulingKpiHistoryQuery,
  type SchedulingKpiHistoryRepository,
} from '../repositories/schedulingKpiHistoryRepository'
import type { SchedulingKpiRunRecord } from './schedulingKpiService'
import { clearKpiRunHistory, loadKpiRunHistory, saveKpiRunHistory } from './schedulingKpiHistoryStorage'

export class SchedulingKpiHistorySyncService {
  private readonly repository: SchedulingKpiHistoryRepository

  constructor(repository: SchedulingKpiHistoryRepository) {
    this.repository = repository
  }

  loadLocal(facilityId: string): SchedulingKpiRunRecord[] {
    return loadKpiRunHistory(facilityId)
  }

  async hydrateFromServer(
    facilityId: string,
    query: SchedulingKpiHistoryQuery = { limit: 10 },
  ): Promise<SchedulingKpiRunRecord[]> {
    const rows = await this.repository.listHistory(facilityId, { limit: 10, ...query })
    saveKpiRunHistory(facilityId, rows)
    return rows
  }

  async appendRecord(facilityId: string, record: SchedulingKpiRunRecord): Promise<void> {
    await this.repository.appendRecord(facilityId, record)
  }

  async clearHistory(facilityId: string): Promise<void> {
    await this.repository.clearHistory(facilityId)
    clearKpiRunHistory(facilityId)
  }
}

export const schedulingKpiHistorySyncService = new SchedulingKpiHistorySyncService(
  createSchedulingKpiHistoryRepository(),
)
