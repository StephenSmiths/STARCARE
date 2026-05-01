-- STARCARE Phase 3 Day 3：活動時段批量匯入驗證 SQL
-- 用途：在 Supabase SQL Editor 驗證 Dry-run/Commit 後資料完整性

-- 1) 最新 20 筆活動時段（排除軟刪除）
select
  id,
  facility_id,
  activity_id,
  staff_profile_id,
  session_date,
  time_slot,
  capacity,
  created_at
from public.activity_sessions
where is_deleted = false
order by created_at desc
limit 20;

-- 2) 匯入總量檢查（可與 UI 顯示 valid/inserted 筆數對照）
select count(*) as active_activity_session_count
from public.activity_sessions
where is_deleted = false;

-- 3) 匯入前綴批次核對（valid 檔案：activity-session-valid-*）
select count(*) as valid_batch_count
from public.activity_sessions
where is_deleted = false
  and id like 'activity-session-valid-%';

-- 4) 匯入前綴批次核對（mixed 檔案：activity-session-mixed-*）
select count(*) as mixed_batch_count
from public.activity_sessions
where is_deleted = false
  and id like 'activity-session-mixed-%';

-- 5) 參照完整性抽查：活動主檔是否存在（應為 0 筆）
select s.id, s.activity_id
from public.activity_sessions s
left join public.activities a
  on a.id = s.activity_id
where s.is_deleted = false
  and a.id is null
limit 20;

-- 6) 參照完整性抽查：員工主檔是否存在（應為 0 筆）
select s.id, s.staff_profile_id
from public.activity_sessions s
left join public.staff_profiles p
  on p.id = s.staff_profile_id
where s.is_deleted = false
  and p.id is null
limit 20;

-- 7) 欄位品質檢查：capacity < 1（應為 0 筆）
select id, capacity
from public.activity_sessions
where is_deleted = false
  and capacity < 1
limit 20;

-- 8) 欄位品質檢查：必要欄位空值（應為 0 筆）
select id, facility_id, activity_id, staff_profile_id, session_date, time_slot
from public.activity_sessions
where is_deleted = false
  and (
    facility_id is null
    or activity_id is null
    or staff_profile_id is null
    or session_date is null
    or time_slot is null
  )
limit 20;
