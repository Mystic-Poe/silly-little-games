# silly little games

a collection of chill web games served from github pages.

## structure

```
/                       ← landing page (auto-renders all games)
/games.json             ← auto-generated registry of all games
/games/<slug>/          ← one folder per game, self-contained static site
/games/<slug>/game.json ← per-game metadata (required)
```

## workflow

1. start a new game on its own branch: `git checkout -b game/<slug>`
2. build it in `games/<slug>/` as vanilla html/js/css (no build step)
3. include a `games/<slug>/game.json`:
   ```json
   {
     "name": "display name",
     "tags": ["genre", "mood"],
     "author": "your name"
   }
   ```
4. push the branch — the `publish game branch` action auto-copies `games/<slug>/` into `main`, rebuilds `games.json`, and triggers a github pages rebuild
5. the landing page at `https://mystic-poe.github.io/silly-little-games/` automatically adds a card for it with the author attribution

## games

- **brick breaker** — action/arcade, chill & casual
- **memory match** — puzzle, memory, chill
