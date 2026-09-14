/* =============================================================================
   CAFFE IN COFFEE CO — interactions
   Vanilla JS, no build step. Content lives in config.js.
   ========================================================================== */
(function () {
  'use strict';

  const $  = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  const money = n => '$' + n.toFixed(2);
  const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent(CAFE.name + ', ' + CAFE.address.line1 + ', ' + CAFE.address.line2);

  /* ---------------------------------------------------------------- toast */
  const toastEl = $('#toast');
  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-on'), 2400);
  }

  // iOS Safari ignores textarea.select() for copy purposes — it needs a real
  // Range selection plus setSelectionRange, and a font-size of at least 16px
  // on the scratch element or it zooms the page while selecting.
  function legacyCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.contentEditable = 'true';
    ta.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;font-size:16px';
    document.body.appendChild(ta);

    const range = document.createRange();
    range.selectNodeContents(ta);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    ta.setSelectionRange(0, text.length);

    let ok = false;
    try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
    sel.removeAllRanges();
    ta.remove();
    return ok;
  }

  async function copy(text, msg) {
    // The async API needs a secure context — absent over plain http.
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        toast(msg);
        return;
      } catch (err) { /* fall through */ }
    }
    toast(legacyCopy(text) ? msg : 'Could not copy — press and hold to select instead.');
  }

  /* ---------------------------------------------------------------- theme */
  const root = document.documentElement;
  const themeBtn = $('#themeToggle');

  function setTheme(theme, remember) {
    root.setAttribute('data-theme', theme);
    themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#191009' : '#f3e4bf');
    if (remember) { try { localStorage.setItem('caffein-theme', theme); } catch (e) { /* private mode */ } }
  }

  let savedTheme = null;
  try { savedTheme = localStorage.getItem('caffein-theme'); } catch (e) { /* private mode */ }
  setTheme(savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'), false);

  themeBtn.addEventListener('click', () => {
    setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true);
  });

  /* ------------------------------------------------------- hours & status */
  // Read "now" in the shop's own timezone so the pill is right for the shop,
  // not for wherever the visitor happens to be.
  const DAY_INDEX = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

  function cafeNow() {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: CAFE.timezone, weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false
    }).formatToParts(new Date());
    const get = t => (parts.find(p => p.type === t) || {}).value;
    const hour = parseInt(get('hour'), 10) % 24;   // some locales emit "24" at midnight
    return { day: DAY_INDEX[get('weekday')], minutes: hour * 60 + parseInt(get('minute'), 10) };
  }

  function fmtTime(mins) {
    const h24 = Math.floor(mins / 60), m = mins % 60;
    const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
    return h12 + ':' + String(m).padStart(2, '0') + ' ' + (h24 < 12 ? 'am' : 'pm');
  }

  function fmtRange(entry) {
    return entry.open == null ? 'Closed' : fmtTime(entry.open) + ' – ' + fmtTime(entry.close);
  }

  function getStatus() {
    const now = cafeNow();
    const today = CAFE.hours[now.day];

    if (today.open != null && now.minutes >= today.open && now.minutes < today.close) {
      const left = today.close - now.minutes;
      return left <= 30
        ? { state: 'soon', short: 'Closing at ' + fmtTime(today.close), long: 'Open now — last orders soon, we close at ' + fmtTime(today.close) + '.' }
        : { state: 'open', short: 'Open until ' + fmtTime(today.close), long: 'Open now until ' + fmtTime(today.close) + '.' };
    }

    // Closed: find the next opening, today or on one of the next seven days.
    if (today.open != null && now.minutes < today.open) {
      return { state: 'closed', short: 'Opens ' + fmtTime(today.open), long: 'Closed right now — we open today at ' + fmtTime(today.open) + '.' };
    }
    for (let i = 1; i <= 7; i++) {
      const next = CAFE.hours[(now.day + i) % 7];
      if (next.open != null) {
        const when = i === 1 ? 'tomorrow' : next.day;
        return { state: 'closed', short: 'Opens ' + (i === 1 ? 'tomorrow' : next.day.slice(0, 3)) + ' ' + fmtTime(next.open), long: 'Closed right now — we open ' + when + ' at ' + fmtTime(next.open) + '.' };
      }
    }
    return { state: 'closed', short: 'Closed', long: 'Closed right now.' };
  }

  function paintStatus() {
    const s = getStatus();
    $$('.status').forEach(pill => {
      pill.setAttribute('data-state', s.state);
      $('.status__text', pill).textContent = s.short;
    });
    const now = $('#hoursNow');
    if (now) now.textContent = s.long;
  }

  function buildHoursTable() {
    const todayIndex = cafeNow().day;
    // Show the week starting on Monday, the way the shop's own sign reads.
    const order = [1, 2, 3, 4, 5, 6, 0];
    $('#hoursTable tbody').innerHTML = order.map(i => {
      const h = CAFE.hours[i];
      return '<tr class="' + (i === todayIndex ? 'is-today' : '') + '">' +
             '<td>' + h.day + (i === todayIndex ? ' <span class="sr-only">(today)</span>' : '') + '</td>' +
             '<td>' + fmtRange(h) + '</td></tr>';
    }).join('');
  }

  buildHoursTable();
  paintStatus();
  setInterval(paintStatus, 60000);

  /* ------------------------------------------------------------------ nav */
  const nav = $('#nav');
  const progress = $('#navProgress');
  const navLinks = $$('.nav__links a');
  const sections = navLinks.map(a => $(a.getAttribute('href'))).filter(Boolean);

  function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle('is-stuck', y > 8);

    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? Math.min(100, (y / max) * 100) : 0) + '%';

    const line = y + nav.offsetHeight + 90;
    let current = null;
    sections.forEach(sec => { if (sec.offsetTop <= line) current = sec.id; });
    navLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + current));
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { onScroll(); ticking = false; });
  }, { passive: true });
  onScroll();

  const burger = $('#burger');
  const mobileNav = $('#mobileNav');
  function setMobileNav(open) {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    mobileNav.hidden = !open;
  }
  burger.addEventListener('click', () => setMobileNav(mobileNav.hidden));
  mobileNav.addEventListener('click', e => { if (e.target.closest('a')) setMobileNav(false); });
  window.addEventListener('resize', () => { if (window.innerWidth > 820) setMobileNav(false); });

  /* --------------------------------------------------------------- reveal */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        obs.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .06 });
    $$('.reveal').forEach(n => io.observe(n));
  } else {
    $$('.reveal').forEach(n => n.classList.add('is-in'));
  }

  /* ----------------------------------------------------------- hero photo */
  (function heroPhoto() {
    const fig = $('#heroPhoto');
    const img = $('img', fig);
    img.addEventListener('error', () => fig.classList.add('is-fallback'));
    img.src = PHOTOS.one;
  })();

  /* ------------------------------------------------------------ drawn cup */
  // A tiny CSS cup used on menu rows and gallery tiles, so the page still
  // looks finished if a photo does not load.
  function gradient(colors) {
    if (colors.length === 2) return 'linear-gradient(180deg,' + colors[0] + ',' + colors[1] + ')';
    return 'linear-gradient(180deg,' + colors.map((c, i) => c + ' ' + Math.round((i / (colors.length - 1)) * 100) + '%').join(',') + ')';
  }

  function miniCup(colors, iced) {
    return '<div class="mini' + (iced ? ' mini--iced' : '') + '">' +
             '<div class="mini__fill" style="background:' + gradient(colors) + '"></div>' +
             '<div class="mini__shine"></div>' +
           '</div>';
  }

  /* ----------------------------------------------------------------- menu */
  const menuGrid = $('#menuGrid');
  const menuEmpty = $('#menuEmpty');
  const menuState = { cat: 'all', temp: 'all', q: '' };

  $('#menuChips').innerHTML = MENU_CATEGORIES.map(c =>
    '<button class="chip" role="tab" type="button" data-cat="' + c.id + '" aria-selected="' + (c.id === 'all') + '">' + c.label + '</button>'
  ).join('');

  function priceFor(item, temp) {
    if (item.price.any != null) return { value: item.price.any, note: '' };
    if (temp !== 'all' && item.price[temp] != null) return { value: item.price[temp], note: temp };
    const keys = Object.keys(item.price);
    const low = Math.min.apply(null, keys.map(k => item.price[k]));
    return { value: low, note: keys.length > 1 ? 'from' : keys[0] };
  }

  function matches(item) {
    if (menuState.cat !== 'all' && item.cat !== menuState.cat) return false;
    if (menuState.temp !== 'all') {
      // Food has no temperature, so it only shows under "Both".
      if (!item.temps.includes(menuState.temp)) return false;
    }
    if (menuState.q) {
      const hay = (item.name + ' ' + item.desc).toLowerCase();
      if (!hay.includes(menuState.q)) return false;
    }
    return true;
  }

  function renderMenu() {
    const list = MENU.filter(matches);
    menuEmpty.hidden = list.length > 0;

    menuGrid.innerHTML = list.map((item, i) => {
      const p = priceFor(item, menuState.temp);
      const iced = menuState.temp === 'iced' || (menuState.temp === 'all' && item.temps.length === 1 && item.temps[0] === 'iced');
      const tags = item.temps.map(t => '<span class="item__tag" data-t="' + t + '">' + (t === 'hot' ? 'Hot' : 'Iced') + '</span>').join('');
      return '<article class="item" style="animation-delay:' + Math.min(i * 26, 380) + 'ms">' +
               '<div class="item__art">' + miniCup(item.art, iced) + '</div>' +
               '<div class="item__body">' +
                 '<div class="item__top">' +
                   '<h3 class="item__name">' + item.name + '</h3>' +
                   '<span class="item__dots"></span>' +
                   '<span class="item__price">' + money(p.value) + (p.note ? '<small>' + p.note + '</small>' : '') + '</span>' +
                 '</div>' +
                 '<p class="item__desc">' + item.desc + '</p>' +
                 (tags ? '<div class="item__tags">' + tags + '</div>' : '') +
               '</div>' +
             '</article>';
    }).join('');
  }

  $('#menuChips').addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    $$('#menuChips .chip').forEach(c => c.setAttribute('aria-selected', String(c === chip)));
    menuState.cat = chip.dataset.cat;
    renderMenu();
  });

  const tempToggle = $('#tempToggle');
  const tempPill = $('.segmented__pill', tempToggle);

  function movePill() {
    const active = $('button[aria-checked="true"]', tempToggle);
    if (!active) return;
    tempPill.style.width = active.offsetWidth + 'px';
    tempPill.style.transform = 'translateX(' + (active.offsetLeft - 4) + 'px)';
  }

  tempToggle.addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn) return;
    $$('button', tempToggle).forEach(b => b.setAttribute('aria-checked', String(b === btn)));
    menuState.temp = btn.dataset.temp;
    movePill();
    renderMenu();
  });

  $('#menuSearch').addEventListener('input', e => {
    menuState.q = e.target.value.trim().toLowerCase();
    renderMenu();
  });

  $('#menuReset').addEventListener('click', () => {
    menuState.cat = 'all'; menuState.temp = 'all'; menuState.q = '';
    $('#menuSearch').value = '';
    $$('#menuChips .chip').forEach(c => c.setAttribute('aria-selected', String(c.dataset.cat === 'all')));
    $$('button', tempToggle).forEach(b => b.setAttribute('aria-checked', String(b.dataset.temp === 'all')));
    movePill();
    renderMenu();
  });

  renderMenu();
  // Fonts change button widths, so place the pill once they have settled.
  movePill();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(movePill);
  window.addEventListener('resize', movePill);

  /* -------------------------------------------------------------- gallery */
  const galleryGrid = $('#galleryGrid');
  let galleryView = GALLERY.slice();

  $('#galleryChips').innerHTML = GALLERY_FILTERS.map(f =>
    '<button class="chip" role="tab" type="button" data-tag="' + f.id + '" aria-selected="' + (f.id === 'all') + '">' + f.label + '</button>'
  ).join('');

  function renderGallery(tag) {
    galleryView = tag === 'all' ? GALLERY.slice() : GALLERY.filter(g => g.tag === tag);

    galleryGrid.innerHTML = galleryView.map((g, i) => {
      // A loose editorial rhythm: every fourth tile runs wide, every seventh tall.
      const shape = i % 7 === 0 ? ' tile--tall' : (i % 4 === 1 ? ' tile--wide' : '');
      const inner = g.type === 'photo'
        ? '<img src="' + g.src + '" alt="' + g.caption + '" loading="lazy" decoding="async">'
        : '<div class="tile__art">' + miniCup(g.art, g.iced) + '</div>';
      return '<button class="tile' + shape + '" type="button" data-i="' + i + '" style="animation-delay:' + Math.min(i * 45, 400) + 'ms">' +
               inner +
               '<span class="tile__zoom"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5M11 8.5v5M8.5 11h5"/></svg></span>' +
               '<span class="tile__cap"><strong>' + g.caption + '</strong><span>' + g.sub + '</span></span>' +
             '</button>';
    }).join('');

    // If a photo 404s, swap that tile over to the drawn illustration.
    $$('img', galleryGrid).forEach(img => {
      img.addEventListener('error', () => {
        const tile = img.closest('.tile');
        img.remove();
        tile.insertAdjacentHTML('afterbegin', '<div class="tile__art">' + miniCup(['#efdcc0', '#b07f4c']) + '</div>');
        const item = galleryView[Number(tile.dataset.i)];
        if (item) { item.type = 'art'; item.art = ['#efdcc0', '#b07f4c']; }
      });
    });
  }

  $('#galleryChips').addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    $$('#galleryChips .chip').forEach(c => c.setAttribute('aria-selected', String(c === chip)));
    renderGallery(chip.dataset.tag);
  });

  renderGallery('all');

  /* ------------------------------------------------------------- lightbox */
  const lb = $('#lightbox');
  const lbStage = $('#lbStage');
  const lbCount = $('#lbCount');
  let lbIndex = 0;
  let lastFocus = null;
  let lockedY = 0;

  // overflow:hidden on <body> does not hold on iOS — the page still rubber-bands
  // behind the overlay. Pinning the body and restoring the offset does.
  function lockScroll() {
    lockedY = window.scrollY || window.pageYOffset || 0;
    document.body.style.position = 'fixed';
    document.body.style.top = -lockedY + 'px';
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
  }

  function unlockScroll() {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    // html sets scroll-behavior: smooth, which would animate the restore and
    // read as the page sliding away on its own.
    const html = document.documentElement;
    const prev = html.style.scrollBehavior;
    html.style.scrollBehavior = 'auto';
    window.scrollTo(0, lockedY);
    html.style.scrollBehavior = prev;
  }

  function paintLightbox() {
    const g = galleryView[lbIndex];
    if (!g) return;
    const media = g.type === 'photo'
      ? '<img src="' + g.src + '" alt="' + g.caption + '">'
      : '<div class="lb-art">' + miniCup(g.art, g.iced) + '</div>';
    lbStage.innerHTML = media + '<figcaption><strong>' + g.caption + '</strong><span>' + g.sub + '</span></figcaption>';
    lbCount.textContent = (lbIndex + 1) + ' / ' + galleryView.length;
    const multiple = galleryView.length > 1;
    $('#lbPrev').hidden = !multiple;
    $('#lbNext').hidden = !multiple;
  }

  function openLightbox(i) {
    lbIndex = i;
    lastFocus = document.activeElement;
    lb.hidden = false;
    lockScroll();
    paintLightbox();
    $('#lbClose').focus();
  }

  function closeLightbox() {
    lb.hidden = true;
    unlockScroll();
    // preventScroll, or focusing the tile nudges the page to bring it fully
    // into view and the restored position drifts.
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }

  function step(delta) {
    lbIndex = (lbIndex + delta + galleryView.length) % galleryView.length;
    paintLightbox();
  }

  galleryGrid.addEventListener('click', e => {
    const tile = e.target.closest('.tile');
    if (tile) openLightbox(Number(tile.dataset.i));
  });

  $('#lbClose').addEventListener('click', closeLightbox);
  $('#lbPrev').addEventListener('click', () => step(-1));
  $('#lbNext').addEventListener('click', () => step(1));
  lb.addEventListener('click', e => { if (e.target === lb || e.target === lbStage) closeLightbox(); });

  document.addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'ArrowRight') step(1);
    else if (e.key === 'Tab') { e.preventDefault(); $('#lbClose').focus(); }
  });

  /* -------------------------------------------------------------- builder */
  const order = {
    base: BUILDER.bases[0],
    temp: 'hot',
    size: BUILDER.sizes[1],
    milk: BUILDER.milks[0],
    syrups: [],
    shot: false
  };

  function radios(container, list, name, render) {
    // the <input> is visually hidden; the styled <span> beside it is the control
    $(container).innerHTML = list.map(o =>
      '<label class="opt"><input type="radio" name="' + name + '" value="' + o.id + '">' +
      '<span>' + render(o) + '</span></label>'
    ).join('');
  }

  radios('#bBases', BUILDER.bases, 'base', o => o.name + '<em>' + money(o.base) + '</em>');
  radios('#bSizes', BUILDER.sizes, 'size', o => o.name + '<em>' + o.oz + '</em>');
  radios('#bMilks', BUILDER.milks, 'milk', o => o.name + (o.add ? '<em>+' + money(o.add) + '</em>' : ''));

  $('#bTemps').innerHTML =
    '<label class="opt"><input type="radio" name="temp" value="hot"><span>Hot</span></label>' +
    '<label class="opt"><input type="radio" name="temp" value="iced"><span>Iced</span></label>';

  $('#bSyrups').innerHTML = BUILDER.syrups.map(s =>
    '<label class="opt"><input type="checkbox" name="syrup" value="' + s.id + '">' +
    '<span>' + s.name + '<em>+' + money(s.add) + '</em></span></label>'
  ).join('');

  $('#bExtras').innerHTML =
    '<label class="opt"><input type="checkbox" id="bShot"><span>Extra shot<em>+' + money(BUILDER.extraShot) + '</em></span></label>';

  // Set the opening selection.
  $('#bBases input[value="' + order.base.id + '"]').checked = true;
  $('#bTemps input[value="hot"]').checked = true;
  $('#bSizes input[value="' + order.size.id + '"]').checked = true;
  $('#bMilks input[value="' + order.milk.id + '"]').checked = true;

  function orderName() {
    const bits = [];
    if (order.temp === 'iced') bits.push('Iced');
    bits.push(order.size.name);
    if (order.milk.id !== 'whole') bits.push(order.milk.name);
    if (order.syrups.length === 1) bits.push(order.syrups[0].name);
    else if (order.syrups.length > 1) bits.push(order.syrups.length + '-syrup');
    bits.push(order.base.name);
    return bits.join(' ');
  }

  function orderLines() {
    const lines = [{ label: order.base.name, cost: order.base.base, base: true }];
    lines.push({ label: order.size.name + ' (' + order.size.oz + ')', cost: order.size.add });
    lines.push({ label: order.milk.name + ' milk', cost: order.milk.add });
    order.syrups.forEach(s => lines.push({ label: s.name + ' syrup', cost: s.add }));
    if (order.shot) lines.push({ label: 'Extra shot', cost: BUILDER.extraShot });
    return lines;
  }

  function paintOrder() {
    // Cold brew is never poured hot, so lock the hot option when it is picked.
    const hotInput = $('#bTemps input[value="hot"]');
    if (order.base.icedOnly) {
      hotInput.disabled = true;
      if (order.temp === 'hot') {
        order.temp = 'iced';
        $('#bTemps input[value="iced"]').checked = true;
      }
    } else {
      hotInput.disabled = false;
    }

    const lines = orderLines();
    const total = lines.reduce((sum, l) => sum + l.cost, 0);

    $('#bName').textContent = orderName();
    $('#bLines').innerHTML = lines.map(l =>
      '<li><span>' + l.label + '</span><span>' + (l.base ? money(l.cost) : (l.cost ? '+' + money(l.cost) : '—')) + '</span></li>'
    ).join('');
    $('#bTotal').textContent = money(total);

    const cup = $('#bCup');
    const liquid = $('.cup__liquid', cup);
    liquid.style.background = gradient(order.base.art);
    $('.cup__ice', cup).hidden = order.temp !== 'iced';
    $('.cup__straw', cup).hidden = order.temp !== 'iced';
    $('#bSteam').hidden = order.temp !== 'hot';

    return total;
  }

  $('.builder__form').addEventListener('change', e => {
    const t = e.target;
    if (t.name === 'base')  order.base = BUILDER.bases.find(b => b.id === t.value);
    if (t.name === 'temp')  order.temp = t.value;
    if (t.name === 'size')  order.size = BUILDER.sizes.find(s => s.id === t.value);
    if (t.name === 'milk')  order.milk = BUILDER.milks.find(m => m.id === t.value);
    if (t.name === 'syrup') {
      order.syrups = $$('#bSyrups input:checked').map(i => BUILDER.syrups.find(s => s.id === i.value));
    }
    if (t.id === 'bShot') order.shot = t.checked;
    paintOrder();
  });

  $('#bCopy').addEventListener('click', () => {
    const lines = orderLines();
    const total = lines.reduce((sum, l) => sum + l.cost, 0);
    const text = [
      orderName(),
      lines.map(l => '· ' + l.label).join('\n'),
      'Total ' + money(total) + ' (sample pricing)',
      CAFE.fullName + ' — ' + CAFE.address.line1
    ].join('\n');
    copy(text, 'Order copied to your clipboard');
  });

  paintOrder();

  /* ---------------------------------------------------------------- visit */
  ['#directionsBtn', '#mapLink'].forEach(sel => { $(sel).href = MAPS_URL; });
  ['#heroDirections', '#mobileDirections'].forEach(sel => {
    const el = $(sel);
    if (el) el.setAttribute('href', '#visit');
  });

  $('#copyAddress').addEventListener('click', () => {
    copy(CAFE.address.line1 + ', ' + CAFE.address.line2, 'Address copied');
  });

  // Phone / email / Instagram only appear once they are filled in in config.js.
  const contact = [];
  if (CAFE.phone) {
    contact.push('<a href="tel:' + CAFE.phone.replace(/[^\d+]/g, '') + '">' +
      '<svg viewBox="0 0 24 24"><path d="M5 4h3l2 5-2.2 1.3a12 12 0 0 0 5.9 5.9L15 14l5 2v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 3 6.2 2 2 0 0 1 5 4z"/></svg>' +
      CAFE.phone + '</a>');
  }
  if (CAFE.email) {
    contact.push('<a href="mailto:' + CAFE.email + '">' +
      '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 7l8.5 6 8.5-6"/></svg>' +
      CAFE.email + '</a>');
  }
  if (CAFE.instagram) {
    const handle = CAFE.instagram.replace(/^@/, '');
    contact.push('<a href="https://instagram.com/' + handle + '" target="_blank" rel="noopener">' +
      '<svg viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="3.8"/><circle cx="17" cy="7" r="1.1" fill="currentColor" stroke="none"/></svg>' +
      '@' + handle + '</a>');
  }
  $('#contactLinks').innerHTML = contact.join('');

  $('#year').textContent = new Date().getFullYear();
})();
