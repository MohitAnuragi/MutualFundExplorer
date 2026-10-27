import React, { useMemo } from 'react';
import { View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import AppText from './AppText';
import { useTheme } from '../theme/ThemeContext';
import { useReduceMotion } from '../hooks/useReduceMotion';
import { formatCurrency, formatDate } from '../utils/format';

// Animated area line chart of NAV over a range, with a draggable tooltip.
// `points`: [{ date: Date, value: number }] (already sliced/downsampled).
export default function NavChart({ points = [], direction = 'up', width, height = 220 }) {
  const { colors, spacing, radius } = useTheme();
  const reduceMotion = useReduceMotion();

  const lineColor = direction === 'down' ? colors.negative : colors.positive;

  const data = useMemo(
    () =>
      points.map((p) => ({
        value: p.value,
        date: p.date,
      })),
    [points]
  );

  if (data.length < 2) {
    return (
      <View style={{ height, alignItems: 'center', justifyContent: 'center' }}>
        <AppText variant="body" color="textSecondary">
          Not enough data to chart this range.
        </AppText>
      </View>
    );
  }

  const values = points.map((p) => p.value);
  const minV = Math.min(...values);
  const maxV = Math.max(...values);
  const pad = (maxV - minV) * 0.12 || 1;
  // gifted-charts subtracts `yAxisOffset` from every value, then scales by
  // `maxValue`. So `maxValue` must be the OFFSET-RELATIVE range, not the
  // absolute max — otherwise low-NAV funds compress to a flat line at the
  // bottom of the chart.
  const yOffset = Math.max(0, minV - pad);

  const chartWidth = (width ?? 320) - 8;

  return (
    <View style={{ height, marginLeft: -8 }}>
      <LineChart
        data={data}
        width={chartWidth}
        height={height - 20}
        adjustToWidth
        initialSpacing={0}
        endSpacing={0}
        thickness={2.5}
        color={lineColor}
        curved
        isAnimated={!reduceMotion}
        animationDuration={reduceMotion ? 0 : 900}
        areaChart
        startFillColor={lineColor}
        endFillColor={lineColor}
        startOpacity={0.28}
        endOpacity={0.02}
        hideDataPoints
        hideRules
        hideYAxisText
        yAxisThickness={0}
        xAxisThickness={0}
        yAxisOffset={yOffset}
        maxValue={maxV + pad - yOffset}
        disableScroll
        pointerConfig={{
          pointerStripHeight: height - 20,
          pointerStripColor: colors.border,
          pointerStripWidth: 1.5,
          pointerColor: lineColor,
          radius: 5,
          pointerLabelWidth: 130,
          pointerLabelHeight: 60,
          activatePointersOnLongPress: false,
          autoAdjustPointerLabelPosition: true,
          pointerLabelComponent: (items) => {
            const item = items?.[0];
            if (!item) return null;
            return (
              <View
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderWidth: 1,
                  borderRadius: radius.md,
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.sm,
                  shadowColor: '#0B1020',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.15,
                  shadowRadius: 10,
                  elevation: 5,
                }}
              >
                <AppText variant="numberSm" color="textPrimary">
                  {formatCurrency(item.value)}
                </AppText>
                <AppText variant="caption" color="textSecondary" style={{ marginTop: 2 }}>
                  {formatDate(item.date)}
                </AppText>
              </View>
            );
          },
        }}
      />
    </View>
  );
}
