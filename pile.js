/* Pile de centrales — silencieux */
(function () {
  'use strict';
  if (!window.SOLEIL) { console.error('SOLEIL data.js missing'); return; }
  var S = window.SOLEIL, C = S.C, D = S.D;
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduced = RM.matches;
  if (RM.addEventListener) RM.addEventListener('change', function (e) { reduced = e.matches; });

  var lang = 'fr';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  if (!$('#pile-stack')) return;
  function T(fr, en) { return lang === 'en' ? en : fr; }
  function loc() { return lang === 'en' ? 'en-GB' : 'fr-BE'; }
  function fmt(n, dec) {
    dec = dec === undefined ? 0 : dec;
    return n.toLocaleString(loc(), { minimumFractionDigits: dec, maximumFractionDigits: dec });
  }

  var LAYERS = {
    nuc: { id: 'nuc', sec: D.secFor(D.NUCLEAR_J), ej: C.NUCLEAR_EJ, count: 12, pic: 'pic-nuke', fr: 'Nucléaire (chaleur)', en: 'Nuclear (heat)', tagFr: 'Couche nucléaire', tagEn: 'Nuclear layer' },
    coal: { id: 'coal', sec: D.secFor(D.COAL_J), ej: C.COAL_EJ, count: 48, pic: 'pic-coal', fr: 'Charbon', en: 'Coal', tagFr: 'Couche charbon', tagEn: 'Coal layer' },
    total: { id: 'total', sec: D.secFor(D.WORLD_J), ej: C.WORLD_EJ, count: 1, pic: 'pic-globe', fr: 'Toute l’énergie humaine', en: 'All human energy', tagFr: 'Le tout', tagEn: 'The lot' }
  };
  var ORDER = ['nuc', 'coal', 'total'];

  function fmtTime(sec, longForm) {
    var s = Math.round(sec * 10) / 10;
    if (s >= 60) {
      var mStr = fmt(s / 60, 1);
      return longForm ? T(mStr + ' minutes', mStr + ' minutes') : T(mStr + ' min', mStr + ' min');
    }
    var sStr = fmt(s, s >= 100 ? 0 : 1);
    return longForm ? T(sStr + ' secondes', sStr + ' seconds') : T(sStr + ' s', sStr + ' s');
  }
  function odoString(sec) {
    if (sec >= 60) return fmt(Math.round(sec / 60 * 10) / 10, 1);
    return fmt(Math.round(sec * 10) / 10, sec >= 100 ? 0 : 1);
  }
  function odoUnit(sec) {
    return sec >= 60 ? T('minutes de soleil sur Terre', 'minutes of sun on Earth') : T('secondes de soleil sur Terre', 'seconds of sun on Earth');
  }

  var DIG = '';
  for (var i = 0; i < 11; i++) DIG += '<span>' + (i % 10) + '</span>';
  function Odo(el, opt) {
    opt = opt || {};
    this.el = el; this.cells = []; this.v = 0; this.max = opt.max || 46;
    el.classList.add('odo');
    this.sr = document.createElement('span'); this.sr.className = 'sr'; el.appendChild(this.sr);
    this.box = document.createElement('span'); this.box.setAttribute('aria-hidden', 'true'); this.box.style.display = 'contents'; el.appendChild(this.box);
    this.n = 0;
  }
  Odo.prototype.render = function (str) {
    var ch = Array.from(str), self = this;
    while (this.cells.length < ch.length) { var c = { el: document.createElement('span'), t: null, d: -1 }; this.box.insertBefore(c.el, this.box.firstChild); this.cells.unshift(c); }
    while (this.cells.length > ch.length) this.cells.shift().el.remove();
    ch.forEach(function (x, i) {
      var c = self.cells[i];
      if (x >= '0' && x <= '9') {
        if (c.t !== 'd') { c.t = 'd'; c.el.className = 'd'; c.el.innerHTML = '<span class="s">' + DIG + '</span>'; c.s = c.el.firstChild; c.d = -1; }
        var n = +x;
        if (n !== c.d) {
          clearTimeout(c.w);
          if (c.d === 9 && n === 0 && !reduced) {
            c.s.style.transform = 'translateY(' + (-1000 / 11) + '%)';
            c.w = setTimeout(function () { c.s.style.transition = 'none'; c.s.style.transform = 'translateY(0)'; void c.s.offsetHeight; c.s.style.transition = ''; }, 470);
          } else c.s.style.transform = 'translateY(' + (-n * 100 / 11) + '%)';
          c.d = n;
        }
      } else if (c.t !== x) { c.t = x; c.el.className = 'sep' + (x.trim() === '' ? ' sp' : ''); c.el.textContent = x; c.s = null; c.d = -1; }
    });
    if (ch.length !== this.n) { this.n = ch.length; this.fit(); }
  };
  Odo.prototype.fit = function () {
    var p = this.el.parentElement; if (!p) return;
    var cw = p.clientWidth - 8; if (cw <= 0) return;
    var em = 0.5; this.cells.forEach(function (c) { em += c.t === 'd' ? 0.74 : 0.27; });
    var fs = Math.max(13, Math.min(this.max, cw / em, window.innerWidth < 640 ? 34 : 999));
    this.el.style.setProperty('--fs', fs.toFixed(1) + 'px');
  };
  Odo.prototype.label = function (t) { this.sr.textContent = t; };
  function roll(o, to, fmtFn, dur, from) {
    cancelAnimationFrame(o.raf);
    var a = from === undefined ? o.v : from, t0 = performance.now();
    dur = reduced ? 0 : (dur || 900);
    o.label(fmtFn(to));
    (function step(now) {
      var k = dur ? Math.min(1, (now - t0) / dur) : 1;
      var e = 1 - Math.pow(1 - k, 3);
      o.v = a + (to - a) * e;
      o.render(fmtFn(k === 1 ? to : o.v));
      if (k < 1) o.raf = requestAnimationFrame(step);
    })(t0);
  }

  var pileOdo = new Odo($('#pile-odo'), { max: 52 });
  var verdictOdos = {
    nuc: new Odo($('#verdict-odo-nuc'), { max: 36 }),
    coal: new Odo($('#verdict-odo-coal'), { max: 36 }),
    total: new Odo($('#verdict-odo-total'), { max: 36 })
  };

  function applyLang() { refreshCopy(); }
  window.addEventListener('soleil-lang', function (e) { lang = e.detail || 'fr'; refreshCopy(); });
  if (document.documentElement.lang === 'en') lang = 'en';

  function refreshCopy() {
    var L = LAYERS[activeLayer] || LAYERS.total;
    $('#pile-odo-unit').textContent = odoUnit(currentSec);
    $('#pile-layer-tag').textContent = lang === 'en' ? L.tagEn : L.tagFr;
    ORDER.forEach(function (id) {
      var sec = LAYERS[id].sec;
      $('#verdict-unit-' + id).textContent = odoUnit(sec);
      verdictOdos[id].render(odoString(sec));
      verdictOdos[id].label(fmtTime(sec, true));
    });
    $('#verdict-line').textContent = T(
      'En ' + fmtTime(LAYERS.total.sec, true) + ', le soleil sur Terre égale toute l’énergie humaine d’une année.',
      'In ' + fmtTime(LAYERS.total.sec, true) + ', the sun on Earth equals all of humanity’s energy for a year.'
    );
  }

  var stack = $('#pile-stack');
  var items = { nuc: [], coal: [], total: [] };
  var fallenCount = { nuc: 0, coal: 0, total: 0 };
  var layerDone = { nuc: false, coal: false, total: false };

  function makeItem(layerId, index) {
    var L = LAYERS[layerId];
    var el = document.createElement('div');
    el.className = 'pile-item layer-' + layerId;
    el.dataset.layer = layerId;
    el.dataset.i = String(index);
    el.style.setProperty('--spin', (((index * 37) % 17) - 8) + 'deg');
    el.style.setProperty('--land', (((index * 19) % 11) - 5) + 'deg');
    el.style.setProperty('--fall', (0.42 + (index % 5) * 0.06) + 's');
    el.style.marginLeft = (((index * 53) % 21) - 10) + 'px';
    el.innerHTML = '<svg viewBox="0 0 64 64"><use href="#' + L.pic + '"></use></svg>';
    return el;
  }

  ORDER.forEach(function (id) {
    var L = LAYERS[id];
    for (var i = 0; i < L.count; i++) {
      var el = makeItem(id, i);
      stack.appendChild(el);
      items[id].push(el);
    }
  });
  function fallOrder(id) { return items[id].slice(); }

  var activeLayer = 'nuc';
  var currentSec = 0;
  var dropTimers = [];
  function clearDrops() { dropTimers.forEach(clearTimeout); dropTimers = []; }

  function setOdoTo(sec, animate) {
    currentSec = sec;
    var strFn = function (v) { return odoString(Math.max(0, v)); };
    if (animate) roll(pileOdo, sec, strFn, reduced ? 0 : 700, pileOdo.v);
    else { pileOdo.v = sec; pileOdo.render(strFn(sec)); pileOdo.label(fmtTime(sec, true)); }
    $('#pile-odo-unit').textContent = odoUnit(sec);
  }
  function progressSec(layerId, fallen, total) {
    var target = LAYERS[layerId].sec;
    return total <= 0 ? target : target * (fallen / total);
  }
  function dropLayer(layerId, instant) {
    var order = fallOrder(layerId);
    var L = LAYERS[layerId];
    if (instant || reduced) {
      order.forEach(function (el) { el.classList.add('fallen'); });
      fallenCount[layerId] = L.count; layerDone[layerId] = true;
      setOdoTo(L.sec, false); updatePileHeight(); return;
    }
    clearDrops();
    var delay = 0;
    order.forEach(function (el, idx) {
      if (el.classList.contains('fallen')) { fallenCount[layerId] = Math.max(fallenCount[layerId], idx + 1); return; }
      var t = setTimeout(function () {
        el.classList.add('fallen');
        fallenCount[layerId] = idx + 1;
        setOdoTo(progressSec(layerId, fallenCount[layerId], L.count), true);
        updatePileHeight();
        if (idx === order.length - 1) layerDone[layerId] = true;
      }, delay);
      dropTimers.push(t);
      delay += 90 + (layerId === 'coal' ? 25 : 55);
    });
  }
  function ensurePreviousFallen(upToIndex) {
    for (var i = 0; i < upToIndex; i++) {
      var id = ORDER[i];
      if (!layerDone[id]) dropLayer(id, true);
    }
  }
  function activateLayer(layerId) {
    var idx = ORDER.indexOf(layerId);
    if (idx < 0) return;
    activeLayer = layerId;
    ensurePreviousFallen(idx);
    $('#pile-layer-tag').classList.add('on');
    $('#pile-layer-tag').textContent = lang === 'en' ? LAYERS[layerId].tagEn : LAYERS[layerId].tagFr;
    document.body.style.backgroundColor = ({ nuc: '#3a2117', coal: '#5a3424', total: '#1b2738' })[layerId] || '';
    dropLayer(layerId, reduced || layerDone[layerId]);
    if (layerDone[layerId]) setOdoTo(LAYERS[layerId].sec, true);
    updatePileHeight();
    $$('.verdict-row').forEach(function (r) {
      var on = r.dataset.layer === layerId;
      r.classList.toggle('on', on);
      r.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  var viewport = $('#pile-viewport');
  var scrollEl = $('#pile-scroll');
  var viewMode = 'bottom';
  function pileContentHeight() { return scrollEl.scrollHeight; }
  function updatePileHeight() {
    var vh = viewport.clientHeight, ch = pileContentHeight();
    $('#pile-nav').hidden = !(ch > vh + 8);
    applyView();
  }
  function applyView() {
    var maxShift = Math.max(0, pileContentHeight() - viewport.clientHeight);
    scrollEl.style.transform = viewMode === 'top' ? 'translateY(' + maxShift + 'px)' : 'translateY(0)';
  }
  $('#pile-top').addEventListener('click', function () { viewMode = 'top'; applyView(); });
  $('#pile-bottom').addEventListener('click', function () { viewMode = 'bottom'; applyView(); });

  var panels = $$('.pile-panel');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var layer = e.target.dataset.layer;
        if (layer) activateLayer(layer);
      });
    }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });
    var seen = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('seen'); seen.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    panels.forEach(function (p) { io.observe(p); seen.observe(p); });
    $$('.step').forEach(function (s) { seen.observe(s); });
  } else {
    panels.forEach(function (p) { p.classList.add('seen'); });
    ORDER.forEach(function (id) { dropLayer(id, true); });
  }

  var bgIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      if (e.target.dataset.bg) document.body.style.backgroundColor = e.target.dataset.bg;
      document.body.dataset.horizon = e.target.dataset.horizon || '0';
    });
  }, { rootMargin: '-45% 0px -45% 0px' });
  ['#s-pile-accroche', '#s-pile-verdict', '#s-accroche', '#s-verdict'].forEach(function (sel) {
    var el = $(sel); if (el) bgIO.observe(el);
  });

  $$('.verdict-row').forEach(function (row) {
    var id = row.dataset.layer;
    row.querySelector('.verdict-picto').innerHTML = '<svg viewBox="0 0 64 64"><use href="#' + LAYERS[id].pic + '"></use></svg>';
    row.addEventListener('click', function () {
      $$('.verdict-row').forEach(function (r) {
        var on = r === row;
        r.classList.toggle('on', on);
        r.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      var sec = LAYERS[id].sec;
      roll(verdictOdos[id], sec, function (v) { return odoString(v); }, 800, 0);
      setOdoTo(sec, true);
      activeLayer = id;
      $('#verdict-line').textContent = T(LAYERS[id].fr + ' = ' + fmtTime(sec, true) + ' de soleil sur Terre.', LAYERS[id].en + ' = ' + fmtTime(sec, true) + ' of sun on Earth.');
    });
  });

  window.addEventListener('resize', function () {
    pileOdo.fit();
    ORDER.forEach(function (id) { verdictOdos[id].fit(); });
    updatePileHeight();
  });

  if (reduced) {
    ORDER.forEach(function (id) { dropLayer(id, true); });
    activeLayer = 'total';
    setOdoTo(LAYERS.total.sec, false);
  } else setOdoTo(0, false);

  ORDER.forEach(function (id) {
    var sec = LAYERS[id].sec;
    verdictOdos[id].v = sec;
    verdictOdos[id].render(odoString(sec));
    verdictOdos[id].label(fmtTime(sec, true));
    $('#verdict-unit-' + id).textContent = odoUnit(sec);
  });

  applyLang();
  updatePileHeight();

  window.__PILE__ = {
    LAYERS: LAYERS,
    sec: { nuc: LAYERS.nuc.sec, coal: LAYERS.coal.sec, total: LAYERS.total.sec, nucElec: D.secFor(D.NUCLEAR_ELEC_J) },
    activateLayer: activateLayer,
    reduced: function () { return reduced; }
  };
  console.info('[pile] ratios s — nuc', LAYERS.nuc.sec.toFixed(1), 'coal', LAYERS.coal.sec.toFixed(1), 'total', LAYERS.total.sec.toFixed(1), 'nucElec', D.secFor(D.NUCLEAR_ELEC_J).toFixed(1));
})();
