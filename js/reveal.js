/* Scroll reveal — adds .is-revealed to targets as they enter the viewport.
   Guards .js-reveal on <html> so CSS initial states are only set when JS
   is running (no hidden-forever elements if JS fails to load). */
(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  document.documentElement.classList.add('js-reveal');

  var TARGETS = [
    '.stats__item',
    '.missions__entry',
    '.missions__decade',
    '.missions__header',
    '.future__entry',
    '.future__header',
    '.pull-quote',
    '.speech__header'
  ].join(', ');

  var elements = document.querySelectorAll(TARGETS);

  var observer = new IntersectionObserver(
    function (entries) {
      var visible = [];
      entries.forEach(function (e) {
        if (e.isIntersecting) visible.push(e.target);
      });

      visible.forEach(function (el, i) {
        var delay = Math.min(i * 55, 220);
        setTimeout(function () {
          el.classList.add('is-revealed');
          el.style.transitionDelay = '';
        }, delay);
        observer.unobserve(el);
      });
    },
    { threshold: 0.06, rootMargin: '0px 0px -28px 0px' }
  );

  elements.forEach(function (el) { observer.observe(el); });

  /* Quote phrase observer — staggered phrase-by-phrase reveal */
  var phraseObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        var label = e.target.querySelector('.section-label');
        var attr  = e.target.querySelector('.quote-attr');
        if (label) {
          setTimeout(function () { label.classList.add('visible'); }, 0);
        }
        e.target.querySelectorAll('.phrase').forEach(function (ph, i) {
          setTimeout(function () { ph.classList.add('visible'); }, i * 140);
        });
        if (attr) {
          setTimeout(function () { attr.classList.add('visible'); }, 8 * 140 + 200);
        }
        phraseObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.quote-section').forEach(function (el) {
    phraseObs.observe(el);
  });
}());
