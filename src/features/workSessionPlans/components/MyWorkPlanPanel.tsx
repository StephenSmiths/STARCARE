import type { StarcareRole } from '../../auth/permissions'
import { uiTokens } from '../../shared/ui/uiTokens'
import type { WorkSessionLifecycleStatus, WorkSessionPlanRow } from '../services/workSessionPlanService'

const statusLabel = (s: WorkSessionLifecycleStatus): string => {
  if (s === 'PENDING') return '待接收'
  if (s === 'ACCEPTED') return '已接收'
  if (s === 'REJECTED') return '已拒絕'
  return '已完成'
}

const serviceLabel = (row: WorkSessionPlanRow): string =>
  row.serviceType === 'Dementia_Service' ? '認知軌' : '資助復康'

export interface MyWorkPlanPanelProps {
  role: StarcareRole
  effectiveStaffProfileId: string | null
  rows: WorkSessionPlanRow[]
  isLoading: boolean
  error: string
  selectedDate: string
  onSelectedDateChange: (value: string) => void
  showAllDates: boolean
  onShowAllDatesChange: (value: boolean) => void
  statusFilter: 'all' | WorkSessionLifecycleStatus
  onStatusFilterChange: (value: 'all' | WorkSessionLifecycleStatus) => void
  onAccept: (sessionId: string) => void
  onReject: (sessionId: string) => void
}

/** PDF 02【4】我的工作計劃：選日／狀態／列表／接收或拒絕（Seq 16） */
export const MyWorkPlanPanel = ({
  role,
  effectiveStaffProfileId,
  rows,
  isLoading,
  error,
  selectedDate,
  onSelectedDateChange,
  showAllDates,
  onShowAllDatesChange,
  statusFilter,
  onStatusFilterChange,
  onAccept,
  onReject,
}: MyWorkPlanPanelProps) => {
  const canRespondAsStaff = role === 'Staff'

  return (
    <section className={uiTokens.surfaceCardCompact}>
      <h2 className={uiTokens.pageSectionHeading}>我的工作計劃</h2>
      <p className={uiTokens.sectionHelp}>
        對齊 01 §2.1：待接收（PENDING）可選接收或拒絕；僅 Staff 可操作接收／拒絕。登入身分請以
        <code className={uiTokens.inlineKbd}>starcare_staff_profile_id</code>
        對應 staff_profiles.id（否則列表可能為空）。
      </p>
      {effectiveStaffProfileId === null ? (
        <p className={uiTokens.listCalloutAmber}>
          未解析到員工主檔編號：請在 Supabase user_metadata 設定 starcare_staff_profile_id。
        </p>
      ) : (
        <p className={uiTokens.blockHelpMt2}>
          目前綁定 staff_profiles.id：<span className={uiTokens.textMono}>{effectiveStaffProfileId}</span>
        </p>
      )}
      <div className={uiTokens.layoutFlexWrapItemsEndGap3Mt4}>
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
      </div>
      {error ? <p className={uiTokens.formInlineErrorMt3}>{error}</p> : null}
      {isLoading ? <p className={uiTokens.moduleDescription}>載入中…</p> : null}
      {!isLoading && rows.length === 0 ? (
        <p className={uiTokens.emptyStateMuted}>目前篩選下沒有工作節。</p>
      ) : (
        <ul className={uiTokens.listDivideShellMt4TextSm}>
          {rows.map((row) => (
            <li key={row.id} className={uiTokens.workPlanMyListRow}>
              <div>
                <p className={uiTokens.reviewQueueTitle}>
                  {row.date} {row.timeSlot} · {row.staffName}
                </p>
                <p className={uiTokens.textMutedBodyXs}>
                  {serviceLabel(row)} · 名額 {row.capacity}
                  {row.skillMatched === false ? ' · 技能未匹配' : ''}
                </p>
                <p className={uiTokens.textXsMt1}>
                  <span className={uiTokens.metaChip}>{statusLabel(row.responseStatus)}</span>
                  {row.response ? (
                    <span className={uiTokens.textSubtleXsMl2}>更新於 {row.response.occurredAt}</span>
                  ) : null}
                </p>
              </div>
              {canRespondAsStaff && row.responseStatus === 'PENDING' ? (
                <div className={uiTokens.layoutFlexShrink0Gap2}>
                  <button type="button" className={uiTokens.btnSuccess} onClick={() => onAccept(row.id)}>
                    接收
                  </button>
                  <button type="button" className={uiTokens.btnDangerOutline} onClick={() => onReject(row.id)}>
                    拒絕
                  </button>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
