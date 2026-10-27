import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors } from './colors';
import { spacing, radius, elevation, motion } from './tokens';
import { typography, fonts } from './typography';

const ThemeContext = createContext(null);

// `preference` is 'system' | 'light' | 'dark'. We persist nothing here on
// purpose — the toggle is session-level; device scheme is the source of truth.
export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme();
  const [preference, setPreference] = useState('system');

  const scheme = preference === 'system' ? systemScheme ?? 'light' : preference;
  const isDark = scheme === 'dark';

  const toggleTheme = useCallback(() => {
    setPreference((prev) => {
      const current = prev === 'system' ? systemScheme ?? 'light' : prev;
      return current === 'dark' ? 'light' : 'dark';
    });
  }, [systemScheme]);

  const value = useMemo(() => {
    const colors = isDark ? darkColors : lightColors;
    return {
      isDark,
      scheme,
      preference,
      setPreference,
      toggleTheme,
      colors,
      spacing,
      radius,
      elevation,
      motion,
      typography,
      fonts,
    };
  }, [isDark, scheme, preference, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
