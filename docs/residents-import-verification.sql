-- 匯入完成後驗證：最新 20 筆院友（排除已軟刪）
select id, name, bed_number, funding_type, service_type, created_at
from public.residents
where is_deleted = false
order by created_at desc
limit 20;

-- 指定床號批次驗證（示例：E301/E302）
select id, name, bed_number, created_at
from public.residents
where is_deleted = false
  and bed_number in ('E301', 'E302')
order by created_at desc;

-- 匯入總量檢查（可與預檢 valid 筆數比對）
select count(*) as active_resident_count
from public.residents
where is_deleted = false;
