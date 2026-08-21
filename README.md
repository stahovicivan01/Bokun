# Bokun

A responsive React app for a restaurant menu that loads menu data from a local JSON file, allows visitors to search by dish name, filter by category, and view detailed information for each dish.

## Features

- Search by dish name
- Filter by food category
- Loading indicator while menu data is being fetched
- Validation for array/object data with clear error handling
- Empty state for no matching results
- Responsive Tailwind layout for desktop and mobile screens
- Detail panel for selected menu items

## Project structure

- `public/data/items.json` — restaurant menu data source
- `src/App.jsx` — menu finder UI and data-loading logic
- `src/index.css` — Tailwind import and global styling
- `public/screenshot.svg` — restaurant-themed mockup

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Screenshot

![Bokun overview](public/screenshot.svg)
