import React from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import AppText from './AppText';
import { useTheme } from '../theme/ThemeContext';
import { useReduceMotion } from '../hooks/useReduceMotion';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Primary CTA. `variant`: 'gradient' (default) | 'soft' (watching state).
export default function PrimaryButton({
  label,
  icon,
  onPress,
  variant = 'gradient',
  style,
}) {
  const { colors, radius, spacing } = useTheme();
  const reduceMotion = useReduceMotion();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const content = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.lg,
      }}
    >
      {!!icon && (
        <Ionicons
          name={icon}
          size={20}
          color={variant === 'gradient' ? colors.accentContrast : colors.accent}
          style={{ marginRight: spacing.sm }}
        />
      )}
      <AppText variant="title" color={variant === 'gradient' ? 'accentContrast' : 'accent'}>
        {label}
      </AppText>
    </View>
  );

  return (
    <AnimatedPressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
        onPress?.();
      }}
      onPressIn={() => {
        if (!reduceMotion) scale.value = withSpring(0.97, { damping: 18, stiffness: 320 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 18, stiffness: 320 });
      }}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[{ borderRadius: radius.pill, overflow: 'hidden' }, animatedStyle, style]}
    >
      {variant === 'gradient' ? (
        <LinearGradient
          colors={[colors.accent, '#7C3AED']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {content}
        </LinearGradient>
      ) : (
        <View style={{ backgroundColor: colors.accentSoft }}>{content}</View>
      )}
    </AnimatedPressable>
  );
}
