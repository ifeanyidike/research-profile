-- Run only in the dedicated Algo Studio project.
create table if not exists public.learning_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  device_id uuid not null,
  document jsonb not null check (jsonb_typeof(document) = 'object' and octet_length(document::text) <= 4000000),
  updated_at timestamptz not null default now(),
  primary key (user_id, device_id)
);
alter table public.learning_progress enable row level security;
revoke all on public.learning_progress from anon, authenticated;
grant select, insert, update on public.learning_progress to authenticated;
create policy "Read my progress" on public.learning_progress for select to authenticated using ((select auth.uid()) = user_id);
create policy "Create my progress" on public.learning_progress for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Update my progress" on public.learning_progress for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- Merge atomically when two open tabs update the same browser's row.
create function public.merge_learning_progress() returns trigger
language plpgsql set search_path = '' as $$
begin
  select jsonb_build_object('version', 1, 'records', coalesce(jsonb_object_agg(key, value), '{}'::jsonb))
  into new.document
  from (
    select distinct on (key) key, value
    from (
      select key, value from jsonb_each(old.document->'records')
      union all
      select key, value from jsonb_each(new.document->'records')
    ) changes
    order by key, (value->>'at')::bigint desc, (value->>'device') collate "C" desc
  ) latest;
  new.updated_at = now();
  return new;
end;
$$;
revoke all on function public.merge_learning_progress() from public, anon;
grant execute on function public.merge_learning_progress() to authenticated;
create trigger merge_learning_progress_before_update before update on public.learning_progress
for each row execute function public.merge_learning_progress();
