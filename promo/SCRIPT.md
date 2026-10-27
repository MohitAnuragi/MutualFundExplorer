# 🎬 Mutual Fund Explorer — UGC Promo Video

**Format:** 9:16 vertical (1080 × 1920) · **Length:** ~50s · **Target:** young Indian investors (Reels / Shorts / WhatsApp)
**Voice:** calm, warm Hinglish finance-explainer (AI TTS — Gemini, voice *Charon*)
**Music:** original royalty-free ambient bed (synthesized) · **Captions:** burned-in kinetic Hinglish

> File: `promo/Mutual_Fund_Explorer_promo_1080x1920.mp4`

---

## 🎙️ Voiceover script (Hinglish)

| # | Timecode | Narration (spoken) | On-screen caption |
|---|----------|--------------------|-------------------|
| 1 | 0.5s | *Mutual funds mein invest to karna hai, par samajh nahi aata kaunsa fund sahi hai?* | (Hook title card) |
| 2 | 6.8s | *Miliye — Mutual Fund Explorer se.* | Miliye — **Mutual Fund Explorer** |
| 3 | 11.1s | *Hazaaron Indian mutual funds. Bas naam type kijiye, aur seconds mein results.* | Hazaaron Indian funds → type kijiye → results ⚡ |
| 4 | 17.1s | *Kisi bhi fund ko kholiye. Live NAV ke saath, uska poora performance chart.* | Koi bhi fund kholiye · Live NAV + performance chart |
| 5 | 23.5s | *Dekhiye fund ne kaisa perform kiya. Ek mahina, chhe mahine, ya pura saal.* | Fund ne kaisa perform kiya? · 1M · 6M · 1Y |
| 6 | 30.6s | *Pasand aaya koi fund? Star dabaiye, aur wo add ho jaata hai aapki watchlist mein.* | Pasand aaya? Star dabaiye ⭐ · Add to Watchlist ✓ |
| 7 | 36.4s | *Aapki watchlist hamesha save rehti hai. Light mode ho ya dark mode.* | Watchlist hamesha save · Light ya Dark mode 🌙 |
| 8 | 42.2s | *Mutual Fund Explorer. Samajhdaari se invest karne ki shuruaat. Aaj hi try kijiye.* | Mutual Fund Explorer · Samajhdaari se invest kijiye · Aaj hi try kijiye 🚀 |

---

## 🎞️ Scene breakdown (visual)

1. **Hook (0–6s)** — Deep-indigo gradient, floating "Large Cap? / Small Cap? / ELSS ya Flexi?" pills, big kinetic question. *The relatable confusion.*
2. **Brand reveal (6–11s)** — App icon + wordmark; phone rises into frame showing the Explore screen.
3. **Search (11–17s)** — Search bar types *"SBI Bluechip Fund"*; result cards stagger in — fund name, AMC chip, NAV, ▲/▼ change badge, sparkline.
4. **Fund Detail (17–23s)** — Tap → detail screen. Hero NAV **counts up to ₹92.15**, gradient area chart **draws in**.
5. **Ranges (23–30s)** — Segmented control slides 1M → 6M → 1Y → All; chart re-animates; Low/High/Current stat tiles update.
6. **Watchlist add (30–36s)** — Star **pops**, CTA flips to green **"Watching ✓"**, confetti burst; push to Watchlist with portfolio summary.
7. **Theme (36–42s)** — Theme toggle crossfades the whole UI **light → dark**.
8. **CTA / outro (42–50s)** — App icon, *Mutual Fund Explorer*, tagline *Track karo · Samjho · Invest karo*, **Try it today**, disclaimer.

---

## 🛠️ How it was built (reproducible)

- **Visuals:** a pixel-accurate recreation of the real app (exact `src/theme/colors.js` tokens, Inter font, real component layout) authored as a single deterministic HTML renderer — every animation is a pure function of time, captured frame-by-frame at 30fps via headless Chrome (Playwright).
- **Voice:** Gemini `gemini-2.5-flash-preview-tts` (voice *Charon*), 8 Hinglish segments.
- **Music:** original ambient I–V–vi–IV pad bed synthesized with NumPy (royalty-free).
- **Mix:** FFmpeg — VO placed on the timeline, music **side-chain ducked** under the voice, loudness-normalised to −15 LUFS.
- **Encode:** H.264, yuv420p, CRF 18, `+faststart` (social-ready).

### Rebuild / tweak
Source + scripts live in the session scratchpad. To change the **voice**, re-run TTS with a different `voice` in `narration.json` (e.g. `Sulafat`, `Algieba`, `Vindemiatrix`). To change **copy**, edit the segment text + captions and re-render.

> ⚠️ Disclaimer shown on-screen: *Data by MFAPI.in (AMFI) · For educational use · Not investment advice.* Keep this for any public posting.
