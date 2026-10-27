// Helpers for MFAPI's quirky data: NAVs arrive as strings, dates as DD-MM-YYYY.

// "25-10-2026" -> Date
export function parseMfDate(str) {
  if (!str || typeof str !== 'string') return null;
  const [dd, mm, yyyy] = str.split('-').map(Number);
  if (!dd || !mm || !yyyy) return null;
  return new Date(yyyy, mm - 1, dd);
}

// "92.1543" -> 92.1543 (number), NaN-safe
export function parseNav(str) {
  const n = typeof str === 'number' ? str : parseFloat(str);
  return Number.isFinite(n) ? n : null;
}

// 92.1543 -> "₹92.15"
export function formatCurrency(n, fractionDigits = 2) {
  if (n == null || !Number.isFinite(n)) return '—';
  return (
    '₹' +
    n.toLocaleString('en-IN', {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    })
  );
}

// 92.15 -> "92.15" (no currency symbol, for compact use)
export function formatNumber(n, fractionDigits = 2) {
  if (n == null || !Number.isFinite(n)) return '—';
  return n.toLocaleString('en-IN', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

// { abs, pct, direction } from latest vs previous NAV
export function computeChange(latest, prev) {
  if (latest == null || prev == null || prev === 0) {
    return { abs: 0, pct: 0, direction: 'flat' };
  }
  const abs = latest - prev;
  const pct = (abs / prev) * 100;
  const direction = abs > 0.0001 ? 'up' : abs < -0.0001 ? 'down' : 'flat';
  return { abs, pct, direction };
}

export function formatPct(pct) {
  if (pct == null || !Number.isFinite(pct)) return '—';
  const sign = pct > 0 ? '+' : '';
  return `${sign}${pct.toFixed(2)}%`;
}

export function formatSignedCurrency(abs) {
  if (abs == null || !Number.isFinite(abs)) return '—';
  const sign = abs > 0 ? '+' : abs < 0 ? '−' : '';
  return `${sign}${formatCurrency(Math.abs(abs))}`;
}

// Format a Date as "25 Oct 2026"
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export function formatDate(date) {
  if (!date || !(date instanceof Date) || isNaN(date)) return '—';
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

// Convert MFAPI's `data` array into chart-ready points sorted oldest -> newest.
// Each input item is { date: "DD-MM-YYYY", nav: "92.15" }.
export function toNavSeries(rawData) {
  if (!Array.isArray(rawData)) return [];
  const points = rawData
    .map((d) => ({ date: parseMfDate(d.date), value: parseNav(d.nav) }))
    .filter((p) => p.date && p.value != null);
  points.sort((a, b) => a.date - b.date);
  return points;
}

// Keep charts smooth on large histories: reduce to ~`maxPoints` by striding,
// always preserving the first and last points.
export function downsample(points, maxPoints = 120) {
  if (!Array.isArray(points) || points.length <= maxPoints) return points;
  const step = (points.length - 1) / (maxPoints - 1);
  const out = [];
  for (let i = 0; i < maxPoints; i++) {
    out.push(points[Math.round(i * step)]);
  }
  return out;
}

// Slice a series to a time range ('1M' | '6M' | '1Y' | 'ALL') relative to its
// most recent point.
export function sliceByRange(points, range) {
  if (!Array.isArray(points) || points.length === 0) return [];
  if (range === 'ALL') return points;
  const monthsMap = { '1M': 1, '6M': 6, '1Y': 12 };
  const months = monthsMap[range];
  if (!months) return points;
  const last = points[points.length - 1].date;
  const cutoff = new Date(last);
  cutoff.setMonth(cutoff.getMonth() - months);
  const sliced = points.filter((p) => p.date >= cutoff);
  return sliced.length >= 2 ? sliced : points.slice(-2);
}

// Min / max / current summary over a series.
export function seriesStats(points) {
  if (!Array.isArray(points) || points.length === 0) {
    return { min: null, max: null, current: null, first: null };
  }
  let min = Infinity;
  let max = -Infinity;
  for (const p of points) {
    if (p.value < min) min = p.value;
    if (p.value > max) max = p.value;
  }
  return {
    min,
    max,
    current: points[points.length - 1].value,
    first: points[0].value,
  };
}
