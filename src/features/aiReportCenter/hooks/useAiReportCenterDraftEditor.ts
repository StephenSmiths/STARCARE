import { useCallback, useState } from 'react'
import type { AiReportRecord } from '../types/aiReportCenter'

/** 草稿正文編輯：目前選取之列與內容 */
export const useAiReportCenterDraftEditor = () => {
  const [editId, setEditId] = useState<string | null>(null)
  const [editBody, setEditBody] = useState('')

  const openDraftEditor = useCallback((row: AiReportRecord) => {
    if (row.status !== 'DRAFT') return
    setEditId(row.id)
    setEditBody(row.bodyText)
  }, [])

  return { editId, setEditId, editBody, setEditBody, openDraftEditor }
}
