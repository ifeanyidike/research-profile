# Algo Studio on ifeanyidike.com

The standalone app is in `algo-studio/`. GitHub Pages publishes it at
https://ifeanyidike.com/algo-studio/ using this repository’s existing Jekyll workflow.
There is no application server, paid hosting service, or ChatGPT hosting dependency.
Python runs locally in the browser using the bundled runtime.

## System design track

Open `/algo-studio/#system`. The track has 24 foundation lessons followed by six
design studios: short links, notifications, private uploads, group chat, activity
feeds, and booking. Source Sans 3, the existing navigation shell, Google/email
sign-in, and hosting are shared with the algorithm course. No new service,
runtime dependency, paid API, or model-based grading is required.

`system-design-course.js` holds original plain-language explanations, worked
steps, scenario decisions with per-option feedback, reference reasoning, briefs,
and links to consulted primary references and public curricula.
`system-design-model.js` contains prerequisites, completion/review rules,
validated progress fields, and deterministic capacity/cache/queue models.
`system-design-ui.js` presents four lesson steps, responsive diagrams, labs,
six-prompt case notebooks, personal notes, and review. Later lessons may be
previewed, but the guided completion sequence requires preceding completion.

Completion requires a checked scenario answer, a short written explanation, and
explicit self-review. Case studies also require all six notebook drafts. Text
length checks ensure a draft exists; they do not grade correctness. Opening a
solved example or using multiple attempts records supported practice. Reviews
ask for another decision and a fresh example, then schedule another review.
Neither completion nor repeated questions establish independent mastery.

The labs are deliberately simplified steady-rate models, with assumptions shown
beside the controls. They do not benchmark real servers, simulate a distributed
runtime, or prescribe actual infrastructure sizes or prices.

The optional `systemDesign` progress map preserves legacy algorithm backups.
Every edited field, unfinished notebook, lab setting, and lesson position uses
the existing per-field account replica and private progress table. No database
migration or access-policy change is needed. Backup export/import includes both
tracks. Older still-open app versions cannot read the new replica paths; export
any pending work and refresh those tabs before continuing across devices.

Run the isolated offline checks from `_studio/`:

```sh
node --test tests/system-design.test.js tests/sync.test.js tests/account-sync.test.js
```

These tests import static course data and pure models, and mock all account I/O.
They cover prerequisite order, completion, review, legacy backups, validation,
cross-device unfinished work, account import, and lab boundary calculations.

### Content audit — 16 October 2026

Reviewed all 30 lessons against the linked engineering references and public
curricula. Access-control basics now precede private-data modeling. Explicit
`concepts` dependencies accompany the sequential route, so changing the route
cannot silently place a stated knowledge dependency after its use. Lesson IDs,
answer indices, saved notes, and the four existing walkthrough positions remain
stable. Previously recorded completion stays accessible after reordering; the
recommended next activity picks up missing foundations.

Each lesson now has short explanation paragraphs, a local vocabulary list, a
concrete scenario, four authored `frames`, and four numbered `solutionSteps`.
Frames show the action, named values, and why the step matters. Only the current
state and previous actions are exposed; learners advance with Next/Previous.
The optional role sketch is a conceptual aid, not an executable topology.

The audit clarified PostgreSQL conditional-update behavior and transaction
rollback, p95 and tail latency, durable retry-key scope and retention, outbox
duplicate delivery, provider acceptance versus inbox arrival, and the gap
between history replay and live chat updates. Uploads now validate and publish
the same fixed snapshot, because reusable upload URLs can replace pending
objects. Editable short links account for browser redirect caches as well as
server caches. The search lesson’s unrelated CAP reference was replaced.

Validation includes the offline sync/model/render tests, all 120 walkthrough
states traversed through the local browser UI, and desktop/phone inspection.
The source comparisons validate the teaching claims under their stated
assumptions; the examples do not execute real PostgreSQL transactions, queues,
object storage, or failure recovery. No live model-provider probes or automated
language judges were used. Plain-language review is editorial work, not a claim
that a learner comprehension study has been performed.

## Develop and verify

From `_studio/`, run `npm run dev`, then open
http://localhost:4173/algo-studio/. Run `npm run check` and `npm test` from this
folder. The tests verify all 132 reference solutions, expected answers, learning
progression, editor behavior, and offline/account progress merging.

The `runtime/` directory contains unmodified third-party distributions and their
licenses. Keep it excluded from formatting. Source Sans 3 and its license are
bundled in `fonts/`.

The main Jekyll site copies the standalone HTML, CSS, JS, font, and runtime files
as static assets. The main site’s PurgeCSS configuration targets its own
`assets/css/` directory, so it does not remove the studio’s dynamic styles.
The `_studio/` development folder is excluded from publication by Jekyll’s
underscore-directory convention. Never add frontmatter to the standalone app HTML.

## Learner-facing test coverage — 19 October 2026

All 132 algorithm exercises now include 12 additional deterministic cases each:
2,064 supplied cases in total. Original teaching examples remain first. The
extra cases cover varied small inputs plus authored boundaries such as singleton
and full-length windows, last-position matches, duplicates, empty inputs,
disconnected graphs, ancestor bounds, and tie rules where their contracts allow.

`extra-test-cases.js` contains fixed input/answer data, generated offline by
`tests/generate-extra-cases.py` using the independent specifications in
`tests/oracles.py`. Expected answers are not obtained from the worked solutions.
`tests/learner-cases.test.js` checks reproducibility and exercises the actual
Python runner against constant answers for all 132 exercises and 15 plausible
incorrect implementations. The pairs-only window implementation passes the
original four cases and fails the expanded set, preserving the original bug as
a regression check.

These are formative output checks. They do not prove correctness for every
input, enforce every algorithm restriction, or establish time/space complexity.
Those still need code review and an explanation from the learner. Previously
recorded completion remains; cached run results are cleared on a test-suite
revision so learners must rerun their saved code against the new cases. Bump
`testSuiteVersion` in `lesson-navigation.js` when changing the suite. No account or database changes are required.

## Sign-in and progress

Supabase project: `jqgnmnvwjlpsdxckxkfx`. Only its publishable browser key appears
in `algo-studio/sync-config.js`. This key is deliberately public; row-level security
requires a verified user identity for all progress access. Never add a secret key,
service-role key, database password, or dashboard credential to this repository.
Database setup and rolled-back access checks are in `_studio/supabase/`.

The production Supabase Site URL should be
`https://ifeanyidike.com/algo-studio/`. Its redirect allowlist includes that exact
URL and the previous studio origin during migration. PKCE sign-in returns to the
app folder, not the personal website’s home page. Open each sign-in email in the
browser where the link was requested. The default Supabase email sender supports
only project team addresses, with two emails per hour. Free projects may pause
after inactivity. Wider sign-up access needs a separate email provider or social
login setup; do not disable email confirmation.

Google sign-in uses the same Supabase project and progress table. Its OAuth client
belongs to the dedicated Google project `algo-studio-511809`.
It is configured only for basic Google identity (openid, email, profile), with
`https://ifeanyidike.com` as the JavaScript origin and
`https://jqgnmnvwjlpsdxckxkfx.supabase.co/auth/v1/callback` as the Google callback.
The client secret belongs only in Supabase’s provider settings, never in this
repository or the browser app. Set `googleEnabled` in `sync-config.js` only after
the Google provider and manual identity linking are configured and tested.
Google's basic-identity-only exception permits sign-in without adding test users
or requesting sensitive-scope verification:
https://developers.google.com/identity/protocols/oauth2/production-readiness/overview.

For an existing learner whose Google email differs from the learning account,
sign in to the original account by email first and choose **Connect Google to
this account**. The app saves and syncs pending work, checks the current identity,
then uses Supabase `linkIdentity`, retaining the same user ID and progress. Do not
create a replacement learning account or move progress rows to a different user.
After linking, **Continue with Google** opens that same account on other devices.
For matching verified emails, Supabase automatically links the identities.
The bundled Google icon is Google's supplied sign-in asset from
https://developers.google.com/static/identity/images/g-logo.png; button guidance:
https://developers.google.com/identity/branding-guidelines.

Saved progress remains private to the signed-in user. Lessons and source code are
public. Browser-local progress and login sessions do not automatically move between
domains. On the previous studio, sign in and add browser progress to the account;
then sign in here with the same email. Alternatively export a backup there and
import it here through More options. Importing replaces current workspace progress.
Do not remove the old studio until the learner confirms their progress was moved.

Lesson and practice pages show whether work is saved on this device, waiting to
sync, or synced to the account. Worked-example steps, answers, unfinished code,
and notes sync as you work; finishing a lesson is not required. The app also
attempts a sync when the phone goes into the background. Offline changes remain
in the account cache and retry on reconnection. Abruptly closing a browser before
an upload finishes still requires reopening that browser to send pending edits.

If an older open tab reports “the saved progress could not be read”, export its
backup before refreshing, then import it after updating. That version could fail
to persist a newly rendered draft; the unsaved draft may exist only in the tab.

## Publishing updates

Edit the files in `algo-studio/` and commit them to `main`. The existing GitHub
Pages workflow builds and deploys the website. Bump the version query on `app.js`
and `styles.css` in `algo-studio/index.html` whenever those assets change; also
version any changed module imports that may already be cached by browsers.

The app is browser-based, not a secure assessment environment. Existing lesson IDs
and backup format are preserved. Complete Python test runs must be repeated on a
new device; copied test-credit tokens are not synced.
