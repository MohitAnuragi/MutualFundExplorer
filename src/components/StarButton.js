import React, { useEffect } from 'react';
import { Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../theme/ThemeContext';
import { useReduceMotion } from '../hooks/useReduceMotion';

// Animated star: pops (scale burst) and fills/empties on toggle, with haptic.
// The scale animation lives on a wrapping Animated.View rather than the icon
// itself — animating a vector-icon component directly calls setNativeProps,
// which doesn't exist on react-native-web and throws there.
export default function StarButton({ active, onToggle, size = 24, hitSlop = 10 }) {
  const { colors } = useTheme();
  const reduceMotion = useReduceMotion();
  const scale = useSharedValue(1);
  const prev = useSharedValue(active);

  useEffect(() => {
    if (prev.value === active) return;
    prev.value = active;
    if (reduceMotion) return;
    // Pop outward when activating, a gentle settle when deactivating.
    scale.value = active
      ? withSequence(withSpring(1.35, { damping: 6, stiffness: 300 }), withSpring(1))
      : withSequence(withTiming(0.8, { duration: 90 }), withSpring(1));
  }, [active, reduceMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      hitSlop={hitSlop}
      accessibilityRole="button"
      accessibilityLabel={active ? 'Remove from watchlist' : 'Add to watchlist'}
      onPress={() => {
        Haptics.impactAsync(
          active ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Medium
        ).catch(() => {});
        onToggle?.();
      }}
    >
      <Animated.View style={animatedStyle}>
        <Ionicons
          name={active ? 'star' : 'star-outline'}
          size={size}
          color={active ? colors.star : colors.textSecondary}
        />
      </Animated.View>
    </Pressable>
  );
}
