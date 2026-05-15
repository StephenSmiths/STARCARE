-- Gate C：上線當日／簽核前 SQL 抽測（Supabase SQL Editor）
-- 對照：docs/go-live-checklist.md §3、§4、§8；docs/gate-c-go-live-signoff-draft-2026-05-15.md

-- 1) 最近排班寫入（scheduling_history）
select
  id,
  resident_id,
  session_id,
  staff_id,
  pass,
  actor_id,
  batch_id,
  created_at
from public.scheduling_history
where is_deleted = false
order by created_at desc
limit 10;

-- 2) 角色對照（user_roles）
select
  ur.user_id,
  ur.role,
  au.email,
  ur.created_at
from public.user_roles ur
left join auth.users au on au.id = ur.user_id
order by ur.created_at desc
limit 20;

-- 3) 審計事件（audit_events）
select
  id,
  action,
  entity_type,
  entity_id,
  actor_id,
  occurred_at
from public.audit_events
where is_deleted = false
order by occurred_at desc
limit 20;

-- 4) RLS 抽測說明（須分別以 staff / teamlead SQL 角色或 Dashboard 帳號執行）
-- staff：僅應見 actor_id = 本人 UUID 之列
-- teamlead/admin：可見全院 is_deleted = false
