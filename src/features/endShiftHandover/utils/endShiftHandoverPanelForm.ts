import type { EndShiftHandoverFields } from '../types/endShiftHandover'

export { localCalendarYmd as todayYmd } from '../../shared/date/localCalendarYmd'

export const emptyEndShiftFields = (): EndShiftHandoverFields => ({
  dataOverview: '',
  followUps: '',
  newItems: '',
  reminders: '',
  reportSummary: '',
  signatureName: '',
})
