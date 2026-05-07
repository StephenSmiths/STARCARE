-- 院友主檔補充欄位：英文姓名、出生日期（YYYY-MM-DD）
alter table if exists public.residents
  add column if not exists english_name text,
  add column if not exists birth_date date;

comment on column public.residents.english_name is '院友英文姓名（可選）';
comment on column public.residents.birth_date is '院友出生日期（可選，YYYY-MM-DD）';
