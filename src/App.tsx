import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import SearchBar from './components/SearchBar';
import CurrentConditions from './components/CurrentConditions';
import DailyForecast from './components/DailyForecast';
import HourlyChart from './components/HourlyChart';
import HourlyStrip from './components/HourlyStrip';
import DetailsGrid from './components/DetailsGrid';
import ProofStrip, { type ProofStripState } from './components/ProofStrip';
import FavoritesBar from './components/FavoritesBar';
import ThemeSwitcher from './components/ThemeSwitcher';
import { useTheme } from './hooks/useTheme';
import { useForecast } from './hooks/useWeather';
import { formatTemp, type City, type Unit } from './types';

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

/** Loading skeleton at the content's own geometry: hero shape, then tiles. */
function LoadingSkeleton({ cityName }: { cityName: string }) {
  return (
    <div role="status" aria-label={`Loading weather for ${cityName}`}>
      <div className="card skeleton-hero" aria-hidden="true">
        <div className="skeleton skeleton-city" />
        <div className="skeleton skeleton-cond" />
        <div className="skeleton skeleton-temp" />
        <div className="skeleton-stats">
          <div className="skeleton" />
          <div className="skeleton" />
          <div className="skeleton" />
          <div className="skeleton" />
        </div>
      </div>
      <div className="content-grid">
        <div className="card skeleton-card" aria-hidden="true">
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-chart" />
        </div>
        <div className="card skeleton-card skeleton-rows" aria-hidden="true">
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-row" />
          <div className="skeleton skeleton-row" />
          <div className="skeleton skeleton-row" />
          <div className="skeleton skeleton-row" />
        </div>
      </div>
      <p className="loading-note">Loading weather for {cityName}…</p>
    </div>
  );
}

export default function App() {
  const [city, setCity] = useState<City>(DEFAULT_CITY);
  const [unit, setUnit] = useState<Unit>(loadUnit);
  const [favorites, setFavorites] = useState<City[]>(loadFavorites);

  const { style, mode, setStyle, toggleMode } = useTheme();

  const {
    data,
    isPending,
    isError,
    error,
    refetch,
    isFetching,
    fetchStatus,
    dataUpdatedAt,
  } = useForecast(city);

  // Datasheet title (rank-1 lesson): name + version + the live numbers.
  const datasheetTitle = data
    ? `Weather Dashboard v2 — ${city.name} · ${formatTemp(data.current.temperature_2m, unit)} · 7-day + hourly`
    : isError
      ? 'Weather Dashboard v2 — forecast unavailable · 7-day + hourly'
      : `Weather Dashboard v2 — loading ${city.name}… · 7-day + hourly`;

  useEffect(() => {
    document.title = datasheetTitle;
  }, [datasheetTitle]);

  // Proof-strip cache count: when the city changes and the new query already
  // holds data with no fetch running, TanStack served it from cache.
  const [cacheServes, setCacheServes] = useState(0);
  const prevQueryKeyRef = useRef('');
  const queryKey = `forecast:${city.latitude},${city.longitude}`;
  useEffect(() => {
    if (queryKey !== prevQueryKeyRef.current) {
      prevQueryKeyRef.current = queryKey;
      if (data && fetchStatus === 'idle' && !isFetching) {
        setCacheServes((c) => c + 1);
      }
    }
  }, [queryKey, data, fetchStatus, isFetching]);

  const proofState: ProofStripState = isError ? 'error' : isPending ? 'pending' : 'ready';

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
          <h1 className="wordmark">{datasheetTitle}</h1>
          <p className="tagline">Live weather from Open-Meteo — no API key needed</p>
        </div>
        <div className="header-controls">
          <ThemeSwitcher
            style={style}
            mode={mode}
            onStyleChange={setStyle}
            onToggleMode={toggleMode}
          />
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
        </div>
      </header>

      {/* Proof strip: counts from the forecast query itself (see ProofStrip). */}
      <ProofStrip
        state={proofState}
        dataUpdatedAt={dataUpdatedAt}
        fetchStatus={fetchStatus}
        isFetching={isFetching}
        cacheServes={cacheServes}
        cityName={city.name}
      />

      {/* Lotus-petal divider — Achaemenid style only (see index.css) */}
      <div className="lotus-divider" aria-hidden="true">
        <svg preserveAspectRatio="none" viewBox="0 0 280 14">
          <defs>
            <pattern id="lotus-pattern" width="28" height="14" patternUnits="userSpaceOnUse">
              <path
                d="M14 1 C17.5 5 17.5 9 14 13 C10.5 9 10.5 5 14 1 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="280" height="14" fill="url(#lotus-pattern)" />
        </svg>
      </div>

      <SearchBar onSelect={setCity} />

      <FavoritesBar
        favorites={favorites}
        activeId={city.id}
        onSelect={setCity}
        onRemove={removeFavorite}
      />

      <main>
        {isPending && <LoadingSkeleton cityName={city.name} />}

        {isError && (
          <div className="state-card error-card" role="alert">
            <span className="error-icon" aria-hidden="true">
              <AlertTriangle size={26} />
            </span>
            <p className="error-title">Couldn&apos;t load the weather</p>
            <p className="error-detail">
              The Open-Meteo service couldn&apos;t be reached
              {error instanceof Error && error.message ? (
                <>
                  : <code>{error.message}</code>
                </>
              ) : (
                '.'
              )}{' '}
              Please check your connection and try again.
            </p>
            <p className="error-honesty">
              Nothing is shown in place of the forecast — the app never invents
              weather when the service doesn&apos;t answer.
            </p>
            <button type="button" className="retry-btn" onClick={() => refetch()}>
              <RefreshCw size={16} aria-hidden="true" />
              Try again
            </button>
          </div>
        )}

        {data && (
          <>
            <CurrentConditions
              city={city}
              current={data.current}
              unit={unit}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
            />
            <HourlyStrip hourly={data.hourly} unit={unit} />
            <div className="content-grid">
              <HourlyChart hourly={data.hourly} unit={unit} />
              <DailyForecast daily={data.daily} unit={unit} />
            </div>
            <DetailsGrid current={data.current} daily={data.daily} unit={unit} />
            <p className="source-note">
              Data: Open-Meteo (open-meteo.com) · Times shown in {data.timezone}
            </p>
          </>
        )}
      </main>

      <footer className="footer">
        {/* One Faravahar accent, footer only */}
        <svg className="faravahar" viewBox="0 0 64 28" aria-hidden="true">
          <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <circle cx="32" cy="10" r="4" fill="currentColor" stroke="none" />
            <path d="M27 8 L10 3" />
            <path d="M27 11 L7 10" />
            <path d="M27 14 L10 17" />
            <path d="M37 8 L54 3" />
            <path d="M37 11 L57 10" />
            <path d="M37 14 L54 17" />
            <path d="M32 14 L32 24" />
            <path d="M32 19 L26 24" />
            <path d="M32 19 L38 24" />
          </g>
        </svg>
        <span>Built with React, TypeScript, TanStack Query, axios and Recharts.</span>
      </footer>
    </div>
  );
}
