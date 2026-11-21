import axios from 'axios';
import type { ForecastResponse, GeoResult } from '../types';

const FORECAST_BASE = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_BASE = 'https://geocoding-api.open-meteo.com/v1/search';

export async function fetchForecast(
  latitude: number,
  longitude: number,
  timezone: string,
): Promise<ForecastResponse> {
  const { data } = await axios.get<ForecastResponse>(FORECAST_BASE, {
    params: {
      latitude,
      longitude,
      current:
        'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl',
      hourly: 'temperature_2m,precipitation_probability,weather_code',
      daily:
        'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset',
      timezone,
      forecast_days: 7,
    },
    timeout: 15000,
  });
  return data;
}

export async function searchCities(query: string): Promise<GeoResult[]> {
  const { data } = await axios.get<{ results?: GeoResult[] }>(GEOCODING_BASE, {
    params: { name: query, count: 8, language: 'en', format: 'json' },
    timeout: 15000,
  });
  return data.results ?? [];
}
