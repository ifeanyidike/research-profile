Hosted installation
===================
Use the existing Algo/Cyber project jqgnmnvwjlpsdxckxkfx. No new project is needed.

1. Run preflight.sql read-only. Confirm the selected project and inspect any
   existing new-table definitions and custom auth.users triggers. If either new
   table already exists, inspect its constraints and policies before applying
   setup.sql; CREATE TABLE IF NOT EXISTS does not repair an arbitrary old table.
2. Review and run setup.sql. It atomically creates only voice_ai_progress,
   child_development_progress and their own validation/merge functions, triggers
   and policies. Existing Algo/Cyber tables and users are untouched.
3. Review verify.sql before hosted use. It inserts synthetic identities/progress
   inside transactions that roll back. Check custom auth hooks first: rollback
   cannot undo an external side effect initiated by a hook. Do not run it blindly
   if such hooks exist. local-bootstrap.sql is for a disposable local database
   only and must NEVER run in Supabase.
4. In Auth URL configuration add these two callbacks, preserving every existing
   callback and the Site URL:
   https://ifeanyidike.com/voice-ai-studio/
   https://ifeanyidike.com/child-development-studio/
5. Confirm owner-only table policies/grants and callback configuration before
   publishing the apps. Google/email/recovery delivery also depends on existing
   project/provider settings; a local mock does not verify an OAuth or email flow.

The runtime uses separate auth session keys and backup kinds, with the existing
public configuration and bundled Supabase SDK. Account UUIDs share the project's
identity system, but the new tables cannot overwrite Algo/Cyber progress.
No private keys, database passwords or service-role credentials belong in the
static site. Never collect real child/clinical records in the learning workspace.
