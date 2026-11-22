import { useCallback, useEffect, useState } from 'react';

export type ThemeStyle = 'achaemenid' | 'modern';
export type ThemeMode = 'light' | 'dark';

export const STYLE_KEY = 'showcase-style';
export const MODE_KEY = 'showcase-mode';

export function readStoredStyle(): ThemeStyle {
  try {
    return localStorage.getItem(STYLE_KEY) === 'achaemenid' ? 'achaemenid' : 'modern';
  } catch {
    return 'modern';
  }
}

export function readStoredMode(): ThemeMode {
  try {
    const v = localStorage.getItem(MODE_KEY);
    if (v === 'light' || v === 'dark') return v;
  } catch {
    /* fall through to media query */
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** Apply the theme to <html> immediately (also used by the pre-paint script). */
export function applyTheme(style: ThemeStyle, mode: ThemeMode): void {
  document.documentElement.dataset.style = style;
  document.documentElement.dataset.mode = mode;
}

/** Recharts colors, read live from the active CSS variables — re-read on every theme change. */
export function readChartColors(): {
  line: string;
  grid: string;
  tick: string;
  cursor: string;
  surface: string;
} {
  const cs = getComputedStyle(document.documentElement);
  const v = (name: string, fallback: string) => cs.getPropertyValue(name).trim() || fallback;
  return {
    line: v('--chart-line', '#4f46e5'),
    grid: v('--chart-grid', '#e2e8f0'),
    tick: v('--chart-tick', '#475569'),
    cursor: v('--chart-cursor', '#94a3b8'),
    surface: v('--surface', '#ffffff'),
  };
}

export function useTheme() {
  const [style, setStyle] = useState<ThemeStyle>(readStoredStyle);
  const [mode, setMode] = useState<ThemeMode>(readStoredMode);

  useEffect(() => {
    applyTheme(style, mode);
    try {
      localStorage.setItem(STYLE_KEY, style);
      localStorage.setItem(MODE_KEY, mode);
    } catch {
      /* storage unavailable — theme still applies for this session */
    }
  }, [style, mode]);

  const toggleMode = useCallback(() => {
    setMode((m) => (m === 'dark' ? 'light' : 'dark'));
  }, []);

  return { style, mode, setStyle, toggleMode, themeKey: `${style}-${mode}` };
}
