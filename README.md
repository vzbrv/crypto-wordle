# IQ.wiki Web3 Wordle Widget

Static GitHub Pages build of the IQ.wiki Web3 Wordle widget.

## Deploy

1. Create a new GitHub repo.
2. Copy these files into the repo root.
3. Push to the `main` branch.
4. In GitHub, enable Pages with **GitHub Actions** as the source.

The workflow validates the game, stages an explicit `dist/` artifact, then
publishes that artifact. Pages never receives tests, workflows, or source
tooling.

## Local checks

```sh
npm ci
npm run check
npm run build
```

## Files

- `index.html` - widget page and browser controller.
- `game-logic.js` - isolated game rules and scoring.
- `assets/iq-logo-pink.svg` - official IQ.wiki brand mark.
- `.nojekyll` - disables Jekyll processing.
- `.github/workflows/checks.yml` - validates HTML, assets, game rules,
  accessibility, and browser gameplay.
- `.github/workflows/pages.yml` - validates and deploys the staged Pages build.

Visual styling follows the [IQ.wiki brand kit](https://iq.wiki/branding).

## Security model

The saved browser state contains guesses only. Win/loss status is derived again
when the page loads, so editing `localStorage` cannot directly set the answer or
claim a win.

This is a static, client-side game. Its answer pool and selection logic are
delivered to the browser and are not secret from a determined user. Enforcing
secret daily answers requires moving answer selection and guess validation to a
trusted server or edge function; GitHub Pages cannot provide that boundary.
