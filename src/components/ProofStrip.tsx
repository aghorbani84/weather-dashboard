import { useEffect, useState } from 'react';
import { getForecastRequestCount } from '../api/weather';

export type ProofStripState = 'pending' | 'error' | 'ready';

interface ProofStripProps {
  state: ProofStripState;
  /** TanStack Query's real dataUpdatedAt (ms epoch) — 0/undefined when never fetched. */
  dataUpdatedAt: number;
  fetchStatus: 'fetching' | 'paused' | 'idle';
  isFetching: boolean;
  /** Times the current city was served from the TanStack cache without a network call. */
  cacheServes: number;
  cityName: string;
}

function formatAgo(updatedAt: number, now: number): string {
  const seconds = Math.max(0, Math.floor((now - updatedAt) / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

/**
 * Proof strip, after the makefun-frontend-01 winner ("this view: 1 API
 * request, 0 unchanged (304), 1 from memory, updated 0 s ago").
 *
 * Every number comes from the query itself: the request count is incremented
 * once per real forecast network call (see api/weather.ts), the cache count
 * is incremented only when a city is served from TanStack's cache with no
 * fetch, and "updated Xs ago" ticks every second from the real
 * dataUpdatedAt timestamp. Nothing here is invented.
 */
export default function ProofStrip({
  state,
  dataUpdatedAt,
  fetchStatus,
  isFetching,
  cacheServes,
  cityName,
}: ProofStripProps) {
  // Ticking clock: re-renders every second so "Xs ago" stays live.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetching = isFetching || fetchStatus === 'fetching';

  let text: string;
  if (state === 'error') {
    // Honest failure: the forecast query errored, the geocoding search box
    // runs on its own endpoint and stays usable.
    text = 'forecast unavailable — geocoding live';
  } else if (state === 'pending') {
    text = `fetching forecast for ${cityName}…`;
  } else {
    const requests = getForecastRequestCount();
    const noun = requests === 1 ? 'API request' : 'API requests';
    // dataUpdatedAt is 0 when the query NEVER succeeded — never compute an
    // "ago" from it ("updated 1795325595s ago" is a lie, not a timestamp).
    const updatedPart =
      dataUpdatedAt > 0 ? `updated ${formatAgo(dataUpdatedAt, now)}` : 'no data yet';
    text = `${requests} ${noun} · ${cacheServes} from cache · ${updatedPart}`;
    if (fetching) text += ' · refreshing…';
  }

  return (
    <p className="proof-strip" role="status">
      <span
        className={`proof-dot${fetching ? ' proof-dot-live' : ''}${state === 'error' ? ' proof-dot-error' : ''}`}
        aria-hidden="true"
      />
      <span className="proof-text">{text}</span>
    </p>
  );
}
