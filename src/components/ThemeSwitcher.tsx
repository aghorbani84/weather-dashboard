import { Landmark, Moon, Sparkles, Sun } from 'lucide-react';
import type { ThemeMode, ThemeStyle } from '../hooks/useTheme';

interface ThemeSwitcherProps {
  style: ThemeStyle;
  mode: ThemeMode;
  onStyleChange: (style: ThemeStyle) => void;
  onToggleMode: () => void;
}

export default function ThemeSwitcher({ style, mode, onStyleChange, onToggleMode }: ThemeSwitcherProps) {
  return (
    <div className="theme-switcher">
      <div className="style-segmented" role="group" aria-label="Visual style">
        <button
          type="button"
          className={style === 'achaemenid' ? 'active' : ''}
          onClick={() => onStyleChange('achaemenid')}
          aria-pressed={style === 'achaemenid'}
        >
          <Landmark size={15} aria-hidden="true" />
          Achaemenid
        </button>
        <button
          type="button"
          className={style === 'modern' ? 'active' : ''}
          onClick={() => onStyleChange('modern')}
          aria-pressed={style === 'modern'}
        >
          <Sparkles size={15} aria-hidden="true" />
          Modern
        </button>
      </div>
      <button
        type="button"
        className="mode-toggle"
        onClick={onToggleMode}
        aria-label="Toggle dark mode"
        aria-pressed={mode === 'dark'}
        title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {mode === 'dark' ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
      </button>
    </div>
  );
}
