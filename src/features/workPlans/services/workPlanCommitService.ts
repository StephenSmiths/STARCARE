import { globalAuditTrailService } from '../../../services/auditTrailService'
import { createActivityRepository, type ActivityRepository } from '../../../repositories/activityRepository'
import {
  createActivitySessionImportRepository,
  type ActivitySessionImportRepository,
} from '../../../repositories/activitySessionImportRepository'
import {
  buildActivitySessionImportRows,
  type WorkPlanDraftLine,
} from './workPlanDraftService'

/**
 * PDF 02【2】儲存即發布：經預檢後批量 INSERT activity_sessions（Seq 14）。
 */
export class WorkPlanCommitService {
  private readonly activitiesRepo: ActivityRepository
  private readonly sessionImporter: ActivitySessionImportRepository

  constructor(activitiesRepo: ActivityRepository, sessionImporter: ActivitySessionImportRepository) {
    this.activitiesRepo = activitiesRepo
    this.sessionImporter = sessionImporter
  }

  async commitWorkPlanDrafts(
    actorId: string,
    facilityId: string,
    lines: WorkPlanDraftLine[],
  ): Promise<{ inserted: number; sessionIds: string[] }> {
    if (lines.length === 0) throw new Error('預覽列表為空，無法儲存')
    const activities = await this.activitiesRepo.listActivities(facilityId)
    const built = buildActivitySessionImportRows(lines, activities, facilityId)
    if (!built.ok) throw new Error(built.message)

    const validated = await this.sessionImporter.validateRows(built.rows)
    if (!validated.ok || validated.preview.length === 0) {
      const msg = validated.errors.map((e) => `${e.rowIndex}:${e.field} ${e.message}`).join('; ')
      throw new Error(msg || '預檢未通過')
    }

    const committed = await this.sessionImporter.commitRows(actorId, validated.preview)
    if (!committed.ok) throw new Error('儲存失敗')

    globalAuditTrailService.record({
      action: 'WORK_PLAN_SESSION_COMMIT',
      entityType: 'Scheduling',
      entityId: `work-plan-${Date.now()}`,
      actorId,
      beforeState: null,
      afterState: JSON.stringify({ inserted: committed.inserted, sessionIds: committed.sessionIds }),
      detail: `工作計劃：批量發布 ${committed.inserted} 個活動時段`,
      occurredAt: new Date().toISOString(),
    })

    return { inserted: committed.inserted, sessionIds: committed.sessionIds }
  }
}

export const workPlanCommitService = new WorkPlanCommitService(
  createActivityRepository(),
  createActivitySessionImportRepository(),
)
