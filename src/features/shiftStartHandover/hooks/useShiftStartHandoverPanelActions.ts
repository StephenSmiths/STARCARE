import { useCallback } from 'react'
import type { ShiftStartHandoverWorkspace } from './useShiftStartHandoverWorkspace'
import type { ShiftStartHandoverFields, ShiftStartHandoverRecord } from '../types/shiftStartHandover'

type Params = {
  workspace: ShiftStartHandoverWorkspace
  shiftDate: string
  fields: ShiftStartHandoverFields
  editingId: string | null
  setEditingId: (id: string | null) => void
  loaded: ShiftStartHandoverRecord | null
  myRecords: ShiftStartHandoverRecord[]
  resetEmpty: () => void
}

/** 草稿儲存與提交（PDF 02【5b】）。 */
export const useShiftStartHandoverPanelActions = ({
  workspace,
  shiftDate,
  fields,
  editingId,
  setEditingId,
  loaded,
  myRecords,
  resetEmpty,
}: Params) => {
  const runSaveDraft = useCallback(() => {
    try {
      const saved = workspace.saveDraft(shiftDate, fields, editingId)
      setEditingId(saved.id)
      window.alert('草稿已儲存')
    } catch (error) {
      window.alert(error instanceof Error ? error.message : '儲存失敗')
    }
  }, [editingId, fields, shiftDate, setEditingId, workspace])

  const runSubmit = useCallback(() => {
    const record = loaded ?? myRecords.find((row) => row.id === editingId)
    if (!record || record.status !== 'DRAFT') {
      window.alert('請先儲存草稿')
      return
    }
    try {
      workspace.submitRecord({ ...record, ...fields, shiftDate })
      window.alert('接更紀錄已提交')
      resetEmpty()
    } catch (error) {
      window.alert(error instanceof Error ? error.message : '提交失敗')
    }
  }, [editingId, fields, loaded, myRecords, resetEmpty, shiftDate, workspace])

  return { runSaveDraft, runSubmit }
}
