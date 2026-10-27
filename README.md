# Uptime Web

Frontend for a website and API uptime monitoring service, with downtime alerts and public status pages.

Backend: [uptime-api](https://github.com/markoomisicc/uptime-api)

## Tech stack

- Angular 22
- [Transloco](https://jsverse.gitbook.io/transloco) for translations (English, German)

## Getting started

Requirements: Node.js 24+, running [uptime-api](https://github.com/markoomisicc/uptime-api) backend

```bash
npm install
npm start
```

The app runs on `http://localhost:4200`. Requests to `/api` are proxied to the backend on `http://localhost:8080`.

## Project structure

```
src/app/
├── core/          # models, services, guards and API endpoints
├── components/    # presentational components (inputs and outputs only)
└── pages/         # route pages, composed only of components
```

## Translations

Translation files are in `public/i18n/`, one per language (`en.json`, `de.json`). Every key must exist in all languages.

German texts use the informal "du" form.

Backend errors are translated by their error code under the `errors` key, e.g. `errors.invalid_credentials`. If a translation is missing, the message from the backend is shown instead.
