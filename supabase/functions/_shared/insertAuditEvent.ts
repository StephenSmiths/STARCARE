import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

/** 與 `audit-trail-append` 同欄位上限（01 §5／Seq 12） */
const MAX_TEXT = 32000

const clamp = (s: string): string => (s.length <= MAX_TEXT ? s : s.slice(0, MAX_TEXT))

export type AuditEntityType = 'Resident' | 'Staff' | 'Scheduling' | 'Reporting'

/** Edge service_role 直接寫入 `audit_events`（閉環：避免僅前端 append 失敗即無審計） */
export const insertAuditEvent = async (
  supabase: SupabaseClient,
  params: {
    action: string
    entity_type: AuditEntityType
    entity_id: string
    actor_id: string
    before_state: string | null
    after_state: string | null
    detail: string
    occurred_at?: string
  },
): Promise<{ ok: true; id: string } | { ok: false; message: string }> => {
  const occurred_at = params.occurred_at ?? new Date().toISOString()
  const { data, error } = await supabase
    .from('audit_events')
    .insert({
      action: params.action,
      entity_type: params.entity_type,
      entity_id: params.entity_id,
      actor_id: params.actor_id,
      before_state: params.before_state == null ? null : clamp(params.before_state),
      after_state: params.after_state == null ? null : clamp(params.after_state),
      detail: clamp(params.detail),
      occurred_at,
    })
    .select('id')
    .single()
  if (error) return { ok: false, message: error.message }
  const id = data?.id
  if (typeof id !== 'string' || !id) return { ok: false, message: '審計 INSERT 未回傳 id' }
  return { ok: true, id }
}
