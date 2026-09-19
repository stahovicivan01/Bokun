# Bokun Pašticerije

A small, responsive vanilla JavaScript bakery catalogue for Bokun Pašticerije at Ulica Slatkih snova 12, owned by Lara Stahović. The app fetches pastry records from a local JSON file and lets visitors search, filter, and inspect item details.

## Features

- Search by pastry name
- Filter by pastry category
- Loading and recoverable error states
- Empty state when a search has no matches
- Responsive Tailwind layout for desktop and mobile screens
- Detail panel with real-valued price and stock fields

## Project structure

- `public/data/items.json` — bakery data source
- `src/main.js` — DOM rendering, JSON loading, search, filters, and details
- `src/index.css` — Tailwind import and bakery visual styling
- `public/screenshot.svg` — project preview image

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. The production build can be deployed to any static host (for example Netlify, Vercel, or GitHub Pages) after running `npm run build`; publish the generated `dist` directory.

## Build

```bash
npm run build
```

## Screenshot

![Bokun overview](public/screenshot.svg)
