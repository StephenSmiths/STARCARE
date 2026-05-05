import { useCallback } from 'react'
import type { EndShiftHandoverWorkspace } from './useEndShiftHandoverWorkspace'
import type { EndShiftHandoverFields, EndShiftHandoverRecord } from '../types/endShiftHandover'

type Params = {
  workspace: EndShiftHandoverWorkspace
  shiftDate: string
  fields: EndShiftHandoverFields
  editingId: string | null
  setEditingId: (id: string | null) => void
  loaded: EndShiftHandoverRecord | null
  myRecords: EndShiftHandoverRecord[]
  resetEmpty: () => void
}

/** 草稿儲存與提交（PDF 02【6】）。 */
export const useEndShiftHandoverPanelActions = ({
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
      window.alert('交更紀錄已提交')
      resetEmpty()
    } catch (error) {
      window.alert(error instanceof Error ? error.message : '提交失敗')
    }
  }, [editingId, fields, loaded, myRecords, resetEmpty, shiftDate, workspace])

  return { runSaveDraft, runSubmit }
}
