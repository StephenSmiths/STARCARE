import type { EndShiftHandoverWorkspace } from './useEndShiftHandoverWorkspace'
import { useEndShiftHandoverPanelActions } from './useEndShiftHandoverPanelActions'
import { useEndShiftHandoverPanelDerived } from './useEndShiftHandoverPanelDerived'
import { useEndShiftHandoverPanelFormState } from './useEndShiftHandoverPanelFormState'

/** 收工交更表單區：本地欄位與草稿／提交（PDF 02【6】） */
export const useEndShiftHandoverPanel = (workspace: EndShiftHandoverWorkspace) => {
  const {
    shiftDate,
    setShiftDate,
    fields,
    editingId,
    setEditingId,
    patchField,
    loadRow,
    resetEmpty,
  } = useEndShiftHandoverPanelFormState()

  const { myRecords, loaded, readOnly, canSubmit } = useEndShiftHandoverPanelDerived({
    workspace,
    editingId,
  })

  const { runSaveDraft, runSubmit } = useEndShiftHandoverPanelActions({
    workspace,
    shiftDate,
    fields,
    editingId,
    setEditingId,
    loaded,
    myRecords,
    resetEmpty,
  })

  return {
    shiftDate,
    setShiftDate,
    fields,
    patchField,
    loadRow,
    resetEmpty,
    runSaveDraft,
    runSubmit,
    readOnly,
    canSubmit,
    myRecords,
  }
}
