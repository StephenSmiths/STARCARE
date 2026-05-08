import { createStaffCreateRepository, type StaffCreatePayload } from '../repositories/staffCreateRepository'
import { hydrateAuditTrailAfterLocalRecord } from './auditTrailHydrationService'

const repository = createStaffCreateRepository()

export const staffCreateService = {
  async createStaff(payload: StaffCreatePayload): Promise<{ ok: true; id: string }> {
    const result = await repository.createStaff(payload)
    hydrateAuditTrailAfterLocalRecord()
    return result
  },
}
