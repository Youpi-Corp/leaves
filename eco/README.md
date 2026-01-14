# Eco audit with sitespeed.io

## Objective
Run a reproducible performance/eco-design audit, including pages behind login, via Docker.

## Prerequisites
- Docker
- Access to a test account

## Environment variables

```
export BF_BASE_URL="https://app.brainforest.example"
export BF_EMAIL="dev@example.com"
export BF_PASSWORD="your-password"
```

Or use the helper script:

```
cp eco/.env.example eco/.env
# edit eco/.env
chmod +x eco/run-audit.sh
./eco/run-audit.sh
```

## Commands

- Docker (recommended):

```
npm run audit:eco
```

- Local (optional):

```
npm run audit:eco:local
```

By default, `iterations` is 1 for speed. You can raise it to 3 in `eco/sitespeed.json` to stabilize results.

## Where to find the HTML report

- `eco/reports/index.html`

## Metrics to review

- Total page weight
- Number of requests
- Breakdown of JS/CSS/images
- Key timings (TTFB, FCP, LCP, etc.)

## Limits

- Network and cache variability
- Depends on login selectors (see `eco/selectors.md`)
- SPAs may need additional waits

## How to add new pages to the flow

Update the `DEFAULT_PAGES` list in `eco/userflow-after-login.mjs` to add, remove, or rename routes.
