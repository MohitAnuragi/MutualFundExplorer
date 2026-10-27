import React from 'react';
import { View, Pressable } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import AppText from './AppText';
import { useTheme } from '../theme/ThemeContext';
import { useReduceMotion } from '../hooks/useReduceMotion';

// Unified empty / error state with a fade+rise entrance and optional retry/CTA.
// `variant`: 'empty' | 'error'
export default function StateView({
  variant = 'empty',
  icon,
  title,
  message,
  actionLabel,
  onAction,
  style,
}) {
  const { colors, spacing, radius } = useTheme();
  const reduceMotion = useReduceMotion();

  const defaultIcon = variant === 'error' ? 'cloud-offline-outline' : 'search-outline';
  const iconColor = variant === 'error' ? colors.negative : colors.textSecondary;
  const iconBg = variant === 'error' ? colors.negativeSoft : colors.surfaceAlt;

  return (
    <Animated.View
      entering={reduceMotion ? undefined : FadeInUp.duration(320)}
      style={[
        {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: spacing.xxl,
          paddingVertical: spacing.xxxl,
        },
        style,
      ]}
    >
      <View
        style={{
          width: 72,
          height: 72,
          borderRadius: 36,
          backgroundColor: iconBg,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: spacing.lg,
        }}
      >
        <Ionicons name={icon ?? defaultIcon} size={34} color={iconColor} />
      </View>

      {!!title && (
        <AppText variant="h2" style={{ textAlign: 'center', marginBottom: spacing.sm }}>
          {title}
        </AppText>
      )}
      {!!message && (
        <AppText
          variant="body"
          color="textSecondary"
          style={{ textAlign: 'center', marginBottom: spacing.xl }}
        >
          {message}
        </AppText>
      )}

      {!!actionLabel && (
        <Pressable
          onPress={onAction}
          accessibilityRole="button"
          style={{
            backgroundColor: colors.accent,
            paddingHorizontal: spacing.xl,
            paddingVertical: spacing.md,
            borderRadius: radius.pill,
          }}
        >
          <AppText variant="title" color="accentContrast">
            {actionLabel}
          </AppText>
        </Pressable>
      )}
    </Animated.View>
  );
}
