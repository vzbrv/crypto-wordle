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
