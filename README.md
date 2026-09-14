# Caffe In Coffee Co

Website for Caffe In Coffee Co — 5642 E La Palma Ave #112, Anaheim, CA 92807.

Static, no build step, no dependencies. Open `index.html` or serve the folder.

```
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Layout

```
index.html              markup
assets/css/styles.css   styles (light + dark themes)
assets/js/config.js     ALL content — hours, menu, gallery, prices
assets/js/main.js       interactions
assets/fonts/           Rubik (self-hosted, OFL)
```

Everything you'd want to change day to day lives in `assets/js/config.js`.

## Before this goes live

The address and opening hours came off the shop's own signage and are correct.
Some of the rest is placeholder and needs a pass — every item is flagged with a
`⚠️` comment in `config.js`:

- **Menu** — the item names, descriptions and prices in `MENU` are plausible
  samples, not the real menu. Replace them.
- **Build a Cup** — the add-on prices in `BUILDER` are samples too.
- **Gallery captions** — the three real photos have deliberately neutral
  captions. Rewrite them to describe what each photo actually shows.
- **Phone / email / Instagram** — blank in `CAFE`. Fill any of them in and the
  matching link appears in the Visit section on its own; leave one blank and it
  stays hidden.

There is also a "Sample pricing — check the board in store" note under the order
total. Remove it once the prices are real.

## Type

The site is set in **Rubik**, matched to the lettering on the shop's own sign.
It is self-hosted from `assets/fonts/` — one variable file covering weights
300–900, ~55 KB — so the page requests nothing from Google and the type is
painted on first render. Rubik is under the SIL Open Font License; the licence
travels with it in `assets/fonts/OFL.txt` and must stay there.

To try a different face, change one line in `styles.css`:

```css
--font-display: 'Rubik', 'Trebuchet MS', system-ui, sans-serif;
--font-body:    'Rubik', system-ui, -apple-system, 'Segoe UI', sans-serif;
```

The next-closest matches to the sign are Figtree, Work Sans and Public Sans.

## Photos

The three shop photos load from Google's CDN (the URLs in `PHOTOS`). If one of
those URLs ever stops resolving, that tile falls back to a drawn illustration
rather than a broken image, so the page never looks broken.

To self-host instead, drop the files in `assets/img/` and point `PHOTOS` at them.

## What the page does

- **Open / Closed pill** computed from `CAFE.hours` in the shop's own timezone,
  so it is right for the shop rather than for the visitor's timezone. Warns when
  closing is within 30 minutes, and says when the shop opens next.
- **Menu** filtered by category, by hot/iced, and by free-text search. Prices
  follow the hot/iced switch.
- **Gallery** with filters and a keyboard-navigable lightbox (arrows, Escape).
- **Build a Cup** — base, size, milk, syrups and extras with a live running
  total and a copy-to-clipboard summary. Cold Brew disables the Hot option.
- **Directions** and **Copy address** buttons, plus an hours table with today
  highlighted.
- Light and dark themes, remembered per visitor; follows the system setting
  until the visitor picks one.
- Honours `prefers-reduced-motion`, keyboard accessible.

## iOS / Safari

Laid out and checked at real iPhone viewports — 320, 375, 390 and 430 wide plus
landscape — with no horizontal scroll at any of them, and every control at a
~44px touch target. Specific WebKit handling:

- `color-mix()` (Safari 16.2+) has a plain-colour fallback on every use, so
  older iPhones get flat colours instead of a dropped declaration.
- `backdrop-filter` carries its `-webkit-` prefix.
- The lightbox is sized in `dvh` with a `vh` fallback, because `vh` on iOS
  counts the browser chrome and hides content behind the toolbars.
- The search field is 16px, under which iOS zooms the page on focus.
- `overflow-x: hidden` is off the body — in WebKit it silently breaks
  `position: sticky` on the nav. Nothing overflows, so it is not needed.
- `:hover` effects are switched off under `@media (hover: none)`; on a touch
  screen hover latches after a tap and freezes the lift on whatever was
  touched last.
- The lightbox pins the body and restores the exact scroll position on close —
  `overflow: hidden` alone does not stop iOS rubber-banding behind an overlay.
- Copy-to-clipboard falls back to a Range-based selection, which is the only
  form iOS accepts when the async Clipboard API is unavailable.

Caveat: the browser here is Chromium, so these are WebKit fixes made by review
and verified for layout and behaviour at iPhone sizes — not a run on real iOS
Safari. Worth a quick look on an actual iPhone before you point customers at
it.

## Deploying

### Netlify Drop (no account needed to start)

1. Go to <https://app.netlify.com/drop>.
2. Drag this folder onto the page — or drag a zip whose **root** is
   `index.html` (not a folder containing it, or the site lands one level down).
3. It goes live in a few seconds on a random `*.netlify.app` URL. Claim the
   site to keep it, rename it, or attach a domain.

To update later, drag the folder in again on the site's **Deploys** tab. Or
link this Git repo under *Site configuration → Build & deploy* — there is no
build step, so leave the build command empty and the publish directory as `.`.

`netlify.toml` sets the caching and security headers and needs no edits. Two
notes:

- CSS and JS are deliberately **not** cached hard, because their filenames are
  not content-hashed — an edit shows up on the next load. The fonts get a
  one-year immutable cache.
- The `Content-Security-Policy` allows images from
  `lh3.googleusercontent.com`, which is where the shop photos come from. If you
  move to self-hosted photos, drop that host from the policy.

### Anywhere else

Any static host works — it is plain files with no build step. For GitHub Pages:
Settings → Pages → deploy from the branch root.
