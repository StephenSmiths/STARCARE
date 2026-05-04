import { globalAuditTrailService } from './auditTrailService'
import { createActivitySessionRepository, type ActivitySession } from '../repositories/activitySessionRepository'

const repository = createActivitySessionRepository()

const skipRemoteActivitySessionAuditPersist = (): boolean => {
  const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env ?? {}
  return !!(env.VITE_SUPABASE_URL && env.VITE_SUPABASE_ANON_KEY)
}

export class ActivitySessionManagementService {
  async listActivitySessions(facilityId = 'facility-main'): Promise<ActivitySession[]> {
    return repository.listActivitySessions({ facilityId })
  }

  async softDeleteActivitySession(actorId: string, session: ActivitySession): Promise<void> {
    await repository.softDeleteActivitySession(session.id)
    globalAuditTrailService.record(
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
      skipRemoteActivitySessionAuditPersist(),
    )
  }
}

export const activitySessionManagementService = new ActivitySessionManagementService()
