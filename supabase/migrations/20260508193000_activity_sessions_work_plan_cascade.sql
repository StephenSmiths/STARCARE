-- PDF 02【2】工作計劃四層聯動欄位（職位→活動類型→活動內容→活動細項）與時間分解欄位。
alter table if exists public.activity_sessions
  add column if not exists start_time text,
  add column if not exists duration_minutes integer,
  add column if not exists end_time text,
  add column if not exists activity_type text check (activity_type is null or activity_type in ('Individual', 'Group', 'Assessment', 'Other')),
  add column if not exists resident_ids text[] not null default '{}',
  add column if not exists activity_content text not null default '',
  add column if not exists activity_detail text not null default '';

comment on column public.activity_sessions.start_time is '開始時間 HH:mm';
comment on column public.activity_sessions.duration_minutes is '時長（分鐘，15倍數）';
comment on column public.activity_sessions.end_time is '結束時間 HH:mm（由開始時間+時長計算）';
comment on column public.activity_sessions.activity_type is '活動類型：Individual/Group/Assessment/Other';
comment on column public.activity_sessions.resident_ids is '綁定院友ID列表（個別/評估限1）';
comment on column public.activity_sessions.activity_content is '活動內容（若選其他，存自填值）';
comment on column public.activity_sessions.activity_detail is '活動細項（若選其他細項，存自填值）';
