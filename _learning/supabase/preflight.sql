-- Read-only target inspection before installing or verifying the new stores.
select current_database(), current_user;
select to_regclass('public.voice_ai_progress') as voice_table,
       to_regclass('public.child_development_progress') as child_table,
       to_regclass('public.cyber_progress') as existing_cyber_table,
       to_regclass('public.learning_progress') as existing_algo_table;
select c.relname, c.relrowsecurity
from pg_class c
where c.oid in (to_regclass('public.voice_ai_progress'), to_regclass('public.child_development_progress'));
-- Review custom auth hooks before the transactional synthetic-user verification.
select tgname, pg_get_triggerdef(oid)
from pg_trigger
where tgrelid = 'auth.users'::regclass and not tgisinternal;
