import { describeWeather, formatTemp, type ForecastResponse, type Unit } from '../types';

interface DailyForecastProps {
  daily: ForecastResponse['daily'];
  unit: Unit;
}

export default function DailyForecast({ daily, unit }: DailyForecastProps) {
  // The week's span, so each day's range bar sits on one shared scale.
  const weekMin = Math.min(...daily.temperature_2m_min);
  const weekMax = Math.max(...daily.temperature_2m_max);
  const span = weekMax - weekMin || 1;

  return (
    <section className="card daily-card">
      <div className="card-head">
        <div>
          <h2 className="section-title">7-Day Forecast</h2>
          <p className="section-sub">High and low, with rain chance</p>
        </div>
      </div>
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
          const lo = daily.temperature_2m_min[i];
          const hi = daily.temperature_2m_max[i];
          const left = ((lo - weekMin) / span) * 100;
          const width = Math.max(((hi - lo) / span) * 100, 4);
          return (
            <li key={date} className="forecast-row">
              <span className="forecast-day">
                <strong>{i === 0 ? 'Today' : dayName}</strong>
                <span className="forecast-date">{dateLabel}</span>
              </span>
              <span className="forecast-icon" title={info.label} aria-label={info.label}>
                {info.icon}
              </span>
              <span
                className="forecast-range"
                role="img"
                aria-label={`${info.label}, low ${formatTemp(lo, unit)}, high ${formatTemp(hi, unit)}`}
              >
                <span
                  className="forecast-range-fill"
                  style={{ left: `${left}%`, width: `${width}%` }}
                />
                {precip !== null && precip !== undefined && (
                  <span className="forecast-precip">💧 {precip}%</span>
                )}
              </span>
              <span className="forecast-temps">
                <span className="temp-max">{formatTemp(hi, unit)}</span>
                <span className="temp-min">{formatTemp(lo, unit)}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
