# Eleventy (11ty) setup for GC Design System templates

This repository now includes an Eleventy site that renders the `templates/` folder to `_site/` and is ready for AWS Amplify hosting.

## Structure

- `.eleventy.js`: Eleventy configuration (input: `templates/`, output: `_site`)
- `templates/_includes/layouts/base.njk`: Base layout using GC Design System (CDN)
- `templates/_data/site.json`: Site metadata
- `templates/english/english.11tydata.json`: Directory data for English pages
- `templates/french/french.11tydata.json`: Directory data for French pages
- `templates/{english,french}/index.njk`: Auto-generated indexes
- `templates/index.njk`: Root landing page
- `amplify.yml`: AWS Amplify build configuration

## Scripts

- `npm run dev` – start a local dev server (http://localhost:8080)
- `npm run build` – build static site into `_site/`

## Install & Run

1. Install Node 20 and run npm install
2. `npm run dev` to develop, or `npm run build` to create the production site

## GC Design System assets

The base layout references the GC Design System from the CDN. Update versions as needed. If you prefer npm-based assets for pinning/offline builds, replace the CDN links and passthrough copy the built assets.

## Bilingual routing

- English routes: `/en/<slug>/`
- French routes: `/fr/<slug>/`
- Language switcher uses `langAltUrl` computed per page; ensure the matching counterpart exists under the other language folder with the same fileSlug.

## Adding templates

Add files under `templates/english/` and `templates/french/` using the same filename for counterparts. Use Nunjucks (`.njk`) or plain HTML; both are supported. Pages inherit the base layout and language metadata via directory data files.

## Amplify hosting

Amplify picks `amplify.yml`, runs `npm run build`, and serves `_site/`. Set the environment Node version to 20. Configure custom domains to map `/en` to gcds.test.canada.ca and `/fr` to scgc.test.canada.ca or use two Amplify apps if required.

### Environment variables for language switcher and hreflang

Set these per Amplify environment:

- `HOST_EN` → e.g., `https://gcds.test.canada.ca`
- `HOST_FR` → e.g., `https://scgc.test.canada.ca`

Locally, defaults fall back to `http://localhost:8080` for both.
