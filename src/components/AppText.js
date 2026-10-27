import React from 'react';
import { Text } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

// Typography-aware text. `variant` selects a style from the type scale;
// `color` is a theme color token key (e.g. 'textSecondary') or a raw color.
export default function AppText({
  variant = 'body',
  color = 'textPrimary',
  style,
  children,
  ...rest
}) {
  const { typography, colors } = useTheme();
  const base = typography[variant] ?? typography.body;
  const resolvedColor = colors[color] ?? color;

  return (
    <Text style={[base, { color: resolvedColor }, style]} {...rest}>
      {children}
    </Text>
  );
}
