import { useMemo } from 'react'
import type { ShiftStartHandoverWorkspace } from './useShiftStartHandoverWorkspace'

type Params = {
  workspace: ShiftStartHandoverWorkspace
  editingId: string | null
}

/** 本人紀錄列表與目前列唯讀／可送出語意。 */
export const useShiftStartHandoverPanelDerived = ({ workspace, editingId }: Params) => {
  const myRecords = useMemo(
    () => workspace.records.filter((row) => row.actorId === workspace.actorId),
    [workspace.records, workspace.actorId],
  )

  const loaded = editingId ? myRecords.find((row) => row.id === editingId) ?? null : null
  const readOnly = loaded?.status === 'SUBMITTED'
  const canSubmit = loaded?.status === 'DRAFT'

  return { myRecords, loaded, readOnly, canSubmit }
}
