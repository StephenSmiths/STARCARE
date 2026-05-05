import { useCallback, useState } from 'react'
import type { StaffOverviewRow } from '../../staff/services/staffManagementService'
import { validateWorkPlanDraftLine, type WorkPlanDraftLine } from '../services/workPlanDraftService'
import { workPlanComposerTodayYmd } from '../utils/workPlanComposerLocalDate'

/** PDF 02【2】草稿列與主表欄位（不含提交）。 */
export const useWorkPlanComposerFormState = (staffRows: StaffOverviewRow[]) => {
  const [drafts, setDrafts] = useState<WorkPlanDraftLine[]>([])
  const [sessionDate, setSessionDate] = useState(workPlanComposerTodayYmd)
  const [staffProfileId, setStaffProfileId] = useState('')
  const [timeSlot, setTimeSlot] = useState('09:00')
  const [capacity, setCapacity] = useState(1)
  const [serviceType, setServiceType] = useState<WorkPlanDraftLine['serviceType']>('Subsidized_Rehab')
  const [formError, setFormError] = useState('')

  const staffDisplayName = staffRows.find((row) => row.staffId === staffProfileId)?.staffName ?? ''

  const addDraft = useCallback(() => {
    setFormError('')
    const line: WorkPlanDraftLine = {
      sessionDate,
      staffProfileId,
      staffDisplayName,
      timeSlot,
      capacity,
      serviceType,
    }
    const err = validateWorkPlanDraftLine(line)
    if (err) {
      setFormError(err)
      return
    }
    setDrafts((prev) => [...prev, line])
  }, [capacity, serviceType, sessionDate, staffDisplayName, staffProfileId, timeSlot])

  const removeDraft = useCallback((index: number) => {
    setDrafts((prev) => prev.filter((_, i) => i !== index))
  }, [])

  return {
    drafts,
    setDrafts,
    sessionDate,
    setSessionDate,
    staffProfileId,
    setStaffProfileId,
    timeSlot,
    setTimeSlot,
    capacity,
    setCapacity,
    serviceType,
    setServiceType,
    formError,
    addDraft,
    removeDraft,
  }
}
