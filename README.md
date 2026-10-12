# Vocably — English Vocabulary Learning Platform

A responsive vocabulary learning app built with React, TypeScript, Vite, Tailwind CSS v4, Zustand persistence, React Router, Recharts, Lucide icons, and Framer Motion.

## Features
- Dashboard with real local learning statistics and weekly activity.
- 60+ sample words with Dari translations, definitions, example sentences, phonetics, and categories.
- Add, edit, search, favorite, filter, delete, CSV import/export, and JSON import/export.
- Flashcards with flip interaction and browser text-to-speech pronunciation.
- Five-box Leitner spaced repetition: 1, 2, 4, 7, and 14-day intervals.
- Scheduled reviews only show words whose next review time has arrived.
- Quiz modes: multiple choice, translation recall, definition matching, and spelling.
- Category pages, progress charts, achievements, goals, theme, settings, and data backup.
- Zustand persists vocabulary, settings, review history, sessions, and quiz results in LocalStorage.
- Lazy-loaded route pages, an error boundary, responsive navigation, keyboard focus styles, and reduced-motion support.
- PWA manifest included.

## Requirements
- Node.js 20.19+ or 22.12+ recommended.
- npm.

## Run locally
```bash
npm install
npm run dev
```
Open the local URL printed by Vite.

## Production build
```bash
npm run build
npm run preview
```
The production files are generated in `dist/`.

## Deploy
### Vercel
Import the repository in Vercel. Framework preset: Vite. Build command: `npm run build`; output directory: `dist`. Configure SPA fallback rewrites so deep links resolve to `index.html`.

### Netlify
Build command: `npm run build`; publish directory: `dist`. Add `public/_redirects` with:
```
/* /index.html 200
```

## Architecture
- `src/types.ts`: typed domain models and app state contracts.
- `src/data.ts`: categories and starter vocabulary dataset.
- `src/store.ts`: Zustand store and LocalStorage persistence.
- `src/utils.ts`: review date checks, accuracy, export helper, and speech synthesis.
- `src/components.tsx`: shared layout, sidebar, stat cards, word rows, buttons, and progress bars.
- `src/pages/`: lazy-loaded route pages.
- `src/styles.css`: responsive design system, dark theme, and reduced-motion behavior.

## Important implementation notes
- This is a browser-first, single-device MVP. LocalStorage is not a secure database and does not synchronize across devices. Add a backend, authentication, server-side validation, backups, and automated tests before using it for multiple users or sensitive data.
- Browser pronunciation depends on SpeechSynthesis support and installed system voices; phonetic guides are provided as text.
- Imported JSON is expected to be an array of vocabulary records. CSV import expects headers such as `word,definition,translation,partOfSpeech,example,phonetic,categoryId,difficulty`.
- The Leitner scheduler sets the next review date from the box reached after an answer. Incorrect answers return to Box 1, due immediately after the session's answer action.
- PWA manifest is included. Full offline caching/service-worker behavior should be added and tested before describing the app as fully offline-capable.
- The sample translations are in Dari. Settings currently let users choose a preferred language label; switching that setting does not automatically translate existing words.
- This codebase has not been executed through npm install/build in the artifact-generation environment. Run `npm install` and `npm run build` locally and fix any environment-specific dependency or TypeScript issues before deployment.
