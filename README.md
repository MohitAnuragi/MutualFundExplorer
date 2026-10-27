# 📈 Mutual Fund Explorer

> A cross-platform mobile app to **search, explore, and track Indian mutual funds** — with live NAV data, historical NAV charts, and a personal watchlist. Built with **React Native (Expo)**.

<p align="center">
  <img alt="React Native" src="https://img.shields.io/badge/React%20Native-0.74-61DAFB?logo=react&logoColor=white">
  <img alt="Expo" src="https://img.shields.io/badge/Expo-SDK%2051-000020?logo=expo&logoColor=white">
  <img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?logo=javascript&logoColor=black">
  <img alt="Platform" src="https://img.shields.io/badge/Platform-iOS%20%7C%20Android-lightgrey">
  <img alt="License" src="https://img.shields.io/badge/License-MIT-green">
</p>

---

## ✨ Overview

**Mutual Fund Explorer** lets users discover Indian mutual funds and keep an eye on the ones they care about. Search across thousands of AMFI-registered funds, open any fund to see its latest Net Asset Value (NAV) and a chart of how the NAV has moved over time, and star funds to build a personal watchlist that persists across app restarts.

The app is powered by the free, open **[MFAPI.in](https://www.mfapi.in/)** service, which exposes real, up-to-date Indian mutual fund NAV data sourced from AMFI.

> Built as a focused demonstration of React Native fundamentals: API-driven lists, navigation, charts, local persistence, and a clean, themeable UI.

---

## 📱 Features

- 🔍 **Fund Search** — search thousands of Indian mutual funds by name in real time
- 📊 **Fund Detail** — latest NAV, fund house, scheme type/category, and last-updated date
- 📈 **NAV History Chart** — interactive line chart of historical NAV so users can see performance at a glance
- ⭐ **Watchlist** — star/unstar funds; favorites persist locally via `AsyncStorage`
- 🔄 **Pull-to-Refresh** — refresh latest NAV on demand
- 🌗 **Light & Dark Mode** — adapts to the device theme
- 🧭 **Smooth Navigation** — stack + tab navigation with React Navigation
- 📡 **Robust Network States** — explicit loading, empty, and error states for every screen

---

## 🖼️ Screenshots

> _Add screenshots / a screen recording here after your first build — recruiters skim visuals first._

| Search | Fund Detail | Watchlist |
|:--:|:--:|:--:|
| _screenshot_ | _screenshot_ | _screenshot_ |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React Native (Expo) |
| **Language** | JavaScript (ES2022) |
| **Navigation** | React Navigation (Native Stack + Bottom Tabs) |
| **Networking** | `fetch` API against MFAPI REST endpoints (timeouts + typed errors) |
| **Charts** | `react-native-gifted-charts` + `react-native-svg` (gradient area fills) |
| **Animation** | `react-native-reanimated` v4 (layout + shared-value animations) + `react-native-gesture-handler` |
| **Effects** | `expo-linear-gradient`, `expo-haptics`, `expo-blur` |
| **Fonts** | `Inter` via `@expo-google-fonts/inter` |
| **Local Storage** | `@react-native-async-storage/async-storage` |
| **State** | React Hooks + Context API (`ThemeContext`, `FavoritesContext`) |
| **Icons** | `@expo/vector-icons` (Ionicons) |

---

## 🌐 API Reference — [MFAPI.in](https://www.mfapi.in/)

No API key required. All endpoints are public `GET` requests.

| Purpose | Endpoint | Notes |
|---|---|---|
| **Search funds** | `GET https://api.mfapi.in/mf/search?q={query}` | Returns matching funds with `schemeCode` + `schemeName` |
| **List all funds** | `GET https://api.mfapi.in/mf` | Full list (large) — used for offline/local search if needed |
| **Fund details + NAV history** | `GET https://api.mfapi.in/mf/{schemeCode}` | Returns `meta` + full `data` array of `{ date, nav }` |
| **Latest NAV only** | `GET https://api.mfapi.in/mf/{schemeCode}/latest` | Lightweight latest-NAV lookup |

**Sample response** (`/mf/{schemeCode}`):

```json
{
  "meta": {
    "fund_house": "SBI Mutual Fund",
    "scheme_type": "Open Ended Schemes",
    "scheme_category": "Equity Scheme - Large Cap Fund",
    "scheme_code": 119598,
    "scheme_name": "SBI BLUE CHIP FUND - DIRECT PLAN - GROWTH"
  },
  "data": [
    { "date": "25-10-2026", "nav": "92.1543" },
    { "date": "24-10-2026", "nav": "91.8820" }
  ],
  "status": "SUCCESS"
}
```

> ⚠️ **Date format note:** MFAPI returns dates as `DD-MM-YYYY` and `nav` as a **string** — parse both before using them in charts or sorting.

---

## 🏗️ Project Structure

```
MutualFundExplorer/
├── App.js                      # Entry point: providers + navigation + fonts
├── app.json                    # Expo configuration
├── babel.config.js             # babel-preset-expo (Reanimated/Worklets)
├── package.json
├── PHASE_PLAN.md               # Build plan + design-system spec
├── assets/                     # Icons, splash, screenshots
└── src/
    ├── api/
    │   └── mfApi.js            # MFAPI client: timeouts, typed errors, cache
    ├── components/
    │   ├── AppText.js          # Typography-aware text
    │   ├── Card.js             # Pressable surface (spring + haptic)
    │   ├── Chip.js             # Category / fund-house pills
    │   ├── ChangeBadge.js      # ▲/▼ NAV change pill
    │   ├── Skeleton.js         # Shimmer loading placeholder
    │   ├── StarButton.js       # Animated watchlist star
    │   ├── StateView.js        # Empty / error states
    │   ├── Sparkline.js        # Inline SVG trend line
    │   ├── SegmentedControl.js # Chart range selector (sliding indicator)
    │   ├── StatTile.js         # Low / High / Current tiles
    │   ├── AnimatedNumber.js   # Counting-up NAV value
    │   ├── NavChart.js         # Animated gradient NAV chart + tooltip
    │   ├── SearchBar.js        # Focus-animated search input
    │   ├── FundListItem.js     # Search/watchlist row card
    │   ├── ScreenHeader.js     # Title + back + theme toggle
    │   ├── PrimaryButton.js    # Gradient CTA
    │   └── ErrorBoundary.js    # Root crash fallback
    ├── context/
    │   └── FavoritesContext.js # Watchlist state + AsyncStorage persistence
    ├── theme/
    │   ├── colors.js           # Light/dark color tokens
    │   ├── typography.js       # Inter type scale (tabular figures)
    │   ├── tokens.js           # Spacing, radius, elevation, motion
    │   └── ThemeContext.js     # useTheme() + light/dark toggle
    ├── hooks/
    │   ├── useDebounce.js      # Debounced search input
    │   ├── useReduceMotion.js  # Honors OS reduce-motion
    │   └── useAppFonts.js      # Inter font loading
    ├── navigation/
    │   ├── RootNavigator.js    # Tabs + per-tab native stacks
    │   └── TabBar.js           # Custom animated bottom tab bar
    ├── screens/
    │   ├── SearchScreen.js     # Search + staggered results
    │   ├── FundDetailScreen.js # Hero NAV, chart, stats, sticky CTA
    │   └── WatchlistScreen.js  # Saved funds + portfolio summary
    └── utils/
        ├── format.js           # Date/NAV parsing, ranges, stats
        └── scheme.js           # Scheme-name → display tags
```

> 🎨 The full UI/animation spec (color tokens, type scale, motion rules) lives in [`PHASE_PLAN.md`](PHASE_PLAN.md).

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Expo Go** app on your phone (iOS/Android) — or an emulator
- Git

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/MutualFundExplorer.git
cd MutualFundExplorer

# 2. Install dependencies
npm install

# 3. Start the Expo dev server
npm start
```

Then scan the QR code with **Expo Go** (Android) or the **Camera** app (iOS). Or press `a` for Android emulator / `i` for iOS simulator.

### Core dependencies

Already installed in this repo (`npm install` restores them). For reference, they were added with:

```bash
# navigation
npx expo install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs \
  react-native-screens react-native-safe-area-context
# animation + gestures
npx expo install react-native-reanimated react-native-gesture-handler
# charts + gradients (Expo Go-safe: expo-linear-gradient, not react-native-linear-gradient)
npx expo install react-native-gifted-charts react-native-svg expo-linear-gradient
# storage, effects, fonts, icons
npx expo install @react-native-async-storage/async-storage expo-haptics expo-blur \
  @expo-google-fonts/inter expo-font @expo/vector-icons
```

> **Note:** the chart uses `react-native-svg` gradient fills and `expo-linear-gradient` so it runs in **Expo Go** without a custom dev build.

---

## 🧠 How It Works

1. **Search** — the user types a query; the app debounces input and calls `/mf/search?q=...`, rendering results in a `FlatList`.
2. **Detail** — tapping a fund fetches `/mf/{schemeCode}`; the app parses the `data` array (string NAVs + `DD-MM-YYYY` dates), shows the latest NAV and fund metadata, and feeds the history into the NAV chart.
3. **Watchlist** — the star button writes the fund into `FavoritesContext`, which mirrors the list to `AsyncStorage` so it survives app restarts.
4. **Theming** — `ThemeContext` exposes color tokens that every component reads, giving consistent light/dark styling.

---

## 🧩 Key Learnings & Highlights

- Consuming a **real-world REST API** with proper loading/error/empty handling
- Parsing and transforming **messy external data** (string NAVs, non-ISO dates) for charts
- **Client-side persistence** with `AsyncStorage` and a Context-based store
- Rendering **performant long lists** with `FlatList` + debounced search
- Building a **themeable, accessible UI** that works in light and dark mode

> _My native-Android background (declarative UI with Jetpack Compose) mapped directly onto React Native's component + hooks model — same unidirectional data flow, different syntax._

---

## 🔭 Future Enhancements

- ⚡ **Real-time NAV/price updates over WebSockets** for live tracking
- 📉 Compare multiple funds on a single chart
- 🗂️ Filter/sort by category, fund house, or returns
- 🔔 Price-target **push notifications** (Expo Notifications)
- ☁️ Cloud-synced watchlist with authentication (Supabase/Firebase)
- 📊 Computed returns (1M / 6M / 1Y / 3Y) from NAV history

---

## 📄 License

Released under the **MIT License** — see [`LICENSE`](LICENSE).

---

## 👤 Author

**Mohit Anuragi**
[GitHub](https://github.com/<your-username>) · [LinkedIn](https://linkedin.com/in/<your-handle>) · [Play Store](https://play.google.com/store/apps/dev?id=<your-dev-id>)

> Data courtesy of [MFAPI.in](https://www.mfapi.in/) (sourced from AMFI). This app is for educational/demonstration purposes and is not investment advice.
