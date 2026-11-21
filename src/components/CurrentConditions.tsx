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
    <section className="card current-card">
      <div className="current-header">
        <div>
          <h2>
            {city.name}
            {city.country ? `, ${city.country}` : ''}
          </h2>
          <p className="subtitle">{info.label}</p>
        </div>
        <button
          type="button"
          className={`favorite-btn ${isFavorite ? 'active' : ''}`}
          onClick={onToggleFavorite}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? '★' : '☆'}
        </button>
      </div>
      <div className="current-main">
        <span className="current-icon" aria-hidden="true">
          {info.icon}
        </span>
        <span className="current-temp">{formatTemp(current.temperature_2m, unit)}</span>
        <span className="current-feels">
          Feels like {formatTemp(current.apparent_temperature, unit)}
        </span>
      </div>
      <div className="stats-grid">
        <div className="stat">
          <span className="stat-label">Humidity</span>
          <span className="stat-value">{current.relative_humidity_2m}%</span>
        </div>
        <div className="stat">
          <span className="stat-label">Wind</span>
          <span className="stat-value">
            {Math.round(current.wind_speed_10m)} km/h{' '}
            {windDirection(current.wind_direction_10m)}
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">Precipitation</span>
          <span className="stat-value">{current.precipitation} mm</span>
        </div>
        <div className="stat">
          <span className="stat-label">Pressure</span>
          <span className="stat-value">{Math.round(current.pressure_msl)} hPa</span>
        </div>
      </div>
    </section>
  );
}
