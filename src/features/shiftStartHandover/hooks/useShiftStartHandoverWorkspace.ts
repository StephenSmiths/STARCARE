import { useCallback, useRef, useState } from 'react'
import { hydrateAuditTrailAfterLocalRecord } from '../../../services/auditTrailHydrationService'
import { loadShiftStartHandovers } from '../../../services/shiftStartHandoverStorage'
import { useAuthActorId } from '../../auth'
import {
  listSubmittedHistoryForActor,
  submitShiftStartHandover,
  upsertShiftStartHandoverDraft,
} from '../services/shiftStartHandoverDomainService'
import type { ShiftStartHandoverFields, ShiftStartHandoverRecord } from '../types/shiftStartHandover'

export type ShiftStartHandoverWorkspace = {
  actorId: string
  records: ShiftStartHandoverRecord[]
  submittedHistory: ShiftStartHandoverRecord[]
  saveDraft: (
    shiftDate: string,
    fields: ShiftStartHandoverFields,
    editingId: string | null,
  ) => ShiftStartHandoverRecord
  submitRecord: (record: ShiftStartHandoverRecord) => void
  refresh: () => void
}

/** PDF 02【5b】開工接更：載入紀錄、單次操作鎖避免重覆提交 */
export const useShiftStartHandoverWorkspace = (): ShiftStartHandoverWorkspace => {
  const actorId = useAuthActorId()
  const [records, setRecords] = useState<ShiftStartHandoverRecord[]>(() => loadShiftStartHandovers())
  const busyRef = useRef(false)

  const refresh = useCallback(() => setRecords(loadShiftStartHandovers()), [])

  const submittedHistory = listSubmittedHistoryForActor(actorId)

  const saveDraft = useCallback(
    (shiftDate: string, fields: ShiftStartHandoverFields, editingId: string | null) => {
      if (busyRef.current) throw new Error('請勿重覆提交')
      busyRef.current = true
      try {
        const row = upsertShiftStartHandoverDraft(actorId, shiftDate, fields, editingId)
        refresh()
        hydrateAuditTrailAfterLocalRecord()
        return row
      } finally {
        busyRef.current = false
      }
    },
    [actorId, refresh],
  )

  const submitRecord = useCallback(
    (record: ShiftStartHandoverRecord) => {
      if (busyRef.current) throw new Error('請勿重覆提交')
      busyRef.current = true
      try {
        submitShiftStartHandover(actorId, record)
        refresh()
        hydrateAuditTrailAfterLocalRecord()
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
