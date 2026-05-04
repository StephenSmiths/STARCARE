/** 01 §2.2：依狀態轉換對齊前端 `serviceFormDomainService` 審計 action（Seq 17） */
import type { ServiceFormApiRecord } from './serviceFormMapping.ts'

export type ServiceFormUpsertAuditPlan = {
  action: string
  detail: string
  beforeState: string | null
  afterState: string
}

export const deriveServiceFormUpsertAudit = (
  prev: ServiceFormApiRecord | null,
  next: ServiceFormApiRecord,
): ServiceFormUpsertAuditPlan => {
  const ps = prev?.status ?? null
  const ns = next.status

  if (ps === 'SUBMITTED' && ns === 'APPROVED') {
    return {
      action: 'FORM_APPROVE',
      detail: '核准服務表單（已鎖定）',
      beforeState: JSON.stringify({ status: 'SUBMITTED' }),
      afterState: JSON.stringify({ status: 'APPROVED' }),
    }
  }
  if (ps === 'SUBMITTED' && ns === 'REJECTED_NEEDS_REVISION') {
    const note = next.reviewNote ?? ''
    return {
      action: 'FORM_REJECT_REVISION',
      detail: '退回服務表單待重改',
      beforeState: JSON.stringify({ status: 'SUBMITTED' }),
      afterState: JSON.stringify({ status: 'REJECTED_NEEDS_REVISION', reviewNote: note }),
    }
  }
  if (ns === 'SUBMITTED' && ps !== 'SUBMITTED') {
    return {
      action: 'FORM_SUBMIT',
      detail: '提交服務表單待審',
      beforeState: ps ? JSON.stringify({ status: ps }) : null,
      afterState: JSON.stringify({ status: 'SUBMITTED' }),
    }
  }
  if (ps === 'SUBMITTED' && ns === 'SUBMITTED') {
    return {
      action: 'FORM_SUBMIT',
      detail: '同步已提交服務表單',
      beforeState: JSON.stringify({ status: 'SUBMITTED' }),
      afterState: JSON.stringify({ status: 'SUBMITTED', sessionId: next.sessionId }),
    }
  }

  return {
    action: 'FORM_DRAFT_UPSERT',
    detail: '儲存服務表單草稿',
    beforeState: prev ? JSON.stringify({ status: prev.status }) : null,
    afterState: JSON.stringify({ status: ns, sessionId: next.sessionId }),
  }
}
