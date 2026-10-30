-- Disposable PostgreSQL only: emulates the Supabase identity interface, not authentication.
create role anon;
create role authenticated;
create schema auth;
create table auth.users(id uuid primary key);
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
grant usage on schema auth to authenticated;
grant execute on function auth.uid() to authenticated;
insert into auth.users values ('a1111111-1111-4111-8111-111111111111'),('b2222222-2222-4222-8222-222222222222');
