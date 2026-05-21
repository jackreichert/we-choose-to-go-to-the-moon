/* Parallax — moon fade + earthrise image depth scroll.
   Moon fades as the hero scrolls past.
   Earthrise image translates vertically for a depth effect.
   Both skip entirely when prefers-reduced-motion is set. */
(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var moonWrap = document.getElementById('moonWrap');

  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var sy = window.pageYOffset;
      var vh = window.innerHeight;

      if (moonWrap) {
        var moonOpacity = Math.max(0, 1 - sy / (vh * 0.9));
        moonWrap.style.opacity    = String(moonOpacity);
        moonWrap.style.visibility = moonOpacity === 0 ? 'hidden' : 'visible';
      }



      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}());
