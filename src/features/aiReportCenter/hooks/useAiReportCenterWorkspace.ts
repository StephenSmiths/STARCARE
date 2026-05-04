import { useCallback, useRef, useState } from 'react'
import { useAuthActorId } from '../../auth'
import { listAiReports, persistAiReports } from '../../../repositories/aiReportCenterRepository'
import { hydrateAuditTrailAfterLocalRecord } from '../../../services/auditTrailHydrationService'
import { globalAuditTrailService } from '../../../services/auditTrailService'
import type { AiReportRecord } from '../types/aiReportCenter'
import {
  adoptAiReport,
  distributeAiReport,
  prependAiReportDraft,
  updateAiReportDraftBody,
} from '../services/aiReportCenterDomainService'

/** PDF 02【11】報告中心：載入、編輯草稿、採用、發放（含審計） */
export const useAiReportCenterWorkspace = () => {
  const actorId = useAuthActorId()
  const [reports, setReports] = useState<AiReportRecord[]>(() => listAiReports())
  const [titleInput, setTitleInput] = useState('')
  const [editId, setEditId] = useState<string | null>(null)
  const [editBody, setEditBody] = useState('')
  const [error, setError] = useState('')
  const busy = useRef(false)

  const reload = useCallback(() => {
    setReports(listAiReports())
  }, [])

  const generateDraft = useCallback(() => {
    if (busy.current) return
    busy.current = true
    setError('')
    try {
      const { next, created } = prependAiReportDraft(actorId, titleInput, reports)
      persistAiReports(next)
      setReports(next)
      setTitleInput('')
      setEditId(created.id)
      setEditBody(created.bodyText)
      globalAuditTrailService.record({
        action: 'AI_REPORT_CENTER_DRAFT_CREATE',
        entityType: 'Reporting',
        entityId: created.id,
        actorId,
        beforeState: null,
        afterState: JSON.stringify({ title: created.title }),
        detail: `AI 報告草稿建立：${created.title}`,
        occurredAt: new Date().toISOString(),
      })
      hydrateAuditTrailAfterLocalRecord()
    } catch (e) {
      setError(e instanceof Error ? e.message : '建立失敗')
    } finally {
      busy.current = false
    }
  }, [actorId, reports, titleInput])

  const saveDraftBody = useCallback(() => {
    if (!editId || busy.current) return
    busy.current = true
    setError('')
    try {
      const next = updateAiReportDraftBody(actorId, editId, editBody, reports)
      persistAiReports(next)
      setReports(next)
      globalAuditTrailService.record({
        action: 'AI_REPORT_CENTER_BODY_SAVE',
        entityType: 'Reporting',
        entityId: editId,
        actorId,
        beforeState: null,
        afterState: JSON.stringify({ length: editBody.length }),
        detail: 'AI 報告草稿內容更新',
        occurredAt: new Date().toISOString(),
      })
      hydrateAuditTrailAfterLocalRecord()
    } catch (e) {
      setError(e instanceof Error ? e.message : '儲存失敗')
    } finally {
      busy.current = false
    }
  }, [actorId, editBody, editId, reports])

  const adopt = useCallback(
    (id: string) => {
      if (busy.current) return
      busy.current = true
      setError('')
      try {
        const next = adoptAiReport(actorId, id, reports)
        persistAiReports(next)
        setReports(next)
        if (editId === id) setEditId(null)
        globalAuditTrailService.record({
          action: 'AI_REPORT_CENTER_ADOPT',
          entityType: 'Reporting',
          entityId: id,
          actorId,
          beforeState: JSON.stringify({ status: 'DRAFT' }),
          afterState: JSON.stringify({ status: 'ADOPTED' }),
          detail: 'AI 報告採用為正式版本',
          occurredAt: new Date().toISOString(),
        })
        hydrateAuditTrailAfterLocalRecord()
      } catch (e) {
        setError(e instanceof Error ? e.message : '採用失敗')
      } finally {
        busy.current = false
      }
    },
    [actorId, editId, reports],
  )

  const distribute = useCallback(
    (id: string) => {
      if (busy.current) return
      busy.current = true
      setError('')
      try {
        const next = distributeAiReport(actorId, id, reports)
        persistAiReports(next)
        setReports(next)
        globalAuditTrailService.record({
          action: 'AI_REPORT_CENTER_DISTRIBUTE',
          entityType: 'Reporting',
          entityId: id,
          actorId,
          beforeState: JSON.stringify({ status: 'ADOPTED' }),
          afterState: JSON.stringify({ status: 'DISTRIBUTED' }),
          detail: 'AI 報告發放（占位：待接通知／對象清單）',
          occurredAt: new Date().toISOString(),
        })
        hydrateAuditTrailAfterLocalRecord()
      } catch (e) {
        setError(e instanceof Error ? e.message : '發放失敗')
      } finally {
        busy.current = false
      }
    },
    [actorId, reports],
  )

  const openDraftEditor = useCallback((row: AiReportRecord) => {
    if (row.status !== 'DRAFT') return
    setEditId(row.id)
    setEditBody(row.bodyText)
  }, [])

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
