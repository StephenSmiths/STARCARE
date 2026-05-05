import { useMemo, useState } from 'react'
import type { WorkSessionLifecycleStatus } from '../services/workSessionPlanTypes'
import { workSessionPlansTodayYmd } from '../utils/workSessionPlansLocalDate'

/** 日期／「全部日期」／狀態篩選（PDF 02【4】）。 */
export const useWorkSessionPlansFilterState = () => {
  const [selectedDate, setSelectedDate] = useState(workSessionPlansTodayYmd)
  const [showAllDates, setShowAllDates] = useState(false)
  const [statusFilter, setStatusFilter] = useState<'all' | WorkSessionLifecycleStatus>('all')

  const dateKey = useMemo(() => (showAllDates ? '' : selectedDate), [selectedDate, showAllDates])

  return {
    selectedDate,
    setSelectedDate,
    showAllDates,
    setShowAllDates,
    statusFilter,
    setStatusFilter,
    dateKey,
  }
}
