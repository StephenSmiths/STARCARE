import { loadShiftStartHandovers } from '../../../services/shiftStartHandoverStorage'
import type { ShiftStartHandoverRecord } from '../types/shiftStartHandover'

export const listSubmittedHistoryForActor = (actorId: string): ShiftStartHandoverRecord[] =>
  loadShiftStartHandovers()
    .filter((r) => r.actorId === actorId && r.status === 'SUBMITTED')
    .sort((a, b) => (b.submittedAt ?? '').localeCompare(a.submittedAt ?? ''))
