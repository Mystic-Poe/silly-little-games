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
3. add a card to the landing page (`index.html`)
4. merge to `main` to publish — github pages serves the whole site

## games

- **brick breaker** — action/arcade, chill & casual
