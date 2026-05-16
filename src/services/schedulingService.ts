import { recordAuditTrailThenHydrateWithService } from './auditTrailHydrationService'
import { AuditTrailService, globalAuditTrailService } from './auditTrailService'
import { getWeeklyTargetByFundingType, hasUnmetTarget } from './schedulingTargets'
import { executePassAsync, fillWeeklyTargetsAsync } from './schedulingCoreAsync'
import { executePass, fillWeeklyTargets, sortBySC } from './schedulingCore'
import { createPassContext } from './schedulingPassContext'

export type FundingType = 'GradeA_Subsidized' | 'Voucher' | 'Private'
export type ServiceType = 'Subsidized_Rehab' | 'Dementia_Service'
/** 對齊 `staff_profiles.role_type`；活動時段載入時附帶（PDF 02【16】SC 僅治療師） */
export type StaffProfileRoleType = 'PT' | 'OT' | 'PTA' | 'OTA' | 'TeamLead'
export type ConflictType =
  | 'NO_CAPACITY'
  | 'DAILY_LIMIT'
  | 'INTERVAL_LIMIT'
  | 'STAFF_SLOT_DUPLICATED'
  | 'SKILL_MISMATCH'
  | 'NO_ELIGIBLE_SESSION'
  | 'STAFF_GROUP_DAILY_CAP'

export interface SchedulingResident {
  id: string
  name: string
  fundingType: FundingType
  isSpecialCareCase: boolean
  weeklyCompletedCount: number
  lastServiceDate?: string
  assignedDates: string[]
}

export interface SchedulingSession {
  id: string
  staffId: string
  staffName: string
  date: string
  timeSlot: string
  serviceType: ServiceType
  capacity: number
  skillMatched?: boolean
  staffRoleType?: StaffProfileRoleType
  /** 活動時段主檔 id（預覽工作表顯示活動內容；PDF 02【3】§7） */
  activityId?: string
  /** 活動主檔名稱；無則由 catalog 規則於展示層補述 */
  activityName?: string
}

export interface SchedulingAssignment {
  residentId: string
  residentName: string
  sessionId: string
  staffId: string
  pass: 1 | 2 | 3
}

export interface SchedulingConflict {
  residentId: string
  residentName: string
  type: ConflictType
  reason: string
}

export interface SchedulingResult {
  assignments: SchedulingAssignment[]
  conflicts: SchedulingConflict[]
  underTargetResidents: Array<{ residentId: string; residentName: string; missingCount: number }>
}

export interface SchedulingConstraints {
  dailySameServiceLimit: number
  minGapDaysSameService: number
  groupCapacityLimit: number
  /** 與 `scheduling_rules.allow_sc_therapist_only`＋系統設定「SC 僅治療師」合併後傳入；true 時 SC 院友不可使用 PTA／OTA／TeamLead 時段（有職類主檔時） */
  allowScTherapistOnly?: boolean
  /** PDF 02【16】P1：註冊治療師（PT／OT／TeamLead／未標）小組活動（capacity>1）每日互異場次上限；未設定則不限制 */
  therapistGroupSessionsDailyCap?: number
  /** PDF 02【16】P1：治療助理（PTA／OTA）同上 */
  assistantGroupSessionsDailyCap?: number
}

export class SchedulingService {
  private readonly auditTrailService: AuditTrailService

  constructor(auditTrailService: AuditTrailService) {
    this.auditTrailService = auditTrailService
  }

  runSubsidizedRehabScheduling(
    actorId: string,
    residents: SchedulingResident[],
    sessions: SchedulingSession[],
    constraints: SchedulingConstraints = {
      dailySameServiceLimit: 1,
      minGapDaysSameService: 1,
      groupCapacityLimit: Number.POSITIVE_INFINITY,
      allowScTherapistOnly: false,
    },
    options?: { recordAudit?: boolean },
  ): SchedulingResult {
    const context = createPassContext(sessions)
    this.runSubsidizedRehabPasses(residents, sessions, context, constraints)
    return this.finalizeSchedulingRun(actorId, residents, sessions, context, options)
  }

  /** 大量院友／時段時讓出主執行緒，供智能排班乾跑使用 */
  async runSubsidizedRehabSchedulingAsync(
    actorId: string,
    residents: SchedulingResident[],
    sessions: SchedulingSession[],
    constraints: SchedulingConstraints = {
      dailySameServiceLimit: 1,
      minGapDaysSameService: 1,
      groupCapacityLimit: Number.POSITIVE_INFINITY,
      allowScTherapistOnly: false,
    },
    options?: { recordAudit?: boolean },
  ): Promise<SchedulingResult> {
    const context = createPassContext(sessions)
    await this.runSubsidizedRehabPassesAsync(residents, sessions, context, constraints)
    return this.finalizeSchedulingRun(actorId, residents, sessions, context, options)
  }

  private runSubsidizedRehabPasses(
    residents: SchedulingResident[],
    sessions: SchedulingSession[],
    context: ReturnType<typeof createPassContext>,
    constraints: SchedulingConstraints,
  ): void {
    const pass1 = sortBySC(residents.filter((item) => item.fundingType === 'GradeA_Subsidized'))
    const pass2 = sortBySC(residents.filter((item) => item.fundingType === 'Voucher'))
    const pass3Base = [...residents.filter((item) => item.fundingType === 'Private')].sort(
      (a, b) => a.weeklyCompletedCount - b.weeklyCompletedCount,
    )
    // PDF 01 §3.2：Pass 1 甲一 → Pass 2 券 → fillWeeklyTargets（僅甲一／券）→ Pass 3 未達標私位；SC 於 sortBySC 內最高優先。
    executePass(1, pass1, sessions, context, constraints)
    executePass(2, pass2, sessions, context, constraints)
    fillWeeklyTargets(sessions, residents, context, constraints)
    executePass(3, pass3Base, sessions, context, constraints)
  }

  private async runSubsidizedRehabPassesAsync(
    residents: SchedulingResident[],
    sessions: SchedulingSession[],
    context: ReturnType<typeof createPassContext>,
    constraints: SchedulingConstraints,
  ): Promise<void> {
    const pass1 = sortBySC(residents.filter((item) => item.fundingType === 'GradeA_Subsidized'))
    const pass2 = sortBySC(residents.filter((item) => item.fundingType === 'Voucher'))
    const pass3Base = [...residents.filter((item) => item.fundingType === 'Private')].sort(
      (a, b) => a.weeklyCompletedCount - b.weeklyCompletedCount,
    )
    await executePassAsync(1, pass1, context, constraints)
    await executePassAsync(2, pass2, context, constraints)
    await fillWeeklyTargetsAsync(residents, context, constraints)
    await executePassAsync(3, pass3Base, context, constraints)
  }

  private finalizeSchedulingRun(
    actorId: string,
    residents: SchedulingResident[],
    sessions: SchedulingSession[],
    context: ReturnType<typeof createPassContext>,
    options?: { recordAudit?: boolean },
  ): SchedulingResult {
    const underTargetResidents = residents
      .filter(hasUnmetTarget)
      .map((resident) => ({
        residentId: resident.id,
        residentName: resident.name,
        missingCount: getWeeklyTargetByFundingType(resident.fundingType) - resident.weeklyCompletedCount,
      }))

    if (options?.recordAudit !== false) {
      recordAuditTrailThenHydrateWithService(this.auditTrailService, {
        action: 'SCHEDULING_RUN',
        entityType: 'Scheduling',
        entityId: `run-${Date.now()}`,
        actorId,
        beforeState: JSON.stringify({ residentCount: residents.length, sessionCount: sessions.length }),
        afterState: JSON.stringify({
          assignments: context.assignments,
          conflicts: context.conflicts,
          underTargetResidents,
        }),
        detail: '智能排班完成（含衝突檢索）',
        occurredAt: new Date().toISOString(),
      })
    }
    return { assignments: context.assignments, conflicts: context.conflicts, underTargetResidents }
  }
}

export const schedulingService = new SchedulingService(globalAuditTrailService)
