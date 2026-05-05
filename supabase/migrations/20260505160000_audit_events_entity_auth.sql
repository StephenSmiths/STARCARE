-- 01 §5／RBAC：審計實體擴充「Auth」，供 Admin 變更使用者 STARCARE 角色落庫（Edge／service_role）

ALTER TABLE public.audit_events DROP CONSTRAINT IF EXISTS audit_events_entity_type_check;

ALTER TABLE public.audit_events
ADD CONSTRAINT audit_events_entity_type_check
CHECK (entity_type IN ('Resident', 'Staff', 'Scheduling', 'Reporting', 'Auth'));

COMMENT ON CONSTRAINT audit_events_entity_type_check ON public.audit_events IS
  '含 Auth：Supabase 帳號 RBAC（staff／teamlead／admin）變更審計';
