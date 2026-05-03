-- 匯入完成後驗證：最新 20 筆院友（排除已軟刪）
-- 含 §4.3 錨點 assessment_next_due_date（與 admission_date 對照）
select
  id,
  name,
  bed_number,
  admission_date,
  assessment_next_due_date,
  funding_type,
  service_type,
  created_at
from public.residents
where is_deleted = false
order by created_at desc
limit 20;

-- 指定床號批次驗證（示例：E301/E302；可依實際匯入床號替換）
select
  id,
  name,
  bed_number,
  admission_date,
  assessment_next_due_date,
  created_at
from public.residents
where is_deleted = false
  and bed_number in ('E301', 'E302')
order by created_at desc;

-- 匯入總量檢查（可與預檢 valid 筆數比對）
select count(*) as active_resident_count
from public.residents
where is_deleted = false;

-- 僅檢視已設定「下次評估到期日」之院友（CSV 有填 assessmentNextDueDate 者應出現在此）
select bed_number, name, admission_date, assessment_next_due_date, created_at
from public.residents
where is_deleted = false
  and assessment_next_due_date is not null
order by created_at desc
limit 50;
