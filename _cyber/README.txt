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
assessment criteria and derived exercise briefs. Keep URLs on their original providers.
_cyber/content/*.txt: authored teaching. Each blank-line-separated block has ten
lines: ID, concept, mechanism, optional brief application example, pitfall, question, correct answer,
two distractors, feedback. Avoid blank lines inside a block.
_cyber/guides/ID.json: authored prerequisite bridge, step-by-step teaching,
complete worked example, explanation, exercise, worked solution, independent
challenge and expected reasoning. Keep the example string's literal backslashes
intact when editing runnable code. All 93 guides are required by the packager.
cyber-studio/credentials.json: dated external certification routes, requirements,
official links and suggested study bridges. Hub progress is never exam credit.

After editing teaching, run python3 _cyber/build-lessons.py and format
cyber-studio/lessons.json and curriculum.json with the repository's Prettier. This packaging script
has no network or model dependencies. Both JSON files are shipped with Jekyll.

Verification
------------
python3 _cyber/build-lessons.py --check
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

Videos use click-to-load youtube-nocookie embeds where a supported YouTube source is
available, preserving excerpt start/end bounds, and always retain a link to the provider. Embedded players may be
unavailable; content, captions, accounts and pricing remain provider-controlled.

Resource review — 30 October 2026
--------------------------------
Per-resource assignment/watchMode/segments are now maintained in curriculum.json.
Use shared learning-studio/resources.js; cyber-studio/video.js re-exports the shared
URL helper. Retain progressKey when reordering the same material; allocate unused
100+ numeric keys for replacements. The old O01 Scratch/AI source is replaced by
a short file-management demonstration. It remains only as a bounded binary/text
encoding excerpt in M01. See _learning/README.txt for the authoring contract and
_learning/resource-review-20261030.txt for audit coverage and limitations.

Content evidence follow-up — release 20261030-6
R01's complete university-hosted captions support the paper-reading method;
R02's exact slides support planning (full speech remains unchecked); R03 uses
MIT's timed captions to narrow the assigned section to 41:30–48:13. Evidence
levels and stable source links appear on resource cards. Voice/Child source maps
also include their per-assignment evidence notes.
See _learning/video-content-review-20261030.json for per-assignment limits.


Release 20261030-9 supersedes the historical R02 evidence above. R02 now assigns
5:12 of COS preregistration/registered-report teaching with readable captions.
The native plan and reproducibility checklist remain required. The active
44-assignment audit is _learning/video-content-review-20261030-complete.json;
its scope does not extend to every video in Cyber Studio.


Full-library transcript audit — release 20261031-1
-------------------------------------------------
video-library-baseline-20261030.json freezes the 303 assignments outside the
historical 44-assignment audit. video-library-review-20261030.json accounts for
all 303: 301 scoped transcript-supported assignments, two deliberately retired
assignments and zero pending. The review completed on 31 October 2026.
There are 36 replacements; new assignments use unused 300+ progress keys.
Retained recordings keep their existing keys and historical audit files remain
unchanged. Counts are assignments, not unique recordings or full-video reviews.
Per-assignment limits identify exactly which passages were read. Some evidence
is publisher narration scripts rather than timed captions; named clips keep
their own clocks. This does not certify unassigned speech, every textbook
claim, professional competence or continued provider availability.

The active evidence is split between video-content-review-20261030-complete.json
(the earlier 44) and video-library-review-20261030.json (this 303). Original
findings are in video-library-source-findings-20261030.json. Full third-party
transcripts and browser/session data must never be committed or shipped.

The completed review includes 192 Cyber, 66 Voice AI and 43 Child Development
assignments. The retired child assignments were an unverified duplicate
joint-attention video and an optional UNICEF launch event without an accessible
transcript; required primary readings and verified alternatives remain.
Cyber now uses the same local MathJax scheduler for authored lesson and recall
content; notebook text and code blocks are not typeset. No account schema,
progress data, callback or hosted permissions change is needed.

Writing clearly for learners
----------------------------
Use familiar words and direct sentences. Explain the problem and why a step
matters before naming the technical concept. Keep necessary technical terms,
but explain them when introduced and connect them to a concrete example.

Address the learner as "you" where useful. First-person questions and clearly
fictional dialogue can show a way to think; do not invent personal experience
or imply that a learner performed an experiment or clinical assessment.
Explain cause and effect explicitly. Break a long paragraph when it moves to
a new question, step, example or limitation. Put commands in code blocks.

Keep technical conditions, uncertainty, safety boundaries, units, mathematical
notation and worked answers precise. Simplifying language must not turn a
conditional claim into a guarantee. Use learner-facing wording such as "this
lesson" rather than authoring terms such as "native". Historical editorial
hashes describe their recorded version; recheck later changes independently.

Canonical exercise copies
-------------------------
The guide JSON exercise/challenge fields are canonical. The offline build-lessons.py packager derives module.practice and module.assessment in curriculum.json from those guides, preserving the downloadable map without a second manual edit. The Learn tab exposes the short content-file example as an optional practice idea; the worked walkthrough remains in the guide. Assess displays each module’s actual pass criteria.
