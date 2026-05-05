import { useCallback, useRef, useState, type Dispatch, type SetStateAction } from 'react'
import {
  recordAiReportAdoptAudit,
  recordAiReportDraftBodySaveAudit,
  recordAiReportDraftCreateAudit,
  recordAiReportDistributeAudit,
} from '../services/aiReportCenterAuditService'
import {
  adoptAiReport,
  distributeAiReport,
  prependAiReportDraft,
  updateAiReportDraftBody,
} from '../services/aiReportCenterDomainService'
import type { AiReportRecord } from '../types/aiReportCenter'
import { runAiReportWorkspaceExclusiveMutation } from '../utils/aiReportCenterWorkspaceExclusiveMutation'

type Params = {
  actorId: string
  reports: AiReportRecord[]
  persistAndSet: (next: AiReportRecord[]) => void
  editId: string | null
  setEditId: Dispatch<SetStateAction<string | null>>
  setEditBody: Dispatch<SetStateAction<string>>
  titleInput: string
  editBody: string
  setTitleInput: Dispatch<SetStateAction<string>>
}

/** 建立草稿、儲存正文、採用、發放（含 busy 鎖與審計呼叫）。 */
export const useAiReportCenterWorkspaceMutations = ({
  actorId,
  reports,
  persistAndSet,
  editId,
  setEditId,
  setEditBody,
  titleInput,
  editBody,
  setTitleInput,
}: Params) => {
  const [error, setError] = useState('')
  const busy = useRef(false)

  const generateDraft = useCallback(() => {
    runAiReportWorkspaceExclusiveMutation(busy, setError, '建立失敗', () => {
      const { next, created } = prependAiReportDraft(actorId, titleInput, reports)
      persistAndSet(next)
      setTitleInput('')
      setEditId(created.id)
      setEditBody(created.bodyText)
      recordAiReportDraftCreateAudit(actorId, created.id, created.title)
    })
  }, [actorId, persistAndSet, reports, setEditBody, setEditId, setTitleInput, titleInput])

  const saveDraftBody = useCallback(() => {
    runAiReportWorkspaceExclusiveMutation(
      busy,
      setError,
      '儲存失敗',
      () => {
        if (!editId) return
        const next = updateAiReportDraftBody(actorId, editId, editBody, reports)
        persistAndSet(next)
        recordAiReportDraftBodySaveAudit(actorId, editId, editBody.length)
      },
      () => !!editId,
    )
  }, [actorId, editBody, editId, persistAndSet, reports])

  const adopt = useCallback(
    (id: string) => {
      runAiReportWorkspaceExclusiveMutation(busy, setError, '採用失敗', () => {
        const next = adoptAiReport(actorId, id, reports)
        persistAndSet(next)
        if (editId === id) setEditId(null)
        recordAiReportAdoptAudit(actorId, id)
      })
    },
    [actorId, editId, persistAndSet, reports, setEditId],
  )

  const distribute = useCallback(
    (id: string) => {
      runAiReportWorkspaceExclusiveMutation(busy, setError, '發放失敗', () => {
        const next = distributeAiReport(actorId, id, reports)
        persistAndSet(next)
        recordAiReportDistributeAudit(actorId, id)
      })
    },
    [actorId, persistAndSet, reports],
  )

  return {
    error,
    generateDraft,
    saveDraftBody,
    adopt,
    distribute,
  }
}
