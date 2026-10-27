// Derive lightweight display tags from a scheme name, since the search
// endpoint only returns { schemeCode, schemeName }.

export function derivePlan(schemeName = '') {
  const n = schemeName.toUpperCase();
  if (n.includes('DIRECT')) return 'Direct';
  if (n.includes('REGULAR')) return 'Regular';
  return null;
}

export function deriveOption(schemeName = '') {
  const n = schemeName.toUpperCase();
  if (n.includes('GROWTH')) return 'Growth';
  if (n.includes('IDCW') || n.includes('DIVIDEND')) return 'IDCW';
  return null;
}

// A cleaner primary title: strip the trailing " - DIRECT PLAN - GROWTH" noise
// for the list, keeping the meaningful fund name.
export function cleanTitle(schemeName = '') {
  return schemeName
    .replace(/\s*-\s*(direct|regular)\s*plan.*$/i, '')
    .replace(/\s*-\s*(growth|idcw|dividend).*$/i, '')
    .trim() || schemeName;
}
