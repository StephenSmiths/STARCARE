import { useCallback, useRef, useState } from 'react'
import type { WorkSessionPlanRow } from '../services/workSessionPlanService'

/**
 * 團隊計劃批量軟刪：選取集合與防連點鎖（對齊業務 PDF 防重覆提交）。
 */
export function useTeamWorkPlanBulkSelection(
  rows: WorkSessionPlanRow[],
  onBulkSoftDelete: (sessionIds: string[]) => Promise<void>,
) {
  const bulkLockRef = useRef(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [busy, setBusy] = useState(false)
  const [localError, setLocalError] = useState('')

  const toggle = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const toggleAllVisible = useCallback(() => {
    setSelected((prev) => {
      if (prev.size === rows.length) return new Set()
      return new Set(rows.map((r) => r.id))
    })
  }, [rows])

  const runBulkDelete = useCallback(async () => {
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
  }, [onBulkSoftDelete, selected])

  return { selected, toggle, toggleAllVisible, runBulkDelete, busy, localError }
}
