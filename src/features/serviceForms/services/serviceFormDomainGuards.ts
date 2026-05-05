import type { SchedulingSession } from '../../../services/schedulingService'
import { resolveLifecycleStatus } from '../../workSessionPlans/services/workSessionPlanService'
import type { ServiceFormRecord } from '../types/serviceForm'

/** 01 §2.1：僅 ACCEPTED 之工作節可提交服務表單 */
export const assertSessionAcceptedForSubmit = (sessionId: string): void => {
  if (resolveLifecycleStatus(sessionId) !== 'ACCEPTED') {
    throw new Error('01 §2.1：僅「已接收」工作節可提交服務表單')
  }
}

/** 員工只能為本人指派之工作節填寫 */
export const assertStaffOwnsSession = (
  session: SchedulingSession,
  staffProfileId: string | null,
): void => {
  if (!staffProfileId || session.staffId !== staffProfileId) {
    throw new Error('僅可為本人指派之工作節填寫表單')
  }
}

/** 01 §2.2：核准後鎖定 */
export const assertFormEditable = (form: ServiceFormRecord): void => {
  if (form.status === 'APPROVED') throw new Error('表單已核准並鎖定，不得修改')
  if (form.status === 'SUBMITTED') throw new Error('已提交待審，請等待主管審核或退回後再編輯')
}
