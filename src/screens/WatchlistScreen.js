import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Animated, { FadeInDown, FadeOut, LinearTransition } from 'react-native-reanimated';
import ScreenHeader from '../components/ScreenHeader';
import AppText from '../components/AppText';
import Card from '../components/Card';
import FundListItem from '../components/FundListItem';
import StateView from '../components/StateView';
import ChangeBadge from '../components/ChangeBadge';
import { useTheme } from '../theme/ThemeContext';
import { useReduceMotion } from '../hooks/useReduceMotion';
import { useFavorites } from '../context/FavoritesContext';
import { getFundDetail } from '../api/mfApi';
import { toNavSeries, computeChange } from '../utils/format';

// Build a light snapshot (nav, day change, sparkline) from a fund detail.
function snapshotFromDetail(detail) {
  const series = toNavSeries(detail.data);
  const latest = series.length ? series[series.length - 1].value : null;
  const prev = series.length > 1 ? series[series.length - 2].value : null;
  const change = computeChange(latest, prev);
  const sparkline = series.slice(-30).map((p) => p.value);
  return { nav: latest, change, sparkline };
}

function PortfolioSummary({ count, snapshots }) {
  const { colors, spacing } = useTheme();
  const reduceMotion = useReduceMotion();

  const loaded = Object.values(snapshots).filter((s) => s && !s.loading && s.change);
  const avgPct =
    loaded.length > 0
      ? loaded.reduce((sum, s) => sum + (s.change.pct ?? 0), 0) / loaded.length
      : 0;
  const direction = avgPct > 0.01 ? 'up' : avgPct < -0.01 ? 'down' : 'flat';

  return (
    <Animated.View entering={reduceMotion ? undefined : FadeInDown.duration(300)}>
      <Card style={{ marginBottom: spacing.lg }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <AppText variant="caption" color="textSecondary">
              Funds watched
            </AppText>
            <AppText variant="number" style={{ fontSize: 28, lineHeight: 34 }}>
              {count}
            </AppText>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <AppText variant="caption" color="textSecondary" style={{ marginBottom: 6 }}>
              Avg. 1-day
            </AppText>
            <ChangeBadge direction={direction} pct={avgPct} size="lg" />
          </View>
        </View>
      </Card>
    </Animated.View>
  );
}

export default function WatchlistScreen({ navigation }) {
  const { colors, spacing } = useTheme();
  const reduceMotion = useReduceMotion();
  const { favorites, hydrated, removeFavorite } = useFavorites();

  const [snapshots, setSnapshots] = useState({}); // schemeCode -> { nav, change, sparkline, loading }
  const [refreshing, setRefreshing] = useState(false);
  const loadedOnce = useRef(new Set());

  const loadSnapshots = useCallback(
    async (force = false) => {
      const targets = favorites.filter(
        (f) => force || !loadedOnce.current.has(String(f.schemeCode))
      );
      if (targets.length === 0) return;

      setSnapshots((prev) => {
        const next = { ...prev };
        for (const f of targets) {
          if (!next[f.schemeCode]) next[f.schemeCode] = { loading: true };
        }
        return next;
      });

      await Promise.all(
        targets.map(async (f) => {
          try {
            const detail = await getFundDetail(f.schemeCode);
            const snap = snapshotFromDetail(detail);
            loadedOnce.current.add(String(f.schemeCode));
            setSnapshots((prev) => ({ ...prev, [f.schemeCode]: { ...snap, loading: false } }));
          } catch {
            setSnapshots((prev) => ({
              ...prev,
              [f.schemeCode]: { loading: false, nav: null, change: null, sparkline: [] },
            }));
          }
        })
      );
    },
    [favorites]
  );

  // Load any not-yet-loaded snapshots when the screen gains focus.
  useFocusEffect(
    useCallback(() => {
      loadSnapshots(false);
    }, [loadSnapshots])
  );

  useEffect(() => {
    loadSnapshots(false);
  }, [loadSnapshots]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadSnapshots(true);
    setRefreshing(false);
  }, [loadSnapshots]);

  const openFund = (fund) =>
    navigation.navigate('FundDetail', { schemeCode: fund.schemeCode, schemeName: fund.schemeName });

  if (!hydrated) {
    return (
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.bg }}>
        <ScreenHeader title="Watchlist" showThemeToggle />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader
        title="Watchlist"
        subtitle={favorites.length ? `${favorites.length} fund${favorites.length > 1 ? 's' : ''} tracked` : undefined}
        showThemeToggle
      />

      {favorites.length === 0 ? (
        <StateView
          icon="star-outline"
          title="No funds yet"
          message="Star funds while exploring to track their NAV here."
          actionLabel="Explore funds"
          onAction={() => navigation.navigate('Explore')}
        />
      ) : (
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: spacing.xl,
            paddingTop: spacing.md,
            paddingBottom: spacing.xxxl,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.accent}
              colors={[colors.accent]}
            />
          }
        >
          <PortfolioSummary count={favorites.length} snapshots={snapshots} />

          {favorites.map((fund, index) => {
            const snap = snapshots[fund.schemeCode] ?? { loading: true };
            return (
              <Animated.View
                key={fund.schemeCode}
                entering={reduceMotion ? undefined : FadeInDown.duration(260)}
                exiting={reduceMotion ? undefined : FadeOut.duration(220)}
                layout={reduceMotion ? undefined : LinearTransition.springify().damping(18)}
              >
                <FundListItem
                  fund={fund}
                  index={index}
                  nav={snap.nav}
                  change={snap.change}
                  sparklineData={snap.sparkline}
                  loading={snap.loading}
                  isFavorite
                  onToggleFavorite={() => removeFavorite(fund.schemeCode)}
                  onPress={() => openFund(fund)}
                />
              </Animated.View>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
