import type { ShiftStartHandoverFields } from '../types/shiftStartHandover'

export { localCalendarYmd as todayYmd } from '../../shared/date/localCalendarYmd'

export const emptyShiftFields = (): ShiftStartHandoverFields => ({
  representativeNote: '',
  departmentOverview: '',
  facilityInfoAcknowledgement: '',
  precautionsAcknowledgement: '',
  signatureName: '',
})
