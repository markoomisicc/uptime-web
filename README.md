# Uptime Web

Frontend for a website and API uptime monitoring service, with downtime alerts and public status pages.

Backend: [uptime-api](https://github.com/markoomisicc/uptime-api)

## Tech stack

- Angular 22

## Getting started

Requirements: Node.js 24+, running [uptime-api](https://github.com/markoomisicc/uptime-api) backend

```bash
npm install
npm start
```

The app runs on `http://localhost:4200`. Requests to `/api` are proxied to the backend on `http://localhost:8080`.
