import { useMemo } from 'react'
import type { WorkSessionLifecycleStatus, WorkSessionPlanRow } from '../services/workSessionPlanTypes'
import { filterWorkPlanRows } from '../services/workSessionPlanRowModel'

type Params = {
  mergedRows: WorkSessionPlanRow[]
  effectiveStaffProfileId: string | null
  dateKey: string
  statusFilter: 'all' | WorkSessionLifecycleStatus
}

/** 「我的計劃」來源列與套用日期／狀態篩選後之我的／團隊列表。 */
export const useWorkSessionPlansDerivedRows = ({
  mergedRows,
  effectiveStaffProfileId,
  dateKey,
  statusFilter,
}: Params) => {
  const myRowsSource = useMemo(() => {
    if (!effectiveStaffProfileId) return []
    return mergedRows.filter((row) => row.staffId === effectiveStaffProfileId)
  }, [mergedRows, effectiveStaffProfileId])

  const filteredMyRows = useMemo(
    () => filterWorkPlanRows(myRowsSource, dateKey, statusFilter),
    [myRowsSource, dateKey, statusFilter],
  )

  const filteredTeamRows = useMemo(
    () => filterWorkPlanRows(mergedRows, dateKey, statusFilter),
    [mergedRows, dateKey, statusFilter],
  )

  return { filteredMyRows, filteredTeamRows }
}
