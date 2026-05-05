import { uiTokens } from '../../shared/ui/uiTokens'
import { useSchedulingResidentTable } from '../hooks/useSchedulingResidentTable'
import type { ResidentTableRow } from '../types/residentTableRow'
import { SchedulingResidentTableBody } from './SchedulingResidentTableBody'
import { SchedulingResidentTablePager } from './SchedulingResidentTablePager'
import { SchedulingResidentTableToolbar } from './SchedulingResidentTableToolbar'

export type { ResidentTableRow } from '../types/residentTableRow'

interface SchedulingResidentTableProps {
  rows: ResidentTableRow[]
}

/** 院友週次數表格：未達標列淡紅底、資助類別標色 */
export const SchedulingResidentTable = ({ rows }: SchedulingResidentTableProps) => {
  const vm = useSchedulingResidentTable(rows)

  return (
    <div className={uiTokens.surfaceTableShell}>
      <div className={uiTokens.residentTableHeaderBar}>
        <h3 className={uiTokens.panelTitleSm}>院友本週資助復康次數</h3>
      </div>
      <SchedulingResidentTableToolbar
        keyword={vm.keyword}
        setKeyword={vm.setKeyword}
        resetPage={vm.resetPage}
        statusFilter={vm.statusFilter}
        setStatusFilter={vm.setStatusFilter}
        pageSize={vm.pageSize}
        setPageSize={vm.setPageSize}
        filteredCount={vm.filteredRows.length}
      />
      <SchedulingResidentTableBody pagedRows={vm.pagedRows} />
      <SchedulingResidentTablePager safePage={vm.safePage} pageCount={vm.pageCount} setPage={vm.setPage} />
    </div>
  )
}
