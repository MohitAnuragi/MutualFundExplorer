import React from 'react';
import { View } from 'react-native';
import AppText from './AppText';
import { useTheme } from '../theme/ThemeContext';

// A small rounded pill for categories, fund house, scheme type.
// `tone`: 'neutral' | 'accent' | 'positive' | 'negative'
export default function Chip({ label, tone = 'neutral', style }) {
  const { colors, radius, spacing } = useTheme();

  const toneMap = {
    neutral: { bg: colors.surfaceAlt, fg: colors.textSecondary },
    accent: { bg: colors.accentSoft, fg: colors.accent },
    positive: { bg: colors.positiveSoft, fg: colors.positive },
    negative: { bg: colors.negativeSoft, fg: colors.negative },
  };
  const t = toneMap[tone] ?? toneMap.neutral;

  return (
    <View
      style={[
        {
          backgroundColor: t.bg,
          borderRadius: radius.pill,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.xs + 1,
          alignSelf: 'flex-start',
        },
        style,
      ]}
    >
      <AppText variant="caption" color={t.fg} numberOfLines={1}>
        {label}
      </AppText>
    </View>
  );
}
