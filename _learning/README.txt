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
network, model, training or evaluation dependencies. Do not run provider demos,
training recipes, speech inference or evaluation harnesses to validate the site.

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
