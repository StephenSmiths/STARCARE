import { useState } from 'react'
import { useAuthActorId } from '../../auth'
import { useAiReportCenterDraftEditor } from './useAiReportCenterDraftEditor'
import { useAiReportCenterWorkspaceModel } from './useAiReportCenterWorkspaceModel'
import { useAiReportCenterWorkspaceMutations } from './useAiReportCenterWorkspaceMutations'

/** PDF 02【11】報告中心：載入、編輯草稿、採用、發放（含審計） */
export const useAiReportCenterWorkspace = () => {
  const actorId = useAuthActorId()
  const { reports, reload, persistAndSet } = useAiReportCenterWorkspaceModel()
  const { editId, setEditId, editBody, setEditBody, openDraftEditor } = useAiReportCenterDraftEditor()
  const [titleInput, setTitleInput] = useState('')

  const { error, generateDraft, saveDraftBody, adopt, distribute } =
    useAiReportCenterWorkspaceMutations({
      actorId,
      reports,
      persistAndSet,
      editId,
      setEditId,
      setEditBody,
      titleInput,
      editBody,
      setTitleInput,
    })

  return {
    reports,
    titleInput,
    setTitleInput,
    editId,
    editBody,
    setEditBody,
    error,
    reload,
    generateDraft,
    saveDraftBody,
    adopt,
    distribute,
    openDraftEditor,
  }
}
