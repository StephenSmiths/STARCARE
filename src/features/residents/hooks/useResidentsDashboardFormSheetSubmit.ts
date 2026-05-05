import { useCallback, useRef, useState, type FormEvent } from 'react'
import type { ResidentInput } from '../types/resident'

type Params = {
  canMaintainResidentRecords: boolean
  actorId: string
  editingId: string | null
  form: ResidentInput
  createResident: (actorId: string, input: ResidentInput) => Promise<void>
  updateResident: (actorId: string, id: string, input: ResidentInput) => Promise<void>
  resetForm: () => void
  setFormSheetOpen: (open: boolean) => void
}

/** 院友表單送出：防重覆提交鎖（業務 PDF）與建立／更新分流。 */
export const useResidentsDashboardFormSheetSubmit = ({
  canMaintainResidentRecords,
  actorId,
  editingId,
  form,
  createResident,
  updateResident,
  resetForm,
  setFormSheetOpen,
}: Params) => {
  const [isSubmittingResident, setIsSubmittingResident] = useState(false)
  const residentSubmitLockRef = useRef(false)

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      if (!canMaintainResidentRecords) return
      if (residentSubmitLockRef.current) return
      residentSubmitLockRef.current = true
      setIsSubmittingResident(true)
      try {
        if (editingId) {
          await updateResident(actorId, editingId, form)
        } else {
          await createResident(actorId, form)
        }
        resetForm()
        setFormSheetOpen(false)
      } finally {
        residentSubmitLockRef.current = false
        setIsSubmittingResident(false)
      }
    },
    [
      actorId,
      canMaintainResidentRecords,
      createResident,
      editingId,
      form,
      resetForm,
      setFormSheetOpen,
      updateResident,
    ],
  )

  return { handleSubmit, isSubmittingResident }
}
