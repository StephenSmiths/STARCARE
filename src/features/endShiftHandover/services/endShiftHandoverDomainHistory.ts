import { loadEndShiftHandovers } from '../../../services/endShiftHandoverStorage'
import type { EndShiftHandoverRecord } from '../types/endShiftHandover'

export const listSubmittedEndHistoryForActor = (actorId: string): EndShiftHandoverRecord[] =>
  loadEndShiftHandovers()
    .filter((r) => r.actorId === actorId && r.status === 'SUBMITTED')
    .sort((a, b) => (b.submittedAt ?? '').localeCompare(a.submittedAt ?? ''))
