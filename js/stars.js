/* Starfield — twinkling stars layered above the hero photo overlay
   but below the quote text. Canvas is injected into .hero so it is
   clipped to that section and never obscures page content.
   Respects prefers-reduced-motion (static dots if reduced motion). */
(function () {
  'use strict';

  var hero = document.querySelector('.hero');
  if (!hero) return;

  var STAR_COUNT = 260;
  var reduced    = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var canvas = document.createElement('canvas');
  var ctx    = canvas.getContext('2d');

  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = [
    'position:absolute',
    'inset:0',
    'pointer-events:none',
    'z-index:1',
    'opacity:0.55'
  ].join(';');

  /* Insert after the overlay element so stars sit above the dark overlay */
  var overlay = hero.querySelector('.hero__overlay');
  if (overlay && overlay.nextSibling) {
    hero.insertBefore(canvas, overlay.nextSibling);
  } else {
    hero.insertBefore(canvas, hero.firstChild);
  }

  var stars = [];

  function buildStars() {
    canvas.width  = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
    stars = [];
    for (var i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x:     Math.random() * canvas.width,
        y:     Math.random() * canvas.height * 0.85, /* concentrate in upper sky */
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
      ctx.fillStyle = 'rgba(232, 224, 208, ' + s.base + ')';
      ctx.fill();
    });
  }

  var frame = 0;
  var raf;

  function drawAnimated() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frame += 1;
    stars.forEach(function (s) {
      var t       = Math.sin(frame * s.speed + s.phase);
      var opacity = s.base * (0.4 + 0.6 * t * t); /* square for sharper twinkle */
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(232, 224, 208, ' + opacity + ')';
      ctx.fill();
    });
    raf = requestAnimationFrame(drawAnimated);
  }

  buildStars();

  if (reduced) {
    drawStatic();
  } else {
    drawAnimated();
  }

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (raf) cancelAnimationFrame(raf);
      buildStars();
      if (reduced) { drawStatic(); } else { drawAnimated(); }
    }, 150);
  }, { passive: true });
}());
