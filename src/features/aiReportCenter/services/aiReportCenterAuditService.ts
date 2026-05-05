import { recordAuditTrailThenHydrate } from '../../../services/auditTrailHydrationService'

/** PDF 02【11】AI 報告中心審計（本機草稿流程） */

export const recordAiReportDraftCreateAudit = (
  actorId: string,
  id: string,
  title: string,
): void => {
  recordAuditTrailThenHydrate({
    action: 'AI_REPORT_CENTER_DRAFT_CREATE',
    entityType: 'Reporting',
    entityId: id,
    actorId,
    beforeState: null,
    afterState: JSON.stringify({ title }),
    detail: `AI 報告草稿建立：${title}`,
    occurredAt: new Date().toISOString(),
  })
}

export const recordAiReportDraftBodySaveAudit = (
  actorId: string,
  id: string,
  bodyLength: number,
): void => {
  recordAuditTrailThenHydrate({
    action: 'AI_REPORT_CENTER_BODY_SAVE',
    entityType: 'Reporting',
    entityId: id,
    actorId,
    beforeState: null,
    afterState: JSON.stringify({ length: bodyLength }),
    detail: 'AI 報告草稿內容更新',
    occurredAt: new Date().toISOString(),
  })
}

export const recordAiReportAdoptAudit = (actorId: string, id: string): void => {
  recordAuditTrailThenHydrate({
    action: 'AI_REPORT_CENTER_ADOPT',
    entityType: 'Reporting',
    entityId: id,
    actorId,
    beforeState: JSON.stringify({ status: 'DRAFT' }),
    afterState: JSON.stringify({ status: 'ADOPTED' }),
    detail: 'AI 報告採用為正式版本',
    occurredAt: new Date().toISOString(),
  })
}

export const recordAiReportDistributeAudit = (actorId: string, id: string): void => {
  recordAuditTrailThenHydrate({
    action: 'AI_REPORT_CENTER_DISTRIBUTE',
    entityType: 'Reporting',
    entityId: id,
    actorId,
    beforeState: JSON.stringify({ status: 'ADOPTED' }),
    afterState: JSON.stringify({ status: 'DISTRIBUTED' }),
    detail: 'AI 報告發放（占位：待接通知／對象清單）',
    occurredAt: new Date().toISOString(),
  })
}
