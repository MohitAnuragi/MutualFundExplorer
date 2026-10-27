import React from 'react';
import { View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Card from './Card';
import AppText from './AppText';
import Chip from './Chip';
import ChangeBadge from './ChangeBadge';
import Sparkline from './Sparkline';
import StarButton from './StarButton';
import Skeleton from './Skeleton';
import { useTheme } from '../theme/ThemeContext';
import { useReduceMotion } from '../hooks/useReduceMotion';
import { derivePlan, deriveOption, cleanTitle } from '../utils/scheme';
import { formatCurrency } from '../utils/format';

// Row card for search & watchlist. Optional nav/change/sparkline render when
// provided; `index` drives a capped staggered entrance.
export default function FundListItem({
  fund,
  nav,
  change,
  sparklineData,
  loading = false,
  index = 0,
  isFavorite = false,
  onToggleFavorite,
  onPress,
}) {
  const { colors, spacing } = useTheme();
  const reduceMotion = useReduceMotion();

  const plan = derivePlan(fund.schemeName);
  const option = deriveOption(fund.schemeName);
  const title = cleanTitle(fund.schemeName);
  const delay = reduceMotion ? 0 : Math.min(index, 10) * 45;

  return (
    <Animated.View
      entering={reduceMotion ? undefined : FadeInDown.duration(300).delay(delay)}
    >
      <Card onPress={onPress} style={{ marginBottom: spacing.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flex: 1, paddingRight: spacing.md }}>
            <AppText variant="title" numberOfLines={2} style={{ marginBottom: spacing.sm }}>
              {title}
            </AppText>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
              {!!fund.fundHouse && <Chip label={fund.fundHouse} />}
              {!!plan && <Chip label={plan} tone="accent" />}
              {!!option && <Chip label={option} />}
            </View>
          </View>

          <StarButton active={isFavorite} onToggle={onToggleFavorite} />
        </View>

        {/* NAV + trend row (only when data is present or loading) */}
        {(loading || nav != null) && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginTop: spacing.lg,
            }}
          >
            <View>
              {loading ? (
                <>
                  <Skeleton width={90} height={22} style={{ marginBottom: 6 }} />
                  <Skeleton width={56} height={16} />
                </>
              ) : (
                <>
                  <AppText variant="numberSm" style={{ fontSize: 20, lineHeight: 24 }}>
                    {formatCurrency(nav)}
                  </AppText>
                  {change && (
                    <ChangeBadge
                      direction={change.direction}
                      pct={change.pct}
                      style={{ marginTop: 6 }}
                    />
                  )}
                </>
              )}
            </View>

            {!loading && sparklineData?.length > 1 && (
              <Sparkline values={sparklineData} width={88} height={34} />
            )}
          </View>
        )}
      </Card>
    </Animated.View>
  );
}
