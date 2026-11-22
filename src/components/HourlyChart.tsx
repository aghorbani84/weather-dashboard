import { useMemo } from 'react';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { toFahrenheit, type ForecastResponse, type Unit } from '../types';
import { readChartColors, useTheme } from '../hooks/useTheme';

interface HourlyChartProps {
  hourly: ForecastResponse['hourly'];
  unit: Unit;
}

export default function HourlyChart({ hourly, unit }: HourlyChartProps) {
  // Theme colors are read from the live CSS variables and re-read whenever
  // the theme changes, so the chart recolors instantly with the rest of the app.
  const { themeKey } = useTheme();
  const colors = useMemo(() => readChartColors(), [themeKey]);

  const data = useMemo(() => {
    // Show the next 24 hours starting from the current hour.
    const now = new Date();
    const startIndex = hourly.time.findIndex((t) => new Date(t) >= now);
    const from = startIndex === -1 ? 0 : startIndex;
    return hourly.time.slice(from, from + 24).map((time, i) => {
      const celsius = hourly.temperature_2m[from + i];
      return {
        time: new Date(time).toLocaleTimeString('en-US', {
          hour: 'numeric',
        }),
        temperature: Math.round(unit === 'celsius' ? celsius : toFahrenheit(celsius)),
      };
    });
  }, [hourly, unit]);

  const unitLabel = `°${unit === 'celsius' ? 'C' : 'F'}`;
  const temps = data.map((d) => d.temperature);
  const range =
    temps.length > 0
      ? `${Math.min(...temps)}${unitLabel} – ${Math.max(...temps)}${unitLabel}`
      : null;

  return (
    <section className="card">
      <div className="card-head">
        <div>
          <h2 className="section-title">Hourly Temperature</h2>
          <p className="section-sub">Next 24 hours</p>
        </div>
        {range && <span className="range-pill">{range}</span>}
      </div>
      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
            <defs>
              <linearGradient id="tempFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.line} stopOpacity={0.22} />
                <stop offset="100%" stopColor={colors.line} stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke={colors.grid} />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 12, fill: colors.tick }}
              tickLine={false}
              axisLine={{ stroke: colors.grid }}
              interval={2}
            />
            <YAxis
              tick={{ fontSize: 12, fill: colors.tick }}
              tickLine={false}
              axisLine={false}
              domain={['auto', 'auto']}
              unit={unitLabel}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload || payload.length === 0) return null;
                return (
                  <div className="chart-tooltip">
                    <div className="chart-tooltip-time">{label}</div>
                    <div className="chart-tooltip-temp">
                      {payload[0]?.value}
                      {unitLabel}
                    </div>
                  </div>
                );
              }}
              cursor={{ stroke: colors.cursor, strokeDasharray: '4 4' }}
            />
            <Area
              type="monotone"
              dataKey="temperature"
              stroke="none"
              fill="url(#tempFill)"
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="temperature"
              stroke={colors.line}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, stroke: colors.surface, strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
