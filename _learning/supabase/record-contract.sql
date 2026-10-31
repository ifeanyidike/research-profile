-- Offline/disposable database: requires all three setup.sql schemas.
-- Pure validator calls only. No identities, learner records or network calls.
begin;
do $$
declare validator text; field text; sample record; doc jsonb; actual boolean; checks integer := 0;
begin
  foreach validator in array array['valid_cyber_record','valid_voice_ai_record','valid_child_development_record'] loop
    for sample in select * from (values
      ('not JSON', 'not-json', false),
      ('object', '{}', false),
      ('null', 'null', false),
      ('numeric entry', '[1]', false),
      ('unknown key', '["bogus"]', false),
      ('oversized key', '["video:1000"]', false),
      ('valid keys', '["video:0","reading:999"]', true),
      ('empty checklist', '[]', true),
      ('200 entries', (select jsonb_agg('video:0'::text)::text from generate_series(1,200)), true),
      ('201 entries', (select jsonb_agg('video:0'::text)::text from generate_series(1,201)), false)
    ) as cases(label, value, expected) loop
      doc := jsonb_build_object('values',jsonb_build_object('resources',sample.value),'changed',jsonb_build_object('resources',200));
      execute format('select public.%I($1)',validator) into actual using doc;
      if actual is distinct from sample.expected then raise exception '%: resources % expected %, got %',validator,sample.label,sample.expected,actual; end if;
      checks := checks + 1;
    end loop;
    foreach field in array array['notes','evidence','assessment'] loop
      for sample in select * from (values
        ('ASCII limit', repeat('a',20000), true),
        ('ASCII overflow', repeat('a',20001), false),
        ('BMP limit', repeat(chr(233),20000), true),
        ('supplementary limit', repeat(chr(128512),10000), true),
        ('supplementary overflow', repeat(chr(128512),10001), false),
        ('mixed limit', repeat('a',19998) || chr(128512), true),
        ('mixed overflow', repeat('a',19999) || chr(128512), false)
      ) as cases(label, value, expected) loop
        doc := jsonb_build_object('values',jsonb_build_object(field,sample.value),'changed',jsonb_build_object(field,200));
        execute format('select public.%I($1)',validator) into actual using doc;
        if actual is distinct from sample.expected then raise exception '%: % % expected %, got %',validator,field,sample.label,sample.expected,actual; end if;
        checks := checks + 1;
      end loop;
    end loop;
  end loop;
  raise notice '% server record contract checks passed',checks;
end $$;
rollback;
