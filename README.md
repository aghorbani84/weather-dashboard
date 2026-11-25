# Weather Dashboard

> Search any city and see current conditions, an hourly outlook, and a 7-day forecast, powered by the free Open-Meteo API.

[![Live demo](https://img.shields.io/badge/demo-GitHub%20Pages-2ea44f)](https://aghorbani84.github.io/weather-dashboard/)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack%20Query-FF4154?logo=reactquery&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)

**Live demo:** https://aghorbani84.github.io/weather-dashboard/

## Overview

A single-page weather dashboard built with React and TypeScript. It reads live data from the [Open-Meteo](https://open-meteo.com/) forecast and geocoding APIs, which are free and need no API key. The default city is Tehran.

## Features

- **City search** – worldwide search via the Open-Meteo geocoding API with debounced suggestions
- **Current conditions** – temperature, feels-like, humidity, wind speed and direction, precipitation, pressure, and UV index
- **Details grid** – feels-like, humidity, wind, pressure, UV index, sunrise, sunset, and precipitation
- **Hourly outlook** – a next-12-hours strip and a 24-hour temperature chart (Recharts)
- **7-day forecast** – daily high/low, condition, and precipitation probability
- **°C / °F toggle** – remembered in `localStorage`
- **Favorite cities** – star a city to keep it one click away (stored in `localStorage`)
- **Request status strip** – shows real API request counts, cache hits, and time since last update
- **Honest loading and error states** – skeleton loaders while fetching and a retry button when the API is unreachable; no placeholder data
- **Themes** – Modern and Achaemenid visual styles, each with light and dark mode

## Tech stack

| Area | Tools |
| --- | --- |
| UI | React 19, TypeScript, lucide-react icons |
| Data fetching | TanStack Query, axios |
| Charts | Recharts |
| Styling | Hand-written CSS (no framework) |
| API | Open-Meteo forecast + geocoding (no key required) |
| Build & lint | Vite, oxlint |
| Deployment | GitHub Pages via GitHub Actions |

## Getting started

Requires Node.js (CI uses Node 20).

```bash
git clone https://github.com/aghorbani84/weather-dashboard.git
cd weather-dashboard
npm install
npm run dev        # start the dev server (usually http://localhost:5173)
```

Other scripts:

```bash
npm run build      # type-check (tsc) + production build into dist/
npm run preview    # serve the production build locally
npm run lint       # run oxlint
```

## Project structure

```
src/
├── api/weather.ts        # Open-Meteo forecast + geocoding calls (axios)
├── hooks/
│   ├── useWeather.ts     # TanStack Query hooks
│   └── useTheme.ts       # style + light/dark mode
├── components/           # search, current conditions, hourly strip/chart,
│                         # daily forecast, details grid, favorites, theme switcher
├── types.ts              # API types + WMO weather-code table
├── App.tsx               # layout, unit toggle, favorites
└── main.tsx              # QueryClientProvider setup
```

## Author

Built by [aghorbani84](https://github.com/aghorbani84).
