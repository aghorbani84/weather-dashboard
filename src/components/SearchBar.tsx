import { useEffect, useRef, useState } from 'react';
import { useCitySearch } from '../hooks/useWeather';
import type { City } from '../types';

interface SearchBarProps {
  onSelect: (city: City) => void;
}

export default function SearchBar({ onSelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [debounced, setDebounced] = useState('');
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query), 350);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const { data: results, isFetching, isError } = useCitySearch(debounced);

  const handleSelect = (city: City) => {
    onSelect(city);
    setQuery('');
    setOpen(false);
  };

  return (
    <div className="search" ref={boxRef}>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Search for a city…"
        aria-label="Search for a city"
        autoComplete="off"
      />
      {isFetching && <span className="search-status">Searching…</span>}
      {open && query.trim().length >= 2 && (
        <ul className="search-results">
          {isError && (
            <li className="search-message">
              Couldn&apos;t reach the search service. Check your connection and
              try again.
            </li>
          )}
          {!isError && results && results.length === 0 && !isFetching && (
            <li className="search-message">No cities found for “{query}”.</li>
          )}
          {results?.map((r) => (
            <li key={r.id}>
              <button type="button" onClick={() => handleSelect(r)}>
                <span className="result-name">{r.name}</span>
                <span className="result-meta">
                  {[r.admin1, r.country].filter(Boolean).join(', ')}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
