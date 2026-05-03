-- 01 §5／Seq 12：審計事件落庫（禁止硬刪除；寫入僅 Edge／service_role）
CREATE TABLE IF NOT EXISTS public.audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('Resident', 'Staff', 'Scheduling', 'Reporting')),
  entity_id TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  before_state TEXT,
  after_state TEXT,
  detail TEXT NOT NULL DEFAULT '',
  occurred_at TIMESTAMPTZ NOT NULL,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_events_occurred ON public.audit_events (occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_events_actor ON public.audit_events (actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_entity ON public.audit_events (entity_type, entity_id);

COMMENT ON TABLE public.audit_events IS '閉環關鍵操作審計；INSERT 僅 service_role（Edge）；SELECT 見 RLS';

ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS audit_events_select_authenticated ON public.audit_events;
CREATE POLICY audit_events_select_authenticated
  ON public.audit_events
  FOR SELECT
  TO authenticated
  USING (
    is_deleted = false
    AND (
      EXISTS (
        SELECT 1
        FROM public.user_roles ur
        WHERE ur.user_id = auth.uid()
          AND ur.role IN ('teamlead', 'admin')
      )
      OR (
        actor_id = (SELECT auth.uid()::text)
        AND EXISTS (
          SELECT 1
          FROM public.user_roles ur
          WHERE ur.user_id = auth.uid()
            AND ur.role = 'staff'
        )
      )
    )
  );

COMMENT ON POLICY audit_events_select_authenticated ON public.audit_events IS
  'SELECT：teamlead/admin 全院未刪列；staff 僅本人 actor_id；寫入僅 Edge';
