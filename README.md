# X Profile Value Generator

A fun, entirely client-side entertainment app: upload your X (Twitter) profile
picture and get a fictional digital valuation — a dollar value, rarity tier,
profile personality, degen level, and three flavor scores (Digital Aura, Meme
Energy, Timeline Power). Nothing is real — it's built purely for laughs and
sharing.

## How the "value" is generated

There's no backend, no AI model, and no real analysis. The uploaded image's
raw bytes are hashed (FNV-1a) into a seed, which feeds a seeded PRNG
(mulberry32). That means:

- The same image file always produces the exact same result, every time.
- Different images produce different, well-distributed results across all
  categories (value, rarity, personality, degen level, and scores).
- Everything runs instantly in the browser — nothing is uploaded anywhere.

## Tech stack

- React 18 + Vite
- Tailwind CSS
- Framer Motion (animations)
- Lucide React (icons)

No backend, no database, no auth — 100% static, deployable anywhere.

## Folder structure

```
x-profile-value-generator/
├── index.html                  # SEO + Open Graph + Twitter card metadata
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── public/
│   ├── og-image.png            # Open Graph / Twitter share image (1200x630)
│   ├── favicon.svg
│   └── apple-touch-icon.png
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── components/
    │   ├── Navbar.jsx
    │   ├── HeroSection.jsx
    │   ├── ImageUploader.jsx
    │   ├── GenerateButton.jsx
    │   ├── LoadingAnimation.jsx
    │   ├── ValueCard.jsx
    │   ├── ScoreBadge.jsx
    │   ├── ShareButton.jsx
    │   └── DownloadButton.jsx
    └── utils/
        ├── valueGenerator.js    # deterministic hashing + value/rarity/personality generation
        └── canvasCard.js        # renders the downloadable collectible PNG card
```

## Run it locally

Requires Node.js 18+.

```bash
npm install
npm run dev
```

Vite will print a local URL (usually `http://localhost:5173`) — open it in
your browser.

### Build for production

```bash
npm run build
```

The static output lands in `dist/`. Optionally preview that build locally
before deploying:

```bash
npm run preview
```

## Deploy to Vercel

**Option A — Vercel CLI**

```bash
npm install -g vercel
vercel
```

Follow the prompts. Vercel auto-detects the Vite framework preset
(build command `npm run build`, output directory `dist`) — no extra config
needed.

**Option B — Git + Vercel dashboard**

1. Push this project to a GitHub/GitLab/Bitbucket repo.
2. In the Vercel dashboard, click **Add New → Project** and import the repo.
3. Framework preset: **Vite** (auto-detected).
   - Build command: `npm run build`
   - Output directory: `dist`
4. Click **Deploy**.

That's it — no environment variables, no backend services, no database
required.

### After deploying

Update these two placeholders to your real deployed URL so link previews
(Open Graph / Twitter cards) resolve correctly when people share results:

- `index.html` — `<link rel="canonical">`, `og:url`, `og:image`,
  `twitter:image`
- Everything else (the "Share on X" link, the downloadable card's footer
  label) already picks up the live domain automatically at runtime via
  `window.location`, so no code changes are needed for those.

## Notes

- All processing (image hashing, canvas rendering for downloads) happens
  entirely client-side. Uploaded images never leave the browser.
- The "Download Result Card" button renders a collectible-style card on an
  in-memory `<canvas>` and downloads it as a PNG — no screenshot library
  required.
- The value, rarity, personality, degen level, and scores are fictional and
  for entertainment only.
