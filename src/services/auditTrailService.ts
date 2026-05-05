import { mergeRemoteAuditTrail } from './auditTrailMergeUtils'

export interface AuditTrailRecord {
  action:
    | 'CREATE'
    | 'UPDATE'
    | 'SOFT_DELETE'
    | 'SCHEDULING_RUN'
    | 'SCHEDULE_BATCH_SAVE'
    /** 01 §5：scheduling_history 依 batch 軟刪（Seq 10） */
    | 'SCHEDULING_HISTORY_BATCH_SOFT_DELETE'
    | 'COMPLIANCE_ALERT_EXPORT'
    /** 排班儀表：週合規達成匯出（CSV） */
    | 'WEEKLY_COMPLIANCE_EXPORT'
    /** PDF 02【13】員工概覽匯出（CSV） */
    | 'STAFF_EXPORT'
    /** PDF 02【12】院友名單匯出（CSV） */
    | 'RESIDENTS_EXPORT'
    /** 院友 CSV 批量匯入 commit（Edge 落庫審計） */
    | 'RESIDENTS_IMPORT_COMMIT'
    /** 員工 CSV 批量匯入 commit（Edge 落庫審計） */
    | 'STAFF_IMPORT_COMMIT'
    /** 活動時段 CSV 批量匯入 commit（Edge 落庫審計） */
    | 'ACTIVITY_SESSIONS_IMPORT_COMMIT'
    /** 排班 KPI 歷史單筆寫入（Edge） */
    | 'SCHEDULING_KPI_HISTORY_APPEND'
    /** 排班 KPI 歷史依 facility 清除（軟刪，Edge） */
    | 'SCHEDULING_KPI_HISTORY_CLEAR'
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
    /** 01 §2.1 工作節 COMPLETED（表單核准後） */
    | 'WORK_SESSION_COMPLETED'
    /** 01 §2.2 服務表單（Seq 17） */
    | 'FORM_DRAFT_UPSERT'
    | 'FORM_SUBMIT'
    | 'FORM_APPROVE'
    | 'FORM_REJECT_REVISION'
    /** 01 §5 服務表單軟刪除（非 APPROVED） */
    | 'FORM_SOFT_DELETE'
    /** PDF 02【5b】開工接更 */
    | 'SHIFT_START_HANDOVER_DRAFT_UPSERT'
    | 'SHIFT_START_HANDOVER_SUBMIT'
    /** PDF 02【6】收工交更 */
    | 'SHIFT_END_HANDOVER_DRAFT_UPSERT'
    | 'SHIFT_END_HANDOVER_SUBMIT'
    /** PDF 02【16】Seq 29：系統設定儲存（本地暫存／後端待接） */
    | 'SYSTEM_SETTINGS_SAVE'
    /** Admin 變更 Auth 使用者 STARCARE 角色（user_roles／app_metadata；Edge admin-user-role-set） */
    | 'USER_RBAC_ROLE_SET'
  entityType: 'Resident' | 'Staff' | 'Scheduling' | 'Reporting' | 'Auth'
  entityId: string
  actorId: string
  beforeState: string | null
  afterState: string | null
  detail: string
  occurredAt: string
  /** `audit_events.id`；僅遠端合併寫入，本機 `record` 不帶 */
  remoteId?: string
}

/** 非阻塞落庫（Seq 12）；由 AuthProvider 於已設定 Supabase 時註冊 */
export type AuditTrailPersistFn = (event: AuditTrailRecord) => Promise<void>

let persistFn: AuditTrailPersistFn | null = null

export const registerAuditTrailPersistence = (fn: AuditTrailPersistFn | null): void => {
  persistFn = fn
}

export class AuditTrailService {
  private records: AuditTrailRecord[] = []
  private readonly listeners = new Set<() => void>()

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  private notify(): void {
    this.listeners.forEach((fn) => {
      try {
        fn()
      } catch {
        /* 訂閱端錯誤不向上拋 */
      }
    })
  }

  /** 登入後遠端列與本機工作階段列合併（見 `auditTrailMergeUtils`） */
  mergeRemoteRecords(remote: AuditTrailRecord[]): void {
    this.records = mergeRemoteAuditTrail(remote, this.records)
    this.notify()
  }

  /** @param skipRemotePersist 為 true 時不呼叫 `audit-trail-append`（已由後端 Edge 落庫，如批次排班儲存） */
  record(event: AuditTrailRecord, skipRemotePersist = false): void {
    this.records.unshift(event)
    this.notify()
    if (persistFn && !skipRemotePersist) {
      void persistFn(event).catch(() => {
        /* 遠端失敗不阻斷 UI；記憶體軌跡已寫入 */
      })
    }
  }

  list(): AuditTrailRecord[] {
    return [...this.records]
  }
}

/** 全應用共用審計實例，確保院友與排班寫入同一軌跡 */
export const globalAuditTrailService = new AuditTrailService()
