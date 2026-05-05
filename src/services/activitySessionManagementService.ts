import { STARCARE_DEFAULT_FACILITY_ID } from '../constants/starcareDefaultFacilityId'
import { createActivitySessionRepository, type ActivitySession } from '../repositories/activitySessionRepository'
import { recordAuditTrailThenHydrate } from './auditTrailHydrationService'
import { isSupabaseBrowserConfigured } from './supabaseBrowserEnv'

const repository = createActivitySessionRepository()

export class ActivitySessionManagementService {
  async listActivitySessions(facilityId: string = STARCARE_DEFAULT_FACILITY_ID): Promise<ActivitySession[]> {
    return repository.listActivitySessions({ facilityId })
  }

  async softDeleteActivitySession(actorId: string, session: ActivitySession): Promise<void> {
    await repository.softDeleteActivitySession(session.id)
    recordAuditTrailThenHydrate(
      {
        action: 'SOFT_DELETE',
        entityType: 'Scheduling',
        entityId: session.id,
        actorId,
        beforeState: JSON.stringify({ ...session, isDeleted: false }),
        afterState: JSON.stringify({ ...session, isDeleted: true }),
        detail: '軟刪除活動時段',
        occurredAt: new Date().toISOString(),
      },
      isSupabaseBrowserConfigured(),
    )
  }
}

export const activitySessionManagementService = new ActivitySessionManagementService()
