Voice AI Studio and Child Development & Therapy Studio
====================================================

Two independent apps use the learning-studio browser runtime. Cyber and Algo
Studio are unchanged. Public routes are /voice-ai-studio/ and
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
reference, not the public video backbone. Edinburgh speech.zone is the public
speech lecture backbone. Older model lectures are conceptual, not current API
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
