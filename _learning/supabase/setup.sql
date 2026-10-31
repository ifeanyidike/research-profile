begin;
-- Two new isolated progress stores. Existing Algo/Cyber tables are untouched.
-- Dedicated data: never modifies Algo Studio's learning_progress table.
create or replace function public.valid_voice_ai_record(doc jsonb) returns boolean
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
    if field in ('passedAt','reviewAt','reviewStage') then
      if jsonb_typeof(value) <> 'number' then return false; end if;
      if trunc((value::text)::numeric) <> (value::text)::numeric or (value::text)::numeric < 0 or (value::text)::numeric > 8640000000000000 then return false; end if;
      if field = 'reviewStage' and ((value::text)::numeric > 3 or trunc((value::text)::numeric) <> (value::text)::numeric) then return false; end if;
    end if;
    if field = 'resources' then
      checks := (value #>> '{}')::jsonb;
      if jsonb_typeof(checks) <> 'array' or jsonb_array_length(checks) > 200 then return false; end if;
      if exists(select from jsonb_array_elements(checks) item where jsonb_typeof(item) <> 'string' or (item #>> '{}') !~ '^(video|reading):[0-9]{1,3}$') then return false; end if;
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
create table if not exists public.voice_ai_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null check (lesson_id in ('V01','V02','V03','V04','V05','V06','V07','V08','V09','V10','V11','V12','V13','V14','V15','V16','V17','V18','V19','V20','V21','V22','V23','V24','V25','V26','V27','V28','V29','V30','V31','V32','V33','V34','V35','V36','V37','V38','V39','V40','V41','V42','V43','V44')),
  record jsonb not null check (public.valid_voice_ai_record(record)),
  primary key (user_id,lesson_id)
);
alter table public.voice_ai_progress enable row level security;
revoke all on public.voice_ai_progress from anon, authenticated;
grant select, insert, update on public.voice_ai_progress to authenticated;
drop policy if exists "Voice AI read own" on public.voice_ai_progress;
create policy "Voice AI read own" on public.voice_ai_progress for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "Voice AI insert own" on public.voice_ai_progress;
create policy "Voice AI insert own" on public.voice_ai_progress for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "Voice AI update own" on public.voice_ai_progress;
create policy "Voice AI update own" on public.voice_ai_progress for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create or replace function public.merge_voice_ai_progress() returns trigger
language plpgsql set search_path = '' as $$
declare field text; value jsonb; merged jsonb := old.record;
begin
  if new.user_id <> old.user_id or new.lesson_id <> old.lesson_id then raise exception 'Progress identity is immutable'; end if;
  if not public.valid_voice_ai_record(new.record) then raise exception 'Invalid voice_ai progress'; end if;
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
revoke all on function public.merge_voice_ai_progress() from public, anon;
revoke all on function public.valid_voice_ai_record(jsonb) from public, anon;
grant execute on function public.valid_voice_ai_record(jsonb) to authenticated;
drop trigger if exists merge_voice_ai_progress_before_update on public.voice_ai_progress;
create trigger merge_voice_ai_progress_before_update before update on public.voice_ai_progress for each row execute function public.merge_voice_ai_progress();

-- Dedicated data: never modifies Algo Studio's learning_progress table.
create or replace function public.valid_child_development_record(doc jsonb) returns boolean
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
    if field in ('passedAt','reviewAt','reviewStage') then
      if jsonb_typeof(value) <> 'number' then return false; end if;
      if trunc((value::text)::numeric) <> (value::text)::numeric or (value::text)::numeric < 0 or (value::text)::numeric > 8640000000000000 then return false; end if;
      if field = 'reviewStage' and ((value::text)::numeric > 3 or trunc((value::text)::numeric) <> (value::text)::numeric) then return false; end if;
    end if;
    if field = 'resources' then
      checks := (value #>> '{}')::jsonb;
      if jsonb_typeof(checks) <> 'array' or jsonb_array_length(checks) > 200 then return false; end if;
      if exists(select from jsonb_array_elements(checks) item where jsonb_typeof(item) <> 'string' or (item #>> '{}') !~ '^(video|reading):[0-9]{1,3}$') then return false; end if;
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
create table if not exists public.child_development_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null check (lesson_id in ('C01','C02','C03','C04','C05','C06','C07','C08','C09','C10','C11','C12','G01','G02','G03','G04','G05','G06','G07','G08','G09','G10','G11','G12','P01','P02','P03','P04','P05','P06','P07','P08','P09','P10','P11','P12','P13','P14','P15','P16')),
  record jsonb not null check (public.valid_child_development_record(record)),
  primary key (user_id,lesson_id)
);
alter table public.child_development_progress enable row level security;
revoke all on public.child_development_progress from anon, authenticated;
grant select, insert, update on public.child_development_progress to authenticated;
drop policy if exists "Child Development read own" on public.child_development_progress;
create policy "Child Development read own" on public.child_development_progress for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "Child Development insert own" on public.child_development_progress;
create policy "Child Development insert own" on public.child_development_progress for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "Child Development update own" on public.child_development_progress;
create policy "Child Development update own" on public.child_development_progress for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create or replace function public.merge_child_development_progress() returns trigger
language plpgsql set search_path = '' as $$
declare field text; value jsonb; merged jsonb := old.record;
begin
  if new.user_id <> old.user_id or new.lesson_id <> old.lesson_id then raise exception 'Progress identity is immutable'; end if;
  if not public.valid_child_development_record(new.record) then raise exception 'Invalid child_development progress'; end if;
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
revoke all on function public.merge_child_development_progress() from public, anon;
revoke all on function public.valid_child_development_record(jsonb) from public, anon;
grant execute on function public.valid_child_development_record(jsonb) to authenticated;
drop trigger if exists merge_child_development_progress_before_update on public.child_development_progress;
create trigger merge_child_development_progress_before_update before update on public.child_development_progress for each row execute function public.merge_child_development_progress();

commit;
