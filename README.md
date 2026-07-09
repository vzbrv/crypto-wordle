# IQ.wiki Web3 Wordle Widget

Static GitHub Pages build of the IQ.wiki Web3 Wordle widget.

## Deploy

1. Create a new GitHub repo.
2. Copy these files into the repo root.
3. Push to the `main` branch.
4. In GitHub, enable Pages with **GitHub Actions** as the source.

The included workflow publishes the repo root as a static site. No install or build step is required.

## Files

- `index.html` - widget page and game logic.
- `assets/iq-logo-pink.svg` - official IQ.wiki brand mark.
- `.nojekyll` - disables Jekyll processing.
- `.github/workflows/pages.yml` - deploys to GitHub Pages.

Visual styling follows the [IQ.wiki brand kit](https://iq.wiki/branding).

## Security model

The saved browser state contains guesses only. Win/loss status is derived again
when the page loads, so editing `localStorage` cannot directly set the answer or
claim a win.

This is a static, client-side game. Its answer pool and selection logic are
delivered to the browser and are not secret from a determined user. Enforcing
secret daily answers requires moving answer selection and guess validation to a
trusted server or edge function; GitHub Pages cannot provide that boundary.
