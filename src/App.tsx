import { useEffect, useState } from 'react';
import SearchBar from './components/SearchBar';
import CurrentConditions from './components/CurrentConditions';
import DailyForecast from './components/DailyForecast';
import HourlyChart from './components/HourlyChart';
import FavoritesBar from './components/FavoritesBar';
import { useForecast } from './hooks/useWeather';
import type { City, Unit } from './types';

const FAVORITES_KEY = 'weather-dashboard:favorites';
const UNIT_KEY = 'weather-dashboard:unit';

const DEFAULT_CITY: City = {
  id: 112931,
  name: 'Tehran',
  country: 'Iran',
  admin1: 'Tehran',
  latitude: 35.6892,
  longitude: 51.389,
  timezone: 'Asia/Tehran',
};

function loadFavorites(): City[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as City[]) : [];
  } catch {
    return [];
  }
}

function loadUnit(): Unit {
  return localStorage.getItem(UNIT_KEY) === 'fahrenheit' ? 'fahrenheit' : 'celsius';
}

export default function App() {
  const [city, setCity] = useState<City>(DEFAULT_CITY);
  const [unit, setUnit] = useState<Unit>(loadUnit);
  const [favorites, setFavorites] = useState<City[]>(loadFavorites);

  const { data, isPending, isError, error, refetch, isFetching } = useForecast(city);

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(UNIT_KEY, unit);
  }, [unit]);

  const isFavorite = favorites.some((f) => f.id === city.id);

  const toggleFavorite = () => {
    setFavorites((prev) =>
      prev.some((f) => f.id === city.id)
        ? prev.filter((f) => f.id !== city.id)
        : [...prev, city],
    );
  };

  const removeFavorite = (id: number) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Weather Dashboard</h1>
          <p className="tagline">Live weather from Open-Meteo — no API key needed</p>
        </div>
        <div className="unit-toggle" role="group" aria-label="Temperature unit">
          <button
            type="button"
            className={unit === 'celsius' ? 'active' : ''}
            onClick={() => setUnit('celsius')}
            aria-pressed={unit === 'celsius'}
          >
            °C
          </button>
          <button
            type="button"
            className={unit === 'fahrenheit' ? 'active' : ''}
            onClick={() => setUnit('fahrenheit')}
            aria-pressed={unit === 'fahrenheit'}
          >
            °F
          </button>
        </div>
      </header>

      <SearchBar onSelect={setCity} />

      <FavoritesBar
        favorites={favorites}
        activeId={city.id}
        onSelect={setCity}
        onRemove={removeFavorite}
      />

      <main>
        {isPending && (
          <div className="state-card" role="status">
            <div className="spinner" aria-hidden="true" />
            <p>Loading weather for {city.name}…</p>
          </div>
        )}

        {isError && (
          <div className="state-card error-card" role="alert">
            <p className="error-title">Couldn&apos;t load the weather</p>
            <p>
              The Open-Meteo service couldn&apos;t be reached
              {error instanceof Error && error.message ? `: ${error.message}` : '.'}{' '}
              Please check your connection and try again.
            </p>
            <button type="button" className="retry-btn" onClick={() => refetch()}>
              Try again
            </button>
          </div>
        )}

        {data && (
          <>
            {isFetching && <p className="refresh-note">Refreshing…</p>}
            <CurrentConditions
              city={city}
              current={data.current}
              unit={unit}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
            />
            <HourlyChart hourly={data.hourly} unit={unit} />
            <DailyForecast daily={data.daily} unit={unit} />
            <p className="source-note">
              Data: Open-Meteo (open-meteo.com) · Times shown in {data.timezone}
            </p>
          </>
        )}
      </main>

      <footer className="footer">
        Built with React, TypeScript, TanStack Query, axios and Recharts.
      </footer>
    </div>
  );
}
