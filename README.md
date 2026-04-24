# silly little games

a collection of chill web games served from github pages.

## structure

```
/              ← landing page (lists all games)
/games/<name>/ ← one folder per game, self-contained static site
```

## workflow

1. start a new game on its own branch: `git checkout -b game/<name>`
2. build it in `games/<name>/` as vanilla html/js/css (no build step)
3. push the branch — the `publish game branch` action auto-copies `games/<name>/` into `main`, which triggers a github pages rebuild
4. the game is live at `https://mystic-poe.github.io/silly-little-games/games/<name>/`
5. when ready to show it on the landing grid, add a `<a class="card">` entry to `index.html` on `main`

## games

- **brick breaker** — action/arcade, chill & casual
