(function () {
  'use strict';
  if (window.__SOLEIL_SRC__) return;
  window.__SOLEIL_SRC__ = 1;
  var lang = document.documentElement.lang === 'en' ? 'en' : 'fr';
  function T(fr, en) { return lang === 'en' ? en : fr; }
  function src(n, title) {
    var a = document.createElement('a');
    a.className = 'src';
    a.href = '#src-' + n;
    if (title) a.title = title;
    a.textContent = T('« source »', 'source');
    a.setAttribute('data-en', 'source');
    var p = document.createElement('p');
    p.className = 'src-line';
    p.appendChild(a);
    return p;
  }
  function after(el, node) {
    if (!el || el.dataset.srcAttached) return;
    el.dataset.srcAttached = '1';
    el.insertAdjacentElement('afterend', node);
  }
  function near(sel, n, title) {
    var el = document.querySelector(sel);
    if (!el) return;
    after(el, src(n, title));
  }
  var ol = document.querySelector('#sources ol');
  if (ol) {
    Array.prototype.forEach.call(ol.children, function (li, i) {
      if (!li.id) li.id = 'src-' + (i + 1);
    });
  }
  near('[data-sci="L"]', 1, 'IAU 2015 B3 · L☉');
  var firstBig = document.querySelector('section.step.right .card > .big');
  if (firstBig && /646/.test(firstBig.textContent)) after(firstBig, src(9, 'Energy Institute 2025'));
  near('#bomb-text', 7, 'LANL · NIST · Tsar Bomba');
  near('#fus-m', 5, 'OpenStax · IAU 2015 B3');
  near('#core-odo', 3, 'NASA NSSDC · IAU · NASA Science');
  near('.statrow', 3, 'NASA NSSDC · IAU 2015 B3');
  near('#vol-odo', 3, 'NASA NSSDC');
  near('#flap', 2, 'IAU 2012 B2 · c SI');
  near('[data-sci="PE"]', 1, 'IAU 2015 B3 · NASA NSSDC');
  near('#cmp-flap', 9, 'Energy Institute 2025');
  near('#harv-odo', 12, 'Fraunhofer · IPCC AR6 · Britannica');
  near('#sel-odo', 1, 'IAU · EI · LANL');
  near('#ts', 1, 'IAU · EI · LANL');
  function pileSrc() {
    near('#s-pile-accroche .pile-hook', 9, 'EI 2025 · IAU 2015 B3');
    near('#panel-nuc .big', 9, 'EI 2025 nuclear heat');
    near('#panel-coal .big', 9, 'EI 2025 coal');
    near('#panel-total .big', 9, 'EI 2025 world 592 EJ');
    near('#verdict-grid', 9, 'Energy Institute 2025');
  }
  pileSrc();
  window.addEventListener('soleil-lang', function (e) {
    lang = e.detail || 'fr';
    Array.prototype.forEach.call(document.querySelectorAll('a.src'), function (a) {
      a.textContent = T('« source »', 'source');
    });
  });
  var obs = new MutationObserver(function () { pileSrc(); });
  if (document.body) obs.observe(document.body, { childList: true, subtree: true });
  setTimeout(function () { obs.disconnect(); }, 8000);
})();
