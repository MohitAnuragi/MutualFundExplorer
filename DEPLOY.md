# 🚀 Deploying the Web Demo

The app also runs on the web (via `react-native-web`). This produces a static
site you can host for free and link on your resume.

The web build is a static folder (`dist/`) created by:

```bash
npx expo export --platform web
```

You can host that folder on **Vercel** or **Netlify** (both free). Config files
for both are already in the repo (`vercel.json`, `netlify.toml`).

---

## Option A — Vercel (recommended, fastest)

### A1. From the CLI (no GitHub needed)
```bash
npm i -g vercel        # one-time
vercel login           # opens browser, sign in (free)
vercel                 # answer the prompts; accept defaults
vercel --prod          # promote to the production URL
```
Vercel reads `vercel.json`, runs `expo export --platform web`, and serves `dist/`.
You get a URL like `https://mutual-fund-explorer.vercel.app`.

### A2. From GitHub (auto-deploy on every push)
1. Push this repo to GitHub (see "Git setup" below).
2. Go to https://vercel.com → **Add New → Project** → import the repo.
3. Vercel detects `vercel.json` automatically. Click **Deploy**.
4. Every future `git push` re-deploys.

---

## Option B — Netlify

### B1. From the CLI
```bash
npm i -g netlify-cli   # one-time
netlify login          # opens browser, sign in (free)
netlify deploy --build # preview URL
netlify deploy --build --prod   # production URL
```

### B2. From GitHub
1. Push to GitHub.
2. https://app.netlify.com → **Add new site → Import an existing project**.
3. Pick the repo. Netlify reads `netlify.toml` (build command + publish dir).
4. **Deploy site.**

---

## Git setup (if not already a repo)

```bash
cd "D:/Resume/Mutual Fund Explorer"
git init
git add .
git commit -m "Mutual Fund Explorer: React Native (Expo) app"
# create an empty repo on GitHub first, then:
git remote add origin https://github.com/<you>/MutualFundExplorer.git
git branch -M main
git push -u origin main
```

> `dist/` and `node_modules/` are gitignored — the host rebuilds them.

---

## Notes / caveats for the web build

- **Haptics** (vibration) are a no-op on web — expected; they work on the phone.
- **Charts, gradients, animations, theming, search, watchlist** all work on web
  (verified via `react-native-svg`).
- The web bundle is ~2.8 MB (first load); fine for a demo.
- Put the live URL in your README and resume, e.g.
  **Live demo:** `https://<your-app>.vercel.app`

---

## Test the web build locally before deploying

```bash
npx expo export --platform web
npx serve dist           # or: python -m http.server 4173 --directory dist
# open http://localhost:4173
```
