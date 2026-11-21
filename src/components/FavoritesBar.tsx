import type { City } from '../types';

interface FavoritesBarProps {
  favorites: City[];
  activeId: number | null;
  onSelect: (city: City) => void;
  onRemove: (id: number) => void;
}

export default function FavoritesBar({ favorites, activeId, onSelect, onRemove }: FavoritesBarProps) {
  if (favorites.length === 0) {
    return (
      <p className="favorites-empty">
        No favorite cities yet — search for a city and tap the star to save it here.
      </p>
    );
  }
  return (
    <div className="favorites">
      {favorites.map((city) => (
        <span key={city.id} className={`favorite-chip ${city.id === activeId ? 'active' : ''}`}>
          <button type="button" onClick={() => onSelect(city)}>
            {city.name}
          </button>
          <button
            type="button"
            className="favorite-remove"
            onClick={() => onRemove(city.id)}
            aria-label={`Remove ${city.name} from favorites`}
          >
            ×
          </button>
        </span>
      ))}
    </div>
  );
}
