-- Disposable fixtures live only inside this rolled-back transaction.
begin;
insert into auth.users (id, email, aud, role) values
 ('a1111111-1111-4111-8111-111111111111','algo-test-a@example.invalid','authenticated','authenticated'),
 ('b2222222-2222-4222-8222-222222222222','algo-test-b@example.invalid','authenticated','authenticated');
set local role authenticated;
select set_config('request.jwt.claim.sub','a1111111-1111-4111-8111-111111111111',true);
insert into public.learning_progress (user_id,device_id,document) values
 ('a1111111-1111-4111-8111-111111111111','d1111111-1111-4111-8111-111111111111','{"version":1,"records":{"drafts/0/code":{"at":10,"device":"a","value":"first"}}}');
insert into public.learning_progress (user_id,device_id,document) values
 ('a1111111-1111-4111-8111-111111111111','d1111111-1111-4111-8111-111111111111','{"version":1,"records":{"drafts/0/notes":{"at":20,"device":"b","value":"note"}}}')
on conflict (user_id,device_id) do update set document=excluded.document;
do $$
begin
 if not exists(select from public.learning_progress where document->'records' ? 'drafts/0/code' and document->'records' ? 'drafts/0/notes') then
  raise exception 'Concurrent field merge lost data';
 end if;
 begin
  insert into public.learning_progress (user_id,device_id,document) values
   ('b2222222-2222-4222-8222-222222222222','d1111111-1111-4111-8111-111111111111','{"version":1,"records":{}}');
  raise exception 'Cross-account insertion was allowed';
 exception when insufficient_privilege then null;
 end;
end $$;
select set_config('request.jwt.claim.sub','b2222222-2222-4222-8222-222222222222',true);
do $$
declare affected integer;
begin
 if exists(select from public.learning_progress) then raise exception 'Other account progress is visible'; end if;
 update public.learning_progress set document='{"version":1,"records":{}}' where user_id='a1111111-1111-4111-8111-111111111111';
 get diagnostics affected = row_count;
 if affected<>0 then raise exception 'Other account progress can be updated'; end if;
end $$;
select set_config('request.jwt.claim.sub','',true);
do $$
begin
 if exists(select from public.learning_progress) then raise exception 'Unauthenticated identity can read progress'; end if;
end $$;
set local role anon;
do $$
begin
 begin
  perform 1 from public.learning_progress;
  raise exception 'Anonymous table access was allowed';
 exception when insufficient_privilege then null;
 end;
end $$;
reset role;
rollback;
select 'PASS: own progress writes, atomic merge, cross-account read/write isolation, and anonymous access checks. All test data rolled back.' as verification;
