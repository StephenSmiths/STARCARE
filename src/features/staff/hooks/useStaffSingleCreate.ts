import { useCallback, useRef, useState } from 'react'
import type { StaffCreatePayload } from '../../../repositories/staffCreateRepository'
import { staffCreateService } from '../../../services/staffCreateService'

const emptyForm = () => ({
  id: '',
  displayName: '',
  roleType: '' as '' | StaffCreatePayload['roleType'],
  gender: '' as '' | StaffCreatePayload['gender'],
  phone: '',
  email: '',
})

export type StaffSingleCreateFormState = ReturnType<typeof emptyForm>

export const useStaffSingleCreate = (onSuccess?: () => void) => {
  const lockRef = useRef(false)
  const [form, setForm] = useState(emptyForm)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = useCallback(
    async (actorId: string) => {
      if (lockRef.current) return
      setErrorMessage('')
      setSuccessMessage('')
      if (!form.displayName.trim()) {
        setErrorMessage('請填寫姓名。')
        return
      }
      if (!form.roleType) {
        setErrorMessage('請選擇職位。')
        return
      }
      if (!form.gender) {
        setErrorMessage('請選擇性別。')
        return
      }
      lockRef.current = true
      setIsSubmitting(true)
      try {
        const payload: StaffCreatePayload = {
          actorId,
          id: form.id.trim() || undefined,
          displayName: form.displayName.trim(),
          roleType: form.roleType,
          gender: form.gender,
          phone: form.phone.trim(),
          email: form.email.trim(),
        }
        const { id } = await staffCreateService.createStaff(payload)
        setSuccessMessage(`已新增員工（${id}）。`)
        setForm(emptyForm())
        onSuccess?.()
      } catch (e) {
        setErrorMessage(e instanceof Error ? e.message : '新增失敗')
      } finally {
        lockRef.current = false
        setIsSubmitting(false)
      }
    },
    [form, onSuccess],
  )

  return { form, setForm, submit, errorMessage, successMessage, isSubmitting }
}
