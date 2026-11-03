-- Separate code rows keep older progress clients compatible. No progress rows change.
begin;
create or replace function public.valid_voice_ai_code_record(doc jsonb) returns boolean
language plpgsql immutable set search_path = '' as $$
declare text_value text; stamp numeric;
begin
  if jsonb_typeof(doc) <> 'object' or (select count(*) from jsonb_object_keys(doc)) <> 2
    or jsonb_typeof(doc->'values') is distinct from 'object' or jsonb_typeof(doc->'changed') is distinct from 'object'
    or octet_length(doc::text) > 250000 then return false; end if;
  if (select count(*) from jsonb_object_keys(doc->'values')) <> 1
    or (select count(*) from jsonb_object_keys(doc->'changed')) <> 1
    or jsonb_typeof(doc->'values'->'code') is distinct from 'string'
    or jsonb_typeof(doc->'changed'->'code') is distinct from 'number' then return false; end if;
  text_value := doc->'values'->>'code';
  if length(text_value) + length(regexp_replace(text_value, U&'[^\+010000-\+10FFFF]', '', 'g')) > 20000 then return false; end if;
  stamp := (doc->'changed'->>'code')::numeric;
  return stamp >= 0 and stamp <= 8640000000000000 and trunc(stamp) = stamp;
exception when others then return false;
end $$;
create table if not exists public.voice_ai_code (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null check (lesson_id ~ '^V(0[1-9]|[1-3][0-9]|4[0-4]):[a-z][a-z0-9-]{0,47}$'),
  record jsonb not null check (public.valid_voice_ai_code_record(record)),
  primary key (user_id, lesson_id)
);
alter table public.voice_ai_code enable row level security;
revoke all on public.voice_ai_code from anon, authenticated;
grant select, insert, update on public.voice_ai_code to authenticated;
drop policy if exists "Read own Python code" on public.voice_ai_code;
create policy "Read own Python code" on public.voice_ai_code for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "Insert own Python code" on public.voice_ai_code;
create policy "Insert own Python code" on public.voice_ai_code for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "Update own Python code" on public.voice_ai_code;
create policy "Update own Python code" on public.voice_ai_code for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create or replace function public.merge_voice_ai_code() returns trigger
language plpgsql set search_path = '' as $$
begin
  if new.user_id <> old.user_id or new.lesson_id <> old.lesson_id then raise exception 'Python workspace identity is immutable'; end if;
  if not public.valid_voice_ai_code_record(new.record) then raise exception 'Invalid Python workspace'; end if;
  if (new.record->'changed'->>'code')::numeric < (old.record->'changed'->>'code')::numeric
    or ((new.record->'changed'->>'code')::numeric = (old.record->'changed'->>'code')::numeric
      and encode(convert_to((new.record->'values'->'code')::text,'UTF8'),'hex') collate "C" < encode(convert_to((old.record->'values'->'code')::text,'UTF8'),'hex') collate "C") then
    new.record := old.record;
  end if;
  return new;
end $$;
revoke all on function public.valid_voice_ai_code_record(jsonb) from public, anon;
grant execute on function public.valid_voice_ai_code_record(jsonb) to authenticated;
revoke all on function public.merge_voice_ai_code() from public, anon;
drop trigger if exists merge_voice_ai_code_before_update on public.voice_ai_code;
create trigger merge_voice_ai_code_before_update before update on public.voice_ai_code for each row execute function public.merge_voice_ai_code();
commit;
