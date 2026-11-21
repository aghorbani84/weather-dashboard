# Weather Dashboard

A polished weather dashboard built with React + TypeScript (Vite). It shows live
weather data from the **Open-Meteo API** — free and no API key required.

## Features

- **City search** — search any city worldwide via the Open-Meteo geocoding API,
  with debounced suggestions.
- **Current conditions** — temperature, feels-like, humidity, wind speed and
  direction, precipitation and pressure.
- **7-day forecast** — daily high/low, weather condition and precipitation
  probability.
- **Hourly temperature chart** — the next 24 hours, rendered with Recharts.
- **°C / °F toggle** — persisted in localStorage.
- **Favorite cities** — star a city to save it; favorites persist in localStorage
  and are one click away.
- **Honest loading and error states** — a spinner while loading, and a clear
  error message with a retry button when the API is unreachable. No fake data:
  if the API does not answer, the app says so.

## Tech used

- React 19 + TypeScript + Vite
- **TanStack Query** — server-state management, caching and retries
- **axios** — HTTP client for the Open-Meteo API
- **Recharts** — hourly temperature chart
- **Open-Meteo** — forecast API (`api.open-meteo.com/v1/forecast`) and geocoding
  API (`geocoding-api.open-meteo.com/v1/search`); no key needed
- Vanilla CSS (hand-written, responsive, no CSS framework)

## How to run

```bash
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

## Other commands

```bash
npm run build   # typecheck (tsc) + production build
npm run preview # serve the production build locally
```

## Project structure

```
src/
  api/weather.ts            # axios calls to the Open-Meteo forecast + geocoding APIs
  hooks/useWeather.ts       # TanStack Query hooks (useForecast, useCitySearch)
  components/
    SearchBar.tsx           # debounced city search with suggestions
    CurrentConditions.tsx   # current weather + key stats
    DailyForecast.tsx       # 7-day forecast list
    HourlyChart.tsx         # Recharts line chart, next 24 hours
    FavoritesBar.tsx        # favorite-city chips
  types.ts                  # API response types + WMO weather-code table
  App.tsx                   # layout, unit toggle, favorites (localStorage)
  main.tsx                  # QueryClientProvider setup
  index.css                 # hand-written vanilla CSS
```
