import type { StarcareRole } from '../../auth/permissions'
import { uiTokens } from '../../shared/ui/uiTokens'
import type { WorkSessionLifecycleStatus, WorkSessionPlanRow } from '../services/workSessionPlanService'
import { useTeamWorkPlanBulkSelection } from '../hooks/useTeamWorkPlanBulkSelection'
import { workSessionLifecycleStatusLabel } from '../utils/workSessionPlanLifecyclePresentation'
import { WorkSessionPlanDateStatusFilters } from './WorkSessionPlanDateStatusFilters'

export interface TeamWorkPlanPanelProps {
  role: StarcareRole
  rows: WorkSessionPlanRow[]
  isLoading: boolean
  selectedDate: string
  showAllDates: boolean
  onShowAllDatesChange: (value: boolean) => void
  onSelectedDateChange: (value: string) => void
  statusFilter: 'all' | WorkSessionLifecycleStatus
  onStatusFilterChange: (value: 'all' | WorkSessionLifecycleStatus) => void
  onBulkSoftDelete: (sessionIds: string[]) => Promise<void>
}

/** PDF 02【4】團隊計劃：列表與批量軟刪（TeamLead／Admin；Seq 16） */
export const TeamWorkPlanPanel = ({
  role,
  rows,
  isLoading,
  selectedDate,
  showAllDates,
  onShowAllDatesChange,
  onSelectedDateChange,
  statusFilter,
  onStatusFilterChange,
  onBulkSoftDelete,
}: TeamWorkPlanPanelProps) => {
  const { selected, toggle, toggleAllVisible, runBulkDelete, busy, localError } =
    useTeamWorkPlanBulkSelection(rows, onBulkSoftDelete)

  if (role !== 'TeamLead' && role !== 'Admin') return null

  return (
    <section className={uiTokens.surfaceCardCompact}>
      <h2 className={uiTokens.pageSectionHeading}>團隊計劃（批量軟刪）</h2>
      <p className={uiTokens.sectionHelp}>選取列後批量軟刪 activity_sessions；與「活動時段」模組同一後端。</p>
      <div className={uiTokens.layoutFlexWrapItemsEndGap3Mt4}>
        <WorkSessionPlanDateStatusFilters
          selectedDate={selectedDate}
          showAllDates={showAllDates}
          onShowAllDatesChange={onShowAllDatesChange}
          onSelectedDateChange={onSelectedDateChange}
          statusFilter={statusFilter}
          onStatusFilterChange={onStatusFilterChange}
        />
        <button
          type="button"
          className={uiTokens.btnDangerOutline}
          disabled={busy || selected.size === 0}
          onClick={() => void runBulkDelete()}
        >
          {busy ? '處理中…' : `批量軟刪（${selected.size}）`}
        </button>
        <button type="button" className={uiTokens.btnCompact} onClick={toggleAllVisible}>
          {selected.size === rows.length ? '取消全選' : '全選可見'}
        </button>
      </div>
      {localError ? <p className={uiTokens.formInlineErrorMt2}>{localError}</p> : null}
      {isLoading ? <p className={uiTokens.moduleDescription}>載入中…</p> : null}
      {!isLoading && rows.length === 0 ? (
        <p className={uiTokens.emptyStateMuted}>目前篩選下沒有團隊時段。</p>
      ) : (
        <ul className={uiTokens.listDivideShellMt4TextSm}>
          {rows.map((row) => (
            <li key={row.id} className={uiTokens.workPlanTeamListRow}>
              <input type="checkbox" checked={selected.has(row.id)} onChange={() => toggle(row.id)} />
              <span className={uiTokens.textSubtleXsMono}>{row.id}</span>
              <span className={uiTokens.reviewQueueTitle}>
                {row.date} {row.timeSlot} · {row.staffName}
              </span>
              <span className={uiTokens.metaChip}>{workSessionLifecycleStatusLabel(row.responseStatus)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
