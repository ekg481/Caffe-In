/* =============================================================================
   CAFFE IN COFFEE CO — SITE CONTENT
   -----------------------------------------------------------------------------
   Everything that is text, price, or photo lives in this one file so the site
   can be updated without touching markup or logic.

   ⚠️  PLACEHOLDER CONTENT — review before going live:
       • MENU item names, descriptions and PRICES are sensible samples, not the
         shop's real menu. Replace them with the actual menu.
       • BUILDER add-on prices are samples too.
       • CAFE.phone / CAFE.email / CAFE.instagram are blank. Fill them in and the
         matching buttons appear automatically; leave blank and they stay hidden.
       • GALLERY captions are deliberately neutral — rewrite them to describe
         what each photo actually shows.

   ✅ VERIFIED CONTENT (from the shop's own signage):
       • Name, street address, and opening hours.
   ========================================================================== */

const CAFE = {
  name: 'Caffe In',
  fullName: 'Caffe In Coffee Co',
  tagline: 'Small-batch coffee, poured with care in Anaheim Hills.',

  address: {
    line1: '5642 E La Palma Ave #112',
    line2: 'Anaheim, CA 92807'
  },

  // Used for the live "Open now / Closed" pill so it is correct for the shop,
  // not for whatever timezone the visitor happens to be in.
  timezone: 'America/Los_Angeles',

  // 0 = Sunday … 6 = Saturday. Times are minutes from midnight.
  // Monday–Friday 6:30am–5:00pm, Saturday–Sunday 8:00am–5:00pm.
  hours: [
    { day: 'Sunday',    open: 8 * 60,          close: 17 * 60 },
    { day: 'Monday',    open: 6 * 60 + 30,     close: 17 * 60 },
    { day: 'Tuesday',   open: 6 * 60 + 30,     close: 17 * 60 },
    { day: 'Wednesday', open: 6 * 60 + 30,     close: 17 * 60 },
    { day: 'Thursday',  open: 6 * 60 + 30,     close: 17 * 60 },
    { day: 'Friday',    open: 6 * 60 + 30,     close: 17 * 60 },
    { day: 'Saturday',  open: 8 * 60,          close: 17 * 60 }
  ],

  // TODO: fill these in — each one reveals its button in the nav / Visit section.
  phone: '',
  email: '',
  instagram: ''
};

/* -----------------------------------------------------------------------------
   PHOTOS
   These are the shop's public Google listing photos, loaded straight from
   Google's CDN. If a URL ever stops resolving the card falls back to a drawn
   illustration instead of a broken image, so nothing on the page breaks.
   To self-host instead: drop the files in assets/img/ and swap the `src`.
-------------------------------------------------------------------------------*/
const PHOTOS = {
  one: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkWRCvUqR-ibGFb4WUOBYOuIy0VNPP6q95kkeQFMmQtDJMr-0A_nmYBBKHssp3u2sf63nx9z6b4v4fl3dweQrUzUjzIq4lFNEreag_a_8-pJDDXjTsxrMe8bco_1LN__3O5g1oT=s1360-w1360-h1020-rw',
  two: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnDPDIr6bAwWPZtRWZvipviYuyj-_NPjJWKOT_mnd9CgcW-JtcBfTkacXk42lQ2fjcBOMFFqKQJ1xrR41kB5W6glBBZSTT_d-ld8BzdUpX5OJY1pQ74I3K7o7y64IK_xhjM2oFLysN9JkE=s1360-w1360-h1020-rw',
  three: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkcSMz9jeVV4WaKLBjYF0OvjdYR2LIPiR7JAiHIvD4lvgt5fya57horM3ko7o9zIiI5zvc8cYDfJS5ke3Vc3GRBnVjibjQacLFjjJrSxY2Iz7n_sy8UZayqUuVWaqAn3ubTHG1zncpiNYF4=s1360-w1360-h1020-rw'
};

/* -----------------------------------------------------------------------------
   MENU  ⚠️ PLACEHOLDER — replace names, descriptions and prices with the real ones.

   temps : which temperatures the drink is served at. The Hot/Iced switch filters
           on this, and `price` is keyed by the same words.
   art   : colour stops used to draw the little cup illustration, poured top to
           bottom. Two or three colours work best.
-------------------------------------------------------------------------------*/
const MENU = [
  // ---- Espresso ----------------------------------------------------------
  { cat: 'espresso', name: 'Espresso',    desc: 'Two ounces, pulled to order. Nothing to hide behind.', temps: ['hot'],          price: { hot: 3.25 },              art: ['#4a2c17', '#2a170c'] },
  { cat: 'espresso', name: 'Macchiato',   desc: 'Espresso marked with a spoonful of dense foam.',       temps: ['hot'],          price: { hot: 3.75 },              art: ['#f0e2cd', '#5a3a20', '#2f1b0e'] },
  { cat: 'espresso', name: 'Cortado',     desc: 'Equal parts espresso and steamed milk. Balanced.',     temps: ['hot'],          price: { hot: 4.50 },              art: ['#e3c9a6', '#8a5a32'] },
  { cat: 'espresso', name: 'Cappuccino',  desc: 'Espresso under a thick, velvety cap of foam.',         temps: ['hot'],          price: { hot: 4.75 },              art: ['#f6ecd9', '#c99a63', '#6b4322'] },
  { cat: 'espresso', name: 'Latte',       desc: 'Silky steamed milk, a clean pour, a soft finish.',     temps: ['hot', 'iced'],  price: { hot: 5.00, iced: 5.50 },  art: ['#efdcc0', '#b07f4c'] },
  { cat: 'espresso', name: 'Flat White',  desc: 'Ristretto shots and microfoam. Dense and sweet.',      temps: ['hot'],          price: { hot: 5.25 },              art: ['#e8d3b2', '#9a6a3c'] },
  { cat: 'espresso', name: 'Mocha',       desc: 'Dark chocolate stirred through espresso and milk.',    temps: ['hot', 'iced'],  price: { hot: 5.75, iced: 6.00 },  art: ['#e6cfae', '#7a4a28', '#38200f'] },
  { cat: 'espresso', name: 'Americano',   desc: 'Espresso lengthened with hot water. Crema intact.',    temps: ['hot', 'iced'],  price: { hot: 4.00, iced: 4.50 },  art: ['#6b4123', '#301b0d'] },

  // ---- Brewed ------------------------------------------------------------
  { cat: 'brew', name: 'Drip Coffee',     desc: 'The house blend, brewed fresh through the day.',       temps: ['hot'],          price: { hot: 3.25 },              art: ['#7a4a26', '#3a2110'] },
  { cat: 'brew', name: 'Pour Over',       desc: 'Single origin, ground and brewed one cup at a time.',  temps: ['hot'],          price: { hot: 5.50 },              art: ['#9a6236', '#4a2a14'] },
  { cat: 'brew', name: 'Cold Brew',       desc: 'Steeped sixteen hours. Low acid, deep and smooth.',    temps: ['iced'],         price: { iced: 5.25 },             art: ['#5c3418', '#2a1409'] },
  { cat: 'brew', name: 'Nitro Cold Brew', desc: 'Cold brew on nitro — cascading, creamy, unsweetened.', temps: ['iced'],         price: { iced: 6.25 },             art: ['#c9a179', '#4a2a13', '#201006'] },

  // ---- Not coffee --------------------------------------------------------
  { cat: 'other', name: 'Matcha Latte',       desc: 'Ceremonial grade matcha whisked with milk.',       temps: ['hot', 'iced'],  price: { hot: 5.75, iced: 6.00 },  art: ['#f2e6cc', '#7fa85a', '#3f6b2c'] },
  { cat: 'other', name: 'Chai Latte',         desc: 'Black tea, cardamom, clove and ginger.',           temps: ['hot', 'iced'],  price: { hot: 5.25, iced: 5.50 },  art: ['#efdcbc', '#c08a4e', '#7a4a24'] },
  { cat: 'other', name: 'Hot Chocolate',      desc: 'Real chocolate, melted into steamed milk.',        temps: ['hot'],          price: { hot: 4.75 },              art: ['#f4e8d3', '#6b3d20', '#33190c'] },
  { cat: 'other', name: 'London Fog',         desc: 'Earl Grey, vanilla and steamed milk.',             temps: ['hot', 'iced'],  price: { hot: 5.00, iced: 5.25 },  art: ['#f3e6d0', '#b79a7a', '#6f5a44'] },
  { cat: 'other', name: 'Strawberry Refresher', desc: 'Cold, bright and not too sweet.',                temps: ['iced'],         price: { iced: 5.50 },             art: ['#f7c9c1', '#d9524c'] },
  { cat: 'other', name: 'Hot Tea',            desc: 'Loose leaf, steeped to order. Ask what is on.',    temps: ['hot'],          price: { hot: 3.50 },              art: ['#e9d9ae', '#b8893c'] },

  // ---- Kitchen -----------------------------------------------------------
  { cat: 'food', name: 'Butter Croissant',   desc: 'Laminated, baked each morning.',                    temps: [],  price: { any: 4.25 },  art: ['#f0cf94', '#c18b41'] },
  { cat: 'food', name: 'Bagel & Schmear',    desc: 'Toasted, with plain or scallion cream cheese.',     temps: [],  price: { any: 4.75 },  art: ['#f4e3c2', '#cda265'] },
  { cat: 'food', name: 'Avocado Toast',      desc: 'Sourdough, lemon, chili flake, flaky salt.',        temps: [],  price: { any: 9.50 },  art: ['#dfe9bd', '#8fae5c', '#c99a5e'] },
  { cat: 'food', name: 'Breakfast Burrito',  desc: 'Egg, potato, cheese. Wrapped tight, served hot.',   temps: [],  price: { any: 10.50 }, art: ['#f2e2c4', '#d8b071'] },
  { cat: 'food', name: 'Blueberry Muffin',   desc: 'Baked in house, still warm if you are early.',      temps: [],  price: { any: 4.00 },  art: ['#e8d2a8', '#8a7fb0'] },
  { cat: 'food', name: 'Banana Bread',       desc: 'Dense, dark and lightly toasted on request.',       temps: [],  price: { any: 4.25 },  art: ['#e4c795', '#9a6b38'] }
];

const MENU_CATEGORIES = [
  { id: 'all',      label: 'Everything' },
  { id: 'espresso', label: 'Espresso' },
  { id: 'brew',     label: 'Brewed' },
  { id: 'other',    label: 'Not Coffee' },
  { id: 'food',     label: 'Kitchen' }
];

/* -----------------------------------------------------------------------------
   GALLERY
   `src` items are real photos of the shop. `art` items are drawn in CSS, so the
   grid stays full and handsome even if a photo fails to load.
   ⚠️ Captions on the photos are intentionally neutral — rewrite them once you
      know which photo is which.
-------------------------------------------------------------------------------*/
const GALLERY = [
  { type: 'photo', src: PHOTOS.one,   tag: 'shop',    caption: 'Caffe In Coffee Co',     sub: 'Anaheim Hills' },
  { type: 'art',   art: ['#efdcc0', '#b07f4c'],                   tag: 'espresso', caption: 'Latte',        sub: 'Steamed milk, clean pour' },
  { type: 'photo', src: PHOTOS.two,   tag: 'shop',    caption: 'On the bar',             sub: 'Made to order' },
  { type: 'art',   art: ['#c9a179', '#4a2a13', '#201006'], iced: true, tag: 'cold',  caption: 'Nitro Cold Brew', sub: 'Sixteen hours, on tap' },
  { type: 'art',   art: ['#f2e6cc', '#7fa85a', '#3f6b2c'],         tag: 'espresso', caption: 'Matcha Latte', sub: 'Whisked, never scooped' },
  { type: 'photo', src: PHOTOS.three, tag: 'shop',    caption: '5642 E La Palma Ave',     sub: 'Suite 112' },
  { type: 'art',   art: ['#e6cfae', '#7a4a28', '#38200f'], iced: true, tag: 'cold',  caption: 'Iced Mocha',   sub: 'Dark chocolate, over ice' },
  { type: 'art',   art: ['#f7c9c1', '#d9524c'], iced: true,        tag: 'cold',     caption: 'Strawberry Refresher', sub: 'Cold and bright' },
  { type: 'art',   art: ['#efdcbc', '#c08a4e', '#7a4a24'],         tag: 'espresso', caption: 'Chai Latte',   sub: 'Cardamom and clove' }
];

const GALLERY_FILTERS = [
  { id: 'all',      label: 'All' },
  { id: 'shop',     label: 'The Shop' },
  { id: 'espresso', label: 'Espresso Bar' },
  { id: 'cold',     label: 'Cold' }
];

/* -----------------------------------------------------------------------------
   BUILD YOUR CUP  ⚠️ PLACEHOLDER PRICING — match these to the real till.
-------------------------------------------------------------------------------*/
const BUILDER = {
  bases: [
    { id: 'latte',    name: 'Latte',      base: 5.00, art: ['#efdcc0', '#b07f4c'] },
    { id: 'mocha',    name: 'Mocha',      base: 5.75, art: ['#e6cfae', '#7a4a28', '#38200f'] },
    { id: 'matcha',   name: 'Matcha',     base: 5.75, art: ['#f2e6cc', '#7fa85a', '#3f6b2c'] },
    { id: 'coldbrew', name: 'Cold Brew',  base: 5.25, art: ['#5c3418', '#2a1409'], icedOnly: true },
    { id: 'chai',     name: 'Chai',       base: 5.25, art: ['#efdcbc', '#c08a4e', '#7a4a24'] }
  ],
  sizes: [
    { id: 'sm', name: 'Small',  add: 0.00, oz: '8 oz'  },
    { id: 'md', name: 'Medium', add: 0.75, oz: '12 oz' },
    { id: 'lg', name: 'Large',  add: 1.40, oz: '16 oz' }
  ],
  milks: [
    { id: 'whole',  name: 'Whole',  add: 0.00 },
    { id: 'nonfat', name: 'Nonfat', add: 0.00 },
    { id: 'oat',    name: 'Oat',    add: 0.80 },
    { id: 'almond', name: 'Almond', add: 0.80 },
    { id: 'breve',  name: 'Breve',  add: 1.00 }
  ],
  syrups: [
    { id: 'vanilla',     name: 'Vanilla',     add: 0.60 },
    { id: 'caramel',     name: 'Caramel',     add: 0.60 },
    { id: 'hazelnut',    name: 'Hazelnut',    add: 0.60 },
    { id: 'lavender',    name: 'Lavender',    add: 0.60 },
    { id: 'brownsugar',  name: 'Brown Sugar', add: 0.60 }
  ],
  extraShot: 1.00
};
