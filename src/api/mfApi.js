// Thin client over MFAPI.in (https://www.mfapi.in/). No API key; public GETs.
// Every call resolves to data or throws a typed error: { kind, message }.

const BASE = 'https://api.mfapi.in';
const DEFAULT_TIMEOUT = 12000;

// Small in-memory caches so re-opening a fund or repeating a search is instant.
const detailCache = new Map();
const searchCache = new Map();

export class MfApiError extends Error {
  constructor(kind, message) {
    super(message);
    this.kind = kind; // 'network' | 'timeout' | 'server' | 'empty'
    this.name = 'MfApiError';
  }
}

async function request(path, { timeout = DEFAULT_TIMEOUT } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  let res;
  try {
    res = await fetch(`${BASE}${path}`, { signal: controller.signal });
  } catch (err) {
    clearTimeout(timer);
    if (err.name === 'AbortError') {
      throw new MfApiError('timeout', 'The request took too long. Check your connection.');
    }
    throw new MfApiError('network', 'Network error. Please check your connection.');
  }
  clearTimeout(timer);

  if (!res.ok) {
    throw new MfApiError('server', `Server responded with ${res.status}.`);
  }
  try {
    return await res.json();
  } catch {
    throw new MfApiError('server', 'Received a malformed response.');
  }
}

// GET /mf/search?q= -> [{ schemeCode, schemeName }]
export async function searchFunds(query) {
  const q = (query || '').trim();
  if (q.length === 0) return [];
  if (searchCache.has(q)) return searchCache.get(q);

  const data = await request(`/mf/search?q=${encodeURIComponent(q)}`);
  const list = Array.isArray(data) ? data : [];
  searchCache.set(q, list);
  return list;
}

// GET /mf/{code} -> { meta, data, status }
export async function getFundDetail(schemeCode) {
  const key = String(schemeCode);
  if (detailCache.has(key)) return detailCache.get(key);

  const data = await request(`/mf/${encodeURIComponent(key)}`);
  if (!data || data.status === 'FAIL' || !data.meta) {
    throw new MfApiError('empty', 'This fund has no data available.');
  }
  detailCache.set(key, data);
  return data;
}

// GET /mf/{code}/latest -> lightweight latest NAV
export async function getLatestNav(schemeCode) {
  const key = String(schemeCode);
  const data = await request(`/mf/${encodeURIComponent(key)}/latest`);
  if (!data || !Array.isArray(data.data) || data.data.length === 0) {
    throw new MfApiError('empty', 'No latest NAV available.');
  }
  return data;
}

// Force-refresh a fund detail (used by pull-to-refresh), bypassing cache.
export async function refreshFundDetail(schemeCode) {
  detailCache.delete(String(schemeCode));
  return getFundDetail(schemeCode);
}
