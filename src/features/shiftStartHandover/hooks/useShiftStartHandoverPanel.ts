import type { ShiftStartHandoverWorkspace } from './useShiftStartHandoverWorkspace'
import { useShiftStartHandoverPanelActions } from './useShiftStartHandoverPanelActions'
import { useShiftStartHandoverPanelDerived } from './useShiftStartHandoverPanelDerived'
import { useShiftStartHandoverPanelFormState } from './useShiftStartHandoverPanelFormState'

/** 開工接更表單區：本地欄位與草稿／提交（PDF 02【5b】） */
export const useShiftStartHandoverPanel = (workspace: ShiftStartHandoverWorkspace) => {
  const {
    shiftDate,
    setShiftDate,
    fields,
    editingId,
    setEditingId,
    patchField,
    loadRow,
    resetEmpty,
  } = useShiftStartHandoverPanelFormState()

  const { myRecords, loaded, readOnly, canSubmit } = useShiftStartHandoverPanelDerived({
    workspace,
    editingId,
  })

  const { runSaveDraft, runSubmit } = useShiftStartHandoverPanelActions({
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
