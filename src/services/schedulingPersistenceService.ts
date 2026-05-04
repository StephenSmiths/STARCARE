import { hydrateAuditTrailFromRemote } from './auditTrailHydrationService'
import { globalAuditTrailService } from './auditTrailService'
import { writeLastSchedulingBatchId } from './schedulingLastBatchStorage'
import type { SchedulingAssignment, SchedulingConflict } from './schedulingService'
import {
  createScheduleAssignmentRepository,
  type ScheduleAssignmentRepository,
} from '../repositories/scheduleAssignmentRepository'
import { isSupabaseBrowserConfigured } from './supabaseBrowserEnv'

/** 將排班結果批量持久化並寫入審計軌跡 */
export class SchedulingPersistenceService {
  private readonly repository: ScheduleAssignmentRepository
  private readonly inFlightKeys = new Set<string>()

  constructor(repository: ScheduleAssignmentRepository) {
    this.repository = repository
  }

  async saveScheduleAssignments(
    actorId: string,
    assignments: SchedulingAssignment[],
    conflicts: SchedulingConflict[],
  ): Promise<void> {
    if (assignments.length === 0) {
      throw new Error('沒有可儲存的排班結果')
    }
    if (conflicts.length > 0) {
      throw new Error('仍有排班衝突，無法儲存。請調整後重新執行智能排班。')
    }
    const key = `schedule-save:${actorId}`
    if (this.inFlightKeys.has(key)) {
      throw new Error('請勿重覆提交，系統仍在儲存中')
    }
    this.inFlightKeys.add(key)
    try {
      const batchId = `batch-${crypto.randomUUID()}`
      const rows = assignments.map((a) => ({
        resident_id: a.residentId,
        session_id: a.sessionId,
        staff_id: a.staffId,
        pass: a.pass,
        service_type: 'Subsidized_Rehab',
        actor_id: actorId,
        batch_id: batchId,
      }))
      await this.repository.saveBatch(rows)
      writeLastSchedulingBatchId(batchId)
      if (isSupabaseBrowserConfigured()) {
        await hydrateAuditTrailFromRemote()
      } else {
        globalAuditTrailService.record({
          action: 'SCHEDULE_BATCH_SAVE',
          entityType: 'Scheduling',
          entityId: batchId,
          actorId,
          beforeState: null,
          afterState: JSON.stringify({ count: assignments.length, batchId, assignments }),
          detail: '一鍵儲存：批量寫入 scheduling_history（demo／本機模擬）',
          occurredAt: new Date().toISOString(),
        })
      }
    } finally {
      this.inFlightKeys.delete(key)
    }
  }
}

export const schedulingPersistenceService = new SchedulingPersistenceService(
  createScheduleAssignmentRepository(),
)
