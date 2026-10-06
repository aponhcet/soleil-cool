(function(){
  if (document.getElementById("s-pile") || window.__PILE_BOOT__) return;
  window.__PILE_BOOT__ = 1;
  var link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "pile.css";
  document.head.appendChild(link);
  function load(src){
    return new Promise(function(res, rej){
      var s = document.createElement("script");
      s.src = src;
      s.onload = res;
      s.onerror = rej;
      document.body.appendChild(s);
    });
  }
  fetch("pile-fragment.html").then(function(r){ return r.text(); }).then(function(html){
    var anchor = document.querySelector("[data-cmp=world], [data-cmp=\"world\"]");
    var sec = anchor && anchor.closest("section");
    if (!sec) { console.error("[pile] anchor missing"); return; }
    sec.insertAdjacentHTML("beforebegin", html);
    return load("pile.js").then(function(){ return load("pile-lang.js"); });
  }).catch(function(e){ console.error("[pile]", e); });
})();
