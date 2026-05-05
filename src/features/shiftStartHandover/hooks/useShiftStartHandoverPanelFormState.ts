import { useCallback, useState } from 'react'
import type { ShiftStartHandoverFields, ShiftStartHandoverRecord } from '../types/shiftStartHandover'
import { emptyShiftFields, todayYmd } from '../utils/shiftStartHandoverPanelForm'

/** 開工接更：側欄日期／欄位／編輯列 id（PDF 02【5b】）。 */
export const useShiftStartHandoverPanelFormState = () => {
  const [shiftDate, setShiftDate] = useState(todayYmd())
  const [fields, setFields] = useState<ShiftStartHandoverFields>(() => emptyShiftFields())
  const [editingId, setEditingId] = useState<string | null>(null)

  const patchField = useCallback((key: keyof ShiftStartHandoverFields, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }))
  }, [])

  const loadRow = useCallback((row: ShiftStartHandoverRecord) => {
    setEditingId(row.id)
    setShiftDate(row.shiftDate)
    setFields({
      representativeNote: row.representativeNote,
      departmentOverview: row.departmentOverview,
      facilityInfoAcknowledgement: row.facilityInfoAcknowledgement,
      precautionsAcknowledgement: row.precautionsAcknowledgement,
      signatureName: row.signatureName,
    })
  }, [])

  const resetEmpty = useCallback(() => {
    setEditingId(null)
    setShiftDate(todayYmd())
    setFields(emptyShiftFields())
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
