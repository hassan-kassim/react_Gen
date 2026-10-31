# React Gen

This project uses Next.js with the App Router.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Scripts

- `npm run dev` starts the development server.
- `npm run build:local` creates a build using `.env.local`.
- `npm run build:production` creates a build using `.env.production`.
- `npm run build` creates a production build using Next.js's default environment loading.
- `npm run start` serves the production build.
- `npm run lint` runs Oxlint.

Keep `.env.local` and `.env.production` in the project root beside `package.json`. Both files should define `NEXT_PUBLIC_API_URL`; the local file should point to the local API and the production file to the deployed API. These environment files are ignored by Git and should not contain secrets exposed to client code.

## Project structure

```text
src/
  app/
    globals.css
    layout.jsx
    page.jsx
    pages/
      login/
      dashboard/
  shared/
    services/
    store/
```
