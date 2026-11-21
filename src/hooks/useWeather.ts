import { useQuery } from '@tanstack/react-query';
import { fetchForecast, searchCities } from '../api/weather';
import type { City } from '../types';

export function useForecast(city: City | null) {
  return useQuery({
    queryKey: ['forecast', city?.latitude, city?.longitude, city?.timezone],
    queryFn: () =>
      fetchForecast(city!.latitude, city!.longitude, city!.timezone),
    enabled: city !== null,
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });
}

export function useCitySearch(query: string) {
  return useQuery({
    queryKey: ['city-search', query],
    queryFn: () => searchCities(query),
    enabled: query.trim().length >= 2,
    staleTime: 60 * 1000,
    retry: 1,
  });
}
