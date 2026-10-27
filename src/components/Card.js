import React from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../theme/ThemeContext';
import { useReduceMotion } from '../hooks/useReduceMotion';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// A surface card. When `onPress` is provided it becomes a pressable that
// springs to 0.97 and fires a light haptic on press-in.
export default function Card({
  children,
  onPress,
  style,
  padded = true,
  elevationLevel = 'shadow1',
  haptic = true,
  ...rest
}) {
  const { colors, radius, spacing, elevation } = useTheme();
  const reduceMotion = useReduceMotion();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const baseStyle = [
    {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: padded ? spacing.lg : 0,
    },
    elevation[elevationLevel],
    style,
  ];

  if (!onPress) {
    return (
      <View style={baseStyle} {...rest}>
        {children}
      </View>
    );
  }

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        if (!reduceMotion) scale.value = withSpring(0.97, { damping: 18, stiffness: 320 });
        if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 18, stiffness: 320 });
      }}
      style={[baseStyle, animatedStyle]}
      {...rest}
    >
      {children}
    </AnimatedPressable>
  );
}
