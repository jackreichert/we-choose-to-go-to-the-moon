/* ============================================================
   VIDEO MODAL — opens YouTube in a cinematic fullscreen lightbox
   Keeps YouTube JS off the page until the visitor opts in.
   ============================================================ */

(function () {
  var lastTrigger = null;

  function openModal(ytid) {
    var modal    = document.getElementById('video-modal');
    var frame    = modal.querySelector('.video-modal__frame');
    var closeBtn = modal.querySelector('.video-modal__close');

    var iframe = document.createElement('iframe');
    iframe.className       = 'video-modal__iframe';
    iframe.src             = 'https://www.youtube-nocookie.com/embed/' + ytid + '?autoplay=1&rel=0';
    iframe.title           = 'JFK We Choose to Go to the Moon speech — Rice University, September 12, 1962';
    iframe.allow           = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    frame.appendChild(iframe);

    document.body.style.overflow = 'hidden';
    modal.classList.add('is-open');
    closeBtn.focus();
  }

  function closeModal() {
    var modal   = document.getElementById('video-modal');
    var frame   = modal.querySelector('.video-modal__frame');
    var trigger = lastTrigger;

    modal.classList.remove('is-open');

    // Remove iframe after fade-out so audio stops cleanly
    modal.addEventListener('transitionend', function handler(e) {
      if (e.propertyName !== 'opacity') return;
      frame.innerHTML = '';
      modal.removeEventListener('transitionend', handler);
    });

    document.body.style.overflow = '';
    lastTrigger = null;

    if (trigger) trigger.focus();
  }

  document.addEventListener('DOMContentLoaded', function () {
    var modal    = document.getElementById('video-modal');
    var backdrop = modal && modal.querySelector('.video-modal__backdrop');
    var closeBtn = modal && modal.querySelector('.video-modal__close');

    document.querySelectorAll('.video__facade').forEach(function (facade) {
      facade.addEventListener('click', function () {
        lastTrigger = facade;
        openModal(facade.getAttribute('data-ytid'));
      });
      facade.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          lastTrigger = facade;
          openModal(facade.getAttribute('data-ytid'));
        }
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', function (e) {
      if (!modal || !modal.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeModal();
    });
  });
}());
