import React, { useState } from 'react';
import { View, TextInput, Pressable, Platform } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

// Rounded search input; border animates to the accent color on focus.
export default function SearchBar({ value, onChangeText, placeholder = 'Search mutual funds…' }) {
  const { colors, radius, spacing, fonts } = useTheme();
  const [focused, setFocused] = useState(false);
  const focus = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(focus.value, [0, 1], [colors.border, colors.accent]),
  }));

  return (
    <Animated.View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.surface,
          borderRadius: radius.pill,
          borderWidth: 1.5,
          paddingHorizontal: spacing.lg,
          height: 52,
        },
        animatedStyle,
      ]}
    >
      <Ionicons
        name="search"
        size={20}
        color={focused ? colors.accent : colors.textSecondary}
        style={{ marginRight: spacing.sm }}
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        onFocus={() => {
          setFocused(true);
          focus.value = withTiming(1, { duration: 180 });
        }}
        onBlur={() => {
          setFocused(false);
          focus.value = withTiming(0, { duration: 180 });
        }}
        returnKeyType="search"
        autoCorrect={false}
        style={{
          flex: 1,
          color: colors.textPrimary,
          fontFamily: fonts.medium,
          fontSize: 15,
          paddingVertical: 0,
          // Remove the browser's default focus ring on web (our animated
          // border already indicates focus).
          ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}),
        }}
      />
      {value?.length > 0 && (
        <Pressable
          onPress={() => onChangeText('')}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
        >
          <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
        </Pressable>
      )}
    </Animated.View>
  );
}
