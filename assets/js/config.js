/* =============================================================================
   CAFFE IN COFFEE CO — SITE CONTENT
   -----------------------------------------------------------------------------
   Everything that is text, price, or photo lives in this one file.

   SOURCES
     • Name, address and hours — the shop's own signage.
     • MENU — the shop's online ordering page. Names are normalised to title
       case for presentation; prices are exactly as listed.
     • REVIEWS — the shop's Yelp page, quoted verbatim.

   ⚠️  STILL TO DO
     • The ordering page paginates: these are the first 30 items. Pages 2 and 3
       are not in here yet — add them to MENU in the same shape.
     • CAFE.phone / .email / .instagram / .yelp are blank. Fill any of them in
       and the matching link appears on its own; leave it blank and it stays
       hidden.
     • Gallery captions on the photos are neutral — rewrite them to say what
       each photo actually shows.
   ========================================================================== */

const CAFE = {
  name: 'Caffe In',
  fullName: 'Caffe In Coffee Co',
  tagline: 'Small-batch coffee, poured with care in Anaheim Hills.',

  address: {
    line1: '5642 E La Palma Ave #112',
    line2: 'Anaheim, CA 92807'
  },

  // Drives the live "Open now / Closed" pill, evaluated in the shop's own
  // timezone rather than the visitor's.
  timezone: 'America/Los_Angeles',

  // 0 = Sunday … 6 = Saturday. Times are minutes from midnight.
  hours: [
    { day: 'Sunday',    open: 8 * 60,      close: 17 * 60 },
    { day: 'Monday',    open: 6 * 60 + 30, close: 17 * 60 },
    { day: 'Tuesday',   open: 6 * 60 + 30, close: 17 * 60 },
    { day: 'Wednesday', open: 6 * 60 + 30, close: 17 * 60 },
    { day: 'Thursday',  open: 6 * 60 + 30, close: 17 * 60 },
    { day: 'Friday',    open: 6 * 60 + 30, close: 17 * 60 },
    { day: 'Saturday',  open: 8 * 60,      close: 17 * 60 }
  ],

  // TODO: fill these in — each one reveals its own link.
  phone: '',
  email: '',
  instagram: '',
  yelp: ''   // e.g. 'https://www.yelp.com/biz/caffe-in-coffee-co-anaheim'
};

/* -----------------------------------------------------------------------------
   PHOTOS — the shop's public Google listing and Yelp photos, loaded from those
   CDNs. If a URL stops resolving the tile falls back to a drawn illustration,
   so nothing on the page breaks. To self-host: drop files in assets/img/ and
   swap the values below.
-------------------------------------------------------------------------------*/
const PHOTOS = {
  shopOne:   'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkWRCvUqR-ibGFb4WUOBYOuIy0VNPP6q95kkeQFMmQtDJMr-0A_nmYBBKHssp3u2sf63nx9z6b4v4fl3dweQrUzUjzIq4lFNEreag_a_8-pJDDXjTsxrMe8bco_1LN__3O5g1oT=s1360-w1360-h1020-rw',
  shopTwo:   'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnDPDIr6bAwWPZtRWZvipviYuyj-_NPjJWKOT_mnd9CgcW-JtcBfTkacXk42lQ2fjcBOMFFqKQJ1xrR41kB5W6glBBZSTT_d-ld8BzdUpX5OJY1pQ74I3K7o7y64IK_xhjM2oFLysN9JkE=s1360-w1360-h1020-rw',
  shopThree: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkcSMz9jeVV4WaKLBjYF0OvjdYR2LIPiR7JAiHIvD4lvgt5fya57horM3ko7o9zIiI5zvc8cYDfJS5ke3Vc3GRBnVjibjQacLFjjJrSxY2Iz7n_sy8UZayqUuVWaqAn3ubTHG1zncpiNYF4=s1360-w1360-h1020-rw',
  yelpOne:   'https://s3-media0.fl.yelpcdn.com/bphoto/BDOaJKDEsUOpGpV--JXltw/258s.jpg',
  yelpTwo:   'https://s3-media0.fl.yelpcdn.com/bphoto/t1OLnO0xngD9SzPFp5OC_A/258s.jpg'
};

/* -----------------------------------------------------------------------------
   MENU — from the shop's ordering page. Names title-cased for presentation,
   prices exactly as listed. No descriptions: the ordering page carries none,
   and inventing them would put words in the shop's mouth.

   price     : a number, or { from, to } for an item priced as a range.
   art       : colour stops for the drawn cup, poured top to bottom.
   iced      : true only where the item is explicitly listed as an iced drink.
-------------------------------------------------------------------------------*/
const MENU = [
  // ---- Coffee ------------------------------------------------------------
  { cat: 'coffee', name: 'Americano',                price: 4.75, art: ['#6b4123', '#2f1b0d'] },
  { cat: 'coffee', name: 'Latte',                    price: 5.75, art: ['#efdcc0', '#b07f4c'] },
  { cat: 'coffee', name: 'Flat White',               price: 5.50, art: ['#e8d3b2', '#9a6a3c'] },
  { cat: 'coffee', name: 'Spanish Latte',            price: 6.00, art: ['#f2e2c6', '#c08a52', '#7a4a24'] },
  { cat: 'coffee', name: 'Caramel Latte',            price: 6.00, art: ['#f0dcb4', '#c68a3e'] },
  { cat: 'coffee', name: 'White Mocha Latte',        price: 6.00, art: ['#f6ead4', '#cfa470'] },
  { cat: 'coffee', name: 'Honey Latte',              price: 6.00, art: ['#f4e0b0', '#d09a44'] },
  { cat: 'coffee', name: 'Madagascar Vanilla Latte', price: 6.00, art: ['#f6ecd8', '#c49a63'] },
  { cat: 'coffee', name: 'Brown Sugar Oat Latte',    price: 7.00, art: ['#eed7ac', '#a76c32', '#6b4118'] },
  { cat: 'coffee', name: 'Coconut Spice Oat Latte',  price: 7.00, art: ['#f6ecd9', '#c99558'] },
  { cat: 'coffee', name: 'Biscoff Latte',            price: 6.75, art: ['#f2ddb8', '#b9773a', '#7d4a1e'] },
  { cat: 'coffee', name: 'Vanilla Cream Latte',      price: 7.00, art: ['#fbf1dd', '#c9a06a', '#7c5228'] },
  { cat: 'coffee', name: 'Banana Cream Latte',       price: 7.00, art: ['#f8ecc4', '#dcc07a', '#a8763c'] },
  { cat: 'coffee', name: 'Iced Banana Latte',        price: 6.00, art: ['#f6e9bf', '#c69a55'], iced: true },
  { cat: 'coffee', name: 'Strawberry Latte',         price: 6.00, art: ['#f9d8d2', '#d4746a'] },
  { cat: 'coffee', name: 'Sugar Free Vanilla',       price: 5.75, art: ['#f2e4cb', '#b98d5c'] },

  // ---- Cold Brew ---------------------------------------------------------
  { cat: 'coldbrew', name: 'Cold Brew',               price: 5.75, art: ['#5c3418', '#26120a'], iced: true },
  { cat: 'coldbrew', name: 'Maple Cold Brew Latte',   price: 6.25, art: ['#e4c294', '#7d4a20', '#33190b'], iced: true },
  { cat: 'coldbrew', name: 'Vanilla Cream Cold Brew', price: 6.75, art: ['#fbf1dd', '#7a4622', '#2c1509'], iced: true },

  // ---- Matcha ------------------------------------------------------------
  { cat: 'matcha', name: 'Matcha Latte',            price: 6.50, art: ['#f2e6cc', '#7fa85a', '#41702c'] },
  { cat: 'matcha', name: 'Double Matcha',           price: 7.50, art: ['#cfe2a8', '#5f8f36', '#2f5a1c'] },
  { cat: 'matcha', name: 'Strawberry Matcha Latte', price: 7.00, art: ['#f6cfc8', '#e8dcc0', '#6f9b45'] },
  { cat: 'matcha', name: 'Lavender Matcha Latte',   price: 6.50, art: ['#ded0ec', '#8fb063', '#4a7a2e'] },
  { cat: 'matcha', name: 'Banana Cream Matcha',     price: 7.50, art: ['#f8eec6', '#b9c777', '#4f8030'] },
  { cat: 'matcha', name: 'Matcha Cream Strawberry', price: 7.50, art: ['#fbf1e0', '#f0b9ae', '#6f9b45'] },
  { cat: 'matcha', name: 'Matcha Einspanner',       price: 7.50, art: ['#fdf6e6', '#9dbd6f', '#3f6b2c'] },

  // ---- Tea & More --------------------------------------------------------
  { cat: 'more', name: 'Hojicha',        price: 6.50, art: ['#f0ddbe', '#a9703c', '#5e3a1c'] },
  { cat: 'more', name: 'Ube Einspanner', price: 7.00, art: ['#fdf6e6', '#b294d6', '#6d4a9c'] },

  // ---- Kitchen -----------------------------------------------------------
  { cat: 'kitchen', name: 'Pastries', price: { from: 5.00, to: 5.75 }, art: ['#f0cf94', '#c18b41'] },
  { cat: 'kitchen', name: 'Bagel',    price: 4.50,                     art: ['#f4e3c2', '#cda265'] }
];

const MENU_CATEGORIES = [
  { id: 'all',      label: 'Everything' },
  { id: 'coffee',   label: 'Coffee' },
  { id: 'coldbrew', label: 'Cold Brew' },
  { id: 'matcha',   label: 'Matcha' },
  { id: 'more',     label: 'Tea & More' },
  { id: 'kitchen',  label: 'Kitchen' }
];

/* -----------------------------------------------------------------------------
   GALLERY
   `photo` entries are the shop's real photos; `art` entries are drawn in CSS
   from the menu's own drinks, so the grid stays full and handsome even if a
   photo host stops serving.
   ⚠️ The photo captions are neutral — rewrite them to describe what each shows.
-------------------------------------------------------------------------------*/
const GALLERY = [
  { type: 'photo', src: PHOTOS.shopOne,   tag: 'shop',   caption: 'Caffe In Coffee Co', sub: 'Anaheim Hills' },
  { type: 'art',   art: ['#f2e6cc', '#7fa85a', '#41702c'],           tag: 'matcha', caption: 'Matcha Latte',        sub: '$6.50' },
  { type: 'photo', src: PHOTOS.yelpOne,   tag: 'shop',   caption: 'On the bar',         sub: 'From Yelp' },
  { type: 'art',   art: ['#fdf6e6', '#9dbd6f', '#3f6b2c'],           tag: 'matcha', caption: 'Matcha Einspanner',   sub: '$7.50' },
  { type: 'art',   art: ['#5c3418', '#26120a'], iced: true,          tag: 'cold',   caption: 'Cold Brew',           sub: '$5.75' },
  { type: 'photo', src: PHOTOS.shopTwo,   tag: 'shop',   caption: 'Made to order',      sub: 'Caffe In Coffee Co' },
  { type: 'art',   art: ['#f6cfc8', '#e8dcc0', '#6f9b45'],           tag: 'matcha', caption: 'Strawberry Matcha Latte', sub: '$7.00' },
  { type: 'art',   art: ['#f2ddb8', '#b9773a', '#7d4a1e'],           tag: 'coffee', caption: 'Biscoff Latte',       sub: '$6.75' },
  { type: 'photo', src: PHOTOS.yelpTwo,   tag: 'shop',   caption: 'Caffe In Coffee Co', sub: 'From Yelp' },
  { type: 'art',   art: ['#fdf6e6', '#b294d6', '#6d4a9c'],           tag: 'more',   caption: 'Ube Einspanner',      sub: '$7.00' },
  { type: 'art',   art: ['#eed7ac', '#a76c32', '#6b4118'],           tag: 'coffee', caption: 'Brown Sugar Oat Latte', sub: '$7.00' },
  { type: 'photo', src: PHOTOS.shopThree, tag: 'shop',   caption: '5642 E La Palma Ave', sub: 'Suite 112' },
  { type: 'art',   art: ['#e4c294', '#7d4a20', '#33190b'], iced: true, tag: 'cold', caption: 'Maple Cold Brew Latte', sub: '$6.25' },
  { type: 'art',   art: ['#f0ddbe', '#a9703c', '#5e3a1c'],           tag: 'more',   caption: 'Hojicha',             sub: '$6.50' },
  { type: 'art',   art: ['#f8ecc4', '#dcc07a', '#a8763c'],           tag: 'coffee', caption: 'Banana Cream Latte',  sub: '$7.00' }
];

const GALLERY_FILTERS = [
  { id: 'all',    label: 'All' },
  { id: 'shop',   label: 'The Shop' },
  { id: 'coffee', label: 'Coffee' },
  { id: 'matcha', label: 'Matcha' },
  { id: 'cold',   label: 'Cold' },
  { id: 'more',   label: 'Tea & More' }
];

/* -----------------------------------------------------------------------------
   REVIEWS — quoted verbatim from the shop's Yelp page. Names and locations are
   as Yelp displays them publicly.

   Do not edit the `text` of a review: it is someone else's words. To remove one,
   delete the whole entry. `body` is an array so paragraphs stay intact.
-------------------------------------------------------------------------------*/
const REVIEWS = [
  {
    name: 'Melanie K.',
    place: 'Buena Park, CA',
    date: 'Jul 10, 2026',
    stars: 5,
    badges: ['Elite 26'],
    body: [
      "I absolutely love supporting small, family-owned coffee shops, and this place is such a hidden gem. The owners are a young, Korean-American couple who really put their heart and soul into their craft! They make their cream for their cream-top IN HOUSE AND ITS MIND-BLOWING DELICIOUS YO",
      "Anyway, everything here from the matcha to the coffee is consistently delicious, and you can tell everything is made with precision! These people genuinely care about their customers and make everyone feel like family.",
      "It's refreshing to find a place that values quality, community, and hospitality all at once. If you're looking for a cozy spot to enjoy a great cup of coffee while supporting a local business, I can't recommend this café enough. I'll definitely keep coming back!"
    ]
  },
  {
    name: 'Grace N.',
    place: 'Long Beach, CA',
    date: 'Aug 9, 2026',
    stars: 5,
    badges: ['Elite 26', 'All-Star'],
    body: [
      "Another check off my list of running into random but great great matcha spot!",
      "This is another one to add to one of my best matcha lists. Their matcha is strong and of high quality though I did not get a chance to ask for the brand. I got a double matcha (waited for freshly made matcha cream top), matcha mango, ad a biscotti latte with the cream top, so yummy.",
      "The inside is pretty small, and in such hot summer weather, I don't think you can sit outside unless there are some room to sit inside. There isn't any space to sit or work or study either. Def just a spot to grab really good matcha and good coffee! Highly recommend!"
    ]
  },
  {
    name: 'CassidyJo F.',
    place: 'Fullerton, CA',
    date: 'Aug 26, 2026',
    stars: 5,
    badges: [],
    body: [
      "Isabella and Ethan were so friendly and the coffee was exceptional! I will be coming back again and again :)"
    ]
  },
  {
    name: 'William P.',
    place: 'Kent, WA',
    date: 'Aug 18, 2026',
    stars: 5,
    badges: [],
    body: [
      "I came here once and all of a sudden I find myself here all the time now. Brooke especially makes my drinks taste so good and the customer service here is sublime."
    ]
  }
];
