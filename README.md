<div align="center">

# Mutual Fund Explorer

**Search, explore, and track Indian mutual funds — live NAV, historical charts, and a personal watchlist.**

A cross-platform app built with React Native (Expo), running on **iOS, Android, and the Web** from a single codebase.

<p>
  <img alt="Expo" src="https://img.shields.io/badge/Expo-SDK%2058-000020?logo=expo&logoColor=white">
  <img alt="React Native" src="https://img.shields.io/badge/React%20Native-0.88-61DAFB?logo=react&logoColor=white">
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black">
  <img alt="Platform" src="https://img.shields.io/badge/platform-iOS%20%7C%20Android%20%7C%20Web-lightgrey">
  <img alt="License" src="https://img.shields.io/badge/license-MIT-green">
</p>

<!-- After deploying (see Deployment below), replace the # with your live URL -->
[**Live Demo**](#) · [**Report an issue**](https://github.com/MohitAnuragi/MutualFundExplorer/issues)

</div>

---

## Overview

Mutual Fund Explorer helps users discover Indian mutual funds and keep an eye on the ones they care about. Search across thousands of AMFI-registered funds, open any fund to see its latest Net Asset Value (NAV) and a chart of how it has moved over time, and star funds to build a personal watchlist that survives app restarts.

Data is sourced in real time from the free, public [**MFAPI.in**](https://www.mfapi.in/) service (backed by AMFI) — no API key required.

> Built as a focused demonstration of React Native fundamentals: API-driven lists, navigation, charts, local persistence, and a clean, themeable UI.

## Features

- **Fund search** — find thousands of Indian mutual funds by name, in real time, with debounced input.
- **Fund detail** — latest NAV, fund house, scheme type and category, and last-updated date.
- **NAV history chart** — interactive line chart with gradient fill and selectable ranges (1M / 6M / 1Y / All).
- **Watchlist** — star and unstar funds; favorites persist locally via `AsyncStorage`.
- **Pull-to-refresh** — fetch the latest NAV on demand.
- **Light & dark mode** — adapts to the device theme.
- **Robust network states** — explicit loading, empty, and error handling on every screen.
- **Smooth motion** — reanimated-powered transitions, count-up values, and micro-interactions (respecting reduce-motion).

## Screenshots

> Add images to a `docs/screenshots/` folder and reference them below.

| Search | Fund Detail | Watchlist |
|:--:|:--:|:--:|
| _add screenshot_ | _add screenshot_ | _add screenshot_ |

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React Native 0.88 · Expo SDK 58 |
| **Language** | JavaScript (ES2022) |
| **Navigation** | React Navigation 7 (Native Stack + Bottom Tabs) |
| **Networking** | `fetch` against MFAPI REST endpoints (timeouts + typed errors) |
| **Charts** | `react-native-gifted-charts` + `react-native-svg` (gradient area fills) |
| **Animation** | `react-native-reanimated` 4 + `react-native-gesture-handler` |
| **Effects** | `expo-linear-gradient`, `expo-haptics`, `expo-blur` |
| **Fonts** | Inter via `@expo-google-fonts/inter` |
| **Storage** | `@react-native-async-storage/async-storage` |
| **State** | React Hooks + Context (`ThemeContext`, `FavoritesContext`) |
| **Web** | `react-native-web` (static export) |

## Getting Started

### Prerequisites

- **Node.js 18+** and npm
- The **Expo Go** app on your phone (iOS/Android), or an emulator/simulator

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/MohitAnuragi/MutualFundExplorer.git
cd MutualFundExplorer

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
```

Then scan the QR code with **Expo Go** (Android) or the **Camera** app (iOS). Or press `a` for an Android emulator, `i` for the iOS simulator, or `w` to open the app in your browser.

## Deployment (Web)

The app also runs in the browser via `react-native-web` and exports to a static site you can host for free.

```bash
npx expo export --platform web   # outputs the static site to dist/
```

Host the `dist/` folder on **Vercel** or **Netlify** (both free) — config files for each (`vercel.json`, `netlify.toml`) are already included, so importing the GitHub repo and clicking **Deploy** is all it takes. See [`DEPLOY.md`](DEPLOY.md) for step-by-step instructions.

## API Reference — [MFAPI.in](https://www.mfapi.in/)

All endpoints are public `GET` requests; no API key required.

| Purpose | Endpoint |
|---|---|
| Search funds | `GET https://api.mfapi.in/mf/search?q={query}` |
| Fund details + NAV history | `GET https://api.mfapi.in/mf/{schemeCode}` |
| Latest NAV only | `GET https://api.mfapi.in/mf/{schemeCode}/latest` |

<details>
<summary>Sample response — <code>/mf/{schemeCode}</code></summary>

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

> **Note:** MFAPI returns dates as `DD-MM-YYYY` and `nav` as a **string** — both are parsed before use.
</details>

## Project Structure

```
MutualFundExplorer/
├── App.js                      # Entry: providers + navigation + fonts
├── app.json                    # Expo configuration
├── babel.config.js             # babel-preset-expo (Reanimated/Worklets)
├── vercel.json / netlify.toml  # Web deploy configs
└── src/
    ├── api/mfApi.js            # MFAPI client: timeouts, typed errors, cache
    ├── components/             # Reusable UI kit (Card, Chip, NavChart, StarButton, …)
    ├── context/                # FavoritesContext (watchlist + persistence)
    ├── theme/                  # Color tokens, typography, spacing, ThemeContext
    ├── hooks/                  # useDebounce, useReduceMotion, useAppFonts
    ├── navigation/             # RootNavigator + custom animated TabBar
    ├── screens/                # Search, FundDetail, Watchlist
    └── utils/                  # Date/NAV parsing, ranges, stats
```

## How It Works

1. **Search** — the query is debounced and sent to `/mf/search?q=...`; results render in a `FlatList`.
2. **Detail** — tapping a fund fetches `/mf/{schemeCode}`; the app parses the NAV history (string NAVs, `DD-MM-YYYY` dates), shows the latest NAV and metadata, and feeds the series into the chart.
3. **Watchlist** — the star button writes to `FavoritesContext`, which mirrors the list to `AsyncStorage` so it survives restarts.
4. **Theming** — `ThemeContext` exposes color tokens every component reads, giving consistent light/dark styling.

## Roadmap

- Compare multiple funds on a single chart
- Filter and sort by category, fund house, or returns
- Computed returns (1M / 6M / 1Y / 3Y) from NAV history
- Price-target notifications
- Cloud-synced watchlist with authentication

## License

Released under the **MIT License** — see [`LICENSE`](LICENSE).

## Author

**Mohit Anuragi** — [GitHub](https://github.com/MohitAnuragi)

---

<sub>Data courtesy of [MFAPI.in](https://www.mfapi.in/) (sourced from AMFI). This project is for educational and demonstration purposes only and is not investment advice.</sub>
