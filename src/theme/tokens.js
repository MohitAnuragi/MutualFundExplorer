// Spacing, radius, and elevation tokens — theme-independent.

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const radius = {
  sm: 10,
  md: 16,
  lg: 20,
  pill: 999,
};

// Soft, low-opacity shadows. shadowColor is overridden per-theme at use sites
// if needed, but the defaults read well on both backgrounds.
export const elevation = {
  none: {},
  shadow1: {
    shadowColor: '#0B1020',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  shadow2: {
    shadowColor: '#0B1020',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 6,
  },
  shadow3: {
    shadowColor: '#0B1020',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.16,
    shadowRadius: 28,
    elevation: 10,
  },
};

// Animation timing/easing contract (see PHASE_PLAN Phase 0).
export const motion = {
  fast: 180,
  base: 240,
  slow: 320,
  spring: { damping: 18, stiffness: 180, mass: 1 },
  springSoft: { damping: 22, stiffness: 140, mass: 1 },
};
