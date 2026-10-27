# Algo Studio on ifeanyidike.com

The standalone app is in `algo-studio/`. GitHub Pages publishes it at
https://ifeanyidike.com/algo-studio/ using this repository’s existing Jekyll workflow.
There is no application server, paid hosting service, or ChatGPT hosting dependency.
Python runs locally in the browser using the bundled runtime.

## Studio interface — 27 October 2026

The interface now uses an editorial layout with warm surfaces, forest-green
navigation, restrained serif headings, consistent line icons, and a clear
reading hierarchy. The dashboard gives the next lesson one primary action,
followed by course, mixed-practice, and reasoning entry points. The course
outline groups its twenty stages into four visible phases. The content,
completion rules, lesson IDs, saved drafts, and account model are retained.

`studio-ui.css` is the shared presentation layer after the existing functional
styles; `studio-ui.js` holds the original inline icons, dashboard illustration,
and phase labels. No external UI library, image service, or new font request is
introduced. The existing local Source Sans 3 is paired with the system serif.

The sidebar becomes a compact labelled icon rail on tablets and gives way to
bottom navigation on phones. Phone layouts put the next lesson before the
illustration, use native form controls at readable sizes, preserve the editor’s
aligned highlighting, and keep lesson controls reachable. Focus outlines,
reduced-motion preferences, text contrast, and safe-area spacing are included.

All 90 offline tests and syntax checks pass. Browser checks cover fifteen
screens at ten widths from 320 to 1440 pixels, including both sides of the
navigation breakpoints, with no document overflow in 150 checks. Selected
screens were visually inspected at phone, tablet, and desktop sizes. Keyboard
search, accordion persistence, account-dialog controls, and the real browser
Python runner were also checked; the minimum-cut checkpoint passed 15 cases.
Evidence is under `_studio/qa/2026-10-27-ui/`. These checks are not a claim of a
complete accessibility audit. The change is local and has not been published.

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

## Comprehensive course revision — 27 October 2026

The current algorithm course has **108 guided lessons, 108 topic checkpoints,
and 66 mixed exercises: 282 coding exercise locations across 20 stages**.
Several locations deliberately revisit a contract with a different algorithm;
these totals do not mean 282 unrelated problem types. The initial audit below
records the earlier 66-lesson revision. All existing IDs, saved code, notes, and
completion keys remain stable. New lessons append IDs 66–107.

The nine added stages cover:

- Loop invariants, induction, recurrence costs, amortized work, and lower bounds.
- Stable sorting, counting/radix sorting, selection, and randomized algorithms.
- BST deletion, AVL insertion, subtree summaries, common ancestors, and segment trees.
- Directed cycles, strongly connected components, bridges, articulation points, and DAG optimization.
- 0–1 BFS, all-pairs paths, Prim, maximum flow/minimum cuts, and bipartite matching.
- Reconstructed and rolling-state DP, weighted scheduling, interval/tree/subset DP.
- Monotonic deques, sweep-line events, and constrained backtracking.
- Modular arithmetic, sieves, combinations, inverses, and congruences.
- Exact search, certificates, approximation guarantees, convex hulls, and verified rolling hashes.

Every new lesson introduces the situation, derives an approach, explains why
its updates are safe, and walks through four concrete states before asking for
code. Vocabulary, assumptions, boundaries, and time/memory costs accompany the
exercises. Reused derivation paragraphs are shown once. Diagrams of rotations,
flow, matching, and convex-hull construction supplement the numeric state cards.
Checkpoint and mixed variations change the requested result, constraints, or
assumptions, rather than only changing example numbers.

`#reasoning` adds twenty stage-aligned scenarios with **80 checked decisions**
and four saved writing prompts per scenario: method choice, correctness, a fresh
boundary/counterexample, and cost. Completing one requires checked decisions and
explicit self-review. Writing length ensures a draft exists; it does not grade
its argument. Help and repeated attempts are labelled honestly. Completed work
is read-only until a fresh attempt starts, preserving the previous writing.
Delayed reviews follow 2/7/14/30-day intervals; an early repetition does not
advance the due date. Repeated questions remain familiar practice. These records
do not grant lesson/checkpoint credit or certify independent mastery.

Four additional project briefs bring the total to six. New briefs specify
a callable interface, acceptance conditions, prerequisite missions, and an
independent changed-requirement extension. The final mission checks the stated
function; proof quality and project extensions still need human review.

Reasoning drafts join the existing validated backup and per-field account
replica. Offline tests cover legacy backups, conflicting edits on two devices,
and importing guest work that contains only reasoning notes. Account I/O is
mocked. No schema migration, new paid service, live model probe, or automated
language judge is involved. Older tabs should refresh before editing new IDs.

The specialist continuation list now contains genuinely remaining topics,
including external-memory structures, advanced graph algorithms, suffix
structures/FFT, streaming, and deeper complexity theory. This is a much broader
course; completing a finite course still cannot guarantee solving every future
problem or establish expertise without independent practice and feedback.

### Comprehensive revision validation

The isolated offline suite checks all 282 reference solutions, every supplied
expected answer, and **28,200 generated inputs** against independent small-input
specifications. Seven intentionally incorrect advanced algorithms are rejected
by the learner cases, including lost residual reverse edges, false directed
cycles, low-link equality errors, greedy matching, unreachable DAG states, and
hash-only equality. The actual Python runner executes all provided cases and
traces every reference example. Small finite domains are exhausted instead of
fabricating twelve distinct extra inputs where fewer valid inputs exist.

All 90 offline tests pass, covering 4,314 supplied cases. Browser checks
traversed all 168 new walkthrough states and 20 reasoning pages at phone width,
checked desktop layouts, and passed the 15-case minimum-cut exercise in the
bundled Python runtime. Browser evidence is in
`_studio/qa/2026-10-27-comprehensive/`. The standalone
static-server preview is used because the Docker daemon is unavailable; a full
production Jekyll build has not been verified. These changes remain local.

## Initial teaching and curriculum audit — 27 October 2026

The pre-change inventory was 60 guided lessons, 60 different topic checkpoints,
and 12 mixed problems: 132 coding exercises. Individual test cases are not
additional problems. Existing lessons did introduce concepts in paragraphs;
the gap was often explaining how a learner could arrive at the method and why
it was safe. Reading a short worked answer is not the same as being able to
choose that method on an unfamiliar task.

The course now has 66 guided lessons, 66 topic checkpoints, and 24 mixed
problems: 156 coding exercises across 11 stages. All existing lesson IDs,
exercise keys, code, notes, and completion records are retained. Six new lessons
append IDs 60–65: maximum-sum subarrays, prefix totals with frequency lookup,
binary search over feasible answers, bipartite graph checks, multi-source BFS,
and edit distance. Edit distance already appeared as a checkpoint after the LCS
lesson without a dedicated introduction; that checkpoint now links to its new
guided lesson. This is added teaching depth, not a claim that the algorithm was
entirely absent from practice. The new checkpoints change a meaningful rule: circular input,
balanced binary stretches, ordered daily shipping, returning graph assignments,
spreading with blocked cells, and forbidding replacements. Twelve additional
mixed tasks cover other outputs and combinations of existing ideas.

Every lesson now shows three authored reasoning paragraphs before the exercise:
a straightforward starting plan, an observation that improves it, and why the
result works under its assumptions. These appear without opening the worked
Python solution. Important distinctions include positive-only windows versus
negative sums, BFS versus weighted search, a set versus frequencies, greedy
exchange arguments, and once-only versus reusable DP items. All 66 lessons have
an accompanying illustration or state table at every worked-example step.
Tables and connection maps are conceptual aids; executable Python tracing is
still separately available in the solved-example panel.

### Confirmed defects and discoverability gaps

- On the live site, opening “Words in this lesson, explained” in lesson 36 and
  moving to another example step closed the disclosure. A whole-page rebuild
  recreated native details elements without their user-selected open state.
  Session-local snapshots now preserve open **and closed** choices by lesson,
  lesson part, and nested summary path. Controlled solution exposure still uses
  the existing learning state. Account switches clear disclosure snapshots.
- The fixed-window example skipped the intermediate window with sum 7. It now
  shows each move separately: sums 8, 7, and 9, with matching highlighted cells.
- The recursion picture showed later calls too early; nested sums, memoization,
  grid DP, and knapsack also showed later states before their narration. These
  now have individual authored states. The search-tree picture used generic
  root/left/right labels unrelated to the numerical search; it now shows the
  actual comparisons. Binary search now keeps target 17 throughout its example.
- Several other lessons had no illustration. They now show actual example
  values, waiting work, chosen results, or table entries. The initial suspicion
  about insertion-sort value frames was not confirmed: they already matched
  their three narrated steps. Its empty-input caption and highlighted-index
  metadata did need correction.
- Mixed practice used to hide every problem until optional checkpoint credit
  existed. A learner could complete guided lessons and see an empty bank.
  All 24 mixed problems are now visible, with readiness and links to required
  foundation checkpoints. Completing a lesson still does not award independent
  checkpoint credit.

### What is still missing for an expert course

The current course is a broad foundation, not a complete expertise programme.
The following are outstanding teaching work, not included lessons:

| Area                     | Current foothold                                                                           | Further work                                                                                                                                                               |
| ------------------------ | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Correctness and analysis | Loop rules, costs in words, informal safety arguments                                      | Induction, formal invariants, recurrence solving, amortized analysis, counterexample construction, lower bounds                                                            |
| Sorting and selection    | Insertion, merge, three-way quicksort                                                      | Counting/radix sorts, quickselect, stability and comparator design, adversarial pivot behavior                                                                             |
| Trees and range queries  | BST search/insertion, heaps, tries, Fenwick sums                                           | Deletion, balancing/rotations, path and subtree problems, segment trees, order statistics                                                                                  |
| Graphs                   | Traversal, paths, shortest paths, union-find, topological order, Kruskal, bipartite checks | Directed cycle reasoning, SCCs, bridges, articulation points, DAG DP, all-pairs paths, Prim, flow and matching                                                             |
| DP and state design      | Stair, grid, subsequence, knapsack, edit-distance examples                                 | Interval/tree/bitmask DP, deriving states from constraints, optimization and reconstruction tradeoffs                                                                      |
| Other techniques         | Two-pointer/window methods, prefix totals, KMP, XOR, Euclid                                | Monotonic deques, sweep lines, richer backtracking and pruning, modular arithmetic, sieves, combinatorics, randomized algorithms                                           |
| Transfer and assessment  | 24 mixed tasks, recall, two guided projects                                                | Multiple unseen variations per major idea, multi-stage projects with independent acceptance criteria, delayed unseen assessments, human review of reasoning and complexity |

This gap assessment used the actual exercise inventory and a comparison with
[MIT 6.006's calendar](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/pages/calendar/)
and [MIT 6.046's calendar](https://ocw.mit.edu/courses/6-046j-design-and-analysis-of-algorithms-spring-2015/pages/calendar/).
The comparison is a curriculum-design judgment, not a claim of equivalence to
those courses. Their [6.046 learning objectives](https://ocw.mit.edu/courses/6-046j-design-and-analysis-of-algorithms-spring-2015/pages/syllabus/)
include correctness proofs and synthesizing algorithms; a completion count does
not demonstrate those abilities.

Next, deepen one family at a time: teach a derivation, offer guided completion,
change an assumption that invalidates the old method, then give an unseen mixed
problem after a delay. Require learners to explain their choice, give a safety
argument, construct a boundary case, and analyze time and memory. Notes and
output tests do not currently grade those explanations or enforce every named
algorithm restriction. More examples alone will not close that assessment gap.
No finite bank can guarantee solving every problem encountered elsewhere.

### Validation and limits

The local offline suite checks every supplied expected answer against independent
specifications and 100 generated inputs per reference solution (15,600 generated
inputs across 156 exercises). All new exercises also receive at least 12 varied
learner-facing cases. Checks include the actual Python runner, result types,
known wrong implementations, prerequisite order, every illustration's rendering,
regressions for mismatched intermediate states, disclosure restoration, legacy
backups, and synchronization of new lesson/practice drafts. These run only local
Python/JavaScript, with account I/O mocked; no model providers are used.

The final local suite has 80 passing tests and 2,446 supplied learner cases.
Browser checks traversed all 66 algorithm lessons and 211 illustrated states,
confirmed disclosures stay open while stepping and when returning from another
lesson part, and verified all 24 mixed problems are visible. The new maximum-sum
lesson also passed its 16 cases in the actual bundled browser Python runtime.
The final browser console check reported no errors. Evidence is saved under
`_studio/qa/2026-10-27/`. No claim of phone-layout verification is made.

The standalone app is checked through its documented static-server setup.
Docker was unavailable, so a full production Jekyll build was not verified.
The change is local until explicitly published. Editorial review and deterministic
checks do not establish learner comprehension, the correctness of every possible
input, or mastery after completion. Existing older tabs should refresh before
working with new lesson IDs; exporting a backup first remains available.

## Develop and verify

From `_studio/`, run `npm run dev`, then open
http://localhost:4173/algo-studio/. Run `npm run check` and `npm test` from this
folder. The tests verify all 282 reference solutions, expected answers, learning
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
