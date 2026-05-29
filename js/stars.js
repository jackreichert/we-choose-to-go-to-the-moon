/* Starfield — full-page twinkling stars fixed behind all content.
   Canvas is appended to document.body with position:fixed so it
   covers the entire viewport at all scroll depths.
   Respects prefers-reduced-motion (static dots if reduced motion). */
(function () {
  'use strict';

  var STAR_COUNT = 320;
  var reduced    = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var canvas = document.createElement('canvas');
  var ctx    = canvas.getContext('2d');

  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = [
    'position:fixed',
    'inset:0',
    'pointer-events:none',
    'z-index:0',
    'opacity:0.55'
  ].join(';');

  document.body.appendChild(canvas);

  var stars = [];

  function buildStars() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = [];
    for (var i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x:     Math.random() * canvas.width,
        y:     Math.random() * canvas.height,
        r:     Math.random() * 0.9 + 0.1,
        base:  Math.random() * 0.55 + 0.08,
        speed: Math.random() * 0.007 + 0.002,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  function drawStatic() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(function (s) {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(230, 236, 242, ' + s.base + ')';
      ctx.fill();
    });
  }

  var frame = 0;
  var raf;

  function drawAnimated() {
    if (document.hidden) {
      raf = null;
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frame += 1;
    stars.forEach(function (s) {
      var t       = Math.sin(frame * s.speed + s.phase);
      var opacity = s.base * (0.4 + 0.6 * t * t); /* square for sharper twinkle */
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(230, 236, 242, ' + opacity + ')';
      ctx.fill();
    });
    raf = requestAnimationFrame(drawAnimated);
  }

  buildStars();

  if (reduced) {
    drawStatic();
  } else {
    drawAnimated();

    /* Pause animation when tab is hidden, resume when visible */
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden && !raf) {
        drawAnimated();
      }
    });
  }

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (raf) cancelAnimationFrame(raf);
      raf = null;
      buildStars();
      if (reduced) { drawStatic(); } else { drawAnimated(); }
    }, 150);
  }, { passive: true });
}());
