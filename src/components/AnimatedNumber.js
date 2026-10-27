import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  useAnimatedReaction,
  useSharedValue,
  withTiming,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import AppText from './AppText';
import { useReduceMotion } from '../hooks/useReduceMotion';

// Smoothly counts from the previous value to `value` on change.
// `format` turns the current animated number into the displayed string.
//
// Note: formatting happens on the JS thread. The animated reaction (UI thread)
// only reads the shared value and hands the raw number to JS via runOnJS —
// calling `format` directly inside the worklet would crash under Reanimated 4's
// strict worklets ("Tried to synchronously call a Remote Function").
export default function AnimatedNumber({
  value = 0,
  duration = 700,
  format = (n) => n.toFixed(2),
  variant = 'number',
  color = 'textPrimary',
  style,
}) {
  const reduceMotion = useReduceMotion();
  const animated = useSharedValue(value);
  const [display, setDisplay] = useState(() => format(value));

  // Keep the latest formatter without re-creating the JS callback.
  const formatRef = useRef(format);
  formatRef.current = format;

  const updateDisplay = useCallback((n) => {
    setDisplay(formatRef.current(n));
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      animated.value = value;
      updateDisplay(value);
      return;
    }
    animated.value = withTiming(value, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
  }, [value, reduceMotion, duration, updateDisplay]);

  useAnimatedReaction(
    () => animated.value,
    (current) => {
      runOnJS(updateDisplay)(current);
    }
  );

  return (
    <AppText variant={variant} color={color} style={style}>
      {display}
    </AppText>
  );
}
