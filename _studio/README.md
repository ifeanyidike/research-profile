# Algo Studio on ifeanyidike.com

The standalone app is in `algo-studio/`. GitHub Pages publishes it at
https://ifeanyidike.com/algo-studio/ using this repository’s existing Jekyll workflow.
There is no application server, paid hosting service, or ChatGPT hosting dependency.
Python runs locally in the browser using the bundled runtime.

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

Saved progress remains private to the signed-in user. Lessons and source code are
public. Browser-local progress and login sessions do not automatically move between
domains. On the previous studio, sign in and add browser progress to the account;
then sign in here with the same email. Alternatively export a backup there and
import it here through More options. Importing replaces current workspace progress.
Do not remove the old studio until the learner confirms their progress was moved.

## Publishing updates

Edit the files in `algo-studio/` and commit them to `main`. The existing GitHub
Pages workflow builds and deploys the website. Bump the version query on `app.js`
and `styles.css` in `algo-studio/index.html` whenever those assets change; also
version any changed module imports that may already be cached by browsers.

The app is browser-based, not a secure assessment environment. Existing lesson IDs
and backup format are preserved. Complete Python test runs must be repeated on a
new device; copied test-credit tokens are not synced.
