-- 院友服務類型多選：關聯表 + 同步觸發器（兼容既有 residents.service_type）
create table if not exists public.resident_service_types (
  resident_id text not null references public.residents(id) on delete cascade,
  service_type text not null check (service_type in ('Subsidized_Rehab', 'Dementia_Service')),
  created_at timestamptz not null default now(),
  primary key (resident_id, service_type)
);

create index if not exists idx_resident_service_types_service_type
  on public.resident_service_types(service_type);

create or replace function public.sync_resident_service_types()
returns trigger
language plpgsql
as $$
begin
  delete from public.resident_service_types where resident_id = new.id;
  if new.is_deleted then
    return new;
  end if;
  if new.service_type = 'Subsidized_Rehab' then
    insert into public.resident_service_types (resident_id, service_type)
    values (new.id, 'Subsidized_Rehab')
    on conflict do nothing;
  elsif new.service_type = 'Dementia_Service' then
    insert into public.resident_service_types (resident_id, service_type)
    values (new.id, 'Dementia_Service')
    on conflict do nothing;
  elsif new.service_type = 'Both' then
    insert into public.resident_service_types (resident_id, service_type)
    values
      (new.id, 'Subsidized_Rehab'),
      (new.id, 'Dementia_Service')
    on conflict do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_sync_resident_service_types on public.residents;
create trigger trg_sync_resident_service_types
after insert or update of service_type, is_deleted on public.residents
for each row execute function public.sync_resident_service_types();

-- 回填現有資料
insert into public.resident_service_types (resident_id, service_type)
select r.id, 'Subsidized_Rehab'
from public.residents r
where r.is_deleted = false and r.service_type in ('Subsidized_Rehab', 'Both')
on conflict do nothing;

insert into public.resident_service_types (resident_id, service_type)
select r.id, 'Dementia_Service'
from public.residents r
where r.is_deleted = false and r.service_type in ('Dementia_Service', 'Both')
on conflict do nothing;
