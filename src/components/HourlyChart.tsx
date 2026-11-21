import { useMemo } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { toFahrenheit, type ForecastResponse, type Unit } from '../types';

interface HourlyChartProps {
  hourly: ForecastResponse['hourly'];
  unit: Unit;
}

export default function HourlyChart({ hourly, unit }: HourlyChartProps) {
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

  return (
    <section className="card">
      <h2 className="section-title">Hourly Temperature — Next 24 Hours</h2>
      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: -12 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="time" tick={{ fontSize: 12, fill: '#64748b' }} interval={2} />
            <YAxis
              tick={{ fontSize: 12, fill: '#64748b' }}
              domain={['auto', 'auto']}
              unit={`°${unit === 'celsius' ? 'C' : 'F'}`}
            />
            <Tooltip
              formatter={(value) => [
                `${value}°${unit === 'celsius' ? 'C' : 'F'}`,
                'Temperature',
              ]}
              labelFormatter={(label) => `${label}`}
            />
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="#2563eb"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
