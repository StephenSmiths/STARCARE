import { AuditTrailService, globalAuditTrailService } from './auditTrailService'
import { getWeeklyTargetByFundingType, hasUnmetTarget } from './schedulingTargets'
import { executePass, fillWeeklyTargets, sortBySC } from './schedulingCore'

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
    const context = {
      assignments: [] as SchedulingAssignment[],
      conflicts: [] as SchedulingConflict[],
      sessionUsage: new Map<string, number>(),
      staffSlotSet: new Set<string>(),
    }

    const pass1 = sortBySC(residents.filter((item) => item.fundingType === 'GradeA_Subsidized'))
    const pass2 = sortBySC(residents.filter((item) => item.fundingType === 'Voucher'))
    const pass3Base = [...residents.filter((item) => item.fundingType === 'Private')].sort(
      (a, b) => a.weeklyCompletedCount - b.weeklyCompletedCount,
    )

    // PDF 01 §3.2：Pass 1 甲一（EA1）→ Pass 2 院舍券 → fillWeeklyTargets 補週標 → Pass 3 私位；SC 於 sortBySC 內最高優先。
    executePass(1, pass1, sessions, context, constraints)
    executePass(2, pass2, sessions, context, constraints)
    fillWeeklyTargets(sessions, residents, context, constraints)
    executePass(3, pass3Base, sessions, context, constraints)

    const underTargetResidents = residents
      .filter(hasUnmetTarget)
      .map((resident) => ({
        residentId: resident.id,
        residentName: resident.name,
        missingCount: getWeeklyTargetByFundingType(resident.fundingType) - resident.weeklyCompletedCount,
      }))

    if (options?.recordAudit !== false) {
      this.auditTrailService.record({
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
