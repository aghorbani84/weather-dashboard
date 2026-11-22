import { useMemo } from 'react';
import { describeWeather, formatTemp, type ForecastResponse, type Unit } from '../types';

interface HourlyStripProps {
  hourly: ForecastResponse['hourly'];
  unit: Unit;
}

/** Hour label from the API's city-local ISO time ("2026-11-22T14:00" -> "2 PM"). */
function hourLabel(iso: string): string {
  const hour = Number(iso.slice(11, 13));
  if (hour === 0) return '12 AM';
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return '12 PM';
  return `${hour - 12} PM`;
}

/**
 * Next-12-hours strip: one chip per hour (time, condition icon, temperature,
 * rain chance) from the same forecast response — no extra request.
 * Horizontally scrollable on narrow screens; the first chip is the current hour.
 */
export default function HourlyStrip({ hourly, unit }: HourlyStripProps) {
  const items = useMemo(() => {
    const now = new Date();
    const startIndex = hourly.time.findIndex((t) => new Date(t) >= now);
    const from = startIndex === -1 ? 0 : startIndex;
    return hourly.time.slice(from, from + 12).map((time, i) => {
      const idx = from + i;
      const info = describeWeather(hourly.weather_code[idx]);
      const precip = hourly.precipitation_probability?.[idx];
      return {
        key: time,
        label: i === 0 ? 'Now' : hourLabel(time),
        icon: info.icon,
        condition: info.label,
        temp: formatTemp(hourly.temperature_2m[idx], unit),
        precip: precip === null || precip === undefined ? null : precip,
      };
    });
  }, [hourly, unit]);

  return (
    <section className="card hourly-strip-card" aria-label="Next 12 hours">
      <div className="card-head">
        <div>
          <h2 className="section-title">Next 12 Hours</h2>
          <p className="section-sub">Hour by hour, from the same forecast</p>
        </div>
        <span className="range-pill">12 hours</span>
      </div>
      <ul className="hourly-strip">
        {items.map((item) => (
          <li key={item.key} className="hour-chip" title={item.condition}>
            <span className="hour-chip-time">{item.label}</span>
            <span className="hour-chip-icon" aria-label={item.condition}>
              {item.icon}
            </span>
            <span className="hour-chip-temp">{item.temp}</span>
            <span className="hour-chip-precip">
              {item.precip === null ? '—' : `💧 ${item.precip}%`}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
