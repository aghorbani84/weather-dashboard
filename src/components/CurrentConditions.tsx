import { Droplets, Gauge, Star, Umbrella, Wind } from 'lucide-react';
import { describeWeather, formatTemp, type City, type CurrentWeather, type Unit } from '../types';

interface CurrentConditionsProps {
  city: City;
  current: CurrentWeather;
  unit: Unit;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

function windDirection(degrees: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(degrees / 45) % 8];
}

export default function CurrentConditions({
  city,
  current,
  unit,
  isFavorite,
  onToggleFavorite,
}: CurrentConditionsProps) {
  const info = describeWeather(current.weather_code);
  return (
    <section className="hero-card" aria-label={`Current weather in ${city.name}`}>
      <div className="hero-top">
        <div>
          <h2 className="hero-city">
            {city.name}
            {city.country ? `, ${city.country}` : ''}
          </h2>
          <p className="hero-condition">{info.label}</p>
        </div>
        <button
          type="button"
          className={`favorite-btn ${isFavorite ? 'active' : ''}`}
          onClick={onToggleFavorite}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Star size={20} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="hero-main">
        <span className="hero-icon" aria-hidden="true">
          {info.icon}
        </span>
        <span className="hero-temp">{formatTemp(current.temperature_2m, unit)}</span>
        <span className="hero-feels">
          Feels like {formatTemp(current.apparent_temperature, unit)}
        </span>
      </div>

      <div className="hero-stats">
        <div className="hero-stat">
          <span className="hero-stat-label">
            <Droplets size={13} aria-hidden="true" /> Humidity
          </span>
          <span className="hero-stat-value">{current.relative_humidity_2m}%</span>
        </div>
        <div className="hero-stat">
          <span className="hero-stat-label">
            <Wind size={13} aria-hidden="true" /> Wind
          </span>
          <span className="hero-stat-value">
            {Math.round(current.wind_speed_10m)} km/h{' '}
            {windDirection(current.wind_direction_10m)}
          </span>
        </div>
        <div className="hero-stat">
          <span className="hero-stat-label">
            <Umbrella size={13} aria-hidden="true" /> Precipitation
          </span>
          <span className="hero-stat-value">{current.precipitation} mm</span>
        </div>
        <div className="hero-stat">
          <span className="hero-stat-label">
            <Gauge size={13} aria-hidden="true" /> Pressure
          </span>
          <span className="hero-stat-value">{Math.round(current.pressure_msl)} hPa</span>
        </div>
      </div>
    </section>
  );
}
