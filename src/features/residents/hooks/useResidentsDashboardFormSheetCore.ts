import { useCallback, useMemo, useState } from 'react'
import type { Resident, ResidentInput } from '../types/resident'
import { RESIDENT_DASHBOARD_DEFAULT_FORM } from '../constants/residentsDashboardDefaultForm'
import { mapResidentToDashboardFormInput } from '../utils/mapResidentToDashboardFormInput'

/** 院友總覽表單抽屜：欄位狀態、標題文案、開關與重置（不含送出鎖）。 */
export const useResidentsDashboardFormSheetCore = (
  residents: Resident[],
  canMaintainResidentRecords: boolean,
) => {
  const [form, setForm] = useState<ResidentInput>(RESIDENT_DASHBOARD_DEFAULT_FORM)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formSheetOpen, setFormSheetOpen] = useState(false)

  const submitLabel = useMemo(() => (editingId ? '儲存修改' : '新增院友'), [editingId])
  const formSheetTitle = useMemo(() => (editingId ? '編輯院友資料' : '新增個別院友'), [editingId])

  const resetForm = useCallback(() => {
    setEditingId(null)
    setForm(RESIDENT_DASHBOARD_DEFAULT_FORM)
  }, [])

  const fillForm = useCallback(
    (residentId: string) => {
      const selected = residents.find((resident) => resident.id === residentId)
      if (!selected) return
      setEditingId(selected.id)
      setForm(mapResidentToDashboardFormInput(selected))
    },
    [residents],
  )

  const closeFormSheet = useCallback(() => {
    setFormSheetOpen(false)
    resetForm()
  }, [resetForm])

  const openCreateResidentSheet = useCallback(() => {
    if (!canMaintainResidentRecords) return
    resetForm()
    setFormSheetOpen(true)
  }, [canMaintainResidentRecords, resetForm])

  const openEditResidentSheet = useCallback(
    (residentId: string) => {
      if (!canMaintainResidentRecords) return
      fillForm(residentId)
      setFormSheetOpen(true)
    },
    [canMaintainResidentRecords, fillForm],
  )

  return {
    form,
    setForm,
    editingId,
    formSheetOpen,
    setFormSheetOpen,
    submitLabel,
    formSheetTitle,
    resetForm,
    closeFormSheet,
    openCreateResidentSheet,
    openEditResidentSheet,
  }
}
