import React from 'react';
import { View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import AppText from '../components/AppText';
import { useTheme } from '../theme/ThemeContext';

const ICONS = {
  Explore: { active: 'compass', inactive: 'compass-outline' },
  Watchlist: { active: 'star', inactive: 'star-outline' },
};

function TabItem({ route, isFocused, onPress, label }) {
  const { colors, radius, spacing } = useTheme();
  const scale = useSharedValue(isFocused ? 1 : 0.92);
  const pill = useSharedValue(isFocused ? 1 : 0);

  React.useEffect(() => {
    scale.value = withSpring(isFocused ? 1 : 0.92, { damping: 15, stiffness: 220 });
    pill.value = withTiming(isFocused ? 1 : 0, { duration: 220 });
  }, [isFocused]);

  const iconStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const pillStyle = useAnimatedStyle(() => ({
    opacity: pill.value,
    transform: [{ scale: 0.8 + pill.value * 0.2 }],
  }));

  const icons = ICONS[route.name] ?? ICONS.Explore;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={label}
      onPress={onPress}
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
    >
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <View
          style={{
            paddingHorizontal: spacing.xl,
            paddingVertical: spacing.sm,
            borderRadius: radius.pill,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Animated.View
            style={[
              {
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: colors.accentSoft,
                borderRadius: radius.pill,
              },
              pillStyle,
            ]}
          />
          <Animated.View style={iconStyle}>
            <Ionicons
              name={isFocused ? icons.active : icons.inactive}
              size={22}
              color={isFocused ? colors.accent : colors.textSecondary}
            />
          </Animated.View>
        </View>
        <AppText
          variant="caption"
          color={isFocused ? 'accent' : 'textSecondary'}
          style={{ marginTop: 2 }}
        >
          {label}
        </AppText>
      </View>
    </Pressable>
  );
}

// Custom bottom tab bar: animated icon scale + accent pill behind the active tab.
export default function TabBar({ state, descriptors, navigation }) {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingTop: spacing.sm,
        paddingBottom: Math.max(insets.bottom, spacing.md),
      }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel ?? options.title ?? route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            Haptics.selectionAsync().catch(() => {});
            navigation.navigate(route.name);
          }
        };

        return (
          <TabItem
            key={route.key}
            route={route}
            label={label}
            isFocused={isFocused}
            onPress={onPress}
          />
        );
      })}
    </View>
  );
}
