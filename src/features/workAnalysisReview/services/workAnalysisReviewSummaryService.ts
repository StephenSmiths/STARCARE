import type { ServiceFormRecord } from '../../serviceForms/types/serviceForm'

/** PDF 02【7】提交概況（依本地 serviceForms 聚合） */
export type FormSubmissionOverview = {
  total: number
  draft: number
  submitted: number
  approved: number
  rejectedNeedsRevision: number
  /** 目前有待審表單之填表人數（distinct ownerActorId） */
  pendingOwnerCount: number
}

/** 由表單列表計算各狀態筆數（無 I/O） */
export const buildFormSubmissionOverview = (forms: ServiceFormRecord[]): FormSubmissionOverview => {
  let draft = 0
  let submitted = 0
  let approved = 0
  let rejectedNeedsRevision = 0
  const pendingOwners = new Set<string>()
  for (const row of forms) {
    if (row.status === 'DRAFT') draft += 1
    else if (row.status === 'SUBMITTED') {
      submitted += 1
      pendingOwners.add(row.ownerActorId)
    } else if (row.status === 'APPROVED') approved += 1
    else rejectedNeedsRevision += 1
  }
  return {
    total: forms.length,
    draft,
    submitted,
    approved,
    rejectedNeedsRevision,
    pendingOwnerCount: pendingOwners.size,
  }
}

/** 團隊報告用純文字摘要（剪貼簿／備存） */
export const buildTeamReportPlainText = (
  overview: FormSubmissionOverview,
  pending: Pick<ServiceFormRecord, 'sessionDate' | 'residentName' | 'ownerActorId' | 'narrative'>[],
): string => {
  const header = `【STARCARE 表單提交概況】\n總筆數 ${overview.total}｜草稿 ${overview.draft}｜待審 ${overview.submitted}｜已核准 ${overview.approved}｜退回 ${overview.rejectedNeedsRevision}｜待審涉及填表人 ${overview.pendingOwnerCount} 人\n`
  if (pending.length === 0) return `${header}\n（無待審項目）\n`
  const lines = pending.map(
    (row, idx) =>
      `${idx + 1}. ${row.sessionDate} ${row.residentName}｜填表 ${row.ownerActorId.slice(0, 8)}…\n   ${row.narrative.slice(0, 200)}${row.narrative.length > 200 ? '…' : ''}`,
  )
  return `${header}\n【待審清單】\n${lines.join('\n')}\n`
}
