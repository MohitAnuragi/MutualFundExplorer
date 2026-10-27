import React, { useState } from 'react';
import { View, Pressable, LayoutAnimation, Platform, UIManager } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import AppText from './AppText';
import { useTheme } from '../theme/ThemeContext';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Segmented control with an animated sliding indicator behind the active option.
// `options`: [{ label, value }]; `value` is the selected value.
export default function SegmentedControl({ options, value, onChange, style }) {
  const { colors, radius, spacing } = useTheme();
  const [trackWidth, setTrackWidth] = useState(0);

  const count = options.length;
  const segWidth = trackWidth > 0 ? (trackWidth - 4) / count : 0;
  const activeIndex = Math.max(0, options.findIndex((o) => o.value === value));

  const indicatorX = useSharedValue(0);
  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
  }));

  // Keep the indicator in sync with the active index / measured width.
  React.useEffect(() => {
    indicatorX.value = withSpring(activeIndex * segWidth, { damping: 18, stiffness: 180 });
  }, [activeIndex, segWidth]);

  return (
    <View
      onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
      style={[
        {
          flexDirection: 'row',
          backgroundColor: colors.surfaceAlt,
          borderRadius: radius.pill,
          padding: 2,
        },
        style,
      ]}
    >
      {segWidth > 0 && (
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: 2,
              left: 2,
              width: segWidth,
              height: '100%',
              marginVertical: 0,
            },
            indicatorStyle,
          ]}
          pointerEvents="none"
        >
          <View
            style={{
              flex: 1,
              marginVertical: 2,
              backgroundColor: colors.surface,
              borderRadius: radius.pill,
              shadowColor: '#0B1020',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
          />
        </Animated.View>
      )}

      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => {
              if (opt.value !== value) {
                Haptics.selectionAsync().catch(() => {});
                onChange?.(opt.value);
              }
            }}
            style={{
              flex: 1,
              paddingVertical: spacing.sm,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AppText variant="label" color={active ? 'textPrimary' : 'textSecondary'}>
              {opt.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}
