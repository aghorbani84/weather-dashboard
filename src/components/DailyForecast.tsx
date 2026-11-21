import { describeWeather, formatTemp, type ForecastResponse, type Unit } from '../types';

interface DailyForecastProps {
  daily: ForecastResponse['daily'];
  unit: Unit;
}

export default function DailyForecast({ daily, unit }: DailyForecastProps) {
  return (
    <section className="card">
      <h2 className="section-title">7-Day Forecast</h2>
      <ul className="forecast-list">
        {daily.time.map((date, i) => {
          const info = describeWeather(daily.weather_code[i]);
          const dayName = new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
            weekday: 'short',
          });
          const dateLabel = new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });
          const precip = daily.precipitation_probability_max?.[i];
          return (
            <li key={date} className="forecast-row">
              <span className="forecast-day">
                <strong>{i === 0 ? 'Today' : dayName}</strong>
                <span className="forecast-date">{dateLabel}</span>
              </span>
              <span className="forecast-icon" title={info.label} aria-label={info.label}>
                {info.icon}
              </span>
              <span className="forecast-label">{info.label}</span>
              <span className="forecast-precip">
                {precip !== null && precip !== undefined ? `💧 ${precip}%` : '—'}
              </span>
              <span className="forecast-temps">
                <span className="temp-max">{formatTemp(daily.temperature_2m_max[i], unit)}</span>
                <span className="temp-min">{formatTemp(daily.temperature_2m_min[i], unit)}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
