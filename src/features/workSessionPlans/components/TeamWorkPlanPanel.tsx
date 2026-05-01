import { useRef, useState } from 'react'
import type { StarcareRole } from '../../auth/permissions'
import { uiTokens } from '../../shared/ui/uiTokens'
import type { WorkSessionLifecycleStatus, WorkSessionPlanRow } from '../services/workSessionPlanService'

const statusLabel = (s: WorkSessionLifecycleStatus): string => {
  if (s === 'PENDING') return '待接收'
  if (s === 'ACCEPTED') return '已接收'
  if (s === 'REJECTED') return '已拒絕'
  return '已完成'
}

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
  const bulkLockRef = useRef(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [busy, setBusy] = useState(false)
  const [localError, setLocalError] = useState('')

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleAllVisible = () => {
    if (selected.size === rows.length) {
      setSelected(new Set())
      return
    }
    setSelected(new Set(rows.map((r) => r.id)))
  }

  const runBulkDelete = async () => {
    if (bulkLockRef.current || selected.size === 0) return
    if (!window.confirm(`確定軟刪除選取之 ${selected.size} 個活動時段？（不可逆／請對齊院舍流程）`)) return
    bulkLockRef.current = true
    setBusy(true)
    setLocalError('')
    try {
      await onBulkSoftDelete([...selected])
      setSelected(new Set())
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : '批量刪除失敗')
    } finally {
      bulkLockRef.current = false
      setBusy(false)
    }
  }

  if (role !== 'TeamLead' && role !== 'Admin') return null

  return (
    <section className={uiTokens.surfaceCardCompact}>
      <h2 className={uiTokens.pageSectionHeading}>團隊計劃（批量軟刪）</h2>
      <p className={uiTokens.sectionHelp}>選取列後批量軟刪 activity_sessions；與「活動時段」模組同一後端。</p>
      <div className="mt-4 flex flex-wrap items-end gap-3">
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
        <label className="flex items-center gap-2 text-sm text-slate-700">
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
        <button type="button" className={uiTokens.btnDangerOutline} disabled={busy || selected.size === 0} onClick={() => void runBulkDelete()}>
          {busy ? '處理中…' : `批量軟刪（${selected.size}）`}
        </button>
        <button type="button" className={uiTokens.btnCompact} onClick={toggleAllVisible}>
          {selected.size === rows.length ? '取消全選' : '全選可見'}
        </button>
      </div>
      {localError ? <p className="mt-2 text-sm text-red-700">{localError}</p> : null}
      {isLoading ? <p className="mt-3 text-sm text-slate-600">載入中…</p> : null}
      {!isLoading && rows.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">目前篩選下沒有團隊時段。</p>
      ) : (
        <ul className="mt-4 divide-y divide-slate-100 rounded-lg border border-slate-200">
          {rows.map((row) => (
            <li key={row.id} className="flex flex-wrap items-center gap-3 px-3 py-2 text-sm">
              <input type="checkbox" checked={selected.has(row.id)} onChange={() => toggle(row.id)} />
              <span className="font-mono text-xs text-slate-500">{row.id}</span>
              <span className="text-slate-900">
                {row.date} {row.timeSlot} · {row.staffName}
              </span>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-xs">{statusLabel(row.responseStatus)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
