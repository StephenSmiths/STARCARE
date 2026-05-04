import { useMemo, useState } from 'react'
import type { SchedulingKpiRunRecord } from '../../../services/schedulingKpiService'
import type { SchedulingKpiHistoryFilter } from '../hooks/useSchedulingKpiHistory'
import { uiTokens } from '../../shared/ui/uiTokens'

interface SchedulingKpiTrendFilterBarProps {
  history: SchedulingKpiRunRecord[]
  currentFilter?: SchedulingKpiHistoryFilter
  onApplyFilter?: (filter: SchedulingKpiHistoryFilter) => void
  onResetFilter?: () => void
  isApplyingFilter?: boolean
}

const hasFilter = (filter?: SchedulingKpiHistoryFilter): boolean =>
  Boolean(filter?.from || filter?.to || filter?.actorId)

const filterSummary = (filter?: SchedulingKpiHistoryFilter): string => {
  if (!hasFilter(filter)) return '目前：未套用過濾條件'
  const parts = []
  if (filter?.from) parts.push(`起：${filter.from}`)
  if (filter?.to) parts.push(`迄：${filter.to}`)
  if (filter?.actorId) parts.push(`操作者：${filter.actorId}`)
  return `目前：${parts.join(' / ')}`
}

/** 過濾列：日期區間 + 操作者下拉 + 套用/重置 */
export const SchedulingKpiTrendFilterBar = ({
  history,
  currentFilter,
  onApplyFilter,
  onResetFilter,
  isApplyingFilter,
}: SchedulingKpiTrendFilterBarProps) => {
  const [from, setFrom] = useState(currentFilter?.from ?? '')
  const [to, setTo] = useState(currentFilter?.to ?? '')
  const [actorId, setActorId] = useState(currentFilter?.actorId ?? '')

  const actorOptions = useMemo(() => {
    const ids = Array.from(new Set(history.map((item) => item.actorId).filter(Boolean)))
    return ids as string[]
  }, [history])

  const handleApply = () => onApplyFilter?.({ from, to, actorId })
  const handleReset = () => {
    setFrom('')
    setTo('')
    setActorId('')
    onResetFilter?.()
  }

  return (
    <div className={uiTokens.schedulingKpiTrendFilterInset}>
      <p className={uiTokens.schedulingKpiTrendFilterSummary}>{filterSummary(currentFilter)}</p>
      <div className={uiTokens.schedulingKpiTrendFilterGrid}>
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className={uiTokens.schedulingKpiTrendDateInput}
        />
        <input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className={uiTokens.schedulingKpiTrendDateInput}
        />
        <select
          value={actorId}
          onChange={(e) => setActorId(e.target.value)}
          className={uiTokens.schedulingKpiTrendActorSelect}
        >
          <option value="">所有操作者</option>
          {actorOptions.map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </select>
        <div className={uiTokens.layoutFlexGap2}>
          <button type="button" className={uiTokens.btnCompact} onClick={handleApply} disabled={isApplyingFilter}>
            {isApplyingFilter ? '查詢中...' : '套用過濾'}
          </button>
          <button type="button" className={uiTokens.btnCompact} onClick={handleReset} disabled={isApplyingFilter}>
            重置
          </button>
        </div>
      </div>
    </div>
  )
}
