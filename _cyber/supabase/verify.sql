-- Read and write checks use a transaction that is always rolled back.
begin;
insert into auth.users(id) values ('a1111111-1111-4111-8111-111111111111'),('b2222222-2222-4222-8222-222222222222') on conflict do nothing;
set local role authenticated;
set local request.jwt.claim.sub='a1111111-1111-4111-8111-111111111111';
insert into public.cyber_progress values ('a1111111-1111-4111-8111-111111111111','O01','{"values":{"notes":"new"},"changed":{"notes":200}}');
update public.cyber_progress set record='{"values":{"notes":"old","practice":true},"changed":{"notes":100,"practice":150}}' where lesson_id='O01';
do $$ begin
 if not exists(select from public.cyber_progress where record->'values'->>'notes'='new' and record->'values'->>'practice'='true') then raise exception 'Field merge lost newer notes or independent practice'; end if;
 begin
  insert into public.cyber_progress values ('b2222222-2222-4222-8222-222222222222','O02','{"values":{},"changed":{}}');
  raise exception 'Cross-account insert succeeded';
 exception when insufficient_privilege then null; end;
 begin
  insert into public.cyber_progress values ('a1111111-1111-4111-8111-111111111111','O02','{"values":{"passedAt":"invalid"},"changed":{"passedAt":200}}');
  raise exception 'Invalid record succeeded';
 exception when check_violation then null; end;
end $$;
set local request.jwt.claim.sub='b2222222-2222-4222-8222-222222222222';
do $$ begin
 if exists(select from public.cyber_progress) then raise exception 'Other account can read progress'; end if;
 update public.cyber_progress set record='{"values":{"notes":"changed"},"changed":{"notes":300}}' where user_id='a1111111-1111-4111-8111-111111111111';
 if found then raise exception 'Other account can update progress'; end if;
end $$;
set local request.jwt.claim.sub='';
do $$ begin if exists(select from public.cyber_progress) then raise exception 'Unauthenticated user sees progress'; end if; end $$;
set local role anon;
do $$ begin
 begin
  perform 1 from public.cyber_progress;
  raise exception 'Anonymous table access succeeded';
 exception when insufficient_privilege then null; end;
end $$;
rollback;
