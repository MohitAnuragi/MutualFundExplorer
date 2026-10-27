import React from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import AppText from './AppText';
import { useTheme } from '../theme/ThemeContext';

// Large screen title with an optional theme toggle and back button.
export default function ScreenHeader({ title, subtitle, onBack, showThemeToggle = false, style }) {
  const { colors, spacing, isDark, toggleTheme, radius } = useTheme();

  return (
    <View
      style={[
        {
          paddingHorizontal: spacing.xl,
          paddingTop: spacing.sm,
          paddingBottom: spacing.md,
        },
        style,
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {onBack && (
          <Pressable
            onPress={onBack}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={{
              width: 40,
              height: 40,
              borderRadius: radius.pill,
              backgroundColor: colors.surfaceAlt,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: spacing.md,
            }}
          >
            <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
          </Pressable>
        )}

        <View style={{ flex: 1 }}>
          <AppText variant="display" numberOfLines={1}>
            {title}
          </AppText>
          {!!subtitle && (
            <AppText variant="body" color="textSecondary" style={{ marginTop: 2 }}>
              {subtitle}
            </AppText>
          )}
        </View>

        {showThemeToggle && (
          <Pressable
            onPress={() => {
              Haptics.selectionAsync().catch(() => {});
              toggleTheme();
            }}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Toggle light and dark theme"
            style={{
              width: 40,
              height: 40,
              borderRadius: radius.pill,
              backgroundColor: colors.surfaceAlt,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons
              name={isDark ? 'sunny-outline' : 'moon-outline'}
              size={20}
              color={colors.textPrimary}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
}
