import { useCallback } from 'react'
import type { SchedulingSession } from '../../../services/schedulingService'
import type { ServiceFormsWorkspace } from './useServiceFormsWorkspace'
import type { ServiceFormRecord } from '../types/serviceForm'

type Params = {
  workspace: ServiceFormsWorkspace
  selectedSession: SchedulingSession | null
  residentId: string
  residentName: string
  narrative: string
  editingId: string | null
  sessionId: string
  setEditingId: (id: string | null) => void
  resetEmpty: () => void
}

/** Staff 填表區：草稿儲存、軟刪、提交（PDF 02【5】）；錯誤以 alert 提示。 */
export const useServiceFormStaffPanelActions = ({
  workspace,
  selectedSession,
  residentId,
  residentName,
  narrative,
  editingId,
  sessionId,
  setEditingId,
  resetEmpty,
}: Params) => {
  const runSaveDraft = useCallback(() => {
    if (!selectedSession) {
      window.alert('請選擇已接收之工作節')
      return
    }
    if (!residentId) {
      window.alert('請選擇院友')
      return
    }
    try {
      const saved = workspace.saveDraft(selectedSession, residentId, residentName, narrative, editingId)
      setEditingId(saved.id)
      window.alert('草稿已儲存')
    } catch (error) {
      window.alert(error instanceof Error ? error.message : '儲存失敗')
    }
  }, [
    editingId,
    narrative,
    residentId,
    residentName,
    selectedSession,
    setEditingId,
    workspace,
  ])

  const runSoftDelete = useCallback(
    async (row: ServiceFormRecord) => {
      if (!window.confirm('確定軟刪除此表單？核准後之紀錄不可刪；刪除後將自清單移除。')) return
      try {
        await workspace.softDelete(row)
        if (editingId === row.id) resetEmpty()
        window.alert('已軟刪除')
        void workspace.reloadContext()
      } catch (error) {
        window.alert(error instanceof Error ? error.message : '軟刪除失敗')
      }
    },
    [editingId, resetEmpty, workspace],
  )

  const runSubmit = useCallback(() => {
    const record = workspace.myForms.find((item) => item.id === editingId)
    const sess = workspace.sessions.find((item) => item.id === sessionId)
    if (!record || !sess) {
      window.alert('請先選擇草稿並確認工作節')
      return
    }
    try {
      workspace.submit(record, sess)
      window.alert('已提交待主管審核')
      void workspace.reloadContext()
      resetEmpty()
    } catch (error) {
      window.alert(error instanceof Error ? error.message : '提交失敗')
    }
  }, [editingId, resetEmpty, sessionId, workspace])

  return { runSaveDraft, runSoftDelete, runSubmit }
}
