import { uiTokens } from '../../shared/ui/uiTokens'
import type { WorkSessionLifecycleStatus } from '../services/workSessionPlanService'

export type WorkSessionPlanDateStatusFiltersProps = {
  selectedDate: string
  showAllDates: boolean
  onShowAllDatesChange: (value: boolean) => void
  onSelectedDateChange: (value: string) => void
  statusFilter: 'all' | WorkSessionLifecycleStatus
  onStatusFilterChange: (value: 'all' | WorkSessionLifecycleStatus) => void
}

/** 工作計劃共用：日期／全部日期／狀態篩選（PDF 02【4】） */
export const WorkSessionPlanDateStatusFilters = ({
  selectedDate,
  showAllDates,
  onShowAllDatesChange,
  onSelectedDateChange,
  statusFilter,
  onStatusFilterChange,
}: WorkSessionPlanDateStatusFiltersProps) => (
  <>
    <label className={uiTokens.formFieldStack}>
      <span className={uiTokens.formLabel}>日期</span>
      <input
        type="date"
        className={uiTokens.formInput}
        disabled={showAllDates}
        value={selectedDate}
        onChange={(event) => onSelectedDateChange(event.target.value)}
      />
    </label>
    <label className={uiTokens.formCheckboxRow}>
      <input type="checkbox" checked={showAllDates} onChange={(e) => onShowAllDatesChange(e.target.checked)} />
      全部日期
    </label>
    <label className={uiTokens.formFieldStack}>
      <span className={uiTokens.formLabel}>狀態</span>
      <select
        className={uiTokens.formSelect}
        value={statusFilter}
        onChange={(event) =>
          onStatusFilterChange(event.target.value as 'all' | WorkSessionLifecycleStatus)
        }
      >
        <option value="all">全部</option>
        <option value="PENDING">待接收</option>
        <option value="ACCEPTED">已接收</option>
        <option value="REJECTED">已拒絕</option>
        <option value="COMPLETED">已完成</option>
      </select>
    </label>
  </>
)
