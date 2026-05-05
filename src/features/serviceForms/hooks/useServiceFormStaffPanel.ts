import { useMemo } from 'react'
import type { ServiceFormsWorkspace } from './useServiceFormsWorkspace'
import { useServiceFormStaffPanelActions } from './useServiceFormStaffPanelActions'
import { useServiceFormStaffPanelFormState } from './useServiceFormStaffPanelFormState'

/** Staff 填表區：本地表單狀態與草稿／提交／軟刪流程（PDF 02【5】Seq 17） */
export const useServiceFormStaffPanel = (workspace: ServiceFormsWorkspace) => {
  const {
    selectedDate,
    setSelectedDate,
    sessionId,
    setSessionId,
    residentId,
    setResidentId,
    narrative,
    setNarrative,
    editingId,
    setEditingId,
    loadForm,
    resetEmpty,
  } = useServiceFormStaffPanelFormState()

  const sessionsOfDay = useMemo(
    () => workspace.acceptedOwnSessions.filter((row) => row.date === selectedDate),
    [workspace.acceptedOwnSessions, selectedDate],
  )

  const selectedSession = workspace.sessions.find((item) => item.id === sessionId) ?? null

  const residentName =
    workspace.residents.find((item) => item.id === residentId)?.name ?? ''

  const { runSaveDraft, runSoftDelete, runSubmit } = useServiceFormStaffPanelActions({
    workspace,
    selectedSession,
    residentId,
    residentName,
    narrative,
    editingId,
    sessionId,
    setEditingId,
    resetEmpty,
  })

  const currentDraft =
    editingId !== null ? workspace.myForms.find((item) => item.id === editingId) ?? null : null

  const canSubmit =
    Boolean(currentDraft) &&
    (currentDraft?.status === 'DRAFT' || currentDraft?.status === 'REJECTED_NEEDS_REVISION')

  const readOnly =
    currentDraft?.status === 'SUBMITTED' ||
    currentDraft?.status === 'APPROVED'

  return {
    selectedDate,
    setSelectedDate,
    sessionId,
    setSessionId,
    residentId,
    setResidentId,
    narrative,
    setNarrative,
    editingId,
    sessionsOfDay,
    selectedSession,
    residentName,
    loadForm,
    resetEmpty,
    runSaveDraft,
    runSoftDelete,
    runSubmit,
    currentDraft,
    canSubmit,
    readOnly,
  }
}
