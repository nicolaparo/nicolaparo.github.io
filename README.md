# Nicola Paro Portfolio (GitHub Pages)

This repository now hosts a static, responsive, bilingual technology portfolio for nicolaparo.github.io.

## Stack

- Static HTML/CSS/JavaScript
- Live data from Sessionize (client-side fetch)
- Local JSON content for curated sections
- Optional GitHub metadata enrichment for projects (stars, language, last update)

## Main Files

- `index.html`: Main homepage shell
- `assets/site.css`: Visual system and responsive styles
- `assets/site.js`: Rendering, i18n, data fetch, fallback logic
- `data/content.json`: Curated profile, projects, skills, and news
- `data/sessionize-fallback.json`: Fallback dataset if Sessionize is unavailable

## Content Updates

### Bilingual content (EN/IT)

Edit `data/content.json`:

- `tagline.en` and `tagline.it`
- `bio.en` and `bio.it`
- Section content entries under `highlights`, `projects`, and `news`

### Projects

For each project in `data/content.json`:

- `name`: Project title
- `description.en` and `description.it`: Card description
- `repo`: GitHub repository in `owner/repo` format (optional but recommended)
- `demo`: Relative or absolute URL for live demo (optional)
- `stack`: Technologies list

### Sessionize live sync

The homepage fetches:

- `https://sessionize.com/api/speaker/json/3vmqc4qxf0`

If this call fails, it falls back to `data/sessionize-fallback.json`.

## Deployment

Deploy as standard GitHub Pages static site from the repository root.

No build step is required.