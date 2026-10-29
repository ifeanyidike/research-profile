Cyber Studio
============
Public workspace: /cyber-studio/

The public curriculum contains 93 prerequisite-linked topics in 13 stages (including an eight-topic AI-security track).
Each topic has an authored explanation, worked example, pitfall, retrieval
question, exact videos/readings, practical task, independent assessment and
pass criteria. The original source inventory was researched on 29 Oct 2026.

Content maintenance
-------------------
cyber-studio/curriculum.json: topic order, prerequisite IDs, source attribution,
exercise briefs and assessment criteria. Keep URLs on their original providers.
_cyber/content/*.txt: authored teaching. Each blank-line-separated block has ten
lines: ID, concept, mechanism, worked example, pitfall, question, correct answer,
two distractors, feedback. Avoid blank lines inside a block.
_cyber/guides/ID.json: authored prerequisite bridge, step-by-step teaching,
complete worked example, explanation, exercise, worked solution, independent
challenge and expected reasoning. Keep the example string's literal backslashes
intact when editing runnable code. All 93 guides are required by the packager.
cyber-studio/credentials.json: dated external certification routes, requirements,
official links and suggested study bridges. Hub progress is never exam credit.

After editing teaching, run python3 _cyber/build-lessons.py and format
cyber-studio/lessons.json with the repository's Prettier. This packaging script
has no network or model dependencies. Both JSON files are shipped with Jekyll.

Verification
------------
node --test _cyber/tests/*.test.js
node --check cyber-studio/app.js
node --check cyber-studio/model.js
node --check cyber-studio/account.js
Build Jekyll in the repo's Docker environment and serve the resulting _site.
Tests use in-memory storage, synthetic data and mocked account I/O. They never
send email, execute labs, call model providers, or run an evaluation harness.
External video playback, provider labs, and complete course correctness are not
automatically verified. Passes are explicitly self-assessed, not auto-graded.

Accounts
--------
The default config comes from Algo Studio's public Supabase configuration and
bundled SDK, using an independent cyber-studio-auth session key. The account UI
supports Google, email/password signup and login, and password recovery.

Install _cyber/supabase/setup.sql in the selected Supabase project's SQL editor.
It creates only cyber_progress and its validation/merge functions, trigger and
RLS policies. It never modifies learning_progress. Anonymous access is revoked;
authenticated users can select/insert/update only rows matching auth.uid().
Application users have no table-wide delete permission.

Allow https://ifeanyidike.com/cyber-studio/ in Auth > URL configuration.
Preserve existing URLs and the existing Site URL used by Algo Studio. Allow a
local preview callback separately only when needed for testing. Google must be
enabled on the chosen project if its button is offered. Email verification and
reset delivery depend on the project's auth and SMTP configuration.

_cyber/supabase/verify.sql runs transactional, rolled-back access and merge
checks using two synthetic identities. Review it before using on a hosted
project. local-bootstrap.sql is ONLY for a disposable PostgreSQL instance,
where it emulates the auth.uid interface; never run it on Supabase.
For an existing installation apply 20261029-ai-lessons.sql before deploying the
AI track. It adds eight allowed lesson IDs without changing rows or RLS grants.

Progress semantics
------------------
Guest profiles default to Ifeanyi and Fav. Signed-in users receive a separate
workspace keyed by account UUID; no guest records are silently copied into it.
Each lesson stores individually timestamped fields. Server row locking and a
trigger merge newer field changes, with a shared deterministic UTF-8 tie-break
for edits at the same millisecond. Concurrent changes to the same text field
resolve to one value; this is not a collaborative text editor. Device clock
skew can affect ordering. Export a backup before editing on several devices.

The browser caches account progress for offline continuation. Sync occurs after
edits, on focus/online, and every 30 seconds. Stale account responses are ignored.
A failed sync retains work and displays an explicit paused status. Failed local
storage keeps edits in memory and advises export before refresh. If progress cannot sync, an empty workspace can still sign out. With cached
work, the UI asks the learner to export and offers explicit device sign-out;
cached/memory work remains scoped to its account for the tab lifetime.
Unchanged syncs do not redraw learning activities or upload equal JSONB records.

Notes/evidence have a 20,000-character per-field limit. JSON backups are limited
to 32 MB, validated in full before import, and merge into the active workspace
only after a destination preview. Newer fields are preserved. Imported text is
always escaped before rendering. Profiles are not password-protected local
containers; use a personal browser profile on shared machines.

A self-assessed pass requires a correct retrieval answer in the current session,
practice confirmation, prerequisite passes, reviewed criteria and at least 40
characters of assessment evidence. It schedules recall at 2 days, then 7 days
after the first review, then 30 days after the second. The third ends the cycle.

Videos use click-to-load youtube-nocookie embeds where an supported YouTube source is
available, preserving chapter start and playlist parameters, and always retain a link to the provider. Embedded players may be
unavailable; content, captions, accounts and pricing remain provider-controlled.
