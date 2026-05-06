-- Gate A 證據 SQL（2026-05-06）
-- 對照：docs/gate-a-evidence-capture-2026-05-06.md

-- 1) go-live §1：Auth/RLS 初檢（user_roles）
select
  ur.user_id,
  ur.role,
  au.email,
  ur.created_at
from public.user_roles ur
left join auth.users au on au.id = ur.user_id
order by ur.created_at desc
limit 20;

-- 2) go-live §3：排班閉環（scheduling_history）
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

-- 3) go-live §8：審計落庫（audit_events）
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

-- 4) go-live §8：RLS 差異檢視（配合不同登入角色比對）
-- 注意：此查詢本身相同，請以 staff / teamlead / admin 各自登入執行，
-- 比對可見列數與 actor_id 範圍差異。
select
  action,
  entity_type,
  actor_id,
  occurred_at
from public.audit_events
where is_deleted = false
order by occurred_at desc
limit 50;
