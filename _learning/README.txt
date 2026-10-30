Voice AI Studio and Child Development & Therapy Studio
====================================================

Two independent apps use the learning-studio browser runtime. Algo Studio is unchanged; Cyber shares the scoped-resource renderer. Public routes are /voice-ai-studio/ and
/child-development-studio/. Each has its own auth session, local storage prefix,
backup kind and hosted progress table. A backup from one cannot enter another.

The child studio covers ages 0–18. Shared foundations feed separate caregiver
education and professional preparation paths. Professional study is not a
licence, supervised placement, diagnosis or individual treatment plan. Exercises
use fictional cases. Never enter information about an identifiable child.

Authoring
---------
_learning/voice.txt and child.txt contain original teaching. Each starts with
ID:: and uses named fields ending in ::. Blank lines remain paragraph breaks.
_learning/maps.json contains the researched sequence and exact assignments.
When changing a published release, update the HTML entry/stylesheet versions,
entry imports and config.version coherently. Changed shared modules also need
new import versions in their consumers. Do not serve a new renderer with an
old cached curriculum schema.
python3 _learning/build.py packages authored teaching, validates prerequisite
closure for each learning path and builds the public source maps. It has no
network, model, training or evaluation dependencies.
Each module also has three observable outcomes, a topic-specific study_focus and
video coverage/access notes. These appear in the lesson and readable source map.
Videos/readings have explicit stable progressKey values (video:N or reading:N).
Preserve a key when moving the same assignment; give replacement/new material a
new unused key. Never reuse a removed key: old backups retain those checks.
The client and hosted validators accept these existing numeric checklist keys;
no progress schema migration or learner-data rewrite is needed for this release. Do not run provider demos,
training recipes, speech inference or evaluation harnesses to validate the site.

Mathematics
-----------
Use \( ... \) for inline TeX and \[ ... \] for display equations in authored
lesson text, questions, solutions and source-map prose. Do not use dollar
signs as delimiters. Escape backslashes normally when editing JSON directly;
the named-field text files retain literal backslashes. Use EXAMPLE_FORMAT:: math
for a worked example containing mathematical prose/equations; omit it for
literal Python, event traces or other code. Base and AMS macros are supported.
Define symbols, show units and work a small example before the compact formula.
MathJax 3.2.2 is pinned and self-hosted under learning-studio/vendor, with its
licence and verified package provenance. It loads only on authored math views.
SVG output includes assistive MathML. Long display equations scroll and receive
keyboard focus. Notebook data and code blocks are never typeset.
The shared runtime serializes asynchronous typesetting, ignores disconnected
views and clears MathJax records before replacing lesson content. A load failure
leaves readable TeX and displays a retry notice. Bump the shared module/entry/
HTML/config versions together when changing the renderer or authored release.

Verification
------------
node --test _learning/tests/*.test.js
node --test _cyber/tests/*.test.js
Follow repository Docker build and full Prettier requirements. Browser QA must
cover path switching, all lesson tabs, separate accounts, guest notes, imports,
responsive navigation and media URL construction. Provider playback, clinical
correctness and graduate competence are not established by structural tests.

Source audit
------------
Research date: 30 October 2026. University source pages, source-hosted video
metadata and official professional guidance are reviewed, not mirrored.
Public video links point to exact clips or explicitly named sections on the
provider page. Restricted recordings and absent videos must be labelled honestly.
Stanford CS224S 2025 recordings require enrolment; its syllabus is a depth
reference, not the public video backbone. Edinburgh supplies focused speech clips; 3Blue1Brown provides the network/attention
introductions, with long university recordings labelled as optional depth where appropriate. Older model lectures are conceptual, not current API
instructions. Textbook chapters and official research papers provide depth.
Child source notes distinguish age coverage, educational modules, evidence
guidance and professional eligibility. WHO CST primarily covers ages 2–9 and
must not be presented as an adolescent programme. No institution endorses these
independent studios. Site progress is self-assessed and awards no qualification.

Deployment
----------
Install the dedicated progress-table SQL and verify RLS/merge behavior before
claiming hosted sync works. Preserve all existing tables, users, callbacks and
Site URL. Add only the two new production callbacks. Never test by emailing
synthetic users or submitting real child data.

Viewing and reading assignments — release 20261030-4
-------------------------------------------------
All three studios use learning-studio/resources.js and video.js. Keep the title,
URL and completion identity distinct from the assigned scope. Every video has an
assignment and watchMode (full, sections or segments). Full means the coherent
named unit is assigned; sections means named clips on a multi-item provider page.
Optional means further study, not another core viewing requirement.
For bounded YouTube excerpts add segments with integer start/end seconds and a
label, durationSeconds for the complete recording, and timingSource identifying
the published chapter/timing evidence. End is absolute from the recording start,
not an offset from start. Do not guess timestamps or derive them from runtime.
The player preserves both bounds; external watch links seek to the start and the
visible guide tells the learner where to stop. A single video does not inherit a
playlist. Validate ordered nonempty ranges within the known recording duration.
playbackUrl is used only when the publisher explicitly identifies the same video.
Do not infer that one iframe is the whole assignment on a multi-clip session page.
Readings and practical links also carry their scoped assignment. The readable
source-map downloads include assignments and excerpt ranges. Existing stable
progressKey values must remain attached to their original materials; replacements
get a new unused key. Cyber now follows the same resource-key rule as the other
studios. No learner-record rewrite or database migration is required.
Full source playback, every caption track and all claims in external books are
separate from source/topic alignment checks. Record access limits honestly.

Video coverage follow-up — release 20261030-5
-------------------------------------------
_learning/video-gap-review-20261030.json records the 31 topics that previously
had no core video, plus two topics with thin illustrative coverage. There are
43 new video assignments and one narrowed existing recording. Every new source
has durationSeconds, timingSource and a lesson-specific viewing guide with an
explicit range. Five existing W3C assignments now also state their full times.
The guide distinguishes video coverage from remaining native/reading objectives.
Several recordings are historical architecture/concept examples; their original
API, availability and benchmark claims must not be treated as current facts.
Video units on CanChild or conference collection pages are named explicitly; the
full collection is never implied. ASHA assessment Modules 2 and 3 precede Module 4
in P04, following Module 1 in P03. Imported old checkboxes keep their old source
identities. The follow-up changes no account or hosted-progress schema.
See video-gap-review-20261030.txt for verification evidence and access limits.
