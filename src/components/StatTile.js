import React from 'react';
import { View } from 'react-native';
import AppText from './AppText';
import { useTheme } from '../theme/ThemeContext';

// Compact label/value tile used in the stats row on the detail screen.
export default function StatTile({ label, value, valueColor = 'textPrimary', style }) {
  const { colors, radius, spacing } = useTheme();
  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: colors.surfaceAlt,
          borderRadius: radius.md,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.md,
        },
        style,
      ]}
    >
      <AppText variant="caption" color="textSecondary" style={{ marginBottom: 4 }}>
        {label}
      </AppText>
      <AppText variant="numberSm" color={valueColor}>
        {value}
      </AppText>
    </View>
  );
}
