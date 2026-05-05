import { useCallback, useRef, useState } from 'react'
import { loadEndShiftHandovers } from '../../../services/endShiftHandoverStorage'
import { useAuthActorId } from '../../auth'
import {
  listSubmittedEndHistoryForActor,
  submitEndShiftHandover,
  upsertEndShiftHandoverDraft,
} from '../services/endShiftHandoverDomainService'
import type { EndShiftHandoverFields, EndShiftHandoverRecord } from '../types/endShiftHandover'

export type EndShiftHandoverWorkspace = {
  actorId: string
  records: EndShiftHandoverRecord[]
  submittedHistory: EndShiftHandoverRecord[]
  saveDraft: (
    shiftDate: string,
    fields: EndShiftHandoverFields,
    editingId: string | null,
  ) => EndShiftHandoverRecord
  submitRecord: (record: EndShiftHandoverRecord) => void
  refresh: () => void
}

/** PDF 02【6】收工交更：單次操作鎖避免重覆提交 */
export const useEndShiftHandoverWorkspace = (): EndShiftHandoverWorkspace => {
  const actorId = useAuthActorId()
  const [records, setRecords] = useState<EndShiftHandoverRecord[]>(() => loadEndShiftHandovers())
  const busyRef = useRef(false)

  const refresh = useCallback(() => setRecords(loadEndShiftHandovers()), [])

  const submittedHistory = listSubmittedEndHistoryForActor(actorId)

  const saveDraft = useCallback(
    (shiftDate: string, fields: EndShiftHandoverFields, editingId: string | null) => {
      if (busyRef.current) throw new Error('請勿重覆提交')
      busyRef.current = true
      try {
        const row = upsertEndShiftHandoverDraft(actorId, shiftDate, fields, editingId)
        refresh()
        return row
      } finally {
        busyRef.current = false
      }
    },
    [actorId, refresh],
  )

  const submitRecord = useCallback(
    (record: EndShiftHandoverRecord) => {
      if (busyRef.current) throw new Error('請勿重覆提交')
      busyRef.current = true
      try {
        submitEndShiftHandover(actorId, record)
        refresh()
      } finally {
        busyRef.current = false
      }
    },
    [actorId, refresh],
  )

  return {
    actorId,
    records,
    submittedHistory,
    saveDraft,
    submitRecord,
    refresh,
  }
}
