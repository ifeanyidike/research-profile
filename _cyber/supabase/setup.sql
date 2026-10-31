begin;
-- Dedicated data: never modifies Algo Studio's learning_progress table.
create or replace function public.valid_cyber_record(doc jsonb) returns boolean
language plpgsql immutable set search_path = '' as $$
declare field text; value jsonb; stamp jsonb; checks jsonb;
begin
  if jsonb_typeof(doc) <> 'object' or jsonb_typeof(doc->'values') is distinct from 'object'
    or jsonb_typeof(doc->'changed') is distinct from 'object' or octet_length(doc::text) > 500000
    or (select count(*) from jsonb_object_keys(doc)) <> 2 then return false; end if;
  for field,value in select * from jsonb_each(doc->'values') loop
    if field not in ('read','practice','passedAt','reviewAt','reviewStage','notes','evidence','assessment','resources') then return false; end if;
    if field in ('read','practice') and jsonb_typeof(value) <> 'boolean' then return false; end if;
    -- Match JavaScript String.length / HTML maxlength: supplementary characters use two UTF-16 units.
    if field in ('notes','evidence','assessment','resources') and (jsonb_typeof(value) <> 'string' or length(value #>> '{}') + length(regexp_replace(value #>> '{}', U&'[^\+010000-\+10FFFF]', '', 'g')) > 20000) then return false; end if;
    if field = 'resources' then
      checks := (value #>> '{}')::jsonb;
      if jsonb_typeof(checks) <> 'array' or jsonb_array_length(checks) > 200 then return false; end if;
      if exists(select from jsonb_array_elements(checks) item where jsonb_typeof(item) <> 'string' or (item #>> '{}') !~ '^(video|reading):[0-9]{1,3}$') then return false; end if;
    end if;
    if field in ('passedAt','reviewAt','reviewStage') then
      if jsonb_typeof(value) <> 'number' then return false; end if;
      if trunc((value::text)::numeric) <> (value::text)::numeric or (value::text)::numeric < 0 or (value::text)::numeric > 8640000000000000 then return false; end if;
      if field = 'reviewStage' and ((value::text)::numeric > 3 or trunc((value::text)::numeric) <> (value::text)::numeric) then return false; end if;
    end if;
    stamp := doc->'changed'->field;
    if jsonb_typeof(stamp) is distinct from 'number' then return false; end if;
    if trunc((stamp::text)::numeric) <> (stamp::text)::numeric or (stamp::text)::numeric < 0 or (stamp::text)::numeric > 8640000000000000 then return false; end if;
  end loop;
  for field in select jsonb_object_keys(doc->'changed') loop
    if not (doc->'values' ? field) then return false; end if;
  end loop;
  return true;
exception when others then return false;
end $$;
create table if not exists public.cyber_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null check (lesson_id in ('O01','O02','O03','M01','P01','P02','P03','P04','P05','L01','L02','P06','L03','M02','M03','M04','M05','C01','C02','C03','C04','C05','C06','C07','N01','N02','N03','N04','N05','N06','B01','B02','B03','B04','S01','S02','S03','S04','S05','S06','W01','W02','W03','W04','W05','W06','W07','W08','W09','W10','W11','W12','W13','W14','W15','W16','W17','W18','F01','F02','F03','F04','F05','D01','D02','D03','D04','D05','D06','D07','D08','D09','D10','G01','G02','A01','A02','A03','A04','A05','A06','A07','R01','R02','R03','I01','I02','I03','I04','I05','I06','I07','I08')),
  record jsonb not null check (public.valid_cyber_record(record)),
  primary key (user_id,lesson_id)
);
alter table public.cyber_progress enable row level security;
revoke all on public.cyber_progress from anon, authenticated;
grant select, insert, update on public.cyber_progress to authenticated;
drop policy if exists "Cyber read own" on public.cyber_progress;
create policy "Cyber read own" on public.cyber_progress for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "Cyber insert own" on public.cyber_progress;
create policy "Cyber insert own" on public.cyber_progress for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "Cyber update own" on public.cyber_progress;
create policy "Cyber update own" on public.cyber_progress for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create or replace function public.merge_cyber_progress() returns trigger
language plpgsql set search_path = '' as $$
declare field text; value jsonb; merged jsonb := old.record;
begin
  if new.user_id <> old.user_id or new.lesson_id <> old.lesson_id then raise exception 'Progress identity is immutable'; end if;
  if not public.valid_cyber_record(new.record) then raise exception 'Invalid cyber progress'; end if;
  for field,value in select * from jsonb_each(new.record->'values') loop
    if not (merged->'changed' ? field) or (new.record->'changed'->>field)::numeric > (merged->'changed'->>field)::numeric
      or ((new.record->'changed'->>field)::numeric = (merged->'changed'->>field)::numeric
      and encode(convert_to(value::text, 'UTF8'),'hex') collate "C" > encode(convert_to((merged->'values'->field)::text, 'UTF8'),'hex') collate "C") then
      merged := jsonb_set(merged,array['values',field],value);
      merged := jsonb_set(merged,array['changed',field],new.record->'changed'->field);
    end if;
  end loop;
  new.record := merged;
  return new;
end $$;
revoke all on function public.merge_cyber_progress() from public, anon;
revoke all on function public.valid_cyber_record(jsonb) from public, anon;
grant execute on function public.valid_cyber_record(jsonb) to authenticated;
drop trigger if exists merge_cyber_progress_before_update on public.cyber_progress;
create trigger merge_cyber_progress_before_update before update on public.cyber_progress for each row execute function public.merge_cyber_progress();
commit;
