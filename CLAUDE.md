# silly little games — project notes for Claude Code

Collection of chill web games hosted on GitHub Pages. Each game lives on
its own branch during development and auto-publishes to the live site
when pushed.

## Stack (hard constraints)
- Vanilla HTML / CSS / JavaScript only
- No frameworks, no bundlers, no npm, no build step
- Each game must run directly from static files under `games/<slug>/`

## Repo layout
- `/index.html`, `/style.css`, `/app.js` — landing page (auto-renders games)
- `/games.json` — auto-generated registry of all games. **Do not edit by hand** — the workflow regenerates it from every `games/*/game.json`.
- `/games/<slug>/` — a single self-contained game
  - `index.html`, `style.css`, `game.js` — the game itself
  - `game.json` — required metadata (see schema below)
- `/.github/workflows/publish-game.yml` — auto-publish pipeline

## `game.json` schema (required for every game)
```json
{
  "name": "display name (lowercase is the house style)",
  "tags": ["genre", "mood"],
  "author": "your name"
}
```
- `name` (string, required) — shown on the card and in the window title bar
- `tags` (string[], optional) — used for search and shown as `·`-separated subtitle
- `author` (string, required) — shown as `by <author>` under the card

## Branch convention
- Branch name: `game/<slug>`
- Folder name: `games/<slug>/`
- Slug must match between them (kebab-case, lowercase)
- The publish workflow errors out if the folder is missing or the slug doesn't match

## Adding a game — the only supported flow
1. `git checkout -b game/<slug>` off the latest `main`
2. Create `games/<slug>/` with `index.html`, `style.css`, `game.js`, and `game.json`
3. Commit and push the branch
4. The `publish game branch` workflow copies `games/<slug>/` into `main`, rebuilds `games.json`, and triggers the Pages rebuild
5. The landing page automatically renders a new card for the game with the author attribution

Do NOT edit `index.html`, `app.js`, or `games.json` to add a card. Cards are generated from `games.json`, which is generated from per-game `game.json` files.

## `main` is protected
Direct human pushes to `main` are blocked. Changes land via:
- The `publish game branch` workflow (for new/updated games) — allowed because `github-actions[bot]` is in the ruleset bypass list
- Pull requests (for landing-page styling, workflow changes, README, etc.)

Never try to push directly to `main`. If a change isn't game content, open a PR.

## Design guidelines (the vibe)
- Dark gradient background, pastel game elements
- **No hard game-over screens.** Losing should feel gentle — respawn, reset, keep going.
- Support mouse + keyboard (and touch where sensible)
- Canvas games: render at a fixed internal resolution (e.g. 800×600, 4:3) so the mini-window iframe preview on the landing page looks consistent. Let CSS scale for responsiveness.
- Subtle animation/polish (trails, particles, tween transitions) is encouraged; harsh visual feedback is not
- Low friction to start — no menus, no tutorials; players should be playing within a second of loading

## House palette (optional but recommended)
Pastel accent colors used across existing games:
```
#ffd6a5  #fdffb6  #caffbf  #9bf6ff
#a0c4ff  #bdb2ff  #ffc6ff  #ffadad
```
Background gradient:
```
#1a1a2e → #16213e  (135deg)
```
Foreground text: `#e8e8f0`. Muted: `#8a8a95`.

## Local testing
```
python3 -m http.server 8000
# open http://localhost:8000/
# or http://localhost:8000/games/<slug>/
```
The landing page fetches `games.json`, so it must be served over HTTP (not `file://`).

## Commit / PR style
- Imperative, lowercase, short first line (≤72 chars)
- Body explains WHY, not WHAT (when non-obvious)
- One logical change per PR. Landing-page work and game work stay separate.

## Out of scope for this repo
- Multiplayer, networking, backend services
- User accounts, leaderboards, analytics
- Anything requiring secrets beyond the built-in `GITHUB_TOKEN`
- Ad integrations, trackers, or third-party scripts
