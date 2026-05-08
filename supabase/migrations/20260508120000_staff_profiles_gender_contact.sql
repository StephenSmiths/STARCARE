-- PDF 02【13】員工主檔：性別、聯絡方式（批量／單筆維護）
alter table if exists public.staff_profiles
  add column if not exists gender text check (gender is null or gender in ('Male', 'Female')),
  add column if not exists phone text not null default '',
  add column if not exists email text not null default '';

comment on column public.staff_profiles.gender is '性別 Male／Female；歷史列可為空';
comment on column public.staff_profiles.phone is '聯絡電話';
comment on column public.staff_profiles.email is '電子郵箱';
