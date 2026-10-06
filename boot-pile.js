(function(){
  if (window.__PILE_BOOT__) return;
  window.__PILE_BOOT__ = 1;
  function loadCss(href){
    if (document.querySelector('link[href="'+href+'"]')) return;
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }
  function load(src){
    return new Promise(function(res, rej){
      var s = document.createElement("script");
      s.src = src;
      s.onload = res;
      s.onerror = rej;
      document.body.appendChild(s);
    });
  }
  loadCss("pile.css");
  function bootPile(){
    if (document.getElementById("s-pile")) {
      return load("pile.js").then(function(){ return load("sources-ui.js"); });
    }
    return fetch("pile-fragment.html").then(function(r){ return r.text(); }).then(function(html){
      var anchor = document.querySelector("[data-cmp=world], [data-cmp=\"world\"]");
      var sec = anchor && anchor.closest("section");
      if (!sec) { console.error("[pile] anchor missing"); return load("sources-ui.js"); }
      sec.insertAdjacentHTML("beforebegin", html);
      return load("pile.js").then(function(){ return load("sources-ui.js"); });
    }).catch(function(e){ console.error("[pile]", e); return load("sources-ui.js"); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bootPile);
  else bootPile();
})();
