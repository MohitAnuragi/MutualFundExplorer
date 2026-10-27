import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from './AppText';
import { useTheme } from '../theme/ThemeContext';
import { formatPct } from '../utils/format';

// Shows a NAV change as a colored pill: ▲ +1.2%  /  ▼ -0.4%
export default function ChangeBadge({ direction = 'flat', pct, size = 'md', style }) {
  const { colors, radius, spacing } = useTheme();

  const map = {
    up: { fg: colors.positive, bg: colors.positiveSoft, icon: 'caret-up' },
    down: { fg: colors.negative, bg: colors.negativeSoft, icon: 'caret-down' },
    flat: { fg: colors.textSecondary, bg: colors.surfaceAlt, icon: 'remove' },
  };
  const t = map[direction] ?? map.flat;
  const iconSize = size === 'lg' ? 16 : 12;

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: t.bg,
          borderRadius: radius.pill,
          paddingHorizontal: spacing.sm,
          paddingVertical: size === 'lg' ? spacing.xs + 2 : spacing.xs,
          alignSelf: 'flex-start',
        },
        style,
      ]}
    >
      <Ionicons name={t.icon} size={iconSize} color={t.fg} style={{ marginRight: 2 }} />
      <AppText
        variant={size === 'lg' ? 'label' : 'caption'}
        color={t.fg}
        style={{ fontVariant: ['tabular-nums'] }}
      >
        {formatPct(pct)}
      </AppText>
    </View>
  );
}
