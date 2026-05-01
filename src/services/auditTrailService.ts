export interface AuditTrailRecord {
  action:
    | 'CREATE'
    | 'UPDATE'
    | 'SOFT_DELETE'
    | 'SCHEDULING_RUN'
    | 'SCHEDULE_BATCH_SAVE'
    | 'COMPLIANCE_ALERT_EXPORT'
    /** PDF 02【13】員工概覽匯出（CSV） */
    | 'STAFF_EXPORT'
    /** PDF 02【12】院友名單匯出（CSV） */
    | 'RESIDENTS_EXPORT'
    /** PDF 02【11】Team Lead AI 報告中心 */
    | 'AI_REPORT_CENTER_DRAFT_CREATE'
    | 'AI_REPORT_CENTER_BODY_SAVE'
    | 'AI_REPORT_CENTER_ADOPT'
    | 'AI_REPORT_CENTER_DISTRIBUTE'
    /** PDF 02【10】已核准服務紀錄匯出（CSV） */
    | 'HISTORICAL_DOCUMENTS_EXPORT'
    | 'ASSESSMENT_DUE_EXPORT'
    /** PDF 02【9】評估完成紀錄（PT／OT 版本） */
    | 'ASSESSMENT_COMPLETION_RECORD'
    /** PDF 02【2】工作計劃批量發布活動時段 */
    | 'WORK_PLAN_SESSION_COMMIT'
    /** PDF 02【4】／01 §2.1 工作節接收／拒絕／主管批量軟刪 */
    | 'WORK_SESSION_ACCEPT'
    | 'WORK_SESSION_REJECT'
    | 'WORK_SESSION_TEAM_BULK_SOFT_DELETE'
    /** 01 §2.2 服務表單（Seq 17） */
    | 'FORM_DRAFT_UPSERT'
    | 'FORM_SUBMIT'
    | 'FORM_APPROVE'
    | 'FORM_REJECT_REVISION'
    /** PDF 02【5b】開工接更 */
    | 'SHIFT_START_HANDOVER_DRAFT_UPSERT'
    | 'SHIFT_START_HANDOVER_SUBMIT'
    /** PDF 02【6】收工交更 */
    | 'SHIFT_END_HANDOVER_DRAFT_UPSERT'
    | 'SHIFT_END_HANDOVER_SUBMIT'
    /** PDF 02【16】Seq 29：系統設定儲存（本地暫存／後端待接） */
    | 'SYSTEM_SETTINGS_SAVE'
  entityType: 'Resident' | 'Staff' | 'Scheduling' | 'Reporting'
  entityId: string
  actorId: string
  beforeState: string | null
  afterState: string | null
  detail: string
  occurredAt: string
}

export class AuditTrailService {
  private readonly records: AuditTrailRecord[] = []

  record(event: AuditTrailRecord): void {
    this.records.unshift(event)
  }

  list(): AuditTrailRecord[] {
    return [...this.records]
  }
}

/** 全應用共用審計實例，確保院友與排班寫入同一軌跡 */
export const globalAuditTrailService = new AuditTrailService()
