# contributing

Thanks for adding a game! The whole flow is designed to take about five
minutes once you have the repo cloned.

## prerequisites
- `git`
- a browser for local testing
- (optional) [Claude Code](https://claude.com/claude-code) — it reads
  `CLAUDE.md` automatically and can scaffold the game for you

## add a new game

### 1. branch off main
```bash
git clone https://github.com/Mystic-Poe/silly-little-games.git
cd silly-little-games
git pull
git checkout -b game/<your-slug>
```
Pick a kebab-case slug (`snake`, `tic-tac-toe`, `mini-golf`). The slug
becomes both the branch name and the folder name — they must match.

### 2. build the game
```bash
mkdir -p games/<your-slug>
```
Drop in these four files:

**`games/<your-slug>/index.html`**
Your game's entry point. Keep it self-contained (link to the local
`style.css` and `game.js`).

**`games/<your-slug>/style.css`**
Styles for the game page.

**`games/<your-slug>/game.js`**
Game logic. Vanilla JS only — no frameworks, no npm.

**`games/<your-slug>/game.json`** *(required)*
```json
{
  "name": "display name",
  "tags": ["genre", "mood"],
  "author": "your name"
}
```
- `name` — shown on the card and in the preview's window title bar
- `tags` — searchable terms and the `·`-joined subtitle
- `author` — displayed as "by \<author\>" under each card

### 3. test locally
```bash
python3 -m http.server 8000
```
Then visit `http://localhost:8000/` to see the landing grid, or
`http://localhost:8000/games/<your-slug>/` to play just your game.

### 4. push
```bash
git add games/<your-slug>
git commit -m "add <your-slug>"
git push -u origin game/<your-slug>
```
That's it. Within ~1 minute the card appears on
[the live site](https://mystic-poe.github.io/silly-little-games/) with
your author line.

## rules
- **`main` is protected.** Never push to it directly; the auto-publish
  workflow and merged PRs are the only paths in.
- **`games.json` is auto-generated.** Don't edit it by hand — the
  workflow regenerates it from every `games/*/game.json` on each push.
- **Keep it vanilla.** No frameworks, no build tools, no external
  dependencies. Static files only.
- **Stay chill.** No hard game-over screens, no rage-bait difficulty.
  Gentle resets, pastel palette, low-friction starts.

## updating an existing game
Same flow: check out `game/<its-slug>` (re-create from main if you
deleted it), push changes to `games/<its-slug>/`, and the workflow syncs
the new version to main.

## landing page or infrastructure changes
For anything outside `games/<slug>/` — landing-page styling, workflow
tweaks, README updates — open a normal PR against `main`. The owner
will review and merge.

## design guidelines
See [`CLAUDE.md`](./CLAUDE.md) for the full design notes, house palette,
and Claude Code conventions.
