import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import ScreenHeader from '../components/ScreenHeader';
import AppText from '../components/AppText';
import AnimatedNumber from '../components/AnimatedNumber';
import ChangeBadge from '../components/ChangeBadge';
import Chip from '../components/Chip';
import Card from '../components/Card';
import StatTile from '../components/StatTile';
import SegmentedControl from '../components/SegmentedControl';
import NavChart from '../components/NavChart';
import PrimaryButton from '../components/PrimaryButton';
import StateView from '../components/StateView';
import Skeleton from '../components/Skeleton';
import { useTheme } from '../theme/ThemeContext';
import { useReduceMotion } from '../hooks/useReduceMotion';
import { useFavorites } from '../context/FavoritesContext';
import { getFundDetail, refreshFundDetail } from '../api/mfApi';
import {
  toNavSeries,
  sliceByRange,
  downsample,
  seriesStats,
  computeChange,
  formatCurrency,
  formatDate,
} from '../utils/format';

const RANGES = [
  { label: '1M', value: '1M' },
  { label: '6M', value: '6M' },
  { label: '1Y', value: '1Y' },
  { label: 'All', value: 'ALL' },
];

function DetailSkeleton({ width }) {
  const { spacing } = useTheme();
  return (
    <View style={{ paddingHorizontal: spacing.xl }}>
      <Skeleton width="70%" height={16} style={{ marginBottom: spacing.lg }} />
      <Skeleton width={160} height={38} style={{ marginBottom: spacing.sm }} />
      <Skeleton width={90} height={24} radius={999} style={{ marginBottom: spacing.xl }} />
      <Skeleton width={width - 40} height={220} radius={20} style={{ marginBottom: spacing.xl }} />
      <View style={{ flexDirection: 'row', gap: spacing.md }}>
        <Skeleton width="31%" height={64} radius={16} />
        <Skeleton width="31%" height={64} radius={16} />
        <Skeleton width="31%" height={64} radius={16} />
      </View>
    </View>
  );
}

export default function FundDetailScreen({ route, navigation }) {
  const { schemeCode, schemeName } = route.params;
  const { colors, spacing, radius } = useTheme();
  const reduceMotion = useReduceMotion();
  const { width } = useWindowDimensions();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [status, setStatus] = useState('loading');
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState(null);
  const [range, setRange] = useState('1Y');
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setStatus('loading');
    setError(null);
    try {
      const data = await getFundDetail(schemeCode);
      setDetail(data);
      setStatus('success');
    } catch (err) {
      setError(err);
      setStatus('error');
    }
  }, [schemeCode]);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await refreshFundDetail(schemeCode);
      setDetail(data);
      setStatus('success');
    } catch (err) {
      // Keep existing data on a refresh failure; surface nothing intrusive.
    } finally {
      setRefreshing(false);
    }
  }, [schemeCode]);

  const series = useMemo(() => (detail ? toNavSeries(detail.data) : []), [detail]);

  const rangeSeries = useMemo(() => {
    const sliced = sliceByRange(series, range);
    return downsample(sliced, 120);
  }, [series, range]);

  const stats = useMemo(() => seriesStats(rangeSeries), [rangeSeries]);

  // Latest NAV + day-over-day change (from the two most recent points).
  const latest = series.length ? series[series.length - 1].value : null;
  const prevDay = series.length > 1 ? series[series.length - 2].value : null;
  const dayChange = computeChange(latest, prevDay);

  // Change across the selected range (first vs last of the sliced series).
  const rangeChange = computeChange(
    rangeSeries.length ? rangeSeries[rangeSeries.length - 1].value : null,
    rangeSeries.length ? rangeSeries[0].value : null
  );

  const favorite = isFavorite(schemeCode);
  const meta = detail?.meta;
  const lastUpdated = series.length ? series[series.length - 1].date : null;

  const handleToggleFavorite = () =>
    toggleFavorite({
      schemeCode,
      schemeName: meta?.scheme_name ?? schemeName,
      fundHouse: meta?.fund_house ?? null,
    });

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title="Fund" onBack={() => navigation.goBack()} showThemeToggle />

      {status === 'loading' && <DetailSkeleton width={width} />}

      {status === 'error' && (
        <StateView
          variant="error"
          title="Couldn't load fund"
          message={error?.message ?? 'Please try again.'}
          actionLabel="Retry"
          onAction={load}
        />
      )}

      {status === 'success' && (
        <>
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: spacing.xl,
              paddingBottom: 120,
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
            {/* Hero */}
            <Animated.View entering={reduceMotion ? undefined : FadeInDown.duration(320)}>
              <AppText variant="h2" style={{ marginBottom: spacing.xs }}>
                {meta?.scheme_name ?? schemeName}
              </AppText>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.xl }}>
                {!!meta?.fund_house && <Chip label={meta.fund_house} tone="accent" />}
                {!!meta?.scheme_category && <Chip label={meta.scheme_category} />}
              </View>

              <AppText variant="caption" color="textSecondary" style={{ marginBottom: 4 }}>
                Latest NAV
              </AppText>
              <AnimatedNumber
                value={latest ?? 0}
                format={(n) => formatCurrency(n)}
                variant="number"
              />
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm }}>
                <ChangeBadge direction={dayChange.direction} pct={dayChange.pct} size="lg" />
                <AppText variant="label" color="textSecondary" style={{ marginLeft: spacing.sm }}>
                  1-day
                </AppText>
              </View>
            </Animated.View>

            {/* Chart */}
            <Animated.View
              entering={reduceMotion ? undefined : FadeIn.duration(400).delay(120)}
              style={{ marginTop: spacing.xxl }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: spacing.sm,
                }}
              >
                <AppText variant="caption" color="textSecondary">
                  NAV · {range === 'ALL' ? 'All time' : range}
                </AppText>
                <ChangeBadge direction={rangeChange.direction} pct={rangeChange.pct} />
              </View>

              <NavChart
                points={rangeSeries}
                direction={rangeChange.direction === 'down' ? 'down' : 'up'}
                width={width - spacing.xl * 2}
              />

              <SegmentedControl
                options={RANGES}
                value={range}
                onChange={setRange}
                style={{ marginTop: spacing.lg }}
              />
            </Animated.View>

            {/* Stats */}
            <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.xxl }}>
              <StatTile label="Low" value={formatCurrency(stats.min)} />
              <StatTile label="High" value={formatCurrency(stats.max)} />
              <StatTile
                label="Current"
                value={formatCurrency(stats.current)}
                valueColor="accent"
              />
            </View>

            {/* Metadata */}
            <Card style={{ marginTop: spacing.xxl }}>
              <MetaRow label="Scheme type" value={meta?.scheme_type} />
              <Divider />
              <MetaRow label="Category" value={meta?.scheme_category} />
              <Divider />
              <MetaRow label="Scheme code" value={String(meta?.scheme_code ?? schemeCode)} />
              <Divider />
              <MetaRow label="Last updated" value={formatDate(lastUpdated)} />
            </Card>
          </ScrollView>

          {/* Sticky CTA */}
          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              paddingHorizontal: spacing.xl,
              paddingTop: spacing.md,
              paddingBottom: spacing.xxl,
              backgroundColor: colors.bg,
              borderTopWidth: 1,
              borderTopColor: colors.border,
            }}
          >
            <PrimaryButton
              label={favorite ? 'Watching ✓' : 'Add to Watchlist'}
              icon={favorite ? 'star' : 'star-outline'}
              variant={favorite ? 'soft' : 'gradient'}
              onPress={handleToggleFavorite}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

function MetaRow({ label, value }) {
  const { spacing } = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.md,
      }}
    >
      <AppText variant="label" color="textSecondary">
        {label}
      </AppText>
      <AppText
        variant="label"
        color="textPrimary"
        style={{ flexShrink: 1, textAlign: 'right', marginLeft: spacing.lg }}
        numberOfLines={2}
      >
        {value ?? '—'}
      </AppText>
    </View>
  );
}

function Divider() {
  const { colors } = useTheme();
  return <View style={{ height: 1, backgroundColor: colors.border }} />;
}
