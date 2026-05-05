import type { SchedulingKpiHistoryQuery } from '../../../repositories/schedulingKpiHistoryRepository'
import type { SchedulingKpiHistoryFilter } from '../types/schedulingKpiHistoryFilter'
import { SCHEDULING_KPI_HISTORY_LIMIT } from './schedulingKpiHistoryLimits'

export type { SchedulingKpiHistoryFilter }

export const EMPTY_SCHEDULING_KPI_HISTORY_FILTER: SchedulingKpiHistoryFilter = {
  from: '',
  to: '',
  actorId: '',
}

export const toSchedulingKpiHistoryQuery = (
  filter: SchedulingKpiHistoryFilter,
): SchedulingKpiHistoryQuery => ({
  limit: SCHEDULING_KPI_HISTORY_LIMIT,
  from: filter.from || undefined,
  to: filter.to || undefined,
  actorId: filter.actorId || undefined,
})
