import { Droplets, Gauge, Sun, Sunrise, Sunset, Thermometer, Umbrella, Wind } from 'lucide-react';
import {
  formatTemp,
  uvBand,
  windDirection,
  type CurrentWeather,
  type ForecastResponse,
  type Unit,
} from '../types';

interface DetailsGridProps {
  current: CurrentWeather;
  daily: ForecastResponse['daily'];
  unit: Unit;
}

/** "HH:MM" straight from the API's city-local ISO time — no timezone math. */
function clockTime(iso: string | undefined): string {
  if (!iso) return '—';
  return iso.slice(11, 16);
}

/**
 * Details grid: the full current-conditions picture in one dense tile grid.
 * Every value comes from the same single forecast response (UV index is a
 * real current field from Open-Meteo; sunrise/sunset are today's daily
 * values). Nothing is invented.
 */
export default function DetailsGrid({ current, daily, unit }: DetailsGridProps) {
  const tiles = [
    {
      icon: <Thermometer size={15} aria-hidden="true" />,
      label: 'Feels like',
      value: formatTemp(current.apparent_temperature, unit),
      sub: 'Apparent temperature',
    },
    {
      icon: <Droplets size={15} aria-hidden="true" />,
      label: 'Humidity',
      value: `${current.relative_humidity_2m}%`,
      sub: 'Relative humidity',
    },
    {
      icon: <Wind size={15} aria-hidden="true" />,
      label: 'Wind',
      value: `${Math.round(current.wind_speed_10m)} km/h ${windDirection(current.wind_direction_10m)}`,
      sub: 'Speed + direction',
    },
    {
      icon: <Gauge size={15} aria-hidden="true" />,
      label: 'Pressure',
      value: `${Math.round(current.pressure_msl)} hPa`,
      sub: 'Mean sea level',
    },
    {
      icon: <Sun size={15} aria-hidden="true" />,
      label: 'UV index',
      value: `${current.uv_index} · ${uvBand(current.uv_index)}`,
      sub: 'Current UV exposure',
    },
    {
      icon: <Sunrise size={15} aria-hidden="true" />,
      label: 'Sunrise',
      value: clockTime(daily.sunrise[0]),
      sub: 'Today',
    },
    {
      icon: <Sunset size={15} aria-hidden="true" />,
      label: 'Sunset',
      value: clockTime(daily.sunset[0]),
      sub: 'Today',
    },
    {
      icon: <Umbrella size={15} aria-hidden="true" />,
      label: 'Precipitation',
      value: `${current.precipitation} mm`,
      sub: 'Last hour',
    },
  ];

  return (
    <section className="card details-card" aria-label="Weather details">
      <div className="card-head">
        <div>
          <h2 className="section-title">Details</h2>
          <p className="section-sub">Everything the forecast knows, in one grid</p>
        </div>
        <span className="range-pill">8 readings</span>
      </div>
      <ul className="details-grid">
        {tiles.map((tile) => (
          <li key={tile.label} className="detail-tile">
            <span className="detail-label">
              {tile.icon} {tile.label}
            </span>
            <span className="detail-value">{tile.value}</span>
            <span className="detail-sub">{tile.sub}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
