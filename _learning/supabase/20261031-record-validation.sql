begin;
-- Upgrade existing installations without modifying any learner records.
do $$ begin
  if to_regclass('public.cyber_progress') is null or to_regclass('public.voice_ai_progress') is null or to_regclass('public.child_development_progress') is null then
    raise exception 'Install the Cyber and shared learning setup.sql schemas before this upgrade';
  end if;
end $$;
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
revoke all on function public.valid_cyber_record(jsonb) from public, anon;
grant execute on function public.valid_cyber_record(jsonb) to authenticated;
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
revoke all on function public.valid_voice_ai_record(jsonb) from public, anon;
grant execute on function public.valid_voice_ai_record(jsonb) to authenticated;
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
revoke all on function public.valid_child_development_record(jsonb) from public, anon;
grant execute on function public.valid_child_development_record(jsonb) to authenticated;
-- Inspect counts only. Existing invalid rows require a separate, reviewed repair;
-- this upgrade neither drops a checklist nor alters any note or completion.
select 'cyber' as studio, count(*) as invalid_records from public.cyber_progress where not public.valid_cyber_record(record)
union all select 'voice', count(*) from public.voice_ai_progress where not public.valid_voice_ai_record(record)
union all select 'child', count(*) from public.child_development_progress where not public.valid_child_development_record(record);
commit;
