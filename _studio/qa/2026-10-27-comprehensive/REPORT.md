# Comprehensive Algo Studio revision: local verification

27 October 2026. Local preview: http://127.0.0.1:4173/algo-studio/

## Scope

- 108 guided lessons, 108 checkpoints, 66 mixed exercise locations, 20 stages.
- 42 new lessons, each with a derivation and four authored example states.
- 20 reasoning scenarios, 80 checked decisions, four self-reviewed writing fields per scenario.
- Six project briefs; four new briefs include interfaces, acceptance criteria, and an independent extension.
- Existing IDs and saved progress retained. Reasoning records do not grant lesson/checkpoint credit.

## Offline verification

`npm --prefix _studio run check` passed. `npm --prefix _studio test` passed all 90 tests.
All external account I/O is mocked. The Python tests execute only authored algorithm code and standard-library independent specifications, not live models or external services.

All 282 reference solutions passed 4,314 supplied cases and 28,200 generated inputs. Tests also execute the actual Python-runner source on every supplied case and trace every reference example. Seven realistic wrong advanced algorithms are rejected. The picture tests check BST order, feasible flow/capacity conservation, matching eligibility, and convex-hull orientation.

Backup and sync tests cover legacy state, saved new-lesson drafts, concurrent reasoning-field edits, and explicit import of reasoning-only guest work. Completed reviews remain read-only until a fresh attempt; early repetitions do not advance delayed review schedules.

## Browser verification

The in-app browser used the documented standalone static server. Phone viewport: 375 × 812. Desktop viewport: 1280 × 900.

- Traversed all 42 new lessons and all 168 new worked-example states through the UI. No horizontal overflow detected at phone width. `walkthroughs-mobile.json` records their visible text.
- Visited all 20 reasoning pages: four decision groups and four writing fields each; no phone overflow. Completed one review, reloaded, confirmed the recorded label and saved writing, then started a fresh review and confirmed empty editable fields with previous writing preserved. This created a demonstration draft in the local guest workspace.
- Re-traversed all 16 new AVL, flow, matching, and convex-hull SVG states after adding the pictures. No phone overflow. Screenshots and `illustrations-mobile.json` are saved alongside this report.
- Opened the vocabulary accordion in an advanced lesson, stepped backward, and confirmed it stayed open.
- Confirmed all 66 mixed cards, all six project cards, and four detailed new project contracts are visible. Checked project and review-index layout on phone and desktop.
- Used the explicit solved-code copy control and ran the minimum-cut checkpoint in the bundled browser Python runtime: all 15 cases passed. No checkpoint completion was recorded by this check.
- Final browser console check: no errors.

Editorial inspection caught and corrected an incorrect explanation of the first minimum-cut case, a radix digit mismatch, and several example explanations that referred to a different input. The derivation is shown once rather than repeated in two sections. The review index heading was corrected to use the existing page-intro layout.

## Limits

Docker is unavailable, so the full production Jekyll build was not verified. No deployment or push was performed. Browser evidence demonstrates the inspected flows, not every possible learner action. Finite cases and independent small-input specifications do not prove all-input correctness or learner comprehension. Written correctness arguments and project extensions require human review; repeated questions are labelled familiar practice, not unseen assessment.
