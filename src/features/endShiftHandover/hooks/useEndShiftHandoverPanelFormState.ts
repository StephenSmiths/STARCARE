import { useCallback, useState } from 'react'
import type { EndShiftHandoverFields, EndShiftHandoverRecord } from '../types/endShiftHandover'
import { emptyEndShiftFields, todayYmd } from '../utils/endShiftHandoverPanelForm'

/** 收工交更：側欄日期／欄位／編輯列 id（PDF 02【6】）。 */
export const useEndShiftHandoverPanelFormState = () => {
  const [shiftDate, setShiftDate] = useState(todayYmd())
  const [fields, setFields] = useState<EndShiftHandoverFields>(() => emptyEndShiftFields())
  const [editingId, setEditingId] = useState<string | null>(null)

  const patchField = useCallback((key: keyof EndShiftHandoverFields, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }))
  }, [])

  const loadRow = useCallback((row: EndShiftHandoverRecord) => {
    setEditingId(row.id)
    setShiftDate(row.shiftDate)
    setFields({
      dataOverview: row.dataOverview,
      followUps: row.followUps,
      newItems: row.newItems,
      reminders: row.reminders,
      reportSummary: row.reportSummary,
      signatureName: row.signatureName,
    })
  }, [])

  const resetEmpty = useCallback(() => {
    setEditingId(null)
    setShiftDate(todayYmd())
    setFields(emptyEndShiftFields())
  }, [])

  return {
    shiftDate,
    setShiftDate,
    fields,
    editingId,
    setEditingId,
    patchField,
    loadRow,
    resetEmpty,
  }
}
