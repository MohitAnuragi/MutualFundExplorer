import React, { useMemo } from 'react';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../theme/ThemeContext';

// Tiny inline trend line (no axes) for list rows. `values` is an array of
// numbers; color is derived from overall direction unless overridden.
export default function Sparkline({ values = [], width = 64, height = 28, color, strokeWidth = 2 }) {
  const { colors } = useTheme();

  const path = useMemo(() => {
    if (!values || values.length < 2) return null;
    let min = Infinity;
    let max = -Infinity;
    for (const v of values) {
      if (v < min) min = v;
      if (v > max) max = v;
    }
    const span = max - min || 1;
    const stepX = width / (values.length - 1);
    const pad = 2;
    const usableH = height - pad * 2;

    return values
      .map((v, i) => {
        const x = i * stepX;
        const y = pad + usableH - ((v - min) / span) * usableH;
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(' ');
  }, [values, width, height]);

  if (!path) return null;

  const trendColor =
    color ??
    (values[values.length - 1] >= values[0] ? colors.positive : colors.negative);

  return (
    <Svg width={width} height={height}>
      <Path
        d={path}
        stroke={trendColor}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
