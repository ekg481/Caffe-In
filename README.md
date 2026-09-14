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
- Responsive to ~390px, honours `prefers-reduced-motion`, keyboard accessible.

## Deploying

Any static host works. For GitHub Pages: Settings → Pages → deploy from the
branch root.
