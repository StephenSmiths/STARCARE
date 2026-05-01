import type { EndShiftHandoverFields } from '../types/endShiftHandover'

export const todayYmd = (): string => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export const emptyEndShiftFields = (): EndShiftHandoverFields => ({
  dataOverview: '',
  followUps: '',
  newItems: '',
  reminders: '',
  reportSummary: '',
  signatureName: '',
})
