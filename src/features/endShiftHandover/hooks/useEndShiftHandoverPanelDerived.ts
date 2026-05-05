import { useMemo } from 'react'
import type { EndShiftHandoverWorkspace } from './useEndShiftHandoverWorkspace'

type Params = {
  workspace: EndShiftHandoverWorkspace
  editingId: string | null
}

/** 本人紀錄列表與目前列唯讀／可送出語意。 */
export const useEndShiftHandoverPanelDerived = ({ workspace, editingId }: Params) => {
  const myRecords = useMemo(
    () => workspace.records.filter((row) => row.actorId === workspace.actorId),
    [workspace.records, workspace.actorId],
  )

  const loaded = editingId ? myRecords.find((row) => row.id === editingId) ?? null : null
  const readOnly = loaded?.status === 'SUBMITTED'
  const canSubmit = loaded?.status === 'DRAFT'

  return { myRecords, loaded, readOnly, canSubmit }
}
